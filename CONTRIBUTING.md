# Contributing to the Transparent Translation

This file is the **workflow** guide: how to set up, what "done" means, how we branch and commit, and the loops we follow for content and for planned work. It deliberately does **not** restate the substance of the standards — for those, follow the pointers in [Where the rules live](#where-the-rules-live).

---

## Setup

```bash
pnpm install
pnpm dev
```

- **Node** 22.x (`engines` in `package.json`), **pnpm** 9 (`packageManager` in `package.json`).
- The dev server runs on **port 3001** by project convention — it is fixed in `package.json` (`next dev -p 3001`). Open <http://localhost:3001>. Don't introduce port 3000 anywhere.

---

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with Turbopack — http://localhost:3001 |
| `pnpm build` | Production build |
| `pnpm test` | All Vitest unit tests (parsers, render-safe, conservation gate, locale parity, raw-count reconciliation, people-field resolution, i18n parity, allow-list freshness, content-sweep fixtures) |
| `pnpm lint` | Biome linter (`src/` + `scripts/`) |
| `pnpm typecheck` | `tsc --noEmit` + `tsc -p tsconfig.scripts.json` (JSDoc check of `scripts/**/*.mjs`) |
| `pnpm content:lint` | Hardened content lint (`scripts/content-lint.sh`); allow-list at `scripts/lint-allowlist.txt` |
| `pnpm content:lint:warn` | Same lint, non-blocking |
| `pnpm content:sweep` | Read-only rule-compliance scan → `docs/audit/content-sweep/` (not a gate; Step 4 promotes cleared classes into `content-lint`) |

---

## Definition of done (the gate)

A change is not done until **all** of these pass locally:

1. `pnpm test` — unit tests green, **including the conservation gate** (`__tests__/conservation.test.ts`), which proves the parser→structured derivation loses nothing. If you changed content structure, the unit counts there (person, verse, reading-guide, …) must still reconcile.
2. `pnpm lint` — Biome clean.
3. `pnpm build` — production build succeeds.
4. `pnpm content:lint` — content lint clean (or any new exception added, with justification, to `scripts/lint-allowlist.txt`).
5. **i18n parity** — any UI string added in one locale exists in all four (`en`, `pt-br`, `de`, `es`) under `src/infrastructure/i18n/messages/` (now enforced by `src/infrastructure/i18n/__tests__/messages-parity.test.ts`).
6. `pnpm typecheck` — both TypeScript passes clean.
7. **CI green** — the GitHub Actions **Gate** workflow (`.github/workflows/gate.yml`) runs steps 1–4 + typecheck on Linux (GNU grep, bash 5) for every PR and push to `main`; a PR **must not be merged** until it is green. **Enforced by GitHub (branch protection on `main`, 2026-11-19):** `main` accepts changes only through a pull request whose required status check **`gate`** (the job id in `gate.yml`) is green against the latest `main` (strict); the rule applies to admins too, force-pushes and branch deletion are blocked, and no approving review is required. Local runs use macOS BSD grep + bash 3.2 — both must pass.

Two recurring footguns:

- **`next-env.d.ts`** auto-regenerates and flips a path on dev vs. build. Run `git checkout next-env.d.ts` before staging so it doesn't end up in a commit.
- Don't commit content text changes inside a presentation-only change. Keep the diff to its stated scope (see the content loop below for how content changes flow).

---

## Branching & commits

- **`main` is the active trunk and the release gate.** Direct pushes to `main` are rejected by branch protection (admins included) — every change, however small, goes through a PR.
- Branch from `main`; open a PR back into `main` and merge only once the `gate` check is green **and** the merge is authorized by the project lead (standing authorization: LAUNCH_PROGRAM D14).
- Commit messages: a concise subject line, then a body that says **what changed, why, and how it was verified** (the gate results — e.g. "N tests pass; lint/typecheck/build/content-lint clean; conservation intact", with N the actual count; the current count is in `CLAUDE.md` › Verified state). Match the existing log style.
- End every commit with the co-author trailer:

  ```
  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

  Replace `Claude` with the name of the model actually used for that commit (the trailer your tool supplies is fine); don't copy a model name from an older commit. Commits must use your **GitHub no-reply email** — the account blocks pushes that expose a private address.

---

## Content authoring loop

> **Adding a new book or chapter?** Follow the full runbook in `docs/guides/AUTHORING-PLAYBOOK.md` — it sequences this loop into a start-to-finish checklist (artifact manifest, new-book activation touchpoints, per-phase gate) and carries a living "Known Traps" register. The steps below are the summary.

Content is markdown under `content/{locale}/{book}/` and is the **source of truth**; parsers read it at build time. Authoring is **EN-first, then PT-BR, DE, ES.**

1. **Log the decision first.** Before drafting a translation choice, record it in `docs/editorial-log/{book}.md` (schema in RULES-CORE.md). New glossary terms go through the glossary-expansion procedure (RULES-CORE.md).
2. **Author EN**, then propagate to the other three locales. Reading-Guide headings are localized (`READING GUIDE` / `GUIA DE LEITURA` / `LESEANLEITUNG` / `GUÍA DE LECTURA`) — match the per-locale heading.
3. Follow the file conventions in `CLAUDE.md` (new chapter / new book-introduction checklists) and the templates in `docs/templates/`.
4. Run the gate. New files are auto-discovered by the parsers — no registration step.

See `CLAUDE.md` → "Content authoring" for the per-file structure and the name-rendering rules.

---

## Planned-work loop

For anything larger than a small fix, we plan before we execute:

1. **Plan** — write the plan in `docs/audit/` (open items live in `docs/audit/PENDING.md`).
2. **Review** — the project lead audits the plan; iterate.
3. **Execute** — implement against the agreed plan, gated change-by-change.
4. **Validate** — run the gate; visual-check where UI is involved.
5. **Log** — record completed work in `docs/audit/EXECUTION_HISTORY.md` and the relevant `docs/editorial-log/`, and refresh the snapshot lines in `CLAUDE.md`/`README.md` when scope or counts change.

---

## Visual validation

For UI work, validate across **mobile / tablet / desktop** before calling it done. The Docker MCP browser targets the running dev server at `http://host.docker.internal:3001`; plain `curl` checks use `http://localhost:3001`. If the MCP browser drops the connection, it needs a manual `/mcp` reconnect.

---

## Where the rules live

Keep each document scoped to its concern; this file only links out.

| Concern | Document |
|---|---|
| Architecture, DDD layers, TypeScript, testing, dependencies | `docs/architecture/STANDARDS.md` |
| UI/UX — typography, color tokens, accessibility, anti-slop, reader-text markers | `docs/design/TT-DESIGN-SYSTEM.md` |
| Translation governance (30 rules, v3.4.1) | `docs/rules/RULES-CORE.md` + `RULES-HB.md` + `RULES-GS.md` |
| Editorial decisions per book (+ cross-book transliterations) | `docs/editorial-log/` |
| Authoring runbook (new chapter / new book) | `docs/guides/AUTHORING-PLAYBOOK.md` |
| Reader guide | `docs/guides/HOW-TO-READ-TT.md` |
| Project snapshot & file/URL map | `CLAUDE.md` |
| Completed-work ledger / open items | `docs/audit/EXECUTION_HISTORY.md` · `docs/audit/PENDING.md` |
