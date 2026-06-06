# Phase 5 Plan — UX Finish (color · overviews · landing copy · reading plan)

**Date:** 2026-06-05
**Status:** ✅ 5a + 5c + 5d + **5b (EN)** EXECUTED & VERIFIED 2026-06-06 (uncommitted); **5b PT-BR/DE/ES de-jargon + book tight-cards remain** (next increment).

**5b (EN) done:** de-jargoned all 18 EN chapter overviews (confined to the CHAPTER OVERVIEW slice via a count-checked script) — proper names → familiar; technical transliterations → plain English; wordplays kept as plain-English signposts; YHWH retained. Residual italics 10–24 → ~4 per overview (mostly Rule-11 emphasis). Gates: 827 tests (chapter-overview=72 conserved) · build · lint · content-lint baseline. Editorial-log: genesis `2026-06-06-113`, john `J-029`, matthew `M-027`.

**Post-implementation review (2026-06-06):** **confinement proven** — compared each file's non-overview content against git HEAD; the only non-overview change across all 18 is John 2's Phase-4 "Galil" edit (line 68), so 5b touched overview text exclusively (main-text name-rendering preserved; `Ya'aqov` still appears 5× in Matthew 1's genealogy). Markdown balance verified (even `*`, balanced parens in every overview). Sweep found 3 residual misses in Matthew 1 — `Ya'aqov (Jacob)`→`Jacob`, `Avrahamic`→`Abrahamic`, `toledot (…)`→`"generations"` — now fixed (confined to the overview). Acceptable residuals kept: obscure transliterated names with no common familiar form (Arpakhshad, Erekh, Amatsyah), the `Natsri` term under discussion, and the intentional `name (Noach)` wordplay gloss. Re-ran gates: 827 · build · lint · content-lint.

**5b PT/DE/ES (names + bare glosses) done 2026-06-06:** applied the EN pattern to all 54 non-EN overviews (confined + git-verified) — removed bare-gloss transliteration parens, collapsed name pairs, and converted bare transliterated names → locale familiar (ES was bare-transliteration-heavy: Yeshua→Jesús etc.), protecting `Yeshua/Yehoshua`. Review caught + fixed one accent-boundary corruption (`\bGalil\b` matched inside DE `Galiläa` → `Galiläaäa`, 3 files). Also found (pre-existing, logged) a DE intro typo `Galiläaäischer`. Editorial-log: genesis `2026-06-06-114`, john `J-030`, matthew `M-028`. Gates: 827 · build · lint · content-lint.

**Pattern C done 2026-06-06:** glossed 26 clean foreign noun-terms across all 54 non-EN overviews (curated allowlist; literal `*token*`; confined). Fixed the grammar fallout (redundant parens, article/gender, verb agreement for *toledot*→plural). Bespoke wordplay/grammar-sensitive terms (*adamah*, *arum*, *nacham*-wordplays, *anothen*, *egeneto*, *sefer toledot*, *ti emoi kai soi*, *bene ha-elohim*, etc.) deferred (PENDING). Verification: 0 corruption/redundancy/gender-mismatch; non-overview byte-identical to HEAD; 841 tests · build · lint · content-lint. Editorial-log: genesis `2026-06-06-117`, john `J-032`, matthew `M-031`. **Phase 5 (incl. 5b) substantially complete.**

**Post-implementation audit (2026-06-06):** independent re-verification after all edits — confinement re-proven (43 chapter files, non-overview byte-identical to HEAD); all 26 terms fully glossed (the only 2 remaining `*toledot*` in overviews are the intentional gen5 `sefer toledot` reverts); 0 gender mismatches (PT/ES/DE, incl. the DE `Der Wort`→`Das Wort` fix); verb agreement confirmed (`As gerações … introduzem`, `… continuam`, `Las generaciones … continúan`). A deeper duplicate scan (catching `(A, A)` / `A — A` patterns the first pass missed) found **7 more redundancies — now fixed:** 6 `nacham` name-etymology glosses (`(consuelo/pesar, consuelo/pesar)`→`(consuelo/pesar)`; `divine regret (X — same root)`→`(same root)` ×3 locales) + DE `inneres Heiligtum (inneres Heiligtum)`. Final: CLEAN (0 dup / 0 odd-asterisk / 0 paren-imbalance) · 841 tests · build · lint · content-lint baseline.

**Post-implementation review (2026-06-06, non-EN names):** broad accent-boundary corruption scan = clean (the `Galiläaäa` fix held); confinement re-proven (only the 6 Phase-4 ES files differ outside their overview); chosen familiar forms cross-checked against project usage (ES `Jesús`, `Jacob`, `Nazaret`, `Galilea` all consistent). **Caught + fixed one real content error:** the bare-name pass had familiarized the Hebrew etymology form in PT + DE Matthew 1 (`*Jesus/Yehoshua*`) — restored to `*Yeshua/Yehoshua*` to match EN/ES (the protection only matched the exact `Yeshua/Yehoshua` string, which PT/DE formatted differently). Re-ran gates: 827 · build · lint · content-lint. Decisions: P5-Q1 = teal/petrol · P5-Q2 = defer night mode · P5-Q3 = measured/civilizational hero · P5-Q4 = roadmap + available-now.

**Done & verified:**
- **5a Color** — `--color-accent` → deep teal/petrol `oklch(0.46 0.1 213)` (compiles to `#006475`) + `--color-accent-hover` (`#005260`); body ink deepened; OG `ACCENT` hex + `TT-DESIGN-SYSTEM` swatch table updated. AA-safe, distinct from all four note hues.
- **5c Landing** — civilizational hero ("Read the originals behind two thousand years of culture") + transparency sub + broad-audience support; primary **Start reading** (teal) + **New here? Start here** (→ `/start`); rules demoted to a text link; "Three ways to read"; "who is this for" broadened (believer/skeptic/other-path); kept the strong "what translations hide" demo. i18n × 4 locales. Page metadata description updated.
- **5d Reading plan** — new `/start` page: "Why this order?" explainer + 7-step roadmap (Psalms→…→Genesis) with **available-now** links (Genesis/John/Matthew) and **coming soon** badges for the rest; landing CTA; per-segment `opengraph-image.tsx`; sitemap entry; i18n `start` namespace × 4 locales. Gated by `AVAILABLE_BOOKS` so no dead links.

Gates: **827 tests** · build (`/start` ×4 + OG) · lint · content-lint baseline. Runtime-verified: hero copy, `/start` roadmap links + coming-soon, teal accent in built CSS.

**Post-implementation review (2026-06-06):** i18n key parity confirmed across all 4 locales (no raw keys leak on `/de` home or `/es/start`). Found & fixed a CTA-consistency regression from the partial color rollout: the same **"Start reading"** action rendered teal (`bg-accent`) in the hero/`/start` but **dark (`bg-text-primary`)** at the home-page bottom, on the book landing, and on the rules page. Per the Q4 lock ("one accent for key CTAs"), unified **all primary CTAs to teal** (`bg-accent` + `hover:bg-accent-hover`) — home bottom, book-landing Start reading, rules CTA. Teal `#006475` on warm paper ≈ 6.3:1 (AA pass). Re-ran gates: 827 · build · lint · content-lint.
**Author:** Claude Opus 4.8 (1M context)
**Parent:** `docs/audit/UX_STRUCTURE_IMPLEMENTATION_PLAN.md` (Phase 5) · upstream locks `docs/design/UX-REVIEW-AND-PROPOSAL.md` (Q4 warm-paper+accent · Q5 reading plan · Q6 overviews · Q7 civilizational landing copy · Q1=C broad positioning).

## Sub-phases (each its own committable increment)

### 5a — Color system (Q4)
Produce exact OKLCH tokens: keep the warm reading surface, **deepen body ink** for stronger contrast, introduce **one confident accent** used only in chrome (active door, links, wordmark, CTAs), keep the 4 claim-type note colors. Replace the current muted amber accent (`oklch(0.55 0.15 55)`). **Night mode** = decision P5-Q2.
- Governed by `docs/design/TT-DESIGN-SYSTEM.md` (OKLCH-only, no hex, WCAG AA). Update its swatch table.

### 5b — Overview rewrites (Q6) — quick win, content
- **Book landing → tight card:** *What · When (range) · Who/attributed · To whom · Why* (4–6 lines) then "Read the full introduction →".
- **Chapter overview → de-jargoned:** plain-language key-themes; transliterations move to verse notes (e.g. Gen 1: "Order from chaos; creation by speech; … humanity in the image of God" — not *tohu vavohu*/*raqia*/*tselem* inline).
- Scope: Genesis 1–12, John 1–3, Matthew 1–3 × 4 locales (EN-first). Editorial-log each.

### 5c — Landing copy (Q7 + Q1=C)
Rewrite the home page: **civilizational hero** ("read the originals behind 2,000 years of culture") with **transparency as the method** ("the originals, shown honestly — every choice visible"); broad audience (believers, skeptics, other faiths), edge permitted, never disrespectful. Replace "five ways to dig in" with **Start reading** + **New here? Start here**. Keep the side-by-side "what translations hide" demo, surfaced sooner. i18n × 4 locales. Hero direction = decision P5-Q3.

### 5d — Reading-plan onboarding (Q5)
The plan: Psalms → Proverbs → Ecclesiastes (interleaved) → Gospels → rest of NT → Revelation → Genesis, with a "Why this order?" explainer + progress (localStorage, no DB). **Problem:** only Genesis 1–12, John 1–3, Matthew 1–3 exist; most plan books are unauthored. Scope = decision P5-Q4.

---

## Decisions to lock

### P5-Q1 — Accent color
The accent appears in chrome only (active door, links, wordmark, CTAs). Note: the **critical** note color is already red (`oklch(0.55 0.22 25)`), so an oxblood/red accent risks collision; teal/petrol is distinct from all four note hues.
- **A — Deep teal / petrol** `~oklch(0.50 0.09 215)` (recommended): calm, "confident," distinct from all note colors; modern e-reader feel.
- **B — Oxblood / deep red** `~oklch(0.45 0.13 25)`: warm, editorial, but near the critical-note red (wayfinding-vs-warning ambiguity).
- **C — Deepen the current warm amber** `~oklch(0.50 0.13 60)`: lowest-change; stays in the warm family but close to the theological note hue (80).

### P5-Q2 — Night mode
- **A — Defer night mode** (recommended): ship the light-mode token refresh now; night mode is a sizable cross-component pass (every surface + a persisted toggle) and is best as its own increment. 
- **B — Include now:** warm dark tokens + theme toggle (localStorage) + audit every component for contrast.

### P5-Q3 — Landing hero line (voice)
All are civilizational-lead, transparency-as-method, broad-audience, respectful. Pick a direction (I'll write the full body to match):
- **A:** "Read the originals behind two thousand years of culture." *(measured, civilizational)*
- **B:** "Everyone quotes it. Almost no one has read what it actually says." *(provocative, desire-first)*
- **C:** "The most influential text in history — shown exactly as it was written." *(authority + transparency)*

### P5-Q4 — Reading-plan scope (content reality)
- **A — Roadmap + available-now (recommended):** build the full plan as a visible "Start here" roadmap with the **Why this order?** explainer; make the **authored** books actionable (Genesis/John/Matthew) and mark the rest **"coming soon"** (honest, sets the vision, works today). Progress via localStorage for what exists.
- **B — Defer the reading plan** until more books exist; ship only "Start reading" on the landing now.
- **C — Minimal:** a static "Why this order?" explainer page, no progress/links, revisit when content grows.

---

## Sequencing & DoD
Recommended order: **5b overviews → 5a color → 5c landing → 5d plan** (safe content win first; color before copy so the new landing uses final tokens). Each sub-phase: `pnpm test` · build · lint · content-lint baseline; design-system swatch table updated (5a); editorial-log (5b); i18n × 4 (5c/5d); EXECUTION_HISTORY/PENDING/CLAUDE synced.

## Risks
| Risk | Mitigation |
|---|---|
| Accent collides with note colors | P5-Q1 note; teal recommended (distinct hue) |
| Reading plan promises absent content | P5-Q4=A "coming soon" honesty; no dead links |
| Landing copy drifts disrespectful | Q1 voice lock: edge allowed, never disrespectful; lead reviews copy |
| Color change regresses contrast/AA | OKLCH tokens checked vs WCAG AA; spot-check key surfaces |
