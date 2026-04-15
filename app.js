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
const navItems = document.querySelectorAll('.navbar__links a:not(.btn--nav)');

function setActiveNav() {
  const scrollY = window.scrollY + 100;
  let currentId = '';

  sections.forEach(section => {
    if (section.offsetTop <= scrollY) {
      currentId = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    const isActive = item.getAttribute('href') === `#${currentId}`;
    item.classList.toggle('nav--active', isActive);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

// ===== GALÉRIA SZŰRŐ =====
(function () {
  const filterBtns = document.querySelectorAll('.gallery__filter');
  const items      = document.querySelectorAll('.gallery__item[data-cat]');
  const emptyMsg   = document.getElementById('galleryEmpty');
  const grid       = document.getElementById('galleryGrid');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Aktív gomb csere
      filterBtns.forEach(b => b.classList.remove('gallery__filter--active'));
      btn.classList.add('gallery__filter--active');

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      items.forEach((item) => {
        const match = filter === 'minden' || item.dataset.cat === filter;
        if (match) {
          // Megjelenítés animációval, eltolt időzítéssel
          item.style.position  = '';
          item.style.visibility= '';
          item.classList.remove('gallery--hidden');
          item.classList.remove('gallery--fadeIn');
          // Egy tick szünet az animáció újraindításához
          requestAnimationFrame(() => {
            item.style.animationDelay = `${visibleCount * 50}ms`;
            item.classList.add('gallery--fadeIn');
          });
          visibleCount++;
        } else {
          item.classList.add('gallery--hidden');
          item.classList.remove('gallery--fadeIn');
        }
      });

      // Üres állapot
      emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
      grid.style.display     = visibleCount === 0 ? 'none'  : 'grid';
    });
  });
})();

// ===== ÁRBECSLŐ KALKULÁTOR =====
(function () {
  const step1    = document.getElementById('step1');
  const step2    = document.getElementById('step2');
  const step3    = document.getElementById('step3');
  const result   = document.getElementById('calcResult');
  const progress = document.getElementById('calcProgress');
  const slider   = document.getElementById('areaSlider');
  const areaInp  = document.getElementById('areaInput');
  const unitLbl  = document.getElementById('unitLabel');
  const areaUnit = document.getElementById('areaUnit');
  const resPrice = document.getElementById('resultPrice');
  const resSub   = document.getElementById('resultSub');
  const breakdown= document.getElementById('breakdown');
  const resetBtn = document.getElementById('calcReset');

  if (!step1) return;

  let state = { type: null, laborMin: 0, laborMax: 0, area: 30, matMin: 0, matMax: 0, unit: 'm²' };

  function fmt(n) {
    return new Intl.NumberFormat('hu-HU').format(Math.round(n));
  }
  function setProgress(pct) {
    progress.style.width = pct + '%';
  }

  // Slider ↔ input szinkron
  slider.addEventListener('input', () => {
    areaInp.value = slider.value;
    state.area = +slider.value;
    updateSliderFill();
  });
  areaInp.addEventListener('input', () => {
    const v = Math.max(1, Math.min(999, +areaInp.value || 1));
    slider.value = Math.min(v, 200);
    state.area = v;
    updateSliderFill();
  });
  function updateSliderFill() {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--gold) ${pct}%, var(--stone-2) ${pct}%)`;
  }
  updateSliderFill();

  // Lépés 1 — típus választás
  document.querySelectorAll('.calc__type').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calc__type').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.type     = btn.dataset.type;
      state.laborMin = +btn.dataset.laborMin;
      state.laborMax = +btn.dataset.laborMax;
      state.unit     = state.type === 'lepcso' ? 'fm' : 'm²';
      unitLbl.textContent = state.unit;
      areaUnit.textContent = state.unit;
      // Lépcsőnél kisebb max
      if (state.type === 'lepcso') { slider.max = 50; areaInp.value = Math.min(state.area, 50); }
      else { slider.max = 200; }

      step2.classList.remove('calc__step--hidden');
      step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setProgress(33);
    });
  });

  // Lépés 3 — anyagminőség
  document.querySelectorAll('.calc__quality').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calc__quality').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.matMin = +btn.dataset.matMin;
      state.matMax = +btn.dataset.matMax;
      showResult();
      setProgress(100);
    });
  });

  // Lépés 2 → 3 továbblépés (ha inputból módosít)
  step2.addEventListener('change', () => {
    if (step3.classList.contains('calc__step--hidden')) {
      step3.classList.remove('calc__step--hidden');
      step3.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setProgress(66);
    }
  });
  // Kattintás a sliderrre is triggerel
  slider.addEventListener('click', () => {
    if (step3.classList.contains('calc__step--hidden')) {
      step3.classList.remove('calc__step--hidden');
      step3.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setProgress(66);
    }
  });

  function showResult() {
    const a = state.area;
    const totalMin = (state.laborMin + state.matMin) * a;
    const totalMax = (state.laborMax + state.matMax) * a;
    const laborRangeMin = state.laborMin * a;
    const laborRangeMax = state.laborMax * a;
    const matRangeMin   = state.matMin * a;
    const matRangeMax   = state.matMax * a;

    resPrice.textContent = `${fmt(totalMin)} – ${fmt(totalMax)} Ft`;
    resSub.textContent   = `${a} ${state.unit} • munkadíj + anyag`;

    breakdown.innerHTML = `
      <div class="calc__breakdown-row">
        <span>Terület</span>
        <span>${a} ${state.unit}</span>
      </div>
      <div class="calc__breakdown-row">
        <span>Munkadíj (becsült)</span>
        <span>${fmt(laborRangeMin)} – ${fmt(laborRangeMax)} Ft</span>
      </div>
      <div class="calc__breakdown-row">
        <span>Anyagköltség (becsült)</span>
        <span>${fmt(matRangeMin)} – ${fmt(matRangeMax)} Ft</span>
      </div>
    `;

    result.classList.remove('calc__step--hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Reset
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.calc__type, .calc__quality').forEach(b => b.classList.remove('selected'));
    state = { type: null, laborMin: 0, laborMax: 0, area: 30, matMin: 0, matMax: 0, unit: 'm²' };
    slider.value = 30;
    areaInp.value = 30;
    updateSliderFill();
    step2.classList.add('calc__step--hidden');
    step3.classList.add('calc__step--hidden');
    result.classList.add('calc__step--hidden');
    setProgress(0);
    step1.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();

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
