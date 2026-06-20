# Execution Plan — Restore `κύριος (kyrios)` in GS Divine-Name-Policy metadata

**Status:** ✅ **EXECUTED 2026-06-20** (commits `df0004f` audited-16 + `d73748f` de/matthew 2-3 extension) — AUDITED ✅ APPROVE (`AUDIT_KYRIOS_DIVINE_NAME_FIX_PLAN.md`; 3 findings folded in) · **Branch:** `tier4-name-dedup` · **Date:** 2026-06-20

> **Execution outcome (read before trusting §4's counts):**
> - **16 audited files fixed** `kyrios (kyrios)` → `κύριος (kyrios)` (commit `df0004f`); all gates green.
> - **Plan count correction:** §4's "all 28 GS chapters" was arithmetic error. Reality: **27** GS CHAPTER files carry the divine-name line; pre-fix canonical was **9** (en/john, de/john, pt-br/john — NOT 12; es/john was mangled), so 9 + 16 = 25 after the audited fix.
> - **Discovered defect (not in the audited plan):** the post-step audit found **`de/matthew/CHAPTER-2` + `CHAPTER-3` used a third form — bare `kyrios`** (no Greek, no parenthetical), which the `kyrios (kyrios)` scan never matched. Fixed to canonical `κύριος (kyrios)` in a separate transparent commit `d73748f` (matches de/john template; same not-rendered metadata line). **Result: all 27 GS divine-name lines now uniform.**
> - **Methodology-stamp drift (L9, audit Finding 2)** remains out of scope — logged in PENDING for a separate sweep.
> - An execution caveat worth recording: the first attempt used `perl -CSD` whose `-e` literal `κύριος` was treated as raw bytes → double-encoded **mojibake**; **G4/G9 caught it**, the change was reverted, and a Python replace (clean UTF-8) was used instead. The gate did its job.

> **Audit disposition (all 3 findings verified true & accepted):**
> 1. **Asterisk context-split** — metadata target is plain `κύριος (kyrios)` (no italic `*`); the `(*kyrios*)` form is glossary-only. Verified (canonical L11 plain; glossary L761 italic; zero metadata lines carry `*`). → §2.1 warning + G4 assertion added.
> 2. **"Unify all 28" overclaim + systematic stamp drift** — narrowed to "uniform on the Divine-Name-Policy line"; the L9 methodology stamp (`v3.4` only in en/mark, `v3.3` everywhere else) verified and logged separately. → §4/§10 + PENDING.
> 3. **es establishes the form / separate-commit** — confirmed; G9 byte-exact reuse covers es; this commits separately from the 118 dedup. → §7.
**Class:** content metadata correction (term + restore-script) · **Risk:** Low
**Relationship:** follow-up to Tier-4 Strand 3 (`PLAN_TIER4_NAME_DEDUP.md`); the 16 lowercase `kyrios (kyrios)` instances were deliberately *excluded* from the 118 `Name (Name)` removals and deferred here for a source-grounded decision.

---

## 1. Problem statement

The GS (Greek Scriptures) chapter files carry a metadata line (line 11):

> `**Divine Name Policy (Rule 25 / GS Policy):** Option C — <X> rendered as "the Lord" when quoting OT YHWH passages; noted in Tier 2.`

`<X>` exists in the corpus in two forms:

| Form | `<X>` | Count | Where |
|------|-------|-------|-------|
| ✅ Canonical | `κύριος (kyrios)` — Greek script + transliteration | 12 | en/john 1-3, de/john 1-3, pt-br/john 1-3 |
| ❌ Mangled | `kyrios (kyrios)` — Greek script replaced by translit (redundant doubling) | 16 | see §4 |

The mangled form is a **degraded variant** of the canonical: the Greek lexeme `κύριος` was overwritten with its own transliteration, producing the `Name (Name)` redundancy that RULES-HB v3.3.1 forbids — *but* the correct repair is **not** to collapse to `kyrios` (that destroys the Greek script and makes 16 chapters diverge from the 12 correct ones). The correct repair is to **restore `κύριος (kyrios)`**, unifying all 28 GS chapters.

---

## 2. Audit findings (analysis verified against source, not assumed)

1. **Rules are authoritative & confirm the canonical form.** `docs/rules/RULES-GS.md` renders the lexeme as `κύριος (*kyrios*)` throughout — glossary row (L27), policy heading (L52), policy body (L54). The TT convention is **Source-script (Transliteration)**: Greek `κύριος` + translit `kyrios`. `κύριος (kyrios)` is therefore the rule-correct target; `kyrios (kyrios)` is unambiguously a defect.
   - ⚠️ **Context split (audit Finding 1, verified):** the rules doc and the in-chapter *glossary row* use the **italic** form `κύριος (*kyrios*)` (asterisks). The **metadata line** uses the **plain, no-asterisk** form `κύριος (kyrios)` — confirmed in all 12 canonical chapters' L11 (e.g. `en/john/CHAPTER-1.md:11`); zero metadata lines anywhere carry asterisks. **The repair target is the plain `κύριος (kyrios)` — do NOT copy the glossary's italic form into the metadata line** (that would create a new divergence from the 12 canonical chapters — the exact defect this fix removes).
2. **All 16 mangled instances are the metadata line — nothing else.** Grep across all of `content/` finds zero `kyrios (kyrios)` outside `CHAPTER-N.md`. No prose, note, glossary, or companion occurrence exists, so there is no second meaning to preserve.
3. **All 16 are byte-identical** (`kyrios (kyrios)`), one per file → a single substring replace is complete and uniform; locale prefixes (`Option C` / `Opción C` / `Opção C`) and the rest of each sentence are untouched.
4. **`divineNamePolicy` is not rendered.** No consumer in `src/ui`, `src/app`, SEO, or JSON-LD. It is parsed into `ChapterData.divineNamePolicy` and stored, never displayed → **zero visual change**.
5. **The parser keys on the label, not the value.** `markdown-parser.ts:136` `pick("divine name", "nome divino", "política…", "gottesname", …)` matches the *label* substring; the value string is captured verbatim. Changing the value `kyrios (kyrios)` → `κύριος (kyrios)` cannot affect parsing/keying.
6. **Conservation does not track chapter metadata.** `conservation.test.ts` `case "chapter"` emits only `chapter-overview / reading-guide / paragraph / verse / note / glossary / supplementary`. The metadata line is not a tracked unit → the 11,831-unit total is unaffected.
7. **Target is byte-exact NFC.** The canonical `κύριος` in `en/john/CHAPTER-1.md` is `U+03BA U+03CD U+03C1 U+03B9 U+03BF U+03C2`, NFC-normalized. The replacement will reuse this exact sequence, so repaired files become byte-identical to the 12 already-correct chapters.

**Conclusion:** restoring `κύριος (kyrios)` is rule-correct, render-neutral, parse-neutral, conservation-neutral, and makes the GS corpus uniform. Risk is confined to typing the wrong Unicode (mitigated by byte-exact reuse) or touching an unintended line (mitigated by the §6 diff-integrity gate).

---

## 3. Scope

- **In scope:** the single Divine-Name-Policy metadata line in the 16 mangled GS chapter files (§4). Substring `kyrios (kyrios)` → `κύριος (kyrios)` (**plain, no asterisks** — per §2.1).
- **Out of scope:** the 12 already-canonical chapters (no change); HB books (use `Option A — Consonantal (YHWH)`, no doubling); any rendered text; any code; the 118 `Name (Name)` removals (already committed).

---

## 4. File inventory (16 files, 1 occurrence each)

| Locale | Files | Prefix in those files |
|--------|-------|------------------------|
| en | mark/CHAPTER-{1,2,3}, matthew/CHAPTER-{1,2,3} | `Option C` |
| de | matthew/CHAPTER-1 | `Option C` |
| es | john/CHAPTER-{1,2,3}, matthew/CHAPTER-{1,2,3} | `Opción C` |
| pt-br | matthew/CHAPTER-{1,2,3} | `Opção C` |

Post-fix per-locale state (mangled → canonical): en 0/9 · de 0/4 · es 0/6 · pt-br 0/6 → **all 28 GS chapters uniform _on the Divine-Name-Policy line_** (audit Finding 2 — scoped: this fix unifies L11 only; the L9 Methodology stamp still diverges and is out of scope, see §10). (Note: es had **no** prior canonical reference; this establishes it — correct, since `κύριος` is the Greek lexeme and locale-independent. The G9 byte-exact check matters most for the es files, having no es exemplar to diff against — covered by byte-exact reuse.)

---

## 5. Execution steps

1. **Confirm branch & clean tree** — on `tier4-name-dedup`, `git status` clean apart from intended work.
2. **Apply the replacement** to exactly the 16 files, substring-scoped:
   ```
   for f in <16 files>:  perl -i -pe 's/\bkyrios \(kyrios\)/κύριος (kyrios)/g' "$f"
   ```
   (Single occurrence per file; `\b` + the literal ` (kyrios)` tail makes the match unambiguous. Perl handles UTF-8 with `-CSD`.)
3. **Restore `next-env.d.ts`** if touched (`git checkout next-env.d.ts`).
4. Run the validation gate (§6).
5. Commit (§7) — do **not** merge.

---

## 6. Validation gate (all must pass before commit)

| # | Check | Pass criterion |
|---|-------|----------------|
| G1 | `grep -rn 'kyrios (kyrios)' content/` | **0** matches |
| G2 | `grep -rln 'κύριος (kyrios)' content/**/CHAPTER-*.md \| wc -l` | **28** GS chapters (12 prior + 16 fixed) |
| G3 | Diff integrity: `git diff --stat` | 16 files, **16 insertions / 16 deletions**, only line 11 changed in each |
| G4 | Diff content: `git diff` | every hunk changes **only** `kyrios `→`κύριος ` on the Divine-Name line; prefix + tail intact; **no `*` appears in the repaired segment** (audit Finding 1 — assert plain `κύριος (kyrios)`, not italic) |
| G5 | `pnpm test` | all green incl. **conservation prints "213 files → 11831 units"** (unchanged) |
| G6 | `pnpm lint` | clean |
| G7 | `pnpm content:lint` | clean; warning count **unchanged** (no new §0.x warning; the doubling was not lint-tracked) |
| G8 | `pnpm build` | succeeds |
| G9 | Byte-exactness: repaired `κύριος` codepoints == `U+03BA U+03CD U+03C1 U+03B9 U+03BF U+03C2` | identical to canonical chapters |

---

## 7. Commit

```
fix(content): restore κύριος (kyrios) in GS Divine-Name-Policy metadata (16 chapters)

The Divine-Name-Policy line in 16 GS chapters carried the degraded
'kyrios (kyrios)' — the Greek lexeme κύριος overwritten by its own
transliteration (a Name(Name) redundancy). Restore the canonical
RULES-GS Source-script(Transliteration) form 'κύριος (kyrios)',
matching the 12 already-correct chapters. Metadata is not rendered;
conservation untouched (11,831).

en mark 1-3 + matthew 1-3; de matthew 1; es john 1-3 + matthew 1-3;
pt-br matthew 1-3.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

This is a **separate, atomic commit** from the 118 `Name (Name)` dedup commits already on the branch (audit branch-note) — independently revertible. No merge without explicit authorization. After sign-off, the `tier4-name-dedup` branch (118 name-dedup fixes + this fix, as distinct commits) is PR'd together, then housekept (FF local main, delete branch) per the established pattern.

---

## 8. Rollback

Single-line metadata changes on a feature branch. Revert with `git revert <sha>` or `git checkout content/` pre-commit. No schema, no migration, no rendered output, no cross-file dependency → rollback is trivial and total.

---

## 9. Compliance matrix

| Concern | Disposition |
|---------|-------------|
| RULES-GS Source-script(Translit) | ✅ restores it (κύριος + kyrios) |
| RULES-HB v3.3.1 (no `Name (Name)`) | ✅ doubling removed (by restoring script, not collapsing) |
| Rule 25 (divine name) | ✅ Option C policy text unchanged in meaning |
| Rule 28 (provisional) | ✅ no claim-confidence content touched |
| Architecture (DDD) | ✅ content-only; no domain/infra/ui/app change |
| Conservation gate | ✅ metadata untracked → 11,831 unchanged |
| Design system | ✅ no rendered output → no UI/visual impact |
| Regression surface | ✅ parser keys on label not value; not rendered; not in SEO |

---

## 10. Out of scope — logged for a separate sweep (audit Finding 2, verified)

While auditing, a **systematic methodology-stamp drift** was confirmed (independent of the divine-name line): the L9 Methodology stamp reads `30-Rule … (Ruleset v3.4)` in **only** `en/mark/CHAPTER-{1,2,3}.md`; **every other GS chapter — all of en/john, en/matthew, and all of de/es/pt-br john+matthew — still reads `v3.3` (29-Rule)** and was never re-stamped when v3.4/Rule 30 shipped. This is the same staleness class as the prior "Ruleset v3.3" landing-string drift, but corpus-wide. It is **deliberately out of scope** for this divine-name fix (different line, different concern) and is logged in `PENDING.md` for a single coordinated re-stamp sweep rather than piecemeal edits. This plan's "uniform" claim is therefore scoped to the **Divine-Name-Policy line only**.
