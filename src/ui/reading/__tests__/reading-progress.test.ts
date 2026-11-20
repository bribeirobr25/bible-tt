/** B7 (launch fixes) — reading-progress placement + progress maths. */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  computeReadingProgress,
  READING_PROGRESS_CLASS,
} from "@/ui/reading/reading-progress";

const classes = READING_PROGRESS_CLASS.split(/\s+/);

describe("ReadingProgress placement (B7)", () => {
  const appBar = readFileSync(
    path.resolve(__dirname, "../../navigation/app-bar.tsx"),
    "utf8",
  );

  it("app bar is still the 64px fixed z-40 bar this placement assumes", () => {
    expect(appBar).toMatch(/fixed top-0 left-0 right-0 z-40 h-16/);
  });

  it("sits at the app bar's bottom edge on the app bar's layer", () => {
    expect(classes).toContain("top-16");
    expect(classes).toContain("z-40");
    expect(classes).not.toContain("top-12");
    expect(classes).not.toContain("z-30");
  });

  it("never intercepts pointer input and drops the transition under reduced motion", () => {
    expect(classes).toContain("pointer-events-none");
    expect(classes).toContain("motion-reduce:transition-none");
  });
});

describe("computeReadingProgress", () => {
  it("maps scroll position to 0–100", () => {
    expect(computeReadingProgress(0, 3000, 1000)).toBe(0);
    expect(computeReadingProgress(1000, 3000, 1000)).toBe(50);
    expect(computeReadingProgress(2000, 3000, 1000)).toBe(100);
  });
  it("clamps overscroll (e.g. iOS rubber-banding)", () => {
    expect(computeReadingProgress(2500, 3000, 1000)).toBe(100);
    expect(computeReadingProgress(-40, 3000, 1000)).toBe(0);
  });
  it("returns null when the page cannot scroll", () => {
    expect(computeReadingProgress(0, 800, 1000)).toBeNull();
    expect(computeReadingProgress(0, 1000, 1000)).toBeNull();
  });
});
