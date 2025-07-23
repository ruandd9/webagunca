// Variável global para a data atual
let currentDate = new Date();

// Função para gerar o calendário
function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Atualiza o título do mês
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    // Adiciona os dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day bg-gray-700 rounded-lg p-2 text-gray-500';
        dayElement.innerHTML = `<span class="text-sm">${prevMonthLastDay - i}</span>`;
        calendarGrid.appendChild(dayElement);
    }

    // Adiciona os dias do mês atual
    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day bg-gray-700 rounded-lg p-2';
        if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
            dayElement.classList.add('today');
        }
        dayElement.innerHTML = `<span class="text-sm">${i}</span>`;
        calendarGrid.appendChild(dayElement);
    }

    // Adiciona os dias do próximo mês
    const remainingDays = 42 - (startingDay + totalDays); // 42 = 6 semanas * 7 dias
    for (let i = 1; i <= remainingDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day bg-gray-700 rounded-lg p-2 text-gray-500';
        dayElement.innerHTML = `<span class="text-sm">${i}</span>`;
        calendarGrid.appendChild(dayElement);
    }

    // Renderiza os eventos após gerar o calendário
    if (typeof renderEvents === 'function') {
        renderEvents();
    }
}

// Inicializa o calendário
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o calendário com o mês atual
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

    // Adiciona eventos de clique para navegação
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    // Renderiza os eventos do dia atual
    if (typeof renderDayEvents === 'function') {
        renderDayEvents(currentDate);
    }
}); 