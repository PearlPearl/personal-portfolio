import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { profile } from '../src/content/portfolio';

for (const width of [360, 390, 768, 1024, 1440]) {
  test.describe(`${width}px viewport`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('renders the homepage and keeps the document within the viewport', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      const response = await page.goto('/');
      expect(response?.ok()).toBeTruthy();
      await expect(page.getByRole('heading', { level: 1, name: profile.title })).toBeVisible();

      for (const name of ['Engineering with intent.', 'Featured projects', 'Tools & practices', 'Career timeline', 'Résumé', 'Get in touch']) {
        await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
      }

      const menu = page.getByRole('button', { name: 'Navigation menu' });
      const nav = page.getByRole('navigation', { name: 'Primary' });
      if (width < 768) {
        await expect(menu).toBeVisible();
        await expect(nav).toBeHidden();
        await menu.click();
        await expect(nav).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(menu).toBeFocused();
        await expect(nav).toBeHidden();
      } else {
        await expect(menu).toBeHidden();
        await expect(nav).toBeVisible();
      }

      for (const scrollWidth of await page.evaluate(async () => {
        await document.fonts.ready;
        return [document.documentElement.scrollWidth, document.body.scrollWidth];
      })) expect(scrollWidth).toBeLessThanOrEqual(width);

      await page.getByRole('button', { name: 'Orbit', exact: true }).click();
      const panel = await page.locator('#orbit-panel').boundingBox();
      expect(panel).not.toBeNull();
      expect(panel!.x).toBeGreaterThanOrEqual(0);
      expect(panel!.x + panel!.width).toBeLessThanOrEqual(width);
      expect(errors).toEqual([]);
    });
  });
}

test('keyboard skips to content and mobile navigation moves focus to its target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();

  const menu = page.getByRole('button', { name: 'Navigation menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  const workLink = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work', exact: true });
  await workLink.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('#work')).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('all same-page links resolve to unique real elements', async ({ page }) => {
  await page.goto('/');
  const invalid = await page.locator('a[href^="#"]').evaluateAll((links) => links.flatMap((link) => {
    const href = link.getAttribute('href') ?? '';
    const id = href.slice(1);
    const matching = Array.from(document.querySelectorAll('[id]')).filter((element) => element.id === id);
    return id && matching.length === 1 ? [] : [href];
  }));
  expect(invalid).toEqual([]);
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page).toHaveURL(/#work$/);
  await page.getByRole('link', { name: 'View résumé' }).click();
  await expect(page).toHaveURL(/#resume$/);
  await expect(page.locator('a[download], a[href^="mailto:"]')).toHaveCount(0);
});

test('theme defaults to dark and both choices persist', async ({ page }) => {
  const observed: Array<string | null> = [];
  await page.exposeFunction('recordInitialTheme', (theme: string | null) => observed.push(theme));
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      if (!document.querySelector('body')) return;
      observer.disconnect();
      const record = (window as Window & { recordInitialTheme?: (theme: string | null) => void }).recordInitialTheme;
      record?.(document.documentElement.getAttribute('data-theme'));
    });
    observer.observe(document, { subtree: true, childList: true });
  });

  await page.goto('/');
  const root = page.locator('html');
  const toggle = page.getByRole('button', { name: 'Light theme' });
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(root).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(root).toHaveAttribute('data-theme', 'light');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await page.reload();
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect.poll(() => observed).toEqual(['dark', 'light', 'dark']);
});

test('Orbit greets, reacts to repeat visits, minimizes, restores, and navigates', async ({ page }) => {
  await page.goto('/');
  const orbit = page.getByRole('button', { name: 'Orbit', exact: true });
  const companion = page.getByRole('complementary', { name: 'Orbit companion' });
  await orbit.focus();
  await page.keyboard.press('Enter');
  await expect(companion).toHaveAttribute('data-state', 'greeting');
  await expect(page.getByText(/Hi, I’m Orbit/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(orbit).toHaveAttribute('aria-expanded', 'false');
  await expect(orbit).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(companion).toHaveAttribute('data-state', 'curious');
  await page.getByRole('button', { name: 'Minimize Orbit' }).click();

  const restore = page.getByRole('button', { name: 'Restore Orbit' });
  await expect(orbit).toBeHidden();
  await expect(restore).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(orbit).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('navigation', { name: 'Orbit shortcuts' }).getByRole('link', { name: 'Résumé' }).click();
  await expect(page).toHaveURL(/#resume$/);
  await expect(page.locator('#resume')).toBeFocused();
  await expect(orbit).toHaveAttribute('aria-expanded', 'false');
});

test('Orbit sleeps after inactivity and can be woken', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const companion = page.getByRole('complementary', { name: 'Orbit companion' });
  await expect(companion).toHaveAttribute('data-state', 'idle');
  await page.clock.fastForward(30_200);
  await expect(companion).toHaveAttribute('data-state', 'sleeping');
  await page.getByRole('button', { name: 'Orbit', exact: true }).click();
  await expect(companion).toHaveAttribute('data-state', 'greeting');
});

test('reduced-motion preference suppresses the digital core and companion animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const selectors = ['.core-body', '.core-revolve', '.orbit-robot', '.orbit-eyes'];
  for (const selector of selectors) await expect(page.locator(selector)).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Orbit', exact: true }).click();
  await expect(page.getByText(/Hi, I’m Orbit/)).toBeVisible();
});

for (const theme of ['dark', 'light']) {
  test(`has no automated accessibility violations in ${theme} theme with Orbit open`, async ({ page }) => {
    await page.goto('/');
    if (theme === 'light') await page.getByRole('button', { name: 'Light theme' }).click();
    await page.getByRole('button', { name: 'Orbit', exact: true }).click();
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(audit.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))).toEqual([]);
  });
}

test('the mobile site remains usable with JavaScript disabled', async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 360, height: 780 } });
  try {
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await page.getByRole('link', { name: 'Explore my work' }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.getByRole('button', { name: 'Orbit', exact: true })).toBeHidden();
  } finally {
    await page.close();
  }
});
