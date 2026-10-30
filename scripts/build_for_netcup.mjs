import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const srcHtmlPath = path.join(rootDir, 'index.src.html');
const indexHtmlPath = path.join(rootDir, 'index.html');
const navidadHtmlPath = path.join(rootDir, 'navidad.html');
const distDir = path.join(rootDir, 'dist');
const distAssetsDir = path.join(distDir, 'assets');
const rootAssetsDir = path.join(rootDir, 'assets');

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

// 3. Copy compiled dist/index.html -> root index.html & navidad.html
const compiledHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
fs.writeFileSync(indexHtmlPath, compiledHtml, 'utf8');

const navidadHtml = compiledHtml.replace(
  '<head>',
  '<head>\n  <script>window.__INITIAL_PAGE__="navidad";</script>'
);
fs.writeFileSync(navidadHtmlPath, navidadHtml, 'utf8');

// 4. Sync dist/assets -> root ./assets
if (fs.existsSync(rootAssetsDir)) {
  fs.rmSync(rootAssetsDir, { recursive: true, force: true });
}
fs.cpSync(distAssetsDir, rootAssetsDir, { recursive: true });

console.log('Netcup static root bundle ready: index.html, navidad.html, and ./assets/*');
