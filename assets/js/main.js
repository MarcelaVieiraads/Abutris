// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    // Elementos principais
    const timelineContainer = document.getElementById('timeline');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    
    // Elementos do modal que serão preenchidos
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalBands = document.getElementById('modal-bands');
    const modalLinks = document.getElementById('modal-links');
    
    // Carrega os dados da timeline
    fetch('../data/timeline.json')
        .then(response => response.json())
        .then(data => {
            createTimelineButtons(data);
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
        });
    
    // Função para criar os botões da timeline
    function createTimelineButtons(decadesData) {
        decadesData.forEach(decade => {
            // Cria o botão para cada década
            const button = document.createElement('button');
            button.className = 'decade-btn';
            button.textContent = decade.decade;
            
            // Adiciona o evento de clique
            button.addEventListener('click', () => {
                openModal(decade);
            });
            
            // Adiciona o botão ao container
            timelineContainer.appendChild(button);
        });
    }
    
    // Função para abrir o modal com os dados da década
    function openModal(decadeData) {
        // Preenche os dados do modal
        modalTitle.textContent = decadeData.title;
        modalDescription.textContent = decadeData.summary;
        
        // Limpa conteúdos anteriores
        modalBands.innerHTML = '';
        modalLinks.innerHTML = '';
        
        // Adiciona as bands
        decadeData.bands.forEach(band => {
            const bandItem = document.createElement('p');
            bandItem.textContent = '• ' + band;
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
            modalLinks.appendChild(linkElement);
        });
        
        // Mostra o modal
        modal.style.display = 'block';
    }
    
    // Fecha o modal quando clica no X
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Fecha o modal quando clica fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});