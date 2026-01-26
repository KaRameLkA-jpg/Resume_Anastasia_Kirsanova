class CustomNavbar extends HTMLElement {
    connectedCallback() {
        // Используем обычный DOM вместо Shadow DOM для совместимости с Tailwind и Feather Icons
        this.innerHTML = `
            <nav class="custom-navbar text-white" id="main-nav">
                <div class="container mx-auto px-6">
                    <div class="flex justify-between items-center py-4">
                        <a href="#" class="text-xl font-bold">
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">АНАСТАСИЯ</span>
                        </a>
                        
                        <div class="hidden md:flex space-x-8">
                            <a href="#about" class="nav-link hover:text-neon-purple transition-colors">Обо мне</a>
                            <a href="#skills" class="nav-link hover:text-neon-purple transition-colors">Навыки</a>
                            <a href="#work" class="nav-link hover:text-neon-purple transition-colors">Проекты</a>
                            <a href="#contact" class="nav-link hover:text-neon-purple transition-colors">Контакты</a>
                        </div>
                        
                        <button class="md:hidden focus:outline-none text-white" id="menu-toggle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <div class="mobile-menu md:hidden overflow-hidden transition-all duration-300" id="mobile-menu" style="max-height: 0;">
                        <div class="flex flex-col space-y-4 py-4">
                            <a href="#about" class="nav-link hover:text-neon-purple transition-colors">Обо мне</a>
                            <a href="#skills" class="nav-link hover:text-neon-purple transition-colors">Навыки</a>
                            <a href="#work" class="nav-link hover:text-neon-purple transition-colors">Проекты</a>
                            <a href="#contact" class="nav-link hover:text-neon-purple transition-colors">Контакты</a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
        
        // Initialize menu toggle for mobile
        const menuToggle = this.querySelector('#menu-toggle');
        const mobileMenu = this.querySelector('#mobile-menu');
        
        menuToggle.addEventListener('click', function() {
            if (mobileMenu.style.maxHeight === '0px' || mobileMenu.style.maxHeight === '') {
                mobileMenu.style.maxHeight = '300px';
            } else {
                mobileMenu.style.maxHeight = '0px';
            }
        });

        // Scroll effect
        window.addEventListener('scroll', () => {
            const nav = this.querySelector('#main-nav');
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
}

customElements.define('custom-navbar', CustomNavbar);