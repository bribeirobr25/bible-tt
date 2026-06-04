# Q6 Validation — Source-Analysis Corpus vs. Shipped Genesis 1

**Date:** 2026-06-03
**Status:** REVIEW COMPLETE — read-only. **No files were changed** (per request). All reconciliations below are recommendations only.
**Author:** Claude Opus 4.8 (1M context)
**Scope:** The deferred Q6 cross-check from `docs/audit/SOURCE_ANALYSIS_METHODOLOGY_PLAN.md` — verify the distilled Hebrew corpus (`docs/source-analysis/hebrew/genesis-1-01.md … genesis-1-11-13.md`, covering Gen 1:1–1:13) against the shipped translation, notes, glossary, transliteration log, and editorial log.

## Sources cross-checked

- `content/en/genesis/CHAPTER-1.md` (Tier 1 text, Tier 2 notes, glossary, formula/root-doubling/verb-shift tables)
- `content/en/genesis/study/CHAPTER-1-CONTEXT.md` (companion §A source-text features, §D linguistic deep-dives)
- `docs/rules/RULES-HB.md` §Locked Glossary
- `docs/editorial-log/transliteration-decisions.md`
- `docs/editorial-log/genesis.md`

---

## Verdict

**The corpus is faithful.** Across ~45 lexeme-level claims for Gen 1:1–1:13, the corpus agrees with the shipped translation, Tier 2 notes, glossary, transliteration decisions, and editorial log. **Zero factual contradictions.** Two points are genuine *analytical divergences* (the corpus's preferred rendering/disambiguation differs from the shipped choice), and three are *enrichment opportunities* (corpus attestations that are accurate but not yet present in the companion). None is a blocker; all proposed reconciliations are content edits that require Hebraist sign-off (Rule 28) and are therefore deferred.

| Category | Count |
|---|---|
| Confirmed agreements | ~45 lexeme claims (see §1) |
| Factual errors in the corpus | 0 |
| Analytical divergences (corpus vs. shipped) | 2 (betoch, mavdil) + 1 minor wording (al-pnei) |
| Enrichment opportunities (accurate, not yet in companion) | 3 (raqia attestation, tehom attestation/drift, merachefet attestation) |

---

## 1. Agreement highlights (corpus ↔ shipped)

Representative — the full set was checked verse by verse.

| Claim (corpus) | Shipped location | Match |
|---|---|---|
| *bereshit* "in beginning", no article | v1 text + 🔴 note "(NO article)" | ✓ |
| *bara* from-nothing scope **debated/POSSIBLE**, distinct from *asah* | v1 🟢 note, v7 verb-shift, glossary, Verb-Shift table | ✓ |
| *Elohim* plural form, singular verb | glossary "Plural form, singular verb"; overview | ✓ |
| *et* functionless object marker (no alpha-omega) | v1 🟢 note "untranslatable direct object marker" | ✓ |
| *shamayim* sky/skies not "Heaven"; *eretz* land not planet; *adamah* soil distinct | v1 notes, v25 note, glossary | ✓ |
| seven-word / seven-motif | v1 🔴 note; companion (12× "seven") | ✓ |
| *tohu vavohu* 3×, **UNCERTAIN**, "chaos and void" POSSIBLE | v2 🟡 note + glossary | ✓ |
| *tehom* the deep / massive water-body, **PROBABLE** | v2 🟢 note + glossary | ✓ |
| *ruach* wind/spirit (+breath), **feminine** | v2 🟡 note | ✓ |
| *merachefet* present participle, not past; "covering/brooding" possible | v2 🟢 note | ✓ |
| English adds a second verb ("*was*") in v2 — marked italic per Rule 11 | v2 text: "darkness *was* … *was* hovering" | ✓ (shipped marks it) |
| *yehi* jussive "shall be"; converting-vav; command=outcome | v3 text + 🔵 note | ✓ |
| *ki tov* "that good" compression | v4 text + 🔵 note | ✓ |
| *yom echad* cardinal "one day", not ordinal *rishon* | v5 text + 🔴 "Day ONE, Not FIRST" | ✓ |
| *raqia* transliterated; root ר-ק-ע "hammer/beat"; v8 = *shamayim* | v6/v8 notes; companion §D3, §A4 | ✓ |
| *ken* "so" ("and it was so") | vv7,9,11… | ✓ |
| *yikkavu* passive, root ק-ו-ה, related to *miqveh*; *teira'eh* passive "be seen"; *yabashah* dry ground | v9 notes | ✓ |
| *yamim* plural "seas"; two-seas ancient geography | v10 note | ✓ |
| *tadshe* denominal "to grass"; *mazria zera* "seeding seed"; *totze* land "brought out"; *lemino* "to its kind" | vv11–12 notes + text | ✓ |

Also verified consistent: the glossary table, Formula Tracking, Root-Doubling, and Verb-Shift tables all match the corpus's "TT status" pointers; transliteration-decisions (raqia transliterated; tehom rendered "the deep", not transliterated) match; editorial-log policies (converting-vav, jussive, *ki tov*, "In beginning" no-article, divine-name Option A) match.

---

## 2. Analytical divergences (recommendations only — not changed)

### 2.1 *betoch* (1:6) — "within/inside" vs. "in the midst of"
- **Shipped:** Tier 1 (chapter v6 + companion §A4) renders **"in the midst of the waters."**
- **Corpus** (`genesis-1-06-08.md`): argues *betoch* = **"inside/within"** (the *raqia* submerged in the water), not the looser "in the midst of" (which in English can read "amid/among").
- **Internal signal:** the shipped chapter's *own* v6 structure note already says **"Created WITHIN waters"** — so the Tier 1 wording ("in the midst of") and its note ("WITHIN") sit in mild tension.
- **Assessment:** substantively consistent (both mean the *raqia* forms within the water mass); the corpus argues for tightening the English to disambiguate "within (inside)" from "amid (among)." Low stakes, defensible either way.
- **Recommendation (deferred, Hebraist):** either add a Tier 2 note recording the "within/inside" reading, or harmonize the Tier 1 wording with its own note. No change made.
- **BAR decision =** let's tighten it to use "within/inside" reading
- **RESOLVED 2026-06-04** (follow-up plan Part A): Tier 1 → "within the waters" (4 locales) + v6 note + companion §A4 harmonized. See `genesis.md` Entry 2026-06-04-111.

### 2.2 *mavdil* (1:6) — noun "a separator" (corpus) vs. participle "separating" (shipped)
- **Shipped:** Tier 1 "*it* shall be separating"; v6 note "*mavdil* = participle 'separating' (ongoing action) — not completed 'separate'."
- **Corpus** (`genesis-1-06-08.md`): reads *mavdil* as **a noun** ("a separator/divider"), contrasting it with the infinitive *le-havdil*; smoothed rendering "shall be a separator." (The corpus's wording is measured — "here a noun" — not overstated.)
- **Assessment:** both are valid — a Hiphil participle can function verbally ("separating") or substantivally ("a separator / one who separates"). This is a divergence in the **chosen rendering** ("separating" vs. "a separator"), not a factual error; the meaning is essentially unchanged.
- **Recommendation (deferred, Hebraist):** Hebraist to confirm the TT's preferred rendering; if "separating" stands, record the corpus's "a separator" as the documented alternative. No change made.
- **BAR decision =** let's use the noun as the "Corpus" recommendation. So it will be ("a separator/divider")
- **RESOLVED 2026-06-04** (follow-up plan Part A): Tier 1 → "a separator" (EN) / "um separador" (PT) / "eine Scheidewand" (DE, locale-editor pending) / "un separador" (ES) + v6 note. See `genesis.md` Entry 2026-06-04-111.

### 2.3 *al-pnei* (1:2) — minor wording, not a conflict
- **Shipped:** "over the face of the deep / waters" (full idiom preserved).
- **Corpus:** describes the range and notes *al-pnei* often reduces to "upon."
- **Assessment:** consistent — the shipped text chose the fuller idiom within the range the corpus describes. **No action.**

---

## 3. Enrichment opportunities (corpus material accurate but not in the companion)

These corpus attestations are sound and would deepen companion §D, but are **absent** from `CHAPTER-1-CONTEXT.md` today. They are **content additions** (Hebraist sign-off + Rule 29 §H sourcing required) — out of Q6's read-only scope, flagged for a future companion pass:

1. **raqia attestation** — corpus cites Ezekiel 1 (ice/frost, "stretched/spread") and "15× across 4 books." Companion §D3 has the root + cosmology but **no Ezekiel reference and no cross-book count** (grep: "Ezekiel" = 0 in the companion).
2. **tehom attestation + drift** — corpus cites Exodus 15 *tehomot* (plural for emphasis), Gen 7:11 groundwater, and the modern-Hebrew "chasm" drift. Companion mentions *tehom* (5×) but **not** these attestations or the drift note (grep: "chasm"/"groundwater"/"Exodus 15" = 0).
3. **merachefet attestation** — corpus cites Jer 23:9 (trembling/restless) and Deut 32:11 (eagle hovering/fluttering/shielding). Companion has **no** *merachefet* attestation (grep: "merachefet"/"eagle" = 0).
- **BAR decision =** this is more important than it looks like. We should not only include this in the companions, but also understand the methodology and process and researched used to archieve this and think in a proper way to add it as a process when researching for companion content related to the verse, chapter or book.

---

## 4. Disposition

- **Update 2026-06-04:** §2 (betoch, mavdil) **RESOLVED** via the follow-up plan Part A (`docs/audit/SOURCE_ANALYSIS_FOLLOWUP_PLAN.md`; `genesis.md` Entry 2026-06-04-111). §3 (enrichment + companion-research process) is in **Part B** (its own cycle). The lines below describe the original 2026-06-03 read-only pass.
- **Nothing was changed** *by the Q6 pass itself*. This file documented findings only; the Part-A edits were a separately-authorized execution.
- The corpus passes Q6: it accurately reflects the shipped Genesis 1 and the governing rules/log.
- §2 divergences (betoch, mavdil) and §3 enrichments are **deferred** — each is a translation/companion edit needing Hebraist sign-off (Rule 28), and should be batched into a future Genesis-1 companion/readability pass or the Phase-12 cycle, then logged in `genesis.md`.
- No update to `PENDING.md` is required by this read-only pass; if the project lead wants the §2/§3 items tracked, they can be added as a "Genesis 1 source-analysis reconciliation" follow-up.

## Cross-references

- Plan + locks: `docs/audit/SOURCE_ANALYSIS_METHODOLOGY_PLAN.md` (Q6=A deferred validation)
- Corpus: `docs/source-analysis/hebrew/genesis-1-01.md … genesis-1-11-13.md`; method `docs/source-analysis/METHOD.md`
- Shipped: `content/en/genesis/CHAPTER-1.md`, `content/en/genesis/study/CHAPTER-1-CONTEXT.md`
- Governance: `docs/rules/RULES-HB.md` §Locked Glossary; `docs/editorial-log/transliteration-decisions.md`; `docs/editorial-log/genesis.md`
- Anchor entry for the formalization: `docs/editorial-log/genesis.md` Entry 2026-06-03-110
