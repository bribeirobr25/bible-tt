# Plan — Mark 1–3 propagation to PT-BR / DE / ES

**Status:** PLANNED — **self-audited 2026-06-21** (findings folded in) · approved: branch off `main`/PR gate (Q1), PT-BR checkpoint (Q2), AI-draft→provisional→Rule-28 (Q3) · **Date:** 2026-06-21 · **Class:** content authoring (translation) · **Risk:** Medium (volume + per-locale rule compliance; additive, not destructive)

> **Self-audit disposition (verified against source):**
> 1. **Name rendering corrected (was wrong).** The GS/HB proper-name *tables do NOT cover Mark's cast* (Kefa, Zavdai, Yarden, Yehudah, etc. — verified absent). So names are NOT a table lookup. Rule: **transliterated form = locale-independent → mirror EN exactly** (Shimon, Kefa, Zavdai, Yarden, Andreas, Yochanan are identical in all locales); **familiar form (in parens) = each locale's Bible-tradition standard** (Almeida/Luther/Reina-Valera), e.g. `Yehudah (Judah)` → PT `(Judá)` / DE `(Juda)` / ES `(Judá)`; `Yeshua (Jesus)` → ES `(Jesús)`. The per-locale familiar-name set is logged in `mark.md` (§4.2). Matthew precedent confirms this exact pattern.
> 2. **Conservation is additive-safe.** The gate `walk()`s `CONTENT_ROOT` (auto-discovers) and derives `expectedTotal` per file — there is **no hardcoded count**. Adding 27 Mark files needs no test edit; the "files → units" line is a `console.log`, not an assertion. (G1 reworded.)
> 3. **Exact localized strings captured** (Appendix A) — divine-name-policy line + cross-book label per locale — so execution can't re-derive them or reintroduce the `kyrios (kyrios)` defect.
> 4. Everything else in the plan held up: lint-config the only code change; Matthew see-targets exist in all locales (no dangling); marker-parity invariant; v3.4 stamp; Option B traditions.

---

## 1. Goal

Mark 1–3 exists in **EN only** (an authored, on-`main` pilot). Propagate it to **PT-BR, DE, ES** so Mark matches the four-locale parity of Genesis/John/Matthew. EN is the source-of-truth draft; this is mirror-EN translation governed by RULES-GS + each locale's conventions, shipping `provisional` pending Rule-28 locale-editor sign-off (the established Matthew/John pattern).

## 2. Scope

Per locale, mirror the 9 EN/Mark files (~2,787 lines each locale → ~8,400 lines total across 3):

| File | Lines (EN) | Notes |
|---|---|---|
| `CHAPTER-1.md` / `-2` / `-3` | 676 / 431 / 509 | Reading text + Reading Guide + verse notes + glossary + supplementary |
| `INTRODUCTION.md` | 187 | Sections A–F (as present) + mandatory §G Sources + disclaimer |
| `PEOPLE.md` | 230 | 3 see-only stubs + ~15 full entries (the Twelve, Zebedee, Levi) |
| `CONTEXT.md` | 84 | Book-level cross-chapter motifs |
| `study/CHAPTER-{1,2,3}-CONTEXT.md` | 240 / 212 / 218 | Companion §I "World at the Time" + enrichment |

**Total: 27 new files.** No PROPHECY files (EN/Mark has none → none to propagate).

## 3. Analysis — what's already wired vs. what this plan must change

**Already wired (no work needed):**
- i18n `mark` label in all locales (`Marcos` / `Markus` / `Marcos`) + heroTagline already lists Mark — `messages/{pt-br,de,es}.json`.
- Parser `inBook` aliases for cross-book stubs: `em marcos` / `in markus` / `en marcos` — `people-fields.ts:205–208`.
- `bookLabels` + Rule-29 see-target allow-list + parser activation — done at EN/Mark activation (code, locale-agnostic).
- Matthew canonical PEOPLE entries (the see-targets for Yeshua / Yochanan the Immerser / Miryam) **exist in all three locales** (17 headings each) → no dangling pointers.

**Must change (one config edit):**
- `scripts/content-lint.sh` — `CONTENT_DIRS`, `STUDY_DIRS`, `PEOPLE_FILES`, `CONTEXT_FILES` currently list only `content/en/mark`. **Add the pt-br/de/es mark dirs+files** so content-lint covers the new content. (Editorial-logs list already includes `mark.md`.)

**No other code changes.** Parsers auto-discover new content files.

## 4. Per-locale rule compliance (the core discipline)

Mark is **Greek Scriptures** → RULES-GS governs. Apply, per locale:

1. **Divine name (Rule 25 / GS Option C):** Mark's main text uses **κύριος (kyrios)** rendered per locale ("the Lord" / "o Senhor" / "der Herr" / "el Señor") when quoting OT YHWH passages; YHWH never inserted into the GS main text. The chapter **Divine-Name-Policy metadata line** must use the **canonical `κύριος (kyrios)`** form from the start (per `PLAN_KYRIOS_DIVINE_NAME_FIX.md` — never the degraded `kyrios (kyrios)`), in each locale's wording (Option C / Opção C / Opção... → use the established pt-br/de/es strings).
2. **Name rendering (v3.2) — NOT a table lookup (audit Finding 1):** the GS/HB name tables don't cover Mark's cast. Apply: **transliterated form = locale-independent → mirror EN byte-for-byte** (Shimon, Kefa, Andreas, Zavdai, Yochanan, Yarden, Galil…); **familiar form (parens) = the locale's Bible-tradition standard** (Almeida / Luther / Reina-Valera) — e.g. `Yehudah (Judah)`→ PT/ES `(Judá)`, DE `(Juda)`; `Yeshua (Jesus)`→ ES `(Jesús)`; place names likewise (Jordan→Jordão/Jordan/Jordán; Galilee→Galileia/Galiläa/Galilea). Transliterated form once per section, familiar thereafter. Never redundant `Name (Name)` (v3.3.1) — and where a locale's familiar == transliteration, collapse to the single form. **Log the per-locale familiar-name set in `mark.md`** (one entry per locale).
3. **Text-highlight markers (Rules 11/4/2/30):** `@@…@@` (divine speech), `{t:…}` (translit term), `{a:…}` (ambiguity slash), `*added*` (grammatical). **Marker COUNT must match EN exactly per file** (the cross-locale parity invariant we verified corpus-wide); only the *content inside* localizes (e.g. `{a:wind/spirit}` → `{a:vento/espírito}` / `{a:Wind/Geist}` / `{a:viento/espíritu}`). Divine-speech spans wrap the same Yeshua/God utterances.
4. **Reading-Guide heading localized:** `GUIA DE LEITURA` / `LESEANLEITUNG` / `GUÍA DE LECTURA` (+ the marker-legend lines localized).
5. **DE specifics:** speech verbs (sprach/sagte) per established DE convention; article additions not in the Greek marked `*…*` per Rule 11 (GS §article notes, e.g. "vom/zum" contractions); divine name **JHWH** (not YHWH) where the HB name appears in cross-refs.
6. **ES specifics:** divine name **YHWH** (not JHWH — Spanish J=/x/, RULES-CORE L1226); pan-Hispanic neutral register (no voseo/vosotros); Reina-Valera tradition = **Option B**.
7. **PT-BR specifics:** Almeida tradition = **Option B**; established locked terms (e.g. *unigênito*) per GS table.
8. **Methodology stamp:** new files carry **`30-Rule … (Ruleset v3.4)`** in each locale's wording (current ruleset; matches en/mark).
9. **Tradition policy line:** Luther / Reina-Valera / Almeida → **Option B** (matches the Matthew/John precedent).
10. **Editorial log first:** any *new* per-locale rendering decision (beyond mirror-EN) logged in `docs/editorial-log/mark.md` before drafting (RULES-CORE schema). Pure mirror-EN needs no new entry (per the M-032/J-033 precedent).

## 5. Cross-book PEOPLE handling

Mark/PEOPLE has **3 see-only stubs** → matthew/PEOPLE.md (Yeshua, Yochanan the Immerser, Miryam) + **~15 full entries** (Shimon Kefa, Andreas, the Zavdai sons, Zavdai, Levi, and the rest of the Twelve named at 3:16–19).

- **See-only stubs:** keep the `**See:** matthew/PEOPLE.md` pointer (parser resolves the localized `inBook` alias); localize the `**In Mark:**` role paragraph. The see-target exists in all locales → no dangling pointer.
- **Full entries:** translate all fields; preserve transliteration+familiar name forms; keep disambiguations (two Yochanans, three Ya'aqovs, Levi=Mattai note, Kena'ani=zealous) per the EN entries.
- **Localize the cross-book "In <Book>" label** consistent with the parser alias (`Em Marcos` / `In Markus` / `En Marcos`).

## 6. Execution — phased, per-locale, gated

EN-first is done. Propagate **one locale fully, gate, then the next** (lets each locale's full convention set be applied coherently and validated before moving on):

- **Phase 0:** extend `scripts/content-lint.sh` (the 4 path lists) for pt-br/de/es mark. Gate.
- **Phase 1 — PT-BR:** all 9 files → gate → visual check → commit. **CHECKPOINT: pause for project-lead review of the first locale's quality/approach before continuing.**
- **Phase 2 — DE:** all 9 files → gate → visual → commit.
- **Phase 3 — ES:** all 9 files → gate → visual → commit.
- **Phase 4 — docs/logs:** editorial-log/mark.md per-locale entries; EXECUTION_HISTORY; PENDING (Mark propagation → done, Rule-28 pending); refresh CLAUDE.md/README scope ("Mark 1–3 in all four locales").

Within a locale: chapters (1→3) → study companions → INTRODUCTION → CONTEXT → PEOPLE.

## 7. Validation gate (per locale + final)

| # | Check | Pass |
|---|---|---|
| G1 | `pnpm test` incl. conservation | green. Conservation **auto-discovers** (`walk(CONTENT_ROOT)`) and derives `expectedTotal` per file — **no hardcoded count to edit** (audit Finding 2); the new Mark files must each pass per-file count + content-multiset derivation (zero loss). The "files → units" print rises additively. |
| G2 | marker parity | each new file's `@@`/`{t:}`/`{a:}` counts **equal the EN/Mark file's** (per §4.3) |
| G3 | no redundant `Name (Name)` (v3.3.1) | 0 in new files |
| G4 | divine-name metadata | canonical `κύριος (kyrios)` (no degraded form) in all new chapter stamps |
| G5 | `pnpm content:lint` | clean (new mark paths registered); no new blocking findings |
| G6 | `pnpm lint` + `pnpm build` | clean; all new pages prerender |
| G7 | i18n parity | no new UI strings needed (content-only); labels already present |
| G8 | visual (Docker MCP) | per locale: a Mark chapter (markers render, no literals leak) + Mark people page (stubs link to matthew, no dangling) + book hub |
| G9 | cross-book links | Mark see-only stubs resolve to {locale}/matthew/people; no dangling-pointer fallback triggered |

## 8. Risks & rollback

- **Risk: marker drift** (counts diverge from EN) → G2 catches per file.
- **Risk: degraded κύριος metadata** (the kyrios defect we just fixed) → G4 + author canonical from the start.
- **Risk: dangling cross-book pointer** if a see-target slug differs per locale → G9 + matthew entries already exist (verified).
- **Risk: translation quality / rule nuance** → provisional status + Rule-28 locale-editor sign-off is the safety net; PT-BR checkpoint (Phase 1) catches systemic issues early.
- **Rollback:** additive content on a feature branch; `git revert` / delete the new files. No existing content/code mutated except the content-lint path lists (trivially revertible).

## 9. Open decisions for project lead

1. **Branch + authorization:** new feature branch off `main` (e.g. `mark-propagation`), PR per the standing gate. Confirm.
2. **Checkpoint after PT-BR (Phase 1)** before DE/ES — recommended (validate approach on one locale first). Accept, or do all three then one review?
3. **Translation authorship:** AI-drafted mirror-EN → `provisional` → Rule-28 locale-editor review (the Matthew/John precedent). Confirm this is the intended path (vs. waiting for a human translator to author from scratch).

**All three approved 2026-06-21** (Q1 branch-off-main/PR gate · Q2 PT-BR checkpoint · Q3 AI-draft→provisional→Rule-28).

---

## Appendix A — exact localized strings (mirror these; do not re-derive)

**Divine-Name-Policy metadata line** (canonical `κύριος (kyrios)` — never the degraded `kyrios (kyrios)`):
- **PT-BR:** `**Política do Nome Divino (Regra 25 / Política GS):** Opção C — κύριος (kyrios) traduzido como "o Senhor" ao citar passagens do AT com YHWH; anotado no Nível 2.`
- **DE:** `**Gottesname-Politik (Regel 25 / GS-Politik):** Option C — κύριος (kyrios) als „der Herr" wiedergegeben bei Zitaten alttestamentlicher JHWH-Stellen; vermerkt in Stufe 2.`
- **ES:** `**Política del Nombre Divino (Regla 25 / Política GS):** Opción C — κύριος (kyrios) traducido como "el Señor" al citar pasajes del AT con YHWH; anotado en Nivel 2.`

**Language field (line 9 precedent):** PT `**Idioma:** Português Brasileiro` · DE `**Sprache:** Deutsch` · ES `**Idioma:** Español`.

**Methodology stamp (v3.4 — match the restamp wording):** PT `**Metodologia:** Sistema de Governança de 30 Regras (Conjunto de Regras v3.4)` · DE `**Methodik:** 30-Regeln-Governance-System (Regelwerk v3.4)` · ES `**Metodología:** Sistema de Gobernanza de 30 Reglas (Reglas v3.4)`.

**Cross-book "In Mark" label** (matches parser `inBook` aliases): PT `**Em Marcos:**` · DE `**In Markus:**` · ES `**En Marcos:**`.

**Reading-Guide heading:** PT `GUIA DE LEITURA` · DE `LESEANLEITUNG` · ES `GUÍA DE LECTURA` (+ localize the marker-legend lines beneath).

> All other metadata labels (Base Text, etc.) and section headings: mirror the existing pt-br/de/es **Matthew** files' wording for consistency.
