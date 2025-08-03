document.addEventListener('DOMContentLoaded', function() {
    
    // --- Controle do menu mobile ---
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Fechar o menu quando clicar fora
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });

        mobileMenu.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                mobileMenu.classList.add('hidden');
            }
        });
    }
});