import { parseConfidence } from "@/domain/content/labels";
import type {
  ConfidenceLevel,
  GenerationEntry,
  HistoricityStatus,
  OriginType,
  RegionByText,
} from "@/domain/content/types";

export type FieldId =
  | "nameMeaning"
  | "originType"
  | "birthYear"
  | "deathYear"
  | "lifespan"
  | "ageAtFatherhood"
  | "father"
  | "mother"
  | "spouses"
  | "children"
  | "siblings"
  | "inLaws"
  | "locations"
  | "firstMention"
  | "mentionedIn"
  | "keyEvents"
  | "familiarName"
  | "profession"
  | "socialClass"
  | "hometown"
  | "placesLived"
  | "causeOfDeath"
  | "languagesSpoken"
  | "archaeologicalEvidence"
  | "extraBiblicalMentions"
  | "historicityStatus"
  | "booksAppearingIn"
  | "keySpeeches"
  | "characterArc"
  | "yearFromCreation"
  | "yearFromCreationEnd"
  | "historicalYear"
  | "historicalYearEnd"
  | "generationsFrom"
  | "regionsByText"
  | "crossBookSee"
  | "inBook";

// Per-field exact-match aliases.
//
// Resolution strategy (resolves AUDIT §4.1):
//   1. Lower-case the label, strip trailing colon and whitespace.
//   2. Look up in the EXACT_LOOKUP map. If hit, dispatch — done.
//   3. Otherwise, walk FALLBACK_PATTERNS (longest-alias first) and use
//      substring containment as a fallback. This handles file labels we
//      have not yet seen explicitly without the substring-collision bug,
//      because more-specific aliases are always tested first.
//
// Aliases are drawn from the actual field labels observed in
// content/{en,pt-br,de,es}/{genesis,matthew}/PEOPLE.md as of 2026-05-08.
// Add new locale labels here when they appear.
const EXACT_LABEL_ALIASES: Record<FieldId, string[]> = {
  nameMeaning: ["meaning", "significado", "bedeutung"],
  originType: ["origin", "origem", "ursprung", "herkunft", "origen"],
  birthYear: [
    "birth year",
    "ano de nascimento",
    "geburtsjahr",
    "año de nacimiento",
  ],
  deathYear: ["death year", "ano de morte", "todesjahr", "año de muerte"],
  lifespan: ["lifespan", "tempo de vida", "lebensdauer", "tiempo de vida"],
  ageAtFatherhood: [
    "age when became father",
    "age at fatherhood",
    "idade ao tornar-se pai",
    "idade ao ser pai",
    "idade ao tornar-se mãe",
    "alter bei erster vaterschaft",
    "alter bei vaterschaft",
    "alter bei erster mutterschaft",
    "alter bei mutterschaft",
    "edad al hacerse padre",
    "edad al ser padre",
    "edad al hacerse madre",
  ],
  father: ["father", "pai", "vater", "padre"],
  mother: ["mother", "mãe", "mutter", "madre"],
  spouses: [
    "spouse(s)",
    "spouse",
    "cônjuge(s)",
    "cônjuge",
    "ehepartner",
    "cónyuge(s)",
    "cónyuge",
  ],
  children: ["children", "filhos", "kinder", "hijos"],
  siblings: ["siblings", "irmãos", "geschwister", "hermanos"],
  inLaws: [
    "in-laws",
    "parentes por afinidade",
    "angeheiratete",
    "parientes políticos",
  ],
  locations: [
    "location(s)",
    "locations",
    "local(is)",
    "ort(e)",
    "ubicación(es)",
    "ubicación",
    "ubicaciones",
  ],
  firstMention: [
    "first mention",
    "primeira menção",
    "erste erwähnung",
    "primera mención",
  ],
  mentionedIn: ["mentioned in", "mencionado em", "erwähnt in", "mencionado en"],
  keyEvents: [
    "key events",
    "eventos-chave",
    "eventos clave",
    "wichtige ereignisse",
    "hauptereignisse",
    "schlüsselereignisse",
  ],
  familiarName: [
    "familiar name",
    "nome familiar",
    "vertrauter name",
    "nombre familiar",
  ],
  profession: ["profession", "profissão", "beruf", "profesión"],
  socialClass: [
    "social class",
    "classe social",
    "gesellschaftliche schicht",
    "soziale klasse",
    "clase social",
  ],
  hometown: [
    "hometown",
    "cidade natal",
    "heimatort",
    "heimatstadt",
    "ciudad natal",
  ],
  placesLived: [
    "places lived",
    "locais onde viveu",
    "orte, an denen er lebte",
    "orte, an denen sie lebte",
    "lebensorte",
    "lugares donde vivió",
    "lugares vividos",
  ],
  causeOfDeath: [
    "cause of death",
    "causa da morte",
    "todesursache",
    "causa de muerte",
  ],
  languagesSpoken: [
    "languages spoken",
    "languages",
    "idiomas falados",
    "sprachen",
    "lenguas",
  ],
  archaeologicalEvidence: [
    "archaeological evidence",
    "evidência arqueológica",
    "archäologische belege",
    "archäologische evidenz",
    "evidencia arqueológica",
  ],
  extraBiblicalMentions: [
    "extra-biblical mentions",
    "menções extrabíblicas",
    "menções extra-bíblicas",
    "außerbiblische erwähnungen",
    "menciones extrabíblicas",
    "menciones extra-bíblicas",
  ],
  // Cross-book see-also pointer (e.g., "**See:** genesis/PEOPLE.md").
  // Used in matthew/PEOPLE.md to defer full bio to a previous book.
  crossBookSee: ["see", "ver", "siehe"],
  // Per-book narrative role (e.g., "**In Matthew:** First in the genealogy ...").
  // Add new "in <book>" labels here when new books are authored.
  inBook: [
    "in matthew",
    "em mateus",
    "in matthäus",
    "en mateo",
    "in genesis",
    "em gênesis",
    "en génesis",
    "in john",
    "em joão",
    "in johannes",
    "en juan",
    "in mark",
    "em marcos",
    "in markus",
    "en marcos",
  ],
  historicityStatus: [
    "historicity status",
    "status de historicidade",
    "historischer status",
    "estado de historicidad",
  ],
  booksAppearingIn: [
    "books appearing in",
    "livros em que aparece",
    "bücher, in denen er vorkommt",
    "bücher, in denen sie vorkommt",
    "libros en que aparece",
  ],
  keySpeeches: [
    "key speeches",
    "discursos importantes",
    "wichtige reden",
    "discursos clave",
  ],
  characterArc: [
    "character arc",
    "arco do personagem",
    "charakterbogen",
    "charakterentwicklung",
    "arco del personaje",
  ],
  yearFromCreation: [
    "year from creation",
    "ano desde a criação",
    "jahr seit der schöpfung",
    "año desde la creación",
  ],
  yearFromCreationEnd: [
    "year from creation end",
    "year from creation — end",
    "ano desde a criação — fim",
    "jahr seit der schöpfung — ende",
    "año desde la creación — fin",
  ],
  historicalYear: [
    "historical year",
    "ano histórico",
    "historisches jahr",
    "año histórico",
  ],
  historicalYearEnd: [
    "historical year end",
    "historical year — end",
    "ano histórico — fim",
    "historisches jahr — ende",
    "año histórico — fin",
  ],
  generationsFrom: [
    "generations from",
    "gerações de",
    "gerações desde",
    "generationen seit",
    "generationen ab",
    "generaciones desde",
  ],
  regionsByText: [
    "regions by text",
    "regiões por texto",
    "regionen laut text",
    "regiones por texto",
  ],
};

// Build O(1) exact lookup at module load.
const EXACT_LOOKUP: Map<string, FieldId> = (() => {
  const m = new Map<string, FieldId>();
  for (const fieldKey of Object.keys(EXACT_LABEL_ALIASES) as FieldId[]) {
    for (const alias of EXACT_LABEL_ALIASES[fieldKey]) {
      m.set(alias, fieldKey);
    }
  }
  return m;
})();

// Sorted by length desc for fallback substring matching (longest first).
const FALLBACK_PATTERNS: Array<{ alias: string; field: FieldId }> = (() => {
  const all: Array<{ alias: string; field: FieldId }> = [];
  for (const fieldKey of Object.keys(EXACT_LABEL_ALIASES) as FieldId[]) {
    for (const alias of EXACT_LABEL_ALIASES[fieldKey]) {
      all.push({ alias, field: fieldKey });
    }
  }
  return all.sort((a, b) => b.alias.length - a.alias.length);
})();

export function normalizeLabel(label: string): string {
  return label.trim().toLowerCase();
}

export function resolveField(label: string): FieldId | undefined {
  const norm = normalizeLabel(label);
  const exact = EXACT_LOOKUP.get(norm);
  if (exact) return exact;
  for (const { alias, field } of FALLBACK_PATTERNS) {
    if (norm.includes(alias)) return field;
  }
  return undefined;
}

export function parseOriginType(raw: string): OriginType {
  const n = raw.trim().toUpperCase();
  if (
    n.includes("BORN") ||
    n.includes("NASCID") ||
    n.includes("GEBOREN") ||
    n.includes("NACID")
  )
    return "BORN";
  if (
    n.includes("CREATED") ||
    n.includes("CRIAD") ||
    n.includes("ERSCHAFFEN") ||
    n.includes("CREAD")
  )
    return "CREATED";
  if (n.includes("APPEARS") || n.includes("APARECE") || n.includes("ERSCHEINT"))
    return "APPEARS";
  return "UNCERTAIN";
}

export function parseHistoricityStatus(raw: string): HistoricityStatus {
  const n = raw.trim().toUpperCase();
  if (
    n.includes("VERIFIED") ||
    n.includes("VERIFICADO") ||
    n.includes("VERIFIZIERT")
  )
    return "VERIFIED";
  if (
    n.includes("PROBABLE") ||
    n.includes("PROVÁVEL") ||
    n.includes("WAHRSCHEINLICH")
  )
    return "PROBABLE";
  if (
    n.includes("POSSIBLE") ||
    n.includes("POSSÍVEL") ||
    n.includes("MÖGLICH") ||
    n.includes("POSIBLE")
  )
    return "POSSIBLE";
  if (
    n.includes("LITERARY") ||
    n.includes("LITERÁRIO") ||
    n.includes("LITERARISCH") ||
    n.includes("LITERARIO")
  )
    return "LITERARY";
  return "UNCERTAIN";
}

export function parseInt10(raw: string): number | undefined {
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? undefined : n;
}

// Parses "adam (15, via Seth, Gen 5); noach (5, via Shem)" into GenerationEntry[]
export function parseGenerationsFrom(raw: string): GenerationEntry[] {
  const result: GenerationEntry[] = [];
  for (const segment of raw.split(";")) {
    const m = segment.trim().match(/^(\S+)\s*\(([^)]+)\)\s*$/);
    if (!m) continue;
    const reference = m[1].trim().toLowerCase();
    const inner = m[2].split(",").map((s) => s.trim());
    if (inner.length === 0) continue;
    const count = Number.parseInt(inner[0], 10);
    if (Number.isNaN(count)) continue;
    const entry: GenerationEntry = { reference, count };
    if (inner.length >= 2) entry.line = inner[1];
    if (inner.length >= 3) entry.source = inner.slice(2).join(", ");
    result.push(entry);
  }
  return result;
}

// Parses "Cush (Gen 10:6, DOCUMENTED); Mitsrayim (Gen 10:6, DOCUMENTED)" into RegionByText[]
export function parseRegionsByText(raw: string): RegionByText[] {
  const result: RegionByText[] = [];
  for (const segment of raw.split(";")) {
    const m = segment.trim().match(/^([^()]+?)\s*\(([^)]+)\)\s*$/);
    if (!m) continue;
    const region = m[1].trim();
    const parts = m[2].split(",").map((s) => s.trim());
    if (parts.length === 0) continue;
    const verse = parts[0];
    const confidence: ConfidenceLevel =
      parts.length >= 2 ? parseConfidence(parts[1]) : "DOCUMENTED";
    const note = parts.length >= 3 ? parts.slice(2).join(", ") : undefined;
    result.push({ region, verse, confidence, note });
  }
  return result;
}
