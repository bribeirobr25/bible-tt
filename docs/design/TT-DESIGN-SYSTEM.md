# The Transparent Translation — Design System & Standards
## Project-Specific UI/UX Guide

**Source of truth for:** All frontend visual design, interaction patterns, accessibility, anti-slop, and component standards.
**Companion document:** `docs/architecture/STANDARDS.md` (code architecture, DDD, TypeScript, testing, dependencies)
**Project:** The Transparent Translation (Bible TT) — a multilingual scholarly Bible reading and study web app
**Last updated:** 2026-04-21

---

## 1. Product Feeling

**Primary emotional outcome:** Quiet scholarly clarity — the reader arrives curious, leaves informed. The UI recedes; the text speaks.

**Must feel like:**
- A well-made editorial publication — clean, unhurried, considered
- A trustworthy scholarly tool — precise without being clinical
- An invitation to think — not an instruction to believe

**Must NOT feel like:**
- A devotional Bible app (no crosses, rays of light, parchment textures, stained glass)
- A generic SaaS dashboard
- An AI chatbot interface
- A startup marketing page
- A cluttered reference tool

**One thing to remember:** "I read a verse, saw what the Hebrew actually says, checked the notes, and understood something I'd never noticed before."

---

## 2. Audience

**Primary:** Curious readers — both believers and non-believers who want to see what the Hebrew Bible actually says vs. what translations traditionally present.
**Secondary:** Students and scholars who read Hebrew and want to check the translation's work.
**Context:** Desktop primary (home study), mobile secondary (commute reading). Extended reading sessions (15–60 min).
**Pain:** Every other translation smooths, interprets, or hides. This one shows its work.

---

## 3. Visual Direction

**Aesthetic:** Editorial clean with analog-digital warmth.

**Borrow from:**
- Editorial print (The Economist, Monocle) — typography hierarchy, confident whitespace, warm paper
- High-end notebooks (Moleskine, Field Notes) — tactile quality, warm off-white, subtle texture
- Stripe docs — clean structure, precision
- Sefaria / Dead Sea Scrolls Digital Library — scholarly without being sterile

**Avoid:**
- Religious visual clichés (crosses, rays, parchment, stained glass)
- VC-deck minimalism / Notion block chaos
- Dashboard/analytics patterns
- AI glow or gradient orbs

---

## 4. Typography

### Fonts
| Role | Font | Weight | Use |
|------|------|--------|-----|
| Display / Reading | Newsreader (variable serif) | 300–700 | Verse text, headings, continuous reading |
| UI / Body | Geist (sans) | 400–600 | Navigation, labels, notes, metadata |
| Data / Mono | Geist Mono | 400–700 | Hebrew transliteration, structural labels, glossary codes |

### Scale (desktop)
| Token | Size | Use |
|-------|------|-----|
| text-xs | 12px | Structural mono labels ONLY — minimum allowed |
| text-sm | 14px | Notes, metadata — minimum for prose |
| text-base | 16px | UI body copy |
| text-lg | 18px | Verse text (study mode) |
| text-xl | 20px | Verse text (reading mode) |
| text-2xl | 24px | Section headings |
| text-3xl–5xl | 30–48px | Page titles, landing hero |

**Mobile:** Display sizes reduce by one step. Reading text: 18px (1.125rem).

### Rules
- **Minimum:** 14px for prose/labels. 12px ONLY for structural mono labels. Never below 12px.
- **Letter-spacing:** Large display (≥text-5xl): `tracking-tight`. Mono/caps: `tracking-widest`.
- **Line-height:** Headings: 1.1–1.25. Body: 1.6. Reading: 1.7–1.8.
- **Font features:** `tabular-nums` on numeric data.
- **Never:** Inter, Roboto, Arial, system-ui. Never mix sans families.

---

## 5. Color System

All OKLCH tokens in `src/app/globals.css`. **Hardcoded hex forbidden.**

### Base palette
| Token | Value | Use |
|-------|-------|-----|
| `--color-bg-paper` | `oklch(0.97 0.01 85)` | Warm off-white paper |
| `--color-bg-surface` | `oklch(0.99 0.005 85)` | Cards/surfaces |
| `--color-bg-muted` | `oklch(0.94 0.01 85)` | Toggle tracks, details |
| `--color-text-primary` | `oklch(0.25 0.02 50)` | Body text |
| `--color-text-secondary` | `oklch(0.45 0.02 50)` | Metadata |
| `--color-text-muted` | `oklch(0.6 0.01 50)` | Placeholders |
| `--color-accent` | `oklch(0.55 0.15 55)` | Links, active states |

### Note type colors
| Type | Icon | Border | Background |
|------|------|--------|------------|
| Critical | `AlertCircle` | deep crimson | light crimson tint |
| Lexical | `BookOpen` | forest green | light green tint |
| Grammatical | `Code2` | slate blue | light blue tint |
| Theological | `Lightbulb` | warm amber | light amber tint |

### Rules
- Never pure black/white — use tokens
- Never gradients, neon, or AI glow
- Never color-only status — always icon + text + color
- `::selection` in accent color
- Dark mode: future via OKLCH lightness flip

---

## 6. Layout

### Breakpoints
| Viewport | Width | Layout |
|----------|-------|--------|
| Mobile | <768px | Single column |
| Tablet | 768–1024px | Single column, wider gutters |
| Desktop | ≥1024px | Centered content column |

### Content widths
| Mode | Width | Rationale |
|------|-------|-----------|
| Reading | 680px | ~65 chars/line |
| Study | max-w-4xl | Room for notes |
| Context | max-w-3xl | Enrichment entries |

### Spacing
- Between sections: `space-y-8` to `space-y-12`
- Within sections: `space-y-4` to `space-y-6`
- Page padding: `px-4 md:px-6`

### Rules
- No card soup — use dividers
- No nested cards
- Progressive disclosure via `<details>`
- Hierarchy via typography + spacing, not colored boxes

---

## 7. Interaction

### Motion
| Type | Duration | Easing |
|------|----------|--------|
| Micro (hover, focus) | 150ms | ease-out |
| Component (expand) | 200ms | ease-in-out |
| Navigation | 300ms | ease-out |
| **Maximum** | **400ms** | — |

### Required on EVERY interactive element
- `hover:` state (background tint or color shift)
- `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`
- `active:scale-95` on buttons
- `transition-colors duration-150` or `transition-all duration-200`

### Tap targets
- Minimum: 44×44px (`min-h-11`)
- Buttons: `min-h-12`
- Small links: `min-h-8 min-w-8`

### Bans
- Never linear easing
- Never exceed 400ms
- Never decorative animation
- Always respect `prefers-reduced-motion`

---

## 8. Accessibility (WCAG 2.2 AA)

### Contrast
- Body text: 4.5:1 minimum
- Large text (≥text-xl): 3:1
- UI components: 3:1

### Keyboard
- Every interaction reachable without mouse
- Tab order follows visual order
- Focus rings on all interactive elements

### Semantic HTML
- Landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`
- One `<h1>` per page
- `<details>`/`<summary>` for expandable content
- `role="tablist"` + `role="tab"` + `aria-selected` for mode toggle
- Hebrew RTL: `direction: rtl; unicode-bidi: isolate`

### Inclusive
- No gendered defaults
- No religious-tradition assumptions
- Works for EN, PT-BR, DE readers equally

---

## 9. Human Touch

Verify 2–3 craft details per major page:

- [x] Warm paper background (never pure white)
- [x] Soft warm borders
- [x] Custom `::selection` in ochre
- [x] Custom focus rings (accent)
- [x] Newsreader serif for reading (variable, optical sizing)
- [x] `tracking-tight` on large headings
- [x] `tabular-nums` on numerical data
- [x] Verse superscripts styled subtly
- [x] Chevron rotation on expand
- [x] Note type left-border coloring
- [x] `prefers-reduced-motion` respected
- [x] Contextual empty states

---

## 10. Icon System

**Library:** Lucide — **1.5px stroke** — never mix families or use emoji as UI icons.

| Use | Icon |
|-----|------|
| Critical note | `AlertCircle` |
| Lexical note | `BookOpen` |
| Grammatical note | `Code2` |
| Theological note | `Lightbulb` |
| Hebrew features | `BookOpen` |
| ANE parallels | `Landmark` |
| Historical | `Pickaxe` |
| Linguistic | `Languages` |
| Scientific | `FlaskConical` |
| Later reception | `ScrollText` |
| Curiosities | `Sparkles` |
| Sources | `BookMarked` |
| Expand/collapse | `ChevronRight` |
| Reading mode | `BookOpen` |
| Study mode | `NotebookPen` |

---

## 11. Component Patterns

### Expandable section
```
<details> + group + border rounded-lg
  <summary> with hover, focus-visible, ChevronRight rotating 90°
  Content in border-t div
```

### Note block
```
border-l-3 + type color/bg + Lucide icon + uppercase label + content
```

### Button (primary)
```
min-h-12 + bg-text-primary + text-bg-paper
hover:bg-accent + active:scale-95 + focus-visible:ring-2
```

### Button (secondary)
```
min-h-12 + border + text-text-secondary
hover:border-accent + hover:text-accent + active:scale-95 + focus-visible:ring-2
```

### Mode toggle
```
role="tablist" + bg-bg-muted rounded-lg p-1
  role="tab" + aria-selected + min-h-11
  active: bg-bg-paper shadow-sm
  inactive: hover:bg-bg-paper/50
```

---

## 12. Anti-Slop Checklist

### NEVER USE
- Religious clichés (crosses, rays, parchment, stained glass)
- Gradient orbs, neon, AI glow
- Pure black (#000) or pure white (#FFF)
- Card soup or nested cards
- Mixed icon families or emoji as UI icons
- Hierarchy by colored boxes only
- Inter / Roboto / Arial / system-ui
- Text below 12px (prose below 14px)
- Decorative-only animation
- Missing hover / focus / active states
- Tap targets below 44×44px
- Animations over 400ms or linear easing
- Lorem ipsum or placeholder copy
- Fabricated claims or theological positions
- Labels not matching project vocabulary (Reading / Study / Context)
- Contrast below 4.5:1 for text
- Non-keyboard-reachable elements
- Apologetics or debunking framing in the UI

### VERIFY PRESENT
- [x] Warm off-white background
- [x] Soft warm borders
- [x] Focus rings (accent)
- [x] `::selection` (ochre)
- [x] Contextual empty states
- [x] Lucide icons at 1.5px
- [x] Typography craft
- [x] `prefers-reduced-motion`
- [x] Verse superscripts
- [x] Note type borders
- [x] Chevron rotation

---

## 13. Build Rules

- **Token source:** `src/app/globals.css` = single truth
- **Reuse first:** Check existing before creating new
- **3× rule:** Pattern used 3 times → extract
- **No hardcoded values:** Colors → tokens. Pixels → Tailwind scale.
- **Test:** `pnpm test` + `pnpm build` + manual check at 375px / 768px / 1440px

---

*When in doubt: the text speaks; the UI recedes.*
