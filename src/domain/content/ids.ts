/**
 * Phase 2 — Stable content IDs (P2-Q4 = A: position + slug derived).
 *
 * IDs are **locale-independent** (derived from book / chapter / position / slug,
 * never from locale or display text), **deterministic** (re-parsing the same
 * content yields identical IDs), and **human-readable** for debugging.
 *
 * Stability rule: slugged IDs (people, motifs, glossary, intro/enrichment
 * sections) stay stable across content reordering; positional IDs (verses,
 * notes, entries, paragraphs) derive from canonical position and change by
 * design if the underlying content is reordered.
 *
 * Pure domain module — no framework, no fs, no I/O.
 */

/**
 * Normalize an arbitrary string (source word, section title, …) into a stable
 * URL-safe slug. Strips diacritics so transliterated forms collapse to ASCII.
 * Falls back to a positional token when the input has no slug-able characters
 * (e.g. a title written entirely in a non-Latin script).
 */
export function slugify(input: string, fallbackIndex?: number): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug) return slug;
  return fallbackIndex != null ? `x${fallbackIndex + 1}` : "x";
}

// ─── Structural ────────────────────────────────────────────────────────────

export function bookId(book: string): string {
  return book;
}

export function chapterId(book: string, chapter: number): string {
  return `${book}.${chapter}`;
}

// ─── Chapter units ───────────────────────────────────────────────────────────

export function verseId(book: string, chapter: number, verse: number): string {
  return `${book}.${chapter}.${verse}`;
}

/** noteIndex is 0-based; rendered 1-based (#n1, #n2, …). */
export function noteId(
  book: string,
  chapter: number,
  verse: number,
  noteIndex: number,
): string {
  return `${verseId(book, chapter, verse)}#n${noteIndex + 1}`;
}

export function paragraphId(
  book: string,
  chapter: number,
  index: number,
): string {
  return `${chapterId(book, chapter)}#p${index + 1}`;
}

export function glossaryId(
  book: string,
  chapter: number,
  sourceWord: string,
  index?: number,
): string {
  return `${chapterId(book, chapter)}#g.${slugify(sourceWord, index)}`;
}

export function supplementaryId(
  book: string,
  chapter: number,
  title: string,
  index?: number,
): string {
  return `${chapterId(book, chapter)}#s.${slugify(title, index)}`;
}

export function chapterPartId(
  book: string,
  chapter: number,
  part: "overview" | "reading-guide",
): string {
  return `${chapterId(book, chapter)}#${part}`;
}

// ─── Enrichment (CHAPTER-N-CONTEXT) ──────────────────────────────────────────

export function enrichmentSectionId(
  book: string,
  chapter: number,
  sectionId: string,
): string {
  return `${chapterId(book, chapter)}.ctx#${sectionId}`;
}

export function enrichmentEntryId(
  book: string,
  chapter: number,
  sectionId: string,
  entryIndex: number,
): string {
  return `${enrichmentSectionId(book, chapter, sectionId)}.e${entryIndex + 1}`;
}

export function enrichmentSubEntryId(
  book: string,
  chapter: number,
  sectionId: string,
  entryIndex: number,
  subIndex: number,
): string {
  return `${enrichmentEntryId(book, chapter, sectionId, entryIndex)}.s${subIndex + 1}`;
}

export function enrichmentDisclaimerId(book: string, chapter: number): string {
  return `${chapterId(book, chapter)}.ctx#disclaimer`;
}

// ─── Introduction ────────────────────────────────────────────────────────────

export function introSectionId(book: string, sectionId: string): string {
  return `${book}.intro#${sectionId}`;
}

export function introEntryId(
  book: string,
  sectionId: string,
  entryIndex: number,
): string {
  return `${introSectionId(book, sectionId)}.e${entryIndex + 1}`;
}

export function introDisclaimerId(book: string): string {
  return `${book}.intro#disclaimer`;
}

// ─── Prophecy ────────────────────────────────────────────────────────────────

export function prophecyEntryId(
  book: string,
  chapter: number,
  entryIndex: number,
): string {
  return `${chapterId(book, chapter)}.prophecy#e${entryIndex + 1}`;
}

export function prophecyReadingId(
  book: string,
  chapter: number,
  entryIndex: number,
  readingIndex: number,
): string {
  return `${prophecyEntryId(book, chapter, entryIndex)}.r${readingIndex + 1}`;
}

// ─── People ──────────────────────────────────────────────────────────────────

export function personId(book: string, slug: string): string {
  return `${book}.people#${slug}`;
}

export function personSubId(
  book: string,
  slug: string,
  kind: "cur" | "gen" | "reg",
  index: number,
): string {
  return `${personId(book, slug)}.${kind}${index + 1}`;
}

// ─── Book context (CONTEXT.md) ───────────────────────────────────────────────

export function motifId(book: string, slug: string): string {
  return `${book}.context#${slug}`;
}

export function bookContextDisclaimerId(book: string): string {
  return `${book}.context#disclaimer`;
}
