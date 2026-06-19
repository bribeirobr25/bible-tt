type MarkdownSubset = "prose" | "note";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * The single bold/italic emphasis pass, shared by every render path (table
 * cells, `renderInlineSafe`, and both `renderMarkdownSafe` subsets) so the
 * behavior cannot drift between them. Bold runs before italic so an italic
 * nested inside bold resolves after the `<strong>` wrapper is in place.
 *
 * The bold pattern is *tempered*: its content is a sequence of either a
 * non-asterisk char `[^*]` or a well-formed inner italic `\*[^*]+\*`. This lets
 * one level of italic nest inside bold (`**label *term*:**` →
 * `<strong>label <em>term</em>:</strong>`), including the trailing-italic shape
 * `**a *b***`. The two alternatives are mutually exclusive on their first char,
 * so matching is linear (no catastrophic backtracking). Malformed/unbalanced
 * markers fall through to literal text, as before.
 */
function applyEmphasis(html: string): string {
  return html
    .replace(/\*\*((?:[^*]|\*[^*]+\*)+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function convertTable(tableBlock: string): string {
  const lines = tableBlock.split("\n").filter((l) => l.trim().startsWith("|"));
  if (lines.length < 2) return escapeHtml(tableBlock);

  const parseRow = (line: string) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

  const isSeparator = (line: string) => /^\|[-\s|:]+\|$/.test(line.trim());

  const headers = parseRow(lines[0]);
  const dataLines = lines.filter((l) => !isSeparator(l)).slice(1);

  let html =
    '<div class="overflow-x-auto my-3"><table class="w-full text-sm border-collapse">';
  html += "<thead><tr>";
  for (const h of headers) {
    html += `<th class="text-left px-3 py-2 border-b-2 border-border font-semibold text-text-secondary text-xs uppercase tracking-wider">${escapeHtml(h)}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (const row of dataLines.map(parseRow)) {
    html += "<tr>";
    for (let i = 0; i < headers.length; i++) {
      const cell = row[i] || "";
      html += `<td class="px-3 py-2 border-b border-border-muted text-text-primary">${applyEmphasis(
        escapeHtml(cell),
      )}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table></div>";
  return html;
}

/**
 * Converts the TT text-highlight markers (authored in content) into styled
 * spans. Run AFTER escapeHtml so the emitted spans survive, and BEFORE the
 * bold/italic passes so `*added*` words inside a `@@divine@@` span still resolve.
 *
 *   {t:raqia}        → transliterated strategic term (Rule 4)   → .term  (teal)
 *   {a:wind/spirit}  → preserved ambiguity (Rule 2)             → .ambig (ochre)
 *   @@…@@            → direct divine speech (Rule 30)           → .divine (red)
 *
 * `*word*` (added words, Rule 11) keeps the standard italic pass below.
 */
function applyHighlightMarkers(html: string): string {
  return html
    .replace(/\{t:([^}]*)\}/g, '<span class="term">$1</span>')
    .replace(/\{a:([^}]*)\}/g, '<span class="ambig">$1</span>')
    .replace(/@@([\s\S]*?)@@/g, '<span class="divine">$1</span>');
}

export function renderInlineSafe(text: string): string {
  let html = escapeHtml(text);
  html = applyHighlightMarkers(html);
  html = applyEmphasis(html);
  return html;
}

export function renderMarkdownSafe(
  text: string,
  subset: MarkdownSubset,
): string {
  // Strip code fences
  let cleaned = text.replace(/```[\s\S]*?```/g, "");

  // Strip horizontal rules
  cleaned = cleaned.replace(/^---$/gm, "");

  // Extract and convert tables
  const tablePattern = /(?:^|\n)((?:\|[^\n]+\|\n?)+)/g;
  const tables: { placeholder: string; html: string }[] = [];
  let tableIdx = 0;

  cleaned = cleaned.replace(tablePattern, (match) => {
    const placeholder = `__TABLE_${tableIdx}__`;
    tables.push({ placeholder, html: convertTable(match.trim()) });
    tableIdx++;
    return `\n${placeholder}\n`;
  });

  // Escape HTML in non-table content
  let html = escapeHtml(cleaned);

  // Re-insert tables (they were already escaped internally)
  for (const { placeholder, html: tableHtml } of tables) {
    html = html.replace(escapeHtml(placeholder), tableHtml);
  }

  // TT highlight markers ({t:…}, {a:…}, @@…@@) → styled spans, before bold/italic.
  html = applyHighlightMarkers(html);

  html = applyEmphasis(html);
  if (subset === "note") {
    html = html.replace(/\n- /g, "<br/>• ");
    html = html.replace(/\n/g, "<br/>");
  } else {
    html = html.replace(/\n/g, " ");
  }

  return html;
}
