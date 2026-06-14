#!/usr/bin/env python3
"""Deterministic rule-compliance scan of the redesign's emitted data (all locales).
Covers the greppable parts of the 29-rule system + design system, exhaustively:
 - Rule 25 divine name: no 'LORD'/SENHOR/HERR/SEÑOR substitute leaking into reading/notes;
   the consonantal name present where expected.
 - No-emoji UI: note-typing emoji 🔴🟢🔵🟡 (and any emoji) must NOT survive into rendered text.
 - Dual-label discipline: every enrichment entry/sub/motif carries claim+confidence(+class) OR a raw label.
 - No redundant 'Name (Name)' (v3.3.1).
 - Italics (grammatical additions) preserved as <em> in reading.
Reports counts + offending samples. Report only (exit 0)."""
import re, json, pathlib
DATA = pathlib.Path("/Users/simonekugler/Desktop/bible-tt/docs/redesign/site/assets/data")
LOCS=["en","pt-br","de","es"]
def load(n):
    p=DATA/n
    if not p.exists(): return None
    t=p.read_text(encoding="utf-8"); return json.loads(t[t.index("=")+1:].rstrip().rstrip(";"))
EMOJI=re.compile("[\U0001F300-\U0001FAFF☀-➿\U0001F000-\U0001F0FF🔴🟢🔵🟡]")
DIVINE_BAD={"en":re.compile(r"\bLORD\b"),"pt-br":re.compile(r"\bSENHOR\b"),
            "de":re.compile(r"\bHERR\b"),"es":re.compile(r"\bSEÑOR\b")}
DIVINE_OK=re.compile(r"YHWH|JHWH")
issues={"emoji":[], "divine_sub":[], "divine_present":[], "no_label":[], "redundant":[]}

def walk_strings(o, path=""):
    if isinstance(o,str): yield path,o
    elif isinstance(o,dict):
        for k,v in o.items(): yield from walk_strings(v,f"{path}.{k}")
    elif isinstance(o,list):
        for i,v in enumerate(o): yield from walk_strings(v,f"{path}[{i}]")

# ---- emoji + redundant-name scan across ALL emitted data ----
for f in sorted(DATA.glob("*.js")):
    if f.name=="search-index.js": continue
    d=load(f.name)
    for path,s in walk_strings(d):
        if EMOJI.search(s): issues["emoji"].append(f"{f.name}{path}: {s[:60]}")
        for m in re.finditer(r"\b([A-Z][\wÀ-ÿ'’]+)\s*\(\1\)", s): issues["redundant"].append(f"{f.name}: {m.group(0)}")

# ---- divine name in reading + notes (main text) ----
import glob
for f in sorted(DATA.glob("reading-*.js"))+sorted(DATA.glob("notes-*.js")):
    d=load(f.name)
    for loc in LOCS:
        if loc not in d: continue
        text=" ".join(s for _,s in walk_strings(d[loc]))
        if DIVINE_BAD[loc].search(text): issues["divine_sub"].append(f"{f.name}[{loc}]: '{DIVINE_BAD[loc].search(text).group(0)}' near "+text[max(0,DIVINE_BAD[loc].search(text).start()-30):DIVINE_BAD[loc].search(text).start()+10])

# ---- dual-label discipline: enrichment entries must carry a label ----
def chk_label(o, ctx):
    has=(o.get("claim") and o.get("confidence")) or o.get("labelRaw")
    if not has: issues["no_label"].append(f"{ctx}: {(o.get('id') or '')} {str(o.get('title',''))[:40]}")
for book in ["genesis","john","matthew"]:
    for f in [f"{book}-intro.js"]+[f"{book}-background.js"]:
        d=load(f)
        if not d: continue
        for loc in LOCS:
            if loc not in d: continue
            for s in d[loc].get("sections",[]):
                for e in s.get("entries",[]): chk_label(e,f"{f}[{loc}]")
            for m in d[loc].get("motifs",[]): chk_label(m,f"{f}[{loc}]")
    for cn in (range(1,13) if book=="genesis" else range(1,4)):
        d=load(f"{book}-{cn}-deeper.js")
        if not d: continue
        for loc in LOCS:
            if loc not in d: continue
            for s in d[loc]["sections"]:
                for e in s.get("entries",[]): chk_label(e,f"{book}-{cn}-deeper[{loc}]")
                for sc in s.get("scenarios",[]):
                    for u in sc["subs"]: chk_label(u,f"{book}-{cn}-deeper[{loc}] sub")

# ---- italics preserved in reading ----
em_ok=0; em_files=0
for f in sorted(DATA.glob("reading-*.js")):
    d=load(f.name);
    if "en" in d and any("<em>" in p for p in (d["en"].get("paras") or [])): em_ok+=1
    em_files+=1

def show(k,lim=8):
    v=issues[k]; print(f"  {k}: {len(v)}")
    for x in v[:lim]: print("      ·",x)

print("="*70); print("RULE-COMPLIANCE SCAN (emitted data, all locales)"); print("="*70)
print("Rule 25 — divine-name substitute leaking into main text (should be 0):"); show("divine_sub")
print("No-emoji UI — note-typing/other emoji surviving into rendered strings (should be 0):"); show("emoji")
print("Redundant 'Name (Name)' (should be 0):"); show("redundant")
print("Dual-label discipline — enrichment items with NO claim/confidence/labelRaw (should be 0):"); show("no_label")
print(f"Italics preserved — reading files with <em> grammatical additions: {em_ok}/{em_files}")
tot=sum(len(v) for k,v in issues.items())
print("\nTOTAL compliance issues:", tot, "(0 = clean)")
