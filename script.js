// Builds the star field and ambient particles once on load.
// All motion is CSS-driven: no timers, no listeners, no further DOM updates.
(() => {
  'use strict';

  const starLayer = document.getElementById('stars');
  const particleLayer = document.getElementById('particles');
  if (!starLayer || !particleLayer) return;

  const rand = (min, max) => min + Math.random() * (max - min);
  const fixed = (n, digits = 2) => +n.toFixed(digits);

  const w = window.innerWidth;
  const h = window.innerHeight;

  // 50–90 stars, scaled to screen area.
  const starCount = Math.max(50, Math.min(90, Math.round((w * h) / 16000)));

  // Keep the area behind the logo quiet: candidates inside this ellipse are
  // penalised, so stars thin out toward the centre instead of vanishing.
  const cx = w / 2;
  const cy = h * 0.47;
  const rx = Math.min(w * 0.3, 340);
  const ry = Math.min(h * 0.3, 260);
  const quietness = (x, y) => {
    const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
    const t = Math.min(1, Math.max(0, (d - 0.5) / 0.9));
    return 0.25 + 0.75 * t * t * (3 - 2 * t);
  };

  // Best-candidate sampling: for each star, try a handful of random spots and
  // keep the one farthest from existing stars. Gives an even, natural scatter
  // with no grid artefacts and no clumps.
  const points = [];
  const attempts = 14;
  for (let i = 0; i < starCount; i++) {
    let best = null;
    let bestScore = -1;
    for (let k = 0; k < attempts; k++) {
      const x = rand(0, w);
      const y = rand(0, h);
      let nearest = Infinity;
      for (const p of points) {
        const d = Math.hypot(p[0] - x, p[1] - y);
        if (d < nearest) nearest = d;
      }
      const score = (points.length ? nearest : 1) * quietness(x, y);
      if (score > bestScore) { bestScore = score; best = [x, y]; }
    }
    points.push(best);
  }

  const stars = document.createDocumentFragment();
  for (const [x, y] of points) {
    const star = document.createElement('span');
    const size = 0.8 + Math.pow(Math.random(), 3) * 1.8;   // mostly tiny, a few larger
    const peak = Math.min(0.95, 0.5 + size * 0.2 + rand(0, 0.25));
    const dur = rand(3.5, 9);

    star.className = 'star';
    if (Math.random() < 0.6) {                              // the rest stay calm
      star.classList.add('star--twinkle');
      if (Math.random() < 0.4) star.classList.add('star--soft');
    }
    const tint = Math.random();
    if (tint < 0.1) star.classList.add('star--warm');
    else if (tint < 0.25) star.classList.add('star--cool');
    if (size > 2.1) star.classList.add('star--glow');

    star.style.cssText =
      `--x:${fixed((x / w) * 100)}%;--y:${fixed((y / h) * 100)}%;` +
      `--s:${fixed(size)}px;--o:${fixed(peak)};--lo:${fixed(peak * rand(0.2, 0.5))};` +
      `--dur:${fixed(dur)}s;--delay:${fixed(-rand(0, dur))}s`;
    stars.appendChild(star);
  }
  starLayer.appendChild(stars);

  // A few faint teal particles drifting very slowly, kept off the logo.
  const particles = document.createDocumentFragment();
  const particleCount = w < 600 ? 5 : 7;
  for (let i = 0; i < particleCount; i++) {
    let x, y;
    do {
      x = rand(0.04, 0.96) * w;
      y = rand(0.04, 0.96) * h;
    } while (quietness(x, y) < 0.7);

    const p = document.createElement('span');
    p.className = 'particle';
    p.style.cssText =
      `--x:${fixed((x / w) * 100)}%;--y:${fixed((y / h) * 100)}%;` +
      `--s:${fixed(rand(14, 32))}px;--o:${fixed(rand(0.25, 0.5))};` +
      `--dx:${fixed(rand(-28, 28))}px;--dy:${fixed(rand(-36, 36))}px;` +
      `--dur:${fixed(rand(18, 32))}s;--delay:${fixed(-rand(0, 18))}s`;
    particles.appendChild(p);
  }
  particleLayer.appendChild(particles);

  // Retire the static CSS fallback stars now that the real ones exist.
  document.documentElement.classList.add('has-stars');
})();
