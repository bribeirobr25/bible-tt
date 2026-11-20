# Editorial Log — Acts of the Apostles

**Ruleset version in force:** v3.4.1
**Book:** Acts of the Apostles (Πράξεις Ἀποστόλων)
**Base text:** Nestle-Aland 28th ed. (NA28). **Note the Alexandrian/Western (Codex Bezae D) divergence** — the largest in the NT; chs 1–3 variants are modest but real → declared in front matter + INTRODUCTION §E, significant variants in Tier-2.
**Scope (this phase):** Acts 1–3, all 4 locales. **Status: provisional** — AI-draft pending Hellenist review (Rule 28).
**Source-analysis notes:** `docs/source-analysis/greek/acts-1-3.md`.

> Acts is **volume 2 of Luke** — same author, same dedicatee (Theophilos, 1:1 "the first account"), continuous narrative (Luke 24 ascension ↔ Acts 1 ascension). GS-governed; the gospel/Luke template applies directly (narrative genre).

---

## Confirmed decisions (project-lead, 2026-06-23)

- **A-001 — Authorship path:** AI-draft EN from NA28 → `provisional` → Rule-28 (Hellenist). The established GS pattern.
- **A-002 — EN checkpoint:** lead reviews the complete EN book before any propagation to PT/DE/ES.
- **A-003 — Pentecost / γλώσσαις:**
  - **πεντηκοστή (2:1)** → render **"Pentecost"** with a **Shavuot (Feast of Weeks)** gloss at first occurrence (Tier-2 + first-section gloss). It is the Greek name of the pilgrim festival Shavuot.
  - **γλῶσσαι (2:4,11)** vs **διάλεκτος (2:6,8)** → render γλῶσσαι as **{a:tongues/languages}** where both senses stay live (2:4, 2:11); διάλεκτος = "language/dialect" (unambiguous). Note the wordplay with the {a:wind/spirit} of 2:2-4 in Tier-2.
- **A-004 — Embedded divine speech in OT citations:** mark `@@…@@` (e.g. Joel's first-person "I will pour out my Spirit," 2:17-18; "says God" framing). Matches the gospel treatment of quoted divine speech. [**2026-11-20 note:** **superseded** by Launch-Program decision L3 → Entry A-008. RULES-CORE Rule 30 lists "God's words quoted by another speaker" under *Do NOT mark*, and the gospels do not mark such citations (mark.md 2026-06-17-001: Mark 1:2–3 unmarked; Matt 2:15 unmarked), so the "matches the gospel treatment" premise did not hold. Acts 2:17–21, 2:34, 3:25 are unmarked in Step 4 batch 4. Status: `superseded`.]

## Rule 30 (divine-speech marking) — scope for Acts 1–3

- **Marked `@@…@@`:** the **risen Yeshua's** direct first-person speech (1:4-5, 1:7-8) — consistent with the gospel treatment of Jesus's sayings (e.g. Lk 2:49); embedded first-person divine speech inside OT citations (Joel, 2:17-21, the "I will pour out / says God" portions). [**2026-11-20 note:** this OT-citation clause is **superseded** by Launch-Program decision L3 → Entry A-008 — the Joel citation (2:17–21), Ps 110:1 (2:34) and the Abrahamic promise (3:25) are God's words quoted by Kefa (Peter), a human speaker → **not** marked (Rule 30 *Do NOT mark*); unmarked in Step 4 batch 4. The risen Yeshua's speech (1:4-5, 1:7-8) stays marked.]
- **NOT marked:** the **two men / ascension angels** (1:10-11) — *angelos*-class messengers (the Gabriel/malakh precedent). Peter's sermons are human speech. The OT human-voice portions of citations (e.g. David speaking in Ps 16, "I saw the Lord") are human speech, not marked.

## Divine name — κύριος Option C (GS)

- Main text renders κύριος as **"the Lord"** + Tier-2 note on the referent. Canonical metadata line in front matter.
- **A-005 — Acts 2:34, Ps 110:1 (the headline crux):** "*The Lord* (κύριος = YHWH, the speaker) said to my *lord* (κύριος/τῷ κυρίῳ = the Messiah, addressee)." [**2026-11-20 check (L7):** "the Messiah" here labels the addressee's *referent*; it is not a rendering of χριστός (Ps 110:1 has none), so this log line stands. Content notes that print "[the Messiah]" as TT-voice prose follow L7 / L4 in Step 4 batch 4 → Entry A-009.] Two distinct referents under one Greek word. Render to preserve both; **Rule 13** uncertainty + Tier-2 (the Davidic-Messiah argument of the sermon turns on it). DE→JHWH / PT·ES→YHWH for the YHWH referent in propagation.
- Other YHWH-referent citations: Joel 2:32 "everyone who calls on the name of *the Lord*" (2:21); Ps 16:8 "I saw *the Lord*" (2:25).

## Proper-name rendering (familiar default; transliterated-once per section) — match the gospels

| Greek | TT (first occ. → after) | Notes |
|---|---|---|
| Ἰησοῦς | Yeshua (Jesus) → Yeshua | as gospels |
| Πέτρος / Σίμων | Kefa (Peter) → Kefa; Shimon (Simon) where Σίμων | match Mark 3:16 "Kefa/Peter"; protagonist of 1–3 |
| Ἰωάννης | Yochanan (John) | the apostle (with Peter, ch.3) |
| Ἰάκωβος | Ya'aqov (James) | son of Zavdai; also Jesus's brother (1:14) |
| Ἀνδρέας/Φίλιππος/Θωμᾶς/Βαρθολομαῖος/Θωμᾶς | Andreas (Andrew), Philippos (Philip), Thomas, Bartholomaios (Bartholomew) | the Twelve list (1:13) |
| Μαθθαῖος | Mattityahu (Matthew) | apostle |
| Μαθθίας | Mattityahu the *second* → "Mattityahu (Matthias)" | **distinguish from Matthew**: gloss "(Matthias)"; same Hebrew root, different man (1:23-26) |
| Ἰούδας Ἰσκαριώθ | Yehudah (Judas Iscariot) | the betrayer |
| Ἰούδας Ἰακώβου | Yehudah son of Ya'aqov (Judas son of James) | apostle |
| Μαριάμ | Miryam (Mary) | mother of Jesus (1:14) |
| Θεόφιλος | Theophilos (Theophilus) | dedicatee (1:1) |
| Ἰωσὴφ Βαρσαββᾶς / Ἰοῦστος | Yosef Barsabbas (Joseph Barsabbas), called Justus | the other lot-candidate (1:23) |
| Δαυίδ / Ἀβραάμ / Ἰσαάκ / Ἰακώβ / Μωϋσῆς / Σαμουήλ / Ἰωήλ | David, Avraham (Abraham), Yitschaq (Isaac), Ya'aqov (Jacob), Mosheh (Moses), Shmuel (Samuel), Yoel (Joel) | OT figures in the sermons; match Genesis/gospel forms |
| Ἰερουσαλήμ / Γαλιλαία / Ἰουδαία / Σαμάρεια | Yerushalayim (Jerusalem), Galil (Galilee), Yehudah (Judea), Shomron (Samaria) | match gospels |
| ὄρος Ἐλαιῶν | Har haZeitim (Mount of Olives) | "Olivet" (1:12) |
| Ἁκελδαμάχ | {t:Hakeldama} (Field of Blood) | Aramaic, 1:19 — **the text glosses it itself** ("that is, Field of Blood"); transliterate + keep the author's built-in gloss |
| Ναζωραῖος | the Nazarene (Yeshua *the* Nazarene) | 2:22, 3:6 |

## Strategic / locked terms (match the gospels)

- μετάνοια = "change of mind" (2:38, 3:19); μετανοέω cognate. ἄφεσις = "release/forgiveness" (2:38, "release of sins" — see Lk 1:77, 3:3). κοινωνία = "fellowship/sharing" (2:42). Χριστός = "anointed"/"Messiah" (2:31,36; 3:18,20). [**2026-11-20 note:** the "Messiah" half is **superseded** by Launch-Program decision L7 → Entry A-009 — χριστός follows the RULES-GS locked glossary: **"the anointed one"** (lowercase descriptor; capitalized only where it clearly functions as a proper name). The GS lock never allowed "Messiah"; re-rendered in Step 4 batch 4 (EN/PT/ES; DE already reads *Gesalbte*).] ὄνομα "the name" motif (2:21,38; 3:6,16) — kept literal "*the* name". {a:wind/spirit} for πνεῦμα (the locked GS slash). ᾅδης (2:27,31) = {t:Hades} with a Sheol gloss (the LXX renders Sheol → Hades; Ps 16). βάπτισμα/βαπτίζω = "immersion/immerse" (as gospels).

## Cruxes to flag (Tier-2 + source-analysis; Rule-28 review items)

- **2:34** Ps 110:1 double-κύριος (A-005).
- **2:38** εἰς ἄφεσιν τῶν ἁμαρτιῶν — εἰς directionality (causal vs telic; baptismal-theology loaded). Preserve "for/unto"; do not resolve.
- **1:18-19** Judas's death — **do NOT harmonize** with Matthew 27:3-10 (Prime Directive / Rule 3). Note the divergence in Tier-2; render Acts on its own terms.
- **3:21** ἀποκατάστασις πάντων "restoration of all things."
- **2:27,31** ᾅδης / Sheol; "you will not abandon my soul." [**2026-11-20 note:** "my soul" is **superseded** by Launch-Program decision D7 → Entry A-010 — ψυχή is locked **life/being** (RULES-GS); 2:27 is re-rendered in Step 4 batch 4 with the other Acts ψυχή verses.]
- **1:6-7** "restore the kingdom to Israel" + "not for you to know times/seasons."
- **2:42-47** κοινωνία + the communal sharing (the "breaking of bread").

## Entries

### A-006 — EN authoring (Acts 1–3 from NA28)
- **Scope:** 12 EN files — chapters 1–3 (99 verses; transparent register, RULES-GS), study CONTEXT ×3 (§A–§I), PROPHECY ×3 (citation-vs-allusion restraint), INTRODUCTION (+ load-bearing `<!-- CARD -->`), PEOPLE (Acts-canonical: Matthias, Yosef Barsabbas, Theophilus, the lame man, the Twelve + cross-book see-stubs → mark/matthew; **no genealogy**), book CONTEXT (8 motifs).
- Decisions A-001…A-005 applied throughout; the 2:34 double-κύριος and the 2:38 *eis* carry Tier-2 + Rule-13 labels; Judas's death (1:18-19) un-harmonized with Mt 27 (Rule 3).
- **AI provenance:** claude-opus-4-8 (1M); chapters hand-authored, companions via briefed subagents on the chapter exemplars. **Gates:** 886 tests; conservation additive; activation-consistency 8/8; content:lint/lint/build; served-HTML (divine/ambig classes, see-stub links, CARD). Status provisional (Rule 28).

### A-007 — Propagation to PT-BR / DE / ES
- **Scope:** all 12 EN files mirrored into each of the three locales (36 files). Acts now four-locale — all six books at full parity. Established mirror-EN workflow (briefed subagents per file-group); the three ch3-PROPHECY tails hand-finished after the agents hit the account session limit.
- **Names:** Almeida (PT) / Luther (DE) / Reina-Valera (ES) familiar glosses; transliterations mirror EN byte-for-byte; **no redundant `Name (Name)`** (verified 0).
- **Divine name:** PT/ES → **YHWH**; DE → **JHWH** (0 YHWH in body; verified served-HTML). κύριος → "o Senhor"/„der Herr"/"el Señor" (Option C); 2:34 keeps the speaker (YHWH/JHWH) vs Messiah (addressee) distinction.
- **Markers:** `@@`/`{t:}`/`{a:}` parity EXACT vs EN on all 36 files (scripted diff = 0). `{a:wind/spirit}` → `{a:vento/espírito}`/`{a:Wind/Geist}`/`{a:viento/espíritu}`; `{a:tongues/languages}` → `{a:línguas/idiomas}`/`{a:Zungen/Sprachen}`/`{a:lenguas/idiomas}`.
- **QA fixes during audit:** ES INTRODUCTION register-declaration reworded to drop the literal "vosotros" (matching es/luke; cleared the `[legacy] vosotros` lint — T-10); ES CONTEXT 6 dropped `{a:viento/espíritu}` markers restored + 2 over-marked headings/prose unwrapped to match EN's 8 exactly (T-12 marker-parity).
- **AI provenance:** claude-opus-4-8 (1M) + subagents, 2026-06-24. **Gates:** marker parity 36/36; 886 tests; conservation 348 files (additive); content:lint clean; lint/build; served-HTML per locale (der Herr/JHWH·el Señor/ustedes; see-stub links; "Six books"). Status provisional (Rule 28) — **Hellenist review still pending across all four locales.**

## Launch Program decisions (2026-11-19/20)

Decisions taken by the project lead in the Launch-Readiness Program (`docs/audit/LAUNCH_PROGRAM.md` D7–D9; `docs/audit/CONTENT_SWEEP_FINDINGS.md` §3 L1–L8). Recorded here before the content changes ("log before drafting"); the content is changed in the Step 4 batch named in each entry (`docs/audit/PLAN_LAUNCH_FIXES.md`).

- **Ruleset:** this log now runs under **v3.4.1** (RULES-CORE amendment of 2026-11-20 — `docs/rules/CHANGELOG-v3.4.md`).
- **Content re-stamp (2026-11-20, Step 4 batch 2):** 125 front-matter stamp fields + 8 prose stamps were re-stamped Ruleset v3.3 → v3.4 across `content/` (Genesis, John, Matthew); the 4 Luke 3 "v3.3.2 cross-book convention" citations were kept. **No Acts file changed** — all Acts stamps already read v3.4.
- **PT register (L6):** PT verse text keeps the classical *vós* (Acts already uses it throughout) — corpus-wide entry **john.md J-037**.

## Entry A-008 — Rule 30: God's words quoted by another speaker are not marked (reverses A-004)

- **Verse:** Acts 2:17–21 (Joel 2:28–32), 2:34–35 (Ps 110:1), 3:25 (Gen 22:18 / 12:3) — verse study + continuous reading.
- **Language(s) affected:** EN, PT-BR, DE, ES
- **Rule(s) invoked:** CORE Rule 30 (Divine Speech Marking — *Do NOT mark* column, "God's words quoted by another speaker"); Prime Directive.
- **Decision:** the three OT citations inside Kefa's (Peter's) speeches are **not** marked `@@…@@`. Kefa is the speaker; the quoted words are God's, but Rule 30 marks *who is speaking*, and here a human is speaking. The risen Yeshua's direct speech (1:4-5, 1:7-8) stays marked. Applied in **Step 4 batch 4** (the `@@` spans removed in both reading copies, 4 locales); the content notes that cite "(Rule 30 / decision A-004)" are rewritten in the same pass.
- **Alternatives considered:**
  - Keep the marks and log them (rejected: Rule 30's "unless an editorial-log entry justifies" clause covers only speakers whose divine identity is open, not quoted divine words — a log entry cannot override the *Do NOT mark* column).
  - Amend Rule 30 to allow marking quoted divine speech (rejected by the lead, L3 option B: the gospels would then have to mark Mark 1:2–3 and Matt 2:15 as well).
- **Justification:** A-004's premise ("matches the gospel treatment") was false — Mark 1:2–3 and Matt 2:15 are logged unmarked. Following the rule as written gives one treatment across the corpus.
- **AI provenance:** drafted by the AI assistant (claude-opus-5-5), 2026-11-20, executing lead decision L3 (approved 2026-11-20). Step 4 batch 2.
- **Status:** provisional
- **Reviewers:** unassigned
- **Cross-references:** supersedes A-004 and the OT-citation clause of the Rule 30 scope section above; 1-peter.md P-011 (same decision); john.md J-038 (L3, John 3:16–21); `CONTENT_SWEEP_FINDINGS.md` headline 6, S6f.

---

## Entry A-009 — χριστός follows the GS lock "the anointed one"

- **Verse:** Acts 2:31, 2:36, 2:38, 3:6, 3:18, 3:20 (book-wide policy) — verse text, plus TT-voice prose that restates the rendering.
- **Language(s) affected:** EN, PT-BR, ES (DE already renders *Gesalbte*; checked in batch 4)
- **Rule(s) invoked:** GS §Locked Glossary (χριστός = anointed one · ungido · Gesalbter · ungido); CORE Rule 20 (titular nouns lowercase); CORE Rule 1.
- **Decision:** χριστός = **"the anointed one"** (PT *o ungido*, DE *der Gesalbte*, ES *el ungido*) — lowercase where it works as a descriptor; capitalized only where it clearly works as a proper name (the GS rule; batch 4 decides the Ἰησοῦς Χριστός cases, e.g. 2:38, 3:6, case by case). The log line above ("anointed"/"Messiah") is superseded. Applied in **Step 4 batch 4**.
- **Alternatives considered:**
  - Keep "Messiah" as a title (rejected: the GS lock and Rule 20 both say "anointed one", lowercase; the earlier log lines claimed "per GS" but the GS glossary never allowed "Messiah").
  - Amend the GS glossary and Rule 20 to allow "Messiah" (L7 option B — not chosen by the lead).
- **Justification:** one locked rendering across the corpus (John, Matthew, Mark and Luke 3:15 already read "anointed one"). "Messiah" is a transliteration-tradition title that resolves the descriptor into a fixed title the Greek does not mark.
- **AI provenance:** drafted by the AI assistant (claude-opus-5-5), 2026-11-20, executing lead decision L7 (approved 2026-11-20). Step 4 batch 2.
- **Status:** provisional
- **Reviewers:** unassigned
- **Cross-references:** supersedes the "Messiah" half of the Strategic / locked terms line above; 1-peter.md P-012; luke.md L-007; mark.md 2026-06-17-001 (the "anointed one" precedent); `CONTENT_SWEEP_FINDINGS.md` S17.

---

## Entry A-010 — ψυχή = life/being (D7)

- **Verse:** Acts 2:27 ("my soul"), 2:41 ("three thousand souls"), 2:43 ("every soul"), 3:23 ("every soul") — book-wide policy.
- **Language(s) affected:** EN, PT-BR, DE, ES
- **Rule(s) invoked:** GS §Locked Glossary (ψυχή = life/being · vida/ser · Leben/Wesen · vida/ser); GS/HB §Cross-Supplement Glossary Alignment (ψυχή ↔ נֶפֶשׁ); CORE Rule 1.
- **Decision:** ψυχή is rendered from the locked **life/being** pair (PT *vida/ser*, DE *Leben/Wesen*, ES *vida/ser*), the context choosing the member (e.g. 2:41 "about three thousand persons/lives" — exact wording fixed in batch 4). Any departure from the pair is logged as a Rule 1 deviation in batch 4. The lead re-confirmed the lock on 2026-11-19 knowing it re-renders well-known verses (Acts 2:41 named). Applied in **Step 4 batch 4**.
- **Alternatives considered:**
  - "soul" (rejected: post-Platonic "soul" imports a body/soul dualism the Greek usage here does not carry; the GS lock and the HB נֶפֶשׁ alignment exclude it).
  - Keep "soul" in Acts only for the Ps 16 citation (2:27) (rejected: the lock is corpus-wide; the citation renders נֶפֶשׁ, which the HB row also renders life/being).
- **Justification:** the RULES-GS lock + cross-supplement alignment with נֶפֶשׁ; RULES-CORE §I3 and the new RULES-HB bare-נֶפֶשׁ row (v3.4.1) now state the same rendering.
- **AI provenance:** drafted by the AI assistant (claude-opus-5-5), 2026-11-20, executing lead decision D7 (2026-11-19). Step 4 batch 2.
- **Status:** provisional
- **Reviewers:** unassigned
- **Cross-references:** the 2:27 crux line above; 1-peter.md (the 2026-11-19 D7 note in its Strategic / locked terms section); luke.md L-006; genesis.md 2026-11-20-122 (HB row).

---
