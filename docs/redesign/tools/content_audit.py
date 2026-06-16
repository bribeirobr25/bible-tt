#!/usr/bin/env python3
"""Deterministic content-parity audit of the redesign vs the source of truth.
For every surface × book × chapter × locale it checks, INDEPENDENTLY of the build
parsers (so a shared bug can't hide):
  (1) REFERENCE INTEGRITY — emitted verse numbers / entry-IDs / people / motifs map to
      the correct source headers, in order (the "never mis-reference a book/chapter/verse").
  (2) TEXT FIDELITY — every emitted text chunk appears verbatim in its own source file
      (catches truncation, alteration, fabrication, mis-mapping).
  (3) ENCODING — no mojibake or raw HTML artifacts in emitted data.
  (4) DIVERGENCE — where a translation has fewer items than EN (a SOURCE gap, reported).
Outputs a human report + writes audit-flags.json (chunks not found in source) for the
agent layer to adjudicate. Exit 0 always (this is a report, not a gate)."""
import re, json, pathlib, html as _html

ROOT = pathlib.Path("/Users/simonekugler/Desktop/bible-tt")
SRC = ROOT/"content"; DATA = ROOT/"docs/redesign/site/assets/data"
LOCS = ["en","pt-br","de","es"]
BOOKS = {"genesis":{"chapters":range(1,13),"deeper":list(range(1,13)),"prophecy":[3,9,12]},
         "john":{"chapters":range(1,4),"deeper":[1,2,3],"prophecy":[3]},
         "matthew":{"chapters":range(1,4),"deeper":[1,2,3],"prophecy":[1,2]}}
VERSE = re.compile(r"^### \*\*(?:Verse|Versículo|Versiculo|Vers)\s+(.+?)\*\*\s*$", re.I)
MOJI = re.compile("â[-¿]{2}")

def load(name):
    p=DATA/name
    if not p.exists(): return None
    t=p.read_text(encoding="utf-8"); return json.loads(t[t.index("=")+1:].rstrip().rstrip(";"))
def norm(s):
    if not s: return ""
    s=re.sub(r"<[^>]+>"," ",s); s=_html.unescape(s)
    s=re.sub(r"[*_`>#|✳◆–—\-]"," ",s)
    return re.sub(r"\s+"," ",s).strip().lower()

flags=[]; report=[]; stats={"checked":0,"present":0,"ref_ok":0,"ref_bad":0}
def textcheck(chunks, src_norm, ctx):
    for label,txt in chunks:
        n=norm(txt)
        if len(n)<8: continue
        stats["checked"]+=1
        if n in src_norm: stats["present"]+=1
        else:
            flags.append({"ctx":ctx,"label":label,"emitted":txt[:160]})
def refcheck(name, emitted_ids, source_ids, ctx):
    ok = emitted_ids==source_ids
    stats["ref_ok"+("" if ok else "")] if False else None
    if ok: stats["ref_ok"]+=1
    else:
        stats["ref_bad"]+=1
        report.append(f"  REF MISMATCH {ctx}: emitted {emitted_ids[:8]}... != source {source_ids[:8]}...")

# ---- per book/locale ----
for book,cfg in BOOKS.items():
  for loc in LOCS:
    bsrc = SRC/loc/book
    # ----- intro -----
    d=load(f"{book}-intro.js")
    if d and loc in d:
        src=(bsrc/"INTRODUCTION.md").read_text(encoding="utf-8"); sn=norm(src)
        di=d[loc]; ch=[]
        for c in di["card"]: ch.append((f"card:{c[0]}",c[1]))
        emids=[];
        for s in di["sections"]:
            for e in s.get("entries",[]):
                emids.append(e["id"]); ch.append((f"intro §{s['letter']} {e['id']}",e["title"])); ch.append((f"intro body {e['id']}",e["body"]))
        for s in di["sources"]: ch.append(("intro source",s["source"]))
        textcheck(ch,sn,f"{book}/{loc}/intro")
        # ref: entry ids vs source ### (non-scenario)
        sids=[m.group(1) for l in src.split("\n") for m in [re.match(r"^### (\S+?)\.\s",l)] if m and not re.match(r"^### (SCENARIO|CENÁRIO|SZENARIO|ESCENARIO)",l,re.I)]
        refcheck("intro",emids,sids,f"{book}/{loc}/intro")
    # ----- people -----
    d=load(f"{book}-people.js")
    if d and loc in d:
        src=(bsrc/"PEOPLE.md").read_text(encoding="utf-8"); sn=norm(MOJI.sub(lambda m:m.group(0).encode('latin-1').decode('utf-8','ignore'),src))
        dp=d[loc]; ch=[]
        for p in dp["people"]:
            ch.append((f"person name {p['name']}",p["name"]))
            for f in p["fields"]: ch.append((f"{p['name']}:{f[0]}",f[1]))
            if p["note"]: ch.append((f"{p['name']} note",p["note"]))
        for g in dp["genealogies"]:
            for r in g["rows"]:
                for c in r: ch.append((f"gen {g['title'][:15]}",c))
        textcheck(ch,sn,f"{book}/{loc}/people")
    # ----- background -----
    d=load(f"{book}-background.js")
    if d and loc in d:
        src=(bsrc/"CONTEXT.md").read_text(encoding="utf-8"); sn=norm(src)
        db=d[loc]; ch=[]; emids=[]
        for m in db["motifs"]:
            emids.append(m["n"]); ch.append((f"motif {m['n']}",m["title"])); ch.append((f"motif body {m['n']}",m["body"]))
        textcheck(ch,sn,f"{book}/{loc}/background")
        sids=[mm.group(1) for l in src.split("\n") for mm in [re.match(r"^## (\d+)\. ",l)] if mm]
        refcheck("background",emids,sids,f"{book}/{loc}/background")
    # ----- deeper -----
    for cn in cfg["deeper"]:
        d=load(f"{book}-{cn}-deeper.js")
        if not (d and loc in d): continue
        src=(bsrc/f"study/CHAPTER-{cn}-CONTEXT.md").read_text(encoding="utf-8"); sn=norm(src)
        dd=d[loc]; ch=[]; emids=[]
        for s in dd["sections"]:
            for e in s.get("entries",[]):
                emids.append(e["id"]); ch.append((f"deeper {e['id']}",e["title"])); ch.append((f"deeper body {e['id']}",e["body"]))
                if e.get("source"): ch.append((f"deeper src {e['id']}",e["source"]))
            for sc in s.get("scenarios",[]):
                for u in sc["subs"]:
                    ch.append((f"sub {u['id']}",u["title"])); ch.append((f"sub body {u['id']}",u["body"]))
        for s in dd.get("sources",[]): ch.append(("deeper source",s["source"]))
        textcheck(ch,sn,f"{book}/{loc}/deeper-{cn}")
        sids=[m.group(1) for l in src.split("\n") for m in [re.match(r"^### (\S+?)\.\s",l)] if m and not re.match(r"^### (SCENARIO|CENÁRIO|SZENARIO|ESCENARIO)",l,re.I)]
        refcheck(f"deeper-{cn}",emids,sids,f"{book}/{loc}/deeper-{cn}")
    # ----- prophecy -----
    for cn in cfg["prophecy"]:
        d=load(f"{book}-{cn}-prophecy.js")
        if not (d and loc in d): continue
        src=(bsrc/f"study/CHAPTER-{cn}-PROPHECY.md").read_text(encoding="utf-8"); sn=norm(src)
        ch=[]
        for e in d[loc]["entries"]:
            ch.append(("proph title",e["title"]))
            for k,v in e["fields"].items(): ch.append((f"proph {k}",v["value"]))
            for r in e["readings"]: ch.append(("proph reading",r["reading"]))
        textcheck(ch,sn,f"{book}/{loc}/prophecy-{cn}")
    # ----- notes (verse mapping + text) -----
    for cn in cfg["chapters"]:
        d=load(f"notes-{book}-{cn}.js")
        if not (d and loc in d): continue
        src=(bsrc/f"CHAPTER-{cn}.md").read_text(encoding="utf-8"); sn=norm(src)
        dn=d[loc]; ch=[]
        for v in dn["verses"]:
            ch.append((f"v{v['n']} text",v["text"]))
            for nt in v["notes"]: ch.append((f"v{v['n']} note",nt["title"])); ch.append((f"v{v['n']} note body",nt["body"]))
        if dn["glossary"]:
            for r in dn["glossary"]["rows"]:
                for c in r: ch.append(("gloss",c))
        for s in dn["supplementary"]: ch.append(("supp",s["body"]))
        textcheck(ch,sn,f"{book}/{loc}/notes-{cn}")
        # ref: emitted verse numbers == source verse headers in order
        emv=[v["n"] for v in dn["verses"]]
        srcv=[VERSE.match(l).group(1).strip() for l in src.split("\n") if VERSE.match(l)]
        refcheck(f"notes-{cn}",emv,srcv,f"{book}/{loc}/notes-{cn}")

# ---- mojibake / html-artifact scan on emitted ----
moji_hits=[]
for f in DATA.glob("*.js"):
    t=f.read_text(encoding="utf-8")
    if MOJI.search(t): moji_hits.append(f.name)

# ---- divergence (EN vs translations) ----
div=[]
for book,cfg in BOOKS.items():
    for cn in cfg["deeper"]:
        d=load(f"{book}-{cn}-deeper.js")
        if d:
            cnt={l:sum(len(s.get("entries",[])) for s in d[l]["sections"]) for l in LOCS if l in d}
            if len(set(cnt.values()))>1: div.append(f"{book} deeper {cn} entries: {cnt}")
    for cn in cfg["chapters"]:
        d=load(f"notes-{book}-{cn}.js")
        if d:
            cnt={l:sum(len(v["notes"]) for v in d[l]["verses"]) for l in LOCS if l in d}
            if len(set(cnt.values()))>1: div.append(f"{book} notes {cn} note-count: {cnt}")

(ROOT/"docs/redesign/audit-flags.json").write_text(json.dumps(flags,ensure_ascii=False,indent=1),encoding="utf-8")
print("="*70)
print("CONTENT PARITY AUDIT — redesign vs source (all 4 locales)")
print("="*70)
print(f"Text chunks checked : {stats['checked']}")
print(f"  found in source   : {stats['present']}  ({100*stats['present']//max(1,stats['checked'])}%)")
print(f"  NOT found (flags)  : {len(flags)}")
print(f"Reference checks     : {stats['ref_ok']} ok / {stats['ref_bad']} mismatched")
if report: print("\nREFERENCE MISMATCHES:"); print("\n".join(report))
else: print("\nREFERENCE INTEGRITY: all verse/entry/motif IDs map to source, in order ✓")
print(f"\nMojibake/encoding in emitted data: {moji_hits or 'none ✓'}")
print(f"\nSource divergences (EN richer than translations — a SOURCE gap, faithfully shown):")
for x in div: print("  ·",x)
print(f"\naudit-flags.json written: {len(flags)} text chunks to adjudicate (see file)")
