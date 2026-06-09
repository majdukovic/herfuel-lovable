# HerFuel — Data & Design Spec (for Lovable)

Concrete values extracted from the working prototype (`reference-app/data.js`). Use these verbatim so targets, colours and content stay correct. All nutrition is **demo data** — replace foods/macros with a real database at build time, but keep the **structures, targets, modules, copy and rules**.

---

## 1. Design tokens
```
--ink:    #16181A   (primary text / dark)
--ink2:   #4A4F55   --ink3: #8A9098  (secondary / muted)
--bg:     #FBFAF8   (warm app background)
--surface:#FFFFFF   --surface2:#F6F4F0  (cards / chips)
--line:   #ECE8E1   (borders)
--teal:   #0E6E68   --teal-soft:#E3EFED  (trust accent)
```
**Per-module accent colours:**
| Module | Accent | Emoji |
|---|---|---|
| Cycle | `#8A4A66` (plum) | 🌙 |
| Pregnancy | `#3E7CB1` (blue) | 🤰 |
| Breastfeeding | `#0E6E68` (teal) | 🤱 |
| PCOS | `#B5852A` (gold) | 🌸 |
| Perimenopause | `#7C5CBF` (purple) | 🌿 |

**Style:** rounded cards (~18–20px radius), soft shadows, generous spacing, ring/dial + conic-donut dataviz, premium-clinical, uncluttered. Type: large bold headings, small uppercase section labels. Dark mode required.

---

## 2. Honest target engine (THE differentiator)
Baseline maintenance for the demo persona ≈ **1,900 kcal / 90 g protein**. A module changes the target **only** per this table:

| Module / phase | kcal Δ | protein Δ | key nutrient (3rd ring) | focus chips | honesty grade |
|---|---|---|---|---|---|
| **Cycle** | **0** | +5 | Calcium / Magnesium (luteal) | per phase (below) | Supported |
| **Pregnancy T1** (wk ≤13) | **0** | +5 | Folate | Folate · Hydration · No kcal change | Strong |
| **Pregnancy T2** (wk 14–27) | **+340** | +25 | Iron | +340 kcal · Iron · Calcium | Strong |
| **Pregnancy T3** (wk 28–40) | **+452** | +28 | Iron | +452 kcal · Iron · Smaller meals | Strong |
| **Breastfeeding** | **+400** | +20 | Calcium | Recovery/Protein · Calcium · Hydration | Strong |
| **PCOS** | **−100** | +20 | Fibre | Fibre · Protein · Lower-GI | Supported |
| **Perimenopause** | **0** | +30 | Protein | Protein · Calcium · Vitamin D | Strong |

**Rules:** Cycle gets **no** metabolic bump (the "luteal bump" isn't supported) — adapt the *plan* not the number. Pregnancy target is **trimester-derived from gestational week** (scrubber drives it). Wearable "burn" **never** silently raises the target. Show the Δ as a single hero number on the Today target card; don't repeat it in surrounding copy.

**Cycle phases** (from cycle day; must also handle irregular/unknown cycles):
- Menstrual (d1–5) → Iron · Comfort · Hydration
- Follicular (d6–13) → Protein · Energy · Strength
- Ovulatory (d14–16) → Protein · Fibre · Antioxidants
- Luteal (d17–28) → Calcium · Magnesium · Steady carbs (appetite genuinely rises — help her ride it, don't fake a calorie change)

---

## 3. Contingent guidance (tips that change for real reasons)
A curated, **evidence-graded rule library** (NOT free-text LLM). Each tip: `{title, body, tag, grade, note, trigger}`.
- **Triggers:** stage week-range · cycle phase · **logged symptom** · **logged nutrient gap** (e.g. iron < 50% of target after a meal logged) · evergreen.
- **Priority:** symptom/data (1) > stage (2) > evergreen (3); show top ~3; rotate ties by day.
- Each card shows a **"Because …"** line (e.g. "Because you logged Nausea" / "Because it's trimester 2" / "Because iron is low so far today").
- **Evidence grades:** Strong ●●● / Supported ●●○ / Worth a try ●○○ — with a one-line basis note. (Examples: +340/+452 kcal & pregnancy iron = Strong; magnesium for cramps, ginger for nausea = Supported; cycle appetite variation, hot-flash triggers = Worth a try.)
- Symptom set: Cramps, Bloating, Breast tenderness, Headache, Low mood, Fatigue, Cravings, Acne, Hot flashes, Night sweats, Nausea, Poor sleep.

---

## 4. Fuel Score (honest "health score")
Per-day 0–100 = weighted: protein/target ×0.40 + key-nutrient/target ×0.25 + fibre/28g ×0.20 + calorie-adequacy ×0.15 (each capped at 1). Labels: ≥80 "Well fuelled", ≥55 "Getting there", else "Room to nourish more". Copy: *"How well you fuelled for your {stage} today — not a calorie verdict, never a judgment."* Surface the single biggest gap with one suggested food to lift it. Never shame.

---

## 5. Gamification (DE-SAFE — never weight or deficit)
- **Streak** = days **checked in** (logged anything / how you feel), not days under a goal. A 0 streak = **fresh start** ("today is day 1; your best run of N didn't go anywhere"), never "you lost it". Forgiving (allow grace).
- **Milestones screen** (Cal-AI style): Day-streak tile + Badges-earned tile → 3-col **hexagon badge grid** (earned = colour, locked = grey) → tap = unlock/locked detail.
- **Badges (all process/self-care):** check-in streaks (3/7/14/30/100 d), logging (first log, 5/50/500 meals, save 10), hydration (×1/×3/×10 days), self-care (logged-how-you-feel ×7, fresh-start, protein ×5, iron-rich day, fibre ×5). **No weight-loss or deficit badges.**
- Entirely optional (toggle off in Me).

---

## 6. Content data shapes (replace values, keep shapes)
- **Recipe** `{name, emoji, kcal, p, c, f, fiber, iron, calcium, serv, mins, rating, tags[], ingredients[], steps[]}` — provide ~3 real recipes per module, tailored to its focus. Detail screen: macro **donut** (conic P/C/F, calories centre) + iron/calcium + ingredients + numbered method + "Add to {meal}".
- **Meal plan** `{name, tag, days, kcal, why, sample:[{d, b, l, dn, s}]}` — multi-day, phase-tailored; detail shows sample days + "Start plan" / "Log Day 1".
- **Article** `{title, readTime, category, by(author RD/MD)}` — categories: For you · All · Basics · Cycle · Pregnancy · Postpartum · PCOS · Perimenopause; "For you" = active module; searchable + filterable like food search. **Video** `{title, category, duration}` same filtering.
- **Circle Groups** (join → chat thread): Trying to conceive, Pregnancy, Postpartum & feeding, PCOS sisters, Perimenopause, Cycle syncing. **Challenges** (joinable + progress): 7-day hydration, Protein goal week, Iron-rich week, Tune-in (log how you feel ×7). Anonymous & supportive; "not medical advice".

---

## 7. Integrations (read data; NEVER silent calorie bump)
Apple Health, Oura, Whoop, Garmin, smart scale (Withings/Renpho). Connect → show live data + fill Progress; disconnect → data gone. **Female-specific reads** when available: menstrual flow, cycle length, BBT/wrist-temp, symptoms (Apple Health/Oura). Write nutrition (calories/macros/micros/water/weight) back to Apple Health. Wearable "burn" informs **context/coaching**, not the target.

---

## 8. Logging
Multi-modal: AI **photo scan** (honest ~confidence cue + let user fix recognised items/portions so macros update), **barcode**, **voice/describe**, **text search** over a real DB, **saved foods/meals**, **copy meal/day**, **create food/recipe/meal** (persisted). Per-meal "Add to {meal}" opens a dialog with **"you usually log at {meal}"** recommendations. ＋ floating button **fans out in place** into 4 user-configurable quick actions (from: search, scan, saved, exercise, barcode, water, voice, copy, create, fasting). Target <30s per entry; recents/favourites first. Optional **fasting timer** (16:8 / 14:10 / 18:6) with a "not recommended while pregnant/breastfeeding" caution.

---

## 9. Units & i18n
Energy: Calories ↔ kilojoules (must convert values, not just labels). System: US (lb/oz/fl oz) ↔ Metric (kg/ml). US-first. Handle day-boundary/timezone correctly for the "logging day", fasting windows, and cycle-day math.
