/* Renders window.PEOPLE_DATA into a People page (cards + optional genealogy tables + sources).
   Locale-aware: picks PEOPLE_DATA[locale] (EN fallback) and re-renders on `tt:locale`. */
(function(){
  const LOC = () => window.TT_LOCALE || localStorage.getItem('tt-locale') || 'en';
  const T = (k,fb) => (window.ttT && window.ttT(k)) || fb;
  const pick = () => { const D=window.PEOPLE_DATA; return D && (D[LOC()]||D.en); };
  const WIDE = /event|arc|extra-biblical|archaeolog|places lived|mentioned in|curiosit|regions|location|generations|note|children|speech|key|ereignis|ort|erwähnt|kinder|lugar|mencion|hijos|eventos|local|filhos|menç/i;

  function render(){
    const P = pick(); if(!P) return;
    const wrap = document.getElementById('people'); if(!wrap) return;
    wrap.innerHTML = '';
    P.people.forEach(p=>{
      const d = document.createElement('details'); d.className = 'person';
      const fam = (p.familiar && p.familiar !== p.name) ? `<span class="pfam">(${p.familiar})</span>` : '';
      const suf = p.suffix ? `<span class="pfam"> — ${p.suffix}</span>` : '';
      const rows = p.fields.map(f=>{
        const wide = WIDE.test(f[0]) || (f[1] && f[1].length > 90);
        return `<div class="field${wide?' wide':''}"><span class="fl">${f[0]}</span><span class="fv">${f[1]||'—'}</span></div>`;
      }).join('');
      const note = p.note ? `<div class="field wide"><span class="fl">${T('ui.note','Note')}</span><span class="fv">${p.note}</span></div>` : '';
      d.innerHTML = `<summary class="ph"><span class="pname serif">${p.name}</span>${fam}${suf}<span class="plife mono">${p.summary||''}</span></summary><div class="pbody">${rows}${note}</div>`;
      wrap.appendChild(d);
    });
    const pc = document.getElementById('pcount'); if(pc) pc.textContent = P.people.length + ' ' + T('ui.figures','figures');

    const gc = document.getElementById('genealogies');
    if(gc){
      gc.innerHTML = '';
      const gsec = gc.closest('section'); if(gsec) gsec.style.display = '';
      if(P.genealogies && P.genealogies.length){
        P.genealogies.forEach(g=>{
          const th = g.headers.map(h=>`<th>${h}</th>`).join('');
          const tr = g.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
          const div = document.createElement('div'); div.className = 'gen-table';
          div.innerHTML = `<h3 class="serif">${g.title}</h3>${g.caption?`<div class="cap">${g.caption}</div>`:''}<table class="gtable"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>${g.note?`<p class="note"><strong>${T('ui.note','Note')}.</strong> ${g.note}</p>`:''}`;
          gc.appendChild(div);
        });
      } else if(gsec){ gsec.style.display = 'none'; }
    }
    const ps = document.getElementById('psources'); if(ps) ps.innerHTML = P.sources || '';
  }
  render();
  document.addEventListener('tt:locale', render);
})();
