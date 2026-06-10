# 32 — Meals section: state, bugs fixed, and the Cal AI / Carb Manager gap analysis

**Date:** 2026-06-10 · Based on direct code review of `sweet-link-system` + the Cal AI/Carb Manager teardowns (docs 12, 17, `ui-reference/`).

## Bugs found & fixed today (direct commits)

| Bug | Severity | Fix |
|---|---|---|
| **"Start plan" / "Log day 1" logged nothing** — both buttons only flipped a UI banner ("Plan started. Day 1 is ready in Today" was a lie) | High — exactly what Mate noticed | "Log day 1 to Today" now really logs each meal of day 1; banner tells the truth and points to ⋯ for adjustments |
| **Recipe "Add to meal" logged nothing** — same fake-banner pattern ("Added to lunch. Nice one." with no log written) | High | Now writes a real `LoggedFood` with the recipe's actual macros |
| **Fake recipe ratings** (4.5–4.9 stars, invented) | Medium — fabricated social proof | Removed from data + both UI render sites |
| No way to plan ahead | Feature gap | **"Plan for tomorrow"** added in two places: the Add-to-meal dialog (Today/Tomorrow toggle on every recipe log) and meal plans ("Plan for tomorrow" button). Planned items land on tomorrow's date — visible via the day switcher, **not counted in today's totals** |

Plan-day entries are honest estimates: the plan publishes only a daily kcal target, so day-1 items are split across meals (25/30/35/10%) with a balanced macro ratio and labelled **"plan estimate"** on every entry; micros are left at 0, never fabricated.

## How we now compare on Meals (Cal AI / Carb Manager)

**Where HerFuel is already at or above parity:**
- Create food / recipe / meal + recipe import by URL (CM's Add-Food depth was the bar — doc 17)
- Meal plans → shopping list generation (CM has this; Cal AI doesn't)
- Module-aware recipe ranking (recipes re-rank when a life-stage module is on — neither competitor does this)
- Copy logged items across meals/days (Cal AI's #1-voted request, 6,104 votes — we have it via ⋯)
- Honest macro provenance ("plan estimate" labels — neither competitor distinguishes estimated from verified macros)

**Real gaps to close (priority order):**
1. **Recents/Frequents/Favourites tabs in the add-food flow** (CM's most-used surface; Cal AI's "Saved" + recents). We have `recentNamesByMeal()` in the store but it only powers dialog hints — it should be a first-class "Recent" list with one-tap re-log. *Biggest logging-friction win available.*
2. **Real recipe content with citations** — current 5 recipes/4 plans are invented demo content with estimated macros. Research agent is fetching real, source-cited recipes (USDA public-domain preferred) — lands next.
3. **Multi-day plan application** — we apply day 1 only; CM applies a full week to the calendar. Next step: "Apply day N" per sample day, then full-plan scheduling once plans have 7 real days.
4. **Saved meals as one-tap combos** (CM "Meals" = groups of foods logged together). We have saved foods; bundling them into reloggable meals is the missing piece.
5. **Portion adjustment at log time** for recipes (servings stepper in the Add-to-meal dialog; currently fixed 1 serving — editable after via ⋯ Edit).

**Deliberately NOT copying:**
- Cal AI's AI-generated recipe images (fake food photos = quiet dishonesty; emoji tiles are honest and fast)
- CM's premium recipe paywall tiering (content stays free; monetization lives elsewhere)
- Star ratings until we have real users rating things

## Planned-vs-logged semantics (current decision)

Tomorrow-planning reuses the existing day-keyed log store: a "planned" item is simply a logged item on a future date. Pros: zero new state, day switcher already shows it, totals stay correct per day. Con: no separate "planned" checkmark flow (mark-as-eaten). If interviews show users want explicit confirm-on-the-day, add a `planned: boolean` flag to `LoggedFood` later — the UI seam (day switcher's future view) is already in place.
