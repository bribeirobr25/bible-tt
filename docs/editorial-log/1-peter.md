# Editorial Log — 1 Peter (Πέτρου Αʹ)

**Ruleset version in force:** v3.4
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

1 Peter is exhortation in the author's voice — **little/no direct divine speech**. The OT citations carry God's first-person speech where the *source* does → `@@…@@` (A-004 precedent), confirmed per-citation:
- **1:16** — "@@be holy, because **I** *am* holy@@" (Lev 11:44/19:2; God's first-person word). Marked.
- Citations that are *about* the Lord in 3rd person (1:24–25 Isa 40; 2:3 Ps 34; 3:10–12 Ps 34) are the prophet's/psalmist's human voice → **not** marked.
- 2:6 "behold, I lay in Zion a stone…" (Isa 28:16) — God's first-person word → marked. (Confirm at authoring.)

## Divine name — κύριος Option C (GS)

Main text renders κύριος "the Lord" + Tier-2; canonical `κύριος (kyrios)` metadata line. The OT citations carry **YHWH** (Option C; DE→JHWH, PT/ES→YHWH on propagation):
- **1:25** — Isa 40:8 "the word of *the Lord* (YHWH) endures forever."
- **2:3** — Ps 34:8 "*the Lord* (YHWH) is good/kind."
- **3:12** — Ps 34:15–16 "the eyes of *the Lord* (YHWH)… the face of *the Lord*."
- **3:15** — "sanctify *the Messiah* as Lord" (Isa 8:13 "the Lord of hosts" reapplied to Christ — a κύριος referent-shift; Rule 13 + Tier-2).

## Proper-name rendering (familiar default; transliterated-once per section) — match the corpus

| Greek | TT (first occ. → after) | Notes |
|---|---|---|
| Πέτρος | Kefa (Peter) → Kefa | the author (1:1); match Acts/Mark. Canonical PEOPLE home = `mark/PEOPLE.md` → **see-stub**. |
| Σιλουανός | Silvanus (Silas) | 5:12, "through Silvanus… I wrote" (the bearer/amanuensis). PT/ES familiar "Silvano"; DE "Silvanus". |
| Μᾶρκος | Markos (Mark) | 5:13, "my son Markos." PT/ES "Marcos"; DE "Markus". |
| Ἰησοῦς Χριστός | Yeshua *the* Messiah (Jesus) → Yeshua | Χριστός = "Messiah"/"anointed" (lowercase descriptor / cap as title per GS). |
| Σάρρα / Ἀβραάμ | Sarah (Sara) / Avraham (Abraham) | 3:6 (Sarah obeyed Abraham). Match Genesis forms. |
| Νῶε | Noach (Noah) | 3:20 (the ark, eight souls). Match Genesis. |
| Βαβυλών | Bavel (Babylon) | 5:13 "she in Babylon" (likely a cipher for Rome — Tier-2). |
| Πόντος, Γαλατία, Καππαδοκία, Ἀσία, Βιθυνία | Pontus, Galatia (Galat), Cappadocia, Asia, Bithynia | 1:1 — the five provinces of Asia Minor; overlap the Acts 2:9 list. Familiar geographic forms. |
| Σινᾶ / Ζιών | Zion (Tsiyon) | 2:6 "in Zion." |

## Strategic / locked terms (match the corpus)

- πνεῦμα = {a:wind/spirit} (locked GS slash; 1:2,11,12; 3:18,19; 4:6,14). Χριστός = "Messiah"/"anointed" (match gospels/Acts).
- **παροίκους καὶ παρεπιδήμους** (2:11; cf. 1:1,17) = "resident-aliens and sojourners/exiles" — the letter's identity keyword; keep the dual sense (Tier-2).
- ἀναγεννάω (1:3,23) = "born anew/again/from above" — note the range.
- λίθος / ἀκρογωνιαῖος (2:4–8) the **"stone"** word-field (living stone / cornerstone / stone of stumbling) — keep literal.
- ὑποτάσσω (2:13,18; 3:1,5; 5:5) = "submit / be subordinate" — the household-code verb; render literally, flag in Tier-2.
- βάπτισμα (3:21) = "immersion" (as gospels/Acts). συνείδησις (3:16,21) = "conscience". ἐλπίς (1:3,13,21; 3:15) = "hope". ψυχή (1:9,22; 2:11,25; 3:20; 4:19) = "soul".

## Cruxes — explicit `1-peter.md` editorial-log entries required (Rule-28 trigger; audit Minor 4)

Each gets a P-00N entry at authoring (theologically-loaded → logged, not silently made):
- **P-006 (to author) — 3:18–20 "the spirits in prison"** (πορευθεὶς ἐκήρυξεν τοῖς ἐν φυλακῇ πνεύμασιν): the descent/proclamation crux — multiple readings (the dead of Noah's day / fallen angels of Gen 6 / a post-resurrection proclamation). Render literally, preserve, Rule 13; do not resolve (Rule 3).
- **P-007 (to author) — 3:21 baptism "now saves you"** (ὃ… νῦν σῴζει βάπτισμα) + "ἐπερώτημα… συνειδήσεως ἀγαθῆς" ("appeal/pledge of a good conscience"); the flood antitype (ἀντίτυπον).
- **P-008 (to author) — 1:1–2 the salutation** (foreknowledge of the Father / sanctification of the {a:wind/spirit} / sprinkling of the blood of Yeshua) — a triune-shaped greeting; render without importing later dogma (Rule 3).
- **P-009 (to author) — the household code 2:18–3:7** (slaves/masters; wives/husbands; ὑποτάσσω; "weaker vessel" ἀσθενεστέρῳ σκεύει; Sarah's example 3:6): the highest-restraint passage — render the Greek faithfully, give the interpretive history in Tier-2, take no side in the main text (Rule 3). **The specific reviewer flashpoint.**
- **P-010 (to author) — 4:6 "the gospel was preached even to the dead."**
- **2:8** "they stumble… as they were appointed" (ἐτέθησαν) — election/destiny language; Tier-2, no resolution.

## Textual note

NA28 base. 1 Peter's text is comparatively stable (no Acts-scale Western divergence); note any significant variants in Tier-2.

## Entries

*(Per-decision entries P-006+ appended during authoring.)*
