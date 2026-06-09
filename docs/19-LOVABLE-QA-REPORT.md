# 19 — Lovable Build QA Report + Fix Prompt

**Tested:** https://sweet-link-system.lovable.app/ · **Date:** 2026-06-09 · **Method:** Playwright driving real Chrome at a 402×874 mobile viewport — every route + key flows clicked, console/network errors captured. Screenshots in `qa-screens/`.

## Verdict
**Strong build — the hard part is right, the easy part is missing.** The differentiator (honest life-stage engine), the IA, and the brand are genuinely well-executed and on-spec. But **you cannot actually log a food**, which blocks real user testing. Fix logging + persistence + copy/remove and it's testable.

## ✅ What works (and is good)
- **Honest module engine (the moat) — works live.** Toggle Pregnancy → Today becomes **+340 kcal (2,240), "PREGNANCY T2 · week 22," a gestational-week scrubber, ●●● Strong** rationale, focus chips (Iron/Calcium). Modules screen shows the honest deltas for all 5 + privacy note + "works fully as a plain tracker." Exactly the spec.
- **Today** — day switcher with logged rings; calories ring + macros carousel; "Nutrients that matter"; Move & hydrate; **Today's tips** (contingent, evidence-graded ●●○, "Because iron is low so far today"); **Fuel Score** (48, "Room to nourish more," "not a calorie verdict, never a judgment," re-frames to "your pregnancy" when a module's on, "Biggest gap: Iron…"); meals by section with totals.
- **Meals** — hub tiles (My Foods/Recipes/Meals/Plans/Favourites); 5 real tagged recipes; **recipe detail** is rich (macros + %, fibre/iron/calcium, full ingredients w/ "(for vitamin C)" note, method).
- **Circle** — Learn/Watch/Challenges/Groups; category chips (For you/All/Basics/Cycle/…); search bar; **RD/MD-attributed** articles; "anonymous & supportive. Not medical advice."
- **Progress** — Measurements/Cycle & Body/Milestones; weight/protein/hydration charts with "+vs 7d"; "No weight or deficit streaks — ever."
- **Me** — profile, modules, experience, connected apps, privacy & data, replay onboarding, sign-out (SOON).
- **Onboarding → paywall** — goal-first; **transparent 14-day trial** ("No card today… we'll email a reminder," "Privacy first — reproductive data stays on device, never sell," "Continue free (limited)," "Cancel anytime in one tap. No dark patterns."). Nails the anti-Cal-AI billing wedge.
- **Water logging works** (+250 ml updates the total). **Zero JS/page errors.**

## 🔴 Bugs / broken (fix before testing)
1. **Logging is non-functional — the core action.** The ＋ fan opens (Scan/Voice/Barcode/Saved/Search/Water) but tapping **Search** (and the other food actions) opens **no add-food screen**. There's no food database/search, so a user **cannot add a meal**. Only Water works. *(Highest priority.)*
2. **"Item options" (⋯) does nothing.** "Tap to edit, copy or remove" is promised on every logged item but no menu opens — so **copy-meal (Cal AI's #1 request) / edit / remove are dead.**
3. **"Add to {meal}" buttons** — need a working food picker (likely same root cause as #1).
4. **State doesn't persist** — module choice and any logging reset on reload (no localStorage/Supabase yet). Testers will lose their session.
5. **Lovable "Edit with" badge overlaps the bottom-right nav** (Progress, partly Circle) on the published link — **blocks tapping Progress**. It's a Lovable preview artifact (gone on a custom domain), but for testers on the lovable.app link, tell them to dismiss it (×) or move to a custom domain.
6. Minor: `502 /__l5e/trackevents` (Lovable's own analytics — ignore) and one `404` asset (low priority).

## 🟡 Missing vs spec (for a credible concept test)
- **Symptom logger** — tips reference "Because you logged Nausea," but there's no way to log how you feel, so the symptom→guidance loop can't be shown.
- **Create food/recipe/meal** that actually saves (the "Saved/Your library" screen is empty — "Create your first").
- **Per-day data** for the day switcher (tapping June 7 should show that day's log, not today's).
- **Connect/disconnect** on integrations with canned device data filling Progress.
- **Fasting timer** (spec P1) — not present.
- Profile setup form, Experience toggles, Privacy & data sub-screens — entry rows exist; confirm the sub-screens are real, not stubs.

## 🧪 What to MOCK (so it's fully testable with no backend — all in localStorage)
1. **Food database (mock, ~150–250 items):** common whole foods + a few branded, each with kcal + P/C/F + iron/calcium/fibre/magnesium + serving sizes. Powers Search and "Add to {meal}". This is the single highest-leverage mock.
2. **AI scan / voice / barcode (mock the recognition, keep the confirm flow real):** Scan → return a canned draft (e.g., "Grilled salmon & quinoa bowl") with **editable parts + a ~confidence % + a "fix this" affordance**; Voice → parse one hardcoded phrase; Barcode → one fixed product. The *confirm-and-log* step should be real.
3. **Seed logged data per day** for ±3 days around today so the day switcher shows real variation; persist new logs to localStorage.
4. **Saved library seed** (2–3 foods/recipes/meals) + make **Create** actually save into it.
5. **Symptom set** (Cramps, Bloating, Nausea, Fatigue, Cravings, Low mood, Hot flashes, Poor sleep, …) + a "How do you feel?" quick logger; wire it so symptom-driven tips fire.
6. **Milestones seed** (a current streak + best + a few earned badges).
7. **Integrations:** connect → canned data (steps, sleep, HRV, cycle length/flow/BBT) that fills Progress + the Today "Move & hydrate" / Cycle & Body; disconnect → gone.
8. Persist **everything** (module, meals, water, symptoms, units, settings) to localStorage so a reload keeps the session — no auth needed for testing.

---

## ✉️ PROMPT TO SEND TO LOVABLE (paste this)

> The build is great — now make it **fully usable without a backend (all state in localStorage)** so we can run user tests. Priorities in order:
>
> **1. Make food logging actually work (highest priority).** Add a **mock food database (~150–200 items)** — common whole foods + a few branded — each with calories, protein/carbs/fat, and iron/calcium/fibre/magnesium, plus 1–2 serving options. Wire the ＋ quick-add actions and the "Add to {meal}" buttons:
> - **Search** → searches the mock DB, tap a result → a confirm sheet (food, serving selector, macros, meal section) → **Confirm logs it** into that meal section and updates the rings, Fuel Score and nutrient gaps immediately.
> - **Scan / Voice / Barcode** → **mock the recognition** (return a canned draft with editable ingredient lines + a "~80% confident, tap to fix" cue), but the **confirm-and-log step must be real**.
> - **Saved** → list saved foods/recipes/meals; tapping logs them.
>
> **2. Wire "Item options" (the ⋯ on each logged food) and "Add to {meal}".** ⋯ opens a menu: **Copy to another meal/day · Edit · Remove** — all functional. "Add to {breakfast/lunch/dinner/snack}" opens the food picker pre-set to that section, leading with a "you usually log at {meal}" shortlist.
>
> **3. Persist everything to localStorage** (active module, logged meals per day, water, steps, symptoms, units, settings, saved items) so a reload keeps the session. No auth required for now.
>
> **4. Add a symptom logger.** A "How do you feel today?" entry (chips: cramps, bloating, nausea, fatigue, cravings, low mood, hot flashes, poor sleep, …). When a symptom is logged, the **Today's tips** must react (e.g., logging Nausea on Pregnancy surfaces the nausea tip with a "Because you logged Nausea" line).
>
> **5. Seed mock data so screens aren't empty:** logged meals for ±3 days around today (so the **day switcher** shows real per-day variation); 2–3 saved foods/recipes/meals; a current + best **streak** with a few earned badges on Milestones; and **mock device data** so Connected-apps "Connect" fills steps/sleep/HRV and cycle length/flow/BBT into Progress (and "Disconnect" clears it).
>
> **6. Make Create food/recipe/meal save** into the Saved library (localStorage) and be immediately loggable.
>
> **7. Add the optional Fasting timer** (16:8 / 14:10 / 18:6, elapsed + progress) with a "not recommended while pregnant or breastfeeding" caution when those modules are on.
>
> **8. Small fixes:** ensure the right-most bottom-nav tabs (Circle, Progress) are reachable (don't let any overlay sit on top of them); keep all the honest/anti-shame copy exactly as is.
>
> Keep the existing design, the honest target engine, the evidence grades, the Fuel Score copy, and the transparent paywall **unchanged** — only add the missing functionality and mock data above.

*(Reference: this repo's `DATA-SPEC.md` has the exact target table, modules, evidence grades and content shapes; `reference-app/` is the working clickable prototype to mirror behaviour.)*

---

# RE-TEST (2026-06-09, after Lovable update) — big improvement

**Most of the blockers are fixed.** Logging now works, copy/remove works, state persists, per-day data works.

## ✅ Now fixed
- **Food logging works end-to-end** via **"Add to {meal}"** → an **Add food** sheet (Search/Saved tabs, a real ~mock food DB with per-100g macros, and **"YOU USUALLY LOG AT {meal}"** recommendation chips) → tap a food → a **Confirm** sheet (serving selector with kcal per option, meal picker, full macros incl. fibre/iron/calcium) → **"Log to {meal}"**. Well-built.
- **"Item options" (⋯) works** — menu shows the item + **Copy to another meal/day · Edit · Remove**.
- **Persistence works** — active module survives reload (localStorage).
- **Day switcher shows per-day data** (tapping another day changes the totals).
- **Symptom entry present** — a "How do you feel today?" card on Today ("tap a chip on Progress to make today's tips react").
- Module engine, Fuel Score, paywall, etc. all still correct (no regressions).

## 🔴 Still broken / new
1. **The central ＋ FAB quick-add actions don't work.** The fan opens (Scan/Voice/Barcode/Saved/Search) but tapping **Search** (and the others) opens **nothing** — no Add-food sheet, no search input. The *only* working log entry is the per-meal "Add to {meal}" button. The most prominent log affordance (the big ＋) is a dead end. **Highest remaining priority.**
2. **React error #418 on load** (`Minified React error #418` — a hydration/text-content mismatch). Doesn't visibly crash a screen but is a real rendering bug to fix.
3. **Lovable "Edit with" badge overlaps critical bottom UI** on the published link — it covers the **"Log to {meal}" confirm button** (so logging can mis-tap the badge) and the **Progress** bottom-nav tab. It's a Lovable preview artifact (gone on a custom domain), but on the lovable.app test link it blocks real taps. Move to a custom domain for testing, or ensure nothing sits in that corner.
4. Minor: confirm tapping a food → "Log to {meal}" actually updates the rings/Fuel Score (the confirm flow is built; verify the write lands now that the button isn't badge-blocked).

## ✉️ Follow-up prompt for Lovable (paste this)
> Logging, copy/remove, persistence and per-day data are working well now — three fixes left:
> **1. Wire the central ＋ (FAB) quick-add actions.** Tapping **Search** must open the same **Add food** sheet that "Add to {meal}" opens (search + the mock food DB + recommendations → Confirm → Log). **Scan / Voice / Barcode** should open a mocked recognition draft (canned item + editable parts + a "~80% confident, tap to fix" cue) that flows into the same Confirm-and-Log step. **Saved** opens the saved-items list; tapping logs. Right now these fan actions open nothing.
> **2. Fix the React #418 error on load** (hydration/text-content mismatch) — check for a component rendering different text on server vs client (often a date/`Date.now()`/locale or conditional rendered before hydration).
> **3. Make sure nothing overlaps the bottom-right corner** so the **"Log to {meal}" confirm button** and the **Progress** nav tab are always tappable (raise their z-index / add safe-area padding above any floating badge).
> Keep everything else exactly as is — the logging Confirm sheet, copy/edit/remove, the module engine, Fuel Score, and the paywall are all good.

