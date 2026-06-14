/* Renders window.INTRO_DATA into a book introduction page.
   Locale-aware: picks INTRO_DATA[locale] (EN fallback) and re-renders on `tt:locale`. */
(function(){
  const LOC = () => window.TT_LOCALE || localStorage.getItem('tt-locale') || 'en';
  const T = (k,fb) => (window.ttT && window.ttT(k)) || fb;
  const pick = () => { const D=window.INTRO_DATA; return D && (D[LOC()]||D.en); };
  const cap = s => s ? s.charAt(0)+s.slice(1).toLowerCase() : s;
  const cc = o => o.confClass ? 'conf-'+o.confClass : 'conf-'+(o.confidence||'').toLowerCase().replace(/[^a-z]/g,'');
  const srcLine = x => x ? `<div class="src">${T('ui.source','Source')}: ${x}</div>` : '';
  function chips(o){
    if(o.claim && o.confidence) return `<span class="chip claim">${o.claim}</span><span class="chip ${cc(o)}"><span class="dot"></span>${cap(o.confidence)}</span>`;
    if(o.labelRaw) return `<span class="chip claim">${o.labelRaw}</span>`;
    return '';
  }
  const entry = e => `<div class="enrich"><div class="etitle serif">${e.id?e.id+' · ':''}${e.title}</div><div class="labels">${chips(e)}</div>${e.body}${srcLine(e.source)}</div>`;

  function render(){
    const D = pick(); if(!D) return;
    const card = document.getElementById('intro-card');
    if(card){ card.innerHTML = (D.card && D.card.length) ? '<dl class="glance">' + D.card.map(c=>`<div><dt>${c[0]}</dt><dd>${c[1]}</dd></div>`).join('') + '</dl>' : ''; }
    const cont = document.getElementById('intro-sections'); if(!cont) return;
    cont.innerHTML = '';
    D.sections.forEach((sec,i)=>{
      const det = document.createElement('details'); if(i===0) det.open = true;
      let h = `<summary><span>${sec.letter} · ${sec.title}</span><span class="chev">›</span></summary><div class="body">`;
      if(sec.intro) h += `<p class="secintro">${sec.intro.replace(/^<p>|<\/p>$/g,'')}</p>`;
      h += (sec.entries||[]).map(entry).join('');
      h += '</div>'; det.innerHTML = h; cont.appendChild(det);
    });
    if(D.sources && D.sources.length){
      const det = document.createElement('details');
      const hd = D.sourceHeaders && D.sourceHeaders.length===3 ? D.sourceHeaders : [T('glossary.sourceWord','Source'),'Type','Sections'];
      const rows = D.sources.map(s=>`<tr><td>${s.source}</td><td class="gn">${s.type}</td><td class="gn">${s.sections}</td></tr>`).join('');
      det.innerHTML = `<summary><span>${D.sourcesTitle||T('ui.sourcesConsulted','Sources consulted')}</span><span class="chev">›</span></summary><div class="body"><table class="cmp"><thead><tr><th>${hd[0]}</th><th>${hd[1]}</th><th>${hd[2]}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      cont.appendChild(det);
    }
  }
  render();
  document.addEventListener('tt:locale', render);
})();
