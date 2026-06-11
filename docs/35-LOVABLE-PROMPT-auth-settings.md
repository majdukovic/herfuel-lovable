# Prompt 35 — Apply auth settings + user_store migration (paste into Lovable)

Copy-paste everything below the line into Lovable chat. This is configuration only — the code for accounts + sync is already in the repo (synced from GitHub).

---

Two backend configuration tasks — please do NOT rewrite any app code, it's already implemented and tested:

1. **Apply the pending database migration** `supabase/migrations/20260611120000_user_store_sync.sql` (creates `public.user_store` — a per-user key-value table with owner-only RLS used for cross-device sync). If it has already been applied automatically from the GitHub sync, just confirm the table exists.

2. **Auth settings**: enable email+password signups with **auto-confirm ON** (i.e. disable "Confirm email"). Reason: we deliberately use email+password instead of magic links because Supabase's built-in mailer is rate-limited to a few emails per hour, which would lock out our test cohort. With auto-confirm there is no email round-trip at all.

After both are done, please verify:
- Creating a new user via the app's /auth page signs in immediately (no "check your inbox").
- A signed-in user can `select/insert` rows in `user_store` for their own `user_id` only.

Do not modify: `src/lib/cloud-sync.ts`, `src/lib/auth-context.tsx`, `src/routes/auth.tsx`, the locale files, or any English UI strings (the regression suite depends on them).
