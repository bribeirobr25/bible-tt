import { afterEach, describe, expect, it, vi } from "vitest";
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

// Step 2 (PLAN_SAFETY_NET.md WS3): word-start matching + negation handling.
// The full-corpus snapshot (6,350 resolved labels) was byte-identical before/after.
describe("labels — word-start matching (no infix / negated matches)", () => {
  const quiet = () => vi.spyOn(console, "warn").mockImplementation(() => {});
  afterEach(() => vi.restoreAllMocks());

  it("rejects infix matches that used to resolve silently", () => {
    const warn = quiet();
    expect(parseConfidence("UNVERIFIED")).toBe("POSSIBLE"); // fallback, not VERIFIED
    expect(parseConfidence("IMPROBABLE")).toBe("POSSIBLE"); // fallback, not PROBABLE
    expect(parseConfidence("IMPOSSIBLE")).toBe("POSSIBLE"); // fallback (warned)
    expect(warn).toHaveBeenCalledTimes(3);
  });

  it("skips a negated / weakened occurrence and keeps searching", () => {
    const warn = quiet();
    expect(parseConfidence("PROBABLE (NO VERIFICADO)")).toBe("PROBABLE");
    expect(parseConfidence("NICHT VERIFIZIERT; WAHRSCHEINLICH")).toBe(
      "PROBABLE",
    );
    expect(parseConfidence("NOT VERIFIED")).toBe("POSSIBLE"); // nothing valid left
    expect(parseConfidence("POCO PROBABLE")).toBe("POSSIBLE");
    expect(parseConfidence("POUCO PROVÁVEL")).toBe("POSSIBLE");
    expect(parseConfidence("KAUM WAHRSCHEINLICH")).toBe("POSSIBLE");
    expect(warn).toHaveBeenCalledTimes(4);
  });

  it("still accepts suffixed forms authored in content", () => {
    const warn = quiet();
    expect(parseClaimType("WISSENSCHAFTLICHER VERGLEICH")).toBe(
      "SCIENTIFIC COMPARISON",
    );
    expect(parseClaimType("MÖGLICHE SCHLUSSFOLGERUNG")).toBe(
      "POSSIBLE INFERENCE",
    );
    expect(parseClaimType("KOMPARATIVES PARALLEL")).toBe(
      "COMPARATIVE PARALLEL",
    );
    expect(parseClaimType("vergleichende Parallele")).toBe(
      "COMPARATIVE PARALLEL",
    );
    expect(parseConfidence("WAHRSCHEINLICH BIS UNSICHER")).toBe("PROBABLE"); // range → earlier bucket
    expect(warn).not.toHaveBeenCalled();
  });

  it("pins today's compound-label behaviour (policy decision routed to Step 4)", () => {
    // DUAL_LABEL splits on the FIRST dash: the second claim/confidence pair of a
    // compound label is not parsed. 306 such labels exist (2026-11-19).
    const r = parseDualLabel(
      "**[TEXTUAL — VERIFIED (for the three phrases); POSSIBLE INFERENCE — UNCERTAIN (for the reading)]**",
    );
    expect(r).toEqual({ claimType: "TEXTUAL", confidence: "VERIFIED" });
  });
});

// Implementation review (R2/R3): pin the matcher so its mutants die.
describe("labels — matcher semantics (mutation-pinned)", () => {
  const quiet = () => vi.spyOn(console, "warn").mockImplementation(() => {});
  afterEach(() => vi.restoreAllMocks());

  it("a negated occurrence is skipped and a LATER occurrence of the same alias still counts", () => {
    expect(parseConfidence("NOT VERIFIED BY X; VERIFIED BY Y")).toBe(
      "VERIFIED",
    );
  });
  it("an infix occurrence is skipped and a later word-start one still counts", () => {
    expect(parseConfidence("UNVERIFIED / VERIFIED")).toBe("VERIFIED");
  });
  it("word start is Unicode-aware (a preceding non-ASCII letter blocks the match)", () => {
    const warn = quiet();
    expect(parseConfidence("ÜVERIFIED")).toBe("POSSIBLE");
    expect(warn).toHaveBeenCalledTimes(1);
  });
  it("Portuguese NÃO negates (Unicode negator look-back)", () => {
    expect(parseConfidence("PROVÁVEL (NÃO VERIFICADO)")).toBe("PROBABLE");
  });
  it("negation needs a whitespace/hyphen gap; other punctuation separates clauses", () => {
    expect(parseConfidence("NO (VERIFIED)")).toBe("VERIFIED");
    const warn = quiet();
    expect(parseConfidence("NOT-VERIFIED")).toBe("POSSIBLE");
    expect(warn).toHaveBeenCalledTimes(1);
  });
  it("claim types are never negated (PT 'no' = 'in the')", () => {
    expect(parseClaimType("NO HISTÓRICO")).toBe("HISTORICAL / ARCHAEOLOGICAL");
  });
  it("known limit, pinned: one word of look-back ('NOT YET VERIFIED' → VERIFIED)", () => {
    expect(parseConfidence("NOT YET VERIFIED")).toBe("VERIFIED");
  });
  it("normalizes decomposed (NFD) input", () => {
    expect(parseConfidence("PROVÁVEL")).toBe("PROBABLE");
  });
});
