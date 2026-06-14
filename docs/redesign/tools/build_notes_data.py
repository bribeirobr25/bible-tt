#!/usr/bin/env python3
"""Per-locale NOTES-door data for the redesign: verse-by-verse cards (emoji-typed notes),
glossary, and supplementary analysis sections — for every chapter, in EN/PT-BR/DE/ES.
Parsed from content/{loc}/{book}/CHAPTER-N.md. Emits notes-{book}-{n}.js = {en,...}.

Conservation: per-locale verse count == that locale's own source verse-header count, AND
verse counts are identical across all four locales (scripture is fixed). Note / glossary /
supplementary divergences (translations less complete than EN) are reported, not fabricated."""
import re, json, pathlib, sys

ROOT = pathlib.Path("/Users/simonekugler/Desktop/bible-tt")
SRC = ROOT / "content"
OUT = ROOT / "docs/redesign/site/assets/data"
LOCS = ["en", "pt-br", "de", "es"]
CHAPTERS = {"genesis": range(1,13), "john": range(1,4), "matthew": range(1,4)}

VERSE = re.compile(r"^### \*\*(?:Verse|Versículo|Versiculo|Vers)\s+(.+?)\*\*\s*$", re.I)
GLOSS = re.compile(r"^## (GLOSSARY|GLOSSÁRIO|GLOSARIO|GLOSSAR)\b", re.I)
SECT  = re.compile(r"^## (.+)$")
EMOJI = {"🔴":"critical","🟢":"lexical","🔵":"grammatical","🟡":"theological"}
EMOJI_RE = re.compile(r"^([🔴🟢🔵🟡])\s*(.*)$")

def inline(t):
    t=t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
    t=re.sub(r"\*\*(.+?)\*\*",r"<strong>\1</strong>",t)
    t=re.sub(r"\*([^*]+?)\*",r"<em>\1</em>",t)
    t=re.sub(r"`([^`]+?)`",r"<code>\1</code>",t)
    return t
def cells(r): return [c.strip() for c in r.strip().strip("|").split("|")]
def md(lines):
    html,buf,i,n=[],[],0,len(lines)
    def fl():
        if buf: html.append("<p>"+inline(" ".join(buf).strip())+"</p>"); buf.clear()
    while i<n:
        s=lines[i].strip()
        if s=="" or s.startswith("---"): fl(); i+=1; continue
        if s.startswith("|"):
            fl(); tb=[]
            while i<n and lines[i].strip().startswith("|"): tb.append(lines[i].strip()); i+=1
            if len(tb)>=2:
                head,body=cells(tb[0]),[cells(r) for r in tb[2:]]
                html.append('<table class="cmp"><thead><tr>'+''.join(f"<th>{inline(h)}</th>" for h in head)+'</tr></thead><tbody>'
                    +''.join("<tr>"+''.join(f"<td>{inline(c)}</td>" for c in r)+"</tr>" for r in body)+'</tbody></table>')
            continue
        if s.startswith(("- ","* ")):
            fl(); it=[]
            while i<n and lines[i].strip().startswith(("- ","* ")): it.append(inline(lines[i].strip()[2:])); i+=1
            html.append("<ul>"+''.join(f"<li>{x}</li>" for x in it)+"</ul>"); continue
        buf.append(s); i+=1
    fl(); return "".join(html)

def parse_notes(block):
    """block = lines inside the > NOTES blockquote (with > stripped)."""
    notes=[]; cur=None
    for ln in block:
        m=EMOJI_RE.match(ln.strip())
        if m:
            if cur: notes.append(cur)
            # inline() converts **bold**/*italic* to <strong>/<em> (Rule 11) — titles carry
            # italicised lemmas (e.g. *LOGOS*) that must not render as literal asterisks.
            title=inline(m.group(2).strip())
            cur={"type":EMOJI[m.group(1)],"title":title,"body":[]}
        elif cur is not None:
            cur["body"].append(ln)
    if cur: notes.append(cur)
    for nt in notes: nt["body"]=md(nt["body"])
    return notes

def parse_chapter(path):
    lines=path.read_text(encoding="utf-8").split("\n")
    # verse region: from first verse header to the glossary (or first ## after verses)
    vidx=[i for i,l in enumerate(lines) if VERSE.match(l)]
    gidx=next((i for i,l in enumerate(lines) if GLOSS.match(l)), len(lines))
    verses=[]
    for k,vi in enumerate(vidx):
        vend=vidx[k+1] if k+1<len(vidx) else gidx
        vid=VERSE.match(lines[vi]).group(1).strip()
        body=lines[vi+1:vend]
        # text = lines before the blockquote; notes = blockquote lines (> ...)
        text_lines,note_lines,inq=[],[],False
        for l in body:
            s=l.rstrip()
            if s.strip().startswith(">"):
                inq=True; q=s.strip()[1:].lstrip()
                if not re.match(r"^\*\*📝",q) and q!="": note_lines.append(q)
                elif q=="": note_lines.append("")
            elif not inq:
                if s.strip() and not s.strip().startswith("---"): text_lines.append(s.strip())
        verses.append({"n":vid,"text":inline(" ".join(text_lines).strip()),"notes":parse_notes(note_lines)})
    # glossary table
    glossary=None
    if gidx<len(lines):
        gend=next((i for i in range(gidx+1,len(lines)) if SECT.match(lines[i])), len(lines))
        tb=[l.strip() for l in lines[gidx+1:gend] if l.strip().startswith("|")]
        if len(tb)>=2:
            glossary={"headers":[inline(h) for h in cells(tb[0])],"rows":[[inline(c) for c in cells(r)] for r in tb[2:]]}
    # supplementary: ## sections after the glossary (skip glossary itself)
    supp=[]
    sidx=[i for i,l in enumerate(lines) if SECT.match(l) and i>gidx and not GLOSS.match(l)]
    for k,si in enumerate(sidx):
        send=sidx[k+1] if k+1<len(sidx) else len(lines)
        title=SECT.match(lines[si]).group(1).strip()
        supp.append({"title":inline(title),"body":md(lines[si+1:send])})
    return {"verses":verses,"glossary":glossary,"supplementary":supp}

errors,report,diverge=[],[],[]
for book,chs in CHAPTERS.items():
    for ch in chs:
        data={}; vcounts={}
        for loc in LOCS:
            p=SRC/loc/book/f"CHAPTER-{ch}.md"
            d=parse_chapter(p); data[loc]=d
            src_v=len([l for l in p.read_text(encoding='utf-8').split("\n") if VERSE.match(l)])
            if len(d["verses"])!=src_v: errors.append(f"notes-{book}-{ch}[{loc}]: emitted {len(d['verses'])} verses != source {src_v}")
            vcounts[loc]=len(d["verses"])
        if len(set(vcounts.values()))!=1: errors.append(f"notes-{book}-{ch}: verse counts differ across locales {vcounts}")
        nn={loc:sum(len(v["notes"]) for v in data[loc]["verses"]) for loc in LOCS}
        if len(set(nn.values()))!=1: diverge.append(f"notes-{book}-{ch}: notes per locale {nn}")
        sp={loc:len(data[loc]["supplementary"]) for loc in LOCS}
        if len(set(sp.values()))!=1: diverge.append(f"notes-{book}-{ch}: supplementary per locale {sp}")
        gl={loc:(1 if data[loc]["glossary"] else 0) for loc in LOCS}
        if len(set(gl.values()))!=1: diverge.append(f"notes-{book}-{ch}: glossary present per locale {gl}")
        (OUT/f"notes-{book}-{ch}.js").write_text("window.NOTES_DATA = "+json.dumps(data,ensure_ascii=False)+";\n",encoding="utf-8")
        report.append(f"  notes-{book}-{ch}: verses={vcounts['en']} notes(en)={nn['en']} gloss={'y' if data['en']['glossary'] else '-'} supp={len(data['en']['supplementary'])}")

if errors:
    print("NOTES CONSERVATION FAILED:")
    for e in errors: print("  X",e);
    sys.exit(1)
print("NOTES CONSERVATION PASSED — verses match source & align across all four locales")
print("\n".join(report))
if diverge:
    print("\nNOTE-COUNT DIVERGENCE (informational — EN notes are richer than translations;")
    print("each locale shows its own notes, none fabricated):")
    for x in diverge: print("  ·",x)
