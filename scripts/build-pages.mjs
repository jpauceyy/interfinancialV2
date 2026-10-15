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
  // `key: value` lines; a line without a key continues the previous value
  // (editors' format-on-save can wrap a long description onto two lines)
  const meta = {};
  let last = null;
  for (const l of head.trim().split(/\r?\n/)) {
    const m = l.match(/^([a-z][\w-]*):\s*(.*)$/i);
    if (m) { last = m[1]; meta[last] = m[2].trim(); }
    else if (last && l.trim()) meta[last] += ' ' + l.trim();
  }
  const body = rest.join('---');

  let html = layout
    .replace('{{> splash}}', partial('splash'))
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

// index.html is hand-built; keep its splash and header in sync with the shared partials
const splash = partial('splash').trim();
let home = read('index.html').replace(/<header>[\s\S]*?<\/header>/, () => markActive(partial('header').trim(), 'home'));
home = /<!-- splash -->[\s\S]*?<!-- \/splash -->/.test(home)
  ? home.replace(/<!-- splash -->[\s\S]*?<!-- \/splash -->/, () => splash)
  : home.replace(/<body>\s*/, (m) => m + splash + '\n\n');
writeFileSync(join(root, 'index.html'), home);
console.log('synced splash + header into index.html');
