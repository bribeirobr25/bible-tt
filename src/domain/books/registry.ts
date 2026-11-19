export const AVAILABLE_BOOKS = [
  "genesis",
  "matthew",
  "mark",
  "luke",
  "john",
  "acts",
  "1-peter",
] as const;
export type BookSlug = (typeof AVAILABLE_BOOKS)[number];

/**
 * Activated books that are deliberately EN-only for now (an EN-first pilot
 * branch, e.g. a new book before its PT-BR/DE/ES propagation). The
 * cross-locale parity and people-field tests skip these; everything else must
 * be at full four-locale parity. Empty = every activated book is four-locale.
 * Remove a book from here in the same PR that propagates it.
 */
export const PILOT_BOOKS: readonly BookSlug[] = [];
