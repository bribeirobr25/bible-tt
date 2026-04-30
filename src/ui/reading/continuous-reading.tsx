import type { Paragraph } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";

export function ContinuousReading({ paragraphs }: { paragraphs: Paragraph[] }) {
  return (
    <article className="reading-text max-w-[680px] mx-auto space-y-6">
      {paragraphs.map((p, i) => (
        <p
          key={`p-${i}`}
          className="text-text-primary leading-[1.8]"
          dangerouslySetInnerHTML={{
            __html: renderMarkdownSafe(p.text, "prose"),
          }}
        />
      ))}
    </article>
  );
}
