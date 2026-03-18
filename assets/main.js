// Canvas фон — частицы в стиле «нейронная сеть в зале»
(function () {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles;
  var dpr = window.devicePixelRatio || 1;

  function resize() {
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    init();
  }

  function init() {
    var count = Math.floor((W * H) / (90000 * dpr));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: (1 + Math.random() * 1.5) * dpr,
        vx: (Math.random() - 0.5) * 0.35 * dpr,
        vy: (Math.random() - 0.5) * 0.35 * dpr
      });
    }
  }

  function draw() {
    if (!ctx || !particles) return;
    ctx.clearRect(0, 0, W, H);
    var maxD = 130 * dpr;
    var maxD2 = maxD * maxD;

    ctx.strokeStyle = 'rgba(229,57,53,0.18)';
    ctx.lineWidth = 0.7 * dpr;

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d2 = dx * dx + dy * dy;
        if (d2 < maxD2) {
          ctx.globalAlpha = (1 - d2 / maxD2) * 0.65;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(229,57,53,0.55)';
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();
