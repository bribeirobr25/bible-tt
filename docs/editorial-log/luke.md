# Editorial Log — Gospel of Luke

**Ruleset version in force:** v3.4
**Book:** Gospel of Luke (Κατὰ Λουκᾶν)
**Base text:** Nestle-Aland 28th ed. (NA28)
**Maintainer:** Project Lead
**Format:** per v3.4 Editorial Log Specification

This log records consistency decisions, justified exceptions, text-critical choices, and any deviations from the default ruleset for Luke 1–3. All content is **provisional** pending a credentialed Hellenist review (Rule 28). Authored EN-first from NA28, then propagated to PT-BR / DE / ES.

---

## Entry L-001 — Luke activation + scope

- **Scope:** Luke 1–3, full treatment (chapters + INTRODUCTION + PEOPLE/genealogy + CONTEXT + per-chapter companions + PROPHECY where warranted), all 4 locales. New book #5.
- **Source language / ruleset:** Koine Greek → RULES-GS (kyrios Option C divine name; Greek article system; canonical `κύριος (kyrios)` metadata line; Option B traditions). Narrative gospel = Matthew/Mark template (RULES-CORE Rule 29 genre table: Gospels = Narrative).
- **Rule 30 (divine-speech marking) decision — Gabriel excluded:** Gabriel (*angelos*, 1:11-20, 1:26-38) is an angelic/messenger speaker → **NOT marked** as divine speech, by default, consistent with the Matthew *malakh* (angelos kyriou) / Mark precedent (matthew.md M-004; mark.md). God's/Spirit's direct speech IS marked (e.g. the Bat-Qol at the baptism, 3:22). The canticles (Magnificat 1:46-55, Benedictus 1:68-79, Gloria 2:14, Nunc Dimittis 2:29-32) are **human** speech (Mary, Zechariah, the angelic host, Simeon) → not divine-marked; rendered as flowing prose (see L-002).
- **Genealogy (3:23-38):** ~76 generations, Yeshua → Adam. Rendered as a PEOPLE genealogy table; cross-book see-only stubs to `genesis` (Adam → patriarchs) and `matthew` (David line) per the v3.3.2 cross-book convention.
- **AI provenance:** claude-opus-4-8 (1M), 2026-06-22. **Status:** provisional. **Reviewers:** Hellenist + locale-editors unassigned (Rule 28).
- **Cross-references:** `PLAN_LUKE_EXPANSION.md`; `AUDIT_LUKE_EXPANSION_PLAN.md`; `docs/source-analysis/greek/luke-1-3.md`.

## Entry L-002 — Canticle rendering spike (Phase-1.0): poetry = prose, by established convention

- **Question:** how should the canticles (Magnificat 1:46-55, Benedictus 1:68-79, Gloria 2:14, Nunc Dimittis 2:29-32) render their poetic lines?
- **Spike finding (verified against source):** both the Read view (`continuous-reading.tsx`) and Notes view (`verse-card.tsx`) render verse text via `renderMarkdownSafe(text, "prose")`, and **prose mode collapses `\n` → space** (`render-markdown-safe.ts`; only `"note"` mode emits `<br/>`). The parser *does* keep `\n` in `mainText` (`markdown-parser.ts:193 join("\n")`), but it's flattened at render. A global prose→`<br/>` change would regress **every existing multi-line verse** in Genesis/John/Matthew/Mark → rejected.
- **Decision:** **author the canticles as flowing prose**, matching the established project-wide convention (all existing poetry — e.g. Genesis oracles — already renders run-on). No renderer/infra change. Visual poetic lineation is deferred with the Hebrew-poetry-genre question (Psalms/Proverbs/Ecclesiastes), out of scope for the Luke pilot.
- **AI provenance:** claude-opus-4-8 (1M), 2026-06-22. Status: provisional.
