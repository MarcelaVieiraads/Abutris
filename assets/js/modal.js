let wikiLinks = {}; // será preenchido pelo JSON

// Carregar links do wikiLinks.json
fetch("data/wikiLinks.json")
  .then(res => res.json())
  .then(data => {
    wikiLinks = data;
    console.log("wikiLinks carregado:", wikiLinks);
  })
  .catch(err => console.error("Erro ao carregar wikiLinks:", err));

// Função para linkificar texto
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

// Abrir modal
function openModal(decade) {
  const modal = document.getElementById("timelineModal");

  // Ano e título
  document.getElementById("modalYear").textContent = decade.year;
  document.getElementById("modalTitle").textContent = decade.title;

  // Descrição
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

  // Imagens
  const leftContainer = document.getElementById("modalImages");
  leftContainer.innerHTML = "";
  if (Array.isArray(decade.images)) {
    decade.images.forEach(imgData => {
      // Aceita tanto string quanto objeto {src, caption}
      let src, caption;
      if (typeof imgData === "string") {
        src = imgData;
        caption = "";
      } else {
        src = imgData.src;
        caption = imgData.caption || "";
      }

      // Wrapper
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

  modal.style.display = "flex";
}

// Fechar modal
function closeModal() {
  document.getElementById("timelineModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const modal = document.getElementById("timelineModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.id === "timelineModal") {
        closeModal();
      }
    });
  }
});
