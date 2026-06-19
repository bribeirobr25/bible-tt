import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CLAIM_TYPES, CONFIDENCE_LEVELS } from "@/domain/content/labels";
import {
  CLAIM_TYPE_KEYS,
  CONFIDENCE_KEYS,
  CONFIDENCE_TONE,
} from "@/ui/shared/confidence-tone";

const LOCALES = ["en", "pt-br", "de", "es"] as const;

function resolve(obj: unknown, dotted: string): unknown {
  return dotted.split(".").reduce<unknown>((acc, k) => {
    if (acc && typeof acc === "object")
      return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

describe("confidence-tone SSOT", () => {
  it("CONFIDENCE_TONE + CONFIDENCE_KEYS cover every ConfidenceLevel", () => {
    for (const level of CONFIDENCE_LEVELS) {
      expect(CONFIDENCE_TONE[level], `tone for ${level}`).toBeTruthy();
      expect(CONFIDENCE_KEYS[level], `key for ${level}`).toBeTruthy();
    }
  });

  it("CLAIM_TYPE_KEYS covers every ClaimType", () => {
    for (const ct of CLAIM_TYPES) {
      expect(CLAIM_TYPE_KEYS[ct], `key for ${ct}`).toBeTruthy();
    }
  });

  // The Step-4 guard: CuriositiesBlock now renders <ClaimBadge>, which translates
  // claim/confidence via these keys. No PEOPLE.md has curiosity content today, so
  // this proves the badge would render correctly (no missing-key output) for any
  // future curiosity entry — in all four locales.
  it("every claim/confidence i18n key resolves to a string in all 4 locales", () => {
    const keys = [
      ...Object.values(CLAIM_TYPE_KEYS),
      ...Object.values(CONFIDENCE_KEYS),
    ];
    for (const locale of LOCALES) {
      const messages = JSON.parse(
        readFileSync(
          path.join(
            process.cwd(),
            "src/infrastructure/i18n/messages",
            `${locale}.json`,
          ),
          "utf8",
        ),
      );
      for (const key of keys) {
        expect(typeof resolve(messages, key), `${locale}:${key}`).toBe(
          "string",
        );
      }
    }
  });
});
