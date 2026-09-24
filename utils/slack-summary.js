// Builds the Slack message body from Playwright's JSON reporter output:
// totals, every failed test with its error, and the passed tests.
// Never throws: Slack should still get a message if results.json is missing.
const fs = require('fs');

const stripAnsi = (s) => s.replace(/\u001b\[[0-9;]*m/g, '');
// Slack mrkdwn only requires these three characters to be escaped.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

function collect(suite, out) {
  for (const spec of suite.specs || []) {
    for (const t of spec.tests || []) {
      const results = t.results || [];
      const last = results[results.length - 1] || {};
      out.push({
        title: spec.title,
        file: spec.file,
        status: t.status, // expected | unexpected | flaky | skipped
        error: stripAnsi((last.error && last.error.message) || '').split('\n').find((l) => l.trim()) || '',
      });
    }
  }
  for (const child of suite.suites || []) collect(child, out);
}

try {
  const report = JSON.parse(fs.readFileSync('results.json', 'utf8'));
  const { stats } = report;
  const tests = [];
  for (const s of report.suites || []) collect(s, tests);

  const lines = [
    `Passed: ${stats.expected} | Failed: ${stats.unexpected} | Flaky: ${stats.flaky} | Skipped: ${stats.skipped} | Duration: ${Math.round(stats.duration / 1000)}s`,
  ];

  const failed = tests.filter((t) => t.status === 'unexpected');
  if (failed.length) {
    lines.push('', `*Failed (${failed.length})*`);
    for (const t of failed) {
      lines.push(`❌ ${esc(t.title)}`);
      if (t.error) lines.push(`      _${esc(clip(t.error, 200))}_`);
    }
  }

  const flaky = tests.filter((t) => t.status === 'flaky');
  if (flaky.length) {
    lines.push('', `*Flaky (${flaky.length})*`);
    for (const t of flaky) lines.push(`⚠️ ${esc(t.title)}`);
  }

  const passed = tests.filter((t) => t.status === 'expected');
  if (passed.length) {
    lines.push('', `*Passed (${passed.length})*`);
    for (const t of passed) lines.push(`✅ ${esc(t.title)}`);
  }

  console.log(lines.join('\n'));
} catch {
  console.log('Test summary unavailable (results.json not found)');
}
