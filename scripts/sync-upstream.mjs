// Copy what this walkthrough shows from the SMART Trust demonstrator
// (litlfred/smart-trust-demo) at two pinned commits, and record them and each
// file's sha256 in upstream.lock.json:
//
//   source — a commit of its main branch: the BPMN drawings and the actors
//            (the personas) are files of the repository itself;
//   site   — a commit of its gh-pages branch: the FHIR examples and the
//            ArchiMate views exist only in the built site.
//
// The snapshot is committed, so the site builds offline.
//
//   node scripts/sync-upstream.mjs                 # pin the current main and gh-pages, refresh
//   node scripts/sync-upstream.mjs --source <sha> --site <sha>
//   node scripts/sync-upstream.mjs --check         # offline: the files match the lock
//   node scripts/sync-upstream.mjs --source <sha> --site <sha> --views-from <site-dir>
//                                  # the ArchiMate views from a local build of smart-trust-demo
//                                  # at --source (stage-local.ts --dry-run writes one), for when
//                                  # the published site lags main; the lock records it
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const REPO = 'litlfred/smart-trust-demo';
const SITE = 'https://litlfred.github.io/smart-trust-demo/';
const LOCK = new URL('../upstream.lock.json', import.meta.url);

const examples = [
  'Patient-TrustDemoSomsack',
  'Group-TrustDemoHousehold',
  'Immunization-TrustDemoJ3HepB',
  'ServiceRequest-TrustDemoJ2Referral',
  'Provenance-TrustDemoJ3Verification',
  'AuditEvent-TrustDemoJ41Access',
  'ConceptMap-TrustDemoProductToLaoEpi',
];
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
const processes = [
  'j1-birth-dose-dvc',
  'j2-chw-discovery-referral',
  'j3-clinic-verification-schedule',
  'j4-0-family-vhl-issuance',
  'j4-1-vhl-point-of-care',
];
// The actors that are this walkthrough's personas (src/data/personas.ts maps them to its ids).
const actors = ['somsack-sengmany', 'khamla-sengmany', 'bounmy-sengmany', 'vilay', 'chanthasone', 'anan'];

// The IG Publisher's generated narrative is left out: it is derived from the resource, and the payload drawer shows the data.
const prettyJson = (text) => {
  const json = JSON.parse(text);
  if (json.text?.status === 'generated') delete json.text;
  return JSON.stringify(json, null, 2) + '\n';
};
// Each box's link is made absolute, to its element page on the demonstrator's site, and opens in a new tab.
const absoluteLinks = (name) => (svg) => {
  const out = svg.replaceAll('href="../../../', `href="${SITE}`).replaceAll('target="_top"', 'target="_blank"');
  if (/href="\.\.?\//.test(out)) throw new Error(`${name}: a relative link is left`);
  return out;
};

/** Every snapshot file: where it is written, which pinned commit and path it comes from, and how it is transformed. */
const FILES = [
  ...examples.map((n) => ({ path: `src/data/ig/${n}.json`, from: 'site', src: `${n}.json`, transform: prettyJson })),
  ...Object.entries(views).map(([n, id]) => ({
    path: `public/archimate/${n}.svg`,
    from: 'site',
    src: `archimate/0.1.0/views/${id}.svg`,
    transform: absoluteLinks(n),
  })),
  ...processes.map((n) => ({ path: `public/bpmn/${n}.svg`, from: 'source', src: `processes/content/${n}.svg` })),
  ...actors.map((n) => ({ path: `src/data/upstream/actors/${n}.json`, from: 'source', src: `scenarios/actors/${n}.json` })),
];

const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const local = (path) => new URL(`../${path}`, import.meta.url);
const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const head = (branch) =>
  execFileSync('git', ['ls-remote', `https://github.com/${REPO}`, `refs/heads/${branch}`], { encoding: 'utf8' }).split(/\s/)[0];

if (process.argv.includes('--check')) {
  const lock = JSON.parse(await readFile(LOCK, 'utf8'));
  const bad = [];
  for (const { path } of FILES) {
    const want = lock.files[path]?.sha256;
    const got = await readFile(local(path), 'utf8').then(sha256, () => 'missing');
    if (got !== want) bad.push(`${path}: ${got === 'missing' ? 'missing' : 'differs from the lock'}${want ? '' : ' (not in the lock)'}`);
  }
  for (const path of Object.keys(lock.files)) if (!FILES.some((f) => f.path === path)) bad.push(`${path}: in the lock, not synced`);
  if (bad.length) {
    console.error(`upstream snapshot does not match upstream.lock.json:\n  ${bad.join('\n  ')}\nRerun node scripts/sync-upstream.mjs.`);
    process.exit(1);
  }
  console.log(`${FILES.length} snapshot files match ${REPO} source ${lock.source.slice(0, 7)}, site ${lock.site.slice(0, 7)}`);
  process.exit(0);
}

const pins = { source: arg('--source') ?? head('main'), site: arg('--site') ?? head('gh-pages') };
const viewsFrom = arg('--views-from')?.replace(/\/?$/, '/');
const files = {};
for (const f of FILES) {
  const fromBuild = viewsFrom && f.src.startsWith('archimate/');
  let raw;
  if (fromBuild) raw = await readFile(viewsFrom + f.src, 'utf8');
  else {
    const url = `https://raw.githubusercontent.com/${REPO}/${pins[f.from]}/${f.src}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${f.src}: HTTP ${res.status} at ${f.from} ${pins[f.from]}`);
    raw = await res.text();
  }
  const text = (f.transform ?? ((t) => t))(raw);
  await mkdir(dirname(local(f.path).pathname), { recursive: true });
  await writeFile(local(f.path), text);
  files[f.path] = { from: fromBuild ? `build:${f.src}` : `${f.from}:${f.src}`, sha256: sha256(text) };
  console.log(`synced ${f.path}`);
}
const lock = {
  $comment: 'Written by scripts/sync-upstream.mjs; checked by its --check. Do not edit by hand.',
  repository: REPO,
  source: pins.source,
  site: pins.site,
  ...(viewsFrom ? { build: { from: pins.source, by: 'stage-local.ts --dry-run', note: 'ArchiMate views built locally from source; the published site lagged main' } } : {}),
  files,
};
await writeFile(LOCK, JSON.stringify(lock, null, 2) + '\n');
console.log(`pinned ${REPO} source ${pins.source.slice(0, 7)}, site ${pins.site.slice(0, 7)}`);
