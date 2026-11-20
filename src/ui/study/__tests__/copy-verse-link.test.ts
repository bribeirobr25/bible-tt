/** B10 (launch fixes) — copy-verse-link highlight class + timer cleanup. */
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  flashVerseHighlight,
  VERSE_COPIED_CLASS,
} from "@/ui/study/copy-verse-link";

function fakeEl() {
  const set = new Set<string>();
  return {
    classList: {
      add: (c: string) => set.add(c),
      remove: (c: string) => set.delete(c),
      contains: (c: string) => set.has(c),
    } as unknown as DOMTokenList,
    has: (c: string) => set.has(c),
  };
}

describe("flashVerseHighlight (B10)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("adds the highlight class and removes it after the duration", () => {
    const el = fakeEl();
    flashVerseHighlight(el, 2000);
    expect(el.has(VERSE_COPIED_CLASS)).toBe(true);
    vi.advanceTimersByTime(1999);
    expect(el.has(VERSE_COPIED_CLASS)).toBe(true);
    vi.advanceTimersByTime(1);
    expect(el.has(VERSE_COPIED_CLASS)).toBe(false);
  });

  it("cancel (unmount / re-click) clears the timer and the class", () => {
    const el = fakeEl();
    const cancel = flashVerseHighlight(el, 2000);
    expect(vi.getTimerCount()).toBe(1);
    cancel();
    expect(vi.getTimerCount()).toBe(0);
    expect(el.has(VERSE_COPIED_CLASS)).toBe(false);
  });

  it("is a no-op when the verse element is missing", () => {
    const cancel = flashVerseHighlight(null, 2000);
    expect(vi.getTimerCount()).toBe(0);
    expect(() => cancel()).not.toThrow();
  });
});

describe("highlight styling (B10)", () => {
  const css = readFileSync(
    path.resolve(__dirname, "../../../app/globals.css"),
    "utf8",
  );
  it("globals.css styles the class with the same tokens as :target", () => {
    const rule = (sel: string) => {
      const i = css.indexOf(`${sel} {`);
      expect(i).toBeGreaterThan(-1);
      return css.slice(i + sel.length + 2, css.indexOf("}", i)).trim();
    };
    expect(rule(`.verse-anchor.${VERSE_COPIED_CLASS}`)).toBe(
      rule(".verse-anchor:target"),
    );
  });
});
