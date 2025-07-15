class Tutorial {
    constructor() {
        console.log('Construtor do Tutorial iniciado');
        
        this.steps = [
            {
                target: '.sidebar',
                position: 'right',
                title: 'Bem-vindo ao Quadro Kanban!',
                content: 'Este é o menu lateral onde você pode navegar entre as diferentes funcionalidades do sistema.',
                highlight: true
            },
            {
                target: '.add-list-btn',
                position: 'bottom',
                title: 'Criar Lista',
                content: 'Clique aqui para criar uma nova lista. As listas ajudam a organizar seus cartões em diferentes estágios.',
                highlight: true
            },
            {
                target: '.add-card-btn',
                position: 'bottom',
                title: 'Adicionar Cartão',
                content: 'Clique aqui para adicionar um novo cartão à lista. Os cartões representam suas tarefas ou itens.',
                highlight: true
            },
            {
                target: '#search-input',
                position: 'bottom',
                title: 'Pesquisar',
                content: 'Use esta barra de pesquisa para encontrar cartões específicos em seu quadro.',
                highlight: true
            },
            {
                target: '#filter-button',
                position: 'bottom',
                title: 'Filtrar',
                content: 'Clique aqui para filtrar seus cartões por etiquetas ou outros critérios.',
                highlight: true
            }
        ];

        this.currentStep = 0;
        this.overlay = document.getElementById('tutorial-overlay');
        this.tooltip = document.getElementById('tutorial-tooltip');
        this.content = this.tooltip.querySelector('.tutorial-content');
        this.progress = document.getElementById('tutorial-progress');
        this.prevButton = document.getElementById('tutorial-prev');
        this.nextButton = document.getElementById('tutorial-next');

        if (!this.overlay || !this.tooltip || !this.content || !this.progress || !this.prevButton || !this.nextButton) {
            console.error('Elementos do tutorial não encontrados');
            return;
        }

        console.log('Elementos do tutorial encontrados, iniciando...');
        this.init();
    }

    init() {
        console.log('Iniciando tutorial...');
        
        // Inicializar botões
        this.prevButton.addEventListener('click', () => this.prevStep());
        this.nextButton.addEventListener('click', () => this.nextStep());

        // Inicializar progresso
        this.updateProgress();

        // Mostrar tutorial
        this.showStep(0);

        // Adicionar listener para redimensionamento da janela
        window.addEventListener('resize', () => {
            this.showStep(this.currentStep);
        });

        // Adicionar botão para reiniciar o tutorial
        this.addRestartButton();
    }

    showStep(index) {
        console.log(`Mostrando passo ${index}`);
        const step = this.steps[index];
        const target = document.querySelector(step.target);

        if (!target) {
            console.error(`Elemento alvo não encontrado: ${step.target}`);
            return;
        }

        // Remover highlight anterior
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        // Adicionar highlight ao elemento atual
        if (step.highlight) {
            target.classList.add('tutorial-highlight');
        }

        // Posicionar tooltip
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Determinar a melhor posição para o tooltip
        let position = step.position;
        let top, left;

        // Calcular posições para cada direção
        const positions = {
            top: {
                top: rect.top - tooltipRect.height - 10,
                left: rect.left + (rect.width / 2) - (tooltipRect.width / 2)
            },
            bottom: {
                top: rect.bottom + 10,
                left: rect.left + (rect.width / 2) - (tooltipRect.width / 2)
            },
            left: {
                top: rect.top + (rect.height / 2) - (tooltipRect.height / 2),
                left: rect.left - tooltipRect.width - 10
            },
            right: {
                top: rect.top + (rect.height / 2) - (tooltipRect.height / 2),
                left: rect.right + 10
            }
        };

        // Verificar se a posição atual está visível
        const isPositionVisible = (pos) => {
            const { top, left } = positions[pos];
            return (
                top >= 0 &&
                left >= 0 &&
                top + tooltipRect.height <= viewportHeight &&
                left + tooltipRect.width <= viewportWidth
            );
        };

        // Se a posição atual não estiver visível, tentar outras posições
        if (!isPositionVisible(position)) {
            const possiblePositions = ['top', 'bottom', 'left', 'right'];
            for (const pos of possiblePositions) {
                if (isPositionVisible(pos)) {
                    position = pos;
                    break;
                }
            }
        }

        // Ajustar posição para garantir que o tooltip fique visível
        const finalPosition = positions[position];
        top = Math.max(10, Math.min(finalPosition.top, viewportHeight - tooltipRect.height - 10));
        left = Math.max(10, Math.min(finalPosition.left, viewportWidth - tooltipRect.width - 10));

        // Aplicar posição
        this.tooltip.className = `tutorial-tooltip ${position}`;
        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;

        // Atualizar conteúdo
        this.content.innerHTML = `
            <h3 class="font-semibold mb-2">${step.title}</h3>
            <p class="text-sm">${step.content}</p>
        `;
        this.content.classList.add('active');

        // Atualizar botões
        this.prevButton.style.display = index === 0 ? 'none' : 'block';
        this.nextButton.textContent = index === this.steps.length - 1 ? 'Concluir' : 'Próximo';

        // Mostrar overlay
        this.overlay.classList.add('active');

        // Scroll para o elemento alvo
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
        }
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgress();
        } else {
            this.complete();
        }
    }

    updateProgress() {
        this.progress.innerHTML = '';
        for (let i = 0; i < this.steps.length; i++) {
            const dot = document.createElement('div');
            dot.className = `tutorial-progress-dot ${i === this.currentStep ? 'active' : ''}`;
            this.progress.appendChild(dot);
        }
    }

    complete() {
        this.overlay.classList.remove('active');
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    }

    addRestartButton() {
        // Verificar se o botão já existe
        if (document.getElementById('restart-tutorial')) {
            return;
        }

        const restartButton = document.createElement('button');
        restartButton.id = 'restart-tutorial';
        restartButton.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors z-50';
        restartButton.innerHTML = '<i class="fas fa-graduation-cap mr-2"></i>Iniciar Tutorial';
        restartButton.addEventListener('click', () => {
            this.currentStep = 0;
            this.showStep(0);
            this.updateProgress();
        });

        document.body.appendChild(restartButton);
    }
}

// Não inicializar automaticamente, deixar para o script principal
// O tutorial será iniciado pela função startTutorial() no arquivo HTML 