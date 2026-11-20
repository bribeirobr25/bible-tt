"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

/** Class that mirrors the `.verse-anchor:target` highlight (see globals.css). */
export const VERSE_COPIED_CLASS = "verse-anchor--copied";
const COPIED_MS = 1500;
const HIGHLIGHT_MS = 2000;

/**
 * B10 — `history.replaceState` changes the hash without scrolling, but it also
 * does not update `:target`, so the deep-link highlight never fired. Flash the
 * same highlight via a class instead. Returns a cancel function that clears the
 * timer and removes the class (used on re-click and on unmount).
 */
export function flashVerseHighlight(
  el: Pick<Element, "classList"> | null,
  durationMs: number = HIGHLIGHT_MS,
): () => void {
  if (!el) return () => {};
  el.classList.add(VERSE_COPIED_CLASS);
  const timer = setTimeout(() => {
    el.classList.remove(VERSE_COPIED_CLASS);
  }, durationMs);
  return () => {
    clearTimeout(timer);
    el.classList.remove(VERSE_COPIED_CLASS);
  };
}

/**
 * Phase 3 (P3-Q4) — copy a stable deep link to a verse (`…#v{n}`). A bordered
 * "Link" pill (prototype `.copy`): sets the URL hash without a scroll jump,
 * highlights the verse, copies the absolute URL, and flips to "Copied" briefly.
 */
export function CopyVerseLink({ verseNumber }: { verseNumber: number }) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelHighlight = useRef<(() => void) | null>(null);
  const mounted = useRef(false);

  // Unmount (e.g. door/chapter navigation): no late setState, no stray class.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      cancelHighlight.current?.();
    };
  }, []);

  const handleClick = () => {
    const anchor = `#v${verseNumber}`;
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}${anchor}`;
      window.history.replaceState(null, "", anchor);
      cancelHighlight.current?.();
      cancelHighlight.current = flashVerseHighlight(
        document.getElementById(`v${verseNumber}`),
      );
      navigator.clipboard
        ?.writeText(url)
        .then(() => {
          if (!mounted.current) return; // resolved after unmount
          setCopied(true);
          if (copiedTimer.current) clearTimeout(copiedTimer.current);
          copiedTimer.current = setTimeout(() => setCopied(false), COPIED_MS);
        })
        .catch(() => {});
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="copy focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      aria-label={
        copied ? t("nav.linkCopied") : `${t("nav.copyLink")} — ${verseNumber}`
      }
    >
      {copied ? t("chapter.copied") : t("chapter.link")}
    </button>
  );
}
