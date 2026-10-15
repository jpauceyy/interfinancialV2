// Collects the built site into ./public for static hosting (Vercel's output directory).
// Paths inside public/ mirror the project root, so the pages' relative URLs keep working.
import { cpSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'public');
const copy = (p) => cpSync(join(root, p), join(out, p), { recursive: true });

rmSync(out, { recursive: true, force: true });
mkdirSync(out);
readdirSync(root).filter((f) => f.endsWith('.html')).forEach(copy);
['dist', 'assets', 'src/js'].forEach(copy);
console.log('exported site to public/');
