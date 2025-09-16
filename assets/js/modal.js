function openModal(decade) {
  const modal = document.getElementById("timelineModal");

  // Preencher ano e título
  document.getElementById("modalYear").textContent = decade.year;
  document.getElementById("modalTitle").textContent = decade.title;

  // Preencher descrições (vários parágrafos)
  const descContainer = document.getElementById("modalDescription");
  descContainer.innerHTML = ""; // limpa antes
  if (Array.isArray(decade.description)) {
    decade.description.forEach(paragraph => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      descContainer.appendChild(p);
    });
  } else {
    descContainer.textContent = decade.description || "";
  }

  // Preencher imagens (quantas tiver)
  const leftContainer = document.getElementById("modalImages");
  leftContainer.innerHTML = ""; // limpa antes
  if (Array.isArray(decade.images)) {
    decade.images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Imagem relacionada a ${decade.year}`;
      leftContainer.appendChild(img);
    });
  }

  modal.style.display = "flex";
}

// ===== NOVO: fechar modal =====
function closeModal() {
  document.getElementById("timelineModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  // Botão de fechar
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Clicar fora do conteúdo (no overlay)
  const modal = document.getElementById("timelineModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.id === "timelineModal") {
        closeModal();
      }
    });
  }
});
