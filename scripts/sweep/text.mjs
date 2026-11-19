// Text helpers for the content sweep: Unicode word boundaries, use/mention,
// sentence-start detection, marker extraction.

// JS `\b` is ASCII-only even with the `u` flag ("é" is not a word char), so all
// sweep regexes use these Unicode lookarounds instead. Decimal digits only
// (\p{Nd}): verse superscripts (¹²…, category No) must NOT block a match at
// the start of a verse in the continuous reading.
const WB_L = "(?<![\\p{L}\\p{M}\\p{Nd}_])";
const WB_R = "(?![\\p{L}\\p{M}\\p{Nd}_])";

/** Whole-word regex from a source fragment (global, Unicode). */
export const word = (src, flags = "gu") =>
  new RegExp(`${WB_L}(?:${src})${WB_R}`, flags);

export const stripAccents = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .normalize("NFC");

/** True when the line is a heading or (letters-wise) all caps — e.g. note titles "**THE SON OF MAN**". */
export function isCapsLine(line) {
  const letters = line.replace(/[^\p{L}]/gu, "");
  return letters.length >= 4 && letters === letters.toUpperCase();
}

/**
 * Is the match part of an all-caps run (note titles like "THE EYES OF THE
 * LORD", "**CRÍTICO — DIOS SE ACORDÓ**")? A neighbouring all-caps word of ≥ 2
 * letters means the capitals are typographic, not a rendering.
 */
export function inCapsRun(line, idx, len) {
  const before = line.slice(0, idx).match(/([\p{L}]+)[^\p{L}]*$/u)?.[1] ?? "";
  const after = line.slice(idx + len).match(/^[^\p{L}]*([\p{L}]+)/u)?.[1] ?? "";
  // acronyms that sit next to a real rendering ("the LORD (YHWH)") are not a caps run
  const ACRONYM =
    /^(?:YHWH|JHWH|TT|NA|BHS|LXX|MT|DE|EN|PT|ES|BR|CE|BCE|AEC|EC|NT|OT|AT|HB|GS)$/;
  const caps = (w) =>
    w.length >= 2 &&
    w === w.toUpperCase() &&
    w !== w.toLowerCase() &&
    !ACRONYM.test(w);
  return caps(before) || caps(after);
}

/** Does the match at `idx` start a sentence (Rule 20 allows a capital there)? */
export function isSentenceStart(line, idx) {
  const before = line
    .slice(0, idx)
    .replace(/[*_@]|\{[at]:/g, "")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, "");
  return /(^|[.!?:;—–]\s*|^\s*(?:>\s*)?(?:[-*]\s+)?)["“„«‚'‘([]*\s*$/.test(
    before,
  );
}

const NEGATORS = [
  "not",
  "NOT",
  "rather than",
  "instead of",
  "never",
  "não",
  "NÃO",
  "em vez de",
  "ao invés de",
  "nunca",
  "nicht",
  "NICHT",
  "statt",
  "anstatt",
  "nie",
  "kein",
  "keine",
  "no",
  "NO",
  "en lugar de",
  "en vez de",
  "jamás",
];
const NEG_RE = new RegExp(
  `(?:^|[^\\p{L}])(?:${NEGATORS.join("|")})[^\\p{L}][^.;]{0,40}$`,
  "u",
);
const QUOTE_PAIRS = [
  ["“", "”"],
  ["„", "“"],
  ["«", "»"],
];

/**
 * use / mention classifier (PLAN §4). In TT-voice prose a form is *mentioned*
 * when it is quoted or negated ("NOT 'only-begotten'", "rather than eternal
 * life"); otherwise it is *used*. Reading-text hits (verse translation and
 * continuous reading) are always `use` — speech in quotes is still the
 * rendering. Reported, never used to filter.
 */
export function classifyUseMention(line, idx, zone) {
  if (zone === "main" || zone === "cr") return "use";
  const before = line.slice(0, idx);
  if (NEG_RE.test(before)) return "mention";
  if ((before.match(/"/g) ?? []).length % 2 === 1) return "mention";
  for (const [open, close] of QUOTE_PAIRS) {
    const o = before.lastIndexOf(open);
    if (o >= 0 && before.lastIndexOf(close) < o) return "mention";
  }
  // single-asterisk italics in prose are the conventional "cited form" style in notes
  if (/(?<!\*)\*[^*\s][^*]*$/.test(before)) return "mention";
  return "use";
}

/** Italic spans (`*x*`, not `**x**`) in a string. */
export function italicSpans(s) {
  const t = s.replace(/\*\*\*/g, "\uE000").replace(/\*\*/g, "\uE001");
  const out = [];
  const re = /\*([^*\n\uE000\uE001]+?)\*/g;
  for (const m of t.matchAll(re))
    out.push(m[1].replace(/[\uE000\uE001]/g, "").trim());
  return out;
}

/** Normalize prose for cross-rendering comparison (whitespace, verse superscripts). */
export const norm = (s) =>
  s
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Text covered by `@@…@@` per verse. `chunks` is an ordered [verse, text][]
 * list; open/close state carries across chunks when `carry` (continuous
 * reading, where one quote spans several verses) and resets per chunk
 * otherwise (verse-by-verse). Returns { covered: Map<verse,string>, unbalanced: verse[] }.
 */
export function divineCoverage(chunks, carry) {
  const covered = new Map();
  const unbalanced = [];
  let open = false;
  for (const [verse, text] of chunks) {
    if (!carry) open = false;
    const parts = text.split("@@");
    let acc = "";
    parts.forEach((p, i) => {
      if (i > 0) open = !open; // each @@ toggles; parts[0] inherits the carried state
      if (open) acc += ` ${p}`;
    });
    covered.set(verse, norm(acc.replace(/["“”„«»]/g, "")));
    if (!carry && open) unbalanced.push(verse);
  }
  if (carry && open) unbalanced.push("end");
  return { covered, unbalanced };
}
