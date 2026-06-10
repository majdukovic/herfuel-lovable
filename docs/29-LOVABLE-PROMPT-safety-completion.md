# 29 — Lovable prompt: safety completion (pregnancy-deficit guard, birth-control branch, progress photos)

QA on 2026-06-10 confirmed most of the safety set is **already shipped**: expert attribution (Today's tips + Progress→Insights cite Dr. Stacy Sims / Dr. Hazel Wallace / Dr. Megan Rossi with sources), the **ED-safe onboarding check-in** ("Your wellbeing first" → "Soften the experience" hides the calorie ring), and the **1,200-kcal safety floor + ED-safe controls in Goals & targets** ("Calories can't go below your safety floor of 1200 kcal", "Hide the calorie ring", honest mode: "pregnancy adds, not subtracts"). This prompt closes what's left, in line with principle #2 (anti-shame / ED-safe) and #1 (honesty).

Paste everything between the lines into Lovable.

---

> Finish HerFuel's safety layer. Keep all existing copy conventions: neutral, non-judgmental, evidence-graded where guidance is given. The 1,200-kcal floor and ED-safe controls in Goals & targets already exist — don't rebuild them.
>
> **1) Make the pregnancy/breastfeeding deficit guard explicit and total.** Today the honest mode says "pregnancy adds, not subtracts" — verify and harden it: while the Pregnancy or Breastfeeding module is ON, selecting the **Lose** target mode must be impossible, not just discouraged. Replace the Lose option in that state with disabled styling + this copy: *"During pregnancy and breastfeeding we don't support a calorie deficit. Your target includes what your body needs right now. If your clinician has advised weight management, follow their plan."* The guard applies everywhere a target can change: onboarding, Goals & targets, module toggles, manual calorie edits (manual edits clamp to the module's honest minimum, i.e. baseline + the evidence-based addition), and the fasting timer (already cautioned).
>
> **2) Onboarding follow-through for the wellbeing check-in.** The "Your wellbeing first" screen exists. Strengthen the soften path: if a user picks **"Soften the experience"**, also (a) default streaks to check-in counting only (already our rule), (b) skip any goal-weight question in the remaining onboarding (don't ask, don't store), and (c) add a final reassurance line on the trial screen: *"You can change any of this in Me → Experience, any time."* If the user picks the standard path, nothing changes.
>
> **3) Birth-control branch in the Cycle module.** In the Cycle module settings, add the question: **"Do you use hormonal contraception?"** (options: "No", "Yes — pill / IUD / implant / ring / shot", "Prefer not to say"). If **yes**:
> - Show the honest explanation: *"Hormonal contraception suppresses the natural cycle, so phase-based patterns (and phase predictions) don't apply to your body right now. We'll keep tracking what's real for you."* Evidence grade ●●● Strong.
> - **Hide/disable phase predictions and phase-based tips** (no "luteal/follicular" guidance, no phase carousel on Today).
> - **Keep** what still applies: period/bleed logging if the method allows bleeds (or note that some methods stop bleeding entirely — that's normal), iron support tips around any bleeding days, symptom + mood logging, and comfort guidance.
> - Never imply hormonal contraception is good or bad — zero judgment, it's a fact about which features make sense.
> - "Prefer not to say" behaves like "No" but adds a small note that predictions assume a natural cycle.
>
> **4) Progress photos — optional, private, off by default.** In Progress → Measurements, add a "Photos" section that is **collapsed and OFF until explicitly enabled**, with the enable copy: *"Photos are for you only. Stored on your device, never uploaded, never used to judge anything. Some people find them helpful; others don't — both are fine."* When enabled: capture/upload, store **locally only** (IndexedDB/localStorage, not Supabase), grid by date, compare two dates side-by-side, no overlays/scores/AI commentary on bodies, easy delete (single + all). Add it to Privacy & data hard-delete scope. If No-numbers/softened mode is on, do NOT suggest photos anywhere — the section stays available but unadvertised.
>
> **Polish (small, same prompt):**
> - Open Food Facts results with an empty `product_name` currently render as "Unknown" — fall back to `brands` + category (e.g. "Podravka · juha") and only then "Unnamed product".
> - On the food search results, make sure the Log button is never covered by overlays at 402×874 (bottom sheet safe-area padding).
>
> Don't touch: the honest module targets, evidence grades, attribution format, streak rules, the foods schema.

---

**Why this shape:** the explicit pregnancy-deficit guard is the first "honesty/safety" claim the perinatal RD will check; the BC branch is the honest answer to the biggest cycle-tracking objection (a large share of target users are on hormonal contraception — we say so instead of pretending phases apply); photos done privacy-first is differentiation vs. Cal AI-style body-grading. After this ships, the safety story is complete for Croatian concept-validation interviews.

**QA hooks (regression suite):** spec 01 already hard-asserts the check-in + soften path + 1,200 floor copy; spec 06 has a `[soft]` step for the BC branch that flips to a hard pass once this ships; a pregnancy-deficit-guard step will be added to spec 06 after deploy.
