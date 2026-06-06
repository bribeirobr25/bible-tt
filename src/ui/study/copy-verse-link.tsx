"use client";

import { Check, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Phase 3 (P3-Q4) — copy a stable deep link to a verse (`…#v{n}`). Sets the URL
 * hash so the CSS `:target` highlight fires, and copies the absolute URL.
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
      aria-label={
        copied ? t("nav.linkCopied") : `${t("nav.copyLink")} — ${verseNumber}`
      }
      className="opacity-0 group-hover/verse:opacity-100 focus-visible:opacity-100 inline-flex items-center justify-center w-6 h-6 rounded text-text-muted hover:text-accent transition-all duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
    >
      {copied ? (
        <Check size={13} strokeWidth={2} className="text-accent" />
      ) : (
        <Link2 size={13} strokeWidth={1.5} />
      )}
    </button>
  );
}
