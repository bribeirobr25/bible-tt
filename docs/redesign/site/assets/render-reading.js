/* Locale-aware continuous reading. Renders window.READING_DATA[locale] and
   re-renders on the tt:locale event. Verse numbers + italics formatted here. */
(function(){
  const D = window.READING_DATA; if(!D) return;
  const box = document.getElementById('reading');
  const ovb = document.getElementById('overview-body');
  const SUP = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
  function fmt(p){
    let h = p.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    h = h.replace(/[⁰¹²³⁴-⁹]+/g, run => '<sup class="vn">'+[...run].map(c=>SUP[c]||'').join('')+'</sup>');
    h = h.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    h = h.replace(/\braqia\b/g, '<span class="term">raqia</span>');
    return h;
  }
  const ovd = document.getElementById('overview-details');
  function render(loc){
    const d = D[loc] || D.en;
    if(box) box.innerHTML = d.paras.map(p => '<p>'+fmt(p)+'</p>').join('');
    const ov = d.overview || (D.en && D.en.overview) || '';
    if(ovb) ovb.innerHTML = ov;
    if(ovd) ovd.style.display = ov ? '' : 'none';
  }
  render(window.TT_LOCALE || 'en');
  document.addEventListener('tt:locale', e => render(e.detail));
})();
