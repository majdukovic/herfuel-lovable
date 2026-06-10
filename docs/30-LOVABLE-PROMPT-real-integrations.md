# 30 — Lovable prompt: real integrations (Strava OAuth + Garmin via Strava + Renpho CSV)

Connected apps is currently 100% mock (Apple Health / Oura / Whoop / Garmin / Withings, "Mock data only"). This replaces it with **real, testable integrations** scoped to what Mate can verify with his own devices: **Garmin watch → Strava → HerFuel** (activities + calories) and **Renpho scale → CSV → HerFuel** (weight/body comp). Everything else moves to an honest "Coming soon".

## The facts this design is based on (researched 2026-06-10)

- **Strava** (developers.strava.com): OAuth2; instant app registration at strava.com/settings/api; since June 2026 the Standard Tier needs a Strava subscription (~$80/yr) and self-serves up to **10 connected athletes** with no review — plenty for MVP testing. Access tokens last 6h; refresh tokens must be stored and rotated. Activities list: `GET /api/v3/athlete/activities`; **calories only on `GET /api/v3/activities/{id}`** (detail). Webhooks: one subscription per app, callback must echo `hub.challenge` within 2s. Branding: official "Connect with Strava" button + "Powered by Strava" logo are mandatory. Rate limits ~200 reads/15min.
- **Garmin direct** is business-entity-only (Garmin Connect Developer Program) — not available to a solo dev. But **Garmin Connect auto-syncs every activity to Strava in ~2 minutes** once linked, so Strava covers Garmin watch activities for the MVP. Daily steps/sleep/body-comp from Garmin remain out of scope until a legal entity exists or native iOS ships.
- **Renpho** has **no public API**. The Renpho Health app exports **CSV** (date, weight, BMI, body fat %, etc.) and writes to Apple Health — which the future native iOS app will read. For the web MVP: CSV import.
- **Apple Health cannot be read by any web app** (HealthKit is on-device only) — it stays "Coming soon (iOS app)".

## What Mate does first (outside Lovable, ~15 min)

1. Create the Strava API app at **strava.com/settings/api** (needs an active Strava subscription): name "HerFuel (dev)", Authorization Callback Domain = `vseuwlnwvmnpapxowhlv.supabase.co`. Note **Client ID** and **Client Secret**.
2. In Supabase → Edge Function secrets, add `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET`.
3. In the Strava phone app/site: link Garmin (Settings → Connect an App → Garmin) so the watch flows in automatically.

Paste everything between the lines into Lovable.

---

> Replace the mock Connected-apps screen with real integrations. Keep our honest framing: we **read** data; a wearable's "calories burned" never silently raises the calorie target; disconnect removes the data.
>
> **1) Schema (Supabase).**
> - `integration_connections`: `id, user_id, provider ('strava'), athlete_id, access_token, refresh_token, expires_at, scopes, connected_at, last_sync_at, status ('active'|'revoked'|'error')`. RLS: owner-only. Tokens are never exposed to the client — all Strava calls happen in edge functions.
> - `activities`: `id, user_id, provider, external_id (unique per provider), name, sport_type, start_date, elapsed_sec, distance_m, calories, source_device, raw jsonb, created_at`. RLS owner-only.
> - `body_measurements` (if weight entries aren't already a table — else extend): add `source` ('manual'|'renpho_csv') and `body_fat_pct`, `bmi` nullable columns.
>
> **2) Strava OAuth via edge functions.**
> - `strava-auth-start`: builds `https://www.strava.com/oauth/authorize?client_id=…&redirect_uri=<strava-auth-callback URL>&response_type=code&scope=activity:read_all&state=<signed user state>` and redirects.
> - `strava-auth-callback`: exchanges `code` at `https://www.strava.com/api/v3/oauth/token`, stores tokens + athlete id in `integration_connections`, then redirects back to the app's Connected-apps screen with `?connected=strava`.
> - `strava-sync`: callable from the app ("Sync now") and on connect. Refreshes the access token if `expires_at` is near (rotate the refresh token — Strava invalidates old ones). Pulls `GET /api/v3/athlete/activities?per_page=30&after=<last_sync>`, then for each new activity fetches `GET /api/v3/activities/{id}` to get **calories**, upserts into `activities` by `external_id`. Respect rate limits: batch politely, stop on 429.
> - `strava-webhook`: GET handler echoes `{ "hub.challenge": … }` (must respond < 2s); POST handler receives activity create/update/delete + athlete deauth events and enqueues a sync for that athlete (delete removes the row; deauth sets connection `status='revoked'` and deletes that user's Strava-sourced activities — our disconnect promise).
> - Secrets `STRAVA_CLIENT_ID` / `STRAVA_CLIENT_SECRET` are already set. Never put them in client code.
>
> **3) Connected-apps UI rework.** Three sections:
> - **Available now:** 🟠 **Strava** — official "Connect with Strava" button (orange, official asset; this is a Strava branding requirement, do not restyle) + "Powered by Strava" attribution somewhere visible on the screen. Subline: *"Reads activities & workout calories. If you wear a Garmin, link it to Strava once and your watch flows in automatically (Settings → Connect an App → Garmin in Strava)."* When connected: show athlete name, last sync, "Sync now", and **Disconnect** (calls Strava deauthorize, sets status revoked, deletes Strava-sourced rows).
> - **Import from file:** ⚖️ **Renpho scale (CSV import)** — *"Renpho has no public API, so we read the CSV the Renpho Health app exports (Profile → Export data). Your file is parsed in your browser; only the numbers you confirm are saved."* Upload → client-side parse (handle comma/semicolon delimiters, `kg`/`lb`, date formats `YYYY-MM-DD` and `DD.MM.YYYY`) → preview table (date, weight, body fat %, BMI) → user confirms → rows insert into `body_measurements` with `source='renpho_csv'`, deduped by date (latest wins). Imported weights show in Progress → Measurements exactly like manual entries, with a tiny "imported" tag.
> - **Coming soon (honest):** 🍎 Apple Health — *"Requires our native iOS app (web apps can't read HealthKit). Renpho also syncs into Apple Health, so this will cover your scale automatically."* 🟦 Garmin direct — *"Garmin's API needs a registered business; for now your Garmin reaches us through Strava."* Remove Oura, Whoop, Withings from the list entirely (we can't test them; re-add when we can). Remove the "Mock data only" banner and all mock-data population.
>
> **4) Where the data lands (honest by design).**
> - Synced activities appear in a new "Activity" card on Today (icon, name, duration, calories) for the day they happened, and in Progress → Trends as "active energy".
> - **Calorie target unchanged by default.** Under the Activity card show: *"Workout logged. Your target hasn't changed — we don't auto-add exercise calories. You can turn that on in Goals & targets."* In Goals & targets add the off-by-default toggle **"Add workout calories to my daily target"** with subline *"Wearable calorie estimates can be off by 20–40%, so we leave this off unless you want it."* If enabled while Pregnancy/Breastfeeding module is on, still fine (it only ever adds). Evidence framing as usual.
> - Steps from Strava activities do NOT overwrite manual steps — activities are separate from the steps widget.
>
> **5) Empty/error states.** Not connected → explainer + connect button. Token refresh fails → connection card shows "Reconnect needed" (status='error'), one tap restarts OAuth. CSV parse failure → show the first unparseable line and what we expected, never a silent fail.
>
> Don't touch: foods schema, module engine, evidence grades, streak rules.

---

**Why this shape:** it ships only integrations the founder can physically test tomorrow (Garmin watch → Strava → app; Renpho CSV in hand), keeps every privacy/honesty promise literal (client-side CSV parse, no silent target inflation, delete-on-disconnect), and the `activities` table + provider column means Garmin-direct/Terra/HealthKit later are additive, not a rework. Strava's 10-athlete self-serve tier covers the Croatian interview cohort too.

**QA hooks:** spec 08's `[soft]` Strava step flips to hard once shipped; a new spec 10 (integrations) will cover: Connect button present with official branding, CSV import preview→confirm→Measurements, disconnect promise copy, and the off-by-default workout-calories toggle. OAuth itself needs Mate's real Strava login (manual test).
