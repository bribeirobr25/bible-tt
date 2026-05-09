import type { ConfidenceLevel } from "@/domain/content/types";

const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  VERIFIED: "bg-note-lexical",
  PROBABLE: "bg-note-lexical/70",
  POSSIBLE: "bg-note-theological",
  UNCERTAIN: "bg-note-critical/70",
  SPECULATIVE: "bg-note-critical",
  DOCUMENTED: "bg-note-grammatical",
};

export function ConfidenceIndicator({
  level,
  label,
}: {
  level: ConfidenceLevel;
  label?: string;
}) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ${CONFIDENCE_COLORS[level] || CONFIDENCE_COLORS.POSSIBLE} shrink-0 mt-2.5`}
      title={label || level.toLowerCase()}
      aria-hidden="true"
    />
  );
}
