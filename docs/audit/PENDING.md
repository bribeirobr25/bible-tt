# Pending — Open & Queued Work

**The single forward-looking tracker.** This file lists only what is *still to be done*. It is **not** a history log — closed/resolved work lives in the editorial logs (`docs/editorial-log/`), the execution history (`docs/audit/EXECUTION_HISTORY.md`), and the archived audit records (`docs/feedback/archive/` + `docs/audit/archive/`).

**Last updated:** 2026-06-10.

---

## ⭐ Snapshot — everything open, at a glance

**Decision gate (do first — blocks the biggest work):**
- **Genesis §I "Option C"** (per-category claim labels) — deferred decision that **gates Phase 12 Genesis authoring**; resolve before authoring Gen 13–50 §I. *(detail §3 + `GENESIS_SECTION_I_MIGRATION_PLAN.md`)*

**Content authoring (large):**
- **Genesis 13–50 (Phase 12)** — the biggest remaining body of work. *(detail §1)*

**Human review gate:**
- **Rule-28 cross-alignment sign-off** — all 2026-06 content (incl. the completed Pattern C overview de-jargon) ships `provisional`; a credentialed locale-editor / source-language reviewer must sign off to flip status. AI cross-alignment QA done 2026-06-10 (clean). *(see EXECUTION_HISTORY 2026-06-10)*

**Source-analysis follow-ups (2026-06 cycle):**
- **Part B — companion-research process + Gen-1 §3 enrichment** — *next up*. *(detail §2)*
- **DE *mavdil* = "eine Scheidewand"** — DE locale-editor confirmation (shipped provisional). *(detail §2)*
- **Q5 — Greek John 1:1 pilot** — queued; AI-draft pending Hellenist (Rule 28). *(detail §2)*
- **Q5 — audit shipped John/Matthew against the new method** — queued. *(detail §2)*

**Cross-book / infrastructure:**
- **Cross-book canonical PEOPLE source-merge** (C3). *(detail §3)*
- **Phase 6 (search)** — Pagefind; also wire book-card content into the Phase-2 structured layer. *(CLAUDE "Next up")*

**Recently completed (2026-06-10, see EXECUTION_HISTORY — not pending):** Pattern C overview de-jargon 100% complete across all locales (clean terms + bespoke residual + E-class + D-class + anothen/Iēsous follow-ups); README staleness fixed; §I `#### IA-x` decision = Option A.

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
- **⛔ DECIDE FIRST — Genesis §I "Option C"** (per-category claim labels): resolve the deferred §I-C decision (see §3) **before** authoring these chapters' §I, so the whole book uses one consistent §I structure rather than retrofitting later.
- 38 chapters × 4 locales = 152 chapter files + 152 companion files.
- Prophecy files for chapters with prophetic content; Section I scenarios + categories per chapter (carry the existing 4-scenario Genesis framing — pending the §I-C decision above).
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
- ~~**README.md staleness**~~ — **FIXED 2026-06-06.** Rewrote the "Five ways to read" section → three-door IA (Read · Notes · Deeper, with sub-tabs + `/start`); updated test count (819/8 → 841/9) and the project-state snapshot (date → 2026-06-06 + UX/Structure program summary). Parser-count lines re-verified accurate (5 files / 6 parse functions) and left as-is.
- ~~DE enrichment claim-type labels unrecognized~~ — **FIXED 2026-06-06** (2 non-standard DE labels normalized to standard forms + `KOMPARATIV` parser alias + guard test that fails on any unrecognized claim label). See EXECUTION_HISTORY.
- ~~Chapter metadata block never parsed (all locales)~~ — **FIXED 2026-06-06** (`extractMetadata` now reads the title section + substring key-matching; guard asserts Base Text/Methodology non-empty per chapter). See EXECUTION_HISTORY.
- **⛔ PREREQUISITE before Phase 12 Genesis authoring — Genesis §I "Option C" (per-category claim labels).** Decision **2026-06-08: do NOT migrate Genesis §I now (Option A)** — it is already Rule-29 compliant and renders cleanly as 4 scenario cards/chapter; migrating to a `#### ` card grid would create ~40–56 cards/chapter (the design system's banned "card soup") with no accuracy gain (Option B) (full rationale + reader-impact analysis: `GENESIS_SECTION_I_MIGRATION_PLAN.md`, DECIDED). **However, Option C** — restructure each scenario's `**I-A·n.**` categories into `#### ` sub-entries **each with its own authored claim-type + confidence label** — is the one variant with a genuine reader-accuracy upside (per-claim confidence instead of an inherited scenario-level label). **It is deferred and must be decided/done before creating new Genesis content (Gen 13–50, Phase 12)** so the whole book is authored once, consistently, with design sign-off on card density and Rule 28 cross-alignment review. Est. large (~750 category × locale judgments). *(Until then, the 8 inline-`**Source:**` multi-source blobs across Gen 4/9/10/11/12 stay inline — correct, not a bug.)*
- ~~**§I "World at the Time" `#### IA-x` sub-entries not parsed as distinct entries**~~ — **FIXED 2026-06-06.** The enrichment parser now parses `#### IA-x` as sub-entries grouped under their `### SCENARIO` entry (`EnrichmentEntry.subEntries`), routing each sub-dimension's own `**[claim — confidence]**` label + `**Source:**` + body. The Deeper/Background view (`context-view.tsx`) renders each scenario as a group heading with its sub-dimensions as individual dual-labelled cards (authored order preserved, not confidence-sorted). Conservation gate extended: group entries conserve their scenario heading, a new `enrichment-subentry` kind conserves each sub-dimension body (224 sub-entries across John/Matthew × 4 locales; Genesis flat `### Scenario` entries unaffected). No content edits. See EXECUTION_HISTORY.

## 4. Deferred content seeds

Audited candidates from `docs/feedback/possible-content.md` that passed Rule-3/13/29 review but fall outside current scope. Drop into the named section when that book is authored:

- **Genesis 22 — Akedah → Crucifixion typological parallels** → Gen 22 CONTEXT §F when authored (Phase 12). Labels: verbal parallels `LATER RECEPTION — PROBABLE`; the typology itself `LATER RECEPTION — POSSIBLE`. Do **not** present as TEXTUAL or as Gen-22 authorial intent. Reject the "Isaac was 33" claim (rabbinic Gen Rabbah 56:8 ≈ 37; "33" is a post-hoc retrofit). Source: possible-content Topic 1.
- **Exodus 34 — Moses *karan* (קָרַן) ambiguity + Jerome's *cornuta* + horn iconography** → Exod 34 CONTEXT (§C linguistic / §B ANE / §F reception) (Phase 14+). When Gen 22 is authored, add a forward-pointer from the "ram caught by horns" verse. Source: Topic 8.
- **Luke 1 — Mary as new Ark of the Covenant typology** → Luke 1 CONTEXT §F (Luke authoring, post-Phase 14). Labels: verbal parallels `LATER RECEPTION — PROBABLE`; the Mary-as-Ark identification `LATER RECEPTION — POSSIBLE`. Source: Topic 1.

## 5. Minor / partial (low-priority)

Documented in the archived re-audit (`docs/feedback/archive/FEEDBACK.md`):
- **Phase 5b — remaining (queued):** EN overview de-jargon **DONE 2026-06-06**; PT/DE/ES **names + bare-gloss** de-jargon **DONE 2026-06-06** (see EXECUTION_HISTORY). Book **"tight cards"** DONE 2026-06-06. Pattern C (non-EN inline-term glossing) **COMPLETE 2026-06-10** — the 2026-06-06 pass glossed 26 clean noun-terms; the **bespoke residual + audit-found E-class + DE D-class main-pass leftovers** are now all done across PT-BR/DE/ES overviews (mirror-EN, overview-only, git-confined; KEEP items retained per EN; conform-to-log M-004/J-010/toledot/name-policy). See EXECUTION_HISTORY 2026-06-10 + editorial logs genesis `2026-06-10-118` / john `J-033` / matthew `M-032`. Ships `provisional` (Rule 28 cross-alignment review = the gate before sign-off). The two final follow-ups are **also DONE 2026-06-10**: overview *Iēsous*→"the Greek name" (mirror-EN; *Yeshua/Yehoshua* kept; notes untouched per Rule 4) and the *anothen* overview lexeme harmonized to J-010 (PT `de cima/de novo`, DE `von oben/wieder`; ES already matched; v.31 spatial `do alto`/`von oben` left). **→ Overview de-jargon now 100% complete across all locales** (only intentional KEEPs remain: wordplay pairs, gen12 adamah-chain, ruach elohim, malakh YHWH, shem, elohim, divine names). *(Minor: book-card content not yet in the Phase-2 structured layer — wire in when Phase 6 search lands.)*
- ~~**Pre-existing DE typo (found 2026-06-06):** `content/de/matthew/INTRODUCTION.md` `Galiläaäischer`~~ — **FIXED 2026-06-06** (→ `Galiläischer`).
- ~~**Phase 5 orphaned i18n keys (2026-06-06)**~~ — **SWEPT 2026-06-06.** Removed 11 verified 0-reference keys × 4 locales (`landing.hook`, `landing.howExplore/howContext/howProphecy`, `nav.readingMode/studyMode/contextMode/exploreMode`, `enrichment.emptyExplore/exploreDisclaimer/exploreFooter`). **Correction:** `landing.languageTagline` was *not* an orphan (still used in `opengraph-image.tsx`) — kept. Verified no dynamic `t(\`nav.${mode}\`)` dependency (that path uses doorRead/Notes/Deeper). Build clean, no MISSING_MESSAGE.
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
