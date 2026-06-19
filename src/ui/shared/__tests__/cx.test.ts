import { describe, expect, it } from "vitest";
import { cx } from "../cx";

describe("cx", () => {
  it("returns the base alone with no trailing space (the Disclosure className gotcha)", () => {
    expect(cx("tt-details")).toBe("tt-details");
    expect(cx("tt-details", undefined)).toBe("tt-details");
    expect(cx("tt-details", "")).toBe("tt-details");
    expect(cx("tt-details", false)).toBe("tt-details");
    expect(cx("body", null)).toBe("body");
  });

  it("appends a single space when an extra is present", () => {
    expect(cx("tt-details", "max-w-[46rem] mx-auto")).toBe(
      "tt-details max-w-[46rem] mx-auto",
    );
    expect(cx("body", "prose text-text-primary")).toBe(
      "body prose text-text-primary",
    );
  });
});
