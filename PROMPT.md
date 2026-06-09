# 18 — Lovable Build Prompt (HerFuel)

**How to use:** paste **§1 (The Prompt)** into Lovable as the initial build prompt. Then use **§2 (Iteration prompts)** one at a time to flesh out screens. **§3** is the reference appendix (numbers, copy, data) to paste when Lovable asks for specifics. Keep our principles (§1 "Non-negotiables") in every follow-up so they don't get lost.

---

## §1 — THE PROMPT (paste this first)

> Build **HerFuel**, a women-first AI nutrition tracker. It is a **great general calorie & macro tracker** (think Cal AI / MyFitnessPal quality) **plus optional, toggleable life-stage modules** (Cycle, Pregnancy, Breastfeeding, PCOS, Perimenopause) that tailor targets, guidance, nutrients, recipes and content — **on the user's terms, out of the way when she doesn't want them.** Mobile-first PWA, clean and premium-clinical.
>
> **Who it's for:** women who feel generic trackers aren't built for their bodies — led by the perinatal journey (pregnancy → postpartum/breastfeeding) and perimenopause, with cycle & PCOS as part of the same journey.
>
> **Non-negotiables (these are the brand — never violate):**
> 1. **Honesty:** only change the calorie target when the science is real — Pregnancy T2 **+340 kcal**, T3 **+452**, Breastfeeding **+400**; T1 and the menstrual cycle get **no calorie bump** (the "luteal bump" isn't supported) — instead adapt the *plan* (nutrients, cravings, comfort), not the number. Every guidance tip carries an **evidence grade** (Strong ●●● / Supported ●●○ / Worth a try ●○○) and a short "why you're seeing this" line.
> 2. **Anti-shame / ED-safe:** a **No-numbers mode** that hides calories/macros; neutral, non-judgmental copy; **never** weight/deficit streaks or badges. Streaks count **check-ins, not deficits**; a broken streak is framed as a **fresh start**, never a loss.
> 3. **Privacy:** reproductive/cycle data is the most sensitive there is — store on-device where possible, never sell, easy export & hard delete; state this plainly on the paywall.
> 4. **Optional, not a gate:** no forced life-stage declaration; the app is fully usable as a plain tracker.
>
> **Information architecture — 5-tab bottom bar + a floating ＋:**
> - **Today** — a Cal-AI-style **day switcher** (rings on logged days); a **swipeable 3-page summary carousel** (① calories + macros · ② the micronutrients that matter for the active module — iron/calcium/fibre/magnesium · ③ move & hydrate with tap-to-log water & steps); when a module is on, an **honest target card** (phase chip + week/day scrubber + the +kcal as a single hero + evidence + one-line rationale) and a collapsible **"Today's tips"** (contingent guidance — fires on logged symptoms, nutrient gaps, or stage/week); a **Fuel Score** card ("how well you fuelled for your stage today," never a calorie verdict, with one suggested food to lift it); **food grouped by Breakfast/Lunch/Dinner (+ optional Snack)** where each logged item can be **copied to another meal/day or removed**, and "+ Add to {meal}" opens a dialog with **"you usually log"** recommendations; optional **fasting timer** (with a "not recommended while pregnant/breastfeeding" caution).
> - **Meals** — a hub (tiles: My Foods · My Recipes · My Meals · Meal Plans · Favourites) + module-tailored discovery: suggested meals, **recipes** (real, per-phase, with a detail screen: macro **donut**, ingredients, method steps, log button) and **meal plans** (multi-day, with a detail screen). **＋ Create** food / recipe / meal that **save locally**.
> - **Circle** — a kind, female community: **Learn** (articles, attributed to an RD/MD, searchable + filterable by category, "For you" = active module) · **Watch** (videos, same filtering) · **Challenges** (joinable, with progress — hydration, protein, iron-rich, tune-in) · **Groups** (join → supportive **chat thread**; e.g. Trying to conceive, Pregnancy, Postpartum & feeding, PCOS, Perimenopause, Cycle syncing).
> - **Progress** — measurements by category incl. a **Cycle & body** group (cycle length, flow, BBT) sourced from an integration **or** a manual **symptom logger**; **Milestones** (Cal-AI-style: Day-streak tile + Badges tile → hexagon badge grid + unlock detail) — all DE-safe and optional.
> - **Me** — profile (name/sex/age/height/weight/activity + recalculate), **goals**, **units** (Calories↔kJ, US↔Metric — actually convert values), a **configurable ＋ quick-add** (pick up to 4 of: search, scan, saved, exercise, barcode, water, voice, copy, create, fasting), **life-stage modules**, **connected apps** (Apple Health, Oura, Whoop, Garmin, smart scale — read data & cycle types; never silently bump calories), support (help, **request a feature**, rate, terms & privacy), account (log out, delete account), and Experience toggles (no-numbers, streaks on/off, evidence labels).
> - **＋ floating button** — fans out in place (no modal until an action is picked) into the 4 chosen quick-add actions.
> - **Onboarding** — goal-first, two doors ("just track" / "tailor to my body"), then a **transparent paywall** (longer trial, privacy promise up front, easy cancel — explicitly NOT Cal AI's deceptive billing).
>
> **Logging:** multi-modal — AI **photo scan** (show an honest confidence cue + let the user fix recognised items/portions so macros update), **barcode**, **voice/describe**, **text search** over a real food database, **saved foods/meals**, **copy meal/day**. Aim for <30s per entry; surface recents/favourites first.
>
> **Tech:** React + Tailwind, Supabase (auth + data), a real food database (USDA FoodData Central + a branded source), RevenueCat for subscriptions, HealthKit/Health Connect bridges for device data. Offline-first logging that queues and syncs. WCAG 2.2 AA, dark mode, large-type friendly.
>
> **Design system:** premium-clinical. Ink `#16181A`, warm bg `#FBFAF8`, surfaces white/`#F6F4F0`, trust-teal `#0E6E68`. Per-module accents: Cycle plum `#8A4A66`, Pregnancy blue `#3E7CB1`, Breastfeeding teal `#0E6E68`, PCOS gold `#B5852A`, Perimenopause purple `#7C5CBF`. Rounded cards, soft shadows, ring/dial dataviz, calm and uncluttered.
>
> Start with the **Today** screen (general mode, then with the Breastfeeding module on to show the honest +400 target + tips), then build outward. Use realistic placeholder data.

---

## §2 — Iteration prompts (use after the first build, one at a time)
1. "Add the life-stage **module engine**: a Modules screen + the honest target table (see appendix). Turning on a module re-skins Today (accent, phase chip, week/day scrubber), changes the calorie target only per the table, swaps the 3rd carousel micronutrient, and filters Circle/Meals content."
2. "Build the **contingent guidance** engine: a tagged tip library (trigger = stage week/phase, logged symptom, or logged nutrient gap; priority symptom/data > stage > evergreen), show top 3 with a 'Because…' line, rotate ties by day."
3. "Build the **Meals** recipe + meal-plan detail screens and the Create food/recipe/meal flows (save to Supabase)."
4. "Build **Circle**: searchable/filterable Learn & Watch, joinable Challenges with progress, and Group chat threads."
5. "Build **Progress**: measurement charts, the Cycle & body category + symptom logger, and DE-safe Milestones (streak + badges)."
6. "Build **onboarding + transparent paywall + RevenueCat**; add No-numbers mode and the privacy/data-export/delete screens."
7. "Wire **AI photo/voice logging** with an honest confidence + fix-items loop, **barcode**, and the real **food database** search."
8. "Add **integrations** (Apple Health/Health Connect incl. cycle types), units conversion (kJ/US-metric), reminders, widgets, offline queue."

---

## §3 — Reference appendix (paste when Lovable needs specifics)

**Honest target table** (baseline ≈ 1,900 kcal / 90 g protein for the demo persona):
| Module | kcal Δ | protein Δ | key nutrient | notes |
|---|---|---|---|---|
| Cycle | **0** | +5 g | Calcium / Magnesium (luteal) | no metabolic bump; adapt plan not number; iron in menstrual phase |
| Pregnancy T1 (wk ≤13) | **0** | +5 g | Folate | quality over quantity; nausea-friendly |
| Pregnancy T2 (wk 14–27) | **+340** | +25 g | Iron | established science |
| Pregnancy T3 (wk 28+) | **+452** | +28 g | Iron | smaller, frequent meals |
| Breastfeeding | **+400** | +20 g | Calcium | no deficit in first ~6 wks; hydration |
| PCOS | −100 | +20 g | Fibre | lower-GI; don't promise weight loss |
| Perimenopause | **0** | +30 g | Protein | ~1.2 g/kg for muscle; calcium + vit D |

**Cycle phases:** menstrual (d1–5, iron), follicular (d6–13, energy/protein), ovulatory (d14–16), luteal (d17–28, calcium/magnesium, appetite rises). **Must handle irregular cycles** (don't assume 28 days).

**Evidence grades:** Strong ●●● / Supported ●●○ / Worth a try ●○○. Cite the basis in a one-line note.

**Badges (DE-safe — never weight/deficit):** check-in streaks (3/7/14/30/100 days), logging (first log, 5/50/500 meals, save 10), hydration (×1/×3/×10 days), self-care (logged how you feel ×7, fresh start, protein ×5, iron-rich day, fibre ×5).

**Voice/positioning:** "the nutrition tracker that's actually built for a woman's body — and never shames it." Lead acquisition perinatal + perimenopause (the empty quadrant); compete in the nutrition-tracker category, win on built-for-her + honesty + anti-shame.

**Source material in this repo:** `02-PRD-v0.2.md` (canonical PRD), `17-FEATURE-GAP-ANALYSIS.md` (competitive gaps), `mockup-v5/` (the working clickable reference — Lovable can mirror its flows), `ui-reference/` (Cal AI + Carb Manager screenshots, keyword-named).
