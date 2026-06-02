# The TT Source-Analysis Method

**Status:** Project asset (governed reference). Internal authoring document.
**Applies to:** all source languages — Hebrew, Aramaic, Greek.
**Relationship to governance:** this is the *how* behind the *what*. It operationalizes the Prime Directive and Rules 1–29 (`docs/rules/RULES-CORE.md`) at the lexeme/clause level. It does not add or modify any rule. Source-language specifics live in `RULES-HB.md` (Hebrew + Aramaic) and `RULES-GS.md` (Greek); the worked-example corpus lives in `docs/source-analysis/{hebrew,greek,aramaic}/`.

---

## 1. Stance

The method is **faith-neutral and descriptive**. It surfaces what the source text says, the full range of what it can mean, and where it stays open — then stops. It presents linguistic facts; it does not adjudicate theology. Where the analyst offers a preferred reading, that reading is flagged as opinion and kept separate from the evidence.

This is the Prime Directive stated procedurally:

- **Do not simplify what the source keeps complex** → preserve every live sense (Rule 2).
- **Do not clarify what the source leaves ambiguous** → label uncertainty honestly (Rule 13).
- **Do not import later meaning** → neither traditional theology nor anti-traditional novelty (Rule 3 + corollary).
- **Signal every addition** (Rule 11).

The goal is the *least dishonest* rendering: a reader who knows the source language should recognize its lexical, grammatical, and structural features in the result.

---

## 2. The per-lexeme process

Work a verse one lexeme at a time, in source order. For each lexeme:

1. **Cite the form** — the source-text word and its transliteration.
2. **Decompose the morphology** — separate the stem from affixes; identify what each affix contributes (article, conjunction, preposition, person/number/gender, tense/aspect/mood/voice). Note where a single source token carries several target words.
3. **State the full semantic range** — every sense the form can bear, not just the conventional one.
4. **Triangulate from attestation (concordance)** — gather other occurrences of the same form/root/lemma across the corpus and let usage constrain the meaning. Rare words get special care: enumerate every occurrence.
5. **Separate ancient from modern** — where a living descendant language exists, note where its sense has drifted from the ancient sense (see §4, epistemic caution).
6. **Contrast the traditional translation** — name what the established versions chose and what that choice adds or loses.
7. **Render twice** — a *literal* rendering that preserves source word order and structure (deliberately awkward), then a *smoothed* target rendering that stays within the honest constraints.
8. **Label confidence** — Probable / Possible / Uncertain (Rule 13) on any contested point; mark genuine unknowns as unknown.

Then read the whole verse back in the source language. Macro-structure (word count, fronting, verb–subject order, repetition, symbolic patterning) is noted *before* the word-by-word pass, because it frames the parts.

---

## 3. The analysis toolkit (universal skeleton, per-language hooks)

These are the recurring moves. Each has a language-specific realization (see the adaptation table in §4):

- **Morphological decomposition** — stem + affixes; what each grammatical marker contributes.
- **Lexical family** — relate the form to its cognates/derivatives to recover a core sense.
- **Word order & information structure** — fronting, inversion, and emphasis that target syntax may flatten.
- **Bound grammar in one token** — articles, conjunctions, prepositions, and pronouns fused into a single source word, which the target must unpack (and mark per Rule 11 when it adds words).
- **Number, gender, agreement** — distinctions the target may not carry; flag when theologically or referentially loaded (Rule 27).
- **Verb system** — the tense/aspect/mood/voice distinctions the source encodes (Rule 8/9).
- **Repetition & doubling** — root-doubling, synonym pairing, formulaic frames kept for effect (Rules 6, 7).
- **Cardinal vs. ordinal, idiom, construct** — small distinctions that carry meaning (Rules 17, 18; §Idiom Policy).
- **Reading-tradition layers** — vocalization/pointing and variants treated as layered tradition, not the base text (Rule 26).

---

## 4. Per-language adaptation table

The skeleton is constant; its realization differs by source language. The Aramaic column has **no separate ruleset** — its substance and governance live in `RULES-HB.md §Aramaic Appendix`.

| Step / hook | Hebrew (RULES-HB) | Greek (RULES-GS) | Aramaic (RULES-HB §Aramaic Appendix) |
|---|---|---|---|
| Identify lexeme + morphology | 3-consonant **root** placed in a *binyan* (mold) + *nikud* | **lemma** + inflection (tense·voice·mood / case·number·gender) | Semitic root, close to Hebrew; Aramaic-specific verb forms noted |
| Verb system | qatal/yiqtol + **converting-vav** (future↔past); jussive | **aspect-primary** (aorist/present/perfect), not tense; middle voice | shares much with Hebrew; note divergences |
| Bound grammar in one token | prefixes *be-/le-/ha-/va-/me-* | proclitic article, prepositions; article *presence/absence* is meaningful (GS §Greek Article System) | Hebrew-like prefixes |
| Reading-tradition layer | Tiberian *nikud* + cantillation (ketiv/qere) | NA28 main text + apparatus variants | Masoretic pointing (Aramaic sections of the MT) |
| Attestation corpus | Tanakh | NT + LXX (with care) | Daniel 2:4b–7:28, Ezra 4:8–6:18 / 7:12–26, Gen 31:47, Jer 10:11 |
| Traditional-translation contrast | KJV / Almeida / Luther / Reina-Valera | + Vulgate | as Hebrew |
| **Living-language comparand** | Modern Israeli Hebrew — a *strong* heuristic, but see caution below | **no** living Koine — Modern/Patristic Greek only, with caution | Neo-Aramaic / Syriac, with caution |

### Epistemic caution on the living-language comparand

A living descendant language **generates hypotheses; it never evidences meaning.** Modern Hebrew carries 2,000+ years of semantic drift; treating its sense as authoritative for Biblical Hebrew would import anachronism — exactly the move Rule 3 forbids. The same applies, more weakly, to Modern/Patristic Greek and Neo-Aramaic. Use the living language to *notice* a possibility, then test it against ancient attestation (§2.4). State the modern sense and the ancient sense as distinct (e.g. a word whose modern sense is "chasm" but whose ancient attestation points to "mass of water"). This caution travels with the method into every language.

---

## 5. How the analysis feeds the TT

Source-analysis output is raw material; it is routed by the rules, never copied wholesale:

- **Tier 1 main text** — the smoothed rendering, subject to all rules.
- **Tier 2 notes** — the contested points: ambiguity (Rule 2), morphology, wordplay, uncertainty labels — max 3 sentences, excess relocated (Rule 29 §734).
- **Tier 3 companion §A (source-text features) / §D (linguistic deep dives)** — the fuller attestation/etymology work.
- **Editorial log** — any decision that deviates from a default, resolves an ambiguity, or sets a policy (RULES-CORE §Editorial Log Specification).
- **Glossary** — recurring loaded terms enter via the Glossary Expansion Procedure.

**Strict boundary:** the analyst's preferred reading is never promoted to Tier 1 as fact; the corpus notes feed the rules, and the rules decide.

---

## 6. Worked-example corpus format

The corpus (`docs/source-analysis/<language>/`) holds **structured per-verse notes** distilled from source analysis (one file per verse or short verse-group). Each significant lexeme uses this schema:

```
### <transliteration>  — <source form>
- **Morphology:** stem/root + affixes; what each marker contributes
- **Range:** every live sense
- **Attestation:** key occurrences elsewhere (with references) that constrain the sense
- **Ancient vs. modern:** drift note, if a living comparand applies
- **Traditional rendering:** what established versions chose; what it adds/loses
- **Literal:** word-order-preserving rendering
- **Smoothed:** target rendering
- **Confidence:** Probable / Possible / Uncertain (+ note)
- **TT status:** where this is already encoded (glossary / editorial-log entry / companion §), if applicable
```

The corpus is **internal working material**. It is never quoted verbatim into user-facing content, and it carries no contributor name or persona (see `README.md`). Its purpose is to feed authoring (Tier 1/2 + companion §A/§D) and to make source-language reasoning auditable.
