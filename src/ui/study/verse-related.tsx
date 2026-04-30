"use client";

import { useTranslations } from "next-intl";

export interface VerseRelatedLink {
  label: string;
  target: string;
  type: "glossary" | "companion" | "prophecy";
}

export function VerseRelated({ links }: { links: VerseRelatedLink[] }) {
  const t = useTranslations();

  if (links.length === 0) return null;

  return (
    <div className="ml-10 mt-2 flex flex-wrap gap-2 items-center">
      <span className="text-xs text-text-muted">{t("study.seeAlso")}:</span>
      {links.map((link, i) => (
        <a
          key={`rel-${i}`}
          href={link.target}
          className="text-xs text-accent hover:text-accent/80 underline underline-offset-2 decoration-accent/30 hover:decoration-accent/60 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
