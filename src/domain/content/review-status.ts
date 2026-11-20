/**
 * Rule 28 review status, as authored in a file's `**Status:**` line in any of
 * the four locales ("provisional — pending reviewer sign-off (Rule 28)",
 * "provisório — …", "provisorisch — …", "provisorio — …", "vorläufig").
 * The UI prints the i18n term for the status (`status.<key>`), never the raw
 * word, so the pill and every badge agree in every locale (Decision D15:
 * provisional → reviewed → signed-off).
 */
export type ReviewStatus = "provisional" | "reviewed" | "signedOff";

// Order matters: "provisional — pending reviewer sign-off" mentions sign-off,
// so the provisional words are tested first.
const PROVISIONAL =
  /\b(?:provisional|provis[óo]rio|provisorisch|vorl[äa]ufig)\b/i;
const SIGNED_OFF =
  /\b(?:signed[- ]?off|aprovad[oa]|freigegeben|aprobad[oa])\b/i;
const REVIEWED = /\b(?:reviewed|revisad[oa]|gepr[üu]ft|begutachtet)\b/i;

/** The status word of a `**Status:**` value, or null when it names none. */
export function parseReviewStatus(
  raw: string | undefined,
): ReviewStatus | null {
  if (!raw) return null;
  // Only the status word before any "— explanation" / "(Rule 28)" decides.
  const head = raw.split(/\s[—–-]\s|\s\(/)[0];
  if (PROVISIONAL.test(head)) return "provisional";
  if (SIGNED_OFF.test(head)) return "signedOff";
  if (REVIEWED.test(head)) return "reviewed";
  return null;
}
