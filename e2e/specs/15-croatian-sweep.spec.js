// Croatian full-coverage sweep: with lang=hr, every major screen shows
// Croatian chrome and the previously-English spots (Me settings subtitles,
// privacy page, integrations, goals, experiments) are localized.
// Citations, brand names ("Powered by Strava", USDA, Open Food Facts) stay English by design.
module.exports = {
  name: '15 · Croatian sweep: all screens localized',
  async run(t) {
    const { page: p, H } = t;

    await t.step('switch app to Croatian', async () => {
      await H.goHome(p);
      await p.evaluate(() => {
        localStorage.setItem('herfuel.lang.test', '1'); // opt out of harness auto-English
        localStorage.setItem('herfuel.lang', 'hr');
        localStorage.setItem('herfuel.lang.chosen', '1');
      });
      await p.reload({ waitUntil: 'networkidle' });
      await H.waitText(p, /Danas/i, 15000);
    });

    await t.step('Today: nav + meals in Croatian', async () => {
      const txt = await H.bodyText(p);
      t.expect(/Danas/i.test(txt), 'nav "Danas"');
      t.expect(/Obroci/i.test(txt), 'nav "Obroci"');
      t.expect(/Doručak/i.test(txt), 'meal "Doručak"');
      t.expect(/Napredak/i.test(txt), 'nav "Napredak"');
    });

    await t.step('Me index: sections + row subtitles in Croatian', async () => {
      await p.goto(H.BASE + '/me', { waitUntil: 'networkidle' });
      const txt = await H.waitText(p, /Postavke/i, 15000);
      t.expect(/Račun/i.test(txt), 'eyebrow "Račun"');
      t.expect(/Povezane aplikacije/i.test(txt), 'row "Povezane aplikacije"');
      t.expect(/Privatnost i podaci/i.test(txt), 'row "Privatnost i podaci"');
      t.expect(!/Name, age, height, weight, activity/i.test(txt), 'profile subtitle not English');
      t.expect(!/Export · hard delete · our promise/i.test(txt), 'privacy subtitle not English');
    });

    await t.step('Privacy & data page in Croatian', async () => {
      await p.goto(H.BASE + '/me/privacy', { waitUntil: 'networkidle' });
      const txt = await H.waitText(p, /Naše obećanje/i, 15000);
      t.expect(/Izvezi moje podatke/i.test(txt), '"Izvezi moje podatke"');
      t.expect(!/Export my data/i.test(txt), 'no English "Export my data"');
      t.expect(!/We never sell your data/i.test(txt), 'promise list not English');
    });

    await t.step('Goals & targets page in Croatian', async () => {
      await p.goto(H.BASE + '/me/goals', { waitUntil: 'networkidle' });
      const txt = await H.waitText(p, /Dnevni ciljevi/i, 15000);
      t.expect(!/Daily targets/i.test(txt), 'no English "Daily targets"');
      t.expect(!/Target mode/i.test(txt), 'no English "Target mode"');
    });

    await t.step('Connected apps page in Croatian (brand strings stay)', async () => {
      await p.goto(H.BASE + '/me/integrations', { waitUntil: 'networkidle' });
      await H.waitText(p, /Dostupno sada/i, 15000);
      // Strava card resolves async (status fetch) — poll for the brand line
      const txt = await H.waitText(p, /Powered by Strava/i, 10000);
      t.expect(/Uskoro/i.test(txt), '"Uskoro" (coming soon)');
      t.expect(!/Available now/i.test(txt), 'no English "Available now"');
    });

    await t.step('Experiments page in Croatian', async () => {
      await p.goto(H.BASE + '/me/experiments', { waitUntil: 'networkidle' });
      const txt = await H.waitText(p, /Eksperimenti/i, 15000);
      t.expect(!/Suggested for you/i.test(txt), 'no English "Suggested for you"');
      t.expect(!/Time-boxed trials/i.test(txt), 'no English tagline');
      t.expect(/bjelančevina|vlakana|željezo|magnezijem|soje/i.test(txt), 'experiment library localized');
    });

    await t.step('Modules page in Croatian', async () => {
      await p.goto(H.BASE + '/modules', { waitUntil: 'networkidle' });
      const txt = await H.waitText(p, /Moduli životne faze/i, 15000);
      t.expect(!/Turn off all modules/i.test(txt), 'no English "Turn off all modules"');
    });

    await t.step('Meals + Progress + Circle chrome in Croatian', async () => {
      await p.goto(H.BASE + '/meals', { waitUntil: 'networkidle' });
      const meals = await H.waitText(p, /Planovi prehrane|Recepti/i, 15000);
      t.expect(/Recepti/i.test(meals), 'meals tab "Recepti"');
      await p.goto(H.BASE + '/progress', { waitUntil: 'networkidle' });
      const prog = await H.bodyText(p);
      t.expect(/Trendovi|Napredak/i.test(prog), 'progress chrome localized');
      await p.goto(H.BASE + '/circle', { waitUntil: 'networkidle' });
      const circ = await H.bodyText(p);
      t.expect(/Zajednica/i.test(circ), 'circle shows "Zajednica"');
    });

    await t.step('switch back to English for the rest of the suite', async () => {
      await p.evaluate(() => localStorage.setItem('herfuel.lang', 'en'));
      await p.reload({ waitUntil: 'networkidle' });
      const txt = await H.bodyText(p);
      t.expect(/Today|Breakfast/i.test(txt), 'UI back in English');
    });
  },
};
