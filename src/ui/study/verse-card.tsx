import type { Verse } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";
import { CopyVerseLink } from "./copy-verse-link";
import { NoteBlock } from "./note-block";

/**
 * Notes-door verse card (prototype `.verse`): verse number + serif text + a
 * "Link" pill, with the note blocks shown directly beneath (always visible).
 */
export function VerseCard({ verse }: { verse: Verse }) {
  return (
    <section id={`v${verse.number}`} className="tt-verse verse-anchor">
      <div className="vhead">
        <span className="vnum">{verse.number}</span>
        <p
          className="vtext flex-1"
          dangerouslySetInnerHTML={{
            __html: renderMarkdownSafe(verse.mainText, "prose"),
          }}
        />
        <CopyVerseLink verseNumber={verse.number} />
      </div>

      {verse.notes.length > 0 && (
        <div className="tt-notes">
          {verse.notes.map((note, i) => (
            <NoteBlock key={`n-${verse.number}-${i}`} note={note} />
          ))}
        </div>
      )}
    </section>
  );
}
