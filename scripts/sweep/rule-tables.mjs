// RULES-HB / RULES-GS table extraction. Proper-name tables (PLAN_CONTENT_SWEEP.md
// S5a; D11: the single source of truth for names) and every glossary table cell
// (S21: the locked renderings that `{t:}` / `{a:}` markers may carry).

const LOCALE_COLS = {
  en: "EN Familiar",
  "pt-br": "PT Familiar",
  de: "DE Familiar",
  es: "ES Familiar",
};

/**
 * Parse every markdown table under a "PROPER-NAME TABLE" H2 that has a
 * "Transliterated" column. A table section that yields zero rows is an error
 * (a reformatted table must not silently empty the canon).
 * @returns {{source:string, kind:string, translit:string, familiar:Record<string,string>}[]}
 */
export function extractNameTables(markdown, source) {
  const lines = markdown.split("\n");
  const rows = [];
  let inNames = false;
  let kind = "";
  let header = null;
  let tables = 0;
  for (const line of lines) {
    if (/^## /.test(line)) {
      inNames = /PROPER-NAME TABLE/i.test(line);
      header = null;
      continue;
    }
    if (!inNames) continue;
    const h3 = line.match(/^### (.+)$/);
    if (h3) {
      kind = h3[1].trim();
      header = null;
      continue;
    }
    if (!line.startsWith("|")) {
      header = null;
      continue;
    }
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (!header) {
      if (cells.includes("Transliterated")) {
        header = cells;
        tables++;
      }
      continue;
    }
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue;
    const col = (name) => cells[header.indexOf(name)] ?? "";
    /** @type {Record<string, string>} */
    const familiar = {};
    for (const [loc, name] of Object.entries(LOCALE_COLS)) {
      const v = col(name);
      if (v && v !== "—") familiar[loc] = v;
    }
    rows.push({ source, kind, translit: col("Transliterated"), familiar });
  }
  if (tables === 0)
    throw new Error(
      `${source}: no proper-name table with a "Transliterated" column`,
    );
  if (rows.length === 0)
    throw new Error(`${source}: proper-name tables parsed to 0 rows`);
  return rows;
}

/**
 * Every cell of every markdown table, lowercased, emphasis stripped (the locked
 * renderings: "wind/spirit", "tebah", …); a cell "head (gloss)" also contributes
 * "head" and "gloss". Throws on a document with no tables.
 * @returns {Set<string>}
 */
export function extractTableCells(markdown, source) {
  const cells = new Set();
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("|")) continue;
    for (const c of line.split("|").slice(1, -1)) {
      const v = c.replace(/\*/g, "").trim().toLowerCase();
      if (!v || /^:?-+:?$/.test(v)) continue;
      // "tebah (ark/vessel)" locks both the head form and the parenthesized gloss
      cells.add(v);
      cells.add(v.replace(/\s*\([^)]*\)/g, "").trim());
      for (const m of v.matchAll(/\(([^)]*)\)/g)) cells.add(m[1].trim());
    }
  }
  if (!cells.size) throw new Error(`${source}: no markdown tables`);
  return cells;
}
