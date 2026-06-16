/* Renders window.BG_DATA into a book-level Background page.
   Locale-aware: picks BG_DATA[locale] (EN fallback) and re-renders on `tt:locale`. */
(function(){
  const LOC = () => window.TT_LOCALE || localStorage.getItem('tt-locale') || 'en';
  const T = (k,fb) => (window.ttT && window.ttT(k)) || fb;
  const pick = () => { const D=window.BG_DATA; return D && (D[LOC()]||D.en); };
  const cap = s => s ? s.charAt(0)+s.slice(1).toLowerCase() : s;
  const cc = o => o.confClass ? 'conf-'+o.confClass : 'conf-'+(o.confidence||'').toLowerCase().replace(/[^a-z]/g,'');
  function render(){
    const D = pick(); if(!D) return;
    const dis = document.getElementById('bg-disclaimer');
    if(dis && D.disclaimer) dis.textContent = D.disclaimer;
    const mc = document.getElementById('motifs'); if(!mc) return;
    mc.innerHTML = D.motifs.map(m=>{
      const ch = (m.claim && m.confidence)
        ? `<span class="chip claim">${m.claim}</span><span class="chip ${cc(m)}"><span class="dot"></span>${cap(m.confidence)}</span>`
        : (m.labelRaw?`<span class="chip claim">${m.labelRaw}</span>`:'');
      const chap = m.chapters ? `<span class="chip">${T('ui.chapters','Chapters')} ${m.chapters}</span>` : '';
      const src = m.source ? `<div class="src">${T('ui.source','Source')}: ${m.source}</div>` : '';
      return `<div class="enrich"><div class="etitle serif">${m.n} · ${m.title}</div><div class="labels">${ch}${chap}</div>${m.body}${src}</div>`;
    }).join('');
    const c = document.getElementById('motifcount'); if(c) c.textContent = D.motifs.length;
  }
  render();
  document.addEventListener('tt:locale', render);
})();
