import type { Note, NoteType } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";

// Uniform cream surface + colored left border / label / dot per note type
// (prototype `.note`); no icon.
const TYPE: Record<NoteType, { cls: string; dot: string }> = {
  CRITICAL: { cls: "critical", dot: "var(--color-note-critical)" },
  LEXICAL: { cls: "lexical", dot: "var(--color-note-lexical)" },
  GRAMMATICAL: { cls: "grammatical", dot: "var(--color-note-grammatical)" },
  THEOLOGICAL: { cls: "theological", dot: "var(--color-note-theological)" },
};

export function NoteBlock({ note }: { note: Note }) {
  const ty = TYPE[note.type];

  return (
    <div className={`tt-note ${ty.cls}`}>
      <div className="nlab">
        <span
          className="dot"
          style={{ background: ty.dot }}
          aria-hidden="true"
        />
        {note.title}
      </div>
      <div
        className="ntext [&_em]:italic"
        dangerouslySetInnerHTML={{
          __html: renderMarkdownSafe(note.content, "note"),
        }}
      />
    </div>
  );
}
