#!/usr/bin/env python3
"""Generate thin HTML shells for the secondary study surfaces (introduction, people,
background, per-chapter deeper) for Genesis, John & Matthew. Content is loaded from the
parsed per-locale data files + shared locale-aware renderers; shells carry no content.
Shell chrome is localized via data-i18n; bodies carry data-localized (no preview toast)."""
import pathlib

SITE = pathlib.Path("/Users/simonekugler/Desktop/bible-tt/docs/redesign/site")
BOOKS = {
    "genesis": {"title":"Genesis","deeper":list(range(1,13)),"prophecy":[3,9,12],"notes":list(range(1,13)),"skip_people":True},
    "john":    {"title":"John","deeper":[1,2,3],"prophecy":[3],"notes":[1,2,3]},
    "matthew": {"title":"Matthew","deeper":[1,2,3],"prophecy":[1,2],"notes":[1,2,3]},
}

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com" />'
 '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />'
 '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,200..700;1,6..72,300..600&display=swap" rel="stylesheet" />')

def header(book, title, current):
    return f'''<header class="site-header">
    <a class="brand" href="../index.html"><span class="mark"></span> Transparent Translation</a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false"><span></span></button>
    <nav>
      <a href="../books.html" data-i18n="nav.books">Books</a>
      <a href="index.html" data-i18n="book.{book}"{' aria-current="page"' if current=="hub" else ''}>{title}</a>
      <a href="../rules.html" data-i18n="nav.rules">How we translate</a>
      <a class="nav-cta" href="chapter-1.html" data-i18n="nav.startReading">Start reading →</a>
    </nav>
  </header>'''

def footer(book, title):
    return f'''<footer class="site-footer"><div class="wrap">
      <div class="cols">
        <div><p class="brand-blurb serif">A translation with nothing hidden.</p></div>
        <div><h4>{title}</h4><a href="index.html">Book hub</a><a href="introduction.html">Introduction</a><a href="people.html">People</a><a href="background.html">Background</a></div>
        <div><h4>Method</h4><a href="../rules.html">The 29 rules</a><a href="../books.html">All books</a><a href="../start.html">Start here</a></div>
      </div>
      <div class="legal"><span>© The Transparent Translation · EN · PT · DE · ES</span><span class="badge">Redesign · Light &amp; Darkness</span></div>
    </div></footer>'''

def crumb(book, title, surface_key, surface_label):
    return (f'<nav class="crumb"><a href="../index.html" data-i18n="nav.home">Home</a><span class="sep">/</span>'
            f'<a href="../books.html" data-i18n="nav.books">Books</a><span class="sep">/</span>'
            f'<a href="index.html" data-i18n="book.{book}">{title}</a><span class="sep">/</span>'
            f'<span data-i18n="{surface_key}">{surface_label}</span></nav>')

PILL = '<span class="status-pill"><span class="dot"></span> <span data-i18n="ui.provisional">Provisional</span></span>'

def page(book, title, head_inner, body_main, data_scripts, render_script):
    scripts = "".join(f'<script src="../assets/data/{d}"></script>' for d in data_scripts)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>{head_inner}</title>
{FONTS}
<link rel="stylesheet" href="../assets/tt.css" />
</head>
<body class="has-header" data-localized>
  {header(book, title, "")}
  {body_main}
  {footer(book, title)}
  {scripts}
  <script src="../assets/{render_script}"></script>
  <script src="../assets/tt.js"></script>
</body>
</html>
'''

for book, cfg in BOOKS.items():
    title = cfg["title"]; d = SITE / book

    # introduction
    main = f'''<div class="chapter-head wrap">
    {crumb(book, title, "ui.introduction", "Introduction")}
    <div class="title-row"><div><div class="ref">Book introduction</div><h1 class="serif">{title} · <span data-i18n="ui.introduction">Introduction</span></h1></div>{PILL}</div>
    <div class="seam"></div>
  </div>
  <main class="wrap" style="padding-top:clamp(36px,6vh,64px);padding-bottom:clamp(48px,8vh,90px)">
    <section style="margin-bottom:clamp(40px,6vh,70px)"><p class="kick" data-i18n="ui.atAGlance">At a glance</p><div id="intro-card"></div></section>
    <div class="deeper-section">
      <p class="disclaimer">Scholarly background. It does not redefine, expand, or control the main translation. Every entry is labelled by <strong>claim type</strong> and <strong>confidence</strong>; no claim is the TT’s theological or compositional position. The TT translates the source text and adopts no particular theory of authorship. Parsed in full from the source introduction.</p>
      <div id="intro-sections"></div>
    </div>
    <nav class="pager"><a href="index.html"><span class="pl">←</span><span class="serif" style="font-size:1.2rem">{title}</span></a><a class="right" href="chapter-1.html"><span class="pl" data-i18n="nav.startReading">Start reading →</span><span class="serif" style="font-size:1.2rem">{title} 1</span></a></nav>
  </main>'''
    (d/"introduction.html").write_text(page(book, title, f"{title} — Introduction · The Transparent Translation", main, [f"{book}-intro.js"], "render-intro.js"), encoding="utf-8")

    # people (skipped where a bespoke page exists, e.g. Genesis timeline)
    if not cfg.get("skip_people"):
        main = f'''<div class="chapter-head wrap">
    {crumb(book, title, "ui.people", "People")}
    <div class="title-row"><div><div class="ref">People &amp; genealogy</div><h1 class="serif" data-i18n="ui.people">People and Genealogy</h1></div>{PILL}</div>
    <div class="seam"></div>
  </div>
  <main class="wrap" style="padding-top:clamp(36px,6vh,64px);padding-bottom:clamp(48px,8vh,90px)">
    <p class="lead" style="max-width:60ch">Figures named in the text, with the fields the source records. All claims are labelled by type and confidence; “not stated” where the text is silent.</p>
    <section style="margin-top:clamp(40px,6vh,70px)"><p class="kick"><span data-i18n="ui.profiles">Profiles</span> · <span id="pcount" style="color:var(--ink-mute);text-transform:none;letter-spacing:0"></span></p><div id="people"></div></section>
    <section style="margin-top:clamp(48px,7vh,80px)"><p class="kick" data-i18n="ui.genealogyTables">Genealogy tables</p><div id="genealogies"></div></section>
    <section style="margin-top:clamp(40px,6vh,70px)"><details><summary><span data-i18n="ui.sourcesConsulted">Sources consulted</span><span class="chev">›</span></summary><div class="body psources" id="psources"></div></details></section>
    <nav class="pager"><a href="index.html"><span class="pl">←</span><span class="serif" style="font-size:1.2rem">{title}</span></a><a class="right" href="background.html"><span class="pl">→</span><span class="serif" style="font-size:1.2rem" data-i18n="ui.background">Background</span></a></nav>
  </main>'''
        (d/"people.html").write_text(page(book, title, f"{title} — People · The Transparent Translation", main, [f"{book}-people.js"], "render-people.js"), encoding="utf-8")

    # background
    main = f'''<div class="chapter-head wrap">
    {crumb(book, title, "ui.background", "Background")}
    <div class="title-row"><div><div class="ref">Book-level background · cross-chapter motifs</div><h1 class="serif">{title} · <span data-i18n="ui.background">Background</span></h1></div>{PILL}</div>
    <div class="seam"></div>
  </div>
  <main class="wrap" style="padding-top:clamp(36px,6vh,64px);padding-bottom:clamp(48px,8vh,90px)">
    <div class="deeper-section">
      <p class="disclaimer" id="bg-disclaimer">Patterns that span multiple chapters. Each motif is labelled by claim type and confidence. Parsed in full from the source.</p>
      <p class="mono" style="color:var(--ink-mute);font-size:12px;margin:-14px auto 26px;max-width:48rem">All <span id="motifcount"></span> cross-chapter motifs from the source book-context surface.</p>
      <div id="motifs"></div>
    </div>
    <nav class="pager"><a href="people.html"><span class="pl">←</span><span class="serif" style="font-size:1.2rem" data-i18n="ui.people">People</span></a><a class="right" href="chapter-1.html"><span class="pl" data-i18n="nav.startReading">Start reading →</span><span class="serif" style="font-size:1.2rem">{title} 1</span></a></nav>
  </main>'''
    (d/"background.html").write_text(page(book, title, f"{title} — Background · The Transparent Translation", main, [f"{book}-background.js"], "render-background.js"), encoding="utf-8")

    # per-chapter deeper
    for ch in cfg["deeper"]:
        notes_tab = (f'<a href="chapter-{ch}-notes.html" data-i18n="door.notes">Notes</a>' if ch in cfg["notes"]
                     else '<span class="disabled" data-i18n="door.notes">Notes</span>')
        data = [f"{book}-{ch}-deeper.js"] + ([f"{book}-{ch}-prophecy.js"] if ch in cfg["prophecy"] else [])
        main = f'''<div class="chapter-head wrap">
    <nav class="crumb"><a href="../index.html" data-i18n="nav.home">Home</a><span class="sep">/</span><a href="index.html" data-i18n="book.{book}">{title}</a><span class="sep">/</span><a href="chapter-{ch}.html">{title} {ch}</a><span class="sep">/</span><span data-i18n="door.deeper">Deeper</span></nav>
    <div class="title-row"><div><div class="ref">Background &amp; enrichment</div><h1 class="serif">{title} {ch} · <span data-i18n="door.deeper">Deeper</span></h1></div>{PILL}</div>
    <nav class="door-nav" aria-label="Chapter views">
      <a href="chapter-{ch}.html" data-i18n="door.read">Read</a>
      {notes_tab}
      <a href="chapter-{ch}-deeper.html" aria-current="page" data-i18n="door.deeper">Deeper</a>
    </nav>
    <div class="seam"></div>
  </div>
  <main class="wrap" style="padding-top:clamp(36px,6vh,64px);padding-bottom:clamp(48px,8vh,90px)">
    <div class="deeper-section" style="margin-bottom:30px">
      <div class="subtabs" role="tablist" aria-label="Deeper sub-views">
        <button role="tab" aria-selected="true" data-tab="bg" data-i18n="ui.deeperBackground">Background</button>
        <button role="tab" aria-selected="false" data-tab="pr" data-i18n="ui.prophecies">Prophecies</button>
        <a class="tablink" href="people.html"><span data-i18n="ui.people">People</span> ↗</a>
      </div>
    </div>
    <section id="bg" class="deeper-section">
      <p class="disclaimer">This companion provides contextual and comparative study material. It does not redefine, expand, or control the main translation. Every entry is labelled by <strong>claim type</strong> and <strong>confidence</strong> — read as background, not translation.</p>
      <p class="mono" style="color:var(--ink-mute);font-size:12px;line-height:1.6;margin:-14px auto 30px;max-width:48rem">Complete companion — all <span id="entcount"></span> entries across §A–§I plus the sources, parsed directly from the source file.</p>
      <div id="bg-sections"></div>
    </section>
    <section id="pr" class="deeper-section hidden">
      <div class="disclaimer" data-i18n="prophecy.disclaimer">Prophecy entries present what the text says, how traditions read it, and the scholarly assessment of fulfilment — the reader draws conclusions; the entry draws none.</div>
      <div id="pr-content"></div>
    </section>
    <nav class="pager"><a href="chapter-{ch}.html"><span class="pl">←</span><span class="serif" style="font-size:1.2rem" data-i18n="door.read">Read</span></a><a class="right" href="background.html"><span class="pl">→</span><span class="serif" style="font-size:1.2rem" data-i18n="ui.background">Background</span></a></nav>
  </main>'''
        (d/f"chapter-{ch}-deeper.html").write_text(page(book, title, f"{title} {ch} — Deeper · The Transparent Translation", main, data, "render-deeper.js"), encoding="utf-8")

    built = ["introduction"] + ([] if cfg.get("skip_people") else ["people"]) + ["background"] + [f"chapter-{c}-deeper" for c in cfg["deeper"]]
    print(f"{book}: " + ", ".join(built))
print("done")
