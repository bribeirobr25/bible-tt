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
- **DRY / reusability consolidation** — `docs/audit/ARCHITECTURE_DRY_AUDIT.md` (2026-06-18). DDD layering is intact; the issue is copy-paste-then-drift around the dual-label concept. **The 2 active drift-bugs are FIXED** (renderer prose-bold gap; SPECULATIVE color drift). **Still open:** (a) the 2 *latent* parser drifts (`parseConfidence`/`parseClaimType` divergence — no content triggers them today) to be fixed *by extraction*, not hand-sync; (b) the consolidation opportunities — single `domain/content/labels.ts` (parsers), `ui/shared/confidence-tone.ts` (one tone+i18n map), `<Disclosure>` component (~8 call sites), `applyEmphasis` helper (renderer), and the 1027-line `people-parser.ts` split. Each ships behind the standard gate. *(Separate but related: the renderer nested-`**…*x*…**` hardening is the item under "Minor/partial" §5.)*

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
- **Nested emphasis in body prose breaks rendering — SYSTEMATIC, cross-locale, some VISIBLE in production.** `render-markdown-safe.ts`'s bold pass is `/\*\*([^*]+)\*\*/` — its content class cannot hold a nested `*italic*`, so `**…*x*…**` in body prose renders with literal stray `*`/`**` and scrambled italics. (Emoji note/glossary headers are immune: the note parser regex `^([🔴🟢🔵🟡])\s+\*\*(.+?)\*\*` strips the outer `**`, so the inner italic renders standalone.) **Scope is far larger than first thought:** a 4-locale sweep (excluding safe note-headers) finds **~96 candidate lines (en 23 · de 25 · es 24 · pt-br 24)** — a *recurring authoring convention* of "bold lead-in label with an italic term" (`**The *waw*-consecutive system:**`, `**John 1:5 — *katelaben***`, `**Type 1 — Direct (*hina plērōthē*…)**`, `**NOT *bara***`) used across `CONTEXT.md` (background pages), `INTRODUCTION.md`, chapter cross-ref lines, and companion §-entries. **Confirmed buggy in production** via curl on `/en/john/background` and `/en/matthew/background` (visible `*…**` artifacts in the rendered HTML, all four locales affected identically). Already fixed ad-hoc (2026-06-18, committed): en john ch1 §B4/§IB-7, en genesis ch2 §D, en john ch3 § — **EN only**, so those four now have de-italicized terms while their de/es/pt-br parallels remain italic+broken (a temporary cross-locale inconsistency to resolve in the planned pass). **Plan a proper pass** — decide between two strategies: (a) **harden the renderer** to support one level of italic-in-bold (single code change + targeted tests against existing `**bold**` / `*italic*` / `***bi***` / highlight markers) — *preferred*, since it keeps the natural authoring convention and would auto-fix all ~96 + let the four EN ad-hoc fixes be re-italicized for locale parity; or (b) de-italicize all ~96 labels across 4 locales by hand. Either way also add a `content:lint` guard (split-on-`**` detector over body lines, excluding emoji/structured headers) to prevent regressions. Note: one `INTRODUCTION.md` instance (genesis §F *waw*-consecutive) did not surface in SSR curl — confirm per-context render path during planning (some intro/structured fields may be safe).
- **Redundant `Name (Name)` cleanup (v3.3.1)** — ~120 occurrences across ~30 files where the familiar form and the transliterated form coincide and collapse to `Name (Name)` (e.g. `Maria (Maria)`, `Nazareth (Nazareth)`, `David (David)`, `Tamar (Tamar)`). v3.3.1 forbids the redundant doubling — the form should appear once. Concentrated in **DE** chapters and in **PEOPLE.md across all four locales**. `content:lint` currently surfaces only 2 (de/matthew); the rest are below the lint's allow-listed threshold. Needs a per-instance human pass — most are pure redundancy to delete, but a few sit in comparison-table cells (e.g. two distinct same-named figures side by side) and are intentional. Low-priority cosmetic; no parser/UI impact.
