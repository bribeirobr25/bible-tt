import type { SupplementarySection } from "@/domain/content/types";

export function SupplementaryPanel({ sections }: { sections: SupplementarySection[] }) {
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
              __html: section.content
                .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                .replace(/\*([^*]+)\*/g, "<em>$1</em>")
                .replace(/\n- /g, "<br/>• ")
                .replace(/\n/g, "<br/>"),
            }}
          />
        </details>
      ))}
    </div>
  );
}
