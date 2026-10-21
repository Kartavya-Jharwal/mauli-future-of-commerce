(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const f = (v) => v.toFixed(1);
  const $ = (s, root) => (root || document).querySelector(s);
  const $$ = (s, root) => [...(root || document).querySelectorAll(s)];

  /* ------------------------------------------- In-page anchors + smooth scroll */
  function initSmoothScroll() {
    const root = document.documentElement;
    let snapTimer = 0;

    let snapScrollListener = null;

    const releaseSnapLock = () => {
      clearTimeout(snapTimer);
      // Keep snap disabled until native smooth scroll has mostly settled.
      snapTimer = window.setTimeout(() => {
        if (snapScrollListener) {
          window.removeEventListener('scroll', snapScrollListener);
          snapScrollListener = null;
        }
        root.classList.remove('is-smooth-scrolling');
      }, 520);
    };

    const scrollToTarget = (el, { updateHash } = {}) => {
      if (!el) return;
      const behavior = reduceMotion ? 'auto' : 'smooth';
      if (!reduceMotion) {
        root.classList.add('is-smooth-scrolling');
        if (!snapScrollListener) {
          snapScrollListener = () => releaseSnapLock();
          window.addEventListener('scroll', snapScrollListener, { passive: true });
        }
        releaseSnapLock();
      }
      el.scrollIntoView({ behavior, block: 'start' });
      if (updateHash) {
        const id = el.id;
        if (id) history.pushState(null, '', `#${id}`);
      }
    };

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || link.target === '_blank') return;
      const raw = link.getAttribute('href');
      if (!raw || raw === '#') return;
      let target;
      try {
        target = document.querySelector(raw);
      } catch (err) {
        return;
      }
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target, { updateHash: true });
    });

    const hashTarget = () => {
      const raw = window.location.hash;
      if (!raw || raw === '#') return;
      let target;
      try {
        target = document.querySelector(raw);
      } catch (err) {
        return;
      }
      if (target) scrollToTarget(target, { updateHash: false });
    };

    window.addEventListener('hashchange', hashTarget);
    if (document.readyState === 'complete') hashTarget();
    else window.addEventListener('load', hashTarget, { once: true });
  }

  /* ---------------------------------------------------------------- Modals */
  function dialogBackdropClose(dialog) {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const b = dialog.getBoundingClientRect();
      if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close();
    });
  }

  $$('[data-modal]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.getAttribute('data-modal'));
    if (!dialog || typeof dialog.showModal !== 'function') return;
    trigger.addEventListener('click', () => {
      dialog.showModal();
      const closeBtn = $('.modal-close', dialog);
      if (closeBtn) closeBtn.focus();
    });
    dialogBackdropClose(dialog);
  });

  /* ---------------------------------------------- Video lightbox (lazy src) */
  (function initVideoLightbox() {
    const dialog = $('#video-modal');
    const video = $('#video-player');
    const loading = $('#video-loading');
    const title = $('#video-title');
    if (!dialog || !video || typeof dialog.showModal !== 'function') return;

    function unload() {
      video.pause();
      video.removeAttribute('src');
      video.load();
      loading.classList.remove('is-hidden');
    }

    $$('.clip[data-video]').forEach((btn) => {
      btn.addEventListener('click', () => {
        title.textContent = btn.getAttribute('data-title') || '';
        loading.classList.remove('is-hidden');
        dialog.showModal();
        video.src = btn.getAttribute('data-video');
        video.load();
        const play = video.play();
        if (play && play.catch) play.catch(() => {});
      });
    });
    video.addEventListener('canplay', () => loading.classList.add('is-hidden'));
    video.addEventListener('error', () => {
      loading.innerHTML = '<span>Clip not available yet</span>';
    });
    $('[data-close-video]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', unload);
    dialogBackdropClose(dialog);
  })();

  /* --------------------- Sticky horizontal deck + custom scrollbar + lazy IO */
  function bootDeckCarousel() {
    const parent = $('.sticky-parent');
    const sticky = $('.deck-sticky') || $('.sticky');
    const track = $('#deck-track') || $('.horizontal');
    if (!parent || !sticky || !track) return;

    const slides = $$('.deck-slide', track);
    const currentOutput = $('#slide-current');
    const previous = $('[data-slide-prev]');
    const next = $('[data-slide-next]');
    const scrollbar = $('.deck-scrollbar');
    const thumb = $('.deck-scrollbar-thumb');
    if (!slides.length) return;

    let active = 0;
    let maxScroll = 1;
    let parentTravel = 1;
    let frame = 0;
    let dragging = false;

    const load = (slide) => {
      if (!slide) return;
      const image = $('img[data-src]', slide);
      if (!image) return;
      const src = image.dataset.src;
      image.removeAttribute('data-src');
      image.src = src;
    };

    const preloadAround = (index) => {
      for (let i = index - 1; i <= index + 2; i += 1) load(slides[i]);
    };

    if ('IntersectionObserver' in window) {
      const loader = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          load(entry.target);
          loader.unobserve(entry.target);
        });
      }, { root: null, rootMargin: '40% 60%', threshold: 0.01 });
      slides.forEach((slide) => loader.observe(slide));
    } else {
      slides.forEach(load);
    }

    // One vertical snap point per slide, so each scroll gesture lands on the next frame.
    const snaps = slides.map(() => {
      const marker = document.createElement('span');
      marker.className = 'deck-snap';
      marker.setAttribute('aria-hidden', 'true');
      parent.appendChild(marker);
      return marker;
    });

    // Horizontal offset that centres a slide in the sticky frame.
    const slideX = (slide) => clamp(slide.offsetLeft + slide.offsetWidth / 2 - sticky.clientWidth / 2, 0, maxScroll);

    const measure = () => {
      const stickyH = sticky.clientHeight || window.innerHeight;
      maxScroll = Math.max(track.scrollWidth - sticky.clientWidth, 1);
      // Enough vertical travel to map 1:1 onto the horizontal distance.
      parentTravel = maxScroll;
      parent.style.height = `${Math.round(stickyH + parentTravel)}px`;
      parentTravel = Math.max(parent.getBoundingClientRect().height - stickyH, 1);
      slides.forEach((slide, i) => {
        snaps[i].style.top = `${Math.round((slideX(slide) / maxScroll) * parentTravel)}px`;
      });
    };

    const progress = () => {
      const top = parent.getBoundingClientRect().top;
      return clamp(-top / parentTravel, 0, 1);
    };

    const setActive = (index, p) => {
      active = clamp(index, 0, slides.length - 1);
      preloadAround(active);
      if (currentOutput) currentOutput.value = slides[active].dataset.slide || String(active + 1).padStart(2, '0');
      if (previous) previous.disabled = active === 0;
      if (next) next.disabled = active === slides.length - 1;
      if (scrollbar) scrollbar.setAttribute('aria-valuenow', String(active + 1));
      if (thumb) {
        const thumbW = Math.max(100 / slides.length, 9);
        thumb.style.width = `${thumbW}%`;
        thumb.style.left = `${p * (100 - thumbW)}%`;
      }
    };

    const sync = () => {
      frame = 0;
      if (reduceMotion) {
        track.style.transform = '';
        sticky.scrollLeft = 0;
        setActive(0, 0);
        return;
      }
      const p = progress();
      const x = p * maxScroll;
      track.style.transform = `translate3d(${-x}px, 0, 0)`;
      const centre = x + sticky.clientWidth * 0.5;
      const index = slides.reduce((best, slide, i) => (
        Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre) <
        Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - centre) ? i : best
      ), 0);
      setActive(index, p);
    };

    const queue = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    const scrollToProgress = (p, smooth) => {
      const top = parent.getBoundingClientRect().top + window.scrollY + p * parentTravel;
      window.scrollTo({ top: Math.round(top), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
    };

    const go = (index) => {
      const target = clamp(index, 0, slides.length - 1);
      scrollToProgress(slideX(slides[target]) / maxScroll, true);
    };

    const pointerProgress = (clientX) => {
      const trackEl = $('.deck-scrollbar-track', scrollbar) || scrollbar;
      const rect = trackEl.getBoundingClientRect();
      return clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
    };

    if (scrollbar) {
      const onMove = (event) => {
        if (!dragging) return;
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        scrollToProgress(pointerProgress(clientX), false);
      };
      const onUp = () => {
        dragging = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);
      };
      const onDown = (event) => {
        dragging = true;
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        scrollToProgress(pointerProgress(clientX), false);
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerup', onUp);
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onUp);
        event.preventDefault();
      };
      scrollbar.addEventListener('pointerdown', onDown);
      scrollbar.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1); }
        if (event.key === 'Home') { event.preventDefault(); go(0); }
        if (event.key === 'End') { event.preventDefault(); go(slides.length - 1); }
      });
    }

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1); }
    });
    if (previous) previous.addEventListener('click', () => go(active - 1));
    if (next) next.addEventListener('click', () => go(active + 1));

    measure();
    load(slides[0]);
    preloadAround(0);
    sync();
    // Parent height drives the deck thread path — nudge a relayout once measured.
    window.dispatchEvent(new Event('resize'));
    document.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', () => { measure(); sync(); });
    window.addEventListener('load', () => { measure(); sync(); window.dispatchEvent(new Event('resize')); });
  }

  /* ----------------------- Vaidya widget: corner dock, centre stage at #vaidya */
  function bootVaidyaDock() {
    const dock = $('#vaidya-dock');
    const stage = $('#vaidya');
    const spot = $('.vaidya-spot');
    if (!dock || !stage || !spot) return;
    const widget = $('elevenlabs-convai', dock);
    const deckParent = $('.sticky-parent');
    const deckNav = $('.deck-nav');
    let staged = false;
    let base = null;
    let frame = 0;

    // Centre of the widget as it sits in the corner. Its UI lives in a shadow
    // root; fall back to the default bottom-right pill if that is closed.
    const measure = () => {
      const root = widget && widget.shadowRoot;
      let l = Infinity; let t = Infinity; let r = -Infinity; let b = -Infinity;
      if (root) {
        $$('*', root).forEach((node) => {
          const q = node.getBoundingClientRect();
          if (q.width < 8 || q.height < 8 || q.width > window.innerWidth * 0.9) return;
          l = Math.min(l, q.left); t = Math.min(t, q.top);
          r = Math.max(r, q.right); b = Math.max(b, q.bottom);
        });
      }
      if (r > l && b > t) return { x: (l + r) / 2, y: (t + b) / 2 };
      return { x: window.innerWidth - 150, y: window.innerHeight - 58 };
    };

    const place = () => {
      frame = 0;
      const H = window.innerHeight;
      const s = stage.getBoundingClientRect();
      const want = s.top < H * 0.5 && s.bottom > H * 0.5;
      if (!dock.classList.contains('is-revealed') && s.top < H * 0.75) dock.classList.add('is-revealed');
      if (want && !staged) base = measure();
      staged = want;
      document.documentElement.classList.toggle('vaidya-staged', staged);

      if (staged) {
        const target = spot.getBoundingClientRect();
        const cx = target.left + target.width / 2;
        const cy = clamp(target.top + target.height / 2, H * 0.3, H * 0.8);
        const scale = window.innerWidth < 760 ? 1.1 : 1.35;
        dock.style.transformOrigin = `${base.x}px ${base.y}px`;
        dock.style.transform = `translate(${f(cx - base.x)}px, ${f(cy - base.y)}px) scale(${scale})`;
        return;
      }

      // Lift clear of the deck's arrows and counter while the slides are pinned.
      let lift = 0;
      if (deckParent && deckNav) {
        const d = deckParent.getBoundingClientRect();
        if (d.top <= 1 && d.bottom >= H - 1) lift = deckNav.offsetHeight + 6;
      }
      dock.style.transform = lift ? `translate(0, ${-lift}px)` : '';
    };

    const queue = () => { if (!frame) frame = requestAnimationFrame(place); };
    document.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    place();
  }

  /* ------------------------------------------------------- Curve helpers */
  const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

  // Centripetal Catmull-Rom → cubic Béziers. Tension keeps corners soft without overshoot.
  function smoothPath(points, tension = 0.42) {
    const pts = points.filter((p, i) => i === 0 || dist(p, points[i - 1]) > 0.5);
    if (pts.length < 2) return '';
    let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
    for (let i = 0; i < pts.length - 1; i += 1) {
      const p0 = pts[i - 1] || { x: pts[i].x * 2 - pts[i + 1].x, y: pts[i].y * 2 - pts[i + 1].y };
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || { x: p2.x * 2 - p1.x, y: p2.y * 2 - p1.y };
      const d1 = Math.sqrt(dist(p0, p1)) || 1e-3;
      const d2 = Math.sqrt(dist(p1, p2)) || 1e-3;
      const d3 = Math.sqrt(dist(p2, p3)) || 1e-3;
      let b1x = (d1 * d1 * p2.x - d2 * d2 * p0.x + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.x) / (3 * d1 * (d1 + d2));
      let b1y = (d1 * d1 * p2.y - d2 * d2 * p0.y + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.y) / (3 * d1 * (d1 + d2));
      let b2x = (d3 * d3 * p1.x - d2 * d2 * p3.x + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.x) / (3 * d3 * (d3 + d2));
      let b2y = (d3 * d3 * p1.y - d2 * d2 * p3.y + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.y) / (3 * d3 * (d3 + d2));
      if (tension < 1) {
        const mx = p1.x + (p2.x - p1.x) * tension;
        const my = p1.y + (p2.y - p1.y) * tension;
        b1x = p1.x + (b1x - p1.x) * tension;
        b1y = p1.y + (b1y - p1.y) * tension;
        b2x = mx + (b2x - mx) * tension;
        b2y = my + (b2y - my) * tension;
      }
      d += ` C${f(b1x)} ${f(b1y)}, ${f(b2x)} ${f(b2y)}, ${f(p2.x)} ${f(p2.y)}`;
    }
    return d;
  }

  // Two edge-to-edge horizontal lines drawn by the same stroke. The pen starts
  // off-canvas left on the lower line; U-turns happen off-canvas (the thread
  // layer clips at the viewport) so both lines read as full-width rules.
  function flatWrapPath(kx, ky, W, gap) {
    const out = 14;
    const lowY = ky + gap;
    return (
      ` L${f(W + out)} ${f(lowY)}` +
      ` C${f(W + out + gap * 1.4)} ${f(lowY)}, ${f(W + out + gap * 1.4)} ${f(ky)}, ${f(W + out)} ${f(ky)}` +
      ` L${f(kx)} ${f(ky)}`
    );
  }

  // Double loops lift above the wrap line. Several tight overlapping turns
  // make a concentrated centre knot, followed by two short cut ends.
  function bowPath(kx, ky, w) {
    const h = w * 0.72;
    const s = w * 0.16;
    return (
      // Right loop, mostly above the horizontal tie
      ` C${f(kx + w * 0.2)} ${f(ky - h * 0.72)}, ${f(kx + w * 0.78)} ${f(ky - h * 1.16)}, ${f(kx + w * 1.3)} ${f(ky - h * 0.86)}` +
      ` C${f(kx + w * 1.58)} ${f(ky - h * 0.62)}, ${f(kx + w * 1.34)} ${f(ky - h * 0.05)}, ${f(kx + w * 0.82)} ${f(ky - h * 0.05)}` +
      ` C${f(kx + w * 0.38)} ${f(ky - h * 0.04)}, ${f(kx + w * 0.12)} ${f(ky - h * 0.2)}, ${f(kx)} ${f(ky)}` +
      // Left loop, mirrored and pointing upward
      ` C${f(kx - w * 0.2)} ${f(ky - h * 0.72)}, ${f(kx - w * 0.78)} ${f(ky - h * 1.16)}, ${f(kx - w * 1.3)} ${f(ky - h * 0.86)}` +
      ` C${f(kx - w * 1.58)} ${f(ky - h * 0.62)}, ${f(kx - w * 1.34)} ${f(ky - h * 0.05)}, ${f(kx - w * 0.82)} ${f(ky - h * 0.05)}` +
      ` C${f(kx - w * 0.38)} ${f(ky - h * 0.04)}, ${f(kx - w * 0.12)} ${f(ky - h * 0.2)}, ${f(kx)} ${f(ky)}` +
      // Dense centre knot: three small, overlapping turns
      ` C${f(kx + s * 0.9)} ${f(ky - s)}, ${f(kx + s * 1.2)} ${f(ky + s * 0.35)}, ${f(kx + s * 0.18)} ${f(ky + s * 0.58)}` +
      ` C${f(kx - s * 0.88)} ${f(ky + s * 0.92)}, ${f(kx - s * 1.18)} ${f(ky - s * 0.22)}, ${f(kx - s * 0.2)} ${f(ky - s * 0.62)}` +
      ` C${f(kx + s * 0.7)} ${f(ky - s * 1.02)}, ${f(kx + s * 1.02)} ${f(ky - s * 0.04)}, ${f(kx + s * 0.28)} ${f(ky + s * 0.42)}` +
      ` C${f(kx - s * 0.42)} ${f(ky + s * 0.82)}, ${f(kx - s * 0.8)} ${f(ky + s * 0.08)}, ${f(kx)} ${f(ky)}` +
      // Leave the knot along the upper line to the left edge.
      ` L${f(-14)} ${f(ky)}`
    );
  }

  /* ------------------------------------------------------------ The thread */
  function bootThread(options) {
    const opts = options || {};
    const holdIntro = !!opts.holdIntro;
    const under = $('#thread-svg');
    const over = $('#thread-svg-over');
    const paths = [$('#thread-path'), $('#thread-shadow'), $('#thread-path-over')];
    const clip = $('#overClip');
    const fill = $('#thread-progress-fill');
    const hero = $('#top');
    const title = $('#hero-title');
    const main = $('#main');
    if (!under || !over || !hero || !title || paths.some((p) => !p)) {
      return { ready: Promise.resolve(), releaseIntro: () => {} };
    }

    const layers = $$('.thread-layer');
    const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (gsapReady) window.gsap.registerPlugin(window.ScrollTrigger);

    let total = 1;
    let lookup = [];
    let lookupStep = 10;
    const state = { drawn: 0 };
    let scrollGoal = 0;
    let drawFrame = 0;
    let introDone = reduceMotion;
    let trigger = null;

    const sy = () => window.scrollY || 0;
    const rectOf = (el) => {
      const r = el.getBoundingClientRect();
      return { l: r.left, r: r.right, t: r.top + sy(), b: r.bottom + sy(), cx: (r.left + r.right) / 2, cy: (r.top + r.bottom) / 2 + sy(), w: r.width, h: r.height };
    };

    function rails(W) {
      const cs = getComputedStyle(hero);
      const gutter = parseFloat(cs.paddingLeft);
      const rail = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rail')) || gutter * 0.6;
      const inner = hero.getBoundingClientRect();
      return {
        left: inner.left + gutter - rail * 0.5,
        right: inner.right - gutter + rail * 0.5,
        amp: clamp(rail * 0.36, 14, 52),
        rail
      };
    }

    // Hero: enter top-left, wiggle through the empty band, then make four uneven,
    // playful loops in the open space. Every point stays outside the copy boxes.
    function heroCoil(pts, W, R) {
      const t = rectOf(title);
      const line = rectOf($('#hero-line'));
      const heroR = rectOf(hero);
      const freeRight = R.right - 30 - (t.r + 40);
      let box;
      if (freeRight > 260) {
        box = { x0: t.r + 48, x1: R.right - 30, y0: t.t, y1: Math.max(t.b, line.b) };
      } else {
        box = { x0: R.left + 24, x1: R.right - 24, y0: line.b + 40, y1: Math.max(line.b + 190, heroR.b - 30) };
      }
      const turns = 4;
      const bw = box.x1 - box.x0;
      const bh = box.y1 - box.y0;
      const radius = Math.min(bw / (2 + 1.02 * turns), bh * 0.4);
      const drift = Math.max(bw - radius * 2, 0) / turns;
      const cy = (box.y0 + box.y1) / 2;
      const steps = Math.round(turns * 18);
      const th0 = Math.PI * 1.18;
      const mast = $('.mast');
      const bandY = mast ? rectOf(mast).b + (t.t - rectOf(mast).b) * 0.45 : t.t - 60;
      pts.push({ x: -16, y: -16 });
      if (freeRight > 260) {
        // A loose wiggle in the quiet band between the masthead and the eyebrow,
        // then a swoop down into the loops. Nothing crosses the headline.
        pts.push({ x: W * 0.16, y: bandY + 16 });
        pts.push({ x: W * 0.3, y: bandY - 14 });
        pts.push({ x: W * 0.44, y: bandY + 22 });
        pts.push({ x: box.x0 - radius * 0.35, y: bandY + (cy - radius * 0.55 - bandY) * 0.38 });
        pts.push({ x: box.x0 + radius * 0.05, y: cy - radius * 0.72 });
      } else {
        // Narrow screens: hug the left rail past the copy, then come in below it.
        pts.push({ x: R.left, y: t.cy - 30 });
        pts.push({ x: R.left + 12, y: t.cy + 46 });
        pts.push({ x: R.left + 3, y: line.b + 6 });
        pts.push({ x: box.x0 + radius * 0.1, y: box.y0 + 8 });
      }
      for (let i = 0; i <= steps; i += 1) {
        const th = th0 + (i / steps) * turns * Math.PI * 2;
        const travel = (th - th0) / (Math.PI * 2);
        const cx = box.x0 + radius + travel * drift;
        const wobbleY = Math.sin(travel * 3.1) * radius * 0.17;
        const rx = radius * (1 + 0.14 * Math.sin(th * 1.5 + 0.7) + 0.05 * Math.sin(travel * 5.2));
        const ry = radius * (0.76 + 0.12 * Math.sin(th * 1.2 + 1.1));
        pts.push({ x: cx + rx * Math.cos(th), y: cy + wobbleY + ry * Math.sin(th) });
      }
      const end = pts[pts.length - 1];
      // One last cheeky dip before it settles onto the right rail and heads down.
      pts.push({ x: Math.min(end.x + radius * 0.9, R.right - 22), y: cy + radius * 0.95 });
      pts.push({ x: R.right - 4, y: cy + radius * 0.35 });
      pts.push({ x: R.right, y: Math.max(heroR.b - 20, cy + radius * 2.3) });
      return 'right';
    }

    // Meander down one rail like a slow river.
    function descend(pts, x, y0, y1, amp, phase) {
      const step = 200;
      const n = Math.max(1, Math.round((y1 - y0) / step));
      for (let i = 1; i <= n; i += 1) {
        const y = y0 + ((y1 - y0) * i) / n;
        const wobble = Math.sin(phase + i * 1.9) * amp + Math.sin(phase * 0.7 + i * 0.8) * amp * 0.45;
        pts.push({ x: x + wobble, y });
      }
    }

    // Flattened S between rails — extra samples so the stroke reads as one flowing line.
    function crossOver(pts, fromX, toX, crossY, R) {
      const dir = toX > fromX ? 1 : -1;
      const span = Math.abs(toX - fromX);
      const bend = Math.min(span * 0.14, 96);
      const last = pts[pts.length - 1];
      const y0 = last ? last.y : crossY - 90;
      if (!last || last.y < crossY - 110) pts.push({ x: fromX, y: crossY - 70 });
      const steps = 5;
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        const ease = t * t * (3 - 2 * t);
        const x = fromX + (toX - fromX) * ease + Math.sin(t * Math.PI) * dir * bend * 0.22;
        const y = y0 + (crossY - y0) * ease;
        pts.push({ x, y });
      }
      pts.push({ x: toX, y: crossY + 48 });
      pts.push({ x: toX, y: crossY + 130 });
    }

    // Weave around items row by row (boustrophedon), never through them.
    // Cards and slides: the thread runs in the margin just outside each frame,
    // below one item, up through the gap, above the next — so no text is cut.
    // Names: it draws a loose oval around each one, in the padding around the text.
    function weave(pts, items, side, R, overEls, mode) {
      const rects = items.map((el) => {
        const name = el.querySelector('.member-name');
        return { el, ...rectOf(el), box: name ? rectOf(name) : null };
      }).sort((a, b) => a.t - b.t || a.l - b.l);
      const rows = [];
      rects.forEach((r) => {
        const row = rows[rows.length - 1];
        if (row && Math.abs(row[0].t - r.t) < 12) row.push(r); else rows.push([r]);
      });
      const clear = clamp(R.rail * 0.14, 9, 18);
      let dir = side === 'left' ? 1 : -1;
      let idx = 0;
      rows.forEach((row, ri) => {
        const ordered = dir === 1 ? row : row.slice().reverse();
        ordered.forEach((it) => {
          const isOver = mode === 'over' && idx % 2 === 1;
          const xIn = dir === 1 ? it.l : it.r;
          const xOut = dir === 1 ? it.r : it.l;
          if (mode === 'over') {
            if (isOver) {
              overEls.push({
                l: it.l - clear - 8, t: it.t - clear - 8,
                w: it.w + (clear + 8) * 2, h: it.h + (clear + 8) * 2
              });
            }
            // Below one frame, above the next: the lane sits outside the frame,
            // and the turn between items happens in the gap between them.
            const laneY = isOver ? it.t - clear : it.b + clear;
            pts.push({ x: xIn - dir * (clear + 4), y: laneY });
            pts.push({ x: it.cx - dir * it.w * 0.22, y: laneY });
            pts.push({ x: it.cx + dir * it.w * 0.22, y: laneY });
            pts.push({ x: xOut + dir * (clear + 4), y: laneY });
          } else {
            // A loose oval in the padding around the name itself (not the whole
            // grid cell), chained to the next name. Eight points keep it round.
            const b = it.box || it;
            const rx = b.w / 2 + clear;
            const ry = b.h / 2 + clamp(clear * 1.5, 18, 26);
            pts.push({ x: b.cx - dir * rx, y: b.cy });
            pts.push({ x: b.cx - dir * rx * 0.7, y: b.cy + ry * 0.72 });
            pts.push({ x: b.cx, y: b.cy + ry });
            pts.push({ x: b.cx + dir * rx * 0.7, y: b.cy + ry * 0.72 });
            pts.push({ x: b.cx + dir * rx, y: b.cy });
            pts.push({ x: b.cx + dir * rx * 0.7, y: b.cy - ry * 0.72 });
            pts.push({ x: b.cx, y: b.cy - ry });
            pts.push({ x: b.cx - dir * rx * 0.7, y: b.cy - ry * 0.72 });
            pts.push({ x: b.cx + dir * rx, y: b.cy });
          }
          idx += 1;
        });
        if (ri < rows.length - 1) {
          const next = rows[ri + 1];
          const midY = (row[0].cy + next[0].cy) / 2;
          pts.push({ x: dir === 1 ? R.right : R.left, y: midY });
          dir = -dir;
        }
      });
      return dir === 1 ? 'right' : 'left';
    }

    // Squiggle through each deck slide as the sticky carousel scrolls.
    // Maps each slide to a band of the tall sticky-parent height so the ink
    // draws through that image while it is centred; odd slides clip over.
    function deckSquiggle(pts, parentEl, stickyEl, slides, entrySide, exitSide, R, overEls) {
      const parent = rectOf(parentEl);
      const stickyH = stickyEl.clientHeight || window.innerHeight;
      const travel = Math.max(parent.h - stickyH, 1);
      const frameEl = $('.deck-frame', slides[0]) || slides[0];
      const sample = frameEl ? frameEl.getBoundingClientRect() : stickyEl.getBoundingClientRect();
      const frameW = Math.max(sample.width, 240);
      const frameH = Math.max(sample.height, 160);
      const cx = document.documentElement.clientWidth / 2;
      const left = cx - frameW / 2;
      const right = cx + frameW / 2;
      const n = slides.length;
      const entryX = entrySide === 'left' ? R.left : R.right;

      pts.push({ x: entryX, y: Math.max(0, parent.t - 48) });
      pts.push({ x: entryX, y: parent.t + stickyH * 0.18 });

      for (let i = 0; i < n; i += 1) {
        const t = n === 1 ? 0 : i / (n - 1);
        const yCenter = parent.t + t * travel + stickyH * 0.42;
        const top = yCenter - frameH / 2;
        const bot = yCenter + frameH / 2;
        const over = i % 2 === 1;
        if (over) {
          overEls.push({
            l: left - 10,
            t: top - 10,
            w: frameW + 20,
            h: frameH + 20
          });
        }

        const dir = i % 2 === 0 ? 1 : -1;
        const xIn = dir === 1 ? left - 28 : right + 28;
        const xOut = dir === 1 ? right + 28 : left - 28;
        const baseY = over ? top + frameH * 0.32 : bot - frameH * 0.32;
        const amp = clamp(frameH * 0.14, 28, 72);

        pts.push({ x: xIn, y: baseY + (i === 0 ? -amp * 0.2 : 0) });
        const steps = 7;
        for (let s = 1; s <= steps; s += 1) {
          const u = s / (steps + 1);
          const x = xIn + (xOut - xIn) * u;
          const wave = Math.sin(u * Math.PI * 2.4 + i * 0.85) * amp
            + Math.sin(u * Math.PI * 5.1 + i * 1.4) * amp * 0.32;
          pts.push({ x, y: baseY + (over ? wave : -wave) });
        }
        pts.push({ x: xOut, y: baseY });

        if (i < n - 1) {
          const nextT = (i + 1) / (n - 1);
          const nextY = parent.t + nextT * travel + stickyH * 0.42;
          const bridge = (baseY + nextY) / 2;
          pts.push({ x: xOut + dir * 12, y: bridge - amp * 0.15 });
          pts.push({ x: xOut - dir * 36, y: bridge + amp * 0.1 });
        }
      }

      const exitX = exitSide === 'left' ? R.left : R.right;
      const last = pts[pts.length - 1];
      pts.push({ x: last.x, y: parent.b - stickyH * 0.15 });
      pts.push({ x: exitX, y: parent.b + 36 });
      pts.push({ x: exitX, y: parent.b + 96 });
      return exitSide;
    }

    // Pile loose loops behind a big box (the demo frame, the video clips).
    // Loops are stacked from the top of the box to the bottom, so as the reader
    // scrolls through the box the thread visibly accumulates behind it, then
    // leaves from the exit side when they scroll past. The box is opaque, so
    // only the parts of each loop that spill past its edges show.
    function pileBehind(pts, box, entrySide, exitSide, R) {
      const cx = (box.l + box.r) / 2;
      const entryX = entrySide === 'left' ? box.l - 30 : box.r + 30;
      const railIn = entrySide === 'left' ? R.left : R.right;
      pts.push({ x: railIn, y: Math.max(0, box.t - 64) });
      pts.push({ x: entryX, y: box.t - 26 });

      const loops = box.h > 520 ? 5 : 3;
      for (let i = 0; i < loops; i += 1) {
        const startSide = i === loops - 1 ? exitSide : (i === 0 ? entrySide : (i % 2 ? 'right' : 'left'));
        const cy = box.t + box.h * (loops === 1 ? 0.5 : 0.1 + (0.8 * i) / (loops - 1));
        const rx = box.w / 2 + 26 + (i % 2) * 16 + Math.sin(i * 2.3) * 8;
        const ry = clamp(box.h * 0.085, 40, 82) * (1 + 0.16 * Math.sin(i * 1.9));
        const start = startSide === 'left' ? Math.PI : 0;
        const sweep = i % 2 ? -Math.PI * 2 : Math.PI * 2;
        const steps = 18;
        for (let s = 0; s <= steps; s += 1) {
          const th = start + (s / steps) * sweep;
          const wob = 1 + 0.04 * Math.sin(th * 3 + i * 1.7);
          pts.push({ x: cx + rx * wob * Math.cos(th), y: cy + ry * Math.sin(th) });
        }
      }

      const railOut = exitSide === 'left' ? R.left : R.right;
      pts.push({ x: exitSide === 'left' ? box.l - 30 : box.r + 30, y: box.b + 30 });
      pts.push({ x: railOut, y: box.b + 78 });
    }

    function build(W) {
      const R = rails(W);
      const pts = [];
      const overEls = [];
      let side = heroCoil(pts, W, R);
      let phase = 0;

      const sections = $$('main [data-thread]').filter((el) => el !== hero);
      let bowD = '';
      sections.forEach((sec) => {
        const kind = sec.getAttribute('data-thread');
        const r = rectOf(sec);
        const want = sec.getAttribute('data-side') || side;
        if (kind === 'side') {
          const x = want === 'left' ? R.left : R.right;
          if (want !== side) {
            crossOver(pts, side === 'left' ? R.left : R.right, x, r.t + 40, R);
            side = want;
            descend(pts, x, r.t + 190, r.b - 30, R.amp, (phase += 2.1));
          } else {
            descend(pts, x, r.t, r.b - 30, R.amp, (phase += 2.1));
          }
        } else if (kind === 'weave') {
          const items = $$('[data-thread-pass]', sec);
          const mode = sec.getAttribute('data-weave') || 'under';
          const first = rectOf(items[0]);
          const railX = want === 'left' ? R.left : R.right;
          if (want !== side) {
            crossOver(pts, side === 'left' ? R.left : R.right, railX, r.t + 40, R);
            side = want;
          } else {
            pts.push({ x: railX, y: r.t + 40 });
          }
          // Glide down the rail to the first row, then enter it
          pts.push({ x: railX, y: first.cy - first.h * 0.9 });
          side = weave(pts, items, side, R, overEls, mode);
          const last = pts[pts.length - 1];
          pts.push({ x: side === 'left' ? R.left : R.right, y: Math.min(last.y + 120, r.b + 20) });
        } else if (kind === 'deck') {
          const parentEl = $('.sticky-parent', sec);
          const stickyEl = $('.deck-sticky', sec) || $('.sticky', sec);
          const slides = $$('.deck-slide', sec);
          const entry = sec.getAttribute('data-entry') || side;
          const exit = sec.getAttribute('data-exit') || 'right';
          if (!parentEl || !stickyEl || !slides.length) return;
          if (entry !== side) {
            crossOver(pts, side === 'left' ? R.left : R.right, entry === 'left' ? R.left : R.right, r.t + 40, R);
            side = entry;
          }
          side = deckSquiggle(pts, parentEl, stickyEl, slides, entry, exit, R, overEls);
        } else if (kind === 'pile') {
          const targetEl = $(sec.getAttribute('data-pile-target') || '', sec);
          if (!targetEl) return;
          const entry = sec.getAttribute('data-entry') || side;
          const exit = sec.getAttribute('data-exit') || entry;
          if (entry !== side) {
            crossOver(pts, side === 'left' ? R.left : R.right, entry === 'left' ? R.left : R.right, r.t + 40, R);
            side = entry;
          }
          pileBehind(pts, rectOf(targetEl), entry, exit, R);
          side = exit;
          pts.push({ x: side === 'left' ? R.left : R.right, y: Math.min(r.b + 30, rectOf(targetEl).b + 150) });
        } else if (kind === 'bow') {
          const knot = $('#thread-knot');
          const kr = rectOf(knot);
          const lineY = kr.t + kr.h * 0.4;
          const kx = W / 2;
          const bw = clamp(W * 0.07, 52, 100);
          const wrapLeft = Math.max(12, R.left);
          // Always enter the closing card from its left edge. On narrow layouts
          // the preceding weave may finish right, so switch sides in the empty
          // band above the closing copy.
          if (side === 'right') {
            const last = pts[pts.length - 1];
            const swapY = Math.max(last.y + 34, r.t + 16);
            pts.push({ x: R.right, y: swapY });
            pts.push({ x: W * 0.68, y: swapY + 16 });
            pts.push({ x: W * 0.32, y: swapY + 16 });
            pts.push({ x: wrapLeft, y: swapY + 46 });
            side = 'left';
          }

          // Vertical first, then a broad horizontal tie crossing the full card.
          pts.push({ x: wrapLeft, y: r.t + 20 });
          pts.push({ x: wrapLeft, y: lineY - 108 });
          // Curl off the left edge and re-enter on the lower line.
          const gap = clamp(W * 0.018, 14, 26);
          pts.push({ x: wrapLeft, y: lineY - 20 });
          pts.push({ x: Math.max(wrapLeft * 0.4, 4), y: lineY + gap * 0.7 });
          pts.push({ x: -14, y: lineY + gap });
          bowD = flatWrapPath(kx, lineY, W, gap) + bowPath(kx, lineY, bw);
        }
      });

      return { d: smoothPath(pts) + bowD, overEls };
    }

    function layout() {
      const W = document.documentElement.clientWidth;
      layers.forEach((l) => { l.style.height = '0px'; });
      const H = Math.max(document.documentElement.scrollHeight, main.offsetHeight);
      layers.forEach((l) => { l.style.height = `${H}px`; });
      [under, over].forEach((svg) => {
        svg.setAttribute('width', W);
        svg.setAttribute('height', H);
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      });
      const sw = W < 760 ? 2.4 : W < 1100 ? 3 : 3.4;
      paths[0].setAttribute('stroke-width', sw);
      paths[2].setAttribute('stroke-width', sw);
      paths[1].setAttribute('stroke-width', sw + 1.6);
      paths[1].setAttribute('transform', 'translate(1.5 2.4)');

      const { d, overEls } = build(W);
      paths.forEach((p) => p.setAttribute('d', d));
      clip.innerHTML = overEls
        .map((r) => `<rect x="${f(r.l)}" y="${f(r.t)}" width="${f(r.w)}" height="${f(r.h)}"/>`)
        .join('');

      total = Math.max(paths[0].getTotalLength(), 1);
      paths.forEach((p) => { p.style.strokeDasharray = `${total} ${total}`; });

      // Coarser depth table = faster first layout on the tall sticky-deck page.
      lookupStep = Math.max(28, total / 720);
      lookup = [];
      let maxY = 0;
      for (let l = 0; l <= total; l += lookupStep) {
        maxY = Math.max(maxY, paths[0].getPointAtLength(l).y);
        lookup.push(maxY);
      }
      setScrollGoal();
      if (reduceMotion) { state.drawn = total; paintNow(); return; }
      if (introDone) paintTo(scrollGoal, true);
      else if (introTween && gsapReady) {
        // Keep momentum; only re-aim — don't restart a long tween from scratch.
        const to = Math.max(target(), state.drawn);
        introTween.kill();
        introTween = window.gsap.to(state, {
          drawn: to,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: paintNow,
          onComplete: finishIntro
        });
      } else if (!introStarted) {
        paintNow();
      }
    }

    let introTween = null;
    let introStarted = false;
    const introStartedAt = performance.now();
    function finishIntro() {
      introDone = true;
      introTween = null;
      setScrollGoal();
      startDrawLoop();
    }

    function target() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (sy() >= maxScroll - 4) return total;
      const y = sy() + window.innerHeight * 0.78;
      let lo = 0;
      let hi = lookup.length - 1;
      if (hi < 0 || lookup[0] > y) return 0;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (lookup[mid] <= y) lo = mid; else hi = mid - 1;
      }
      const base = lo * lookupStep;
      if (lo >= lookup.length - 1) return total;
      const y0 = lookup[lo];
      const y1 = lookup[lo + 1];
      const span = Math.max(y1 - y0, 1e-3);
      const frac = clamp((y - y0) / span, 0, 1);
      return Math.min(total, base + frac * lookupStep);
    }

    function setScrollGoal() {
      scrollGoal = target();
    }

    function startDrawLoop() {
      if (drawFrame || reduceMotion) return;
      const step = () => {
        if (!introDone) {
          drawFrame = requestAnimationFrame(step);
          return;
        }
        const diff = scrollGoal - state.drawn;
        if (Math.abs(diff) < 0.35) {
          state.drawn = scrollGoal;
        } else {
          const gain = clamp(0.2 + Math.abs(diff) / total * 0.28, 0.18, 0.48);
          state.drawn += diff * gain;
        }
        paintNow();
        drawFrame = requestAnimationFrame(step);
      };
      drawFrame = requestAnimationFrame(step);
    }

    function paintNow() {
      const off = String(total - state.drawn);
      paths.forEach((p) => { p.style.strokeDashoffset = off; });
      if (fill) fill.style.width = `${((state.drawn / total) * 100).toFixed(2)}%`;
    }

    function paintTo(value, immediate) {
      scrollGoal = clamp(value, 0, total);
      if (immediate || reduceMotion) {
        state.drawn = scrollGoal;
        paintNow();
      }
    }

    function intro() {
      if (reduceMotion || introStarted) return;
      introStarted = true;
      const to = Math.max(target(), Math.min(total * 0.12, 420));
      // Seed a visible length on the first frame so the thread is never blank while GSAP catches up.
      state.drawn = Math.max(to * 0.45, Math.min(total * 0.06, 180));
      paintNow();
      if (gsapReady) {
        introTween = window.gsap.to(state, {
          drawn: to,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: paintNow,
          onComplete: finishIntro
        });
      } else {
        state.drawn = to;
        paintNow();
        finishIntro();
      }
    }

    let resizeTimer = 0;
    const relayout = (force) => {
      clearTimeout(resizeTimer);
      // Ignore soft layout thrash (fonts/iframes) during the opening draw.
      if (!force && !introDone && performance.now() - introStartedAt < 700) return;
      resizeTimer = setTimeout(() => { layout(); if (gsapReady) window.ScrollTrigger.refresh(); }, force ? 0 : 140);
    };

    // First layout immediately so the splash can wait on a real thread path.
    layout();
    if (!holdIntro) intro();
    const onScrollGoal = () => { if (introDone) setScrollGoal(); };
    if (gsapReady) {
      trigger = window.ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: onScrollGoal
      });
    }
    window.addEventListener('scroll', onScrollGoal, { passive: true });
    window.addEventListener('resize', () => relayout(true));
    window.addEventListener('load', () => relayout(true));
    // Soft refresh after fonts settle — don't block or erase the first draw.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(() => relayout(false), 80);
      }).catch(() => {});
    }
    if ('ResizeObserver' in window) {
      let lastH = main.offsetHeight;
      new ResizeObserver(() => {
        const h = main.offsetHeight;
        if (Math.abs(h - lastH) > 2) { lastH = h; relayout(false); }
      }).observe(main);
    }

    const ready = new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    return {
      ready,
      releaseIntro: () => { if (holdIntro) intro(); }
    };
  }

  /* ----------------------------------------------------------- Splash preloader */
  function bootSplash(onReady) {
    const root = $('#splash');
    const fill = $('#splash-progress-fill');
    const label = $('#splash-progress-label');
    const skip = $('#splash-skip');
    if (!root) {
      onReady({ holdIntro: false });
      return;
    }

    const deepLink = !!(window.location.hash && window.location.hash !== '#');
    const bypass = deepLink || reduceMotion;
    let settled = false;
    let booted = false;
    let api = null;
    let weights = { libs: 0, fonts: 0, images: 0, thread: 0 };
    const labels = {
      libs: 'Libraries',
      fonts: 'Type',
      images: 'Images',
      thread: 'Thread'
    };

    const ensureBoot = (holdIntro) => {
      if (!booted) {
        booted = true;
        api = onReady({ holdIntro: !!holdIntro }) || { ready: Promise.resolve(), releaseIntro: () => {} };
      }
      return api;
    };

    const setProgress = () => {
      const value = (weights.libs * 0.28) + (weights.fonts * 0.12) + (weights.images * 0.35) + (weights.thread * 0.25);
      const pct = Math.round(clamp(value, 0, 1) * 100);
      if (fill) fill.style.width = `${pct}%`;
      if (label) {
        const pending = Object.keys(weights).find((key) => weights[key] < 1);
        label.textContent = pending ? labels[pending] : 'Ready';
      }
      return pct;
    };

    const loadImage = (src) => new Promise((resolve) => {
      if (!src) { resolve(false); return; }
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });

    const waitForGsap = () => new Promise((resolve) => {
      if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
        resolve(true);
        return;
      }
      let tries = 0;
      const tick = () => {
        if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
          resolve(true);
          return;
        }
        tries += 1;
        if (tries > 80) { resolve(false); return; }
        setTimeout(tick, 50);
      };
      tick();
    });

    const waitForSplash = () => new Promise((resolve) => {
      if (window.MatterSplash && typeof window.MatterSplash.start === 'function') {
        resolve(true);
        return;
      }
      let tries = 0;
      const tick = () => {
        if (window.MatterSplash && typeof window.MatterSplash.start === 'function') {
          resolve(true);
          return;
        }
        tries += 1;
        if (tries > 40) { resolve(false); return; }
        setTimeout(tick, 50);
      };
      tick();
    });

    const openMain = (release) => {
      if (settled) return;
      settled = true;
      if (root) root.setAttribute('aria-busy', 'false');
      document.body.classList.remove('is-splash');
      const current = ensureBoot(false);
      if (release && current.releaseIntro) current.releaseIntro();
    };

    const skipToMain = () => {
      if (window.MatterSplash && window.MatterSplash.active) {
        window.MatterSplash.skip();
        return;
      }
      if (window.MatterSplash && typeof window.MatterSplash.finish === 'function') {
        window.MatterSplash.finish();
        return;
      }
      openMain(true);
      if (root && root.parentNode) root.remove();
    };

    document.addEventListener('matter-splash:end', () => openMain(true), { once: true });

    const run = async () => {
      if (bypass) {
        ensureBoot(false);
        skipToMain();
        return;
      }

      ensureBoot(true);
      setProgress();

      const libs = Promise.all([waitForGsap(), waitForSplash()]).then(([gsapOk]) => {
        weights.libs = gsapOk ? 1 : 0.85;
        setProgress();
      });

      const marcellus = (document.fonts && document.fonts.load
        ? document.fonts.load('400 48px "Marcellus"').then(() => true).catch(() => false)
        : Promise.resolve(true)
      );

      const fonts = Promise.all([
        marcellus,
        document.fonts && document.fonts.ready
          ? document.fonts.ready.then(() => true).catch(() => false)
          : Promise.resolve(true)
      ]).then(() => {
        weights.fonts = 1;
        setProgress();
      });

      const imageList = [
        'media/splash/thread.png',
        'media/logos/mauli-rituals.png',
        'media/logos/hult.png',
        'media/deck/01.webp',
        'media/deck/02.webp',
        'media/deck/03.webp',
        'media/deck/04.webp'
      ];
      const images = Promise.all(imageList.map(loadImage)).then((results) => {
        const ok = results.filter(Boolean).length;
        weights.images = clamp(ok / imageList.length, 0.4, 1);
        setProgress();
      });

      const thread = ensureBoot(true).ready.then(() => {
        weights.thread = 1;
        setProgress();
      });

      await Promise.all([libs, fonts, images, thread]);
      await new Promise((r) => setTimeout(r, 320));
      if (settled) return;
      if (window.MatterSplash && typeof window.MatterSplash.start === 'function') {
        window.MatterSplash.start();
      } else {
        skipToMain();
      }
    };

    if (skip) skip.addEventListener('click', () => {
      ensureBoot(false);
      skipToMain();
    });

    run().catch(() => {
      ensureBoot(false);
      skipToMain();
    });
  }

  /* -------------------------------------------- Three.js woven-cloth grain */
  let weaveLoading = false;
  function bootWeave() {
    const canvas = $('#weave-canvas');
    if (!canvas || reduceMotion) return;
    if (getComputedStyle(canvas).display === 'none') return;
    // Load Three only after the thread is up — it used to block app.js via defer order.
    if (typeof window.THREE === 'undefined') {
      if (weaveLoading) return;
      weaveLoading = true;
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
      script.async = true;
      script.onload = () => { weaveLoading = false; bootWeave(); };
      script.onerror = () => { weaveLoading = false; canvas.remove(); };
      document.head.appendChild(script);
      return;
    }
    let renderer;
    try {
      renderer = new window.THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch (e) {
      canvas.remove();
      return;
    }
    const THREE = window.THREE;
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    const uniforms = { uTime: { value: 0 }, uVelocity: { value: 0 }, uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } };
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }',
      fragmentShader: `
        uniform float uTime; uniform float uVelocity; uniform vec2 uRes; varying vec2 vUv;
        float rnd(vec2 st){ return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123); }
        void main(){
          vec2 px = vUv * uRes;
          float fold = sin(vUv.y * 6.0 + uTime * 0.4) * uVelocity * 0.0015;
          float wx = sin((px.x + fold * uRes.x) * 1.9);
          float wy = sin(px.y * 1.9);
          float weave = wx * wy * 0.5 + 0.5;
          float fuzz = rnd(floor(px * 0.5) + floor(uTime * 2.0)) * 0.6;
          vec3 tint = mix(vec3(0.93, 0.86, 0.78), vec3(0.98, 0.95, 0.90), weave);
          float a = (weave * 0.18 + fuzz * 0.08);
          gl_FragColor = vec4(tint, a);
        }`
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
    const clock = new THREE.Clock();
    let lastY = window.scrollY;
    let velocity = 0;
    window.addEventListener('scroll', () => { velocity = window.scrollY - lastY; lastY = window.scrollY; }, { passive: true });
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    });
    (function frame() {
      velocity *= 0.86;
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uVelocity.value = velocity;
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    })();
  }

  function start() {
    initSmoothScroll();
    bootSplash((opts) => {
      const threadApi = bootThread({ holdIntro: !!(opts && opts.holdIntro) });
      bootDeckCarousel();
      bootVaidyaDock();
      // Weave grain is decorative — defer so the thread and deck win first paint.
      const deferWeave = () => bootWeave();
      if ('requestIdleCallback' in window) window.requestIdleCallback(deferWeave, { timeout: 1200 });
      else setTimeout(deferWeave, 180);
      return threadApi;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
