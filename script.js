const progressBar = document.getElementById('progressBar');
const topBtn = document.getElementById('topBtn');
const chapterLabel = document.getElementById('chapterLabel');

const revealTargets = document.querySelectorAll('.reveal-card, .reveal-text, .reveal-hero');
const chapters = document.querySelectorAll('[data-chapter]');
const panels = document.querySelectorAll('.panel');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -6% 0px'
});

revealTargets.forEach(el => observer.observe(el));

function updateProgress() {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}

function updateTopButton() {
  if (window.scrollY > 500) topBtn.classList.add('show');
  else topBtn.classList.remove('show');
}

function updateChapter() {
  let active = 'Portfolio';
  const line = window.innerHeight * 0.35;
  chapters.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= line && rect.bottom > line) {
      active = section.dataset.chapter || active;
    }
  });
  chapterLabel.textContent = active;
}

function attachTilt() {
  if (window.matchMedia('(hover: hover)').matches) {
    panels.forEach(panel => {
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 3.5;
        const ry = (x - 0.5) * 4;
        panel.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
      panel.addEventListener('mouseleave', () => {
        panel.style.transform = '';
      });
    });
  }
}

window.addEventListener('scroll', () => {
  updateProgress();
  updateTopButton();
  updateChapter();
}, { passive: true });

window.addEventListener('load', () => {
  updateProgress();
  updateTopButton();
  updateChapter();
  attachTilt();
});

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
