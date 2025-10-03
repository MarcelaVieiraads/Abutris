// assets/js/timeline.js
// Script da Timeline com navegação completa

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("timelineTrack");

  fetch("data/timeline.json")
    .then(res => res.json())
    .then(data => {
      if (!data.decades) return;

      // montar itens da timeline
      data.decades.forEach(decade => {
        const item = document.createElement("div");
        item.className = "timeline-item";

        let circle;
        if (decade.icon) {
          circle = document.createElement("img");
          circle.src = decade.icon;
          circle.alt = `Década de ${decade.year}`;
          circle.className = "timeline-circle-img";
        } else {
          circle = document.createElement("div");
          circle.className = "timeline-circle";
          circle.textContent = decade.year;
        }

        // abre modal ao clicar no círculo
        circle.addEventListener("click", () => {
          if (typeof openModal === "function") openModal(decade);
        });

        const title = document.createElement("div");
        title.className = "timeline-title";
        title.textContent = decade.title || "";

        item.appendChild(circle);
        item.appendChild(title);
        track.appendChild(item);
      });

      addDecorations();
      initNavigation();
    })
    .catch(err => console.error("Erro ao carregar timeline:", err));
});

/* ===========================
   Decorações
   =========================== */
function addDecorations() {
  const section = document.getElementById("timeline");
  if (!section) return;

  if (section.querySelector(".timeline-decor")) return; // evita duplicar

  const decorations = [
    { src: "assets/images/timeline/AlbumRamones.gif", alt: "Álbum Ramones", class: "decor-1" },
    { src: "assets/images/timeline/TheClashGuitarra.gif", alt: "The Clash Guitarrista", class: "decor-2" },
    { src: "assets/images/timeline/AlbumSexPistols.gif", alt: "Álbum Sex Pistols queimando", class: "decor-3" },
    { src: "assets/images/timeline/PersonagemPunk.gif", alt: "Personagem Punk tocando guitarra", class: "decor-4" },
    { src: "assets/images/timeline/AlbumGreenDay.gif", alt: "Álbum Green Day", class: "decor-5" },
    { src: "assets/images/timeline/IggyPop.gif", alt: "Iggy Pop girando guitarra", class: "decor-6" },
    { src: "assets/images/timeline/JovemPunk.gif", alt: "Jovem Punk", class: "decor-7" }
  ];

  decorations.forEach(decor => {
    const div = document.createElement("div");
    div.className = `timeline-decor ${decor.class}`;
    div.innerHTML = `<img src="${decor.src}" alt="${decor.alt}">`;
    section.appendChild(div);
  });
}

/* ===========================
   Navegação
   =========================== */
function initNavigation() {
  const items = Array.from(document.querySelectorAll(".timeline-item"));
  if (!items.length) return;

  let currentIndex = getClosestIndexToCenter(items);

  function scrollToIndex(index) {
    if (index < 0) index = 0;
    if (index > items.length - 1) index = items.length - 1;
    currentIndex = index;
    items[currentIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  // ---- controles (já no HTML ou cria se faltar) ----
  let controls = document.querySelector(".timeline-controls");
  let leftArrow, rightArrow;

  if (controls) {
    leftArrow = controls.querySelector(".timeline-arrow.left");
    rightArrow = controls.querySelector(".timeline-arrow.right");
  }

  if (!controls) {
    controls = document.createElement("div");
    controls.className = "timeline-controls";

    leftArrow = document.createElement("img");
    leftArrow.src = "assets/images/home/SetaVermelha.png";
    leftArrow.className = "timeline-arrow left";

    rightArrow = document.createElement("img");
    rightArrow.src = "assets/images/home/SetaVermelha.png";
    rightArrow.className = "timeline-arrow right";

    controls.appendChild(leftArrow);
    controls.appendChild(rightArrow);
    document.body.appendChild(controls);
  }

  // segurança
  if (!leftArrow || !rightArrow) {
    console.warn("Setas da timeline não encontradas/criadas.");
    return;
  }

  // remove duplicação de listeners
  leftArrow.replaceWith(leftArrow.cloneNode(true));
  rightArrow.replaceWith(rightArrow.cloneNode(true));
  leftArrow = controls.querySelector(".timeline-arrow.left");
  rightArrow = controls.querySelector(".timeline-arrow.right");

  // clique
  leftArrow.addEventListener("click", () => scrollToIndex(currentIndex - 1));
  rightArrow.addEventListener("click", () => scrollToIndex(currentIndex + 1));

  // teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(currentIndex - 1);
    }
  });

  // sincroniza índice ao rolar manualmente
  const observer = new IntersectionObserver(() => {
    let bestIndex = getClosestIndexToCenter(items);
    currentIndex = bestIndex;
  }, { threshold: [0.3, 0.6, 1] });

  items.forEach(i => observer.observe(i));

  currentIndex = getClosestIndexToCenter(items);

  // ---- mostra/oculta setas só dentro da seção ----
  const timeline = document.getElementById("timeline");
  function checkVisibility() {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const halfwayVisible = rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2;
    controls.style.display = halfwayVisible ? "flex" : "none";
  }

  window.addEventListener("scroll", checkVisibility);
  checkVisibility();
}

/* ===========================
   util: encontra item mais central
   =========================== */
function getClosestIndexToCenter(items) {
  let bestIdx = 0;
  let bestScore = Infinity;
  items.forEach((it, idx) => {
    const rect = it.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const screenCenter = window.innerWidth / 2;
    const score = Math.abs(centerX - screenCenter);
    if (score < bestScore) { bestScore = score; bestIdx = idx; }
  });
  return bestIdx;
}
