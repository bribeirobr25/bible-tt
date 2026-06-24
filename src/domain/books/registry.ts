export const AVAILABLE_BOOKS = [
  "genesis",
  "matthew",
  "mark",
  "luke",
  "john",
  "acts",
] as const;
export type BookSlug = (typeof AVAILABLE_BOOKS)[number];
