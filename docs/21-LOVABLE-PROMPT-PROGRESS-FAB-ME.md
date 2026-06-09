# 21 — Lovable prompt: Progress redesign + ＋ fix + Me expansion

Paste the block below into Lovable. (Reference implementation of all of it is in `reference-app/` — Progress and Me now demonstrate it; `20-PROGRESS-REDESIGN.md` has the Progress detail.)

---

> Three improvements to **HerFuel**. Keep the design language, the honest target engine, evidence grades, Fuel Score and transparent paywall exactly as they are. All data can stay in localStorage/mock.
>
> **1) Fix the central ＋ (FAB).** Right now the fan opens but its actions (Search / Scan / Voice / Barcode / Saved) **open nothing**. Wire them: **Search** opens the same **Add food** sheet that "Add to {meal}" opens (search the mock food DB + "you usually log" recommendations → tap a food → the Confirm sheet with serving + meal + macros → Log). **Scan / Voice / Barcode** open a *mocked* recognition draft (a canned item + editable ingredient lines + a "~80% confident, tap to fix" cue) that flows into the same Confirm-and-Log step. **Saved** opens the saved-items list; tapping logs. Also make the ＋ icon morph to ✕ while open, and make sure nothing (e.g. a floating badge) overlaps the fan items or the "Log to {meal}" button. *(Also fix the React #418 hydration error on load.)*
>
> **2) Rebuild Progress into a women-first analytics hub.** Add 5 sub-tabs: **Trends · Measurements · Cycle & body · Insights · Milestones**.
> - **Trends (default):** headline cards — Weight (line chart with a dashed **goal line**, a **Start / Latest / Goal** row, a Δ and a plain-language status like "down 1.2 kg over this period"), Nutrition (avg calories + protein & fibre adherence), Activity & sleep. Tap a card → its detail.
> - **Measurements:** an extensible **library** grouped Body / Body composition / Health & metabolic (glucose, ketones, blood pressure) / Diet & macros / Micronutrients / Lifestyle (exercise, fasting, hydration, sleep) / **Cycle & body** — each row shows the current value + an Add action. Tapping opens a **detail**: working **time-range** pills (1W/1M/3M/6M/1Y/All) that actually slice the series, a line chart with a **dashed goal line** (optional cycle-phase background shading), a **Start/Latest/Goal** stat row + status sentence, a **Δ-over-time table** (7/30/90d/all), **+ Add entry** (manual), set/edit goal, history (edit/delete), favourite ★.
> - **Cycle & body:** cycle length, period flow, a BBT chart + symptom frequency, framed "we read this for nutrition — not a period-tracker rebuild."
> - **Insights** (the differentiator): auto-generated, **evidence-graded (●●●/●●○/●○○), phase-aware, anti-shame** cards correlating nutrition × life-stage × patterns — e.g. "Protein +18 g/day vs last week," "Iron dips on your heavier-flow days — front-load iron around your period," "Fibre goal hit 5/7 days," "Hydration +0.4 L vs last week," and for pregnancy "tracking within the healthy second-trimester range." Never weight-shaming.
> - **Milestones:** keep the existing DE-safe streak + badges.
> - Respect **No-numbers mode** (hide values) and keep "No weight or deficit streaks — ever."
>
> **3) Expand "Me / Profile & Settings" to be genuinely tailored & flexible.** Build out these (entry rows that open real sub-screens):
> - **Profile** — name, sex, age, height, weight, activity level; "Recalculate my targets."
> - **Goals & targets** — calorie target mode (lose / maintain / gain / "let HerFuel decide"), macro split, and editable **daily targets** (water, steps, protein, fibre). When a life-stage module is on, these are set honestly for the stage.
> - **Dietary preferences & allergies** — multi-select chips (vegetarian, vegan, pescatarian, gluten-free, dairy-free, nut-free, halal, kosher, low-FODMAP, no pork/shellfish) that actually **filter recipes & suggestions** and flag foods to avoid.
> - **Units** — Calories ↔ kilojoules and US ↔ metric, and **actually convert the displayed values** (not just labels).
> - **Appearance & accessibility** — **Theme: Light / Dark / System (implement real dark mode)**, **Reduce motion**, larger text, plus No-numbers mode.
> - **Reminders** — meal/log/water/weigh-in nudges with times.
> - **Connected apps** — connect/disconnect Apple Health, Oura, Whoop, Garmin, scales; connecting fills the relevant Progress measures + cycle data.
> - **Data & privacy** — export my data, what syncs to the cloud, "reproductive & cycle data stays on-device," hard-delete; lead with the privacy promise.
> - Keep the configurable **Quick-add (＋)** picker, life-stage modules, plan/subscription, support (help, request a feature, rate, terms), and account (log out, delete).
> Persist all of this to localStorage so settings survive reloads.

*(Reference behaviour: `reference-app/` Progress = the 5-tab hub with goal lines + Insights; Me = profile, goals & daily targets, dietary preferences, units, appearance with working dark mode + reduce-motion, data & privacy.)*
