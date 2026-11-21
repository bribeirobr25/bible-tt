// Step 4 batch 3 gate (PLAN_LAUNCH_FIXES §B3.4, playbook T-14): classes that were
// cleared from the corpus must stay at zero. Unlike checks.test.mjs (tool health
// only), this test deliberately asserts ABSENCE — a recurrence fails CI.
//
// Fast by design: it loads the corpus once (loadCorpus) and runs only the
// per-file checks it needs — never runSweep (12 s, already run twice by
// checks.test.mjs). The continuous reading (`cr`, the Read door) is judged too:
// the sweep's reader scope excludes it, so `cr` lines are relabelled `main` here.
//
// Legitimate uses live in ../cleared-allowlist.txt as `CHECK:class|file|exact line`;
// a stale entry (no longer matching a hit) fails the last test.

import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { loadCorpus } from "../../content-sweep.mjs";
import * as C from "../checks.mjs";

const ROOT = process.cwd();
const ALLOW_FILE = path.join(ROOT, "scripts/sweep/cleared-allowlist.txt");

/** check → classes that must be empty (rendered lines unless `all`). */
const CLEARED = [
  { fn: C.s12, check: "S12", classes: ["mojibake"], all: true },
  {
    fn: C.s13,
    check: "S13",
    classes: [
      "yehudim",
      "yehudi-other",
      "yehudim-lowercase",
      "yehudi-lowercase",
    ],
  },
  { fn: C.s1, check: "S1a", classes: ["de-yhwh", "meta-leak"] },
  { fn: C.s1, check: "S1b", classes: ["meta-leak"] },
  { fn: C.s6b, check: "S6b", classes: ["backticked-marker"] },
  { fn: C.s8, check: "S8", classes: null, all: true },
  {
    fn: C.s9,
    check: "S9",
    classes: [
      "editorial-id",
      "editorial-log-ref",
      "repo-path",
      "process-word",
      "propagation-word",
      "ai-provenance",
      "tier-jargon",
    ],
  },
  { fn: C.s10, check: "S10", classes: null, all: true },
  {
    fn: C.s15,
    check: "S15",
    classes: ["ascii-arrow", "odd-asterisk", "marker-in-table"],
  },
  { fn: C.s22, check: "S22", classes: ["note-icon-off-list"] },
];

/** Doubled article after an italic-marked contraction (L1: the whole contraction is italic). */
const DOUBLED =
  /(?<![\p{L}])(?:im \*dem\*|zum \*dem\*|zur \*der\*|vom \*dem\*|am \*dem\*|al \*el\*|del \*el\*|n[ao] \*[ao]\*|d[ao] \*[ao]\*)(?![\p{L}])/u;
/** Pre-v3.2 name-policy sentence (S5d stale-policy). */
const STALE = [
  /Proper names follow TT transliteration/,
  /[Nn]omes próprios seguem a transliteração/,
  /Eigennamen folgen der TT-Transliteration/,
  /[Nn]ombres propios siguen la transliteraci[oó]n/,
];

let hits;
let allow;
beforeAll(() => {
  const { ctxs } = loadCorpus(ROOT);
  hits = [];
  for (const raw of ctxs) {
    const ctx = {
      ...raw,
      zones: raw.zones.map((z) =>
        z.zone === "cr" ? { ...z, zone: "main" } : z,
      ),
    };
    const add = (h) => hits.push(h);
    for (const fn of new Set(CLEARED.map((c) => c.fn))) fn(ctx, add);
    ctx.lines.forEach((line, i) => {
      const z = ctx.zones[i];
      if (z.render === "no") return;
      if (z.zone === "main" && (line.match(/@@/g) ?? []).length % 2 === 1)
        hits.push(
          C.makeHit(
            ctx,
            i,
            "S6d",
            "unbalanced-verse",
            "@@",
            line.indexOf("@@"),
          ),
        );
      // the renderer prints backticks literally — reader text must not use code spans
      const code = line.match(/`[^`]+`/);
      if (code)
        hits.push(C.makeHit(ctx, i, "S6b", "code-span", code[0], code.index));
      const d = line.match(DOUBLED);
      if (d)
        hits.push(C.makeHit(ctx, i, "S7a", "doubled-article", d[0], d.index));
      for (const re of STALE) {
        const m = line.match(re);
        if (m)
          hits.push(C.makeHit(ctx, i, "S5d", "stale-policy", m[0], m.index));
      }
    });
  }
  allow = new Set(
    readFileSync(ALLOW_FILE, "utf8")
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("#")),
  );
}, 60_000);

const keyOf = (h, lines) =>
  `${h.check}:${h.cls}|${h.file}|${lines[h.file][h.line - 1]}`;

describe("cleared content classes stay cleared (Step 4 batch 3)", () => {
  const relevant = (h) => {
    if (["S6d", "S7a", "S5d"].includes(h.check)) return true;
    if (h.check === "S6b" && h.cls === "code-span") return true;
    const spec = CLEARED.find((c) => c.check === h.check);
    if (!spec) return false;
    if (h.check === "S9" && h.cls === "repo-path:see-field") return false;
    if (spec.classes && !spec.classes.includes(h.cls)) return false;
    return spec.all || h.render !== "no";
  };
  let fileLines;
  beforeAll(() => {
    fileLines = {};
    for (const h of hits)
      fileLines[h.file] ??= readFileSync(path.join(ROOT, h.file), "utf8")
        .normalize("NFC")
        .split("\n");
  });

  it("no hit in a cleared class (outside the reviewed allow-list)", () => {
    const left = hits
      .filter(relevant)
      .filter((h) => !allow.has(keyOf(h, fileLines)))
      .map((h) => `${h.check}:${h.cls} ${h.file}:${h.line} ${h.match}`);
    expect(left).toEqual([]);
  });

  it("every allow-list entry still matches a hit (no stale entries)", () => {
    const live = new Set(hits.filter(relevant).map((h) => keyOf(h, fileLines)));
    expect([...allow].filter((a) => !live.has(a))).toEqual([]);
  });
});
