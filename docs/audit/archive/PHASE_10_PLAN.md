# Phase 10 — Author John PEOPLE.md

**Created:** 2026-05-14
**Revised:** 2026-05-14 post-audit (`docs/audit/archive/AUDIT_PHASE_10_PLAN.md`) — 5 significant authoring-failure-mode findings + 2 PV-must-fix lint-coverage findings absorbed; 1 minor wording correction; 1 explicit-statement clarification.
**Source:** `docs/audit/FIX_IMPLEMENTATION.md` Phase 10; `docs/audit/PENDING.md` "John PEOPLE.md missing"; `docs/feedback/DEFERRED_TASKS.md` Task 6 (open since 2026-04 — biggest open content gap for Phase 7 readability cycle).
**Status:** drafted; revised post-audit; awaiting project-lead approval before execution
**Scope:** 4 new files at `content/{en,pt-br,de,es}/john/PEOPLE.md` covering figures introduced in John 1–3 + group entry for Yehudim + see-only cross-references for Yeshua, Yochanan (already in matthew/PEOPLE.md), and OT-referenced figures.

## Audit revisions absorbed (2026-05-14)

Independent audit (`docs/audit/archive/AUDIT_PHASE_10_PLAN.md`) verified all infrastructure claims (parser aliases, bookLabels map, test count, J-021 numbering, listBooks behavior, /john/people route) but found significant gaps in the entry schemas that would have produced silent authoring failures. All 8 findings agreed with after verification:

- **Significant #1 — §4.3 parser-anchor mechanism wrong (specification error).** Plan said "Parser will skip the H2 entry if no `**Verse:**` field is present" — but `**Verse:**` is a *prophecy-parser* concept (`prophecy-parser.ts`). The *people-parser* anchors on H2 alone (`ENTRY_HEADER = /^## (.+)$/`) and only requires `name` from heading parsing (`people-parser.ts` lines 723–741). The conclusion (Yehudim parses fine via H2 alone) is correct; the mechanism description was wrong. Fixed in §4.3.
- **Significant #2 — Yehudim entry `**Senses:**` / `**Cross-reference:**` / `**Group entry:**` silently dropped (CRITICAL authoring failure).** Verified: `EXACT_LABEL_ALIASES` in `people-parser.ts` does not include these field keys → silently ignored at parse time. Even worse, the fields that ARE parsed for Yehudim (firstMention, mentionedIn, keyEvents) are **not rendered by PersonCard** at `src/ui/people/person-card.tsx` lines 309–360. A Yehudim accordion authored per the original §4.3 design would expand to show **nothing**. **Fix:** repurpose `**Character arc:**` for the 3-sense breakdown (IS rendered as a Field row); `**Archaeological evidence:**` for the anti-misuse safeguard (IS rendered in the bordered block at lines 342–353). All standard fields. No code change. Fixed in §4.3.
- **Significant #3 — `**Note:**` in §4.1 full entries also not parsed or rendered.** Verified consistent with existing Matthew/Genesis PEOPLE.md pattern: `**Note:**` is markdown-level documentation only, neither parsed nor rendered. Useful for human readers of the source file but invisible in the rendered UI. Stated explicitly in §4.1 now to prevent authors from putting critical info there.
- **Significant #4 — Yochanan duplication risk with `matthew/PEOPLE.md` (Phase 6.6G entry).** Verified at `content/en/matthew/PEOPLE.md` lines 230–250+: Yochanan the Immerser has a full canonical entry there from Phase 6.6G. Phase 10 originally proposed authoring Yochanan as a 6th "FULL ENTRY" in John PEOPLE.md — but this would duplicate the Phase 6.6G work. **Fix:** Yochanan moves to **SEE-ONLY → matthew/PEOPLE.md** (same pattern as Yeshua). The full bio stays in matthew/PEOPLE.md; John PEOPLE.md has a 5-line stub with `**See:** matthew/PEOPLE.md` + `**In John:** ...` summarizing the John-specific role (the witness in John 1, the second testimony at 3:22–36). Total **full entries: 5** (was 6), see-only-cross-book: **2** (was 1).
- **Significant #5 — `parseCrossBookSlug` behavior description in §9 risk #3 slightly wrong.** My text said "returns null for unknown slugs". Verified: function actually returns the parsed slug string (or null only if the pointer doesn't match `/^([a-z][a-z-]*)\/PEOPLE\.md$/i`). The fallback to plain-text is triggered by `!slug || !bookLabels[slug]` — i.e., either the regex didn't match OR the slug is unknown in the bookLabels map. For dangling-pointer cases like `exodus/PEOPLE.md`, the slug IS extracted as "exodus" but bookLabels["exodus"] is undefined, so the fallback fires. Same graceful behavior, more accurate mechanism. Fixed.
- **Significant #6 — Em-dash convention should have an explicit row in §5.** Plan inherits Phase 6.6A numeric-range en-dash convention + Phase 6.6 em-dash conventions implicitly. Author audit risk: a long-bio field with " -- " trips content-lint §0.2 (same as Phase 11.5 audit R2.2 caveat). Added explicit row to §5.
- **PV.1 (CRITICAL) — content-lint §0.6 deferred pending Phase 10.** Verified at `scripts/content-lint.sh` lines 173–175: rule §0.6 ("John PEOPLE.md absence") is commented as "DEFERRED until after Phase 10. Activated post-Phase 10". Plan §8 DoD did not mention activating it. **Fix:** step 10.8 now includes "uncomment and activate §0.6" as an explicit task.
- **PV.2 (CRITICAL) — `$PEOPLE_FILES` and `$NON_EN_PEOPLE_FILES` hardcoded to genesis + matthew.** Verified at `scripts/content-lint.sh` lines 23–24: variables are explicit file lists, not glob patterns. Rules §0.7 (TT heading leftover), §0.8 (heading collision per locale), §0.10 (modern-mapping smell-test) use these variables and will **silently skip John PEOPLE.md** unless updated. **Fix:** step 10.8 includes "update both variables to add the 4 new John PEOPLE.md files".
- **PV.3 (verified, no action) — `listBooks` and `/john/people` route confirmed.** `listBooks` returns directories containing `CHAPTER-N.md` files; John already qualifies. `/john/people` static route is generated at build time; currently 404s because `readPeople` returns null. After Phase 10 it renders without any build config changes.

---

## 1. Goal (one sentence)

Light up the **People** view-mode for John (`/{locale}/john/people`) — currently 404'd because no `PEOPLE.md` exists — by authoring biographical entries for John 1–3 figures in all 4 locales, following the Phase 6.6 PersonEntry schema and the Phase 6 cross-book see-only pattern already established in `matthew/PEOPLE.md`.

## 2. Why a plan (not just authoring)

Three real decision-points up front that affect ~1,200 cells of locale propagation:

1. **Per-figure scope category.** Figures fall into 4 distinct shape classes (full / see-only-cross-book / group-entry / OT-referenced-stub). The wrong shape per figure creates locale-editor confusion and parser-validation failures.
2. **Cross-book see-only pattern direction.** Phase 6.6 established `**See:** genesis/PEOPLE.md` (Matthew → Genesis). Phase 10 introduces the reverse case (`**See:** matthew/PEOPLE.md` from John → Matthew, for Yeshua), plus a new forward-pointing case to unauthored books (Mosheh → future `exodus/PEOPLE.md`). The graceful-dangling-pointer behavior in `person-card.tsx` handles both, but the convention needs documenting.
3. **Yehudim group entry schema deviation.** Unlike person-entries, the Yehudim group has no Birth year / Father / Mother — but does have a 3-sense Ioudaioi Policy (`docs/editorial-log/john.md` Entry J-006). Schema deviation needs explicit field-list pinning so locale editors don't fill in inapplicable fields.

After these decisions, locale propagation is mechanical (EN canary → 3 locale mirrors).

## 3. Figures in scope

Inventory of transliteration-paired names in `content/en/john/CHAPTER-{1,2,3}.md` filtered to person-referents (not place-names):

| # | Name (TT-Familiar) | First mention | Scope category | Why this scope |
|---|---|---|---|---|
| 1 | **Yochanan the Immerser (John the Baptist)** | Jn 1:6 | **SEE-ONLY → matthew/PEOPLE.md** (audit Sig #4) | Yochanan has a canonical PersonEntry in `matthew/PEOPLE.md` from Phase 6.6G (Entry M-014); John PEOPLE.md should NOT duplicate it. Pattern mirrors Yeshua (entry 2). The John see-only stub adds the John-specific narrative role: the prologue witness (1:6–8, 15), the dialogue with the Yehudim delegation (1:19–28), the testimony at the Yarden (1:29–34), the second testimony at 3:22–36 (the "friend of the bridegroom" framing). Post-Phase-13 cross-book canonical refactor will merge the Matthew + John entries into one canonical Yochanan PersonEntry. |
| 2 | **Yeshua (Jesus)** | Jn 1:1 (Word) / Jn 1:17 (named) | **SEE-ONLY → matthew/PEOPLE.md** | Yeshua's canonical PersonEntry already exists in `matthew/PEOPLE.md` per Phase 6.6G; John's entry is `**See:** matthew/PEOPLE.md` + `**In John:** ...` narrative summary. Mirrors the Matthew see-only-to-Genesis pattern for OT figures. |
| 3 | **Andreas (Andrew)** | Jn 1:40 | **FULL ENTRY** | First-called disciple; brother of Kefa; brings Kefa to Yeshua. No canonical home yet — John PEOPLE.md becomes the canonical entry until cross-book refactor (Phase 13). |
| 4 | **Shimon Kefa (Simon Peter)** | Jn 1:40, 42 | **FULL ENTRY** | Brother of Andreas; renamed *Kefa* (Rock) by Yeshua at 1:42 — the Greek *Kēphas* = Aramaic *Kepha*. No canonical home yet. |
| 5 | **Philippos (Philip)** | Jn 1:43 | **FULL ENTRY** | First-called from Galilee; from Beyt-Tsaidah (Bethsaida), the city of Andreas + Kefa. Brings Nathanael to Yeshua. No canonical home yet. |
| 6 | **Nathanael** | Jn 1:45 | **FULL ENTRY** | Brought by Philip; under the fig tree; declared "King of Yisra'el." Likely the same figure as Bar-Tholmai in the Synoptics (Nathanael appears only in John). |
| 7 | **Nikodemos (Nicodemus)** | Jn 3:1 | **FULL ENTRY** | Pharisee + ruler of the Yehudim; comes by night; reappears at 7:50–52 + 19:39. Full-entry warranted by the centrality of the John 3 dialogue. |
| 8 | **Yehudim** (the Judeans / Jews) | Jn 1:19 | **GROUP ENTRY** | Special-shape entry — references the 3-sense Ioudaioi Policy (`john.md` Entry J-006). No standard person-fields; replaced with a sense-breakdown table. |
| 9 | **Mosheh (Moses)** | Jn 1:17, 1:45, 3:14 | **SEE-ONLY → exodus/PEOPLE.md** (future) | Referenced; no canonical home yet (Exodus not authored). See-only stub points to future `exodus/PEOPLE.md`; the dangling pointer renders gracefully per `person-card.tsx` design. |
| 10 | **Eliyahu (Elijah)** | Jn 1:21, 1:25 | **SEE-ONLY → kings/PEOPLE.md** (future) | Referenced when Yochanan denies being him; no canonical home yet. Same dangling-pointer treatment. |
| 11 | **Yeshayahu (Isaiah)** | Jn 1:23 (Isa 40:3 cited) | **SEE-ONLY → isaiah/PEOPLE.md** (future) | Cited prophet; no canonical home yet. Same dangling-pointer treatment. |

**Total: 11 entries per locale × 4 locales = 44 entries authored.**

Revised category counts after audit Sig #4 (Yochanan → see-only):
- **5 full entries** (Andreas, Kefa, Philippos, Nathanael, Nikodemos) — was 6
- **2 see-only-to-existing-PEOPLE.md** (Yochanan + Yeshua, both → matthew/PEOPLE.md) — was 1
- **1 group entry** (Yehudim)
- **3 see-only-to-future-PEOPLE.md** (Mosheh, Eliyahu, Yeshayahu)

Effort scaling: Yochanan was originally budgeted as the largest full entry (~5 fields populated extensively); the see-only stub is much faster. Net effort reduction: ~30 min on EN canary; ~15 min on each locale mirror.

### Excluded (deliberate; documented in editorial-log)

- **Place-names** (Beyt-Anyah, Bethsaida, Yerushalayim, Galil, Yarden, Natseret, Kinneret, Beyt-Tsaidah) — not persons; out of PEOPLE.md scope.
- **Group references** that aren't named-as-actors (Perushim/Pharisees as a movement) — handled in chapter companions §C2/§C3; the group is not a singular referent here. The Yehudim entry covers the politically-active group; Perushim is implied within it.

## 4. Per-figure schema decisions

### 4.1 Full entry shape (5 entries: Andreas, Kefa, Philippos, Nathanael, Nikodemos — revised per audit Sig #4)

Use the **post-Phase-6.6G PersonEntry schema** (`src/domain/content/types.ts` lines 60–106). All standard fields required where the text supports them:
- `name` (transliteration) / `familiarName` (locale-familiar form) — auto-extracted from H2 heading per Phase 6.6B
- `meaning` (etymology)
- `originType: BORN`
- `birthYear` / `deathYear` / `lifespan` text — Phase 6.6G convention: free-form text with confidence labels
- `historicalYear` (parseInt-safe bare integer where determinable)
- `father` / `mother` / `siblings` / `spouses` / `children`
- `firstMention` / `mentionedIn` / `keyEvents` — **parsed but not rendered in PersonCard** (audit Sig #3 verification: `src/ui/people/person-card.tsx` does not reference these fields). Include for parser-validation and forward-compatibility with future UI work, but author with the understanding that readers will not see them in the current rendered output.
- `familiarName`, `profession`, `socialClass`, `hometown`, `placesLived`, `causeOfDeath`
- `archaeologicalEvidence`, `extraBiblicalMentions`, `historicityStatus`, `booksAppearingIn`
- `characterArc`
- `**Note:**` — **markdown-only documentation, not parsed, not rendered** (audit Sig #3). Useful for the source-file reader / Rule 28 reviewer; invisible in the rendered UI. Do NOT put critical information here. Consistent with the existing Matthew + Genesis PEOPLE.md pattern.

### 4.2 See-only cross-book shape (Yeshua, Mosheh, Eliyahu, Yeshayahu)

Mirror the existing Matthew → Genesis pattern from `content/en/matthew/PEOPLE.md`:

```markdown
## Yeshua (Jesus)
**See:** matthew/PEOPLE.md
**In John:** [3-5 sentences summarizing Yeshua's narrative role in John 1–3 — the Logos, the Lamb of God (1:29), the messianic identification by Andreas/Kefa/Philippos/Nathanael, the Cana wedding, the temple cleansing, the Nikodemos dialogue, the second Cana sign.]
```

For dangling-pointer cases (Mosheh, Eliyahu, Yeshayahu), the same shape but with `**See:** future-book/PEOPLE.md` — UI's `parseCrossBookSlug` returns `null` for unknown slugs, so the see-only block renders as plain-text pointer (per Phase 6.6's graceful-dangling-pointer behavior verified in `src/ui/people/person-card.tsx`).

### 4.3 Group entry shape (Yehudim) — REVISED per audit Sig #1 + #2

**Mechanism (audit Sig #1 correction):** the people-parser anchors on the H2 heading (`ENTRY_HEADER = /^## (.+)$/` at `people-parser.ts` line 13). The H2 alone creates the entry; no `**Verse:**` field is required (that's a *prophecy*-parser concept, not applicable here). The plan's earlier reference to a `**Verse:**` anchor was a prophecy/people parser-conflation error. The Yehudim H2 is sufficient.

**Schema (audit Sig #2 CRITICAL fix):** the originally-proposed `**Senses:**`, `**Cross-reference:**`, and `**Group entry:**` field keys are NOT in the people-parser's `EXACT_LABEL_ALIASES` table. They would be silently dropped at parse time. Even firstMention / mentionedIn / keyEvents, while parsed, are NOT rendered by PersonCard (verified by reading `src/ui/people/person-card.tsx` lines 309–360). The Yehudim accordion would expand to show **nothing** in the rendered UI.

**Fix: repurpose existing rendered fields.** The Yehudim entry uses standard PersonEntry fields whose values carry group-shaped meaning:

```markdown
## Yehudim (the Judeans / the Jews)

**Meaning:** literally "Judeans" — the group ethnically and territorially associated with Yehudah (Judah); rendered "Yehudim" in the TT rather than "Jews" to preserve the term's three-sense ambiguity per Ioudaioi Policy (RULES-GS.md)
**Origin:** APPEARS (a group, not an individual; first appears at Jn 1:19 as the delegating authority)
**First mention:** Jn 1:19
**Mentioned in:** Jn 1:19; 2:6; 2:13, 18, 20; 3:1, 25; 5:1; 6:4; 7:1, 11; 8:31, 48; 10:31; 11:55; 13:33; 18:36; 19:7, 38–42
**Profession:** religious-political authority (institutional sense); civic identity (geographic sense)
**Hometown:** Yerushalayim (Jerusalem) and Yehudah (Judah) more broadly
**Historicity status:** VERIFIED
**Books appearing in:** Matthew; Mark; Luke; John; Acts; Pauline letters; Hebrews; Revelation
**Character arc:** Three operative senses across the Gospel (per Ioudaioi Policy / Entry J-006). **(1) Geographic / ethnic:** "the Judeans" / "the people of Judea" — primary in geographic contexts (e.g., "the Yehudim had agreed" at 9:22; "for the purification of the Yehudim" at 2:6). **(2) Institutional:** "the Judean authorities" / "the Jerusalem leadership" — primary in delegation / hearing / order-issuing contexts (the 1:19 delegation from Jerusalem). **(3) Polemical / adversarial:** "those who oppose Yeshua" — primary in chapters 5–10 conflict scenes. Sense must be determined from context; conflation across senses has historically contributed to anti-Jewish interpretation.
**Archaeological evidence:** Extensive archaeological + epigraphic evidence for first-century Jewish presence under Roman rule (Temple Mount, synagogues, ossuaries, mikvaot, Qumran). The historicity of the Yehudim as a corporate referent is VERIFIED at the highest confidence.
**Extra-biblical mentions:** Josephus, *Antiquities* and *Bellum Judaicum* (extensive); Tacitus, *Histories* 5; Suetonius; Roman administrative records; rabbinic literature post-70 CE.
```

**Why these fields:**
- `meaning` → IS rendered (line 325). Carries the translation-policy framing.
- `originType: APPEARS` → IS parsed (`parseOriginType` accepts "APPEARS"). Documents the group-not-individual nature.
- `firstMention`, `mentionedIn` → parsed but not rendered (acknowledged limitation; useful for source-reader and forward-compat).
- `profession`, `hometown` → IS rendered (lines 329, 331). Carry the group-as-actor framing.
- `historicityStatus: VERIFIED` → IS rendered (line 290). Carries the textual+archaeological framing.
- `booksAppearingIn` → IS rendered (line 341).
- **`characterArc` → IS rendered (line 340) — carries the 3-sense Ioudaioi Policy breakdown as prose.** This is the critical repurposing per audit Sig #2.
- **`archaeologicalEvidence` → IS rendered (line 346) — carries the anti-misuse safeguard + the VERIFIED rationale.** Also repurposed per audit Sig #2.
- **`extraBiblicalMentions` → IS rendered (line 350) — carries the Josephus + Tacitus + rabbinic-literature attestation.**

Standard person-only fields (`father`, `mother`, `birthYear`, `deathYear`, `lifespan`, `siblings`, `spouses`, `children`, `ageAtFatherhood`, `causeOfDeath`) are **omitted** — parser populates only the matched fields; PersonCard gracefully omits absent fields (verified Phase 6.6E single-expand accordion behavior).

**No code changes required.** The group entry uses the existing parser+UI infrastructure.

## 5. Translation conventions to pin

These conventions are pre-resolved here so locale propagation is mechanical:

| Convention | Decision |
|------------|----------|
| **File header boilerplate** | Match existing `genesis/PEOPLE.md` + `matthew/PEOPLE.md` — Book / Language / Scope (John 1–3) / Ruleset v3.3 / Status: provisional |
| **Locale-translated `**See:**` field key** | EN: `See` / PT-BR: `Ver` / DE: `Siehe` / ES: `Ver` (verified against `people-parser.ts` `crossBookSee` aliases) |
| **Locale-translated `**In John:**` field key** | EN: `In John` / PT-BR: `Em João` / DE: `In Johannes` / ES: `En Juan` (verified against `inBook` aliases) |
| **bookLabels for cross-book link** | `john: "John" / "João" / "Johannes" / "Juan"` — already added to `src/app/[locale]/[book]/people/page.tsx` `bookLabels` map. Verify at execution time. |
| **Historicity rating** for first-called disciples | `PROBABLE` for Yochanan + Andreas + Kefa + Philippos (named in Acts + Pauline epistles + Josephus reference for Yochanan); `POSSIBLE` for Nathanael (only in John) and Nikodemos (only in John + later rabbinic tradition); `VERIFIED` for the Yehudim group (general Jewish presence under Roman rule is heavily attested) |
| **Confidence tokens** | Rule 13: VERIFIED / PROBABLE / POSSIBLE / UNCERTAIN — per locale parser variants already verified in `people-parser.ts` |
| **Numeric anchor convention** (audit Phase 6.6G) | All `historicalYear` values must be parseInt-safe bare integers. Disciple birth years are c. 1–10 CE (highly uncertain) — render as `**Historical year:** 5` (with `**Birth year:** c. 5 CE (POSSIBLE; placed before Yeshua's ministry, working back from typical adult-disciple age)` text). No `c.` prefix in the anchor field. |
| **Cross-book `**See:**` pointer format** | `**See:** matthew/PEOPLE.md` (for Yeshua) / `**See:** exodus/PEOPLE.md` / `**See:** kings/PEOPLE.md` / `**See:** isaiah/PEOPLE.md` (for OT figures). Per Phase 6.6 graceful-dangling-pointer convention — unknown-book slugs render as plain text per `parseCrossBookSlug` returning `null`. |
| **Yehudim sense labels** per locale | EN: "Geographic / ethnic" / "Institutional" / "Polemical / adversarial". PT-BR: "Geográfico / étnico" / "Institucional" / "Polêmico / adversário". DE: "Geographisch / ethnisch" / "Institutionell" / "Polemisch / gegnerisch". ES: "Geográfico / étnico" / "Institucional" / "Polémico / adversario". (Match Genesis precedent for tri-tradition + 3-sense labels.) |
| **Single-line constraint for PEOPLE.md fields** | Per `people-parser.ts` `FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/` — same single-line constraint as prophecy parser (audit Phase 11 R2.1). Long bio fields stay on one line; markdown line breaks silently truncate content. |
| **Em-dash convention** (audit Sig #6) | Use Unicode em-dash `—` (or `,` / `;`) for ranges, parentheticals, and compounds. **Do NOT use ` -- ` (space-hyphen-hyphen-space)** — content-lint §0.2 applies to `$CONTENT_DIRS` (which includes `content/{locale}/john`) and the rule's recursive scan covers John PEOPLE.md automatically. ` -- ` triggers a blocking lint error. Year ranges: use `735–732 BCE` (Unicode en-dash) per Phase 6.6A convention. Compounds: use ` — ` (em-dash with spaces) per Phase 2C convention. |

## 6. Execution sequence

**Pre-execution baseline check:** `pnpm test` reports 801/801 + people-parser 51/51 (re-verify at execution time).

| Step | Scope | Effort |
|------|-------|--------|
| **10.1** | EN John PEOPLE.md — header + 6 full entries + Yeshua see-only + Yehudim group + 3 OT-referenced see-only stubs (canary) | 5 h |
| **10.2** | EN canary verification: `pnpm test` + visual at `/en/john/people` confirms all 11 entries render + cross-book links work | 30 min |
| **10.3** | PT-BR mirror across 11 entries with locale field-key + content translation | 3.5 h |
| **10.4** | DE mirror | 3.5 h |
| **10.5** | ES mirror | 3.5 h |
| **10.6** | Cross-locale integrity sweep — grep each entry per locale for field-key consistency + parseInt-safety + reading-label parity | 1 h |
| **10.7** | Visual smoke test via dev server — `/{locale}/john/people` for all 4 locales; timeline chart renders disciple bars; Yeshua cross-book link works; OT-figure dangling pointers render gracefully | 30 min |
| **10.8** | Editorial-log entry **J-021** (Phase 10 closure with figure-list + scope-decision rationale) + meta-doc sync (CLAUDE.md test count if any tests added; PENDING.md "John PEOPLE.md missing" → RESOLVED; DEFERRED_TASKS Task 6 → RESOLVED; FIX_IMPLEMENTATION.md Phase 10 closure note) + **content-lint script update (audit PV.1 + PV.2 CRITICAL):** (a) uncomment and activate rule §0.6 ("John PEOPLE.md absence") in `scripts/content-lint.sh` lines 173–175 — the rule was written in anticipation of Phase 10 but disabled until the files exist; activating it enforces locale-completeness going forward. (b) Update `PEOPLE_FILES` (line 23) and `NON_EN_PEOPLE_FILES` (line 24) to add the 4 new John PEOPLE.md paths — rules §0.7 (TT heading leftover), §0.8 (heading collision per locale), and §0.10 (modern-mapping smell-test) use these explicit file-list variables and will silently skip John PEOPLE.md unless updated. (c) Re-run `pnpm content:lint` after the activation/update to verify it passes; the rule changes are additive (more checks fire, but the new content should be authored compliantly). | 1.25 h |

**Total: ~18.5 h** (matches FIX_IMPLEMENTATION.md's 17–24 h envelope).

After each step: `pnpm test`, `pnpm content:lint`, `pnpm build`. Phase 7-style post-execution audit pattern adopted: systematic gap audit before declaring DoD.

## 7. Editorial-log entries

One entry:

- **`docs/editorial-log/john.md` Entry J-021** — Phase 10 closure. Cite: Rule 28 (review workflow — see-only patterns for cross-book figures), Rule 29 (Companion Governance), Phase 6.6 PersonEntry schema, Phase 6.6 cross-book see-only pattern, Entry J-006 (Ioudaioi Policy — for Yehudim group entry). Cross-references: M-014 (Yochanan in matthew/PEOPLE.md — the Phase 6.6G entry), `matthew/PEOPLE.md` Yeshua entry, `docs/rules/RULES-GS.md` Ioudaioi Policy. Document the 4 scope-category decisions explicitly so future cross-book canonical PEOPLE refactor (Phase 13) can trace the rationale.

## 8. Definition of Done

- **4 files created** at `content/{en,pt-br,de,es}/john/PEOPLE.md`, each with 11 entries (6 full + 1 see-only-to-matthew + 1 group + 3 see-only-to-future-books)
- **Parser tests pass** (51 → 51, no new tests required; schema unchanged)
- **All 11 entries per locale** have their required fields populated per §4
- **All `**See:**` pointers use the established format** (`book/PEOPLE.md`); dangling pointers (Mosheh→exodus, Eliyahu→kings, Yeshayahu→isaiah) render gracefully (plain-text pointer per `parseCrossBookSlug` null-fallback)
- **All `**Historical year:**` values are parseInt-safe bare integers** where set (Phase 6.6G convention); uncertain dates use confidence-labeled prose in `**Birth year:**` text field, not in the anchor
- **Yehudim group entry** present in all 4 locales; references J-006 Ioudaioi Policy
- **Cross-locale consistency** — every entry uses the same field-key labels per locale, same historicity rating, same cross-reference target
- **`pnpm test`** reports 801/801 (same baseline; no new parser tests required since PEOPLE.md schema is unchanged from Genesis/Matthew)
- **`pnpm content:lint`** exit 0
- **`pnpm lint`** Biome clean
- **`pnpm build`** clean across all 4 locales × 3 books (now also gens 12 routes for `/john/people`)
- **Visual smoke test:** `/{locale}/john/people` renders for all 4 locales; SVG timeline shows disciple bars where dates are committed; expandable cards open correctly; cross-book links to `matthew/PEOPLE.md` work; OT-figure see-only stubs render with plain-text "See: exodus/PEOPLE.md" (no broken link).
- **Editorial-log Entry J-021** logged with full scope-decision rationale
- **Meta-doc sync:** `CLAUDE.md` content scope updated ("John 1–3 + INTRODUCTION + **PEOPLE** in all four locales"); `PENDING.md` John PEOPLE.md item → RESOLVED 2026-05-14 (or actual close date); `DEFERRED_TASKS.md` Task 6 → RESOLVED; `FIX_IMPLEMENTATION.md` Phase 10 closure note added.
- **Phase 13 forward-tracking:** the see-only patterns to future-books (Mosheh/Eliyahu/Yeshayahu) explicitly flagged as Phase 13 work — when Exodus/Kings/Isaiah are authored, the pointers will resolve to canonical entries.
- **Content-lint §0.6 activated (audit PV.1):** rule uncommented in `scripts/content-lint.sh` lines 173–175; `pnpm content:lint` enforces John PEOPLE.md presence going forward — if a locale's John PEOPLE.md goes missing post-Phase-10, the lint will fail.
- **Content-lint `$PEOPLE_FILES` + `$NON_EN_PEOPLE_FILES` updated (audit PV.2):** both variables in `scripts/content-lint.sh` lines 23–24 include the 4 new John PEOPLE.md paths; rules §0.7 (TT heading leftover), §0.8 (heading collision per locale), §0.10 (modern-mapping smell-test) now exercise John PEOPLE.md content.

## 9. Risks + mitigations

| # | Risk | Severity | Mitigation |
|---|------|----------|-----------|
| 1 | Yeshua entry duplicates matthew/PEOPLE.md content | MEDIUM | The see-only pattern is exactly what prevents this. `**See:** matthew/PEOPLE.md` + `**In John:** ...` (narrative summary 3–5 sentences). All bio fields live in matthew/PEOPLE.md; John's entry is a 5-line stub. Mirror Phase 6.6's Matthew→Genesis pattern (Avraham, Yitschaq, etc.). |
| 2 | Yehudim group entry breaks parser (no `Verse` field) | LOW | `people-parser.ts` H2 → entry boundary; missing field = silently unparsed. UI gracefully omits absent fields. Authoring `**First mention:**` provides the anchor. Verified by reading the parser before drafting this plan. |
| 3 | Dangling cross-book pointers (Mosheh→exodus, etc.) cause broken UI | LOW | Verified at `src/ui/people/person-card.tsx`: `parseCrossBookSlug` returns the slug string for valid-shape pointers (e.g., "exodus" for `exodus/PEOPLE.md`); the fallback to plain text is triggered by `!slug || !bookLabels[slug]`. For Mosheh/Eliyahu/Yeshayahu, the slug IS extracted but `bookLabels["exodus"]` is undefined (only `genesis`, `matthew`, `john` are populated in `src/app/[locale]/[book]/people/page.tsx`), so the `<Field>` plain-text fallback renders. Reader sees "See: exodus/PEOPLE.md" as plain prose. No 404s. (Audit Sig #5 mechanism correction.) |
| 4 | Historicity rating for disciples becomes contested | MEDIUM | Use PROBABLE for the four named-in-Acts disciples (Yochanan, Andreas, Kefa, Philippos) with note "named in Acts + Pauline letters + Josephus (for Yochanan) — independent attestation supports historicity"; POSSIBLE for Nathanael + Nikodemos with note "only attested in John". Editor flexibility for adjustment. |
| 5 | Disciple birth years lack textual anchor → historicalYear becomes speculative | MEDIUM | Use range `c. 1–10 CE` in `**Birth year:**` text (POSSIBLE confidence label); `**Historical year:** 5` (bare integer, midpoint commitment per Phase 6.6G numeric-anchor convention). NOT speculation — placing adult disciples before Yeshua's ministry (c. 27 CE) per Luke 3:23 working backwards. |
| 6 | Cross-locale field-key drift (e.g., PT-BR uses "Ver" instead of expected alias) | LOW–MEDIUM | §5 conventions table pre-resolves locale-translated field keys; verified against `people-parser.ts` alias tables. Phase 7-style post-execution audit catches drift before declaring DoD. |
| 7 | Yehudim entry's anti-misuse safeguard becomes a Rule 28 reviewer concern | MEDIUM | Cross-reference J-006 (the parent Ioudaioi Policy entry) at the top of the Yehudim entry's `**Note:**` field. The safeguard text mirrors the existing J-006 wording. Reviewer can object to specific wording without re-litigating the policy itself. |
| 8 | Phase 7-style grep-coverage misses in locale audit | LOW–MEDIUM | Adopt the Phase 7 post-execution audit pattern. Each field-key per locale grep'd; each cross-book pointer verified; each historicity rating compared across locales. |
| 9 | Single-line `FIELD_LINE` regex constraint violated by long bio text | MEDIUM | §5 conventions explicitly forbid multi-line field values. Long bios stay on one line. Manual quick-check: every entry's longest field (e.g., `**Key events:**`) verified single-line before locale propagation. |

## 10. Out of scope (deliberately deferred)

- **Cross-book canonical PEOPLE refactor (Phase 13)** — when figures appear in multiple books (Yeshua already does; Yochanan will when Acts is authored), the per-book PEOPLE.md model becomes redundant. Phase 13 will refactor to a `content/<locale>/people/` canonical layer; per-book PEOPLE.md becomes a manifest. **Not Phase 10's concern.**
- **OT-referenced figures' canonical entries** (Mosheh → exodus/PEOPLE.md; Eliyahu → kings/PEOPLE.md; Yeshayahu → isaiah/PEOPLE.md) — these need their canonical books authored first (Phase 12+). Phase 10 leaves graceful see-only stubs that resolve once those books exist.
- **Place-name entries** (Beyt-Anyah, Bethsaida, Kinneret, etc.) — out of PEOPLE.md scope; covered in chapter companions.
- **New parser tests** — schema is unchanged from Genesis/Matthew PEOPLE.md; the 51 existing people-parser tests cover all schema variations. No new tests required unless new fields are introduced (none planned).
- **Phase 7 readability sweep on the new file** — per the Phase 7 forward-tracking item D resolution, John PEOPLE.md should be authored *applying the Phase 7 §4 gloss conventions at authoring time*, not retrospectively. Authors must gloss technical terms (Pharisees → Perushim, *anōthen*, *paraklētos*, *parthenos*, etc.) on first use per file per the Phase 7 §4 inventory.

## 11. Status

**Drafted:** 2026-05-14 by claude-opus-4-7
**Revised:** 2026-05-14 post-audit — 5 significant + 2 PV-must-fix + 1 minor wording + 1 explicit-statement clarification absorbed
**Pre-execution test baseline:** `pnpm test` reports 801/801 + people-parser 51/51 (verified at draft time; re-verify at execution time per established discipline)
**Auditor verdict:** "The plan is strategically sound — no execution blockers, all code infrastructure verified in place. But two significant specification gaps would produce silent authoring failures if not addressed before execution." All gaps now addressed.
**Awaiting:** project-lead approval of §3 scope-categories table + §4 schema decisions + §5 conventions before execution
**Trigger to start:** any green-light from project lead — execution can begin immediately at step 10.1 (EN canary)

---

**Plan author:** claude-opus-4-7, 2026-05-14 (revised post-audit same day)
**Audit:** `docs/audit/archive/AUDIT_PHASE_10_PLAN.md` — verdict "no execution blockers, all infrastructure verified in place." 5 significant findings: §4.3 parser-anchor mechanism (Verse-vs-H2), Yehudim entry field-key silent drops (CRITICAL), Note: not parsed/rendered, Yochanan duplication with Phase 6.6G M-014, parseCrossBookSlug mechanism description. 2 post-verification CRITICAL findings: PV.1 content-lint §0.6 activation, PV.2 $PEOPLE_FILES variable update. All 7 absorbed; plus 1 minor (em-dash convention) and 1 explicit-statement clarification (Note: documentation pattern).
**Cross-references:** `docs/audit/archive/AUDIT_PHASE_10_PLAN.md` (independent audit absorbed pre-execution); `docs/audit/FIX_IMPLEMENTATION.md` Phase 10 (parent); `docs/audit/PENDING.md` "John PEOPLE.md missing" (open); `docs/feedback/DEFERRED_TASKS.md` Task 6 (the open task this closes); `docs/editorial-log/john.md` Entry J-006 (Ioudaioi Policy — parent for Yehudim group entry); `docs/editorial-log/matthew.md` Entry M-014 (Phase 6.6G Matthew NT figures — **canonical Yochanan + Yeshua entries that John PEOPLE.md references via see-only pattern per audit Sig #4**); `content/{locale}/matthew/PEOPLE.md` (schema reference + cross-book see-only pattern source + canonical Yochanan + Yeshua entries); `content/{locale}/genesis/PEOPLE.md` (schema reference); `src/infrastructure/content/people-parser.ts` lines 13 (`ENTRY_HEADER`), 87–295 (`EXACT_LABEL_ALIASES`), 723–741 (H2 entry-boundary mechanism); `src/ui/people/person-card.tsx` lines 12–46 (`parseCrossBookSlug` + `CrossBookSeeField` fallback), 309–360 (rendered-field list — basis for §4.3 Yehudim repurposing); `src/app/[locale]/[book]/people/page.tsx` `bookLabels` map (cross-book link rendering); `scripts/content-lint.sh` lines 23–24 (`PEOPLE_FILES` + `NON_EN_PEOPLE_FILES` to update per PV.2), lines 173–175 (§0.6 to activate per PV.1); `docs/audit/archive/PHASE_7_PLAN.md` (post-execution audit pattern adopted); `docs/audit/archive/PHASE_11_PLAN.md` + `PHASE_11_5_PLAN.md` (two-audit-round discipline adopted).
