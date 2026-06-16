#!/usr/bin/env python3
"""Extract continuous-reading + chapter-overview for every read chapter in all 4
locales from content/{loc}/{book}/CHAPTER-{n}.md → assets/data/reading-{book}-{n}.js.
Conservation: asserts each locale is non-empty and that the verse-number count is
identical across all four languages per chapter (same verses, every language)."""
import re, json, pathlib, sys

ROOT = pathlib.Path("/Users/simonekugler/Desktop/bible-tt")
SRC = ROOT / "content"
OUT = ROOT / "docs/redesign/site/assets/data"
OUT.mkdir(parents=True, exist_ok=True)
LOCALES = ["en", "pt-br", "de", "es"]
BOOKS = {"genesis": 12, "john": 3, "matthew": 3}

R_OVER = re.compile(r"^## (CHAPTER OVERVIEW|VISÃO GERAL DO CAPÍTULO|KAPITELÜBERSICHT|VISIÓN GENERAL DEL CAPÍTULO)")
R_CONT = re.compile(r"^## (CONTINUOUS READING|LEITURA CONTÍNUA|FORTLAUFENDE LESUNG|LECTURA CONTINUA)")
R_VERSE = re.compile(r"^## (VERSE-BY-VERSE STUDY|ESTUDO VERSO A VERSO|VERS-FÜR-VERS-STUDIE|ESTUDIO VERSÍCULO POR VERSÍCULO)")
R_SUP = re.compile("[⁰¹²³⁴-⁹]+")

def inline(t):
    t = t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\*([^*]+?)\*", r"<em>\1</em>", t)
    return t

def overview_html(lines):
    out, buf = [], []
    def flush():
        if buf: out.append("<p>"+inline(" ".join(buf).strip())+"</p>"); buf.clear()
    for l in lines:
        s = l.strip()
        if s=="" or s.startswith("---") or s.startswith("*Prose"): flush(); continue
        buf.append(s)
    flush()
    return "".join(out)

def section(lines, start_re, end_re):
    s = next((i for i,l in enumerate(lines) if start_re.match(l)), None)
    if s is None: return []
    e = next((i for i in range(s+1, len(lines)) if end_re.match(lines[i])), len(lines))
    return lines[s+1:e]

def extract(loc, book, n):
    p = SRC / loc / book / f"CHAPTER-{n}.md"
    lines = p.read_text(encoding="utf-8").split("\n")
    ov = section(lines, R_OVER, R_CONT)
    cont = section(lines, R_CONT, R_VERSE)
    paras = [l.strip() for l in cont if l.strip() and not l.strip().startswith("*") and not l.strip().startswith("---")]
    verses = sum(len(R_SUP.findall(pp)) for pp in paras)
    return {"overview": overview_html(ov), "paras": paras, "_verses": verses}

errors, report = [], []
for book, count in BOOKS.items():
    for n in range(1, count+1):
        data, vcounts = {}, {}
        for loc in LOCALES:
            d = extract(loc, book, n)
            if not d["paras"]: errors.append(f"{loc} {book} {n}: empty reading")
            vcounts[loc] = d.pop("_verses")
            data[loc] = d
        if len(set(vcounts.values())) != 1:
            errors.append(f"{book} {n}: verse-count mismatch across locales {vcounts}")
        OUT.joinpath(f"reading-{book}-{n}.js").write_text(
            "window.READING_DATA = " + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")
        report.append(f"  {book} {n}: verses={vcounts['en']} (all locales match)")

if errors:
    print("READING CONSERVATION FAILED:")
    for e in errors: print("  X", e)
    sys.exit(1)
print("READING CONSERVATION PASSED — all locales present, verse counts match per chapter")
print("\n".join(report))
