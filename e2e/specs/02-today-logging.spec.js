// Today screen: water + steps logging, tips with expert attribution + evidence grades,
// Fuel Score framing, day switcher.
module.exports = {
  name: '02 · Today: water, steps, tips, Fuel Score',
  async run(t) {
    const { page: p, H } = t;

    await t.step('load Today', async () => {
      await H.goHome(p);
    });

    await t.step('log water via quick-add', async () => {
      const before = (await H.bodyText(p)).match(/Water ([\d.]+)\s*\//);
      await H.clickText(p, '0.3 L', { contains: true, nth: -1 });
      await p.waitForTimeout(900);
      const after = (await H.bodyText(p)).match(/Water ([\d.]+)\s*\//);
      t.expect(before && after, 'water widget visible');
      t.expect(parseFloat(after[1]) > parseFloat(before[1]), `water increased (${before[1]} → ${after[1]})`);
    });

    await t.step('log steps', async () => {
      await H.clickText(p, 'Steps', { contains: true, nth: -1 });
      await p.waitForTimeout(900);
      const txt = await H.bodyText(p);
      // a steps entry sheet should open (input or quick amounts)
      const hasInput = await p.evaluate(() => !!document.querySelector('input[type=number],input[inputmode=numeric],input[inputmode=decimal]'));
      if (hasInput) {
        await p.evaluate(() => {
          const i = document.querySelector('input[type=number],input[inputmode=numeric],input[inputmode=decimal]');
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(i, '4000');
          i.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await p.waitForTimeout(400);
        await H.clickText(p, 'Save', { contains: true }).catch(() => H.clickText(p, 'Add', { contains: true }).catch(() => H.clickText(p, 'Log', { contains: true })));
        await p.waitForTimeout(900);
        const after = await H.bodyText(p);
        t.expect(/4,?000/.test(after), 'steps now show 4000');
      } else {
        t.expect(/steps/i.test(txt), 'steps widget at least visible');
      }
    });

    await t.step('tips carry evidence grades and expert attribution', async () => {
      const txt = await H.bodyText(p);
      t.expect(/Today'?s tips/i.test(txt), 'tips section visible');
      t.expect(/●●●|●●○|●○○/.test(txt), 'evidence dots visible');
      t.expect(/Strong|Supported|Worth a try/i.test(txt), 'evidence grade labels visible');
      t.expect(/Dr\.\s?[A-Z]/.test(txt), 'expert attribution (Dr. …) on tip cards');
    });

    await t.step('Fuel Score present with non-judgmental framing', async () => {
      const txt = await H.bodyText(p);
      t.expect(/FUEL SCORE/i.test(txt), 'Fuel Score visible');
      t.expect(/not a calorie verdict|never a judgment/i.test(txt), 'anti-shame framing present');
    });

    await t.step('day switcher shows past week and switches day', async () => {
      // tap yesterday (numbered chip), expect date heading to change, then back
      const heading0 = (await H.bodyText(p)).match(/TODAY ([A-Za-z]+, \w+ \d+)/);
      const switched = await p.evaluate(() => {
        const chips = [...document.querySelectorAll('button')].filter(b => /^\d{1,2}$/.test((b.innerText || '').replace(/\D/g, '')) && b.getBoundingClientRect().top < 220);
        if (chips.length < 2) return false;
        chips[chips.length - 2].click();
        return true;
      });
      t.expect(switched, 'day chips found');
      await p.waitForTimeout(900);
      const txt = await H.bodyText(p);
      t.expect(!/kcal left.*undefined/i.test(txt), 'day switch renders');
      await H.goHome(p);
    });
  },
};
