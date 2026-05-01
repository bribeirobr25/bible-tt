import type {
  OriginType,
  PeopleData,
  PersonEntry,
} from "@/domain/content/types";

const ENTRY_HEADER = /^## (.+)$/;
const FIELD_LINE = /^\*\*(.+?):\*\*\s*(.+)$/;

function parseOriginType(raw: string): OriginType {
  const n = raw.trim().toUpperCase();
  if (n.includes("BORN") || n.includes("NASCIDO") || n.includes("NASCIDA") || n.includes("GEBOREN") || n.includes("NACIDO") || n.includes("NACIDA")) return "BORN";
  if (n.includes("CREATED") || n.includes("CRIADO") || n.includes("CRIADA") || n.includes("ERSCHAFFEN") || n.includes("CREADO") || n.includes("CREADA")) return "CREATED";
  if (n.includes("APPEARS") || n.includes("APARECE") || n.includes("ERSCHEINT")) return "APPEARS";
  return "UNCERTAIN";
}

export function parsePeopleMarkdown(
  raw: string,
  book: string,
): PeopleData {
  const lines = raw.split("\n");
  const entries: PersonEntry[] = [];
  let current: Partial<PersonEntry> | null = null;

  for (const line of lines) {
    const entryMatch = line.match(ENTRY_HEADER);
    if (entryMatch) {
      if (current && current.name) {
        entries.push(finalizeEntry(current));
      }
      const name = entryMatch[1].trim();
      current = {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        originType: "UNCERTAIN",
        mentionedIn: [],
      };
      continue;
    }

    if (!current) continue;

    const fieldMatch = line.match(FIELD_LINE);
    if (fieldMatch) {
      const key = fieldMatch[1].trim().toLowerCase();
      const value = fieldMatch[2].trim();

      if (key.includes("meaning") || key.includes("significado") || key.includes("bedeutung")) {
        current.nameMeaning = value;
      } else if (key.includes("origin") || key.includes("origem") || key.includes("ursprung") || key.includes("herkunft") || key.includes("origen")) {
        current.originType = parseOriginType(value);
      } else if (key.includes("birth") || key.includes("nascimento") || key.includes("geburt") || key.includes("nacimiento")) {
        current.birthYear = value;
      } else if (key.includes("death") || key.includes("morte") || key.includes("tod") || key.includes("muerte")) {
        current.deathYear = value;
      } else if (key.includes("lifespan") || key.includes("vida") || key.includes("lebensdauer")) {
        current.lifespan = value;
      } else if (key.includes("father") || key.includes("pai") || key.includes("vater") || key.includes("padre")) {
        current.father = value;
      } else if (key.includes("mother") || key.includes("mãe") || key.includes("mutter") || key.includes("madre")) {
        current.mother = value;
      } else if (key.includes("spouse") || key.includes("cônjuge") || key.includes("ehepartner") || key.includes("cónyuge")) {
        current.spouses = value.split(",").map((s) => s.trim());
      } else if (key.includes("children") || key.includes("filhos") || key.includes("kinder") || key.includes("hijos")) {
        current.children = value.split(",").map((s) => s.trim());
      } else if (key.includes("location") || key.includes("local") || key.includes("ort") || key.includes("ubicación")) {
        current.locations = value.split(",").map((s) => s.trim());
      } else if (key.includes("first mention") || key.includes("primeira menção") || key.includes("erste erwähnung") || key.includes("primera mención")) {
        current.firstMention = value;
      } else if (key.includes("mentioned in") || key.includes("mencionado em") || key.includes("erwähnt in") || key.includes("mencionado en")) {
        current.mentionedIn = value.split(",").map((s) => s.trim());
      } else if (key.includes("key events") || key.includes("eventos") || key.includes("ereignisse")) {
        current.keyEvents = value.split(";").map((s) => s.trim());
      }
    }
  }

  if (current && current.name) {
    entries.push(finalizeEntry(current));
  }

  return { book, entries };
}

function finalizeEntry(raw: Partial<PersonEntry>): PersonEntry {
  return {
    slug: raw.slug || raw.name?.toLowerCase().replace(/\s+/g, "-") || "",
    name: raw.name || "",
    nameMeaning: raw.nameMeaning,
    originType: raw.originType || "UNCERTAIN",
    birthYear: raw.birthYear,
    deathYear: raw.deathYear,
    lifespan: raw.lifespan,
    father: raw.father,
    mother: raw.mother,
    spouses: raw.spouses,
    children: raw.children,
    locations: raw.locations,
    firstMention: raw.firstMention || "",
    mentionedIn: raw.mentionedIn || [],
    keyEvents: raw.keyEvents,
  };
}
