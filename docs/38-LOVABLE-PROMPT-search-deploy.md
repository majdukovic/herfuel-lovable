# Prompt 38 — Diacritic search + citation transparency (paste into Lovable)

Copy-paste everything below the line into Lovable chat. Deployment only — code is in the repo via GitHub sync. Do NOT rewrite any app code.

---

Two backend deployment tasks from the latest GitHub sync — do NOT modify application code:

1. **Apply the pending migration** `supabase/migrations/20260611200000_diacritic_search.sql` — enables the `unaccent` extension, adds generated `name_ascii`/`brand_ascii` columns + indexes on `public.foods` (so "strukli" matches "Štrukli").

2. **Redeploy the modified edge function** `food-search` — it now (a) folds diacritics in queries and matches the new ascii columns, and (b) returns `citation`/`confidence` fields from `raw` so the app can show food sources transparently.

Verify after deploying:
- `POST /functions/v1/food-search` with `{"q":"strukli"}` returns the "Štrukli (zagorski)" dish.
- `POST /functions/v1/food-search` with `{"q":"sarma"}` returns a result that includes a `citation` field mentioning USDA.

Do not modify: any file under `src/`, locale files, or English UI strings.
