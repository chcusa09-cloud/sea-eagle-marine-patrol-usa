import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import { createHash } from 'node:crypto';

const backend = 'https://sea-eagle-marine-patrol-usa.pearly-bloom-0804.chatgpt.site';
const base = '/sea-eagle-marine-patrol-usa';
const origin = 'https://chcusa09-cloud.github.io';
const response = await fetch(`${backend}/api/public`, { signal: AbortSignal.timeout(30000) });
if (!response.ok) throw new Error(`Public content unavailable: ${response.status}`);
const data = await response.json();
if (!Array.isArray(data.events) || !Array.isArray(data.outreach)) throw new Error('Invalid public content');
// Only the public endpoint is read. Member data and credentials never enter this build.
await mkdir('.pages-build', { recursive: true });
await mkdir('pages-dist', { recursive: true });
const routes = ['', 'events', 'outreach', 'tv', 'branding'];
const sources = [...routes.map(r => `app/${r ? r+'/' : ''}page.tsx`), 'app/site-shell.tsx', 'app/public-content.tsx', 'lib/shared.ts'];
for (const file of sources) {
  let source = await readFile(file, 'utf8');
  if (file === 'app/public-content.tsx') {
    const marker = '} | null>(null)';
    if (!source.includes(marker)) throw new Error('Public content snapshot hook changed');
    source = source.replace(marker, `} | null>(${JSON.stringify(data)})`);
  }
  source = source.replaceAll('"@/lib/shared"', '"../lib/shared"').replace(/from (["'])(\.[^"']+)\1/g, (_,q,p) => `from ${q}${p}.mjs${q}`);
  const output = ts.transpileModule(source, { fileName: file, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const target = `.pages-build/${file.replace(/\.tsx?$/, '.mjs')}`;
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, output);
}
const pages = [];
for (const route of routes) {
  const {default: Page} = await import(pathToFileURL(resolve(`.pages-build/app/${route ? route+'/' : ''}page.mjs`)).href);
  pages.push(renderToStaticMarkup(React.createElement(Page)));
}
const css = await postcss([tailwind()]).process(await readFile('app/globals.css', 'utf8'), { from: resolve('app/globals.css'), to: resolve('pages-dist/style.css') });
await writeFile('pages-dist/style.css', css.css.replace(/url\((["']?)\/(maritime-hero\.webp|sea-eagle-logo\.jpeg)\1\)/g, (_, quote, asset) => `url("${base}/${asset}")`));
const stylesheet = `style-${createHash('sha256').update(await readFile('pages-dist/style.css')).digest('hex').slice(0, 12)}.css`;
await copyFile('pages-dist/style.css', `pages-dist/${stylesheet}`);
for (const name of ['sea-eagle-logo.jpeg', 'maritime-hero.webp', 'viking-hero.webp', 'gulf-houston-food-bank.webp', 'gulf-houston-food-bank-volunteering.webp', 'atlanta-charity-outreach.webp', 'atlanta-leadership-summit.webp', 'foundation-donation.webp', 'new-york-outreach-1.webp', 'new-york-outreach-2.webp', 'new-york-outreach-3.webp', 'social-facebook.svg', 'social-tiktok.svg', 'social-instagram.svg']) await copyFile(`public/${name}`, `pages-dist/${name}`);
function url(path) {
  if (/^\/(portal|admin|setup)(\/|$|[?#])/.test(path)) return backend + path;
  const [pathname, hash] = path.split('#');
  const route = pathname.slice(1);
  return base + (routes.includes(route) && route ? pathname + '/' : pathname) + (hash === undefined ? '' : '#' + hash);
}
for (let i = 0; i < routes.length; i++) {
  const route = routes[i];
  const body = pages[i].replace(/(href|src)="(\/(?!\/)[^"]*)"/g, (_, attr, path) => `${attr}="${url(path)}"`);
  const title = route ? `${({events:'Upcoming events',outreach:'Charitable outreach',tv:'SEMP TV',branding:'Branding center'})[route]} | SEMP USA` : 'SEMP USA | One Ship, One Course, One Marine';
  const directory = `pages-dist/${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="Sea Eagle Marine Patrol USA. United in brotherhood, humanitarian service, and community development."><link rel="canonical" href="${origin}${base}/${route ? route+'/' : ''}"><link rel="icon" href="${base}/sea-eagle-logo.jpeg"><link rel="stylesheet" href="${base}/${stylesheet}"></head><body>${body}</body></html>`);
}
await writeFile('pages-dist/.nojekyll', '');
console.log(`Built ${routes.length} public pages. Events: ${data.events.length}; outreach: ${data.outreach.length}.`);
