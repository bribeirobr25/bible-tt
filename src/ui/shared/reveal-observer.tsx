"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Arms the Light & Darkness scroll-reveal system.
 *
 * Adds `html.tt-js` only when JS is available (so `.reveal` content is fully
 * visible without JS), then fades each `.reveal` element in once its top enters
 * the viewport. Uses a rAF-throttled scroll check (not IntersectionObserver) so
 * fast scrolls / anchor jumps can never leave content stuck hidden. Honors
 * `prefers-reduced-motion` (reveals immediately, no transition). Re-arms on
 * client navigation.
 */
export function RevealObserver() {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-arm reveals on client navigation
  useEffect(() => {
    let pending = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.in)"),
    );
    if (pending.length === 0) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      pending.forEach((el) => {
        el.classList.add("in");
      });
      return;
    }

    document.documentElement.classList.add("tt-js");

    let raf = 0;
    const check = () => {
      raf = 0;
      const line = window.innerHeight * 0.9;
      // at the very bottom, reveal everything remaining (bottom-most elements may
      // never cross the 0.9 line when the page can't scroll further).
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      pending = pending.filter((el) => {
        if (atBottom || el.getBoundingClientRect().top < line) {
          el.classList.add("in");
          return false;
        }
        return true;
      });
      if (pending.length === 0) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check(); // reveal whatever is already in view on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
