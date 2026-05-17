import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseBookContextMarkdown } from "../book-context-parser";

describe("book-context-parser — real content", () => {
  it("parses Genesis EN motifs with chapters populated", () => {
    const raw = readFileSync(
      join(process.cwd(), "content/en/genesis/CONTEXT.md"),
      "utf8",
    );
    const data = parseBookContextMarkdown(raw, "genesis", "en");
    expect(data.motifs.length).toBeGreaterThan(0);
    for (const m of data.motifs) {
      expect(
        m.chapters.length,
        `motif "${m.title}" has empty chapters`,
      ).toBeGreaterThan(0);
    }
  });
});
