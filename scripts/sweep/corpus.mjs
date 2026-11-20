// Corpus-level checks: need several files at once (names inventory, EN-vs-locale
// per-verse comparisons, the ES accent dictionary).

import { makeHit, namePairs, sameName } from "./checks.mjs";
import { italicSpans, stripAccents, word } from "./text.mjs";

// ---------------------------------------------------------------- S5b/S5c names
/**
 * Classify every "Translit (Familiar)" pair against the D11 tables.
 * tabled: exact row match · conflict: the translit OR the familiar is tabled
 * with a different partner · reversed: "Familiar (Translit)" · untabled: neither.
 */
export function nameInventory(ctxs, table, add) {
  const byTranslit = new Map();
  const byFamiliar = new Map(); // `${locale}|${familiar}` → Set(translit)
  for (const r of table) {
    for (const [loc, fam] of Object.entries(r.familiar)) {
      byTranslit.set(`${loc}|${r.translit}`, fam);
      if (!byFamiliar.has(`${loc}|${fam}`))
        byFamiliar.set(`${loc}|${fam}`, new Set());
      byFamiliar.get(`${loc}|${fam}`).add(r.translit);
    }
  }
  const inv = new Map(); // key locale|translit|familiar → {count, books, cls}
  const familiarTranslits = new Map(); // locale|familiar → Map(translit → count)
  for (const ctx of ctxs) {
    for (const p of namePairs(ctx)) {
      // S5d redundant-pair; `cr` duplicates the verse renderings already counted
      if (p.zone === "cr" || sameName(p.translit, p.familiar)) continue;
      const tf = byTranslit.get(`${ctx.locale}|${p.translit}`);
      const ff = byFamiliar.get(`${ctx.locale}|${p.familiar}`);
      let cls;
      // A multi-word capture whose tail is the tabled form ("Cursed Kenaan", DE genitive
      // "Yochanans") is the tabled name with a prefix/suffix, not a conflicting spelling.
      const tail = p.translit.split(" ").at(-1);
      const tailOk =
        byTranslit.get(`${ctx.locale}|${tail}`) === p.familiar ||
        (ctx.locale === "de" &&
          byTranslit.get(`de|${tail.replace(/s$/, "")}`) === p.familiar);
      if (tf === p.familiar || tailOk) cls = "tabled";
      else if (byTranslit.get(`${ctx.locale}|${p.familiar}`) === p.translit)
        cls = "reversed";
      else if (tf !== undefined || ff) cls = "conflict";
      else cls = "untabled";
      const key = `${ctx.locale}|${p.translit}|${p.familiar}`;
      const e = inv.get(key) ?? {
        locale: ctx.locale,
        translit: p.translit,
        familiar: p.familiar,
        count: 0,
        books: new Set(),
        cls,
      };
      e.count++;
      e.books.add(ctx.book);
      inv.set(key, e);
      const fk = `${ctx.locale}|${p.familiar}`;
      if (!familiarTranslits.has(fk)) familiarTranslits.set(fk, new Map());
      const m = familiarTranslits.get(fk);
      m.set(p.translit, (m.get(p.translit) ?? 0) + 1);
      if (cls === "conflict" || cls === "reversed")
        add(
          makeHit(ctx, p.i, "S5c", cls, `${p.translit} (${p.familiar})`, p.idx),
        );
    }
  }
  // one familiar glossed with ≥2 transliterations anywhere in a locale
  for (const [fk, m] of familiarTranslits)
    if (m.size > 1) {
      const [locale, familiar] = fk.split("|");
      for (const e of inv.values())
        if (
          e.locale === locale &&
          e.familiar === familiar &&
          e.cls !== "conflict"
        )
          e.cls = `${e.cls}+multi-translit`;
    }
  return [...inv.values()]
    .map((e) => ({ ...e, books: [...e.books].sort().join(",") }))
    .sort((a, b) =>
      a.locale < b.locale
        ? -1
        : a.locale > b.locale
          ? 1
          : b.count - a.count ||
            (a.translit < b.translit ? -1 : a.translit > b.translit ? 1 : 0),
    );
}

/** S5d (iii): the same gloss repeated inside one name-rendering section. */
export function repeatedGlosses(ctxs, add) {
  for (const ctx of ctxs) {
    const seen = new Map();
    for (const p of namePairs(ctx)) {
      if (sameName(p.translit, p.familiar)) continue;
      const k = `${p.section}|${p.translit}|${p.familiar}`;
      if (seen.has(k))
        add(
          makeHit(
            ctx,
            p.i,
            "S5d",
            `repeated-gloss:${p.zone}`,
            `${p.translit} (${p.familiar})`,
            p.idx,
          ),
        );
      else seen.set(k, p.i);
    }
  }
}

/** Audit §5 known variant forms — token counts per locale × book (S5c report table). */
/** @type {[string, string[]][]} */
export const KNOWN_VARIANTS = [
  ["Moses", ["Moshe", "Mosheh"]],
  ["Nazareth", ["Natzeret", "Natseret", "Natsrat"]],
  ["Matthew", ["Mattai", "Mattityahu", "Matthaios"]],
  ["Isaiah", ["Yesha'yahu", "Yeshayahu", "Yesha’yahu"]],
  ["Thomas", ["Toma", "Thomas"]],
  ["Bartholomew", ["Bar-Talmai", "Bartholomaios", "Bar-Tolmai"]],
  ["James", ["Iakobos", "Ya'aqov", "Ya’aqov", "Yaakov"]],
  ["Capernaum (DE)", ["Kafarnaum", "Kapernaum"]],
  ["Nazareth (DE)", ["Nazaret", "Nazareth"]],
];
export function variantCounts(ctxs) {
  const rows = [];
  for (const [name, forms] of KNOWN_VARIANTS)
    for (const form of forms) {
      const re = word(form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      const per = new Map();
      for (const ctx of ctxs) {
        if (name.endsWith("(DE)") && ctx.locale !== "de") continue;
        let n = 0;
        ctx.lines.forEach((l, k) => {
          if (ctx.zones[k].zone !== "front" && ctx.zones[k].zone !== "cr")
            n += (l.match(re) ?? []).length;
        });
        if (n)
          per.set(
            `${ctx.locale}/${ctx.book}`,
            (per.get(`${ctx.locale}/${ctx.book}`) ?? 0) + n,
          );
      }
      if (per.size)
        rows.push({
          name,
          form,
          where: [...per]
            .sort()
            .map(([k, n]) => `${k}:${n}`)
            .join(" "),
        });
    }
  return rows;
}

// ---------------------------------------------------------------- S6c / S7b EN vs locale per verse
export function verseParity(ctxByKey, models, add) {
  for (const [key, ctx] of ctxByKey) {
    if (ctx.locale === "en") continue;
    const model = models.get(key);
    const enKey = key.replace(/^[^/]+\//, "en/");
    const en = models.get(enKey);
    if (!model || !en) continue;
    for (const [v, text] of model.study) {
      const enText = en.study.get(v) ?? "";
      const i = ctx.zones.findIndex((z) => z.zone === "main" && z.verse === v);
      const d = (text.match(/@@/g) ?? []).length;
      const de = (enText.match(/@@/g) ?? []).length;
      if (d !== de)
        add(
          makeHit(ctx, i, "S6c", "divine-count", `v${v}: ${d} vs EN ${de}`, 0),
        );
      const it = italicSpans(text).length;
      const ie = italicSpans(enText).length;
      const delta = Math.abs(it - ie);
      if (delta >= 2 || (ie === 0 && it >= 2) || (ie >= 2 && it === 0))
        add(
          makeHit(
            ctx,
            i,
            "S7b",
            delta >= 4 ? "delta>=4" : "delta>=2",
            `v${v}: ${it} vs EN ${ie}`,
            0,
          ),
        );
    }
  }
}

// ---------------------------------------------------------------- S11 ES orthography
/** Unaccented/accented pairs where BOTH spellings are correct Spanish words (per-instance judgment). */
export const ES_AMBIGUOUS = new Set(
  (
    "como cómo esta está estas están este éste ese ése el él solo sólo mas más se sé si sí que qué tu tú mi mí de dé " +
    "aun aún te té cual cuál quien quién donde dónde cuando cuándo cuanto cuánto porque porqué publico público " +
    "continuo continúo practica práctica ultimo último limite límite termino término deposito depósito " +
    "transito tránsito critico crítico intimo íntimo animo ánimo habito hábito dialogo diálogo calculo cálculo " +
    "esta ésta estos éstos aquel aquél tramite trámite envio envió envío entre entré sabana sábana papa papá " +
    "hacia hacía seria sería fe fé vio vió dio dió fue fué amo amó hablo habló llamo llamó creo creó separo separó " +
    "bendijo bendigo llego llegó paso pasó dejo dejó tomo tomó mando mandó miro miró hecho echo " +
    // verb/adjective homographs (impl. review R3-13)
    "especifica específica perdida pérdida explicita explícita legitima legítima llame llamé"
  ).split(" "),
);
const ES_WORD = /[\p{L}\p{M}]+/gu;
/** Lines whose words are not TT Spanish prose: bibliographic source lines. */
const ES_SKIP_LINE = /\*\*(?:Fuentes?|Sources?|Fonte|Quelle):\*\*/;
/** Spans inside a line that are not ES prose: link targets and repo paths. */
const ES_SKIP_SPAN = /\]\(#[^)]*\)|[\w-]+(?:\/[\w-]+)*\.md\b/g;
/** Italic spans outside the verse text are titles/transliterations; in `main` they are
 * the Rule 11 added words — Spanish prose (impl. review R1-6: `*habia*`, `*sera*`). */
const ES_ITALIC = /(?<!\*)\*[^*\n]+\*(?!\*)/g;
const blank = (m) => " ".repeat(m.length);
const INTERROGATIVE =
  /[¿¡]\s*(?:[Pp]or )?([Qq]ue|[Dd]onde|[Cc]omo|[Cc]uando|[Qq]uien(?:es)?|[Cc]ual(?:es)?|[Cc]uant[oa]s?)(?![\p{L}])/gu;
const NO_SE = /(?<![\p{L}])[Nn]o se(?=\s*[.?!"”…»])/gu;

/** ES reader lines (no front matter, no continuous-reading duplicate), with non-prose spans blanked. */
function esLines(ctxs) {
  const out = [];
  for (const ctx of ctxs) {
    if (ctx.locale !== "es") continue;
    ctx.lines.forEach((l, i) => {
      const z = ctx.zones[i];
      if (z.zone === "front" || z.zone === "cr" || ES_SKIP_LINE.test(l)) return;
      let t = l.replace(ES_SKIP_SPAN, blank);
      if (z.zone !== "main") t = t.replace(ES_ITALIC, blank);
      out.push([ctx, i, t]);
    });
  }
  return out;
}

/**
 * Corpus-dominance method (Step 2): a token with no diacritics whose accented
 * sibling is the dominant spelling in the ES corpus is a likely lost accent;
 * the inverse catches spurious accents (`generaciónes`). Context rules catch
 * what dominance cannot (review R-12): clause-final "No se." → "No sé",
 * interrogatives after ¿/¡, and the -o/-ó verb class (present 1sg vs preterite 3sg).
 */
/**
 * Generative rules (impl. review R2-7) for forms the dominance method cannot see
 * because the accented sibling is rare or absent:
 *   -cion/-sion (singular) is always -ción/-sión;
 *   future: <infinitive>+e / <-er|-ir infinitive>+a ("levantare", "volvera") — an -ar
 *     verb +a is also the imperfect subjunctive ("dominara"), so that case is `ambiguous`;
 *   -mente adverb whose adjective base is spelled with an accent in the corpus.
 */
/** Words whose stem minus the last letter is a word too ("par", "primer", "ir"): not futures. */
const NOT_FUTURE = new Set(
  "para era eras ira iras primera tercera cualquiera dondequiera quienquiera altera altere lidera hemera bara mira dura pura cura obra sobre entre".split(
    " ",
  ),
);
function generative(k, freq, best) {
  if (/[cs]ion$/.test(k) && k.length > 5)
    return ["missing-accent", `${k.slice(0, -2)}ón`];
  const inf = k.slice(0, -1);
  if (
    !NOT_FUTURE.has(k) &&
    /[aei]r$/.test(inf) &&
    inf.length >= 4 &&
    freq.has(inf)
  ) {
    if (k.endsWith("re")) return ["missing-accent:future", `${inf}é`];
    if (k.endsWith("ra"))
      return [
        /ar$/.test(inf)
          ? "ambiguous:future-or-subjunctive"
          : "missing-accent:future",
        `${inf}á`,
      ];
  }
  if (/mente$/.test(k) && k.length > 9) {
    const base = k.slice(0, -5);
    const [top, topN] = best(base) ?? [];
    if (top && top !== base && topN >= 2 && topN > (freq.get(base) ?? 0))
      return ["missing-accent:adverb", `${top}mente`];
  }
  return null;
}

export function esAccents(ctxs, add) {
  const lines = esLines(ctxs);
  const freq = new Map();
  for (const [, , l] of lines)
    for (const w of l.match(ES_WORD) ?? [])
      freq.set(w.toLowerCase(), (freq.get(w.toLowerCase()) ?? 0) + 1);
  const variants = new Map(); // stripped → Map(spelling → count)
  for (const [w, n] of freq) {
    const s = stripAccents(w);
    if (!variants.has(s)) variants.set(s, new Map());
    variants.get(s).set(w, n);
  }
  const best = (s) =>
    [...(variants.get(stripAccents(s)) ?? new Map())].sort(
      (a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1),
    )[0];
  for (const [ctx, i, l] of lines) {
    for (const m of l.matchAll(ES_WORD)) {
      const w = m[0];
      if (/[^\p{Script=Latin}\p{M}]/u.test(w)) continue; // Greek/Hebrew tokens are not ES words
      const k = w.toLowerCase();
      const s = stripAccents(k);
      const [top, topN] = best(s);
      if (top === k) {
        // only the unaccented spelling exists: try the generative rules
        if (k === s && !/^\p{Lu}/u.test(w)) {
          const g = generative(k, freq, best);
          if (g) add(makeHit(ctx, i, "S11", g[0], `${w}→${g[1]}`, m.index));
        }
        continue;
      }
      const n = freq.get(k);
      if (k === s) {
        if (!(topN >= 3 && topN > n)) continue;
        let cls;
        if (k.endsWith("o") && top === `${k.slice(0, -1)}ó`) cls = "o/ó-verb";
        else if (/ara$/.test(k) && top === `${k.slice(0, -1)}á`)
          cls = "ambiguous:future-or-subjunctive"; // llegara (subj.) vs llegará; -er/-ir subj. is -iera
        else
          cls =
            ES_AMBIGUOUS.has(k) || ES_AMBIGUOUS.has(top)
              ? "ambiguous"
              : "missing-accent";
        if (/^\p{Lu}/u.test(w)) {
          if (w.length <= 3) continue; // abbreviations (Gen, Ex)
          cls += w === w.toUpperCase() ? ":allcaps" : ":capitalized";
        }
        add(makeHit(ctx, i, "S11", cls, `${w}→${top}`, m.index));
      } else if (
        (freq.get(s) ?? 0) >= 20 &&
        n <= 3 &&
        !ES_AMBIGUOUS.has(k) &&
        /^[a-záéíóúüñ]+$/.test(k) && // not Greek/Hebrew/macron transliterations
        !(k.endsWith("ó") && s.endsWith("o")) // a preterite (decretó/argumentó) beside a noun (decreto)
      ) {
        add(makeHit(ctx, i, "S11", "spurious-accent?", `${w}→${s}`, m.index));
      }
    }
    for (const [re, cls] of [
      [INTERROGATIVE, "interrogative"],
      [NO_SE, "no-se→no-sé"],
    ]) {
      for (const m of l.matchAll(re))
        add(makeHit(ctx, i, "S11", cls, m[0], m.index));
    }
    // "a el" / "de el" (contraction al/del, unless the pronoun él was meant); "El" (deity) is case-excluded.
    const ael = /(?<![\p{L}])(a|de) el(?![\p{L}])/gu;
    for (const m of l.matchAll(ael))
      add(makeHit(ctx, i, "S11", "a-el/de-el", m[0], m.index));
  }
}
