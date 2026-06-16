# Audit — REDESIGN_MIGRATION_PLAN.md

**Date:** 2026-06-08
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/REDESIGN_MIGRATION_PLAN.md` (status: decisions locked, pre-execution)
**Method:** Verified every load-bearing claim against the actual codebase, not the plan's self-report or the Claude Code summary. Read/inspected directly this session: the full `src/` tree (routes + components), `package.json`, `src/app/globals.css`, `next.config.ts`, the three i18n config files (`routing.ts`, `request.ts`, `config.ts`), `docs/design/TT-DESIGN-SYSTEM.md` (complete), and the `docs/redesign/` prototype tree (`site/`, `tools/`, `assets/data/`). Two acceptance numbers (841 tests, 284 pages) could not be executed in this environment — flagged where relevant.
**Status:** ✅ **APPROVE the plan as a sound, low-risk migration strategy**, subject to the findings below. The content-safety contract (§1) is genuinely well-constructed and verified against the code. The decisions are internally coherent. Findings are: one Significant (a superseded prior decision the plan doesn't acknowledge), and several Minor (one un-named exception category, a type-floor imprecision, an incomplete surface map, two unverifiable counts).

---

## Executive summary

The plan's central thesis — **"the prototype is a re-skin of a structure the app already has, not a different app"** — is **verified true**. I confirmed against the actual filesystem that every route and component the plan claims already exists does exist, that the content pipeline/parsers/domain types/i18n wiring are real and shaped as described, and that the two "genuinely new" surfaces (WebGL hero, Search) genuinely have no counterpart in `src/`. The content-safety contract in §1 is not boilerplate — each invariant maps to a real file or mechanism I verified.

The design-rule exception governance (§6) is the strongest part of the plan and the part most likely to be wrong, so I checked it hardest: **every conflict the plan commits to logging an exception for is real and verbatim in `TT-DESIGN-SYSTEM.md`** (no gradients/glow, no pure black/white, 400ms motion cap), and the three rules it says it will *enforce rather than except* (OKLCH-only, ≥12px floor, Lucide) are also real rules. The plan chose correctly which to bend and which to hold.

What keeps this from a clean APPROVE-as-is: (1) retuning `--color-accent` silently overrides a **previously signed-off decision** (P5-Q1) recorded in both `globals.css` and the design system; (2) the plan names three exception categories but misses a fourth — the WebGL-hero + "spectacle" duotone is in direct tension with the design system's **§1 "must NOT feel like a startup marketing page"** product-identity rule, which is a higher-order conflict than the token-level ones it does log; (3) the §3 surface map omits several real components that will need restyling. None blocks starting P0; all should be resolved before the surfaces they touch.

---

## Verification table

| # | Plan claim | Result | Evidence (verified this session) |
|---|---|---|---|
| 1 | App already ships the 3-door IA as real routes (Read/Notes/Deeper) | ✓ | `src/app/[locale]/[book]/chapter/[chapter]/{page,notes/page,deeper/page}.tsx` all exist. |
| 2 | Plus introduction / people / background / books / start / rules / landing | ✓ | All present: `[book]/introduction`, `[book]/people`, `[book]/background`, `[locale]/books`, `start`, `rules`, `[locale]/page.tsx`. |
| 3 | Same content pipeline: 5 parsers → domain types → RSC via `content-loader.ts` | ✓ | `infrastructure/content/` has markdown/enrichment/book-context/people/prophecy parsers + `fs-content-repository.ts`; `lib/content-loader.ts`, `domain/content/{types,structured,ids}.ts` exist. |
| 4 | Localized for all 4 locales EN/PT-BR/DE/ES | ✓ | `i18n/config.ts`: `locales = ["en","pt-br","de","es"]`, `defaultLocale="en"`; `messages/{en,pt-br,de,es}.json` all present. |
| 5 | Dual-label chip, BookCard, SVG people timeline, verse anchors+copy-link exist | ✓ | `claim-badge.tsx`, `book-card.tsx`, `people-timeline.tsx`, `verse-card.tsx`, `study/copy-verse-link.tsx` all exist. |
| 6 | Regression nets: conservation gate, completeness/label guards, content:lint, tests | ✓ | `__tests__/conservation.test.ts` + 7 parser tests; `package.json` `content:lint` → `scripts/content-lint.sh`; `test` → `vitest run`. (Test *count* 841 not executable here.) |
| 7 | App has no search route/index/nav search (Search is NEW) | ✓ | No `search/` anywhere under `src/app/`. Confirmed absent. |
| 8 | App has no animation dependency (three.js is a new dep) | ✓ | `package.json` deps: no `three`, no animation lib. Adding three.js is a real new dependency. |
| 9 | `lucide-react` available for the icon swap | ✓ | `package.json`: `lucide-react ^1.8.0` already installed — icon swap adds no dependency. |
| 10 | Current tokens in `globals.css` `@theme inline`, all OKLCH | ✓ | Verified: every token is OKLCH; no hex. |
| 11 | Prototype palette is hardcoded hex and must be converted | ✓ (assumed for prototype) | Prototype `site/assets/tt.css` exists; plan's hex values (#006475/#062227/etc.) not individually re-read, but the "convert hex→OKLCH" direction is correct and consistent with §5 "hardcoded hex forbidden". |
| 12 | `next.config.ts` redirects + security headers are load-bearing | ✓ | Verified: chapter redirect + `context→background` redirect; X-Frame-Options/X-Content-Type-Options/Referrer-Policy headers all present. |
| 13 | Prototype is standalone w/ own Python pipeline + JS data (not carried over) | ✓ | `docs/redesign/site/` (HTML + `assets/data/*.js` + `tt.js`/`tt.css`/`i18n.js`) + `docs/redesign/tools/*.py` all exist exactly as described. |
| 14 | Design system bans gradients/glow, pure black/white, >400ms motion | ✓ | `TT-DESIGN-SYSTEM.md` §5/§7/§12 verbatim: "Never gradients, neon, or AI glow"; "Never pure black/white"; "Maximum 400ms" / "Never exceed 400ms". All three logged-exception targets are real. |
| 15 | Enforced (not excepted): OKLCH-only, ≥12px floor, Lucide 1.5px | ◑ | All three are real rules (§5/§4/§10). But the floor is imprecise — see Minor 2: the design system sets **14px for prose**, 12px only for mono labels. |
| 16 | Retune `--color-accent` to the #006475 family | ✗ (conflict) | The current `--color-accent: oklch(0.46 0.1 213)` is a **signed-off P5-Q1 decision** (comment in `globals.css` + design-system §5). Retuning supersedes it; the plan doesn't say so. See Significant 1. |
| 17 | §3 surface map covers the components needing re-skin | ◑ | Map omits real components: `confidence-indicator.tsx`, `prophecy-view.tsx`, `glossary-panel.tsx`, `supplementary-section.tsx`, `verse-related.tsx`, `reading-progress.tsx`, `share-button.tsx`, `language-switcher.tsx`, `locale-link.tsx`, `json-ld.tsx`. See Minor 3. |

---

## Findings

### Significant

**Significant 1 — Retuning `--color-accent` supersedes the signed-off P5-Q1 accent decision, and must be changed in TWO locked files in lockstep.**
The plan's §2 token table says "Retune `--color-accent` to the **#006475** family … sync the hex mirror in `src/lib/og.tsx`." The plan is correctly *aware* of both files, but it treats this as a routine token edit when it is in fact a **supersession of a previously signed-off decision** recorded in two places:
- `globals.css`: `--color-accent: oklch(0.46 0.1 213)` with the comment *"Phase 5 (P5-Q1): confident deep teal/petrol accent … AA-safe on warm paper; distinct from all four claim-type note hues (red 25 / green 145 / blue 250 / amber 80)."*
- `src/lib/og.tsx`: `const ACCENT = "#1F6A7D"; // --color-accent (Phase 5: deep teal/petrol)` — the satori hex mirror (verified this session), used for the OG card's top border, eyebrow, and footer bar.

Two consequences the plan understates: (1) **the two values must move together or OG cards silently diverge from the site accent** — and OG output is visual SEO that ships to social/link previews, so a stale mirror is a user-visible regression outside the app itself; (2) the retune must **re-verify the two properties P5-Q1 was chosen to satisfy** — WCAG AA on warm paper, and hue-distinctness from the four note hues. On hue angle the new value is likely fine (≈213° vs note hues at 25/80/145/250 — it doesn't collide), so the **real re-check is luminance/AA contrast on warm paper**, not hue. The change should be logged as "supersedes P5-Q1" in the design system + editorial log, exactly as the plan commits to doing for the other design-rule changes. **Recommendation:** reclassify accent-retune in §6 as a P5-Q1 supersession (both `globals.css` and `og.tsx`), with the AA re-verification done before P0 closes; note hue-distinctness is expected to hold but must be confirmed, not assumed.

### Minor

**Minor 1 — A fourth exception category is unnamed: the "marketing-page feeling" product-identity conflict.**
§6 logs three design-rule exceptions (glow/gradient, near-black surface, 800ms motion) — all at the *token/mechanic* level, and all real. But the design system's **§1 Product Feeling** says the UI **must NOT feel like** "a startup marketing page," and **§3** lists "VC-deck minimalism" and "AI glow or gradient orbs" under Avoid. A lazy-loaded WebGL shader hero plus a full duotone "spectacle" landing (the plan's own word, §7 P4) is in tension with that higher-order identity rule, not just the token bans. This doesn't mean don't do it — the lead has locked it — but the exception log should name the product-identity tension explicitly (and state the mitigation: the hero is gated, reduced-motion/no-WebGL fallbacks exist, and the calm reading surfaces P2 stay unchanged). Logging only the token-level conflicts under-states what's being traded. **Recommendation:** add a fourth bullet to §6's exceptions naming the §1/§3 "editorial-not-marketing" tension and the mitigation.

**Minor 2 — "≥12px type floor" is imprecise; the design-system prose floor is 14px.**
§2 and §6 say the enforced floor is "≥12px," and commit to raising the prototype's 10.5/11px labels. Correct direction, but the design system (§4 Rules + §12) is stricter: **"Minimum 14px for prose/labels. 12px ONLY for structural mono labels. Never below 12px."** So a prototype label rendered as prose at 12px would still violate the prose floor. **Recommendation:** restate the rule as "12px for structural mono labels only; 14px minimum for prose/labels" so P0/P5 enforce the correct two-tier floor, not a flat 12px.

**Minor 3 — The §3 surface map is incomplete; several real components needing re-skin are unlisted.**
The map covers the major surfaces but omits components that exist in `src/ui/` and will need retokening/restyling: `confidence-indicator.tsx`, `prophecy-view.tsx` (+ the prototype ships `*-prophecy.js` data and `genesis-12-prophecy` etc., so prophecy is a live surface), `glossary-panel.tsx`, `supplementary-section.tsx`, `verse-related.tsx`, `reading-progress.tsx`, `share-button.tsx`, `language-switcher.tsx`, `locale-link.tsx`, and `json-ld.tsx` (no visual change but must be confirmed unaffected). Prophecy is the most notable omission — it's a real view with its own parser, tests, and prototype data. **Recommendation:** add a "Prophecy" row and a catch-all "remaining primitives/chrome" row to §3 so no surface is silently skipped during the per-surface visual diff (§8).

**Minor 4 — `og.tsx` mirrors FOUR hardcoded hex tokens, but §2 only calls out syncing the accent — the other three can go stale.**
`src/lib/og.tsx` hardcodes four satori-only hex approximations of OKLCH tokens (verified this session): `PAPER #F5F1E8` (`--color-bg-paper`), `INK #2A2620` (`--color-text-primary`), `SECONDARY #5C554B` (`--color-text-secondary`), and `ACCENT #1F6A7D` (`--color-accent`). The plan's §2 instructs syncing only the **accent** mirror. But P0 also "convert[s] prototype palette → OKLCH" and adds dark-surface tokens; if paper/ink/secondary are deepened or retuned at all during that conversion (the duotone work makes surface changes plausible), the other three hex constants would silently drift from their tokens, and every OG card would render with stale brand colors. satori has no OKLCH support (hence the manual mirror), so there is **no automated guard** catching this — it won't fail a build or a test. **Recommendation:** broaden the §2 instruction from "sync the accent mirror" to "re-derive ALL four `og.tsx` hex constants from their final OKLCH tokens, as a P0 close-out checklist item," and add an OG visual check to P5 (§7 already lists "OG images" under hardening — make it explicit that it includes color-fidelity vs the new tokens). This is the single most likely silent-drift point in the whole migration, precisely because it's hex-by-necessity in an otherwise token-pure system.

**Minor 5 — Two acceptance numbers are unverifiable in this environment.**
§1.6/§10 assert "841 tests" and "284 pages (build)." Both are reasonable and consistent with the project's scale, but neither can be executed here (no shell). They are correct to use as *green-gate* criteria; just note they're claimed, not audit-verified. The green-gate discipline (every phase ends test/build/lint/content:lint green) is the right control regardless of the exact numbers.

### Not defects (verified good)

- **The content-safety contract (§1) is real, not boilerplate.** Every invariant maps to a verified file/mechanism: no-`content/**`-edits (parsers recognize only known markers — the structural reason loss is "impossible"), consume domain objects from `content-loader.ts` (exists), add-only i18n keys across all four `messages/*.json` (all present), preserve `next.config.ts` redirects/headers (verified), keep `render-markdown-safe.ts` in the path (exists, has its own test). This is the right contract and it is accurately specified.
- **The "re-skin not re-build" thesis is verified.** The structural match the plan rests on is real in the filesystem; the migration genuinely is presentation-layer.
- **Decision coherence.** Removing Search from the P0–P6 sequence (deferred, §6.3) while keeping §4 for reference is internally consistent; the P0→P6 ordering (foundations → chrome → calm reading → study/aux → marketing/spectacle → hardening → cutover) correctly front-loads low-risk surfaces and isolates the WebGL/duotone risk to P4/P5.
- **Branch + preview cutover (§6.4)** is the conservative choice and matches the "nothing in `src/` changes before go-ahead" discipline.

---

## What works well

- **It verified the codebase before planning the re-skin.** The §0 audit claims hold up file-by-file — the plan didn't assume the structure, it checked it, which is exactly why the "presentation-only" safety argument is credible.
- **It distinguishes enforce-vs-except deliberately.** Rather than treating the design system as either inviolable or irrelevant, it picks which rules to hold (OKLCH, type floor, Lucide) and which to formally except (glow, dark surface, 800ms) — and every one of those calls matches the actual rule text. That is the correct way to handle a prototype that intentionally diverges.
- **It commits to logging dated exceptions rather than silently breaking rules.** This is the right governance posture and consistent with how the project logs other decisions.
- **The regression strategy reuses the proven nets.** Leaning on the existing conservation gate + guards + tests (which already proved zero loss in the parser→structured layer for all four locales) rather than inventing new verification is correct and low-risk.

---

## Recommendation

**APPROVE to begin P0**, with these pre-execution edits to the plan:

1. **(Significant 1)** Reclassify the `--color-accent` retune as a **supersession of P5-Q1** spanning BOTH `globals.css` and `og.tsx`, not a silent token edit. Add it to the §6 decisions-to-log list and re-verify WCAG AA on warm paper before P0 closes (hue-distinctness from the four note hues is expected to hold but confirm it).
2. **(Minor 1)** Add a fourth §6 exception naming the §1/§3 "editorial-not-marketing-page" product-identity tension introduced by the WebGL hero + duotone spectacle, with the mitigation (gated hero, fallbacks, calm reading surfaces unchanged).
3. **(Minor 2)** Restate the type floor as two-tier: 12px mono-labels-only / 14px prose minimum.
4. **(Minor 3)** Complete the §3 surface map — add Prophecy (live surface with its own parser/tests/prototype data) and a catch-all chrome/primitives row.
5. **(Minor 4)** Broaden the §2 `og.tsx` instruction to re-derive ALL four hex mirror constants (paper/ink/secondary/accent) from their final tokens at P0 close, with an explicit OG color-fidelity check in P5 — the system's one unavoidable hex surface and its most likely silent-drift point.
6. **(Minor 5)** Mark the 841/284 numbers as green-gate targets, not verified facts.

None of these blocks starting P0 (foundations: OKLCH token conversion + type scale + grid + reveal system), since P0 is additive token/primitive work — *except* that the accent retune within P0 should carry the P5-Q1 re-verification (Significant 1). Everything else can be resolved in the plan text before the surfaces it governs (P4/P5) are reached. The migration strategy itself is sound, the safety contract is verified, and the exception governance is correctly grounded in the actual design rules.

*Method note: this audit verified structure, config, tokens, i18n wiring, the design-rule conflicts, and the prototype's existence directly against the filesystem. It did not execute the test/build green gate (no shell) and did not re-read every prototype HTML/CSS file line-by-line; the per-surface visual diffs in §8 remain the execution-time verification for pixel-level fidelity.*
