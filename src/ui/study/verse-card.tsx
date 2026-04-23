import type { Verse } from "@/domain/content/types";
import { NoteBlock } from "./note-block";
import { ChevronRight } from "lucide-react";

export function VerseCard({ verse }: { verse: Verse }) {
  return (
    <section
      id={`verse-${verse.number}`}
      className="scroll-mt-24 border-b border-border-muted pb-6 mb-6 last:border-0"
    >
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-[family-name:var(--font-ui)] text-sm font-bold text-text-muted min-w-[2rem] tabular-nums">
          {verse.number}
        </span>
        <p
          className="font-[family-name:var(--font-reading)] text-lg leading-[1.7] text-text-primary flex-1"
          dangerouslySetInnerHTML={{
            __html: verse.mainText
              .replace(/\*([^*]+)\*/g, "<em class='text-text-secondary'>$1</em>")
              .replace(/\n/g, " "),
          }}
        />
      </div>

      {verse.notes.length > 0 && (
        <details className="ml-10 mt-3 group">
          <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-accent transition-colors duration-150 select-none list-none flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded min-h-11 -ml-2 pl-2">
            <ChevronRight
              className="w-3.5 h-3.5 transition-transform duration-200 group-open:rotate-90"
              strokeWidth={2}
            />
            Notes ({verse.notes.length})
          </summary>
          <div className="mt-3 space-y-3">
            {verse.notes.map((note, i) => (
              <NoteBlock key={`n-${verse.number}-${i}`} note={note} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
