/**
 * Phase 2 — Structured layer (P2-Q2 = A: derived in-memory record).
 *
 * Emits a flat list of addressable {@link StructuredUnit}s from each parsed
 * domain object, attaching stable IDs (see {@link ./ids}). The markdown remains
 * the single source of truth; this layer is *derived* by the existing parsers
 * (P2-Q3 = parser-emits-structured), so nothing is hand-copied and nothing can
 * be hand-dropped. The conservation gate
 * (`infrastructure/content/__tests__/conservation.test.ts`) verifies that every
 * parsed unit is emitted (count + content + ID integrity) across all content.
 *
 * Pure domain module — no framework, no fs, no I/O.
 */

import {
  bookContextDisclaimerId,
  chapterPartId,
  enrichmentDisclaimerId,
  enrichmentEntryId,
  enrichmentSectionId,
  glossaryId,
  introDisclaimerId,
  introEntryId,
  introSectionId,
  motifId,
  noteId,
  paragraphId,
  personId,
  personSubId,
  prophecyEntryId,
  prophecyReadingId,
  supplementaryId,
  verseId,
} from "./ids";
import type {
  BookContextData,
  ChapterData,
  EnrichmentData,
  IntroductionData,
  PeopleData,
  ProphecyData,
} from "./types";

export type StructuredKind =
  | "chapter-overview"
  | "reading-guide"
  | "paragraph"
  | "verse"
  | "note"
  | "glossary"
  | "supplementary"
  | "enrichment-disclaimer"
  | "enrichment-section"
  | "enrichment-entry"
  | "intro-disclaimer"
  | "intro-section"
  | "intro-entry"
  | "prophecy-entry"
  | "prophecy-reading"
  | "person"
  | "person-curiosity"
  | "person-generation"
  | "person-region"
  | "book-context-disclaimer"
  | "motif";

export interface StructuredUnit {
  id: string;
  kind: StructuredKind;
  /** Primary content of the unit — the field the conservation gate compares. */
  text: string;
  /** Parent unit id (chapter/section/person/entry), where applicable. */
  parentId?: string;
  /** Typed fields preserved from the domain object (type, confidence, …). */
  meta?: Record<string, unknown>;
}

function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

// ─── CHAPTER-N.md ─────────────────────────────────────────────────────────────

export function emitChapter(data: ChapterData): StructuredUnit[] {
  const { book, chapter } = data.metadata;
  const units: StructuredUnit[] = [];

  if (hasText(data.overview)) {
    units.push({
      id: chapterPartId(book, chapter, "overview"),
      kind: "chapter-overview",
      text: data.overview,
    });
  }
  if (hasText(data.readingGuide)) {
    units.push({
      id: chapterPartId(book, chapter, "reading-guide"),
      kind: "reading-guide",
      text: data.readingGuide,
    });
  }

  data.continuousReading.forEach((p, i) => {
    units.push({
      id: paragraphId(book, chapter, i),
      kind: "paragraph",
      text: p.text,
    });
  });

  data.verses.forEach((v) => {
    const vId = verseId(book, chapter, v.number);
    units.push({
      id: vId,
      kind: "verse",
      text: v.mainText,
      meta: { number: v.number },
    });
    v.notes.forEach((n, ni) => {
      units.push({
        id: noteId(book, chapter, v.number, ni),
        kind: "note",
        text: n.content,
        parentId: vId,
        meta: { type: n.type, title: n.title },
      });
    });
  });

  data.glossary.forEach((g, i) => {
    units.push({
      id: glossaryId(book, chapter, g.sourceWord, i),
      kind: "glossary",
      text: g.notes,
      meta: { sourceWord: g.sourceWord, translation: g.translation },
    });
  });

  data.supplementarySections.forEach((s, i) => {
    units.push({
      id: supplementaryId(book, chapter, s.title, i),
      kind: "supplementary",
      text: s.content,
      meta: { title: s.title },
    });
  });

  return units;
}

// ─── study/CHAPTER-N-CONTEXT.md ───────────────────────────────────────────────

export function emitEnrichment(data: EnrichmentData): StructuredUnit[] {
  const { book, chapter } = data;
  const units: StructuredUnit[] = [];

  if (hasText(data.disclaimer)) {
    units.push({
      id: enrichmentDisclaimerId(book, chapter),
      kind: "enrichment-disclaimer",
      text: data.disclaimer,
    });
  }

  data.sections.forEach((section) => {
    const secId = enrichmentSectionId(book, chapter, section.id);
    units.push({
      id: secId,
      kind: "enrichment-section",
      text: section.title,
      meta: { sectionId: section.id },
    });
    section.entries.forEach((e, ei) => {
      units.push({
        id: enrichmentEntryId(book, chapter, section.id, ei),
        kind: "enrichment-entry",
        text: e.content,
        parentId: secId,
        meta: {
          title: e.title,
          claimType: e.claimType,
          confidence: e.confidence,
          source: e.source,
        },
      });
    });
  });

  return units;
}

// ─── INTRODUCTION.md ──────────────────────────────────────────────────────────

export function emitIntroduction(data: IntroductionData): StructuredUnit[] {
  const { book } = data;
  const units: StructuredUnit[] = [];

  if (hasText(data.disclaimer)) {
    units.push({
      id: introDisclaimerId(book),
      kind: "intro-disclaimer",
      text: data.disclaimer,
    });
  }

  data.sections.forEach((section) => {
    const secId = introSectionId(book, section.id);
    units.push({
      id: secId,
      kind: "intro-section",
      text: section.title,
      meta: { sectionId: section.id },
    });
    section.entries.forEach((e, ei) => {
      units.push({
        id: introEntryId(book, section.id, ei),
        kind: "intro-entry",
        text: e.content,
        parentId: secId,
        meta: {
          title: e.title,
          claimType: e.claimType,
          confidence: e.confidence,
          source: e.source,
        },
      });
    });
  });

  return units;
}

// ─── study/CHAPTER-N-PROPHECY.md ──────────────────────────────────────────────

export function emitProphecy(data: ProphecyData): StructuredUnit[] {
  const { book, chapter } = data;
  const units: StructuredUnit[] = [];

  data.entries.forEach((entry, i) => {
    const entryId = prophecyEntryId(book, chapter, i);
    units.push({
      id: entryId,
      kind: "prophecy-entry",
      text: entry.textSays,
      meta: {
        title: entry.title,
        verseRef: entry.verseRef,
        context: entry.context,
        subject: entry.subject,
        fulfillmentStatus: entry.fulfillmentStatus,
        fulfillmentNotes: entry.fulfillmentNotes,
        scholarlyNote: entry.scholarlyNote,
      },
    });
    entry.readings.forEach((r, ri) => {
      units.push({
        id: prophecyReadingId(book, chapter, i, ri),
        kind: "prophecy-reading",
        text: r.reading,
        parentId: entryId,
        meta: {
          tradition: r.tradition,
          subTradition: r.subTradition,
          confidence: r.confidence,
        },
      });
    });
  });

  return units;
}

// ─── PEOPLE.md ────────────────────────────────────────────────────────────────

export function emitPeople(data: PeopleData): StructuredUnit[] {
  const { book } = data;
  const units: StructuredUnit[] = [];

  data.entries.forEach((person) => {
    const pId = personId(book, person.slug);
    units.push({
      id: pId,
      kind: "person",
      text: person.name,
      meta: {
        slug: person.slug,
        familiarName: person.familiarName,
        originType: person.originType,
        firstMention: person.firstMention,
        crossBookSee: person.crossBookSee,
        inBook: person.inBook,
      },
    });
    (person.curiosities ?? []).forEach((c, i) => {
      units.push({
        id: personSubId(book, person.slug, "cur", i),
        kind: "person-curiosity",
        text: c.content,
        parentId: pId,
        meta: {
          title: c.title,
          claimType: c.claimType,
          confidence: c.confidence,
        },
      });
    });
    (person.generationsFrom ?? []).forEach((g, i) => {
      units.push({
        id: personSubId(book, person.slug, "gen", i),
        kind: "person-generation",
        text: g.reference,
        parentId: pId,
        meta: { count: g.count, line: g.line, source: g.source },
      });
    });
    (person.regionsByText ?? []).forEach((r, i) => {
      units.push({
        id: personSubId(book, person.slug, "reg", i),
        kind: "person-region",
        text: r.region,
        parentId: pId,
        meta: { verse: r.verse, confidence: r.confidence, note: r.note },
      });
    });
  });

  return units;
}

// ─── CONTEXT.md (book-level) ──────────────────────────────────────────────────

export function emitBookContext(data: BookContextData): StructuredUnit[] {
  const { book } = data;
  const units: StructuredUnit[] = [];

  if (hasText(data.disclaimer)) {
    units.push({
      id: bookContextDisclaimerId(book),
      kind: "book-context-disclaimer",
      text: data.disclaimer,
    });
  }

  data.motifs.forEach((m) => {
    units.push({
      id: motifId(book, m.slug),
      kind: "motif",
      text: m.body,
      meta: {
        slug: m.slug,
        title: m.title,
        claimType: m.claimType,
        confidence: m.confidence,
        chapters: m.chapters,
        source: m.source,
      },
    });
  });

  return units;
}
