# Pivot-Translation Fidelity Audit (PT-BR / DE / ES)

**Date:** 2026-06-23
**Author:** claude-opus-4-8 (1M) — AI-assisted; provisional, not a Rule-28 sign-off.
**Question (from project lead):** The EN edition is translated **directly from the Hebrew/Greek** under the full ruleset. PT-BR, DE, and ES are produced as **mirror-translations of the EN** ("pivot" / relay translation). Does pivoting through English make the other locales less accurate than a direct-from-source translation would be? Run real checks and report.

---

## 1. Why the concern is theoretically sound

Pivot (relay/indirect) translation is a recognised risk multiplier. Translating source→EN→target instead of source→target can:

1. **Compound lexical drift** — EN picks word *A* for Greek *X*; the target picks *B* for EN *A*; *B* can land further from *X* than a direct pick would.
2. **Lose or flatten ambiguity** — if EN resolves a source ambiguity, the target inherits the resolution, not the ambiguity.
3. **Re-naturalise grammar/word-order** through the intermediary.
4. **Carry English-specific grammatical crutches** into a target that doesn't need them (the classic artifact).

**Mitigants specific to TT:** the EN is deliberately *source-calqued*, not idiomatic; and most fidelity-bearing freight rides in **machine-checkable markers** that survive a pivot — `{a:…}` (preserved ambiguity), `{t:…}` (strategic transliteration), `*italics*` (Rule 11 additions), `@@…@@` (divine speech), plus the rule-and-table-governed divine name and proper names. The open question is therefore the **prose between the markers**.

---

## 2. Method — a controlled experiment

**Design:** hold the translator constant; vary only the source path.

- For 3 passages × 3 target languages (9 cells), a **blind agent** translated **directly from the Hebrew/Greek**, given only the source text + a faithful distillation of the ruleset, and **explicitly denied** sight of the EN or the existing target.
- Each blind output was then diffed against the **shipped** (mirror-from-EN) file.
- Same model on both paths ⇒ any material divergence is attributable to the **source path**, which is exactly the variable under test.

**Passages** (chosen to span genre + source language + rule pressure):

| Passage | Source | Stress-tests |
|---|---|---|
| Genesis 1:1-3 | Hebrew | HB glossary, `ruach` ambiguity, verbless clauses, participle `merachefet`, divine speech |
| John 1:1-5 | Greek (prose) | Greek article system (1:1c anarthrous predicate), aspect, the 3/4 punctuation crux, `katelaben` ambiguity |
| Luke 1:46-50 | Greek (Hebraic poetry) | divine name (Option C `kyrios`), aorist/present aspect, substantivised adjective `ho dynatos`, copula additions |

**Caveats (stated up front):**
- Same model family on both paths → shares model biases; a human source-expert could surface more. This is a **lower bound**, not a ceiling.
- The three passages are *famous* → unusually well-represented in training, so the model renders them more reliably than obscure passages would be. Obscurer text would likely show **more** drift, not less.
- The Greek-passage prompts lightly named two known cruxes (`katelaben`, the `ho dynatos` filler). So "blind preserved X" on those two is partly led — but every **shipped-file defect below is an objective fact about the committed files, independent of any priming**, and the `ho dynatos` prompt told *all three* languages not to add a filler, yet only one shipped one.
- n = 1 sample per cell (no multi-sample for stochastic variance).

---

## 3. Headline result

**The concern is valid in principle and is confirmed by one clean, unambiguous example — but the observed magnitude is modest, and the pivot preserved essentially all of the fidelity-bearing material.** In 6 of 9 cells the blind direct translation matched the shipped text *in substance*; in 2 cells the **shipped EN-derived text was actually better** than the blind direct attempt; and the defects that did appear cluster into a small, fixable set.

---

## 4. The one clear pivot artifact (validates the concern)

**Luke 1:49 — DE `der Mächtige *Eine*`.** Greek `ὁ δυνατός` is a substantivised adjective ("the Powerful-one"). EN must prop it with a noun → "the Mighty **One**", and marks the added "One" with Rule 11 italics. The DE pivot translated that English crutch **literally** → `der Mächtige *Eine*`, which is **ungrammatical/unidiomatic German**: German substantivises the adjective by itself ("der Mächtige" already = "the Mighty One").

- **Blind DE-from-Greek produced `der Mächtige`** and explicitly noted that adding "Eine" "would be an English-driven artifact and wrong German."
- **Control:** PT and ES did **not** make this error — they correctly dropped the filler (`o Poderoso` / `el Poderoso`). A corpus sweep for the calqued-"One" class (`*Eine*`/`*Einer*`/`*Eins*` in DE; `*Um*`/`*Uno*` in PT/ES) returns **3 hits, all in `de/luke/CHAPTER-1.md` (lines 77, 686, 691); 0 in PT/ES.**

This is the textbook pivot artifact: an English-specific grammatical addition carried into a target that doesn't need it. It is sporadic (one verb, one locale), but it is exactly the failure mode the project lead hypothesised, and it is **proof the risk is real, not theoretical.**

---

## 5. Probable pivot-influenced drift (judgment call)

**Genesis 1:2 — PT `pairando` (gerund) vs the rulebook's own `pairava` (finite).** Hebrew `מְרַחֶפֶת` (Piel participle). The shipped PT uses `pairando`, mirroring EN "hovering". But:
- The project's **own canonical worked example** in `RULES-CORE.md` (the Gen 1:2 quadrilingual table) prescribes PT **`pairava`** (finite imperfect).
- The **blind PT independently chose `pairava`**, noting a gerund would need an added auxiliary ("estava pairando") and is thus a higher-intervention choice.

So shipped PT diverges from the rulebook example toward the EN "-ing" shape. **DE is a useful contrast:** shipped DE `schwebend` also diverges from the rulebook's `schwebte`, **but the blind DE agreed with the shipped `schwebend`** (durative participle), giving it independent justification. So PT is the weaker case (shipped disagrees with both rulebook and blind); DE is defensible (shipped disagrees with rulebook but agrees with blind). → **Flag PT for editor review; DE acceptable.**

**Luke 1:48 — `ταπείνωσιν` rendered as the virtue "humility" in PT/ES.** Greek `ταπείνωσις` = low *estate*/humiliation (a condition), distinct from the virtue `ταπεινοφροσύνη`. EN "lowliness" and DE "Niedrigkeit" capture the condition correctly. Shipped PT `humildade` / ES `humildad` drift toward the **virtue** reading; the blind PT/ES chose the sharper `humilhação`/`humillación` (condition). A subtle accuracy nuance, plausibly pivot-influenced (EN abstract noun → nearest target cognate). → **Flag for editor review (low severity).**

---

## 6. Locale-level errors the experiment surfaced (not strictly pivot-caused, but real)

These are orthographic/grammatical slips, not relay artifacts — but the audit found them and they should be fixed:

| # | Locale / file | Issue | Should be | Count | Note |
|---|---|---|---|---|---|
| E1 | ES `luke/CHAPTER-1.md` (Lk 1:47) | `se exultó` (erroneous pronominal) | `exultó` | 4 | `exultar` is intransitive; blind ES + shipped PT both use the non-reflexive form |
| E2 | ES `john/CHAPTER-1.md` (Jn 1:4) | `en el era vida` (missing accent) | `en él era vida` | verse + 2 companion repeats | meaning-distorting: "in **the** was life" vs "in **him** was life" — **pre-existing, predates Luke** |
| E3 | ES `john/CHAPTER-1.md` (Jn 1:3) | `aparte de el ni` | `de él` | 2 | same missing-accent class — **pre-existing** |
| E4 | ES `genesis/CHAPTER-1.md` (Gn 1:2) | `se cernia` (missing accent) | `se cernía` | 2 | **pre-existing**; also marks `*se cernía*` as a Rule-11 addition, which is questionable |

**Lint-coverage gap behind E2-E4:** `content:lint §0.3` (ES diacritic loss) scans only the **ES NT** dirs (`john/matthew/mark/luke`), so **`es/genesis` is never diacritic-checked** (E4 invisible to lint); and its pattern set does not detect the `el`→`él` / `de el`→`de él` pronoun class (E2/E3 invisible). The diacritic guard is narrower than its name implies.

---

## 7. Where the pivot held up — and where it beat a direct translation (fairness)

The experiment is only credible if it reports the misses *and* the hits. The pivot performed well on the hard, fidelity-critical material:

- **Divine name (Option C):** `kyrios` "the Lord" handling is parity **13/13/13/13** across EN/PT/DE/ES Luke 1. No drift.
- **Preserved ambiguity survived the pivot.** The EN resolves `κατέλαβεν` to "overcome" in the main text **but carries a CRITICAL Tier-2 note** preserving both senses (overcome / comprehend, both *Probable*, "a genuine Rule 2 ambiguity"). That note **propagated intact** to all three targets (comprehend-sense hits: PT 2, DE 8, ES 2). The ambiguity is *not* lost in the locales — it lives in the note exactly as in EN. (Whether the main text *should* be a `{a:}` slash rather than a resolution is an **EN-level** Rule-28 question, not a pivot defect.)
- **The hardest crux was handled consistently and correctly.** The John 3/4 punctuation crux ("What has come into being…") attaches to v4 in all shipped locales — and **every blind agent independently made the same attachment.**
- **Substantivised adjective:** PT `o Poderoso` / ES `el Poderoso` correctly drop the filler — matching their blind counterparts (only DE slipped; §4).
- **Two cases where shipped (EN-derived) beat the blind direct attempt:**
  - *John 1:1c.* Shipped main text is the restrained "the word was God / a palavra era Deus / das Wort war Gott / la palabra era Dios" **plus a full Colwell/qualitative Tier-2 note**. The blind agents *over-translated* the main text (e.g. PT inserted "Deus *em natureza*"), which violates Rule 3 (no imported theology) — the EN's restraint + note is the more correct TT behaviour, and the pivot carried it faithfully.
  - *John 1:5 / κατέλαβεν.* Same pattern — the EN's main-text resolution + note is a deliberate, rule-compliant editorial decision; the blind agents would have forced a `{a:}` slash. Reasonable people differ, but "blind ≠ better" here.

**Interpretation:** when the EN encodes a careful editorial decision (a Tier-2 note, a restrained main text), the faithful pivot *transmits that quality*. A naïve direct translation can actually regress by re-litigating settled cruxes or over-marking. The pivot's faithfulness is a feature for the 90% — and a liability only where it faithfully copies an English-specific form (§4) or an EN-level under-marking.

---

## 8. Verdict

| Dimension | Finding |
|---|---|
| Is the concern valid? | **Yes, in principle**, and **confirmed** by one clean example (DE `der Mächtige *Eine*`). |
| Observed magnitude | **Modest.** 1 clear pivot artifact + 1 probable style-drift across 9 cells; the rest is locale orthography or EN-level questions. Markers, divine name, the punctuation crux, and the ambiguity *notes* all survived the pivot. |
| Is the pivot acceptable as a **drafting** method? | **Yes** — it is cost-efficient and mostly faithful, and it transmits the EN's careful editorial decisions. |
| Is the pivot safe as a **final** method? | **No, not on its own.** The artifacts it produces (calqued English crutches; faithfully-copied EN under-markings) are precisely the things a source-anchored review catches and an English-anchored review does not. |

**The single most important takeaway:** the Rule-28 sign-off for PT/DE/ES must be performed **against the original Hebrew/Greek, not against the English.** An English-anchored review would have waved through `der Mächtige *Eine*`. The pivot is fine for the draft; the *review* is where source-anchoring is non-negotiable.

---

## 9. Recommendations

**A. Mechanical fixes (unambiguous; no interpretation needed)** — can be applied immediately:
- DE Luke 1:49: `der Mächtige *Eine*` → `der Mächtige` (3×, `de/luke/CHAPTER-1.md`).
- ES Luke 1:47: `se exultó` → `exultó` (4×, `es/luke/CHAPTER-1.md`).
- ES John 1:3-4: `en el era` → `en él era`; `de el ni` → `de él ni` (`es/john/CHAPTER-1.md`).
- ES Genesis 1:2: `se cernia` → `se cernía` (2×, `es/genesis/CHAPTER-1.md`); review the `*se cernía*` italic.

**B. Rule-28 / editor-judgment items (do not self-resolve):**
- PT Genesis 1:2 `pairando` vs rulebook `pairava`.
- PT/ES `ταπείνωσις` "humility" vs "lowliness/humiliation".
- EN-level: whether John 1:5 `κατέλαβεν` should be a main-text `{a:}` slash rather than a resolution-plus-note (decide at EN, then propagate).

**C. Process — de-risk the pivot going forward:**
1. **Anti-calque reverse-check** in every propagation: scan target text for English grammatical crutches carried literally — especially Rule-11 `*italic*` additions that exist *only* because English needed a noun-prop or copula (the `*One*`/`*Eine*` class). If the target language doesn't need the added word, it must not appear.
2. **Source-anchored Rule-28 review** — make it explicit in the workflow that locale sign-off compares target ↔ **original**, never target ↔ English.
3. **Extend `content:lint §0.3`** — add the `el`→`él` / `de el`→`de él` pronoun class to the pattern set, and bring **all ES books (incl. `es/genesis`) into diacritic scope**, not just the NT dirs.

**D. Structural:** the pivot is endorsed as the **drafting** method (proven mostly-faithful, and it preserves EN editorial quality). Its output is, and should remain, **`provisional`** until the source-anchored Rule-28 review (§9.B/C.2) is complete.

---

## Appendix — blind vs shipped, key lines

**Genesis 1:2 (`merachefet`)**
- Shipped PT: `… {a:vento/espírito} de Deus **pairando** sobre a face das águas` · Blind PT: `… **pairava** …` · Rulebook example: `pairava`
- Shipped DE: `… {a:Wind/Geist} Gottes **schwebend** …` · Blind DE: `… **schwebend** …` (agree) · Rulebook: `schwebte`
- Shipped ES: `… {a:viento/espíritu} de Dios ***se cernia*** …` · Blind ES: `… **se cernía** …` (accent; not italicised)

**John 1:4 / 1:5**
- Shipped ES 1:4: `… ⁴**en el** era vida …` → should be `en él` · Blind ES: `en él`
- Shipped (all) 1:5: "did not overcome / não a venceram / hat es nicht überwältigt / no la venció" + Tier-2 note preserving "comprehend" (note present in all 4 locales) · Blind (all): forced `{a:overcome/comprehend}` slash

**Luke 1:49 (`ho dynatos`)**
- Shipped PT `o Poderoso` ✓ · ES `el Poderoso` ✓ · **DE `der Mächtige *Eine*` ✗** · Blind all: `o Poderoso` / `der Mächtige` / `el Poderoso` (no filler)
