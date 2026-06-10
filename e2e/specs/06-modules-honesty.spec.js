// The honest module engine — the product's core claim.
// Pregnancy T2 must raise the target by +340 kcal; the Cycle module must NOT change
// the calorie target at all; fasting must warn during pregnancy.
module.exports = {
  name: '06 · Life-stage modules: honest targets',
  async run(t) {
    const { page: p, H } = t;

    await t.step('baseline calorie target on Today', async () => {
      await H.goHome(p);
      const txt = await H.bodyText(p);
      const m = txt.match(/0 of ([\d,]+) kcal/i);
      t.expect(m, 'target visible ("0 of N kcal")');
      t.data.baseline = parseInt(m[1].replace(/,/g, ''), 10);
      t.expect(t.data.baseline > 1000, 'plausible baseline: ' + t.data.baseline);
    });

    await t.step('enable Pregnancy module (T2)', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Life-stage modules', { contains: true });
      await p.waitForTimeout(1100);
      const txt = await H.bodyText(p);
      t.expect(/Pregnancy/i.test(txt), 'Pregnancy module listed');
      await H.clickText(p, 'Pregnancy', { contains: true, nth: 0 });
      await p.waitForTimeout(900);
      // toggle on if there's an explicit switch
      await p.evaluate(() => {
        const sw = [...document.querySelectorAll('[role=switch],input[type=checkbox]')].find(s => s.getBoundingClientRect().width > 0 && (s.getAttribute('aria-checked') === 'false' || (s.type === 'checkbox' && !s.checked)));
        if (sw) sw.click();
      });
      await p.waitForTimeout(900);
      // set gestational week into T2 (e.g. week 20) — scrubber/slider or input
      await p.evaluate(() => {
        const range = document.querySelector('input[type=range]');
        if (range) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(range, '20');
          range.dispatchEvent(new Event('input', { bubbles: true }));
          range.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          const t2 = [...document.querySelectorAll('button')].find(b => /T2|second trimester|2nd/i.test(b.innerText || ''));
          if (t2) t2.click();
        }
      });
      await p.waitForTimeout(900);
      const after = await H.bodyText(p);
      t.expect(/\+\s?340|second trimester|T2|week 20/i.test(after), 'T2 state visible (+340 or week 20)');
    });

    await t.step('Today target rises by exactly +340', async () => {
      await H.goHome(p);
      const txt = await H.bodyText(p);
      const m = txt.match(/of ([\d,]+) kcal/i);
      t.expect(m, 'target visible');
      const now = parseInt(m[1].replace(/,/g, ''), 10);
      t.expect(now === t.data.baseline + 340, `target ${t.data.baseline} → ${now} (expected +340)`);
    });

    await t.step('fasting timer warns during pregnancy', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Fasting timer', { contains: true });
      await p.waitForTimeout(1100);
      const txt = await H.bodyText(p);
      t.expect(/not (recommended )?(while|during) pregnan|pregnan/i.test(txt), 'perinatal caution shown');
    });

    await t.step('disable Pregnancy → baseline restored', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Life-stage modules', { contains: true });
      await p.waitForTimeout(900);
      await H.clickText(p, 'Pregnancy', { contains: true, nth: 0 });
      await p.waitForTimeout(700);
      await p.evaluate(() => {
        const sw = [...document.querySelectorAll('[role=switch],input[type=checkbox]')].find(s => s.getBoundingClientRect().width > 0 && (s.getAttribute('aria-checked') === 'true' || (s.type === 'checkbox' && s.checked)));
        if (sw) sw.click();
      });
      await p.waitForTimeout(900);
      await H.goHome(p);
      const m = (await H.bodyText(p)).match(/of ([\d,]+) kcal/i);
      t.expect(m && parseInt(m[1].replace(/,/g, ''), 10) === t.data.baseline, 'baseline restored: ' + (m && m[1]));
    });

    await t.step('Cycle module does NOT change the calorie target (honesty)', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Life-stage modules', { contains: true });
      await p.waitForTimeout(900);
      const listed = /Cycle/i.test(await H.bodyText(p));
      t.expect(listed, 'Cycle module listed');
      await H.clickText(p, 'Cycle', { contains: true, nth: 0 });
      await p.waitForTimeout(900);
      await p.evaluate(() => {
        const sw = [...document.querySelectorAll('[role=switch],input[type=checkbox]')].find(s => s.getBoundingClientRect().width > 0 && (s.getAttribute('aria-checked') === 'false' || (s.type === 'checkbox' && !s.checked)));
        if (sw) sw.click();
      });
      await p.waitForTimeout(900);
      await H.goHome(p);
      const m = (await H.bodyText(p)).match(/of ([\d,]+) kcal/i);
      const now = m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
      t.expect(now === t.data.baseline, `cycle module left target unchanged (${t.data.baseline} → ${now})`);
    });

    await t.step('pregnancy blocks deficit goals (perinatal guard)', async () => {
      // re-enable pregnancy, then check Goals & targets
      await H.openMe(p);
      await H.clickText(p, 'Life-stage modules', { contains: true });
      await p.waitForTimeout(900);
      await H.clickText(p, 'Pregnancy', { contains: true, nth: 0 });
      await p.waitForTimeout(700);
      await p.evaluate(() => {
        const sw = [...document.querySelectorAll('[role=switch],input[type=checkbox]')].find(s => s.getBoundingClientRect().width > 0 && (s.getAttribute('aria-checked') === 'false' || (s.type === 'checkbox' && !s.checked)));
        if (sw) sw.click();
      });
      await p.waitForTimeout(900);
      await H.openMe(p);
      await H.clickText(p, 'Goals & targets', { contains: true });
      await p.waitForTimeout(1100);
      const txt = await H.bodyText(p);
      t.expect(/Perinatal mode is on/i.test(txt), 'perinatal-mode banner shown');
      t.expect(/don'?t support a calorie deficit/i.test(txt), 'deficit-refusal copy present');
      t.expect(/Lose Not available right now/i.test(txt.replace(/\s+/g, ' ')), 'Lose mode disabled');
    });

    await t.step('birth-control branch: honest no-phases behavior', async () => {
      // disable pregnancy, enable cycle (tap the module card), answer "Yes" to hormonal contraception
      await H.openMe(p);
      await H.clickText(p, 'Life-stage modules', { contains: true });
      await p.waitForTimeout(900);
      await p.evaluate(() => {
        const sw = [...document.querySelectorAll('[role=switch],input[type=checkbox]')].find(s => s.getBoundingClientRect().width > 0 && (s.getAttribute('aria-checked') === 'true' || (s.type === 'checkbox' && s.checked)));
        if (sw) sw.click();
      });
      await p.waitForTimeout(800);
      const card = await p.evaluate(() => {
        const els = [...document.querySelectorAll('button,a,div,li,article')].filter(e => {
          const txt = (e.innerText || '').replace(/\s+/g, ' ').trim();
          return /^🌙 ?Cycle/.test(txt) && txt.length < 200 && e.getBoundingClientRect().width > 100;
        }).sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
        if (!els.length) return null;
        els[0].scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = els[0].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      t.expect(card, 'Cycle module card found');
      await p.mouse.click(card.x, card.y);
      await p.waitForTimeout(1000);
      await H.goHome(p);
      t.expect(/follicular|luteal|ovulat|menstrual/i.test(await H.bodyText(p)), 'phase chip visible with natural cycle');
      await H.tab(p, 'Progress');
      await H.clickFor(p, 'Cycle & body', /HORMONAL CONTRACEPTION/i);
      await H.clickText(p, 'Yes — pill / IUD / implant / ring / shot', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1300);
      const after = await H.bodyText(p);
      t.expect(/suppresses the natural cycle/i.test(after), 'honest explanation shown');
      t.expect(/●●●|Strong/.test(after), 'explanation is evidence-graded');
      t.expect(/Dr\.|Gunter/i.test(after), 'explanation is attributed');
      await H.goHome(p);
      const today = await H.bodyText(p);
      t.expect(!/follicular|luteal|ovulat/i.test(today), 'phase predictions hidden on hormonal contraception');
    });
  },
};
