# 20 — Progress redesign (vs Cal AI & Carb Manager)

**Why:** our Progress is a flat measurement-picker + sparkline + Milestones. Cal AI and Carb Manager both do more, and we're leaving our one true differentiator on the table. Grounded in `ui-reference/05-progress-measurements/`.

## What competitors have that we don't
**Carb Manager ("Goals" → Progress / Insights tabs):** measurement selector with chart/scatter toggle · **working time ranges** (1W/1M/3M/6M/1Y/All) · **goal line** on the chart (dashed "Goal: below 120 lbs") · **Start / Latest / Goal** stat row + plain-language status ("Weight hasn't changed since you started") · **+ Add New Weight** entry · an **extensible "All Measurements" library** grouped Body / Body-composition / Health-metabolic (glucose, ketones, GKI, BP) / Diet-macros / Micronutrients / Lifestyle (exercise, fasting, hydration, sleep) · a separate **Insights** tab.

**Cal AI:** Day-streak + Badges tiles · Current weight + **Start→Goal bar** + "% of goal" · weight line chart with time ranges · **Weight-changes Δ table** (3/7/14/30/90/All-time, each with sparkline + delta) · **Progress Photos** · **Daily Average Calories** trend.

## Our gaps
No goal line, no Start/Latest/Goal stats, time-range pills are stubs, no Δ-table, no progress photos, no nutrition trends (avg cal/macro adherence), shallow biomarker breadth, **no Insights tab** — and **no use of the one thing only we can do: nutrition × life-stage correlation.**

## The redesign — 5 sub-tabs
1. **Trends** (default) — headline cards: **Weight** (goal line + Start/Latest/Goal + Δ + status), **Nutrition** (avg calories + protein/fibre adherence over the range), **Activity & hydration** (steps/sleep/water). Tap a card → its detail.
2. **Measurements** — the CM-style **extensible library**, grouped (Body · Body composition · Health/metabolic · Diet/macros · Micronutrients · Lifestyle · **Cycle & body**), each row showing current value + mini sparkline + an **ADD** affordance. Tap → **rich detail**:
   - current value + unit + source (device/manual) · **working time-range** pills (1W/1M/3M/6M/1Y/All) that actually slice the series
   - **line chart with a dashed goal line** (+ optional **cycle-phase shading** as background bands — women-first)
   - **Start / Latest / Goal** row + a plain-language status ("down 1.2 kg in 30 days" / "steady")
   - **Δ-over-time table** (7 / 30 / 90 d / all) like Cal AI
   - **+ Add entry** (manual) · **set/edit goal** · history (edit/delete) · **Favourite ★**
3. **Cycle & body** (our moat) — cycle length, period flow, **BBT chart**, **symptom frequency**, phase context; "we read this for nutrition — not a period-tracker rebuild." Manual symptom logger.
4. **Insights** (the differentiator no competitor has) — auto-generated, **evidence-graded, phase-aware, anti-shame** cards correlating nutrition × life-stage × patterns, e.g.:
   - "Protein is up **+18 g/day** vs last week 💪 — great for your {stage}." *(computed)*
   - "Iron tends to dip on your heavier-flow days — worth front-loading iron around your period." *(cycle · ●●○ Supported)*
   - "You hit your **fibre** goal **5 of 7** days." *(computed)*
   - "Hydration trending up **+0.4 L** vs last week." *(computed)*
   - "Energy felt lower on days you logged under 70 g protein." *(correlation · ●○○ Worth a try)*
   - Pregnancy: "Your weight is tracking **within the healthy second-trimester range**." *(honest band, never a deficit)*
   Each card: icon · one-liner · evidence dot · optional CTA. Honest, never weight-shaming.
5. **Milestones** — the existing DE-safe streak + badges.

## Anti-shame guardrails (keep)
"No weight or deficit streaks — ever." Weight is optional and neutrally framed; respect **No-numbers mode** (hide values); progress photos optional & private; pregnancy uses **healthy-gain ranges**, never deficits.

---

## ✉️ Lovable prompt (paste)
> Upgrade the **Progress** screen into a proper, women-first analytics hub. Keep the design language. Add 5 sub-tabs: **Trends · Measurements · Cycle & body · Insights · Milestones**.
> - **Trends (default):** headline cards — Weight (with a dashed **goal line**, a **Start / Latest / Goal** row, a Δ and a plain-language status), Nutrition (avg calories + protein & fibre adherence over the selected range), Activity & hydration (steps/sleep/water). Tapping a card opens its detail.
> - **Measurements:** an extensible **library** grouped Body / Body composition / Health & metabolic (glucose, ketones, blood pressure) / Diet & macros / Micronutrients / Lifestyle (exercise, fasting, hydration, sleep) / **Cycle & body**, each row with current value + mini sparkline + an **Add** action. Tapping opens a **detail** with: working **time-range** pills (1W/1M/3M/6M/1Y/All) that actually slice the data, a line chart with a **dashed goal line** (and optional cycle-phase background shading), a **Start/Latest/Goal** stat row + status sentence, a **Δ-over-time table** (7/30/90d/all), **+ Add entry** (manual), set/edit goal, history (edit/delete), and a favourite ★.
> - **Cycle & body:** cycle length, period flow, a BBT chart and symptom-frequency — framed "read for nutrition, not a period tracker."
> - **Insights:** auto-generated, **evidence-graded (●●●/●●○/●○○), phase-aware, anti-shame** cards correlating nutrition × life-stage × patterns (e.g. "Protein +18 g/day vs last week," "Iron dips on heavier-flow days — front-load iron around your period," "Fibre goal hit 5/7 days," "Hydration +0.4 L vs last week," pregnancy "tracking within the healthy 2nd-trimester range"). Never weight-shaming.
> - **Milestones:** keep the existing streak + badges.
> Keep all data in localStorage/mock; respect **No-numbers mode** (hide values); keep "No weight or deficit streaks — ever."

*(Reference implementation lives in `reference-app/` — Progress now demonstrates this.)*
