
/*
 * LicençasHub 365 – Header & Footer (Mobile‑first, acessível)
 * - Header sticky + menu hambúrguer em ecrãs pequenos
 * - Realce da página ativa e aria-current
 * - Adapta navegação consoante sessão (localStorage.isLoggedIn === 'true')
 * - Logout limpa estado e redireciona para login.html
 */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    // 1) Página atual
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage) currentPage = 'index.html';

    // 2) Estado de sessão
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // 3) Links
    const navPrivate = [
      { href: 'homepage.html', label: 'Início' },
      { href: 'index.html', label: 'Dashboard' },
      { href: 'planos.html', label: 'Planos' },
      { href: 'billing.html', label: 'Faturação' },
      { href: 'graph.html', label: 'Métricas' },
      { href: 'settings-profile.html', label: 'Perfil' },
      { href: 'settings-security.html', label: 'Segurança' },
      { href: 'settings-notifications.html', label: 'Notificações' },
      { href: '#logout', label: 'Sair', isLogout: true }
    ];
    const navPublic = [
      { href: 'homepage.html', label: 'Início' },
      { href: 'login.html', label: 'Entrar' },
      { href: 'register.html', label: 'Registar' }
    ];
    const navLinks = isLoggedIn ? navPrivate : navPublic;

    // 4) Render helpers
    const linkClass = (active) =>
      [
        'block px-3 py-2 rounded-lg text-sm',
        active
          ? 'bg-white/20 text-white font-semibold'
          : 'text-white/90 hover:text-white hover:bg-white/10'
      ].join(' ');

    const makeLink = ({ href, label, isLogout }) => {
      const linkHref = isLogout ? '#' : href;
      const isActive = !isLogout && href === currentPage;
      const aria = isActive ? 'aria-current="page"' : '';
      const idAttr = isLogout ? 'id="logoutLink"' : '';
      return `<a ${idAttr} ${aria} href="${linkHref}" class="${linkClass(isActive)}">${label}</a>`;
    };

    const desktopLinks = navLinks.map(makeLink).join('');
    const mobileLinks = navLinks
      .map((l) =>
        `<li class="border-t border-white/10">${makeLink(l)}</li>`
      )
      .join('');

    // 5) HTML (mobile-first)
    this.innerHTML = `
      <header class="sticky top-0 z-50 gradient-bg text-white shadow-2xl relative">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <!-- Branding -->
            <a href="homepage.html" class="flex items-center gap-3 min-w-0">
              <span class="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">🔒</span>
              <span class="flex flex-col min-w-0">
                <span class="text-base font-bold tracking-wide truncate">LicençasHub 365</span>
                <span class="text-xs text-blue-100 truncate">Gestão centralizada de licenças</span>
              </span>
            </a>

            <!-- Ações topo (sm+) -->
            <nav class="hidden sm:flex items-center gap-1" aria-label="Navegação principal">
              ${desktopLinks}
            </nav>

            <!-- Botão menu (mobile) -->
            <button
              id="menuToggle"
              class="sm:hidden inline-flex items-center justify-center p-2 rounded-lg ring-1 ring-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-controls="primary-menu"
              aria-expanded="false"
              aria-label="Abrir menu"
            >
              <!-- ícone hambúrguer -->
              <svg id="iconOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <!-- ícone fechar -->
              <svg id="iconClose" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hidden" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Menu mobile -->
          <div id="primary-menu" class="sm:hidden hidden mt-3 glass-card rounded-xl overflow-hidden ring-1 ring-white/15 backdrop-blur-md" role="menu">
            <ul class="py-1" id="mobileMenuList">
              ${mobileLinks}
            </ul>
          </div>
        </div>
      </header>
    `;

    // 6) Interações
    const menu = this.querySelector('#primary-menu');
    const btn = this.querySelector('#menuToggle');
    const iconOpen = this.querySelector('#iconOpen');
    const iconClose = this.querySelector('#iconClose');

    const setExpanded = (expanded) => {
      btn.setAttribute('aria-expanded', String(expanded));
      btn.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
      if (expanded) {
        menu.classList.remove('hidden');
        iconOpen.classList.add('hidden');
        iconClose.classList.remove('hidden');
        // foco inicial
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus({ preventScroll: true });
      } else {
        menu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
    };

    btn?.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
    });

    // Fechar ao clicar num link (mobile)
    menu?.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;

      // Logout
      if (a.id === 'logoutLink') {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        setExpanded(false);
        window.location.href = 'login.html';
        return;
      }

      // Navegação normal fecha menu
      setExpanded(false);
    });

    // Fechar com ESC e clique fora
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setExpanded(false);
    });
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) setExpanded(false);
    });
  }
}
customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer class="mt-10">
        <div class="max-w-7xl mx-auto px-4">
          <div class="glass-card rounded-2xl py-6 px-4 text-center ring-1 ring-black/5">
            <p class="text-sm text-gray-600">
              &copy; ${year} <strong>LicençasHub 365</strong>. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);

