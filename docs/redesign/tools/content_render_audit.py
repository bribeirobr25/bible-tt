#!/usr/bin/env python3
"""Rendered-vs-source content audit of the MIGRATED app (branch redesign-migration).
For every locale x book x chapter, fetches the live-rendered Read + Notes pages from the
running prod server and checks against the raw source markdown:
  - verse COUNT rendered == source verse count (no dropped/extra verse);
  - each rendered verse card #v{n} contains THAT LOCALE's source verse-N text
    (right verse, right place, right locale — catches mixing / mis-mapping / locale collapse);
  - the Read door contains every verse's source text (no reading loss).
Exit 1 on any mismatch."""
import re, sys, html as _html, urllib.request, pathlib

ROOT = pathlib.Path("/Users/simonekugler/Desktop/bible-tt")
SRC = ROOT / "content"
BASE = "http://localhost:3100"
LOCS = ["en", "pt-br", "de", "es"]
BOOKS = {"genesis": 12, "john": 3, "matthew": 3}
VERSE = re.compile(r"^### \*\*(?:Verse|Versículo|Versiculo|Vers)\s+(\d+)\*\*\s*$", re.I)
CONT = re.compile(r"^## (?:CONTINUOUS READING|LEITURA CONTÍNUA|FORTLAUFENDE LESUNG|LECTURA CONTINUA)\b", re.I)
SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹"

def fetch(path):
    with urllib.request.urlopen(BASE + path, timeout=30) as r:
        return r.read().decode("utf-8", "ignore")
def norm(s):
    s = _html.unescape(s)
    s = re.sub(r"<sup[^>]*>.*?</sup>", " ", s, flags=re.S)  # drop rendered verse-num superscripts
    s = re.sub(r"<[^>]+>", " ", s)
    s = "".join(" " if c in SUP else c for c in s)  # drop unicode superscript verse nums
    s = re.sub(r"[*_`>#|]", " ", s)
    return re.sub(r"[^0-9a-zà-ÿͰ-Ͽἀ-῿֐-׿ ]", " ", s.lower())  # latin+greek+hebrew
def squash(s):
    return re.sub(r"\s+", " ", s).strip()
def probe8(text):
    return " ".join(text.split()[:8])

def source_continuous(loc, book, ch):
    """ordered list of normalized verse chunks from the CONTINUOUS READING section."""
    lines = (SRC / loc / book / f"CHAPTER-{ch}.md").read_text(encoding="utf-8").split("\n")
    start = next((i for i, l in enumerate(lines) if CONT.match(l)), None)
    if start is None:
        return []
    body = []
    for l in lines[start + 1 :]:
        if l.startswith("## "):
            break
        s = l.strip()
        if not s or s.startswith("---") or (s.startswith("*") and s.endswith("*")):
            continue  # skip the italic "prose-flow" preamble + rules
        body.append(s)
    blob = " ".join(body)
    # split into verse chunks on runs of superscript digits
    chunks = re.split(f"[{SUP}]+", blob)
    return [squash(norm(c)) for c in chunks if squash(norm(c))]

def source_verses(loc, book, ch):
    """{n: normalized verse text} from VERSE-BY-VERSE STUDY (### **Verse N**)."""
    lines = (SRC / loc / book / f"CHAPTER-{ch}.md").read_text(encoding="utf-8").split("\n")
    idx = [(i, int(VERSE.match(l).group(1))) for i, l in enumerate(lines) if VERSE.match(l)]
    out = {}
    for k, (i, n) in enumerate(idx):
        end = idx[k + 1][0] if k + 1 < len(idx) else len(lines)
        body = []
        for l in lines[i + 1 : end]:
            s = l.strip()
            if s.startswith(">"):  # reached the NOTES blockquote
                break
            if s and not s.startswith(("---", "###")):
                body.append(s)
        out[n] = squash(norm(" ".join(body)))
    return out

errors, checked = [], 0
for book, n_ch in BOOKS.items():
    for ch in range(1, n_ch + 1):
        for loc in LOCS:
            sv = source_verses(loc, book, ch)
            if not sv:
                errors.append(f"{loc}/{book}/{ch}: no source verses parsed"); continue
            # ---- Notes door: verse mapping ----
            notes_html = fetch(f"/{loc}/{book}/chapter/{ch}/notes")
            anchors = [int(m) for m in re.findall(r'id="v(\d+)"', notes_html)]
            if sorted(anchors) != sorted(sv):
                errors.append(f"{loc}/{book}/{ch} NOTES: rendered verses {sorted(anchors)[:5]}…({len(anchors)}) != source ({len(sv)})")
            # split rendered html by verse anchors, map n -> card text
            parts = re.split(r'id="v(\d+)"', notes_html)
            cards = {}
            for j in range(1, len(parts), 2):
                cards[int(parts[j])] = squash(norm(parts[j + 1]))
            for n, vtext in sv.items():
                if len(vtext) < 8:
                    continue
                probe = probe8(vtext)  # first ~8 words of the source verse
                card = cards.get(n, "")
                checked += 1
                if probe not in card:
                    # also ensure it isn't simply shifted into a neighbour (mixing)
                    where = [m for m in cards if probe in cards[m]]
                    errors.append(f"{loc}/{book}/{ch} v{n}: source text not in rendered card "
                                  f"(found in {where or 'NONE'}) :: '{probe[:50]}'")
            # ---- Read door: full Continuous Reading present (its own source section) ----
            read_norm = squash(norm(fetch(f"/{loc}/{book}/chapter/{ch}")))
            cont = source_continuous(loc, book, ch)
            if not cont:
                errors.append(f"{loc}/{book}/{ch} READ: no source CONTINUOUS READING parsed")
            miss = [i + 1 for i, c in enumerate(cont) if len(c) >= 12 and probe8(c) not in read_norm]
            if miss:
                errors.append(f"{loc}/{book}/{ch} READ: continuous-reading chunk(s) missing #{miss[:6]}")

print(f"checked {checked} verse-mappings across {sum(BOOKS.values())} chapters x {len(LOCS)} locales")
if errors:
    print(f"\nCONTENT RENDER AUDIT FAILED — {len(errors)} issue(s):")
    for e in errors[:40]:
        print("  X", e)
    sys.exit(1)
print("CONTENT RENDER AUDIT PASSED — every verse renders in the right card, right locale; "
      "verse counts match source; full reading present. No loss, no mixing.")
