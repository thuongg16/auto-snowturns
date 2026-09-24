// Run after the Playwright tests (from the Jenkinsfile): `node utils/report.js`
//   1. saves this run to a SQLite file that Grafana reads for trend dashboards
//   2. writes slack-attachments.json, the message the Jenkinsfile posts to Slack
// Both steps are best-effort: a failure here must never fail the build.
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BUILD_URL = process.env.BUILD_URL || '';
const JOB = process.env.JOB_NAME || 'local';
const BUILD = Number(process.env.BUILD_NUMBER || 0);
const DB = process.env.HISTORY_DB || path.join(os.homedir(), '.test-history', 'history.db');
const MAX_FAILED_CELLS = 30;

// ---------- read results.json ----------

const stripAnsi = (s) => s.replace(/\u001b\[[0-9;]*m/g, '');

function collect(suite, out) {
  for (const spec of suite.specs || []) {
    for (const t of spec.tests || []) {
      const results = t.results || [];
      const last = results[results.length - 1] || {};
      // A flaky test passes on its last attempt, so take the error from the last attempt that failed.
      const failedRun = [...results].reverse().find((r) => r.error) || last;
      const message = stripAnsi((failedRun.error && failedRun.error.message) || '');
      out.push({
        id: spec.id,
        title: spec.title,
        file: spec.file,
        line: spec.line,
        location: `${spec.file}:${spec.line}`,
        project: t.projectName,
        status: t.status, // expected | unexpected | flaky | skipped
        attempts: results.length,
        startTime: results[0] && results[0].startTime,
        duration: results.reduce((sum, r) => sum + (r.duration || 0), 0),
        // First lines of the error: enough to see expected vs received without the full stack.
        error: message.split('\n').filter((l) => l.trim()).slice(0, 6).join('\n'),
      });
    }
  }
  for (const child of suite.suites || []) collect(child, out);
}

function readResults() {
  const report = JSON.parse(fs.readFileSync('results.json', 'utf8'));
  const tests = [];
  for (const s of report.suites || []) collect(s, tests);
  return { stats: report.stats, tests };
}

// Opens the test directly in the Playwright HTML report (screenshots, trace, full error).
const testLink = (t) => (BUILD_URL ? `${BUILD_URL}PlaywrightReport/index.html#?testId=${t.id}` : undefined);

// ---------- 1. history for Grafana ----------

// SQL string literal; NULL for missing values.
const q = (v) => (v === undefined || v === null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

function saveHistory({ stats, tests }) {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  const sql = [
    'PRAGMA busy_timeout = 10000;',
    `CREATE TABLE IF NOT EXISTS runs (
       job TEXT, build INTEGER, started TEXT,
       passed INTEGER, failed INTEGER, flaky INTEGER, skipped INTEGER,
       duration_ms INTEGER, build_url TEXT,
       PRIMARY KEY (job, build));`,
    `CREATE TABLE IF NOT EXISTS tests (
       job TEXT, build INTEGER, test_id TEXT, title TEXT, file TEXT, line INTEGER,
       project TEXT, status TEXT, duration_ms INTEGER, started TEXT, attempts INTEGER,
       error TEXT, url TEXT,
       PRIMARY KEY (job, build, test_id, project));`,
    'BEGIN;',
    // Re-running the same build number replaces its rows instead of duplicating them.
    `DELETE FROM runs WHERE job = ${q(JOB)} AND build = ${BUILD};`,
    `DELETE FROM tests WHERE job = ${q(JOB)} AND build = ${BUILD};`,
    `INSERT INTO runs VALUES (${q(JOB)}, ${BUILD}, ${q(stats.startTime)}, ${num(stats.expected)}, ${num(stats.unexpected)},
       ${num(stats.flaky)}, ${num(stats.skipped)}, ${num(stats.duration)}, ${q(BUILD_URL)});`,
    ...tests.map(
      (t) =>
        `INSERT OR REPLACE INTO tests VALUES (${q(JOB)}, ${BUILD}, ${q(t.id)}, ${q(t.title)}, ${q(t.file)}, ${num(t.line)},
         ${q(t.project)}, ${q(t.status)}, ${num(t.duration)}, ${q(t.startTime)}, ${num(t.attempts)}, ${q(t.error)},
         ${q(testLink(t) || '')});`
    ),
    'COMMIT;',
  ].join('\n');
  // Uses the `sqlite3` CLI that ships with macOS, so no npm dependency is needed.
  execFileSync('sqlite3', [DB], { input: sql });
  console.log(`Saved ${tests.length} tests for ${JOB} #${BUILD} to ${DB}`);
}

// ---------- 2. Slack message ----------

// Slack only requires these three characters to be escaped.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const clock = (iso) =>
  iso ? new Date(iso).toLocaleString('en-GB', { hour12: false, dateStyle: 'short', timeStyle: 'medium' }) : '-';
const secs = (ms) => (ms / 1000).toFixed(1) + 's';

// One test = one half-width cell. Slack lays out a section's `fields` in two columns,
// so consecutive tests sit side by side, two per row.
function cell(t, icon) {
  const link = testLink(t);
  const linked = (text) => (link ? `<${link}|${text}>` : text);
  // Titles look like "TC_API_005 — description": code on the first line, description on the second.
  const [code, ...rest] = t.title.split(' — ');
  const heading = rest.length
    ? `${icon} ${linked(`*${esc(code)}*`)}\n${linked(esc(rest.join(' — ')))}`
    : `${icon} ${linked(`*${esc(t.title)}*`)}`;
  const lines = [
    heading,
    `⏱ ${secs(t.duration)}  •  🕒 ${clock(t.startTime)}${t.attempts > 1 ? `  •  ${t.attempts} attempts` : ''}`,
    `📄 ${esc(t.location)}`,
  ];
  if (t.error) lines.push('```' + esc(clip(t.error, 250)) + '```');
  return { type: 'mrkdwn', text: lines.join('\n') };
}

// A coloured group (one colour bar) holding a heading and the tests as two-column sections.
function group(color, heading, tests, icon) {
  if (!tests.length) return [];
  const blocks = [{ type: 'section', text: { type: 'mrkdwn', text: `*${heading} (${tests.length})*` } }];
  // A section takes at most 10 fields (5 rows of 2).
  for (let i = 0; i < tests.length; i += 10) {
    blocks.push({ type: 'section', fields: tests.slice(i, i + 10).map((t) => cell(t, icon)) });
  }
  return [{ color, blocks }];
}

function buildSlackMessage({ stats, tests }) {
  const links = [
    `<${BUILD_URL}testReport/|Test results>`,
    `<${BUILD_URL}PlaywrightReport/|Playwright report>`,
    `<${BUILD_URL}console|Console>`,
  ].join('  •  ');

  const summary = {
    color: stats.unexpected ? 'danger' : 'good',
    text:
      `*Passed:* ${stats.expected}   *Failed:* ${stats.unexpected}   *Flaky:* ${stats.flaky}   *Skipped:* ${stats.skipped}\n` +
      `*Duration:* ${Math.round(stats.duration / 1000)}s\n` +
      (BUILD_URL ? links : ''),
    mrkdwn_in: ['text'],
  };

  const failed = tests.filter((t) => t.status === 'unexpected');
  const attachments = [
    summary,
    ...group('danger', 'Failed', failed.slice(0, MAX_FAILED_CELLS), '❌'),
    ...group('warning', 'Flaky', tests.filter((t) => t.status === 'flaky'), '⚠️'),
    ...group('good', 'Passed', tests.filter((t) => t.status === 'expected'), '✅'),
  ];
  if (failed.length > MAX_FAILED_CELLS) {
    attachments.push({ color: 'danger', text: `…and ${failed.length - MAX_FAILED_CELLS} more failed tests. See the test results link above.` });
  }
  return attachments;
}

// ---------- main ----------

let results;
try {
  results = readResults();
} catch {
  results = null;
}

try {
  if (!results) throw new Error('results.json not found');
  saveHistory(results);
} catch (e) {
  console.log(`History not saved: ${e.message}`);
}

let attachments;
try {
  attachments = buildSlackMessage(results);
} catch {
  attachments = [{ color: 'warning', text: 'Test summary unavailable (results.json not found)' }];
}
fs.writeFileSync('slack-attachments.json', JSON.stringify(attachments));
