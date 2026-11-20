"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/**
 * Placement (B7): the app bar is `fixed top-0 z-40 h-16` with an opaque
 * background, so the bar sits at its bottom edge (`top-16`, 64px) on the same
 * `z-40` layer — later in the DOM, so it paints above the bar's border and is
 * never covered. It is a 2px non-focusable strip; `pointer-events-none` keeps
 * it from intercepting clicks on whatever lies beneath (e.g. the top edge of
 * the open mobile-menu panel). Reduced motion: no width transition.
 */
export const READING_PROGRESS_CLASS =
  "fixed top-16 left-0 h-0.5 bg-accent z-40 pointer-events-none transition-[width] duration-100 motion-reduce:transition-none";

/** Scroll position → percentage read (0–100), or null when the page cannot scroll. */
export function computeReadingProgress(
  scrollTop: number,
  scrollHeight: number,
  viewportHeight: number,
): number | null {
  const docHeight = scrollHeight - viewportHeight;
  if (docHeight <= 0) return null;
  return Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const t = useTranslations();

  useEffect(() => {
    function handleScroll() {
      const next = computeReadingProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
      if (next !== null) setProgress(next);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={READING_PROGRESS_CLASS}
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-hidden={progress === 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t("nav.readingProgress")}
    />
  );
}
