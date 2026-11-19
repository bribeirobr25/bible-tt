import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { locales } from "../config";

/**
 * Step 2 (PLAN_SAFETY_NET.md WS4.4) — UI-string parity. CONTRIBUTING's
 * definition of done requires every UI string in all four locales; until now
 * only `book.*` was checked. Same key set and same {placeholder} set per key.
 */
type Msg = { [k: string]: string | Msg };
const load = (l: string): Msg =>
  JSON.parse(
    readFileSync(
      path.join(process.cwd(), "src/infrastructure/i18n/messages", `${l}.json`),
      "utf-8",
    ),
  );
function flatten(m: Msg, prefix = "", out: Record<string, string> = {}) {
  for (const [k, v] of Object.entries(m)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else flatten(v, key, out);
  }
  return out;
}
const placeholders = (s: string) =>
  [...s.matchAll(/\{(\w+)[^}]*\}/g)].map((m) => m[1]).sort();

describe("i18n message parity", () => {
  const flat = Object.fromEntries(locales.map((l) => [l, flatten(load(l))]));
  const enKeys = Object.keys(flat.en).sort();

  it("EN has messages (guards against a vacuous run)", () => {
    expect(enKeys.length).toBeGreaterThan(100);
  });

  it("every locale has exactly EN's key set", () => {
    for (const l of locales)
      expect(Object.keys(flat[l]).sort(), l).toEqual(enKeys);
  });

  it("every key has the same {placeholders} in every locale", () => {
    const bad: string[] = [];
    for (const k of enKeys)
      for (const l of locales)
        if (
          placeholders(flat[l][k] ?? "").join() !==
          placeholders(flat.en[k]).join()
        )
          bad.push(`${l}: ${k}`);
    expect(bad).toEqual([]);
  });

  it("no message is empty", () => {
    const empty = locales.flatMap((l) =>
      Object.entries(flat[l])
        .filter(([, v]) => v.trim() === "")
        .map(([k]) => `${l}: ${k}`),
    );
    expect(empty).toEqual([]);
  });
});
