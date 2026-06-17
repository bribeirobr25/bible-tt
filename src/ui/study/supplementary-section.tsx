import type { SupplementarySection } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";

/**
 * Notes "supplementary patterns" disclosures. Part of the page-wide `notes-acc`
 * accordion (only one open at a time); `firstOpen` opens the first item when no
 * earlier disclosure on the page claimed the open slot.
 */
export function SupplementaryPanel({
  sections,
  firstOpen = false,
}: {
  sections: SupplementarySection[];
  firstOpen?: boolean;
}) {
  if (sections.length === 0) return null;

  return (
    <div className="space-y-0 mt-2">
      {sections.map((section, i) => (
        <details
          key={`s-${i}`}
          id={`supp-${i}`}
          name="notes-acc"
          className="tt-details scroll-mt-24"
          open={firstOpen && i === 0}
        >
          <summary>
            <span>{section.title}</span>
            <span className="chev" aria-hidden="true">
              ›
            </span>
          </summary>
          <div
            className="body [&_em]:italic"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownSafe(section.content, "note"),
            }}
          />
        </details>
      ))}
    </div>
  );
}
