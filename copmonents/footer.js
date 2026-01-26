class CustomFooter extends HTMLElement {
    connectedCallback() {
        // Используем обычный DOM вместо Shadow DOM для совместимости с Tailwind и Feather Icons
        this.innerHTML = `
            <footer class="custom-footer py-12 text-center text-white">
                <div class="container mx-auto px-6">
                    <div class="flex justify-center gap-6 mb-6">
                        <a href="https://github.com/KaRameLkA-jpg" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-neon-purple/20 transition-all duration-300 hover:-translate-y-1">
                            <i data-feather="github"></i>
                        </a>
                        <a href="mailto:zerkof7@gmail.com" class="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-neon-purple/20 transition-all duration-300 hover:-translate-y-1">
                            <i data-feather="mail"></i>
                        </a>
                        <a href="https://t.me/nastysha_kirs" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-neon-purple/20 transition-all duration-300 hover:-translate-y-1">
                            <i data-feather="send"></i>
                        </a>
                    </div>
                    <p class="opacity-60 text-sm">© ${new Date().getFullYear()} Анастасия Кирсанова. Все права защищены.</p>
                </div>
            </footer>
        `;
        
        // Replace icons after render
        setTimeout(() => {
            feather.replace();
        }, 100);
    }
}

customElements.define('custom-footer', CustomFooter);