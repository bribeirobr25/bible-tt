type MarkdownSubset = "prose" | "note";

/**
 * Optional render context. `locale` turns "Rule N" references in content prose
 * into links to the rules page (`/{locale}/rules#rule-N`, Decision L5). Callers
 * that render titles, scripture, UI strings or text already inside a link pass
 * nothing, so no link is emitted (no nested `<a>`).
 */
export interface RenderOptions {
  locale?: string;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Emphasis ──────────────────────────────────────────────────────────────
// A CommonMark-style delimiter-run pass (spec §6.2 "process emphasis"),
// limited to `*` and applied per line, so emphasis never crosses a newline.
// Flanking decides which runs may open or close: a run after a letter and
// before punctuation (`א*,`, `B*;`) is right-flanking only, so a manuscript
// siglum can never open an italic span; a run between two letters (`n*a*`)
// may do both, so intra-word italics still work. Unmatched runs stay literal.

const PUNCT = /[\p{P}\p{S}]/u;
const SPACE = /\s/u;

interface Delim {
  /** index into the token list */
  idx: number;
  /** stars still unused */
  count: number;
  /** original run length (for the rule of 3) */
  orig: number;
  canOpen: boolean;
  canClose: boolean;
  /** opening tags (this run acted as an opener), innermost first */
  openTags: string[];
  /** closing tags (this run acted as a closer), innermost first */
  closeTags: string[];
  active: boolean;
}

function charBefore(line: string, i: number): string {
  if (i <= 0) return " ";
  const cp = line.codePointAt(i - 1) ?? 32;
  // step back over a surrogate pair
  if (i >= 2 && cp >= 0xdc00 && cp <= 0xdfff) {
    return String.fromCodePoint(line.codePointAt(i - 2) ?? 32);
  }
  return String.fromCodePoint(cp);
}

function charAfter(line: string, i: number): string {
  if (i >= line.length) return " ";
  return String.fromCodePoint(line.codePointAt(i) ?? 32);
}

function emphasizeLine(line: string): string {
  if (!line.includes("*")) return line;

  const tokens: string[] = [];
  const delims: Delim[] = [];
  let i = 0;
  let text = "";
  while (i < line.length) {
    if (line[i] !== "*") {
      text += line[i];
      i++;
      continue;
    }
    let j = i;
    while (j < line.length && line[j] === "*") j++;
    const before = charBefore(line, i);
    const after = charAfter(line, j);
    const beforeSpace = SPACE.test(before);
    const afterSpace = SPACE.test(after);
    const beforePunct = PUNCT.test(before);
    const afterPunct = PUNCT.test(after);
    // A single `*` before punctuation may open only after a space or
    // punctuation (CommonMark), so a siglum `א*,` stays literal. A `**` run is
    // never a siglum: it opens before any non-space, so authored alternations
    // like `**"… (**ἐγκόπτεσθαι**)."**` keep pairing as they always have.
    const leftFlanking =
      !afterSpace && (j - i >= 2 || !afterPunct || beforeSpace || beforePunct);
    // Closing is deliberately more permissive than CommonMark: any run after a
    // non-space may close, so authored shapes like `**Noach (Noah)**s` and
    // `*disse-*lhes` keep closing as they always have. Opening stays strict —
    // that is what keeps sigla (`א*,`) literal.
    const rightFlanking = !beforeSpace;
    if (text) {
      tokens.push(text);
      text = "";
    }
    tokens.push("");
    delims.push({
      idx: tokens.length - 1,
      count: j - i,
      orig: j - i,
      canOpen: leftFlanking,
      canClose: rightFlanking,
      openTags: [],
      closeTags: [],
      active: true,
    });
    i = j;
  }
  if (text) tokens.push(text);

  for (let c = 0; c < delims.length; c++) {
    const closer = delims[c];
    if (!closer.canClose) continue;
    while (closer.count > 0) {
      let o = c - 1;
      let opener: Delim | undefined;
      for (; o >= 0; o--) {
        const d = delims[o];
        if (!d.active || !d.canOpen || d.count === 0) continue;
        // Rule of 3: a run that can both open and close does not pair with
        // another when their lengths sum to a multiple of 3 (unless both are).
        const oddMatch =
          (d.canClose || closer.canOpen) &&
          (d.orig + closer.orig) % 3 === 0 &&
          !(d.orig % 3 === 0 && closer.orig % 3 === 0);
        if (oddMatch) continue;
        opener = d;
        break;
      }
      if (!opener) break;
      // `***x***` keeps the historical strong-outside nesting.
      const use =
        opener.count >= 2 && closer.count >= 2
          ? opener.count === 3 && closer.count === 3
            ? 1
            : 2
          : 1;
      const tag = use === 2 ? "strong" : "em";
      opener.openTags.push(`<${tag}>`);
      closer.closeTags.push(`</${tag}>`);
      opener.count -= use;
      closer.count -= use;
      // Runs between a matched pair can no longer pair across it.
      for (let k = o + 1; k < c; k++) delims[k].active = false;
      if (opener.count === 0) opener.active = false;
    }
    if (closer.count === 0) closer.active = false;
  }

  for (const d of delims) {
    // A run closes spans on its left and opens spans on its right; its unused
    // stars sit between (outermost of both). Opening tags read outermost →
    // innermost, so the innermost-first list is reversed.
    tokens[d.idx] =
      d.closeTags.join("") +
      "*".repeat(d.count) +
      [...d.openTags].reverse().join("");
  }
  return tokens.join("");
}

/**
 * The single bold/italic emphasis pass, shared by every render path (table
 * cells, `renderInlineSafe`, and both `renderMarkdownSafe` subsets) so the
 * behavior cannot drift between them. Linear in practice; malformed or
 * unbalanced markers stay literal.
 */
function applyEmphasis(html: string): string {
  return html.split("\n").map(emphasizeLine).join("\n");
}

// ── Rule references (Decision L5) ─────────────────────────────────────────
// "Rule 30" / "Rule-30" and the PT/DE/ES forms, N = 1–30, link to the rules
// page card `#rule-N`. Runs on escaped text before markers and emphasis, so it
// never sees a tag.
const RULE_REF = /\b(Rule|Regra|Regel|Regla)([ -])(\d{1,2})\b/g;

function linkRuleRefs(html: string, locale: string): string {
  const safeLocale = encodeURIComponent(locale);
  return html.replace(RULE_REF, (match, word, sep, num) => {
    const n = Number(num);
    if (n < 1 || n > 30) return match;
    return `<a class="tt-ruleref" href="/${safeLocale}/rules#rule-${n}">${word}${sep}${num}</a>`;
  });
}

// ── Tables ────────────────────────────────────────────────────────────────
function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

const isSeparator = (line: string) => /^\|[-\s|:]+\|$/.test(line.trim());

function convertTable(tableBlock: string, opts?: RenderOptions): string {
  const lines = tableBlock.split("\n").filter((l) => l.trim().startsWith("|"));
  if (lines.length < 2) return escapeHtml(tableBlock);

  // Empty cells are kept (audit B3): a blank cell holds its column.
  const headers = splitRow(lines[0]);
  const dataLines = lines.filter((l) => !isSeparator(l)).slice(1);

  let html =
    '<div class="overflow-x-auto my-3"><table class="w-full text-sm border-collapse">';
  html += "<thead><tr>";
  for (const h of headers) {
    html += `<th class="text-left px-3 py-2 border-b-2 border-border font-semibold text-text-secondary text-xs uppercase tracking-wider">${renderInlineSafe(
      h,
      opts,
    )}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (const row of dataLines.map(splitRow)) {
    html += "<tr>";
    for (let i = 0; i < headers.length; i++) {
      const cell = row[i] ?? "";
      html += `<td class="px-3 py-2 border-b border-border-muted text-text-primary">${renderInlineSafe(
        cell,
        opts,
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
 * bold/italic pass so `*added*` words inside a `@@divine@@` span still resolve.
 * No marker crosses a newline; an unbalanced marker stays literal.
 *
 *   {t:raqia}        → transliterated strategic term (Rule 4)  → .term   (teal)
 *   {a:wind/spirit}  → preserved ambiguity (Rule 2)            → .ambig  (bold, body colour)
 *   @@…@@            → direct divine speech (Rule 30)          → .divine (red, not bold)
 *
 * `*word*` (added words, Rule 11) keeps the standard italic pass below.
 */
function applyHighlightMarkers(html: string): string {
  return html
    .replace(/\{t:([^}\n]*)\}/g, '<span class="term">$1</span>')
    .replace(/\{a:([^}\n]*)\}/g, '<span class="ambig">$1</span>')
    .replace(/@@([^\n]*?)@@/g, '<span class="divine">$1</span>');
}

export function renderInlineSafe(text: string, opts?: RenderOptions): string {
  let html = escapeHtml(text);
  if (opts?.locale) html = linkRuleRefs(html, opts.locale);
  html = applyHighlightMarkers(html);
  html = applyEmphasis(html);
  return html;
}

export function renderMarkdownSafe(
  text: string,
  subset: MarkdownSubset,
  opts?: RenderOptions,
): string {
  // Strip code fences
  let cleaned = text.replace(/```[\s\S]*?```/g, "");

  // Strip horizontal rules
  cleaned = cleaned.replace(/^---$/gm, "");

  // Extract and convert tables (cells are fully rendered here, once).
  const tablePattern = /(?:^|\n)((?:\|[^\n]+\|\n?)+)/g;
  const tables: string[] = [];

  cleaned = cleaned.replace(tablePattern, (match) => {
    const placeholder = `__TABLE_${tables.length}__`;
    tables.push(convertTable(match.trim(), opts));
    return `\n${placeholder}\n`;
  });

  let html = escapeHtml(cleaned);
  if (opts?.locale) html = linkRuleRefs(html, opts.locale);

  // TT highlight markers ({t:…}, {a:…}, @@…@@) → styled spans, before bold/italic.
  html = applyHighlightMarkers(html);
  html = applyEmphasis(html);

  // Re-insert tables AFTER the marker/emphasis passes, so an asterisk in a cell
  // can never pair with one outside the table; a function replacer keeps `$&`
  // and friends in cell text literal.
  html = html.replace(/__TABLE_(\d+)__/g, (m, n) => tables[Number(n)] ?? m);

  if (subset === "note") {
    html = html.replace(/\n- /g, "<br/>• ");
    html = html.replace(/\n/g, "<br/>");
  } else {
    html = html.replace(/\n/g, " ");
  }

  return html;
}
