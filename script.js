const sections = document.querySelectorAll('.section');
const progressBar = document.getElementById('progressBar');
const topBtn = document.getElementById('topBtn');

function reveal() {
  const trigger = window.innerHeight * 0.9;

  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;

    if (top < trigger) {
      section.classList.add('active');
    }
  });
}

function progress() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;

  const percent = (scrollTop / height) * 100;
  progressBar.style.width = percent + "%";
}

function toggleTopBtn() {
  if (window.scrollY > 400) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
}

window.addEventListener("scroll", () => {
  reveal();
  progress();
  toggleTopBtn();
});

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
