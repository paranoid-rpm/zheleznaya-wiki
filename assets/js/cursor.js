// ЖЕЛЕЗНАЯ ВИКИ — Custom fist cursor + crack effect on click
(function () {
  'use strict';

  /* ── 1. INJECT CSS ─────────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after { cursor: none !important; }

    #fist-cursor {
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      width: 48px;
      height: 48px;
      transform: translate(-12px, -6px);
      transition: transform 0.05s linear;
      filter: drop-shadow(0 2px 6px rgba(198,40,40,0.5));
      will-change: left, top;
    }

    #fist-cursor.punch {
      animation: fist-punch 0.22s ease-out forwards;
    }

    @keyframes fist-punch {
      0%   { transform: translate(-12px,-6px) scale(1)   rotate(0deg); }
      30%  { transform: translate(-12px,4px)  scale(1.35) rotate(-8deg); filter: drop-shadow(0 4px 12px rgba(198,40,40,0.9)); }
      60%  { transform: translate(-12px,2px)  scale(1.15) rotate(-4deg); }
      100% { transform: translate(-12px,-6px) scale(1)   rotate(0deg); }
    }

    .crack-canvas {
      position: fixed;
      pointer-events: none;
      z-index: 99998;
      top: 0; left: 0;
      width: 100%; height: 100%;
    }
  `;
  document.head.appendChild(style);

  /* ── 2. CURSOR ELEMENT ─────────────────────────────────────────────────── */
  // SVG: relaxed open hand (default) — switches to fist on punch
  const cursorEl = document.createElement('div');
  cursorEl.id = 'fist-cursor';

  // Default: flexed arm / open hand emoji-style SVG
  const svgHand = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <!-- arm/bicep -->
    <rect x="18" y="28" width="12" height="16" rx="5" fill="#FFCC80"/>
    <!-- fist body -->
    <rect x="12" y="14" width="24" height="18" rx="7" fill="#FFCC80"/>
    <!-- knuckle lines -->
    <line x1="16" y1="14" x2="16" y2="22" stroke="#E0A060" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="22" y1="13" x2="22" y2="21" stroke="#E0A060" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="28" y1="14" x2="28" y2="22" stroke="#E0A060" stroke-width="1.5" stroke-linecap="round"/>
    <!-- thumb -->
    <ellipse cx="11" cy="20" rx="4" ry="6" fill="#FFCC80"/>
    <!-- red accent ring -->
    <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(198,40,40,0.25)" stroke-width="1"/>
  </svg>`;

  // Punch: clenched fist going down
  const svgFist = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <!-- arm -->
    <rect x="18" y="28" width="12" height="16" rx="5" fill="#FFCC80"/>
    <!-- fist tighter -->
    <rect x="11" y="16" width="26" height="16" rx="6" fill="#FFCC80"/>
    <!-- knuckle bumps -->
    <ellipse cx="16" cy="16" rx="3.5" ry="3" fill="#F0B060"/>
    <ellipse cx="22" cy="15" rx="3.5" ry="3" fill="#F0B060"/>
    <ellipse cx="28" cy="15" rx="3.5" ry="3" fill="#F0B060"/>
    <ellipse cx="34" cy="16" rx="3"   ry="2.5" fill="#F0B060"/>
    <!-- thumb tucked -->
    <ellipse cx="10" cy="22" rx="3.5" ry="5" fill="#FFCC80"/>
    <!-- impact glow -->
    <circle cx="24" cy="22" r="22" fill="none" stroke="rgba(198,40,40,0.5)" stroke-width="2"/>
  </svg>`;

  cursorEl.innerHTML = svgHand;
  document.body.appendChild(cursorEl);

  /* ── 3. TRACK MOUSE ────────────────────────────────────────────────────── */
  let mx = -200, my = -200;
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursorEl.style.left = mx + 'px';
    cursorEl.style.top  = my + 'px';
  });

  /* ── 4. CRACK CANVAS ───────────────────────────────────────────────────── */
  const crackCanvas = document.createElement('canvas');
  crackCanvas.className = 'crack-canvas';
  document.body.appendChild(crackCanvas);
  const cctx = crackCanvas.getContext('2d');

  function resizeCrack() {
    crackCanvas.width  = window.innerWidth;
    crackCanvas.height = window.innerHeight;
  }
  resizeCrack();
  window.addEventListener('resize', resizeCrack);

  // Draw a spiderweb crack at (cx, cy)
  function drawCrack(cx, cy) {
    const arms    = 10 + Math.floor(Math.random() * 6);   // 10–15 arms
    const maxLen  = 80 + Math.random() * 80;              // 80–160px
    const angleStep = (Math.PI * 2) / arms;

    cctx.save();
    cctx.shadowColor = 'rgba(198,40,40,0.7)';
    cctx.shadowBlur  = 8;

    for (let i = 0; i < arms; i++) {
      const baseAngle = angleStep * i + (Math.random() - 0.5) * angleStep * 0.6;
      let x = cx, y = cy;
      let angle = baseAngle;
      const len  = maxLen * (0.4 + Math.random() * 0.6);
      const segs = 4 + Math.floor(Math.random() * 4);
      const segLen = len / segs;

      cctx.beginPath();
      cctx.moveTo(x, y);

      for (let s = 0; s < segs; s++) {
        angle += (Math.random() - 0.5) * 0.5;
        x += Math.cos(angle) * segLen;
        y += Math.sin(angle) * segLen;
        cctx.lineTo(x, y);

        // branch: 40% chance
        if (Math.random() < 0.4) {
          const bx = x, by = y;
          const bAngle = angle + (Math.random() - 0.5) * 1.2;
          const bLen   = segLen * (0.4 + Math.random() * 0.5);
          cctx.moveTo(bx, by);
          cctx.lineTo(
            bx + Math.cos(bAngle) * bLen,
            by + Math.sin(bAngle) * bLen
          );
          cctx.moveTo(x, y);
        }
      }

      const grad = cctx.createLinearGradient(cx, cy, x, y);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.4, 'rgba(198,40,40,0.7)');
      grad.addColorStop(1, 'rgba(198,40,40,0)');

      cctx.strokeStyle = grad;
      cctx.lineWidth   = 0.8 + Math.random() * 1.2;
      cctx.lineCap     = 'round';
      cctx.stroke();
    }

    // center impact circle
    const radGrad = cctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
    radGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
    radGrad.addColorStop(0.3, 'rgba(198,40,40,0.6)');
    radGrad.addColorStop(1, 'rgba(198,40,40,0)');
    cctx.beginPath();
    cctx.arc(cx, cy, 18, 0, Math.PI * 2);
    cctx.fillStyle = radGrad;
    cctx.fill();

    cctx.restore();

    // fade out the crack after 1.5s
    let alpha = 1;
    const fade = setInterval(() => {
      alpha -= 0.03;
      if (alpha <= 0) { clearInterval(fade); return; }
      // We redraw on top with erasing — simplest: store & re-draw all
      // Instead: fade by drawing a semi-transparent rect over entire canvas
    }, 50);
  }

  // Store all cracks so we can redraw & fade
  const cracks = [];

  function animateCracks() {
    cctx.clearRect(0, 0, crackCanvas.width, crackCanvas.height);
    const now = Date.now();
    for (let i = cracks.length - 1; i >= 0; i--) {
      const c = cracks[i];
      const elapsed = now - c.time;
      const duration = 1800; // ms to fully fade
      if (elapsed > duration) { cracks.splice(i, 1); continue; }
      const alpha = 1 - elapsed / duration;
      cctx.save();
      cctx.globalAlpha = alpha;
      drawCrackImmediate(c.x, c.y);
      cctx.restore();
    }
    requestAnimationFrame(animateCracks);
  }

  // Seeded crack so same crack re-draws on each frame
  function drawCrackImmediate(cx, cy, seed) {
    // deterministic with seed
    const rng = seed ? seededRng(seed) : Math.random;
    const arms   = 10 + Math.floor(rng() * 6);
    const maxLen = 80 + rng() * 80;
    const step   = (Math.PI * 2) / arms;

    for (let i = 0; i < arms; i++) {
      const ba = step * i + (rng() - 0.5) * step * 0.6;
      let x = cx, y = cy, angle = ba;
      const len  = maxLen * (0.4 + rng() * 0.6);
      const segs = 4 + Math.floor(rng() * 4);
      const sl   = len / segs;

      cctx.beginPath();
      cctx.moveTo(x, y);
      for (let s = 0; s < segs; s++) {
        angle += (rng() - 0.5) * 0.5;
        x += Math.cos(angle) * sl;
        y += Math.sin(angle) * sl;
        cctx.lineTo(x, y);
        if (rng() < 0.4) {
          const bAngle = angle + (rng() - 0.5) * 1.2;
          const bLen   = sl * (0.4 + rng() * 0.5);
          cctx.moveTo(x, y);
          cctx.lineTo(x + Math.cos(bAngle) * bLen, y + Math.sin(bAngle) * bLen);
          cctx.moveTo(x, y);
        }
      }
      const g = cctx.createLinearGradient(cx, cy, x, y);
      g.addColorStop(0,   'rgba(255,255,255,0.9)');
      g.addColorStop(0.4, 'rgba(198,40,40,0.7)');
      g.addColorStop(1,   'rgba(198,40,40,0)');
      cctx.strokeStyle = g;
      cctx.lineWidth   = 0.8 + rng() * 1.2;
      cctx.lineCap     = 'round';
      cctx.shadowColor = 'rgba(198,40,40,0.6)';
      cctx.shadowBlur  = 6;
      cctx.stroke();
    }
    // center glow
    const rg = cctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
    rg.addColorStop(0,   'rgba(255,255,255,0.95)');
    rg.addColorStop(0.3, 'rgba(198,40,40,0.6)');
    rg.addColorStop(1,   'rgba(198,40,40,0)');
    cctx.beginPath();
    cctx.arc(cx, cy, 18, 0, Math.PI * 2);
    cctx.fillStyle = rg;
    cctx.fill();
  }

  function seededRng(seed) {
    let s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  animateCracks();

  /* ── 5. CLICK HANDLER ──────────────────────────────────────────────────── */
  document.addEventListener('click', e => {
    // punch animation
    cursorEl.innerHTML = svgFist;
    cursorEl.classList.remove('punch');
    void cursorEl.offsetWidth; // reflow
    cursorEl.classList.add('punch');

    // shake screen
    document.body.style.transition = 'transform 0.1s';
    document.body.style.transform  = `translate(${(Math.random()-0.5)*6}px,${(Math.random()-0.5)*6}px)`;
    setTimeout(() => { document.body.style.transform = ''; }, 100);

    // crack
    const seed = Date.now();
    cracks.push({ x: e.clientX, y: e.clientY, time: Date.now(), seed });

    // restore hand icon
    setTimeout(() => {
      cursorEl.innerHTML = svgHand;
      cursorEl.classList.remove('punch');
    }, 250);
  });

  /* ── 6. HIDE CURSOR WHEN OUT OF WINDOW ────────────────────────────────── */
  document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursorEl.style.opacity = '1'; });

})();
