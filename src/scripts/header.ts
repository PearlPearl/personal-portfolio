const themeKey = 'portfolio-theme';

export function initializeHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const theme = header?.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const menu = header?.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const navigation = header?.querySelector<HTMLElement>('[data-navigation]');

  if (!header || !theme || !menu || !navigation) return;

  const root = document.documentElement;
  const applyTheme = (value: 'dark' | 'light') => {
    root.dataset.theme = value;
    theme.setAttribute('aria-pressed', String(value === 'light'));
  };

  applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
  theme.hidden = false;
  theme.addEventListener('click', () => {
    const value = root.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(value);
    try {
      localStorage.setItem(themeKey, value);
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key === themeKey || event.key === null) {
      applyTheme(event.newValue === 'light' ? 'light' : 'dark');
    }
  });

  const setMenu = (open: boolean) => {
    header.dataset.menuOpen = String(open);
    menu.setAttribute('aria-expanded', String(open));
  };

  header.dataset.enhanced = '';
  menu.hidden = false;
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a');
    if (!link || header.dataset.menuOpen !== 'true') return;
    setMenu(false);
    document.getElementById(link.hash.slice(1))?.focus({ preventScroll: true });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.dataset.menuOpen === 'true') {
      setMenu(false);
      menu.focus();
    }
  });

  const desktop = matchMedia('(min-width: 768px)');
  desktop.addEventListener('change', () => setMenu(false));
}
