# Positioning Reassessment — let the data pick the wedge

**Date:** 2026-06-09 · **Status:** Draft for decision · **Trigger:** founder asked to drop the "cycle-first" assumption and let demand + evidence define scope.
**Inputs:** Cal AI ~300-request board (`12`, largest women-skewed VoC set) + a fresh evidence/market pass on every female life-stage (this doc) + `00`(cycle evidence) + `08`/`11`(market).

> **Bottom line up front:** The original *insight* was right — **women's nutrition needs change with hormonal state, and no app serves that.** But the *entry point* (menstrual cycle) is, on the data, the **weakest** of the candidate wedges on evidence and implementation. The loudest demand + strongest science + highest emotional pain sit in **perinatal (pregnancy + breastfeeding)**. The missing product is bigger than cycle: **a nutrition tracker that follows a woman through every hormonal life-stage.**

---

## 1. The scoring (data-driven, not intuition)
Scored H/M/L on the dimensions that actually determine a wedge's strength.

| Wedge | Demand (VoC) | Evidence | Emotional pain | Implementation cleanliness | Retention / LTV | Market gap | Verdict |
|---|---|---|---|---|---|---|---|
| **Breastfeeding / postpartum** | **H** (CalAI ~25×, loudest) | **H** clinically established (+330–500 kcal; +15–19g protein; +210g carbs) | **H** (body shame, supply anxiety) | **H** real, defensible math | **L–M** transient (~1–2 yr) | **H** — apps track *baby*, not *mother* | ★ Strongest acquisition wedge |
| **Pregnancy** | **H** (CalAI ~15×, 168-comment thread) | **H** (+340 kcal T2, +452 T3; folate/iron/iodine) | **H** (apps shame/scare pregnant bodies) | **H** clean | **L** transient (9 mo) | **H** — preg apps treat nutrition as secondary; market $300M→$1B by 2032 | ★ Strong, pairs with breastfeeding |
| **PCOS** | **H** (high-intent community) | **M** (low-GI well-studied; DASH best for IR; weight effects mixed) | **H** (underserved, frustrated) | **M** | **H** persistent (years) | **M** — Cysterhood **$17–28/mo** (proven WTP), weak logging | ★ Best retention + proven willingness-to-pay |
| **Perimenopause / menopause** | **M** (growing; "over-40" trend) | **M–H** (protein 1.0–1.6 g/kg → lean mass; muscle −2.5/−5.7%) | **H** | **M–H** | **H** persistent (decades) | **M** — emerging (Nutrola etc.) | Strong future stage |
| **Menstrual cycle** | **M** (fewer than BF/preg) | **L** (only iron + luteal appetite strong; per-phase calories **refuted**, `00`) | **M** | **L** (the requested feature is unsupported — must finesse) | **H** persistent | **M** (cycle apps own tracking, not nutrition) | Weakest *standalone* wedge; best *connective tissue* |
| *GLP-1 (cross-cutting)* | **H**, #1 health trend 2026 | emerging | **M** | **H** (protein/muscle/micros focus) | variable | **H** new | Tailwind to layer across stages |

**The uncomfortable finding:** cycle — the founding intuition — scores **lowest on evidence and implementation** and only **medium on demand**. Perinatal scores highest on demand × evidence × pain × cleanliness; PCOS/perimenopause win on retention.

## 2. What the evidence actually says (the part `00` never graded)
- **Breastfeeding:** +330–500 kcal/day is **real physiology** (Nat. Academy of Sciences), +15–19g protein, +210g carbs, wait 6–8 wks before any deficit. *This is exactly the "adjust my calories for my body state" women beg for in Cal AI — and unlike the luteal bump, it's evidence-true.*
- **Pregnancy:** +340 (T2)/+452 (T3) kcal, trimester-specific micros (folate, iron, iodine). Established.
- **PCOS:** low-GI is among the most-researched PCOS diets (improves insulin, cravings); DASH best for insulin resistance — solid-but-nuanced.
- **Perimenopause:** protein 1.0–1.6 g/kg/day protects lean mass through measurable menopausal muscle loss. Good evidence.
- **Cycle:** unchanged from `00` — weak except iron (strong) and luteal appetite (moderate).
- **Macro tailwinds:** **GLP-1 is the #1 nutrition trend of 2026** (users want protein/fiber/micros) and **"Her Health" / sex-specific nutrition** is a named trend — most nutrition science came from male cohorts; female lifecycle needs are under-served by design. The whole category is moving our way.

## 3. The product that's actually missing
Not "cycle-syncing nutrition." It's **"one nutrition app that follows a woman through her whole hormonal journey"**:

```
 cycle ─▶ trying-to-conceive ─▶ pregnancy ─▶ postpartum/breastfeeding ─▶ cycle again ─▶ perimenopause ─▶ menopause
   └──────────────────── cross-cutting modes: PCOS · GLP-1 ────────────────────┘
```

No one does this. General trackers (MFP, Cal AI, Yazio) are stage-blind and **actively shame** pregnant/postpartum bodies. Cycle apps (Flo/Clue) don't do nutrition. Pregnancy/breastfeeding apps track the **baby**, not the mother. PCOS apps are community-led with weak logging. **The journey is the white space** — and it dissolves the one weakness of any single life-stage (churn): a woman doesn't age out, she **transitions to the next stage inside the same app.**

## 4. The real decision: the MVP entry point
The north-star (the journey platform) is clear. The open question is **which stage to lead acquisition with**, and the data offers three honest strategies:

- **A — Perinatal-led (pregnancy + breastfeeding), retain via the journey.** *Data's pick.* Loudest demand, strongest evidence, cleanest math, highest pain, biggest gap. Cycle becomes a *retention* stage, not the hook. Risk: perinatal users are transient → the journey architecture must catch them.
- **B — Persistent-state-led (PCOS or perimenopause).** Best retention/LTV, proven willingness-to-pay (Cysterhood $17–28/mo), decent evidence. Narrower acquisition; needs medical sensitivity.
- **C — Keep cycle as the lead.** Largest addressable population + persistent + the connective tissue. But weakest evidence and the messiest "demand-vs-evidence" gap to honestly manage.

> My recommendation: **A as the acquisition wedge, architected as the full journey** — lead with the moment of highest demand/pain/evidence (pregnancy→postpartum), then retain by following her into cycle/PCOS/perimenopause. This captures the loudest demand *and* fixes perinatal's churn weakness *and* stays evidence-honest. Cycle stays in the product — as a stage, not the headline.

## 5. Implications if we reframe
- **Name:** "CycleFuel" under-scoped a whole-journey product. **Resolved → HerFuel** (drop *Cycle*, keep *Fuel*, broaden to *Her*; see `15-NAME-AND-ASO.md`).
- **PRD (`02`):** unlock the "menstrual cycle first" decision; re-scope around the chosen entry wedge + journey architecture; re-prioritize `13` (perinatal P0/P1 if we pick A).
- **Mockup:** a v3 to show the chosen entry stage's logging + state-aware targets (e.g., a breastfeeding mom getting an honest +400 kcal and supply-safe guidance — *with real science behind the number*).
- **Evidence honesty still rules:** the win is we now LEAD with stages where the calorie/macro math is *real* (perinatal/perimenopause), and treat cycle's weak claims with the same honesty guardrail (`02` §4).

## 6. Honest caveats
- Demand counts are from Cal AI's board (large, women-skewed, but one app's users — directionally strong, not a census).
- Perinatal evidence is strong on *needs* but trials are limited on *outcomes* (compliance/duration) — coach needs, don't over-promise.
- Transient retention for perinatal is a real risk; the journey thesis is the mitigation but must be validated.
- **This is a reversible, pre-build reframe.** The cheapest way to settle A vs B vs C is the **user interviews** (`04`) — now with a sharper question: *"which life-stage is your most painful nutrition moment?"*
