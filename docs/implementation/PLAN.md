# The Transparent Translation — Web App Implementation Plan

**Date:** 2026-04-17 (updated 2026-04-17 post-feedback)
**Budget:** $0 (free-tier infrastructure only)
**Target:** Mobile-first, desktop-friendly reading + study Bible application
**Languages:** EN, PT-BR, DE (i18n from day 1)
**Content scope at launch:** Genesis 1–3 (expandable per chapter as TT produces content)
**Feedback incorporated:** `docs/implementation/FEEDBACK.md` — Plan A (this document) confirmed as correct architecture. Selective enhancements from Plan B adopted. See *Revision Log* at end of document.

---

## 1. Core Decisions

### 1.1 Why static-first

The TT content is **authored markdown, not user-generated data**. Every chapter file is a structured `.md` file committed to the repo. This means:

- **No database needed at launch.** Parse markdown at build time → static HTML → serve from CDN.
- **No API layer needed.** Content is co-located with the app.
- **Instant page loads.** SSG pages are pre-rendered; zero server round-trips for content.
- **$0 hosting cost.** Static sites on Vercel free tier are effectively unlimited bandwidth for this traffic volume.

A database enters **only** when user-facing features arrive (bookmarks, reading progress, accounts). That's Phase 7+.

### 1.2 Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 16 (App Router, RSC, Turbopack) | SSG/ISR, i18n routing, RSC for minimal-JS reading mode (eliminates component JS; ~30KB framework shell still ships for navigation) |
| **Hosting** | Vercel (Hobby plan, free) | Zero-config Next.js deployment, CDN, preview deploys |
| **Styling** | Tailwind CSS v4 + OKLCH tokens | Per design-principles.md; utility-first, token-driven |
| **Components** | shadcn/ui (adapted) | Accessible primitives, no vendor lock-in, free |
| **Icons** | Lucide (1.5px stroke) | Per design-system-notes.md |
| **Motion** | Framer Motion | Per design-system-notes.md (motion/react) |
| **Typography** | Newsreader (serif, reading) + Geist (sans, UI) + Geist Mono (data) | Per design-principles.md; ideal for Bible reading |
| **i18n** | next-intl | URL-based locale routing, SSG-compatible, message bundles |
| **Content parsing** | gray-matter + remark + rehype | Extract front matter + transform markdown → structured data |
| **Hebrew rendering** | Native CSS `direction: rtl` + Noto Sans Hebrew | Clean RTL for inline Hebrew; no special library needed |
| **Package manager** | pnpm | Fast, disk-efficient |
| **Linting** | Biome | Fast, single-tool for lint + format |

### 1.3 Free tier limits (verified)

| Service | Free tier | Our usage | Headroom |
|---------|-----------|-----------|----------|
| Vercel Hobby | 100GB bandwidth, unlimited static | ~9 static pages (3 chapters × 3 locales), <1GB/mo | Massive |
| Vercel Functions | 100GB-hrs, 100K invocations | SSG = zero functions at launch | Unused |
| GitHub | Unlimited public repos | Source + content repo | Unlimited |
| Neon (if needed later) | 0.5GB, 190 compute-hrs/mo | Not needed at launch | Reserved |
| Cloudflare (alternative) | Unlimited static, 100K workers/day | Alternative if Vercel limits hit | Massive |

---

## 2. Architecture

### 2.1 Domain model (DDD)

```
Domain: TransparentTranslation
├── Bounded Context: Content
│   ├── Aggregate: Book
│   │   ├── Entity: Chapter
│   │   │   ├── Value Object: ChapterMetadata (edition, status, reviewers, policies)
│   │   │   ├── Value Object: ContinuousReading (paragraphs[])
│   │   │   ├── Entity: Verse
│   │   │   │   ├── Value Object: MainText (raw text with italic markers)
│   │   │   │   └── Entity: Note (type, hebrewTerm, content, crossRefs)
│   │   │   ├── Entity: GlossaryEntry (hebrew, translation, notes)
│   │   │   ├── Value Object: FormulaTracking
│   │   │   └── Value Object: CrossChapterTracking
│   │   └── Value Object: BookMetadata (name, chapterCount, languages[])
│   └── Repository Interface: ContentRepository
│
├── Bounded Context: Navigation
│   ├── Value Object: Locale (en | pt-br | de)
│   ├── Value Object: ContentPath (locale + book + chapter)
│   └── Service: NavigationService (prev/next chapter, book outline)
│
├── Bounded Context: ReadingExperience
│   ├── Value Object: ViewMode (reading | study)
│   ├── Value Object: ScrollPosition
│   └── Service: ReadingStateService
│
└── Bounded Context: UserPreferences (Phase 7+)
    ├── Entity: UserProfile
    ├── Value Object: Bookmark
    └── Value Object: ReadingProgress
```

### 2.2 File structure

```
bible-tt-web/
├── content/                              # Markdown content (symlink or copy)
│   ├── en/genesis/CHAPTER-1.md
│   ├── pt-br/genesis/CHAPTER-1.md
│   └── de/genesis/CHAPTER-1.md
│
├── src/
│   ├── domain/                           # Pure domain logic (no framework deps)
│   │   ├── content/
│   │   │   ├── types.ts                  # Book, Chapter, Verse, Note, Glossary
│   │   │   ├── note-type.ts             # CRITICAL | LEXICAL | GRAMMATICAL | THEOLOGICAL
│   │   │   └── content-repository.ts    # Interface (port)
│   │   ├── navigation/
│   │   │   ├── types.ts                  # Locale, ContentPath
│   │   │   └── navigation-service.ts    # Prev/next, outline logic
│   │   └── reading/
│   │       └── types.ts                  # ViewMode, ScrollPosition
│   │
│   ├── infrastructure/                   # Adapters (framework-specific)
│   │   ├── content/
│   │   │   ├── markdown-parser.ts       # gray-matter + remark pipeline
│   │   │   ├── verse-extractor.ts       # Regex-based verse/note extraction
│   │   │   ├── continuous-reading-extractor.ts
│   │   │   └── fs-content-repository.ts # File-system ContentRepository impl
│   │   └── i18n/
│   │       ├── config.ts                # Supported locales, default locale
│   │       ├── messages/
│   │       │   ├── en.json              # UI strings (not content — navigation, labels)
│   │       │   ├── pt-br.json
│   │       │   └── de.json
│   │       └── request.ts              # next-intl getRequestConfig
│   │
│   ├── app/                              # Next.js App Router
│   │   ├── [locale]/
│   │   │   ├── layout.tsx               # Locale provider, AppShell, fonts
│   │   │   ├── page.tsx                 # Home: book selection (Genesis only for now)
│   │   │   ├── [book]/
│   │   │   │   ├── page.tsx             # Chapter list for book
│   │   │   │   └── [chapter]/
│   │   │   │       ├── page.tsx         # Chapter view (reading/study)
│   │   │   │       ├── loading.tsx      # Skeleton
│   │   │   │       └── not-found.tsx
│   │   │   └── not-found.tsx
│   │   ├── layout.tsx                   # Root layout (metadata, viewport)
│   │   ├── not-found.tsx
│   │   └── globals.css                  # OKLCH tokens, typography, base styles
│   │
│   ├── ui/                               # Presentation layer
│   │   ├── primitives/                   # Atomic UI (shadcn/ui adapted)
│   │   │   ├── button.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── sheet.tsx                # Mobile bottom sheet
│   │   │   ├── scroll-area.tsx
│   │   │   └── tooltip.tsx
│   │   ├── reading/                      # Reading-mode components
│   │   │   ├── continuous-reading.tsx   # Flowing prose with superscript verse #s
│   │   │   ├── verse-number.tsx         # Superscript ¹²³ marker
│   │   │   ├── reading-progress.tsx     # Top scroll progress bar
│   │   │   └── paragraph-group.tsx      # Day-grouped paragraph
│   │   ├── study/                        # Study-mode components
│   │   │   ├── verse-card.tsx           # Single verse + expandable notes
│   │   │   ├── note-block.tsx           # Color-coded note (🔴🟢🔵🟡)
│   │   │   ├── hebrew-text.tsx          # RTL inline Hebrew with transliteration
│   │   │   ├── glossary-panel.tsx       # Expandable/collapsible glossary
│   │   │   ├── formula-tracking.tsx     # Pattern summary table
│   │   │   └── cross-chapter-panel.tsx  # Cross-chapter tracking display
│   │   ├── navigation/
│   │   │   ├── app-shell.tsx            # Responsive container (NavRail / BottomNav)
│   │   │   ├── nav-rail.tsx             # Desktop sidebar (book → chapter)
│   │   │   ├── bottom-nav.tsx           # Mobile bottom navigation
│   │   │   ├── chapter-nav.tsx          # Prev/Next chapter arrows
│   │   │   ├── language-switcher.tsx    # EN / PT-BR / DE selector
│   │   │   ├── view-mode-toggle.tsx     # Reading ↔ Study switch
│   │   │   └── toc-sidebar.tsx          # In-chapter section TOC (study mode)
│   │   └── shared/
│   │       ├── metadata-banner.tsx      # Edition, status, base text info
│   │       └── reading-guide.tsx        # Collapsible reading guide
│   │
│   ├── hooks/
│   │   ├── use-view-mode.ts             # Reading ↔ Study state + URL sync
│   │   ├── use-scroll-progress.ts       # Scroll % for progress bar
│   │   ├── use-active-verse.ts          # Intersection observer for current verse
│   │   └── use-content.ts              # Content access (typed, cached)
│   │
│   └── lib/
│       ├── content-loader.ts            # Build-time getStaticParams + content fetch
│       ├── slug.ts                      # Book/chapter slug utilities
│       └── cn.ts                        # clsx + tailwind-merge
│
├── public/
│   ├── fonts/                            # Newsreader, Geist, Geist Mono (self-hosted)
│   └── og/                              # Open Graph images per chapter
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── biome.json
└── package.json
```

### 2.3 Architectural standards mapping

| Standard | Implementation |
|----------|---------------|
| **DDD** | `domain/` = pure types + interfaces; `infrastructure/` = adapters; `app/` = delivery; `ui/` = presentation |
| **Event-Driven** | URL-driven state (view mode, locale, chapter); React events for UI interactions; future: analytics events via lightweight event bus |
| **Service-Agnostic Abstraction** | `ContentRepository` interface in domain; `FsContentRepository` adapter in infrastructure; swappable to DB adapter later without touching domain or UI |
| **DRY / Reusability** | `NoteBlock` component used across all note types; `VerseNumber` shared between reading + study; content parser shared across locales |
| **Semantic Naming** | Components named by function (`verse-card`, `note-block`), not by appearance (`blue-box`, `sidebar-item`) |
| **File Decoupling** | Domain knows nothing of Next.js; UI knows nothing of file-system; infrastructure adapts between them |
| **Error Handling** | `not-found.tsx` per route segment; `error.tsx` boundaries; content parser validates structure and throws typed errors |
| **Security** | No user input at launch (static content); CSP headers via `next.config.ts`; no client-side data storage initially |
| **Performance / SEO** | SSG = pre-rendered HTML; RSC = minimal client JS for reading mode (component-level JS eliminated; framework shell ~30KB remains for client navigation); `<head>` metadata per chapter; JSON-LD structured data for Bible content |
| **Analytics** | Lightweight: Vercel Analytics (free tier, privacy-respecting); custom events for view-mode switches, language changes, chapter navigation |
| **Concurrency** | No concern at launch (static site); build-time content parsing is sequential per file; future DB access uses connection pooling |
| **Monitoring** | Vercel Speed Insights + Analytics (free, included in Hobby plan); error boundaries per route; build-time content validation (fail CI if markdown parse errors); Sentry evaluated at Phase 5 (not adopted by default — vendor cost vs. value assessed against actual error patterns) |

---

## 3. Design System (adapted from docs/design/)

The design docs were written for DiscoveryFlow (a founder validation tool). Principles are **extracted and adapted** for the TT Bible app; product-specific references (bets, coaching, founder flows) are discarded.

### 3.1 What carries over directly

| Principle | Application to TT |
|-----------|-------------------|
| **Calm focus aesthetic** | Bible reading demands exactly this; even stronger fit than a SaaS tool |
| **Newsreader serif for display** | Perfect for verse text — designed for extended reading |
| **Geist sans for UI** | Navigation, labels, metadata — clean contrast with serif reading text |
| **OKLCH color tokens** | Warm paper background (`--bg-paper`), note-type colors mapped to 🔴🟢🔵🟡 icons |
| **WCAG 2.2 AA** | Non-negotiable for Bible accessibility; 4.5:1 contrast, 44×44px tap targets |
| **Anti-slop checklist** | No gradients, no card soup, no generic layouts, no emoji-as-design |
| **Mobile-first** | Bottom nav for chapter/book selection; reading mode fills viewport |
| **Desktop NavRail** | Book + chapter sidebar; TOC sidebar in study mode |
| **Purposeful motion (150–400ms)** | View-mode transitions, note expansion, chapter navigation |
| **No lorem ipsum** | All content is real — this is inherent to the project |

### 3.2 What changes for TT

| DiscoveryFlow | TT Bible App |
|---------------|-------------|
| Ochre accent color | Replaced with note-type palette: crimson (🔴), forest (🟢), slate-blue (🔵), amber (🟡) |
| "Strict but helpful coach" feeling | "Quiet scholarly clarity" feeling — the UI recedes; the text speaks |
| Card-based layout | Prose-flow layout (reading); card layout only in study mode for verse blocks |
| Single-user SaaS patterns | Public content site patterns (no auth, no forms, no user state at launch) |
| Markdown export | Not needed — content IS markdown |
| AI coaching panel | Not present at launch; future Tier 3 enrichment panel in this slot |

### 3.3 Color token mapping

```css
/* Base (from design-principles.md, adapted) */
--bg-paper: oklch(0.97 0.01 85);         /* Warm off-white paper */
--bg-surface: oklch(0.99 0.005 85);      /* Slightly lighter for cards */
--text-primary: oklch(0.25 0.02 50);     /* Deep warm black for body */
--text-secondary: oklch(0.45 0.02 50);   /* Muted for metadata */

/* Note types (unique to TT) */
--note-critical: oklch(0.55 0.22 25);    /* 🔴 Deep crimson */
--note-lexical: oklch(0.50 0.15 145);    /* 🟢 Forest green */
--note-grammatical: oklch(0.50 0.12 250);/* 🔵 Slate blue */
--note-theological: oklch(0.60 0.18 80); /* 🟡 Warm amber */

/* Accent */
--accent: oklch(0.55 0.15 55);           /* Warm brown-ochre for links, active states */
```

### 3.4 Typography scale

```css
/* Reading mode */
--font-reading: 'Newsreader', serif;
--text-verse: 1.25rem/1.8;              /* 20px, generous line height for reading */
--text-verse-mobile: 1.125rem/1.75;     /* 18px on mobile */

/* Study mode */
--text-verse-study: 1.125rem/1.7;       /* Slightly smaller in study (notes take space) */
--text-note: 0.9375rem/1.6;             /* 15px for note content */
--text-hebrew: 1.25rem/1.6;             /* Hebrew terms inline */

/* UI */
--font-ui: 'Geist', sans-serif;
--text-label: 0.8125rem/1.4;            /* 13px for metadata labels */
--text-nav: 0.9375rem/1.5;              /* 15px for navigation items */

/* Data */
--font-mono: 'Geist Mono', monospace;
--text-data: 0.8125rem/1.5;             /* 13px for glossary codes, Hebrew transliteration */
```

---

## 4. Content Pipeline

### 4.1 Markdown → Structured Data

Each chapter `.md` file is parsed at **build time** into a typed domain object:

```
CHAPTER-1.md
    ↓ gray-matter (front matter extraction)
    ↓ custom regex parser (section splitting)
    ↓
ChapterData {
  metadata: {
    book: "genesis",
    chapter: 1,
    edition: "Transparent",
    language: "en",
    baseText: "BHS 5th rev...",
    status: "provisional",
    yhwhPolicy: "Option A",
    methodology: "28 rules v2.4.1"
  },
  continuousReading: [
    { dayLabel: "Day 1", verseRange: "1-5", text: "¹In beginning..." }
  ],
  verses: [
    {
      number: 1,
      mainText: "In beginning, God created the skies and the land.",
      notes: [
        { type: "CRITICAL", title: "Structure & Interpretation", hebrew: "בְּרֵאשִׁית...", content: "..." },
        { type: "LEXICAL", title: "KEY TERMS", content: "..." }
      ]
    }
  ],
  glossary: [
    { hebrew: "אֱלֹהִים", translation: "God", notes: "Plural form, singular verb" }
  ],
  formulaTracking: { ... },
  crossChapterTracking: { ... }
}
```

### 4.2 Parser architecture

```
markdown-parser.ts
├── extractFrontMatter(raw) → ChapterMetadata
├── extractContinuousReading(raw) → Paragraph[]
├── extractVerses(raw) → Verse[]
│   └── extractNotes(verseBlock) → Note[]
│       └── classifyNoteType(icon) → NoteType
├── extractGlossary(raw) → GlossaryEntry[]
├── extractFormulaTracking(raw) → FormulaData
└── extractCrossChapterTracking(raw) → CrossChapterData
```

Each extractor uses the known section headers (`## CONTINUOUS READING`, `## VERSE-BY-VERSE STUDY`, etc.) as split points. Verse blocks split on `### **Verse N**` / `### **Versículo N**` / `### **Vers N**` (locale-aware regex).

Note types classified by icon prefix: `🔴` → CRITICAL, `🟢` → LEXICAL, `🔵` → GRAMMATICAL, `🟡` → THEOLOGICAL.

### 4.3 Build-time content loading

```typescript
// src/lib/content-loader.ts
export async function getChapterData(
  locale: Locale,
  book: string,
  chapter: number
): Promise<ChapterData> {
  const filePath = path.join(CONTENT_DIR, locale, book, `CHAPTER-${chapter}.md`);
  const raw = await fs.readFile(filePath, 'utf-8');
  return parseChapterMarkdown(raw, locale);
}

export async function generateStaticParams() {
  // Enumerate all locale/book/chapter combinations from filesystem
}
```

Used in `page.tsx` via `generateStaticParams()` + direct file reads at build time. **Zero runtime cost.**

### 4.4 Future: Tier 3 enrichment parsing (adopted from Plan B feedback)

When Tier 3 companion study files are created, the parser should extract structured enrichment metadata. The markdown convention will follow this pattern:

```markdown
## TIER 3: ANCIENT NEAR EASTERN PARALLELS
**Verification Level:** VERIFIED
**Sources:** [Enuma Elish, ANET 1969], [Atrahasis, Lambert & Millard 1999]

Content here...
```

The parser extracts `verification_level` (matching Rule 13: VERIFIED / PROBABLE / POSSIBLE / UNCERTAIN / SPECULATIVE) and `sources` for display as trust indicators in the UI. This aligns with the TT project's existing uncertainty-level system and avoids inventing a separate taxonomy.

**Not built in Phase 1–6.** Documented here so the parser architecture anticipates the extension point.

---

## 5. Page Architecture

### 5.1 Routes

```
/                          → Redirect to /en (or browser locale)
/[locale]                  → Home: book grid (Genesis only for now)
/[locale]/[book]           → Chapter list (Genesis → 3 chapters)
/[locale]/[book]/[chapter] → Chapter view (reading/study modes)
```

### 5.2 Chapter page — the core view

```
┌─────────────────────────────────────────────────┐
│ AppShell                                         │
│ ┌─────────┬─────────────────────────────────────┐│
│ │ NavRail │  Chapter Content                    ││
│ │ (desktop│  ┌─────────────────────────────────┐││
│ │  only)  │  │ MetadataBanner (edition, status)│││
│ │         │  │ ViewModeToggle [Reading|Study]  │││
│ │ Genesis │  │ LanguageSwitcher [EN|PT|DE]     │││
│ │  Ch 1 ● │  ├─────────────────────────────────┤││
│ │  Ch 2   │  │                                 │││
│ │  Ch 3   │  │ [Reading Mode]                  │││
│ │         │  │ ContinuousReading               │││
│ │         │  │ ¹In beginning, God created...   │││
│ │         │  │ ²And the land was chaos...       │││
│ │         │  │                                 │││
│ │         │  │ — OR —                          │││
│ │         │  │                                 │││
│ │         │  │ [Study Mode]                    │││
│ │         │  │ VerseCard v.1                   │││
│ │         │  │   MainText                      │││
│ │         │  │   📝 NOTES                      │││
│ │         │  │   🔴 CRITICAL - ...             │││
│ │         │  │   🟢 LEXICAL - ...              │││
│ │         │  │ VerseCard v.2                   │││
│ │         │  │   ...                           │││
│ │         │  ├─────────────────────────────────┤││
│ │         │  │ ChapterNav [← Ch 1 | Ch 3 →]   │││
│ │         │  └─────────────────────────────────┘││
│ └─────────┴─────────────────────────────────────┘│
│ [Mobile: BottomNav instead of NavRail]           │
│ ReadingProgress (thin bar at top)                │
└─────────────────────────────────────────────────┘
```

### 5.3 Mobile layout (< 768px)

- **Reading mode:** Full-viewport prose. Verse numbers as small superscripts. Scroll progress bar at top (2px height). Bottom nav with: Home | Chapters | Language | Mode toggle.
- **Study mode:** Stacked verse cards. Notes collapsed by default (tap to expand). Glossary accessible via bottom sheet pull-up.
- **Navigation:** Swipe gesture for prev/next chapter (optional, Phase 5 polish).

### 5.4 Desktop layout (≥ 1024px)

- **Reading mode:** Centered column (max-width 680px — per typography best practice for ~65 characters per line). NavRail on left. Optional TOC on right (collapsible).
- **Study mode:** Wider column (max-width 800px) to accommodate note blocks. Glossary pinned in right sidebar. TOC tracks active verse via IntersectionObserver.

---

## 6. Implementation Phases

### Phase 1 — Scaffold + Content Pipeline (Day 1–3)

**Goal:** Next.js app that can read markdown files and render raw content.

#### 1A. Project scaffold (Day 1)
- [ ] `npx create-next-app@latest bible-tt-web --typescript --tailwind --app --src-dir`
- [ ] Install deps: `next-intl`, `gray-matter`, `remark`, `rehype`
- [ ] Set up i18n routing (`[locale]/` segments, `next-intl` config)
- [ ] Copy/symlink `content/` directory
- [ ] Verify project builds with placeholder pages

#### 1B. Markdown parser — dedicated engineering focus (Day 2–3)

**This is the single hardest task in the build.** Each of the 9 chapter files contains 7–9 structurally distinct sections that must be parsed into typed domain objects. The parser is the single point of fragility in the entire pipeline. It deserves dedicated focus, not a sub-bullet.

- [ ] Build `markdown-parser.ts` — section splitting by locale-aware headers
- [ ] Build `extractFrontMatter()` — gray-matter for metadata
- [ ] Build `extractContinuousReading()` — paragraph extraction with superscript verse markers
- [ ] Build `extractVerses()` — locale-aware split on `### **Verse N**` / `### **Versículo N**` / `### **Vers N**`
- [ ] Build `extractNotes()` — emoji-prefix classification (🔴→CRITICAL, 🟢→LEXICAL, 🔵→GRAMMATICAL, 🟡→THEOLOGICAL)
- [ ] Build `extractGlossary()` — markdown table parsing
- [ ] Build `extractCrossChapterTracking()` and `extractFormulaTracking()`
- [ ] Build `fs-content-repository.ts` — reads files, returns typed `ChapterData`
- [ ] Build `content-loader.ts` — `generateStaticParams()` + `getChapterData()`
- [ ] **Unit tests:** one test per extractor × 3 locales × 3 chapters = 81 assertions minimum
- [ ] **CI validation:** build fails if any chapter file does not parse cleanly (structural guard against content drift)
- [ ] Verify at build time: all 9 chapter files produce complete `ChapterData` objects with zero warnings

**Parser edge cases to handle:**
- Hebrew RTL text embedded in notes (must preserve `direction: rtl` spans)
- Italic markers (`*word*`) in continuous reading (must distinguish grammatical additions from emphasis)
- Note blocks that span multiple lines with sub-bullets
- Glossary tables with varying column counts (Gen 1 has 3 columns; Gen 2–3 have 3 columns + possible additional context)
- Cross-chapter tracking sections with mixed prose and bullet lists
- Front matter values that contain colons, quotes, or Hebrew text

**Ship criterion:** `pnpm build` succeeds; all 9 chapter files parse into typed `ChapterData`; unit tests pass; CI validation green.

### Phase 2 — Reading Mode (Day 2–4)

**Goal:** Readable, beautiful continuous prose view across all 3 languages.

- [ ] Set up fonts (Newsreader, Geist, Geist Mono) via `next/font`
- [ ] Build `globals.css` with OKLCH tokens, typography scale
- [ ] Build `AppShell` — responsive container, warm paper background
- [ ] Build `ContinuousReading` — renders paragraphs with `VerseNumber` superscripts
- [ ] Build `LanguageSwitcher` — URL-based locale switch (preserves book + chapter)
- [ ] Build `ChapterNav` — prev/next arrows at bottom
- [ ] Build `MetadataBanner` — collapsed by default, shows edition/status on expand
- [ ] Build `ReadingProgress` — thin scroll-% bar at top
- [ ] Wire up `page.tsx` for `[locale]/[book]/[chapter]`
- [ ] Test on mobile viewport (375px) + desktop (1440px)

**Ship criterion:** A reader can navigate to `/en/genesis/1`, read the chapter continuously in any of the 3 languages, and switch between them.

### Phase 3 — Study Mode (Day 4–7)

**Goal:** Verse-by-verse with expandable notes, color-coded by type.

- [ ] Build `ViewModeToggle` — Reading ↔ Study; state synced to URL query `?mode=study`
- [ ] Build `VerseCard` — main text + collapsed notes; expand on click/tap
- [ ] Build `NoteBlock` — color-coded header by type (CRITICAL/LEXICAL/GRAMMATICAL/THEOLOGICAL)
- [ ] Build `HebrewText` — inline RTL Hebrew terms with transliteration in parentheses
- [ ] Build `GlossaryPanel` — collapsible, filterable, pinned on desktop right sidebar
- [ ] Build `FormulaTracking` — table/list of locked formulas
- [ ] Build `CrossChapterPanel` — structured display of cross-chapter connections
- [ ] Wire up `use-active-verse.ts` — IntersectionObserver tracking for TOC highlight
- [ ] Build `TOCSidebar` — desktop right panel tracking current verse in study mode
- [ ] Test note expansion on mobile (bottom sheet approach vs. inline expand)

**Ship criterion:** A student can toggle to Study mode, see color-coded notes per verse, browse the glossary, and track cross-chapter patterns.

### Phase 4 — Navigation + Home (Day 7–9)

**Goal:** Complete navigation flow from home → book → chapter.

- [ ] Build `NavRail` (desktop) — book list → chapter list; active chapter highlighted
- [ ] Build `BottomNav` (mobile) — 4 items: Home, Chapters, Language, Mode
- [ ] Build Home page (`/[locale]`) — book grid (Genesis only; future-proof for expandable list)
- [ ] Build Book page (`/[locale]/[book]`) — chapter list with completion indicators
- [ ] Build `ReadingGuide` component — collapsible, shows note icons + conventions
- [ ] 404 handling — graceful "chapter not yet translated" message with available alternatives
- [ ] Test full navigation flow: home → genesis → chapter 1 → switch to PT-BR → chapter 2 → study mode → chapter 3

**Ship criterion:** Complete navigation from landing to any chapter in any language with mode switching.

### Phase 5 — Polish + Monitoring (Day 10–13)

**Goal:** Design-system refinement, accessibility, performance, SEO, observability.

#### 5A. Accessibility & design
- [ ] Run anti-slop checklist against every page
- [ ] Run WCAG 2.2 AA audit: contrast ratios, focus rings, keyboard navigation, screen reader
- [ ] Add `aria-label` to all interactive elements
- [ ] Semantic HTML: `<article>` for chapter, `<section>` for verses, `<aside>` for notes
- [ ] `<html lang>` set per locale
- [ ] Human-touch details: warm paper texture (subtle SVG noise), verse-number hover glow, reading-mode focus state
- [ ] Subtle motion: view-mode fade transition (200ms), note expand (150ms), chapter nav slide (300ms)

#### 5B. SEO & structured data
- [ ] SEO: `<title>`, `<meta description>`, `<link rel="canonical">`, Open Graph per chapter
- [ ] JSON-LD structured data (BibleBook, Chapter schemas)
- [ ] Lighthouse audit: target 95+ on all 4 metrics

#### 5C. Error handling & monitoring
- [ ] Error boundaries per route segment
- [ ] 404 page styled consistently
- [ ] **Monitoring decision:** Evaluate whether Vercel's built-in error tracking + Speed Insights (both free, already included in Hobby plan) are sufficient, OR whether Sentry (free tier: 5K errors/month) adds meaningful value for a static site. Sentry is worth it if: client-side JS errors in study mode, build-time parser failures, or cross-browser rendering issues need structured alerting. **Do not add Sentry reflexively** — it's a vendor dependency. Decide based on Phase 1–4 error patterns.
- [ ] If Sentry adopted: configure with content-aware tags per `FEEDBACK.md` recommendation:
  ```typescript
  beforeSend(event) {
    event.tags.language = locale;
    event.tags.book = book;
    event.tags.chapter = chapter;
  }
  ```

#### 5D. Analytics event taxonomy
- [ ] Implement Vercel Analytics (free tier)
- [ ] Implement Vercel Speed Insights (free tier)
- [ ] Define domain event taxonomy for custom events (adopted from Plan B feedback):
  ```
  CHAPTER_VIEWED    — locale, book, chapter, viewMode
  VIEW_MODE_SWITCHED — from, to, locale, book, chapter
  LANGUAGE_CHANGED  — from, to, book, chapter
  NOTE_EXPANDED     — locale, book, chapter, verse, noteType
  GLOSSARY_OPENED   — locale, book, chapter
  ```
  Implement as lightweight custom events via Vercel Analytics. No custom event bus at this stage.

**Ship criterion:** Lighthouse 95+, WCAG AA pass, anti-slop clean, monitoring decision documented.

### Phase 6 — Deploy (Day 13–14)

- [ ] Push to GitHub (public repo)
- [ ] Connect to Vercel (Hobby plan, zero cost)
- [ ] Configure `vercel.ts` or `vercel.json` for caching headers on static content
- [ ] Set up preview deploys (automatic on PR)
- [ ] Verify production build on Vercel
- [ ] Test all 3 locales on production URL
- [ ] Verify analytics + speed insights are active

**Ship criterion:** Live at a Vercel URL; all chapters readable in all languages.

### Phase 7 — Future (post-launch, on demand)

These are **not** in the initial build. Listed for architecture planning only.

**Content enrichment (no infrastructure change):**
- [ ] **Tier 3 enrichment panel** — companion study content (ANE parallels, archaeology, scientific context). Separate markdown files, parsed via same pipeline (see §4.4), displayed as expandable panel in study mode. Verification levels rendered as color-coded trust indicators.
- [ ] **Reader Edition toggle** — when Reader Edition content is produced, toggle between Transparent and Reader within same chapter view.
- [ ] **More books** — architecture supports any book/chapter structure from the filesystem.

**Static-site extensions (no DB):**
- [ ] **Search** — Pagefind (recommended: static index at build time, zero runtime cost, fully local, no vendor) or Algolia DocSearch (free for open-source). Pagefind preferred per `FEEDBACK.md` analysis.
- [ ] **Dark mode** — token system already OKLCH; add `prefers-color-scheme` media query + manual toggle.
- [ ] **Audio** — Hebrew pronunciation audio per verse. Cloudflare R2 (10GB free) for audio storage.
- [ ] **PWA** — service worker for offline reading. Free, just config.

**User features (DB required — see `docs/implementation/SCHEMA-FUTURE.sql`):**
- [ ] **Bookmarks + reading progress** — requires user identity + DB. Neon free tier or Turso (SQLite). Auth via Clerk free tier or GitHub OAuth. Architecture: **hybrid** — content stays static (SSG/CDN); user data goes to DB via API routes (`/api/bookmarks`, `/api/progress`). Content never enters the database.
- [ ] **Community notes** — user-submitted study notes alongside TT notes. Requires moderation + DB.

**Reference:** `SCHEMA-FUTURE.sql` contains the PostgreSQL schema blueprint for user-data tables (sessions, bookmarks, reading progress, analytics events). Content tables are documented as "NOT NEEDED" — they exist as reference only if the project ever migrates away from static markdown.

---

## 7. Content-to-Component Mapping

How each markdown section maps to a UI component:

| Markdown section | Component | View mode |
|-----------------|-----------|-----------|
| Front matter | `MetadataBanner` | Both (collapsed) |
| TABLE OF CONTENTS | `TOCSidebar` (desktop) | Study |
| READING GUIDE | `ReadingGuide` (collapsible) | Both |
| CONTINUOUS READING | `ContinuousReading` + `VerseNumber` | Reading |
| VERSE-BY-VERSE STUDY | `VerseCard` + `NoteBlock` | Study |
| 📝 NOTES blocks | `NoteBlock` (per type) | Study |
| Hebrew terms in notes | `HebrewText` | Study |
| GLOSSARY | `GlossaryPanel` | Study |
| FORMULA TRACKING | `FormulaTracking` | Study |
| ROOT DOUBLING PATTERNS | `CrossChapterPanel` subsection | Study |
| VERB SHIFTS | `CrossChapterPanel` subsection | Study |
| CROSS-CHAPTER TRACKING | `CrossChapterPanel` | Study |
| Adam/Human Policy note | `ReadingGuide` subsection | Both |

---

## 8. i18n Strategy

### 8.1 Two layers of i18n

| Layer | What | How |
|-------|------|-----|
| **Content i18n** | The actual Bible translation (verses, notes, glossary) | Already done — separate `.md` files per locale |
| **UI i18n** | Navigation labels, button text, mode names, metadata labels | `next-intl` message bundles (`en.json`, `pt-br.json`, `de.json`) |

### 8.2 UI strings (not content)

```json
// messages/en.json
{
  "nav": { "home": "Home", "chapters": "Chapters", "readingMode": "Reading", "studyMode": "Study" },
  "chapter": { "prev": "Previous chapter", "next": "Next chapter", "notFound": "This chapter has not been translated yet." },
  "notes": { "critical": "Critical", "lexical": "Lexical", "grammatical": "Grammatical", "theological": "Theological" },
  "glossary": { "title": "Glossary", "hebrew": "Hebrew", "translation": "Translation", "notes": "Notes" },
  "metadata": { "edition": "Edition", "status": "Status", "baseText": "Base Text" }
}
```

### 8.3 URL structure

```
/en/genesis/1          → English Genesis Chapter 1
/pt-br/genesis/1       → Portuguese Genesis Chapter 1
/de/genesis/1          → German Genesis Chapter 1
```

`next-intl` middleware handles locale detection (browser `Accept-Language` → redirect to matching locale) with `/en` as default fallback.

---

## 9. Performance Budget

| Metric | Target | How |
|--------|--------|-----|
| LCP | < 1.2s | SSG + self-hosted fonts + minimal client JS in reading mode (RSC eliminates component JS) |
| FID / INP | < 100ms | Minimal JS; note expansion is CSS-only or lightweight |
| CLS | < 0.05 | Font-display: swap with size-adjust; no layout shift from lazy content |
| TTI | < 2s | RSC reading mode = minimal hydration (~30KB framework shell); study mode = partial hydration for interactive notes |
| Bundle size (JS) | < 80KB (gzipped, first load) | No heavy libraries; Framer Motion tree-shaken |
| Page weight | < 200KB (reading), < 350KB (study) | Prose is light; notes add weight |

---

## 10. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Markdown parser breaks on unexpected format | Medium | High | Unit tests for each chapter; CI validation; parser error boundaries |
| Free-tier limits hit | Very Low | Medium | 9 static pages = negligible traffic; monitor Vercel dashboard |
| Hebrew RTL rendering issues | Medium | Medium | Test with Noto Sans Hebrew early; CSS `unicode-bidi: isolate` for inline |
| Note expansion jank on mobile | Medium | Low | CSS `details/summary` as fallback; JS enhancement progressive |
| Content grows faster than parser adapts | Medium | Medium | Parser validates against known section headers; unknown sections logged as warnings, not errors |
| Design-system drift as features add | Low | Medium | Token-only styling; no hardcoded values; anti-slop review at each phase |

---

## 11. Definition of Done (v1.0)

- [ ] All 9 chapter pages render correctly (3 chapters × 3 languages)
- [ ] Reading mode: continuous prose, superscript verse numbers, paragraph grouping
- [ ] Study mode: verse cards, color-coded notes, glossary, cross-chapter tracking
- [ ] Language switching preserves current book + chapter + mode
- [ ] Mobile-first layout (tested at 375px, 768px, 1440px)
- [ ] WCAG 2.2 AA compliance (contrast, keyboard, screen reader, tap targets)
- [ ] Lighthouse 95+ on all 4 metrics
- [ ] Anti-slop checklist passed
- [ ] Deployed on Vercel (free tier)
- [ ] Analytics + Speed Insights enabled
- [ ] No runtime errors in console
- [ ] All content matches source markdown exactly (no content drift between parser output and file)

---

## 12. Estimated Timeline

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1A: Scaffold | 1 day | Day 1 |
| Phase 1B: Markdown parser (dedicated focus) | 2 days | Day 3 |
| Phase 2: Reading mode | 2–3 days | Day 5–6 |
| Phase 3: Study mode | 3 days | Day 8–9 |
| Phase 4: Navigation + Home | 2 days | Day 10–11 |
| Phase 5: Polish + monitoring | 2–3 days | Day 13 |
| Phase 6: Deploy | 1 day | Day 14 |
| **Total to v1.0** | **~14 days** | |

---

## Revision Log

**v1.0** (2026-04-17) — Initial plan.

**v1.1** (2026-04-17) — Post-feedback revision incorporating `docs/implementation/FEEDBACK.md`:

1. **RSC/JS language corrected:** "Zero JavaScript in reading mode" → "minimal JavaScript" throughout. RSC eliminates component-level client JS; Next.js framework shell (~30KB) still ships for client navigation. Functional claims (clean semantic HTML for screen readers, no hydration mismatches) remain accurate. Changed in: tech stack table (§1.2), architectural standards (§2.3), performance budget (§9).

2. **Markdown parser elevated to dedicated focus area:** Moved from sub-bullet in Phase 1 to a dedicated Phase 1B with its own timeline (2 days), explicit edge-case list, and unit-test requirements (81+ assertions minimum: 1 per extractor × 3 locales × 3 chapters). This is the single hardest engineering task in the build and the single point of fragility. Changed in: Phase 1 (§6).

3. **Monitoring decision deferred, not assumed:** Replaced "Vercel Analytics + Speed Insights" as the only monitoring with a structured decision point at Phase 5. Sentry (free tier, 5K errors/month) is evaluated against actual Phase 1–4 error patterns — not reflexively adopted. If adopted, uses content-aware tags (locale, book, chapter) per `FEEDBACK.md` recommendation. Changed in: Phase 5 (§6), architectural standards (§2.3).

4. **Analytics event taxonomy documented:** Adopted from Plan B feedback. Five domain events defined (CHAPTER_VIEWED, VIEW_MODE_SWITCHED, LANGUAGE_CHANGED, NOTE_EXPANDED, GLOSSARY_OPENED) with lightweight custom-event implementation via Vercel Analytics. No custom EventBus at this stage. Added in: Phase 5D (§6).

5. **Tier 3 enrichment parsing anticipated:** Parser architecture now documents the extension point for Tier 3 companion files (verification levels, sources extraction). Not built in Phases 1–6; documented in §4.4 so parser design anticipates the shape without implementing it.

6. **Phase 7 restructured:** Grouped by infrastructure requirement (no-change / static-extensions / DB-required). References `SCHEMA-FUTURE.sql` for user-data tables. Pagefind recommended over Algolia for search. Hybrid architecture (static content + DB for user data) made explicit.

7. **Timeline adjusted:** Phase 1 expanded from 2 to 3 days to accommodate dedicated parser work. Total v1.0 timeline: ~14 days (from ~13). Phase 5 expanded to include monitoring decision + analytics taxonomy.

---

*Plan produced 2026-04-17. Updated 2026-04-17 post-feedback. Ready to execute on approval.*
