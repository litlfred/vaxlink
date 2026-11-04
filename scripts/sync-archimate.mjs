// Copy the ArchiMate views of the SMART Trust demonstrator (litlfred/smart-trust-demo:
// its journeys and systems as an overlay on the DPI-H RA's ArchiMate model) into
// public/archimate/. Each box's link is made absolute, to its element page on the
// demonstrator's site, and opens in a new tab. The snapshot is committed, so the
// site builds offline; rerun to refresh it.
//
//   node scripts/sync-archimate.mjs [base-url-or-local-site-dir]
//
// The default base is the demonstrator's published site; a staging preview or a
// local build (`stage-local.ts --dry-run` writes one) works too.
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const SITE = 'https://litlfred.github.io/smart-trust-demo/';
const base = (process.argv[2] ?? SITE).replace(/\/?$/, '/');
const MODEL = 'archimate/0.1.0/views/';
// View ids are Archi's, stable across rebuilds (smart-trust-demo tools/archimate/overlay.py).
const views = {
  systems: 'id-249a1002c32e50199e27a502ef0ec3d8',
  journeys: 'id-c6cae81c85da5fc197ab58547274a481',
  j1: 'id-18d2033f445f5b8895f20719cb97bd91',
  j2: 'id-099b088dc52f57289c647bfb64e8c4d6',
  j3: 'id-c1154579a67d5815921b72f71587df50',
  'j4-0': 'id-ae1502fd9fb158c3bcb643bf39006d41',
  'j4-1': 'id-42b408eba96159c187c0612ce7c2c6cf',
};

const read = async (path) => {
  if (/^https?:/.test(base)) {
    const res = await fetch(base + path);
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status} from ${base}`);
    return res.text();
  }
  return readFile(base + path, 'utf8');
};

await mkdir(new URL('../public/archimate/', import.meta.url), { recursive: true });
for (const [name, id] of Object.entries(views)) {
  const svg = (await read(`${MODEL}${id}.svg`))
    .replaceAll('href="../../../', `href="${SITE}`)
    .replaceAll('target="_top"', 'target="_blank"');
  if (/href="\.\.?\//.test(svg)) throw new Error(`${name}: a relative link is left`);
  await writeFile(new URL(`../public/archimate/${name}.svg`, import.meta.url), svg);
  console.log(`synced ${name} (${id})`);
}
