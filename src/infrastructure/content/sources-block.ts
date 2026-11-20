/**
 * "Sources Consulted" blocks (Rule 29 §H / introduction §G): the source table
 * plus the Rule-28 editorial-provenance lines. Every content parser that meets
 * one captures it raw with these helpers, so detection and cleaning cannot
 * drift between companions, introductions, PROPHECY and PEOPLE files.
 *
 * Detection is by heading WORDS, never by letter: companion §G is Curiosities,
 * introduction §G is Sources. Anchored at the start (after an optional
 * "H. " letter), so "A. Source Text Features", "Texto-Fonte" or
 * "5. AT-Quellenbreite" never match. Mirrors `SOURCES_H2` in
 * `scripts/sweep/zones.mjs`.
 */
export const SOURCES_HEADING =
  /^(?:[A-Z]\.\s+)?(?:Sources|Fontes|Fuentes|Konsultierte Quellen|Herangezogene Quellen|Quellen)\b/i;

export function isSourcesHeading(h2Text: string): boolean {
  return SOURCES_HEADING.test(h2Text.trim());
}

/**
 * Clean captured Sources lines for direct rendering: blockquote markers are
 * stripped and list bullets normalized to "• ". Returns undefined when nothing
 * but whitespace / horizontal rules was captured.
 */
export function cleanSourcesBlock(lines: string[]): string | undefined {
  // Horizontal rules separate the table from the provenance in the source;
  // rendered as a note they would only add empty line breaks, so they go, and
  // blank runs collapse to one blank line.
  const kept = lines.filter((l) => !/^\s*-{3,}\s*$/.test(l));
  const raw = kept
    .join("\n")
    .replace(/\n[ \t]*(?:\n[ \t]*)+/g, "\n\n")
    .trim();
  if (!raw) return undefined;
  return raw.replace(/^>\s?/gm, "").replace(/^[-*]\s+/gm, "• ");
}
