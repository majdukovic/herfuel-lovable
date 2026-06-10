# 31 — Lovable prompt: Strava first-sync backfill + sync transparency

Mate connected Strava successfully (OAuth + token storage verified working; webhook subscription 353331 is registered and the challenge handshake passes). But the first sync reported **"Synced 0 activities"**. Likely cause: `strava-sync` filters with `after=<last_sync>` and `last_sync_at` gets initialized at connect time — so the first pull can never return anything. Even if Mate's Strava simply has no recent activities, the card gives the user no way to tell "nothing to sync" apart from "sync is broken."

Paste everything between the lines into Lovable.

---

> Fix the Strava sync's first run and make sync results honest and debuggable.
>
> **1) First-sync backfill.** In `strava-sync`: when the connection has never synced anything (no rows in `activities` for this user/provider, or `last_sync_at` is null/equal to `connected_at`), pull the **most recent 30 activities with NO `after` filter** (`GET /api/v3/athlete/activities?per_page=30`), fetch each detail for `calories`, and upsert by `external_id`. Only after that backfill set `last_sync_at`.
>
> **2) Overlap window on incremental syncs.** Subsequent syncs use `after = last_sync_at - 24h` (dedupe via the `external_id` upsert makes the overlap harmless). This prevents missed activities from clock skew or delayed Garmin→Strava delivery.
>
> **3) Honest sync feedback on the connection card.** Replace "Synced 0 activities." with real states:
> - After a sync: *"Synced N activities (M new)"* plus the most recent activity's name and date if any exist.
> - If the account genuinely has no activities: *"Your Strava has no activities yet. If you just linked your Garmin, new workouts will appear automatically — Garmin only sends activities recorded after linking (you can import history in Strava settings)."*
> - If the Strava API errors: show the status (e.g. *"Strava error 429 — rate limited, try again in 15 min"*), never a silent 0. Set connection `status='error'` only on auth failures (401), not transient ones.
>
> **4) Small polish from the CSV import QA:** imported Renpho rows save correctly, but the **"imported" tag** isn't visible on entries in the measurement history list — show a subtle "imported" label on rows whose `source='renpho_csv'`.
>
> Don't touch: schema, OAuth functions, the webhook (it's registered and working), the honest no-auto-calorie rule.

---

**QA hooks:** after this ships, re-run `e2e` spec 10; the manual test is: tap "Sync now" → expect either backfilled activities (if any exist in Strava) or the honest empty-state copy.
