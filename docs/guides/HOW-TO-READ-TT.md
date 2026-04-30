# How to Read the Transparent Translation

A short guide for readers and collaborators.

---

## What this is

The Transparent Translation (TT) is a translation of the Hebrew Bible from the Masoretic Text into English, Brazilian Portuguese, and German. It is governed by 29 rules designed to show you what the Hebrew says, what it may mean, and where it remains open.

It is not a devotional Bible. It is not a replacement for scholarly editions. It is not a commentary. It is a disciplined attempt at transparency.

---

## What makes it different

Most translations make choices silently — smoothing ambiguity, adding words for readability, choosing one meaning where several exist, importing later theology into earlier text. The TT makes all of this visible.

---

## How to read the notation

### *Italics*

Words in italics were **added for grammar** — they are not in the Hebrew text.

> "And God saw that ***it was*** good"

Hebrew says "and-saw God that good." The words *it was* were added so the English sentence works. Italics mark every such addition.

### Slashes (wind/spirit)

When the Hebrew word has two or more valid meanings and context does not force one, both are shown with a slash.

> "wind/spirit of God was hovering"

Hebrew **רוּחַ** (*ruach*) means wind, spirit, and breath. The TT does not choose for you.

### YHWH

The divine name is rendered consonantally — **YHWH** in English and Portuguese, **JHWH** in German. Not "the LORD." Not "God." The four Hebrew consonants, because that is what the text has. The original pronunciation is lost.

### Transliterated terms (raqia, nephilim, tebah)

Some Hebrew words are kept in their original form because every translation would import false meaning. **Raqia** is not "firmament" (too medieval) or "expanse" (too modern). It is *raqia* — explained in the notes.

---

## Three ways to read

### Reading mode

Continuous prose with superscript verse numbers. Clean page. No notes. Read it like a story. The text flows from beginning to end without interruption.

This is the closest to how the Hebrew narrative reads — one continuous stream, not isolated verses.

### Study mode

Verse by verse with expandable notes. Each verse shows the main text, and below it, collapsible notes organized by type:

- **Critical** — major textual or translation decisions (what we chose and why)
- **Lexical** — word meanings, root patterns, glossary connections
- **Grammatical** — Hebrew structure, verb forms, syntax preserved or adapted
- **Theological** — interpretive options, ambiguity preservation, what the text leaves open

Below the verses: expandable glossary, cross-chapter tracking, and supplementary analysis.

### Context mode

Contextual study companion. Expandable topic sections covering:

- **Hebrew Text Features** — what the transparent rendering makes visible
- **Ancient Near Eastern Parallels** — texts from neighboring cultures (Mesopotamia, Egypt, Ugarit)
- **Historical & Archaeological** — material culture, dating, ancient cosmological models
- **Linguistic Deep Dives** — rare words, cognates, semantic fields
- **Scientific Correspondence** — what the text presents vs. what modern science describes (neither proving nor disproving)
- **Later Reception** — how Jewish, Christian, and Islamic traditions have read these passages (clearly labeled as post-biblical)
- **Curiosities** — text-linked observations and open questions

Every entry carries two labels: **what kind of claim** (Textual, Comparative Parallel, Later Reception, etc.) and **how certain** (Verified, Probable, Possible, Uncertain, Speculative).

The companion draws no conclusions. You do.

---

## What the TT intentionally refuses to do

- **Add "the" where Hebrew has none.** "In beginning" — not "In the beginning." Hebrew *bereshit* has no article.
- **Resolve ambiguity.** If Hebrew supports two readings and context doesn't force one, both stay. The slash is not laziness — it is honesty.
- **Import later theology.** The serpent in Genesis 3 is a *nachash* (serpent), not Satan. There is no "Fall" in the Hebrew text. The word "sin" does not appear until Genesis 4:7.
- **Smooth what sounds strange.** "Dying you shall die" — not "you shall surely die." "Seeding seed" — not "seed-bearing." The awkwardness mirrors Hebrew.
- **Pretend certainty.** When the meaning of a word is genuinely unknown (like *ed* at Gen 2:6 or *shuf* at Gen 3:15), the note says so. Probable, Possible, Uncertain — the label is part of the honesty.

---

## What the strange bits mean

If a phrase sounds odd, it is probably preserving a Hebrew structure that other translations smooth over.

| You read | Why it sounds strange | What it preserves |
|----------|----------------------|-------------------|
| "In beginning" | Missing "the" | Hebrew has no article here |
| "Shall be light" | Unusual English | Hebrew jussive (command-form) |
| "Seeding seed" | Repetitive | Hebrew root-doubling (poetic device) |
| "That good" | Incomplete sentence | Hebrew compression (no "it was") |
| "wind/spirit" | Unresolved | Hebrew word means both |
| "side/rib" | Two options | Hebrew word used architecturally elsewhere |
| "dying you shall die" | Emphatic doubling | Hebrew infinitive absolute (maximum force) |

If you're reading the Transparent Edition and something feels wrong — check the note. The strangeness is usually the point.

---

## For collaborators

If you're contributing to the project:

- **Read** `docs/rules/RULES-CORE.md` + `RULES-HB.md` (v3.0) — the 29-rule governance system
- **Read** `docs/design/TT-DESIGN-SYSTEM.md` — UI/UX standards
- **Read** `docs/architecture/STANDARDS.md` — code and architecture standards
- **Log decisions** in `docs/editorial-log/genesis.md` before drafting
- **New glossary terms** go in RULES-HB.md locked glossary before use
- **EN first,** then PT-BR, DE, and ES follow
- **Test:** `pnpm test` then `pnpm build` after every change

---

## Languages

The TT is available in English, Brazilian Portuguese, and German. Switch languages on any page using the language toggle at the top right. The current book and chapter are preserved.

Each language follows the same rules, the same glossary, and the same ambiguity-preservation policies. Where one language must diverge from others due to grammar (e.g., German requires an article where Hebrew and English don't), the divergence is documented.

---

*A translation with nothing hidden.*
