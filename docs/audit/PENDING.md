# Pending & Deferred Items

**Date:** 2026-04-30
**Status:** All implementation work complete except the items below.

---

## Content Creation (Deferred)

### Phase 10 — Genesis 13-50
- 38 chapters × 4 locales = 152 chapter files + 152 companion files
- Prophecy files for chapters with prophetic content
- Interdisciplinary entries per the research checklist
- Pseudepigrapha Section F entries where applicable
- PEOPLE.md expansion for figures introduced in Gen 13+
- All infrastructure is ready — parsers, views, rules, templates

---

## VerseRelated — Manual Population (Deferred to Phase 10)

The `VerseRelated` component (`src/ui/study/verse-related.tsx`) is built and ready. It renders "See also" links per verse in Study mode, connecting to glossary entries, companion sections, and prophecies.

**Decision:** Links will be manually authored per chapter during Phase 10 content creation, not auto-generated via regex matching.

---

## C3 — People Cross-Book Canonical Structure (Future)

The current `{locale}/{book}/PEOPLE.md` per-book model works for Genesis. When Avraham appears in multiple books (Genesis 13+, Romans 4, Galatians 3, Hebrews 11), refactor to `{locale}/people/INDEX.md` with cross-book canonical entries to prevent data drift across books.
