import type { Paragraph } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";

const SUP: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

// Color inline superscript verse numbers (e.g. ²⁶) like the prototype's sup.vn.
function withVerseNumbers(html: string): string {
  return html.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (run) => {
    const n = [...run].map((c) => SUP[c] ?? "").join("");
    return `<sup class="verse-num">${n}</sup>`;
  });
}

export function ContinuousReading({ paragraphs }: { paragraphs: Paragraph[] }) {
  return (
    <article className="reading-text max-w-[42rem] mx-auto space-y-6">
      {paragraphs.map((p, i) => (
        <p
          key={`p-${i}`}
          className="leading-[1.85]"
          dangerouslySetInnerHTML={{
            __html: withVerseNumbers(renderMarkdownSafe(p.text, "prose")),
          }}
        />
      ))}
    </article>
  );
}
