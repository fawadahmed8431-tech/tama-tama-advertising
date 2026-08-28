/**
 * TAM TAM ADVERTISING — Main JavaScript
 * Premium interactive experience
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   LOADER
═══════════════════════════════════════════════════════════════ */
const Loader = (() => {
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  const body = document.body;

  let value = 0;

  function init() {
    body.classList.add('loading');
    animateProgress();
  }

  function animateProgress() {
    const intervals = [
      { target: 30, step: 2, delay: 40 },
      { target: 65, step: 1.5, delay: 30 },
      { target: 90, step: 0.8, delay: 25 },
      { target: 100, step: 2, delay: 20 },
    ];

    let phase = 0;

    function tick() {
      if (value < intervals[phase].target) {
        value = Math.min(value + intervals[phase].step, intervals[phase].target);
        progress.style.width = value + '%';
        setTimeout(tick, intervals[phase].delay);
      } else if (phase < intervals.length - 1) {
        phase++;
        setTimeout(tick, 100);
      } else {
        // Done
        setTimeout(hide, 300);
      }
    }

    tick();
  }

  function hide() {
    loader.classList.add('hidden');
    body.classList.remove('loading');
    // Trigger hero reveals
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
      el.classList.add('revealed');
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════════ */
const Cursor = (() => {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (!cursor || !follower) return { init: () => {} };

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let raf;

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    raf = requestAnimationFrame(animateFollower);
  }

  function onMouseLeave() {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  }

  function onMouseEnter() {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  }

  function init() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animateFollower();
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════════ */
const Nav = (() => {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  let lastScroll = 0;
  let isMenuOpen = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (scrollY >= top) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.scroll === current) link.classList.add('active');
    });

    lastScroll = scrollY;
  }

  function openMenu() {
    isMenuOpen = true;
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isMenuOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function init() {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    hamburger.addEventListener('click', () => {
      isMenuOpen ? closeMenu() : openMenu();
    });

    menuClose.addEventListener('click', closeMenu);

    // Close on link click
    document.querySelectorAll('[data-close]').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════════ */
const ScrollReveal = (() => {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function init() {
    revealEls.forEach(el => {
      // Skip hero elements (handled by loader)
      if (el.closest('.hero')) return;
      observer.observe(el);
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════════════════════ */
const Counters = (() => {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  function init() {
    counters.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   PARTICLE CANVAS — Hero Background
═══════════════════════════════════════════════════════════════ */
const ParticleSystem = (() => {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return { init: () => {} };

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animating = true;
  let mouseX = 0, mouseY = 0;
  let raf;

  // Colors
  const COLORS = [
    'rgba(155,93,229,',
    'rgba(0,212,255,',
    'rgba(255,107,53,',
    'rgba(255,255,255,',
  ];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function initParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    particles = [];
    for (let i = 0; i < count; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: randomBetween(-0.3, 0.3),
        vy: randomBetween(-0.3, 0.3),
        size: randomBetween(1, 2.5),
        alpha: randomBetween(0.15, 0.55),
        alphaDir: Math.random() < 0.5 ? 1 : -1,
        alphaSpeed: randomBetween(0.002, 0.006),
        color,
      });
    }
  }

  function connectParticles() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(155,93,229,${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Mouse interaction — subtle repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.vx += (dx / dist) * force * 0.02;
        p.vy += (dy / dist) * force * 0.02;
      }

      // Dampen velocity
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Clamp velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.2) { p.vx *= 0.9; p.vy *= 0.9; }

      // Wrap edges
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      // Alpha pulse
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (p.alpha > 0.55 || p.alpha < 0.05) p.alphaDir *= -1;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    connectParticles();
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });
  }

  function loop() {
    update();
    draw();
    if (animating) raf = requestAnimationFrame(loop);
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  // Pause when off-screen
  const pauseObserver = new IntersectionObserver(entries => {
    animating = entries[0].isIntersecting;
    if (animating) loop();
  }, { threshold: 0 });

  function init() {
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    pauseObserver.observe(canvas);
    loop();
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   PARALLAX — Subtle depth on scroll
═══════════════════════════════════════════════════════════════ */
const Parallax = (() => {
  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Hero orbs parallax
      const orbs = document.querySelectorAll('.hero-orb');
      orbs.forEach((orb, i) => {
        const speed = 0.15 + i * 0.08;
        orb.style.transform = `translate(0, ${scrollY * speed}px)`;
      });

      // Why bg parallax
      const whyBg = document.querySelector('.why-bg img');
      if (whyBg) {
        const whySection = document.querySelector('.why');
        const rect = whySection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight - rect.top) * 0.12;
          whyBg.style.transform = `translateY(${offset}px)`;
        }
      }
    }, { passive: true });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   SERVICE ITEMS — Magnetic hover effect
═══════════════════════════════════════════════════════════════ */
const MagneticEffects = (() => {
  function init() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.btn--mega').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.15;
        const dy = (e.clientY - cy) * 0.15;
        btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   TILT EFFECT — Hero image stack
═══════════════════════════════════════════════════════════════ */
const HeroTilt = (() => {
  function init() {
    if (window.matchMedia('(hover: none)').matches) return;

    const stack = document.querySelector('.hero-img-stack');
    if (!stack) return;

    const imgs = stack.querySelectorAll('.hero-img');

    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      imgs.forEach((img, i) => {
        const depth = (i + 1) * 6;
        img.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
      });
    }, { passive: true });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   EFFECTS.CSS INJECTION
═══════════════════════════════════════════════════════════════ */
function injectEffectsCSS() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'css/effects.css';
  document.head.appendChild(link);
}


/* ═══════════════════════════════════════════════════════════════
   SMOOTH SECTION TRANSITIONS — Add subtle gradient to section borders
═══════════════════════════════════════════════════════════════ */
const SectionEffects = (() => {
  function init() {
    // Add data-num to work items
    document.querySelectorAll('.work-item').forEach((item, i) => {
      item.dataset.num = String(i + 1).padStart(2, '0');
    });

    // Stagger animations for service items observed via IO
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceObserver = new IntersectionObserver(
      entries => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, idx * 60);
            serviceObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    serviceItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      serviceObserver.observe(item);
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   ACTIVE SECTION HIGHLIGHT — Marquee pause on hover
═══════════════════════════════════════════════════════════════ */
const MarqueeControl = (() => {
  function init() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;

    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   IMAGE LAZY LOAD ENHANCEMENT
═══════════════════════════════════════════════════════════════ */
const ImageLoader = (() => {
  function init() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported — add fade-in
      images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';

        if (img.complete) {
          img.style.opacity = '1';
        } else {
          img.addEventListener('load', () => {
            img.style.opacity = '1';
          });
        }
      });
    }
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   FOOTER PARALLAX TEXT
═══════════════════════════════════════════════════════════════ */
const FooterEffect = (() => {
  function init() {
    const tagline = document.querySelector('.footer-tagline');
    if (!tagline) return;

    // Subtle entrance animation
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          tagline.style.opacity = '1';
          tagline.style.transform = 'translateY(0)';
        }
      },
      { threshold: 0.5 }
    );

    tagline.style.opacity = '0';
    tagline.style.transform = 'translateY(20px)';
    tagline.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(tagline);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   INIT ALL
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  injectEffectsCSS();
  Loader.init();
  Cursor.init();
  Nav.init();
  ScrollReveal.init();
  Counters.init();
  ParticleSystem.init();
  Parallax.init();
  MagneticEffects.init();
  HeroTilt.init();
  SectionEffects.init();
  MarqueeControl.init();
  ImageLoader.init();
  FooterEffect.init();
});

/* ═══════════════════════════════════════════════════════════════
   PERFORMANCE — Reduce motion support
═══════════════════════════════════════════════════════════════ */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
}
