import type { Note, NoteType } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";
import { AlertCircle, BookOpen, Code2, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NOTE_STYLES: Record<NoteType, { border: string; bg: string; Icon: LucideIcon }> = {
  CRITICAL: { border: "border-l-note-critical", bg: "bg-note-critical-bg", Icon: AlertCircle },
  LEXICAL: { border: "border-l-note-lexical", bg: "bg-note-lexical-bg", Icon: BookOpen },
  GRAMMATICAL: { border: "border-l-note-grammatical", bg: "bg-note-grammatical-bg", Icon: Code2 },
  THEOLOGICAL: { border: "border-l-note-theological", bg: "bg-note-theological-bg", Icon: Lightbulb },
};

export function NoteBlock({ note }: { note: Note }) {
  const style = NOTE_STYLES[note.type];
  const { Icon } = style;

  return (
    <div className={`border-l-3 ${style.border} ${style.bg} rounded-r-md px-4 py-3`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 opacity-70" strokeWidth={1.5} />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {note.title}
        </span>
      </div>
      <div
        className="text-sm leading-relaxed text-text-primary"
        dangerouslySetInnerHTML={{
          __html: renderMarkdownSafe(note.content, "note"),
        }}
      />
    </div>
  );
}
