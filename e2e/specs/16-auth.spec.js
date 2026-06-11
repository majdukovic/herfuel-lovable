// Accounts + cloud sync: sign up (email+password, auto-confirm), data pushes
// to user_store, Me shows the signed-in state, sign out works, sign back in
// on a "fresh device" (cleared storage) restores the synced data.
module.exports = {
  name: '16 · Auth: sign up, sync, sign out, restore on fresh device',
  async run(t) {
    const { page: p, H } = t;
    const email = `e2e.${Date.now()}@herfuel-test.dev`;
    const password = `E2e-pass-${Date.now()}`;

    await t.step('Me shows "Sign in or create account" when signed out', async () => {
      await H.goHome(p);
      await H.openMe(p);
      const txt = await H.waitText(p, /Sign in or create account/i, 15000);
      t.expect(/Sync your data across devices/i.test(txt), 'sync subtitle present');
    });

    await t.step('auth page renders with honest optional-account copy', async () => {
      await H.clickText(p, 'Sign in or create account', { contains: true, mouse: true });
      const txt = await H.waitText(p, /Create account/i, 15000);
      t.expect(/An account is optional/i.test(txt), 'honest "optional" copy');
      t.expect(/only you can read it/i.test(txt), 'privacy copy');
    });

    await t.step('create account signs in immediately (auto-confirm)', async () => {
      await p.locator('input[type="email"]').fill(email);
      await p.locator('input[type="password"]').fill(password);
      await H.clickText(p, 'Create account', { nth: -1, mouse: true });
      // success → toast then redirect to Today; CONFIRM_EMAIL → info text instead
      await p.waitForTimeout(4000);
      const txt = await H.bodyText(p);
      t.expect(!/Check your inbox/i.test(txt), 'auto-confirm is ON (no email round-trip)');
      t.expect(!/rate limit|Too many attempts/i.test(txt), 'not rate limited');
      const hasSession = await p.evaluate(() =>
        Object.keys(localStorage).some(k => k.startsWith('sb-') && k.includes('auth-token')));
      t.expect(hasSession, 'supabase session persisted in localStorage');
    });

    await t.step('log a food so there is data to sync', async () => {
      await H.goHome(p);
      await p.evaluate(() => {
        const KEY = 'herfuel.logs.v1';
        const day = new Date(); day.setHours(0,0,0,0);
        const ymd = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
        const logs = JSON.parse(localStorage.getItem(KEY) || '{}');
        // real DayLog schema: { meals: { breakfast/lunch/dinner/snack }, waterMl }
        logs[ymd] = logs[ymd] || { meals: { breakfast: [], lunch: [], dinner: [], snack: [] }, waterMl: 0 };
        logs[ymd].meals.breakfast.push({ id: 'e2e-sync-food', name: 'E2E Sync Oats', kcal: 222, protein: 8, carbs: 40, fat: 4, qty: 1, unit: 'serving' });
        localStorage.setItem(KEY, JSON.stringify(logs));
      });
      // give the 5s push loop time to upsert
      await p.waitForTimeout(7000);
    });

    await t.step('fresh device: clearing storage + sign in restores the data', async () => {
      await p.evaluate(() => localStorage.clear());
      await p.goto(H.BASE + '/auth', { waitUntil: 'networkidle' });
      await H.waitText(p, /Sign in or create account/i, 15000);
      await H.clickText(p, 'Sign in', { nth: -1, mouse: true });
      await p.waitForTimeout(400);
      await p.locator('input[type="email"]').fill(email);
      await p.locator('input[type="password"]').fill(password);
      // the submit button is the full-width one (last "Sign in")
      await H.clickText(p, 'Sign in', { nth: -1, mouse: true });
      // reconcile is a network round-trip (+ possible redirect) — poll up to 20s
      let restored = false;
      for (let i = 0; i < 20 && !restored; i++) {
        await p.waitForTimeout(1000);
        restored = await p.evaluate(() => {
          const logs = localStorage.getItem('herfuel.logs.v1') || '';
          return logs.includes('E2E Sync Oats');
        }).catch(() => false);
      }
      t.expect(restored, 'logged food restored from the cloud on a fresh device');
    });

    await t.step('sign out from Me', async () => {
      await p.goto(H.BASE + '/me', { waitUntil: 'networkidle' });
      // Lovable SSR occasionally serves its error page transiently — retry once
      if (/didn't load/i.test(await H.bodyText(p))) {
        await p.waitForTimeout(2000);
        await p.goto(H.BASE + '/me', { waitUntil: 'networkidle' });
      }
      await H.waitText(p, /Sign out/i, 20000);
      await H.clickText(p, 'Sign out', { nth: -1, mouse: true });
      await p.waitForTimeout(2500);
      const txt = await H.bodyText(p);
      t.expect(/Sign in or create account/i.test(txt), 'back to signed-out state');
    });
  },
};
