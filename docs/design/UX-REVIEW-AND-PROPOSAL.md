# UX Review & Proposal (Item 1 — Design / Product Clarity)

**Date:** 2026-06-04
**Status:** DECISIONS LOCKED 2026-06-04 — **Q1=C · Q2=later · Q3=3-door · Q4=warm-paper+accent · Q5=adopt · Q6=approve · Q7=follows-Q1 · Q8=defer** (see §Decision locks). Implementation pending its own plan. Read-only review; **no UI code changed yet.**
**Author:** Claude Opus 4.8 (1M context)
**Method:** Live audit of https://bible-tt.vercel.app via MCP browser at desktop (1440) + mobile (390) — landing, Genesis book page, Genesis 1 chapter; plus code/copy review and targeted research (sources at end).
**Scope of this doc:** product thesis, positioning/voice, information architecture, visual identity, copy, onboarding, naming, content scope. Maps the project lead's 9 feedback items.

---

## Brand-voice guardrail (locked)

**Provocative and/or sarcastic is allowed; disrespectful is not.** Bold, witty, fearless, intellectually confident — never contemptuous of believers, texts, or any tradition. Every copy/design choice in this doc is held to this line.

---

## Part 1 — Product thesis (the keystone)

The current product presents as *"a transparent Bible translation"* — a **feature**, aimed at religious study. The lead's items 3 + 4 + 5 + 6 point to something larger and more magnetic. Three candidate theses (pick or blend one — everything downstream derives from it):

**A — "The honest text" (rigorous / neutral-fearless).**
*For the curious — believer or skeptic — who suspects they've only ever read an interpretation.* One job: read what the source actually says, every translator's choice made visible. Voice: calm, exact, quietly subversive. Hook: *"You've been reading interpretations. Here's the text."*

**B — "Un-edited" (bold edge).**
*For people who think these books are settled, sanitized, or propaganda.* One job: confront the smoothed-over version with the raw one. Voice: sharp, witty, irreverent-but-respectful. Hook: *"The most edited book in history — un-edited."*

**C — "Civilization's source code" (broadest / literary-historical).**
*For anyone curious about the texts under 2,000 years of Western culture — regardless of faith.* One job: read the originals behind the art, law, and arguments. Voice: erudite, expansive. Hook: *"Read the originals behind everything."*

**Recommendation:** lead with **A**, borrow **C's** "beyond religion" reach and **B's** edge in marketing voice. This satisfies item 4 (believers *and* atheists/other-faiths/hostile-curious) without alienating either pole, and stays inside the respect guardrail. *(Decision point Q1.)*

### Content scope model (items 4 + 5)
- **Tier 1 — Core (confirmed):** the **Catholic canon** = full Jewish Tanakh + deuterocanon (Tobit, Judith, Wisdom, Sirach, Baruch, 1–2 Maccabees, additions to Esther/Daniel) + New Testament. The **"what got cut" hook lives here**: the deuterocanon is in Catholic but not Protestant Bibles — genuinely intriguing to a curious audience, and fully inside the confirmed scope.
- **Tier 2 — Adjacent (decision needed):** Second-Temple / pseudepigrapha — **Enoch** (your item 5), Jubilees, etc. These are **not** in the Jewish or Catholic canon (Enoch is Ethiopian Orthodox only), so they'd appear clearly labeled *"read by some ancient communities; never canonized — included so you can see what was left out and why."* *(Decision point Q2: include Tier 2 now / later / never.)*
- **Out (unless requested):** Gnostic/Nag Hammadi, etc.

---

## Part 2 — Audit findings (mapped to your 9 items)

| Item | Finding (from the live audit) |
|---|---|
| **1 — color "boring"** | Correct, but the diagnosis is precise: the warm-paper *reading surface* is right (research: sepia/warm is best for eye comfort) — the problem is the **UI chrome** (nav, cards, dividers, mode tabs, active states) carries almost no contrast or accent, so the whole app reads as one flat sepia wash with no hierarchy or identity. Fix the chrome, keep the page. |
| **2 — name/logo/favicon** | Placeholder "TT" wordmark; no real logo. Agreed it shouldn't be final. Name should be chosen *after* thesis (Q1) so it can carry the broader positioning. Treated as emergent (Part 3 gives criteria + candidates, not a forced pick). |
| **3 — landing copy** | Stronger than "purely feature-driven" — it already runs problem → "what translations hide" demo → ways-in → who-for. But: the hero leads with a **physics curiosity** (clever, niche); **"Five ways to dig in" dumps all 5 modes on a first-timer**; and framing still orbits "the Bible/study" rather than the broader desire. Needs a desire-led rewrite, not a rebuild. |
| **4 — audience too narrow** | Confirmed in copy ("If you think the Bible is boring…"). The re-positioning (Part 1) fixes this at the root. |
| **5 — more books (Enoch…)** | Scope model above. Apocrypha/deuterocanon is an *asset* for the broad audience, not a footnote. |
| **6 — "how to start" reading plan** | Currently **absent**. This is the single biggest onboarding gap — guided plans are the proven beginner hook (YouVersion, BibleProject). Your Psalms→Proverbs→Ecclesiastes→Gospels→Revelation→Genesis plan should be a **top-level "New here? Start here"** feature. |
| **7 — book overview too long** | The Genesis book page leads with stacked entry cards (Overview/Introduction/People/Context) **+** 12 chapter cards — "card soup" (which your own design rules forbid). Overview should be a tight *what / when / who / to whom / why* blurb + "read more," then get out of the way. |
| **8 — chapter overview too dense** | Agreed — strip inline transliterations from the *overview* prose (they belong in the verse notes, not the summary). Concrete rewrite in Part 3. |
| **9 — IA / routes** | The core issue: **two stacked layers of "too many doors"** — book page (4 entry cards + 12 chapters) and chapter page (4–5 view-mode tabs: Reading/Study/Explore/Context/Prophecy). A person who just wants to *read* must make several navigation decisions first. This is "too many possibilities" made literal. |
| **mobile-first** | The app reflows and is readable on mobile, but it's a **desktop layout that adapts** — matching the design doc's explicit "desktop primary, mobile secondary," which **contradicts the stated mobile-first goal.** Re-baseline to mobile-first. |

### Enrichment-surface deep-dive (observed live, 2026-06-04)

The 4 chapter view-modes + 3 book sub-pages, inspected directly (mobile):

| Surface | What it actually is | Implication |
|---|---|---|
| **Chapter · Study** | **6 collapsed cards** (Overview, Reading Guide, Glossary, Formula Tracking, Root Doubling, Verb Shifts) stacked **above verse 1**; verses then carry "Notes (N)" expanders | The *text is buried under scaffolding*. Study extras should be on-demand/secondary, not a preamble pile. |
| **Chapter · Explore** | long single column of curated entries (Curiosities, World-at-the-Time, Scientific) | It is a **subset of Context** (below) → a redundant tab. |
| **Chapter · Context** | the full companion as collapsible cards (Curiosities 9, Historical 2, Scientific 5, World 4, …) + disclaimer | **Explore ⊂ Context confirmed** → merge. Also a **bug:** the disclaimer renders literal `**asterisks**` (markdown not parsed). |
| **Chapter · Prophecies** | well-structured labeled entries (What the text says / Context / Traditional readings — Jewish·Christian·Islamic + Documented/Debated badges) | **Best-structured enrichment view — keep this pattern.** But it's the 5th tab and on mobile **the tab bar overflows: "Reading" scrolls off-screen.** 5 modes literally don't fit. |
| **Book · Introduction** | a **TOC of collapsible cards** (Overview/Authorship/Dating/Historical/Manuscript/Reading-in-TT, each w/ count) | An extra navigation layer before any content; more card-soup. |
| **Book · People** | colorful SVG **lifespan timeline** + person cards | **The strongest, most distinctive screen** — and the only place real color appears. This is the visual-identity model to extend app-wide (ties to Q4). *(Minor: the chart overruns the mobile viewport — responsive fix needed.)* |
| **Book · Context** | panoramic cross-chapter motifs in dense scholarly prose | **Name collision:** "Context" here = *book motifs*, but "Context" is also a *chapter view-mode* = the full companion. Same word, two different things → confusing (item 9). |

**Net:** the deep-dive confirms the "too many doors / too much info" thesis with hard evidence — redundant tabs (Explore⊂Context), a mobile tab-bar that overflows at 5 modes, the reading text buried under study scaffolding, an overloaded "Context" name, and an extra TOC layer on Introduction. It also surfaces the **People page as the design exemplar** to learn from, plus two concrete bugs (markdown `**` literal; People chart overflow).

---

## Part 3 — Proposal (options + decision points)

### Q3 — Information architecture: collapse the doors, default to reading
**Recommended:** make **Reading the default and the front door**; demote everything else to progressive disclosure.
- **Chapter page:** reduce 5 modes → **Read** (default) + **Notes** (inline study toggle) + **Deeper** (one surface that absorbs Explore + Context + People + Prophecy, lazy-loaded). 3 doors, not 5.
- **Book page:** lead with the short overview (Q6) + a big **Start reading** + the chapter list; move Introduction / People / Context under a single **"About this book"** expander. Kills the card soup.
- **Top-level:** add **"New here? Start here"** (the reading plan, Q5).

```
Mobile — chapter (proposed)
┌──────────────────────────┐
│ ‹ Genesis 1        EN ▾  │
│ ───────────────────────  │
│  Read · Notes · Deeper   │   ← 3, not 5; "Read" active by default
│ ───────────────────────  │
│  ¹ In beginning, God     │
│    created the skies…     │   ← clean text first; notes/àdeeper on demand
└──────────────────────────┘
```
*Alternatives: (B) keep 5 modes but make Reading the hard default + hide the rest behind a "study tools" affordance; (C) keep as-is. Recommend the 3-door model.*

**Observed evidence now backs this (see Part 2 deep-dive):** Explore is literally a subset of Context (merge); the 5-tab bar overflows on mobile with "Reading" pushed off-screen (fewer tabs is necessary, not just nicer); Study buries the verses under 6 scaffolding cards (text should lead, study tools on demand); and "Context" is overloaded (book-motifs vs. chapter-companion) and needs renaming. The **Prophecies** entry layout and the **People** timeline are the two patterns worth *keeping/extending*, not collapsing.

### Q4 — Visual identity (color), research-backed
Keep the warm reading surface; **add contrast + a real accent to the chrome**, and a night mode.
- **Recommended direction — "warm paper + confident ink + one real accent":** keep `bg-paper` warm off-white for reading; deepen body ink for ≥ the recommended text/background contrast; introduce **one saturated accent** (candidates: oxblood/deep-red, or deep teal/petrol) used *only* in chrome — active tab, links, the wordmark, key CTAs — so wayfinding gains identity while the page stays calm. Keep the 4 claim-type label colors. Add a **warm night mode** (research: warm light best for evening reading).
- *Alternative — "editorial high-contrast":* lean more newspaper-like (crisper rules, stronger type contrast, near-black headings). 
- *(Pick a direction in Q4; I'll then produce exact OKLCH tokens + a swatch sheet.)*

### Q5 — Onboarding: the "Start here" reading plan (item 6)
A top-level guided path for first-timers, exactly as you described:
1. **Psalms** in full (the soul/feelings) → 2. **Proverbs** (morals) → 3. **Ecclesiastes** (purpose), then **interleave 1 Psalm + 1 Proverb + 1 Ecclesiastes** until Psalms completes → then **Gospels → rest of NT → Revelation → back to Genesis.**
Presented as a friendly "Why this order?" explainer + progress tracking. This becomes a primary landing CTA alongside "Start reading." *(Q5: adopt this plan as the default "Start here"? other plans later?)*

### Q6 — Book & chapter overviews (items 7 + 8)
- **Book overview → tight card:** *What it is · When (range) · Who/attributed · To whom · Why* — 4–6 lines, then "Read the full introduction →". (No stacked entry-cards above it.)
- **Chapter overview → de-jargoned**, per your item-8 example. E.g. Genesis 1 "Key themes": *"Order from chaos; creation by speech; cosmic structure; reproduction by kind; humanity in the image of God; a vegetarian diet assigned"* — transliterations (*tohu vavohu*, *raqia*, *tselem*) live in the verse notes, not the summary. *(These two are low-risk "tactical wins" I can apply regardless of the bigger decisions.)*

### Q7 — Landing copy (items 3 + 4)
Rewrite desire-first, audience-broad, respect-guarded. Direction (final copy after Q1 voice lock):
- **Hero:** a one-line provocation tied to the reader's desire (insight / not-being-deceived), not a physics fact. e.g. *"Everyone quotes it. Almost no one has read what it actually says."*
- **Replace "Five ways to dig in"** with a single "Start reading" + "New here? Start here" (the plan). Move the 5-modes explanation deep, for people already inside.
- Keep the **side-by-side "what translations hide"** demo — it's the strongest asset; lead with it sooner.

### Q8 — Name (item 2)
Not forced now. **Criteria:** carries the broad/honest positioning (not just "translation"); works for believers + skeptics; respectful; ownable/short; good URL. Starter candidates to pressure-test later: *Untranslated, The Open Text, As Written, Bareshit, Plain Text, The Honest Bible, Source.* Leave current name in place until one earns its keep.

---

## Decision points (please audit / lock)

- **Q1 — Thesis:** A (rigorous) / B (bold) / C (broad) / blend. *(rec: A + C reach + B voice)*
- **Q2 — Tier-2 adjacent texts (Enoch et al.):** include now / later / never. *(rec: later, clearly-labeled)*
- **Q3 — IA:** 3-door model / 5-modes-with-hard-default / keep. *(rec: 3-door)*
- **Q4 — Visual direction:** warm-paper+accent / editorial-high-contrast. *(rec: warm-paper+accent; then I produce tokens)*
- **Q5 — Reading plan as default "Start here":** yes / adjust.
- **Q6 — Overview rewrites (book + chapter):** approve tactical wins. *(rec: yes)*
- **Q7 — Landing rewrite direction:** approve, then I draft full copy after Q1.
- **Q8 — Name:** explore candidates now / defer.

## Decision locks (2026-06-04)

- **Q1 = C — Broad / civilizational.** Position beyond religion: *"read the originals behind 2,000 years of culture,"* for believers, skeptics, and other faiths alike. **Implication:** the hero leads with the civilizational/"read the originals" desire rather than the "what translations hide" angle — but **transparency stays as the method/differentiator** ("the originals, shown honestly — every choice visible"). Voice: erudite and broad, edge permitted, never disrespectful. This steers **Q7 (copy)** and **Q8 (name)** toward "originals / source / text," away from "translation."
- **Q2 = Later, clearly labeled.** Core = Catholic canon (incl. deuterocanon). Enoch / Second-Temple texts added later as an explicit "read by some communities, never canonized" tier.
- **Q3 = 3-door model.** Default Reading; collapse 5 modes → **Read · Notes · Deeper** (Deeper absorbs Explore + Context + People + Prophecy); fixes mobile tab overflow + Explore⊂Context redundancy; rename the overloaded "Context."
- **Q4 = Warm paper + one real accent.** Keep the warm reading surface; add contrast + a single confident accent for chrome + a warm night mode; extend the People-page color energy app-wide; produce exact OKLCH tokens.
- **Q5 = Adopt** the Psalms → Proverbs → Ecclesiastes → Gospels → Revelation → Genesis plan as the default "New here? Start here."
- **Q6 = Approve** book + chapter overview rewrites (tactical wins, safe to do anytime).
- **Q7 = Follows Q1** — full landing copy drafted next (civilizational lead + transparency-as-method).
- **Q8 = Defer** name; let a candidate emerge (now leaning toward "originals / source / text" per Q1=C).

## Out of scope / next
- This doc proposes; **no UI/code changed.** After locks, implementation would be its own plan (per the project workflow), likely sequenced: overviews (quick wins) → IA → color tokens → landing copy → onboarding plan → naming.
- Item 2 (content data structure) is the *separate* second review, after this one.

## Sources
- [Which is best for eyes: black-on-white, white-on-black, or sepia? — techcrawlr](https://techcrawlr.com/which-is-best-for-eyes-while-reading/)
- [Best color combination for on-screen reading — UX Pickle](https://uxpickle.com/what-is-the-best-color-combination-for-on-screen-reading/)
- [Mobile app color scheme trends 2026 — Envato](https://elements.envato.com/learn/color-scheme-trends-in-mobile-app-design)
- [YouVersion case study (onboarding/IA) — Keenan Sultanik](https://keenansultanik.com/youversion/)
- [Bible reading plans — BibleProject](https://bibleproject.com/reading-plans/)
