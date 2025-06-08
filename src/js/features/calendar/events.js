// Estado dos eventos
window.calendarEvents = {
    events: []
};

// Função para carregar eventos do quadro
function loadBoardEvents() {
    const boardState = localStorage.getItem('boardState');
    if (boardState) {
        const state = JSON.parse(boardState);
        const events = [];

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
                        labels: card.labels || [],
                        color: getLabelColor(card.labels)
                    });
                }
            });
        });

        window.calendarEvents.events = events;
        renderEvents();
    }
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
                eventDots.className = 'event-dots flex justify-center mt-1';
                dayElement.appendChild(eventDots);
            }

            const dot = document.createElement('div');
            dot.className = `event-dot ${event.color}`;
            eventDots.appendChild(dot);
        }
    });
}

// Função para obter o offset do primeiro dia do mês
function getFirstDayOffset() {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return firstDay.getDay();
}

// Função para renderizar os eventos do dia selecionado
function renderDayEvents(date) {
    const eventsContainer = document.querySelector('.space-y-2');
    if (!eventsContainer) return;

    const dayEvents = window.calendarEvents.events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === date.toDateString();
    });

    eventsContainer.innerHTML = '';

    if (dayEvents.length === 0) {
        eventsContainer.innerHTML = `
            <div class="text-center text-gray-400 py-4">
                Nenhum evento para este dia
            </div>
        `;
        return;
    }

    dayEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'bg-gray-800 rounded-lg p-3 md:p-4 flex items-center justify-between event-card';
        
        const eventTime = new Date(event.start).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        eventElement.innerHTML = `
            <div class="flex items-center space-x-3 md:space-x-4">
                <div class="w-10 h-10 md:w-12 md:h-12 ${event.color} rounded-lg flex items-center justify-center event-icon">
                    <i class="fas fa-tasks text-lg md:text-xl"></i>
                </div>
                <div>
                    <h3 class="font-medium text-sm md:text-base">${event.title}</h3>
                    <div class="event-time">
                        <i class="far fa-clock"></i>
                        <span>${eventTime}</span>
                    </div>
                    ${event.description ? `
                        <p class="text-sm text-gray-400 mt-1">${event.description}</p>
                    ` : ''}
                </div>
            </div>
            <div class="event-actions flex space-x-2">
                <button class="text-gray-400 hover:text-white p-2" onclick="editCard('${event.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-400 hover:text-white p-2" onclick="deleteCard('${event.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        eventsContainer.appendChild(eventElement);
    });
}

// Função para editar um cartão
function editCard(cardId) {
    // Encontrar o cartão no estado do quadro
    const boardState = JSON.parse(localStorage.getItem('boardState'));
    let cardToEdit = null;
    let listId = null;
    
    for (const currentListId in boardState.lists) {
        const card = boardState.lists[currentListId].find(c => c.id === cardId);
        if (card) {
            cardToEdit = card;
            listId = currentListId;
            break;
        }
    }
    
    if (cardToEdit) {
        // Salvar o ID do cartão e da lista no localStorage
        localStorage.setItem('editCardId', cardId);
        localStorage.setItem('editCardListId', listId);
        
        // Redirecionar para a página do quadro
        window.location.href = 'Quadros.html';
    }
}

// Função para excluir um cartão
function deleteCard(cardId) {
    if (confirm('Tem certeza que deseja excluir este cartão?')) {
        const boardState = JSON.parse(localStorage.getItem('boardState'));
        
        for (const listId in boardState.lists) {
            const cardIndex = boardState.lists[listId].findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                boardState.lists[listId].splice(cardIndex, 1);
                break;
            }
        }

        localStorage.setItem('boardState', JSON.stringify(boardState));
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
            renderDayEvents(selectedDate);
        }
    });

    // Carrega os eventos do quadro
    loadBoardEvents();
}); 