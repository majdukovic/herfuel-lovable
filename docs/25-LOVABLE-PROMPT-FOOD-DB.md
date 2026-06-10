# 25 — Lovable prompt: free food database (USDA FDC + Open Food Facts)

Lovable-shaped version of `24-FOOD-DATABASE-MVP.md`: a **Supabase Edge Function proxy + cache-on-read** (not a bulk import). Free, commercial-OK, owns a normalized DB.

**Before you run it:** get a free USDA key at `https://fdc.nal.usda.gov/api-key-signup/` and add it in Lovable as a Supabase secret named `USDA_FDC_API_KEY`. (Open Food Facts needs no key.)

---

> Wire **real food data** into HerFuel using **free, commercial-friendly** sources via **Supabase**, replacing the mock food list. Use a **proxy + cache-on-read** pattern (don't bulk-import; cache each looked-up food into our own table so we own the data and stay vendor-independent).
>
> **1) Supabase schema — a normalized `foods` table** (our system of record), columns:
> `id` (uuid), `source` ('usda' | 'off' | 'custom'), `source_id` (text), `barcode` (text, nullable), `name` (text), `brand` (text, nullable), `serving_label` (text, e.g. "1 cup"), `serving_grams` (numeric, nullable), and **per-100g** numerics: `kcal, protein_g, carbs_g, fat_g, fibre_g, sugar_g, sodium_mg, iron_mg, calcium_mg, magnesium_mg`, plus `raw` (jsonb, original payload), `created_at`. Unique index on `(source, source_id)` and an index on `barcode` and a text index on `name`. Keep `source='off'` rows clearly separable (ODbL — see compliance).
>
> **2) Edge Function `food-search`** (query param `q`):
> - First search our own `foods` table (name ILIKE). If we have ≥8 hits, return them.
> - Otherwise call **USDA FoodData Central**: `GET https://api.nal.usda.gov/fdc/v1/foods/search?query={q}&dataType=Foundation,SR%20Legacy,Branded&pageSize=25&api_key={USDA_FDC_API_KEY}`. Map each result's `foodNutrients` by nutrient number → kcal **1008** (kcal), protein **1003**, carbs **1005**, fat **1004**, fibre **1079**, sugar **2000**, sodium **1093** (mg), iron **1089** (mg), calcium **1087** (mg), magnesium **1090** (mg). (USDA values are per 100 g.)
> - Also call **Open Food Facts** search for branded gaps: `GET https://world.openfoodfacts.org/cgi/search.pl?search_terms={q}&search_simple=1&json=1&page_size=20` with header `User-Agent: HerFuel/1.0 (contact@herfuel.app)`. Map `nutriments`: `energy-kcal_100g, proteins_100g, carbohydrates_100g, fat_100g, fiber_100g, sugars_100g, sodium_100g`(×1000→mg)`, iron_100g`(×1000→mg)`, calcium_100g`(×1000→mg)`, magnesium_100g`(×1000→mg).
> - **Normalize both into the schema, `upsert` into `foods`** (so they're cached), then return a merged list (prefer USDA for generic/whole foods, OFF for branded). De-dupe by name+brand.
>
> **3) Edge Function `food-barcode`** (param `code`):
> - Check `foods` by `barcode` first. Else call **Open Food Facts**: `GET https://world.openfoodfacts.org/api/v2/product/{code}.json` (same User-Agent). If `status===1`, normalize the `product.nutriments`, upsert, return it. If not found, return `{notFound:true}`.
>
> **4) Micronutrient backfill / honesty:** when an OFF item has null iron/calcium/magnesium, **do not show 0** — show "–" / "not provided" for those micros (our life-stage features must not display misleading zeros). (Later we can match to a USDA generic to backfill.)
> **Sanity bounds on ingest:** reject/flag items > 900 kcal/100 g unless clearly a fat/oil.
>
> **5) Wire the app:**
> - The **Add food → Search** sheet calls `food-search` (debounced) and lists results with per-serving macros; tapping → the existing Confirm sheet (serving + meal + macros) → Log. Replace the current mock list.
> - **Scan / barcode:** keep the camera UI mocked, but add a **manual barcode entry** (and use the device camera barcode if available) that calls `food-barcode` → Confirm → Log.
> - **Restaurant / "Eating out"** can stay mocked for now (real menu data is a later paid step).
> - Keep custom foods/recipes/meals saving to Supabase with `source='custom'`.
>
> **6) Licensing & compliance (required):**
> - Add a **"Data sources" line** in About / Me → Privacy crediting **U.S. Department of Agriculture, FoodData Central** and **Open Food Facts** (link `https://openfoodfacts.org`). Show the OFF credit on OFF-sourced product detail too.
> - Always send a descriptive **User-Agent** to Open Food Facts.
> - **Do not import or display Open Food Facts product images** for now (separate CC-BY-SA license).
> - Keep `source='off'` rows query-separable (ODbL share-alike applies only to the OFF-derived data slice, not our app).
> - Put `USDA_FDC_API_KEY` in Supabase secrets; never expose it client-side (only the Edge Functions use it).
>
> Keep everything else working. This makes logging real without any paid API and without bulk data import; the cached `foods` table is our own DB so we can add FatSecret/Nutritionix later without re-architecting.

*(Full rationale, licensing nuance and scale path: `24-FOOD-DATABASE-MVP.md`.)*
