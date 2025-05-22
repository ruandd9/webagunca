// Inicializa a página quando carregada
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeBoardLinks();
});

// Inicializa a busca de quadros
function initializeSearch() {
    const searchInput = document.querySelector('input[placeholder="Pesquisar quadros..."]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const boards = document.querySelectorAll('.board');
            
            boards.forEach(board => {
                const title = board.querySelector('h3').textContent.toLowerCase();
                const description = board.querySelector('.text-gray-400').textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    board.style.display = '';
                } else {
                    board.style.display = 'none';
                }
            });
        });
    }
}

// Inicializa os links dos quadros base
function initializeBoardLinks() {
    const boards = document.querySelectorAll('.board');
    boards.forEach(board => {
        board.addEventListener('click', (e) => {
            e.preventDefault();
            const boardTitle = board.querySelector('h3').textContent;
            window.location.href = `./Quadros.html?board=${encodeURIComponent(boardTitle)}`;
        });
    });
}
