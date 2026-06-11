# 36 — Trust system + Croatian engagement package (refined spec)

**Date:** 2026-06-11 · Approved by Mate. Five packages, built in this order.

## A. Community-food trust system
- `contributed_by` on foods; private `food-labels` storage bucket; contribution form gets a nutrition-label photo step (camera-friendly, strongly encouraged).
- **Tiered visibility**: contributor always finds their own foods (search + barcode); everyone else only sees `verified` rows. Claim this honestly in UI copy.
- **Moderation**: `food-moderate` edge function (admin = ADMIN_EMAILS env, default founder email) + hidden in-app `/admin/foods` queue (photo beside entered macros → Approve / Fix & approve / Reject). Reports view in the same queue.
- **Report loop closure**: 2+ reports auto-flags a verified food back to needs-review; reporter sees honest "thanks, we'll check it".
- e2e spec 17; full HR translations.

## B. Croatian home-cooked dishes pack (~80 dishes)
- The gap no competitor covers: sarma, blitva s krumpirom, grah, punjene paprike… aren't in any barcode DB.
- Research-first: macros per 100 g + typical serving, from credible sources (Croatian food-composition tables, USDA ingredient mapping, published analyses). NO invented numbers; estimates labeled; every dish cites its source. HR name primary, EN name searchable.
- Ships as `verified` rows in `foods` (source custom, region HR) via migration → instantly searchable & loggable.

## C. Recents & Frequents one-tap re-log
- Derived from the user's own log history (no new storage): "Recent" + "Frequent" rows in AddFoodSheet before any query is typed. One tap re-logs with last portion.

## D. Croatian household portions
- Portion preset chips with honest gram equivalents (žlica ~15 g, velika šalica ~240 ml, kom = product serving, šaka ~30 g), labeled as approximations. Cuts grams-math friction.

## E. First-week checklist (quiet)
- 3-item card on Today for new users: log a meal · scan a barcode · open your module. Items disappear when done; card gone when complete (or after 14 days). No streaks, no pressure — on-brand.

Also in flight: OFF Croatia pre-seed (~7k products) — function pushed, deploys on next Publish.
