import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

/**
 * The shared `.tt-disclaimer` block (book-introduction / enrichment / background
 * intros). Renders the given text via `renderInlineSafe`, encapsulating the one
 * `dangerouslySetInnerHTML` pattern. Callers keep their own `{x && …}` guard or
 * fallback — this always renders the div from the text it is given.
 */
export function Disclaimer({ text }: { text: string }) {
  return (
    <div
      className="tt-disclaimer"
      dangerouslySetInnerHTML={{ __html: renderInlineSafe(text) }}
    />
  );
}
