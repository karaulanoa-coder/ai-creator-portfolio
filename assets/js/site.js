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
