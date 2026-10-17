(function () {
  // Deliverable modals
  document.querySelectorAll('[data-modal]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.getAttribute('data-modal'));
    if (!dialog || typeof dialog.showModal !== 'function') return;
    trigger.addEventListener('click', () => {
      dialog.showModal();
      const closeBtn = dialog.querySelector('.modal-close');
      if (closeBtn) closeBtn.focus();
    });
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        dialog.close();
      }
    });
  });

  // Sticky → horizontal deck gallery (CodePen structure)
  (function initHorizontalDeck() {
    const sticky = document.querySelector('.sticky');
    const stickyParent = document.querySelector('.sticky-parent');
    if (!sticky || !stickyParent) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scrollWidth = 0;
    let verticalScrollHeight = 1;

    function measure() {
      scrollWidth = sticky.scrollWidth;
      verticalScrollHeight = Math.max(
        stickyParent.getBoundingClientRect().height - sticky.getBoundingClientRect().height,
        1
      );
    }

    function horizontalScroll() {
      if (reduceMotion) return;
      const stickyPosition = sticky.getBoundingClientRect().top;
      if (stickyPosition > 1) return;
      const scrolled = stickyParent.getBoundingClientRect().top;
      sticky.scrollLeft = (scrollWidth / verticalScrollHeight) * (-scrolled) * 0.85;
    }

    measure();
    horizontalScroll();
    document.addEventListener('scroll', horizontalScroll, { passive: true });
    window.addEventListener('resize', () => {
      measure();
      horizontalScroll();
    });
    window.addEventListener('load', () => {
      measure();
      horizontalScroll();
    });
  })();

  function bootThread() {
    const layer = document.querySelector('.body-thread');
    const svg = document.querySelector('#body-thread-svg');
    const path = document.querySelector('#body-thread-path');
    const progressFill = document.querySelector('#thread-progress-fill');
    if (!layer || !svg || !path) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (gsapReady) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    let pathLength = 1;
    let scrollTrigger = null;
    let resizeTimer = 0;

    function clamp(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function yOf(el, scrollY) {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return rect.top + scrollY;
    }

    function heightOf(el) {
      return el ? Math.max(el.getBoundingClientRect().height, 1) : 1;
    }

    // Catmull-Rom → cubic Bézier for natural yarn curves (no jitter)
    function pointsToSmoothPath(points, tension) {
      if (points.length < 2) return '';
      const t = tension == null ? 0.85 : tension;
      let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
      for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        const c1x = p1.x + ((p2.x - p0.x) / 6) * t;
        const c1y = p1.y + ((p2.y - p0.y) / 6) * t;
        const c2x = p2.x - ((p3.x - p1.x) / 6) * t;
        const c2y = p2.y - ((p3.y - p1.y) / 6) * t;
        d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
      return d;
    }

    // Dense overlapping pile like the green-background yarn close-up
    function pushThreadPile(pts, cx, cy, rx, ry) {
      const rings = 5;
      const steps = 10;
      for (let ring = 0; ring < rings; ring += 1) {
        const grow = 0.42 + ring * 0.14;
        const spin = ring * 0.55;
        for (let i = 0; i < steps; i += 1) {
          const a = spin + (i / steps) * Math.PI * 2 * (1.15 + ring * 0.08);
          const squash = 0.78 + (ring % 2) * 0.12;
          pts.push({
            x: cx + Math.cos(a) * rx * grow,
            y: cy + Math.sin(a * 1.08) * ry * grow * squash
          });
        }
      }
      // Extra tight inner tangle (close-up pile character)
      for (let i = 0; i < 14; i += 1) {
        const a = i * 0.9;
        const g = 0.28 + (i % 5) * 0.05;
        pts.push({
          x: cx + Math.cos(a) * rx * g * 1.15 + Math.sin(a * 2) * rx * 0.08,
          y: cy + Math.sin(a) * ry * g + Math.cos(a * 1.7) * ry * 0.1
        });
      }
    }

    // Continuous ribbon bowtie / figure-eight at the horizontal break
    function appendBowtie(d, kx, ky, size) {
      const w = size;
      const h = size * 0.62;
      return (
        `${d}` +
        ` C${(kx - w * 0.25).toFixed(1)} ${(ky - h).toFixed(1)}, ${(kx - w).toFixed(1)} ${(ky - h * 0.35).toFixed(1)}, ${(kx - w).toFixed(1)} ${ky.toFixed(1)}` +
        ` C${(kx - w).toFixed(1)} ${(ky + h * 0.35).toFixed(1)}, ${(kx - w * 0.25).toFixed(1)} ${(ky + h).toFixed(1)}, ${kx.toFixed(1)} ${ky.toFixed(1)}` +
        ` C${(kx + w * 0.25).toFixed(1)} ${(ky - h).toFixed(1)}, ${(kx + w).toFixed(1)} ${(ky - h * 0.35).toFixed(1)}, ${(kx + w).toFixed(1)} ${ky.toFixed(1)}` +
        ` C${(kx + w).toFixed(1)} ${(ky + h * 0.35).toFixed(1)}, ${(kx + w * 0.25).toFixed(1)} ${(ky + h).toFixed(1)}, ${kx.toFixed(1)} ${ky.toFixed(1)}`
      );
    }

    // Top-left → dense hero pile → curved side run → horizontal → bowtie → footer
    function buildPath(docWidth, docHeight, scrollY) {
      const margin = Math.max(20, docWidth * 0.035);
      const sideX = docWidth - Math.max(40, docWidth * 0.08);
      const leftX = margin + 6;
      const hero = document.querySelector('#top');
      const knot = document.querySelector('#thread-knot');
      const footer = document.querySelector('footer');
      const close = document.querySelector('#closing-visual');
      const heroTop = yOf(hero, scrollY);
      const heroH = heightOf(hero);
      const knotTop = yOf(knot, scrollY) || docHeight * 0.92;
      const footerTop = yOf(footer, scrollY) || docHeight - 80;
      const closeY = yOf(close, scrollY) + heightOf(close) * 0.5;

      const anchors = [...document.querySelectorAll('[data-thread-anchor]')].filter(
        (el) => !['top', 'thread-knot', 'closing-visual'].includes(el.id)
      );

      const pts = [];
      pts.push({ x: leftX, y: 0 });
      pts.push({ x: leftX + docWidth * 0.04, y: heroTop + heroH * 0.08 });
      pts.push({ x: docWidth * 0.22, y: heroTop + heroH * 0.14 });
      pts.push({ x: docWidth * 0.38, y: heroTop + heroH * 0.2 });

      // Close-up thread pile concentrated upper-right of the green hero
      const cx = docWidth * 0.68;
      const cy = heroTop + heroH * 0.34;
      const rx = docWidth * 0.2;
      const ry = heroH * 0.2;
      pushThreadPile(pts, cx, cy, rx, ry);

      // Unspool toward the side with more flowing curves
      pts.push({ x: cx + rx * 0.4, y: cy + ry * 0.85 });
      pts.push({ x: docWidth * 0.82, y: heroTop + heroH * 0.62 });
      pts.push({ x: sideX - docWidth * 0.04, y: heroTop + heroH * 0.78 });
      pts.push({ x: sideX, y: heroTop + heroH * 0.94 });

      anchors.forEach((el, index) => {
        const top = yOf(el, scrollY);
        const h = heightOf(el);
        const swingIn = index % 2 === 0 ? -docWidth * 0.06 : -docWidth * 0.02;
        const swingOut = index % 2 === 0 ? -docWidth * 0.02 : docWidth * 0.01;
        pts.push({
          x: clamp(sideX + swingIn, docWidth * 0.7, docWidth - margin),
          y: clamp(top + h * 0.15, 0, docHeight - 40)
        });
        pts.push({
          x: clamp(sideX + swingOut, docWidth * 0.74, docWidth - margin),
          y: clamp(top + h * 0.42, 0, docHeight - 35)
        });
        pts.push({
          x: clamp(sideX + swingIn * 0.5, docWidth * 0.72, docWidth - margin),
          y: clamp(top + h * 0.72, 0, docHeight - 30)
        });
      });

      pts.push({ x: sideX, y: closeY });
      const lineY = clamp(knotTop + 36, closeY + 28, footerTop - 56);
      const kx = docWidth * 0.5;

      // Sweep from the side into the right edge of the break-line
      pts.push({ x: docWidth * 0.86, y: lineY - 12 });
      pts.push({ x: docWidth - margin, y: lineY });

      let d = pointsToSmoothPath(pts, 0.82);
      // Edge-to-edge horizontal, then settle at centre for the knot
      d += ` L${margin.toFixed(1)} ${lineY.toFixed(1)}`;
      d += ` L${kx.toFixed(1)} ${lineY.toFixed(1)}`;
      d = appendBowtie(d, kx, lineY, Math.max(72, docWidth * 0.055));
      d += ` C${kx.toFixed(1)} ${(lineY + 40).toFixed(1)}, ${(docWidth * 0.6).toFixed(1)} ${(footerTop + 16).toFixed(1)}, ${(docWidth * 0.72).toFixed(1)} ${(footerTop + 48).toFixed(1)}`;

      return d;
    }

    function setDraw(progress) {
      const p = clamp(progress, 0, 1);
      path.style.strokeDashoffset = String(pathLength * (1 - p));
      if (progressFill) progressFill.style.width = `${(p * 100).toFixed(2)}%`;
    }

    function viewportProgress() {
      const nodes = [...document.querySelectorAll('[data-thread-anchor]')];
      if (!nodes.length) return 0;
      const viewMid = window.scrollY + window.innerHeight * 0.72;
      const weightFor = (el) => {
        const key = el.getAttribute('data-thread-anchor') || '';
        if (key === 'hero') return 6.5;
        if (key === 'gallery') return 1.4;
        if (key === 'closing' || key === 'knot' || key === 'footer') return 1.8;
        return 1;
      };
      let total = 0;
      let gained = 0;
      nodes.forEach((el) => {
        const w = weightFor(el);
        total += w;
        const top = yOf(el, window.scrollY);
        const span = Math.max(heightOf(el) * 0.55, 80);
        const local = clamp((viewMid - top) / span, 0, 1);
        gained += w * local;
      });
      const raw = clamp(gained / total, 0, 1);
      const hero = document.querySelector('#top');
      const heroBottom = yOf(hero, window.scrollY) + heightOf(hero);
      const stillInHero = window.scrollY + window.innerHeight * 0.55 < heroBottom;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const nearEnd = window.scrollY / maxScroll > 0.96;
      // Show the dense pile in-hero; snap complete near the footer knot
      if (nearEnd) return 1;
      return clamp(stillInHero ? Math.max(raw, 0.4) : raw, 0, 1);
    }

    function layout() {
      const scrollY = window.scrollY || 0;
      const docWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const main = document.querySelector('#main');
      const docHeight = Math.max(
        main ? main.scrollHeight : 0,
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

      layer.style.height = `${docHeight}px`;
      svg.setAttribute('viewBox', `0 0 ${docWidth} ${docHeight}`);
      svg.setAttribute('width', String(docWidth));
      svg.setAttribute('height', String(docHeight));

      const stroke = docWidth < 700 ? 3.6 : docWidth < 1100 ? 4.6 : 5.4;
      path.setAttribute('stroke-width', String(stroke));
      path.setAttribute('d', buildPath(docWidth, docHeight, scrollY));

      pathLength = Math.max(path.getTotalLength(), 1);
      path.style.strokeDasharray = `${pathLength} ${pathLength}`;

      if (reduceMotion) {
        setDraw(1);
        return;
      }

      if (scrollTrigger) {
        scrollTrigger.kill();
        scrollTrigger = null;
      }

      let paint = (value) => setDraw(value);
      if (gsapReady) {
        const state = { t: viewportProgress() };
        paint = window.gsap.quickTo(state, 't', {
          duration: 0.22,
          ease: 'power2.out',
          onUpdate: () => setDraw(state.t)
        });
        scrollTrigger = window.ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate() {
            paint(viewportProgress());
          }
        });
        window.ScrollTrigger.refresh();
      }
      paint(viewportProgress());
      layer._paintThread = paint;
    }

    function syncProgress() {
      const paint = layer._paintThread || setDraw;
      paint(viewportProgress());
    }

    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        layout();
        if (gsapReady) window.ScrollTrigger.refresh();
        syncProgress();
      }, 90);
    }

    layout();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', syncProgress, { passive: true });
    window.addEventListener('hashchange', () => requestAnimationFrame(syncProgress));
    window.addEventListener('load', () => {
      layout();
      if (gsapReady) window.ScrollTrigger.refresh();
      syncProgress();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        layout();
        if (gsapReady) window.ScrollTrigger.refresh();
        syncProgress();
      }).catch(() => {});
    }
  }

  function start() {
    bootThread();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    setTimeout(start, 0);
  }
})();
