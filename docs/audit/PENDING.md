# Pending — Open & Queued Work

**The single forward-looking tracker.** This file lists only what is *still to be done*. It is **not** a history log — closed/resolved work lives in the editorial logs (`docs/editorial-log/`), the execution history (`docs/audit/EXECUTION_HISTORY.md`), and the archived audit records (`docs/feedback/archive/` + `docs/audit/archive/`).

**Last updated:** 2026-06-04.

---

## ⭐ Snapshot — everything open, at a glance

**Content authoring (large):**
- **Genesis 13–50 (Phase 12)** — the biggest remaining body of work. *(detail §1)*

**Source-analysis follow-ups (2026-06 cycle):**
- **Part B — companion-research process + Gen-1 §3 enrichment** — *next up*. *(detail §2)*
- **DE *mavdil* = "eine Scheidewand"** — DE locale-editor confirmation (shipped provisional). *(detail §2)*
- **Q5 — Greek John 1:1 pilot** — queued; AI-draft pending Hellenist (Rule 28). *(detail §2)*
- **Q5 — audit shipped John/Matthew against the new method** — queued. *(detail §2)*

**Cross-book / infrastructure:**
- **Cross-book canonical PEOPLE source-merge** (C3). *(detail §3)*
- **README.md staleness** — targeted ~30-min fix. *(detail §3)*
- **DE enrichment claim-type labels unrecognized** — surfaced by the Phase 2 conservation gate. *(detail §3)*
- **Chapter metadata block unparsed (all locales)** — surfaced by the Phase 4 review. *(detail §3)*

**Deferred content seeds** (drop into the named section when that book is authored): *(detail §4)*
- Akedah → Crucifixion typology → Gen 22 §F (Phase 12)
- Moses *karan* / horns → Exod 34 (Phase 14+)
- Mary-as-Ark typology → Luke 1 §F (Luke authoring)

**Minor / partial** (documented, low-priority — see `docs/feedback/archive/FEEDBACK.md`): PT-BR archaic register (item 8); non-EN em-dash sweep (deliberate future authoring); items 20/27/28 PARTIAL with documented mitigation. *(detail §5)*

**Bugs — UI (from the 2026-06-04 UX audit; see `docs/design/UX-REVIEW-AND-PROPOSAL.md` Part 2):**
- ~~Markdown not parsed in the chapter Context disclaimer~~ — **FIXED 2026-06-04** (`context-view.tsx` now renders the disclaimer via `renderInlineSafe`, matching the other enrichment views); pending commit + deploy.
- ~~People lifespan timeline overflows the mobile viewport~~ — **FIXED 2026-06-04** (`people-timeline.tsx` SVG now responsive: `width="100%"` + `maxWidth` + `viewBox`); pending commit + deploy.

**Parked (not yet triaged):** `docs/unchecked-content/achados-arqueologicos.md` — untracked candidate companion source material.

---

## 1. Genesis 13–50 (Phase 12)

Not yet authored in any locale (`content/*/genesis/` has CHAPTER-1..12 only). Scope:
- 38 chapters × 4 locales = 152 chapter files + 152 companion files.
- Prophecy files for chapters with prophetic content; Section I scenarios + categories per chapter (carry the existing 4-scenario Genesis framing).
- PEOPLE.md expansion for figures introduced in Gen 13+ (resolves several Matthew see-only stubs — Yitschaq/Ya'aqov/Yosef/Yehudah/Tamar — per the v3.3.2 cross-book convention).
- VerseRelated tables (manual per chapter). Parser auto-discovers new files; no code changes required.
- The source-analysis corpus (`docs/source-analysis/hebrew/`) + `METHOD.md` now directly support this authoring.

## 2. Source-analysis follow-ups (2026-06 cycle)

Plan: `docs/audit/SOURCE_ANALYSIS_FOLLOWUP_PLAN.md` (Part A + C executed 2026-06-04; see genesis.md Entry 2026-06-04-111).

- **Part B — companion-research process + §3 enrichment** *(next up; its own cycle):* author `docs/source-analysis/COMPANION-RESEARCH.md` (a source-analysis-driven research process for companion content at verse/chapter/book scope, building on RULES-CORE Rule 29's existing checklist), then run the Gen-1 §3 attestations through it with Rule 29 §H sourcing: raqia (Ezek 1 + cross-book count), tehom (Exod 15 / groundwater / modern-drift), merachefet (Jer 23:9 / Deut 32:11).
- **DE *mavdil* "eine Scheidewand"** — shipped provisional at Gen 1:6; needs DE locale-editor confirmation.
- **Q5 — Greek John 1:1 worked-example pilot** — proves the method ports to GS; AI-draft pending Hellenist review (Rule 28).
- **Q5 — audit shipped John 1–3 + Matthew 1–3 (Greek-source) against the new method/rules** — retroactive review once the GS adaptation + COMPANION-RESEARCH process exist.

## 3. Cross-book / infrastructure

- **C3 — Cross-book canonical PEOPLE source-merge.** The see-only-stub pattern (v3.3.2) renders + links correctly today; the deeper "fetch full bio from canonical home and merge with the in-book role" is deferred. Design considerations:
  - Slug resolution across names (Genesis `Avram` vs. Matthew `Avraham` — same person, different slugs): explicit slug pointer (`**See:** genesis/PEOPLE.md#avram`) or a `canonical-slug:`/`also-known-as:` field.
  - Build-time pre-merge (static-first) vs. render-time fetch; graceful dangling-pointer fallback for not-yet-authored homes; merge UI design; cross-locale slug normalization.
  - Est. ~6–10h implementation + ~3–5h merge-UI design. Best landed **after** Phase 12 (so all referents exist).
- **README.md staleness** — ~5 confirmed-stale lines (John PEOPLE.md status, parser count, test count, project-state snapshot, parser tree comment). ~30-min targeted fix + quick scan (Phase 13 Q4=C deferral).
- **DE enrichment claim-type labels unrecognized by the parser** — Phase 2's conservation gate surfaced the parser logging `Unrecognized claim type label: "SCHLUSSFOLGERUNG"` and `"KOMPARATIVES PARALLEL"` (German for STRONG INFERENCE / COMPARATIVE PARALLEL), silently falling back to `TEXTUAL`. Pre-existing (not introduced by Phase 2). The enrichment-parser's claim-type label map needs the German (and likely PT-BR/ES) variants added so DE companion claim-types render with correct dual-labels. Small, localized fix in `enrichment-parser.ts`; verify with the conservation gate + a parser unit test. Note: the *structured layer is faithful* — it conserves whatever the parser emits, including the TEXTUAL fallback; this is a parser-fidelity gap, not a structured-layer gap.
- **Chapter metadata block never parsed (all locales, pre-existing)** — surfaced by the Phase 4 review. `markdown-parser.ts` `extractMetadata` reads only the *preamble* (content before the first `##`), but the `**Base Text:**` / `**Methodology:**` / `**Divine Name Policy:**` / `**Edition:**` lines live inside the `## The Transparent Translation (TT)` title section. So `baseText`/`methodology`/`divineNamePolicy`/`language` come back empty and `edition`/`status` show fallbacks ("Transparent"/"provisional") for **every chapter in every locale** — the chapter metadata `<details>` is sparse everywhere. Fix: have `extractMetadata` also scan the title-section content (or include it in the preamble), with the localized label keys already present in the map; add a guard asserting `baseText` is non-empty per chapter. Not an ES- or Phase-4-specific issue.

## 4. Deferred content seeds

Audited candidates from `docs/feedback/possible-content.md` that passed Rule-3/13/29 review but fall outside current scope. Drop into the named section when that book is authored:

- **Genesis 22 — Akedah → Crucifixion typological parallels** → Gen 22 CONTEXT §F when authored (Phase 12). Labels: verbal parallels `LATER RECEPTION — PROBABLE`; the typology itself `LATER RECEPTION — POSSIBLE`. Do **not** present as TEXTUAL or as Gen-22 authorial intent. Reject the "Isaac was 33" claim (rabbinic Gen Rabbah 56:8 ≈ 37; "33" is a post-hoc retrofit). Source: possible-content Topic 1.
- **Exodus 34 — Moses *karan* (קָרַן) ambiguity + Jerome's *cornuta* + horn iconography** → Exod 34 CONTEXT (§C linguistic / §B ANE / §F reception) (Phase 14+). When Gen 22 is authored, add a forward-pointer from the "ram caught by horns" verse. Source: Topic 8.
- **Luke 1 — Mary as new Ark of the Covenant typology** → Luke 1 CONTEXT §F (Luke authoring, post-Phase 14). Labels: verbal parallels `LATER RECEPTION — PROBABLE`; the Mary-as-Ark identification `LATER RECEPTION — POSSIBLE`. Source: Topic 1.

## 5. Minor / partial (low-priority)

Documented in the archived re-audit (`docs/feedback/archive/FEEDBACK.md`):
- **Phase 5b — remaining (queued):** EN overview de-jargon **DONE 2026-06-06**; PT/DE/ES **names + bare-gloss** de-jargon **DONE 2026-06-06** (see EXECUTION_HISTORY). Book **"tight cards"** DONE 2026-06-06 (all 12 INTRODUCTION.md; landing leads with the card). *(Minor: the card content is not yet emitted into the Phase-2 structured layer — wire it in when Phase 6 search lands so cards are indexed.)* **Only remaining 5b item:** Pattern C — **inline technical-term glossing in the non-EN overviews** (*raqia*, *adamah*, *toledot*, *logos*, *pneuma*, *biblos geneseōs*, *magoi*, etc. → locale plain renderings + wordplay signposts; EN already does this; bespoke per-locale, deliberately not automated after the Phase-5b name-pass near-misses).
- **Pre-existing DE typo (found 2026-06-06):** `content/de/matthew/INTRODUCTION.md` has `Galiläaäischer` (should be `Galiläischer`/"Galilean") — predates this work (in HEAD); fix in a DE cleanup pass.
- **Phase 5 orphaned i18n keys (2026-06-06):** the landing rewrite left `landing.hook` and `landing.languageTagline` unused (joining the Phase-3 orphans `landing.howExplore/howContext/howProphecy`, `nav.exploreMode/contextMode`, `enrichment.explore*`). Harmless; sweep them in the 5b copy pass.
- **Phase 4 follow-ups (2026-06-05):** (a) **ES Tier-2 note diacritic cleanup** — the Phase-4 QA pass fixed the *main-text* continuous↔verse drift, but the probe also surfaced unaccented words inside ES Tier-2 **notes** (out of scope; e.g. es/genesis/7 note "Aqui/integro/omision/generaciónes/se cernia") — queue an ES diacritic sweep of note text. (b) **De-dup-by-derivation deferred** (unsafe — per-section name rendering + cross-verse quotation flow); revisit only if a name-rendering+quotation engine is ever built (see `CONTENT-STRUCTURE-REVIEW` Q5 revised + `PHASE_4_TEXT_QA_PLAN.md`).
- **Phase 3 follow-ups (2026-06-05):** (a) i18n keys orphaned by the 3-door collapse — `landing.howExplore`/`howContext`/`howProphecy`, `nav.exploreMode`/`contextMode`, `enrichment.explore*` — harmless but dead; sweep during the Phase 5 copy pass. (b) "Background" non-EN labels shipped (`pt-br`/`es` "Panorama", `de` "Hintergrund"); optional locale-editor confirm. (c) Verse anchors live in **Notes** only (verse-discrete); Read stays continuous (paragraphs don't map 1:1 to verses) — by design.
- **Item 8** — PT-BR archaic register cleanup (PARTIAL; concentrated in scriptural-quotation contexts).
- **Non-EN em-dash sweep** — remaining instances are deliberate future-authoring territory, not regressions.
- **Items 20 / 27 / 28** — PARTIAL with documented mitigation (John 3:16–21 speech-boundary; Section H Type-tag taxonomy; AI/editorial provenance ratio).

---

## History & closed records (not pending — pointers only)

- Per-decision rationale: `docs/editorial-log/{genesis,john,matthew,transliteration-decisions}.md`
- Completed phases/bundles + ruleset trail: `docs/audit/EXECUTION_HISTORY.md`
- Closed audit records: `docs/feedback/archive/` (38-item feedback re-audit; deferred-tasks re-audit) + `docs/audit/archive/` (phase plans)
- Remediation roadmap (Phases 0–13 specs): `docs/audit/FIX_IMPLEMENTATION.md`
