# DE Familiar-Names Classification
**Generated:** 2026-05-18 (Step 1 output of `docs/audit/DE_FAMILIAR_NAMES_PLAN.md`)
**Source:** Mapping merged from `docs/rules/RULES-HB.md` §PROPER-NAME TABLE — GENESIS 1-12 + `docs/rules/RULES-GS.md` §PROPER-NAME TABLE — GREEK SCRIPTURES.
**Occurrence scope:** 17 DE chapter files (matthew/CHAPTER-{1,2,3}, john/CHAPTER-{1,2,3}, genesis/CHAPTER-{1..12}) + 1 study file (john/study/CHAPTER-1-CONTEXT.md).
**Gate:** Section §3 (REQUIRES MANUAL CLASSIFICATION) requires project-lead review before Step 2 begins.

---

## 0. Summary

- **Total redundant-parens occurrences:** 335
- **Unique names with redundant-parens:** 39
- **Class A (need `Translit (Familiar)` at first occurrence; bare Familiar thereafter):** 34 unique, 307 occurrences
- **Class B (drop parens, bare form):** 0 unique, 0 occurrences
- **UNMAPPED (require manual classification — gate):** 5 unique, 28 occurrences

- **Files affected:** 17

### File-level totals

| File | Occurrences |
|------|-------------|
| `content/de/genesis/CHAPTER-10.md` | 17 |
| `content/de/genesis/CHAPTER-11.md` | 19 |
| `content/de/genesis/CHAPTER-12.md` | 25 |
| `content/de/genesis/CHAPTER-3.md` | 7 |
| `content/de/genesis/CHAPTER-4.md` | 23 |
| `content/de/genesis/CHAPTER-5.md` | 23 |
| `content/de/genesis/CHAPTER-6.md` | 13 |
| `content/de/genesis/CHAPTER-7.md` | 6 |
| `content/de/genesis/CHAPTER-8.md` | 5 |
| `content/de/genesis/CHAPTER-9.md` | 18 |
| `content/de/john/CHAPTER-1.md` | 44 |
| `content/de/john/CHAPTER-2.md` | 21 |
| `content/de/john/CHAPTER-3.md` | 17 |
| `content/de/john/study/CHAPTER-1-CONTEXT.md` | 1 |
| `content/de/matthew/CHAPTER-1.md` | 31 |
| `content/de/matthew/CHAPTER-2.md` | 36 |
| `content/de/matthew/CHAPTER-3.md` | 29 |

---

## 1. Class A occurrences — Translit ≠ DE Familiar

**Sweep action:** at the first occurrence per section, replace `Name (Name)` with `<Translit> (<Name>)`. All subsequent occurrences in the same section (`^## ` H2 boundary): replace `Name (Name)` with bare `Name`.

| DE Familiar (target) | Translit (first-occurrence form) | Total | Files |
|---|---|---|---|
| Noah | Noach | 30 | 8 files |
| Jesus | Yeshua | 25 | 6 files |
| Kanaan | Kenaan | 20 | 4 files |
| Ham | Cham | 18 | 6 files |
| Abram | Avram | 14 | 4 files |
| Jerusalem | Yerushalayim | 14 | 5 files |
| Johannes | Yochanan | 13 | 4 files |
| Josef | Yosef | 13 | 4 files |
| Set | Shet | 11 | content/de/genesis/CHAPTER-4.md, content/de/genesis/CHAPTER-5.md, content/de/genesis/CHAPTER-6.md |
| Henoch | Chanokh | 10 | 4 files |
| Nazareth | Natseret | 10 | 4 files |
| Jordan | Yarden | 9 | content/de/john/CHAPTER-1.md, content/de/john/CHAPTER-3.md, content/de/matthew/CHAPTER-3.md |
| Lamech | Lemekh | 9 | content/de/genesis/CHAPTER-4.md, content/de/genesis/CHAPTER-5.md, content/de/genesis/CHAPTER-6.md |
| Mose | Mosheh | 9 | content/de/john/CHAPTER-1.md, content/de/john/CHAPTER-3.md, content/de/matthew/CHAPTER-2.md |
| Ägypten | Mitsrayim | 9 | content/de/genesis/CHAPTER-10.md, content/de/matthew/CHAPTER-2.md |
| Eva | Chava | 8 | content/de/genesis/CHAPTER-3.md, content/de/genesis/CHAPTER-4.md, content/de/matthew/CHAPTER-1.md |
| Galiläa | Galil | 8 | content/de/john/CHAPTER-1.md, content/de/matthew/CHAPTER-2.md, content/de/matthew/CHAPTER-3.md |
| Kain | Qayin | 8 | 4 files |
| Bethel | Beyt-El | 7 | content/de/genesis/CHAPTER-12.md, content/de/john/CHAPTER-1.md, content/de/john/CHAPTER-2.md |
| Maria | Miryam | 7 | content/de/matthew/CHAPTER-1.md, content/de/matthew/CHAPTER-2.md |
| Abel | Hevel | 6 | content/de/genesis/CHAPTER-3.md, content/de/genesis/CHAPTER-4.md |
| Elia | Eliyahu | 6 | content/de/john/CHAPTER-1.md, content/de/matthew/CHAPTER-3.md |
| Sichem | Shekhem | 6 | content/de/genesis/CHAPTER-12.md |
| Bethlehem | Beyt-Lechem | 5 | content/de/matthew/CHAPTER-2.md |
| Philippus | Philippos | 5 | content/de/john/CHAPTER-1.md, content/de/john/CHAPTER-2.md |
| Nahor | Nachor | 4 | content/de/genesis/CHAPTER-11.md |
| Nikodemus | Nikodemos | 4 | content/de/john/CHAPTER-3.md |
| Petrus | Kefa | 4 | content/de/john/CHAPTER-1.md, content/de/john/CHAPTER-2.md |
| Simon | Shimon | 4 | content/de/john/CHAPTER-1.md, content/de/john/CHAPTER-2.md |
| Kapernaum | Kfar Nachum | 3 | content/de/john/CHAPTER-2.md |
| Bethanien | Beyt-Anyah | 2 | content/de/john/CHAPTER-1.md |
| Jafet | Yefet | 2 | content/de/genesis/CHAPTER-9.md |
| Jesaja | Yeshayahu | 2 | content/de/john/CHAPTER-1.md |
| Methusalem | Metushelach | 2 | content/de/genesis/CHAPTER-5.md |

## 2. Class B occurrences — Translit == DE Familiar

**No Class B occurrences found.** (Confirmation that the redundant-parens pattern in DE chapter files only involves Class A names — which makes sense, since Class B names like `David` or `Adam` where translit == familiar would not naturally produce a redundant `Name (Name)` form. The original plan §1.5's preliminary Class B candidates from RULES-HB.md were correctly anticipated as cases where parens should NEVER appear; the actual file scan confirms zero such cases need correction.)


## 3. REQUIRES MANUAL CLASSIFICATION (gate before Step 2)

These names appear in DE chapter files as redundant-parens but are NOT listed in either RULES-HB.md or RULES-GS.md proper-name tables. Per Step 1d of `DE_FAMILIAR_NAMES_PLAN.md`, project-lead review is required to lock the proposed classifications below before Step 2 executes.

**Proposed classifications** (derived using RULES-HB.md §Hebrew Transliterations conventions + the project's established transliterations in earlier authored chapters):

| DE Familiar (as it appears in chapter files) | Proposed Translit | Hebrew source | Class | Derivation rationale |
|---|---|---|---|---|
| Abraham | **Avraham** | אַבְרָהָם | A (Avraham ≠ Abraham) | Post-renaming form. RULES-HB.md table lists `Avram → Abram` (pre-renaming); the post-rename `Avraham → Abraham` form is established in project content (Genesis 17 onward; Matthew 1 genealogy uses it). |
| Isaak | **Yitschaq** | יִצְחָק | A (Yitschaq ≠ Isaak) | Standard Hebrew transliteration per RULES-HB.md letter mapping (Y-T-Sh-Ch-Q). Appears in project's Gen 25+ chapters (when authored) + Matthew genealogy. |
| Jakob | **Ya'aqov** | יַעֲקֹב | A (Ya'aqov ≠ Jakob) | Standard Hebrew transliteration. Note the apostrophe represents Hebrew ע (ayin). Appears in Matthew genealogy + Gen 25+ (when authored). |
| Juda | **Yehudah** | יְהוּדָה | A (Yehudah ≠ Juda) | Standard Hebrew transliteration. Used in project's people tables (matthew/PEOPLE.md `Yehudah (Judah)`). |
| Salomo | **Shelomoh** | שְׁלֹמֹה | A (Shelomoh ≠ Salomo) | Standard Hebrew transliteration. Used in matthew/PEOPLE.md (`Shelomoh (Solomon)`). Appears in Matthew genealogy. |

**Per-file occurrence list (for project-lead spot-check):**

### Abraham (10 occurrences)

- `content/de/genesis/CHAPTER-11.md:377`
- `content/de/john/CHAPTER-1.md:52`
- `content/de/john/CHAPTER-1.md:631`
- `content/de/matthew/CHAPTER-1.md:42`
- `content/de/matthew/CHAPTER-1.md:48`
- `content/de/matthew/CHAPTER-1.md:100`
- `content/de/matthew/CHAPTER-1.md:471`
- `content/de/matthew/CHAPTER-3.md:68`
- `content/de/matthew/CHAPTER-3.md:192`
- `content/de/matthew/CHAPTER-3.md:367`

### Isaak (4 occurrences)

- `content/de/genesis/CHAPTER-12.md:229`
- `content/de/matthew/CHAPTER-1.md:66`
- `content/de/matthew/CHAPTER-1.md:109`
- `content/de/matthew/CHAPTER-3.md:367`

### Jakob (3 occurrences)

- `content/de/matthew/CHAPTER-1.md:48`
- `content/de/matthew/CHAPTER-1.md:66`
- `content/de/matthew/CHAPTER-1.md:109`

### Juda (9 occurrences)

- `content/de/matthew/CHAPTER-1.md:66`
- `content/de/matthew/CHAPTER-1.md:109`
- `content/de/matthew/CHAPTER-1.md:479`
- `content/de/matthew/CHAPTER-2.md:48`
- `content/de/matthew/CHAPTER-2.md:64`
- `content/de/matthew/CHAPTER-2.md:84`
- `content/de/matthew/CHAPTER-3.md:48`
- `content/de/matthew/CHAPTER-3.md:66`
- `content/de/matthew/CHAPTER-3.md:140`

### Salomo (2 occurrences)

- `content/de/matthew/CHAPTER-1.md:68`
- `content/de/matthew/CHAPTER-1.md:169`

---

## 4. Gate decision

**Required:** project-lead approves the proposed Class A classification for the 5 unmapped patriarchs (Abraham→Avraham, Isaak→Yitschaq, Jakob→Ya'aqov, Juda→Yehudah, Salomo→Shelomoh). All five derive their transliterations from established project conventions; once approved, the merged mapping table can proceed to Step 2 + Step 3 sweep.

**Optional follow-up (post-sweep, separate item):** consider adding rows for these 5 patriarchs (+ other Gen 13-50 / Kings-era names) to the RULES-HB.md proper-name table in the next rules cycle. This is a separate rules-amendment exercise from the v3.3.1 emergency clarification this sweep produces.
