export const AVAILABLE_BOOKS = [
  "genesis",
  "matthew",
  "mark",
  "luke",
  "john",
] as const;
export type BookSlug = (typeof AVAILABLE_BOOKS)[number];
