/* ===================================================
   TIP-TOP-KŐ PLUS Kft. — JavaScript
   =================================================== */

'use strict';

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  burger.setAttribute('aria-expanded', isOpen);
}

function closeMenu() {
  navLinks.classList.remove('open');
  burger.classList.remove('active');
  document.body.style.overflow = '';
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', toggleMenu);

// Bezárás linkre kattintáskor
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Bezárás Escape-re
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// Bezárás háttérre kattintáskor (bal szél)
navLinks.addEventListener('click', e => {
  if (e.target === navLinks) closeMenu();
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

// ===== INTERSECTION OBSERVER =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

// Fade-up elements
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Counter elements
let countersStarted = false;
const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll('.stat__number').forEach(animateCounter);
    counterObserver.disconnect();
  }
}, { threshold: 0.5 });

// Register elements for fade-in
document.addEventListener('DOMContentLoaded', () => {
  // Staggered fade-in for cards/grids
  const staggerTargets = [
    '.service-card',
    '.why-item',
    '.testimonial',
    '.stat',
    '.gallery__item',
  ];

  staggerTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = `${i * 80}ms`;
      fadeObserver.observe(el);
    });
  });

  // Fade in section headers and about content
  const simpleTargets = [
    '.section__header',
    '.about__image-wrap',
    '.about__text',
    '.contact__info',
    '.contact__form-wrap',
  ];

  simpleTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-up');
      fadeObserver.observe(el);
    });
  });

  // Stats counter
  const statsSection = document.querySelector('.stats');
  if (statsSection) counterObserver.observe(statsSection);
});

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
  });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate send (replace with actual mailto or backend)
    const btn = form.querySelector('.btn--form');
    btn.textContent = 'Küldés...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('visible');
    }, 1200);
  });

  // Remove error on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

// ===== ACTIVE NAV LINK HIGHLIGHTING =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.navbar__links a:not(.btn)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(item => {
        item.style.color = item.getAttribute('href') === `#${id}`
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===== TILE PATTERN HOVER =====
const tilePattern = document.querySelector('.tile-pattern');
if (tilePattern) {
  const tiles = tilePattern.querySelectorAll('.tile');
  setInterval(() => {
    const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
    randomTile.style.opacity = '0.3';
    setTimeout(() => { randomTile.style.opacity = '1'; }, 600);
  }, 800);
}
