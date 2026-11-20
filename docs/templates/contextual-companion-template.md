# [BOOK] [CHAPTER] — Contextual Study Companion
## The Transparent Translation (TT)

---

> **This companion file provides contextual and comparative study material. It does not redefine, expand, or control the main translation. Parallels do not prove dependence. Modern models do not define ancient intent. All entries are labeled by type and certainty and must be read as background, not as translation.**

---

**Chapter:** [Book] [Chapter]
**Language:** [Language]
**Companion to:** `[locale]/[book]/CHAPTER-[N].md` (Transparent Edition)
**Ruleset:** v3.4 (Rule 29 governs this file)
**Status:** provisional

---

## LABELING KEY

**Claim-type tags** (what kind of claim):
- **TEXTUAL** — derived directly from the source text (Hebrew Bible: Hebrew/Aramaic; Greek Scriptures: Greek)
- **STRONG INFERENCE** — logically entailed by the text, not stated explicitly
- **POSSIBLE INFERENCE** — one legitimate reading among others
- **COMPARATIVE PARALLEL** — attested in another ANE or ancient source
- **LATER RECEPTION** — post-biblical Jewish, Christian, Islamic, or philosophical reading
- **HISTORICAL / ARCHAEOLOGICAL** — based on material or historical evidence
- **SCIENTIFIC COMPARISON** — modern empirical observation compared to text
- **SPECULATION** — no strong textual or evidential basis

**Confidence levels** (how sure — per Rule 13):
- **VERIFIED** — textual fact or established scholarly consensus
- **PROBABLE** — strong evidence, wide agreement
- **POSSIBLE** — reasonable, debated
- **UNCERTAIN** — genuinely unclear
- **SPECULATIVE** — must be rare and clearly flagged
- **DOCUMENTED** — historically attested reception tradition (used with LATER RECEPTION)

---

**NOTE:** Sections A–G and I are AVAILABLE, not all mandatory. Include a section only when there is substantive, sourced content for it. Only Section H (Sources) is required for every companion file; place it last (as Genesis does — both orders parse, and 24 shipped companions still put H before I; aligning them is tracked in `docs/audit/PLAN_LAUNCH_FIXES.md` §2, batch 3). Delete any section below that has no content for this chapter.

---

## A. Source Text Features Exposed by TT

*Purely textual observations on the source text (Hebrew/Aramaic or Greek) that the Transparent Translation makes visible — features that traditional translations smooth over. No external sources needed. Include when the TT's transparency reveals features worth flagging.*

### [Feature title]
**[TEXTUAL — VERIFIED/PROBABLE/POSSIBLE]**

[Description of what the TT text reveals. Reference specific verse(s). Use "honest wording" per the enrichment governance — state what the text says, not what it "proves."]

---

## B. Ancient Near Eastern and Ancient World Parallels

*Parallels and contrasts from neighboring cultures (ANE texts for the Hebrew Bible; Second Temple Jewish and Greco-Roman sources for the Greek Scriptures). Framed as parallels, not as dependence unless evidence warrants it.*

### [Parallel title]
**[COMPARATIVE PARALLEL — VERIFIED/PROBABLE/POSSIBLE]**

[Description. Source citation required.]

**Source:** [Author, Title, Year, page(s)]

---

## C. Historical and Archaeological Context

*Ancient setting, material culture, dating debates, regional background.*

### [Topic]
**[HISTORICAL / ARCHAEOLOGICAL — VERIFIED/PROBABLE/POSSIBLE/UNCERTAIN]**

[Description. Never phrase archaeology as if it "proves" the meaning of the verse.]

**Source:** [Citation]

---

## D. Linguistic and Philological Deep Dives

*Comparative Semitics or Greek lexicography, rare words, cognates, semantic fields, syntax studies — beyond Tier 2 note space.*

### [Term or construction]
**[TEXTUAL or COMPARATIVE PARALLEL — confidence level]**

[Deep linguistic analysis.]

---

## E. Scientific Correspondence and Non-Correspondence

*What modern science observes vs. what the text presents. NEITHER concordism NOR anti-concordism. Both framings refused.*

**Interdisciplinary scanning:** Actively identify passages where the text intersects with modern fields — route each to the appropriate section (C for archaeology, D for linguistics, E for empirical science, G for interpretive intersections). Label by claim type and confidence. Present the textual claim, the modern observation, and the gap or correspondence — then stop.

### [Topic]
**[SCIENTIFIC COMPARISON — confidence level]**

[The text presents X. Modern science describes Y. They answer different questions.]

---

## F. Later Reception in Other Traditions

*How post-biblical communities read this text. Clearly labeled as reception, not as lexical fact.*

### [Tradition: Jewish / Christian / Islamic / Philosophical]
**[LATER RECEPTION — DOCUMENTED]**

[Description. Source citation required.]

**Source:** [Citation]

---

## G. Curiosities and Open Questions

*Text-linked observations. Tightly curated, no trivia pile. Each tagged with confidence.*

### [Curiosity title]
**[claim-type — confidence level]**

[Brief observation.]

---

## I. The World at the Time

*What was happening in the world when this text was written or set? Politics, trade, daily life, wars, art, philosophy — the context beyond the text itself. Include only when substantive sourced content exists.*

### [Topic]
**[HISTORICAL / ARCHAEOLOGICAL — confidence level]**

[Description covering political landscape, economy, population, military, arts, science, or religion of the period. Each sub-topic gets its own entry (I1, I2, etc.).]

> **Section I structural variants (documenting existing practice).** The flat `### [Topic]` form above is the default. Two scenario-grouped variants are also in use and are both valid — choose intentionally per book:
> - **Genesis dating-scenario form (Option C — established across Gen 1–12, 2026-06-12):** 4 `### Scenario` dating hypotheses (Mosaic / Monarchic / Exilic / Persian), each a collapsible group carrying its **scenario-level dating dual-label as a badge** (attribution folded into the heading), containing `#### I-X·n.` category sub-entries — **each with its own `**[claim — confidence]**` label** (per-category attestation confidence; claim-type uniform HISTORICAL / ARCHAEOLOGICAL, confidence calibrated from the prose: VERIFIED named artifacts · DOCUMENTED attested institutions/texts · PROBABLE interpretive links). The Gen 1 companion holds the full 4×10 grid; later chapters carry a chapter-relevant subset. **Author new Genesis chapters (Phase 12) this way.**
> - **John/Matthew `#### ` sub-dimension form:** `### SCENARIO` (a historical context, e.g. pre-/post-70 CE) → `#### IA-x` sub-dimensions, **each its own dual-labelled card** with its own claim-type + confidence. Use when each sub-dimension genuinely carries a distinct claim type. Parser-supported (`enrichment-parser.ts` `SUBENTRY_HEADER`).
>
> Section I has no Sources table of its own: every source it uses is listed in Section H.

---

## H. Sources Consulted

**Mandatory.** No unsourced claims ship.

| Source | Type | Used in sections |
|--------|------|-----------------|
| [Author, Title, Year] | [Primary / Secondary / Ancient text] | [A, B, D, ...] |

---

**Editorial provenance:** AI-assisted draft, not yet reviewed.

<!-- Template note (delete when authoring; the renderer shows HTML comments as text):
Reader-facing provenance is one plain statement per locale (Rule 28, as amended in v3.4.1), with no model, version, date, prompt or vendor detail:
  EN "AI-assisted draft, not yet reviewed." · PT "Rascunho assistido por IA, ainda não revisado." · DE "KI-gestützter Entwurf, noch nicht geprüft." · ES "Borrador asistido por IA, aún no revisado."
The full record (model identifier, version, date, prompt summary, reviewer decision) goes only in the book's editorial log, docs/editorial-log/{book}.md. -->
