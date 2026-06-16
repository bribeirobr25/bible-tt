#!/usr/bin/env python3
"""Regenerate all Read-door pages as locale-aware, data-driven shells.
Reading text + overview come from reading-{book}-{n}.js via render-reading.js
and swap with the language switcher. Door-nav availability per book/chapter."""
import pathlib

SITE = pathlib.Path("/Users/simonekugler/Desktop/bible-tt/docs/redesign/site")
BOOKS = {
    "genesis": {"title":"Genesis","count":12,"notes":list(range(1,13)),"deeper":list(range(1,13))},
    "john":    {"title":"John","count":3,"notes":[1,2,3],"deeper":[1,2,3]},
    "matthew": {"title":"Matthew","count":3,"notes":[1,2,3],"deeper":[1,2,3]},
}
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com" />'
 '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />'
 '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,200..700;1,6..72,300..600&display=swap" rel="stylesheet" />')

def door_nav(book, n, cfg):
    notes = (f'<a href="chapter-{n}-notes.html" data-i18n="door.notes">Notes</a>' if n in cfg["notes"]
             else '<span class="disabled" data-i18n="door.notes" title="Verse notes are shown on the showcase chapters in this preview">Notes</span>')
    deeper = (f'<a href="chapter-{n}-deeper.html" data-i18n="door.deeper">Deeper</a>' if n in cfg["deeper"]
              else '<span class="disabled" data-i18n="door.deeper" title="Deeper companion shown on the showcase chapters in this preview">Deeper</span>')
    return (f'<nav class="door-nav" aria-label="Chapter views">'
            f'<a href="chapter-{n}.html" aria-current="page" data-i18n="door.read">Read</a>{notes}{deeper}</nav>')

def page(book, cfg, n):
    title = cfg["title"]; count = cfg["count"]
    prev = (f'<a href="chapter-{n-1}.html"><span class="pl" data-i18n="ui.prev">Previous chapter</span>'
            f'<span class="serif" style="font-size:1.2rem">{title} {n-1}</span></a>') if n > 1 else "<span></span>"
    nxt = (f'<a class="right" href="chapter-{n+1}.html"><span class="pl" data-i18n="ui.next">Next chapter</span>'
           f'<span class="serif" style="font-size:1.2rem">{title} {n+1}</span></a>') if n < count else \
          (f'<a class="right" href="index.html"><span class="pl">↑</span><span class="serif" style="font-size:1.2rem">{title} hub</span></a>')
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>{title} {n} — Read · The Transparent Translation</title>
<meta name="description" content="{title} {n} in continuous reading — English, Português, Deutsch, Español." />
{FONTS}
<link rel="stylesheet" href="../assets/tt.css" />
</head>
<body class="has-header">
  <header class="site-header">
    <a class="brand" href="../index.html"><span class="mark"></span> Transparent Translation</a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false"><span></span></button>
    <nav>
      <a href="../books.html" data-i18n="nav.books">Books</a>
      <a href="index.html">{title}</a>
      <a href="../rules.html" data-i18n="nav.rules">How we translate</a>
      <a class="nav-cta" href="chapter-1.html" data-i18n="nav.startReading">Start reading →</a>
    </nav>
  </header>

  <div class="chapter-head wrap">
    <nav class="crumb"><a href="../index.html" data-i18n="nav.home">Home</a><span class="sep">/</span><a href="index.html">{title}</a><span class="sep">/</span><span>Chapter {n}</span></nav>
    <div class="title-row">
      <div><div class="ref">The Transparent Translation · {title}</div><h1 class="serif"><span data-i18n="book.{book}">{title}</span> {n}</h1></div>
      <span class="status-pill"><span class="dot"></span> <span data-i18n="ui.provisional">Provisional</span></span>
    </div>
    {door_nav(book, n, cfg)}
    <div class="seam"></div>
  </div>

  <main class="wrap" style="padding-top:clamp(36px,6vh,64px);padding-bottom:clamp(48px,8vh,90px)">
    <div style="max-width:46rem;margin:0 auto 34px">
      <details id="overview-details">
        <summary><span data-i18n="ui.chapterOverview">Chapter overview</span><span class="chev">›</span></summary>
        <div class="body prose" id="overview-body"></div>
      </details>
    </div>
    <article class="reading" id="reading" data-reading></article>
    <nav class="pager">{prev}{nxt}</nav>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <div class="cols">
        <div><p class="brand-blurb serif">A translation with nothing hidden.</p></div>
        <div><h4>{title}</h4><a href="index.html">Book hub</a><a href="introduction.html" data-i18n="ui.introduction">Introduction</a><a href="people.html" data-i18n="ui.people">People</a><a href="background.html" data-i18n="ui.background">Background</a></div>
        <div><h4 data-i18n="ui.method">Method</h4><a href="../rules.html" data-i18n="nav.rules">The 29 rules</a><a href="../books.html" data-i18n="ui.allBooks">All books</a><a href="../start.html" data-i18n="nav.start">Start here</a></div>
      </div>
      <div class="legal"><span>© The Transparent Translation · EN · PT · DE · ES</span><span class="badge">Redesign · Light &amp; Darkness</span></div>
    </div>
  </footer>

  <script src="../assets/data/reading-{book}-{n}.js"></script>
  <script src="../assets/tt.js"></script>
  <script src="../assets/render-reading.js"></script>
</body>
</html>
'''

for book, cfg in BOOKS.items():
    for n in range(1, cfg["count"]+1):
        (SITE/book/f"chapter-{n}.html").write_text(page(book, cfg, n), encoding="utf-8")
    print(f"{book}: {cfg['count']} read pages regenerated (data-driven, locale-aware)")
print("done")
