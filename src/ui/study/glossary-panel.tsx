import type { GlossaryEntry } from "@/domain/content/types";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

/**
 * Strips bold/italic markers to plain text — for `notes`, which doubles as the
 * `title=` tooltip (no HTML allowed) and is char-sliced, so markdown can't be
 * injected as HTML there.
 */
function stripEmphasis(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}

export function GlossaryPanel({ entries }: { entries: GlossaryEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2 pt-1">
      {entries.map((entry, i) => {
        const notesPlain = entry.notes ? stripEmphasis(entry.notes) : "";
        return (
          <div
            key={`g-${i}`}
            className="flex items-start gap-3 text-sm py-1.5 border-b border-border-muted last:border-0"
          >
            <span className="source-word font-semibold text-text-primary min-w-[4rem] text-right shrink-0">
              {entry.sourceWord}
            </span>
            <span
              className="text-text-primary"
              dangerouslySetInnerHTML={{
                __html: renderInlineSafe(entry.translation),
              }}
            />
            {notesPlain && (
              <span
                title={notesPlain}
                className="text-text-muted text-xs ml-auto shrink-0 max-w-[10rem] text-right"
              >
                {notesPlain.slice(0, 60)}
                {notesPlain.length > 60 ? "…" : ""}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
