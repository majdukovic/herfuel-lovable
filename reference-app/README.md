# HerFuel — Interactive Prototype **v5** (interview-ready)

The comprehensive, clickable prototype for **user interviews**. A great **general macro tracker** + **optional** female life-stage modules + device integrations — with a **built-in feedback mode** so participants can comment on any feature. 100% mock data, runs offline, no build.

---

## 🔗 Live (deployed)
**https://relaxed-peony-3db82d.netlify.app/** — share this with testers. Re-drag the folder to Netlify to push updates.

## Run locally
Double-click **`index.html`**, or `python3 -m http.server 8000`.

## Put it online (so people can click it on their phones) — Netlify Drop
1. Go to **https://app.netlify.com/drop** (no account needed for a quick link; free account to keep it).
2. **Drag the whole `mockup-v5` folder** onto the page.
3. You get a public link like `https://herfuel-xxxx.netlify.app` — text/email it to participants; works on any phone.
*(Tip: rename the folder to `herfuel` before dragging for a nicer URL. To update, drag again / redeploy.)*

## What's in it (comprehensive)
- **Today** — a **Cal AI–style day switcher** at the top (tap any day to view past logs / plan ahead), a **swipeable 3-page summary carousel** (dots): **① Calories & macros · ② Move & hydrate (steps/water/active) · ③ Nutrients that matter** — iron, calcium, fibre, magnesium, **adapting to the active life-stage module** (e.g. pregnancy → iron/calcium, PCOS → fibre/magnesium, with a one-line "why this matters for you"). Food **grouped by Breakfast / Lunch / Dinner** (each with its own total + "Add to" button; **Snack** optional in Me). Cards are **collapsible**: **Today's tips expand by default when a module is on** (they've earned the space); the general-mode promo starts collapsed. **Water & steps live on the Move & hydrate carousel page** (swipe to the 3rd dot; water has ＋Glass/＋Bottle quick-add). Copy-yesterday, trends link.
- **Contingent guidance (not static wallpaper)** — the honest target + "Today's tips" **change for real reasons**, never for variety's sake: by **stage position** (a pregnancy **week scrubber** moves the target T1 → +340 T2 → +452 T3 and shifts the focus/tips; cycle has a **day/phase scrubber**, breastfeeding a **weeks-postpartum** one), by **logged nutrient gaps** (e.g. "Iron is low so far today"), and by **symptoms she logs** ("Because you logged Nausea"). Each tip shows a **"Because …"** line so it's clear why it's surfacing. The calorie *number* only moves where the science is real (perinatal), never for the cycle.
- **Progress → Milestones** (optional, **Cal AI-style**): two tiles — **Day streak** (flame + best-streak pill) and **Badges earned** (N/M) — over a **3-column hexagon badge grid** (earned = colored, locked = greyed; tap any for a Cal AI-style **Badge Unlocked** detail), plus **View all badges**. DE-safe by design: the streak counts **check-ins, never calorie deficits**; a 0 streak is framed as a **fresh start** (never "you lost it"); **no weight/deficit badges** (rewards consistency, hydration, tuned-in-to-symptoms, nutrient goals). Toggle off in Me.
- **＋ fan-out** — tapping ＋ **expands in place** (no modal yet — the current screen stays visible) into **Log exercise · Search food database · Scan food · Saved foods & meals**, plus **More** (voice · barcode · create food · copy yesterday). A screen opens only once you choose → AI draft → pick the meal section → confirm. ＋ rotates to × to collapse.
- **Meals** tab (like Carb Manager's) — recipe & meal **ideas, meal plans & saved meals**, **tailored to the user's active life-stage**; folds in the module's "Reads"/articles. Shows a phase chip when a module is on.
- **Progress** — measurements by category (Body / Health / Lifestyle / Diet / **Cycle & body**): Weight, Body-fat, Steps, Sleep, HRV, Glucose, Calories, Protein, plus **Cycle length, Period flow, BBT/skin-temp** → chart + ranges + goal + history. **Connected devices auto-fill these**, or **＋ Log today's symptoms** (chip logger from Apple Health–style categories) to add manually. *Reads & contextualises cycle data for nutrition — not a period-tracker rebuild.*
- **Me** — Goals & macros · Reminders · **Meal sections (Snack toggle)** · **Life-stage modules** · **Connected apps** (connect → live data, disconnect → gone) · no-numbers mode · plan.
- **Onboarding** — "just track" vs "tailor to my body"; **Paywall** (trial).
- **Modules** (in Me): Cycle / Pregnancy / Breastfeeding / PCOS / Perimenopause — optional; each adapts target + coaching + nutrients + articles + suggestions.

## 💬 Feedback mode (built-in — for testers NOT on Maze)
- Turn on via the **side panel** ("💬 Feedback mode") or the in-app bar's **Done** toggle.
- A purple bar appears: **tap any feature to leave a comment** pinned to it; **General** = overall thoughts.
- The bar's number opens your notes; **Export** → **Send to me** (auto-collect, see below) or **Copy** all feedback as text.
- **Notes save to *that browser*** — so for async testers, either turn on **Send to me** or use Maze (below).

### Auto-collect async feedback → your inbox (Formspree, free, ~2 min)
So testers who aren't on a Maze session still reach you without copy/paste:
1. Sign up at **https://formspree.io** → **+ New form** → name it "HerFuel feedback".
2. Copy the form's endpoint URL (looks like `https://formspree.io/f/abcdwxyz`).
3. Open **`app.js`**, find the line near the top: `var FB_ENDPOINT='https://formspree.io/f/YOUR_FORM_ID';` and paste your URL in place of the whole string.
4. Re-deploy (drag the folder to Netlify again). Now **Export → "Send to me"** POSTs each tester's notes straight to your email. (Until you set it, only **Copy** shows — no broken button.)
*(Any endpoint that accepts a JSON POST works — Formspree, a Google-Apps-Script webhook, Make/Zapier, your own Netlify Function.)*

## Test it with Maze (recommended for unmoderated, multi-user)
1. Create a free **Maze** account → new project → **"Test a live website / URL"**.
2. Paste your **Netlify link**.
3. Add **missions** (e.g., "Log a meal", "Turn on the Breastfeeding module and find your calorie target", "Connect Oura and find your sleep trend") + follow-up questions + an overall opinion scale.
4. Share the Maze link → you get clicks, paths, drop-offs, and per-mission feedback automatically.
*(Alternatives that pin comments on the live page: **Marker.io** or **Pastel** — open the Netlify link through their tool and click any element to comment.)*

## For moderated 1:1 interviews
Use the hosted link + the interview kit (`../04`/`../05`), and have the participant use the built-in feedback mode as they go. The pivotal questions are in `../04` (perinatal pain, honest-target relief, journey retention, and the "would you use it as a plain tracker?" foundation test).

## Maps to
`../02-PRD-v0.2.md` (Carb Manager model) · `../13` backlog · `../16` integrations/graphs · `../ui-reference/` (competitor UI). Not medical advice; localStorage only.
