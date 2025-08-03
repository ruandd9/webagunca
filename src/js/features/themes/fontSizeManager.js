const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;

// Aplica o tamanho da fonte ao <html>
function applyFontSize(size) {
    size = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));
    document.documentElement.style.fontSize = `${size}px`;

    // Salvar no localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.fontSize = size;
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Aumenta o tamanho da fonte
function increaseFontSize() {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    applyFontSize(currentSize + 2);
}

// Diminui o tamanho da fonte
function decreaseFontSize() {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    applyFontSize(currentSize - 2);
}

// Carrega a fonte salva
function loadSavedFontSize() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const savedSize = userData.fontSize || DEFAULT_FONT_SIZE;
    applyFontSize(savedSize);
}

// Adiciona os eventos aos botões, se existirem
function setupFontButtons() {
    const inc = document.getElementById('increaseFont');
    const dec = document.getElementById('decreaseFont');

    if (inc) inc.addEventListener('click', increaseFontSize);
    if (dec) dec.addEventListener('click', decreaseFontSize);
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadSavedFontSize();
    setupFontButtons();
});