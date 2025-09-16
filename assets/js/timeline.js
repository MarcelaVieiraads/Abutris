// timeline.js
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("timelineTrack");

  fetch("data/timeline.json")
    .then((res) => res.json())
    .then((data) => {
      if (!data.decades) return;

      data.decades.forEach((decade) => {
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

        circle.addEventListener("click", () => {
          openModal(decade);
        });

        const title = document.createElement("div");
        title.className = "timeline-title";
        title.textContent = decade.title;

        item.appendChild(circle);
        item.appendChild(title);
        track.appendChild(item);
      });

      addDecorations();
      enableKeyboardNav();
    })
    .catch((err) => console.error("Erro ao carregar timeline:", err));
});

// adiciona imagens decorativas
function addDecorations() {
  const section = document.getElementById("timeline");

  // lista de imagens e classes de posição
  const decorations = [
    { src: "assets/images/timeline/AlbumRamones.gif", alt: "Álbum Ramones", class: "decor-1" },
    { src: "assets/images/timeline/TheClashGuitarra.gif", alt: "The Clash Guitarrista", class: "decor-2" },
    { src: "assets/images/timeline/AlbumSexPistols.gif", alt: "Album Sex Pistols queimando", class: "decor-3" },
    { src: "assets/images/timeline/PersonagemPunk.gif", alt: "Personagem Punk tocando guitarra", class: "decor-4" },
    { src: "assets/images/timeline/AlbumGreenDay.gif", alt: "Álbum Green Day", class: "decor-5" },
    { src: "assets/images/timeline/IggyPop.gif", alt: "Iggy Pop girando guitarra", class: "decor-6" },
    { src: "assets/images/timeline/JovemPunk.gif", alt: "Jovem Punk", class: "decor-7" }
  ];

  // cria cada imagem
  decorations.forEach(decor => {
    const div = document.createElement("div");
    div.className = `timeline-decor ${decor.class}`;
    div.innerHTML = `<img src="${decor.src}" alt="${decor.alt}">`;
    section.appendChild(div);
  });
}

// navegação snap por snap com setas
function enableKeyboardNav() {
  const items = document.querySelectorAll(".timeline-item");
  if (!items.length) return;

  let currentIndex = 0;

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault(); // impede o navegador de só mudar foco
      currentIndex = Math.min(currentIndex + 1, items.length - 1);
      items[currentIndex].scrollIntoView({ behavior: "smooth", inline: "center" });
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      currentIndex = Math.max(currentIndex - 1, 0);
      items[currentIndex].scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  });
}


