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
  hebrew: string;
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
  yhwhPolicy: string;
}

export interface ChapterData {
  metadata: ChapterMetadata;
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
  | "SPECULATIVE";

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
