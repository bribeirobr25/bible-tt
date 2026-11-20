# Source Analysis — internal working material

This directory holds the project's **source-language analysis**: the reusable method and the per-verse worked-example corpus that feed translation and companion authoring.

> **Internal-only.** Nothing here is user-facing. The corpus is never quoted verbatim into `content/` or rendered in the web app, and it carries no contributor name or persona. A warn-only content-lint rule (`scripts/content-lint.sh §0.13`) guards `content/` + `src/` against name/persona leakage.

## Contents

| Path | What |
|---|---|
| `METHOD.md` | The TT Source-Analysis Method — the source-language-agnostic process + per-language adaptation table. |
| `hebrew/` | Structured per-verse notes for the Hebrew Bible (currently Genesis 1:1–1:13 + word studies). |
| `greek/` | Worked examples (NA28): Mark 1–3 (`mark-1.md`, `mark-2-3.md`, the pilot), Luke 1–3 (`luke-1-3.md`), Acts 1–3 (`acts-1-3.md`), 1 Peter 1–5 (`1-peter.md`). John and Matthew have no file (authored before the corpus existed). AI-assisted drafts pending Hellenist review per Rule 28. |
| `aramaic/` | Stub — filled when the canon's Aramaic passages are reached. Governance home: `RULES-HB.md §Aramaic Appendix` (no separate ruleset). |

## How it feeds the project

`METHOD.md` §5 is authoritative. In short: corpus notes → Tier 1 main text + Tier 2 notes + companion §A/§D, with every deviation logged in `docs/editorial-log/` and recurring loaded terms entering the glossary via the Glossary Expansion Procedure. The rules decide; the corpus informs.

- Method governance: `docs/rules/RULES-CORE.md` (universal), `RULES-HB.md` (Hebrew + Aramaic), `RULES-GS.md` (Greek).
- Decision logs: `docs/editorial-log/{genesis,john,matthew,mark,luke,acts,1-peter,transliteration-decisions}.md` (one per book, plus the cross-book transliteration log).

## Provenance

The Hebrew corpus was distilled from word-by-word source-language video analysis by an external native-Hebrew-speaker contributor (Elan), retained here as internal working notes. This single line is the only internal record of the contributor's identity; the material has been re-branded as the project-owned **TT Source-Analysis Method** and fully de-personalized everywhere else.
