# 28 — Session handoff (read this first if you're a new Claude session)

**Date:** 2026-06-10 · **Founder:** Mate (GitHub `majdukovic`, mate.ajdukovic@gmail.com). This doc is the single source of truth for continuing work on **HerFuel**.

## What HerFuel is
A **women-first AI calorie & macro tracker** that adapts to a woman's **life-stage** (cycle, pregnancy, breastfeeding, PCOS, perimenopause). It's a great *general* tracker (Cal AI / MyFitnessPal quality) **+ optional life-stage modules** — "the Carb Manager model." Positioning: *"the nutrition tracker that's actually built for a woman's body — and never shames it."* Lead acquisition = perinatal + perimenopause. **Markets: US + Croatia** (concept validation will be with **Croatian** users first).

### Four non-negotiable principles (never violate)
1. **Honesty** — move the calorie target only where the science is real: Pregnancy **+0 (T1) / +340 (T2) / +452 (T3)**, Breastfeeding **+400**, PCOS shifts **macro distribution** (≈30% protein/80–120g, fibre 25–30g, lower-GI) not a big calorie cut, **Cycle = NO calorie bump** (luteal RMR rise isn't significant). Every tip carries an evidence grade (Strong ●●● / Supported ●●○ / Worth a try ●○○).
2. **Anti-shame / ED-safe** — No-numbers mode, neutral copy, **no weight/deficit streaks or badges**, streaks count *check-ins*, minimum-calorie floor, **never restrict during pregnancy/breastfeeding**, a broken streak is a "fresh start."
3. **Privacy-first** — reproductive/cycle data on-device by default, never sold, easy export + hard delete.
4. **Optional, not a gate** — fully usable as a plain tracker; no forced life-stage declaration.

## Where everything lives
- **Planning + prototype package:** `~/Desktop/cyclefuel/` — numbered docs `00`–`27` + `START-HERE.md` + `SESSION-LOG.md`.
  - Canonical PRD: **`02-PRD-v0.2.md`**. Gap analysis: **`17`**. Women-led research: **`22`**. Food DB: **`24`** (global) + **`26`** (Croatia). Lovable prompts: `18, 21, 23, 25, 27`. QA report: **`19`**. Progress redesign: `20`.
- **Vanilla reference prototype (behavior source of truth):** `~/Desktop/cyclefuel/mockup-v5/` (`index.html, app.js, data.js, styles.css`). Pure HTML/JS, runs offline, `localStorage` key `cf_v5`. Verify edits with `node --check app.js`. This mirrors the intended UX; Lovable rebuilds it properly.
- **Competitor screenshots:** `~/Desktop/cyclefuel/ui-reference/` — Cal AI + Carb Manager, **keyword-named** `(<app>-<section>-<keywords>.png)`, grouped in 11 folders. Great for "make it like Cal AI does X."
- **GitHub handoff repo (public):** **https://github.com/majdukovic/herfuel-lovable** — `reference-app/` (copy of mockup-v5), `docs/` (the numbered docs), `PROMPT.md`, `DATA-SPEC.md`, `README.md`. Lovable can import this. It's a git repo at `~/Desktop/cyclefuel/lovable-handoff/`; commit + push with `git -C ~/Desktop/cyclefuel/lovable-handoff …`.
- **The live app (built in Lovable):** **https://sweet-link-system.lovable.app/** (published). Editor preview (auth-gated, can't be tested headless): `id-preview--6379bf05-7325-44da-a0c2-cc434a9c602a.lovable.app`. Lovable project_id `6379bf05-7325-44da-a0c2-cc434a9c602a`.
- **Backend:** Supabase project `vseuwlnwvmnpapxowhlv.supabase.co` (provisioned via Lovable). Secret `USDA_FDC_API_KEY` is set. Edge functions: **`food-search`**, **`food-barcode`**. Food DB table is `foods` (+ `food_reports`).
- **Playwright test harness:** `/tmp/lovetest/` — uses `playwright-core` driving the system Chrome (`executablePath: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, headless). Scripts `re*.js`, screenshots in `/tmp/lovetest/shots/`. **Run with `dangerouslyDisableSandbox: true`** (needs network). Mobile viewport 402×874. This is how we QA the live Lovable app.
- **(Legacy) live-build bridge for the vanilla mock:** `~/Desktop/cyclefuel/live-server.js` + `wait-comment.js` + `comments*.jsonl` + `live.state.json` — an early click-to-comment loop on mockup-v5 at localhost:5173. Superseded now that work is in Lovable; ignore unless iterating on the vanilla mock.

## How we work (the loop)
1. User builds/edits in **Lovable** (React/Tailwind/Supabase) by pasting prompts.
2. I (Claude) **QA the live URL** with the Playwright harness, take screenshots, capture console/network errors, and report what works / what's missing.
3. I write the next **Lovable prompt** (saved as a numbered doc + pushed to the repo); user pastes it; repeat.
- **I cannot access Lovable or Supabase directly** (no MCP/token connected). I test via the public URL; the user handles secrets in Lovable/Supabase.

## Current state of the live Lovable app (verified 2026-06-10)
**Working:** 5-tab nav (Today/Meals/Circle/Progress + Me + ＋FAB); onboarding → **transparent 14-day paywall**; **honest module engine** (toggle Pregnancy → +340/T2 etc., gestational-week scrubber, evidence grades); Today (day switcher, calorie+macro carousel, contingent tips, **Fuel Score**, food-by-meal, water/steps logging); **copy/edit/remove** logged items; Meals (hub, recipes + detail, meal plans, **Create food/recipe/meal incl. recipe-import-by-URL**, **shopping list**); Circle (Learn/Watch/Challenges/Groups, search + category filter, RD/MD-attributed articles); **Progress redesigned** (Trends/Measurements/Cycle&body/Insights/Milestones; measurement detail = goal line + 1W–All ranges + Start/Latest/Goal + Δ table + Add-entry + history; Insights evidence-graded); Me (Profile, Goals & targets, **Dietary preferences**, **Units that convert**, **Appearance: working dark mode + reduce-motion + text-size**, Reminders, Connected apps, Privacy & data, **Fasting timer** w/ perinatal caution, **Experiments (Waves)**, no-numbers). **Food database is LIVE:** USDA (generics/micros) + Open Food Facts (global **+ Croatian brand search**: Podravka/Vegeta/Čokolino/Ledo all return real products + barcodes) via the edge functions, cached to `foods`; **barcode** works (manual entry → e.g. Nutella, with honest "–" for missing micros); **community contributions** wired (no-match → "Add as a community food"; `source='user'`, status unverified, `food_reports`; 385-prefix → contribute flow). No console errors.

**Pending / not yet built (next work):**
- **Insights/guidance expert attribution** — cite RD/MD + source on Insight & Today's-tip/coaching cards (Circle articles already do this).
- **Birth-control branch in the Cycle module** — "on hormonal contraception → no natural phases," honest, keep iron/comfort support.
- **Progress photos** — optional & private, off by default, neutral framing.
- **ED-safe onboarding** — a gentle "is tracking ever stressful?" screening + a **minimum-calorie floor** + never-restrict-in-pregnancy guard (the hide-the-ring / no-numbers option already exists).
- **Polish:** OFF items with no `product_name` render as "Unknown" → fall back to brand+category. Confirm **HR-ranking** once region/locale is set. Verify **logging from search** lands on a real device (suspected Lovable preview-badge overlap on the Log button).
- **Known non-issue:** the Lovable **"Edit with" badge** overlaps the bottom-right nav/buttons on the `*.lovable.app` preview link (gone on a custom domain) — tell testers to dismiss it or use a custom domain.

## Food database architecture (MVP, free)
USDA FoodData Central (CC0; generics + deep micros) + Open Food Facts (ODbL; barcode + global + Croatian brands). **Own the normalized `foods` table as system of record** (columns incl. per-100g kcal/protein/carbs/fat/fibre/sugar/sodium/iron/calcium/magnesium, `source` usda|off|user|custom, `status`, `barcode`, `region`). Edge functions proxy + **cache-on-read** (don't bulk-import). **Licensing:** USDA = no obligations; OFF = attribute + keep OFF-derived rows separable + don't reuse OFF images (CC-BY-SA) + 1 API call per real scan. **Croatia:** filter/rank OFF by `countries_tags=croatia`; EAN prefix **385** = Croatian; grow coverage via contribute-back to OFF. **Scale later:** add FatSecret Premier Free (global branded, free until ~$1M rev), then Nutritionix (~$1,850/mo) when restaurant menus become a paid need; never let a proprietary API be the system of record.

## Next steps (product)
1. Finish the pending QA items above (attribution, BC branch, progress photos, ED-safe onboarding) + the polish.
2. **Run Croatian concept-validation interviews** (interview kit: `04`/`05`).
3. **Engage a perinatal RD/clinician to validate the honest target numbers** before real users — they're the core claim.
4. **Name clearance** for "HerFuel" (USPTO + domain; a "HERFUEL" supplement exists — see `15`).
5. Open product decisions still pending: pricing point, hormonal-contraception handling, voice-logging priority.
