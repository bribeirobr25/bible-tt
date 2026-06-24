# Plan — Acts 1–3 (new book, full treatment, 4 locales)

**Status:** **APPROVED — project-lead approved 2026-06-23** (all 4 open decisions confirmed per recommendations); executing on branch `acts-expansion` · **Date:** 2026-06-23 · **Class:** content authoring (new book, from source) + new-book activation · **Risk:** Medium-High (*authoring from Greek*, not propagation; Rule-28 provisional; Acts has the NT's heaviest Alexandrian/Western textual divergence — see §6)

> Follows `docs/guides/AUTHORING-PLAYBOOK.md` Track B and reuses the Luke-expansion template (`PLAN_LUKE_EXPANSION.md`, audited APPROVE 2026-06-22). Acts is **GS narrative** — the gospel/Luke template applies directly, *no genre adaptation* (unlike the epistles that come next; see §8).

> **Self-audit disposition (verified against the codebase, focus: wiring + Acts-specific realities):**
> 1. **Acts is Luke volume 2 — lead with that.** Same author, same dedicatee (Theophilus, 1:1 "the first account"), continuous narrative (Luke 24 ascension ↔ Acts 1 ascension). The INTRODUCTION §B (Authorship) and §F (Reading in the TT) must foreground Luke–Acts unity; the CARD "What" should say so.
> 2. **`acts` is already forward-tracked in the §0.12 `%allowed` hash** (`content-lint.sh:239`) — so touchpoint 7 only needs the §0.12 **scan glob** (`content/*/acts/PEOPLE.md`) + the RULES-CORE doc allow-list confirmed. (Verified.)
> 3. **`inBook` aliases live in `people-fields.ts`** (post-Tier-3 split), not `people-parser.ts` — touchpoint 4 targets `people-fields.ts`. (Verified.)
> 4. **`sectionKick` is a count string** = "Five books, four languages" → **"Six books"** in all 4 locales (`Sechs Bücher` / `Seis livros` / `Seis libros`). The easy miss. (Verified.)
> 5. **Corpus default needs no edit** — Acts → Greek Scriptures via the `HEBREW_BIBLE = {genesis}` fall-through in `books/page.tsx` + `[book]/page.tsx`. Gate-verify it renders "Greek Scriptures."
> 6. **No genealogy** (unlike Luke 3) → PEOPLE is profile-only, no table. PEOPLE is *lighter* than Luke's but heavy on **cross-book see-stubs** to the gospels (Peter, John, Mary, the Twelve, Judas, Jesus) — exercises the see-link fix again.
> 7. **§0.3b/§0.3c** (the new ES diacritic + anti-calque guards) scan `content/es`/`content/de` recursively → es/acts and de/acts are **auto-covered**, no registration needed. (Verified.)

---

## 1. What this is

Add **Acts of the Apostles 1–3** as a new book in **all 4 locales**, full treatment (chapters + INTRODUCTION/CARD + PEOPLE + book CONTEXT + per-chapter CONTEXT companions + PROPHECY) — the Luke depth.

**Authored from the Greek source first** (NA28). EN does not exist → Phase 1 is the crux (EN from source, every decision logged), shipping **Rule-28 provisional** pending a Hellenist. Propagation to PT/DE/ES (Phases 2–4) is the proven mirror.

**Source language / rules:** Koine Greek → **RULES-GS** (κύριος Option C divine name; Greek article system; canonical `κύριος (kyrios)` metadata line; Option-B traditions Reina-Valera/Almeida/Luther; markers `@@`/`{t:}`/`{a:}`/`*added*`). Proper-name policy per RULES-GS/HB tables (familiar + transliterated-once).

## 2. Acts-specific realities (sized before planning)

- **Volume:** Acts 1 = 26 v, Acts 2 = 47 v, Acts 3 = 26 v → **~99 verses** (≈ Mark's 108; smaller than Luke's 170).
- **Luke–Acts unity** (above) — the defining framing.
- **OT-citation density → PROPHECY warranted for all 3 chapters** (arguably denser than Luke 1–3):
  - 1:20 — Ps 69:25 + Ps 109:8 (Judas's office).
  - 2:17–21 — Joel 2:28–32 / LXX 3:1–5 ("everyone who calls on the name of *the Lord* [κύριος = YHWH]").
  - 2:25–28 — Ps 16:8–11 (Hades/Sheol; "you will not abandon my soul").
  - **2:34–35 — Ps 110:1 — the double-κύριος crux** ("*The Lord* said to my *lord*"): κύριος = YHWH (speaker) vs κύριος = Messiah (addressee). Option C + **Rule 13** + Tier-2 note; the headline GS divine-name case of the book.
  - 3:13 — Exod 3:6 ("the God of Avraham, Yitschaq, Ya'aqov"). 3:22–23 — Deut 18:15–19 (the prophet like Mosheh). 3:25 — Gen 22:18 / 12:3 (Abrahamic-seed blessing).
- **Closes a loop already in our corpus:** John the Immerser's "he will immerse you in *the* holy {a:wind/spirit} and fire" (Mt 3:11 / Mk 1:8 / Lk 3:16 / Jn 1:33 — **all already authored**) is fulfilled at Acts 1:5 + Pentecost (ch. 2). Cross-references back to the existing gospel chapter-3s.
- **Rule 30 divine speech:** the **risen Yeshua** speaks directly (1:4–5, 1:7–8) → marked `@@…@@` (consistent with the gospel treatment of Jesus's sayings, e.g. Lk 2:49). The **ascension angels** (1:11 "men of Galil…") are *angelos*-class → **excluded** (the Gabriel/malakh precedent, logged). **Decision to log:** embedded first-person divine speech *inside* OT citations (Joel's "I will pour out my Spirit," 2:17–18) — mark or not? (Recommend mark, matching how the gospels handle quoted divine speech; confirm at authoring.)
- **Term/transliteration decisions (log in `acts.md` first):**
  - **Pentecost** (2:1, πεντηκοστή) — the Feast of Weeks / Shavuot. Translate "Pentecost"/"the fiftieth *day*" vs gloss Shavuot? (Festival-name decision.)
  - **Hakeldama / Akeldama** (1:19) — Aramaic "Field of Blood," **glossed by the text itself**; handle the Aramaic transliteration + the author's built-in gloss (Rule 4 + source gloss — a clean worked case).
  - **γλώσσαις** (2:4) "tongues/languages" vs **διάλεκτος** (2:6,8) "language/dialect" — possible `{a:tongues/languages}`; relation to {a:wind/spirit}. Flag.
  - Locked GS terms recur: μετάνοια (change of mind, 2:38/3:19), ἄφεσις (forgiveness/release, 2:38), κοινωνία (fellowship/sharing, 2:42), Χριστός/Messiah, the "name" (ὄνομα) motif (2:21,38; 3:6,16).
- **Cross-book PEOPLE** (no genealogy table): see-only stubs → gospels for Yeshua, Shimon Kefa (Peter), Yochanan (John), Ya'aqov (James son of Zavdai), the Twelve, Miryam (Mary), Yehudah (Judas Iscariot), Yochanan the Immerser. **Acts-canonical full entries:** Mattityahu/Matthias (1:23–26), Yosef Barsabbas (Justus), Theophilus (1:1), Jesus's brothers as a group (1:14 — links the PENDING "brothers of Jesus" question + the future James epistle), the unnamed lame man (3:2).

## 3. New-book activation — the 8 touchpoints (Phase 0)

1. `src/domain/books/registry.ts` — add `"acts"` to `AVAILABLE_BOOKS`.
2. `src/app/[locale]/books/page.tsx` — `BOOK_ORDER` → `["genesis","matthew","mark","luke","john","acts"]` (history after the gospels).
3. `src/app/[locale]/[book]/people/page.tsx` — `bookLabels`: add `acts: t("book.acts")`.
4. `src/infrastructure/content/people-fields.ts` — `inBook` aliases: `"in acts","em atos","in apostelgeschichte","en hechos"`.
5. `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json` — `book.acts` (Acts / Atos / Apostelgeschichte / Hechos) + `people.inBook.acts`; `books.heroTagline` (+ "Acts 1–3"); `books.sectionKick` **"Five books" → "Six books"** — all 4 locales.
6. `scripts/content-lint.sh` — register acts in `CONTENT_DIRS`/`STUDY_DIRS`/`PEOPLE_FILES`/`NON_EN_PEOPLE_FILES`/`CONTEXT_FILES` (+ `ES_NT_DIRS`/`ES_NT_CHAPTER_FILES` since GS); add `docs/editorial-log/acts.md` to `EDITORIAL_LOGS`; add `content/de/acts/CHAPTER-*.md` to the §0.11 DE-redundant-parens glob. (§0.3b/§0.3c already recurse `content/es`/`content/de` — auto-covered.)
7. **Cross-book see-target allow-list** — (a) `docs/rules/RULES-CORE.md` doc allow-list (confirm `acts`); (b) §0.12 `%allowed` hash — **already has `acts => 1`** (no edit); (c) §0.12 **scan glob** — add `content/*/acts/PEOPLE.md`.
8. New files: `docs/editorial-log/acts.md` (opened before drafting) + `docs/source-analysis/greek/acts-1-3.md` (NA28 working notes; **note the Western-text issue** up front; Rule-28).

**Backstop:** `activation-consistency.test.ts` checks 1↔2↔5↔6 agree — run `pnpm test` after Phase 0. Content-lint paths added as each locale lands (avoid grep-on-missing-file).

## 4. Phases

**Phase 0 — Activation + scaffold.** The 8 touchpoints; open `editorial-log/acts.md` + the source-analysis stub. Gate green (land registry with the EN content, or stage paths as files land).

**Phase 1 — EN authoring (the crux).** From NA28 + `docs/source-analysis/METHOD.md`. Sub-stages, each gated:
1. **Chapters 1→2→3**: transparent main text; Tier-2 verse notes (dual-labelled, Rule 13 on the cruxes — esp. 2:34 Ps 110, 2:38 εἰς ἄφεσιν); glossary; reading guide (+ marker legend); chapter overview; markers (`@@`/`{t:}`/`{a:}`/`*added*`); κύριος Option C + canonical metadata line. **Do NOT harmonize** Judas's death (1:18–19) with Matthew 27 (Prime Directive / Rule 3) — note the divergence, don't smooth it. Log every non-trivial decision in `acts.md` first.
2. **Companions** (study/CHAPTER-1/2/3-CONTEXT): §I "World at the Time" (Jerusalem ~30 CE, Second-Temple Judaism, Shavuot pilgrimage, the Acts 2:9–11 diaspora-nations list, Roman prefecture) + enrichment (dual-labelled, Rule 29).
3. **INTRODUCTION** — **the `<!-- CARD -->` block first** (5 fields; "What" foregrounds Luke–Acts vol. 2) + §A–F as warranted (esp. §B authorship/Luke-Acts, §E manuscript transmission **noting the Western text**) + mandatory §G Sources + disclaimer. New GS terms via the glossary-expansion procedure.
4. **PEOPLE** — full entries for Acts-canonical figures; see-only stubs (→ matthew/luke/john/genesis) for cross-book figures. **No genealogy table.**
5. **CONTEXT** (book-level cross-chapter motifs: the Spirit, the "name," the kerygma/sermon pattern, Jew–and–the–nations, resurrection witness).
6. **PROPHECY** — all three chapters (citation-vs-allusion restraint; the Joel/Ps 16/Ps 110/Deut 18/Gen 22 citations).
**→ CHECKPOINT: project-lead review of the EN book before propagation** (the riskiest gate — everything downstream mirrors it; the 2:34 double-κύριος rendering is the specific item to eyeball).

**Phases 2 / 3 / 4 — Propagate PT-BR / DE / ES** (mirror-EN: Almeida/Luther/Reina-Valera familiar names; transliterations mirror EN; **DE→JHWH**, **ES/PT→YHWH** in body cross-refs incl. the OT citations; marker parity; headers + dual-labels from the EN + same-locale Luke/Matthew exemplar). **Apply the playbook traps explicitly:** ES = `ustedes` register + diacritics (T-09/T-10); anti-calque reverse-check (T-12); no redundant `Name (Name)` (T-08). Each locale gated + visually checked, one at a time.

**Phase 5 — Docs.** EXECUTION_HISTORY entry; PENDING (Acts done; Rule-28 review remains; record the next-book trajectory — §8); CLAUDE.md + README scope (**six books**); editorial-log/acts.md finalized; **append any new lesson to the playbook Known-Traps register**.

## 5. Validation gate (per phase)

- `pnpm test` incl. conservation (additive; new units; completeness + label guards) + `activation-consistency` (8/8).
- Marker parity (`@@`/`{t:}`/`{a:}` = EN per file; scripted grep-diff) on propagation.
- Divine name: κύριος Option C; canonical metadata line; **DE→JHWH / ES·PT→YHWH** in body + the OT-citation YHWH passages; the 2:34 double-referent handled per Rule 13.
- Cross-book see-stubs resolve to live `/people` routes (gospels exist → render as links).
- `pnpm lint` · `content:lint` (incl. ES §0.3/§0.3b, §0.3c anti-calque, §0.4 RV-declaration, [legacy]-vosotros) · `pnpm build` (all Acts routes prerender).
- Activation: `/{locale}/acts`, `/acts/chapter/{1,2,3}` (+ notes/deeper), `/acts/people`, `/acts/introduction`, `/acts/background` all 200; Acts in books index + app-bar + sitemap.
- Wiring-to-users: `/books` shows Acts with a populated glance (CARD); book-hub at-a-glance renders; hub `<title>` includes the CARD "What"; `sectionKick` reads "Six books"; heroTagline lists Acts — all 4 locales. Corpus = "Greek Scriptures" (HEBREW_BIBLE fall-through).
- §0.12 covers Acts (scan glob includes `content/*/acts/PEOPLE.md`).
- Visual (Docker MCP): a chapter (markers; the Pentecost/diaspora list), people (cross-book links), book hub — per locale, served HTML.

## 6. Risks & rollback

- **Translation accuracy (highest):** AI-drafted EN from Greek → `provisional` → Hellenist (Rule 28); EN checkpoint = human go/no-go before 3× propagation.
- **Textual basis (Acts-specific):** Acts has the NT's **largest Alexandrian (NA28) vs Western (Codex Bezae D) divergence**. Chs 1–3 variants are modest but real — declare NA28 as base in front matter + INTRODUCTION §E, note significant variants in Tier-2 (the established GS policy). Flag in the source-analysis stub up front.
- **Divine-name crux 2:34:** the double-κύριος must not be silently flattened — Rule 13 + Tier-2, source-anchored review (T-13).
- **Cross-book stubs:** many → gospels; mitigated by the see-link fix + dangling-fallback. No genealogy → lower risk than Luke.
- **Rollback:** purely additive (new files + registrations); revert = remove acts content + the registrations. No existing content touched.

## 7. Branch / authorization

Feature branch `acts-expansion` off `main`; PR per the standing authorization gate; one book at a time; **EN checkpoint before propagation**. Authorship: AI-draft → provisional → Rule-28 (Hellenist), the established GS pattern.

## 8. Next-book trajectory (recorded per project-lead, 2026-06-23)

After Acts, move into the **Epistles** — the NT's first *letter*-genre work (per RULES-CORE the introduction gains §B "Recipient Community" + §D "Epistolary Conventions"; PEOPLE thins to senders/recipients with no genealogy/timeline; "prophecy" companions shift to OT-in-argument). Lead selected all four; recommended order by connection logic:

1. **1 Peter 1–3** — *genre pilot.* Tightest continuity from Acts 1–3 (Peter the protagonist; shared "living stone"/Ps 118 motif); simplest letter to debut the genre.
2. **Galatians 1–3** — tightest historical interlock with Acts (Gal 1–2 ↔ Acts 9 & 15; Paul's autobiography).
3. **Romans 1–3** — the theological keystone (the "all have sinned / righteousness of God" core); fullest Pauline argument.
4. **James 1–3** — Jerusalem-church + Jesus's-brother continuity (Acts 1:14); resolves part of the PENDING "brothers of Jesus" question.

Each its own audited plan (`PLAN_{BOOK}_EXPANSION.md`), same process. The **first epistle is a deliberate genre milestone** — do it carefully before scaling the Epistles, and add its lessons to the playbook (anticipate a T-16: epistle-genre pipeline notes).

## 9. Decisions — CONFIRMED by project-lead (2026-06-23, all per recommendation)

1. **EN authorship path:** ✅ **AI-draft → provisional → Rule-28 (Hellenist).** Matches all existing GS books.
2. **EN checkpoint** before propagation: ✅ **yes** — stop for lead review at end of Phase 1.
3. **Pentecost / γλώσσαις:** ✅ render **"Pentecost"** with a **Shavuot** gloss at first occurrence; **γλώσσαις = "tongues/languages"** via `{a:}` where both senses stay live (confirm per-verse at authoring; log in `acts.md`).
4. **Embedded divine speech in OT citations** (Joel 2:17–18 "I will pour out…"): ✅ **mark `@@…@@`**, matching the gospel treatment of quoted divine speech.
