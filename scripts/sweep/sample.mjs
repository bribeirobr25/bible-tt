// Seeded precision sample (PLAN_CONTENT_SWEEP.md §6.2): up to N hits per
// check×class, ordered by a stable hash so re-runs pick the same hits.
//   node scripts/sweep/sample.mjs [N] [checkPrefix] [classPrefix]
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const [n = "10", prefix = "", clsPrefix = ""] = process.argv.slice(2);
const rows = readFileSync("docs/audit/content-sweep/findings.tsv", "utf8")
  .trim()
  .split("\n")
  .slice(1)
  .map((l) => l.split("\t"));
const groups = new Map();
for (const r of rows) {
  if (!r[0].startsWith(prefix) || !r[1].startsWith(clsPrefix)) continue;
  const k = `${r[0]} ${r[1]}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(r);
}
const h = (r) => createHash("sha1").update(`${r[4]}|${r[7]}`).digest("hex");
for (const [k, rs] of [...groups].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
  console.log(`\n## ${k} (${rs.length})`);
  for (const r of rs.sort((a, b) => (h(a) < h(b) ? -1 : 1)).slice(0, Number(n)))
    console.log(
      `- ${r[4].replace("content/", "")} [${r[5]}/${r[6]}] ${r[7].slice(0, 50)} :: ${r[8].slice(0, 130)}`,
    );
}
