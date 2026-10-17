(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const f = (v) => v.toFixed(1);
  const $ = (s, root) => (root || document).querySelector(s);
  const $$ = (s, root) => [...(root || document).querySelectorAll(s)];

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

  /* ------------------------------------------------------- Curve helpers */
  const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

  // Centripetal Catmull-Rom → cubic Béziers. No cusps, no overshoot, smooth through uneven spacing.
  function smoothPath(points) {
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
      const b1x = (d1 * d1 * p2.x - d2 * d2 * p0.x + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.x) / (3 * d1 * (d1 + d2));
      const b1y = (d1 * d1 * p2.y - d2 * d2 * p0.y + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.y) / (3 * d1 * (d1 + d2));
      const b2x = (d3 * d3 * p1.x - d2 * d2 * p3.x + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.x) / (3 * d3 * (d3 + d2));
      const b2y = (d3 * d3 * p1.y - d2 * d2 * p3.y + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.y) / (3 * d3 * (d3 + d2));
      d += ` C${f(b1x)} ${f(b1y)}, ${f(b2x)} ${f(b2y)}, ${f(p2.x)} ${f(p2.y)}`;
    }
    return d;
  }

  // Three long, nearly horizontal wraps cross the full card before returning
  // to its centre. This is the flat tied-card silhouette from the sketch.
  function flatWrapPath(kx, ky, left, right) {
    const span = right - left;
    const rise = clamp(span * 0.015, 6, 20);
    return (
      ` L${f(right)} ${f(ky)}` +
      ` C${f(right - span * 0.24)} ${f(ky + rise)}, ${f(left + span * 0.3)} ${f(ky - rise)}, ${f(left)} ${f(ky + 2)}` +
      ` C${f(left + span * 0.28)} ${f(ky - rise)}, ${f(right - span * 0.24)} ${f(ky + rise)}, ${f(right)} ${f(ky - 2)}` +
      ` C${f(right - span * 0.2)} ${f(ky - rise)}, ${f(kx + span * 0.12)} ${f(ky + rise)}, ${f(kx)} ${f(ky)}`
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
      // Two short cut ends; no vertical post or plus sign
      ` M${f(kx - s * 0.22)} ${f(ky + s * 0.12)} C${f(kx - w * 0.34)} ${f(ky + h * 0.42)}, ${f(kx - w * 0.6)} ${f(ky + h * 0.7)}, ${f(kx - w * 0.88)} ${f(ky + h * 0.82)}` +
      ` M${f(kx + s * 0.22)} ${f(ky + s * 0.12)} C${f(kx + w * 0.34)} ${f(ky + h * 0.42)}, ${f(kx + w * 0.6)} ${f(ky + h * 0.7)}, ${f(kx + w * 0.88)} ${f(ky + h * 0.82)}`
    );
  }

  /* ------------------------------------------------------------ The thread */
  function bootThread() {
    const under = $('#thread-svg');
    const over = $('#thread-svg-over');
    const paths = [$('#thread-path'), $('#thread-shadow'), $('#thread-path-over')];
    const clip = $('#overClip');
    const fill = $('#thread-progress-fill');
    const hero = $('#top');
    const title = $('#hero-title');
    const main = $('#main');
    if (!under || !over || !hero || !title || paths.some((p) => !p)) return;

    const layers = $$('.thread-layer');
    const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (gsapReady) window.gsap.registerPlugin(window.ScrollTrigger);

    let total = 1;
    let lookup = [];
    let lookupStep = 10;
    const state = { drawn: 0 };
    let paint = null;
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

    // Flattened S inside the gap between sections: rail → rounded corner → across → corner → other rail
    function crossOver(pts, fromX, toX, crossY, R) {
      const dir = toX > fromX ? 1 : -1;
      const bend = Math.min(Math.abs(toX - fromX) * 0.12, 90);
      const last = pts[pts.length - 1];
      if (!last || last.y < crossY - 110) pts.push({ x: fromX, y: crossY - 70 });
      pts.push({ x: fromX + dir * bend, y: crossY });
      pts.push({ x: toX - dir * bend, y: crossY });
      pts.push({ x: toX, y: crossY + 70 });
      pts.push({ x: toX, y: crossY + 150 });
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
          const wrapRight = Math.min(W - 12, R.right);
          const tieLeft = wrapLeft + clamp(W * 0.04, 28, 62);

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
          pts.push({ x: wrapLeft, y: lineY - 48 });
          pts.push({ x: wrapLeft + 12, y: lineY - 14 });
          pts.push({ x: tieLeft, y: lineY });
          bowD = flatWrapPath(kx, lineY, tieLeft, wrapRight) + bowPath(kx, lineY, bw);
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

      // Depth → length table so the tip stays at the reader's eye line
      lookupStep = Math.max(8, total / 2600);
      lookup = [];
      let maxY = 0;
      for (let l = 0; l <= total; l += lookupStep) {
        maxY = Math.max(maxY, paths[0].getPointAtLength(l).y);
        lookup.push(maxY);
      }
      if (reduceMotion) { state.drawn = total; paintNow(); return; }
      if (introDone) paintTo(target(), true);
      else if (introTween) {
        // Layout moved under the intro (fonts, iframe height): re-aim the tween at the new target
        introTween.kill();
        introTween = window.gsap.to(state, { drawn: target(), duration: 1.4, ease: 'power2.out', onUpdate: paintNow, onComplete: finishIntro });
      }
    }

    let introTween = null;
    function finishIntro() { introDone = true; introTween = null; paintTo(target()); }

    function target() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (sy() >= maxScroll - 4) return total;
      const y = sy() + window.innerHeight * 0.82;
      let lo = 0;
      let hi = lookup.length - 1;
      if (hi < 0 || lookup[0] > y) return 0;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (lookup[mid] <= y) lo = mid; else hi = mid - 1;
      }
      return Math.min(total, lo * lookupStep);
    }

    function paintNow() {
      const off = String(total - state.drawn);
      paths.forEach((p) => { p.style.strokeDashoffset = off; });
      if (fill) fill.style.width = `${((state.drawn / total) * 100).toFixed(2)}%`;
    }

    function paintTo(value, immediate) {
      if (gsapReady && !immediate) {
        if (!paint) paint = window.gsap.quickTo(state, 'drawn', { duration: 0.5, ease: 'power2.out', onUpdate: paintNow });
        paint(value);
      } else {
        state.drawn = value;
        paintNow();
      }
    }

    function intro() {
      if (reduceMotion) return;
      const to = target();
      if (gsapReady) {
        introTween = window.gsap.fromTo(state, { drawn: 0 }, {
          drawn: to, duration: 2.8, ease: 'power2.inOut', onUpdate: paintNow, onComplete: finishIntro
        });
      } else {
        state.drawn = to; paintNow(); introDone = true;
      }
    }

    let resizeTimer = 0;
    const relayout = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { layout(); if (gsapReady) window.ScrollTrigger.refresh(); }, 120);
    };

    layout();
    intro();
    if (gsapReady) {
      trigger = window.ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: () => { if (introDone) paintTo(target()); }
      });
    } else {
      window.addEventListener('scroll', () => { if (introDone) paintTo(target(), true); }, { passive: true });
    }
    window.addEventListener('resize', relayout);
    window.addEventListener('load', relayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout).catch(() => {});
    if ('ResizeObserver' in window) {
      let lastH = main.offsetHeight;
      new ResizeObserver(() => {
        const h = main.offsetHeight;
        if (Math.abs(h - lastH) > 2) { lastH = h; relayout(); }
      }).observe(main);
    }
  }

  /* -------------------------------------------- Three.js woven-cloth grain */
  function bootWeave() {
    const canvas = $('#weave-canvas');
    if (!canvas || reduceMotion || typeof window.THREE === 'undefined') return;
    if (getComputedStyle(canvas).display === 'none') return;
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
    bootThread();
    bootWeave();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
