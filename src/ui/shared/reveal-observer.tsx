"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Arms the Light & Darkness scroll-reveal system.
 *
 * Adds `html.tt-js` only when JS + IntersectionObserver are available (so `.reveal`
 * content is fully visible without JS), then fades `.reveal` elements in on scroll.
 * Honors `prefers-reduced-motion` (no hidden state). Re-arms on client navigation so
 * route changes pick up the new page's `.reveal` elements.
 */
export function RevealObserver() {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-arm reveals on client navigation
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.in)");
    if (els.length === 0) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => {
        el.classList.add("in");
      });
      return;
    }

    document.documentElement.classList.add("tt-js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => {
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
