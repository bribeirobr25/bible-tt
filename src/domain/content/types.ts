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

export interface EnrichmentEntry {
  title: string;
  claimType: ClaimType;
  confidence: ConfidenceLevel;
  content: string;
  source?: string;
}

export interface EnrichmentSection {
  id: string;
  title: string;
  entries: EnrichmentEntry[];
}

export interface EnrichmentData {
  book: string;
  chapter: number;
  disclaimer: string;
  sections: EnrichmentSection[];
}

export interface IntroductionData {
  book: string;
  disclaimer: string;
  sections: EnrichmentSection[];
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
}

export interface ProphecyData {
  book: string;
  chapter: number;
  entries: ProphecyEntry[];
}

export type OriginType = "BORN" | "CREATED" | "APPEARS" | "UNCERTAIN";

export interface PersonEntry {
  slug: string;
  name: string;
  nameMeaning?: string;
  originType: OriginType;
  birthYear?: string;
  deathYear?: string;
  lifespan?: string;
  father?: string;
  mother?: string;
  spouses?: string[];
  children?: string[];
  locations?: string[];
  firstMention: string;
  mentionedIn: string[];
  keyEvents?: string[];
}

export interface PeopleData {
  book: string;
  entries: PersonEntry[];
}
