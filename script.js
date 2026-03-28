const progressBar = document.getElementById('progressBar');
const topBtn = document.getElementById('topBtn');
const revealTargets = document.querySelectorAll('.reveal-text, .reveal-panel');
const motionPanels = document.querySelectorAll('.panel');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

revealTargets.forEach((el) => observer.observe(el));

function updateProgress() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progressBar.style.width = `${progress}%`;

  if (scrollTop > 500) {
    topBtn.classList.add('show');
  } else {
    topBtn.classList.remove('show');
  }
}

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('load', updateProgress);

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

motionPanels.forEach((panel) => {
  panel.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 900) return;
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 5;
    const rotateX = ((y / rect.height) - 0.5) * -5;
    panel.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  });
  panel.addEventListener('mouseleave', () => {
    panel.style.transform = '';
  });
});
