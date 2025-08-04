// Função para carregar membros do quadro
async function loadBoardMembersForHeader(boardId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/board-members/board/${boardId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao carregar membros.');
        }
        const members = await response.json();
        renderBoardMembersHeader(members);
    } catch (error) {
        console.error('Erro ao carregar membros:', error);
    }
}

// Função para renderizar os ícones dos membros no header
function renderBoardMembersHeader(members) {
    const headerContainer = document.querySelector('.board-members-header');
    if (!headerContainer) return;
    headerContainer.innerHTML = members.map(member => {
        const nome = member?.userId?.nome || member?.userId?.email || 'Usuário';
        const inicial = nome.charAt(0).toUpperCase();
        const inicial2 = nome.split(' ')[1]?.charAt(0).toUpperCase() || '';
        return `<div class="w-8 h-8 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center text-xs font-bold border-2 border-gray-800" title="${nome}" data-bs-toggle="tooltip" data-bs-placement="top">${inicial}${inicial2}</div>`;
    }).join('');
    // Inicializar tooltips Bootstrap se disponível
    if (window.bootstrap && window.bootstrap.Tooltip) {
        const tooltips = headerContainer.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(el => new window.bootstrap.Tooltip(el));
    }
}

// Chame essa função ao carregar o board
window.loadBoardMembersForHeader = loadBoardMembersForHeader;
