// Builds the star field and ambient particles once on load.
// All motion is CSS-driven; nothing here runs on a timer or touches the DOM again.
(() => {
  'use strict';

  const starLayer = document.getElementById('stars');
  const particleLayer = document.getElementById('particles');
  if (!starLayer || !particleLayer) return;

  const rand = (min, max) => min + Math.random() * (max - min);
  const fixed = (n, digits = 2) => +n.toFixed(digits);

  // 50–90 stars depending on screen area.
  const w = window.innerWidth;
  const h = window.innerHeight;
  const count = Math.max(50, Math.min(90, Math.round((w * h) / 16000)));

  // Jittered grid: random but evenly spread, so stars never clump or leave holes.
  const cols = Math.ceil(Math.sqrt((count * w) / h));
  const rows = Math.ceil(count / cols);
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push([c, r]);
  }
  cells.sort(() => Math.random() - 0.5);

  const stars = document.createDocumentFragment();
  cells.slice(0, count).forEach(([c, r]) => {
    const star = document.createElement('span');
    const roll = Math.random();
    const size = roll < 0.72 ? rand(1, 1.4) : roll < 0.94 ? rand(1.5, 2) : rand(2, 2.4);
    const peak = fixed(Math.min(0.95, 0.45 + size * 0.2 + rand(0, 0.3)));
    const dur = rand(3, 8);

    star.className = 'star';
    if (Math.random() < 0.4) star.classList.add('star--soft');
    if (Math.random() < 0.12) star.classList.add('star--warm');
    else if (Math.random() < 0.15) star.classList.add('star--cool');
    if (size > 2) star.classList.add('star--glow');

    star.style.cssText =
      `--x:${fixed(((c + rand(0.1, 0.9)) / cols) * 100)}%;` +
      `--y:${fixed(((r + rand(0.1, 0.9)) / rows) * 100)}%;` +
      `--s:${fixed(size)}px;--o:${peak};--lo:${fixed(peak * rand(0.15, 0.4))};` +
      `--dur:${fixed(dur)}s;--delay:${fixed(-rand(0, dur))}s`;
    stars.appendChild(star);
  });
  starLayer.appendChild(stars);

  // A handful of faint glowing particles drifting very slowly.
  const particles = document.createDocumentFragment();
  const particleCount = w < 600 ? 5 : 8;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.cssText =
      `--x:${fixed(rand(5, 95))}%;--y:${fixed(rand(5, 95))}%;` +
      `--s:${fixed(rand(14, 34))}px;--o:${fixed(rand(0.25, 0.5))};` +
      `--dx:${fixed(rand(-30, 30))}px;--dy:${fixed(rand(-40, 40))}px;` +
      `--dur:${fixed(rand(16, 30))}s;--delay:${fixed(-rand(0, 16))}s`;
    particles.appendChild(p);
  }
  particleLayer.appendChild(particles);
})();
