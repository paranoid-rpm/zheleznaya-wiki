// ЖЕЛЕЗНАЯ ВИКИ — Main JS
document.addEventListener('DOMContentLoaded', function () {

  // ===== BURGER MENU =====
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.main-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      burger.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
  }

  // ===== ACTIVE NAV LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .sidebar a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(el => observer.observe(el));
  }

  // ===== MYTH / FAQ ACCORDION =====
  document.querySelectorAll('.myth-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.myth-card');
      const isOpen = card.classList.contains('open');
      // close all
      document.querySelectorAll('.myth-card.open').forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    });
  });

  // ===== EXERCISE FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const exerciseCards = document.querySelectorAll('.exercise-card[data-group]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const group = btn.dataset.filter;
      exerciseCards.forEach(card => {
        if (group === 'all' || card.dataset.group === group) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== COUNTER ANIMATION =====
  function animateCount(el, target, suffix) {
    let start = 0;
    const duration = 1600;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            animateCount(el, parseInt(el.dataset.target), el.dataset.suffix || '');
            statsObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNums.forEach(el => statsObserver.observe(el));
  }

  // ===== TICKER DUPLICATE (for seamless loop) =====
  const ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML;
  }

});
