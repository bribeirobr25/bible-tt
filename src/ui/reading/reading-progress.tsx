"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const t = useTranslations();

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-12 left-0 h-0.5 bg-accent z-30 transition-[width] duration-100"
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
