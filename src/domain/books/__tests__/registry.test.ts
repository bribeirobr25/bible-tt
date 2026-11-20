import { describe, expect, it } from "vitest";
import { AVAILABLE_BOOKS, isActiveBook } from "../registry";

describe("isActiveBook", () => {
  it("accepts every activated book", () => {
    for (const book of AVAILABLE_BOOKS) expect(isActiveBook(book)).toBe(true);
  });

  it("rejects unknown, unactivated and malformed slugs", () => {
    for (const slug of [
      "",
      "nope",
      "romans",
      "galatians",
      "Genesis",
      " genesis",
      "genesis/",
      "1 peter",
      "__proto__",
      "constructor",
      "toString",
    ]) {
      expect(isActiveBook(slug)).toBe(false);
    }
  });
});
