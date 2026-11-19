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
  /tradition|translations? (?:substitut|print|render|use)|most (?:English )?(?:Bibles|translations)|substitut|Ersatz|ersetz|tradicion|tradução|traduções|traducciones|sustitu|small caps|versalit|em vez de|statt|en lugar de|instead of|not "|NOT "|não "|nicht „|no "/i;
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
  // Rule 25 / HB glossary: never "LORD/SENHOR/HERR/SEÑOR". Quoted OT text in TT voice is USE (review R-5).
  for (const { i, m, line } of matches(ctx, word("LORD|SENHOR|HERR|SEÑOR"), {
    skipCaps: true,
  })) {
    const near = line.slice(Math.max(0, m.index - 80), m.index + 40);
    add(
      makeHit(
        ctx,
        i,
        "S1c",
        CONVENTION_CUE.test(near) ? "convention-mention" : "use",
        m[0],
        m.index,
      ),
    );
  }
}

// ---------------------------------------------------------------- S2 casing (Rule 20 / D8)
const SON_OF_MAN = {
  en: { re: /[Ss]on of [Mm]an/g, ok: "son of man" },
  "pt-br": { re: /[Ff]ilho do [Hh]omem/g, ok: "filho do homem" },
  es: { re: /[Hh]ijo del [Hh]ombre/g, ok: "hijo del hombre" },
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
export function s2b(ctx, add) {
  const t = CAPS_TERMS[ctx.locale];
  if (!t) return;
  for (const { i, m, line, zone } of matches(ctx, word(t), {
    skipCaps: true,
  })) {
    if (isSentenceStart(line, m.index)) continue;
    add(
      makeHit(
        ctx,
        i,
        "S2b",
        `${m[0]}:${voiceClass(line, m.index, zone)}`,
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
  ],
  de: [
    ["only-begotten", "eingeboren\\p{L}*"],
    ["eternal-life", "ewige[sn]? Leben\\p{L}*"],
    ["repent", "Buße|[Bb]ereu\\p{L}*"],
    ["gospel", "Evangelium|Evangelien"],
    ["church", "Kirche\\p{L}*"],
    ["baptize", "[Tt]auf\\p{L}*|Täufer\\p{L}*"],
    ["comforter", "Tröster"],
    ["pascha", "Passa|Passah|Ostern"],
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
export const PAIR_RE =
  /(?<![\p{L}\p{M}'’-])(\p{Lu}[\p{L}\p{M}'’ʼ-]*(?:[ -]\p{Lu}[\p{L}\p{M}'’ʼ-]*){0,2}) \((\p{Lu}[\p{L}\p{M}'’ʼ.-]*(?: \p{Lu}?[\p{L}\p{M}'’ʼ.-]+){0,3})\)/gu;
// Capitalized function words that start a sentence before a name ("And Yeshua (Jesus)").
const LEAD_WORDS = new Set(
  "And But When Then The A An O Os As E Mas Quando Então Und Aber Als Dann Der Die Das Y Pero Cuando Entonces El La Los Las Of De Da Do".split(
    " ",
  ),
);
// Parenthesized non-names: confidence labels, claim types, abbreviations.
const NOT_NAME =
  /^(?:Probable|Possible|Uncertain|Primary|Secondary|Tertiary|Option [A-Z]|Familiar|Transliterated)$/;
const isCaps = (s) => /^[\p{Lu}\p{N} .'-]+$/u.test(s) && /\p{Lu}{2}/u.test(s);
const NAME_WORDS =
  /^(?:\p{Lu}[\p{L}\p{M}'’ʼ.-]*|de|da|do|del|von|van|of|the|bar|ben|bat)$/u;

export function namePairs(ctx) {
  if (ctx._pairs) return ctx._pairs;
  const out = [];
  for (const { i, m, zone } of matches(ctx, PAIR_RE)) {
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
export function s5d(ctx, add, familiarNames) {
  for (const p of namePairs(ctx))
    if (p.translit === p.familiar)
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

/** Collapse "Translit (Familiar)" glosses to "Familiar": the two renderings are separate name sections. */
export const collapseGlosses = (s) => s.replace(PAIR_RE, "$2");

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
export function s6f(ctx, add, model) {
  if (!model) return;
  for (const [v, text] of model.study) {
    const parts = text.split("@@");
    for (let k = 1; k < parts.length; k += 2) {
      const before = parts.slice(0, k).join("");
      const cls = CITATION.test(before)
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

// ---------------------------------------------------------------- S7a PT contractions (T-20)
// Three PT forms for an article fused into a contraction (review R-4):
//   (i)   contraction + italic word  `na *carne*`  — the T-20 pivot class
//   (ii)  italic article inside it   `n*a* carne`  — de-facto convention ("option D")
//   (iii) whole contraction italic   `*na* carne`
// Unicode left boundary (JS `\b` never matches before "à"/"às").
const CONTR = "na|no|nas|nos|da|do|das|dos|pela|pelo|pelas|pelos|à|às|ao|aos";
export const T20_RE = new RegExp(
  `(?<![\\p{L}\\p{M}\\p{Nd}_])(${CONTR}) \\*[^*]+\\*`,
  "gu",
);
const INTRA_RE =
  /(?<![\p{L}\p{M}\p{Nd}_*])(?:n|d|pel|à|a)\*(?:a|o|as|os|s)\*(?![\p{L}*])/gu;
const WHOLE_RE = new RegExp(
  `(?<![\\p{L}\\p{M}\\p{Nd}_*])\\*(?:${CONTR}|num|numa|dum|duma)\\*(?![\\p{L}*])`,
  "gu",
);
const PT_ARTICLE_ITALIC =
  /(?<![\p{L}*])\*(?:o|a|os|as|um|uma|uns|umas)\*(?![\p{L}*])/gu;
const EN_ARTICLE_ITALIC =
  /(?<![\p{L}*])\*(?:the|a|an|The|A|An)\*(?![\p{L}*])/gu;
const count = (s, re) => (s.match(re) ?? []).length;

export function s7a(ctx, add, enModel) {
  if (ctx.locale !== "pt-br" || !isChapterFile(ctx.path)) return;
  for (let i = 0; i < ctx.lines.length; i++) {
    const z = ctx.zones[i];
    const line = ctx.lines[i];
    if (z.zone === "main")
      for (const [re, form] of [
        [INTRA_RE, "intra-word"],
        [WHOLE_RE, "whole-contraction"],
      ]) {
        for (const f of line.matchAll(re))
          add(makeHit(ctx, i, "S7a", `form:${form}`, f[0], f.index));
      }
    for (const m of line.matchAll(T20_RE)) {
      // Reconciliation with the T-20 whole-file figure (190): every zone is recorded.
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
      const italic = m[0].slice(m[0].indexOf("*") + 1, -1);
      if (m[1] === "ao" && /(?:ar|er|ir|or)$/.test(italic)) {
        add(makeHit(ctx, i, "S7a", "ao+infinitive", m[0], m.index));
        continue;
      }
      // Per-verse article accounting: EN marks N added articles; PT marks M
      // (standalone + intra-word + whole-contraction). A deficit plus this form → pivot-likely.
      const pt = studyText(ctx, z.verse);
      const enN = count(enModel?.study.get(z.verse) ?? "", EN_ARTICLE_ITALIC);
      const ptN =
        count(pt, PT_ARTICLE_ITALIC) +
        count(pt, INTRA_RE) +
        count(pt, WHOLE_RE);
      add(
        makeHit(
          ctx,
          i,
          "S7a",
          enN > ptN && !/\s/.test(italic) ? "pivot-likely" : "review",
          m[0],
          m.index,
        ),
      );
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
export function s8(ctx, add) {
  const front = ctx.lines
    .map((l, i) => [l, i])
    .filter(([, i]) => ctx.zones[i].zone === "front");
  const status = front.find(([l]) => /^\*\*(?:Status|Estado):\*\*/.test(l));
  if (!status) add(makeHit(ctx, 0, "S8", "no-status", "", 0));
  else if (!STATUS_OK.test(status[0]))
    add(makeHit(ctx, status[1], "S8", "status-not-provisional", status[0], 0));
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
      "[Pp]ropagat\\p{L}*|[Pp]ropaga[çc]\\p{L}*|[Pp]ropagad[oa]s?|Propagierung|EN[- ][Pp]ivot|[Pp]ivot[- ](?:artifact|language)|mirror-EN|TODO:|TBD|FIXME|[Pp]laybook|PLAN_\\w+|lint|allow-list",
    ),
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
    word("(?:Rule|Regra|Regel|Regla|CORE-Regel|CORE Rule) \\d{1,2}"),
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
  const re = /â[\u0080-\u009F€™]+|[\u0080-\u009F]+|Ã[\u0080-¿]|�/g;
  for (let i = 0; i < ctx.lines.length; i++) {
    for (const m of ctx.lines[i].matchAll(re))
      add(makeHit(ctx, i, "S12", "mojibake", JSON.stringify(m[0]), m.index));
  }
}

// ---------------------------------------------------------------- S13 DE Ioudaioi (D9)
export function s13(ctx, add) {
  if (ctx.locale !== "de") return;
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
export function s14(ctx, add) {
  if (ctx.locale !== "pt-br") return;
  const re = word("[Vv]ós|[Vv]oss[oa]s?|[Cc]onvosco|[Vv]ocês");
  for (const { i, m } of matches(ctx, re, { zones: MAIN }))
    add(
      makeHit(ctx, i, "S14", /ocê/.test(m[0]) ? "voces" : "vos", m[0], m.index),
    );
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
  /^(?:TABLE OF CONTENTS|SUMÁRIO|INHALTSVERZEICHNIS|INDICE|ÍNDICE)$/;
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
export function s17(ctx, add) {
  if (!NT.has(ctx.book)) return;
  for (const [form, src] of CHRISTOS[ctx.locale])
    for (const { i, m } of matches(ctx, word(src), { zones: MAIN }))
      add(makeHit(ctx, i, "S17", form, m[0], m.index));
}

// ---------------------------------------------------------------- S18 Tier-2 note length
// RULES-CORE Tier 2: "each note 1-2 sentences maximum (default)"; Relocation Protocol:
// "normally under 3 sentences" — a soft cap, so S18 is decision data, not a defect count.
const ABBR =
  /(?:^|[\s(])(?:v|vv|cf|e\.g|i\.e|ca|c|ch|chs|lit|Gen|Gn|Ex|Lev|Num|Dt|Deut|Is|Isa|Jer|Ez|Dan|Mt|Mk|Lk|Jn|Ac|Rom|Ps|Sal|Sl|Hb|Heb|p|pp|n|nn|ed|eds|vol|al|etc|Jo|Jz|Mc|Lc|Hch|At|Apg|vgl|bzw|z\.B|d\.h|u\.a|sog|S|Bd|ff|Mr|Dr|St|Nr|Aufl|rev|Prov|Pr|Spr|Jes|a|e|i|ver|cap|caps|séc|s)\.$/;
export function sentences(text) {
  const t = text.replace(/\*\*[^*]*\*\*/g, "X").replace(/\([^)]*\)/g, "(…)");
  let n = 0;
  const re = /[.!?]["”»“']?(?=\s+["“„«(]?\p{Lu})/gu;
  for (const m of t.matchAll(re))
    if (!ABBR.test(t.slice(Math.max(0, m.index - 8), m.index + 1))) n++;
  return n + 1;
}
export function s18(ctx, add) {
  if (!isChapterFile(ctx.path)) return;
  for (let i = 0; i < ctx.lines.length; i++) {
    if (ctx.zones[i].zone !== "note") continue;
    const m = ctx.lines[i].match(/^>\s*-\s+(.*)$/);
    if (!m) continue;
    const n = sentences(m[1]);
    if (n > 3)
      add(
        makeHit(
          ctx,
          i,
          "S18",
          n > 5 ? "sentences>5" : "sentences=4-5",
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
];
