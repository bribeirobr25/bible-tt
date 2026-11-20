import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseReviewStatus } from "../review-status";

describe("parseReviewStatus", () => {
  it("classifies the authored status words in all four locales", () => {
    expect(
      parseReviewStatus("provisional — pending reviewer sign-off (Rule 28)"),
    ).toBe("provisional");
    expect(parseReviewStatus("provisório — aguardando aprovação")).toBe(
      "provisional",
    );
    expect(parseReviewStatus("provisorisch — Prüfer-Freigabe ausstehend")).toBe(
      "provisional",
    );
    expect(parseReviewStatus("vorläufig")).toBe("provisional");
    expect(parseReviewStatus("provisorio (Regla 28)")).toBe("provisional");
    expect(parseReviewStatus("reviewed")).toBe("reviewed");
    expect(parseReviewStatus("Geprüft")).toBe("reviewed");
    expect(parseReviewStatus("signed off")).toBe("signedOff");
    expect(parseReviewStatus("aprobado")).toBe("signedOff");
    expect(parseReviewStatus("draft")).toBeNull();
    expect(parseReviewStatus(undefined)).toBeNull();
  });

  it("every authored **Status:** line in the corpus classifies", () => {
    const root = path.join(process.cwd(), "content");
    const bad: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".md")) {
          const m = fs
            .readFileSync(p, "utf8")
            .match(/^\*\*Status:\*\*\s*(.+)$/m);
          if (m && parseReviewStatus(m[1]) === null)
            bad.push(`${path.relative(root, p)}: ${m[1]}`);
        }
      }
    };
    walk(root);
    expect(bad).toEqual([]);
  });
});
