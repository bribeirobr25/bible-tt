# Possible-Content Bundle — Plan

**Created:** 2026-05-15
**Revised:** 2026-05-16 (first pass) — incorporated `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN.md` (content-governance audit); 7 of 9 audit points absorbed; 1 partial; 1 dissent (Topic 10 label kept as `SPECULATIVE`, see Q2). One audit finding escalated beyond its original scope: people-parser slug-collision risk with the existing `## Ya'aqov (Jacob)` patriarch entry, now Q5.
**Revised:** 2026-05-16 (second pass) — incorporated `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN_v2.md` (architecture + parser + design-system audit); 5 of 7 findings absorbed; 1 corrected (audit's `<code>` rendering claim is wrong but conclusion right — see ledger); 1 deferred (parser collision-detection improvement → PENDING.md). Material change: Q5 recommendation shifts from `Iakōbos` (macron) to `Iakobos` (ASCII), now grounded in verified TT Greek-transliteration convention precedent rather than Unicode-safety speculation.
**Decisions locked:** 2026-05-16 — project lead confirmed all five recommended options. **Q1 = B** (minimal stub) · **Q2 = B + SPECULATIVE** (named-tradition catalogue with verified label) · **Q3 = B** (comparative-transmission data only, defer Quran 4:157 note; conditional on three prerequisites being discharged before Step 3) · **Q4 = list accepted as stated** (Josephus *AJ* 20.197–203 + Mark 6:3 + Matt 13:55 + optional Bauckham; Eusebius forward-tracked since Q1=B) · **Q5 = B** (`## Iakobos (James)`, ASCII).

**Bundle CLOSED 2026-05-16.** All three content steps and editorial-log + verification gate executed. **Steps 1+2** ran together (Iakobos PEOPLE.md stub + *et*/alef-tav §F5 catalogue × 4 locales each); **Step 3** ran after the three Q-C1/Q-C2/Q-C3 prerequisites were drafted in `docs/audit/STEP_3_PREREQUISITES_DRAFT.md` and project-lead-approved (Q-C1=A keep stronger form, Q-C2=A keep apologetic-acknowledgment closing sentence, Q-C3=A batch after EN approval). Editorial-log entries appended: **M-022** + **M-023** (matthew.md), **J-025** (john.md), **2026-05-16-105** (genesis.md). Final verification gate: **817/817 tests** · Biome lint clean · content-lint clean (1 pre-existing unrelated §0.10 Africa-ethnogenesis warning) · production build clean · HTML smoke confirmed on all 16 modified routes (4 locales × 4 surfaces). One side-finding logged to PENDING.md: ES Matthew diacritic loss (parallel to the resolved ES John issue) — out of bundle scope, deferred to a future sweep.
**Source:** `docs/feedback/possible-content.md` per-topic audit (Topics 2, 5, 10 flagged worthy for current scope).
**Scope:** three small content additions across `matthew/PEOPLE.md`, `genesis/study/CHAPTER-1-CONTEXT.md`, `john/INTRODUCTION.md`, and `matthew/INTRODUCTION.md` — each × 4 locales. No code changes; no new tests required beyond running the existing suite.
**Estimated effort:** 3–5 hours total (4–7 if Topic 5 also proceeds per Q3). Much smaller than Phases 7–11.

**Authoritative inputs:**
- `docs/rules/RULES-CORE.md` (v3.3) — Rules 3, 13, 14, 28, 29 govern this bundle
- `docs/rules/RULES-HB.md` + `RULES-GS.md` (v3.2 lock) — name-rendering tables
- `docs/architecture/STANDARDS.md` — DDD compliance, TypeScript, testing
- `docs/design/TT-DESIGN-SYSTEM.md` — anti-slop checklist + token discipline (v2 audit confirmed all new content renders through existing components — no design-system surface changes)
- `docs/audit/PENDING.md` — "Content seeds" section logs the three deferred siblings (Topics 1-Akedah, 1-Mary-Ark, 8-*karan*) + the new "people-parser slug collision detection" forward-tracking item from v2 audit §7.6
- `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN.md` (v1) — content-governance audit (2026-05-16) — verification table + 3 significant + 6 minor findings
- `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN_v2.md` — architecture / parser / design-system audit (2026-05-16) — 1 critical + 3 significant + 4 minor findings; all reviewed and verified independently against actual source

**Verified facts pinned during audit-absorption passes (2026-05-16):**
- Test baseline: **817 passing** (8 files).
- Editorial-log current last entries: `matthew.md` = **M-021**, `john.md` = **J-024**, `genesis.md` = **`2026-05-15-104`** (genesis uses date-based numbering, not letter-based).
- `content/en/matthew/PEOPLE.md:31` already contains `## Ya'aqov (Jacob)` for the patriarch (used in Matt 1 genealogy).
- `content/en/genesis/PEOPLE.md` does **not** contain a Ya'aqov entry (Gen 13+ out of scope until Phase 12).
- `content/en/john/PEOPLE.md:208-222` confirms the see-only-stub field pattern: `## <Name> (<Familiar>)` + `**See:** <book>/PEOPLE.md` + `**In <Book>:**` narrative paragraph.
- John INTRODUCTION §E numbering: E1–E4 exist; new content lands as **E5**. Matthew §E numbering: E1–E3 exist; new content lands as **E4**.
- John §C2 P52 framing (must be mirrored exactly in any comparative paragraph): `"approximately 125 CE (with a range of c. 100–150 CE)"` citing Roberts 1935 + Nongbri, *HTR* 98 (2005).
- HOW TO USE confidence-label definitions in both intros: `SPECULATIVE — must be rare and clearly flagged`; `POSSIBLE — one reasonable reading among others`.
- people-parser slug derivation (`src/infrastructure/content/people-parser.ts:734-740`): `slug = name.toLowerCase().replace(/\s+/g, "-")` where `name` is everything BEFORE the first parenthesis. **No collision-handling function in the parser.**
- **Verified in v2 audit pass:** existing TT Greek-transliteration convention in `matthew/PEOPLE.md` and `john/PEOPLE.md` is pure ASCII without macrons — `Andreas`, `Philippos`, `Nikodemos`, `Herodes`, `Shimon Kefa`, `Nathanael`. New Greek-source name `Iakobos` (not `Iakōbos`) honors this convention.
- **Verified in v2 audit pass:** `enrichment-parser.ts:10-11` distinguishes `SECTION_HEADER = /^## ([A-Z])(?:_\w+)?\.\s+(.+)$/` (H2) from `ENTRY_HEADER = /^### (.+)$/` (H3). H2 with `<letter>.` matches the section regex; an accidentally-H2-leveled new §F entry would silently fail to land under §F.
- **Verified in v2 audit pass:** `renderInlineSafe` (`src/ui/shared/render-markdown-safe.ts:45-50`) processes ONLY `**bold**` and `*italic*` — backticks, headings, code fences, links all pass through HTML-escape as literal characters. Forward-pointer prose must use plain text (no backtick-wrapped code references, no `##` heading syntax).
- **Verified in v2 audit pass:** people-parser slug used only as React `key` (`people-timeline.tsx:43,51,150`; `app/[locale]/[book]/people/page.tsx:178`); never as CSS selector, `id`, URL fragment, or path segment. Pure-ASCII slug is preferred for convention-fit, not for technical Unicode-safety.
- **Verified in v2 audit pass:** `enrichment-entry.tsx:17,29` confirms color mappings for `"LATER RECEPTION"` (`border-l-note-theological bg-note-theological-bg`) and `"SPECULATIVE"` (`bg-note-critical/15 text-note-critical`). Topic 10's `[LATER RECEPTION — SPECULATIVE]` label renders with theological amber left-border + critical-red confidence badge.
- **Verified in v2 audit pass:** content-lint `§0.8` heading-collision check (`scripts/content-lint.sh:121-135`) runs against `$NON_EN_PEOPLE_FILES` only (EN excluded by design) using perl regex `/^## (\S+) \((\S+)\)/ && $1 eq $2`. Locale heading must avoid `## <FamiliarForm> (<FamiliarForm>)` form.

---

## Operating principles (apply to every item)

- **Rule 3 (no imported theology):** all three additions land in COMPANION material (§F of CONTEXT files, §E of INTRODUCTION files, or as a PEOPLE.md PersonEntry). None modify chapter main text.
- **Rule 13 (uncertainty levels):** every claim carries the dual label (claim-type + confidence). Speculative readings (Topic 10) are labeled `SPECULATIVE` per the verified `HOW TO USE` definition ("must be rare and clearly flagged"); historical biography (Topic 2) labels per-field per existing PEOPLE.md convention.
- **Rule 28 (review workflow):** every change with translation impact ships with an editorial-log entry.
- **Rule 29 (companion governance):** all entries follow the Section A–H structure and pre-submission checklist. Tier 2 note limits do not apply (this is companion, not main-text inline notes).
- **Cross-locale parity:** EN authored first, then PT-BR → DE → ES cascade. Each locale gets an entry with the same structural shape and the same source citations; only the prose translates.
- **Em-dash discipline (per audit §4.6):** `content-lint.sh §0.2` rejects ` -- ` (space-hyphen-hyphen-space) across `$CONTENT_DIRS` and `$STUDY_DIRS` and blocks the build. Use Unicode em-dash `—` (U+2014) throughout all authored content. Authoring reminder: prefer copy-paste of `—` over typing `--`.

---

## Question points + recommendations

### Q1. Topic 2 — Fullness of the James entry

**Question:** Matthew 13:55 names James (יַעֲקֹב, Ya'aqov) only in passing as a sibling of Yeshua. The historically substantive James (Jerusalem-church leader, Josephus 62 CE killing, 1 Cor 15:7 resurrection appearance, Gal 1:19/2:9/2:12, the James epistle authorship debate) operates in books not yet authored (Acts, Galatians, James, possibly Jude).

**Options:**
- **A.** Full PersonEntry in `matthew/PEOPLE.md` now, with all biographical fields populated. Later books cross-reference *to* this entry via the established see-only pattern.
- **B.** **(Recommended)** Minimal PersonEntry in `matthew/PEOPLE.md` covering only what Matthew itself names (sibling of Yeshua per 13:55; name etymology; historicity classification). Forward-pointer note inside the entry saying the broader historical James — Jerusalem church leadership, Josephus's account of his 62 CE death, the 1 Cor 15:7 resurrection-appearance tradition, and the James-epistle authorship question — will be treated when Acts / Galatians / James is authored.

**Recommendation: Option B.**

Reason: consistent with how `john/PEOPLE.md` handles Mosheh / Eliyahu / Yeshayahu — see-only stubs to future books with `**See:**` pointers. Risk of Option A: he is only marginally a "Matthew character"; populating full Josephus-grounded biography fields under a book that names him once would over-anchor the entry to Matthew rather than to the books where his role is substantive. Option B respects book-scope discipline and lets the canonical entry land where it belongs.

**Field pattern (per audit §4.1, verified against `john/PEOPLE.md:208-222`):** the stub uses two specific rendered fields:

```markdown
## <Name> (<Familiar>)
**See:** <book>/PEOPLE.md
**In <Book>:** <narrative paragraph carrying the forward-pointer text>
```

Locale editors **must** put the forward-pointer narrative in the `**In <Book>:**` field (rendered to readers), not in a `**Note:**` field (parsed but not rendered, per AUDIT_PHASE_10_PLAN §3.4). The `**See:**` line points to `acts/PEOPLE.md` — graceful-fallback rendering applies (book doesn't exist yet → plain-text fallback).

**✅ Decision recorded (2026-05-16): Option B — minimal stub.** Project lead confirmed. Execution per Step 1.

### Q2. Topic 10 — Framing the *et* / alef-tav §F entry

**Question:** A small (~3–5 sentence) entry in Genesis 1 CONTEXT §F catalogues a Christian-Hebraic / Messianic-Jewish / Kabbalistic-precedent reading that finds a hidden messianic signature (alef-tav, first-and-last) in the *et* particles of Gen 1:1, paralleled with Revelation's Alpha-and-Omega. Two framing choices:

- **A.** Neutral catalogue with no source attribution: "Some traditions find a christological reading in Gen 1:1's *et*..." Pro: avoids singling out any one tradition. Con: ahistorical — the reading has a specific provenance.
- **B.** **(Recommended)** Named-tradition catalogue: identify the families that hold the reading (Messianic Jewish, certain Hebrew-roots Christian, distant Kabbalistic precedents on alef-tav as a divine ideogram), with a one-sentence philological clarification that *et* is the standard *nota accusativi* appearing thousands of times in Biblical Hebrew. Cite one source (e.g., a published Messianic Jewish commentary; or Patai/Scholem on the Kabbalistic alef-tav tradition).

**Recommendation: Option B.**

Reason: §F is "Later Reception in Other Traditions" — the section exists specifically to attribute readings to their tradition. Anonymizing the source ("some traditions") would soften the §F discipline that already governs how we record, e.g., rabbinic, patristic, and Islamic readings elsewhere. The philological clarification line is non-negotiable per Rule 3 — without it, the entry could be misread as endorsing the *et*-as-christology reading.

**Claim-type + confidence label:** `[LATER RECEPTION — SPECULATIVE]`.

*Audit dissent (audit §3.1 recommended `POSSIBLE` instead).* Plan retains `SPECULATIVE` because the verified HOW TO USE definitions in both intros distinguish: `POSSIBLE — one reasonable reading among others` vs. `SPECULATIVE — must be rare and clearly flagged`. `POSSIBLE` is reserved in TT taxonomy for legitimate scholarly readings competing on philological/textual grounds (e.g., the three syntactic readings of Gen 1:1–3 in INTRO §F2 are all `POSSIBLE` because each survives in mainstream Hebrew philology). The *et*-as-Christ reading does **not** compete on philological grounds — universal Hebrew grammars (Waltke–O'Connor, Joüon–Muraoka, Gesenius–Kautzsch–Cowley) treat *et* exclusively as *nota accusativi*. The reading is tradition-based, attested but not philologically grounded — which is exactly what `SPECULATIVE` ("must be rare and clearly flagged") was designed to label. Tradition-attestation does not elevate a reading to `POSSIBLE`. All 4 locales must use `SPECULATIVE` consistently.

**Per-locale philological clarification line (per audit §4.3, count adjusted to "thousands" — the cited "~11,000" overstates; standard concordances range 7,000–10,000 by counting method):**
- EN: "*et* is the standard *nota accusativi* (direct-object marker) in Biblical Hebrew, appearing thousands of times in the Hebrew Bible."
- PT-BR: "*et* é o marcador padrão de objeto direto (*nota accusativi*) no hebraico bíblico, aparecendo milhares de vezes."
- DE: "*et* ist der Standardmarker für das direkte Objekt (*nota accusativi*) im Biblischen Hebräisch und kommt tausende Male vor."
- ES: "*et* es el marcador estándar del objeto directo (*nota accusativi*) en el hebreo bíblico, apareciendo miles de veces."

If a specific count is desired, cite Waltke–O'Connor §10.3 or Joüon–Muraoka §125a in §H. Default: hedge to "thousands."

**✅ Decision recorded (2026-05-16): Option B + SPECULATIVE.** Project lead confirmed the named-tradition catalogue framing and retained the `SPECULATIVE` label (dissent from v1 audit §3.1 upheld). Execution per Step 2.

### Q3. Topic 5 — Scope of the INTRODUCTION §E addition

**Question:** John INTRODUCTION already has an §E (Manuscript Transmission) section. Matthew INTRODUCTION has a parallel §E. Topic 5 offers two distinct kinds of content that could be absorbed:

- **(a) Comparative-transmission data** — gap between Jesus's life and first NT MSS (P52 ~125 CE, P66/P75 ~200 CE) vs. comparable gaps for other ancient figures (Arrian's Alexander biography ~450 years post-Alexander; Tacitus on the early imperial period ~80 years post-event). Provides scholarly grounding for "the NT's textual-transmission gap is not anomalous for ancient sources."
- **(b) Quran 4:157 cross-tradition note** — the Quran's denial of the crucifixion as the most prominent later-tradition divergence from the NT's portrait of Jesus.

**Options:**
- **A.** Add (a) only — comparative-transmission paragraph in both John §E and Matthew §E.
- **B.** **(Recommended)** Add (a) to both §E sections; add (b) only if there's a clear §F (Later Reception in Other Traditions) host. John INTRODUCTION currently has no §F covering Quranic reception of Jesus; adding one is a real new sub-section, not polish. Defer (b) to a future "Islamic reception of NT Jesus" pass when there's enough cross-tradition content to justify a §F bucket.
- **C.** Skip Topic 5 entirely; the existing §E sections are already adequate. Risk of (a) is that comparative-transmission data is rhetorically apologetic in tone — even when factually correct, it can read as "look how well-attested the NT is compared to other ancient texts," which is a Rule-3 reading direction.

**Recommendation: Option B-but-conservative — confirm before authoring.**

Reason: the comparative-transmission data IS factually accurate and is the kind of thing book INTRODUCTION §E sections should cover. But the framing risk is real. The Wesley Huff source frames the data apologetically; the TT must reframe it descriptively ("the NT's transmission gap, by ancient-history standards, is unusually short" without the apologetic upshot). If reframing cleanly is uncertain, **C is the safer fallback** — skip Topic 5 in this bundle.

**Three source-verification prerequisites before Step 3 executes (per audit §3.2):**

1. **P52 framing mirroring.** Any new comparative paragraph that cites P52 must mirror exactly the framing already authored in John INTRO §C2 (line 142): `"Paleographic dating places it at approximately 125 CE (with a range of c. 100–150 CE)"`, citing Roberts 1935 + Nongbri 2005. The Nongbri article specifically argues that confident early dating of P52 has been overstated; the comparative paragraph must preserve that scholarly caution and not present 125 CE as a single point.
2. **§H citations for Arrian and Tacitus.** Required additions to the introductions' §G (Sources Consulted) tables:
   - `Arrian. *Anabasis of Alexander*. Preface; cf. Bosworth, A. B. *A Historical Commentary on Arrian's History of Alexander*. OUP, 1980.`
   - `Tacitus. *Annales*. Loeb Classical Library ed.; cf. Goodyear, F. R. D. *The Annals of Tacitus*, vols. 1–2 (Cambridge, 1972/1981).`
3. **Descriptive (not apologetic) framing draft.** The Wesley Huff source frames the comparison apologetically (*"closer in proximity than the vast majority of the people who we would just kind of assume existed"*). The TT cannot reproduce that voice. **Required descriptive draft (audit-suggested, to be approved or revised by editor before authoring):**

   > "The interval between the composition of the Gospels (c. 65–95 CE) and the earliest surviving manuscript witnesses (P52 c. 100–150 CE for John 18; P64+67 late 2nd c. for Matthew 3, 5, 26) is, by the standards of ancient historiography, relatively short. For comparison: Arrian's comprehensive biography of Alexander the Great was composed approximately 450 years after Alexander's death; Tacitus's *Annales*, covering events from 14 CE, was composed approximately 80–100 years after those events. The NT's transmission interval is therefore not anomalous in ancient-source terms — it sits at the shorter end of the range typical for ancient narrative literature."

   The draft must be reviewed by the project lead and pass a Rule 3 check (does it argue *for* the NT, or describe it descriptively?) before Step 3 authoring begins. If review surfaces Rule 3 concerns that cannot be cleanly reframed, **execute Option C (skip Topic 5).**

**Insertion-point specification (per audit §4.4):** the new paragraph is a within-§E addition, **not a new ## section header**. Specifically:
- **John INTRO:** new sub-section `### E5. Comparative transmission interval` (E1–E4 already exist).
- **Matthew INTRO:** new sub-section `### E4. Comparative transmission interval` (E1–E3 already exist).

**✅ Decision recorded (2026-05-16): Option B — add comparative-transmission data only; defer Quran 4:157 note.** Project lead confirmed. **Step 3 is conditional**: the three prerequisites above (P52 framing mirroring; Arrian + Tacitus §H citations drafted; descriptive non-apologetic framing draft approved) MUST be discharged in sequence before Step 3 authoring begins. If any prerequisite cannot resolve cleanly, fall back to Option C (skip Topic 5 from this bundle) without re-asking.

### Q4. Source-citation discipline for Topic 2 (James)

**Question:** Per Rule 28 + Rule 29 §H, the James entry needs source citations. Recommended citations (subject to your confirmation):

- **Josephus, *Antiquities* 20.197–203** — for the 62 CE killing under Ananus. Cite Loeb edition or the Whiston / Whealey scholarly editions.
- **Mark 6:3 / Matthew 13:55** — for the family naming.
- **1 Corinthians 15:7** — for the resurrection-appearance tradition (this can be left for the future Galatians/1 Cor entry, but is worth a forward-pointer line in the entry's "Character arc" or "Appears in" field).
- **(Optional, recommended)** Richard Bauckham, *Jude and the Relatives of Jesus in the Early Church* (T&T Clark, 1990) — the standard scholarly monograph on Jesus's brothers. **Citation format (per audit §4.2) if included:** `BAUCKHAM, Richard. *Jude and the Relatives of Jesus in the Early Church*. T&T Clark, 1990. Chapters 1–2 (brothers of Jesus), Chapter 3 (James as Jerusalem leader).` For Option B (minimal entry) this is deferred to the canonical Acts/Galatians entry; no blocker either way.
- **(Optional)** Eusebius, *Historia Ecclesiastica* 2.23 quoting Hegesippus — for the later Christian tradition about James's death. Useful only if Option A (full entry) is chosen; for Option B (minimal entry), this is forward-tracked.

**✅ Decision recorded (2026-05-16): list accepted as stated.** Effective source list for Q1=B execution: **Josephus *AJ* 20.197–203 + Mark 6:3 + Matt 13:55 + (optional) Bauckham 1990**. Eusebius is forward-tracked (since Q1=B was selected). Bauckham inclusion is at the locale editor's discretion during Step 1 authoring; not required.

### Q5. Source-name transliteration to avoid slug collision (escalated from audit §4.5; further refined by audit v2 §3.1)

**Background:** `content/en/matthew/PEOPLE.md:31` already contains `## Ya'aqov (Jacob)` for the patriarch (Matt 1:2 genealogy). The people-parser at `src/infrastructure/content/people-parser.ts:734-740` derives the slug as `name.toLowerCase().replace(/\s+/g, "-")`, where `name` is everything before the first parenthesis. **The parser has no collision-handling.** So a second entry `## Ya'aqov (James)` would slug to the same `ya'aqov` and overwrite/conflict with the patriarch.

The v1 audit (§4.5) asserted the slug would be `ya'aqov-(james)` — that was incorrect; I verified the parser strips at the first paren. This is a real authoring blocker that goes beyond the v1 audit's finding.

The v2 audit (§3.1) raised a Unicode-safety concern about the originally-recommended `Iakōbos` form. My independent verification of the v2 finding:
- Unicode `ō` in a slug is technically safe in current uses (slug is used only as React `key` per `app/[locale]/[book]/people/page.tsx:178` and `ui/people/people-timeline.tsx:43,51,150`; never as a CSS selector, `id`, URL fragment, or path segment).
- BUT — and this is the stronger argument the v2 audit missed — the **TT's established Greek-transliteration convention is pure ASCII without macrons**. Verified at `content/en/matthew/PEOPLE.md` and `content/en/john/PEOPLE.md`: existing Greek NT figures are `Andreas` (not `Andréas`), `Philippos`, `Shimon Kefa`, `Nathanael`, `Nikodemos` (not `Nikódēmos`), `Herodes` (not `Hērōídēs`). Introducing `Iakōbos` with a macron would break that convention.
- Conclusion: switch to **`Iakobos`** (ASCII), not for the Unicode-safety reason but for the convention-fit reason.

**Options:**
- **A.** Use a longer transliterated name to disambiguate in the slug-source: e.g., `## Ya'aqov ben Yosef (James)` (slug = `ya'aqov-ben-yosef`). Pros: keeps Hebrew/Aramaic source-naming. Cons: "ben Yosef" is inferred (Matt 13:55 names him as son of "the craftsman" — Yosef is named in 13:55 indirectly via Mary/Yosef family). Slight historical-precision compromise.
- **B.** **(Recommended)** Use the Greek source form in pure ASCII, since Matt 13:55 is in Greek and uses Ἰάκωβος: `## Iakobos (James)` (slug = `iakobos`). Pros: (1) source-fidelity match — Matthew's Greek text uses Ἰάκωβος, not יַעֲקֹב; (2) automatic slug uniqueness vs. the Hebrew patriarch entry; (3) signals to the reader that this is a different person from the OT patriarch via the different transliterated form alone; (4) matches the established TT convention for Greek-source NT figures in the same file (`Herodes`, `Andreas`, `Philippos`, `Nikodemos` — all ASCII, no macrons); (5) pure ASCII slug, no Unicode-safety questions for future use cases (URL path segments, CSS, search). Cons: introduces a fourth transliteration convention for what is etymologically the same name across the two Testaments; minor loss of scholarly long-vowel precision (Greek ω → `o` not `ō`) — but the loss is consistent with the existing convention (`Herodes` not `Hērōides`).
- **C.** Use a disambiguating epithet that matches Paul's Greek usage in Gal 1:19 (ἀδελφός κυρίου): `## Iakobos adelphos (James, brother of Yeshua)` (slug = `iakobos-adelphos`). Pros: encodes the disambiguation in the transliterated form. Cons: longer; encoding a possessive Greek adjective phrase into a slug-source is awkward.

**Recommendation: Option B — `## Iakobos (James)`.**

Reason: source-language fidelity (Matt 13:55 explicitly uses Ἰάκωβος, not יַעֲקֹב); automatic slug uniqueness; clean reader-facing distinction from the patriarch; consistent with the established TT Greek-transliteration convention (ASCII, no macrons) — `Herodes` / `Andreas` / `Philippos` / `Nikodemos` already in `matthew/PEOPLE.md` and `john/PEOPLE.md`; pure ASCII slug eliminates Unicode-safety concerns for any future use case.

**Locale familiar-name renderings under Option B** (per RULES-GS proper-name table conventions): EN "James" / PT-BR "Tiago" / DE "Jakobus" / ES "Santiago". All four locales author the heading as `## Iakobos (<Familiar>)` with their target-language familiar form in parens. The transliterated source-name `Iakobos` is identical across all four locales.

**✅ Decision recorded (2026-05-16): Option B — `## Iakobos (James)` (ASCII).** Project lead confirmed. Heading transliteration `Iakobos` identical across all four locales; familiar-form in parens varies per locale (James / Tiago / Jakobus / Santiago). Slug = `iakobos` (distinct from existing `ya'aqov`).

---

## Mechanical step — editorial-log numbering (verified 2026-05-16, no Q-decision)

Three log entries land per Rule 28, with numbering **pinned to current head + 1** based on verification at audit-absorption time:

- **`docs/editorial-log/matthew.md` Entry M-022** — Topic 2 James/Iakobos PersonEntry addition. *(Verified: matthew.md last entry = M-021.)*
- **`docs/editorial-log/genesis.md` Entry `2026-05-16-105`** — Topic 10 *et*/alef-tav §F catalogue addition. *(Verified: genesis.md uses date-based numbering, last = `2026-05-15-104`. Increment date to authoring day, increment ordinal to 105.)*
- **`docs/editorial-log/john.md` Entry J-025** + **`docs/editorial-log/matthew.md` Entry M-023** — Topic 5 INTRODUCTION §E comparative-transmission addition. *(Verified: john.md last entry = J-024.)* Only runs if Q3 = A or B.

**Re-verification step at execution time:** before each log append, re-check the actual last entry — other work between this plan's revision and execution may shift the numbers. Use `current_last + 1` discovered at execution, not the numbers pinned here.

Each entry follows the existing log convention: date, AI-provenance line citing this plan, decision recorded, source citations listed, cross-references to the affected files.

---

## Execution plan (Q1–Q5 locked 2026-05-16; awaiting Q3 prerequisites + project-lead green-light)

### Step 1 — Topic 2: James/Iakobos PersonEntry × 4 locales

1. Author EN entry in `content/en/matthew/PEOPLE.md` immediately after the existing `## Ya'aqov (Jacob)` patriarch entry at line 31 (places the two homonymous figures adjacently with the slug-distinct headings making the disambiguation visible). Heading per Q5 = Option B (recommended): `## Iakobos (James)`.
2. Use the verified see-only stub field pattern (per v1 audit §4.1, verified against `content/en/john/PEOPLE.md:208-222`):

   ```markdown
   ## Iakobos (James)
   **See:** acts/PEOPLE.md
   **In Matthew:** Named as one of Yeshua's four brothers at Matt 13:55 (alongside Yosef/Joseph, Shimon/Simon, and Yehudah/Judas), and referenced indirectly at Matt 12:46-50 (Yeshua's "mother and brothers" coming to find him). Distinct from Ya'aqov the patriarch named in the genealogy at Matt 1:2 — same Hebrew root יַעֲקֹב, same Greek form Ἰάκωβος, but a different person; the two are disambiguated here by Hebrew-source transliteration (*Ya'aqov*) for the OT patriarch versus Greek-source transliteration (*Iakobos*) for the NT brother of Yeshua. The fuller biography — Jerusalem church leadership (Acts 15, Gal 1:19, 2:9, 2:12), Josephus's account of his 62 CE death under Ananus (*Antiquitates Judaicae* 20.197–203), the 1 Cor 15:7 resurrection-appearance tradition, and the epistle authorship question — belongs with the books where his role is substantive: Acts, Galatians, James. Canonical entry deferred.
   ```

   The forward-pointer narrative goes in the `**In Matthew:**` field (rendered via `renderInlineSafe`), NOT in a `**Note:**` field (parsed-but-unrendered per AUDIT_PHASE_10_PLAN §3.4). **The template above uses plain prose only** — no backticks, no `##` markdown syntax. Per audit v2 §3.5 + my verification of `render-markdown-safe.ts:45-50`: `renderInlineSafe` processes only `**bold**` and `*italic*` markdown; backticks and headings pass through HTML-escaping as literal characters and would render as visible `` ` `` and `##` in prose. Italics on Latin abbreviations (*AJ*, *Antiquitates Judaicae*) and Greek-source words are appropriate; Hebrew/Greek Unicode (יַעֲקֹב, Ἰάκωβος) renders verbatim.

3. **Locale heading collision authoring note (per audit v2 §7.4):** the H2 heading must always have the form `## Iakobos (<FamiliarForm>)` — never `## <FamiliarForm> (<FamiliarForm>)` (e.g., `## Tiago (Tiago)`, `## Jakobus (Jakobus)`, `## Santiago (Santiago)`). The content-lint §0.8 perl regex `/^## (\S+) \((\S+)\)/ && $1 eq $2` runs against `$NON_EN_PEOPLE_FILES` and would flag and block the build on a transliteration=familiar collision. The transliterated source-name `Iakobos` must stay identical across all 4 locales; only the familiar-form in parens varies.
4. Translate to PT-BR (`content/pt-br/matthew/PEOPLE.md`), DE (`content/de/matthew/PEOPLE.md`), ES (`content/es/matthew/PEOPLE.md`). Localize the prose of the `**In Matthew:**` paragraph; preserve the Latin abbreviation `*AJ*` and the source citation form.
5. Familiar-name renderings per locale (under Q5 Option B): EN `(James)` / PT-BR `(Tiago)` / DE `(Jakobus)` / ES `(Santiago)`. Heading transliterated form `Iakobos` (pure ASCII, no macron) is identical across all four locales (per established TT Greek-transliteration convention — *Herodes* / *Andreas* / *Philippos* / *Nikodemos* in the same file).
6. Tests: `pnpm test` — the `people-parser.test.ts` suite must still pass; no parser changes expected. Verify the slug derives to `iakobos` (distinct from `ya'aqov`) by inspecting the rendered `/{locale}/matthew/people` accordion entry and confirming both H2 headings are independently expandable in the single-expand accordion (Phase 6.6E `name="people-accordion"`).

### Step 2 — Topic 10: *et* / alef-tav §F entry × 4 locales

1. **Heading-level discipline (per audit v2 §2.4 + §7.2, verified at `enrichment-parser.ts:10-11`):** the new entry MUST be authored as an **H3 entry** within the existing §F section, NOT as a new H2 section:
   - ✅ `### F5. The *et* / alef-tav reading — Messianic-Jewish and Kabbalistic-precedent tradition` — H3 entry, parsed by `ENTRY_HEADER = /^### (.+)$/`, accumulated under the existing §F section.
   - ❌ `## F5. ...` — H2 would match `SECTION_HEADER = /^## ([A-Z])(?:_\w+)?\.\s+(.+)$/` and create a new top-level section; **the content would be silently dropped from §F** (no entries land under it) and the new spurious "F5" section would have no parent. This is a silent failure mode with no test coverage.

   Place the new entry between the existing `### F4. *Bereshit* as "for the sake of" — rabbinic and Christian readings` and the `## G.` section separator (verified at `content/en/genesis/study/CHAPTER-1-CONTEXT.md:430-440`). Pattern-match adjacent §F entries to avoid mis-leveling.

2. Author the EN entry: ~3–5 sentences. Required label header on the line immediately below the H3: `**[LATER RECEPTION — SPECULATIVE]**` (rationale pinned in Q2; verified `parseClaimType("LATER RECEPTION")` at `enrichment-parser.ts:139-144` and `parseConfidence("SPECULATIVE")` at `enrichment-parser.ts:140-144` both resolve correctly).
3. Include the philological clarification line per the verified per-locale translations specified in Q2 (hedge: "thousands of times," not a specific count, unless a Waltke–O'Connor / Joüon–Muraoka citation is added to §H).
4. Translate to PT-BR / DE / ES — keep the heading number consistent (`### F5.` in all 4 locales), and keep the philological clarification line consistent across all four; vary only the prose around it. **Re-verify in each locale's `CHAPTER-1-CONTEXT.md` that the existing §F entries also end at F4** — locale variation in pre-existing entry counts would shift the new entry's number.
5. Verify the entry does NOT appear in §A (Hebrew Text Features Exposed by TT) — that would mis-label SPECULATIVE content as TEXTUAL.
6. Confirm all 4 locales use `SPECULATIVE` (not `POSSIBLE`) consistently.

### Step 3 (conditional on Q3 + 3 prerequisites discharged) — Topic 5: INTRODUCTION §E additions × 4 locales

**Pre-step gate:** before any authoring runs, the three prerequisites pinned under Q3 must be discharged:
- P52 framing mirroring confirmed against John §C2 line 142.
- Arrian (Bosworth 1980) + Tacitus (Goodyear 1972/1981) §H citation lines drafted for both intros' §G tables.
- Descriptive (non-apologetic) framing draft approved by project lead.

If any prerequisite cannot be resolved cleanly, fall back to Q3 Option C (skip Topic 5). Do NOT author with an unapproved descriptive draft.

1. Author EN paragraph in `content/en/john/INTRODUCTION.md` as new sub-section **`### E5. Comparative transmission interval`** (placed after the existing `### E4. The critical text and NA28`).
2. Author the parallel paragraph in `content/en/matthew/INTRODUCTION.md` as new sub-section **`### E4. Comparative transmission interval`** (placed after the existing `### E3. Textual stability`).
3. Append Arrian + Tacitus rows to the `## G. Sources Consulted` table in both intros.
4. Translate both × PT-BR / DE / ES.

### Step 4 — Editorial-log entries

Re-verify the current last entry of each log before appending (per the Mechanical Step note above):

1. Append **M-022** to `docs/editorial-log/matthew.md` for Step 1 (verified: head = M-021 at 2026-05-16).
2. Append **`2026-05-16-105`** to `docs/editorial-log/genesis.md` for Step 2 (verified: head = `2026-05-15-104`; if execution date shifts, update the date prefix to authoring day and re-check the ordinal).
3. If Step 3 ran: append **J-025** to `docs/editorial-log/john.md` and **M-023** to `docs/editorial-log/matthew.md` (verified: head = J-024; M head will be M-022 after Step 4.1, so the next is M-023).

**AI-provenance citation (per audit v2 §7.5):** each editorial-log entry's AI-provenance line must reference **both** audit memoranda since both govern execution decisions:

```
- **AI provenance:** claude-opus-4-7, 2026-05-XX, executing `docs/audit/POSSIBLE_CONTENT_BUNDLE_PLAN.md`; pre-execution audits at `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN.md` (content-governance + Rule 3/13/28/29) and `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN_v2.md` (architecture + parser + design-system).
```

### Step 5 — Verification gate

1. `pnpm test` — must remain at 817 passing (no new tests required; baseline must not regress).
2. `pnpm lint` — Biome clean.
3. `pnpm content:lint` — no new blocking warnings (em-dash discipline + §0.8 collision discipline in operating principles + Step 1 authoring note guards against these).
4. `pnpm build` — production build clean.
5. Visual smoke: navigate to `/{locale}/matthew/people` (verify both `## Ya'aqov (Jacob)` and `## Iakobos (James)` entries render as distinct accordion items with distinct slugs `ya'aqov` and `iakobos`; confirm single-expand accordion behavior — opening Iakobos closes Ya'aqov and vice versa); `/{locale}/genesis/chapter/1` Context view (verify §F5 entry renders with `LATER RECEPTION` claim-type pill + `SPECULATIVE` confidence pill, and that the §F section now contains 5 entries F1–F5); if Step 3 ran, `/{locale}/{book}/introduction` (verify §E5/§E4 sub-section renders with correct heading and `HISTORICAL / ARCHAEOLOGICAL` claim-type pill).

---

## Definition of Done

1. The four (or six) content files modified per Q1–Q3, in all four locales each.
2. Editorial-log entries appended per Step 4.
3. `pnpm test && pnpm build && pnpm lint && pnpm content:lint` all green.
4. Visual smoke check confirms render in EN + one non-EN locale per surface.
5. CLAUDE.md updated with one-line execution-status mention of this bundle's closure (date + entries created).

## What this bundle does NOT do

- Does **not** add a Topic 1 (Jacob's ladder / Mary-Ark / Akedah) entry — Jacob's ladder is already covered at John 1 §G2; Mary-Ark and Akedah are deferred (PENDING.md).
- Does **not** add a Topic 8 (Moses *karan*) entry — Exodus 34 is out of scope (PENDING.md).
- Does **not** modify any chapter main text (translation files). All additions are in companion material.
- Does **not** add new code, new tests, new domain types, or new UI components.

---

## Audit-absorption ledger (2026-05-16)

Cross-reference of `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN.md` findings against this plan's revised state:

| Audit finding | Verdict | Resolution in this plan |
|---|---|---|
| §3.1 — `SPECULATIVE` → `POSSIBLE` for Topic 10 | **Disagree** | Q2 retains `SPECULATIVE` with explicit rationale grounded in verified HOW TO USE label definitions (`POSSIBLE` is reserved for scholarly readings competing on philological grounds; the *et*-as-Christ reading is tradition-based, not philological). |
| §3.2 — Topic 5 source-verification prerequisites | **Agree** | Q3 now lists three prerequisites that must discharge before Step 3 authoring: P52 framing mirroring against John §C2:142; Arrian + Tacitus §H citations; descriptive (non-apologetic) framing draft approval. |
| §3.3 — Editorial-log numbering verification | **Agree** | "Mechanical step" section pins verified numbers (M-022, `2026-05-16-105`, J-025/M-023) and instructs re-verification at execution time. |
| §4.1 — Forward-pointer field pattern | **Agree** | Q1 now specifies the verified two-field pattern (`**See:**` + `**In Matthew:**`) modeled exactly on `john/PEOPLE.md:208-222`. |
| §4.2 — Bauckham citation format | **Agree** | Q4 source list now includes the full citation format if Bauckham is added. |
| §4.3 — Per-locale philological clarification | **Agree (count adjusted)** | Q2 now lists EN/PT-BR/DE/ES translations; count hedged to "thousands" rather than the cited "~11,000" (which overstates — standard concordances range 7,000–10,000). |
| §4.4 — Within-§E (not new section header) | **Agree** | Q3 + Step 3 now specify `### E5` (John) and `### E4` (Matthew) as the new sub-sections. |
| §4.5 — Ya'aqov disambiguation | **Agree + escalated** | The audit's claim that the parser would slug `ya'aqov-(james)` is incorrect — verified at `people-parser.ts:734-740` that the slug strips at first paren, yielding a real collision risk with the existing patriarch entry. New **Q5** elevates this to a strategic decision; recommended resolution refined further by v2 audit (see below) to `## Iakobos (James)` (ASCII, matches TT convention precedent). |
| §4.6 — Em-dash content-lint reminder | **Agree** | Added to Operating Principles. |

## Audit-v2-absorption ledger (2026-05-16, second pass)

Cross-reference of `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN_v2.md` findings against this plan's revised state. v2 audit focused on architecture, parser behavior, design-system compliance, and regression analysis — orthogonal to v1's content-governance focus. Independent verification was performed before each absorption decision.

| v2 audit finding | Independent verification verdict | Resolution in this plan |
|---|---|---|
| §1 — Architecture / DDD / dependencies / TypeScript / test baseline | **Confirmed correct** | Plan is content-only; no `src/` files modified, no dependencies added, no schema changes. Verified during pass. |
| §2.1 — `LATER RECEPTION — SPECULATIVE` badge color coverage | **Confirmed correct** | Verified `enrichment-entry.tsx:17,29`: both labels have explicit color mappings. Recorded in "Verified facts pinned" block. |
| §2.2 — PersonCard stub pattern rendering | **Confirmed correct** | Verified `inBook` alias at `people-parser.ts:219`; `bookLabels` fallback at `person-card.tsx:32` for missing `acts` book. Recorded in verified-facts block. |
| §2.3 — INTRO §E sub-section parsing | **Confirmed correct** | Verified `enrichment-parser.ts:10-11` regex distinctions. |
| §2.4 / §7.2 — §F entry heading level not specified | **Confirmed critical gap** | Step 2 now explicitly pins **H3** (`### F5. ...`) as required, with the H2 silent-failure mode documented and contrasted as ❌. |
| §3.1 / §7.1 — Unicode slug `iakōbos` claimed as "critical execution blocker" | **Partially correct — severity overstated, but conclusion right for a stronger reason the v2 audit missed** | Independent verification: slug is used ONLY as React `key`; Unicode is technically safe in current code (no CSS selector / `id` / URL fragment / path segment use). However, the **TT's established Greek-transliteration convention is pure ASCII without macrons** (`Andreas`, `Philippos`, `Nikodemos`, `Herodes` verified in same files). Q5 recommendation updated from `Iakōbos` → `Iakobos`, but the rationale is now **convention-fit**, not Unicode-safety. The v2 audit's "execution blocker" framing is rejected as overstated; the substantive recommendation is accepted. |
| §3.5 / §7.3 — Backtick + `##` markdown in `inBook` template | **Conclusion correct, technical reasoning wrong** | v2 audit claimed `renderInlineSafe` processes backticks into `<code>`. Independent verification of `render-markdown-safe.ts:45-50` shows `renderInlineSafe` processes ONLY `**bold**` and `*italic*` — backticks pass through as literal characters (after `escapeHtml`), and `##` heading syntax appears as literal text. The visual defect is real but different from what the audit described. Conclusion (remove backticks + heading syntax from prose) is correct and applied to Step 1 template. Technical mechanism documented accurately in Step 1 notes. |
| §3.2 — `SKIP_NAME_PATTERNS` no conflict | **Confirmed (low-confidence — not independently re-verified)** | No action needed. |
| §3.3 — `LABEL_LINE` regex em-dash compatibility | **Confirmed correct** | Verified `enrichment-parser.ts:12`. Em-dash discipline already in Operating Principles. |
| §3.4 — `SOURCE_LINE` not applied to §G table rows | **Confirmed correct** | §G "Sources Consulted" is a markdown table, not parsed as individual source fields. No action needed. |
| §4 — Content-lint coverage (§0.1, 0.2, 0.6, 0.7, 0.8, 0.10) | **Confirmed correct** | §0.8 perl regex verified at `scripts/content-lint.sh:121-135`. No new lint rules needed. |
| §5 — Regression analysis | **Confirmed correct** | Adding entries does not break existing parsing; verified additively. |
| §6 — Design-system anti-slop checklist | **Confirmed correct** | All checks pass for content-only additions. |
| §7.4 — Locale heading collision authoring note | **Agreed** | Added as Step 1 sub-instruction 3 with explicit reference to `$NON_EN_PEOPLE_FILES` scope and the perl regex pattern. |
| §7.5 — Editorial-log should cite both audits | **Agreed** | Step 4 now contains a template AI-provenance line referencing both `AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN.md` and `_v2.md`. |
| §7.6 — Parser slug collision detection (forward-tracking) | **Agreed, deferred** | Out of bundle scope; added to `docs/audit/PENDING.md` as a small parser-improvement forward-tracking item. |
| §7.7 — No new content-lint rules required | **Confirmed correct** | No `content-lint.sh` changes in this bundle. |

---

**Q1–Q5 decisions LOCKED 2026-05-16.** Final: Q1=B (minimal stub); Q2=B + `SPECULATIVE` (named-tradition catalogue, label retained); Q3=B (comparative-transmission data only — conditional on 3 prerequisites discharging cleanly, fallback to C); Q4=source list accepted as stated; Q5=B (`## Iakobos (James)`, ASCII).

**Execution gating (NOT YET STARTED — awaiting project-lead green-light):**
1. **Step 3 prerequisites** must discharge before Step 3 begins:
   - (a) P52 framing wording confirmed to mirror John INTRO §C2:142 exactly
   - (b) Arrian (Bosworth 1980) + Tacitus (Goodyear 1972/1981) `§G. Sources Consulted` table rows drafted for both INTRODUCTION files
   - (c) Descriptive (non-apologetic) framing draft reviewed by project lead and passes Rule 3 check
   - If any prerequisite cannot resolve cleanly: fall back to Q3 Option C (skip Topic 5) without re-asking
2. **Steps 1 and 2 are unblocked** and can run as soon as project lead gives the green-light to begin.
3. **Step 4 (editorial-log) + Step 5 (verification gate)** run after content authoring completes.
