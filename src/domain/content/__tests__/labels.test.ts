import { describe, expect, it } from "vitest";
import {
  CLAIM_TYPES,
  CONFIDENCE_LEVELS,
  parseClaimType,
  parseConfidence,
  parseDualLabel,
} from "../labels";
import type { ClaimType, ConfidenceLevel } from "../types";

describe("labels — parseConfidence", () => {
  it("resolves EN/PT/DE/ES + ASCII-German aliases", () => {
    const cases: Array<[string, ConfidenceLevel]> = [
      ["VERIFIED", "VERIFIED"],
      ["VERIFICADO", "VERIFIED"],
      ["VERIFIZIERT", "VERIFIED"],
      ["PROBABLE", "PROBABLE"],
      ["PROVÁVEL", "PROBABLE"],
      ["PROVAVEL", "PROBABLE"],
      ["WAHRSCHEINLICH", "PROBABLE"],
      ["POSSIBLE", "POSSIBLE"],
      ["MÖGLICH", "POSSIBLE"],
      ["MOEGLICH", "POSSIBLE"],
      ["MOGLICH", "POSSIBLE"],
      ["POSSÍVEL", "POSSIBLE"],
      ["POSIBLE", "POSSIBLE"],
      ["UNCERTAIN", "UNCERTAIN"],
      ["UNGEWISS", "UNCERTAIN"],
      ["UNSICHER", "UNCERTAIN"],
      ["INCIERTO", "UNCERTAIN"],
      ["SPECULATIVE", "SPECULATIVE"],
      ["SPEKULATIV", "SPECULATIVE"],
      ["ESPECULATIVO", "SPECULATIVE"],
      ["DOCUMENTED", "DOCUMENTED"],
      ["DOKUMENTIERT", "DOCUMENTED"],
      ["DOCUMENTADO", "DOCUMENTED"],
    ];
    for (const [raw, want] of cases) expect(parseConfidence(raw)).toBe(want);
  });

  it("defaults to POSSIBLE for unrecognized input", () => {
    expect(parseConfidence("garble")).toBe("POSSIBLE");
  });

  it("order lock: range labels resolve to PROBABLE (PROBABLE before UNCERTAIN)", () => {
    expect(parseConfidence("PROBABLE THROUGH UNCERTAIN")).toBe("PROBABLE");
    expect(parseConfidence("WAHRSCHEINLICH BIS UNSICHER")).toBe("PROBABLE");
    expect(parseConfidence("PROVÁVEL A INCERTO")).toBe("PROBABLE");
    expect(parseConfidence("PROBABLE A INCIERTO")).toBe("PROBABLE");
  });

  it("Finding 1 guard: a DOCUMENTED-only people-style value is stable", () => {
    // people's former default was UNCERTAIN; canonical is POSSIBLE. The only people
    // input is "DOCUMENTED" (recognized), so the default change is unreachable.
    expect(parseConfidence("DOCUMENTED")).toBe("DOCUMENTED");
  });
});

describe("labels — parseClaimType", () => {
  it("resolves aliases incl. the formerly book-context-missing ones", () => {
    const cases: Array<[string, ClaimType]> = [
      ["TEXTUAL", "TEXTUAL"],
      ["TEXTUELL", "TEXTUAL"],
      ["STRONG INFERENCE", "STRONG INFERENCE"],
      ["INFERÊNCIA FORTE", "STRONG INFERENCE"],
      ["POSSIBLE INFERENCE", "POSSIBLE INFERENCE"],
      ["MOGLICHE SCHLUSSFOLGERUNG", "POSSIBLE INFERENCE"],
      ["COMPARATIVE PARALLEL", "COMPARATIVE PARALLEL"],
      ["KOMPARATIV", "COMPARATIVE PARALLEL"],
      ["LATER RECEPTION", "LATER RECEPTION"],
      ["SPATERE REZEPTION", "LATER RECEPTION"],
      ["HISTORICAL / ARCHAEOLOGICAL", "HISTORICAL / ARCHAEOLOGICAL"],
      ["ARCHAOLOGISCH", "HISTORICAL / ARCHAEOLOGICAL"],
      ["ARQUEOLÓGICO", "HISTORICAL / ARCHAEOLOGICAL"],
      ["SCIENTIFIC COMPARISON", "SCIENTIFIC COMPARISON"],
      ["CIENTÍFICO", "SCIENTIFIC COMPARISON"],
      ["SPECULATION", "SPECULATION"],
      ["SPECULATIVE", "SPECULATION"],
    ];
    for (const [raw, want] of cases) expect(parseClaimType(raw)).toBe(want);
  });

  it("defaults to TEXTUAL for unrecognized input", () => {
    expect(parseClaimType("garble")).toBe("TEXTUAL");
  });
});

describe("labels — arrays cover the unions", () => {
  it("CLAIM_TYPES / CONFIDENCE_LEVELS have the full member counts", () => {
    expect(CLAIM_TYPES).toHaveLength(8);
    expect(CONFIDENCE_LEVELS).toHaveLength(6);
    expect(new Set(CLAIM_TYPES).size).toBe(CLAIM_TYPES.length);
    expect(new Set(CONFIDENCE_LEVELS).size).toBe(CONFIDENCE_LEVELS.length);
  });
});

describe("labels — parseDualLabel (Finding 3)", () => {
  it("parses em-dash, en-dash, and double-hyphen variants", () => {
    expect(parseDualLabel("**[TEXTUAL — VERIFIED]**")).toEqual({
      claimType: "TEXTUAL",
      confidence: "VERIFIED",
    });
    expect(parseDualLabel("**[TEXTUAL – VERIFIED]**")).toEqual({
      claimType: "TEXTUAL",
      confidence: "VERIFIED",
    });
    expect(parseDualLabel("**[TEXTUAL -- VERIFIED]**")).toEqual({
      claimType: "TEXTUAL",
      confidence: "VERIFIED",
    });
  });

  it("returns null for non-dual-label lines (extraction is own-line only)", () => {
    expect(
      parseDualLabel("Some prose with a stray [x — y] tag inline."),
    ).toBeNull();
    expect(parseDualLabel("**bold but not a label**")).toBeNull();
  });
});
