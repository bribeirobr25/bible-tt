import type { GlossaryEntry } from "@/domain/content/types";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

/**
 * Strips bold/italic and the TT highlight markers ({t:…}, {a:…}, @@…@@) to
 * plain text — for `notes`, which doubles as the `title=` tooltip (no HTML
 * allowed) and is char-sliced, so markup can't be injected as HTML there.
 */
function stripEmphasis(s: string): string {
  return s
    .replace(/\{[ta]:([^}]*)\}/g, "$1")
    .replace(/@@([\s\S]*?)@@/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
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
            className="flex flex-wrap items-start gap-x-3 gap-y-1 text-sm py-1.5 border-b border-border-muted last:border-0 sm:flex-nowrap"
          >
            <span
              className="source-word font-semibold text-text-primary min-w-[4rem] [overflow-wrap:anywhere] sm:text-right"
              dangerouslySetInnerHTML={{
                __html: renderInlineSafe(entry.sourceWord),
              }}
            />
            <span
              className="min-w-0 flex-1 text-text-primary [overflow-wrap:anywhere]"
              dangerouslySetInnerHTML={{
                __html: renderInlineSafe(entry.translation),
              }}
            />
            {notesPlain && (
              <span
                title={notesPlain}
                className="basis-full text-text-muted text-xs sm:ml-auto sm:basis-auto sm:shrink-0 sm:max-w-[10rem] sm:text-right"
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
