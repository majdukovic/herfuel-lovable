// Progress: subtabs, measurement entry, evidence-graded insights with attribution,
// and the anti-shame guarantee in the header.
module.exports = {
  name: '07 · Progress: trends, measurements, insights',
  async run(t) {
    const { page: p, H } = t;

    await t.step('Progress opens with anti-shame framing and 5 subtabs', async () => {
      await H.goHome(p);
      await H.tab(p, 'Progress');
      const txt = await H.waitText(p, /PROGRESS/i, 8000);
      t.expect(/No weight or deficit streaks/i.test(txt), 'anti-shame guarantee in header');
      for (const sub of ['Trends', 'Measurements', 'Cycle & body', 'Insights', 'Milestones'])
        t.expect(txt.includes(sub), 'subtab present: ' + sub);
    });

    await t.step('Measurements: add a weight entry', async () => {
      const txt = await H.clickFor(p, 'Measurements', /FAVOURITES|Body weight/i);
      t.expect(/Body weight|Waist|Hip/i.test(txt), 'measurement types listed');
      // click the Body-weight row itself (shortest element starting with that label —
      // container rows like the FAVOURITES chip strip have other chips at their center)
      const pt = await p.evaluate(() => {
        const els = [...document.querySelectorAll('button,a,div,li,article')].filter(e => {
          const t = (e.innerText || '').replace(/\s+/g, ' ').trim();
          return t.startsWith('Body weight') && t.length < 30 && e.getBoundingClientRect().width > 0;
        }).sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
        if (!els.length) return null;
        els[0].scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = els[0].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      t.expect(pt, 'Body weight row found');
      await p.mouse.click(pt.x, pt.y);
      await p.waitForTimeout(1300);
      const detail = await H.bodyText(p);
      t.expect(/Body weight/i.test(detail) && /START|LATEST|GOAL|HISTORY/i.test(detail), 'Body-weight detail opened (got: ' + detail.slice(0, 140) + ')');
      // exact + deepest match — a contains-match can hit the container wrapping
      // "Add entry" and "Set goal", whose center is the gap between the buttons
      await H.clickText(p, 'Add entry', { nth: -1, mouse: true });
      await p.waitForTimeout(1100);
      const ok = await p.evaluate(() => {
        const i = [...document.querySelectorAll('input')].find(x => x.getBoundingClientRect().width > 0 && (x.type === 'number' || x.inputMode === 'decimal' || x.inputMode === 'numeric'));
        if (!i) return false;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(i, '64.5');
        i.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      });
      t.expect(ok, 'entry input found');
      await H.clickText(p, 'Save', { nth: -1, mouse: true }).catch(() => H.clickText(p, 'Add', { nth: -1, mouse: true }));
      await p.waitForTimeout(1200);
      t.expect(/64\.5|64,5/.test(await H.bodyText(p)), 'new entry visible');
    });

    await t.step('Insights: honest empty state on a clean device (no fabricated patterns)', async () => {
      const txt = await H.clickFor(p, 'Insights', /Log a few days|patterns here|Strong|Supported/i);
      if (/●●●|●●○|●○○/.test(txt)) {
        // data exists (e.g. logged earlier in this context) — insights must be graded + attributed
        t.expect(/Strong|Supported|Worth a try/.test(txt), 'grade labels present');
        t.expect(/Dr\.\s?[A-Z]/.test(txt), 'expert attribution present');
      } else {
        t.expect(/Log a few days|patterns here/i.test(txt), 'honest empty state shown');
        t.expect(!/7-day average|\d+\/7 days/i.test(txt), 'no fabricated pattern claims without data');
      }
    });

    await t.step('Milestones contain no weight/deficit streaks', async () => {
      await H.clickText(p, 'Milestones');
      await p.waitForTimeout(1200);
      const txt = await H.bodyText(p);
      t.expect(/Milestone|Badge|Day streak|Consistency/i.test(txt), 'milestones content present');
      // shame-based badge patterns only — the header's own guarantee copy
      // ("No weight or deficit streaks — ever") must NOT trip this
      t.expect(!/lost \d+ ?(kg|lb)|\d+ ?(kg|lb) lost|deficit (day|badge|club)|weight-?loss (badge|streak)/i.test(txt), 'no shame-based milestones');
    });
  },
};
