"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Phase 3 (P3-Q4) — copy a stable deep link to a verse (`…#v{n}`). A bordered
 * "Link" pill (prototype `.copy`): sets the URL hash so the `:target` highlight
 * fires, copies the absolute URL, and flips to "Copied" briefly.
 */
export function CopyVerseLink({ verseNumber }: { verseNumber: number }) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    const anchor = `#v${verseNumber}`;
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}${anchor}`;
      window.history.replaceState(null, "", anchor);
      navigator.clipboard
        ?.writeText(url)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
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
