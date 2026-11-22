// Шейдер-фон первого экрана: «жидкий» градиент из цветов логотипа, реагирует на курсор
(function(){
  var c=document.querySelector('.hero__bg'); if(!c) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl=c.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'}); if(!gl) return;
  var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs=['precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;',
  'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
  'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=(gl_FragCoord.xy-.5*r)/r.y;',
  'vec2 mm=(m-.5)*vec2(r.x/r.y,1.);float d=length(p-mm);',
  'vec2 q=vec2(fbm(p*1.6+t*.05),fbm(p*1.6-t*.04+3.1));',
  'vec2 w=vec2(fbm(p*1.3+2.*q+vec2(1.7,9.2)+t*.06),fbm(p*1.3+2.*q+vec2(8.3,2.8)-t*.05));',
  'float f=fbm(p*1.2+2.4*w)+.25*exp(-d*3.);',
  'vec3 bg=vec3(.008,.10,.19);vec3 blue=vec3(.043,.38,.643);vec3 orng=vec3(.40,.64,.82);',
  'vec3 col=mix(bg,blue,smoothstep(.35,.85,f)*.85);col=mix(col,orng,smoothstep(.62,1.05,f+w.x*.25)*.9);',
  'col*=.55+.45*smoothstep(0.,.9,uv.x);col+=.03*h(gl_FragCoord.xy+t);',
  'gl_FragColor=vec4(col,1.);}'].join('\n');
  function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  var ur=gl.getUniformLocation(pr,'r'),ut=gl.getUniformLocation(pr,'t'),um=gl.getUniformLocation(pr,'m');
  var mx=.7,my=.6,tx=.7,ty=.6,t0=performance.now(),run=!reduce,vis=true,raf=0;
  function size(){var s=Math.min(window.devicePixelRatio||1,1.5)*.6;c.width=Math.max(1,c.clientWidth*s|0);c.height=Math.max(1,c.clientHeight*s|0);gl.viewport(0,0,c.width,c.height);}
  function frame(now){mx+=(tx-mx)*.04;my+=(ty-my)*.04;gl.uniform2f(ur,c.width,c.height);gl.uniform1f(ut,(now-t0)/1000);gl.uniform2f(um,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(run&&vis)raf=requestAnimationFrame(frame);}
  size();frame(t0+12000);
  window.addEventListener('resize',function(){size();frame(performance.now());});
  c.parentElement.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=1-(e.clientY-r.top)/r.height;});
  new IntersectionObserver(function(es){vis=es[0].isIntersecting;cancelAnimationFrame(raf);if(run&&vis)raf=requestAnimationFrame(frame);}).observe(c);
  if(run)raf=requestAnimationFrame(frame);
  window.__heroMotion=function(on){run=on&&!reduce;cancelAnimationFrame(raf);if(run&&vis)raf=requestAnimationFrame(frame);};
})();
// Кнопка «Остановить анимацию»
(function(){
  var b=document.querySelector('[data-motion-toggle]'); if(!b) return;
  b.addEventListener('click',function(){
    var p=document.documentElement.classList.toggle('paused');
    b.setAttribute('aria-pressed',p?'true':'false'); b.textContent=p?'Запустить анимацию':'Остановить анимацию';
    if(window.__heroMotion) window.__heroMotion(!p);
  });
})();
// Подсветка карточек под курсором
(function(){
  document.querySelectorAll('.glow').forEach(function(el){
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px');});
  });
})();

// Подгоняет высоту встроенных постов Telegram под содержимое
(function(){
  var frames = document.querySelectorAll('iframe[data-tg-post]');
  if(!frames.length) return;
  window.addEventListener('message', function(e){
    if(e.origin !== 'https://t.me') return;
    var data; try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch(err){ return; }
    if(!data || data.event !== 'resize' || !data.height) return;
    for(var i=0;i<frames.length;i++){
      if(frames[i].contentWindow === e.source){ frames[i].style.height = Math.ceil(data.height) + 'px'; frames[i].style.minHeight = '0'; }
    }
  });
})();
// Цели Яндекс Метрики: клики по контактам и соцсетям
(function(){
  var goals = [['t.me/olegwald','tg_order'],['t.me/wald_video','tg_channel'],['instagram.com','instagram'],['tiktok.com','tiktok']];
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]'); if(!a || typeof ym !== 'function') return;
    for(var i=0;i<goals.length;i++){ if(a.href.indexOf(goals[i][0]) !== -1){ ym(114471578,'reachGoal',goals[i][1]); break; } }
  });
})();
// Ролик в кадре на первом экране запускается по клику
(function(){
  document.querySelectorAll('[data-tg-frame]').forEach(function(f){
    var b=f.querySelector('.play'); if(!b) return;
    b.addEventListener('click', function(){
      var i=document.createElement('iframe'); i.src='https://t.me/wald_video/'+f.getAttribute('data-tg-frame')+'?embed=1';
      i.title='Ролик из Telegram-канала'; i.setAttribute('allow','autoplay; fullscreen'); f.innerHTML=''; f.style.background='#fff'; f.appendChild(i);
    });
  });
})();
// Закрывает мобильное меню после перехода по якорю
(function(){
  var t = document.getElementById('nav-toggle');
  if(!t) return;
  document.querySelectorAll('.nav a').forEach(function(a){ a.addEventListener('click', function(){ t.checked = false; }); });
})();
