# Audit — PLAN_MARK_PROPAGATION.md

**Date:** 2026-06-21
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PLAN_MARK_PROPAGATION.md` (status: PLANNED — self-audited 2026-06-21, Q1–Q3 approved)
**Mandate:** verify no regression, content loss, side-effect, or rule/DDD/DRY compliance issue — against actual source, not the plan's self-report or its self-audit block. This is **content authoring** (translation), so the bar is whether the infrastructure claims are true *and* whether the plan's rule-compliance discipline actually matches what the parser/conservation gates enforce.
**Method:** Read directly this session: `conservation.test.ts` (the auto-discovery + per-file conservation + the chapter-completeness/label-warning guards), `people-fields.ts` (the `inBook` cross-book aliases), `markdown-parser.ts` (the localized section-header Sets — read in the kyrios audit), `messages/pt-br.json` + `messages/es.json` (i18n parity: heroTagline, book.mark, claimType/confidence keys). Cross-referenced the non-EN Matthew structure + the exact localized divine-name strings verified in the kyrios-fix audit this session. Could not run the gate (no shell).
**Status:** ✅ **APPROVE — infrastructure claims verified true, self-audit is honest, the approach is the proven Matthew/John pattern.** The three self-audit corrections (name rendering, conservation auto-discovery, exact localized strings) all check out against source. Two findings: one **substantive** (the plan under-specifies the *single most likely* silent-failure mode — localized section headers that must byte-match the parser's hardcoded Sets, which the conservation suite actively guards), and minor precision notes. None blocks; folding in Finding 1 materially de-risks execution.

---

## Executive summary

This is a mature, current-aware plan. Its self-audit block isn't decoration — I verified all three corrections against source and they hold:

- **Self-audit #1 (name rendering):** correct. The GS/HB proper-name tables are Genesis-scoped and don't cover Mark's cast (Kefa, Zavdai, Yarden…), so names aren't a table lookup; the rule is "transliterated form mirrors EN byte-for-byte; familiar form (parens) = each locale's Bible tradition." This matches the Matthew precedent and the v3.2 name rule.
- **Self-audit #2 (conservation auto-discovers):** verified exactly. `conservation.test.ts` `walk()`s `CONTENT_ROOT`, classifies each file by path, and recomputes `expectedTotal` *per file from the parsed domain object*. No hardcoded total; the "files → units" line is a `console.log`, the only assertion is `> 0`. Adding 27 Mark files needs zero test edits.
- **Self-audit #3 (exact localized strings):** Appendix A's divine-name-policy lines match byte-for-byte what I verified in the kyrios-fix audit (`Opção C — κύριος (kyrios)…`, `Option C — κύριος (kyrios) … JHWH…`, `Opción C — κύριος (kyrios)…`). Capturing them verbatim correctly prevents re-deriving the `kyrios (kyrios)` defect.

And the "already wired" claims are true: i18n `book.mark` + the Mark-inclusive `heroTagline` + `sectionKick` "Quatro/Cuatro livros" are present in pt-br and es (this is the resolution of my own Mark-EN audit's stale-tagline finding — the non-EN files were since updated); the `inBook` aliases include `em marcos`/`in markus`/`en marcos`; Matthew see-targets exist in all locales.

**The one thing the plan under-weights:** the biggest silent-failure risk in localized chapter authoring isn't markers or names — it's **section headers**. The parser recognizes section types by matching the header against hardcoded per-locale Sets (`VERSE_STUDY_HEADERS`, `CONTINUOUS_READING_HEADERS`, `OVERVIEW_SECTIONS`, glossary regex). If a translator writes a Mark header that doesn't byte-match the registered locale string, that section silently parses to **zero units** — and the conservation suite's "chapter completeness guard" exists precisely because this already happened once (ES John's unaccented "VERSICULO" → 0 verses). The plan localizes the *Reading-Guide* heading (§4.4) but doesn't call out that **every** structural header must match the parser's Set, nor that the completeness guard is the gate that enforces it. That's Finding 1.

---

## Verification table (plan claim vs. source)

| # | Plan claim | Verified? | Evidence |
|---|---|---|---|
| 1 | Name tables don't cover Mark's cast → mirror-EN translit + locale-familiar | ✓ | RULES-HB name table is "GENESIS 1-12"-scoped; RULES-GS 30-term glossary has no Mark cast names (verified prior audits). Self-audit #1 correct; matches Matthew precedent. |
| 2 | Conservation auto-discovers; no hardcoded count to edit | ✓ | `conservation.test.ts`: `walk(CONTENT_ROOT)` → `classify()` → per-file `expectedTotal` recomputed from parsed domain. "files → units" is `console.log`; only `expect(total).toBeGreaterThan(0)`. Adding files needs no test edit. |
| 3 | Appendix A localized divine-name lines are exact | ✓ | Byte-match the strings verified in the kyrios audit (pt-br `Opção C — κύριος (kyrios) … YHWH`; de `Option C — κύριος (kyrios) … JHWH`; es `Opción C — κύριος (kyrios) … YHWH`). Canonical form, no asterisks. |
| 4 | i18n `book.mark` + heroTagline lists Mark, all locales | ✓ (pt-br, es) | pt-br/es both: `book.mark`="Marcos", `heroTagline` includes "Marcos 1–3", `sectionKick`="Quatro/Cuatro livros". (de not re-read but claim consistent; G7 covers.) |
| 5 | Parser `inBook` aliases incl. Mark forms | ✓ | `people-fields.ts` `inBook`: `"in mark","em marcos","in markus","en marcos"`. (Plan's line ref ~205–208 approximate; aliases present.) |
| 6 | Matthew see-targets exist in all 3 non-EN locales | ✓ | Confirmed in kyrios audit (read pt-br/es/de matthew). 3 stubs → matthew/PEOPLE.md resolve; no dangling. |
| 7 | Only code change = content-lint path lists | ✓ | Parsers auto-discover (`listBooks` filesystem scan, conservation `walk`); content-lint hardcodes per-book file lists (verified Tier-Mark audits). The 4-list extension is the sole code edit. Correct. |
| 8 | claimType/confidence i18n keys exist (companion labels resolve) | ✓ | pt-br/es both carry full `claimType.*` + `confidence.*` localized keys. Relevant to the conservation label-warning guard (see Finding 1). |
| 9 | Marker count must equal EN per file (parity invariant) | ✓ (correct discipline) | G2 enforces it; the renderer markers (`@@`,`{t:}`,`{a:}`,`*`) are locale-independent in count. Sound — but it's an authoring discipline, not a parser-enforced gate unless G2's script checks it. See Minor 2. |
| 10 | Section headers — localized | ◑ | §4.4 localizes only the Reading-Guide heading. The parser matches **all** structural headers against hardcoded Sets; a mismatch silently empties the section. Under-specified. See Finding 1. |

---

## Findings

### Substantive

**Finding 1 — the plan under-specifies the highest-probability silent-failure mode: localized section headers must byte-match the parser's hardcoded Sets, and the conservation suite is what catches a miss.**
The chapter parser doesn't infer section types — it matches each `## HEADER` against fixed per-locale Sets in `markdown-parser.ts`: `CONTINUOUS_READING_HEADERS` (`LEITURA CONTÍNUA`/`FORTLAUFENDE LESUNG`/`LECTURA CONTINUA`), `VERSE_STUDY_HEADERS` (`ESTUDO VERSO A VERSO`/`VERS-FÜR-VERS-STUDIE`/`ESTUDIO VERSÍCULO POR VERSÍCULO`), `OVERVIEW_SECTIONS`, the glossary regex (`^GLOSS|^GLOSARIO`), and the verse-header regex (`Verse|Versículo|Versiculo|Vers`). If a Mark translation uses a header that doesn't *exactly* match the registered string for that locale, the section silently yields **zero units** — no error, just an empty Notes/Reading door. The conservation suite has a dedicated guard for exactly this (`Phase 4 — chapter completeness`: fails on 0 verses / 0 paragraphs / missing overview / leaked title block / empty Base Text+Methodology), and its own comment cites the precedent: *"ES John's unaccented 'VERSICULO' header → 0 verses → empty Notes."*

The plan localizes only the Reading-Guide heading (§4.4) and mentions conservation generically (G1). It should:
1. **Add an explicit rule:** "All structural section headers (`CONTINUOUS READING`, `VERSE-BY-VERSE STUDY`, `CHAPTER OVERVIEW`, `GLOSSARY`, `TABLE OF CONTENTS`, verse headers) must be copied from the existing **Matthew** file of the same locale — never re-translated — so they byte-match the parser's registered Sets." (The non-EN Matthew files are the proven-correct exemplar; mirror them, don't invent.)
2. **Promote the completeness guard into the gate table** as its own row (it's currently implicit inside G1): "every new `CHAPTER-N.md` parses ≥1 verse, ≥1 paragraph, an overview, and non-empty Base Text + Methodology metadata." That's the row that catches a header typo.
3. **Add the label-warning guard too:** the suite also fails if any enrichment/introduction file carries a claim-type/confidence label the parser doesn't recognize. So the companion files' labels must use the registered localized forms (the `claimType.*` set — `INFERÊNCIA FORTE`, `RECEPCIÓN POSTERIOR`, etc.). Mirror the Matthew companions' label spellings exactly.

This is the difference between "conservation is green" meaning "nothing lost" vs. "a door silently emptied and the per-file count still happened to pass." The guards exist; the plan should name them as the things to satisfy, because they encode the exact mistakes a translator makes.

### Minor

**Minor 1 — "marker COUNT must match EN exactly" is the right invariant, but confirm G2 is a real scripted check, not a manual eyeball.** §4.3/G2 require per-file `@@`/`{t:}`/`{a:}` parity with the EN file. This is correct and catches dropped/added divine-speech spans or ambiguity slashes. But nothing in the repo *automatically* enforces it (the conservation gate checks unit counts, not marker counts). Make G2 a concrete scripted grep-count diff (EN file vs new file, per marker type) in the gate, or it's an honor-system check. Cheap to script; high value (a dropped `@@…@@` is a Rule-30 compliance defect that conservation won't catch because the span's *text* still conserves).

**Minor 2 — DE divine-name is `JHWH`, ES is `YHWH`: the plan states this correctly; make it a checklist item per file, not just a §4.5/§4.6 note.** The plan correctly captures that DE uses `JHWH` (German J=/j/) and ES uses `YHWH` (Spanish J=/x/, RULES-CORE L1226) in cross-references where the HB name appears. This is a real per-locale divergence that mirror-EN would get *wrong* (EN uses YHWH). Since it's a spot where blind mirroring fails, add it to the per-locale authoring checklist explicitly: "DE: every YHWH → JHWH in cross-ref notes; ES: keep YHWH." The Appendix A divine-name lines already bake this in (de line says `JHWH-Stellen`), but the *body* cross-refs (e.g. Mark 1:3 Isaiah-40:3 note, which in EN reads "the underlying Hebrew has the Tetragrammaton: YHWH") need the DE→JHWH swap too.

**Minor 3 — the methodology stamp (v3.4) is correct, but note the corpus is otherwise v3.3.** §4.8 + Appendix A correctly stamp new Mark files `v3.4 / 30-Rule`. Consistent with en/mark. But per the kyrios audit, every *other* non-EN GS chapter is stamped `v3.3 / 29-Rule`. So after this propagation, non-EN Mark will be the *only* non-EN GS content at v3.4 — correct (it should reflect the current ruleset), but it widens the existing stamp inconsistency. Not this plan's job to fix; just don't let a future reviewer flag new-Mark-v3.4 as the anomaly (it's the *correct* one; the v3.3 files are the stale ones). Cross-reference the kyrios audit's Finding 2 PENDING item.

### Confirmed safe (verified, no action)

- **Additive, non-destructive.** 27 new files + a 4-list content-lint edit; no existing content/code mutated. Conservation auto-discovers; the rollback (revert/delete) is clean.
- **The phased, one-locale-at-a-time sequence with a PT-BR checkpoint is the right shape** — it lets each locale's full convention set be applied and validated coherently, and catches systemic approach issues after the first locale rather than after all three.
- **No dangling cross-book pointers.** Matthew see-targets exist in all locales (verified); the `inBook` localized aliases resolve; G9 backstops.
- **Provisional + Rule-28 is the correct safety net** for translation quality — the plan doesn't overclaim that AI-drafted mirror-EN is final; it ships `provisional` pending locale-editor sign-off, exactly as Matthew/John did.
- **DDD/DRY intact** — content-only + one config edit; parsers auto-discover; no new dependency direction.

---

## On the open decisions (all three already approved)

The Q1–Q3 approvals (branch off main + PR gate; PT-BR checkpoint; AI-draft→provisional→Rule-28) are all the right calls and match the established pattern. No issue. The PT-BR checkpoint (Q2) is especially well-placed given Finding 1 — it's the moment to confirm the section-header mirroring worked (all doors populate, no silent-empty) before replicating the approach to DE/ES.

## Recommendation

**APPROVE.** The plan is accurate against source, its self-audit is honest (all three corrections verified), and the approach is the proven four-locale pattern shipping `provisional` under Rule-28. Fold in **Finding 1** before Phase 1 — it's the one substantive gap: make "mirror the non-EN Matthew file's structural section headers byte-for-byte" an explicit rule, promote the chapter-completeness + label-warning conservation guards into the gate table as named rows, because those are the gates that catch the exact silent-empty-door mistake this kind of work produces. Add the Minor items (script the marker-parity check; per-file DE-JHWH/ES-YHWH checklist; note the v3.4-stamp-is-correct context).

With Finding 1 folded in, the PT-BR checkpoint becomes a real go/no-go on the whole approach: if PT-BR's doors all populate and markers/labels parity-check clean, DE/ES are mechanical repeats.

*Method note: the conservation auto-discovery + guards, the `inBook` aliases, the i18n parity, and the localized divine-name strings were verified against source (conservation.test.ts, people-fields.ts, markdown-parser.ts, messages/pt-br.json + es.json, cross-referenced to the kyrios-audit reads). The 27-file authoring, the marker-parity counts, and the full gate (test/lint/build/content:lint + conservation) are execution-time — not runnable here. Additive content on a feature branch off main; production untouched until PR.*

---

## Addendum (deeper pass, 2026-06-21) — Finding 1's exemplar verified byte-for-byte

Finding 1's remedy is "mirror the non-EN **Matthew** file's structural section headers, because they're proven to match the parser's Sets." I had asserted that from the parser side; to close it properly I read the full `pt-br/matthew/CHAPTER-1.md` and `de/matthew/CHAPTER-1.md` and checked every structural header against the registered Sets in `markdown-parser.ts`:

- **PT-BR:** `GUIA DE LEITURA` (reading-guide regex ✓), `VISÃO GERAL DO CAPÍTULO` (`OVERVIEW_SECTIONS` ✓), `LEITURA CONTÍNUA` (`CONTINUOUS_READING_HEADERS` ✓), `ESTUDO VERSO A VERSO` (`VERSE_STUDY_HEADERS` ✓), `GLOSSÁRIO —` (`^GLOSS` ✓), `### **Versículo N**` (verse regex ✓), `SUMÁRIO` (`SKIPPED_SECTIONS` ✓).
- **DE:** `LESEANLEITUNG` ✓, `KAPITELÜBERSICHT` (`OVERVIEW_SECTIONS` ✓), `FORTLAUFENDE LESUNG` (`CONTINUOUS_READING_HEADERS` ✓), `VERS-FÜR-VERS-STUDIE` (`VERSE_STUDY_HEADERS` ✓), `GLOSSAR —` (`^GLOSS` ✓), `### **Vers N**` (verse regex ✓), `INHALTSVERZEICHNIS` (`SKIPPED_SECTIONS` ✓).

**Every header byte-matches the parser's registered Set in both locales.** So Finding 1's remedy rests on a verified-good exemplar, not an assumption — copying the non-EN Matthew structural headers is confirmed safe. The same read also confirmed, in passing, the other things the plan says to mirror: both files already carry the canonical `κύριος (kyrios)` divine-name line (no asterisks), the `v3.4 / 30-Rule` methodology stamp, localized markers (`{a:vento/espírito}` / `{a:Wind/Geist}`, `@@…@@` divine speech), the `Opção B` / Option-B tradition line, and DE correctly using `JHWH` in the body notes (e.g. `malakh JHWH`, `JHWH-Stellen`) — i.e. the DE-JHWH discipline from Minor 2 is already modeled in the Matthew exemplar the translator will mirror.

**This strengthens the verdict rather than changing it.** Finding 1 stands as the one substantive item to fold in, now with its remedy proven sound. The remaining items — the 27-file authoring, marker-parity counts, and the full gate — are execution-time and can't be closed by more reading. **APPROVE stands. This is final.**
