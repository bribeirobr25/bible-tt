#!/usr/bin/env python3
"""Build a client-side search index (EN) from the generated per-locale data files.
Output: assets/data/search-index.js (window.SEARCH_INDEX = [{t,k,u,x}, ...]).
Indexes Reading, Deeper, Prophecy, Notes, People, Introduction, Background, Rules, pages."""
import re, json, pathlib
from collections import Counter

ROOT = pathlib.Path("/Users/simonekugler/Desktop/bible-tt")
DATA = ROOT / "docs/redesign/site/assets/data"
strip = lambda h: re.sub(r"\s+"," ", re.sub(r"<[^>]+>"," ", h or "")).strip()
def load(name):
    p = DATA / name
    if not p.exists(): return None
    t = p.read_text(encoding="utf-8")
    return json.loads(t[t.index("=")+1:].rstrip().rstrip(";").strip())
def en(d):  # per-locale data -> EN view (back-compat with any flat file)
    return d.get("en") if isinstance(d, dict) and "en" in d else d

idx = []
def add(t,k,u,x): idx.append({"t":t,"k":k,"u":u,"x":strip(x)[:400]})
BOOK_T = {"genesis":"Genesis","john":"John","matthew":"Matthew"}
CH = {"genesis":12,"john":3,"matthew":3}

# 1) reading per chapter
for book,c in CH.items():
    for n in range(1,c+1):
        d = en(load(f"reading-{book}-{n}.js"))
        if d and d.get("paras"): add(f"{BOOK_T[book]} {n}", "Reading", f"{book}/chapter-{n}.html", " ".join(d["paras"]))

# 2) deeper entries + scenario subs
for fn in sorted(DATA.glob("*-deeper.js")):
    mm = re.match(r"([a-z]+)-(\d+)-deeper\.js", fn.name)
    if not mm: continue
    book, n = mm.group(1), mm.group(2); d = en(load(fn.name)); url = f"{book}/chapter-{n}-deeper.html"
    for s in (d or {}).get("sections", []):
        for e in s.get("entries", []):
            add(f"{BOOK_T[book]} {n} · {e['id']} {strip(e['title'])}", "Deeper", url, e.get("body",""))
        for sc in s.get("scenarios", []):
            for u in sc.get("subs", []):
                add(f"{BOOK_T[book]} {n} · {u['id']} {strip(u['title'])}", "Deeper", url, u.get("body",""))

# 3) prophecy entries
for fn in sorted(DATA.glob("*-prophecy.js")):
    mm = re.match(r"([a-z]+)-(\d+)-prophecy\.js", fn.name)
    if not mm: continue
    book, n = mm.group(1), mm.group(2); d = en(load(fn.name))
    for e in (d or {}).get("entries", []):
        body = " ".join(v.get("value","") for v in (e.get("fields") or {}).values()) + " " + " ".join(r.get("reading","") for r in e.get("readings",[]))
        add(f"{BOOK_T[book]} {n} · {strip(e['title'])}", "Prophecy", f"{book}/chapter-{n}-deeper.html", body)

# 4) notes — one entry per chapter (the verse commentary, which is unique vs reading)
for fn in sorted(DATA.glob("notes-*.js")):
    mm = re.match(r"notes-([a-z]+)-(\d+)\.js", fn.name)
    if not mm: continue
    book, n = mm.group(1), mm.group(2); d = en(load(fn.name))
    body = " ".join((strip(nt.get("title",""))+" "+nt.get("body","")) for v in (d or {}).get("verses",[]) for nt in v.get("notes",[]))
    if body.strip(): add(f"{BOOK_T[book]} {n} · Notes", "Notes", f"{book}/chapter-{n}-notes.html", body)

# 5) people
for book in CH:
    d = en(load(f"{book}-people.js"))
    for p in (d or {}).get("people", []):
        txt = " ".join(f[1] for f in p.get("fields",[])) + " " + p.get("note","")
        nm = p["name"] + (f" ({p['familiar']})" if p.get("familiar") and p["familiar"]!=p["name"] else "")
        add(f"{nm} — {BOOK_T[book]}", "People", f"{book}/people.html", txt)

# 6) introduction + background (all books, from per-locale data)
for book in CH:
    intro = en(load(f"{book}-intro.js"))
    for s in (intro or {}).get("sections", []):
        for e in s.get("entries", []):
            add(f"{BOOK_T[book]} intro · {strip(e['title'])}", "Introduction", f"{book}/introduction.html", e.get("body",""))
    bg = en(load(f"{book}-background.js"))
    for mfo in (bg or {}).get("motifs", []):
        add(f"{BOOK_T[book]} · {strip(mfo['title'])}", "Background", f"{book}/background.html", mfo.get("body",""))

# 7) rules (29)
RULES=[["Controlled Lexical Consistency","Same source word → same translation, by default."],["Preserve Ambiguity","If source text supports two meanings, preserve both."],["Avoid Imported Theology","Don’t sneak in later concepts not in the source text."],["Transliteration Threshold","Transliterate when translation would impose a single reading."],["Locked Glossary","Core terms locked across the project."],["Source-Text Priority","When traditions conflict, source text governs."],["Locked Formulas","Repeated phrases rendered identically each time."],["Verb System Fidelity","Preserve tense, aspect, and voice from source."],["Converting Vav / Greek Aspect","Handle source-language verbal systems transparently."],["Register Consistency","Maintain consistent linguistic register."],["Signal All Additions","Mark every word not in the source text."],["Structural Correspondence","Preserve source sentence structure where possible."],["Uncertainty Levels","Flag debated terms with confidence labels."],["Wordplay and Cross-References","Note sound patterns and textual echoes."],["Reading-Aloud Test","Translation must work when read aloud."],["Cross-Language Alignment","All 4 target languages render the same source consistently."],["Parallel Passage Consistency","Same source passage → same rendering across books."],["Number Fidelity","Reproduce source numbers without modernizing."],["Priority Resolution","When rules conflict, explicit priority order applies."],["Poetic Structure","Preserve parallelism and poetic form."],["No Smuggled Commentary","Commentary belongs in notes, not in translation."],["Text-Critical Restraint","Translate base text; note variants, don’t adopt silently."],["Genre Sensitivity","Respect the genre of each passage."],["Edition Identity","Transparent vs Reader edition, declared explicitly."],["Divine Name Policy","Tetragrammaton rendered per declared policy."],["Variant Apparatus","Significant variants noted in companion material."],["Formatting Standards","Consistent typographic conventions."],["Review and Sign-off","No verse ships without documented review."],["Contextual Enrichment","Companion material in separate files, labelled by type and confidence."]]
for i,r in enumerate(RULES): add(f"Rule {i+1} · {r[0]}", "Rules", "rules.html", r[1])

# 8) key pages
add("The Transparent Translation — home","Page","index.html","A translation with nothing hidden. The source texts shown honestly.")
add("Start here — reading plan","Page","start.html","New to these texts? The gentlest way in — a path that starts with the heart and ends at the beginning.")
add("Books — Genesis, John, Matthew","Page","books.html","Genesis 1–12, John 1–3, Matthew 1–3 in four languages.")

(DATA/"search-index.js").write_text("window.SEARCH_INDEX = "+json.dumps(idx, ensure_ascii=False)+";\n", encoding="utf-8")
c = Counter(e["k"] for e in idx)
print(f"search-index.js: {len(idx)} entries :: " + ", ".join(f"{k}={v}" for k,v in sorted(c.items())))
