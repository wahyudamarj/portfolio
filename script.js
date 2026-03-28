
const app = document.getElementById('app');
const progress = document.getElementById('progress');
const toTop = document.getElementById('toTop');
const miniNav = document.getElementById('miniNav');

const data = window.PORTFOLIO;

function imgCard(src, extra='') {
  return `
    <figure class="card tilt ${extra}">
      <img src="${src}" alt="" loading="lazy" decoding="async" />
    </figure>
  `;
}

function renderHero() {
  return `
    <section class="hero">
      <div class="hero-shell">
        <div class="hero-glow"></div>
        <div class="hero-frame">
          <img src="${data.hero}" alt="" />
          <div class="hero-caption">
            <span class="pill">Portfolio</span>
            <span class="pill subtle">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSimple(chapter) {
  let inner = '';
  const paths = chapter.pages.map(p => `assets/pages/page-${p}.png`);
  switch (chapter.layout) {
    case 'duo':
      inner = `<div class="duo-grid">${paths.map(imgCard).join('')}</div>`;
      break;
    case 'masonry':
      inner = `<div class="masonry-grid">${paths.map(imgCard).join('')}</div>`;
      break;
    case 'cascade':
      inner = `<div class="cascade-grid">${paths.map(imgCard).join('')}</div>`;
      break;
    case 'filmstrip':
      const rows = [];
      for (let i=0; i<paths.length; i+=2) {
        const pair = paths.slice(i, i+2).map(imgCard).join('');
        rows.push(`<div class="film-row">${pair}</div>`);
      }
      inner = `<div class="filmstrip">${rows.join('')}</div>`;
      break;
    case 'feature':
    case 'contact':
    default:
      inner = `<div class="feature-grid">${paths.map(imgCard).join('')}</div>`;
      break;
  }

  return `
    <section class="section" id="${chapter.id}">
      <div class="section-grid">
        <aside class="section-rail">
          <div class="section-label">${chapter.label}</div>
        </aside>
        <div class="section-stack ${chapter.id === 'contact' ? 'contact-wrap' : ''}">
          ${inner}
        </div>
      </div>
    </section>
  `;
}

function renderExperience(chapter) {
  const groups = chapter.groups.map(group => {
    const media = group.pages.map(p => imgCard(`assets/pages/page-${p}.png`)).join('');
    return `
      <article class="exp-item">
        <div class="exp-meta">
          <h3>${group.company}</h3>
          <p>${group.meta}</p>
        </div>
        <div class="exp-media">${media}</div>
      </article>
    `;
  }).join('');

  return `
    <section class="section" id="${chapter.id}">
      <div class="section-grid">
        <aside class="section-rail">
          <div class="section-label">${chapter.label}</div>
        </aside>
        <div class="experience-stack">
          ${groups}
        </div>
      </div>
    </section>
  `;
}

function render() {
  let html = renderHero();
  data.chapters.forEach(ch => {
    if (ch.layout === 'experience') html += renderExperience(ch);
    else html += renderSimple(ch);
  });
  app.innerHTML = html;

  miniNav.innerHTML = data.chapters
    .filter(ch => ['about','experience','instructional','training','contact'].includes(ch.id))
    .map(ch => `<a href="#${ch.id}">${ch.label}</a>`)
    .join('');
}

render();

const cards = [...document.querySelectorAll('.card')];
const sections = [...document.querySelectorAll('.section[id]')];
const navLinks = [...miniNav.querySelectorAll('a')];

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

cards.forEach(card => io.observe(card));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
  });
}, { threshold: 0.35 });

sections.forEach(section => sectionObserver.observe(section));

function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const value = Math.max(0, Math.min(100, scrollY / max * 100));
  progress.style.width = `${value}%`;
  toTop.classList.toggle('show', scrollY > 700);
}
updateProgress();
addEventListener('scroll', updateProgress, { passive: true });

toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('.tilt').forEach(card => {
  let raf = null;
  function reset() {
    card.style.transform = '';
  }
  card.addEventListener('pointermove', (e) => {
    if (matchMedia('(max-width: 860px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 3.5;
    const ry = (px - 0.5) * 5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      card.style.transform = `translateY(0) perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  });
  card.addEventListener('pointerleave', reset);
});
