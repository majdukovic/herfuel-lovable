# 33 — Croatian localization: analysis + implementation

**Date:** 2026-06-10 · For Croatian concept-validation testers. Implemented directly in `sweet-link-system`.

## Options considered

| Approach | Verdict |
|---|---|
| **react-i18next / full i18n framework** | Overkill for 2 locales now; key-extraction refactor touches every component in one pass (high regression risk on test night). Right choice *later* if locales multiply. |
| **Runtime machine translation** | Rejected — medical/health copy must never be machine-translated silently; quality + liability. |
| **Lightweight context + English-string-keyed dictionary, tiered coverage** ✅ | Chosen. English literal = key = fallback → untranslated strings gracefully render English, no broken keys. Components only change where translated. Migrating to i18next later is mechanical. |

## What shipped (Tier 1)

- `src/lib/i18n.tsx` — `LangProvider` + `useLang()` (`lang`, `setLang`, `t()`); persists `herfuel.lang` + `herfuel.lang.chosen`.
- `src/lib/locales/hr.ts` — ~150 strings: nav + FAB fan-out, common CTAs, Today (meals, add/log buttons, tips header), Me rows, Appearance, Meals hub, Progress headers/subtabs, the full 5-card walkthrough, language UI.
- **First-visit language modal** (before the walkthrough, z-index above it): question in Croatian per founder decision — *"Na kojem jeziku želiš koristiti HerFuel?"* with 🇭🇷 Hrvatski / 🇬🇧 English and an English subline. Choice persists; modal never returns.
- **Switcher**: Me → Appearance → "Jezik · Language" segmented control. When Croatian is active, an honest note: *"Savjeti i članci zasad su na engleskom — pregledani hrvatski prijevod stiže uskoro."*
- e2e: spec 14 (modal-first in Croatian, choose Hrvatski → "Danas/Obroci/Doručak", switch back); harness pre-chooses English for all other specs.

## Deliberately NOT translated yet (Tier 2/3) — and why

1. **Evidence-graded health content** (tips, Insights, Circle articles): medical nuance demands review. **Mate is the native reviewer** — translation drafts can be produced quickly, but they ship only after his pass. The in-app note makes this honest to testers.
2. **Recipes/plans** (names, steps): same review path; sources stay English-linked either way.
3. **Food database results**: USDA generics return English names by design; OFF already returns Croatian product names for Croatian products (Vegeta, Čokolino…), which testers will search most.
4. Remaining screen copy (Goals, Privacy, Connected apps body text…): expands dictionary-by-dictionary; fallback keeps it usable meanwhile.

## Croatian-language notes for the reviewer (Mate)

- Voice: informal **ti** (matches the app's warm tone), feminine address where gendered ("Dobrodošla").
- "Circle" → "Zajednica" (community) rather than a literal "Krug"; "Fast" (fasting) → "Post"; "Snacks" → "Međuobroci".
- Croatian has 3 plural forms — current strings are phrased to avoid plural interpolation; if dynamic plurals appear later, that's the moment to adopt i18next's plural rules.

## Next tiers

- **Tier 2**: remaining settings/dialogs/empty states (+~150 strings).
- **Tier 3**: tips + Insights + walkthrough-adjacent guidance (needs Mate's review), then articles (longest).
- **Auth screens** (upcoming accounts feature) ship bilingual from day one.
