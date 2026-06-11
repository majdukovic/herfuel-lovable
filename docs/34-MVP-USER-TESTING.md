# 34 — MVP user testing: plan, outreach, questionnaire, decision framework

**Date:** 2026-06-11 · For the first real-tester wave (Croatian women) on the live app: **https://sweet-link-system.lovable.app**
Companion docs: `28` (product state), `32` (Meals gaps), `33` (Croatian localization — fully shipped).

**Pre-launch checklist (don't send invites until all ✅):**
- [ ] Accounts + sync shipped and verified (assumed in-flight per current plan — testers must not lose data to a cleared browser)
- [ ] Lovable prompt 31 (Strava first-sync backfill) pasted and verified, or the Strava task marked "optional, may show 0 activities"
- [ ] One full self-run of the test script below on a real phone (Safari + Chrome)
- [ ] Google Form built from Section 4 and tested end-to-end on mobile

---

## 1. Testing goals — the riskiest assumptions, ranked

We are NOT testing "do they like it." We are testing five specific assumptions, ranked by how dead the product is if they're false:

| # | Assumption (riskiest first) | Confirm signal | Kill signal |
|---|---|---|---|
| **A1** | **Women will actually log food for several days** (the core loop has a pulse) | ≥50% of active testers self-report logging **3+ days** (Q4), corroborated by Supabase data once accounts land | Most testers log 0–1 days; Q8 verbatims describe logging as a chore |
| **A2** | **Honesty-first / no-shame positioning is felt and wanted**, not just a founder belief | ≥50% answer "yes, clearly" on Q7 AND the Q6 benefit verbatims spontaneously use words like *iskreno / bez pritiska / ne osuđuje* | Testers don't notice any difference vs MyFitnessPal-style apps, or notice it and shrug ("I *want* a strict app") |
| **A3** | **Life-stage tailoring is valued, not noise** | Module-browse task completed; Q6/Q7 verbatims reference cycle/pregnancy/PCOS content; nobody calls it "extra clutter" in Q9 | Modules ignored or described as gimmicky; benefit verbatims are all generic-tracker benefits |
| **A4** | **Croatian quality is good enough to feel native** | Zero language complaints in Q9; nobody switches to English mid-test; food searches for Croatian brands succeed | Verbatims flag awkward phrasing, mixed-language screens, or "I switched to English" |
| **A5** | **Women trust the app with cycle data** | Cycle fields completed during onboarding; no privacy hesitation in Q9; Q12 referrals include cycle-tracking friends | Onboarding cycle questions skipped; Q9 verbatims mention "didn't want to enter that" / "where does this data go?" |

A1 outranks everything: PMF questions are meaningless from someone who opened the app once. A2 is the bet the whole brand is built on. A5 is the quiet killer — it won't show up as a complaint, only as skipped fields, so check the data, not just the form.

---

## 2. Test design

**Cohort: invite 12–15, plan for 8–12 completions.**
Why: at this size every completed questionnaire is 8–12% of your sample — enough for *directional* PMF reads and, more importantly, enough qualitative volume to hit friction saturation (the usability-research rule of thumb that a handful of users surface most recurring problems). It's also small enough that Mate can personally follow up with every single tester — which at MVP stage is worth more than the survey itself. Recruit across life stages if possible: aim for at least 2 testers with an active module (cycle/pregnancy/PCOS/perimenopause) and at least 2 "plain tracker" users, so A3 gets a real read.

**Duration: 7 days of natural use.** One week covers a weekend (the logging-discipline killer), gives the 3-day retention signal time to be true or false, and is short enough that the favour feels finite. Send the questionnaire on day 7, with a reminder on day 9.

**What testers DO — 3 tasks + 1 optional (sent in the outreach message):**

| Task | What | Which assumption it tests |
|---|---|---|
| 1 | **Complete onboarding honestly** — real goals, real life stage, in Croatian | A2 (do the honest targets land?), A5 (cycle data trust), A4 |
| 2 | **Log one full real day of food** — everything you actually ate, including **one barcode scan** of something from your kitchen | A1 (core loop), A4 (Croatian food DB: Vegeta/Čokolino/Podravka), food-DB trust |
| 3 | **Open your life-stage module and read one tip** — notice the evidence dots (●●● / ●●○ / ●○○) | A2 + A3 (is graded, honest advice felt as different?) |
| 4 *(optional)* | Connect Strava if you use it, or try switching language in Ja → Izgled | Integration appetite; A4 |

Beyond the tasks: "use it as much or as little as you naturally would" — natural usage across the week is itself the A1 measurement. Do not nag mid-week; a nagged log is a false positive.

**Why tasks beat "play around":** unstructured testers do a 2-minute scroll, never reach the core loop (logging a real day), and then answer the questionnaire about the *home screen*. Tasks guarantee every respondent has touched the surfaces the questionnaire asks about, which makes answers comparable across testers — and the *gap* between assigned tasks and what they did voluntarily is itself the retention signal.

**Practical notes:**
- Send invites **individually** (personal message, name used), never a group blast — completion rates and honesty both collapse in group asks.
- Tell testers the **"Edit with Lovable" badge** in the corner is test-version scaffolding; dismiss it (it's gone on the future custom domain).
- Ask testers to **create an account** (once shipped) so their data syncs and the self-reported Q4 can be checked against real Supabase data.
- Health articles: the in-app note already says some health content is English pending Croatian review — don't apologise for it again in the outreach; the app's own honesty about it is part of what's being tested.

---

## 3. Outreach message (ready to send)

### 🇭🇷 Croatian (primary — personalise the first line)

> Bok [ime]!
>
> Trebam te za nešto — tvoje iskreno mišljenje.
>
> Zadnjih par mjeseci gradim aplikaciju za praćenje prehrane napravljenu za žene — zove se **HerFuel**. Većina takvih aplikacija tretira sve korisnike isto i tjera te da se osjećaš loše kad "pogriješiš". HerFuel radi suprotno: **bez srama i bez izmišljenih brojki**. Kalorijski ciljevi se prilagođavaju samo tamo gdje znanost to stvarno podržava — ciklus, trudnoća, dojenje, PCOS, perimenopauza — i svaki savjet nosi oznaku koliko je znanstveno utemeljen. Cijela aplikacija je na hrvatskom i prepoznaje naše proizvode (Vegeta, Čokolino, Podravka…).
>
> Što bih te zamolio — ukupno cca **20 minuta kroz tjedan dana**:
> 1. Prođi početno postavljanje — **iskreno**, sa svojim stvarnim ciljevima.
> 2. Zabilježi **jedan cijeli stvarni dan** jela, uključujući barkod nečega iz svoje kuhinje.
> 3. Otvori svoj modul (ciklus, trudnoća, PCOS…) i pročitaj barem jedan savjet.
> 4. Ostatak tjedna koristi je koliko ti dođe prirodno — ili nimalo, i to mi je važan podatak!
>
> Na kraju tjedna poslat ću ti **kratki upitnik (5 minuta)** — i molim te, budi brutalno iskrena. Negativno mišljenje mi vrijedi više od pohvale.
>
> **Privatnost:** tvoji podaci su samo tvoji — ništa se ne prodaje i ne dijeli, a sve možeš obrisati jednim klikom u aplikaciji (Ja → Privatnost i podaci).
>
> Link: **https://sweet-link-system.lovable.app**
> Radi u pregledniku na mobitelu, ne instalira se ništa. Ako u kutu vidiš gumbić "Edit with Lovable" — slobodno ga zatvori, to je dio testne verzije.
>
> Hvala ti unaprijed 🙏
> Mate

### 🇬🇧 English (for any non-Croatian testers / reference)

> Hi [name]!
>
> I need something from you — your honest opinion.
>
> For the past few months I've been building a nutrition-tracking app made for women — it's called **HerFuel**. Most apps in this space treat every user the same and make you feel bad when you "slip". HerFuel does the opposite: **no shame, no made-up numbers**. Calorie targets shift only where the science actually supports it — cycle, pregnancy, breastfeeding, PCOS, perimenopause — and every tip carries a grade showing how strong the evidence is. It's fully localised in Croatian and knows local products (Vegeta, Čokolino, Podravka…).
>
> What I'd ask of you — about **20 minutes total over one week**:
> 1. Go through onboarding — **honestly**, with your real goals.
> 2. Log **one full real day** of food, including a barcode scan of something from your kitchen.
> 3. Open your life-stage module and read at least one tip.
> 4. For the rest of the week, use it as much as comes naturally — or not at all; that's useful data too!
>
> At the end of the week I'll send a **short questionnaire (5 minutes)** — please be brutally honest. Criticism is worth more to me than praise.
>
> **Privacy:** your data is yours alone — nothing is sold or shared, and you can delete everything with one tap in the app (Me → Privacy & data).
>
> Link: **https://sweet-link-system.lovable.app**
> It runs in your phone's browser, nothing to install. If you see a small "Edit with Lovable" button in the corner, just dismiss it — it's test-version scaffolding.
>
> Thank you in advance 🙏
> Mate

---

## 4. The questionnaire (12 questions, ≤5 min)

**Build it as ONE Google Form in Croatian** (the testers' language); the English wording below is for Mate's analysis and any English-speaking testers (make a second EN form only if needed — don't make one bilingual form, it doubles reading time).

**Google Form structure:**
- Title: *HerFuel — tvoje iskreno mišljenje (5 min)*
- Description: *Hvala što si testirala HerFuel! Nema krivih odgovora — najkorisnije mi je ono što ti se NIJE svidjelo. Upitnik je anoniman osim ako ne želiš drukčije.*
- Section 1 *"O tebi"* → Q1–Q2 · Section 2 *"Kako je prošlo"* → Q3–Q4 · Section 3 *"Vrijednost"* → Q5–Q7 · Section 4 *"Što je škripalo"* → Q8–Q9 · Section 5 *"Što dalje"* → Q10–Q12
- Required: Q1–Q5, Q8. Everything else optional (open fields convert better when optional).
- Settings: collect email **off** (anonymity → honesty); shuffle options **off**.

---

**Section 1 — O tebi / About you**

**Q1 · Life stage** — *checkbox (multi-select)*
🇭🇷 *U kojoj si životnoj fazi trenutno? (možeš odabrati više)*
— Ništa posebno / samo pratim prehranu · Pratim menstrualni ciklus · Pokušavam zatrudnjeti · Trudna sam · Dojim · Imam PCOS · Perimenopauza ili menopauza · Ne želim reći
🇬🇧 *Which life stage are you in right now? (select all that apply)* — Nothing in particular / just tracking food · Tracking my cycle · Trying to conceive · Pregnant · Breastfeeding · I have PCOS · Perimenopause or menopause · Prefer not to say
→ **Feeds:** segments every other answer; tells us which life-stage modules actually got tested (A3).

**Q2 · Current tracking habits** — *multiple choice + "other" text*
🇭🇷 *Pratiš li trenutno prehranu ili kalorije? Kako?*
— Ne pratim ništa · "U glavi" ili bilježnica · MyFitnessPal · Cal AI · Yazio · Lifesum · Neka druga aplikacija: ___
🇬🇧 *Do you currently track your food or calories? How?* — I don't track · "In my head" or a notebook · MyFitnessPal · Cal AI · Yazio · Lifesum · Another app: ___
→ **Feeds:** splits respondents into tracker-veterans (can compare, Q7 is meaningful) vs novices (onboarding friction reads differently); names the real local competitor set.

**Section 2 — Kako je prošlo / How it went**

**Q3 · Onboarding completion** — *multiple choice + conditional text*
🇭🇷 *Jesi li prošla cijelo početno postavljanje?*
— Da, do kraja · Djelomično — stala sam kod: ___ · Nisam ga ni počela
🇬🇧 *Did you complete the initial setup (onboarding)?* — Yes, all the way · Partially — I stopped at: ___ · Didn't start it
→ **Feeds:** activation funnel; "stopped at ___" verbatims pinpoint the exact onboarding screen to fix; cross-check against skipped cycle fields for A5.

**Q4 · Days logged** — *multiple choice*
🇭🇷 *Koliko si dana zabilježila barem jedan obrok?*
— Nijedan · 1–2 dana · 3–4 dana · 5–7 dana
🇬🇧 *On how many days did you log at least one meal?* — None · 1–2 days · 3–4 days · 5–7 days
→ **Feeds:** THE retention metric (A1). Self-report now; verify against Supabase logging events once accounts land.

**Section 3 — Vrijednost / Value**

**Q5 · Sean Ellis PMF question** — *multiple choice*
🇭🇷 *Kako bi se osjećala da od sutra više ne možeš koristiti HerFuel?*
— Jako razočarano · Donekle razočarano · Ne bi mi bilo žao · Premalo sam je koristila da bih znala
🇬🇧 *How would you feel if you could no longer use HerFuel starting tomorrow?* — Very disappointed · Somewhat disappointed · Not disappointed · I didn't use it enough to say
→ **Feeds:** the PMF headline number (see §5 for the 40% rule-of-thumb caveats at this sample size).

**Q6 · Main benefit** — *open (short answer)*
🇭🇷 *Koja ti je bila glavna korist od HerFuela, ako je ima? Svojim riječima.*
🇬🇧 *What was the main benefit you got from HerFuel, if any? In your own words.*
→ **Feeds:** positioning language — if their words match ours (honesty, women-first), the brand writes itself; if they describe a generic tracker, the differentiators aren't landing (A2/A3).

**Q7 · Honesty positioning** — *multiple choice + optional text*
🇭🇷 *HerFuel pokušava biti drukčiji: bez srama, bez izmišljenih brojki i ocjena, savjeti s oznakom koliko su znanstveno utemeljeni. Jesi li osjetila tu razliku u odnosu na aplikacije poput MyFitnessPala?*
— Da, jasno — i svidjelo mi se · Da, ali svejedno mi je · Donekle · Nisam primijetila razliku · Nemam s čime usporediti
*(opcionalno)* Po čemu si je osjetila (ili ne)? ___
🇬🇧 *HerFuel tries to be different: no shame, no made-up numbers or ratings, tips graded by evidence strength. Did you feel that difference compared to apps like MyFitnessPal?* — Yes, clearly — and I liked it · Yes, but I don't care either way · Somewhat · Didn't notice a difference · Nothing to compare with
*(optional)* What made you feel it (or not)? ___
→ **Feeds:** the direct A2 test. "Yes but I don't care" is a separate option on purpose — noticing ≠ valuing, and conflating them would flatter the result.

**Section 4 — Što je škripalo / Friction**

**Q8 · Stuck points** — *open (paragraph)*
🇭🇷 *Gdje si zapela, zbunila se ili skoro odustala? Opiši što konkretnije — i sitnice su zlato.*
🇬🇧 *Where did you get stuck, confused, or almost give up? Be as specific as you can — small things are gold.*
→ **Feeds:** the H1 fix-list; cluster verbatims by screen and fix the top 2 before the next wave.

**Q9 · Trust & confusion** — *open (paragraph)*
🇭🇷 *Je li ti išta djelovalo netočno, sumnjivo ili nepouzdano? (npr. podaci o hrani, kalorijski cilj, savjeti o ciklusu, hrvatski prijevod, privatnost…)*
🇬🇧 *Did anything feel inaccurate, suspicious, or untrustworthy? (e.g. food data, your calorie target, cycle advice, the Croatian translation, privacy…)*
→ **Feeds:** A4 (language quality) + A5 (cycle-data trust) + food-DB accuracy — the three trust surfaces, prompted by example so testers know complaints are welcome.

**Section 5 — Što dalje / What's next**

**Q10 · Feature demand** — *checkbox, "choose up to 3", + "other" text*
🇭🇷 *Što bi te najviše potaknulo da HerFuel koristiš češće? (odaberi najviše 3)*
— Slikaš jelo kamerom i AI ga prepozna · Prava aplikacija za iPhone/Android · Podsjetnici (push notifikacije) · Više hrvatskih recepata i jela · Zajednica / grupe s drugim ženama · Povezivanje s više satova i vaga (uz Stravu) · Automatski tjedni plan prehrane · Ništa od navedenog · Nedostaje mi nešto drugo: ___
🇬🇧 *What would most make you use HerFuel more often? (choose up to 3)* — Photo a meal and AI recognises it · A real iPhone/Android app · Reminders (push notifications) · More Croatian recipes and dishes · Community / groups with other women · More watch & scale integrations (beyond Strava) · An automatic weekly meal plan · None of these · Something else is missing: ___
→ **Feeds:** ranks the real candidate backlog (photo-AI, native iOS, push, Croatian content, community, wearables, plan generator) — directly gates the H1/H2 roadmap items in §6.

**Q11 · Willingness to pay** — *multiple choice + optional text*
🇭🇷 *Iskreno pitanje: HerFuel je besplatan dok traje testiranje. Da ostane ovakav kakav je (ili bolji) — što bi ti bilo realno prihvatljivo?*
— Pretplata oko 4–5 € mjesečno · Jednokratna kupnja (jedna cijena, zauvijek) · Koristila bih samo besplatnu verziju · Ne bih je koristila ni besplatno
*(opcionalno)* Što bi ga učinilo vrijednim plaćanja? ___
🇬🇧 *Honest question: HerFuel is free during testing. If it stays like this (or better) — what would realistically be acceptable to you?* — A subscription around €4–5/month · A one-time purchase (one price, forever) · I'd only use a free version · I wouldn't use it even free
*(optional)* What would make it worth paying for? ___
→ **Feeds:** the H3 pricing decision — stated WTP overestimates real WTP, so treat the *shape* (subscription vs one-time vs never) as the signal, not the count.

**Q12 · Referral intent** — *multiple choice + optional text*
🇭🇷 *Bi li HerFuel preporučila prijateljici?*
— Da — i točno znam kojoj · Možda · Ne
*(opcionalno)* Kome bi ga preporučila? (bez imena — npr. "prijateljici koja je trudna", "sestri s PCOS-om") ___
🇬🇧 *Would you recommend HerFuel to a friend?* — Yes — and I know exactly who · Maybe · No
*(optional)* Who would you recommend it to? (no names — e.g. "a pregnant friend", "my sister who has PCOS") ___
→ **Feeds:** organic-growth signal AND a second read on positioning — if the "who" answers cluster around life stages, that confirms life-stage modules as the acquisition wedge (matches the perinatal + perimenopause lead-acquisition thesis).

---

## 5. Scoring & decision framework (n = 8–12)

**First rule of small samples: the verbatims are the data; the percentages are decoration.** At n=10 one person is 10 percentage points — never make a decision on a number that moves that much per respondent. Read every open answer twice before counting anything.

**The 3 metrics that matter:**

| Metric | Source | Healthy signal at this n |
|---|---|---|
| **D3 logging** — % of testers who logged ≥3 days | Q4 self-report, verified by Supabase logging data once accounts land | ≥50% of testers who started onboarding |
| **Task completion** — onboarding done + 1 full day logged + module browsed | Q3, Q4, Q7 "nothing to compare/no answer" rate, Supabase | ≥70% finished onboarding; ≥60% logged a full day |
| **PMF** — % "very disappointed" on Q5 | Q5, **excluding** "didn't use it enough" answers from the denominator | ≥40% is the Sean Ellis industry rule of thumb — at this n treat 0–20% / 20–40% / 40%+ as *weak / promising / strong*, not as precise tiers |

**Sean Ellis caveats at small n:** the 40% benchmark comes from surveying *active users* of products at scale; friendly first testers skew positive (they like Mate), web-app friction skews negative (it's not on their home screen). Net: don't celebrate 45% and don't panic at 30%. What you *can* trust at this size: a cluster of "very disappointed" answers **paired with** specific, vivid Q6 benefits is real signal; "very disappointed" with vague Q6 answers is politeness.

**Qualitative weighting:** one tester saying *"nisam htjela upisati podatke o ciklusu jer ne znam gdje idu"* outweighs ten silent passes on A5 — silence on trust questions is not evidence of trust. Cluster Q8/Q9 verbatims by screen; any screen named by 3+ testers is a confirmed fire.

**Decision rules (if X then Y):**

| Observed pattern | Read | Then |
|---|---|---|
| D3 ≥50% **and** PMF strong (40%+) | Core loop + positioning both work | Go straight to H1 retention basics, recruit wave 2 at 2–3× size, start H3 prep |
| D3 ≥50% **but** PMF weak | They *can* use it but don't love it — utility without differentiation | Mine Q6/Q7: if honesty went unnoticed, fix messaging/onboarding framing before building anything; re-test with same cohort after H1 |
| D3 <50% **but** PMF strong among loggers | The product is loved but friction kills the loop | Attack H1 hard (Recents/one-tap re-log, push-capable shell); the demand is there |
| D3 <50% **and** PMF weak | No pull | STOP building. Do 1:1 interviews (kit in docs `04`/`05`) with the 3 most-engaged and 3 least-engaged testers before writing another Lovable prompt |
| Q7: <30% "noticed and liked" | Honesty positioning isn't landing | It's a *communication* problem first — make the differentiators visible in onboarding + Today before concluding the strategy is wrong |
| Q9 contains ≥2 cycle-data trust concerns, or cycle fields skipped in onboarding data | A5 wobbling | Surface the privacy promise *at the moment of cycle input* (inline "stays on your device / delete anytime"), not buried in Me → Privacy |
| Q9 contains any Croatian-language complaint | A4 gap | Fix the named strings within 48h (dictionary edit is cheap); prioritise Mate's native review of health content |
| Q11: ≥30% choose subscription | Pricing has a pulse | Green-light the H3 pricing experiment design |
| Q11: majority "free only" but PMF strong | Value yes, money not yet | Defer monetisation; find the paid trigger in the "worth paying for" verbatims |

**Once accounts + Supabase telemetry land**, replace self-report with: distinct logging days per user (real D3/D7), barcode-scan count, module-screen opens, language chosen, cycle-fields completion rate. Until then, Q4 self-report is the proxy — expect it to over-report by a day or so.

---

## 6. Post-MVP roadmap (proposed, evidence-gated)

Opinionated sequencing: **H1 is unconditional, H2 is gated on this test, H3 is gated on H2.** Nothing in H2/H3 starts while a confirmed H1 friction fire is open.

### H1 — Retention basics (start now; these are table stakes, not bets)

| Item | Status / source | Promote signal | Kill / defer signal |
|---|---|---|---|
| **Accounts + cloud sync** | In progress now | Unconditional — prerequisite for telemetry, multi-device, and not losing testers' data | — |
| **Recents/Frequents one-tap re-log** in add-food flow | Doc 32 gap #1 — biggest logging-friction win; `recentNamesByMeal()` already exists | Q8 verbatims about logging effort; low D3 with strong PMF | Only if D3 is high AND no logging-friction verbatims (unlikely) |
| **Saved meals as one-tap combos** | Doc 32 gap #4 | Same as above — ships as a pair with Recents | Same |
| **Portion stepper at log time** (recipes) | Doc 32 gap #5 — small, do it opportunistically | Any Q8/Q9 mention of wrong portions | — |
| **Multi-day plan apply** ("Apply day N" → full week) | Doc 32 gap #3 | Q10 votes for "automatic weekly meal plan"; plan-usage telemetry | Zero plan engagement in telemetry → park it |
| **Push-capable shell** (installable PWA with web push, or thin iOS wrapper) | Current limit: no notifications on plain web | Q10 "reminders" in top 3; D3 <50% (push is the classic D3 lever) | Q10 reminders near-zero votes AND D3 healthy |

### H2 — Differentiation (gated on this test's A2/A3 read)

| Item | Promote signal | Kill / defer signal |
|---|---|---|
| **Deeper cycle/life-stage intelligence** (phase-aware Today, richer module content) | A3 confirmed: module verbatims in Q6, module opens in telemetry, Q12 "who" answers cluster by life stage | Modules unmentioned and unopened → modules become quiet settings, generic-tracker quality becomes the bet (a different company — escalate to a strategy session, not a prompt) |
| **RD-reviewed Croatian health content** (finish native review, then perinatal RD validation of targets — doc 28 step 3) | Unconditional before scale: it's the core claim. Accelerate if Q9 flags any advice-trust doubt | Sequencing only — never killed |
| **More Croatian recipes/dishes** (real, cited — extends doc 32 gap #2) | Q10 votes; food-search telemetry full of Croatian dishes that miss | Low Q10 votes + searches mostly hitting → slow-drip instead |
| **Photo-AI logging** | ONLY if Q10 top-2 ranked AND logging friction verbatims persist after H1 Recents ships — it's expensive and Cal AI's accuracy problems are an honesty risk (estimates must be labelled as estimates, per the doc 32 principle) | Mid/low Q10 ranking → stays off roadmap; honesty brand > feature parity |
| **Community/Groups beyond device-local** | Q10 community votes + any organic Groups usage in telemetry | Predicted kill: community ranks low for trackers this early — build only on strong contrary evidence |

### H3 — Monetization & scale (gated on PMF "promising/strong" + H1 D3 improvement)

| Item | Promote signal | Kill / defer signal |
|---|---|---|
| **Pricing experiment** (subscription ~€4–5/mo vs one-time, per Q11 shape; transparent 14-day paywall already exists) | Q11 ≥30% subscription-willing; "worth paying for" verbatims name a buildable trigger | Majority "free only" → defer, revisit after H2 differentiation lands |
| **Native iOS Swift port** (unlocks HealthKit → Renpho/Apple Watch without CSV, real push, App Store presence) | Q10 "real app" in top 3 (likely) + retention proven on web — porting an unretained product just makes it unretained in Swift | Don't start before D3 ≥50% on web |
| **US market entry** | Croatia validates A1+A2 (the differentiators are not Croatia-specific; the food DB and localisation work was the Croatia-specific part) | Croatian PMF weak → fix product before adding a market; a second market multiplies surface, not signal |
| **Name clearance "HerFuel"** (USPTO + domain; doc 28 step 4) | Unconditional before US entry or paid marketing — cheap insurance, do it during H2 | — |

**Sequencing opinion:** the single highest-leverage week after this test is **Recents + saved-meal combos + push-capable shell** — every kill-scenario in §5 except "no pull" routes through logging friction. Photo-AI is the most-requested feature in this category industry-wide and the most dangerous one for this brand; make it earn its place twice (Q10 ranking AND post-H1 friction persistence) before committing.

---

*Next doc after results land: `35-TEST-WAVE-1-RESULTS.md` — paste raw form export + Supabase pulls, run the §5 rules, pick the branch.*
