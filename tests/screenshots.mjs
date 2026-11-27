import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { chromium } from '@playwright/test';

const output = process.env.PORTFOLIO_SCREENSHOT_DIR ?? 'artifacts/screenshots';
const dist = resolve('dist');
const mimeTypes = { css: 'text/css', html: 'text/html', js: 'text/javascript', svg: 'image/svg+xml', woff2: 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    const filePath = resolve(dist, pathname === '/' ? 'index.html' : `.${pathname}`);
    if (!filePath.startsWith(`${dist}${sep}`)) {
      response.writeHead(404).end();
      return;
    }
    const content = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': mimeTypes[filePath.split('.').at(-1)] ?? 'application/octet-stream' }).end(content);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Could not start the screenshot server.');

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
let browser;
try {
  await mkdir(output, { recursive: true });
  browser = await chromium.launch({ executablePath });
  for (const { name, width, height } of [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${address.port}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    await page.close();
  }
} finally {
  await browser?.close();
  server.close();
}
