const topbar = document.getElementById('topbar');
const hero = document.querySelector('.hero');
const root = document.documentElement;

// Topbar com sombra ao rolar
const onScroll = () => {
  const y = window.scrollY;
  topbar.classList.toggle('scrolled', y > 16);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (y / max) * 100 : 0;
  root.style.setProperty('--scroll-progress', `${progress}%`);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal com stagger
const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.15 });

revealItems.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  observer.observe(el);
});

// Scroll spy nos links do menu
const sections = ['produto', 'experiencia', 'portfolio', 'cta'].map(id => document.getElementById(id));
const navLinks = [...document.querySelectorAll('.nav-links a')];

const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach(a => a.classList.remove('is-active'));
    const active = navLinks.find(a => a.getAttribute('href') === `#${entry.target.id}`);
    if (active) active.classList.add('is-active');
  });
}, { threshold: 0.45 });

sections.forEach(section => section && spy.observe(section));

// Parallax sutil no hero
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    root.style.setProperty('--mx', `${x}`);
    root.style.setProperty('--my', `${y}`);

    if (hero) {
      hero.style.setProperty('--hero-x', `${x * 10}px`);
      hero.style.setProperty('--hero-y', `${y * 10}px`);
    }
  }, { passive: true });
}

// Botões com efeito magnético
const magneticTargets = document.querySelectorAll('.btn, .pill, .icon-btn');

magneticTargets.forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    if (prefersReduced) return;

    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    el.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// Contadores animados nas estatísticas
const counters = document.querySelectorAll('[data-count]');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const end = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const startTime = performance.now();

    const step = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const value = Math.round(end * (0.15 + 0.85 * p));
      el.textContent = `${value}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });

counters.forEach(c => countObserver.observe(c));
// =========================
// CONFIGURAÇÕES GLOBAIS
// =========================
"use strict";
const htmlEl = document.documentElement;

// =========================
// FUNÇÃO AUXILIAR: LERP SUAVE
// =========================
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

// =========================
// BARRA DE PROGRESSO (no topo) + SCROLL SUAVE
// =========================
const progressBar = document.createElement('div');
progressBar.className = 'scroll-bar';  // deve ter estilo CSS posicionado no topo
document.body.appendChild(progressBar);
let targetScroll = window.scrollY;
window.addEventListener('scroll', () => {
  targetScroll = window.scrollY;
});
function animateScroll() {
  // Suaviza o valor do scroll e atualiza a barra
  const currentScroll = parseFloat(htmlEl.style.getPropertyValue('--scroll') || 0);
  const newScroll = lerp(currentScroll, targetScroll, 0.1);
  htmlEl.style.setProperty('--scroll', newScroll);
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (newScroll / maxScroll) * 100 : 0;
  progressBar.style.width = percent + '%';
  requestAnimationFrame(animateScroll);
}
requestAnimationFrame(animateScroll);

// =========================
// ALTERAR NAVBAR AO ROLAR
// =========================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('navbar-active');
  else navbar.classList.remove('navbar-active');
}, { passive: true });

// =========================
// REVEAL ANIMADO (IntersectionObserver)
// =========================
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.2 });

revealElements.forEach((el, idx) => {
  // atraso gradual nos revelações (stagger)
  el.style.transitionDelay = `${idx * 100}ms`;
  revealObserver.observe(el);
});

// =========================
// EFEITO PARALLAX (COM CURSOR)
// =========================
if (!prefersReduced) {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    parallaxEls.forEach(el => {
      const strength = Number(el.dataset.parallax) || 20;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
  });
}

// =========================
// BOTÕES MAGNÉTICOS (efeito hover)
// =========================
const magnets = document.querySelectorAll('.btn, .btn-dark, .btn-white');
magnets.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    btn.style.transform = `translate(${offsetX * 0.15}px, ${offsetY * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// =========================
// CURSOR GLOW SLIGHT (if desired)
// =========================
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
});
function updateCursor() {
  curX = lerp(curX, mouseX, 0.1);
  curY = lerp(curY, mouseY, 0.1);
  cursorGlow.style.transform = `translate(${curX}px, ${curY}px)`;
  requestAnimationFrame(updateCursor);
}
if (!prefersReduced) updateCursor();

// =========================
// ALTERNAR TEMA CLARO/ESC URO
// =========================
const themeKey = 'chatTheme';
const savedTheme = localStorage.getItem(themeKey);
if (savedTheme) htmlEl.setAttribute('data-theme', savedTheme);
const toggleThemeBtn = document.getElementById('toggleTheme');
if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'light' ? '' : 'light';
    if (next) htmlEl.setAttribute('data-theme', next);
    else htmlEl.removeAttribute('data-theme');
    localStorage.setItem(themeKey, next);
  });
}

// =========================
// LAZY-LOAD DE IMAGENS COM BLUR-UP
// =========================
const imgs = document.querySelectorAll('img.lazy-img');
const imgObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    // Troca placeholder pelo src completo
    const full = img.dataset.src;
    if (full) {
      const temp = new Image();
      temp.src = full;
      temp.decode().finally(() => {
        img.src = full;
        img.classList.add('is-loaded');  // deve remover blur no CSS
      });
    }
    obs.unobserve(img);
  });
}, { rootMargin: '200px 0px', threshold: 0 });

imgs.forEach(img => imgObserver.observe(img));

// =========================
// LEITOR DE VIEWPORT RESIZE (para responsividade)
// =========================
window.addEventListener('resize', () => {
  // se precisar recalcular algo ao redimensionar
}, { passive: true });

(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  const topbar = document.getElementById('topbar');
  const hero = document.getElementById('hero') || document.querySelector('.hero');
  const revealItems = [...document.querySelectorAll('.reveal')];
  const magneticTargets = [...document.querySelectorAll('.btn, .pill, .icon-btn')];
  const reactiveTexts = [...document.querySelectorAll('[data-react-text]')];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  // Barra de progresso
  let progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);
  }

  // Cursor glow
  let cursorGlow = document.querySelector('.cursor-glow');
  if (!cursorGlow && !prefersReduced) {
    cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);
  }

  function updateScrollState() {
    const y = window.scrollY || 0;
    topbar?.classList.toggle('scrolled', y > 16);

    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min((y / max) * 100, 100);
    root.style.setProperty('--scroll-progress', `${progress}%`);
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  // Reveal suave
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    }
  }, { threshold: 0.15 });

  revealItems.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
    revealObserver.observe(el);
  });

  // Scroll spy
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach(a => a.classList.remove('is-active'));
    const active = navLinks.find(a => a.getAttribute('href') === `#${visible.target.id}`);
    active?.classList.add('is-active');
  }, {
    threshold: [0.2, 0.35, 0.5],
    rootMargin: '-10% 0px -45% 0px'
  });

  sections.forEach(section => spy.observe(section));

  // Texto reativo ao mouse
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[c]));
  }

  reactiveTexts.forEach((el) => {
    if (el.dataset.bound === '1') return;

    const text = el.textContent || '';
    el.dataset.bound = '1';
    el.setAttribute('aria-label', text);
    el.textContent = '';

    [...text].forEach((ch, index) => {
      const span = document.createElement('span');
      span.className = 'react-letter';
      span.innerHTML = ch === ' ' ? '&nbsp;' : escapeHTML(ch);
      span.dataset.index = String(index);
      el.appendChild(span);
    });
  });

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let raf = 0;

  function renderMotion() {
    raf = 0;

    if (cursorGlow && !prefersReduced) {
      cursorGlow.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
    }

    if (hero && !prefersReduced) {
      const heroX = (mouse.x / window.innerWidth - 0.5) * 24;
      const heroY = (mouse.y / window.innerHeight - 0.5) * 24;
      hero.style.setProperty('--hero-x', `${heroX}px`);
      hero.style.setProperty('--hero-y', `${heroY}px`);
    }

    reactiveTexts.forEach((el) => {
      const spans = [...el.querySelectorAll('.react-letter')];

      spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const dx = mouse.x - (rect.left + rect.width / 2);
        const dy = mouse.y - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);

        const influence = Math.max(0, 220 - distance) / 220;
        const tx = (-dx * 0.08 * influence);
        const ty = (-dy * 0.08 * influence);
        const scale = 1 + influence * 0.25;
        const rotate = influence * 8;

        span.style.transform = `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotate}deg)`;
      });
    });
  }

  window.addEventListener('mousemove', (e) => {
    if (prefersReduced) return;

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (!raf) raf = requestAnimationFrame(renderMotion);
  }, { passive: true });

  // Botões magnéticos
  magneticTargets.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (prefersReduced) return;

      const rect = el.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);

      el.style.transform = `translate(${mx * 0.12}px, ${my * 0.12}px)`;
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });

  // Smooth scroll nos links âncora
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
})();

// ===============================
// TEXTO INTERATIVO (NÍVEL APPLE)
// ===============================
const letters = document.querySelectorAll('.react-letter');

window.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;

  const x = e.clientX / innerWidth - 0.5;
  const y = e.clientY / innerHeight - 0.5;

  letters.forEach((letter, i) => {
    const strength = 20 + (i % 5) * 5;

    const moveX = x * strength;
    const moveY = y * strength;

    letter.style.transform = `
      translate(${moveX}px, ${moveY}px)
      rotate(${x * 10}deg)
    `;
  });
});