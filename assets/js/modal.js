// ======================================================
// SISTEMA DE LEITURA EM VOZ ALTA (TTS ACESSÍVEL)
// ======================================================

// Estado global
let currentUtterance = null;
let selectedVoice = null;
let voiceActive = false;

// Carrega UMA única voz (pt-BR)
function loadVoice() {
  const voices = speechSynthesis.getVoices();

  selectedVoice =
    voices.find(v => v.lang === "pt-BR") ||
    voices.find(v => v.lang.startsWith("pt")) ||
    voices[0];

  console.log("Voz selecionada:", selectedVoice?.name);
}

window.speechSynthesis.onvoiceschanged = loadVoice;


// Ler texto
function speakText(text) {
  speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = "pt-BR";

  if (selectedVoice) currentUtterance.voice = selectedVoice;

  speechSynthesis.speak(currentUtterance);
}

// Pausar
function pauseSpeech() {
  if (!speechSynthesis.paused) speechSynthesis.pause();
}

// Continuar
function resumeSpeech() {
  if (speechSynthesis.paused) speechSynthesis.resume();
}

// Ler texto selecionado
function speakSelection() {
  const selected = window.getSelection().toString().trim();
  if (selected) speakText(selected);
}


// ======================================================
// LEITOR DE VOZ — BOTÃO E PAINEL EXTERNOS (LATERAL)
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

  const btnToggle = document.getElementById("voiceToggleBtn");
  const panel = document.getElementById("voicePanel");

  const btnRead = document.getElementById("vp-read");
  const btnPause = document.getElementById("vp-pause");
  const btnResume = document.getElementById("vp-resume");
  const btnStop = document.getElementById("vp-stop");

  // Inicialmente: ocultar tudo
  btnToggle.style.display = "none";
  panel.classList.add("hidden");

  // Ativar leitor → exibe painel
  btnToggle.addEventListener("click", () => {
    if (!voiceActive) {
      voiceActive = true;
      panel.classList.remove("hidden");
      btnToggle.textContent = "🗣 LEITOR ATIVADO";

      // 🔊 Ler automaticamente TODO o texto do modal
      const fullText = document.getElementById("modalDescription")?.innerText || "";
      if (fullText.trim().length > 0) {
        speakText(fullText);
      }
    }
  });


  btnRead.addEventListener("click", speakSelection);
  btnPause.addEventListener("click", pauseSpeech);
  btnResume.addEventListener("click", resumeSpeech);

  // Botão parar leitura
  btnStop.addEventListener("click", () => {
    speechSynthesis.cancel();
    voiceActive = false;

    panel.classList.add("hidden");
    btnToggle.textContent = "🗣 ATIVAR LEITOR DE VOZ";
  });
});



// ======================================================
// Carrega wikiLinks
// ======================================================
let wikiLinks = {};

fetch("data/wikiLinks.json")
  .then(res => res.json())
  .then(data => (wikiLinks = data))
  .catch(err => console.error("Erro ao carregar wikiLinks:", err));


// ======================================================
// Converte palavras-chave em links
// ======================================================
function linkifyText(text, links) {
  let result = text;
  for (const [word, url] of Object.entries(links)) {
    const regex = new RegExp(`(${word})(?=[\\s,.!?;:])`, "gi");
    result = result.replace(regex, `<a href="${url}" target="_blank" class="wiki-link">${word}</a>`);
  }
  return result;
}


// ======================================================
// Abrir modal
// ======================================================
function openModal(decade) {
  const modal = document.getElementById("timelineModal");
  const navbar = document.querySelector(".navbar");
  const btnToggle = document.getElementById("voiceToggleBtn");

  if (navbar) navbar.style.display = "none";

  // Mostrar o botão do leitor SOMENTE quando o modal abrir
  btnToggle.style.display = "block";


  // Preencher título e texto
  document.getElementById("modalYear").textContent = decade.year;
  document.getElementById("modalTitle").textContent = decade.title;

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


  // Monta imagens
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


  // Playlist (disco girando)
  const modalRight = document.querySelector(".modal-right");
  const existingDisc = document.querySelector(".playlist-section");
  if (existingDisc) existingDisc.remove();

  if (decade.playlist && decade.playlist.url) {
    const playlistSection = document.createElement("div");
    playlistSection.className = "playlist-section";

    playlistSection.innerHTML = `
      <p class="playlist-text">Acesse nossa playlist personalizada da época ➡</p>
      <a href="${decade.playlist.url}" target="_blank" class="playlist-disc-link">
          <img src="${decade.playlist.image || 'assets/images/timeline/disco.png'}" 
               class="playlist-disc" alt="Playlist da década">
      </a>
    `;

    modalRight.appendChild(playlistSection);
  }


  // Aparece modal
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 20);

  document.body.style.overflow = "hidden";

  modal.setAttribute("tabindex", "-1");
  modal.focus();
}



// ======================================================
// Fechar modal
// ======================================================
function closeModal() {
  const btnToggle = document.getElementById("voiceToggleBtn");
  const panel = document.getElementById("voicePanel");

  // Parar e desligar tudo do leitor ao fechar modal
  speechSynthesis.cancel();
  voiceActive = false;

  panel.classList.add("hidden");
  btnToggle.style.display = "none";
  btnToggle.textContent = "🗣 ATIVAR LEITOR DE VOZ";

  const modal = document.getElementById("timelineModal");
  const navbar = document.querySelector(".navbar");

  modal.classList.remove("show");

  setTimeout(() => {
    modal.style.display = "none";
    if (navbar) navbar.style.display = "flex";
    document.body.style.overflow = "";
  }, 350);
}



// ======================================================
// Navegação dentro do modal
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const modal = document.getElementById("timelineModal");

  if (modal) {
    modal.addEventListener("keydown", (e) => {
      const scrollable = modal.querySelector(".modal-content");
      const scrollSpeed = 200;
      if (!scrollable) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          scrollable.scrollBy({ top: scrollSpeed, behavior: "smooth" });
          break;

        case "ArrowUp":
          e.preventDefault();
          scrollable.scrollBy({ top: -scrollSpeed, behavior: "smooth" });
          break;

        case "ArrowLeft":
        case "ArrowRight":
          e.preventDefault();
          e.stopPropagation();
          break;
      }
    });
  }
});
