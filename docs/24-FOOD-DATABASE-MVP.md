# 24 — Food database for the MVP (open APIs) + scale path

**Decision (TL;DR):** launch on **USDA FoodData Central** (generics + deep micros, self-hosted bulk) **+ Open Food Facts** (barcode + global branded). Both free, both commercial-friendly → **$0 data cost at 1k / 50k / 500k MAU**. Own a normalized DB as the system of record; treat every API as an ingestion pipeline so vendors are swappable. Add **FatSecret Premier Free** for global branded as you grow, and **Nutritionix** only when restaurant menus become a paid feature.

## Why these two (roles)
- **USDA FoodData Central = generic/whole-food + micronutrient backbone.** CC0 public domain (zero legal friction); **deepest micros — including iron, calcium, magnesium** (critical for our life-stage features); REST API **+ 6-month bulk dumps** (Foundation, SR Legacy, FNDDS, Branded) so you self-host from day one. ⚠️ **No barcode-lookup endpoint** (UPC is just a field on Branded items) — don't build scanning on USDA.
- **Open Food Facts = barcode-scan + branded/packaged + international.** Barcode-first, ~3.6M+ global products, fully open, free; the only free option doing true UPC/EAN scanning at scale. ⚠️ Crowd-sourced → **Fe/Ca/Mg often null on branded items.**

## Comparison (short)
| Source | Generics | Branded | Barcode | Micros (Fe/Ca/Mg) | License | Free tier | Commercial |
|---|---|---|---|---|---|---|---|
| **USDA FDC** | ★★★ | ★★ | ✗ (no lookup) | **★★★** | CC0 | free, 1k/hr; **bulk dumps** | ✅ unrestricted |
| **Open Food Facts** | ★★ | **★★★ global** | **★★★** | ★ sparse | ODbL (+CC-BY-SA images) | fully open, dumps | ✅ (attribution + share-alike on *derived DB* only) |
| Nutritionix | ★★ | ★★★ | ✅ | ★★ | proprietary | **none** (free tier killed) | paid (~$1,850/mo+) — **best restaurant menus** |
| Edamam | ★★ | ★★ | ✅ | ★★ | proprietary | ~$14/mo+ | paid; **caching restricted (4 macros) — never make it your store** |
| FatSecret | ★★ | ★★ global | ✅ | ★★ | proprietary | **Premier Free: unlimited US until $1M rev/funding** | ✅ (attribution) |
| Spoonacular | ★ | ★ | ✅ | ★ | proprietary | 50 pts/day, **cache ≤1h** | recipe-side only |

## MVP implementation plan (concrete)
1. **Own DB is the product.** One normalized `foods` table keyed by `(source, source_id, barcode)`, storing **per-100g and per-serving**: kcal, protein, carbs, fat, **fibre, sugar, sodium, iron, calcium, magnesium** (+ serving options). Keep **OFF-derived rows logically separable** from your proprietary data (see licensing).
2. **Ingest by bulk, not live calls.** Bulk-load USDA dumps into Postgres (refresh ~6-monthly); mirror the **OFF data dump** (JSON/CSV/SQLite) and re-sync deltas weekly/monthly. This gives uptime independence and dodges rate limits.
3. **Search flow:** text/manual search → your USDA index first (better micros) → fall back to OFF for branded gaps. **Barcode scan → OFF by barcode.**
4. **Micronutrient backfill:** when an OFF branded item has null Fe/Ca/Mg, map it to a USDA generic equivalent to backfill — or suppress those micros in the UI. **Never show misleading zeros** (our life-stage features depend on real iron/calcium).
5. **Sanity bounds** on ingest (e.g., reject >900 kcal/100g unless it's an oil/fat) to catch bad crowd entries.
6. **Attribution screen** crediting USDA + Open Food Facts.

## Licensing — what to actually do
- **USDA = CC0:** no obligations. Optional citation: *"USDA Agricultural Research Service, FoodData Central, fdc.nal.usda.gov."*
- **Open Food Facts = ODbL (get this right, it's easy):**
  - **Attribute** "Open Food Facts" + link (`openfoodfacts.org`) in About/Sources and on OFF-sourced product views.
  - **Share-alike applies only to a publicly-distributed *derivative database*, NOT your app.** Your UI/app is a "Produced Work" you keep **proprietary and commercial**. The only obligation: **on request, offer the OFF-derived data slice under ODbL** — which is why you keep that slice separable. You do **not** open-source user data or app code.
  - **OFF images are CC-BY-SA 3.0 (separate):** safest MVP move = **skip OFF photos**, use your own/USDA assets.
- **FatSecret Basic/Premier-Free:** attribution required. **Edamam:** caching limited to 4 macros + id while subscribed → **store only via your own ingest, never Edamam as source of record.** **Spoonacular:** 1h cache limit → recipe-only.

## Scale path
- **Phase 0 (0–~50k MAU):** USDA + OFF self-hosted → **$0 data cost.**
- **Phase 1 (gaps surface):** add **FatSecret Premier Free** for global branded (free until $1M rev/funding — matches startup runway). Add a **caching layer** (Redis in front of the Postgres food store) once query volume warrants.
- **Phase 2 (restaurant/dining-out is a paid need):** add **Nutritionix** (~$1,850/mo+) — category leader for menus; this also fills the GLP-1/eating-out gap (our "Restaurant logging" feature currently mocks the estimate).
- **Always:** the normalized DB stays the system of record so any vendor is swap-in/swap-out.

## Risks
OFF micros sparse on branded (→ USDA backfill + null-flag); USDA Branded less fresh + no scan endpoint (→ OFF for barcode); **vendor deprecation is real** (Nutritionix killed free tier, CalorieNinjas sunsetting, Edamam restructured) → **never let a proprietary API be the system of record**; OFF accuracy uneven (→ sanity bounds + a "report/correct" affordance).

**Sources:** USDA FDC API guide & key signup; Open Food Facts terms/data/API + ODbL v1.0 + OSMF Produced-Work FAQ; Nutritionix, Edamam, FatSecret, Spoonacular pricing pages. (Full URLs in research notes.)
