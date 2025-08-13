/*
 * Common header and footer components for the LicençasHub 365 portal.
 *
 * The `<site-header>` component renders a consistent navigation bar with
 * the portal name and links to all key pages. It highlights the link
 * corresponding to the current page based on the browser pathname. The
 * header uses the existing Tailwind utility classes defined in each page
 * (such as `gradient-bg` and `glass-card`) to ensure stylistic harmony.
 *
 * The `<site-footer>` component provides a simple footer with a
 * copyright notice and automatically updates the year.
 */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    // Determine the current page from the URL. When hosted at the root
    // (e.g. `/`), default to `index.html` for highlighting purposes.
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '') {
      currentPage = 'index.html';
    }
    // Determine login state to adapt navigation. Users must log in to
    // access private areas of the portal. When not logged in, only
    // public links (home, login and register) are shown; otherwise the
    // full dashboard and settings links are available along with a
    // logout option.
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
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
    // Build the navigation HTML, applying an active style to whichever
    // link matches the current page. Logout is treated specially and
    // does not receive active styling. Use `/` separators only on
    // larger screens.
    const navHtml = navLinks
      .map(({ href, label, isLogout }) => {
        const isActive = href === currentPage && !isLogout;
        const baseClasses = isActive
          ? 'font-semibold text-gray-900'
          : 'text-gray-600 hover:text-gray-800';
        const idAttr = isLogout ? 'id="logoutLink"' : '';
        // Use # for logout anchor if provided. Otherwise use the href.
        const linkHref = isLogout ? '#' : href;
        return `<a ${idAttr} href="${linkHref}" class="${baseClasses}">${label}</a>`;
      })
      .join('<span class="mx-2 text-gray-400 hidden sm:inline">/</span>');
    // Render the header. The gradient background and overlay blur come
    // from classes defined in the individual pages. The navigation is
    // placed to the right of the portal branding on larger screens and
    // wraps below on smaller devices.
    this.innerHTML = `
      <header class="gradient-bg text-white shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 relative z-10">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span class="text-xl sm:text-2xl">🔒</span>
            </div>
            <div>
              <h1 class="text-lg sm:text-2xl font-bold tracking-wide">LicençasHub 365</h1>
              <p class="text-blue-100 text-xs sm:text-sm">Gestão centralizada de licenças</p>
            </div>
          </div>
          <nav class="flex flex-wrap items-center text-sm sm:text-base gap-x-2 sm:gap-x-4">
            ${navHtml}
          </nav>
        </div>
      </header>
    `;
    // After rendering, attach a listener to the logout link if present.
    const logoutLink = this.querySelector('#logoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', (evt) => {
        evt.preventDefault();
        // Clear login state and redirect to login page.
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
      });
    }
  }
}
customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer class="bg-gray-100 text-gray-600 text-center py-6 mt-12">
        <div class="max-w-7xl mx-auto px-4">
          <p class="text-sm">&copy; ${year} LicençasHub 365. Todos os direitos reservados.</p>
        </div>
      </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);
