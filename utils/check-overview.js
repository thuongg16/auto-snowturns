// Fails when claude/docs/project-overview.md no longer matches the repo, so the AI's
// project summary cannot silently drift. Run: `npm run check:overview` (also in CI).
// Checks: the feature inventory counts, the tag counts, and that every Page Object is listed.
const fs = require('fs');
const path = require('path');

const OVERVIEW = 'claude/docs/project-overview.md';
const overview = fs.readFileSync(OVERVIEW, 'utf8');
const errors = [];

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '');
const count = (text, re) => (text.match(re) || []).length;

function specFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return specFiles(p);
    return e.name.endsWith('.spec.ts') ? [p] : [];
  });
}
const allSpecs = specFiles('tests').map(read).join('\n');

// ---- feature inventory: | `cart.md` | CART | 5 | 5 | 5 | ... |
const rows = [...overview.matchAll(/^\| `([a-z0-9-]+)\.md` \| ([A-Z]+) \| (\d+) \| (\d+) \| (\d+) \|/gm)];
const listed = new Set(rows.map((r) => r[1]));

for (const [, feature, area, scen, cases, auto] of rows) {
  const actual = {
    scenarios: count(read(`docs/test-scenarios/${feature}.md`), new RegExp(`^### ${area}-S\\d+`, 'gm')),
    'test cases': count(read(`docs/test-cases/${feature}.md`), new RegExp(`^### TC_${area}_`, 'gm')),
    'automated tests': count(
      specFiles(`tests/${feature.replace(/\.md$/, '')}`).map(read).join('\n'),
      new RegExp(`\\btest\\(\\s*['"\`]TC_${area}_`, 'g')
    ),
  };
  const documented = { scenarios: +scen, 'test cases': +cases, 'automated tests': +auto };
  for (const key of Object.keys(actual)) {
    if (actual[key] !== documented[key]) {
      errors.push(`${feature}: ${key} is ${actual[key]} in the repo, ${documented[key]} in the overview`);
    }
  }
}

for (const file of fs.readdirSync('docs/test-scenarios')) {
  const feature = file.replace(/\.md$/, '');
  if (file.endsWith('.md') && !listed.has(feature)) {
    errors.push(`${feature}: docs/test-scenarios/${file} exists but has no row in the feature inventory`);
  }
}

// ---- tags: "`@smoke` (8 tests" and "`@critical` (the 22 cases"
for (const tag of ['smoke', 'critical']) {
  const m = overview.match(new RegExp('`@' + tag + '` \\((?:the )?(\\d+)'));
  const actual = count(allSpecs, new RegExp(`tag: \\[[^\\]]*'@${tag}'`, 'g'));
  if (!m) errors.push(`@${tag}: count not found in the overview`);
  else if (+m[1] !== actual) errors.push(`@${tag}: ${actual} tests tagged in the repo, ${m[1]} in the overview`);
}

// ---- every Page Object / component is listed in the code map
for (const dir of ['src/pages', 'src/pages/components']) {
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
    if (!overview.includes(file)) errors.push(`${dir}/${file} is not listed in the overview's code map`);
  }
}

if (errors.length) {
  console.error(`${OVERVIEW} is out of date:\n- ${errors.join('\n- ')}`);
  console.error('Update the overview (and its "Last updated" line) in the same change.');
  process.exit(1);
}
console.log(`${OVERVIEW} matches the repo (${rows.length} features checked).`);
