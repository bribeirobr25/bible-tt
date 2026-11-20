import { useLocale } from "next-intl";
import type { Note, NoteType } from "@/domain/content/types";
import {
  renderInlineSafe,
  renderMarkdownSafe,
} from "@/ui/shared/render-markdown-safe";

// Uniform cream surface + colored left border / label / dot per note type
// (prototype `.note`); no icon.
/** Single source of truth for the note-type → accent-color token (shared with
 *  the notes-view legend so the two can't drift). */
export const NOTE_TYPE_TOKENS: Record<NoteType, string> = {
  CRITICAL: "var(--color-note-critical)",
  LEXICAL: "var(--color-note-lexical)",
  GRAMMATICAL: "var(--color-note-grammatical)",
  THEOLOGICAL: "var(--color-note-theological)",
};

const TYPE: Record<NoteType, { cls: string; dot: string }> = {
  CRITICAL: { cls: "critical", dot: NOTE_TYPE_TOKENS.CRITICAL },
  LEXICAL: { cls: "lexical", dot: NOTE_TYPE_TOKENS.LEXICAL },
  GRAMMATICAL: { cls: "grammatical", dot: NOTE_TYPE_TOKENS.GRAMMATICAL },
  THEOLOGICAL: { cls: "theological", dot: NOTE_TYPE_TOKENS.THEOLOGICAL },
};

export function NoteBlock({ note }: { note: Note }) {
  const ty = TYPE[note.type];
  const locale = useLocale();

  return (
    <div className={`tt-note ${ty.cls}`}>
      <div className="nlab">
        <span
          className="dot"
          style={{ background: ty.dot }}
          aria-hidden="true"
        />
        {/* Titles carry inline italics (`— *PLĒTHYNTHEIĒ*`); rendered without a
            locale so a "(Rule N)" in a title never becomes a link. */}
        <span
          dangerouslySetInnerHTML={{ __html: renderInlineSafe(note.title) }}
        />
      </div>
      <div
        className="ntext [&_em]:italic"
        dangerouslySetInnerHTML={{
          __html: renderMarkdownSafe(note.content, "note", { locale }),
        }}
      />
    </div>
  );
}
