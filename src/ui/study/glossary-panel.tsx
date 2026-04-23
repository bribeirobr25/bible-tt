import type { GlossaryEntry } from "@/domain/content/types";

export function GlossaryPanel({ entries }: { entries: GlossaryEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2 pt-1">
      {entries.map((entry, i) => (
        <div key={`g-${i}`} className="flex items-start gap-3 text-sm py-1.5 border-b border-border-muted last:border-0">
          <span className="hebrew font-semibold text-text-primary min-w-[4rem] text-right shrink-0">
            {entry.hebrew}
          </span>
          <span className="text-text-primary">{entry.translation}</span>
          {entry.notes && (
            <span className="text-text-muted text-xs ml-auto shrink-0 max-w-[10rem] text-right">
              {entry.notes.slice(0, 60)}{entry.notes.length > 60 ? "…" : ""}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
