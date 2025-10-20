(function () {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll('.slide'));
  const btnPrev = document.querySelector('.carousel .prev');
  const btnNext = document.querySelector('.carousel .next');
  const dotsWrap = document.querySelector('.carousel-dots');

  let index = Math.floor(Math.random() * slides.length); // random start

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
    updateDots();
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot' + (i === index ? ' active' : '');
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });
  }

  btnPrev && btnPrev.addEventListener('click', () => goTo(index - 1));
  btnNext && btnNext.addEventListener('click', () => goTo(index + 1));

  let timer = setInterval(() => goTo(index + 1), 4000);
  track.addEventListener('pointerdown', () => clearInterval(timer));

  function sizeSlides() {
    slides.forEach((s) => (s.style.width = `${track.clientWidth}px`));
  }
  window.addEventListener('resize', sizeSlides);
  sizeSlides();
  goTo(index);
})();
