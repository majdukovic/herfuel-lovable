# 26 — Croatian food data (for HR concept validation)

**TL;DR:** **Open Food Facts, filtered to Croatia, is your primary local/branded source — and it's better than people think.** Live counts (June 2026, via OFF API): **~6,961 Croatia-tagged products, ~5,788 (≈83%) with complete nutrition**, and all major HR brands present. Pair OFF (branded/barcode) with **USDA FDC** (generics) — the same two-source stack we already chose — then **boost HR coverage by contributing user scans back to OFF**. ScanEat is a real but redundant longer-shot (it's itself OFF-powered). No Croatian manufacturer/retailer offers a public API; no usable national food-composition DB exists.

## What's available (ranked)
| Source | HR/branded coverage | Barcode | License | Cost | Access |
|---|---|---|---|---|---|
| **Open Food Facts (Croatia filter)** | **Best free option** — ~6,961 HR products, all major HR brands | ✅ native | ODbL (+CC-BY-SA images) | Free | API (1 call = 1 real scan) **or bulk dump** |
| **USDA FDC** | generics/raw (not HR-branded) | US branded only | public domain | Free | API + bulk |
| **ScanEat** (scaneat.app) | HR-focused ~50k products — **but OFF-powered** | ✅ | unknown (ask) | unknown | email only (`info@scaneat.app`); offers B2B integration |
| EuroFIR / EFSA FCDB | pan-EU *composition* (some HR) | ✗ | members-only / open | paid / free | webtool / download |
| Croatian gov / CROFCD / data.gov.hr | **none usable** (no maintained national FCDB) | — | — | — | — |
| Manufacturers/retailers (Podravka, Konzum, Lidl, Kaufland…) | rich on-pack, **no public API/dataset** | on pages only | proprietary | — | scraping only (avoid) |

**Live OFF brand counts (HR-filtered unless noted):** Podravka 118 · Vindija 79 · Ledo 70 · Zvijezda 50 (global) · Franck 43 (global) · Cedevita 54 · Dukat 136 (global) · Jamnica 18 · Lidl-HR private label 172 · K-Plus/Kaufland 27.

## Recommended HR approach
1. **Primary local source = Open Food Facts, Croatia-filtered.** Seed a local table from the **bulk dump (Parquet on Hugging Face / JSONL)** filtered to `countries_tags=croatia`; refresh monthly. Use the country facet `countries_tags=croatia` (the `hr.openfoodfacts.org` subdomain works too). Use the **JSON API/dumps, not HTML page scraping** (OFF added an anti-bot wall).
2. **Live fallback** on barcode/search miss → OFF REST API in real time (rule: *1 API call = 1 real scan*; send `User-Agent: HerFuel/0.1 (contact email)`).
3. **Generics = USDA FDC** (unchanged) — raw/unbranded foods + deep micros.
4. **Grow HR coverage by contributing back (highest-leverage lever):** when a user scans an HR product (esp. **EAN prefix `385` = GS1 Croatia**) that's missing, prompt them to snap the label and **push it to OFF via the write API** — ODbL-compliant, free, improves your own coverage, flags 385-misses for priority.
5. **Don't scrape** retailers/manufacturers; **don't pay EuroFIR** for the MVP.
6. **Optional:** email ScanEat (below) — mainly to learn what *proprietary HR curation* they've layered on OFF; treat as upside, not a dependency (same OFF base = redundant data).

## Licensing gotchas (HR-specific)
Same as the global plan: **OFF = ODbL** (attribute "Open Food Facts"; keep OFF-derived rows separable; share-alike bites only on a *publicly distributed derived database*, not your app; **don't reuse OFF images** — CC-BY-SA). **USDA = public domain.** ScanEat/EuroFIR/manufacturer terms unknown → don't assume reuse.

## ScanEat outreach email (paste/adapt)
> **To:** info@scaneat.app · **Subject:** Suradnja / API — HerFuel (nutrition app, koncept validacija)
>
> Pozdrav ScanEat tim! *(then English:)* I'm building HerFuel, an early-stage nutrition-tracking app, and I'm running concept validation with **Croatian users** — so accurate coverage of **local foods and branded products** matters a lot. I was impressed by your Croatian product coverage and scan volume, and wanted to ask whether you offer any **API, data licensing, or partnership** access to your product/nutrition database (read-only barcode lookups would be ideal), and what terms/pricing might look like for a small startup during validation. Even a short call to understand what's possible would be hugely appreciated. Hvala što gradite ovako koristan alat za hrvatsko tržište! — Mate

*(A 2–3 line Croatian opener warms it up; switch to English for specifics.)*

## Risks
HR coverage is workable but **thin in absolute terms** — you *will* hit barcode misses on niche items → the contribute-back loop is essential. Crowd-sourced accuracy (add kcal-vs-macro sanity checks + user "flag/correct"). No authoritative manufacturer data. EAN-385 is a heuristic (imports won't carry it). ScanEat = redundant single-vendor risk.

**Sources:** OFF Croatia facet & API (live counts), OFF data/API/licensing docs; ScanEat site + app-store listings; USDA FDC; EuroFIR FoodEXplorer; EFSA EU FCDB; HAH/EuroFIR HR sector guide (confirms no national FCDB); data.gov.hr.
