# Prompt 39 — Redeploy food-search + food-barcode (paste into Lovable)

Deployment only — code is in the repo via GitHub sync. Do NOT rewrite any app code.

---

One backend deployment task: **redeploy the two modified edge functions** `food-search` and `food-barcode` from the latest GitHub sync. They now put a hard 4-second timeout on every Open Food Facts request (6s for USDA), so lookups return cached/healthy-source results instead of hanging when OFF has an outage (it had one today).

Verify after deploying: `POST /functions/v1/food-search` with `{"q":"sarma"}` still returns results with a `citation` field.

Do not modify: any file under `src/`, locale files, or English UI strings.
