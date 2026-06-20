# The Transparent Translation — Architecture & Code Standards
## Backend, Frontend, and Infrastructure Guide

**Last updated:** 2026-04-21
**Framework:** Next.js 16 (App Router, React Server Components, Turbopack)
**Language:** TypeScript (strict mode)
**Linter:** Biome
**Test runner:** Vitest
**Hosting:** Vercel (free tier, static-first)

---

## 1. Domain-Driven Design (DDD)

### Principle
Organize code around the **problem domain** (Bible translation content), not around the framework (Next.js). The domain layer has zero framework dependencies.

### Layers

```
src/
├── domain/           ← Pure domain types and interfaces. NO framework imports.
├── infrastructure/   ← Adapters that implement domain interfaces. Framework-aware.
├── ui/               ← Presentation components. React-aware. No domain logic.
├── app/              ← Next.js routing and page composition. Thin glue layer.
├── hooks/            ← React hooks for client-side state.
└─�� lib/              ← Shared utilities and bridge functions.
```

### Rules
- `domain/` **never** imports from `infrastructure/`, `ui/`, `app/`, or `next`.
- `infrastructure/` imports from `domain/` (to implement interfaces) and external libraries (fs, gray-matter).
- `ui/` imports from `domain/` (for types) but **never** from `infrastructure/` directly.
- `app/` composes everything — calls `lib/content-loader.ts` (which bridges infrastructure to pages) and renders `ui/` components.
- `lib/` bridges `infrastructure/` to `app/` — this is the only place that calls repository functions.

### Current implementation

```
domain/content/types.ts          → ChapterData, Verse, Note, EnrichmentData (pure types)
infrastructure/content/           → markdown-parser.ts, enrichment-parser.ts, fs-content-repository.ts
infrastructure/i18n/              → config.ts, routing.ts, request.ts, messages/*.json
ui/reading/                       → continuous-reading.tsx, reading-progress.tsx
ui/study/                         → verse-card.tsx, note-block.tsx, glossary-panel.tsx
ui/enrichment/                    → context-view.tsx, enrichment-entry.tsx
ui/navigation/                    → global-header.tsx, chapter-nav.tsx, language-switcher.tsx
ui/shared/                        → chapter-view.tsx (composes reading + study + context modes)
lib/content-loader.ts             → getChapterData(), getEnrichmentData(), getAllChapterParams()
app/[locale]/[book]/[chapter]/    → page.tsx (calls content-loader, renders chapter-view)
```

### Test: can you swap the infrastructure?
If you replaced `fs-content-repository.ts` with a database adapter, the domain types, UI components, and app routing should require **zero changes**. Only `lib/content-loader.ts` would change its import source. This is the DDD litmus test.

---

## 2. Event-Driven Architecture

### Principle
State changes flow through **events** (URL changes, user interactions, scroll position), not through imperative mutations or global state.

### Current implementation
| Event source | Mechanism | Consumer |
|---|---|---|
| Locale change | URL-based (`/en/` → `/pt-br/`) via next-intl middleware | All pages re-render with new locale |
| Chapter navigation | URL-based (`/genesis/1` → `/genesis/2`) | Page component fetches new data |
| View mode toggle | React `useState` (reading → study → context) | `chapter-view.tsx` conditionally renders |
| Scroll progress | `scroll` event → `useState` in `reading-progress.tsx` | Progress bar width |
| Details expand/collapse | Native `<details>` HTML event | Browser handles; CSS transitions respond |

### Rules
- **No global state library** (no Redux, Zustand, Jotai). The app is static content — URL is the state.
- **URL as truth** for navigation state (locale, book, chapter). Client-side state only for ephemeral UI (view mode, scroll position).
- **Future analytics events** (when implemented) use the taxonomy in §10 (Product KPIs & Analytics): `CHAPTER_VIEWED`, `VIEW_MODE_SWITCHED`, `LANGUAGE_CHANGED`, `NOTE_EXPANDED`, `GLOSSARY_OPENED`.

### Anti-pattern: don't
- Don't put view-mode in URL query params (it's ephemeral; losing it on page reload is fine)
- Don't store content in client-side state (it's server-rendered from markdown)
- Don't create an event bus for current scope (static site doesn't need one)

---

## 3. Service-Agnostic Abstraction Layer

### Principle
Domain logic depends on **interfaces** (ports), not on **implementations** (adapters). The infrastructure can be swapped without touching the domain or UI.

### Current implementation

```typescript
// Domain defines the SHAPE of data (types.ts)
export interface ChapterData {
  metadata: ChapterMetadata;
  continuousReading: Paragraph[];
  verses: Verse[];
  glossary: GlossaryEntry[];
  supplementarySections: SupplementarySection[];
}

// Infrastructure implements the READING of data (fs-content-repository.ts)
export async function readChapter(locale, book, chapter): Promise<ChapterData | null> {
  const raw = await fs.readFile(filePath, "utf-8");
  return parseChapterMarkdown(raw, book, chapter);
}

// Lib bridges infrastructure to app (content-loader.ts)
export async function getChapterData(locale, book, chapter): Promise<ChapterData | null> {
  return readChapter(locale, book, chapter);
}
```

### Future swap scenarios
| Current adapter | Future adapter | What changes |
|---|---|---|
| `fs-content-repository.ts` (file system) | `db-content-repository.ts` (PostgreSQL) | Only the adapter file + `content-loader.ts` import |
| Markdown files on disk | CMS API (Sanity, Strapi) | Only the adapter + parser |
| `next-intl` for i18n | Custom i18n solution | Only `infrastructure/i18n/` |

### Rules
- Types live in `domain/`. Adapters live in `infrastructure/`. Never the reverse.
- If you add a new data source, create a new adapter file — don't modify the domain types to fit the source.
- `content-loader.ts` is the seam — the only file that imports from `infrastructure/` and is imported by `app/`.

---

## 4. Code Reusability & DRY

### Principle
Don't repeat yourself — but don't abstract prematurely either. Three similar lines are better than a premature abstraction. Extract after the third use.

### Current reuse patterns
| Pattern | Shared by | Location |
|---|---|---|
| `NoteBlock` component | All verse notes across all chapters | `ui/study/note-block.tsx` |
| `EnrichmentEntryCard` | All enrichment entries across all chapters | `ui/enrichment/enrichment-entry.tsx` |
| `LanguageSwitcher` | Chapter view header (could be shared with global header) | `ui/navigation/language-switcher.tsx` |
| `parseChapterMarkdown()` | All 3 languages × all chapters | `infrastructure/content/markdown-parser.ts` |
| `cn()` utility | All components needing conditional classes | `lib/cn.ts` |

### The 3× rule
- First occurrence: write inline
- Second occurrence: tolerate duplication
- Third occurrence: extract to shared component/utility

### Anti-pattern: don't
- Don't create a `<BaseCard>` wrapper when you have 2 card-like things — wait for the third
- Don't create a `utils/` dump — utilities should have specific homes (`lib/cn.ts`, `lib/slug.ts`)
- Don't abstract the parser into a "generic markdown framework" — it serves one project

---

## 5. Semantic Naming Conventions

### Principle
Name things by **what they are** or **what they do**, not by how they look or where they appear.

### File naming
```
✓ verse-card.tsx          (what it IS)
✗ blue-box.tsx            (how it LOOKS)

✓ note-block.tsx          (what it DOES)
✗ sidebar-item.tsx        (where it APPEARS)

✓ enrichment-parser.ts    (what it PARSES)
✗ helper.ts               (meaningless)
```

### Directory naming
```
✓ ui/reading/             (the DOMAIN of reading mode)
✓ ui/study/               (the DOMAIN of study mode)
✓ ui/enrichment/          (the DOMAIN of contextual enrichment)
✗ ui/components/          (generic, says nothing)
✗ ui/misc/                (worse)
```

### Variable/function naming
```typescript
✓ parseChapterMarkdown()     // verb + noun + context
✓ getChapterData()           // get + what
✓ extractVerses()            // action + target
✗ processData()              // too generic
✗ handleStuff()              // meaningless

✓ NoteType                   // domain concept
✓ ClaimType                  // enrichment-specific type
✗ ItemKind                   // vague
```

### Type naming
```typescript
✓ ChapterData                // aggregate
✓ Verse                      // entity
✓ Note                       // entity
✓ GlossaryEntry              // value object
✓ EnrichmentSection           // enrichment-specific aggregate
✗ DataObject                 // meaningless
✗ Info                       // meaningless
```

---

## 6. File Decoupling & Organization

### Principle
Each file has **one reason to change**. If a file changes for two unrelated reasons, split it.

### Current organization
```
src/
├── app/                    ← Changes when: routes change, page composition changes
│   └── [locale]/
│       ├── page.tsx        ← Landing page
│       ├── rules/page.tsx  �� Rules page
│       └── [book]/
│           ├── page.tsx    ← Book listing
│           └── [chapter]/
│               └── page.tsx ← Chapter view (thin — delegates to chapter-view.tsx)
│
├── domain/                 ← Changes when: the data model changes
│   └── content/types.ts   ← All types in one file (acceptable at current scale)
│
├── infrastructure/         ← Changes when: data source or parsing logic changes
│   ├── content/
│   │   ├── markdown-parser.ts      ← Chapter file parser
│   │   ├── enrichment-parser.ts    ← Companion file parser
│   │   └── fs-content-repository.ts ← File-system adapter
│   ��── i18n/
��       ├── config.ts               ← Locale definitions
│       ├── routing.ts              ← next-intl routing
│       ├── request.ts              ← Server-side locale resolution
│       └── messages/*.json         ← UI strings per locale
│
├── ui/                     ← Changes when: visual design or interaction patterns change
│   ├── reading/            ← Reading-mode components
│   ├── study/              ← Study-mode components
│   ├─�� enrichment/         ← Context-mode components
│   ├─��� navigation/         ← Navigation components (header, chapter-nav, language)
│   └── shared/             ← Cross-mode components (chapter-view)
│
├── hooks/                  ← Changes when: client-side state logic changes
├── lib/                    ← Changes when: bridge logic or utilities change
│   ├── content-loader.ts   ← Bridge: infrastructure → app
│   └── cn.ts               ← Tailwind class merging utility
│
└── middleware.ts            ← Changes when: routing middleware logic changes
```

### Rules
- **One export per concern** — a file can export multiple related items (e.g., types.ts exports all content types) but should not mix unrelated concerns.
- **Imports flow downward** — `app/` → `lib/` → `infrastructure/` → `domain/`. Never upward.
- **UI components don't import infrastructure** — they receive data as props.
- **Pages are thin** — they call loaders and render components. Business logic lives elsewhere.

---

## 7. Error Handling & System Recovery

### Principle
Errors are expected, not exceptional. Handle them gracefully at every boundary.

### Current implementation
| Boundary | Handling | File |
|---|---|---|
| Invalid book slug | `notFound()` via `VALID_BOOKS` guard | `[book]/page.tsx` |
| Invalid chapter number | `notFound()` via `Number.isNaN()` check | `[chapter]/page.tsx` |
| Missing chapter file | `readChapter()` returns `null` → `notFound()` | `fs-content-repository.ts` |
| Missing enrichment file | `readEnrichment()` returns `null` → no Context tab shown | `fs-content-repository.ts` |
| Parser error on malformed markdown | `try/catch` in repository → returns `null` | `fs-content-repository.ts` |
| Missing i18n message | next-intl falls back to default locale | `request.ts` |

### Rules
- **Return `null` for missing content** — don't throw. Let the caller decide (show 404 or hide section).
- **Validate at boundaries** — URL params validated in page components. File reads wrapped in try/catch.
- **No silent failures** — if content is missing, the UI either shows a 404 or shows an empty state with explanation.
- **Build-time validation** — `pnpm test` validates all chapter files parse correctly. CI should fail if a chapter file is malformed.

### Future (deferred)
- `error.tsx` boundary files per route segment for runtime errors
- Sentry integration if error patterns warrant it (decision deferred — see `docs/audit/PENDING.md`)

---

## 8. Security & Audit Standards

### Principle
Minimize attack surface. A static content site has a small surface — keep it that way.

### Current posture
| Concern | Status | Notes |
|---|---|---|
| User input | **None** | Static site, no forms, no auth, no user data |
| XSS | **Low risk** | `dangerouslySetInnerHTML` used for markdown rendering — content is author-controlled, not user-submitted |
| CSRF | **N/A** | No forms or mutations |
| CSP headers | **Not configured** | Should add via `next.config.ts` when deployed |
| Dependencies | **Minimal** | 10 production deps; review before adding more |
| Secrets | **None** | No API keys, no environment variables, no auth tokens |
| Audit trail | **Editorial log** | All content decisions logged in `docs/editorial-log/genesis.md` with timestamps and provenance |

### Rules
- **No user input at current scope.** If forms/auth are added (future scope), validate all input server-side.
- **Review `dangerouslySetInnerHTML` carefully.** Currently safe because content is from committed markdown files, not user input. If content source changes, sanitize with DOMPurify or similar.
- **Minimize dependencies.** Every new `pnpm add` increases attack surface. Justify each addition.
- **Add CSP headers before production deployment:**
  ```typescript
  // next.config.ts
  headers: async () => [{
    source: "/(.*)",
    headers: [
      { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
    ]
  }]
  ```

---

## 9. Performance & SEO Optimization

### Principle
Static-first architecture means performance is a built-in property, not an afterthought. Protect it.

### Current performance characteristics
| Metric | Target | Mechanism |
|---|---|---|
| TTFB | <100ms | SSG pages served from CDN (Vercel) |
| LCP | <1.2s | Pre-rendered HTML + self-hosted fonts |
| CLS | <0.05 | `font-display: swap` + `size-adjust`; no layout shift from lazy content |
| INP | <100ms | Minimal client JS; note expansion is CSS-only (`<details>`) |
| Bundle size | <80KB gzipped (first load) | No heavy libraries; Lucide tree-shaken |

### SEO
| Feature | Status | File |
|---|---|---|
| `<title>` per page | Partial (root layout only) | `app/layout.tsx` |
| `<meta description>` | Root layout only | Extend to per-chapter |
| `<html lang>` | ✅ Set per locale | `[locale]/layout.tsx` |
| Canonical URLs | Not implemented | Add `generateMetadata()` per page |
| Open Graph | Not implemented | Add per-chapter OG metadata |
| JSON-LD | Not implemented | Bible/Chapter schema.org markup |
| Favicon | ✅ SVG | `public/favicon.svg` |
| Sitemap | Not implemented | Add `app/sitemap.ts` |

### Rules
- **RSC by default.** Only add `"use client"` when the component needs browser APIs (useState, useEffect, event handlers).
- **No unnecessary client-side data fetching.** Content is loaded at build time via `generateStaticParams()`.
- **Self-host fonts.** `next/font/google` handles this automatically with subsetting and preloading.
- **Measure before optimizing.** Run Lighthouse before and after any change that adds JS.
- **Image optimization.** If images are added, use `next/image` with proper `width`/`height` and lazy loading.

---

## 10. Product KPIs & Analytics

### Principle
Track what matters for product decisions, not everything that's technically measurable. Start light; add granularity only when questions demand it.

### Planned taxonomy
| Event | Data | Purpose |
|---|---|---|
| `CHAPTER_VIEWED` | locale, book, chapter, viewMode | Which chapters are read, in which mode |
| `VIEW_MODE_SWITCHED` | from, to, locale, book, chapter | How readers use different modes |
| `LANGUAGE_CHANGED` | from, to, book, chapter | Which languages are most used |
| `NOTE_EXPANDED` | locale, book, chapter, verse, noteType | Which study notes readers engage with |
| `GLOSSARY_OPENED` | locale, book, chapter | Whether glossary is used |

### Implementation (planned — see `docs/audit/PENDING.md`)
- Vercel Analytics (free tier, privacy-respecting) for page views
- Vercel Speed Insights (free tier) for performance monitoring
- Custom events via `track()` from `@vercel/analytics` for the 5 domain events above
- **No custom event bus** at current scope

### Rules
- **Don't track until you have a question.** "How many people read Gen 3 in Portuguese?" is a question. "Let's track everything" is not.
- **Privacy-first.** Vercel Analytics is privacy-respecting by default (no cookies, no PII). Keep it that way.
- **Sentry evaluation deferred** — only add if actual error patterns warrant it (tracked in `docs/audit/PENDING.md`).

---

## 11. Concurrency & Race Condition Prevention

### Principle
A static site has almost zero concurrency concerns. Design for the future, but don't over-engineer the present.

### Current state
| Concern | Risk | Handling |
|---|---|---|
| Build-time content parsing | None | Sequential per file; no shared mutable state |
| Client-side state | Minimal | `useState` in `chapter-view.tsx` for view mode; no shared state |
| URL-based navigation | None | Next.js handles routing atomically |
| File system reads | None | Read-only; no writes during request handling |

### Future concerns (future scope)
| Concern | When | Mitigation |
|---|---|---|
| Database connection pooling | When user features added | Use Neon/Turso connection pooling; single connection per request |
| Optimistic UI updates | When bookmarks/progress added | Use React `useOptimistic` or `useTransition` |
| Concurrent edits | If community notes added | Last-write-wins or conflict resolution at DB level |

### Rules
- **Don't add state management until you need it.** URL state + component state covers everything at current scope.
- **Don't add database connection pooling until you have a database.**
- **If adding async operations:** use React Server Components for data fetching (no client-side fetch waterfalls); use `Suspense` boundaries for streaming.

---

## 12. Monitoring & Observability

### Principle
Monitor what tells you if the system is healthy. For a static site, this is mostly "do pages load?" and "are there console errors?"

### Current monitoring
| Layer | Tool | Status |
|---|---|---|
| Build health | `pnpm test` (117 parser tests) + `pnpm build` | ✅ Active |
| Content integrity | Parser validates all chapter files at test time | ✅ Active |
| Runtime errors | Not yet monitored | Deferred |
| Performance | Not yet monitored | Deferred |
| Uptime | Not yet monitored | Vercel provides basic uptime for deployed sites |

### Planned (see `docs/audit/PENDING.md`)
- **Vercel Analytics** — page views, traffic patterns (free)
- **Vercel Speed Insights** — Core Web Vitals monitoring (free)
- **Sentry** — evaluated against actual error patterns before adoption. Only added if: client-side JS errors in study mode, build-time parser failures, or cross-browser rendering issues need structured alerting. Content-aware tags if adopted:
  ```typescript
  beforeSend(event) {
    event.tags.language = locale;
    event.tags.book = book;
    event.tags.chapter = chapter;
  }
  ```

### Rules
- **Build validation is the first line of defense.** If `pnpm test` passes and `pnpm build` succeeds, the site will work.
- **Content validation catches drift.** The parser test suite validates all 9 chapter files (soon 12+) parse into correct structures. A malformed markdown file fails the build.
- **Don't add monitoring infrastructure before deployment.** Monitor locally via dev-server console; add production monitoring when deployed.

---

## 13. TypeScript Standards

### Principle
Use TypeScript's type system to prevent errors at compile time, not just at runtime.

### Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "target": "ES2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Rules
- **`strict: true` always.** No `any` unless genuinely unavoidable (and then documented with a comment).
- **Path aliases.** Use `@/domain/...`, `@/infrastructure/...`, `@/ui/...`, `@/lib/...` — never relative paths that climb more than one level (`../../`).
- **Export types explicitly.** `export type { ChapterData }` rather than relying on re-exports.
- **Prefer `interface` for object shapes** that may be extended. Use `type` for unions, intersections, and primitives.
- **No `enum` for string unions.** Use `type NoteType = "CRITICAL" | "LEXICAL" | "GRAMMATICAL" | "THEOLOGICAL"` instead of `enum NoteType { ... }`.

---

## 14. Testing Standards

### Principle
Test the parser (the single point of fragility); trust the framework for the rest.

### Current test coverage
~882 tests across 13 Vitest files (run `pnpm test` for the live count and per-file breakdown).

| Area | Runner | What's tested |
|---|---|---|
| Content parsers (chapter/markdown, enrichment, people, prophecy, introduction, book-context) | Vitest | Verses, note types, glossary, continuous reading, metadata; section/label/disclaimer/source extraction; person fields + genealogy tables + sources; prophecy entries; introduction sections; cross-chapter motifs |
| Highlight-marker renderer (`render-markdown-safe`) | Vitest | `{t:…}`/`{a:…}`/`@@…@@` → styled spans, escaping, nesting (see RULES-CORE Rule 30 + §Text-Highlight Markers) |
| Conservation gate (`conservation.test.ts`) | Vitest | Proves the parser→structured-layer derivation loses nothing (per-kind count + content multisets); chapter-completeness + inventory backstops |
| Build | Next.js (implicit via `pnpm build`) | TypeScript compilation, page generation, static params |

### What NOT to test
- **Don't unit-test React components** at current scope. The ROI is low for a static content site. Visual validation via dev server is sufficient.
- **Don't mock the file system.** Tests read real chapter files — this is intentional. If a chapter file is malformed, the test fails. That's the point.
- **Don't test Next.js routing.** Trust the framework.

### When to add tests
- **New parser feature** → add test immediately
- **New content type** (e.g., if Tier 3 enrichment format changes) → add parser test
- **Bug found** → write a test that reproduces it before fixing

### Running tests
```bash
pnpm test          # Run all tests once
pnpm test:watch    # Watch mode during development
pnpm build         # Full production build (implicit type + compilation check)
```

---

## 15. Dependency Management

### Principle
Every dependency is a liability. Minimize, justify, and audit.

### Current dependencies (10 production)
| Dependency | Purpose | Justified? |
|---|---|---|
| `next` | Framework | Core — non-negotiable |
| `react`, `react-dom` | UI library | Core — non-negotiable |
| `next-intl` | i18n routing + messages | Required for quadrilingual support (EN/PT-BR/DE/ES) |
| `gray-matter` | YAML front-matter parsing | Unused currently (chapter files don't have YAML front matter) — **candidate for removal** |
| `clsx`, `tailwind-merge` | CSS class merging | Used in `cn()` utility |
| `lucide-react` | Icons | Design system requirement (1.5px stroke) |
| `framer-motion` | Animations | Installed but **currently unused** — evaluate at the next dependency review or remove |
| `@swc/helpers` | SWC runtime | Required by Next.js toolchain |

### Dev dependencies (9)
All justified: TypeScript, types, Biome, Vitest, Tailwind, PostCSS.

### Rules
- **Justify before adding.** Can this be done with native APIs or existing deps?
- **Audit quarterly.** Check for unused deps (`pnpm why <pkg>`), outdated versions, security advisories.
- **Pin versions.** Use `^` in package.json (pnpm default) but run `pnpm audit` before major upgrades.
- **Candidates for removal:** `gray-matter` (not used by current parser), `framer-motion` (not used by current UI). Evaluate at next review.

---

*Architecture serves the product. The product serves the reader. The reader encounters the text.*
