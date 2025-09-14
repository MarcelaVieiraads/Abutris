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

        const circle = document.createElement("div");
        circle.className = "timeline-circle";
        circle.textContent = decade.year;

        circle.addEventListener("click", () => {
          console.log(`Abrir modal para ${decade.year}`);
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

  const decor1 = document.createElement("div");
  decor1.className = "timeline-decor decor-1";
  decor1.innerHTML = `<img src="assets/images/punk.jpg" alt="Figura punk">`;

  const decor2 = document.createElement("div");
  decor2.className = "timeline-decor decor-2";
  decor2.innerHTML = `<img src="assets/images/background.jpg" alt="Cenário punk">`;

  const decor3 = document.createElement("div");
  decor3.className = "timeline-decor decor-3";
  decor3.innerHTML = `<img src="assets/images/logo.png" alt="Logo estilizada">`;

  section.appendChild(decor1);
  section.appendChild(decor2);
  section.appendChild(decor3);
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


