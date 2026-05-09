/**
 * Genesis narrative watersheds in Anno Mundi (year-from-creation) per the
 * Masoretic Text's own arithmetic. Used by the people-page period-grouping
 * algorithm — see `src/app/[locale]/[book]/people/page.tsx`.
 *
 * The order matters: walked first-to-last, the first watershed that falls
 * between two consecutive entries is the one rendered. Phase 1F's algorithm
 * checks watersheds before gap-based dividers, so a watershed always wins.
 */

export interface GenesisWatershed {
  id: "flood" | "babel" | "avram-call";
  amYear: number;
  /** i18n key suffix; full key = `people.watershed.${id}` (defaulting to EN below). */
  defaultLabelEn: string;
}

export const AM_FLOOD = 1656;
export const AM_BABEL = 1996;
export const AM_AVRAM_CALL = 2021;

export const GENESIS_WATERSHEDS: ReadonlyArray<GenesisWatershed> = [
  { id: "flood", amYear: AM_FLOOD, defaultLabelEn: "The Flood" },
  { id: "babel", amYear: AM_BABEL, defaultLabelEn: "Babel" },
  { id: "avram-call", amYear: AM_AVRAM_CALL, defaultLabelEn: "Avram's call" },
];

/**
 * Gap (in years) above which a generic divider is inserted between two
 * consecutive entries — only used when no watershed falls in the gap.
 * Watershed always takes precedence.
 */
export const GENESIS_GAP_THRESHOLD_YEARS = 200;
