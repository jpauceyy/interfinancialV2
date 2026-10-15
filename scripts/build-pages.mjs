// Static page builder: src/pages/*.html + src/partials -> ./*.html
// Page files start with `key: value` lines, then `---`, then the page body.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');
const layout = read('src/partials/layout.html');
const partial = (name) => read(`src/partials/${name}.html`);
const year = new Date().getFullYear();

// mark the active nav item
const markActive = (html, active) =>
  html.replace(/<a ([^>]*?)data-nav="([^"]+)"([^>]*)>/g, (m, a, key, b) =>
    key === active ? `<a ${a}data-nav="${key}" aria-current="page"${b}>` : m);

for (const file of readdirSync(join(root, 'src/pages')).filter((f) => f.endsWith('.html'))) {
  const raw = read(`src/pages/${file}`);
  const [head, ...rest] = raw.split(/^---\s*$/m);
  const meta = Object.fromEntries(
    head.trim().split('\n').map((l) => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
  );
  const body = rest.join('---');

  let html = layout
    .replace('{{> header}}', partial('header'))
    .replace('{{> footer}}', partial('footer'))
    .replace('{{content}}', body)
    .replaceAll('{{title}}', meta.title || 'Interfinancial')
    .replaceAll('{{description}}', meta.description || '')
    .replaceAll('{{year}}', String(year));

  html = markActive(html, meta.active);

  writeFileSync(join(root, file), html);
  console.log('built', file);
}

// index.html is hand-built; keep its header in sync with the shared partial
const home = read('index.html');
writeFileSync(join(root, 'index.html'), home.replace(/<header>[\s\S]*?<\/header>/, () => markActive(partial('header').trim(), 'home')));
console.log('synced header into index.html');
