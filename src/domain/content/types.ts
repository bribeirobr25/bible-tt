export type NoteType = "CRITICAL" | "LEXICAL" | "GRAMMATICAL" | "THEOLOGICAL";

export interface Note {
  type: NoteType;
  title: string;
  content: string;
}

export interface Verse {
  number: number;
  mainText: string;
  notes: Note[];
}

export interface Paragraph {
  text: string;
}

export interface GlossaryEntry {
  sourceWord: string;
  translation: string;
  notes: string;
}

export interface ChapterMetadata {
  book: string;
  chapter: number;
  edition: string;
  language: string;
  baseText: string;
  status: string;
  methodology: string;
  divineNamePolicy: string;
}

export interface ChapterData {
  metadata: ChapterMetadata;
  overview: string | null;
  readingGuide: string | null;
  continuousReading: Paragraph[];
  verses: Verse[];
  glossary: GlossaryEntry[];
  supplementarySections: SupplementarySection[];
}

export interface SupplementarySection {
  title: string;
  content: string;
}

export type ClaimType =
  | "TEXTUAL"
  | "STRONG INFERENCE"
  | "POSSIBLE INFERENCE"
  | "COMPARATIVE PARALLEL"
  | "LATER RECEPTION"
  | "HISTORICAL / ARCHAEOLOGICAL"
  | "SCIENTIFIC COMPARISON"
  | "SPECULATION";

export type ConfidenceLevel =
  | "VERIFIED"
  | "PROBABLE"
  | "POSSIBLE"
  | "UNCERTAIN"
  | "SPECULATIVE"
  | "DOCUMENTED";

export const CONFIDENCE_SORT_ORDER: Record<ConfidenceLevel, number> = {
  VERIFIED: 0,
  DOCUMENTED: 1,
  PROBABLE: 2,
  POSSIBLE: 3,
  UNCERTAIN: 4,
  SPECULATIVE: 5,
};

export function sortByConfidence(
  entries: EnrichmentEntry[],
): EnrichmentEntry[] {
  return [...entries].sort(
    (a, b) =>
      (CONFIDENCE_SORT_ORDER[a.confidence] ?? 5) -
      (CONFIDENCE_SORT_ORDER[b.confidence] ?? 5),
  );
}

export interface EnrichmentEntry {
  title: string;
  claimType: ClaimType;
  confidence: ConfidenceLevel;
  content: string;
  source?: string;
  /**
   * Two-level §I "World at the Time" structure: a `### SCENARIO` group entry
   * carries its `#### IA-x` sub-dimensions here (each its own dual-labelled
   * card). Absent on ordinary single-level entries (sections A–H, Genesis §I).
   */
  subEntries?: EnrichmentEntry[];
  /**
   * True when this entry's dual-label `**[claim — confidence]**` line was
   * authored explicitly (vs. the parser default). Used by the UI to decide
   * whether a §I scenario *group* carries its own dating-confidence badge:
   * Genesis dating-hypothesis scenarios do (→ collapsible badge card); the
   * John/Matthew time-period scenarios do not (→ plain heading, unchanged).
   */
  hasLabel?: boolean;
}

export interface EnrichmentSection {
  id: string;
  title: string;
  /**
   * Prose authored between the `## ` section header and its first `### ` entry —
   * e.g. the §I "World at the Time" dating-neutrality disclaimer, or a "see the
   * companion" pointer. Leading `>` blockquote markers are stripped at parse time.
   */
  intro?: string;
  entries: EnrichmentEntry[];
}

export interface EnrichmentData {
  book: string;
  chapter: number;
  disclaimer: string;
  sections: EnrichmentSection[];
}

// Phase 5b — book "tight card" (What·When·Who·To-whom·Why). Authored as an
// HTML-comment-delimited block in INTRODUCTION.md; labels localized in-content.
export interface BookCardField {
  label: string;
  value: string;
}

export interface IntroductionData {
  book: string;
  disclaimer: string;
  sections: EnrichmentSection[];
  card?: BookCardField[];
}

export type FulfillmentStatus =
  | "FULFILLED"
  | "PARTIAL"
  | "CLAIMED"
  | "UNFULFILLED"
  | "DEBATED"
  | "MULTI_STAGE";

export interface ProphecyReading {
  tradition: string;
  subTradition?: string;
  reading: string;
  confidence: ConfidenceLevel;
}

export interface ProphecyEntry {
  verseRef: string;
  title: string;
  textSays: string;
  context: string;
  subject: string;
  readings: ProphecyReading[];
  fulfillmentStatus: FulfillmentStatus;
  fulfillmentNotes?: string;
  scholarlyNote?: string;
}

export interface ProphecyData {
  book: string;
  chapter: number;
  entries: ProphecyEntry[];
}

export type OriginType = "BORN" | "CREATED" | "APPEARS" | "UNCERTAIN";

export type HistoricityStatus =
  | "VERIFIED"
  | "PROBABLE"
  | "POSSIBLE"
  | "UNCERTAIN"
  | "LITERARY";

export interface CuriosityEntry {
  title: string;
  claimType: ClaimType;
  confidence: ConfidenceLevel;
  content: string;
  source?: string;
}

export type GenerationReference = string;

export interface GenerationEntry {
  reference: GenerationReference;
  count: number;
  line?: string;
  source?: string;
}

export interface RegionByText {
  region: string;
  verse: string;
  confidence: ConfidenceLevel;
  note?: string;
}

/**
 * One authored `**Label:** value` field, preserved verbatim (label text and
 * value) and in authored order. Drives the generic person-card render so no
 * authored field is ever dropped (parity with the redesign prototype, which
 * renders every field). Typed fields above coexist for the timeline/sort.
 */
export interface PersonRawField {
  label: string;
  value: string;
}

export interface PersonEntry {
  slug: string;
  name: string;
  familiarName?: string;
  /** Trailing heading qualifier, e.g. "Cainite line" in "Lemekh (Lamech) — Cainite line". */
  suffix?: string;
  /** Every authored field, verbatim + in order, for the generic card render. */
  rawFields?: PersonRawField[];
  /** The authored `**Note:**` field (rendered as a wide field, prototype parity). */
  note?: string;
  nameMeaning?: string;
  originType: OriginType;
  birthYear?: string;
  deathYear?: string;
  lifespan?: string;
  father?: string;
  mother?: string;
  spouses?: string[];
  children?: string[];
  siblings?: string[];
  locations?: string[];
  firstMention: string;
  mentionedIn: string[];
  keyEvents?: string[];
  profession?: string;
  socialClass?: string;
  hometown?: string;
  placesLived?: string[];
  ageAtFatherhood?: string;
  causeOfDeath?: string;
  languagesSpoken?: string[];
  inLaws?: string[];
  archaeologicalEvidence?: string;
  extraBiblicalMentions?: string;
  historicityStatus?: HistoricityStatus;
  booksAppearingIn?: string[];
  keySpeeches?: string[];
  verseCount?: number;
  characterArc?: string;
  timelineAnchor?: "creation" | "historical";
  yearFromCreation?: number;
  yearFromCreationEnd?: number;
  historicalYear?: number;
  historicalYearEnd?: number;
  curiosities?: CuriosityEntry[];
  generationsFrom?: GenerationEntry[];
  regionsByText?: RegionByText[];
  crossBookSee?: string;
  /** The source book slug parsed from `crossBookSee` (`<book>/PEOPLE.md`), or
   *  undefined if the pointer doesn't match. Derived in the parser so the UI
   *  carries no slug-parsing logic. */
  crossBookSeeBook?: string;
  inBook?: string;
}

/**
 * A genealogy summary table authored as a markdown table under a
 * "… Genealogy … — Summary Table" H2 in PEOPLE.md (e.g. the Gen 5 and Gen 11
 * Anno-Mundi chronologies). Surfaced verbatim — no derivation.
 */
export interface GenealogyTable {
  title: string;
  caption?: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

export interface PeopleData {
  book: string;
  entries: PersonEntry[];
  /** Genealogy summary tables authored at the foot of PEOPLE.md. */
  genealogies?: GenealogyTable[];
  /** "Sources Consulted" section as raw markdown (rendered to HTML for display). */
  sources?: string;
}

// Phase 9 — Book Context: cross-chapter motifs surface.
// One CONTEXT.md per book per locale; flat motif list (no section grouping).
// claimType uses the existing 8-member ClaimType union per Q5 Path A semantic remap
// (STRUCTURAL → TEXTUAL, LINGUISTIC → TEXTUAL, TYPOLOGICAL → COMPARATIVE PARALLEL,
// NARRATIVE → STRONG INFERENCE). Motifs render in authoring order (no sortByConfidence).
export interface BookContextMotif {
  slug: string;
  title: string;
  claimType: ClaimType;
  confidence: ConfidenceLevel;
  chapters: number[];
  body: string;
  source?: string;
}

export interface BookContextData {
  book: string;
  locale: string;
  disclaimer: string;
  motifs: BookContextMotif[];
}
