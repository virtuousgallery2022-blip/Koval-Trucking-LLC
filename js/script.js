document.addEventListener('DOMContentLoaded', () => {
  // Splash Screen Logic
  const splashVideo = document.getElementById('splash-video');
  const videoSplash = document.getElementById('video-splash');
  const splashSeenKey = 'kovalTruckingSplashSeenThisSession';

  if (splashVideo && videoSplash) {
    const hideSplash = () => {
      videoSplash.classList.add('fade-out');
      document.body.classList.remove('no-scroll');
      sessionStorage.setItem(splashSeenKey, 'true');

      // Remove element from DOM after transition finishes
      setTimeout(() => {
        videoSplash.remove();
      }, 180);
    };

    if (sessionStorage.getItem(splashSeenKey) === 'true') {
      videoSplash.remove();
      document.body.classList.remove('no-scroll');
    } else {
      splashVideo.addEventListener('ended', hideSplash);
      splashVideo.addEventListener('error', hideSplash);
      splashVideo.addEventListener('timeupdate', () => {
        if (splashVideo.duration && splashVideo.currentTime >= splashVideo.duration - 0.7) {
          hideSplash();
        }
      });
    }
  }

  /* Mobile Menu Toggle */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks   = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      menuToggle.innerHTML = navLinks.classList.contains('show') ? '&#10005;' : '&#9776;';
    });
  }

  /* Scroll-based Fade / Slide Animations */
  const observerOptions = { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.08 };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* Staggered card children animation */
  const cardObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.feature-card, .footer-col');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('card-visible'), i * 120);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.grid, .footer-grid').forEach(grid => {
    grid.querySelectorAll('.feature-card, .footer-col').forEach(card => {
      card.classList.add('card-animate');
    });
    cardObserver.observe(grid);
  });

  /* Nav: shrink + shadow on scroll */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }, { passive: true });

  /* Stat counters (numbers on homepage) */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (!target) return;
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step  = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 24);
  }

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* Smooth hover lift on buttons */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
  });

  /* State pills: staggered pop-in */
  const pillContainer = document.querySelector('.state-pills');
  if (pillContainer) {
    const pillObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.pill').forEach((pill, i) => {
            setTimeout(() => pill.classList.add('pill-visible'), i * 80);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    pillObs.observe(pillContainer);
  }
});
