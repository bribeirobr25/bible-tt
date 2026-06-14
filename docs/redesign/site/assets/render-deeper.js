/* Renders window.DEEPER_DATA (+ optional window.PROPHECY_DATA) into a Deeper page.
   Locale-aware: picks DATA[locale] (EN fallback) and re-renders on `tt:locale`. */
(function(){
  const LOC = () => window.TT_LOCALE || localStorage.getItem('tt-locale') || 'en';
  const T = (k,fb) => (window.ttT && window.ttT(k)) || fb;
  const pick = g => { const D=window[g]; return D && (D[LOC()]||D.en); };
  const cap = s => s ? s.charAt(0)+s.slice(1).toLowerCase() : s;
  const cc = o => o.confClass ? 'conf-'+o.confClass : 'conf-'+(o.confidence||'').toLowerCase().replace(/[^a-z]/g,'');
  const srcLine = x => x ? `<div class="src">${T('ui.source','Source')}: ${x}</div>` : '';
  function chips(o){
    if(o.claim && o.confidence) return `<span class="chip claim">${o.claim}</span><span class="chip ${cc(o)}"><span class="dot"></span>${cap(o.confidence)}</span>`;
    if(o.labelRaw) return `<span class="chip claim">${o.labelRaw}</span>`;
    return '';
  }
  const entry = e => `<div class="enrich"><div class="etitle serif">${e.id?e.id+' · ':''}${e.title}</div><div class="labels">${chips(e)}</div>${e.body}${srcLine(e.source)}</div>`;
  const sub = u => `<div class="sub"><div class="st"><span class="sid">${u.id}</span> ${u.title}</div><div class="labels">${chips(u)}</div>${u.body}${srcLine(u.source)}</div>`;

  function renderBg(){
    const cont = document.getElementById('bg-sections'); const D = pick('DEEPER_DATA');
    if(!cont || !D) return;
    cont.innerHTML = ''; let total = 0;
    D.sections.forEach((sec,i)=>{
      const det = document.createElement('details'); if(i===0) det.open = true;
      let h = `<summary><span>${sec.letter} · ${sec.title}</span><span class="chev">›</span></summary><div class="body">`;
      if(sec.intro) h += `<p class="secintro">${sec.intro.replace(/^<p>|<\/p>$/g,'')}</p>`;
      if(sec.scenarios){
        sec.scenarios.forEach(s=>{ total += s.subs.length;
          h += `<details class="scenario"><summary><span class="sname">${s.word||'Scenario'} ${s.id} · ${s.title}</span>`
            + (s.confidence?`<span class="sbadge">${s.claim||''} · ${cap(s.confidence)}</span>`:(s.labelRaw?`<span class="sbadge">${s.labelRaw}</span>`:''))
            + `</summary><div class="sbody">`
            + (s.attribution?`<p style="font-style:italic;color:var(--ink-mute);font-size:13px;margin-bottom:6px">${s.attribution}</p>`:'')
            + s.subs.map(sub).join('') + `</div></details>`;
        });
      } else { total += sec.entries.length; h += sec.entries.map(entry).join(''); }
      h += '</div>'; det.innerHTML = h; cont.appendChild(det);
    });
    if(D.sources && D.sources.length){
      const det = document.createElement('details');
      const hd = D.sourceHeaders && D.sourceHeaders.length===3 ? D.sourceHeaders : [T('glossary.sourceWord','Source'),'Type','Sections'];
      const rows = D.sources.map(s=>`<tr><td>${s.source}</td><td class="gn">${s.type}</td><td class="gn">${s.sections}</td></tr>`).join('');
      det.innerHTML = `<summary><span>${D.sourcesTitle||T('ui.sourcesConsulted','Sources consulted')}</span><span class="chev">›</span></summary><div class="body"><table class="cmp"><thead><tr><th>${hd[0]}</th><th>${hd[1]}</th><th>${hd[2]}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      cont.appendChild(det);
    }
    const ec = document.getElementById('entcount'); if(ec) ec.textContent = total;
  }

  function renderPr(){
    const prc = document.getElementById('pr-content'); if(!prc) return;
    const PR = pick('PROPHECY_DATA');
    if(PR && PR.entries && PR.entries.length){
      let h = PR.entries.map(p=>{
        const f = p.fields||{};  // keyed by canonical: verse/textSays/context/subject/status/notes -> {label,value}
        const row = key => f[key]?`<div class="pf"><span class="fl">${f[key].label}</span>${f[key].value}</div>`:'';
        const status = f.status?`<span class="status"><span class="dot" style="width:7px;height:7px;border-radius:50%;background:var(--ochre)"></span>${f.status.value}</span>`:'';
        const readings = (p.readings||[]).map(r=>`<div class="reading"><span class="trad">${r.tradition}</span> <span class="chip ${cc(r)}"><span class="dot"></span>${cap(r.confidence)}</span><p>${r.reading}</p></div>`).join('');
        return `<div class="prophecy"><div class="pt serif">${p.title}</div>${status}`
          + row('verse') + row('textSays') + row('context') + row('subject') + row('notes')
          + (readings?`<div style="margin-top:6px"><div class="pf"><span class="fl">${T('prophecy.readings','Traditional readings')}</span></div>${readings}</div>`:'') + `</div>`;
      }).join('');
      if(PR.sources && PR.sources.length){
        const rows = PR.sources.map(s=>`<tr><td>${s.source}</td><td class="gn">${s.type}</td><td class="gn">${s.sections}</td></tr>`).join('');
        h += `<details style="margin-top:18px"><summary><span>${T('ui.sourcesConsulted','Sources consulted')}</span><span class="chev">›</span></summary><div class="body"><table class="cmp"><thead><tr><th>${T('glossary.sourceWord','Source')}</th><th>Type</th><th>Sections</th></tr></thead><tbody>${rows}</tbody></table></div></details>`;
      }
      prc.innerHTML = h;
    } else {
      prc.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--ink-mute)"><p class="serif" style="font-size:1.4rem;color:var(--ink-soft)">${T('ui.noProphecy','No prophecy entries for this chapter.')}</p></div>`;
    }
  }

  function render(){ renderBg(); renderPr(); }
  render();
  document.addEventListener('tt:locale', render);

  // subtab switching (attach once) — hide the Prophecies tab when there is no prophecy data
  const tabs = document.querySelectorAll('.subtabs button[data-tab]');
  const prTab = [...tabs].find(b=>b.dataset.tab==='pr');
  if(prTab && !window.PROPHECY_DATA) prTab.style.display='none';
  tabs.forEach(b => b.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-selected', x===b));
    document.getElementById('bg').classList.toggle('hidden', b.dataset.tab!=='bg');
    document.getElementById('pr').classList.toggle('hidden', b.dataset.tab!=='pr');
  }));
})();
