# 17 — Feature Gap Analysis: HerFuel vs Cal AI & Carb Manager (+ market & user demand)

**Date:** 2026-06-09 · **Inputs:** current `mockup-v5` inventory, docs 06/08/11/12/16, the Cal AI feature-request board (doc 12), and fresh web research (4 parallel research passes). **Lenses:** Product · Marketing · QA · UI/UX · Dev. **Purpose:** decide what to build into the prototype now, and seed the Lovable build prompt.

---

## A. Where we already match or beat them (don't re-build)

HerFuel `mockup-v5` is already at **parity-plus** on a lot:
- **Logging surface:** ＋ quick-add (configurable 4 actions), per-meal "Add to" dialog with *"you usually log"* recommendations, search, scan-draft, barcode, voice, **create food/recipe/meal (functional, saved locally)**, copy-yesterday, saved foods/meals.
- **Today:** swipeable summary carousel (calories+macros / phase micronutrients / move+hydrate), Cal-AI-style **day switcher** with logged rings, water + steps **tap-to-log**, food by meal section.
- **Differentiators competitors lack entirely:** life-stage **modules** + the **honest trimester/phase target engine** (move the number only when science is real), **contingent guidance** (tips fire on symptom / nutrient-gap / week-phase, each with a "Because…" line), **Cycle & body** measures + symptom logger, **module-aware** recipes/meal-plans/articles, **no-numbers ED-safe mode**, **DE-safe streaks** (check-ins, not deficits; no weight/deficit badges), evidence grading.
- **Meals hub** (Carb-Manager-style tiles + recipe detail w/ macro donut + meal-plan detail), **Circle** community (Learn/Watch/Challenges/Groups), **Progress** milestones, **integrations** read-not-bump, configurable quick-add, **profile/units/support/account** settings.

**The strategic white space is confirmed by the competitors' own users:** no nutrition app reads cycle data; no cycle app does real food logging. Cal AI's board begs for breastfeeding (~25×), pregnancy (~15×, 168-comment thread), period & PCOS — served by *none* of them. Perimenopause nutrition is near-empty market-wide. This is HerFuel's wedge.

---

## B. Gaps — by priority

### P0 — named by founder / highest pull, build into prototype now
1. **Community is browse-only → add GROUP CHAT.** Cal AI Groups have join + leaderboard + **chat**; ours only lists groups. Add join → open a group thread (posts/replies). *(implementing now)*
2. **Articles & Videos aren't browsable → add search + category filter + module-first suggestions** (same pattern as food search). Today they're a static per-module list. *(implementing now)*
3. **Challenges are static → make joinable with progress** (joined state, simple progress). *(quick follow)*

### P1 — strong demand, high value
4. **Copy/duplicate a meal to another day/meal** — Cal AI's **#1 request (6,104 votes)**; we only have "copy yesterday." Add "copy to…" on any logged item.
5. **"Hit your goal" food suggestions** — Cal AI **#2 (protein when under) & #7 (foods to hit macros)**. Surface "you're 30g protein short — try X" on Today.
6. **Restaurant / eating-out logging** — Cal AI #9; AI estimate for a restaurant/mixed plate with no DB entry.
7. **AI scan "Fix Results" loop** — edit recognised ingredients/portions and have macros update; pair with **honest confidence cues** (research: photo logging is often 40-75% off). Trust-defining for an "honest" brand.
8. **Fasting / intermittent-fasting timer** — table stakes (Carb Manager, MFP, Cal AI in-progress); also a women's-health nuance (caution in pregnancy/peri).
9. **Phase-aware "fuel score"** — our honest answer to Cal AI's Health Score: "how well did I fuel *for my stage* today?" (not a calorie verdict).
10. **Irregular-cycle handling** — research flags this as a top churn driver; don't assume 28 days. Cycle module must handle irregular/now-unknown.
11. **Expert-attributed education + privacy guarantee surfaced in-product** — femtech trust (Flo cites 100+ experts). Attribute articles to an RD/clinician; show the "never sold / encrypted / on-device cycle data" promise prominently.

### P2 — table stakes to not lose on (mostly for the real build)
12. **Recipe import by URL** + recipe-fits-my-targets analysis.
13. **Progress photos**, deeper history (weekly averages, "further back"), weight forecast.
14. **Real reminders**, **nutrition data export (CSV/PDF)** (we only export feedback), **grocery list** from a meal plan.
15. **Apple Watch app + home-screen widgets** (ship-time; N/A in HTML proto).
16. **Units must actually convert** (kJ↔kcal, US↔metric) — currently labels only.
17. **GLP-1 support** (emerging, frequently requested).
18. **Real food DB** (USDA FoodData Central + Nutritionix), real AI scan/voice, Apple Health write-back, auth/sync, RevenueCat — the engineering spine.

---

## C. By role (what each advocate insists on)

**Product** — Lead acquisition on perinatal + perimenopause (the empty quadrant). Win retention with the *journey* (cycle→TTC→pregnancy→postpartum→peri) + low-friction logging. Don't out-DB MFP; win on "built for my body" + honesty. Build P0/P1 above; treat P2 as the parity floor.

**Marketing** — Three moats competitors *can't* cheaply copy: **(1) free barcode + basic logging** (anti-MFP, which paywalled basics → 1.5★ + mass switching), **(2) transparent billing + effortless cancel + privacy-on-paywall** (Cal AI was pulled from the App Store Apr-2026 for deceptive billing — use this), **(3) ED-safe no-numbers + anti-shame**. Longer trials (17–32 days) convert ~45% vs ~27%. Referral loop optional.

**QA** — Offline logging must queue (don't fail); barcode/DB accuracy + flag-and-correct; **timezone / midnight / day-boundary** correctness (logging day, fasting windows, cycle-day math); **kJ/US-metric** conversions; deterministic phone/web/watch sync; **reproductive-data security as testable acceptance criteria** (encryption-at-rest, no location, hard delete, no third-party sale); accessibility as scored (VoiceOver/TalkBack, font scaling, WCAG 2.2 AA, dark mode).

**UI/UX** — Per-entry logging <30s or users quit in 2 weeks (recents/favorites first, 1-tap re-log, fast scanner). Keep no-numbers mode + neutral copy. Add **dark mode**. Avoid clutter and >1 upgrade prompt/session. Honest AI confidence cues.

**Dev** — Real DB + AI services, Apple Health/HealthKit (incl. cycle types), HealthConnect, RevenueCat, offline-first sync, export, units engine. Curated evidence-graded rule library (not free-text LLM) for guidance — already our model.

---

## D. Build-now shortlist (this prototype pass)
- **Circle v2:** group **chat** (join → thread, post a message); **Learn & Watch** with **search + category chips + "For you" (module-first)**; **joinable challenges** with progress. *(this pass)*
- Then, next passes / Lovable prompt: copy-meal, hit-goal suggestions, restaurant log, Fix-Results loop, fasting timer, phase fuel-score, units-convert, dark mode, expert attribution + privacy surfacing.

*This doc + the inventory feed the Lovable prompt (next step).*
