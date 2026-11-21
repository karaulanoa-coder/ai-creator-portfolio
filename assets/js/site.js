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
// Закрывает мобильное меню после перехода по якорю
(function(){
  var t = document.getElementById('nav-toggle');
  if(!t) return;
  document.querySelectorAll('.nav a').forEach(function(a){ a.addEventListener('click', function(){ t.checked = false; }); });
})();
