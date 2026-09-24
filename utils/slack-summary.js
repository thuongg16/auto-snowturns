// Builds Slack attachments (one card per test)
// from Playwright's JSON reporter output and writes them to slack-attachments.json.
// Never throws: Slack should still get a message if results.json is missing.
const fs = require('fs');

const BUILD_URL = process.env.BUILD_URL || '';
const MAX_FAILED_CARDS = 25;
const MAX_ATTACHMENTS = 100;

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
const testLink = (t) => (BUILD_URL ? `${BUILD_URL}Playwright_Report/#?testId=${t.id}` : undefined);

function card(t, color, label) {
  return {
    color,
    title: `${label} ${t.title}`,
    title_link: testLink(t),
    text: t.error ? '```' + esc(clip(t.error, 700)) + '```' : undefined,
    mrkdwn_in: ['text'],
    fields: [
      { title: 'Duration', value: secs(t.duration), short: true },
      { title: 'Started', value: clock(t.startTime), short: true },
      { title: 'Attempts', value: String(t.attempts), short: true },
      { title: 'Location', value: esc(t.location), short: true },
      { title: 'Project', value: t.project || '-', short: true },
    ],
  };
}

function build() {
  const report = JSON.parse(fs.readFileSync('results.json', 'utf8'));
  const { stats } = report;
  const tests = [];
  for (const s of report.suites || []) collect(s, tests);

  const links = [
    `<${BUILD_URL}testReport/|Test results>`,
    `<${BUILD_URL}Playwright_Report/|Playwright report>`,
    `<${BUILD_URL}console|Console>`,
  ].join('  •  ');

  const attachments = [
    {
      color: stats.unexpected ? 'danger' : 'good',
      text:
        `*Passed:* ${stats.expected}   *Failed:* ${stats.unexpected}   *Flaky:* ${stats.flaky}   *Skipped:* ${stats.skipped}\n` +
        `*Duration:* ${Math.round(stats.duration / 1000)}s\n` +
        (BUILD_URL ? links : ''),
      mrkdwn_in: ['text'],
    },
  ];

  const failed = tests.filter((t) => t.status === 'unexpected');
  failed.slice(0, MAX_FAILED_CARDS).forEach((t) => attachments.push(card(t, 'danger', '❌')));
  if (failed.length > MAX_FAILED_CARDS) {
    attachments.push({ color: 'danger', text: `…and ${failed.length - MAX_FAILED_CARDS} more failed tests. See the test results link above.` });
  }

  tests.filter((t) => t.status === 'flaky').forEach((t) => attachments.push(card(t, 'warning', '⚠️')));

  // Slack allows at most 100 attachments per message. Every test gets its own card while
  // they fit; beyond that, the passed tests that don't fit are grouped into compact lists.
  const passed = tests.filter((t) => t.status === 'expected');
  const room = MAX_ATTACHMENTS - attachments.length;
  if (passed.length <= room) {
    passed.forEach((t) => attachments.push(card(t, 'good', '✅')));
  } else {
    passed.slice(0, room - 1).forEach((t) => attachments.push(card(t, 'good', '✅')));
    const rest = passed.slice(room - 1).map((t) => `✅ ${esc(t.title)} — ${secs(t.duration)}`);
    attachments.push({ color: 'good', mrkdwn_in: ['text'], text: clip(rest.join('\n'), 7000) });
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
