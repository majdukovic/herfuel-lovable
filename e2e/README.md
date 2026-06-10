# HerFuel regression suite

Playwright (playwright-core + system Chrome, no browser download) against the live Lovable deployment. Mobile viewport 402×874. Each spec runs in a fresh browser context (clean localStorage), so specs are order-independent and deterministic.

## Run

```bash
cd e2e
npm install          # once (only playwright-core)
node run.js          # full suite  (needs Node ≥ 18; e.g. PATH="/opt/homebrew/opt/node@22/bin:$PATH")
node run.js 03 06    # only specs with those prefixes
HEADED=1 node run.js # watch the browser
SHOTS_ALL=1 node run.js  # screenshot after every step (debugging), not just failures
HERFUEL_BASE_URL=https://my-domain node run.js   # different deployment
HERFUEL_BASE_URL=http://localhost:8080 node run.js  # against `bun run dev` of sweet-link-system
```

Exit code 1 if any hard step fails. Report: `report/last-run.json`; failure screenshots: `report/shots/`.

## Conventions

- **Steps are sequential flows** — a failed step skips the rest of its spec; the suite continues.
- **`[soft]` steps** assert *pending* features. They WARN instead of FAIL, and should be flipped to hard steps when the feature ships (each one names its prompt doc).
- The Lovable **"Edit with" badge** overlays the bottom-right nav on `*.lovable.app`; the harness removes it via an init-script interval. On a custom domain this is a no-op.
- Console errors, page errors, HTTP ≥400 responses and `food-search`/`food-barcode` edge-function calls are collected per spec and written into the report.

## Specs

| Spec | Covers |
|---|---|
| 01 smoke + onboarding | load, nav layout, replayed onboarding: goal → "Two ways in" → ED-safe wellbeing check-in → soften path hides the calorie ring → 14-day trial; `[soft]` min-calorie floor (prompt 29) |
| 02 today logging | water quick-add, steps entry, tips with evidence grades + expert attribution, Fuel Score anti-shame framing, day switcher |
| 03 food search | FAB→Search, USDA/OFF results via `food-search` edge fn (200s), log a result → kcal ring decreases, Croatian brand (Vegeta), no-match → community-add offer |
| 04 barcode | FAB→Barcode manual entry, Nutella EAN via `food-barcode`, honest "–" micros, log to meal |
| 05 meals create | hub, recipe detail, create custom food, shopping list manual add |
| 06 modules honesty | baseline target; Pregnancy T2 = exactly +340; fasting warns in pregnancy; toggle off restores baseline; **Cycle module changes nothing**; `[soft]` birth-control branch (prompt 29) |
| 07 progress | anti-shame header, 5 subtabs, add weight entry, evidence-graded + attributed insights, no shame milestones |
| 08 me settings | dark mode flips theme, kcal→kJ real conversion, no-numbers mode reversible, privacy promises, connected-apps honest framing; `[soft]` real Strava (prompt 30) |
| 09 circle | honest editorial content: "HerFuel Editorial" byline + evidence grades, NO invented experts, article expands with cited sources + pending-RD-review note, real YouTube links with creator credentials, no fabricated group member counts |
| 10 integrations | Connected apps (Strava + honest coming-soon), Renpho CSV import end-to-end with "imported" tag, webhook challenge echo, workout-calories toggle off by default, progress-photos privacy |

## Adding a spec

Create `specs/NN-name.spec.js` exporting `{ name, async run(t) }`. `t` gives you `page`, `H` (harness helpers: `goHome, tab, openMe, fab, clickText, bodyText, waitText, kcalLeft, shot`), `t.step(name, fn)`, `t.expect(cond, msg)`, `t.collect` (errors + edge calls), `t.data` (cross-step scratch).
