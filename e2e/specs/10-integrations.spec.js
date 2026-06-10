// Real integrations (prompt 30): Connected-apps screen, Renpho CSV import end-to-end,
// honest "Coming soon" section, progress-photos privacy framing (prompt 29).
// NOTE: the Strava OAuth dance itself needs a real Strava login — covered manually.
// The webhook challenge is covered here via fetch (no auth required by design).
const path = require('path');

module.exports = {
  name: '10 · Integrations: Strava UI, Renpho CSV, webhook',
  async run(t) {
    const { page: p, H } = t;

    await t.step('Connected apps: Strava available, honest coming-soon, no mock', async () => {
      await H.goHome(p);
      await H.openMe(p);
      await H.clickText(p, 'Connected apps', { contains: true });
      // the Strava card re-renders after its status fetch — wait for the settled state
      const txt = await H.waitText(p, /POWERED BY STRAVA/i, 10000);
      t.expect(/AVAILABLE NOW/i.test(txt), 'Available-now section');
      t.expect(/Connect with Strava|CONNECTED/i.test(txt), 'Strava connect button/card');
      t.expect(/POWERED BY STRAVA/i.test(txt), '"Powered by Strava" attribution');
      t.expect(/link it to Strava once and your watch flows in automatically/i.test(txt), 'Garmin-via-Strava guidance');
      t.expect(/COMING SOON/i.test(txt), 'Coming-soon section');
      t.expect(/web apps can'?t read HealthKit/i.test(txt), 'honest Apple Health copy');
      t.expect(/Garmin'?s API needs a registered business/i.test(txt), 'honest Garmin-direct copy');
      t.expect(!/mock data only/i.test(txt) && !/Oura|Whoop|Withings/i.test(txt), 'mock + untestable providers gone');
    });

    await t.step('Renpho CSV: upload → preview → save', async () => {
      const fileInputs = await p.evaluate(() => document.querySelectorAll('input[type=file]').length);
      t.expect(fileInputs > 0, 'CSV file input present');
      await p.locator('input[type=file]').first().setInputFiles(path.join(__dirname, '..', 'fixtures', 'renpho-sample.csv'));
      await p.waitForTimeout(1500);
      const preview = await H.bodyText(p);
      t.expect(/Preview — 3 entries/i.test(preview), 'preview parsed 3 entries');
      t.expect(/64\.5/.test(preview) && /24\.0/.test(preview), 'weight + body fat parsed');
      await H.clickText(p, 'Save these entries', { nth: -1, mouse: true });
      await p.waitForTimeout(1500);
      t.expect(/Saved 3 entries/i.test(await H.bodyText(p)), 'save confirmation shown');
    });

    await t.step('imported weights land in Progress → Measurements', async () => {
      await H.goHome(p);
      await H.tab(p, 'Progress');
      await H.clickFor(p, 'Measurements', /FAVOURITES|Body weight/i);
      const pt = await p.evaluate(() => {
        const els = [...document.querySelectorAll('button,a,div,li,article')].filter(e => {
          const txt = (e.innerText || '').replace(/\s+/g, ' ').trim();
          return txt.startsWith('Body weight') && txt.length < 30 && e.getBoundingClientRect().width > 0;
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
      t.expect(/64\.5/.test(detail) && /64\.7/.test(detail) && /64\.9/.test(detail), 'all 3 imported weights in history');
    });

    await t.step('strava-webhook echoes the challenge (Strava subscription handshake)', async () => {
      const res = await p.evaluate(async () => {
        const r = await fetch('https://vseuwlnwvmnpapxowhlv.supabase.co/functions/v1/strava-webhook?hub.mode=subscribe&hub.verify_token=herfuel-strava&hub.challenge=e2e-check');
        return { status: r.status, body: await r.text() };
      });
      t.expect(res.status === 200, 'webhook GET returns 200');
      t.expect(res.body.includes('e2e-check'), 'challenge echoed');
    });

    await t.step('workout-calories toggle exists in Goals and is off by default', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Goals & targets', { contains: true });
      await p.waitForTimeout(1200);
      const txt = await H.bodyText(p);
      t.expect(/Add workout calories to my daily target/i.test(txt), 'toggle present');
      t.expect(/off by default|can be off by 20|we leave this off/i.test(txt), 'honest wearable-error copy');
    });

    await t.step('progress photos: private, off by default (prompt 29)', async () => {
      await H.goHome(p);
      await H.tab(p, 'Progress');
      await H.clickFor(p, 'Measurements', /FAVOURITES|Body weight/i);
      const txt = await H.bodyText(p);
      t.expect(/Photos Optional, private, off by default/i.test(txt.replace(/\s+/g, ' ')), 'Photos subtab labeled off-by-default + on-device');
      await H.clickText(p, 'Photos', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1100);
      const detail = await H.bodyText(p);
      t.expect(/Progress photos are off/i.test(detail), 'photos OFF by default');
      t.expect(/for you only.*never uploaded|Stored on your device/i.test(detail), 'privacy-first framing shown');
      t.expect(/both are fine/i.test(detail), 'neutral no-pressure copy');
    });
  },
};
