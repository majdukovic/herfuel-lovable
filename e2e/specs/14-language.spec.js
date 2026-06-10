// Croatian localization: first-visit language modal (Croatian-first copy),
// choosing Hrvatski localizes the UI chrome, switcher in Me → Appearance.
module.exports = {
  name: '14 · Language: modal + Croatian UI + switcher',
  async run(t) {
    const { page: p, H } = t;

    await t.step('first visit shows the language modal, question in Croatian', async () => {
      await H.goHome(p);
      await p.evaluate(() => {
        localStorage.setItem('herfuel.lang.test', '1'); // opt out of harness auto-choice
        localStorage.removeItem('herfuel.lang');
        localStorage.removeItem('herfuel.lang.chosen');
      });
      await p.reload({ waitUntil: 'networkidle' });
      const txt = await H.waitText(p, /Na kojem jeziku želiš koristiti HerFuel/i, 15000);
      t.expect(/Hrvatski/.test(txt) && /English/.test(txt), 'both language options offered');
      t.expect(/Which language/i.test(txt), 'English subline present so everyone understands');
    });

    await t.step('choosing Hrvatski localizes navigation and Today', async () => {
      await H.clickText(p, 'Hrvatski', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1500);
      // walkthrough may appear next (first visit) — it should be in Croatian; finish it
      const txt0 = await H.bodyText(p);
      if (/Dobrodošla u HerFuel/i.test(txt0)) {
        for (let i = 0; i < 5; i++) {
          const txt = await H.bodyText(p);
          if (/Završi/.test(txt)) { await H.clickText(p, 'Završi', { nth: -1, mouse: true }); break; }
          await H.clickText(p, 'Dalje', { nth: -1, mouse: true }).catch(() => {});
          await p.waitForTimeout(500);
        }
        await p.waitForTimeout(800);
      }
      const txt = await H.bodyText(p);
      t.expect(/Danas/.test(txt), 'nav shows "Danas"');
      t.expect(/Obroci/.test(txt), 'nav shows "Obroci"');
      t.expect(/Doručak/.test(txt), 'meals show "Doručak"');
      t.expect(/Dodaj u doručak/i.test(txt), 'add buttons in Croatian');
    });

    await t.step('modal does not reappear after choosing', async () => {
      await p.reload({ waitUntil: 'networkidle' });
      await p.waitForTimeout(2000);
      t.expect(!/Na kojem jeziku želiš/i.test(await H.bodyText(p)), 'language modal gone');
    });

    await t.step('switcher in Appearance flips back to English', async () => {
      // Me → Izgled i pristupačnost (Appearance)
      const av = await p.evaluate(() => {
        let best = null;
        document.querySelectorAll('button,a').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.top < 90 && r.left > innerWidth - 95 && r.width > 0) best = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
        return best;
      });
      await p.mouse.click(av.x, av.y);
      await p.waitForTimeout(1200);
      await H.clickText(p, 'Izgled', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1200);
      const scr = await H.bodyText(p);
      t.expect(/jezik/i.test(scr), 'language section present (Jezik)');
      t.expect(/na engleskom/i.test(scr), 'honest note: health content still English');
      await H.clickText(p, 'English', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1200);
      await H.goHome(p);
      const txt = await H.bodyText(p);
      t.expect(/Today's tips|Breakfast/i.test(txt), 'UI back in English');
    });
  },
};
