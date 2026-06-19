import type { SupplementarySection } from "@/domain/content/types";
import { Disclosure } from "@/ui/shared/disclosure";
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
        <Disclosure
          key={`s-${i}`}
          id={`supp-${i}`}
          name="notes-acc"
          className="scroll-mt-24"
          open={firstOpen && i === 0}
          summary={<span>{section.title}</span>}
        >
          <div
            className="body [&_em]:italic"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownSafe(section.content, "note"),
            }}
          />
        </Disclosure>
      ))}
    </div>
  );
}
