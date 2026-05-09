import type { SupplementarySection } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";

export function SupplementaryPanel({
  sections,
}: {
  sections: SupplementarySection[];
}) {
  if (sections.length === 0) return null;

  return (
    <div className="space-y-4 mt-8">
      {sections.map((section, i) => (
        <details key={`s-${i}`} className="border border-border rounded-lg">
          <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-text-secondary hover:text-accent transition-colors duration-150 select-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg">
            {section.title}
          </summary>
          <div
            className="px-4 pb-4 text-sm leading-relaxed text-text-primary"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownSafe(section.content, "note"),
            }}
          />
        </details>
      ))}
    </div>
  );
}
