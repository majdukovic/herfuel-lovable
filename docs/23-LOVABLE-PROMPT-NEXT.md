# 23 — Next Lovable prompt (core parity + women-led differentiators)

Context: the last four fixes are verified done (measurement detail + Add-entry, units convert, #418 gone, logging works). This prompt closes the last **core-tracker gaps vs Cal AI / Carb Manager** and adds the strongest **women-led learnings** (from `22-WOMENS-APPS-RESEARCH.md`). Main objective stays **calorie/macro tracking for women** — we are not a period tracker, and we never move the calorie target where the science doesn't support it.

---

> Two batches of additions to **HerFuel**. Keep everything that's working (the ＋ flows, Progress hub + measurement detail, Me, dark mode, modules, paywall). All data can stay in localStorage/mock.
>
> **A) Close the last core-tracker gaps (vs Cal AI & Carb Manager):**
> 1. **Restaurant / eating-out logging.** A log option for a restaurant or mixed plate with no database entry — describe it or photo it → a *mocked* AI estimate with editable items → the normal Confirm-and-Log step. (Cal AI's most-requested "Eating Out.")
> 2. **Recipe import by URL.** In Create-recipe, paste a recipe link → *mock-parse* it into title + ingredients + steps + estimated macros → user edits → save to My Recipes. (Carb Manager / market standard.)
> 3. **Grocery list from a meal plan.** "Add to shopping list" on a meal plan → an aggregated, checkable grocery list.
> 4. **Progress photos — optional & private, OFF by default.** A neutral, no-pressure photo log in Progress (never required; never a "before/after" frame).
>
> **B) Women-led differentiators (what makes us the women's tracker):**
> 5. **PCOS macro mode.** When PCOS is on, shift the **macro distribution** (not a calorie penalty): higher protein (~30% / 80–120 g), fibre 25–30 g, lower-GI carbs — with the **evidence cited**. This is a real differentiator vs MyFitnessPal.
> 6. **"Experiments" (from Waves).** Opt-in, time-boxed habit trials with a review — e.g. "Try +20 g protein at breakfast for 10 days," then show the effect. An anti-shame alternative to streaks; surface 2–3 suggested experiments tied to the user's gaps/stage.
> 7. **Cite the expert + source on guidance.** Every Insight / Today's-tip / coaching card shows the attributed expert (RD/MD) and a source link, like Circle's articles. Credibility is the moat.
> 8. **Recipe filters by phase / symptom / nutrient** (extend the existing category filter) — FitrWoman-style.
> 9. **Hormonal-contraception branch in the Cycle module.** If the user is on hormonal birth control, there are no natural phases — say so honestly and don't fake phase logic; keep the iron/comfort nutrition support without phase claims.
> 10. **ED-safe guardrails (non-negotiable).** A sensible **minimum-calorie floor**; **never restrict the target during pregnancy or breastfeeding**; an option to **hide the calorie ring entirely** (beyond no-numbers mode); and gentle ED screening/sign-posting in onboarding. **Keep refusing cycle-phase calorie bumps** — at most an optional, clearly-flagged note ("appetite often rises pre-menstrually — honor your hunger; your target hasn't changed"), never an automatic increase.
>
> Keep our honesty rules: move the calorie number only for perinatal (the established science), never for the cycle. Persist everything to localStorage.

*(Core-feature discrepancy basis: `17-FEATURE-GAP-ANALYSIS.md`. Women-led research: `22-WOMENS-APPS-RESEARCH.md`. Reference behaviour: `reference-app/`.)*
