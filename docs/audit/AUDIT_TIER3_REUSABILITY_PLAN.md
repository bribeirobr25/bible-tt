# Audit — PLAN_TIER3_REUSABILITY.md

**Date:** 2026-06-19
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PLAN_TIER3_REUSABILITY.md` (status: DRAFT — self-audited §13; awaiting external audit + sign-off)
**Mandate:** verify no regression, content loss, side-effect, or rule/DDD/DRY compliance issue — against actual source, not the plan's self-report or its §12/§13 self-audit.
**Method:** Read directly this session: `markdown-parser.ts` (the `METADATA_LINE` vs `FIELD_LINE` divergence — WS3's central claim); the full `de/genesis/CHAPTER-9.md` (the plan's cited evidence for the active FIELD_LINE risk); the `<details>` call sites (`notes-view`, `chapter-shell`, `book-context-view`, `app/[locale]/[book]/people/page.tsx`); `globals.css` (the `.tt-details` accordion). Cross-checked against the 5 parsers + `person-card`/`prophecy-view` read in the Tier-2 audit this session. Could not run the gate (no shell).
**Status:** ✅ **APPROVE WS1 + WS2; endorse the WS3 de-scope (with one correction to its evidence).** The plan's self-audit reached the right conclusions: WS3 is mostly false-DRY and was correctly cut to `SOURCE_LABELS`. I verified the load-bearing technical claims — the `FIELD_LINE` `(.+)/(.*)` divergence is real, the header regexes are genuine semantic coincidences, the WS1 inventory + className gotcha are accurate, and the accordion is pure-native. One correction: the plan's *cited example* for the FIELD_LINE risk (`**Gibbor-Kette:**` in `de/genesis/CHAPTER-9.md`) is wrong — it's not in that file — but the underlying divergence and the de-scope decision are sound regardless. None of this blocks.

---

## Executive summary

Tier 3 is three independent structural refactors (shared `<Disclosure>`, split `people-parser`, shared parser plumbing), each guarded by an *equivalence* assertion (byte-identical HTML / identical parse output / unchanged conservation) rather than a value or render diff. That risk-classing is correct: nothing here changes content, resolved values, or rendered output by design, so the blast radius is structural-only despite touching many files.

The plan's most consequential move is in its own §13 self-audit: it **de-scoped WS3**, concluding that parser Finding 5 was over-stated and most of the "duplicated" regexes are either divergent (unifying would change behavior) or coincidental (unifying would couple unrelated concepts). I verified this against source and it is **correct**:
- `FIELD_LINE` genuinely differs — markdown's `METADATA_LINE` uses `(.+)` (non-empty value required); the other four parsers use `(.*)`. Unifying would be a real parse-output change.
- The `## (.+)` header regexes are the *same pattern for different jobs* (`SECTION_HEADER`/`ENTRY_HEADER`/`MOTIF_HEADER`), and enrichment's is structurally different (`/^## ([A-Z])(?:_\w+)?\.\s+…/`). Sharing one constant would couple unrelated concepts.
- Only `SOURCE_LABELS` (same 4 words, 3 forms) is genuinely safe to unify.

That a plan red-teamed its own scope and *removed* the risky two-thirds of a workstream is exactly the discipline this project wants. My job was to confirm it didn't over- or under-cut — it cut correctly.

WS1 (shared `<Disclosure>`) and WS2 (split `people-parser`) are both sound: I confirmed the 10-site inventory (including the `app/`-layer 10th site), the simple/rich summary split, the real className-trailing-space gotcha, the pure-native accordion (no JS owns `open`), and that `parsePeopleMarkdown` is the only public export (so the split touches no consumer).

---

## Verification table (plan claim vs. source)

| # | Plan claim | Verified? | Evidence |
|---|---|---|---|
| 1 | WS3: `FIELD_LINE` differs — markdown `(.+)`, others `(.*)`; unifying is an active parse risk | ✓ (mechanism) / ✗ (cited example) / ◑ ("active" → latent) | `markdown-parser.METADATA_LINE = /^\*\*(.+?):\*\*\s*(.+)$/`; prophecy/book-context/people `FIELD_LINE = …\s*(.*)$/`. Divergence real in code. **But** the cited trigger `**Gibbor-Kette:**` is in neither `de/genesis/CHAPTER-9.md` nor `CHAPTER-11.md` (I read both in full) — and neither file has ANY bare empty-value `**Label:**` line. So the divergence is **latent**, not the "active parse risk" the plan claims. See Finding 1. |
| 2 | WS3: header regexes are semantic coincidence, not duplication | ✓ | markdown `SECTION_HEADER=/^## (.+)$/`, book-context `MOTIF_HEADER`, prophecy `ENTRY_HEADER` — same regex, different meaning; enrichment `/^## ([A-Z])(?:_\w+)?\.\s+(.+)$/` structurally different. Unifying would couple unrelated concepts. Correct. |
| 3 | WS3: `stripBlockquote` differs (`/^>\s?/` vs `/^>\s*/`) | ✓ | markdown `parseNotes` uses `/^>\s?/` (optional single space); book-context/enrichment use `/^>\s*/` (zero-or-more). Real difference on `>  double-space`. Correctly flagged "verify or leave." |
| 4 | WS3: `SOURCE_LABELS` genuinely duplicated, 3 forms, safe to unify | ✓ | book-context `SOURCE_LABELS=["source","fonte","quelle","fuente"]`; enrichment `SOURCE_LINE` regex; people inline `norm==="source"\|...`. Same 4 words, same purpose. The one defensible unification. |
| 5 | WS1: 10 `<details>` across 9 files; simple(5)/rich(4)+person-card split | ✓ | Confirmed notes-view (`notes-acc`, simple, class-extras), chapter-shell overview (no name, simple, `body prose`), book-context-view (`bg-acc`, rich summary), prophecy (`prophecy-acc`, rich badge+chev), person-card (`tt-person`, distinct base). |
| 6 | WS1: 10th site = `app/[locale]/[book]/people/page.tsx` Sources | ✓ | Present: simple `<details className="tt-details">` + `{t("people.sourcesConsulted")}` + chev, in the `app/` layer. |
| 7 | WS1: className trailing-space gotcha (W1-R5) | ✓ | notes-view has `className="tt-details max-w-[46rem] mx-auto"`; chapter-shell has bare `"tt-details"`. Naive `` `tt-details ${className??""}` `` → `"tt-details "` (trailing space) → fails byte-identical gate. Conditional join required. Real. |
| 8 | WS1: accordion is pure native HTML+CSS, no JS owns `open` | ✓ | `globals.css`: `.tt-details[open] > summary .chev { transform: rotate(90deg); }` — driven by native `[open]`; exclusivity from native `details[name]`. No JS state. `<Disclosure>` only needs to emit identical markup. |
| 9 | WS1: leave `person-card`/`tt-person` out of scope | ✓ | `.tt-person` is a distinct base class with its own `.pbody`/`.pname`/`.plife` structure (not `.tt-details .body`). Folding in would need a `base`-class prop for one site. Correct to defer. |
| 10 | WS2: `people-parser` 948 lines, `parsePeopleMarkdown` only public export | ✓ | Confirmed (Tier-2 read): single `export function parsePeopleMarkdown`; helpers (`resolveField`, `parseTableRow`, `parseOriginType`, `parseHistoricityStatus`, `flushGenealogy`) are module-private + pure with explicit args. Split is a clean module move. |
| 11 | WS2: `ParseState` confined to the entry loop | ✓ | `ParseState` is local to `parsePeopleMarkdown`; the extractable helpers take explicit args and don't close over it (the plan's `flushGenealogy` caveat is the one to check — it takes `(state, genealogies)`, so the executor must pass state explicitly, not close over it). |
| 12 | DDD: WS1→ui/shared, WS2→infrastructure/content, WS3→infrastructure/content/shared; no new dep directions | ✓ | All within-layer or down-layer; consistent with the established structure. |

---

## Findings

### Finding 1 — WS3's de-scope conclusion is correct, but its evidence is wrong on TWO counts (mis-cited file + "active" should be "latent"); fix both so the executor trusts the right reason.

The §13 self-audit justifies *not* unifying `FIELD_LINE` by claiming empty-value `**Label:**` sub-headings "exist in real content (`de/genesis/CHAPTER-9.md`, `CHAPTER-10.md`, e.g. `**Gibbor-Kette:**`)" and calls it "an *active* parse risk on DE chapters." I read **all of both `de/genesis/CHAPTER-9.md` and `CHAPTER-11.md` in full**. Two problems:
1. **The cited example doesn't exist.** There is no `**Gibbor-Kette:**` in either file (CHAPTER-9 is the Noahic covenant; CHAPTER-11 is Babel + Shem's genealogy).
2. **There is no bare empty-value `**Label:**` line anywhere in either file.** Every `**Label:**` is either a metadata pair *with* a value (`**Grundtext:** …`, `**Status:** …`) or a note heading with an emoji prefix (`🔴 **KRITISCH — …**`) that matches `NOTE_TYPE_PREFIX`, not `FIELD_LINE`/`METADATA_LINE`. So the divergence is **latent**, not the "active parse risk" the plan asserts.

**Neither problem changes the conclusion — but both change the *reason*, which matters for the executor.** The de-scope is justified on the citation-independent ground I verified directly: the regexes *actually differ in code* (`METADATA_LINE` `(.+)` vs `FIELD_LINE` `(.*)`), and `extractMetadata` relies on `(.+)` to reject value-less lines when harvesting the `## The Transparent Translation` metadata block. Unifying these divergent regexes is unnecessary risk for zero benefit, **whether or not a triggering line exists today** (and as of this audit, none does in the two cited files). **The right framing for the plan:** "`METADATA_LINE` and `FIELD_LINE` differ by `(.+)` vs `(.*)` — different parsers, different empty-value semantics. The difference is latent in current content but real in code; unifying buys nothing and risks a future reclassification. Leave them separate." Drop the false `**Gibbor-Kette:**`/CHAPTER-9 "active risk" claim entirely — if the executor goes to verify it (as I did), they'll find it false and may wrongly conclude the whole concern is imaginary and unify anyway. The latent-divergence argument is the durable one.

### Minor

**Minor 1 — WS1 W1-R5 (className join) should be the component's *first* unit test, not just an HTML-diff catch.** The trailing-space bug is the single most likely way WS1 silently fails the byte-identical gate, and it's trivially unit-testable at the component level (`<Disclosure>` with no `className` → `class="tt-details"` exactly; with `className="x"` → `class="tt-details x"`). The plan mentions it (good) and relies on the HTML-diff to catch it; add an explicit component test so it's caught at step 1, before the per-page diffs. Same for `bodyClassName`.

**Minor 2 — the rich-summary chevron contract needs a per-site decision table, not just a `chevron` boolean.** I confirmed three different summary shapes: simple (chev is last child — notes-view, chapter-shell, app/people), rich-with-trailing-chev (book-context-view appends chev as the last summary child, same as simple), and rich-with-grouped-chev (prophecy groups badge+chev in a flex container). So `chevron={true}` works for book-context (chev appended last) but `chevron={false}` is needed for prophecy (chev already inside the custom summary). The plan says this, but the executor should write down, per site, whether the chev is component-appended or summary-embedded *before* converting — a single wrong choice is a byte-diff. Cheap to get right, cheap to catch, but worth pre-deciding.

**Minor 3 — WS2's `flushGenealogy` closure caveat is the one real WS2 risk; make it a definition-of-done check.** The plan already flags "executor verifies `flushGenealogy`'s signature doesn't close over state." Confirmed this is the right thing to watch: `flushGenealogy(state, genealogies)` and the table helpers take explicit args today, so the move is clean — but if the executor accidentally leaves a helper referencing the outer `state`/`seenSlugs`, the module split would either fail to compile or (worse) silently capture a stale binding. The people-data snapshot catches behavior, but add "no extracted helper references a symbol from the entry-loop scope" as an explicit review step.

### Confirmed safe (verified, no action)

- **The WS3 de-scope is correct and well-reasoned** — `FIELD_LINE` divergence real, header regexes coincidental, `stripBlockquote` divergent, only `SOURCE_LABELS` safe. The plan removed the risky part of its own scope; that's the right call. (Cutting WS3 entirely would also be defensible — it's the lowest-value workstream even at `SOURCE_LABELS`-only.)
- **WS1 accordion is pure native** — no JS owns `open`; `<Disclosure>` is a markup-equivalence problem only, with the global CSS untouched. The byte-identical-HTML gate is the right and sufficient guard.
- **WS2 is a clean module move** — single public export, pure helpers, state confined to the loop. The people-data snapshot + 58 existing tests + conservation are the right triple guard.
- **The guard-selection is correct per workstream** — HTML-equivalence (WS1), parse-output snapshot (WS2/WS3), conservation-unchanged (content-loss backstop). This correctly carries the Tier-1/2 learning that the guard must match the change class.
- **DDD posture holds** — no new dependency directions; every change reduces duplication or splits within a layer.
- **Independence is real** — the three workstreams share no code; doing WS1 alone (the recommendation) is safe and self-contained.

---

## On the three open questions

- **Q1 (do all three or a subset):** Do **WS1 first, standalone** — highest value, lowest risk, fully self-contained, and the HTML-diff gate makes regressions impossible to miss. **WS2** is a good second session. **WS3**, even cut to `SOURCE_LABELS`, is marginal — a single shared 4-element array is barely worth a commit; I'd either fold it into WS2's session (same layer) or drop it and note in PENDING. The plan's own instinct ("reduce WS3 to `SOURCE_LABELS` or drop") is right; I lean **drop or fold**, not a standalone session.
- **Q2 (fold `person-card` into `<Disclosure>`):** **Leave it separate.** `.tt-person` is a distinct base class with its own body/summary structure; a `base`-class prop for one caller is the kind of generality that earns its keep only at 2+ sites. Note in PENDING as a Tier-4 candidate if a second `tt-person`-style disclosure ever appears.
- **Q3 (WS3 scope):** Covered above — `SOURCE_LABELS` only, and even that is optional. Do **not** unify `FIELD_LINE` or the headers (Finding 1 + verification rows 1–2).

---

## Recommendation

**APPROVE WS1 and WS2; endorse the WS3 de-scope.** The plan's self-audit did the hard part correctly — it identified and removed the false-DRY in WS3 rather than charging into a parse-output-changing unification. I verified the technical basis for that de-scope against source and it holds; the only fix is Finding 1 (drop the mis-cited `**Gibbor-Kette:**`/CHAPTER-9 "active risk" claim and reframe as the latent-but-real code divergence — verified across both cited DE files: the *argument* stands, the *example* and the "active" framing don't).

Before execution, fold in: **Finding 1** (fix the WS3 citation to the regex-divergence argument), **Minor 1** (className join as a step-1 component unit test), **Minor 2** (per-site chevron decision table), and **Minor 3** (WS2 "no helper closes over loop state" review step). Sequence **WS1 standalone first** (HTML-diff gated, the safest high-value win), then **WS2** (snapshot + 58 tests + conservation), and treat **WS3** as drop-or-fold rather than a session of its own.

The risk-classing is right: these are equivalence-guarded structural refactors with no content, value, or render change by design. WS1's byte-identical-HTML gate and WS2's parse-snapshot gate are precisely the proofs that make "pure refactor" a checkable claim rather than a hope.

*Method note: parser regexes, the FIELD_LINE divergence, the WS1 site inventory + className gotcha, and the native-accordion CSS were verified against source. The HTML-diffs (WS1), people-data + parse snapshots (WS2/WS3), and the full gate (`pnpm test`/`lint`/`build`/`content:lint` + conservation) were not run here (no shell) — they remain the executor's last-mile proof. Production `main` untouched (work on `content-multibook-expansion`).*

---

## Addendum (deeper pass, 2026-06-19) — WS3 evidence closed

After the main audit I closed the one residual that could refine the WS3 finding: whether a bare empty-value `**Label:**` line — the thing that would make the `FIELD_LINE` `(.+)/(.*)` divergence an *active* rather than latent risk — actually exists in the content the plan cited.

**Read in full: `de/genesis/CHAPTER-9.md` + `de/genesis/CHAPTER-11.md`.** Result: the cited `**Gibbor-Kette:**` is in **neither** file, and **neither file contains any bare empty-value `**Label:**` line** (every match is a valued metadata pair or an emoji-prefixed note heading). So the divergence is **latent** — real in the code, unexercised by current content. This sharpens Finding 1: the plan's "active parse risk on DE chapters" is overstated on two counts (wrong file + wrong active/latent classification), though the de-scope decision it supports remains correct for the durable reason (don't unify divergent regexes for zero benefit).

**Nothing in the deeper pass changes the verdict. APPROVE WS1+WS2, endorse the WS3 de-scope, stands.** The remaining unverifiable items are execution-time (the HTML-diffs, parse snapshots, full gate) and cannot be closed by more reading. This is final.
