#!/usr/bin/env node
// HerFuel regression runner.
//   node run.js            → run all specs
//   node run.js 03 07      → run only specs whose filename starts with those prefixes
//   HERFUEL_BASE_URL=...   → point at a different deployment
//   HEADED=1               → watch the browser
//
// Each spec gets a fresh browser context (clean localStorage → deterministic state).
// A failed step aborts the rest of its spec (steps are sequential flows) but the
// suite continues. Soft steps ("[soft]") report WARN instead of FAIL.
const fs = require('fs');
const path = require('path');
const H = require('./lib/harness');

const SPECS_DIR = path.join(__dirname, 'specs');
const REPORT_DIR = path.join(__dirname, 'report');

async function main() {
  const filters = process.argv.slice(2);
  let files = fs.readdirSync(SPECS_DIR).filter(f => f.endsWith('.spec.js')).sort();
  if (filters.length) files = files.filter(f => filters.some(x => f.startsWith(x)));
  if (!files.length) { console.error('No specs matched.'); process.exit(2); }

  console.log(`HerFuel regression · ${H.BASE}\nSpecs: ${files.join(', ')}\n`);
  const browser = await H.launch();
  const results = [];
  const startedAt = new Date().toISOString();

  for (const file of files) {
    const spec = require(path.join(SPECS_DIR, file));
    const collect = { consoleErrors: [], pageErrors: [], httpFailures: [], edgeCalls: [] };
    const { ctx, page } = await H.newPage(browser, collect);
    const specResult = { spec: spec.name || file, file, steps: [], collect };
    console.log(`\n━━ ${spec.name || file}`);
    let aborted = false;

    const t = {
      page, H, collect,
      data: {},
      async step(name, fn) {
        const soft = name.startsWith('[soft]');
        if (aborted) { specResult.steps.push({ name, status: 'skipped' }); console.log(`   ⏭  ${name} (skipped)`); return; }
        const t0 = Date.now();
        try {
          await fn();
          specResult.steps.push({ name, status: 'pass', ms: Date.now() - t0 });
          console.log(`   ✅ ${name} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
        } catch (e) {
          const screenshot = await H.shot(page, `${file.replace('.spec.js', '')}-${name.slice(0, 40)}`);
          const status = soft ? 'warn' : 'fail';
          specResult.steps.push({ name, status, error: String(e.message).slice(0, 400), ms: Date.now() - t0, screenshot });
          console.log(`   ${soft ? '⚠️ ' : '❌'} ${name} — ${String(e.message).slice(0, 160)}`);
          if (!soft) aborted = true;
        }
      },
      expect(cond, msg) { if (!cond) throw new Error('expect failed: ' + msg); },
    };

    try {
      await spec.run(t);
    } catch (e) {
      specResult.steps.push({ name: '(spec body)', status: 'fail', error: String(e.message).slice(0, 400) });
      console.log(`   ❌ spec error — ${String(e.message).slice(0, 160)}`);
    }
    specResult.collect = {
      consoleErrors: [...new Set(collect.consoleErrors)].slice(0, 10),
      pageErrors: [...new Set(collect.pageErrors)].slice(0, 10),
      httpFailures: [...new Set(collect.httpFailures)].slice(0, 10),
      edgeCalls: collect.edgeCalls.slice(0, 20),
    };
    if (specResult.collect.pageErrors.length) console.log('   ⚠️  page errors:', specResult.collect.pageErrors.join(' | '));
    results.push(specResult);
    await ctx.close();
  }
  await browser.close();

  // ----- report -----
  const flat = results.flatMap(r => r.steps);
  const counts = {
    pass: flat.filter(s => s.status === 'pass').length,
    fail: flat.filter(s => s.status === 'fail').length,
    warn: flat.filter(s => s.status === 'warn').length,
    skipped: flat.filter(s => s.status === 'skipped').length,
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, 'last-run.json'), JSON.stringify({ startedAt, base: H.BASE, counts, results }, null, 2));
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`PASS ${counts.pass} · FAIL ${counts.fail} · WARN ${counts.warn} · SKIP ${counts.skipped}`);
  console.log(`Report: e2e/report/last-run.json · shots: e2e/report/shots/`);
  process.exit(counts.fail ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(2); });
