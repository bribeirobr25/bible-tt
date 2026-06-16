/* ============================================================
   The Transparent Translation — shared behaviour
   ============================================================ */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- mobile menu + over-hero header ---------- */
(function(){
  const header=document.querySelector('.site-header');
  const btn=document.querySelector('.menu-btn');
  const nav=document.querySelector('.site-header nav');
  if(btn&&nav){
    btn.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',open);
      if(header) header.classList.toggle('menu-open',open);
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');if(header)header.classList.remove('menu-open');}));
  }
  if(header&&header.classList.contains('over-hero')){
    const onScroll=()=>{
      if(window.scrollY>window.innerHeight*0.7) header.classList.remove('over-hero');
      else header.classList.add('over-hero');
    };
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  }
})();

/* ---------- i18n + language switcher ---------- */
(function(){
  const sc = document.currentScript || [...document.scripts].reverse().find(s=>/tt\.js/.test(s.src||''));
  const BASE = sc && sc.src ? sc.src.replace(/tt\.js(\?.*)?$/, '') : 'assets/';
  window.TT_LOCALE = localStorage.getItem('tt-locale') || 'en';
  const lookup = (loc,key) => { const d=window.I18N; if(!d) return ''; return (d[loc]&&d[loc][key]) || (d.en&&d.en[key]) || ''; };
  window.ttT = key => lookup(window.TT_LOCALE, key);

  function applyDom(loc){
    document.documentElement.setAttribute('lang', loc==='pt-br'?'pt-BR':loc);
    if(window.I18N){
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        if(el.__en===undefined) el.__en = el.innerHTML;
        if(loc==='en'){ el.innerHTML = el.__en; }
        else { const v=lookup(loc, el.getAttribute('data-i18n')); el.textContent = v || ''; if(!v) el.innerHTML = el.__en; }
      });
      document.querySelectorAll('[data-i18n-html]').forEach(el=>{ const v=lookup(loc, el.getAttribute('data-i18n-html')); if(v) el.innerHTML=v; });
      document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ const v=lookup(loc, el.getAttribute('data-i18n-ph')); if(v) el.setAttribute('placeholder', v); });
    }
    document.querySelectorAll('.lang-switch button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.loc===loc));
    previewNote(loc);
  }
  function previewNote(loc){
    const localized = document.querySelector('[data-reading]') || document.body.hasAttribute('data-localized');
    let n = document.getElementById('tt-locale-note');
    if(loc!=='en' && !localized){
      if(!n){ n=document.createElement('div'); n.id='tt-locale-note'; n.className='locale-note';
        const h=document.querySelector('.site-header'); h.insertAdjacentElement('afterend', n); }
      n.innerHTML = (window.ttT('ui.localePreviewNote')) || 'This surface is shown in English in this preview.';
    } else if(n){ n.remove(); }
  }
  window.ttSetLocale = function(loc){
    window.TT_LOCALE = loc; try{localStorage.setItem('tt-locale', loc);}catch(e){}
    applyDom(loc); document.dispatchEvent(new CustomEvent('tt:locale',{detail:loc}));
  };
  function injectSwitch(){
    const nav = document.querySelector('.site-header nav'); if(!nav || nav.querySelector('.lang-switch')) return;
    // tag static nav links so chrome localizes site-wide (pages that didn't author data-i18n)
    nav.querySelectorAll('a').forEach(a=>{
      if(a.hasAttribute('data-i18n')) return;
      const h=a.getAttribute('href')||'', t=a.textContent.trim().toLowerCase();
      if(a.classList.contains('nav-cta')) a.setAttribute('data-i18n','nav.startReading');
      else if(/(^|\/)books\.html$/.test(h) && t!=='all books') a.setAttribute('data-i18n','nav.books');
      else if(/(^|\/)rules\.html$/.test(h)) a.setAttribute('data-i18n','nav.rules');
      else if(/(^|\/)start\.html$/.test(h)) a.setAttribute('data-i18n','nav.start');
      else if(/(^|\/)index\.html$/.test(h) && ['genesis','john','matthew'].includes(t)) a.setAttribute('data-i18n','book.'+t);
    });
    const wrap = document.createElement('div'); wrap.className='lang-switch'; wrap.setAttribute('role','group'); wrap.setAttribute('aria-label','Language');
    [['en','EN'],['pt-br','PT'],['de','DE'],['es','ES']].forEach(([loc,lab])=>{
      const b=document.createElement('button'); b.type='button'; b.dataset.loc=loc; b.textContent=lab;
      b.title=(window.I18N_LABELS&&window.I18N_LABELS[loc])||lab;
      b.addEventListener('click',()=>window.ttSetLocale(loc));
      wrap.appendChild(b);
    });
    nav.insertBefore(wrap, nav.firstChild);
    const sa=document.createElement('a'); sa.className='nav-search'; sa.href=BASE.replace(/assets\/$/,'')+'search.html';
    sa.setAttribute('data-i18n','ui.search'); sa.setAttribute('aria-label','Search'); sa.textContent='⌕ Search';
    nav.insertBefore(sa, nav.firstChild);
  }
  function init(){ injectSwitch(); applyDom(window.TT_LOCALE);
    // notify data-driven renderers (loaded before tt.js) once i18n + locale are ready
    document.dispatchEvent(new CustomEvent('tt:locale',{detail:window.TT_LOCALE})); }
  if(window.I18N) init();
  else { const s=document.createElement('script'); s.src=BASE+'i18n.js'; s.onload=init; s.onerror=init; document.head.appendChild(s); }
})();

/* ---------- scroll reveals ---------- */
(function(){
  const els=document.querySelectorAll('.reveal');
  if(!els.length) return;
  if(REDUCED||!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('in'));return;}
  document.documentElement.classList.add('tt-js'); // arm hidden state only when JS+IO will reveal
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  els.forEach(e=>io.observe(e));
})();

/* ---------- separation-field shader (Gen 1:4) ---------- */
/* attaches to <canvas id="gl"> if present and THREE is loaded.
   data-attrs on canvas: data-scroll="1" to drift with scroll. */
window.TTSeparationField = function(canvas){
  if(!window.THREE||!canvas) return;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
  const scene=new THREE.Scene();
  const cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const uni={u_time:{value:0},u_res:{value:new THREE.Vector2(1,1)},u_mouse:{value:new THREE.Vector2(.5,.5)},u_scroll:{value:0}};
  const mat=new THREE.ShaderMaterial({uniforms:uni,
    vertexShader:`void main(){gl_Position=vec4(position,1.0);}`,
    fragmentShader:`
      precision highp float;
      uniform float u_time;uniform vec2 u_res;uniform vec2 u_mouse;uniform float u_scroll;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
      float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/u_res;
        float t=u_time*0.05;
        float edge=0.5 + (u_mouse.x-0.5)*0.5 + sin(uv.y*3.0+t*2.0)*0.06 + fbm(vec2(uv.y*2.0,t))*0.12 - 0.06 + u_scroll*0.25;
        float band=0.045+fbm(vec2(uv.y*4.0,t))*0.03;
        float m=smoothstep(edge-band,edge+band,uv.x);
        vec3 dark=vec3(0.024,0.13,0.15);
        vec3 darkGlow=vec3(0.0,0.30,0.36);
        vec3 cream=vec3(0.925,0.878,0.776);
        vec3 ochre=vec3(0.79,0.54,0.23);
        float n=fbm(uv*vec2(u_res.x/u_res.y,1.0)*3.0+t);
        vec3 d=mix(dark,darkGlow,smoothstep(0.3,0.8,n)*0.6);
        vec3 l=mix(cream,ochre,smoothstep(0.55,0.85,n)*0.35);
        vec3 col=mix(d,l,m);
        float seam=smoothstep(band,0.0,abs(uv.x-edge));
        col+=vec3(0.55,0.85,0.9)*seam*0.45;
        gl_FragColor=vec4(col,1.0);
      }`});
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat));
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);
    uni.u_res.value.set(w*renderer.getPixelRatio(),h*renderer.getPixelRatio());}
  new ResizeObserver(resize).observe(canvas);resize();
  const tgt={x:.5,y:.5};
  window.addEventListener('pointermove',e=>{tgt.x=e.clientX/window.innerWidth;tgt.y=1-e.clientY/window.innerHeight;});
  if(canvas.dataset.scroll){window.addEventListener('scroll',()=>{uni.u_scroll.value=Math.min(window.scrollY/window.innerHeight,1);},{passive:true});}
  let raf;
  function loop(){raf=requestAnimationFrame(loop);uni.u_time.value+=0.016;
    uni.u_mouse.value.x+=(tgt.x-uni.u_mouse.value.x)*0.04;uni.u_mouse.value.y+=(tgt.y-uni.u_mouse.value.y)*0.04;
    renderer.render(scene,cam);}
  if(REDUCED){uni.u_time.value=4.0;renderer.render(scene,cam);}
  else{loop();document.addEventListener('visibilitychange',()=>{document.hidden?cancelAnimationFrame(raf):loop();});}
};

/* ---------- reading formatter ----------
   Turns raw continuous-reading text (literal *italics* + unicode
   superscript verse numbers) into styled markup. Run on .reading[data-raw]. */
(function(){
  const SUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
  document.querySelectorAll('.reading[data-raw]').forEach(box=>{
    box.querySelectorAll('p').forEach(p=>{
      let h=p.innerHTML;
      // verse numbers: runs of superscript glyphs -> <sup class="vn">N</sup>
      h=h.replace(/[⁰¹²³⁴-⁹]+/g,run=>{
        const n=[...run].map(c=>SUP[c]||'').join('');
        return '<sup class="vn">'+n+'</sup>';
      });
      // *italic* grammatical additions
      h=h.replace(/\*([^*]+)\*/g,'<em>$1</em>');
      // transliterated term highlight
      h=h.replace(/\braqia\b/g,'<span class="term">raqia</span>');
      p.innerHTML=h;
    });
  });
})();

/* auto-init any hero canvas */
(function(){
  const c=document.getElementById('gl');
  if(c&&window.TTSeparationField) window.TTSeparationField(c);
})();
