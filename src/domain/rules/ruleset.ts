/**
 * The translation ruleset's size (docs/rules/RULES-CORE.md — `#### **Rule N: …**`
 * headings, v3.4 = Rules 1–30). The rules page renders one card per number and
 * derives its headline count from this list; `rules-messages.test.ts` checks it
 * against RULES-CORE so a new rule cannot be added there without the page and
 * the `landing.ruleN*` messages following. Pure — no I/O.
 */
export const RULE_COUNT = 30;

export const ALL_RULE_NUMS: readonly number[] = Array.from(
  { length: RULE_COUNT },
  (_, i) => i + 1,
);
