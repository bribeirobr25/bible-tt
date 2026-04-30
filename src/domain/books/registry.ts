export const AVAILABLE_BOOKS = ["genesis", "matthew", "john"] as const;
export type BookSlug = (typeof AVAILABLE_BOOKS)[number];
