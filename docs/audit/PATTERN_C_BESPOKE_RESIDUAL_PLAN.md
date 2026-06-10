# Plan — Pattern C Bespoke Residual (non-EN overview glossing, grammar/wordplay-sensitive terms)

**Date:** 2026-06-06 (rev. 2026-06-07 after a full cross-check against `docs/rules/`, `docs/architecture/`, `docs/design/`, `docs/guides/`, `docs/editorial-log/`; rev. 2026-06-08 incorporating the independent audit `AUDIT_PATTERN_C_BESPOKE_RESIDUAL_PLAN.md`)
**Status:** ✅ **EXECUTED & GATED 2026-06-10 (committed).** All three buckets done across PT-BR/DE/ES overviews (overview-slice only, mirror-EN): **§2 bespoke** + **E-class** (folded in per lead) + **D-class** (DE main-pass leftovers). KEEP items retained (adam/adamah pair, gen12 adamah-chain marker, ruach elohim, malakh YHWH, shem, elohim, divine names). Conform-to-log honored (M-004, J-010, toledot, name policy). Confinement git-proven (a replaceAll over-reach into matthew-2 notes + a gen-11 preamble hit were caught and reverted); 841 tests · conservation chapter-overview=72 · lint · content-lint · build all green. Editorial logs: genesis `2026-06-10-118`, john `J-033`, matthew `M-032`. The two final follow-ups (overview *Iēsous*→"the Greek name", *anothen*→J-010 exact lexeme) are **also done 2026-06-10** → **overview de-jargon 100% complete** across all locales. Ships `provisional` pending Rule-28 cross-alignment review. — *Treatment decisions P-C2-Q1…Q4 were locked at the recommended defaults; the 2026-06-09 self-audit that corrected the scope counts (30/30/30=90 + E-class + D-class) is recorded in the §2 audit block.* Independently **audited 2026-06-08 → APPROVE** (`AUDIT_PATTERN_C_BESPOKE_RESIDUAL_PLAN.md`); its one substantive note (cite Rule 16 cross-supplement for the *pneuma/ruach* log entry) is folded into §3.3 + §7. A skeptical re-verification (2026-06-08) against RULES-CORE also **corrected a citation error the audit missed**: "Rule 17" was wrongly used for name-rendering/parallel-passage (Rule 17 is *Definite Article Consistency*) — name handling now cites the **v3.2 Name Rendering Policy** and cross-locale consistency cites **Rule 16 / Rule 1**.
**Author:** Claude Opus 4.8 (1M context)
**Parent:** `docs/audit/PHASE_5_UX_FINISH_PLAN.md` (Pattern C) · `docs/audit/PENDING.md` §5.

## 1. What this is

Pattern C (2026-06-06) glossed **26 clean foreign technical terms** in all 54 non-EN chapter **overview slices** by literal `*token*` substitution (e.g. *raqia* → "expanse / firmament"). It deliberately **deferred a residual of grammar/wordplay-sensitive terms** that a mechanical substitution would corrupt. This plan finishes that residual with per-term editorial judgment.

**This is content-editorial work, not mechanical** — which is why it gets a plan + lead sign-off (per the project's planning methodology) rather than direct execution.

## 2. Confirmed scope

Bespoke-term occurrences remaining in the **CHAPTER OVERVIEW slice only** (verified 2026-06-06; header per locale: `VISÃO GERAL DO CAPÍTULO` / `KAPITELÜBERSICHT` / `VISIÓN GENERAL DEL CAPÍTULO`):

| Bucket | Occurrences | In this pass? |
|---|---|---|
| **§2 bespoke** (incl. wordplay-pair tokens `adam/adamah`, `arum/arom`) | **≈96** (≈90 discrete + 6 pair-form) — symmetric 32/32/32-ish across locales | ✅ yes |
| **E-class** (missed bespoke; §2 audit) | **24** (6 terms, all 3 locales) | ✅ yes (lead-approved fold-in) |
| **D-class** (main-pass leftovers) | **≈29** — DE-capitalized cluster (`Tebah`, `Nephesh`, …) **+ cross-locale `magoi` ×9 + `toledot` ×7** | ⏭️ deferred (next, after this pass) |
| **Borderline → resolved KEEP** | `elohim` ×6 (source-critical term, parallel to YHWH — glossing destroys the Elohim↔YHWH distinction) · `malakh YHWH` ×3 (M-004 formulaic + Rule 25 divine name) | — leave |
| **Names** | `havah` (reclassified — not a name; glossed to "come/let us") · `iesous` ×3 → "the Greek name" (**done 2026-06-10**) · `yeshua/yehoshua` ×3 = KEEP (protected etymology) | ✅ done / KEEP |
| **Divine name** (Rule 25, KEEP) | `YHWH`/`JHWH` ×3 | — leave |
| **Target-language emphasis** (not transliterations) | ~18 (`a água`, `warum`, `por que`, `el contenido`, …) | — leave |

> **⚠️ AUDIT CORRECTION (2026-06-09, twice).** The original figures (26/25/29 "~80", then 27/26/30 "83") were wrong — a scan blind to **diacritics** (`*anōthen*`, `*egeirō*`, `*ēn*`) and **hyphens** (`*Lekh-lekha*`); there is **no locale asymmetry** (every §2 term is in all three locales). A second self-audit then found even the "90 / D-class 17-DE-only" figures imprecise: §2 is **≈96** (the wordplay-pair tokens weren't counted), and **D-class is ≈29** (not 17, and not DE-only — `magoi`/`toledot` span all locales). Authoritative scope now comes from a normalized (case+diacritic+hyphen-insensitive) **full categorization** of every overview italic token (the buckets above).

These are all **technical terms / verbs / idioms — NOT proper names.** Proper names are out of scope (see §3.1). Terms span two source corpora; rule governance differs (§3.3):

| Term | Corpus | Where | Why bespoke (mechanical glossing fails) |
|---|---|---|---|
| *adamah* | HB | Gen 2, 4, 12 | Feminine noun (article/adjective agreement); **wordplay with *adam*** (human↔ground) |
| *arum* / *arom* | HB | Gen 3 | **Wordplay pair** crafty↔naked — glossing one breaks the pair |
| *tardemah* | HB | Gen 2 | "deep sleep"; sits in the *adam/adamah* context |
| *sefer toledot* | HB | Gen 5 | Multi-word formula "book/account of generations" (main text already renders "generations") |
| *bene ha-elohim* | HB | Gen 6 | **Genuine ambiguity to preserve** (sons of God / divine beings) — Rule 2/3 |
| *yadon* | HB | Gen 6 | **Rule 13 UNCERTAIN** verb (abide / strive / contend) |
| *nichoach* | HB | Gen 8 | "pleasing/soothing" aroma — collocation-sensitive |
| *ba-shamayim* | HB | Gen 11 | "in the heavens/sky" — ties to the sky/heaven Rule-3 policy |
| *lekh lekha* | HB | Gen 12 | **Idiom** "go forth / go for yourself" — literal gloss misleads |
| *nivrekhu* | HB | Gen 12 | Niphal/Hitpael **ambiguity** (be blessed / bless themselves) — Rule 2 |
| *nega'im* | HB | Gen 12 | "plagues/afflictions" |
| *asah* / *qalal* / *arar* | HB | Gen 12 | **Curse-verb contrast** (*qalal* ≠ *arar*) + make/do — semantic field |
| *egeneto* | **GS** | John 1 | "became / came to be" — weighted in the prologue (Greek) |
| *ti emoi kai soi* | **GS** | John 2 | **Idiom** "what to me and to you" — literal gloss opaque (Greek) |
| *gynai* | **GS** | John 2 | Vocative "woman" — must not read as dismissive (Greek) |
| *angelos kyriou* | **GS** | Matt 1 | "messenger/angel of the Lord" — GS Article System (Greek) |
| *pneuma* (/ *ruach*) | **GS**/HB | Matt 3 | spirit/wind/breath ambiguity — Rule 2 |
| *en* / *ēn* | **GS** | John 1 — **all 3 locales** | Imperfect ἦν "was" — Greek **aspect** teaching point; EN renders it plainly ("the verb 'was' signals ongoing existence"), no translit → mirror-EN: drop translit, keep the point |
| *egeiro* / *egeirō* | **GS** | John 2 — **all 3 locales** (pt-br/de `egeirō`, es `egeiro`) | "raise / rise up" (resurrection verb); EN: "I will raise it up" → mirror-EN plain |
| *anothen* / *anōthen* | **GS** | John 3 — **all 3 locales** (×2 each) | "from above / again" — **conform to J-010** (Rule-2 slash: PT "de cima/de novo", DE "von oben/wieder", ES "de arriba/de nuevo"); drop the lingering translit, keep the slash. **Do not re-decide.** |

**Scope reconciliation vs PENDING §5 (added 2026-06-09; corrected after audit).**
- ***nacham*** → **OUT OF SCOPE.** Verified **absent from all overview slices** (any form) — already glossed in the first Pattern C pass (e.g. "(consuelo/pesar)"); PENDING §5's listing is stale. Nothing to do. ✓ (this verdict held under audit)
- ***en/ēn***, ***egeiro***, ***anothen*** → **IN SCOPE**, added above. **All three are present in all three locales** (the earlier "ES-only / pt-br-de-conform" claim was a diacritic-scan artifact — see audit block).

### ⚠️ §2 AUDIT BLOCK (2026-06-09) — two issues the first reconciliation missed

**Issue 1 — "E-class": ~8 transliterated terms per locale are still in the overviews but were absent from this §2 list entirely** (all three locales, symmetric). A diacritic-insensitive inventory of *every* italic token in the overviews found, beyond the §2 set: ***biblos geneseōs*** (Matt 1, ×3), ***egennēsen*** (Matt 1), ***egennēthē*** (Matt 1), ***ouk … alla*** (John 3), ***ouranōn*** (Matt 3), ***kopher/kippur*** (Gen 6). These are bespoke-class (Greek genealogy/grammar formulae + a Hebrew atonement wordplay) and belong in this pass. **Decision needed:** fold them into the §2 scope (recommended) — they are the same kind of work.

**Issue 2 — "D-class": a pre-existing DE regression in the *already-shipped* main Pattern C pass.** ~17 capitalized German noun-terms that the main pass *should* have glossed are still transliterated in DE genesis overviews (***Tebah*, *Nephesh*, *Qesheth*, *Tselem*, *Mabbul*, *Berit*, *Berakhah*, *Logos*, *Magoi***, …), while **pt-br and es are clean (0 each)**. Cause: the main pass matched lowercase tokens but German capitalizes all nouns, so `*Tebah*` (etc.) slipped through. Example — Gen 6: DE "eine *Tebah* (Kasten/Arche)" vs PT "uma arca (caixa/arca)" / ES "una arca (caja/arca)". This is **outside the bespoke residual** (it's main-pass cleanup) but was discovered here. **Decision needed:** fix as part of this pass, or as a separate DE-cleanup increment.

*Root cause of both the bad counts and Issue 2 is the same: case/diacritic/hyphen-sensitive matching. The authoritative scope must come from a normalized (case+diacritic+hyphen-insensitive) inventory — which is what produced the corrected figures above.*

## 3. Governing rules (cross-checked 2026-06-07)

### 3.1 Boundary — this plan governs **non-name technical terms only**
Proper names (persons, places, groups) are **out of scope** and remain governed by the **v3.2 Name Rendering Policy** (familiar form as default; transliterated-(familiar) once per section; exceptions YHWH/JHWH, Yehudim, technical terms). The plan never converts a name to a gloss; it only handles the technical terms in §2. (Confirms `transliteration-decisions.md` scope line: "governs technical terms … not proper names.")

### 3.2 Conform to existing editorial-log decisions — do **not** re-decide
For any term with a prior ruling in `transliteration-decisions.md` or a per-book editorial log, the overview rendering **must conform** to the logged decision; it does not reopen it. Confirmed relevant prior rulings:
- *sefer toledot* / *toledot* — main text renders "generations" (not transliterated); overview gloss must be consistent.
- *adamah*, *arum/arom*, *asah/qalal/arar* — not threshold-crossed; main text uses plain renderings; overview mirrors.
- *angelos kyriou* — **Matthew log M-004** classifies it as a formulaic narrative phrase (LXX/HB echo), **not** an OT quotation; no YHWH apparatus. The overview must follow M-004's framing; the "GS Article System" note in §2 is *rationale for why mechanical glossing is hard*, not a re-decision.
- *egeneto* — the John log has **no rendering-decision entry** for it (it appears only as a deferred term in the Pattern C entry J-032 and as a grammatical-aspect mention in the §734 review). If the overview gives it special treatment, **add a John editorial-log entry**; if it ends up plainly glossed like the others, the existing J-032 deferral note suffices.

### 3.3 Corpus split — HB vs GS
Hebrew terms (Genesis) are governed by **RULES-HB**; Greek terms (John/Matthew: *egeneto*, *ti emoi kai soi*, *gynai*, *angelos kyriou*, *pneuma*) by **RULES-GS** (incl. the Greek Article System for *angelos kyriou*). Both are evaluated under the same EN-parity principle (§4), but cite the correct ruleset per term in the editorial log.

**Cross-supplement term (*pneuma* / *ruach*).** This is the one genuinely cross-supplement entry: Matt 3's *pneuma* is GS, but it pairs with Hebrew *ruach*. The **Rule 16 cross-supplement-alignment extension** names this exact pair verbatim ("Hebrew *ruach* / Greek *pneuma* … target-language renderings must coordinate across supplements; **the HB glossary decision governs; GS must justify any divergence in the editorial log**"). So its log entry cites **RULES-GS (primary, Matt 3) + RULES-CORE Rule 16 cross-supplement extension**, and the overview rendering must coordinate with the Hebrew *ruach* treatment, not diverge silently.

### 3.4 Ambiguity & uncertainty (Rule 2 / Rule 3 / Rule 13)
- **Ambiguity terms** (*bene ha-elohim*, *nivrekhu*, *pneuma/ruach*): preserve **both senses** in the overview — never collapse to one (Rule 2; Rule 3 restraint cuts both ways). The guide already advertises this ("wind/spirit … the TT does not choose for you"). Overview phrasing keeps both senses (e.g. "sons of God or divine beings"); the full treatment stays in notes/companion.
- **Rule 13 UNCERTAIN** (*yadon*): render the *probable* sense in the overview with the uncertainty signposted; the alternatives stay in the note. (Distinct from Rule 2 ambiguity — do not slash-render an uncertain term as if both were equally supported.)

### 3.5 Italics (Rule 4 vs Rule 11)
A glossed plain-language rendering is **neither** a transliteration (Rule 4) **nor** a grammatical addition (Rule 11) → it receives **no italics**. `*token*` italics are retained **only** where the rendering keeps the transliteration as a wordplay signpost and **only where EN does** (e.g. EN Gen 2 keeps "(adam / adamah)"). Never touch local Rule-11 grammatical-addition italics.

### 3.6 Glossary expansion (Rule 3.3 procedure)
If the renderings would introduce inconsistency for a recurring term (3+ occurrences) or a theologically-loaded single term, follow the **CORE v3.3 §Glossary Expansion Procedure** (propose → approve → lock → log) rather than ad-hoc per-locale choices. Most residual terms are 1–2 occurrences and EN-anchored, so this is a guard, not the default path.

## 4. Guiding principle — EN parity

The 18 EN overviews were de-jargoned first (Phase 5b-EN), making the per-term call case by case:
- **Wordplay kept as a plain signpost + transliteration pair** where warranted — EN Gen 2 keeps `…between the human and the ground (adam / adamah)…`.
- **Most terms replaced with plain English** — *arum*, *qalal*, *gynai*, *bene ha-elohim* etc. do **not** appear in the EN overview (fully de-jargoned).

→ **The non-EN pass mirrors the EN overview's treatment of each term, adapted for each target language's grammar** (Rule 16 cross-language alignment; Rule 1 controlled lexical consistency). The editorial decision was largely made in EN — we port it, not re-decide it.

## 5. Method (per term, per locale)

1. Read the **EN** overview rendering (the reference) and any prior **editorial-log / transliteration-decisions** ruling (§3.2).
2. Read the **non-EN** overview sentence containing the term.
3. Port the EN treatment into the target language:
   - wordplay → plain signpost in the target language; keep the transliteration pair (italicised) only where EN does;
   - ambiguity term → both-senses phrasing (Rule 2; never collapse);
   - Rule-13 uncertain term → probable sense + signposted uncertainty;
   - idiom → meaning (literal only if EN keeps it);
   - fix grammar fallout the substitution leaves (gender/agreement, verb number);
   - apply §3.5 italics policy.
4. **Confinement:** edit the overview slice ONLY; never touch main text, Tier-2 notes, glossary, or companion §A/§D (those legitimately keep transliterations under Rule 4/13).
5. Log per book (§7).

**EN-first is already done** (it's the reference). Order: PT-BR → DE → ES.

## 6. Decisions to lock (lead audit) — ✅ ALL LOCKED 2026-06-08 at the recommended (A) defaults

- **P-C2-Q1 — Wordplay pairs (*adam/adamah*, *arum/arom*, *qalal/arar*):** (A, recommended) mirror EN exactly per term — keep the transliteration pair (italic) only where EN does, else plain signpost; or (B) uniformly keep all wordplay pairs as transliteration + gloss in all locales (diverges from EN; more visible but more jargon).
- **P-C2-Q2 — Ambiguity terms (*bene ha-elohim*, *nivrekhu*, *pneuma/ruach*):** (A, recommended) **both-senses plain phrasing** in the overview, full treatment in notes/companion; or (B) keep transliterated + parenthetical both-senses gloss. (Either way, both senses are preserved — Rule 2.)
- **P-C2-Q3 — Idioms (*lekh lekha*, *ti emoi kai soi*):** (A, recommended) render the meaning, drop the transliteration from the overview (notes keep it); or (B) keep literal + meaning.
- **P-C2-Q4 — Scope guard:** confirm overview-slice-only; names follow the **v3.2 Name Rendering Policy**, not this plan (recommended: yes).

## 7. Editorial-log entries

One entry per affected book, standard schema (per RULES-CORE §Editorial Log Specification / `transliteration-decisions.md` format):
`**Verse:**` (overview-wide, per chapter) · `**Language(s) affected:**` PT/DE/ES · `**Rule(s) invoked:**` Rule 2 / Rule 13 / Rule 14 / Rule 16 (+ the v3.2 Name Rendering Policy where a name is adjacent) + RULES-HB or RULES-GS per term (for *pneuma/ruach*, cite RULES-GS + the Rule 16 cross-supplement extension — see §3.3) · `**Decision:**` per-term overview rendering · `**Alternatives considered:**` Q1–Q3 options · `**Justification:**` EN-parity + the governing rule · `**Status:**` provisional · `**Reviewers:**` unassigned.
Anchors: genesis → next `2026-06-07-NNN`; john → next `J-0NN`; matthew → next `M-0NN`. Prefix entries e.g. "Pattern C residual — *adamah* (Gen 2/4/12)". Add a John entry for *egeneto* if treated specially (§3.2).

## 8. Verification gates (same harness as Pattern C)

- Confinement: every non-overview byte identical to pre-edit (git diff scoped to the overview slice).
- Markdown balance: even `*`, balanced parens in every edited overview; §3.5 italics policy honored.
- No redundant `X (X …)` / `(A, A)` glosses; no gender/agreement mismatch (PT/ES articles, DE der/die/das); verb agreement where number changed.
- Ambiguity preserved (no Rule-2 collapse); Rule-13 terms not slash-rendered.
- Cross-locale: chosen renderings consistent across PT/DE/ES and aligned to EN (Rule 16).
- `pnpm test` (chapter-overview conservation = **72** units = 18 chapters × 4 locales, unchanged) · `pnpm build` · `pnpm lint` · `pnpm content:lint` baseline.
- Ships as `provisional` (Rule 28); cross-alignment review mandatory when locales change.

**Design system:** overview glossing produces **plain prose**, not badges/cards/icons, so TT-DESIGN-SYSTEM §5 (color tokens) / §10 (icons) are not implicated by this plan. (Noted to close the question explicitly.)

**Reader guide (optional):** `HOW-TO-READ-TT.md` §2 says transliterated terms "are kept … explained in the notes." Since overviews now gloss some in plain language, optionally add a one-line note there that overviews prioritize plain-language flow while the main text + notes keep the transliteration. Not blocking.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Collapsing a preserved ambiguity into one sense | P-C2-Q2 = both-senses; Rule 2/3 check per term (§3.4) |
| Treating a Rule-13 uncertain term as a Rule-2 slash | §3.4 separates them; *yadon* → probable + signpost |
| Breaking a wordplay by glossing one half | P-C2-Q1 = mirror EN; treat pairs as a unit (Rule 14) |
| Re-deciding a term already logged | §3.2 conform-to-log guard (esp. *angelos kyriou*/M-004, *toledot*) |
| Wrong ruleset cited for Greek terms | §3.3 HB vs GS split in the log |
| Grammar fallout (gender/number) | per-locale agreement pass + scan (the Pattern C failure mode) |
| Scope creep into notes/main text/names | confinement gate + §3.1 name boundary |
| Drift between locales | EN-parity + cross-locale consistency scan (Rule 16) |

## 10. Estimate

In-scope this pass = **§2 bespoke ≈96 + E-class 24 ≈ 120 token-occurrences** across the three locales (was estimated "~80"; corrected by the 2026-06-09 audit). Mostly 1–2 sentences each with the EN decision already made → **~1 day**, single committable increment per book (genesis / john / matthew) or one bundle. Ships `provisional` pending Rule 28 review. *(D-class ≈29 main-pass leftovers + name-class `havah`/`iesous` are NOT in this estimate — separate increments.)*
