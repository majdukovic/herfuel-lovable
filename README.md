# HerFuel — Lovable Build Handoff

This folder is a **self-contained reference package** for building **HerFuel** (a women-first AI nutrition tracker) in Lovable. Everything Lovable needs is here.

## What HerFuel is (one line)
A **great general calorie & macro tracker** + **optional, toggleable life-stage modules** (Cycle, Pregnancy, Breastfeeding, PCOS, Perimenopause) that honestly tailor targets, guidance, nutrients, recipes and content — never shaming, privacy-first.

## How to use this folder with Lovable
1. **Paste `PROMPT.md` §1 into Lovable** as the initial build prompt, then drive the build screen-by-screen with §2 (iteration prompts). §3 is the reference appendix.
2. **`reference-app/`** is the **working clickable prototype** (vanilla HTML/JS — open `index.html` in a browser). It's the source of truth for *behavior, flows, and layout*. Lovable should **mirror its UX** (rebuilt properly in React/Tailwind/Supabase), not copy its vanilla code. `reference-app/README.md` lists every feature.
3. **`DATA-SPEC.md`** has the exact **design tokens, the honest-target table, module definitions, cycle phases, evidence grades, badge list, and content data shapes** — paste these when Lovable asks for specifics so numbers/colors stay correct.
4. **`docs/`** is the "why": PRD (`02`), the competitive gap analysis (`17`), personas (`03`), positioning (`14`), name/ASO (`15`), integrations & parity (`16`).
5. **`assets/competitor-ui/`** — Cal AI & Carb Manager screenshots, organized by section with **keyword filenames** (`<app>-<section>-<keywords>.png`, app = `calai`/`cm`). *Note: excluded from the public repo (competitor IP) — present only in the local copy; add to a private repo if you want them with the handoff.*

> Tip: push this folder to a GitHub repo and point Lovable at it, or just keep `reference-app/index.html` open beside Lovable as you build.

## The 4 non-negotiables (never violate — they are the brand)
1. **Honesty** — move the calorie target only when the science is real (see `DATA-SPEC.md` target table); evidence-grade every tip.
2. **Anti-shame / ED-safe** — No-numbers mode; neutral copy; streaks count check-ins not deficits; no weight/deficit badges; a broken streak is a fresh start.
3. **Privacy** — reproductive/cycle data on-device where possible, never sold, easy export & hard delete; say so on the paywall.
4. **Optional, not a gate** — fully usable as a plain tracker; no forced life-stage declaration.

## Build order
Today (general → with a module on) → Modules engine → contingent guidance → Meals (recipes/plans/create) → Circle (learn/watch/challenges/group chat) → Progress (measurements + Cycle&body + Milestones) → onboarding + transparent paywall → AI logging + real food DB → integrations + units + offline.

## Stack
React + Tailwind · Supabase (auth + data) · real food DB (USDA FoodData Central + branded) · RevenueCat · HealthKit/Health Connect (incl. cycle types) · offline-first · WCAG 2.2 AA + dark mode.

**Positioning:** "the nutrition tracker that's actually built for a woman's body — and never shames it." Lead acquisition perinatal + perimenopause.
