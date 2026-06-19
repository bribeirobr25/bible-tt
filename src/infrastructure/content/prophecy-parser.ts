import { parseConfidence } from "@/domain/content/labels";
import type {
  FulfillmentStatus,
  ProphecyData,
  ProphecyEntry,
  ProphecyReading,
} from "@/domain/content/types";

const ENTRY_HEADER = /^## (.+)$/;
const FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/;
const READING_LINE = /^- \*\*(.+?)(?:\s*\/\s*(.+?))?\*\*:\s*(.+)\s*\[(.+?)\]$/;

function parseFulfillmentStatus(raw: string): FulfillmentStatus {
  const n = raw.trim().toUpperCase();
  if (
    n.includes("MULTI_STAGE") ||
    n.includes("MULTI-STAGE") ||
    n.includes("MEHRPHASIG") ||
    n.includes("MÚLTIPLES ETAPAS") ||
    n.includes("MÚLTIPLAS ETAPAS")
  )
    return "MULTI_STAGE";
  if (n.includes("PARTIAL") || n.includes("TEILWEISE") || n.includes("PARCIAL"))
    return "PARTIAL";
  if (
    n.includes("UNFULFILLED") ||
    n.includes("UNERFÜLLT") ||
    n.includes("NO CUMPLIDA") ||
    n.includes("NÃO CUMPRIDA")
  )
    return "UNFULFILLED";
  if (
    n.includes("FULFILLED") ||
    n.includes("ERFÜLLT") ||
    n.includes("CUMPLIDA") ||
    n.includes("CUMPRIDA")
  )
    return "FULFILLED";
  if (
    n.includes("CLAIMED") ||
    n.includes("BEANSPRUCHT") ||
    n.includes("RECLAMADA") ||
    n.includes("REIVINDICADA")
  )
    return "CLAIMED";
  if (
    n.includes("DEBATED") ||
    n.includes("DEBATTIERT") ||
    n.includes("DEBATIDA") ||
    n.includes("DEBATIDO")
  )
    return "DEBATED";
  console.warn(
    `Unrecognized fulfillment status: "${raw}", falling back to DEBATED`,
  );
  return "DEBATED";
}

export function parseProphecyMarkdown(
  raw: string,
  book: string,
  chapter: number,
): ProphecyData {
  const lines = raw.split("\n");
  const entries: ProphecyEntry[] = [];

  let current:
    | (Partial<ProphecyEntry> & { readings: ProphecyReading[] })
    | null = null;
  let inReadings = false;

  for (const line of lines) {
    const entryMatch = line.match(ENTRY_HEADER);
    if (entryMatch) {
      if (current?.verseRef) {
        entries.push(finalizeEntry(current));
      }
      current = {
        title: entryMatch[1].trim(),
        readings: [],
        fulfillmentStatus: "DEBATED",
      };
      inReadings = false;
      continue;
    }

    if (!current) continue;

    const fieldMatch = line.match(FIELD_LINE);
    if (fieldMatch) {
      const key = fieldMatch[1].trim().toLowerCase();
      const value = fieldMatch[2].trim();

      if (
        key.includes("verse") ||
        key.includes("versículo") ||
        key.includes("vers")
      ) {
        current.verseRef = value;
      } else if (
        key.includes("text says") ||
        key.includes("texto dice") ||
        key.includes("texto diz") ||
        key.includes("text sagt")
      ) {
        current.textSays = value;
      } else if (
        key.includes("context") ||
        key.includes("contexto") ||
        key.includes("kontext")
      ) {
        current.context = value;
      } else if (
        key.includes("subject") ||
        key.includes("sujeto") ||
        key.includes("sujeito") ||
        key.includes("gegenstand")
      ) {
        current.subject = value;
      } else if (
        key.includes("fulfillment status") ||
        key.includes("estado de cumplimiento") ||
        key.includes("estado de cumprimento") ||
        key.includes("erfüllungsstatus") ||
        key.includes("erfullungsstatus")
      ) {
        current.fulfillmentStatus = parseFulfillmentStatus(value);
      } else if (
        key.includes("fulfillment notes") ||
        key.includes("notas") ||
        key.includes("anmerkungen")
      ) {
        current.fulfillmentNotes = value;
      } else if (
        key.includes("scholarly note") ||
        key.includes("nota acadêmica") ||
        key.includes("nota académica") ||
        key.includes("wissenschaftliche anmerkung")
      ) {
        current.scholarlyNote = value;
      } else if (
        key.includes("readings") ||
        key.includes("lecturas") ||
        key.includes("leituras") ||
        key.includes("lesarten")
      ) {
        inReadings = true;
      }
      continue;
    }

    if (inReadings) {
      const readingMatch = line.match(READING_LINE);
      if (readingMatch) {
        current.readings.push({
          tradition: readingMatch[1].trim(),
          subTradition: readingMatch[2]?.trim(),
          reading: readingMatch[3].trim(),
          confidence: parseConfidence(readingMatch[4]),
        });
      } else if (line.trim() === "" || line.startsWith("**")) {
        inReadings = false;
      }
    }
  }

  if (current?.verseRef) {
    entries.push(finalizeEntry(current));
  }

  return { book, chapter, entries };
}

function finalizeEntry(
  raw: Partial<ProphecyEntry> & { readings: ProphecyReading[] },
): ProphecyEntry {
  return {
    verseRef: raw.verseRef || "",
    title: raw.title || "",
    textSays: raw.textSays || "",
    context: raw.context || "",
    subject: raw.subject || "",
    readings: raw.readings,
    fulfillmentStatus: raw.fulfillmentStatus || "DEBATED",
    fulfillmentNotes: raw.fulfillmentNotes,
    scholarlyNote: raw.scholarlyNote,
  };
}
