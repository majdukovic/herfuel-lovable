# PRD v0.2 — HerFuel · women's life-stage nutrition (working name; was "CycleFuel")

**Date:** 2026-06-09 · **Status:** Reframed draft — supersedes `02-PRD-v0.1.md` (cycle-first) · **Author:** Mate
**Companion:** `00`(evidence) · `14`(positioning reassessment — the data behind this pivot) · `13`(backlog) · `06`–`12`(competitive)

> **What changed from v0.1 and why.** v0.1 was *cycle-first* — founder intuition. A clinical, data-driven reassessment (`14`) showed the menstrual cycle is the **weakest** candidate wedge (weak evidence; the per-phase-calorie feature women ask for is *refuted*), while **perinatal (pregnancy → postpartum/breastfeeding)** has the **loudest demand, strongest evidence, highest pain, cleanest math, and the biggest market gap**. So we lead with perinatal and build the **full hormonal-journey platform**. Cycle stays — as a *stage*, not the headline.

---

## 1. Problem statement
A woman's nutrition needs change profoundly across her hormonal life — pregnancy, postpartum/breastfeeding, the menstrual cycle, PCOS, perimenopause — yet **every mainstream tracker treats her like a static 25-year-old man.** They give one flat target all month and all life; they *shame pregnant and postpartum bodies* ("you're almost overweight"); they ignore the cycle; PCOS apps have weak logging; breastfeeding apps track the **baby, not the mother**. No product follows a woman through her whole journey with real food logging and stage-true science. Result: an enormous, underserved, high-intent market hiding in plain sight (it's the loudest unmet demand even inside competitors' own feature boards — `12`).

## 2. The core idea (the wedge + the platform)
**One nutrition app that adapts to where a woman's body actually is — starting with the most underserved, highest-stakes moment, and following her for life.**

> **Product definition (the Carb Manager model — refined 2026-06-09).** HerFuel is a **best-in-class *general* nutrition/macro tracker** that *any* woman can use to log food, hit macros and see trends — **plus *optional* life-stage modules** (cycle, pregnancy, breastfeeding, PCOS, perimenopause) and the integrations women want. The modules **adapt her targets/coaching/nutrients when she wants them, and stay out of the way when she doesn't.**
> *Exactly how Carb Manager works:* a general tracker **specialized** for keto/blood-sugar (net carbs, ketones, insulin logging, Keto-Mojo/Biosense) — yet fully usable by anyone who ignores all of that. **HerFuel's specialization is women's bodies/life-stages instead of keto.**
> - **Usable as a plain, excellent tracker** — no forced life-stage declaration, no mandatory cycle engagement. The women's layer is **additive, not a gate.**
> - **Compete in the nutrition-tracker category** (MFP/Cal AI/MacroFactor), *not* femtech. Reach **parity** on fast logging (`16` parity baseline); **do NOT try to out-track them** on food-DB size or AI gimmicks. **Win on "the tracker that's actually built for my body" + honesty + anti-shame** (MFP shames pregnant bodies; Cal AI ignores them).
> - **Tracker = reason to *stay*; the women's-body specialization = reason to *switch* + the marketing spearhead** (Carb Manager markets "keto" hard, yet anyone can use it).
> - **Adoption grows with her:** she may start as a general tracker user → switch on the **cycle** module when curious, or the **pregnancy** module when she conceives — or never. **Perinatal stays the flagship module + loudest acquisition door (`14`), but it's one door among several, not a gate.**
> - **Build order:** great tracker core + parity baseline **first**; ship life-stage features as **toggleable modules/packs** (perinatal in the MVP). A great tracker with no women's layer = me-too; a women's layer with no great tracker = FitrWoman (niche). Both — foundation first.

- **Acquisition wedge (MVP):** **perinatal — pregnancy → postpartum/breastfeeding.** Loudest demand (`12`), strongest evidence, highest emotional pain, cleanest implementation, biggest gap.
- **Retention architecture:** the **journey** — `cycle → trying-to-conceive → pregnancy → postpartum/breastfeeding → cycle → perimenopause`, with **PCOS** and **GLP-1** as cross-cutting modes. A woman *transitions* between stages inside the app instead of churning — which turns perinatal's one weakness (transient) into a strength.

```
   ENTER (loudest pain) ─┐
   pregnancy ─▶ postpartum/breastfeeding ─▶ cycle ─▶ (TTC) ─▶ pregnancy … ─▶ perimenopause
                         └─ cross-cutting: PCOS · GLP-1 ─┘
```

## 3. The honesty principle (the brand's spine — sharpened by the reframe)
> **We move your calorie/macro targets only when your body's needs *really* change — and we tell you when they don't.**

- **Pregnancy / breastfeeding / perimenopause:** targets **do** adapt, because the science is established — pregnancy **+340 kcal (T2) / +452 (T3)**; breastfeeding **+330–500 kcal, +15–19g protein, +210g carbs**; perimenopause **protein 1.0–1.6 g/kg** for muscle. These are real, defensible, and exactly the adaptive targets women ask for.
- **Menstrual cycle:** the target **does NOT** change on a metabolic basis — the "luteal +5–10%" claim is **refuted** (`00`). We adjust *coaching, micronutrients, satiety, and cravings support*, and we **explain why** we won't fake a number.
- **Every suggestion is evidence-graded** (Strong / Supported / Worth-a-try). No medical claims, ever.

This is the moat: *the only women's nutrition app honest enough to move the number when the science is real and refuse when it isn't.*

## 4. Target user
**MVP acquisition:** US women who are **pregnant or postpartum/breastfeeding** — the moment of highest motivation, pain, and willingness to pay, and where current apps fail hardest.
**Platform audience:** US women across the hormonal lifespan (~18–55) — cycling, TTC, pregnant, postpartum, PCOS, perimenopausal. (Personas `03` to be updated: lead persona becomes "new/expecting mom," with the cycling-woman persona retained as a journey stage.)

## 5. Positioning & safety (non-negotiable)
- **Default UI leads with what her body needs *at this stage*, and how she feels** — not a calorie number.
- **No-numbers mode**; numbers accurate and one tap away, never the headline.
- **No shame, ever** — especially around pregnant/postpartum bodies (the exact failure women report `12`). No "overweight" labels in perinatal; no aggressive deficits; **breastfeeding never nudged into a deficit before ~6–8 weeks** (evidence-based safety rule).
- **DE safeguards:** sensitivity screening, non-weight goals, extreme-target guardrails, support resources. **[DECIDE: RD/clinician + perinatal-dietitian advisor review before launch — strongly recommended; now higher stakes given perinatal medical sensitivity.]**
- **Privacy-as-feature:** reproductive + pregnancy data is maximally sensitive (post-Roe). Data minimization, encryption, no selling. A deliberate contrast to Flo's data-sharing record (`08`,`11`).

## 6. MVP feature scope (re-prioritized; full detail in `13`)
> **Build-first:** the **life-stage engine** (state → honest adaptive targets + coaching) for **pregnancy + breastfeeding + cycle**, sitting on a **fast-logging** core. That combination *is* the wedge.

### P0 — Must have
1. **Onboarding** — "where are you right now?" life-stage selection (cycling / TTC / pregnant+trimester / postpartum+breastfeeding) + the "we won't shame your changing body" hook; goals incl. non-weight; DE/sensitivity screen.
2. **Life-stage engine** — state-aware **adaptive targets** (the honest ones, §3) + state-aware evidence-graded **coaching**; editable; switchable as she transitions.
3. **Fast food logging** — photo/AI-draft→confirm, **copy-meal** (the #1 competitor request, 6,104 votes `12`), voice/NL, search (USDA+branded), barcode, recents/favorites.
4. **Nutrition data** — calories, macros, and the **micros that matter per stage** (protein, iron, folate, calcium, DHA/omega-3, choline, fiber, hydration) from USDA + branded.
5. **Stage-aware coaching surface** — daily card: e.g., breastfeeding "your body needs +400 kcal to make milk — real science, not a cheat."
6. **Wellbeing/symptom logging** — stage-appropriate (nausea/energy in pregnancy; supply/mood/sleep postpartum; cravings/cramps in cycle).
7. **Journey view** — her current stage + path; "what changes next stage."
8. **Apple Health (read/write)** — nutrition + read cycle/pregnancy data where present.
9. **No-numbers mode + dashboard** leading with stage/feel.
10. **Hard paywall + 7-day trial + transparent billing** (RevenueCat).

### P1 — Strong next
- Symptom↔food↔stage insights & correlations · phase-tagged & stage-tagged recipes + grocery lists (decision-fatigue relief) · **PCOS mode** (high WTP, persistent retention) · wearable read (Oura/Whoop) · weight-trend/projection · data export + share-with-RD · **optional** (default-off) gamification · gentle reminders · cycle nutrient depth (net carbs, etc.).

### P2 — Later
- **Perimenopause/menopause** stage · **GLP-1 companion** mode · TTC/fertility-nutrition stage · community (opt-in, privacy-aware) · AI coach (claims-controlled) · more wearables/Apple Watch/widgets · night-shift scheduling.

## 7. Key flows (to prototype — see mockup v3)
1. **Onboarding → first honest target:** select "breastfeeding" → see an adaptive, *explained* target (+400 kcal, "real science") in <60s. The "finally, an app that gets my body" moment.
2. **Fast first log:** scan/voice/copy → AI draft → confirm in <90s.
3. **Stage transition:** "I had my baby" / "my period's back" → the app re-scopes targets & coaching to the new stage (the retention magic).

## 8. Architecture & data (high level)
- **Nutrition DB:** USDA FoodData Central (CC0, micros) + Nutritionix (branded/barcode) + Open Food Facts fallback (verify ODbL). Validated stack (`06`).
- **Life-stage engine:** deterministic, **evidence-sourced** target-adjustment rules per stage (each adjustment cites its source + grade) → never a black box; honesty rule §3 baked in.
- **AI layer:** NL/voice/photo → DB query → user confirms. **AI proposes, DB disposes.**
- **Coaching engine:** curated, evidence-graded rule library per stage (not free-text LLM) for claims control — *especially* important in perinatal. **[DECIDE: curated vs LLM — lean curated.]**
- **Privacy:** minimization, encryption, no-sell; explicit selling point.
- **Platform: [DECIDE]** iOS-first recommended.

## 9. Open decisions **[DECIDE]**
1. **Name** — "CycleFuel" now mis-scopes a whole-journey product; pick a life-stage/journey name (don't lock yet).
2. **Acquisition entry depth** — pregnancy AND breastfeeding at launch, or breastfeeding first (loudest single signal)?
3. **Perinatal clinical advisor** — engage a perinatal RD before launch (strongly recommended; safety-critical).
4. Platform (iOS-first) · 5. Curated vs LLM coaching · 6. Pricing point (perinatal/PCOS show high WTP — Cysterhood $17–28/mo) · 7. How "cycle" stage handles hormonal-contraception users.

## 10. Success metrics
**North star:** weekly *consistent* loggers (≥4 days/wk). Activation: % seeing an honest adaptive target in onboarding <60s; first-log <90s. Retention: D30/W4 logging; **stage-transition retention** (do users who change life-stage stay?). Wedge: % "feels like it understands my body." Monetization: trial→paid (benchmark ~40%). Safety: zero perinatal deficit nudges; no extreme-target setting.

## 11. Risks & mitigations
| Risk | Sev | Mitigation |
|---|---|---|
| Perinatal users churn (transient stage) | High | The journey architecture (retain across transitions); validate transition retention early |
| Perinatal safety / wrong calorie advice | **High** | Evidence-sourced targets, perinatal-RD review, conservative defaults, no pre-8wk deficit |
| Reframe wrong (interviews disagree) | Med | Cheap to test: interviews (`04`) now ask "your most painful nutrition life-stage?" before build |
| Logging friction not beaten | High | Prototype logging first; measure time-to-log; copy-meal P0 |
| Overclaiming science | High | Evidence grading; the honesty principle §3; no medical claims |
| Privacy backlash (pregnancy data) | Med | Minimization, encryption, privacy-as-feature |

## 12. Phased roadmap
- **Phase 0 — Validate (now):** interviews (perinatal + cross-stage), landing test, name, perinatal-RD advisor, licensing.
- **Phase 1 — MVP:** life-stage engine (pregnancy/breastfeeding/cycle) + fast logging + honest adaptive targets + Apple Health, iOS.
- **Phase 2:** PCOS mode, insights/correlations, recipes+grocery, wearables, export.
- **Phase 3:** perimenopause, GLP-1 mode, TTC, community, AI coach.

---
*v0.2 reframes around the data (`14`). v0.1 retained for history. Every section open for iteration.*
