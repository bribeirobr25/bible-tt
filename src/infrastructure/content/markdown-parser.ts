import type {
  ChapterData,
  ChapterMetadata,
  GlossaryEntry,
  Note,
  NoteType,
  Paragraph,
  SupplementarySection,
  Verse,
} from "@/domain/content/types";

const SECTION_HEADER = /^## (.+)$/;
const VERSE_HEADER = /^### \*\*(?:Verse|Versículo|Versiculo|Vers) (\d+)\*\*$/;
const NOTE_TYPE_PREFIX = /^([🔴🟢🔵🟡])\s+\*\*(.+?)\*\*/u;
const METADATA_LINE = /^\*\*(.+?):\*\*\s*(.+)$/;
const TABLE_ROW = /^\|(.+)\|$/;

const CONTINUOUS_READING_HEADERS = new Set([
  "CONTINUOUS READING",
  "LEITURA CONTÍNUA",
  "FORTLAUFENDE LESUNG",
  "LECTURA CONTINUA",
]);

const VERSE_STUDY_HEADERS = new Set([
  "VERSE-BY-VERSE STUDY",
  "ESTUDO VERSO A VERSO",
  "VERS-FÜR-VERS-STUDIE",
  "ESTUDIO VERSÍCULO POR VERSÍCULO",
]);

const GLOSSARY_PATTERN = /^GLOSS|^GLOSARIO/i;

const SKIPPED_SECTIONS = new Set([
  "TABLE OF CONTENTS",
  "SUMÁRIO",
  "INHALTSVERZEICHNIS",
  "INDICE",
  "ÍNDICE",
]);

const OVERVIEW_SECTIONS = new Set([
  "CHAPTER OVERVIEW",
  "VISÃO GERAL DO CAPÍTULO",
  "KAPITELÜBERSICHT",
  "VISIÓN GENERAL DEL CAPÍTULO",
]);

function classifyNoteType(emoji: string): NoteType {
  switch (emoji) {
    case "🔴":
      return "CRITICAL";
    case "🟢":
      return "LEXICAL";
    case "🔵":
      return "GRAMMATICAL";
    case "🟡":
      return "THEOLOGICAL";
    default:
      return "LEXICAL";
  }
}

interface RawSection {
  title: string;
  content: string;
}

function splitIntoSections(raw: string): {
  preamble: string;
  sections: RawSection[];
} {
  const lines = raw.split("\n");
  const sections: RawSection[] = [];
  let preamble = "";
  let currentTitle = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const match = line.match(SECTION_HEADER);
    if (match) {
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          content: currentLines.join("\n"),
        });
      } else {
        preamble = currentLines.join("\n");
      }
      currentTitle = match[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentLines.join("\n") });
  }

  return { preamble, sections };
}

// `source` should include the title-section content (the `**Base Text:** …`
// metadata block lives there, not in the preamble). Keys are matched by
// substring so label variants ("Divine Name Policy (Rule 25 / GS Policy)") and
// all four locales resolve.
function extractMetadata(
  source: string,
  book: string,
  chapter: number,
): ChapterMetadata {
  const meta: Record<string, string> = {};
  for (const line of source.split("\n")) {
    const match = line.match(METADATA_LINE);
    if (match) {
      meta[match[1].trim()] = match[2].trim();
    }
  }
  const keys = Object.keys(meta);
  const pick = (...needles: string[]): string => {
    for (const key of keys) {
      const lower = key.toLowerCase();
      if (needles.some((n) => lower.includes(n))) return meta[key];
    }
    return "";
  };

  return {
    book,
    chapter,
    edition: pick("edition", "edição", "edición", "ausgabe") || "Transparent",
    language: pick("language", "idioma", "sprache"),
    baseText: pick("base text", "texto base", "grundtext"),
    status: pick("status") || "provisional",
    methodology: pick("methodology", "metodologia", "metodología", "methodik"),
    divineNamePolicy: pick(
      "divine name",
      "nome divino",
      "nombre divino",
      "gottesname",
    ),
  };
}

function extractContinuousReading(content: string): Paragraph[] {
  const cleaned = content.replace(/^---\s*$/gm, "").trim();
  const textBlock = cleaned.replace(/^\*.*?\*\s*$/gm, "").trim();

  return textBlock
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith("*"))
    .map((text) => ({ text }));
}

function extractVerses(content: string): Verse[] {
  const lines = content.split("\n");
  const verseBlocks: { num: number; lines: string[] }[] = [];
  let current: { num: number; lines: string[] } | null = null;

  for (const line of lines) {
    const match = line.match(VERSE_HEADER);
    if (match) {
      if (current) verseBlocks.push(current);
      current = { num: Number.parseInt(match[1], 10), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) verseBlocks.push(current);

  const verses: Verse[] = [];

  for (const block of verseBlocks) {
    const mainTextLines: string[] = [];
    const noteLines: string[] = [];
    let inNotes = false;

    for (const line of block.lines) {
      if (
        line.startsWith("> ") ||
        (inNotes && (line === ">" || line.startsWith(">")))
      ) {
        inNotes = true;
        noteLines.push(line);
      } else if (line === "---") {
        break;
      } else if (!inNotes && line.trim().length > 0) {
        mainTextLines.push(line);
      }
    }

    const mainText = mainTextLines.join("\n").trim();
    const notes = parseNotes(noteLines);

    if (mainText) {
      verses.push({ number: block.num, mainText, notes });
    }
  }

  return verses;
}

function parseNotes(lines: string[]): Note[] {
  const notes: Note[] = [];
  let currentType: NoteType = "LEXICAL";
  let currentTitle = "";
  let currentContent: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/^>\s?/, "");
    const match = line.match(NOTE_TYPE_PREFIX);

    if (match) {
      if (currentTitle) {
        notes.push({
          type: currentType,
          title: currentTitle,
          content: currentContent.join("\n").trim(),
        });
      }
      currentType = classifyNoteType(match[1]);
      currentTitle = match[2].replace(/\*\*/g, "").trim();
      const rest = line
        .slice(line.indexOf(match[2]) + match[2].length)
        .replace(/\*\*/g, "")
        .trim();
      currentContent = rest ? [rest] : [];
    } else if (line.trim() && currentTitle) {
      currentContent.push(line);
    }
  }

  if (currentTitle) {
    notes.push({
      type: currentType,
      title: currentTitle,
      content: currentContent.join("\n").trim(),
    });
  }

  return notes;
}

function extractGlossary(content: string): GlossaryEntry[] {
  const rows = content.split("\n").filter((l) => TABLE_ROW.test(l.trim()));
  if (rows.length < 2) return [];

  const entries: GlossaryEntry[] = [];
  for (let i = 2; i < rows.length; i++) {
    const cells = rows[i]
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    if (cells.length >= 2) {
      entries.push({
        sourceWord: cells[0].replace(/\*\*/g, ""),
        translation: cells[1].replace(/\*\*/g, ""),
        notes: cells[2] || "",
      });
    }
  }

  return entries;
}

function isContinuousReading(title: string): boolean {
  return CONTINUOUS_READING_HEADERS.has(title);
}

function isVerseStudy(title: string): boolean {
  return VERSE_STUDY_HEADERS.has(title);
}

function isGlossary(title: string): boolean {
  return GLOSSARY_PATTERN.test(title);
}

function isSkipped(title: string): boolean {
  return SKIPPED_SECTIONS.has(title);
}

function isReadingGuide(title: string): boolean {
  return /READING GUIDE|GUIA DE LEITURA|LESEANLEITUNG|GUIA DE LECTURA|GUÍA DE LECTURA/i.test(
    title,
  );
}

function isTitleSection(title: string): boolean {
  return /Transparent Translation|Tradução Transparente|Transparente Übersetzung|Traducción Transparente/i.test(
    title,
  );
}

export function parseChapterMarkdown(
  raw: string,
  book: string,
  chapter: number,
): ChapterData {
  const { preamble, sections } = splitIntoSections(raw);
  // Metadata lives inside the title section (`## The Transparent Translation`),
  // not the preamble — include it so Base Text / Methodology / Divine Name parse.
  const titleContent =
    sections.find((s) => isTitleSection(s.title))?.content ?? "";
  const metadata = extractMetadata(
    `${preamble}\n${titleContent}`,
    book,
    chapter,
  );

  let overview: string | null = null;
  let readingGuide: string | null = null;
  let continuousReading: Paragraph[] = [];
  let verses: Verse[] = [];
  let glossary: GlossaryEntry[] = [];
  const supplementary: SupplementarySection[] = [];

  for (const section of sections) {
    if (isTitleSection(section.title) || isSkipped(section.title)) {
      continue;
    }
    if (OVERVIEW_SECTIONS.has(section.title)) {
      overview = section.content.trim();
    } else if (isReadingGuide(section.title)) {
      readingGuide = section.content.trim();
    } else if (isContinuousReading(section.title)) {
      continuousReading = extractContinuousReading(section.content);
    } else if (isVerseStudy(section.title)) {
      verses = extractVerses(section.content);
    } else if (isGlossary(section.title)) {
      glossary = extractGlossary(section.content);
    } else {
      supplementary.push({
        title: section.title,
        content: section.content.trim(),
      });
    }
  }

  return {
    metadata,
    overview,
    readingGuide,
    continuousReading,
    verses,
    glossary,
    supplementarySections: supplementary,
  };
}
