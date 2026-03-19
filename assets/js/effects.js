// ЖЕЛЕЗНАЯ ВИКИ — Visual Effects
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     1. AUTO SCROLL-REVEAL — авто-привязка .reveal ко всем карточкам
  ───────────────────────────────────────────────────────────────── */
  function initReveal() {
    const selectors = [
      '.wiki-card', '.fact-card', '.joke-card', '.video-card',
      '.card', '.exercise-card', '.nutrition-card', '.myth-card',
      '.section-header', '.section', '.cards-grid', '.facts-grid',
      '.jokes-grid', '.video-grid', '.hero-stats .stat'
    ];
    const els = document.querySelectorAll(selectors.join(','));
    els.forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        // stagger delay for grid children
        const delay = Math.min(i % 6 * 80, 400);
        el.style.transitionDelay = delay + 'ms';
      }
    });

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ─────────────────────────────────────────────────────────────────
     2. GLITCH EFFECT — заголовок периодически гличит
  ───────────────────────────────────────────────────────────────── */
  function initGlitch() {
    // Навешиваем CSS глич на .hero-title
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const style = document.createElement('style');
    style.textContent = `
      .hero-title {
        position: relative;
      }
      .hero-title.glitching::before,
      .hero-title.glitching::after {
        content: attr(data-text);
        position: absolute;
        left: 0; top: 0;
        width: 100%;
        pointer-events: none;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        text-transform: inherit;
        letter-spacing: inherit;
        white-space: pre-wrap;
      }
      .hero-title.glitching::before {
        color: rgba(198,40,40,0.85);
        transform: translate(-3px, -1px) skewX(-1deg);
        mix-blend-mode: screen;
        clip-path: polygon(0 15%, 100% 15%, 100% 40%, 0 40%);
        animation: glitch-clip-1 0.15s steps(2,end) both;
      }
      .hero-title.glitching::after {
        color: rgba(0,200,255,0.7);
        transform: translate(3px, 1px) skewX(1deg);
        mix-blend-mode: screen;
        clip-path: polygon(0 60%, 100% 60%, 100% 85%, 0 85%);
        animation: glitch-clip-2 0.15s steps(2,end) both;
      }
      @keyframes glitch-clip-1 {
        0%   { clip-path: polygon(0 0%, 100% 0%, 100% 20%, 0 20%); transform: translate(-4px,-1px) skewX(-2deg); }
        50%  { clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%); transform: translate(-2px,2px) skewX(1deg); }
        100% { clip-path: polygon(0 80%, 100% 80%, 100% 100%, 0 100%); transform: translate(-3px,-1px) skewX(-1deg); }
      }
      @keyframes glitch-clip-2 {
        0%   { clip-path: polygon(0 70%, 100% 70%, 100% 90%, 0 90%); transform: translate(4px,1px) skewX(2deg); }
        50%  { clip-path: polygon(0 20%, 100% 20%, 100% 50%, 0 50%); transform: translate(2px,-2px) skewX(-1deg); }
        100% { clip-path: polygon(0 10%, 100% 10%, 100% 30%, 0 30%); transform: translate(3px,1px) skewX(1deg); }
      }
    `;
    document.head.appendChild(style);

    // data-text для pseudo-content
    heroTitle.dataset.text = heroTitle.textContent.trim();

    // Запуск глича периодически (каждые 4–8 секунд)
    function triggerGlitch() {
      heroTitle.classList.add('glitching');
      setTimeout(() => heroTitle.classList.remove('glitching'), 200);
      // иногда двойной глич
      if (Math.random() > 0.6) {
        setTimeout(() => {
          heroTitle.classList.add('glitching');
          setTimeout(() => heroTitle.classList.remove('glitching'), 120);
        }, 300);
      }
      const nextIn = 4000 + Math.random() * 6000;
      setTimeout(triggerGlitch, nextIn);
    }

    setTimeout(triggerGlitch, 2000 + Math.random() * 2000);
  }

  /* ─────────────────────────────────────────────────────────────────
     3. PARALLAX — фон canvas движется медленнее при скролле
  ───────────────────────────────────────────────────────────────── */
  function initParallax() {
    const bgCanvas = document.getElementById('bgCanvas');
    const hero = document.querySelector('.hero');
    if (!bgCanvas || !hero) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // фон движется на 30% от скорости скролла
          bgCanvas.style.transform = `translateY(${scrollY * 0.3}px)`;
          // hero контент чуть медленнее
          hero.style.transform = `translateY(${scrollY * 0.12}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────────────
     4. SCROLL-TO-TOP — кнопка-кулак в правом нижнем углу
  ───────────────────────────────────────────────────────────────── */
  function initScrollTop() {
    const btn = document.createElement('button');
    btn.id = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Наверх');
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28" height="28">
        <rect x="11" y="16" width="26" height="16" rx="6" fill="#FFCC80"/>
        <ellipse cx="11" cy="22" rx="4" ry="5.5" fill="#FFCC80"/>
        <ellipse cx="15" cy="16" rx="3.5" ry="3" fill="#F0B060"/>
        <ellipse cx="21" cy="15" rx="3.5" ry="3" fill="#F0B060"/>
        <ellipse cx="27" cy="15" rx="3.5" ry="3" fill="#F0B060"/>
        <ellipse cx="33" cy="16" rx="3" ry="2.5" fill="#F0B060"/>
        <path d="M24 10 L20 16 L28 16 Z" fill="#c62828"/>
      </svg>
    `;
    document.body.appendChild(btn);

    const style = document.createElement('style');
    style.textContent = `
      #scroll-top-btn {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 9999;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: #1a1f28;
        border: 2px solid rgba(198,40,40,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(198,40,40,0.3);
        opacity: 0;
        transform: translateY(20px) scale(0.8);
        transition: opacity 0.3s, transform 0.3s, box-shadow 0.2s, border-color 0.2s;
        pointer-events: none;
      }
      #scroll-top-btn.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      #scroll-top-btn:hover {
        border-color: rgba(198,40,40,0.9);
        box-shadow: 0 6px 28px rgba(198,40,40,0.55);
        transform: translateY(-2px) scale(1.08);
      }
      #scroll-top-btn.punch-anim {
        animation: scroll-btn-punch 0.3s ease-out;
      }
      @keyframes scroll-btn-punch {
        0%   { transform: translateY(0) scale(1); }
        30%  { transform: translateY(-8px) scale(1.2) rotate(-10deg); }
        60%  { transform: translateY(-4px) scale(1.1) rotate(-5deg); }
        100% { transform: translateY(0) scale(1) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      btn.classList.remove('punch-anim');
      void btn.offsetWidth;
      btn.classList.add('punch-anim');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
      btn.addEventListener('animationend', () => btn.classList.remove('punch-anim'), { once: true });
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     5. HOVER GLOW on cards
  ───────────────────────────────────────────────────────────────── */
  function initCardGlow() {
    const cards = document.querySelectorAll('.wiki-card, .fact-card, .card, .exercise-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        card.style.setProperty('--glow-x', x + '%');
        card.style.setProperty('--glow-y', y + '%');
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(198,40,40,0.07) 0%, var(--surface) 60%)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     INIT ALL
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initGlitch();
    initParallax();
    initScrollTop();
    initCardGlow();
  });

})();
