const sections = document.querySelectorAll('.reveal');
const progressBar = document.getElementById('progressBar');
const topBtn = document.getElementById('topBtn');

function onScroll() {
  const trigger = window.innerHeight * 0.92;

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top < trigger) section.classList.add('active');
  });

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;

  if (scrollTop > 500) topBtn.classList.add('show');
  else topBtn.classList.remove('show');
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
