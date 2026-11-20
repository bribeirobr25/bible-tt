// Content-sweep checks (PLAN_CONTENT_SWEEP.md §4). Each per-file check gets a
// FileCtx { path, locale, book, lines, zones } and an `add(hit)` sink.
// Findings are data: a check never throws on content, only on tool failure.
//
// Reading-text policy (plan review R-2): every verse exists twice — continuous
// reading (`cr`) and verse translation (`main`). Lexical checks judge `main`
// only (one hit per verse); `cr` is compared against `main` by S6a/S6e/S7d, so a
// divergent copy is still caught. Fixing a `main` hit means editing both copies.
// Inline code is NOT masked (review R-1): the renderer shows backticks
// literally and still processes markers inside them.

import {
  classifyUseMention,
  divineCoverage,
  inCapsRun,
  isCapsLine,
  isSentenceStart,
  italicSpans,
  norm,
  stripAccents,
  word,
} from "./text.mjs";
import { continuousByVerse, isChapterFile, studyByVerse } from "./zones.mjs";

export const NT = new Set([
  "matthew",
  "mark",
  "luke",
  "john",
  "acts",
  "1-peter",
]);
/** Zones whose text a reader sees as TT prose (not counting `cr`, see above). */
const READER = new Set([
  "toc",
  "guide",
  "overview",
  "main",
  "note",
  "apparatus",
]);
const MAIN = new Set(["main"]);
const TT_VOICE = new Set(["guide", "overview", "note", "apparatus"]);

/** The Reading-Guide legend lines legitimately show the markers they explain. */
const LEGEND = /^\s*-\s*(?:@@"…"@@|\{a:[^}]*\}|\{t:[^}]*\}|\*[^*]+\*)\s+[—–-]/;
const isLegend = (ctx, i) =>
  ctx.zones[i].zone === "guide" && LEGEND.test(ctx.lines[i]);

/** isCapsLine, memoized per file (it dominated the runtime). */
function capsLine(ctx, i) {
  ctx._caps ??= ctx.lines.map(isCapsLine);
  return ctx._caps[i];
}

/** Iterate every regex match on lines of the given zones (rendered or not — the hit carries the render state). */
function* matches(ctx, re, { zones = READER, skipCaps = false } = {}) {
  for (let i = 0; i < ctx.lines.length; i++) {
    const z = ctx.zones[i];
    if (!zones.has(z.zone)) continue;
    const line = ctx.lines[i];
    if (skipCaps && (z.heading || capsLine(ctx, i))) continue;
    for (const m of line.matchAll(re)) {
      if (!(skipCaps && inCapsRun(line, m.index, m[0].length)))
        yield { i, m, line, zone: z.zone };
    }
  }
}

/** `main` (the rendering — a defect when the form is rejected) · `tt-voice` (TT's own prose uses it) · `mention` (quoted/negated). */
const voiceClass = (line, idx, zone) =>
  zone === "main"
    ? "main"
    : classifyUseMention(line, idx, zone) === "use"
      ? "tt-voice"
      : "mention";

const CONTEXT_MAX = 240;
export function makeHit(ctx, i, check, cls, match, idx) {
  const line = ctx.lines[i] ?? "";
  const start = Math.max(0, idx - 60);
  const end = Math.min(line.length, idx + match.length + 60);
  const context = `${start > 0 ? "…" : ""}${line.slice(start, end)}${end < line.length ? "…" : ""}`;
  const z = ctx.zones[i] ?? { zone: "front", render: "no" };
  return {
    check,
    cls,
    locale: ctx.locale,
    book: ctx.book,
    file: ctx.path,
    line: i + 1,
    zone: z.zone,
    render: z.render,
    match: match.slice(0, CONTEXT_MAX),
    context: context.replace(/\s+/g, " ").trim().slice(0, CONTEXT_MAX),
  };
}

// ---------------------------------------------------------------- S1 divine name
// Discussion of the convention itself (legitimate reader explanation) vs leak vs defect.
const CONVENTION_CUE =
  /tradition|translations? (?:substitut|print|render|use)|most (?:English )?(?:Bibles|translations)|substitu|Ersatz|ersetz|tradicion|tradução|traduções|traducciones|sustitu|small caps|versalit|em vez de|statt|en lugar de|instead of|collapsing to|(?:not|NOT|não|nicht|no)(?: als| como)? *["“„«]/i;
export function s1(ctx, add) {
  const pair =
    ctx.locale === "de" ? ["S1a", "YHWH\\p{L}*"] : ["S1b", "JHWH\\p{L}*"];
  for (const { i, m, line } of matches(ctx, word(pair[1]))) {
    const cls = /propaga|Propagier/i.test(line)
      ? "meta-leak"
      : /YHWH/.test(line) && /JHWH/.test(line)
        ? "convention-explanation"
        : ctx.locale === "de"
          ? "de-yhwh"
          : "jhwh-outside-de";
    add(makeHit(ctx, i, pair[0], cls, m[0], m.index));
  }
  // Rule 25 / HB glossary: never "LORD/SENHOR/HERR(N)/SEÑOR". Quoted OT text in TT voice is USE (review R-5).
  // Headings and all-caps titles are classified, not skipped (impl. review R2-2): a caps
  // title may hide a real "LORD" — or a typographic "lord" (κύριος of a human) — so it is a review class.
  for (const { i, m, line } of matches(
    ctx,
    word("LORD|SENHOR|HERR(?:N|EN)?|SEÑOR"),
  )) {
    const near = line.slice(Math.max(0, m.index - 80), m.index + 40);
    const caps =
      ctx.zones[i].heading ||
      capsLine(ctx, i) ||
      inCapsRun(line, m.index, m[0].length);
    add(
      makeHit(
        ctx,
        i,
        "S1c",
        CONVENTION_CUE.test(near)
          ? "convention-mention"
          : caps
            ? "caps-title"
            : "use",
        m[0],
        m.index,
      ),
    );
  }
}

// ---------------------------------------------------------------- S2 casing (Rule 20 / D8)
const SON_OF_MAN = {
  en: { re: word("[Ss]on of [Mm]an"), ok: "son of man" },
  "pt-br": { re: word("[Ff]ilho do [Hh]omem"), ok: "filho do homem" },
  es: { re: word("[Hh]ijo del [Hh]ombre"), ok: "hijo del hombre" },
};
export function s2a(ctx, add) {
  const spec = SON_OF_MAN[ctx.locale];
  if (!spec) return; // DE: noun capitalization is grammatical
  for (const { i, m, line, zone } of matches(ctx, spec.re, {
    skipCaps: true,
  })) {
    if (m[0] === spec.ok) continue;
    if (m[0].slice(1) === spec.ok.slice(1) && isSentenceStart(line, m.index))
      continue; // "Son of man, rise."
    add(makeHit(ctx, i, "S2a", voiceClass(line, m.index, zone), m[0], m.index));
  }
}

// Rule 20 (locked: common nouns lowercase) + GS glossary (λόγος lowercase in main text).
const CAPS_TERMS = {
  en: "Word|Spirit|Heaven|Heavens",
  "pt-br": "Verbo|Palavra|Espírito|Céu|Céus",
  es: "Verbo|Palabra|Espíritu|Cielo|Cielos",
};
// Not the divine/cosmic noun: the "Word Biblical Commentary" series / Word publisher,
// and PT/ES "Verbo" = the grammatical verb (glossary tables, TOC) — impl. review R3-5.
const S2B_NOT_TERM =
  /^(?:Word Biblical|Word Books|Word,|Word \(|Verbo (?:principal|finito|hebraico|grego|hebreo|griego)|Verbos\b)/;
const SOURCE_LINE = /\*\*(?:Fuentes?|Sources?|Fontes?|Quellen?):\*\*/;
export function s2b(ctx, add) {
  const t = CAPS_TERMS[ctx.locale];
  if (!t) return;
  for (const { i, m, line, zone } of matches(ctx, word(t), {
    skipCaps: true,
  })) {
    if (isSentenceStart(line, m.index)) continue;
    if (SOURCE_LINE.test(line) || S2B_NOT_TERM.test(line.slice(m.index)))
      continue;
    // a table cell starting with the word is a label, not running prose
    const cellStart =
      /^\s*\|/.test(line) && /\|\s*$/.test(line.slice(0, m.index));
    add(
      makeHit(
        ctx,
        i,
        "S2b",
        `${m[0]}:${cellStart ? "table-cell" : voiceClass(line, m.index, zone)}`,
        m[0],
        m.index,
      ),
    );
  }
}

// ---------------------------------------------------------------- S3 glossary
// [class, regex source]. GS terms judged in NT books, HB terms in Genesis;
// `firmament` corpus-wide (raqia is discussed outside Genesis too). πάσχα is
// locked "Pesach" in all four locales (RULES-GS; john.md rejects Passover/Páscoa/Pascua).
const GS_TERMS = {
  en: [
    ["only-begotten", "only[- ]begotten"],
    ["eternal-life", "eternal life"],
    ["repent", "[Rr]epent\\p{L}*"],
    ["gospel", "gospels?"],
    ["church", "[Cc]hurch(?:es)?"],
    ["baptize", "[Bb]aptis\\p{L}*|[Bb]aptiz\\p{L}*"],
    ["comforter", "Comforter"],
    ["pascha", "Passover|Easter"],
    // impl. review R2-4: πίστις locked trust/faithfulness; οἱ Ἰουδαῖοι locked "the Yehudim"
    ["pistis-faith", "[Ff]aith"],
    ["ioudaioi-jews", "Jews?"],
  ],
  "pt-br": [
    ["only-begotten", "unigênito"],
    ["eternal-life", "vida eterna"],
    ["repent", "[Aa]rrepend\\p{L}*"],
    ["gospel", "evangelhos?"],
    ["church", "[Ii]grejas?"],
    ["baptize", "[Bb]atiz\\p{L}*|[Bb]atism\\p{L}*|[Bb]atist\\p{L}*"],
    ["comforter", "Consolador"],
    ["pascha", "Páscoa"],
    ["pistis-faith", "[Ff]é"],
    ["ioudaioi-jews", "[Jj]udeus|[Jj]udeu"],
  ],
  de: [
    ["only-begotten", "eingeboren\\p{L}*"],
    ["eternal-life", "ewige[sn]? Leben\\p{L}*"],
    ["repent", "Buße|[Bb]ereu\\p{L}*|Umkehr"],
    ["gospel", "Evangelium|Evangelien"],
    ["church", "Kirche\\p{L}*"],
    ["baptize", "[Tt]auf\\p{L}*|Täufer\\p{L}*"],
    ["comforter", "Tröster"],
    ["pascha", "Passa|Passah|Ostern"],
    ["pistis-faith", "Glaube\\p{L}*"],
    ["ioudaioi-jews", "Juden|Jude"],
    // βάπτισμα locked "Untertauchen" (RULES-GS:39)
    ["baptisma-variant", "Eintauch\\p{L}*"],
  ],
  es: [
    ["only-begotten", "unigénito"],
    ["eternal-life", "vida eterna"],
    ["repent", "[Aa]rrepent\\p{L}*|[Aa]rrepient\\p{L}*"],
    ["gospel", "evangelios?"],
    ["church", "[Ii]glesias?"],
    ["baptize", "[Bb]autiz\\p{L}*|[Bb]autism\\p{L}*|[Bb]autist\\p{L}*"],
    ["comforter", "Consolador"],
    ["pascha", "Pascua"],
    ["pistis-faith", "[Ff]e"],
    ["ioudaioi-jews", "[Jj]udíos?"],
  ],
};
const HB_TERMS = {
  en: [["tebah-boat", "boat"]],
  "pt-br": [["tebah-boat", "barco"]],
  de: [["tebah-boat", "Boot"]],
  es: [["tebah-boat", "bote|barca"]],
};
const ALL_TERMS = {
  en: [["firmament", "[Ff]irmament"]],
  "pt-br": [["firmament", "[Ff]irmamento"]],
  de: [["firmament", "Firmament"]],
  es: [["firmament", "[Ff]irmamento"]],
};
export function s3(ctx, add) {
  const terms = [
    ...(NT.has(ctx.book) ? GS_TERMS[ctx.locale] : HB_TERMS[ctx.locale]),
    ...ALL_TERMS[ctx.locale],
  ];
  for (const [term, src] of terms)
    for (const { i, m, line, zone } of matches(ctx, word(src)))
      add(
        makeHit(
          ctx,
          i,
          "S3",
          `${term}:${voiceClass(line, m.index, zone)}`,
          m[0],
          m.index,
        ),
      );
}

// ---------------------------------------------------------------- S4 soul (D7)
const SOUL = {
  en: "[Ss]ouls?",
  "pt-br": "[Aa]lmas?",
  de: "Seelen?",
  es: "[Aa]lmas?",
};
export function s4(ctx, add) {
  for (const { i, m, line, zone } of matches(ctx, word(SOUL[ctx.locale])))
    add(makeHit(ctx, i, "S4", voiceClass(line, m.index, zone), m[0], m.index));
}

// ---------------------------------------------------------------- S5 names
// "Translit (Familiar)" pairs; also used by the corpus-level name report.
// Hyphenated names ("Bar-Talmai") are one word via the character class; the word
// separator is a space only (a hyphen in both made the match ambiguous — impl. review R1).
export const PAIR_RE =
  /(?<![\p{L}\p{M}'’-])(\p{Lu}[\p{L}\p{M}'’ʼ-]*(?: \p{Lu}[\p{L}\p{M}'’ʼ-]*){0,2}) \((\p{Lu}[\p{L}\p{M}'’ʼ.-]*(?: \p{Lu}?[\p{L}\p{M}'’ʼ.-]+){0,3})\)/gu;
// Capitalized function words that start a sentence before a name ("And Yeshua (Jesus)").
const LEAD_WORDS = new Set(
  "And But When Then Now With The A An O Os As E Mas Quando Então Und Aber Als Dann Der Die Das Y Pero Cuando Entonces El La Los Las Of De Da Do Rio Río River Fluss Bruder Brother Irmão Hermano".split(
    " ",
  ),
);
// Parenthesized non-names: confidence labels, claim types, abbreviations.
const NOT_NAME =
  /^(?:Probable|Possible|Uncertain|Primary|Secondary|Tertiary|Option [A-Z]|Familiar|Transliterated)$/;
const isCaps = (s) => /^[\p{Lu}\p{N} .'-]+$/u.test(s) && /\p{Lu}{2}/u.test(s);
const NAME_WORDS =
  /^(?:\p{Lu}[\p{L}\p{M}'’ʼ.-]*|de|da|do|del|von|van|of|the|bar|ben|bat)$/u;

/** Pairs in every reader zone AND the continuous reading (its own name section — impl. review R3-7); consumers that count renderings skip `cr`. */
const PAIR_ZONES = new Set([...READER, "cr"]);
export function namePairs(ctx) {
  if (ctx._pairs) return ctx._pairs;
  const out = [];
  for (const { i, m, zone } of matches(ctx, PAIR_RE, { zones: PAIR_ZONES })) {
    let idx = m.index;
    const words = m[1].split(" ");
    while (words.length > 1 && LEAD_WORDS.has(words[0]))
      idx += words.shift().length + 1;
    const translit = words.join(" ");
    const familiar = m[2];
    if (
      isCaps(translit) ||
      isCaps(familiar) ||
      NOT_NAME.test(familiar) ||
      NOT_NAME.test(translit)
    )
      continue;
    if (!familiar.split(" ").every((w) => NAME_WORDS.test(w))) continue;
    out.push({ i, idx, translit, familiar, zone, section: sectionKey(ctx, i) });
  }
  ctx._pairs = out;
  return out;
}

/** Name-rendering "section" (RULES-CORE §Name rendering; RULES-HB DE note: per `## ` section). */
function sectionKey(ctx, i) {
  if (isChapterFile(ctx.path)) return ctx.zones[i].section;
  for (let k = i; k >= 0; k--)
    if (/^#{2,4} /.test(ctx.lines[k])) return `${k}:${ctx.lines[k]}`;
  return "";
}

const STALE_POLICY = [
  /Proper names follow TT transliteration/g,
  /Nomes próprios seguem a transliteração/g,
  /Eigennamen folgen der TT-Transliteration/g,
  /Los nombres propios siguen la transliteración/g,
];
/** "Natan (Natán)", "Sarah (Sārah)": the same name modulo accents/case is still redundant (impl. review R2-11). */
export const sameName = (a, b) =>
  stripAccents(a).toLowerCase() === stripAccents(b).toLowerCase();
export function s5d(ctx, add, familiarNames) {
  for (const p of namePairs(ctx))
    if (p.zone !== "cr" && sameName(p.translit, p.familiar))
      add(
        makeHit(
          ctx,
          p.i,
          "S5d",
          "redundant-pair",
          `${p.translit} (${p.familiar})`,
          p.idx,
        ),
      );
  for (const re of STALE_POLICY)
    for (const { i, m } of matches(ctx, re))
      add(makeHit(ctx, i, "S5d", "stale-policy", m[0], m.index));
  const notName = word(
    "\\((?:not|não|nicht|no) (\\p{Lu}[\\p{L}\\p{M}'’-]+)\\)",
  );
  for (const { i, m } of matches(ctx, notName))
    if (familiarNames.has(m[1]))
      add(makeHit(ctx, i, "S5d", "stale-policy", m[0], m.index));
}

// ---------------------------------------------------------------- S6/S7 chapter structure
/** Per-verse study text, continuous text and coverage — shared by S6/S7 and the EN-vs-locale comparison. */
export function chapterModel(ctx) {
  if (!isChapterFile(ctx.path)) return null;
  const cont = continuousByVerse(ctx.lines, ctx.zones);
  const study = studyByVerse(ctx.lines, ctx.zones);
  return {
    cont,
    study,
    contDiv: divineCoverage([...cont.entries()], true),
    studyDiv: divineCoverage([...study.entries()], false),
  };
}

const verseLine = (ctx, v) =>
  Math.max(
    0,
    ctx.zones.findIndex((z) => z.zone === "main" && z.verse === v),
  );

/**
 * Collapse "Translit (Familiar)" glosses to "Familiar" — the two renderings are separate
 * name sections. Only as many words before the parenthesis as the familiar form has are
 * replaced (the capture may start earlier): "And Hevel (Abel)" → "And Abel", DE "deine
 * Frau Elisheva (Elisabeth)" → "deine Frau Elisabeth" (impl. review R2-1/R1-2).
 */
export const collapseGlosses = (s) =>
  s.replace(PAIR_RE, (_all, translit, familiar) => {
    const words = translit.split(" ");
    const k = Math.min(words.length, familiar.split(" ").length);
    return [...words.slice(0, words.length - k), familiar].join(" ");
  });
const glossCount = (s) =>
  [...s.matchAll(PAIR_RE)].filter((m) => !sameName(m[1], m[2])).length;

export function s6s7(ctx, add, model) {
  if (!model) return;
  const { cont, study, contDiv, studyDiv } = model;
  for (const v of study.keys()) {
    const i = verseLine(ctx, v);
    // S6a: same divine-speech coverage in both renderings (Rule 30)
    if (
      collapseGlosses(contDiv.covered.get(v) ?? "") !==
      collapseGlosses(studyDiv.covered.get(v) ?? "")
    )
      add(makeHit(ctx, i, "S6a", "coverage-differs", `v${v}`, 0));
    // S7d: same italic additions in both renderings (Rule 11)
    const ci = italicSpans(cont.get(v) ?? "").join(" | ");
    const si = italicSpans(study.get(v) ?? "").join(" | ");
    if (ci !== si)
      add(
        makeHit(
          ctx,
          i,
          "S7d",
          "italics-differ",
          `v${v}: [${ci}] vs [${si}]`,
          0,
        ),
      );
    // S6e: identical text ("Text is identical to the Verse-by-Verse Study"); @@ placement is S6a's job
    const a = norm(collapseGlosses(cont.get(v) ?? "").replace(/@@/g, ""));
    const b = norm(collapseGlosses(study.get(v) ?? "").replace(/@@/g, ""));
    if (a !== b) {
      const letters = (s) => s.replace(/[^\p{L}\p{N}]+/gu, " ").trim();
      let k = 0;
      while (a[k] === b[k]) k++;
      const cls = letters(a) === letters(b) ? "punctuation-or-markup" : "words";
      add(
        makeHit(
          ctx,
          i,
          "S6e",
          cls,
          `v${v}: «${a.slice(Math.max(0, k - 15), k + 25)}» vs «${b.slice(Math.max(0, k - 15), k + 25)}»`,
          0,
        ),
      );
    } else {
      // same words once glosses are collapsed: report where a first-occurrence gloss sits
      // in one rendering only (decision data for L2; the guide says "Text is identical").
      const gc = glossCount(cont.get(v) ?? "");
      const gs = glossCount(study.get(v) ?? "");
      if (gc !== gs)
        add(
          makeHit(
            ctx,
            i,
            "S6e",
            gs > gc ? "gloss-in-study-only" : "gloss-in-cr-only",
            `v${v}: ${gc} vs ${gs} gloss(es)`,
            0,
          ),
        );
    }
  }
  for (const v of studyDiv.unbalanced)
    add(makeHit(ctx, verseLine(ctx, v), "S6d", "unbalanced-verse", `v${v}`, 0));
  if (contDiv.unbalanced.length)
    add(makeHit(ctx, 0, "S6d", "unbalanced-continuous", "@@", 0));
  // S7c: ad-hoc bold in the reading text (only the four markers are allowed)
  for (const { i, m } of matches(ctx, /\*\*[^*\n]+\*\*/g, { zones: MAIN }))
    add(makeHit(ctx, i, "S7c", "bold-in-main", m[0], m.index));
}

// S6b: markers inside inline code render as literal backticks around a styled span (review R-1/R-10);
// S6d (lines): an odd number of @@ on one rendered non-reading line.
export function s6b(ctx, add) {
  for (const { i, m } of matches(ctx, /`[^`]*(?:@@|\{[at]:)[^`]*`/g))
    add(makeHit(ctx, i, "S6b", "backticked-marker", m[0], m.index));
  for (let i = 0; i < ctx.lines.length; i++) {
    const z = ctx.zones[i];
    if (!TT_VOICE.has(z.zone) || isLegend(ctx, i)) continue;
    if ((ctx.lines[i].match(/@@/g) ?? []).length % 2 === 1)
      add(
        makeHit(
          ctx,
          i,
          "S6d",
          `unbalanced-${z.zone}`,
          "@@",
          ctx.lines[i].indexOf("@@"),
        ),
      );
  }
}

// S6f: Rule 30 SCOPE (review R-9) — marked spans whose context suggests the
// marked words are God's words quoted by another speaker (citation formula) or
// a debatable speaker (angel/messenger). A decision list, not a defect count.
const CITATION =
  /(?:it is written|as it is written|has been written|in scripture|scripture says|says the prophet|through the prophet|spoken by|está escrito|como está escrito|na escritura|diz a escritura|pelo profeta|steht geschrieben|wie geschrieben steht|in der Schrift|durch den Propheten|escrito está|en la escritura|dice la escritura|por medio del profeta)[^@]{0,40}$/i;
const MESSENGER =
  /(?<![\p{L}])(?:angel|messenger|mensageiro|anjo|Engel|Bote|ángel|mensajero)/iu;
// Speaker boundaries the editorial log declares unresolved: Rule 30 "when in doubt, do
// not mark" — any marking there contradicts the log (john.md J-007, impl. review R3-2).
const UNRESOLVED_SPEAKER = {
  "john/CHAPTER-3.md": [
    [16, 21],
    [31, 36],
  ],
};
export function s6f(ctx, add, model) {
  if (!model) return;
  const unresolved =
    UNRESOLVED_SPEAKER[`${ctx.book}/${ctx.path.split("/").at(-1)}`] ?? [];
  for (const [v, text] of model.study) {
    const parts = text.split("@@");
    const undecided = unresolved.some(([a, b]) => v >= a && v <= b);
    for (let k = 1; k < parts.length; k += 2) {
      const before = parts.slice(0, k).join("");
      const cls = undecided
        ? "logged-unresolved-speaker"
        : CITATION.test(before)
          ? "after-citation-formula"
          : MESSENGER.test(before)
            ? "messenger-context"
            : null;
      if (cls)
        add(
          makeHit(
            ctx,
            verseLine(ctx, v),
            "S6f",
            cls,
            `v${v}: @@${parts[k].slice(0, 60)}…`,
            0,
          ),
        );
    }
  }
  // A marked span that opens while a (human) speaker's quotation is still open
  // is God's word quoted by another speaker — "Do NOT mark" in Rule 30 unless logged.
  // DE opens with „ and closes with “ or a straight " (corpus style); elsewhere " toggles.
  const de = ctx.locale === "de";
  const [open, close] = de ? ["„", "“"] : ["“", "”"];
  for (let i = 0; i < ctx.lines.length; i++) {
    if (ctx.zones[i].zone !== "cr") continue;
    const line = ctx.lines[i];
    let depth = 0;
    let straight = false;
    let verse = null;
    let inSpan = false;
    for (let p = 0; p < line.length; p++) {
      const ch = line[p];
      const sup = "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(ch);
      if (sup >= 0) {
        let q = p;
        while (q < line.length && "⁰¹²³⁴⁵⁶⁷⁸⁹".includes(line[q])) q++;
        verse = Number(
          [...line.slice(p, q)].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""),
        );
        p = q - 1;
        continue;
      }
      if (line.startsWith("@@", p)) {
        if (!inSpan && (depth > 0 || straight))
          add(
            makeHit(
              ctx,
              i,
              "S6f",
              "inside-human-quote",
              `v${verse ?? "?"}: ${line.slice(p, p + 60)}…`,
              p,
            ),
          );
        inSpan = !inSpan;
        p++;
        continue;
      }
      if (inSpan) continue; // quotes inside the divine span are the divine speaker's own
      if (ch === open) depth++;
      else if (ch === close || (de && ch === '"'))
        depth = Math.max(0, depth - 1);
      else if (!de && ch === '"') straight = !straight;
    }
  }
}

// ---------------------------------------------------------------- S7a contractions (T-20, Rule 11)
// An article fused into a contraction, three forms (review R-4):
//   (i)   contraction + italic word  `na *carne*`  — the T-20 pivot class
//   (ii)  italic article inside it   `n*a* carne`  — de-facto PT convention ("option D")
//   (iii) whole contraction italic   `*na* carne`  — logged DE convention (mark.md:116)
// PT, DE and ES all have the class (impl. review R3-6/R2-6); a contraction followed by
// an italic ARTICLE is a doubled article ("im *dem*", "al *el*") — ungrammatical.
// Unicode left boundary (JS `\b` never matches before "à"/"às").
const B = "(?<![\\p{L}\\p{M}\\p{Nd}_*])";
const E = "(?![\\p{L}*])";
const S7A = {
  "pt-br": {
    contr: "na|no|nas|nos|da|do|das|dos|pela|pelo|pelas|pelos|à|às|ao|aos",
    whole: "num|numa|dum|duma",
    article: "o|a|os|as|um|uma|uns|umas",
    intra: `(?:n|d|pel|à|a)\\*(?:a|o|as|os|s|um|uma|uns|umas)\\*`,
    possessive: "meus?|minhas?|teus?|tuas?|seus?|suas?|noss[oa]s?|voss[oa]s?",
  },
  de: {
    contr: "im|am|vom|zum|zur|beim|ins|ans|aufs|durchs|fürs|ums",
    whole: "",
    article: "der|die|das|dem|den|des|ein|eine|einen|einem|einer|eines",
    intra: `(?:i|a|vo|zu|bei|in|an)\\*(?:m|r|s)\\*`,
    possessive: "(?:mein|dein|sein|ihr|unser|euer|eur)\\p{L}*",
  },
  es: {
    contr: "al|del",
    whole: "",
    article: "el|la|los|las|un|una|unos|unas",
    intra: `(?:a|de)\\*l\\*`,
    possessive: "mis?|tus?|sus?|nuestr[oa]s?|vuestr[oa]s?",
  },
};
const re = (src) => new RegExp(src, "gu");
const S7A_RE = Object.fromEntries(
  Object.entries(S7A).map(([loc, c]) => [
    loc,
    {
      // the T-20 left boundary does not exclude `*` (reproduces the playbook figure)
      t20: re(`(?<![\\p{L}\\p{M}\\p{Nd}_])(${c.contr}) \\*([^*]+)\\*`),
      intra: re(`${B}${c.intra}${E}`),
      whole: re(`${B}\\*(?:${c.contr}${c.whole ? `|${c.whole}` : ""})\\*${E}`),
      article: re(`${B}\\*(?:${c.article})\\*${E}`),
      isArticle: new RegExp(`^(?:${c.article})$`, "u"),
      isPossessive: new RegExp(`^(?:${c.possessive})$`, "iu"),
    },
  ]),
);
/** The PT T-20 regex (playbook T-20 figure). */
export const T20_RE = S7A_RE["pt-br"].t20;
const EN_ARTICLE_ITALIC =
  /(?<![\p{L}*])\*(?:the|a|an|The|A|An)\*(?![\p{L}*])/gu;
const count = (s, r) => (s.match(r) ?? []).length;

export function s7a(ctx, add, enModel) {
  const R = S7A_RE[ctx.locale];
  if (!R || !isChapterFile(ctx.path)) return;
  for (let i = 0; i < ctx.lines.length; i++) {
    const z = ctx.zones[i];
    const line = ctx.lines[i];
    if (z.zone === "main")
      for (const [r, form] of [
        [R.intra, "intra-word"],
        [R.whole, "whole-contraction"],
      ]) {
        for (const f of line.matchAll(r))
          add(makeHit(ctx, i, "S7a", `form:${form}`, f[0], f.index));
      }
    for (const m of line.matchAll(R.t20)) {
      const italic = m[2];
      // Reconciliation with the T-20 whole-file figure (PT 190): every zone is recorded.
      if (z.zone !== "main") {
        add(
          makeHit(
            ctx,
            i,
            "S7a",
            z.zone === "note" ? "note-quotes-verse" : `outside-main:${z.zone}`,
            m[0],
            m.index,
          ),
        );
        continue;
      }
      let cls;
      if (R.isArticle.test(italic)) cls = "doubled-article";
      else if (R.isPossessive.test(italic)) cls = "possessive";
      else if (
        ctx.locale === "pt-br" &&
        m[1] === "ao" &&
        /(?:ar|er|ir|or)$/.test(italic)
      )
        cls = "ao+infinitive";
      else {
        // Per-verse article accounting: EN marks N added articles; the locale marks M
        // (standalone + intra-word + whole-contraction). A deficit plus this form → pivot-likely.
        const txt = studyText(ctx, z.verse);
        const enN = count(enModel?.study.get(z.verse) ?? "", EN_ARTICLE_ITALIC);
        const locN =
          count(txt, R.article) + count(txt, R.intra) + count(txt, R.whole);
        cls = enN > locN && !/\s/.test(italic) ? "pivot-likely" : "review";
      }
      add(makeHit(ctx, i, "S7a", cls, m[0], m.index));
    }
  }
}
const studyText = (ctx, v) =>
  ctx.lines
    .filter((_, k) => ctx.zones[k].zone === "main" && ctx.zones[k].verse === v)
    .join("\n");

// ---------------------------------------------------------------- S8 front matter
const STATUS_OK =
  /provisional|provisório|provisória|provisorio|provisoria|provisorisch|vorläufig/i;
const REVIEWERS = /^\*\*(?:Reviewers|Revisores|Begutachter):\*\*/;
const RULESET =
  /^\*\*(?:Ruleset|Conjunto de Regras|Conjunto de Reglas|Conjunto de reglas|Regelwerk|Reglas|Regras|Methodology|Metodologia|Metodología|Methodik)[^:]*:\*\*.*?v(\d+\.\d+(?:\.\d+)?)/;
// The chapter status pill prints the first word(s) of the Status value
// (src/ui/shared/chapter-shell.tsx: split on " — " / " (") while every other badge
// prints the i18n term (messages/*.json "provisional") — impl. review R3-16.
const BADGE_TERM = {
  en: "Provisional",
  "pt-br": "Provisório",
  de: "Vorläufig",
  es: "Provisional",
};
export function s8(ctx, add) {
  const front = ctx.lines
    .map((l, i) => [l, i])
    .filter(([, i]) => ctx.zones[i].zone === "front");
  const status = front.find(([l]) => /^\*\*(?:Status|Estado):\*\*/.test(l));
  if (!status) add(makeHit(ctx, 0, "S8", "no-status", "", 0));
  else if (!STATUS_OK.test(status[0]))
    add(makeHit(ctx, status[1], "S8", "status-not-provisional", status[0], 0));
  else if (isChapterFile(ctx.path)) {
    const value = status[0].replace(/^\*\*(?:Status|Estado):\*\*\s*/, "");
    const pill = value.split(/\s[—–-]\s|\s\(/)[0].trim();
    if (pill.toLowerCase() !== BADGE_TERM[ctx.locale].toLowerCase())
      add(makeHit(ctx, status[1], "S8", "pill-word≠badge-term", pill, 0));
  }
  if (isChapterFile(ctx.path) && !front.some(([l]) => REVIEWERS.test(l)))
    add(makeHit(ctx, 0, "S8", "no-reviewers", "", 0));
  const rs = front.map(([l, i]) => [l.match(RULESET), i]).filter(([m]) => m);
  if (!rs.length) add(makeHit(ctx, 0, "S8", "no-ruleset-stamp", "", 0));
  for (const [m, i] of rs)
    if (m[1] !== "3.4") add(makeHit(ctx, i, "S8", `ruleset-v${m[1]}`, m[0], 0));
}

// ---------------------------------------------------------------- S9 meta leaks
const META = [
  ["editorial-id", /(?<![\p{L}\p{N}-])[AJLMP]-\d{3}[a-z]?(?![\p{L}\p{N}])/gu],
  [
    "editorial-id",
    /[Ee]ntry \d{4}-\d{2}-\d{2}-\d{3}|\((?:entry|entrada|Eintrag) \d{3}\)/g,
  ],
  ["repo-path", /(?<![\p{L}\p{N}])(?:content|docs|src|scripts)\/[\w./-]+/gu],
  ["repo-path", /(?<![\p{L}\p{N}/.-])[\w-]+(?:\/[\w-]+)*\.md(?![\p{L}])/gu],
  [
    "process-word",
    word(
      "EN[- ][Pp]ivot|[Pp]ivot[- ](?:artifact|language)|mirror-EN|TODO:|TBD|FIXME|[Pp]laybook|PLAN_\\w+|lint|allow-list",
    ),
  ],
  // own class: "propagated through coins" is ordinary English (impl. review R3-18)
  [
    "propagation-word",
    word(
      "[Pp]ropagat\\p{L}*|[Pp]ropaga[çc]\\p{L}*|[Pp]ropagad[oa]s?|Propagierung",
    ),
  ],
  // impl. review R2-8: model/drafting provenance and rule-tier jargon in reader text
  [
    "ai-provenance",
    word(
      "Drafted by|Redigido por|Entworfen von|Erstellt von|Verfasst von|Redactado por|Claude(?: Opus \\d[\\d.]*)?|AI assistant|\\(1M context\\)|Anthropic|Not yet reviewed",
    ),
  ],
  [
    "tier-jargon",
    word("(?:Tier|TIER|Nível|NÍVEL|Stufe|STUFE|Nivel|NIVEL)[- ]2"),
  ],
  ["process-word", word("(?:Phase|Fase) \\d+(?:\\.\\d+)?[A-Za-z]?")],
  [
    "editorial-log-ref",
    word(
      "[Ee]ditorial[- ][Ll]og|registro editorial|log editorial|Redaktionsprotokoll|Editorial-Log|bitácora editorial|diario editorial",
    ),
  ],
  [
    "rule-ref",
    word("(?:Rules?|Regras?|Regeln?|Reglas?|CORE-Regel|CORE Rule) \\d{1,2}"),
  ],
];
// Cross-book see-stub fields render as links (RULES-CORE Rule 29) — data, not a leak.
const SEE_FIELD =
  /^\s*[-*]?\s*\*\*(?:See|Ver|Siehe|Veja)(?: também| auch| también| also)?:\*\*/;
export function s9(ctx, add) {
  for (let i = 0; i < ctx.lines.length; i++) {
    const line = ctx.lines[i];
    const found = [];
    for (const [cls, re] of META) {
      for (const m of line.matchAll(re))
        found.push({ cls, idx: m.index, text: m[0] });
    }
    // The two repo-path regexes overlap ("docs/x/luke.md"): keep the longest span only.
    found.sort((a, b) => a.idx - b.idx || b.text.length - a.text.length);
    let pathEnd = -1;
    for (const f of found) {
      if (f.cls === "repo-path") {
        if (f.idx < pathEnd) continue;
        pathEnd = f.idx + f.text.length;
      }
      const c =
        f.cls === "repo-path" && SEE_FIELD.test(line)
          ? "repo-path:see-field"
          : f.cls;
      add(makeHit(ctx, i, "S9", c, f.text, f.idx));
    }
  }
}

// ---------------------------------------------------------------- S10 stamps
const STAMP_FIELD = /^\*\*[^*]+:\*\*/;
const AMEND =
  /convention|amendment|emenda|convenção|Konvention|Änderung|Ergänzung|enmienda|convención/i;
export function s10(ctx, add) {
  const re = /v3\.3(?:\.\d+)?(?![\d.]*\d)/g;
  for (let i = 0; i < ctx.lines.length; i++) {
    const line = ctx.lines[i];
    for (const m of line.matchAll(re)) {
      const cls = STAMP_FIELD.test(line)
        ? "stamp-field"
        : AMEND.test(line)
          ? "citation"
          : "prose-stamp";
      add(makeHit(ctx, i, "S10", cls, m[0], m.index));
    }
  }
}

// ---------------------------------------------------------------- S12 mojibake
export function s12(ctx, add) {
  // C1 controls (UTF-8 → Latin-1 double-decode residue, e.g. "â" + U+0080 U+0094 for "—"), â€, Ã + Latin-1, U+FFFD.
  // + Windows-1252 double-decode residue of capitals/punctuation ("Ã‡" = Ç, "Ã‰" = É — impl. review R1)
  const re =
    /â[\u0080-\u009F€™]+|[\u0080-\u009F]+|Ã[\u0080-¿‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]|�/g;
  for (let i = 0; i < ctx.lines.length; i++) {
    for (const m of ctx.lines[i].matchAll(re))
      add(makeHit(ctx, i, "S12", "mojibake", JSON.stringify(m[0]), m.index));
  }
}

// ---------------------------------------------------------------- S13 DE Ioudaioi (D9)
export function s13(ctx, add) {
  if (ctx.locale !== "de") {
    for (const { i, m } of matches(ctx, word("yehudim")))
      add(makeHit(ctx, i, "S13", "yehudim-lowercase", m[0], m.index));
    return;
  }
  for (const { i, m } of matches(ctx, word("Yehudi\\p{L}*")))
    add(
      makeHit(
        ctx,
        i,
        "S13",
        m[0] === "Yehudim" ? "yehudim" : "yehudi-other",
        m[0],
        m.index,
      ),
    );
}

// ---------------------------------------------------------------- S14 PT register (decision data)
// 2nd-person-plural verb forms carry the vós register without a pronoun (impl. review
// R3-15): unaccented -eis (recebeis, comeceis), imperfect -íeis (sabíeis) and
// -ar imperatives in -ai (mudai, preparai). A review class — conservative, not exhaustive.
// (-ei imperatives are left out: they collide with -ar preterite and future 1sg — tomei, farei.)
const VOS_VERB = word("[a-zç]{3,}eis|\\p{Ll}{2,}íeis|[A-Za-zç]{3,}ai");
const VOS_VERB_NOT = /^(?:papai)$/i;
export function s14(ctx, add) {
  if (ctx.locale !== "pt-br") return;
  const re = word("[Vv]ós|[Vv]oss[oa]s?|[Cc]onvosco|[Vv]ocês");
  for (const { i, m } of matches(ctx, re, { zones: MAIN }))
    add(
      makeHit(ctx, i, "S14", /ocê/.test(m[0]) ? "voces" : "vos", m[0], m.index),
    );
  for (const { i, m, line } of matches(ctx, VOS_VERB, { zones: MAIN })) {
    // a capitalized -ai/-ei word mid-sentence is a name (Sinai, Shaddai, Talmai)
    if (/^\p{Lu}/u.test(m[0]) && !isSentenceStart(line, m.index)) continue;
    if (!VOS_VERB_NOT.test(m[0]))
      add(makeHit(ctx, i, "S14", "vos-verb?", m[0], m.index));
  }
}

// ---------------------------------------------------------------- S15 renderer-hostile markup (→ 4a)
export function s15(ctx, add) {
  for (let i = 0; i < ctx.lines.length; i++) {
    const z = ctx.zones[i];
    if (z.render === "no" || isLegend(ctx, i)) continue;
    const line = ctx.lines[i];
    const opens = (line.match(/\{[at]:/g) ?? []).length;
    if (opens && opens !== (line.match(/\}/g) ?? []).length)
      add(makeHit(ctx, i, "S15", "unbalanced-brace", line.slice(0, 60), 0));
    const body = line
      .replace(/^\s*(?:>\s*)*(?:[-*]\s+)?/, "")
      .replace(/\*\*/g, "");
    if ((body.match(/\*/g) ?? []).length % 2 === 1)
      // a manuscript siglum ("א*", "B*" = first hand) is legitimate text but a lone * can pair with a later one
      add(
        makeHit(
          ctx,
          i,
          "S15",
          /(?:[\u05D0-\u05EA]|\b[A-Z])\*(?=[\s,;.)\]])/u.test(body)
            ? "siglum-asterisk"
            : "odd-asterisk",
          line.slice(0, 60),
          0,
        ),
      );
    if (/^\s*\|/.test(line) && /@@|\{[at]:/.test(line))
      add(makeHit(ctx, i, "S15", "marker-in-table", line.slice(0, 60), 0));
    const arrow = line.indexOf("->");
    if (arrow >= 0) add(makeHit(ctx, i, "S15", "ascii-arrow", "->", arrow));
  }
}

// ---------------------------------------------------------------- S16 structure cross-checks
const KNOWN_TOC =
  /^(?:TABLE OF CONTENTS|SUMÁRIO|INHALTSVERZEICHNIS|INDICE|ÍNDICE|TABLA DE CONTENIDOS?)$/;
export function s16(ctx, add) {
  if (!isChapterFile(ctx.path)) return;
  for (let i = 0; i < ctx.lines.length; i++) {
    const z = ctx.zones[i];
    const h = ctx.lines[i].match(/^## (.+)$/);
    if (
      h &&
      z.zone === "toc" &&
      z.render === "now" &&
      !KNOWN_TOC.test(h[1].trim())
    )
      add(
        makeHit(ctx, i, "S16", "toc-renders-as-supplementary", h[1].trim(), 0),
      );
  }
}

// ---------------------------------------------------------------- S17 χριστός rendering drift (review R-8)
const CHRISTOS = {
  en: [
    ["messiah", "Messiah"],
    ["christ", "Christ"],
    ["anointed", "anointed one"],
  ],
  "pt-br": [
    ["messiah", "Messias"],
    ["christ", "Cristo"],
    ["anointed", "[Uu]ngido"],
  ],
  de: [
    ["messiah", "Messias"],
    ["christ", "Christus"],
    ["anointed", "Gesalbte[nr]?"],
  ],
  es: [
    ["messiah", "Mesías"],
    ["christ", "Cristo"],
    ["anointed", "[Uu]ngido"],
  ],
};
/** Verses whose source word is Μεσσίας (a transliteration), not χριστός. */
const MESSIAS_SOURCE = new Set(["john/CHAPTER-1.md/41"]);
export function s17(ctx, add) {
  if (!NT.has(ctx.book)) return;
  const file = `${ctx.book}/${ctx.path.split("/").at(-1)}`;
  for (const [form, src] of CHRISTOS[ctx.locale])
    for (const { i, m } of matches(ctx, word(src), { zones: MAIN })) {
      const messias =
        form === "messiah" &&
        MESSIAS_SOURCE.has(`${file}/${ctx.zones[i].verse}`);
      add(
        makeHit(
          ctx,
          i,
          "S17",
          messias ? "messias-source" : form,
          m[0],
          m.index,
        ),
      );
    }
}

// ---------------------------------------------------------------- S18 Tier-2 note length
// RULES-CORE Tier 2: "each note 1-2 sentences maximum (default)"; Relocation Protocol:
// "normally under 3 sentences" — a soft cap, so S18 is decision data, not a defect count.
const ABBR =
  /(?:^|[\s(])(?:v|vv|cf|e\.g|i\.e|ca|c|ch|chs|lit|Gen|Gn|Ex|Lev|Num|Dt|Deut|Is|Isa|Jer|Ez|Dan|Mt|Mk|Lk|Jn|Ac|Rom|Ps|Sal|Sl|Hb|Heb|p|pp|n|nn|ed|eds|vol|al|etc|Jo|Jz|Mc|Lc|Hch|At|Apg|vgl|bzw|z\.B|d\.h|u\.a|sog|S|Bd|ff|Mr|Dr|St|Nr|Aufl|rev|Prov|Pr|Spr|Jes|a|e|i|ver|cap|caps|séc|s)\.$/;
export function sentences(text) {
  const t = text.replace(/\*\*[^*]*\*\*/g, "X").replace(/\([^)]*\)/g, "(…)");
  let n = 0;
  // a sentence may open with a quote, bracket, italic/bold marker or ES ¿/¡ (impl. review R1-5)
  const re = /[.!?]["”»“']?(?=\s+["“„«(*_¿¡]*\p{Lu})/gu;
  for (const m of t.matchAll(re))
    if (!ABBR.test(t.slice(Math.max(0, m.index - 8), m.index + 1))) n++;
  return n + 1;
}
// A note body is a bullet (`> - …`) or a free paragraph line (`> …`, not the NOTES
// label, not an icon title line). The default is 1–2 sentences, so 3 is reported too.
const NOTE_BODY = /^>\s*(?:-\s+)?(?!\*\*NOTES\*\*|[🔴🟢🔵🟡⚠])(\S.*)$/u;
export function s18(ctx, add) {
  if (!isChapterFile(ctx.path)) return;
  for (let i = 0; i < ctx.lines.length; i++) {
    if (ctx.zones[i].zone !== "note") continue;
    const m = ctx.lines[i].match(NOTE_BODY);
    if (!m) continue;
    const n = sentences(m[1]);
    if (n >= 3)
      add(
        makeHit(
          ctx,
          i,
          "S18",
          n > 5 ? "sentences>5" : n > 3 ? "sentences=4-5" : "sentences=3",
          `${n} sentences`,
          0,
        ),
      );
  }
}

// ---------------------------------------------------------------- S19 הִנֵּה lock (HB glossary: locked per language, no alternation)
const HINNEH_NOTE = /הִנֵּה|הִנֵּ|(?<![\p{L}])(?:ve|wĕ|we)?hinn?[eē]h/iu;
const HINNEH_LOCK = {
  en: word("[Ss]ee"),
  "pt-br": word("[Ee]is"),
  de: word("[Ss]iehe"),
  es: /(?<![\p{L}])[Hh]e aquí(?![\p{L}])/gu,
};
export function s19(ctx, add, model) {
  if (!model || ctx.book !== "genesis") return;
  const notes = new Map();
  ctx.lines.forEach((l, i) => {
    const z = ctx.zones[i];
    if (z.zone === "note")
      notes.set(z.verse, `${notes.get(z.verse) ?? ""}${l}\n`);
  });
  for (const [v, text] of notes)
    if (HINNEH_NOTE.test(text)) {
      const re = HINNEH_LOCK[ctx.locale];
      re.lastIndex = 0;
      if (!re.test(model.study.get(v) ?? ""))
        add(
          makeHit(
            ctx,
            verseLine(ctx, v),
            "S19",
            "locked-form-absent",
            `v${v}`,
            0,
          ),
        );
    }
}

// ---------------------------------------------------------------- S20 Rule 20 titular nouns (impl. review R2-3)
// "son of God", "father", "king of Israel", "the anointed one" stay lowercase in EN/PT/ES
// (RULES-CORE Rule 20; DE exempt). Verse text only; sentence-initial capitals are allowed.
// "Son of Man" is S2a. A capitalized *added* word ("Mighty *One*") imports a title too.
const TITLES = {
  en: "Son|Father|King|Anointed|Shepherd|Lamb|Holy One|Mighty One|Righteous One",
  "pt-br": "Filho|Pai|Rei|Ungido|Pastor|Cordeiro|Santo|Justo|Poderoso",
  es: "Hijo|Padre|Rey|Ungido|Pastor|Cordero|Santo|Justo|Poderoso|Aquel",
};
const ADDED_TITLE =
  /(?<![\p{L}*])\*(?:One|Aquele|Aquela|Aquel|Uno)\*(?![\p{L}*])/gu;
export function s20(ctx, add) {
  const t = TITLES[ctx.locale];
  if (!t || !NT.has(ctx.book)) return;
  for (const { i, m, line } of matches(ctx, word(t), { zones: MAIN })) {
    if (isSentenceStart(line, m.index)) continue;
    if (
      /^Son$|^Hijo$|^Filho$/.test(m[0]) &&
      /^ of (?:[Mm]an)|^ do [Hh]omem|^ del [Hh]ombre/.test(
        line.slice(m.index + m[0].length),
      )
    )
      continue; // S2a
    add(makeHit(ctx, i, "S20", m[0], m[0], m.index));
  }
  for (const { i, m } of matches(ctx, ADDED_TITLE, { zones: MAIN }))
    add(makeHit(ctx, i, "S20", "added-capitalized", m[0], m.index));
}

// ---------------------------------------------------------------- S21 marker governance (impl. review R2-5)
// `{t:}` / `{a:}` are reserved for locked-glossary terms (RULES-CORE §Text-Highlight
// Markers). Every value is checked against the RULES-HB/GS table cells; a slash
// rendering left bare in verse text renders without its highlight.
export function s21(ctx, add, glossaryCells) {
  if (!isChapterFile(ctx.path)) return;
  for (let i = 0; i < ctx.lines.length; i++) {
    if (ctx.zones[i].zone !== "main") continue;
    const line = ctx.lines[i];
    for (const m of line.matchAll(/\{([at]):([^}]*)\}/g)) {
      const value = m[2].replace(/\*/g, "").trim().toLowerCase();
      if (!glossaryCells.has(value))
        add(
          makeHit(
            ctx,
            i,
            "S21",
            `${m[1]}-value-not-in-glossary`,
            m[0],
            m.index,
          ),
        );
    }
    const bare = line.replace(/\{[at]:[^}]*\}/g, (x) => " ".repeat(x.length));
    for (const m of bare.matchAll(/(?<![\p{L}/])\p{L}+\/\p{L}+(?![\p{L}/])/gu))
      add(makeHit(ctx, i, "S21", "bare-slash", m[0], m.index));
  }
}

// ---------------------------------------------------------------- S22 labels and icons (impl. review R2-9/R2-10)
// Rule 29 dual labels `**[CLAIM — CONFIDENCE]**` in companion-type files must use the
// registered vocabulary (RULES-CORE §Dual labels; src/domain/content/labels.ts). EN only:
// the other locales use the translated aliases. Note icons: 🔴 🟢 🔵 🟡 only.
const CLAIMS = new Set([
  "TEXTUAL",
  "STRONG INFERENCE",
  "POSSIBLE INFERENCE",
  "COMPARATIVE PARALLEL",
  "LATER RECEPTION",
  "HISTORICAL / ARCHAEOLOGICAL",
  "SCIENTIFIC COMPARISON",
  "SPECULATION",
]);
const CONFIDENCES = new Set([
  "VERIFIED",
  "PROBABLE",
  "POSSIBLE",
  "UNCERTAIN",
  "SPECULATIVE",
  "DOCUMENTED",
]);
const NOTE_ICONS = new Set(["🔴", "🟢", "🔵", "🟡"]);
export function s22(ctx, add) {
  if (isChapterFile(ctx.path)) {
    for (let i = 0; i < ctx.lines.length; i++) {
      if (ctx.zones[i].zone !== "note") continue;
      const m = ctx.lines[i].match(/^>\s*(\p{Extended_Pictographic}\uFE0F?)/u);
      if (m && !NOTE_ICONS.has(m[1].replace("\uFE0F", "")))
        add(makeHit(ctx, i, "S22", "note-icon-off-list", m[1], 0));
    }
    return;
  }
  if (ctx.locale !== "en") return;
  for (const { i, m } of matches(ctx, /\*\*\[([^\]\n]{3,120})\]\*\*/g)) {
    const [claim, ...rest] = m[1].split(" — ");
    if (claim === "PEER-REVIEWED") continue; // source-status tag, not a dual label
    const conf = rest.join(" — ");
    const parts = claim.split(" / ");
    const claimOk =
      CLAIMS.has(claim) ||
      (parts.length > 1 &&
        parts.every(
          (p) => CLAIMS.has(p) || p === "HISTORICAL" || p === "ARCHAEOLOGICAL",
        ));
    const cls = !rest.length
      ? "label-without-confidence"
      : !claimOk
        ? "claim-off-list"
        : !CONFIDENCES.has(conf)
          ? "confidence-off-list"
          : CLAIMS.has(claim)
            ? null
            : "combined-claim-types";
    if (cls) add(makeHit(ctx, i, "S22", cls, m[0], m.index));
  }
}

export const PER_FILE = [
  s1,
  s2a,
  s2b,
  s3,
  s4,
  s6b,
  s8,
  s9,
  s10,
  s12,
  s13,
  s14,
  s15,
  s16,
  s17,
  s18,
  s20,
  s22,
];
