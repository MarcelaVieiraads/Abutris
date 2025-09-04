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
    });