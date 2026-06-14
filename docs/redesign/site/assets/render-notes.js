/* Renders window.NOTES_DATA into a Notes door (verse cards + glossary + supplementary).
   Locale-aware: picks NOTES_DATA[locale] (EN fallback) and re-renders on `tt:locale`. */
(function(){
  const LOC = () => window.TT_LOCALE || localStorage.getItem('tt-locale') || 'en';
  const T = (k,fb) => (window.ttT && window.ttT(k)) || fb;
  const pick = () => { const D=window.NOTES_DATA; return D && (D[LOC()]||D.en); };
  const TY = {critical:'Critical',lexical:'Lexical',grammatical:'Grammatical',theological:'Theological'};
  const tylab = t => T('notes.'+t, TY[t]||t);
  const term = s => (s||'').replace(/\braqia\b/g,'<span class="term">raqia</span>');

  function render(){
    const D = pick(); if(!D) return;
    const wrap = document.getElementById('verses');
    if(wrap){
      wrap.innerHTML = '';
      D.verses.forEach(v=>{
        const card = document.createElement('div'); card.className='verse'; card.id='v'+v.n;
        let h = `<div class="vhead"><span class="vnum">${v.n}</span><div class="vtext">${term(v.text)}</div><button class="copy" data-v="${v.n}">${T('ui.link','Link')}</button></div>`;
        if(v.notes && v.notes.length){
          h += '<div class="notes">';
          v.notes.forEach(n=>{ h += `<div class="note ${n.type}"><div class="nlab"><span class="dot" style="width:7px;height:7px;border-radius:50%;background:var(--note-${n.type})"></span> ${n.title||tylab(n.type)}</div><div class="ntext">${n.body}</div></div>`; });
          h += '</div>';
        }
        card.innerHTML = h; wrap.appendChild(card);
      });
    }
    const g = D.glossary;
    const ghead = document.getElementById('gloss-head'), gbody = document.getElementById('gloss');
    const gsec = document.getElementById('gloss-section');
    if(gbody){
      if(g && g.rows && g.rows.length){
        if(gsec) gsec.style.display='';
        if(ghead) ghead.innerHTML = '<tr>' + g.headers.map(x=>`<th>${x}</th>`).join('') + '</tr>';
        gbody.innerHTML = g.rows.map(r=>'<tr>'+r.map((c,i)=>`<td class="${i===0?'heb':(i===1?'en':'gn')}">${c}</td>`).join('')+'</tr>').join('');
      } else if(gsec){ gsec.style.display='none'; }
    }
    const sc = document.getElementById('supp');
    if(sc){
      const supp = D.supplementary||[];
      const ssec = document.getElementById('supp-section');
      if(supp.length){ if(ssec) ssec.style.display='';
        sc.innerHTML = supp.map((s,i)=>`<details${i===0?' open':''}><summary><span>${s.title}</span><span class="chev">›</span></summary><div class="body">${s.body}</div></details>`).join('');
      } else if(ssec){ ssec.style.display='none'; }
    }
    // re-apply deep-link target after re-render
    if(location.hash){ const el=document.querySelector(location.hash); if(el) el.scrollIntoView(); }
  }
  render();
  document.addEventListener('tt:locale', render);

  // copy verse link (delegated; attach once)
  document.addEventListener('click', e=>{
    const b = e.target.closest('.copy'); if(!b) return;
    const url = location.origin+location.pathname+'#v'+b.dataset.v;
    if(navigator.clipboard) navigator.clipboard.writeText(url);
    history.replaceState(null,'','#v'+b.dataset.v);
    const o=b.textContent; b.textContent=T('ui.copied','Copied'); setTimeout(()=>b.textContent=o,1400);
  });
})();
