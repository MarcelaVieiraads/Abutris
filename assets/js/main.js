// main.js — comportamento da página inicial e navbar dinâmica
document.addEventListener("DOMContentLoaded", function () {
  /* ===============================
     1️⃣ SCROLL SUAVE ENTRE ÂNCORAS
     =============================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* =======================================
     2️⃣ ROLE DO MOUSE NA HOME → VAI PRA TIMELINE
     ======================================= */
  const hero = document.getElementById("hero");
  if (hero) {
    hero.addEventListener(
      "wheel",
      function (e) {
        if (e.deltaY > 30) {
          const timeline = document.getElementById("timeline");
          if (timeline) timeline.scrollIntoView({ behavior: "smooth" });
        }
      },
      { passive: true }
    );
  }

  /* ==========================================
     3️⃣ MOSTRAR "VOLTAR PARA HOME" APENAS NA TIMELINE
     ========================================== */
  const navLeft = document.querySelector(".nav-left");
  const timelineSection = document.getElementById("timeline");

  // Se estiver na home (index.html)
  if (navLeft && timelineSection) {
    function updateNavbarVisibility() {
      const rect = timelineSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Mostra quando pelo menos metade da timeline estiver visível
      const halfwayVisible =
        rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2;

      navLeft.style.opacity = halfwayVisible ? "1" : "0";
      navLeft.style.pointerEvents = halfwayVisible ? "auto" : "none";
      navLeft.style.transition = "opacity 0.4s ease";
    }

    window.addEventListener("scroll", updateNavbarVisibility);
    updateNavbarVisibility();
  }

  // Se estiver em outras páginas (ex: about.html), mantém visível
  if (navLeft && !timelineSection) {
    navLeft.style.opacity = "1";
    navLeft.style.pointerEvents = "auto";
  }
});
