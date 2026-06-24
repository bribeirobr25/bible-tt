# Editorial Log — Acts of the Apostles

**Ruleset version in force:** v3.4
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
- **A-004 — Embedded divine speech in OT citations:** mark `@@…@@` (e.g. Joel's first-person "I will pour out my Spirit," 2:17-18; "says God" framing). Matches the gospel treatment of quoted divine speech.

## Rule 30 (divine-speech marking) — scope for Acts 1–3

- **Marked `@@…@@`:** the **risen Yeshua's** direct first-person speech (1:4-5, 1:7-8) — consistent with the gospel treatment of Jesus's sayings (e.g. Lk 2:49); embedded first-person divine speech inside OT citations (Joel, 2:17-21, the "I will pour out / says God" portions).
- **NOT marked:** the **two men / ascension angels** (1:10-11) — *angelos*-class messengers (the Gabriel/malakh precedent). Peter's sermons are human speech. The OT human-voice portions of citations (e.g. David speaking in Ps 16, "I saw the Lord") are human speech, not marked.

## Divine name — κύριος Option C (GS)

- Main text renders κύριος as **"the Lord"** + Tier-2 note on the referent. Canonical metadata line in front matter.
- **A-005 — Acts 2:34, Ps 110:1 (the headline crux):** "*The Lord* (κύριος = YHWH, the speaker) said to my *lord* (κύριος/τῷ κυρίῳ = the Messiah, addressee)." Two distinct referents under one Greek word. Render to preserve both; **Rule 13** uncertainty + Tier-2 (the Davidic-Messiah argument of the sermon turns on it). DE→JHWH / PT·ES→YHWH for the YHWH referent in propagation.
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

- μετάνοια = "change of mind" (2:38, 3:19); μετανοέω cognate. ἄφεσις = "release/forgiveness" (2:38, "release of sins" — see Lk 1:77, 3:3). κοινωνία = "fellowship/sharing" (2:42). Χριστός = "anointed"/"Messiah" (2:31,36; 3:18,20). ὄνομα "the name" motif (2:21,38; 3:6,16) — kept literal "*the* name". {a:wind/spirit} for πνεῦμα (the locked GS slash). ᾅδης (2:27,31) = {t:Hades} with a Sheol gloss (the LXX renders Sheol → Hades; Ps 16). βάπτισμα/βαπτίζω = "immersion/immerse" (as gospels).

## Cruxes to flag (Tier-2 + source-analysis; Rule-28 review items)

- **2:34** Ps 110:1 double-κύριος (A-005).
- **2:38** εἰς ἄφεσιν τῶν ἁμαρτιῶν — εἰς directionality (causal vs telic; baptismal-theology loaded). Preserve "for/unto"; do not resolve.
- **1:18-19** Judas's death — **do NOT harmonize** with Matthew 27:3-10 (Prime Directive / Rule 3). Note the divergence in Tier-2; render Acts on its own terms.
- **3:21** ἀποκατάστασις πάντων "restoration of all things."
- **2:27,31** ᾅδης / Sheol; "you will not abandon my soul."
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
