# Pending — Open & Queued Work

**The single forward-looking tracker.** Lists only what is *still to be done*. Closed work lives in the editorial logs (`docs/editorial-log/`) and the execution history (`docs/audit/EXECUTION_HISTORY.md`).

**Last updated:** 2026-06-18.

---

## ⭐ Snapshot — everything open, at a glance

**Content authoring (largest):**
- **Genesis 13–50 (Phase 12)** — the biggest remaining body of work. *(detail §1)*

**Human review gate:**
- **Rule-28 cross-alignment sign-off** — all 2026-06 content ships `provisional` (incl. the Pattern C overview de-jargon and the **§I Option C per-category labels**); a credentialed source-language scholar / locale-editor must sign off to flip status. AI QA is done; the §I per-category confidence labels are the specific item the source scholar reviews. *(see EXECUTION_HISTORY 2026-06-10 + 2026-06-12)*

**Source-analysis follow-ups (2026-06 cycle):** *(detail §2)*
- **Part B — companion-research process + Gen-1 §3 enrichment** — *next up*.
- **DE *mavdil* = "eine Scheidewand"** — DE locale-editor confirmation (shipped provisional).
- **Q5 — Greek John 1:1 pilot** — queued; AI-draft pending Hellenist (Rule 28).
- **Q5 — audit shipped John/Matthew against the new method** — queued.

**Cross-book / infrastructure:** *(detail §3)*
- **Cross-book canonical PEOPLE source-merge** (C3).
- **Phase 6 (search)** — Pagefind; also wire book-card content into the Phase-2 structured layer.
- **DRY / reusability consolidation** — `docs/audit/ARCHITECTURE_DRY_AUDIT.md` (2026-06-18). DDD layering is intact; the issue was copy-paste-then-drift around the dual-label concept. **Done:** the 2 active drift-bugs (renderer prose-bold gap; SPECULATIVE color drift) + glossary literal-`*`; **Tier 1 — renderer nested-emphasis hardening** (`PLAN_RENDERER_NESTED_EMPHASIS.md`, 2026-06-19: `applyEmphasis` 4→1, tempered bold regex, table-cell pipeline, `content:lint §0.14` guard); **Tier 2 — dual-label SSOT** (`PLAN_DUAL_LABEL_SSOT.md`, 2026-06-19: `domain/content/labels.ts` merged the 4 `parseConfidence`/3 `parseClaimType`/`people` arrays/extraction regexes — folding in the 2 latent parser drifts — and `ui/shared/confidence-tone.ts` unified the tone + i18n-key maps + person-card `ClaimBadge`; R1 resolved-value diff = 0). **Tier 3 DONE (2026-06-19, `PLAN_TIER3_REUSABILITY.md`):** WS1 shared `<Disclosure>` (9 sites; DOM-equivalent), WS2 `people-fields.ts` split (people-parser 948→560). WS3 dropped (parser Finding 5 was false-DRY — divergent/coincidental regexes; only `SOURCE_LABELS` safe-but-marginal). **Tier 4 code DONE (2026-06-20, `PLAN_TIER4_CODE_DRY.md`):** `<Disclaimer>` + `<SourceLine>` extracted (UI Finding 5a/b); one `NOTE_TYPE_TOKENS` map (UI Finding 6); `parseCrossBookSlug` → parser-emitted `crossBookSeeBook` (DDD-Low S2a); people `sources` cleanup → parser (S2b). **Deferred/not done:** `chapter-shell` `statusShort` (S2c — domain-field-for-presentation, worse DDD); route BookContext motifs through `EnrichmentEntryCard` (UI Finding 5c, optional); the redundant `Name (Name)` pass (**Tier-4 Strand 3 — DONE 2026-06-20**, `PLAN_TIER4_NAME_DEDUP.md`: 118 `X (X)`→`X` across 4 locales, §0.11 cleared; no intentional-exception cases existed). **kyrios Divine-Name metadata — DONE 2026-06-20** (`PLAN_KYRIOS_DIVINE_NAME_FIX.md`, audited APPROVE; commits `df0004f` + `d73748f` on `tier4-name-dedup`): restored canonical `κύριος (kyrios)` (Greek + translit, plain/no-asterisks — NOT collapsed to `kyrios`) across the 16 `kyrios (kyrios)` doublings **plus** 2 newly-discovered bare-`kyrios` chapters (de/matthew 2-3). **All 27 GS divine-name lines now uniform.** Gates green (882 tests, conservation 11831). `person-card`'s `tt-person` disclosure intentionally not unified.

**GS methodology-stamp drift (systematic, found during kyrios audit 2026-06-20):** the L9 Methodology stamp reads `30-Rule … (Ruleset v3.4)` in **only** `en/mark/CHAPTER-{1,2,3}`; every other GS chapter — all en/john, en/matthew, and all of de/es/pt-br john+matthew — still reads `v3.3` (29-Rule), never re-stamped when v3.4/Rule 30 shipped. Same staleness class as the prior landing-string drift but corpus-wide. Needs **one coordinated re-stamp sweep** (not piecemeal); deferred. Out of scope for the kyrios fix.

**Deferred content seeds** (drop in when that book is authored): *(detail §4)*
- Akedah → Crucifixion typology → Gen 22 §F (Phase 12)
- Moses *karan* / horns → Exod 34 (Phase 14+)
- Mary-as-Ark typology → Luke 1 §F (Luke authoring)
- DAAT idiom + Yeshua "siblings" draft (`DAAT_IDIOM_AND_JESUS_BROTHERS_PLAN.md`) — awaiting project-lead audit.

**Minor / partial** (low-priority): *(detail §5)*

**Parked (untriaged):** `docs/unchecked-content/achados-arqueologicos.md` — candidate companion source material (untracked; not yet reviewed).

---

## 1. Genesis 13–50 (Phase 12)

Not yet authored in any locale (`content/*/genesis/` has CHAPTER-1..12 only). Scope:
- 38 chapters × 4 locales = 152 chapter files + 152 companion files.
- **§I "World at the Time" uses the Option C structure now established across Gen 1–12** — collapsible dating scenarios with per-category `**[claim — confidence]**` labels (Gen 1 = full 4×10 grid; later chapters = subsets). Author new chapters' §I to match; calibrate per-category confidence from the prose (VERIFIED named artifacts · DOCUMENTED attested institutions/texts · PROBABLE interpretive links), shipping `provisional` for the Rule-28 source review.
- Prophecy files for chapters with prophetic content.
- PEOPLE.md expansion for figures introduced in Gen 13+ (resolves several Matthew see-only stubs — Yitschaq / Ya'aqov / Yosef / Yehudah / Tamar — per the v3.3.2 cross-book convention).
- VerseRelated tables (manual per chapter). Parser auto-discovers new files; no code changes required.
- The source-analysis corpus (`docs/source-analysis/hebrew/`) + `METHOD.md` directly support this authoring.

## 2. Source-analysis follow-ups (2026-06 cycle)

(Part A + C executed 2026-06-04; see genesis.md Entry 2026-06-04-111.)

- **Part B — companion-research process + §3 enrichment** *(next up; its own cycle):* author `docs/source-analysis/COMPANION-RESEARCH.md` (a source-analysis-driven research process for companion content at verse/chapter/book scope, building on RULES-CORE Rule 29's checklist), then run the Gen-1 §3 attestations through it with Rule 29 §H sourcing: *raqia* (Ezek 1 + cross-book count), *tehom* (Exod 15 / groundwater / modern-drift), *merachefet* (Jer 23:9 / Deut 32:11).
- **DE *mavdil* "eine Scheidewand"** — shipped provisional at Gen 1:6; needs DE locale-editor confirmation.
- **Q5 — Greek John 1:1 worked-example pilot** — proves the method ports to GS; AI-draft pending Hellenist review (Rule 28).
- **Q5 — audit shipped John 1–3 + Matthew 1–3 (Greek-source) against the new method/rules** — retroactive review once the GS adaptation + COMPANION-RESEARCH process exist.

## 3. Cross-book / infrastructure

- **C3 — Cross-book canonical PEOPLE source-merge.** The see-only-stub pattern (v3.3.2) renders + links correctly today; the deeper "fetch full bio from the canonical home and merge with the in-book role" is deferred. Considerations: slug resolution across names (Genesis `Avram` vs. Matthew `Avraham` — same person, different slugs) via an explicit slug pointer or a `canonical-slug:` / `also-known-as:` field; build-time pre-merge (static-first) vs. render-time fetch; graceful dangling-pointer fallback; merge-UI design; cross-locale slug normalization. Est. ~6–10h impl + ~3–5h merge-UI design. Best landed **after** Phase 12 (so all referents exist).
- **Phase 6 — search.** Pagefind (static, free-tier). Also wire book-card content into the Phase-2 structured layer (currently not represented there).

## 4. Deferred content seeds

Drop into the named section when that book is authored:

- **Genesis 22 — Akedah → Crucifixion typological parallels** → Gen 22 CONTEXT §F (Phase 12). Labels: verbal parallels `LATER RECEPTION — PROBABLE`; the typology itself `LATER RECEPTION — POSSIBLE`. Do **not** present as TEXTUAL or as Gen-22 authorial intent. Reject the "Isaac was 33" claim (rabbinic Gen Rabbah 56:8 ≈ 37; "33" is a post-hoc retrofit).
- **Exodus 34 — Moses *karan* (קָרַן) ambiguity + Jerome's *cornuta* + horn iconography** → Exod 34 CONTEXT (§C linguistic / §B ANE / §F reception) (Phase 14+). When Gen 22 is authored, add a forward-pointer from the "ram caught by horns" verse.
- **Luke 1 — Mary as new Ark of the Covenant typology** → Luke 1 CONTEXT §F (Luke authoring, post-Phase 14). Labels: verbal parallels `LATER RECEPTION — PROBABLE`; the Mary-as-Ark identification `LATER RECEPTION — POSSIBLE`.
- **DAAT idiom + Yeshua "siblings"** — `docs/audit/DAAT_IDIOM_AND_JESUS_BROTHERS_PLAN.md` (DRAFT, awaiting project-lead audit).

## 5. Minor / partial (low-priority)

- **Tier-2 note-bloat propagation** — the Rule 29 §734 3-sentence-cap relocation was piloted on Gen 9 and propagated to Gen 6 / John 2 / Matthew 1 (2026-05-18); ~17 Genesis chapters remain at the same trajectory. Deferred, low-priority.
- **ES Tier-2 note diacritic sweep** — unaccented words inside some ES Tier-2 *notes* (e.g. es/genesis/7 "Aqui / integro / omision"); out of the Phase-4 main-text scope.
- **Item 8** — PT-BR archaic register cleanup (PARTIAL; concentrated in scriptural-quotation contexts).
- **Non-EN em-dash sweep** — remaining instances are deliberate future-authoring territory, not regressions.
- **Items 20 / 27 / 28** — PARTIAL with documented mitigation (John 3:16–21 speech-boundary; Section H Type-tag taxonomy; AI/editorial provenance ratio).
- **Book-card content not yet in the Phase-2 structured layer** — wire in when Phase 6 search lands.
- *(Resolved 2026-06-19 — moved to EXECUTION_HISTORY: the glossary literal-`*` fix and the renderer nested-emphasis hardening, Tier 1. The renderer now supports one level of italic-in-bold, auto-fixing the ~96 cross-locale lines; the `content:lint §0.14` guard prevents regressions.)*
- **Redundant `Name (Name)` cleanup (v3.3.1)** — ~120 occurrences across ~30 files where the familiar form and the transliterated form coincide and collapse to `Name (Name)` (e.g. `Maria (Maria)`, `Nazareth (Nazareth)`, `David (David)`, `Tamar (Tamar)`). v3.3.1 forbids the redundant doubling — the form should appear once. Concentrated in **DE** chapters and in **PEOPLE.md across all four locales**. `content:lint` currently surfaces only 2 (de/matthew); the rest are below the lint's allow-listed threshold. Needs a per-instance human pass — most are pure redundancy to delete, but a few sit in comparison-table cells (e.g. two distinct same-named figures side by side) and are intentional. Low-priority cosmetic; no parser/UI impact.
