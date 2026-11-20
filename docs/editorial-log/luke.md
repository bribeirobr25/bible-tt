# Editorial Log — Gospel of Luke

**Ruleset version in force:** v3.4.1
**Book:** Gospel of Luke (Κατὰ Λουκᾶν)
**Base text:** Nestle-Aland 28th ed. (NA28)
**Maintainer:** Project Lead
**Format:** per v3.4.1 Editorial Log Specification

This log records consistency decisions, justified exceptions, text-critical choices, and any deviations from the default ruleset for Luke 1–3. All content is **provisional** pending a credentialed Hellenist review (Rule 28). Authored EN-first from NA28, then propagated to PT-BR / DE / ES.

---

## Entry L-001 — Luke activation + scope

- **Scope:** Luke 1–3, full treatment (chapters + INTRODUCTION + PEOPLE/genealogy + CONTEXT + per-chapter companions + PROPHECY where warranted), all 4 locales. New book #5.
- **Source language / ruleset:** Koine Greek → RULES-GS (kyrios Option C divine name; Greek article system; canonical `κύριος (kyrios)` metadata line; Option B traditions). Narrative gospel = Matthew/Mark template (RULES-CORE Rule 29 genre table: Gospels = Narrative).
- **Rule 30 (divine-speech marking) decision — Gabriel excluded:** Gabriel (*angelos*, 1:11-20, 1:26-38) is an angelic/messenger speaker → **NOT marked** as divine speech, by default, consistent with the Matthew *malakh* (angelos kyriou) / Mark precedent (matthew.md M-004; mark.md). God's/Spirit's direct speech IS marked (e.g. the Bat-Qol at the baptism, 3:22). The canticles (Magnificat 1:46-55, Benedictus 1:68-79, Gloria 2:14, Nunc Dimittis 2:29-32) are **human** speech (Mary, Zechariah, the angelic host, Simeon) → not divine-marked; rendered as flowing prose (see L-002).
- **Genealogy (3:23-38):** ~76 generations, Yeshua → Adam. Rendered as a PEOPLE genealogy table; cross-book see-only stubs to `genesis` (Adam → patriarchs) and `matthew` (David line) per the v3.3.2 cross-book convention.
- **AI provenance:** claude-opus-4-8 (1M), 2026-06-22. **Status:** provisional. **Reviewers:** Hellenist + locale-editors unassigned (Rule 28).
- **Cross-references:** `PLAN_LUKE_EXPANSION.md`; `AUDIT_LUKE_EXPANSION_PLAN.md`; `docs/source-analysis/greek/luke-1-3.md`.

## Entry L-002 — Canticle rendering spike (Phase-1.0): poetry = prose, by established convention

- **Question:** how should the canticles (Magnificat 1:46-55, Benedictus 1:68-79, Gloria 2:14, Nunc Dimittis 2:29-32) render their poetic lines?
- **Spike finding (verified against source):** both the Read view (`continuous-reading.tsx`) and Notes view (`verse-card.tsx`) render verse text via `renderMarkdownSafe(text, "prose")`, and **prose mode collapses `\n` → space** (`render-markdown-safe.ts`; only `"note"` mode emits `<br/>`). The parser *does* keep `\n` in `mainText` (`markdown-parser.ts:193 join("\n")`), but it's flattened at render. A global prose→`<br/>` change would regress **every existing multi-line verse** in Genesis/John/Matthew/Mark → rejected.
- **Decision:** **author the canticles as flowing prose**, matching the established project-wide convention (all existing poetry — e.g. Genesis oracles — already renders run-on). No renderer/infra change. Visual poetic lineation is deferred with the Hebrew-poetry-genre question (Psalms/Proverbs/Ecclesiastes), out of scope for the Luke pilot.
- **AI provenance:** claude-opus-4-8 (1M), 2026-06-22. Status: provisional.

## Entry L-003 — Luke 1–3 propagation to PT-BR

- **Scope:** all 12 EN Luke files mirrored EN→pt-br (chapters, companions, INTRODUCTION+CARD, PEOPLE+genealogy, CONTEXT, PROPHECY). GS-governed; mirror-EN per the Mark precedent.
- **Names:** Almeida tradition (João, Zacarias, Isabel, Maria, Gabriel, Jesus, Simeão, Ana, José, Belém, Nazaré, Jordão; genealogy Davi/Abraão/Adão/Sem/Noé…); transliterations mirror EN byte-for-byte.
- **Divine name:** YHWH (pt keeps YHWH, not JHWH — verified 0 JHWH); main text κύριος→"o Senhor" (Option C); canonical `κύριος (kyrios)` metadata line.
- **Markers:** @@/{t:}/{a:} parity = EN per file (ch1 4/0/12, ch2 12/0/14, ch3 18/0/7); 3:22 Bat-Qol marked, Gabriel/canticles unmarked; canticles as prose; no nested. QA fixes: 3× redundant `Herodes (Herodes)` collapsed (ch1 + companion-1).
- **Cross-book PEOPLE:** 3 see-stubs keep `**Ver:** matthew/PEOPLE.md` + `**Em Lucas:**`; genealogy table (76 rows) localized. CARD + dual-labels use registered pt-br forms.
- **AI provenance:** claude-opus-4-8 (1M) + subagents, 2026-06-23. Gates: 886 tests; conservation 264 files/14529 units; content:lint clean; build; visual (Lucas 1 + hub + people/genealogy + /books). Status provisional (Rule 28).
- **Cross-references:** `PLAN_LUKE_EXPANSION.md`; L-001/L-002.

## Entry L-004 — Luke 1–3 propagation to DE

- **Scope:** all 12 EN Luke files mirrored EN→de. GS-governed; mirror-EN.
- **Names:** Luther tradition (Johannes, Zacharias, Elisabeth, Maria, Gabriel, Jesus, Simeon, Hanna, Josef, Bethlehem, Nazareth, Jordan; genealogy David/Abraham/Adam/Sem/Noah…); transliterations mirror EN byte-for-byte.
- **Divine name: `JHWH` (not YHWH)** — applied to ALL body cross-refs (verified 0 YHWH in de/luke; served Notes view shows 83 JHWH / 0 YHWH). Main text κύριος→„der Herr" (Option C); canonical metadata line; sprach/sagte; German „…" quotes.
- **Markers:** @@/{t:}/{a:} parity = EN per file (ch1 4/0/12, ch2 12/0/14, ch3 18/0/7); 3:22 Bat-Qol marked, Gabriel/canticles unmarked; canticles as prose; no nested. QA: 6× redundant `Herodes (Herodes)` collapsed (ch3 ×5 + companion-1; the ch3 agent ran before ch1 finished and didn't collapse).
- **Cross-book PEOPLE:** 3 see-stubs `**Siehe:** matthew/PEOPLE.md` + `**In Lukas:**`; genealogy table localized. CARD + dual-labels registered de forms.
- **AI provenance:** claude-opus-4-8 (1M) + subagents, 2026-06-23. Gates: 886 tests; conservation 276 files/15237 units; content:lint clean; build; served HTML JHWH-only + CARD + cross-book links. Status provisional (Rule 28).
- **Cross-references:** `PLAN_LUKE_EXPANSION.md`; L-003 (PT-BR).

## Entry L-005 — Luke 1–3 propagation to ES

- **Scope:** all 12 EN Luke files mirrored EN→es (final locale). GS-governed; mirror-EN.
- **Names:** Reina-Valera tradition (Juan, Zacarías, Isabel, María, Gabriel, Jesús, Simeón, Ana, José, Belén, Nazaret, Jordán; genealogy David/Abraham/Adán/Sem/Noé…); transliterations mirror EN byte-for-byte.
- **Divine name:** YHWH (es keeps YHWH, not JHWH — verified 0 JHWH); main text κύριος→"el Señor" (Option C); canonical `κύριος (kyrios)` metadata line; diacritics intact (content:lint §0.3); Reina-Valera declaration present on NT chapters (§0.4).
- **Markers:** @@/{t:}/{a:} parity = EN per file (ch1 4/0/12, ch2 12/0/14, ch3 18/0/7); 3:22 Bat-Qol marked, Gabriel/canticles unmarked; canticles as prose; no nested.
- **Register QA (the substantive ES finding):** initial draft used peninsular **vosotros** forms in the angel speech (2:10-12), Simeón's idou (2:25), and John's preaching quotes (3:8/3:13-14/3:16) + the Isaiah 40:3 citations in the §PROPHECY/§CONTEXT companions. The established ES TT convention is Latin-American **ustedes** (verified: es/john, es/matthew, es/mark all 0 vosotros; content-lint `[legacy] Vosotros forms` blocks `vosotros|vuestr`). Converted all to ustedes against the es/matthew + main es/luke CHAPTER-3 exemplars: `No tengáis miedo`→`No teman`, `mirad`→`miren`, `os traigo/ha nacido`→`les traigo/ha nacido`, `para vosotros`/`encontraréis`→`para ustedes`/`encontrarán`, `no comencéis…entre vosotros`→`no comiencen…entre ustedes`, `os digo`→`les digo`, `os sumergirá`→`los sumergirá`, `no exijáis`→`no exijan`, `contentaos con vuestro salario`→`conténtense con su salario`, TM `preparad`→`preparen`. Also collapsed 2× redundant `Herodes (Herodes)` (PEOPLE + companion-1) and normalized the ch3 tracking-header `(Biblia Hebrea -> Lucas)`→`(BH -> Lucas)` + its TOC anchor.
- **Cross-book PEOPLE:** 3 see-stubs `**Ver:** matthew/PEOPLE.md` + `**En Lucas:**`; genealogy table (76 rows) localized. CARD + dual-labels registered es forms.
- **AI provenance:** claude-opus-4-8 (1M) + subagents, 2026-06-23. Gates: 886 tests; conservation 288 files/15945 units; content:lint clean (1 pre-existing genesis warn); biome lint (registry.ts re-formatted multiline); build; served HTML ustedes-only + no peninsular leakage + visual (Lucas 2 Read). Status provisional (Rule 28).
- **Cross-references:** `PLAN_LUKE_EXPANSION.md`; L-003 (PT-BR); L-004 (DE).

---

## Launch Program decisions (2026-11-19/20)

Decisions taken by the project lead in the Launch-Readiness Program (`docs/audit/LAUNCH_PROGRAM.md` D7–D9; `docs/audit/CONTENT_SWEEP_FINDINGS.md` §3 L1–L8). Recorded here before the content changes ("log before drafting"); the content is changed in the Step 4 batch named in each entry (`docs/audit/PLAN_LAUNCH_FIXES.md`). No earlier Luke entry states a superseded position, so nothing above is annotated.

- **Ruleset:** this log now runs under **v3.4.1** (RULES-CORE amendment of 2026-11-20 — `docs/rules/CHANGELOG-v3.4.md`).
- **Content re-stamp (2026-11-20, Step 4 batch 2):** 125 front-matter stamp fields + 8 prose stamps were re-stamped Ruleset v3.3 → v3.4 across `content/` (Genesis, John, Matthew). **No Luke file changed**: Luke's stamps already read v3.4, and the 4 Luke 3 "v3.3.2 cross-book convention" citations were kept (batch 3 removes the phrase as a reader-facing process leak).
- **PT register (L6):** corpus-wide entry **john.md J-037** (*vós* kept in PT verse text).

## Entry L-006 — ψυχή = life/being (D7)

- **Verse:** Luke 1:46 ("My soul magnifies the Lord"), 2:35 ("a sword will pass through your own soul") — verse study + continuous reading; book-wide policy. (Notes quoting Isa 42:1 "my soul delights" at 3:22 render נֶפֶשׁ, not Luke's ψυχή; they follow the same lock as TT-voice prose under L4.)
- **Language(s) affected:** EN, PT-BR, DE, ES
- **Rule(s) invoked:** GS §Locked Glossary (ψυχή = life/being · vida/ser · Leben/Wesen · vida/ser); GS/HB §Cross-Supplement Glossary Alignment (ψυχή ↔ נֶפֶשׁ); CORE Rule 1.
- **Decision:** ψυχή is rendered from the locked **life/being** pair (PT *vida/ser*, DE *Leben/Wesen*, ES *vida/ser*), the context choosing the member; exact wording fixed in **Step 4 batch 4**, with any departure from the pair logged as a Rule 1 deviation then. The lead re-confirmed the lock on 2026-11-19 knowing it re-renders Luke 1:46 (named in D7).
- **Alternatives considered:**
  - "soul" in the Magnificat as the familiar liturgical form (rejected: the lock is corpus-wide, and liturgical familiarity is not a ground for a Rule 1 deviation; post-Platonic "soul" narrows the Greek's "whole living self").
  - Log 1:46 as a standing Rule 1 deviation (rejected by the lead's re-confirmation of D7).
- **Justification:** the RULES-GS lock + the נֶפֶשׁ alignment; RULES-CORE §I3 and the new RULES-HB bare-נֶפֶשׁ row (v3.4.1) state the same rendering.
- **AI provenance:** drafted by the AI assistant (claude-opus-5-5), 2026-11-20, executing lead decision D7 (2026-11-19). Step 4 batch 2.
- **Status:** provisional
- **Reviewers:** unassigned
- **Cross-references:** acts.md A-010; 1-peter.md (2026-11-19 D7 note); genesis.md 2026-11-20-122 (HB row); L-002 (canticles).

---

## Entry L-007 — χριστός follows the GS lock "the anointed one" (Luke 2)

- **Verse:** Luke 2:11 ("Messiah, Lord" — Χριστὸς κύριος), 2:26 ("the Messiah of *the* Lord" — τὸν Χριστὸν κυρίου) — verse text, notes and the chapter-2 glossary row that says "The TT renders 'Messiah'". Luke 3:15 already reads "the anointed one".
- **Language(s) affected:** EN, PT-BR, DE, ES
- **Rule(s) invoked:** GS §Locked Glossary (χριστός = anointed one · ungido · Gesalbter · ungido); CORE Rule 20 (titular nouns lowercase); CORE Rule 1.
- **Decision:** χριστός = **"the anointed one"** (lowercase descriptor; capitalized only as a proper name). Indicative wording (fixed in batch 4): 2:11 "anointed one, Lord" (the NA28 nominatives and the apposition-vs-"the Lord's anointed" crux note kept); 2:26 "the anointed one of *the* Lord", which also makes the LXX *mashiach YHWH* echo ("the Lord's anointed", 1 Sam 24:7) visible. Applied in **Step 4 batch 4**.
- **Alternatives considered:**
  - Keep "Messiah" in Luke 2 (rejected: splits the book — 3:15 already follows the lock — and the GS glossary never allowed "Messiah").
  - Amend the GS glossary and Rule 20 to allow "Messiah" (L7 option B — not chosen by the lead).
- **Justification:** one locked rendering across the corpus; the 2:11 crux stays visible through the note, not through a capitalized title.
- **AI provenance:** drafted by the AI assistant (claude-opus-5-5), 2026-11-20, executing lead decision L7 (approved 2026-11-20). Step 4 batch 2.
- **Status:** provisional
- **Reviewers:** unassigned
- **Cross-references:** acts.md A-009; 1-peter.md P-012; mark.md 2026-06-17-001; `CONTENT_SWEEP_FINDINGS.md` S17.

---
