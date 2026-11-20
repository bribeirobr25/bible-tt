import { useTranslations } from "next-intl";
import { parseReviewStatus } from "@/domain/content/review-status";

/**
 * The Rule-28 status pill (chapter head, book hub, introduction, People,
 * Background). Prints the i18n term for the file's authored `**Status:**`
 * (Decision D15) so every badge agrees in every locale; a file without a status
 * line reads as provisional (the corpus default); an unrecognized status word
 * falls back to the authored word itself. The full authored value is in the
 * `title` tooltip and, for screen readers (a tooltip is not announced
 * reliably), in a visually hidden suffix.
 */
export function StatusPill({ status }: { status?: string }) {
  const t = useTranslations();
  const key = status ? parseReviewStatus(status) : "provisional";
  const label = key
    ? t(`status.${key}`)
    : (() => {
        const head = (status ?? "").split(/\s[—–-]\s|\s\(/)[0].trim();
        return head.charAt(0).toUpperCase() + head.slice(1);
      })();
  return (
    <span className="tt-status-pill" title={status}>
      <span className="dot" aria-hidden="true" />
      {label}
      {status && <span className="sr-only"> — {status}</span>}
    </span>
  );
}
