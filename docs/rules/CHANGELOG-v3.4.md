# Changelog — Ruleset v3.3 → v3.4 → v3.4.1

---

## v3.4 (2026-06-17) — Divine speech + Text-Highlight Markers

*Reconstructed 2026-11-20. No changelog file was written when v3.4 landed. Sources: RULES-CORE §VERSION HISTORY (v3.4 entry) and `docs/audit/EXECUTION_HISTORY.md` ("Methodology-stamp re-stamp to v3.4/30-Rule", 2026-06-21).*

### RULES-CORE.md

| Addition | Description |
|---|---|
| **Rule 30 — Divine Speech Marking** | Narrow-scope, visibility-only marking of the direct speech of YHWH/God, Yeshua and the Spirit (`@@…@@` → `.divine`). Debatable speakers (the Angel of YHWH, divine-council "us") are excluded by default and logged. God's words quoted by another speaker are not marked. |
| **Text-Highlight Markers** | Formalized the four reader markers: `*added*` (Rule 11), `{t:…}` (Rule 4), `{a:…}` (Rule 2), `@@…@@` (Rule 30). They are authored in content and converted at render time, and the conservation layer is unaffected. *(The colours stated in v3.4 were corrected in v3.4.1 — see below.)* |

Total: **30 rules**. Content: the chapter `Methodology:` lines were re-stamped to "30-Rule … (Ruleset v3.4)" on 2026-06-21. The `**Ruleset:**` front-matter fields and 8 prose stamps followed on 2026-11-20 (Launch-Program Step 4 batch 2: 125 fields + 8 prose stamps; the 4 Luke 3 "v3.3.2 convention" citations are amendment citations and were kept).

---

## v3.4.1 (2026-11-20) — Launch-Program corrections

**Amendment type:** re-opening (RULES-CORE §Amendment & Lock Protocol). The 14-day window was waived by the project lead. Proposal and impact assessment: `docs/rules/proposals/v3.4.1-launch-corrections.md`.
**Rationale:** the rule text had to state the lead's Launch-Program decisions before the content batches apply them (`docs/audit/LAUNCH_PROGRAM.md` D7–D10; `docs/audit/CONTENT_SWEEP_FINDINGS.md` §3 L1, L4, L5, L6).
**Signed-off verses affected:** none (all content is provisional). Content stamps stay **v3.4**.

### RULES-CORE.md

| Change | Type | Description |
|---|---|---|
| §I3 Glossary terms never yield | modification (D7) | ψυχή / bare נֶפֶשׁ = life/being · vida/ser · Leben/Wesen · vida/ser (was "soul/being", which contradicted the GS lock); נֶפֶשׁ חַיָּה = living being(s). |
| §I3 scope of a lock | addition (L4) | A lock governs the rendering and any TT-voice sentence restating it; genre and reception uses keep their forms. |
| Rule 20 titular nouns | modification (D8) | Body-text lowercase covers notes and companions too ("son of man" lowercase everywhere); headings keep heading case; DE exempt. |
| Name exceptions | correction (D9) | "Yehudim (DE Jehudim)". |
| Rule 30 + marker table | correction (D10) | `@@` renders red and not bold; `{a:}` renders bold in the body colour (not ochre). The table now follows `globals.css`. |
| Rule 11 | addition (L1) | Contraction clause: the whole fused contraction is italic (`*na*`, `*im*`, `*del*`); never a doubled article. |
| Idiom policy | modification (L1) | Replaced "Rule 11 marking applies only when words are added beyond grammatical necessity" (contradicted Rule 11 A and the marker table): grammatical additions are italic; an idiom substitution follows the idiom policy. |
| Rule 28 AI-assisted drafting | modification (L5) | Internal per-file provenance record (editorial log + `docs/editorial-log/ai-provenance-record.tsv`), never reader-facing; reader files carry one plain statement per locale (4-locale table). Companion checklist and log-schema field aligned. |
| Rule 10 register | addition (L6) | PT-BR verse text keeps the classical *vós* — the one sanctioned archaism. Also the Portuguese register note. |
| Heading, checklist, spec | correction | "THE 30 RULES"; "rules 1–30"; companion front-matter spec `Ruleset: v3.4`. |
| New-book activation | correction | The "5 synchronized changes" list (which named a non-existent `people.inBook.{slug}` key and a hand-kept lint list) → the PEOPLE-specific steps plus a pointer to `AUTHORING-PLAYBOOK.md` §B.1, the single full checklist. |
| Editorial-log schema | correction | `Reviewers` cell: pipes escaped (the row rendered 7 columns). |
| VERSION HISTORY, PROJECT METADATA, footer | correction | v3.4.1 entry; seven books; "through v3.4.1". |

### RULES-HB.md

| Change | Type | Description |
|---|---|---|
| Glossary | addition (D7) | Bare `נֶפֶשׁ` = life/being · vida/ser · Leben/Wesen · vida/ser. Provisional pending the Hebraist (§G3 no-wait mode); required by §G4 (a cross-supplement term appears in both supplements). |
| Aramaic appendix | correction | "Rules 1–30". |
| Version history | addition | New list; versions name the CORE release that amended the supplement. |

### RULES-GS.md

| Change | Type | Description |
|---|---|---|
| Ioudaioi policy | correction (D9) | DE **Jehudim** (the prose said "Yehudim in all four languages"; the table already said "die Jehudim"). |
| Greek Article System | clarification (L1) | DE contractions: the whole contraction is italic, as RULES-CORE Rule 11. |
| Source-analysis line | correction | The Greek corpus as it exists (Mark, Luke 1–3, Acts 1–3, 1 Peter). |
| Transliteration note | correction | *mabbul* removed from the list of HB transliterations (RULES-HB renders it "flood"). |
| Version history | addition | v3.2 and v3.4.1 lines (the list ended at v3.1). |

---

## Dated addenda

*Later Step-4 batches append rule-table edits here: batch 4 (glossary rows, labels, Genesis nephesh deviations), batch 5 (D11 proper-name tables).*
