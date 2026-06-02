# Source Analysis — internal working material

This directory holds the project's **source-language analysis**: the reusable method and the per-verse worked-example corpus that feed translation and companion authoring.

> **Internal-only.** Nothing here is user-facing. The corpus is never quoted verbatim into `content/` or rendered in the web app, and it carries no contributor name or persona. A warn-only content-lint rule (`scripts/content-lint.sh §0.13`) guards `content/` + `src/` against name/persona leakage.

## Contents

| Path | What |
|---|---|
| `METHOD.md` | The TT Source-Analysis Method — the source-language-agnostic process + per-language adaptation table. |
| `hebrew/` | Structured per-verse notes for the Hebrew Bible (currently Genesis 1:1–1:13 + word studies). |
| `greek/` | Stub — filled when Greek books are actively authored (needs a Hellenist per Rule 28). |
| `aramaic/` | Stub — filled when the canon's Aramaic passages are reached. Governance home: `RULES-HB.md §Aramaic Appendix` (no separate ruleset). |

## How it feeds the project

`METHOD.md` §5 is authoritative. In short: corpus notes → Tier 1 main text + Tier 2 notes + companion §A/§D, with every deviation logged in `docs/editorial-log/` and recurring loaded terms entering the glossary via the Glossary Expansion Procedure. The rules decide; the corpus informs.

- Method governance: `docs/rules/RULES-CORE.md` (universal), `RULES-HB.md` (Hebrew + Aramaic), `RULES-GS.md` (Greek).
- Decision logs: `docs/editorial-log/{genesis,john,matthew,transliteration-decisions}.md`.

## Provenance

The Hebrew corpus was distilled from word-by-word source-language video analysis by an external native-Hebrew-speaker contributor (Elan), retained here as internal working notes. This single line is the only internal record of the contributor's identity; the material has been re-branded as the project-owned **TT Source-Analysis Method** and fully de-personalized everywhere else. (Per `docs/audit/SOURCE_ANALYSIS_METHODOLOGY_PLAN.md`, decision Q2=A.)
