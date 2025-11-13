// ===============================
// Carrega wikiLinks do JSON
// ===============================
let wikiLinks = {}; // será preenchido pelo JSON

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
// Abrir modal
// ===============================
function openModal(decade) {
  const modal = document.getElementById("timelineModal");
  const navbar = document.querySelector(".navbar");

  // Esconde o navbar
  if (navbar) navbar.style.display = "none";

  // Preencher ano e título
  document.getElementById("modalYear").textContent = decade.year;
  document.getElementById("modalTitle").textContent = decade.title;

  // Preencher descrições (com wikilinks)
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

  // Preencher imagens (com legendas opcionais)
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

  // Exibe o modal
  modal.style.display = "flex";

  // Travar scroll do body
  document.body.style.overflow = "hidden";

  // Permitir foco e rolagem dentro do modal
  modal.setAttribute("tabindex", "-1");
  modal.focus();
}

// ===============================
// Fechar modal
// ===============================
function closeModal() {
  const modal = document.getElementById("timelineModal");
  const navbar = document.querySelector(".navbar");

  modal.style.display = "none";

  // Reexibe navbar e libera scroll
  if (navbar) navbar.style.display = "flex";
  document.body.style.overflow = "";
}

// ===============================
// Eventos de interação
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const modal = document.getElementById("timelineModal");
  if (modal) {
    // ⚙️ NÃO fecha mais ao clicar fora
    // ✅ Corrigido: mantém scroll dentro do modal com teclado
    modal.addEventListener("keydown", (e) => {
      const scrollable = modal.querySelector(".modal-content");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollable.scrollBy({ top: 150, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollable.scrollBy({ top: -150, behavior: "smooth" });
      }
    });
  }
});
