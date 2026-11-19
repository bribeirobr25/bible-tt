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
