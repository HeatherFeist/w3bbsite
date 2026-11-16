import { spawn, type ChildProcess } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { listPublicPages, sitemapXml } from '../src/seo/publicPages';
import { OG_IMAGE_PATH, SITE_ORIGIN, ogImageUrl } from '../src/seo/siteMeta';

const DIST = resolve(process.cwd(), 'dist');
const PORT = 4173;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function replaceMeta(html: string, attr: 'name' | 'property', key: string, content: string): string {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function shellFor(template: string, title: string, description: string, path: string): string {
  const url = path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
  const heading = title.replace(/ — W3BB Worldwide$/, '');
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'property', 'og:url', url);
  html = replaceMeta(html, 'property', 'og:image', ogImageUrl());
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', description);
  html = replaceMeta(html, 'name', 'twitter:image', ogImageUrl());
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`);
  const body = `<main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p></main>`;
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function outputFile(path: string): string {
  if (path === '/') return resolve(DIST, 'index.html');
  return resolve(DIST, path.slice(1), 'index.html');
}

function findChrome(): string | null {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

async function renderWithChrome(pages: { path: string; title: string }[]): Promise<boolean> {
  const executablePath = findChrome();
  if (!executablePath) {
    console.log('Chrome was not found. Wrote HTML shells with titles, descriptions, and canonical URLs.');
    return false;
  }
  const preview: ChildProcess = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    stdio: 'ignore',
  });
  try {
    await waitForServer();
    const require = createRequire(resolve(process.cwd(), 'package.json'));
    const puppeteer = require('puppeteer-core') as typeof import('puppeteer-core');
    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    for (const entry of pages) {
      await page.goto(`http://127.0.0.1:${PORT}${entry.path}`, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.waitForSelector('#main', { timeout: 20000 }).catch(() => undefined);
      const html = await page.content();
      const file = outputFile(entry.path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, html);
    }
    await browser.close();
    console.log(`Prerendered ${pages.length} routes with Chrome.`);
    return true;
  } finally {
    preview.kill();
  }
}

async function waitForServer() {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/`);
      if (response.ok) return;
    } catch {
      /* server still starting */
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('vite preview did not start');
}

async function main() {
  const template = readFileSync(resolve(DIST, 'index.html'), 'utf8');
  const pages = listPublicPages();
  for (const entry of pages) {
    const file = outputFile(entry.path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, shellFor(template, entry.title, entry.description, entry.path));
  }
  writeFileSync(resolve(DIST, 'sitemap.xml'), sitemapXml(pages, SITE_ORIGIN));
  const robots = readFileSync(resolve(process.cwd(), 'public/robots.txt'), 'utf8');
  writeFileSync(resolve(DIST, 'robots.txt'), robots.includes('Sitemap:') ? robots : `${robots.trim()}\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
  console.log(`Wrote ${pages.length} route shells and sitemap.xml. OG image: ${OG_IMAGE_PATH}`);
  try {
    await renderWithChrome(pages);
  } catch (error) {
    console.warn('Full Chrome prerender skipped:', error instanceof Error ? error.message : error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
