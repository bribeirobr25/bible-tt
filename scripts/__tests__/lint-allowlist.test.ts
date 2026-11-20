import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Launch Program Step 3 (PLAN_CONTENT_SWEEP.md §7; Step 2 review I24).
 * `scripts/lint-allowlist.txt` suppresses specific content-lint matches by
 * EXACT line text (`RULE_ID|FILE|EXACT_TEXT`, compared by
 * `filter_allowlist` in scripts/content-lint.sh). When the content line is
 * edited the entry silently stops matching — 22 such stale §0.8 entries had
 * accumulated. Every entry must name a rule the lint defines, an existing
 * file, and text that is still a whole line of that file.
 */

const ROOT = process.cwd();
const lint = readFileSync(path.join(ROOT, "scripts/content-lint.sh"), "utf-8");
const entries = readFileSync(
  path.join(ROOT, "scripts/lint-allowlist.txt"),
  "utf-8",
)
  .split("\n")
  .map((line, i) => ({ line, n: i + 1 }))
  .filter(({ line }) => line.trim() !== "" && !line.startsWith("#"));

describe("content-lint allow-list", () => {
  it("has entries to check (guards against a vacuous run)", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it("every entry is well-formed, names a known rule and an existing file, and still matches a whole line", () => {
    const bad: string[] = [];
    for (const { line, n } of entries) {
      const first = line.indexOf("|");
      const second = line.indexOf("|", first + 1);
      if (first < 1 || second < 0) {
        bad.push(`L${n}: malformed (want RULE_ID|FILE|EXACT_TEXT)`);
        continue;
      }
      const rule = line.slice(0, first);
      const file = line.slice(first + 1, second);
      const text = line.slice(second + 1);
      if (!lint.includes(`"${rule}"`))
        bad.push(`L${n}: rule "${rule}" is not defined in content-lint.sh`);
      const abs = path.join(ROOT, file);
      if (!existsSync(abs)) {
        bad.push(`L${n}: ${file} does not exist`);
        continue;
      }
      if (!readFileSync(abs, "utf-8").split("\n").includes(text))
        bad.push(
          `L${n}: stale — no line of ${file} equals the allow-listed text`,
        );
    }
    expect(bad).toEqual([]);
  });
});
