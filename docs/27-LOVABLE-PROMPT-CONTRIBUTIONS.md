# 27 — Lovable prompt: user-contributed foods (scalable, refine-later)

When a food is missing, let users add it — stored in our own DB, flagged as community/unverified, with a review queue so we refine macros/micros later **without blocking anyone**. Builds on the food-DB layer (`25`). All in Supabase.

---

> Add a **user-contribution flow** for missing foods. Goals: usable instantly, clearly labelled as community data, and **scalable** (status flags + a review queue, no manual gate in the user's way). All in Supabase; keep our honesty rules (never fabricate micros).
>
> **1) Schema.** On the `foods` table add: `status` text default `'verified'` ('verified' | 'unverified' | 'flagged'); `contributed_by` (text/uuid, nullable); `contributed_at` (timestamptz, nullable); `region` (text, nullable, e.g. 'HR'); `report_count` int default 0. Existing USDA/OFF rows = `status='verified'`. Add a `food_reports` table: `id, food_id (fk → foods), reported_by, kind ('wrong_macros'|'wrong_serving'|'duplicate'|'other'), note, suggested jsonb, created_at`.
>
> **2) "Can't find it? Add it."** In Add-food search, when results are **none/low** (and on **barcode not found**), show **"＋ Add a missing food"** → a contribution form: name, brand (optional), barcode (pre-filled from a scan), serving label + grams, **kcal + protein/carbs/fat (required)**, and **fibre/sugar/sodium/iron/calcium/magnesium (optional — leave blank if unknown; never guess)**. Save → insert into `foods` with `source='user'`, `status='unverified'`, `contributed_by`, `contributed_at`.
>
> **3) Instantly usable, clearly labelled.** The new food is immediately searchable/loggable. Wherever a `status='unverified'` / `source='user'` food appears, show a small **"Community entry · unverified"** badge; on its detail add *"Added by a member — macros may be refined later."* Missing micros show "–", never 0.
>
> **4) Dedupe before insert.** Check by **barcode** first, then name+brand. If a match exists, don't duplicate — open it and offer **"Suggest a correction"** instead.
>
> **5) Report / correct any food.** A "Report / suggest a correction" action on any food detail writes a `food_reports` row and increments `foods.report_count`. (We collect refinements; we don't overwrite data live.)
>
> **6) Croatia boost.** If a scanned/entered barcode starts with **`385`** (GS1 Croatia), set `region='HR'`. After saving an HR community food, optionally offer (opt-in, with consent) to **also contribute it to Open Food Facts** via their write API — helps everyone and our coverage. Skip if unsure.
>
> **7) Scalable moderation (don't block users).** Logging never waits on review. Contributions + reports accumulate with status flags for the team to verify/refine later. Add RLS: any authenticated user can insert a contribution/report; only an **admin** role can set `status='verified'` or edit others' contributions. A simple admin list of `status='unverified'` + `report_count > 0` (sortable, newest first) is enough for now.
>
> Community data is **labelled, never presented as authoritative**. Everything in Supabase.

---

**Why this is the right shape:** your `foods` table stays the single source of truth (USDA/OFF/user/custom all coexist via `source` + `status`), users are never blocked, and you get a clean **unverified → verified** pipeline you can moderate at any scale later. The `food_reports` table is your crowd-sourced QA signal for refining macros/micros. The 385/Open-Food-Facts contribute-back turns local HR gaps into a flywheel.
