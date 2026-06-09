# Insights/Graphs, Integrations & the "Parity" baseline

**Date:** 2026-06-09 · **Status:** Draft v0.1 · **Companion:** `13`(backlog), `02-PRD-v0.2`, `12`(Cal AI), `06`(stack).
**Origin:** founder's three points — (1) graphs/history/weight trends, (2) device integrations (what to import + how), (3) **the insight that "not requested" ≠ "not needed."**

---

## 1. The methodology fix (point 3) — this is important
**A feature can be absent from a feature-request board for two opposite reasons:**
- **Unmet demand** → people are asking (cycle/breastfeeding, wearable sync, copy-meal). *Loud = differentiation opportunity.*
- **Already satisfied** → nobody asks because it **already exists and works** (water tracking, intermittent fasting, create/save foods, recents, barcode). *Silent = table-stakes that are simply expected.*

Reading request volume alone (as `12` did) has a **satisfaction blind spot**: it surfaces gaps, but it *hides* the baseline every tracker must have or users bounce on day one. **You're exactly right** — we must treat these as a distinct, mandatory tier, not skip them because they're "low demand."

> **Rule going forward:** the MVP must ship **(a) the differentiators** (loud demand: life-stage adaptation, honest targets, cycle) **+ (b) the full parity baseline** (silent table-stakes). Missing (b) makes the best (a) feel broken.

### The Parity baseline (must-have, low/no request volume because they're expected)
Water tracking · intermittent-fasting timer/window · create custom foods · save foods & meals · recents/favorites · barcode scan · edit/delete any entry · multiple serving units (g/oz/cups) · meal sections (B/L/D/snack) · copy/repeat day · weight log · history calendar · streak/consistency · adjustable goals · units (metric/imperial) · reminders. *(Cal AI/MFP/MacroFactor all have these → they're the floor.)*

---

## 2. Graphs / history / trends (point 1)
**Table-stakes graphs (parity):** weight trend; daily/weekly/monthly calorie & macro averages; logging consistency/streak; history calendar; body measurements; progress photos. *(Some even show up as Cal AI requests — "calorie history further back," "weekly averages," "forecast weight loss" — so users want them deeper, not just present.)*

**The differentiated graphs (our wedge — nobody does these):** every trend **graphed against life-stage / cycle**, e.g.:
- **Weight** against the *right context* — postpartum at a supply-safe pace; pregnancy vs a healthy-gain range; perimenopause with muscle-protection framing. (Not a generic "lose weight" line.)
- **Micronutrient over time** — iron across the cycle; protein across postpartum weeks; calcium in luteal.
- **Symptom ↔ food ↔ stage correlations** (already P1) — "protein dipped on low-supply days."
- **Logging consistency** as the hero metric (our north star), framed "showing up, not perfection."

*In the mockup:* the new **Insights** screen (Today → "📈 See your trends") shows weight (sparkline), logging consistency (14-day), and protein-vs-target (bars) — all stage-framed.

---

## 3. Integrations — what we import & how we use it (point 2)
**Architecture (recommended hybrid):** **Apple Health / Health Connect as the primary hub** (aggregates many devices + is where iOS stores cycle/pregnancy data) **+ a few direct OAuth integrations** (Oura, Whoop) for the rich data the health stores don't expose well. *(MacroFactor's "Won't Do" stance is hub-only — leaner, but Oura/Whoop are among the loudest Cal AI requests `12`, so direct sync is a real differentiator. Decide per cost/effort.)*

| Source | We IMPORT | How HerFuel USES it |
|---|---|---|
| **Apple Health / Health Connect** *(hub, P0)* | weight, steps, active energy, workouts, sleep, **+ period/cycle & pregnancy data** | Auto weight trend; cut manual entry; **detect cycle phase** from data the user already has (the gap `06` §4 — leaders ignore it); write our nutrition/water/weight **back** |
| **Oura** *(P1)* | sleep, readiness, HRV, **body temperature** | Sharper phase detection (temp-based); recovery-aware coaching ("sleep dipped this luteal week"); perimenopause/postpartum recovery context |
| **Whoop** *(P1)* | strain, recovery, sleep | Activity/recovery **context & insight only** — *not* an auto calorie bump (see guardrail) |
| **Garmin** *(P2)* | activity, steps, sleep, stress (+ Garmin cycle) | Activity context, steps |
| **Smart scales (Withings/Renpho)** *(P2)* | weight, **body-fat %** | Automatic weight/body-comp trend, no manual entry |

**Honesty guardrail (consistent with `02` §3 + MacroFactor's stance):** wearable "calories burned" is fuzzy and double-counts easily. **We do NOT auto-inflate the calorie target from it.** The target moves on **life-stage** (real science); wearable data powers *context, insight, and friction reduction* — never a secret bump. (MacroFactor publicly refuses "add active calories"; we adopt the same principled line — and say so.)

**The three jobs integrations do for us:** (1) **reduce manual logging** (weight, workouts), (2) **enrich stage coaching/insight** (sleep/HRV/temp by stage), (3) **auto-detect phase** (cycle from Apple Health/Oura temp). All three serve the wedge.

*In the mockup:* **Me → Connected apps & devices** shows each source, what it imports, and the "why we don't auto-add calories burned" note.

---

## 4. Backlog impact
Add a **Parity baseline** tier to `13` (must-have, even at zero request volume). Promote **graphs/trends** and **Apple Health hub (incl. cycle import)** firmly into P0; **Oura/Whoop direct** into P1 (loud demand). Keep the **no-auto-calorie-bump** guardrail in the Won't-build list.
