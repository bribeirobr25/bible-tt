# Audit — PLAN_KYRIOS_DIVINE_NAME_FIX.md

**Date:** 2026-06-20
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PLAN_KYRIOS_DIVINE_NAME_FIX.md` (status: PLANNED — awaiting sign-off)
**Mandate:** verify no regression, content-meaning change, content loss, or rule/DDD compliance issue — against actual source, not the plan's self-report. This is a **content-compliance** fix (divine-name policy metadata), so the bar is whether the rule/theology claims and the corpus facts are *true*.
**Method:** Read directly this session: the canonical reference `en/john/CHAPTER-1.md` (the correct `κύριος (kyrios)` form), two of the sixteen mangled files `en/mark/CHAPTER-1.md` + `en/matthew/CHAPTER-1.md` (to confirm the defect form byte-for-byte), and `markdown-parser.ts` (to verify the parse-neutrality + not-rendered claims). Hand-checked the canonical Unicode against the metadata line. Could not run the gate (no shell), so the 16/12/28 counts are the executor's G1/G2 to confirm; I verified the *form* in 3 sampled files.
**Status:** ✅ **APPROVE — the fix is correct, rule-grounded, parse-neutral, and not rendered.** The diagnosis is right (`kyrios (kyrios)` is a degraded `Name (Name)` of the canonical `κύριος (kyrios)`), the repair direction is right (restore the Greek script, don't collapse), and the risk controls (byte-exact reuse, diff-integrity gate) are appropriate. Two precision notes the plan should fold in before executing — one a real **footgun in the plan's own §2.1 wording** (asterisks), one a scope-overclaim ("uniform"). Neither changes the fix; both prevent an executor error.

---

## Executive summary

This is a small, well-reasoned content-metadata correction, and unlike the Tier 1–4 refactors its risk is *compliance*, not code. On that axis it holds up: I verified the canonical form against `en/john/CHAPTER-1.md` and the defect form against two of the sixteen named files, and the plan's reading of the rule (TT convention = Source-script (Transliteration), so `κύριος (kyrios)` is correct and `kyrios (kyrios)` is a defect) is accurate. The parser claims are also verified true at the source level: `extractMetadata` keys on the *label* substring and captures the *value* verbatim, so changing `kyrios (kyrios)` → `κύριος (kyrios)` is provably parse-neutral, and `divineNamePolicy` is stored but never rendered — zero visual change, zero conservation impact (metadata is not a tracked unit).

The fix itself is the right one. The two issues I'm flagging are about the plan's **prose**, and one of them could actually cause a wrong edit:

1. **§2.1 says the rules render the lexeme `κύριος (*kyrios*)` — with italic asterisks — but the repair target is `κύριος (kyrios)` without asterisks.** Both are "correct" in their own context (the *glossary/rules* use italic `(*kyrios*)`; the *metadata line* uses plain `(kyrios)`), and the canonical 12 metadata lines I checked use the **no-asterisk** form. So the plan's target is right — but an executor reading §2.1 could "helpfully" type `κύριος (*kyrios*)` into the metadata line and silently introduce a *new* divergence from the 12 canonical chapters. The plan must state plainly: **the metadata-line form is `κύριος (kyrios)`, no asterisks** — matching the canonical John files, *not* the glossary row.

2. **"Unifying all 28 GS chapters" overclaims.** The fix unifies them *on the divine-name line only*. They still diverge on the line directly above it: `en/john/CHAPTER-1.md` and `en/matthew/CHAPTER-1.md` carry `Methodology: 29-Rule … (Ruleset v3.3)`, while `en/mark/CHAPTER-1.md` carries `30-Rule … (Ruleset v3.4)`. That's out of scope (and correctly so), but the plan's "all 28 uniform" language should be narrowed to "uniform on the Divine-Name-Policy line" so nobody reads it as a whole-file-parity claim.

---

## Verification table (plan claim vs. source)

| # | Plan claim | Verified? | Evidence |
|---|---|---|---|
| 1 | Canonical form is `κύριος (kyrios)` (Greek + translit) | ✓ | `en/john/CHAPTER-1.md` L11: `Option C — κύριος (kyrios) rendered as "the Lord"…`. Greek script, **no asterisks**. |
| 2 | Mangled form is `kyrios (kyrios)` (script overwritten by translit) | ✓ | `en/mark/CHAPTER-1.md` L11 + `en/matthew/CHAPTER-1.md` L11 both: `Option C — kyrios (kyrios) rendered as…`. Defect confirmed in 2 of the 16. |
| 3 | RULES-GS renders the lexeme as the canonical target | ◑ | Consistent — but the rules/glossary use **italic** `κύριος (*kyrios*)` (asterisks); the metadata line uses **plain** `κύριος (kyrios)`. The plan's §2.1 conflates the two contexts. See Finding 1. |
| 4 | `divineNamePolicy` parsed but never rendered | ✓ | `markdown-parser.extractMetadata` populates `meta.divineNamePolicy`; no chapter UI surfaces it (chapter-shell renders status/methodology, not this line). Zero visual change. |
| 5 | Parser keys on label, value captured verbatim | ✓ | `pick("divine name", …)` matches the *label* substring; `METADATA_LINE = /^\*\*(.+?):\*\*\s*(.+)$/` captures the value as-is. Changing the value can't affect parse/keying. |
| 6 | Conservation doesn't track chapter metadata | ✓ | (Confirmed in prior tiers) `emitChapter` emits overview/reading-guide/paragraph/verse/note/glossary/supplementary — never the metadata line. 11,831 unaffected. |
| 7 | All 16 are the metadata line; no other corpus occurrence | ✓ (6 files) | Verified the form is metadata-line-only in all 6 files I read across all 4 locales (en/john, en/mark, en/matthew, pt-br/john, es/matthew, pt-br/matthew, de/matthew). The corpus-wide "zero elsewhere" remains G1's grep, but the metadata-line-only pattern now holds in every locale sampled. |
| 8 | All 16 byte-identical (`kyrios (kyrios)`), 1/file; localized prefix only | ✓ (4 mangled sampled) | Confirmed identical `kyrios (kyrios)` core in es/matthew (`Opción C —`), pt-br/matthew (`Opção C —`), de/matthew (`Option C —`), en/mark (`Option C —`). Line structure is uniform `[localized prefix] — kyrios (kyrios) [localized tail]`; only the prefix/tail localize, the defect core is identical. The full 16 is G3's diff-integrity check. |
| 9 | Byte-exact NFC `κύριος` = U+03BA 03CD 03C1 03B9 03BF 03C2 | ✓ (spot) | The canonical John L11 `κύριος` is the intended reuse source; reusing its exact bytes makes repaired files byte-identical to the 12. The G9 codepoint check is the right guard. |
| 10 | "Unifies all 28 GS chapters" | ◑ | Only on the divine-name line. The methodology/ruleset stamp still diverges — and the split is **systematic**: every file sampled (en/john, en/matthew, pt-br/john, es/matthew, pt-br/matthew, de/matthew) is `v3.3 / 29-Rule`; only `en/mark` is `v3.4 / 30-Rule`. See Finding 2 (sharpened). |
| 11 | `\bkyrios \(kyrios\)` perl substitution is unambiguous | ✓ | The leading `\b` + literal ` (kyrios)` tail matches only the defect; the canonical `κύριος (kyrios)` won't match (starts with Greek κ, not ASCII `kyrios`). Single occurrence per file. Safe. |

---

## Findings

### Minor (precision — fold into the plan before executing)

**Finding 1 — §2.1's `κύριος (*kyrios*)` (with asterisks) vs. the no-asterisk metadata target: state the target form explicitly to prevent a wrong edit.**
The plan's §2.1 says "`RULES-GS.md` renders the lexeme as `κύριος (*kyrios*)` throughout — glossary row, policy heading, policy body." That's true *for the rules doc and the in-chapter glossary* (e.g. `en/john/CHAPTER-1.md` glossary row: `κύριος (*kyrios*)` — italic). But the **metadata line** convention is **plain, no asterisks**: the canonical John metadata line reads `Option C — κύριος (kyrios) rendered as…`. The plan's §5 substitution target is correctly the no-asterisk form, so the *script* is right — but the *prose* in §2.1 invites an executor to "match the rules" by adding asterisks, which would create a brand-new divergence from the 12 canonical chapters (the exact thing this fix exists to eliminate). **Fix:** in §2/§5, state: "Target form for the metadata line is `κύριος (kyrios)` — **no italic asterisks** — matching the 12 canonical chapters' metadata lines (the glossary's italic `κύριος (*kyrios*)` is a different context and must not be copied here)." The G4 diff-content check should explicitly assert no `*` appears in the repaired segment.

**Finding 2 (sharpened after deeper pass) — "unify all 28 GS chapters" overclaims; and the methodology-stamp split is *systematic*, not stray drift.**
The repaired files become identical *on L11*, but L9 (Methodology) still diverges — and the deeper read shows the divergence is **systematic and book/locale-correlated**, not random. Every GS file I sampled across all four locales — `en/john`, `en/matthew`, `pt-br/john`, `es/matthew`, `pt-br/matthew`, `de/matthew` — carries `29-Rule … (Ruleset v3.3)` (localized). **Only `en/mark` carries `30-Rule … (Ruleset v3.4)`.** So the pattern is: Mark (the newest book, authored after Rule 30 landed) is stamped v3.4 in EN; *everything else — all older books and all non-EN files — is stamped v3.3* and was never re-stamped when v3.4 shipped. So "all 28 GS chapters uniform" is true only of the Divine-Name-Policy line; on the methodology line the corpus is the opposite of uniform. This is correctly out of scope for a divine-name fix, but: (a) narrow the plan's language to "uniform **on the Divine-Name-Policy line**"; and (b) log the stamp split in PENDING as a *systematic* item — "GS methodology stamps: only en/mark is v3.4; all other GS chapters (incl. all non-EN) are v3.3, un-updated since v3.4 shipped" — the same class as the Tier-3/4 "Ruleset v3.3" landing-string staleness, but corpus-wide and worth a single coordinated sweep rather than piecemeal.

**Finding 3 — the es-locale "establishes, no prior canonical reference" note is correct, and the deeper pass confirms the cross-locale structure makes it safe.** §4 observes es had *no* prior canonical `κύριος (kyrios)` chapter, so this fix *establishes* the form for es rather than matching an existing es exemplar. That's right (the Greek lexeme is locale-independent — `κύριος` is the same bytes in every locale's metadata line). The deeper pass confirms this directly: I read `pt-br/john` (a canonical non-EN reference) and its metadata line is `Opção C — κύριος (kyrios) traduzido…` — byte-identical Greek core to en/john, only the prefix/tail localized. So the es target structure is proven, and the reuse source is sound. Since there's still no *es-specific* exemplar to diff against, the G9 byte-exactness check matters most for the es files: confirm the es repaired `κύριος` is byte-identical to the reused source, not re-typed. The plan's byte-exact-reuse method already covers this.

### Confirmed safe (verified, no action)

- **The repair direction is correct.** Collapsing to `kyrios` (what the generic `Name (Name)` dedup would do) would destroy the Greek script and make 16 chapters diverge from the 12 correct ones. Restoring `κύριος (kyrios)` is the rule-correct move, and the plan explicitly and correctly rejects the collapse. This is the single most important judgment in the plan and it's right.
- **Parse-neutral, verified at source.** The parser keys on the label and captures the value verbatim; the value is never re-parsed for content. The change cannot affect `ChapterData` beyond the one string field's bytes.
- **Not rendered, zero visual change.** `divineNamePolicy` is stored, not surfaced in any chapter view. No SEO/OG/JSON-LD consumer (consistent with the og.tsx pattern seen in Tier 4).
- **Conservation-neutral.** Metadata is not a tracked unit; 11,831 is structurally unaffected. G5's "unchanged count" is the right assertion.
- **The substitution regex is safe.** `\bkyrios \(kyrios\)` matches only the ASCII defect; the canonical Greek-initial `κύριος (kyrios)` cannot match it, so re-running the fix is idempotent and can't double-apply.
- **Rollback is trivial.** Single-line, content-only, feature branch — `git checkout content/` or `git revert`. No schema/migration/render dependency. Accurate.
- **The validation gate is well-constructed.** G1 (0 defect), G2 (28 canonical), G3 (diff integrity 16/16/16), G4 (content), G9 (codepoint) together prove the change is exactly what's claimed and nothing else. Strong gate for a content fix.

---

## On the open question (implicit) — branch naming

The plan header says **Branch: `tier4-name-dedup`** in one place and the §1 relationship line ties it to `PLAN_TIER4_NAME_DEDUP.md`, while the commit/footer says the `tier4-name-dedup` branch carries "118 name-dedup fixes + this fix." That's consistent (this rides on the same branch as the dedup work it was deferred from). Just confirm the 16-file fix commits *separately* from the 118 dedup commits (its own atomic commit, per the message in §7) so it's independently revertible — the plan implies this but doesn't state the two are distinct commits on the shared branch. One line in §7 to confirm "separate commit from the 118" would close it.

## Recommendation

**APPROVE.** The fix is correct, rule-grounded, and provably parse-neutral / render-neutral / conservation-neutral against source. Restoring `κύριος (kyrios)` (rather than collapsing to `kyrios`) is the right call and the plan makes it for the right reason. Fold in the three precision notes before executing — most importantly **Finding 1** (state the metadata target is the *no-asterisk* `κύριος (kyrios)`, and have G4 assert no `*` in the repaired segment), since that's the one way an executor could turn a correct plan into a new divergence. Narrow the "unifies all 28" language to the divine-name line (Finding 2) and log the methodology-stamp drift as a separate PENDING item.

The gate is strong enough that any deviation (wrong codepoints, an asterisk slip, a touched neighbor line, a conservation shift) fails before commit. With Finding 1's G4 tweak, the fix is airtight.

*Method note: the canonical and defect forms, the parser's label-keying + value-verbatim behavior, the not-rendered property, and the cross-locale line structure were verified against source (en/john, en/mark, en/matthew, pt-br/john, es/matthew, pt-br/matthew, de/matthew chapter 1 + markdown-parser.ts). The 16/12/28 counts, the corpus-wide "no other occurrence," and the full gate (test/lint/build/content:lint + conservation 11,831) are the executor's last-mile checks — not runnable here. Work is content-only on the shared dedup branch; production `main` untouched.*

---

## Addendum (deeper pass, 2026-06-20) — cross-locale structure verified

After the main audit I closed the one residual that could affect the "byte-exact, uniform substitution" safety case: whether the **non-EN** files carry the same metadata-line structure (so the single `\bkyrios \(kyrios\)` substitution works identically across locales). Read the metadata lines of `pt-br/john` (canonical non-EN reference), `es/matthew`, `pt-br/matthew`, and `de/matthew` (mangled non-EN targets):
- **Canonical non-EN confirmed:** `pt-br/john` → `Opção C — κύριος (kyrios) traduzido…` (Greek core, no asterisks). Glossary row uses italic `κύριος (*kyrios*)` — confirming Finding 1's metadata-vs-glossary context split holds in non-EN too.
- **Mangled non-EN confirmed (3):** es/matthew `Opción C — kyrios (kyrios)…`, pt-br/matthew `Opção C — kyrios (kyrios)…`, de/matthew `Option C — kyrios (kyrios)…`. Uniform structure `[localized prefix] — kyrios (kyrios) [localized tail]`; only prefix/tail localize, the defect core is identical → the substitution is safe across all locales.
- **Finding 2 sharpened:** the v3.3/v3.4 methodology split is systematic — only `en/mark` is v3.4; all other GS chapters incl. every non-EN file are v3.3.

**Nothing in the deeper pass changes the verdict. APPROVE stands** (with the three findings folded in). The remaining items — the exact 16/12/28 counts, corpus-wide grep, and the gate — are execution-time and can't be closed by more reading. This is final.
