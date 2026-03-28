const q = (s, el = document) => el.querySelector(s);
const qa = (s, el = document) => [...el.querySelectorAll(s)];

const config = window.PORTFOLIO_CONFIG || { nav: [], groups: {} };
const introOverlay = q('#introOverlay');
const enterSiteBtn = q('#enterSiteBtn');
const toggleMotionBtn = q('#toggleMotionBtn');
const themeToggleBtn = q('#themeToggleBtn');
const floatingNav = q('#floatingNav');
const scrollProgressBar = q('#scrollProgressBar');
const backToTopBtn = q('#backToTopBtn');
const cursorGlow = q('#cursorGlow');
const lightbox = q('#lightbox');
const lightboxImg = q('#lightboxImg');
const lightboxCaption = q('#lightboxCaption');
const lightboxCloseBtn = q('#lightboxCloseBtn');

function buildNav() {
  config.nav.forEach(item => {
    const a = document.createElement('a');
    a.href = `#${item.id}`;
    a.textContent = item.label;
    floatingNav.appendChild(a);
  });
}

function openLightbox(src, title) {
  if (!src || !lightbox) return;
  lightboxImg.src = src;
  lightboxCaption.textContent = title || '';
  if (typeof lightbox.showModal === 'function') lightbox.showModal();
}

function closeLightbox() {
  if (lightbox?.open) lightbox.close();
}

function createCard(item) {
  const article = document.createElement('article');
  article.className = 'stack-card reveal cinematic-frame';

  const media = document.createElement('div');
  media.className = 'stack-media';

  const img = document.createElement('img');
  img.src = item.src;
  img.alt = item.title;
  img.loading = 'lazy';

  const fallback = document.createElement('div');
  fallback.className = 'asset-fallback';
  fallback.innerHTML = `Missing asset for <strong>${item.title}</strong><br><code>${item.src}</code>`;

  img.addEventListener('error', () => article.classList.add('is-missing'));
  img.addEventListener('click', () => openLightbox(item.src, item.title));

  media.append(img, fallback);
  article.append(media);
  return article;
}


function buildStacks() {
  Object.entries(config.groups).forEach(([id, items]) => {
    const mount = document.getElementById(id);
    if (!mount) return;
    items.forEach(item => mount.appendChild(createCard(item)));
  });
}

function hideIntro() {
  introOverlay?.classList.add('hidden');
}

function handleProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgressBar.style.width = `${progress}%`;
}

function handleBackToTop() {
  backToTopBtn?.classList.toggle('show', window.scrollY > 600);
}

function handleNavActive() {
  let current = config.nav[0]?.id;
  config.nav.forEach(item => {
    const section = document.getElementById(item.id);
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140) current = item.id;
  });
  qa('a', floatingNav).forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

function observeReveals() {
  qa('.reveal').forEach(el => revealObserver.observe(el));
}

function attachTilt(el) {
  el.addEventListener('mousemove', (e) => {
    if (window.matchMedia('(max-width: 900px)').matches || document.body.classList.contains('motion-paused')) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * 6;
    const ry = (x - 0.5) * 8;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
}

function initTilt() {
  qa('.tilt-card').forEach(attachTilt);
}

function setupCursorGlow() {
  if (!cursorGlow) return;
  window.addEventListener('pointermove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }, { passive: true });
}

function bindFrameLightbox() {
  qa('[data-lightbox-src]').forEach(el => {
    el.addEventListener('click', () => openLightbox(el.dataset.lightboxSrc, el.dataset.lightboxTitle));
  });
}

enterSiteBtn?.addEventListener('click', hideIntro);
toggleMotionBtn?.addEventListener('click', () => {
  document.body.classList.toggle('motion-paused');
  toggleMotionBtn.textContent = document.body.classList.contains('motion-paused') ? 'Resume Motion' : 'Pause Motion';
});
themeToggleBtn?.addEventListener('click', () => {
  document.body.classList.toggle('alt-glow');
});
backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
lightboxCloseBtn?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  const rect = lightbox.getBoundingClientRect();
  const inside = rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
  if (!inside) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function onScroll() {
  handleProgress();
  handleBackToTop();
  handleNavActive();
}

buildNav();
buildStacks();
observeReveals();
initTilt();
setupCursorGlow();
bindFrameLightbox();
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', () => {
  qa('.reveal').slice(0, 3).forEach(el => el.classList.add('active'));
  setTimeout(() => {
    if (!document.body.classList.contains('motion-paused')) hideIntro();
  }, 1600);
});
