# Prompt 37 — Deploy backend pieces from GitHub (paste into Lovable)

Copy-paste everything below the line into Lovable chat. Configuration/deployment only — all code is already in the repo from GitHub sync. Do NOT rewrite any app code.

---

Backend deployment tasks from the latest GitHub sync — the frontend is already published and working. Please do NOT modify any application code, only deploy/apply what's listed:

1. **Apply two pending database migrations** (in order):
   - `supabase/migrations/20260611150000_food_label_photos.sql` — adds `foods.label_photo_path`, creates the private `food-labels` storage bucket with owner-folder RLS policies.
   - `supabase/migrations/20260611170000_croatian_dishes_pack.sql` — inserts 80 researched Croatian home-cooked dishes as verified foods (source='custom', region='HR').

2. **Deploy two NEW edge functions** that exist in the repo:
   - `supabase/functions/food-seed` — bulk pre-seed of the foods cache from Open Food Facts by country (config.toml already has `[functions.food-seed] verify_jwt = false`).
   - `supabase/functions/food-moderate` — admin moderation queue API (config.toml already has `[functions.food-moderate] verify_jwt = false`).

3. **Redeploy four MODIFIED edge functions** so the new tiered-visibility and trust logic goes live:
   - `food-search` (community foods visible only to contributor until verified)
   - `food-barcode` (same visibility rule on barcode lookups)
   - `food-contribute` (accepts `label_photo_path`)
   - `food-report` (2+ reports auto-flags a community food back to review)

After deploying, please verify:
- `POST /functions/v1/food-seed` with `{"country":"croatia","page":1,"pages":1}` returns JSON with `upserted` (not NOT_FOUND).
- Searching "sarma" in the app returns the Croatian dish entry.
- `/admin/foods` in the app loads the moderation queue when signed in as the founder.

Do not modify: any file under `src/`, the locale files, or English UI strings (the regression suite depends on them).
