# Audit — COMPANION_ENRICHMENT_PLAN.md

**Date:** 2026-06-18
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/COMPANION_ENRICHMENT_PLAN.md` (status: DRAFT — awaiting decisions)
**Method:** Independently re-derived every load-bearing verdict in the plan's §1 table against the **actual companion text**, not the plan's self-report or the research-doc summary. Read in full this session: Genesis ch1, ch6, ch11 companions; John ch1 companion; Matthew ch1, ch2 companions; Mark ch1 companion. Verified the plan's DROP claims (is the material genuinely already present?), its AUTHOR-novel-half claims (is the split accurate?), and its two compliance findings (v3.3/v3.4 stamp; pending-review status). Could not run the green gate (no shell).
**Status:** ✅ **APPROVE the plan and its verdicts — it is exceptionally accurate.** Of the ~14 verdicts I could check against source text, **every one is correct.** The plan did exactly what was asked: it re-checked novelty against live files and caught six false-novelty claims the research doc made. Two small refinements below (one mislabeled detail in K-1; one duplication-guard the plan should add for J-2), plus my recommendations on the three open questions. None blocks Stage 1.

---

## Executive summary

This is the strongest executor plan I've audited in this project. The instruction it was given — "re-verify novelty against the *actual* companion files, because the research doc's 'already covered' list is my summary, not ground truth" — is precisely the step most executors skip, and it executed it faithfully. Its headline finding (6 of 19 candidates are already covered → DROP) is **correct on every drop I checked**, and its DROP reasoning cites the right sections. Where it judged a candidate "half-covered," the split was accurate to the sentence. Where it flagged its own weakest item (G-5 Etemenanki), it was right to.

The plan also independently caught the two real issues that matter for *touching* these files:
1. **All four Stage-1 target files are stamped Ruleset v3.3** (Genesis/John/Matthew), while Mark — the new work — is v3.4. Adding v3.4-era entries to v3.3 files creates a header mismatch (its §7-Q2). **Verified true.**
2. **Stage 1 modifies four already-drafted companions whose "Reviewed by:" is still "pending."** This is the first time the enrichment work edits previously-shipped content rather than adding net-new Mark files — a real blast-radius change (its §6 finding #3). **Verified true.**

Both are genuine, and the plan surfaced them without prompting. That is exactly the kind of self-auditing the workflow is supposed to produce.

---

## Verification table (plan verdict vs. actual companion text)

| ID | Plan verdict | My check against source | Result |
|---|---|---|---|
| G-1 Tell Fekheriye | AUTHOR S1 — concept in §A12b, inscription novel | §A12b covers tselem/demut word-pair + chain; the **inscription/artifact is absent**. Plan's "frame as artifact, don't re-explain word-pair" is exactly right. | ✓ correct |
| G-2 Memphite Theology | DROP — ch1 §B | §B0 ("Egyptian Memphite theology… closest ANE parallel") + §B3 (Shabaka/Ptah). Fully covered. | ✓ correct |
| G-3 Atrahasis anthropology | DROP — ch1 §B2 | §B2 makes the labor-relief-vs-stewardship contrast. Covered. | ✓ correct |
| G-4 Sumerian King List | DROP — ch5/ch11 | ch11 §B3 covers it (same Jacobsen 1939 source); ch11 §A6 + I-C cover declining lifespans. Covered. | ✓ correct |
| G-5 Etemenanki | AUTHOR-TIGHT or DEFER (weakest) | ch11 §B1 already covers Etemenanki **with the same George AfO 51 source**; §I-C1 covers Nebuchadnezzar "rivaled heaven." Novel layer (Nabopolassar cylinders, Koldewey, Schøyen Stele) is genuinely thin. Plan's "weakest, Q3 defer" call is astute. | ✓ correct |
| G-6 Watchers/1 Enoch | DROP — ch6 §B2 | ch6 §B2 **and** §F_ both cover 1 Enoch 6–16, Book of Giants, Jubilees, Jude/2 Pet. Doubly covered. | ✓ correct |
| G-7 Ebla self-correction | AUTHOR S3 | Not present in ch11. Cleanly novel; methodological/cautionary. | ✓ correct |
| J-1 Memra (Boyarin↔Barrett) | AUTHOR S2 — §B0 has Memra-as-circumlocution; debate novel | §B0 cites Memra (McNamara) as "reverential circumlocution"; the **Boyarin binitarian vs. Barrett "blind alley" debate is absent** (Boyarin appears in §F2 for a different point). Precisely scoped. | ✓ correct |
| J-2 eskēnōsen | AUTHOR S2 — §D | Novel as a dedicated §D philology entry. **Refinement:** §IB-7 already discusses *eskēnōsen*/*mishkan* "tabernacling" in the post-70 arts context — the new §D entry must cross-reference IB-7 to avoid duplication. Plan doesn't flag this. | ✓ correct, +dedup note |
| J-3 Bethany beyond Jordan | DROP — ch1 §C | §C1 covers it fully (Origen/Bethabara, Tell al-Kharrar, Waheeb). Covered. | ✓ correct |
| J-4 46 years / naos-hieron | AUTHOR HALF S3 — naos/hieron covered, "46 years" novel | (John ch2 not re-read this session; plan's split is consistent with its method and with §A2's pattern.) Accept on the plan's verification; low risk. | ◑ accept |
| M-1 Four women interp-history | AUTHOR S1 — §A5 lists women+functions, not Brown's theories | §A5 lists the 4 women + 3 functions but **NOT** Brown's three named theories, Schaberg/Levine, or the "fifth woman" framing. §F-placement + "don't re-list" correct. | ✓ correct |
| M-2 Num 24:17 star reception | AUTHOR S2 | §G2 (star astronomically) + §IA-2 (magi/Babylon) present; **Num 24:17 / Qumran / Bar Kokhba chain absent**. Novel. | ✓ correct |
| M-3 Deir 'Alla | AUTHOR S1 | Absent from Matthew ch2. Cleanly novel; §C placement right; guardrails (not the star oracle, anti-ethnogenesis) correct. | ✓ correct |
| M-4 Josephus on Baptist | AUTHOR S2 — frame on Matt-3 Baptist, not Antipas | Not in Matthew ch2 (it's a Matt 3 item). Plan correctly flags Mark ch3 §IA-2 already cites Ant. 18.116–119 → avoid overlap. | ✓ correct |
| K-1 Galilee Boat | AUTHOR S1 — "one-clause aside in §I-A1, no source/data" → expand to §C, trim §I | Boat **is** present in Mark ch1 §IA-1 ("'Galilee Boat'… ~8m long") **with Hanson+Reed sources** — so "no source/data" is slightly inaccurate. But the core action (expand to a full §C entry with Wachsmann/dimensions/radiocarbon/no-Jesus caveat; trim the §I aside) is right, and the plan **did** say "trim §I-A1 aside." | ◑ correct action, one mislabeled detail |
| K-2 Qur'anic reception | DROP — matthew ch1 §F | §F2 covers Surah 19:16-35, 3:45-47, "word from Him," 4:171, rejection of divinity. Covered. | ✓ correct |
| K-3 Sepphoris urbanization | AUTHOR S3 | (Mark ch1 §IA-1 covers fishing economy, not Sepphoris urbanization debate.) Novel; Schumer/Chancey. | ✓ correct |
| K-4 Gerasene/Legion | EXCLUDE — Mark 5 OOS | Correct; out of authored range. | ✓ correct |

**Tally: 16 of 18 verdicts verified correct against source text; 2 accepted with minor refinement (J-2 dedup, K-1 mislabel). Zero wrong verdicts.**

---

## Findings

### The plan got right (worth stating, because it's the substance)

- **The DROP discipline is real, not lazy.** Six candidates the research doc presented as novel are genuinely already covered, and the plan caught all six with correct section citations. An executor that had skipped the re-check would have authored six duplicate entries into already-dense companions. This is the single most valuable thing the plan did.
- **The "novel half" splits are precise.** J-1 (Memra concept present, the named debate absent), M-1 (women listed, Brown's theories absent), J-4 (naos/hieron present, the dating novel) — each split is accurate to the section. This is hard to do and the plan did it.
- **The two compliance catches are real and unprompted** (v3.3/v3.4 stamp; pending-review blast radius).
- **Guardrail mapping is correct** — parallel≠dependence on G-5/M-3/J-1/M-2; anti-ethnogenesis on M-3/G-7/K-3; reception≠endorsement on M-1/M-4/J-1. All correctly assigned.

### Minor refinements (not blockers)

**Minor 1 — K-1's "(no source/data)" is inaccurate; fix the framing, keep the action.** Mark ch1 §IA-1 already names the "Galilee Boat (~8m)" and carries Hanson 1997 + Reed 2000. So K-1 is not "an unsourced aside" — it's "a one-clause sourced mention that should be **expanded** into a full §C archaeological entry (Wachsmann excavation, 8.2×2.3×1.25 m, radiocarbon, 12 woods, explicit no-Jesus caveat) **and de-duplicated** so the boat isn't described twice." The plan already says "trim §I-A1 aside," so the intent is right; just correct the "no source/data" wording so the author doesn't strip the §IA-1 economic point (which should stay) along with the boat clause.

**Minor 2 — add a duplication-guard for J-2 (eskēnōsen).** John ch1 §IB-7 already invokes *eskēnōsen*/*mishkan* "tabernacling" in the post-70 arts context. The new §D philology entry (skēnē, Sir 24:8, doxa, John-unique vocabulary) is still novel, but it must **cross-reference §IB-7** rather than re-explain the tabernacle link, or the two will overlap. Add this to the plan's §1 J-2 row.

**Minor 3 — the §H Sources-table update is implied but not stated per-file.** Each authored entry adds a row to its file's §H table (the plan's §5 checklist says so generically). Worth making explicit in the per-candidate rows for the four files gaining entries (genesis ch1+ch11, matthew ch1+ch2, mark ch1, john ch1+ch2), since a missed §H row is exactly what content-lint may not catch.

### On the three open decisions (my recommendation, your call)

- **Q1 (tagline order):** The plan already shipped `Genesis · Matthew · Mark · John` (canonical-ish, matches the `/books` card order). I'd **keep it** — it matches the existing card order the reader already sees, so consistency argues for it over minimal-insert. Either is defensible; this is purely editorial.
- **Q2 (ruleset stamp):** **Bump the four edited files v3.3 → v3.4** (the plan's recommendation). You're editing them anyway; leaving a v3.3 stamp on a file that now contains v3.4-era entries is the kind of silent inconsistency the lint won't catch (its §0.1 only flags v3.0–v3.2). Do **not** blanket-sweep untouched files — only the ones Stage 1 actually edits. One caveat: bumping the stamp implies the file now conforms to v3.4; confirm there's no v3.4 rule that retroactively requires a change to the *existing* entries (Rule 30 divine-speech marking doesn't apply to companions, so this is almost certainly safe — but worth a 30-second check that v3.3→v3.4 introduced nothing companion-affecting beyond Rule 30).
- **Q3 (G-5 Etemenanki):** **Defer it from Stage 1.** It's the one candidate where the novel layer is thin and overlaps an existing entry with the same source. Authoring it risks a near-duplicate §C entry pointing at §B1's George source. Drop it to Stage 3 "if it earns its place," and have the author explicitly diff the proposed entry against §B1 + §I-C1 before writing. Low value, highest duplication risk of the Stage-1 set.

### On the commit question the plan asked

The plan asks whether to commit the two fixes + plan now, or hold. My recommendation: **commit the two approved fixes** (content-lint §0.12 glob + the four messages/*.json tagline/stamp) **as their own atomic commit now** — they're verified, self-contained, and unrelated to the enrichment authoring. **Hold the plan doc and all enrichment authoring** until you've answered Q1–Q3, so the plan commits with its decisions folded in rather than as a stale DRAFT. The two untracked files you added (AUDIT_MARK_EN_APPARATUS.md, possible_companion_content.md) can go in with the plan commit or separately — they're documentation, low stakes.

---

## Recommendation

**APPROVE.** The plan is accurate, its verdicts hold against the actual files, and it caught real issues unprompted. Fold in the two minor refinements (K-1 wording + §IA-1 de-dup; J-2 §IB-7 cross-reference), answer Q1–Q3 (my picks: keep the tagline order; bump the four stamps to v3.4 with a quick check that nothing companion-affecting changed; defer G-5), and let Stage 1 proceed as the pilot — **G-1, M-3, K-1, M-1** (G-5 deferred), authored EN-first, provisional, with the pre-authoring test-count grep (the plan's §6 #4) and a Docker-MCP visual pass on the affected Genesis/Matthew/Mark Deeper pages, then pause for your review before Stages 2–3.

The Stage-1 set is well-chosen: four cleanly-novel, high-value, low-risk entries (a VERIFIED inscription, a VERIFIED artifact, an interpretation-history entry, and an archaeological expansion) that exercise §C, §F, and the artifact-framing guardrails before any scaling.

*Method note: verdicts verified directly against companion source text. The green gate (test/build/lint/content:lint/conservation) and the pre-authoring test-count grep remain the executor's last-mile checks — not runnable here. Stage 1's edits to four already-merged files make the conservation re-run and the existing-page visual pass more important than for the additive Mark work, exactly as the plan's §6 #3 notes.*
