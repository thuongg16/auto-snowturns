// Builds Slack attachments (one half-width cell per test, two per row)
// from Playwright's JSON reporter output and writes them to slack-attachments.json.
// Never throws: Slack should still get a message if results.json is missing.
const fs = require('fs');

const BUILD_URL = process.env.BUILD_URL || '';
const MAX_FAILED_CELLS = 30;

const stripAnsi = (s) => s.replace(/\u001b\[[0-9;]*m/g, '');
// Slack only requires these three characters to be escaped.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const clock = (iso) =>
  iso ? new Date(iso).toLocaleString('en-GB', { hour12: false, dateStyle: 'short', timeStyle: 'medium' }) : '-';
const secs = (ms) => (ms / 1000).toFixed(1) + 's';

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

// Opens the test directly in the Playwright HTML report (screenshots, trace, full error).
const testLink = (t) => (BUILD_URL ? `${BUILD_URL}PlaywrightReport/index.html#?testId=${t.id}` : undefined);

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

function build() {
  const report = JSON.parse(fs.readFileSync('results.json', 'utf8'));
  const { stats } = report;
  const tests = [];
  for (const s of report.suites || []) collect(s, tests);

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
  const shownFailed = failed.slice(0, MAX_FAILED_CELLS);

  const attachments = [
    summary,
    ...group('danger', 'Failed', shownFailed, '❌'),
    ...group('warning', 'Flaky', tests.filter((t) => t.status === 'flaky'), '⚠️'),
    ...group('good', 'Passed', tests.filter((t) => t.status === 'expected'), '✅'),
  ];
  if (failed.length > MAX_FAILED_CELLS) {
    attachments.push({ color: 'danger', text: `…and ${failed.length - MAX_FAILED_CELLS} more failed tests. See the test results link above.` });
  }
  return attachments;
}

let attachments;
try {
  attachments = build();
} catch {
  attachments = [{ color: 'warning', text: 'Test summary unavailable (results.json not found)' }];
}
fs.writeFileSync('slack-attachments.json', JSON.stringify(attachments));
