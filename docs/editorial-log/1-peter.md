# Editorial Log — 1 Peter (Πέτρου Αʹ)

**Ruleset version in force:** v3.4.1
**Book:** The First Letter of Peter (Πέτρου Αʹ) — slug `1-peter`
**Base text:** Nestle-Aland 28th ed. (NA28). **Status: provisional** — AI-draft pending Hellenist review (Rule 28).
**Scope (this phase):** 1 Peter 1–5 (the whole book; ~105 verses), all 4 locales.
**Source-analysis notes:** `docs/source-analysis/greek/1-peter.md`.

> **GENRE: EPISTLE — the pipeline's first Letter** (playbook T-16). 1 Peter is *argument/exhortation*, not narrative: opening salutation (1:1–2), body, closing greetings (5:12–14). The verse pipeline applies unchanged; three companion shapes adapt — INTRODUCTION gains §B Recipient Community + §D Epistolary Conventions; PEOPLE is thin (author/co-senders/recipients; no genealogy); PROPHECY is **OT-in-argument** (quoted / echoed / typological, not "prediction → fulfillment").

---

## Confirmed decisions (project-lead, 2026-06-26)

- **P-001 — Scope:** all 5 chapters (the first fully-complete NT book in the corpus).
- **P-002 — Depth:** full, genre-adapted (per-chapter CONTEXT + PROPHECY, INTRODUCTION/CARD, thin PEOPLE, book CONTEXT, all 4 locales).
- **P-003 — Authorship:** AI-draft EN from NA28 → `provisional` → Rule-28 (Hellenist). EN checkpoint before propagation.
- **P-004 — Slug `1-peter` + Option-A regex widening** (audit Finding 1): the two cross-book slug-parsing regexes (`content-lint.sh` §0.12, `people-parser.ts` `crossBookSee`) widened `([a-z][a-z-]*)` → `([a-z0-9][a-z0-9-]*)` + round-trip regression test (Phase 0a, done). Sets the `N-book` precedent for 2 Peter / 1–3 John.
- **P-005 — PROPHECY = OT-in-argument:** keep the dual-label + citation-vs-allusion system; reread "fulfillment status" as *mode of deployment* (quoted / echoed / typological). The "Note on mode of allusion" header reframes for an epistle.

## Rule 30 (divine-speech marking) — scope for 1 Peter

1 Peter is exhortation in the author's voice — **little/no direct divine speech**. The OT citations carry God's first-person speech where the *source* does → `@@…@@` (A-004 precedent), confirmed per-citation: [**2026-11-20 note:** this marking policy is **superseded** by Launch-Program decision L3 → Entry P-011 — God's words quoted by another speaker (here the letter's author, after "it is written" / "it stands in Scripture") are **not** marked (Rule 30 *Do NOT mark*); A-004 is itself superseded (acts.md A-008). 1:16 and 2:6 are unmarked in Step 4 batch 4. The "not marked" bullet below stands.]
- **1:16** — "@@be holy, because **I** *am* holy@@" (Lev 11:44/19:2; God's first-person word). Marked. [**2026-11-20:** superseded → P-011 (unmarked, batch 4).]
- Citations that are *about* the Lord in 3rd person (1:24–25 Isa 40; 2:3 Ps 34; 3:10–12 Ps 34) are the prophet's/psalmist's human voice → **not** marked.
- 2:6 "behold, I lay in Zion a stone…" (Isa 28:16) — God's first-person word → marked. (Confirm at authoring.) [**2026-11-20:** superseded → P-011 (unmarked, batch 4).]

## Divine name — κύριος Option C (GS)

Main text renders κύριος "the Lord" + Tier-2; canonical `κύριος (kyrios)` metadata line. The OT citations carry **YHWH** (Option C; DE→JHWH, PT/ES→YHWH on propagation):
- **1:25** — Isa 40:8 "the word of *the Lord* endures forever." **[Corrected 2026-11-19:** the source reads "our God" in both MT (*dĕbar ʾĕlōhênû*) and LXX (τοῦ θεοῦ ἡμῶν); κυρίου is 1 Peter's substitution, not a Tetragrammaton rendering — notes fixed in all 4 locales.]
- **2:3** — Ps 34:8 "*the Lord* (YHWH) is good/kind."
- **3:12** — Ps 34:15–16 "the eyes of *the Lord* (YHWH)… the face of *the Lord*."
- **3:15** — "sanctify *the Messiah* as Lord" [**2026-11-20 note:** "Messiah" **superseded** by Launch-Program decision L7 → Entry P-012 — χριστός = "the anointed one" (GS lock); the referent-shift point is unchanged] (Isa 8:13 "the Lord of hosts" reapplied to Christ — a κύριος referent-shift; Rule 13 + Tier-2).

## Proper-name rendering (familiar default; transliterated-once per section) — match the corpus

| Greek | TT (first occ. → after) | Notes |
|---|---|---|
| Πέτρος | Kefa (Peter) → Kefa **[2026-11-19 note: the "→ Kefa" repeat conflicts with the v3.2 first-occurrence-then-familiar rule; aligned corpus-wide under Launch-Program D11 in Step 4]** | the author (1:1); match Acts/Mark. Canonical PEOPLE home = `mark/PEOPLE.md` → **see-stub**. |
| Σιλουανός | Silvanus (Silas) | 5:12, "through Silvanus… I wrote" (the bearer/amanuensis). PT/ES familiar "Silvano"; DE "Silvanus". |
| Μᾶρκος | Markos (Mark) | 5:13, "my son Markos." PT/ES "Marcos"; DE "Markus". |
| Ἰησοῦς Χριστός | Yeshua *the* Messiah (Jesus) → Yeshua | Χριστός = "Messiah"/"anointed" (lowercase descriptor / cap as title per GS). **[2026-11-20 note:** superseded by Launch-Program decision L7 → Entry P-012 — the GS lock is "anointed one", capitalized only as a proper name; it never allowed "Messiah". Re-rendered in Step 4 batch 4.] |
| Σάρρα / Ἀβραάμ | Sarah (Sara) / Avraham (Abraham) | 3:6 (Sarah obeyed Abraham). Match Genesis forms. |
| Νῶε | Noach (Noah) | 3:20 (the ark, eight souls). Match Genesis. |
| Βαβυλών | Bavel (Babylon) | 5:13 "she in Babylon" (likely a cipher for Rome — Tier-2). |
| Πόντος, Γαλατία, Καππαδοκία, Ἀσία, Βιθυνία | Pontus, Galatia (Galat), Cappadocia, Asia, Bithynia | 1:1 — the five provinces of Asia Minor; overlap the Acts 2:9 list. Familiar geographic forms. |
| Σινᾶ / Ζιών | Zion (Tsiyon) | 2:6 "in Zion." |

## Strategic / locked terms (match the corpus)

- πνεῦμα = {a:wind/spirit} (locked GS slash; 1:2,11,12; 3:18,19; 4:6,14). Χριστός = "Messiah"/"anointed" (match gospels/Acts). [**2026-11-20 note:** **superseded** by Launch-Program decision L7 → Entry P-012 — the gospels render "anointed one"; χριστός follows the GS lock "the anointed one" (lowercase descriptor; capitalized only as a proper name). The 21 "Messiah" per locale are re-rendered in Step 4 batch 4.]
- **παροίκους καὶ παρεπιδήμους** (2:11; cf. 1:1,17) = "resident-aliens and sojourners/exiles" — the letter's identity keyword; keep the dual sense (Tier-2).
- ἀναγεννάω (1:3,23) = "born anew/again/from above" — note the range.
- λίθος / ἀκρογωνιαῖος (2:4–8) the **"stone"** word-field (living stone / cornerstone / stone of stumbling) — keep literal.
- ὑποτάσσω (2:13,18; 3:1,5; 5:5) = "submit / be subordinate" — the household-code verb; render literally, flag in Tier-2.
- βάπτισμα (3:21) = "immersion" (as gospels/Acts). συνείδησις (3:16,21) = "conscience". ἐλπίς (1:3,13,21; 3:15) = "hope". ψυχή (1:9,22; 2:11,25; 3:20; 4:19) [**2026-11-19 note:** this ψυχή = "soul" rendering is **superseded** by Launch-Program decision D7 — locked **life/being** per RULES-GS; re-rendered corpus-wide (all books, incl. Luke/Acts) in Step 4, not here — `docs/audit/LAUNCH_PROGRAM.md`] = "soul".

## Cruxes — explicit `1-peter.md` editorial-log entries required (Rule-28 trigger; audit Minor 4)

Each gets a P-00N entry at authoring (theologically-loaded → logged, not silently made):
- **P-006 (logged below) — 3:18–20 "the spirits in prison"** (πορευθεὶς ἐκήρυξεν τοῖς ἐν φυλακῇ πνεύμασιν): the descent/proclamation crux — multiple readings (the dead of Noah's day / fallen angels of Gen 6 / a post-resurrection proclamation). Render literally, preserve, Rule 13; do not resolve (Rule 3).
- **P-007 (logged below) — 3:21 baptism "now saves you"** (ὃ… νῦν σῴζει βάπτισμα) + "ἐπερώτημα… συνειδήσεως ἀγαθῆς" ("appeal/pledge of a good conscience"); the flood antitype (ἀντίτυπον).
- **P-008 (logged below) — 1:1–2 the salutation** (foreknowledge of the Father / sanctification of the {a:wind/spirit} / sprinkling of the blood of Yeshua) — a triune-shaped greeting; render without importing later dogma (Rule 3).
- **P-009 (logged below) — the household code 2:18–3:7** (slaves/masters; wives/husbands; ὑποτάσσω; "weaker vessel" ἀσθενεστέρῳ σκεύει; Sarah's example 3:6): the highest-restraint passage — render the Greek faithfully, give the interpretive history in Tier-2, take no side in the main text (Rule 3). **The specific reviewer flashpoint.**
- **P-010 (logged below) — 4:6 "the gospel was preached even to the dead."**
- **2:8** "they stumble… as they were appointed" (ἐτέθησαν) — election/destiny language; Tier-2, no resolution.

## Textual note

NA28 base. 1 Peter's text is comparatively stable (no Acts-scale Western divergence); note any significant variants in Tier-2.

## Entries

### P-006 — 3:18–20 "the spirits in prison" + the flesh/spirit datives (3:18)
- **Decision:** render literally, preserve all readings, resolve none (Rule 3 / Rule 13). 3:18 "put to death **in flesh** (σαρκί) but made alive **in {a:wind/spirit}** (πνεύματι)" — the anarthrous-dative parallel kept (sphere "in the spirit" vs. agency "by the Spirit"), {a:wind/spirit} slash retained, Tier-2 flags the crux. 3:19 "the **spirits** (πνεύμασιν) in prison" — rendered plain "spirits" (imprisoned beings; no "wind" sense live, so **no slash**), and the three live readings noted in Tier-2 + Companion §A/§F: (a) the disobedient dead of Noah's day; (b) the Genesis-6 "watchers"/angels of the Enochic tradition (cf. 2 Pet 2:4; Jude 6); (c) a pre-incarnate proclamation through Noah. ἐκήρυξεν ("proclaimed") left content-unspecified (good news vs. judgment). **AI-draft; Hellenist sign-off pending (Rule 28) — the headline review item.**

### P-007 — 3:21 baptism "now saves you… as antitype"
- **Decision:** render the flood→baptism typology (ἀντίτυπον "antitype") and the immediate qualification — **"not a removal of dirt of the flesh but an appeal of a good conscience toward God"** — without importing a sacramental theology (Rule 3). ἐπερώτημα rendered **"appeal"** with the "pledge/answer" option noted (Tier-2). The saving is explicitly "**through the resurrection**," not the water itself. Provisional (Rule 28).

### P-008 — 1:1–2 the salutation (the triune-shaped greeting)
- **Decision:** render the salutation's three coordinate phrases as the Greek has them — **"according to *the* foreknowledge of God *the* Father, in sanctification of *the* {a:wind/spirit}, for obedience and sprinkling of *the* blood of Yeshua *the* Messiah"** (1:2) [**2026-11-20:** "Messiah" follows L7 → P-012 in batch 4] — without importing later dogmatic vocabulary ("Trinity," "persons," "procession"); the triune *shape* is the text's, the conciliar *theology* is not (Rule 3). πνεῦμα keeps the {a:wind/spirit} slash (1:2). "Elect sojourners of *the* dispersion" (ἐκλεκτοῖς παρεπιδήμοις διασπορᾶς, 1:1) renders the letter's identity keyword literally — the recipients' Israel-shaped exile self-understanding, not a claim about ethnicity (Tier-2). The triune reading is flagged in Tier-2 + Companion §A as a structural observation labeled by confidence, not a creedal assertion. **AI-draft; Hellenist sign-off pending (Rule 28).**

### P-009 — the household code 2:18–3:7 (servants; wives/husbands)
- **Decision (the highest-restraint passage; the likely reviewer flashpoint):** render the Greek faithfully — ὑποτάσσω ("submit"), οἰκέται ("household servants," 2:18), wives "won without a word" by conduct (3:1), Sarah "calling him lord" (3:6, *kyrios* = human honorific, lowercase), the husband honoring the wife as **"weaker vessel" (ἀσθενέστερον σκεῦος)** *and* **"co-heir of the grace of life" (συγκληρονόμος, 3:7)** — and **flag the interpretive/reception history in Tier-2 + Companion §F, taking no position in the main text** (Rule 3). Note the code's own mutuality (husbands addressed; wives as co-heirs; "so that your prayers not be hindered") and that the ground of servant-submission is the suffering Messiah as *hypogrammos* (2:21-25), not an endorsement of the institution. The "weaker vessel" rendered literally (the same sentence calls her a co-heir → not a worth-claim). **AI-draft; Hellenist + lead sign-off pending (Rule 28).**

### P-010 — 4:6 "the gospel was preached even to the dead"
- **Decision:** render literally — **"for to this *end* the good news was preached even to *the* dead, so that they might be judged according to humans in *the* flesh but live according to God in *the* {a:wind/spirit}"** (καὶ νεκροῖς εὐηγγελίσθη) — and resolve none of its readings (Rule 3 / Rule 13). The crux is flagged in Tier-2 + Companion §A with the major options: (a) the now-dead believers who heard the gospel while alive (and were "judged… in flesh" by dying); (b) those who heard the proclamation of 3:19 (the dead of Noah's day); (c) a general descent-proclamation. ἐκήρυξεν/εὐηγγελίσθη left content-unspecified; the flesh/spirit antithesis returns from 3:18 (the {a:wind/spirit} slash kept), and the note cross-refs 3:18–20 (P-006). **AI-draft; Hellenist sign-off pending (Rule 28).**

*(P-006, P-007, P-009 are the headline reviewer items; P-008 and P-010 are logged here and handled in their chapters' Tier-2 + Companion §A. 2:8 "as they were appointed" — election/destiny language — flagged in CHAPTER-2 Tier-2, no resolution, per the crux roster above.)*

## Launch Program decisions (2026-11-19/20)

Decisions taken by the project lead in the Launch-Readiness Program (`docs/audit/LAUNCH_PROGRAM.md` D7–D11; `docs/audit/CONTENT_SWEEP_FINDINGS.md` §3 L1–L8). Recorded here before the content changes ("log before drafting"); the content is changed in the Step 4 batch named in each entry (`docs/audit/PLAN_LAUNCH_FIXES.md`).

- **Ruleset:** this log now runs under **v3.4.1** (RULES-CORE amendment of 2026-11-20 — `docs/rules/CHANGELOG-v3.4.md`).
- **Content re-stamp (2026-11-20, Step 4 batch 2):** 125 front-matter stamp fields + 8 prose stamps were re-stamped Ruleset v3.3 → v3.4 across `content/` (Genesis, John, Matthew); the 4 Luke 3 "v3.3.2 cross-book convention" citations were kept. **No 1 Peter file changed** — all 1 Peter stamps already read v3.4.
- **D7 (ψυχή) and D11 (Kefa) notes:** the 2026-11-19 notes in the tables above were checked on 2026-11-20 and stand as written. D7 is applied in Step 4 batch 4 (with acts.md A-010, luke.md L-006); D11 in batch 5 (the proper-name tables).
- **PT register (L6):** PT verse text keeps the classical *vós* (1 Peter already uses it throughout) — corpus-wide entry **john.md J-037**.

## Entry P-011 — Rule 30: God's words quoted in the letter are not marked

- **Verse:** 1 Peter 1:16 (Lev 11:44 / 19:2), 2:6 (Isa 28:16) — verse study + continuous reading.
- **Language(s) affected:** EN, PT-BR, DE, ES
- **Rule(s) invoked:** CORE Rule 30 (Divine Speech Marking — *Do NOT mark* column, "God's words quoted by another speaker").
- **Decision:** the two citations are **not** marked `@@…@@`. The speaker is the letter's author, quoting Scripture ("it is written", 1:16; "it stands in Scripture", 2:6); Rule 30 marks who is speaking. 1 Peter then carries no divine-speech marks in its verse text. Applied in **Step 4 batch 4** (4 locales, both reading copies; content notes that cite the A-004 precedent are rewritten in the same pass).
- **Alternatives considered:**
  - Keep the marks per the A-004 precedent (rejected: A-004 is superseded — acts.md A-008; the rule's *Do NOT mark* column is flat).
  - Amend Rule 30 to allow marking quoted divine speech (L3 option B — not chosen by the lead).
- **Justification:** the rule as written, applied the same way in every book.
- **AI provenance:** drafted by the AI assistant (claude-opus-5-5), 2026-11-20, executing lead decision L3 (approved 2026-11-20). Step 4 batch 2.
- **Status:** provisional
- **Reviewers:** unassigned
- **Cross-references:** supersedes the 1:16 and 2:6 bullets of the Rule 30 scope section above; acts.md A-008; john.md J-038; `CONTENT_SWEEP_FINDINGS.md` headline 6, S6f.

---

## Entry P-012 — χριστός follows the GS lock "the anointed one"

- **Verse:** 1 Peter book-wide (21 "Messiah" per locale in the sweep, e.g. 1:1, 1:2, 1:3, 3:15) — verse text, plus TT-voice prose that restates the rendering.
- **Language(s) affected:** EN, PT-BR, DE, ES
- **Rule(s) invoked:** GS §Locked Glossary (χριστός = anointed one · ungido · Gesalbter · ungido); CORE Rule 20 (titular nouns lowercase); CORE Rule 1.
- **Decision:** χριστός = **"the anointed one"** (PT *o ungido*, DE *der Gesalbte*, ES *el ungido*), lowercase as a descriptor; capitalized only where it clearly functions as a proper name (the GS rule). The frequent Ἰησοῦς Χριστός compound ("Yeshua *the* Messiah (Jesus)") is decided case by case in batch 4 under that rule, together with its first-occurrence gloss placement. The log lines above that say "Messiah … per GS" are superseded. Applied in **Step 4 batch 4**.
- **Alternatives considered:**
  - Keep "Messiah" (rejected: the GS lock never allowed it; the "per GS" / "match gospels" claims were wrong — the gospels read "anointed one").
  - Amend the GS glossary and Rule 20 to allow "Messiah" (L7 option B — not chosen by the lead).
- **Justification:** one locked rendering across the corpus; "Messiah" turns a descriptor into a fixed title the Greek does not mark.
- **AI provenance:** drafted by the AI assistant (claude-opus-5-5), 2026-11-20, executing lead decision L7 (approved 2026-11-20). Step 4 batch 2.
- **Status:** provisional
- **Reviewers:** unassigned
- **Cross-references:** supersedes the "Messiah" lines at the Divine name (3:15), Proper-name (Ἰησοῦς Χριστός) and Strategic / locked terms sections above; acts.md A-009; luke.md L-007; `CONTENT_SWEEP_FINDINGS.md` S17.

---

## Entry P-013 — AI-provenance record for 1 Peter (Rule 28; the missing record)

- **Verse:** 1 Peter 1–5, whole book — all 72 content files (18 per locale).
- **Language(s) affected:** EN, PT-BR, DE, ES
- **Rule(s) invoked:** CORE Rule 28 (as amended in v3.4.1 — full provenance kept in the internal record, a plain statement for readers); CORE §Editorial Log Specification (AI provenance field).
- **Decision:** record the provenance that this log lacked. Until now it lived only in the reader-facing lines of the content files:
  - **Model:** Claude Opus 4.8, 1M context (`claude-opus-4-8`), Anthropic.
  - **EN drafting:** 2026-06-26 — chapters 1–5 authored from NA28 under the decisions spec P-001…P-005 above (genre-adapted per playbook T-16; an epistle-parser spike passed before bulk authoring — `EXECUTION_HISTORY.md`), then INTRODUCTION (+ CARD), thin PEOPLE, book CONTEXT, 5 chapter CONTEXT and 5 OT-in-argument PROPHECY companions; cruxes logged as P-006…P-010.
  - **Propagation:** PT-BR / DE / ES mirror-EN, 2026-07-01 (`CLAUDE.md`; merge commit 2026-07-02). The locale files carry the EN drafting date 2026-06-26 in their provenance lines.
  - **Reader-facing lines (13 per locale, 52 in all):** INTRODUCTION + PEOPLE — "Editorial provenance: Drafted by Claude Opus 4.8 (1M context) on 2026-06-26. Not yet reviewed." (PT "Redigido por", DE "Entworfen von", ES "Redactado por"); book CONTEXT + 5 chapter CONTEXT — "Drafted by: AI (Claude, Anthropic)" + "Date: 2026-06-26"; 5 PROPHECY — "Drafted by: Claude Opus 4.8 (AI assistant)" + "Date: 2026-06-26" (DE uses "Verfasst von" in the book CONTEXT and the 5 PROPHECY files, "Entworfen von" elsewhere). The 5 chapter files carry no provenance line (front matter: `Status: provisional`).
  - **Reviewer decision:** none yet — all content `provisional`, Hellenist + locale-editors unassigned.
  - Every reader-facing line is also copied, file by file, into `docs/editorial-log/ai-provenance-record.tsv` before **Step 4 batch 3** replaces it with the approved plain statement (EN "AI-assisted draft, not yet reviewed.").
- **Alternatives considered:**
  - Keep the model detail in the reader-facing lines (rejected by the lead, L5: readers get a plain statement; model detail stays internal).
  - Rely on the TSV record alone (rejected: Rule 28 / the log schema require the record in the book's editorial log).
- **Justification:** without this entry, batch 3's rewrite of the reader lines would have removed the only provenance record for 1 Peter.
- **AI provenance:** drafted by the AI assistant (claude-opus-5-5), 2026-11-20, executing lead decision L5 (approved 2026-11-20), from the content files' provenance lines and the dates in this log. Step 4 batch 2.
- **Status:** provisional
- **Reviewers:** unassigned
- **Cross-references:** `docs/editorial-log/ai-provenance-record.tsv`; `PLAN_LAUNCH_FIXES.md` §B2.1 item 5; `EXECUTION_HISTORY.md` (1 Peter entries, 2026-06-26 / 2026-07-01).

---
