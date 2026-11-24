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
import { zoneLines } from "../zones.mjs";

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
    classes: [
      "ascii-arrow",
      "odd-asterisk",
      "marker-in-table",
      "markup-in-caption",
    ],
  },
  { fn: C.s22, check: "S22", classes: ["note-icon-off-list"] },
];

/** Doubled article after an italic-marked contraction (L1: the whole contraction is italic). */
const DOUBLED =
  /(?<![\p{L}])(?:im \*dem\*|zum \*dem\*|zur \*der\*|vom \*dem\*|am \*dem\*|al \*el\*|del \*el\*|n[ao] \*[ao]\*|d[ao] \*[ao]\*)(?![\p{L}])/u;
/** Pre-v3.2 name-policy sentence — the sweep's own patterns (one source of truth). */
const STALE = C.STALE_POLICY.map(
  (re) => new RegExp(re.source, re.flags.replace("g", "")),
);

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
      // a bare "@@…@@" in prose renders as a lone red ellipsis; only legend bullets may show it
      const bare = line.match(/@@["“„]?…["”“]?@@/);
      if (bare && !/^\s*(?:>\s*)?(?:[-•*]\s*)?@@["“„]?…/.test(line))
        hits.push(C.makeHit(ctx, i, "S6b", "bare-marker", bare[0], bare.index));
      // D9 in any case form (all-caps note titles)
      const caps = ctx.locale === "de" && line.match(/\bYEHUDI\p{Lu}*/u);
      if (caps)
        hits.push(C.makeHit(ctx, i, "S13", "yehudim", caps[0], caps.index));
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
  // a multiset: the same allowed line pasted twice needs two entries
  allow = new Map();
  for (const l of readFileSync(ALLOW_FILE, "utf8").normalize("NFC").split("\n"))
    if (l.trim() && !l.startsWith("#")) allow.set(l, (allow.get(l) ?? 0) + 1);
}, 60_000);

const keyOf = (h, lines) =>
  `${h.check}:${h.cls}|${h.file}|${lines[h.file][h.line - 1]}`;

describe("cleared content classes stay cleared (Step 4 batch 3)", () => {
  const relevant = (h) => {
    if (["S6d", "S7a", "S5d"].includes(h.check)) return true;
    if (h.check === "S6b" && (h.cls === "code-span" || h.cls === "bare-marker"))
      return true;
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
    const budget = new Map(allow);
    const left = [];
    for (const h of hits.filter(relevant)) {
      const k = keyOf(h, fileLines);
      const n = budget.get(k) ?? 0;
      if (n > 0) budget.set(k, n - 1);
      else left.push(`${h.check}:${h.cls} ${h.file}:${h.line} ${h.match}`);
    }
    expect(left).toEqual([]);
  });

  it("every allow-list entry still matches a hit (no stale entries)", () => {
    const live = new Map();
    for (const h of hits.filter(relevant)) {
      const k = keyOf(h, fileLines);
      live.set(k, (live.get(k) ?? 0) + 1);
    }
    expect(
      [...allow].filter(([k, n]) => (live.get(k) ?? 0) < n).map(([k]) => k),
    ).toEqual([]);
  });

  it("every guarded class is still produced by its check (a renamed class cannot silence the gate)", () => {
    const mk = (text, rel) => {
      const [locale, book] = rel.split("/");
      return {
        path: `content/${rel}`,
        key: rel,
        locale,
        book,
        lines: text.split("\n"),
        zones: zoneLines(text, rel),
      };
    };
    const real = (rel, from, to) => {
      const text = readFileSync(path.join(ROOT, "content", rel), "utf8");
      expect(text.includes(from), `fixture anchor missing in ${rel}`).toBe(
        true,
      );
      return mk(text.replace(from, to), rel);
    };
    const FIX = {
      S12: [mk("# T\n## A\nx \u00e2\u0080\u0094 y", "en/john/CONTEXT.md")],
      S13: [
        mk("# T\n## A\ndie Yehudim, ein Yehudi", "de/john/CONTEXT.md"),
        mk("# T\n## A\nos yehudim, um yehudi", "pt-br/john/CONTEXT.md"),
      ],
      S1a: [
        mk(
          "# T\n## A. X\nvor dem Tag YHWHs\nDE→JHWH, PT→YHWH in der Propagierung",
          "de/john/CONTEXT.md",
        ),
      ],
      S1b: [
        mk("# T\n## A. X\nJHWH in DE on propagation", "en/acts/CONTEXT.md"),
      ],
      S6b: [mk("# T\n## A. X\nmarked `@@x@@` here", "en/john/CONTEXT.md")],
      S8: [
        mk(
          "# T\n**Status:** reviewed\n**Ruleset:** v3.3\n## A. X\nt",
          "en/john/CONTEXT.md",
        ),
      ],
      S9: [
        mk(
          "# T\n## A. X\nsee P-009 and `docs/audit/X.md`; the editorial log; Phase 3 work; on propagation; Drafted by Claude; a Tier 2 note; Im Redaktionslog; the RULES-GS threshold",
          "en/john/PEOPLE.md",
        ),
      ],
      S10: [
        mk(
          "# T\n## A. X\nper the v3.3.2 cross-book convention",
          "en/john/CONTEXT.md",
        ),
      ],
      S15: [
        mk("# T\n## A\nA -> B\none *odd", "en/john/CONTEXT.md"),
        mk(
          "# T\n## A\nThe **caption**\n\n| @@x@@ | b |\n|---|---|\n| c | d |",
          "en/luke/PEOPLE.md",
        ),
      ],
      S22: [
        real(
          "pt-br/genesis/CHAPTER-9.md",
          "> 🟡 **NOTA DE RECEP",
          "> ⚠️ **NOTA DE RECEP",
        ),
      ],
    };
    const missing = [];
    for (const spec of CLEARED) {
      const got = new Set();
      for (const ctx of FIX[spec.check] ?? [])
        spec.fn(ctx, (h) => h.check === spec.check && got.add(h.cls));
      const want = spec.classes ?? [];
      if (!got.size) missing.push(`${spec.check}: no hit at all`);
      for (const c of want) if (!got.has(c)) missing.push(`${spec.check}:${c}`);
    }
    expect(missing).toEqual([]);
  });
});
