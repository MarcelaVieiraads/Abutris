/* main.js - gera a timeline, abre modais e controla scroll */
document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.getElementById('timeline');
  const timelineContainer = document.getElementById('timeline-container');
  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');

  const modal = document.getElementById('modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalBands = document.getElementById('modal-bands');
  const modalLinks = document.getElementById('modal-links');
  const pageWrapper = document.querySelector('.page-wrapper');

  // dados da linha do tempo (edite como quiser)
  const timelineData = {
    "1970": {
      title: "O Surgimento",
      text: "O punk rock emerge como um movimento de rebeldia contra o establishment musical e social...",
      bands: ["Sex Pistols", "The Ramones", "The Clash", "Iggy Pop & The Stooges"],
      linkText: "Documentário - Anos 70",
      link: "https://www.youtube.com/"
    },
    "1980": {
      title: "Hardcore e Expansão",
      text: "O punk se ramifica — hardcore, cenas locais e mais agressividade musical.",
      bands: ["Black Flag", "Dead Kennedys", "Bad Brains", "Misfits"],
      linkText: "Documentário - Anos 80",
      link: "https://www.youtube.com/",
    },
    "1990": {
      title: "Renascimento",
      text: "Nos 90 o punk volta às rádios com novas sonoridades e bandas que alcançam o mainstream.",
      bands: ["Green Day", "Rancid", "The Offspring", "NOFX"],
      linkText: "Anos 90 - Clips",
      link: "https://www.youtube.com/"
    },
    "2000": {
      title: "Punk Pop / Alternativo",
      text: "Misturas com pop-punk e emo trazem o estilo para um público mais amplo.",
      bands: ["Blink-182", "Sum 41", "My Chemical Romance", "Paramore"],
      linkText: "Anos 2000 - Playlists",
      link: "https://www.youtube.com/"
    },
    "2010": {
      title: "Cena Atual",
      text: "DIY e cenas locais mantendo o espírito punk vivo — diverso e em movimento.",
      bands: ["Bandas Locais", "Novas Experiências", "Misturas de estilos"],
      linkText: "Punk Hoje",
      link: "https://www.youtube.com/"
    },
    "Atual": {
      title: "Punk Hoje",
      text: "Continuamos: o punk se reinventa nas ruas, nas redes e nos palcos pequenos.",
      bands: ["DIY Bands", "Zines", "Comunidades Locais"],
      linkText: "Saiba Mais",
      link: "https://www.youtube.com/"
    }
  };

  // imagens de background por década (opcional)
  const bgByYear = {
    "1970": "assets/images/bg-1970.jpg",
    "1980": "assets/images/bg-1980.jpg",
    "1990": "assets/images/bg-1990.jpg",
    "2000": "assets/images/bg-2000.jpg",
    "2010": "assets/images/bg-2010.jpg",
    "Atual": "assets/images/bg-paper.jpg"
  };

  // cria os botões da timeline
  Object.keys(timelineData).forEach(year => {
    const btn = document.createElement('button');
    btn.className = 'timeline-item';
    btn.textContent = year;
    btn.dataset.year = year;
    btn.addEventListener('click', () => openModal(year));
    timeline.appendChild(btn);
  });

  // abre modal e preenche conteúdo
  function openModal(year){
    const data = timelineData[year];
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.text;
    modalBands.innerHTML = data.bands.map(b => `<li>${b}</li>`).join('');
    modalLinks.innerHTML = `<a href="${data.link}" target="_blank" rel="noopener">${data.linkText}</a>`;

    // muda o "papel" central para imagem temática (se existir) — se não, mantém o papel padrão
    const bg = bgByYear[year] || 'assets/images/bg-paper.jpg';
    pageWrapper.style.backgroundImage = `url('${bg}')`;
    pageWrapper.style.backgroundSize = 'cover';
    pageWrapper.style.backgroundRepeat = 'repeat';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  // fecha modal e volta ao papel padrão
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    pageWrapper.style.backgroundImage = "url('assets/images/bg-paper.jpg')";
  }

  // eventos de fechar
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeModal();
  });

  // controles de scroll horizontal
  scrollLeftBtn.addEventListener('click', () => {
    timelineContainer.scrollBy({ left: -360, behavior: 'smooth' });
  });
  scrollRightBtn.addEventListener('click', () => {
    timelineContainer.scrollBy({ left: 360, behavior: 'smooth' });
  });

  // atualiza o ano do footer
  document.getElementById('year').textContent = new Date().getFullYear();
});
