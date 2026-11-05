import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const srcHtmlPath = path.join(rootDir, 'index.src.html');
const indexHtmlPath = path.join(rootDir, 'index.html');
const navidadHtmlPath = path.join(rootDir, 'navidad.html');
const shopHtmlPath = path.join(rootDir, 'shop.html');
const shopDir = path.join(rootDir, 'shop');
const distDir = path.join(rootDir, 'dist');
const distAssetsDir = path.join(distDir, 'assets');
const rootAssetsDir = path.join(rootDir, 'assets');
const rootDataDir = path.join(rootDir, 'data');

// 1. Ensure index.src.html holds the uncompiled Vite entry template
if (!fs.existsSync(srcHtmlPath)) {
  const currentIndex = fs.readFileSync(indexHtmlPath, 'utf8');
  if (currentIndex.includes('/src/main.tsx')) {
    fs.writeFileSync(srcHtmlPath, currentIndex, 'utf8');
  } else {
    throw new Error('index.src.html missing and index.html is already compiled');
  }
}

// Restore uncompiled template before running vite build
fs.copyFileSync(srcHtmlPath, indexHtmlPath);

// 2. Run Vite production build
console.log('Running vite build...');
execSync('npx vite build', { stdio: 'inherit' });

// 3. Copy compiled dist/index.html -> root index.html, navidad.html, shop.html, and shop/index.html
const compiledHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
fs.writeFileSync(indexHtmlPath, compiledHtml, 'utf8');

const navidadHtml = compiledHtml.replace(
  '<head>',
  '<head>\n  <script>window.__INITIAL_PAGE__="navidad";</script>'
);
fs.writeFileSync(navidadHtmlPath, navidadHtml, 'utf8');

const shopHtml = compiledHtml
  .replace('<head>', '<head>\n  <script>window.__INITIAL_PAGE__="tienda";</script>')
  .replace(
    '<title>Main Paper · Vuelta al Cole 2026 · Canje de Billete Dorado</title>',
    '<title>Main Paper · Tienda & Showroom (6.109 Refs)</title>'
  );
fs.writeFileSync(shopHtmlPath, shopHtml, 'utf8');

// Create shop/index.html for Plesk subdomains or /shop/ virtual directory
if (!fs.existsSync(shopDir)) {
  fs.mkdirSync(shopDir, { recursive: true });
}
fs.writeFileSync(path.join(shopDir, 'index.html'), shopHtml, 'utf8');

// 4. Sync dist/assets -> root ./assets
if (fs.existsSync(rootAssetsDir)) {
  fs.rmSync(rootAssetsDir, { recursive: true, force: true });
}
fs.cpSync(distAssetsDir, rootAssetsDir, { recursive: true });

// 5. Ensure catalog.json is available at root ./data/catalog.json
if (!fs.existsSync(rootDataDir)) {
  fs.mkdirSync(rootDataDir, { recursive: true });
}
fs.copyFileSync(
  path.join(rootDir, 'public/data/catalog.json'),
  path.join(rootDataDir, 'catalog.json')
);

console.log('Netcup static root bundle ready: index.html, navidad.html, shop.html, shop/index.html, data/catalog.json, and ./assets/*');
