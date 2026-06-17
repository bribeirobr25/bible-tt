import type {
  ClaimType,
  ConfidenceLevel,
  CuriosityEntry,
  GenealogyTable,
  GenerationEntry,
  HistoricityStatus,
  OriginType,
  PeopleData,
  PersonEntry,
  RegionByText,
} from "@/domain/content/types";

const ENTRY_HEADER = /^## (.+)$/;
const FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/;
const SUBSECTION_HEADER = /^### (.+)$/;
const CURIOSITY_HEADER = /^#### (.+)$/;

// An H2 heading that introduces a genealogy summary table (all 4 locales) — not
// a person. Matches "Genealogy/Genealogia/Genealogie/Genealogía …" and the
// localized "… Summary Table" qualifiers.
const GENEALOGY_HEADING =
  /genealog|stammbaum|summary table|tabela resumida|übersichtstabelle|tabla resumen/i;

// An H2 heading that introduces the "Sources Consulted" section (all 4 locales).
// Authored as "## H. Sources Consulted" / "## H. Fontes Consultadas" / etc.
const SOURCES_HEADING =
  /^h\.\s|sources consulted|fontes consultadas|konsultierte quellen|fuentes consultadas|^(?:sources|fontes|quellen|fuentes)\b/i;

// Trailing "— Summary Table" qualifier to strip from a genealogy title so it
// matches the clean prototype title. The leading char class eats whatever
// separator precedes the phrase — an em/en dash, hyphen, or its mojibake
// (the EN file has "â\x80\x94", a mis-decoded em-dash) — but never "(" or ")".
const GENEALOGY_TITLE_SUFFIX =
  /\s*[^A-Za-z0-9()]*\s*(?:summary table|tabela resumida|übersichtstabelle|tabla resumen)\s*$/i;

// "Note" field label across locales — lifted to its own `note` slot, not a field.
const NOTE_LABELS = new Set(["note", "nota", "anmerkung", "hinweis", "notiz"]);

// A markdown table separator row, e.g. "|---|---|" or "| :-- | --: |".
const isTableSeparator = (cells: string[]): boolean =>
  cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c.trim()));

// Split a markdown table row "| a | b |" into trimmed cells.
function parseTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

// H2 names matching any of these patterns are NOT person entries.
const SKIP_NAME_PATTERNS: RegExp[] = [
  /^H\./,
  /Summary Table/i,
  /Genealogy \(Gen/i,
  /^Sources/i,
  /^Quellen/i,
  /^Fuentes/i,
  /Tabela/i,
  /Genealogia/i,
  /Stammbaum/i,
  /Transparent Translation/i, // Phase 1A — even if the H2 has not been stripped yet
  /Tradução Transparente/i,
  /Transparente Übersetzung/i,
  /Traducción Transparente/i,
];

type FieldId =
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

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase();
}

function resolveField(label: string): FieldId | undefined {
  const norm = normalizeLabel(label);
  const exact = EXACT_LOOKUP.get(norm);
  if (exact) return exact;
  for (const { alias, field } of FALLBACK_PATTERNS) {
    if (norm.includes(alias)) return field;
  }
  return undefined;
}

function parseOriginType(raw: string): OriginType {
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

function parseHistoricityStatus(raw: string): HistoricityStatus {
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

function parseInt10(raw: string): number | undefined {
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? undefined : n;
}

const CLAIM_TYPES: ClaimType[] = [
  "TEXTUAL",
  "STRONG INFERENCE",
  "POSSIBLE INFERENCE",
  "COMPARATIVE PARALLEL",
  "LATER RECEPTION",
  "HISTORICAL / ARCHAEOLOGICAL",
  "SCIENTIFIC COMPARISON",
  "SPECULATION",
];

const CONFIDENCE_LEVELS: ConfidenceLevel[] = [
  "VERIFIED",
  "PROBABLE",
  "POSSIBLE",
  "UNCERTAIN",
  "SPECULATIVE",
  "DOCUMENTED",
];

function parseClaimType(raw: string): ClaimType {
  const n = raw.trim().toUpperCase();
  for (const ct of CLAIM_TYPES) {
    if (n === ct) return ct;
  }
  // Lenient match
  if (n.includes("TEXTUAL")) return "TEXTUAL";
  if (n.includes("STRONG")) return "STRONG INFERENCE";
  if (n.includes("POSSIBLE INFERENCE")) return "POSSIBLE INFERENCE";
  if (n.includes("COMPARATIVE")) return "COMPARATIVE PARALLEL";
  if (n.includes("RECEPTION")) return "LATER RECEPTION";
  if (n.includes("HISTORICAL") || n.includes("ARCHAEOLOG"))
    return "HISTORICAL / ARCHAEOLOGICAL";
  if (n.includes("SCIENTIFIC")) return "SCIENTIFIC COMPARISON";
  if (n.includes("SPECULATION")) return "SPECULATION";
  return "TEXTUAL";
}

function parseConfidence(raw: string): ConfidenceLevel {
  const n = raw.trim().toUpperCase();
  for (const cl of CONFIDENCE_LEVELS) {
    if (n === cl) return cl;
  }
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
    n.includes("DOCUMENTED") ||
    n.includes("DOCUMENTADO") ||
    n.includes("DOKUMENTIERT")
  )
    return "DOCUMENTED";
  if (n.includes("SPECULATIVE")) return "SPECULATIVE";
  if (
    n.includes("UNCERTAIN") ||
    n.includes("INCERTO") ||
    n.includes("UNGEWISS") ||
    n.includes("INCIERTO")
  )
    return "UNCERTAIN";
  return "UNCERTAIN";
}

// Parses "adam (15, via Seth, Gen 5); noach (5, via Shem)" into GenerationEntry[]
function parseGenerationsFrom(raw: string): GenerationEntry[] {
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
function parseRegionsByText(raw: string): RegionByText[] {
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

function isSkipName(name: string): boolean {
  return SKIP_NAME_PATTERNS.some((re) => re.test(name));
}

// Curiosity heading match across locales (via flexible text match)
function isCuriosityHeading(headingText: string): boolean {
  const n = headingText.trim().toLowerCase();
  return (
    n === "curiosities" ||
    n === "curiosidades" ||
    n === "kuriositäten" ||
    n === "kuriositaeten"
  );
}

// Strip surrounding asterisks from a value (e.g. **TEXTUAL** → TEXTUAL)
function stripBold(s: string): string {
  return s.replace(/^\*+|\*+$/g, "").trim();
}

interface ParseState {
  current: Partial<PersonEntry> | null;
  inCuriosities: boolean;
  curiosity: Partial<CuriosityEntry> | null;
  // Genealogy-table accumulation (between a genealogy H2 and the next H2).
  gen: {
    title: string;
    caption?: string;
    headers: string[];
    rows: string[][];
    note?: string;
  } | null;
  // Sources-section accumulation (raw markdown lines after the sources H2).
  sourcesLines: string[] | null;
}

function flushGenealogy(
  state: ParseState,
  genealogies: GenealogyTable[],
): void {
  const g = state.gen;
  state.gen = null;
  if (!g || g.headers.length === 0) return;
  genealogies.push({
    title: g.title,
    caption: g.caption,
    headers: g.headers,
    rows: g.rows,
    note: g.note,
  });
}

function applyField(
  current: Partial<PersonEntry>,
  field: FieldId,
  value: string,
): void {
  switch (field) {
    case "nameMeaning":
      current.nameMeaning = value;
      break;
    case "originType":
      current.originType = parseOriginType(value);
      break;
    case "birthYear":
      current.birthYear = value;
      break;
    case "deathYear":
      current.deathYear = value;
      break;
    case "lifespan":
      current.lifespan = value;
      break;
    case "ageAtFatherhood":
      current.ageAtFatherhood = value;
      break;
    case "father":
      current.father = value;
      break;
    case "mother":
      current.mother = value;
      break;
    case "spouses":
      current.spouses = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "children":
      current.children = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "siblings":
      current.siblings = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "inLaws":
      current.inLaws = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "locations":
      current.locations = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "firstMention":
      current.firstMention = value;
      break;
    case "mentionedIn":
      current.mentionedIn = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "keyEvents":
      current.keyEvents = value
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "familiarName":
      current.familiarName = value;
      break;
    case "profession":
      current.profession = value;
      break;
    case "socialClass":
      current.socialClass = value;
      break;
    case "hometown":
      current.hometown = value;
      break;
    case "placesLived":
      current.placesLived = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "causeOfDeath":
      current.causeOfDeath = value;
      break;
    case "languagesSpoken":
      current.languagesSpoken = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "archaeologicalEvidence":
      current.archaeologicalEvidence = value;
      break;
    case "extraBiblicalMentions":
      current.extraBiblicalMentions = value;
      break;
    case "historicityStatus":
      current.historicityStatus = parseHistoricityStatus(value);
      break;
    case "booksAppearingIn":
      current.booksAppearingIn = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "keySpeeches":
      current.keySpeeches = value
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "characterArc":
      current.characterArc = value;
      break;
    case "yearFromCreation":
      current.yearFromCreation = parseInt10(value);
      current.timelineAnchor = "creation";
      break;
    case "yearFromCreationEnd":
      current.yearFromCreationEnd = parseInt10(value);
      break;
    case "historicalYear":
      current.historicalYear = parseInt10(value);
      current.timelineAnchor = "historical";
      break;
    case "historicalYearEnd":
      current.historicalYearEnd = parseInt10(value);
      break;
    case "generationsFrom":
      current.generationsFrom = parseGenerationsFrom(value);
      break;
    case "regionsByText":
      current.regionsByText = parseRegionsByText(value);
      break;
    case "crossBookSee":
      current.crossBookSee = value;
      break;
    case "inBook":
      current.inBook = value;
      break;
  }
}

function flushCuriosity(state: ParseState): void {
  if (!state.curiosity || !state.current) return;
  const c = state.curiosity;
  if (!c.title || !c.claimType || !c.confidence || !c.content) {
    state.curiosity = null;
    return;
  }
  if (!state.current.curiosities) state.current.curiosities = [];
  state.current.curiosities.push({
    title: c.title,
    claimType: c.claimType,
    confidence: c.confidence,
    content: c.content,
    source: c.source,
  });
  state.curiosity = null;
}

function flushEntry(state: ParseState, entries: PersonEntry[]): void {
  flushCuriosity(state);
  if (state.current?.name) {
    const entry = finalizeEntry(state.current);
    if (entries.some((existing) => existing.slug === entry.slug)) {
      console.warn(
        `[people-parser] Duplicate slug "${entry.slug}" — entries "${entry.name}" and an earlier homonym will collide on slug-derived React keys and cross-references. Disambiguate by using a different transliteration form in the heading (e.g., source-language form for one + familiar form in parentheses).`,
      );
    }
    entries.push(entry);
  }
  state.current = null;
  state.inCuriosities = false;
}

export function parsePeopleMarkdown(raw: string, book: string): PeopleData {
  const lines = raw.split("\n");
  const entries: PersonEntry[] = [];
  const genealogies: GenealogyTable[] = [];
  const seenSlugs = new Set<string>();
  const state: ParseState = {
    current: null,
    inCuriosities: false,
    curiosity: null,
    gen: null,
    sourcesLines: null,
  };

  for (const line of lines) {
    // Entry boundary (H2) — also routes genealogy-table and sources sections.
    const entryMatch = line.match(ENTRY_HEADER);
    if (entryMatch) {
      const heading = entryMatch[1].trim();
      // Close whatever section was open before opening the next.
      flushEntry(state, entries);
      flushGenealogy(state, genealogies);
      state.sourcesLines = null;

      if (SOURCES_HEADING.test(heading)) {
        state.sourcesLines = [];
        continue;
      }
      if (GENEALOGY_HEADING.test(heading)) {
        state.gen = {
          title: heading.replace(GENEALOGY_TITLE_SUFFIX, "").trim(),
          headers: [],
          rows: [],
        };
        continue;
      }
      if (isSkipName(heading)) continue;

      // Parse "Name (Familiar) — Suffix" → name + familiarName + suffix.
      // Explicit `**Familiar name:**` field, if present below, overrides via line order.
      const suffixMatch = heading.match(/^(.+?)\s+[—–]\s+(.+)$/);
      const core = suffixMatch ? suffixMatch[1].trim() : heading;
      const suffix = suffixMatch ? suffixMatch[2].trim() : undefined;
      const parenMatch = core.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
      const name = parenMatch ? parenMatch[1].trim() : core;
      const familiarName = parenMatch ? parenMatch[2].trim() : undefined;
      // Disambiguate homonyms (e.g. two "Lemekh") via the suffix so slugs stay
      // unique. A true collision with no suffix to disambiguate is left to the
      // flushEntry duplicate-slug warning (authors fix it via the heading) —
      // do not silently auto-slug, which would mask the authoring issue.
      const baseSlug = name.toLowerCase().replace(/\s+/g, "-");
      let slug = baseSlug;
      if (suffix && seenSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}`;
      }
      seenSlugs.add(slug);
      state.current = {
        name,
        familiarName,
        suffix,
        slug,
        originType: "UNCERTAIN",
        mentionedIn: [],
        rawFields: [],
      };
      continue;
    }

    // Accumulate the sources section verbatim until the next H2 / EOF.
    if (state.sourcesLines) {
      state.sourcesLines.push(line);
      continue;
    }

    // Accumulate a genealogy summary table.
    if (state.gen) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const noteMatch = line.match(FIELD_LINE);
      if (noteMatch && NOTE_LABELS.has(normalizeLabel(noteMatch[1]))) {
        state.gen.note = noteMatch[2].trim();
        continue;
      }
      if (trimmed.startsWith("|")) {
        const cells = parseTableRow(line);
        if (isTableSeparator(cells)) continue;
        if (state.gen.headers.length === 0) state.gen.headers = cells;
        else state.gen.rows.push(cells);
        continue;
      }
      // First plain-text line before the table is the caption ("All dates AM …").
      if (state.gen.headers.length === 0 && !state.gen.caption) {
        state.gen.caption = trimmed;
      }
      continue;
    }

    if (!state.current) continue;

    // H3 — subsection within an entry
    const subMatch = line.match(SUBSECTION_HEADER);
    if (subMatch) {
      flushCuriosity(state);
      state.inCuriosities = isCuriosityHeading(subMatch[1]);
      continue;
    }

    // H4 — only meaningful inside a Curiosities subsection
    const curMatch = line.match(CURIOSITY_HEADER);
    if (curMatch) {
      if (state.inCuriosities) {
        flushCuriosity(state);
        state.curiosity = { title: curMatch[1].trim() };
      }
      continue;
    }

    // Field line
    const fieldMatch = line.match(FIELD_LINE);
    if (!fieldMatch) continue;
    const labelRaw = fieldMatch[1];
    const value = fieldMatch[2].trim();

    // Inside a curiosity, fields populate the curiosity, not the entry
    if (state.inCuriosities && state.curiosity) {
      const norm = normalizeLabel(labelRaw);
      if (
        norm === "claim type" ||
        norm === "tipo de afirmação" ||
        norm === "anspruchstyp" ||
        norm === "tipo de afirmación"
      ) {
        state.curiosity.claimType = parseClaimType(stripBold(value));
      } else if (
        norm === "confidence" ||
        norm === "confiança" ||
        norm === "konfidenz" ||
        norm === "confianza"
      ) {
        state.curiosity.confidence = parseConfidence(stripBold(value));
      } else if (
        norm === "content" ||
        norm === "conteúdo" ||
        norm === "inhalt" ||
        norm === "contenido"
      ) {
        state.curiosity.content = value;
      } else if (
        norm === "source" ||
        norm === "fonte" ||
        norm === "quelle" ||
        norm === "fuente"
      ) {
        state.curiosity.source = value;
      }
      continue;
    }

    // The "Note" field is lifted to its own slot (rendered as a wide field),
    // matching the prototype — not part of the generic field list.
    if (NOTE_LABELS.has(normalizeLabel(labelRaw))) {
      state.current.note = value;
      continue;
    }

    // Otherwise, dispatch to the typed field (drives timeline/sort) …
    const fieldId = resolveField(labelRaw);
    if (fieldId) {
      applyField(state.current, fieldId, value);
    }
    // … and preserve it verbatim for the generic card render. The cross-book
    // "See:" pointer renders as a link from its typed slot, so keep it out of
    // the generic list to avoid a duplicate raw row.
    if (fieldId !== "crossBookSee") {
      if (!state.current.rawFields) state.current.rawFields = [];
      state.current.rawFields.push({ label: labelRaw.trim(), value });
    }
  }

  // Flush trailing entry/curiosity/genealogy/sources.
  flushEntry(state, entries);
  flushGenealogy(state, genealogies);

  const sources = state.sourcesLines?.join("\n").trim() || undefined;

  return {
    book,
    entries,
    genealogies: genealogies.length > 0 ? genealogies : undefined,
    sources,
  };
}

function finalizeEntry(raw: Partial<PersonEntry>): PersonEntry {
  return {
    slug: raw.slug || raw.name?.toLowerCase().replace(/\s+/g, "-") || "",
    name: raw.name || "",
    familiarName: raw.familiarName,
    suffix: raw.suffix,
    rawFields: raw.rawFields,
    note: raw.note,
    nameMeaning: raw.nameMeaning,
    originType: raw.originType || "UNCERTAIN",
    birthYear: raw.birthYear,
    deathYear: raw.deathYear,
    lifespan: raw.lifespan,
    father: raw.father,
    mother: raw.mother,
    spouses: raw.spouses,
    children: raw.children,
    siblings: raw.siblings,
    locations: raw.locations,
    firstMention: raw.firstMention || "",
    mentionedIn: raw.mentionedIn || [],
    keyEvents: raw.keyEvents,
    profession: raw.profession,
    socialClass: raw.socialClass,
    hometown: raw.hometown,
    placesLived: raw.placesLived,
    ageAtFatherhood: raw.ageAtFatherhood,
    causeOfDeath: raw.causeOfDeath,
    languagesSpoken: raw.languagesSpoken,
    inLaws: raw.inLaws,
    archaeologicalEvidence: raw.archaeologicalEvidence,
    extraBiblicalMentions: raw.extraBiblicalMentions,
    historicityStatus: raw.historicityStatus,
    booksAppearingIn: raw.booksAppearingIn,
    keySpeeches: raw.keySpeeches,
    verseCount: raw.verseCount,
    characterArc: raw.characterArc,
    timelineAnchor: raw.timelineAnchor,
    yearFromCreation: raw.yearFromCreation,
    yearFromCreationEnd: raw.yearFromCreationEnd,
    historicalYear: raw.historicalYear,
    historicalYearEnd: raw.historicalYearEnd,
    curiosities: raw.curiosities,
    generationsFrom: raw.generationsFrom,
    regionsByText: raw.regionsByText,
    crossBookSee: raw.crossBookSee,
    inBook: raw.inBook,
  };
}
