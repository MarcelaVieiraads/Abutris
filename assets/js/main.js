document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.getElementById('timeline');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalBands = document.getElementById('modal-bands');
    const modalLinks = document.getElementById('modal-links');

    // Carrega os dados da timeline
    fetch('../../data/timeline.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados');
            }
            return response.json();
        })
        .then(data => {
            createTimelineButtons(data);
        })
        .catch(error => {
            console.error('Erro:', error);
            timelineContainer.innerHTML = '<p>Erro ao carregar a timeline. Recarregue a página.</p>';
        });

    // Função para criar os botões da timeline
    function createTimelineButtons(decadesData) {
        decadesData.forEach(decade => {
            const button = document.createElement('button');
            button.className = 'decade-btn';
            button.textContent = decade.decade;
            button.setAttribute('aria-label', `Explorar década de ${decade.decade}`);
            
            button.addEventListener('click', () => {
                openModal(decade);
            });
            
            timelineContainer.appendChild(button);
        });
        
        // Atualiza a scrollbar após criar todos os botões
        setTimeout(updateScrollThumb, 300);
    }

    // Função para abrir o modal com os dados da década
    function openModal(decadeData) {
        modalTitle.textContent = decadeData.title;
        modalDescription.textContent = decadeData.summary;
        
        // Limpa conteúdos anteriores
        modalBands.innerHTML = '';
        modalLinks.innerHTML = '';
        
        // Adiciona as bands
        decadeData.bands.forEach(band => {
            const bandItem = document.createElement('li');
            bandItem.textContent = band;
            bandItem.className = 'modal__band-item';
            modalBands.appendChild(bandItem);
        });
        
        // Adiciona os links
        decadeData.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.textContent = link.text;
            linkElement.className = 'modal__link';
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';
            modalLinks.appendChild(linkElement);
        });
        
        // Mostra o modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Impede scroll da página principal
    }
    
    // Fecha o modal quando clica no X
    modalClose.addEventListener('click', closeModal);
    
    // Fecha o modal quando clica fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Fecha o modal com ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Reativa scroll da página principal
    }

    // === SCROLL HORIZONTAL DA TIMELINE ===
    const timelineScrollContainer = document.querySelector('.timeline-container');
    const timeline = document.getElementById('timeline');
    const scrollThumb = document.querySelector('.timeline-scroll-thumb');
    const scrollBar = document.querySelector('.timeline-scroll-bar');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    // Atualiza a posição do thumb da scrollbar
    function updateScrollThumb() {
        if (!timelineScrollContainer || !timeline || !scrollThumb) return;
        
        const scrollableWidth = timeline.scrollWidth - timelineScrollContainer.clientWidth;
        if (scrollableWidth <= 0) {
            scrollThumb.style.width = '100%';
            return;
        }
        
        const scrollPosition = timelineScrollContainer.scrollLeft;
        const thumbPosition = (scrollPosition / scrollableWidth) * 100;
        
        scrollThumb.style.left = `${thumbPosition}%`;
        const thumbWidth = Math.max(20, (timelineScrollContainer.clientWidth / timeline.scrollWidth) * 100);
        scrollThumb.style.width = `${thumbWidth}%`;
        
        // Atualiza estados dos botões de seta
        if (scrollLeftBtn && scrollRightBtn) {
            scrollLeftBtn.disabled = scrollPosition <= 10;
            scrollRightBtn.disabled = scrollPosition >= scrollableWidth - 10;
            
            // Estilo visual para botões desabilitados
            scrollLeftBtn.style.opacity = scrollPosition <= 10 ? '0.5' : '1';
            scrollRightBtn.style.opacity = scrollPosition >= scrollableWidth - 10 ? '0.5' : '1';
            scrollLeftBtn.style.cursor = scrollPosition <= 10 ? 'not-allowed' : 'pointer';
            scrollRightBtn.style.cursor = scrollPosition >= scrollableWidth - 10 ? 'not-allowed' : 'pointer';
        }
    }

    // Scroll quando clica na barra
    if (scrollBar) {
        scrollBar.addEventListener('click', (e) => {
            const scrollableWidth = timeline.scrollWidth - timelineScrollContainer.clientWidth;
            if (scrollableWidth <= 0) return;
            
            const clickPosition = (e.clientX - scrollBar.getBoundingClientRect().left) / scrollBar.clientWidth;
            timelineScrollContainer.scrollTo({
                left: clickPosition * scrollableWidth,
                behavior: 'smooth'
            });
        });
    }

    // Botões de seta para controle de scroll
    if (scrollLeftBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            timelineScrollContainer.scrollBy({
                left: -400,
                behavior: 'smooth'
            });
        });
    }

    if (scrollRightBtn) {
        scrollRightBtn.addEventListener('click', () => {
            timelineScrollContainer.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        });
    }

    // Scroll suave ao arrastar o thumb
    let isDragging = false;

    if (scrollThumb) {
        scrollThumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
    }

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !scrollBar || !timelineScrollContainer) return;
        
        const scrollableWidth = timeline.scrollWidth - timelineScrollContainer.clientWidth;
        if (scrollableWidth <= 0) return;
        
        const dragPosition = (e.clientX - scrollBar.getBoundingClientRect().left) / scrollBar.clientWidth;
        timelineScrollContainer.scrollLeft = Math.max(0, Math.min(scrollableWidth, dragPosition * scrollableWidth));
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Atualiza scrollbar quando a timeline é scrollada
    if (timelineScrollContainer) {
        timelineScrollContainer.addEventListener('scroll', updateScrollThumb);
    }

    // Atualiza scrollbar quando a janela é redimensionada
    window.addEventListener('resize', updateScrollThumb);

    // Também atualiza quando o mouse sai da janela (para evitar bugs de drag)
    document.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    // Atualiza scrollbar inicialmente e após um delay para garantir que tudo carregou
    setTimeout(updateScrollThumb, 100);
    setTimeout(updateScrollThumb, 500);
});