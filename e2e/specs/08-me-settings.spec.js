// Me: appearance (dark mode), units conversion, no-numbers mode, privacy promises,
// connected apps state.
module.exports = {
  name: '08 · Me: appearance, units, no-numbers, privacy',
  async run(t) {
    const { page: p, H } = t;

    await t.step('dark mode actually changes the theme', async () => {
      await H.goHome(p);
      const theme = () => p.evaluate(() => {
        const el = document.querySelector('#root > div') || document.body;
        return document.documentElement.className + '|' + (document.documentElement.dataset.theme || '') + '|' + getComputedStyle(el).backgroundColor + '|' + getComputedStyle(document.body).backgroundColor;
      });
      const bg0 = await theme();
      await H.openMe(p);
      await H.clickText(p, 'Appearance', { contains: true });
      await p.waitForTimeout(1100);
      await H.clickText(p, 'Dark', { nth: 0, mouse: true });
      await p.waitForTimeout(1200);
      const bg1 = await theme();
      t.expect(bg0 !== bg1, `theme changed (${bg0} → ${bg1})`);
      await H.clickText(p, 'Light', { nth: 0, mouse: true }).catch(() => {});
      await p.waitForTimeout(700);
    });

    await t.step('units: Calories → Kilojoules converts the live preview and Today', async () => {
      await H.openMe(p);
      await H.clickFor(p, 'Units', /Energy|LIVE PREVIEW/i, { contains: true, nth: 0 });
      await H.clickText(p, 'Kilojoules', { mouse: true });
      await p.waitForTimeout(900);
      const preview = await H.bodyText(p);
      const m = preview.match(/([\d,.]+)\s*kJ/i);
      t.expect(m, 'live preview shows kJ');
      t.expect(parseInt(m[1].replace(/[,.]/g, ''), 10) > 4000, 'kJ value is a real conversion (~4.184×): ' + m[1]);
      await H.goHome(p);
      t.expect(/kJ/i.test(await H.bodyText(p)), 'Today shows kJ');
      // restore
      await H.openMe(p);
      await H.clickFor(p, 'Units', /Energy|LIVE PREVIEW/i, { contains: true, nth: 0 });
      await H.clickText(p, 'Calories', { mouse: true });
      await p.waitForTimeout(700);
    });

    // toggle the switch whose row label matches, by Y-proximity; returns new aria-checked
    const toggleSwitch = async (label) => {
      const pt = await p.evaluate((label) => {
        const lab = [...document.querySelectorAll('div,span,h3,p,label')].find(e => (e.innerText || '').trim().startsWith(label) && (e.innerText || '').length < 200);
        if (!lab) return null;
        const ly = lab.getBoundingClientRect().top;
        const sws = [...document.querySelectorAll('[role=switch],input[type=checkbox]')].filter(s => s.getBoundingClientRect().width > 0);
        const sw = sws.sort((a, b) => Math.abs(a.getBoundingClientRect().top - ly) - Math.abs(b.getBoundingClientRect().top - ly))[0];
        if (!sw) return null;
        const r = sw.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, was: sw.getAttribute('aria-checked') || String(sw.checked) };
      }, label);
      if (!pt) throw new Error('switch not found near: ' + label);
      await p.mouse.click(pt.x, pt.y);
      await p.waitForTimeout(900);
      const now = await p.evaluate((label) => {
        const lab = [...document.querySelectorAll('div,span,h3,p,label')].find(e => (e.innerText || '').trim().startsWith(label) && (e.innerText || '').length < 200);
        const ly = lab.getBoundingClientRect().top;
        const sws = [...document.querySelectorAll('[role=switch],input[type=checkbox]')].filter(s => s.getBoundingClientRect().width > 0);
        const sw = sws.sort((a, b) => Math.abs(a.getBoundingClientRect().top - ly) - Math.abs(b.getBoundingClientRect().top - ly))[0];
        return sw.getAttribute('aria-checked') || String(sw.checked);
      }, label);
      return { was: pt.was, now };
    };

    await t.step('no-numbers mode hides calories and is reversible', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Experience', { contains: true });
      await p.waitForTimeout(1100);
      const before = await H.bodyText(p);
      t.expect(/no-numbers|no numbers/i.test(before), 'no-numbers setting present');
      const flip = await toggleSwitch('No-numbers mode');
      t.expect(flip.was !== flip.now, `switch flipped (${flip.was} → ${flip.now})`);
      await H.goHome(p).catch(() => {});
      const txt = await H.bodyText(p);
      // numbers are masked as "·" — assert no digits remain in the countdown
      t.expect(!/[\d,]+\s*(kcal|kJ) left/i.test(txt) || /hidden/i.test(txt), 'calorie numbers masked in no-numbers mode (got: ' + (txt.match(/.{0,18}(kcal|kJ) left/i) || [''])[0] + ')');
      // restore
      await H.openMe(p);
      await H.clickText(p, 'Experience', { contains: true });
      await p.waitForTimeout(900);
      await toggleSwitch('No-numbers mode');
    });

    await t.step('privacy & data: export + hard delete promised', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Privacy & data', { contains: true });
      await p.waitForTimeout(1100);
      const txt = await H.bodyText(p);
      t.expect(/export/i.test(txt), 'export offered');
      t.expect(/delete/i.test(txt), 'hard delete offered');
      t.expect(/never sold|not sold|never sell/i.test(txt), 'never-sold promise stated');
    });

    await t.step('connected apps: real Strava + honest framing, mock gone', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Connected apps', { contains: true });
      await p.waitForTimeout(1100);
      const txt = await H.bodyText(p);
      t.expect(/never silently raises your target/i.test(txt), 'honest calories-burned framing');
      t.expect(/Disconnect any time/i.test(txt), 'disconnect promise');
      t.expect(/Connect with Strava|CONNECTED/i.test(txt), 'Strava connect present');
      t.expect(/POWERED BY STRAVA/i.test(txt), 'Strava attribution present (branding requirement)');
      t.expect(!/mock data only/i.test(txt), 'mock-data banner removed');
      t.expect(!/Oura|Whoop|Withings/i.test(txt), 'untestable providers removed');
    });
  },
};
