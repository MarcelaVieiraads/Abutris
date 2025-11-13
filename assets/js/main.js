// main.js (comportamento da primeira tela)
document.addEventListener('DOMContentLoaded', function () {
  // smooth scroll para anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ao rolar com mouse/trackpad na hero: se o usuário empurrar para baixo, leva para timeline
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('wheel', function (e) {
      if (e.deltaY > 30) {
        const timeline = document.getElementById('timeline');
        if (timeline) timeline.scrollIntoView({ behavior: 'smooth' });
      }
    }, { passive: true });
  }
});
