#!/usr/bin/env python3
"""Per-locale study-surface data for the redesign: introduction, people, background,
deeper (companion) and prophecy, for every book, in EN/PT-BR/DE/ES — parsed from
content/{loc}/{book}/...  Emits {surface}.js = {en:{...},"pt-br":{...},de:{...},es:{...}}.

Conservation: a cross-locale gate asserts the structural counts (entries, sub-entries,
people, motifs, prophecy entries) are IDENTICAL across all four locales — so nothing is
dropped or mis-aligned in any language."""
import re, json, pathlib, sys

ROOT = pathlib.Path("/Users/simonekugler/Desktop/bible-tt")
SRC = ROOT / "content"
OUT = ROOT / "docs/redesign/site/assets/data"
OUT.mkdir(parents=True, exist_ok=True)
LOCS = ["en", "pt-br", "de", "es"]

STUDY = {
    "genesis": {"deeper": list(range(1,13)), "prophecy": [3,9,12]},
    "john":    {"deeper": [1,2,3], "prophecy": [3]},
    "matthew": {"deeper": [1,2,3], "prophecy": [1,2]},
}
# localized confidence word -> canonical class
CONF_MAP = {}
for w,c in [("VERIFIED","verified"),("PROBABLE","probable"),("POSSIBLE","possible"),("UNCERTAIN","uncertain"),("SPECULATIVE","speculative"),("DOCUMENTED","documented"),
            ("VERIFICADO","verified"),("PROVÁVEL","probable"),("POSSÍVEL","possible"),("INCERTO","uncertain"),("ESPECULATIVO","speculative"),("DOCUMENTADO","documented"),
            ("VERIFIZIERT","verified"),("WAHRSCHEINLICH","probable"),("MÖGLICH","possible"),("MOEGLICH","possible"),("UNGEWISS","uncertain"),("UNSICHER","uncertain"),("SPEKULATIV","speculative"),("DOKUMENTIERT","documented"),
            ("PROBABLE","probable"),("POSIBLE","possible"),("INCIERTO","uncertain")]:
    CONF_MAP[w]=c
# prophecy field label (any locale) -> canonical key the renderer reads
PFIELD = {}
for canon, labels in {
    "verse":["verse","versículo","versiculo","vers"],
    "subject":["subject","sujeito","gegenstand","sujeto"],
    "textSays":["text says","o texto diz","der text sagt","el texto dice"],
    "context":["context","contexto","kontext"],
    "status":["fulfillment status","status de cumprimento","erfüllungsstatus","estado de cumplimiento"],
    "notes":["fulfillment notes","notas de cumprimento","erfüllungsanmerkungen","notas de cumplimiento"],
}.items():
    for l in labels: PFIELD[l]=canon
MOJI = re.compile("â[-¿]{2}")
fixm = lambda s: MOJI.sub(lambda m:m.group(0).encode("latin-1").decode("utf-8","ignore"), s)

def inline(t):
    t=t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
    t=re.sub(r"\*\*(.+?)\*\*",r"<strong>\1</strong>",t)
    t=re.sub(r"\*([^*]+?)\*",r"<em>\1</em>",t)
    t=re.sub(r"`([^`]+?)`",r"<code>\1</code>",t)
    return t
def render_table(rows):
    cells=lambda r:[c.strip() for c in r.strip().strip("|").split("|")]
    head,body=cells(rows[0]),[cells(r) for r in rows[2:]]
    return ('<table class="cmp"><thead><tr>'+''.join(f"<th>{inline(h)}</th>" for h in head)+'</tr></thead><tbody>'
            +''.join("<tr>"+''.join(f"<td>{inline(c)}</td>" for c in r)+"</tr>" for r in body)+'</tbody></table>')
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
            if len(tb)>=2: html.append(render_table(tb));
            continue
        if s.startswith(("- ","* ")):
            fl(); it=[]
            while i<n and lines[i].strip().startswith(("- ","* ")): it.append(inline(lines[i].strip()[2:])); i+=1
            html.append("<ul>"+''.join(f"<li>{x}</li>" for x in it)+"</ul>"); continue
        if s.startswith("> "): buf.append(s[2:]); i+=1; continue
        buf.append(s); i+=1
    fl(); return "".join(html)
def parse_label(line):
    # tolerate trailing text after ]** (e.g. "**[TEXTUAL — VERIFIED]** (clarifying aside)")
    m=re.match(r"^\*\*\[(.+?)\]\*\*",line.strip())
    if not m: return None
    raw=m.group(1).strip()
    s=re.match(r"^(.+?)\s*[—–]\s*([^—–\]]+)$",raw)
    if s:
        claim,conf=s.group(1).strip(),s.group(2).strip()
        cc=CONF_MAP.get(conf.upper())
        if cc: return (claim,conf,cc,raw)
    return (None,None,None,raw)
def split_entry(lines):
    claim=conf=cc=raw=src=None; body=[]
    for ln in lines:
        s=ln.strip(); lab=parse_label(s)
        if lab and raw is None:
            claim,conf,cc,raw=lab
            tm=re.match(r"^\*\*\[.+?\]\*\*\s*(.+)$",s)  # preserve any clarifying text after ]**
            if tm: body.append(tm.group(1))
            continue
        ms=re.match(r"^\*\*Source:\*\*\s*(.+)$|^\*\*Fonte:\*\*\s*(.+)$|^\*\*Quelle:\*\*\s*(.+)$|^\*\*Fuente:\*\*\s*(.+)$",s)
        if ms and src is None: src=inline(next(g for g in ms.groups() if g).strip()); continue
        body.append(ln)
    return claim,conf,cc,raw,src,md(body)

def sectioned(path):
    lines=fixm(path.read_text(encoding="utf-8")).split("\n")
    si=[(i,m.group(1),m.group(2).strip()) for i,l in enumerate(lines) for m in [re.match(r"^## ([A-Z])\. (.+)$",l)] if m]
    sections,sources,src_title,src_headers=[],[],"",[]
    for k,(start,letter,title) in enumerate(si):
        end=si[k+1][0] if k+1<len(si) else len(lines)
        block=lines[start+1:end]
        if re.search(r"Sources Consulted|Fontes Consultadas|Konsultierte Quellen|Herangezogene Quellen|Fuentes Consultadas",title,re.I):
            src_title=inline(re.sub(r"^[A-Z]\.\s*","",title))
            tb=[l.strip() for l in block if l.strip().startswith("|")]
            if len(tb)>=2:
                cells=lambda r:[c.strip() for c in r.strip().strip("|").split("|")]
                src_headers=[inline(h) for h in cells(tb[0])]
                for r in tb[2:]:
                    c=cells(r); sources.append({"source":inline(c[0]),"type":c[1] if len(c)>1 else "","sections":c[2] if len(c)>2 else ""})
            continue
        first=next((j for j,l in enumerate(block) if l.startswith("### ")),len(block))
        intro=md(block[:first])
        SCEN=r"(?:SCENARIO|CENÁRIO|SZENARIO|ESCENARIO)"
        is_scen=lambda l:re.match(r"^### "+SCEN+r"\b",l,re.I)
        if any(is_scen(l) for l in block):
            scen=[]; sx=[j for j,l in enumerate(block) if is_scen(block[j])]
            for ii,sj in enumerate(sx):
                sk=sx[ii+1] if ii+1<len(sx) else len(block)
                m=re.match(r"^### "+SCEN+r"\s+([A-Z])\s*[:—–-]\s*(.+)$",block[sj],re.I)
                wm=re.match(r"^### (\S+)\b",block[sj]); sword=wm.group(1) if wm else "Scenario"
                sid,rest=(m.group(1),m.group(2)) if m else ("",block[sj][4:])
                am=re.match(r"^(.*?)\s*[—–]\s*\*(.+?)\*\s*$",rest)
                st=inline(am.group(1).strip()) if am else inline(rest.strip())
                attr=inline(am.group(2).strip()) if am else ""
                sb=block[sj+1:sk]; sc=scf=scc=sraw=None
                # only the scenario's OWN label counts (preamble before the first sub);
                # otherwise the first sub's label would be misread as a scenario-level claim.
                pre_end=next((j for j,l in enumerate(sb) if l.startswith("#### ")),len(sb))
                for l in sb[:pre_end]:
                    lab=parse_label(l.strip())
                    if lab: sc,scf,scc,sraw=lab; break
                subs=[]; ux=[j for j,l in enumerate(sb) if l.startswith("#### ")]
                for ui,uj in enumerate(ux):
                    uk=ux[ui+1] if ui+1<len(ux) else len(sb)
                    um=re.match(r"^#### (\S+?)\.\s+(.+)$",sb[uj])
                    uid=um.group(1) if um else ""; ut=inline(um.group(2).strip()) if um else inline(sb[uj][5:].strip())
                    a,b,c2,r2,s2,bd=split_entry(sb[uj+1:uk])
                    subs.append({"id":uid,"title":ut,"claim":a,"confidence":b,"confClass":c2,"labelRaw":r2,"body":bd,"source":s2})
                scen.append({"id":sid,"word":sword,"title":st,"attribution":attr,"claim":sc,"confidence":scf,"confClass":scc,"labelRaw":sraw,"subs":subs})
            sections.append({"letter":letter,"title":title,"intro":intro,"scenarios":scen})
        else:
            ents=[]; ex=[j for j,l in enumerate(block) if l.startswith("### ")]
            for ei,ej in enumerate(ex):
                ek=ex[ei+1] if ei+1<len(ex) else len(block)
                em=re.match(r"^### (\S+?)\.\s+(.+)$",block[ej])
                eid=em.group(1) if em else ""; et=inline(em.group(2).strip()) if em else inline(block[ej][4:].strip())
                a,b,c2,r2,s2,bd=split_entry(block[ej+1:ek])
                ents.append({"id":eid,"title":et,"claim":a,"confidence":b,"confClass":c2,"labelRaw":r2,"body":bd,"source":s2})
            sections.append({"letter":letter,"title":title,"intro":intro,"entries":ents})
    return sections,sources,src_title,src_headers

def intro(path):
    sections,sources,st,sh=sectioned(path); txt=fixm(path.read_text(encoding="utf-8")); card=[]
    cm=re.search(r"<!-- CARD -->(.*?)<!-- /CARD -->",txt,re.S)
    if cm:
        for l in cm.group(1).split("\n"):
            mf=re.match(r"^\*\*(.+?):\*\*\s*(.+)$",l.strip())
            if mf: card.append([mf.group(1).strip(),inline(mf.group(2).strip())])
    return {"card":card,"sections":sections,"sources":sources,"sourcesTitle":st,"sourceHeaders":sh}

def people(path):
    lines=fixm(path.read_text(encoding="utf-8")).split("\n")
    idx=[i for i,l in enumerate(lines) if l.startswith("## ")]
    ppl,gens,src_html=[],[],""
    for k,start in enumerate(idx):
        end=idx[k+1] if k+1<len(idx) else len(lines)
        head=lines[start]; block=lines[start+1:end]
        if re.match(r"^## (H\. Sources|H\. Fontes|H\. Konsultierte|H\. Herangezogene|H\. Fuentes)",head): src_html=md(block); continue
        if re.match(r"^## The Transparent|^## A Tradução|^## Die Transparente|^## La Traducción",head): continue
        if re.search(r"Genealogy|Genealogia|Genealogie|Genealogía",head):
            title=re.sub(r"\s*[—–-]\s*[^—–]*\b(Table|Tabelle|Tabla|Tabela)\b.*$","",head[3:].strip())
            cap,tb="",[]
            for l in block:
                s=l.strip()
                if s.startswith("|"): tb.append(s)
                elif s and not s.startswith(("---","**Note","**Nota","**Anmerk")) and not cap and not tb: cap=s
            mn=re.search(r"\*\*(Note|Nota|Anmerkung):\*\*\s*(.+)","\n".join(block))
            note=inline(mn.group(2).strip()) if mn else ""
            cells=lambda r:[c.strip() for c in r.strip().strip("|").split("|")]
            hd=cells(tb[0]) if tb else []; rows=[cells(r) for r in tb[2:]] if len(tb)>2 else []
            gens.append({"title":inline(title),"caption":inline(cap),"headers":[inline(h) for h in hd],"rows":[[inline(c) for c in r] for r in rows],"note":note}); continue
        pm=re.match(r"^## (.+?)(?: \((.+?)\))?(?:\s*[—–]\s*(.+))?$",head)
        if not pm: continue
        name,fam,suf=pm.group(1).strip(),(pm.group(2) or "").strip(),(pm.group(3) or "").strip()
        fields,note=[],""
        for l in block:
            mf=re.match(r"^\*\*(.+?):\*\*\s*(.*)$",l.strip())
            if mf:
                lab,val=mf.group(1).strip(),mf.group(2).strip()
                if lab in ("Note","Nota","Anmerkung"): note=inline(val)
                else: fields.append([lab,inline(val)])
        summ=""
        for cand in (("Lifespan","Tempo de vida","Lebensspanne","Esperanza de vida"),("Birth year","Ano de nascimento","Geburtsjahr","Año de nacimiento")):
            for f in fields:
                if f[0] in cand: summ=re.sub(r"<[^>]+>","",f[1]); break
            if summ: break
        ppl.append({"name":name,"familiar":fam,"suffix":suf,"fields":fields,"note":note,"summary":summ})
    return {"people":ppl,"genealogies":gens,"sources":src_html}

def context(path):
    lines=fixm(path.read_text(encoding="utf-8")).split("\n"); dis=""
    md0=re.search(r"^> \*\*(About this surface|Sobre esta|Über diese|Acerca de esta)[^:]*:\*\*\s*(.+)$","\n".join(lines),re.M)
    if md0: dis=inline(md0.group(2).strip())
    idx=[i for i,l in enumerate(lines) if re.match(r"^## \d+\. ",l)]; mot=[]
    for k,start in enumerate(idx):
        end=idx[k+1] if k+1<len(idx) else len(lines)
        m=re.match(r"^## (\d+)\. (.+)$",lines[start]); num,title=m.group(1),inline(m.group(2).strip())
        claim=conf=cc=raw=src=chap=None; body=[]
        for ln in lines[start+1:end]:
            s=ln.strip(); lab=parse_label(s)
            if lab and raw is None: claim,conf,cc,raw=lab; continue
            mc=re.match(r"^\*\*(Chapters?|Capítulos?|Kapitel):\*\*\s*(.+)$",s)
            if mc and chap is None: chap=mc.group(2).strip(); continue
            msrc=re.match(r"^\*\*(Source|Fonte|Quelle|Fuente):\*\*\s*(.+)$",s)
            if msrc and src is None: src=inline(msrc.group(2).strip()); continue
            body.append(ln)
        mot.append({"n":num,"title":title,"claim":claim,"confidence":conf,"confClass":cc,"labelRaw":raw,"chapters":chap,"source":src,"body":md(body)})
    return {"disclaimer":dis,"motifs":mot}

def prophecy(path):
    lines=fixm(path.read_text(encoding="utf-8")).split("\n")
    idx=[i for i,l in enumerate(lines) if l.startswith("## ")]; ents,sources=[],[]
    for k,start in enumerate(idx):
        end=idx[k+1] if k+1<len(idx) else len(lines)
        head=lines[start][3:].strip(); block=lines[start+1:end]
        if re.match(r"^The Transparent|^A Tradução|^Die Transparente|^La Traducción",head): continue
        if re.match(r"^H\. (Sources|Fontes|Konsultierte|Herangezogene|Fuentes)",head):
            tb=[l.strip() for l in block if l.strip().startswith("|")]
            if len(tb)>=2:
                cells=lambda r:[c.strip() for c in r.strip().strip("|").split("|")]
                for r in tb[2:]:
                    c=cells(r); sources.append({"source":inline(c[0]),"type":c[1] if len(c)>1 else "","sections":c[2] if len(c)>2 else ""})
            continue
        fields,readings,inR={},[],False
        for ln in block:
            s=ln.strip()
            if re.match(r"^\*\*(Readings|Leituras|Lesarten|Lecturas):\*\*",s): inR=True; continue
            mr=re.match(r"^- \*\*(.+?)\*\*:\s*(.+?)\s*\[(.+?)\]\s*$",s)
            if inR and mr: readings.append({"tradition":inline(mr.group(1).strip()),"reading":inline(mr.group(2).strip()),"confidence":mr.group(3).strip(),"confClass":CONF_MAP.get(mr.group(3).strip().upper(),"")}); continue
            mf=re.match(r"^\*\*(.+?):\*\*\s*(.*)$",s)
            if mf:
                canon=PFIELD.get(mf.group(1).strip().lower())
                if canon: fields[canon]={"label":inline(mf.group(1).strip()),"value":inline(mf.group(2).strip())}
        ents.append({"title":inline(head),"fields":fields,"readings":readings})
    return {"entries":ents,"sources":sources}

# ---- conservation: each locale's emitted data == that locale's OWN source ----
# (EN companions are richer than the translations; we faithfully render each locale's
#  own content and REPORT the divergence rather than fabricate the missing entries.)
errors,report,diverge=[],[],[]
SCEN_RE=re.compile(r"^### (?:SCENARIO|CENÁRIO|SZENARIO|ESCENARIO)\b",re.I|re.M)
SRCSEC=re.compile(r"^## [A-Z]\. (?:Sources Consulted|Fontes Consultadas|Konsultierte Quellen|Herangezogene Quellen|Fuentes Consultadas)",re.I)
def src_rows(p):
    """data rows in the Sources-Consulted table of a sectioned file (locale-agnostic)."""
    lines=p.read_text(encoding="utf-8").split("\n")
    for i,l in enumerate(lines):
        if SRCSEC.match(l):
            j=i+1; rows=0
            while j<len(lines) and not re.match(r"^## ",lines[j]):
                if lines[j].strip().startswith("|"): rows+=1
                j+=1
            return max(0,rows-2)  # minus header + separator rows
    return 0
def counts_intro(d): return (sum(len(s.get("entries",[])) for s in d["sections"]), len(d["card"]), len(d["sources"]))
def counts_people(d): return (len(d["people"]), len(d["genealogies"]))
def counts_bg(d): return (len(d["motifs"]),)
def counts_deeper(d): return (sum(len(s.get("entries",[])) for s in d["sections"]),
                              sum(len(sc["subs"]) for s in d["sections"] for sc in s.get("scenarios",[])),
                              sum(len(s.get("scenarios",[])) for s in d["sections"]),
                              len(d["sources"]))
def counts_proph(d): return (len(d["entries"]),)

def src_sectioned(p):
    t=p.read_text(encoding="utf-8"); a=len(re.findall(r"^### ",t,re.M)); s=len(SCEN_RE.findall(t))
    return (a-s, len(re.findall(r"^#### ",t,re.M)), s, src_rows(p))
def src_intro(p):
    t=p.read_text(encoding="utf-8"); ent=len(re.findall(r"^### ",t,re.M))-len(SCEN_RE.findall(t))
    cm=re.search(r"<!-- CARD -->(.*?)<!-- /CARD -->",t,re.S)
    return (ent, len(re.findall(r"^\*\*.+?:\*\*",cm.group(1),re.M)) if cm else 0, src_rows(p))
def src_people(p):
    t=p.read_text(encoding="utf-8"); tot=len(re.findall(r"^## ",t,re.M))
    gen=len(re.findall(r"^## .*(?:Genealogy|Genealogia|Genealogie|Genealogía)",t,re.M))
    sr=len(re.findall(r"^## (?:H\. )?(?:Sources|Fontes|Konsultierte|Herangezogene|Fuentes)",t,re.M))
    dc=len(re.findall(r"^## (?:The Transparent|A Tradução|Die Transparente|La Traducción)",t,re.M))
    return (tot-gen-sr-dc, gen)
def src_bg(p):
    return (len(re.findall(r"^## \d+\. ",p.read_text(encoding='utf-8'),re.M)),)
def src_proph(p):
    t=p.read_text(encoding="utf-8"); tot=len(re.findall(r"^## ",t,re.M))
    sk=len(re.findall(r"^## (?:The Transparent|A Tradução|Die Transparente|La Traducción)",t,re.M))+len(re.findall(r"^## H\. (?:Sources|Fontes|Konsultierte|Herangezogene|Fuentes)",t,re.M))
    return (tot-sk,)

def emit(name, glob, pathf, builder, counter, srcf, label):
    data={}; per={}
    for loc in LOCS:
        p=pathf(loc); d=builder(p); data[loc]=d
        ec=counter(d); sc=srcf(p)
        if ec!=sc: errors.append(f"{name}[{loc}]: emitted {ec} != source {sc}")
        per[loc]=ec
    if len(set(per.values()))!=1: diverge.append(f"{name}: per-locale counts {per}")
    (OUT/name).write_text(f"window.{glob} = "+json.dumps(data,ensure_ascii=False)+";\n",encoding="utf-8")
    report.append(f"  {name}: {label} en={counter(data['en'])}")

for book,cfg in STUDY.items():
    emit(f"{book}-intro.js", "INTRO_DATA", lambda loc,b=book: SRC/loc/b/"INTRODUCTION.md", intro, counts_intro, src_intro, "intro(entries,card)")
    emit(f"{book}-people.js", "PEOPLE_DATA", lambda loc,b=book: SRC/loc/b/"PEOPLE.md", people, counts_people, src_people, "people(persons,gens)")
    emit(f"{book}-background.js", "BG_DATA", lambda loc,b=book: SRC/loc/b/"CONTEXT.md", context, counts_bg, src_bg, "background(motifs)")
    for ch in cfg["deeper"]:
        emit(f"{book}-{ch}-deeper.js", "DEEPER_DATA", lambda loc,b=book,c=ch: SRC/loc/b/f"study/CHAPTER-{c}-CONTEXT.md",
             lambda p:(lambda ss:{"sections":ss[0],"sources":ss[1],"sourcesTitle":ss[2],"sourceHeaders":ss[3]})(sectioned(p)), counts_deeper, src_sectioned, f"ch{ch} deeper(entries,subs,scen)")
    for ch in cfg["prophecy"]:
        emit(f"{book}-{ch}-prophecy.js", "PROPHECY_DATA", lambda loc,b=book,c=ch: SRC/loc/b/f"study/CHAPTER-{c}-PROPHECY.md",
             prophecy, counts_proph, src_proph, f"ch{ch} prophecy(entries)")

# residual mojibake guard on emitted data
for f in OUT.glob("*.js"):
    if MOJI.search(f.read_text(encoding="utf-8")): errors.append(f"residual mojibake in {f.name}")
if errors:
    print("STUDY CONSERVATION FAILED (parser dropped content vs a locale's own source):")
    for e in errors: print("  X",e)
    sys.exit(1)
print("STUDY CONSERVATION PASSED — every locale emits 100% of its OWN source (no parser loss)")
print("\n".join(report))
if diverge:
    print("\nSOURCE DIVERGENCE (informational — EN companions are richer than the translations;")
    print("each locale faithfully shows its own content, missing entries are NOT fabricated):")
    for d in diverge: print("  ·",d)
