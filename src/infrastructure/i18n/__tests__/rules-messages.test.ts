import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ALL_RULE_NUMS, RULE_COUNT } from "@/domain/rules/ruleset";
import { locales } from "../config";

/**
 * Launch fixes B1.4 — the rules page (`/{locale}/rules`) once named the wrong
 * rule for about half the numbers. These checks tie the page to the ruleset
 * source so it cannot drift again: the EN card name must equal the RULES-CORE
 * `#### **Rule N: Name**` heading, the page renders exactly the rules RULES-CORE
 * defines, and every locale carries a name + short line for each of them.
 */
type Msg = { [k: string]: string | Msg };
const load = (l: string): Msg =>
  JSON.parse(
    readFileSync(
      path.join(process.cwd(), "src/infrastructure/i18n/messages", `${l}.json`),
      "utf-8",
    ),
  );

const rulesCore = readFileSync(
  path.join(process.cwd(), "docs/rules/RULES-CORE.md"),
  "utf-8",
);
const headings = new Map<number, string>(
  [...rulesCore.matchAll(/^####\s+\*\*Rule\s+(\d+):\s*(.+?)\*\*\s*$/gm)].map(
    (m) => [
      Number(m[1]),
      m[2]
        .trim()
        .replace(/&amp;/g, "&")
        .replace(/&#39;|&apos;/g, "'"),
    ],
  ),
);

describe("rules page ↔ RULES-CORE", () => {
  it("RULES-CORE defines rules 1..RULE_COUNT, each heading once", () => {
    const nums = [...rulesCore.matchAll(/^####\s+\*\*Rule\s+(\d+):/gm)].map(
      (m) => Number(m[1]),
    );
    expect(nums).toEqual(Array.from({ length: RULE_COUNT }, (_, i) => i + 1));
  });

  it('the RULES-CORE section heading states the same count ("THE 30 RULES")', () => {
    const m = rulesCore.match(/^##\s+THE\s+(\d+)\s+RULES\s*$/m);
    expect(m, "## THE N RULES heading missing").not.toBeNull();
    expect(Number(m?.[1])).toBe(RULE_COUNT);
  });

  it("ALL_RULE_NUMS lists 1..30", () => {
    expect(ALL_RULE_NUMS).toHaveLength(30);
    expect(ALL_RULE_NUMS).toEqual([...headings.keys()].sort((a, b) => a - b));
  });

  it("EN landing.ruleNname equals the RULES-CORE heading name", () => {
    const landing = load("en").landing as Record<string, string>;
    const drift = ALL_RULE_NUMS.filter(
      (n) => landing[`rule${n}name`] !== headings.get(n),
    ).map(
      (n) => `Rule ${n}: "${landing[`rule${n}name`]}" ≠ "${headings.get(n)}"`,
    );
    expect(drift).toEqual([]);
  });

  it.each(
    locales,
  )("%s has ruleNname + ruleNshort for every rule and none beyond", (l) => {
    const landing = load(l).landing as Record<string, string>;
    for (const n of ALL_RULE_NUMS) {
      expect(landing[`rule${n}name`]?.trim(), `${l} rule${n}name`).toBeTruthy();
      expect(
        landing[`rule${n}short`]?.trim(),
        `${l} rule${n}short`,
      ).toBeTruthy();
    }
    const beyond = Object.keys(landing).filter((k) => {
      const m = k.match(/^rule(\d+)(name|short|example)$/);
      return m !== null && Number(m[1]) > RULE_COUNT;
    });
    expect(beyond).toEqual([]);
    expect(landing.rule31name).toBeUndefined();
    expect(landing.rule31short).toBeUndefined();
  });
});
