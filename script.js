const config = window.PORTFOLIO_CONFIG;
const root = document.getElementById('portfolioRoot');
const miniNav = document.getElementById('miniNav');
const topBtn = document.getElementById('topBtn');
const progressBar = document.getElementById('progressBar');

const fileName = (n) => `assets/pages/page-${String(n).padStart(2, '0')}.png`;

function createImageCard(page, extraClass = '') {
  const article = document.createElement('article');
  article.className = `page-card reveal ${extraClass}`.trim();
  article.innerHTML = `
    <div class="page-tag">${String(page).padStart(2, '0')}</div>
    <div class="page-card-media">
      <img loading="lazy" src="${fileName(page)}" alt="Portfolio page ${page}" />
    </div>
  `;
  return article;
}

function createRail(index, label) {
  return `
    <aside class="section-rail">
      <div class="rail-card">
        <div class="rail-index">${String(index + 1).padStart(2, '0')}</div>
        <div class="rail-label">${label}</div>
      </div>
    </aside>
  `;
}

function buildHero(section) {
  const sec = document.createElement('section');
  sec.className = 'story-section';
  sec.id = section.id;
  sec.dataset.label = section.label;
  sec.innerHTML = `
    <div class="hero-frame">
      <div class="hero-panel reveal visible">
        <div class="hero-badge">${config.subtitle}</div>
        <div class="hero-media"><img src="${fileName(section.pages[0])}" alt="Portfolio cover" /></div>
      </div>
    </div>
  `;
  return sec;
}

function buildStack(section, index) {
  const sec = document.createElement('section');
  sec.className = 'story-section';
  sec.id = section.id;
  sec.dataset.label = section.label;
  sec.innerHTML = `
    <div class="section-shell">
      ${createRail(index, section.label)}
      <div class="section-stage"><div class="stack-list"></div></div>
    </div>
  `;
  const list = sec.querySelector('.stack-list');
  section.pages.forEach((page) => list.appendChild(createImageCard(page)));
  return sec;
}

function buildExperience(section, index) {
  const rows = [
    { title: 'ILMS', kicker: 'May 2024 — Present', sub: 'The KPI Institute', pages: [8, 9] },
    { title: 'Dicoding', kicker: 'Feb 2023 — May 2024', sub: 'Learning Designer', pages: [10, 11] },
    { title: 'Netpolitan', kicker: 'Apr 2021 — Feb 2023', sub: 'Instructional Designer', pages: [12, 13] }
  ];

  const sec = document.createElement('section');
  sec.className = 'story-section';
  sec.id = section.id;
  sec.dataset.label = section.label;
  sec.innerHTML = `
    <div class="section-shell">
      ${createRail(index, section.label)}
      <div class="section-stage">
        <div class="experience-shell"></div>
      </div>
    </div>
  `;

  const shell = sec.querySelector('.experience-shell');
  rows.forEach((row) => {
    const wrap = document.createElement('div');
    wrap.className = 'exp-row';
    wrap.innerHTML = `
      <div class="exp-meta reveal">
        <div class="exp-kicker">${row.kicker}</div>
        <h2 class="exp-title">${row.title}</h2>
        <div class="exp-sub">${row.sub}</div>
      </div>
      <div class="exp-panels"></div>
    `;
    const panels = wrap.querySelector('.exp-panels');
    row.pages.forEach((page) => panels.appendChild(createImageCard(page, 'compact')));
    shell.appendChild(wrap);
  });
  return sec;
}

function buildClosing(section, index) {
  return buildStack(section, index);
}

function buildContact(section, index) {
  const sec = buildStack(section, index);
  const spacer = document.createElement('div');
  spacer.className = 'footer-space';
  sec.appendChild(spacer);
  return sec;
}

function buildNav() {
  config.sections.forEach((section) => {
    const a = document.createElement('a');
    a.href = `#${section.id}`;
    a.textContent = section.label;
    miniNav.appendChild(a);
  });
}

function build() {
  config.sections.forEach((section, index) => {
    let node;
    if (section.mode === 'hero') node = buildHero(section, index);
    else if (section.mode === 'experience') node = buildExperience(section, index);
    else if (section.mode === 'closing') node = buildClosing(section, index);
    else if (section.mode === 'contact') node = buildContact(section, index);
    else node = buildStack(section, index);
    root.appendChild(node);
  });
}

buildNav();
build();

const revealEls = [...document.querySelectorAll('.reveal')];
const sectionEls = [...document.querySelectorAll('.story-section')];
const navLinks = [...document.querySelectorAll('.mini-nav a')];

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
revealEls.forEach((el) => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  });
}, { threshold: 0.45 });
sectionEls.forEach((el) => sectionObserver.observe(el));

function onScroll() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  topBtn.classList.toggle('show', window.scrollY > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('.page-card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `translateY(0) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('pointerleave', () => {
    if (card.classList.contains('visible')) {
      card.style.transform = '';
    }
  });
});
