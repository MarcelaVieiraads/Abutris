// ===============================
// Carrega wikiLinks do JSON
// ===============================
let wikiLinks = {};

fetch("data/wikiLinks.json")
  .then(res => res.json())
  .then(data => {
    wikiLinks = data;
    console.log("wikiLinks carregado:", wikiLinks);
  })
  .catch(err => console.error("Erro ao carregar wikiLinks:", err));


// ===============================
// Converte palavras-chave em links
// ===============================
function linkifyText(text, links) {
  let result = text;
  for (const [word, url] of Object.entries(links)) {
    const regex = new RegExp(`(${word})(?=[\\s,.!?;:])`, "gi");
    result = result.replace(
      regex,
      `<a href="${url}" target="_blank" class="wiki-link">${word}</a>`
    );
  }
  return result;
}


// ===============================
// Abrir modal (com animação suave)
// ===============================
function openModal(decade) {
  const modal = document.getElementById("timelineModal");
  const navbar = document.querySelector(".navbar");

  // Esconde o navbar
  if (navbar) navbar.style.display = "none";

  // Preenche ano e título
  document.getElementById("modalYear").textContent = decade.year;
  document.getElementById("modalTitle").textContent = decade.title;

  // Preenche descrições (com wikilinks)
  const descContainer = document.getElementById("modalDescription");
  descContainer.innerHTML = "";
  if (Array.isArray(decade.description)) {
    decade.description.forEach(paragraph => {
      const p = document.createElement("p");
      p.innerHTML = linkifyText(paragraph, wikiLinks);
      descContainer.appendChild(p);
    });
  } else {
    descContainer.innerHTML = linkifyText(decade.description || "", wikiLinks);
  }

  // Preenche imagens (com legendas opcionais)
  const leftContainer = document.getElementById("modalImages");
  leftContainer.innerHTML = "";
  if (Array.isArray(decade.images)) {
    decade.images.forEach(imgData => {
      let src, caption;
      if (typeof imgData === "string") {
        src = imgData;
        caption = "";
      } else {
        src = imgData.src;
        caption = imgData.caption || "";
      }

      const wrapper = document.createElement("div");
      wrapper.className = "modal-img-wrapper";

      const img = document.createElement("img");
      img.src = src;
      img.alt = `Imagem relacionada a ${decade.year}`;

      const captionDiv = document.createElement("div");
      captionDiv.className = "modal-img-caption";
      captionDiv.textContent = caption;

      wrapper.appendChild(img);
      wrapper.appendChild(captionDiv);
      leftContainer.appendChild(wrapper);
    });
  }

  // Mostra modal com efeito suave
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 20);

  // Bloqueia o scroll da página
  document.body.style.overflow = "hidden";

  // Foco e navegação com teclado
  modal.setAttribute("tabindex", "-1");
  modal.focus();
}


// ===============================
// Fechar modal (com fade suave)
// ===============================
function closeModal() {
  const modal = document.getElementById("timelineModal");
  const navbar = document.querySelector(".navbar");

  modal.classList.remove("show");

  // Espera o fade terminar antes de esconder
  setTimeout(() => {
    modal.style.display = "none";
    if (navbar) navbar.style.display = "flex";
    document.body.style.overflow = "";
  }, 350); // mesmo tempo do CSS (0.4s)
}


// ===============================
// Eventos de interação
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const modal = document.getElementById("timelineModal");

  if (modal) {
    // 🔹 Mantém o modal aberto ao clicar fora
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-content")) return;
    });

    // 🔹 Scroll suave com setas ↑ ↓
    modal.addEventListener("keydown", (e) => {
      const scrollable = modal.querySelector(".modal-content");
      const scrollSpeed = 200; // ajuste aqui a velocidade
      if (!scrollable) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollable.scrollBy({ top: scrollSpeed, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollable.scrollBy({ top: -scrollSpeed, behavior: "smooth" });
      }
    });
  }
});
  