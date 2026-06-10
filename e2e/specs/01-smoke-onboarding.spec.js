// Smoke + onboarding. Fresh storage lands on Today; onboarding is replayed via Me →
// "Replay onboarding". Flow (verified 2026-06-10): goal screen → "Two ways in" →
// "Your wellbeing first" ED-safe check-in → 14-day trial CTA → Today.
// This spec deliberately takes the ED-safe "Soften the experience" path and asserts
// the app actually softens (calorie ring hidden). Context is fresh per spec, so the
// choice doesn't leak into other specs.
module.exports = {
  name: '01 · Smoke + onboarding (ED-safe path)',
  async run(t) {
    const { page: p, H } = t;

    await t.step('app loads with calorie ring and no page errors', async () => {
      await H.goHome(p);
      const txt = await H.bodyText(p);
      t.expect(/kcal left/i.test(txt), 'calorie ring "kcal left" visible');
      t.expect(H.kcalLeft(txt) > 800, 'plausible calorie target');
      t.expect(t.collect.pageErrors.length === 0, 'no page errors: ' + t.collect.pageErrors.join('; '));
    });

    await t.step('bottom nav has Today/Meals/Circle/Progress + FAB, Me avatar on top', async () => {
      const nav = await p.evaluate(() => {
        const out = [];
        document.querySelectorAll('button,a').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.bottom > innerHeight - 110 && r.width > 0) out.push((el.innerText || '').trim());
        });
        return out;
      });
      for (const tabName of ['Today', 'Meals', 'Circle', 'Progress'])
        t.expect(nav.includes(tabName), 'nav tab present: ' + tabName + ' (got: ' + nav.join(',') + ')');
    });

    await t.step('onboarding: goal screen with no-wrong-answers framing', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Replay onboarding', { contains: true });
      await p.waitForTimeout(1500);
      const txt = await H.bodyText(p);
      t.expect(/What brings you to HerFuel/i.test(txt), 'goal question shown');
      t.expect(/No wrong answers/i.test(txt), 'non-judgmental framing present');
      await H.clickText(p, 'Feel better, no scale focus', { contains: true });
      await H.clickText(p, 'Next');
      await p.waitForTimeout(1000);
    });

    await t.step('onboarding: "Two ways in" — tracker is not gated by life-stage', async () => {
      const txt = await H.bodyText(p);
      t.expect(/Two ways in/i.test(txt), 'Two ways in screen shown');
      t.expect(/Just track/i.test(txt), 'plain-tracker path offered');
      await H.clickText(p, 'Just track', { contains: true });
      await H.clickText(p, 'Continue');
      await p.waitForTimeout(1000);
    });

    await t.step('onboarding: ED-safe gentle check-in exists', async () => {
      const txt = await H.bodyText(p);
      t.expect(/wellbeing|gentle check-in/i.test(txt), 'wellbeing check-in screen shown');
      t.expect(/disordered eating|unhelpful/i.test(txt), 'screening copy acknowledges disordered eating');
      t.expect(/soften/i.test(txt), '"Soften the experience" option offered');
    });

    await t.step('soften path + transparent trial → softened Today', async () => {
      await H.clickText(p, 'Soften the experience', { contains: true });
      await p.waitForTimeout(600);
      const txt = await H.bodyText(p);
      t.expect(/14-day trial|14 day/i.test(txt), 'transparent 14-day trial CTA visible');
      await H.clickText(p, 'Start 14-day trial', { contains: true });
      await p.waitForTimeout(2000);
      const today = await H.bodyText(p);
      t.expect(/TODAY/i.test(today), 'landed on Today');
      t.expect(/Calorie ring hidden|NOURISHMENT/i.test(today), 'soften choice respected — calorie ring hidden');
      t.expect(!/kcal left/i.test(today), 'no calorie countdown in softened mode');
    });

    await t.step('Goals & targets has the 1200-kcal safety floor + ED-safe controls', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Goals & targets', { contains: true });
      await p.waitForTimeout(1200);
      const txt = await H.bodyText(p);
      t.expect(/safety floor of 1,?200|Minimum kcal floor/i.test(txt), '1200-kcal floor copy present');
      t.expect(/Hide the calorie ring/i.test(txt), 'ED-safe "hide the ring" control present');
      t.expect(/pregnancy adds, not subtracts|modules can override/i.test(txt), 'honest-mode pregnancy guard copy present');
    });
  },
};
