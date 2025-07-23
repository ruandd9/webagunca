// Estado dos eventos
window.calendarEvents = {
    events: []
};

// Função para carregar eventos do quadro
function loadBoardEvents() {
    const savedBoards = JSON.parse(localStorage.getItem('boards')) || [];
    const events = [];

    // Percorre todos os quadros
    savedBoards.forEach(board => {
        const boardState = localStorage.getItem(`board_${board.id}`);
        if (boardState) {
            const state = JSON.parse(boardState);
            
            // Percorre todas as listas do quadro
            Object.entries(state.lists).forEach(([listId, cards]) => {
                cards.forEach(card => {
                    if (card.deadline) {
                        events.push({
                            id: card.id,
                            title: card.title,
                            description: card.description,
                            start: card.deadline,
                            end: card.deadline, // Usando o mesmo horário para início e fim
                            type: 'card',
                            listId: listId,
                            boardId: board.id,
                            boardTitle: board.title,
                            labels: card.labels || [],
                            color: getLabelColor(card.labels)
                        });
                    }
                });
            });
        }
    });

    window.calendarEvents.events = events;
    renderEvents();
}

// Função para obter a cor baseada nas etiquetas do cartão
function getLabelColor(labels) {
    if (!labels || labels.length === 0) return 'bg-blue-500';
    
    const labelColors = {
        'urgent': 'bg-red-500',
        'feature': 'bg-green-500',
        'design': 'bg-blue-500',
        'frontend': 'bg-purple-500',
        'backend': 'bg-yellow-500',
        'uiux': 'bg-indigo-500'
    };

    // Retorna a cor da primeira etiqueta encontrada
    for (const label of labels) {
        if (labelColors[label]) {
            return labelColors[label];
        }
    }

    return 'bg-blue-500';
}

// Função para renderizar os eventos no calendário
function renderEvents() {
    const calendarGrid = document.getElementById('calendarGrid');
    const days = calendarGrid.querySelectorAll('.calendar-day');
    
    // Limpa os indicadores de eventos existentes
    days.forEach(day => {
        const eventDots = day.querySelector('.event-dots');
        if (eventDots) {
            eventDots.remove();
        }
        day.classList.remove('has-events');
    });

    // Adiciona os indicadores de eventos
    window.calendarEvents.events.forEach(event => {
        const eventDate = new Date(event.start);
        const dayElement = days[eventDate.getDate() - 1 + getFirstDayOffset()];
        
        if (dayElement) {
            dayElement.classList.add('has-events');
            
            let eventDots = dayElement.querySelector('.event-dots');
            if (!eventDots) {
                eventDots = document.createElement('div');
                eventDots.className = 'event-dots flex flex-col gap-1 mt-1';
                dayElement.appendChild(eventDots);
            }

            const eventIndicator = document.createElement('div');
            eventIndicator.className = `event-indicator ${event.color} text-white text-xs px-2 py-1 rounded-full truncate`;
            eventIndicator.title = event.title;
            eventIndicator.textContent = event.title;
            eventDots.appendChild(eventIndicator);
        }
    });
}

// Função para obter o offset do primeiro dia do mês
function getFirstDayOffset() {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return firstDay.getDay();
}

// Função para calcular o tempo restante e retornar o status
function getTimeRemaining(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    let status = {
        text: '',
        color: '',
        icon: ''
    };

    if (diffTime < 0) {
        status = {
            text: 'Atrasado',
            color: 'text-red-500',
            icon: 'fa-exclamation-circle'
        };
    } else if (diffDays === 0) {
        if (diffHours <= 3) {
            status = {
                text: `${diffHours}h restantes`,
                color: 'text-red-500',
                icon: 'fa-clock'
            };
        } else {
            status = {
                text: `${diffHours}h restantes`,
                color: 'text-yellow-500',
                icon: 'fa-clock'
            };
        }
    } else if (diffDays <= 3) {
        status = {
            text: `${diffDays}d restantes`,
            color: 'text-yellow-500',
            icon: 'fa-clock'
        };
    } else {
        status = {
            text: `${diffDays}d restantes`,
            color: 'text-green-500',
            icon: 'fa-clock'
        };
    }

    return status;
}

// Função para renderizar os eventos do dia selecionado
function renderDayEvents(date) {
    const eventsContainer = document.querySelector('.space-y-2');
    if (!eventsContainer) return;

    // Remove a seleção anterior
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected-day');
    });

    // Adiciona a seleção ao dia atual
    const dayElement = document.querySelector(`.calendar-day[data-date="${date.toISOString().split('T')[0]}"]`);
    if (dayElement) {
        dayElement.classList.add('selected-day');
    }

    const dayEvents = window.calendarEvents.events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === date.toDateString();
    });

    // Formata a data para exibição
    const formattedDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Cria o container com o título da data
    eventsContainer.innerHTML = `
        <div class="mb-4">
            <h2 class="text-xl font-semibold text-white capitalize">${formattedDate}</h2>
            <div class="mt-2 text-gray-400">
                ${dayEvents.length} ${dayEvents.length === 1 ? 'evento' : 'eventos'} para este dia
            </div>
        </div>
        <div class="events-list space-y-3">
            ${dayEvents.length === 0 ? `
                <div class="text-center text-gray-400 py-4">
                    Nenhum evento para este dia
                </div>
            ` : ''}
        </div>
    `;

    const eventsList = eventsContainer.querySelector('.events-list');

    dayEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'bg-gray-800 rounded-lg p-3 md:p-4 flex items-center justify-between event-card hover:bg-gray-700 transition-colors';
        
        const eventTime = new Date(event.start).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const timeRemaining = getTimeRemaining(event.start);

        eventElement.innerHTML = `
            <div class="flex items-center space-x-3 md:space-x-4">
                <div class="w-10 h-10 md:w-12 md:h-12 ${event.color} rounded-lg flex items-center justify-center event-icon">
                    <i class="fas fa-tasks text-lg md:text-xl"></i>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="font-medium text-sm md:text-base mr-2">${event.title}</h3>
                        <div class="flex items-center space-x-2 ${timeRemaining.color} text-sm">
                            <i class="fas ${timeRemaining.icon}"></i>
                            <span>${timeRemaining.text}</span>
                        </div>
                    </div>
                    <div class="event-time text-gray-400 text-sm">
                        <i class="far fa-clock mr-1"></i>
                        <span>${eventTime}</span>
                    </div>
                    <div class="text-sm text-gray-400 mt-1">
                        <span class="font-medium">Quadro:</span> ${event.boardTitle}
                    </div>
                    ${event.description ? `
                        <p class="text-sm text-gray-400 mt-1">${event.description}</p>
                    ` : ''}
                </div>
            </div>
            <div class="event-actions flex space-x-2">
                <button class="text-gray-400 hover:text-white p-2 transition-colors" onclick="editCard('${event.id}', '${event.boardId}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-400 hover:text-white p-2 transition-colors" onclick="deleteCard('${event.id}', '${event.boardId}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        eventsList.appendChild(eventElement);
    });
}

// Função para editar um cartão
function editCard(cardId, boardId) {
    // Salvar o ID do cartão e do quadro no localStorage
    localStorage.setItem('editCardId', cardId);
    localStorage.setItem('editCardBoardId', boardId);
    
    // Redirecionar para a página do quadro
    window.location.href = `Quadros.html?board=${boardId}`;
}

// Função para excluir um cartão
function deleteCard(cardId, boardId) {
    if (confirm('Tem certeza que deseja excluir este cartão?')) {
        const boardState = JSON.parse(localStorage.getItem(`board_${boardId}`));
        
        for (const listId in boardState.lists) {
            const cardIndex = boardState.lists[listId].findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                boardState.lists[listId].splice(cardIndex, 1);
                break;
            }
        }

        localStorage.setItem(`board_${boardId}`, JSON.stringify(boardState));
        loadBoardEvents();
    }
}

// Adiciona evento de clique nos dias do calendário
document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.addEventListener('click', (e) => {
        const dayElement = e.target.closest('.calendar-day');
        if (dayElement && !dayElement.classList.contains('text-gray-500')) {
            const day = parseInt(dayElement.querySelector('span').textContent);
            const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            // Adiciona o atributo data-date para facilitar a seleção
            dayElement.setAttribute('data-date', selectedDate.toISOString().split('T')[0]);
            
            renderDayEvents(selectedDate);
        }
    });

    // Carrega os eventos do quadro
    loadBoardEvents();
}); 