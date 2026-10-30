/* Reformation Day temporary mode: Fri 2026-10-30 20:00 → Sun 2026-11-01 23:00 America/New_York */
(function(){
  var START='2026-10-30 20:00:00', END='2026-11-01 23:01:00';
  function nyNow(){
    var p={};new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
    return p.year+'-'+p.month+'-'+p.day+' '+p.hour+':'+p.minute+':'+p.second;
  }
  function forced(){var m=location.search.match(/[?&]refday=([01])/);return m?m[1]==='1':null}
  function active(){var f=forced();if(f!==null)return f;var n=nyNow();return n>=START&&n<END}
  function exists(url,cb){fetch(url,{method:'HEAD'}).then(function(r){cb(r.ok)}).catch(function(){cb(false)})}
  var built=false,fxTimer=null,origKicker=null,origVideo=null;
  function build(){
    if(built)return;built=true;
    var top=document.querySelector('.topbar');
    if(!sessionStorage.getItem('rdDismissed')){
      var b=document.createElement('div');b.className='rd-banner';b.setAttribute('role','region');b.setAttribute('aria-label','Reformation Day');
      b.innerHTML='<span>✦ <strong>October 31 · Reformation Day</strong> — commemorating October 31, 1517 · '+(new Date().getFullYear()-1517)+' years since the Ninety-Five Theses</span><em lang="la">Post tenebras lux · After darkness, light</em><a href="#reformation">Begin with the Reformation</a><button class="rd-x" aria-label="Dismiss">×</button>';
      b.querySelector('.rd-x').onclick=function(){sessionStorage.setItem('rdDismissed','1');b.remove()};
      if(top)top.parentNode.insertBefore(b,top);else document.body.prepend(b);
      exists('./assets/refday-banner.png?v=1',function(ok){if(ok)b.classList.add('rd-img')});
    }
    var brand=document.querySelector('.brand');
    if(brand){var g=document.createElement('span');g.className='rd-badge';g.textContent='Oct 31 · 1517';g.title='Reformation Day · October 31, 1517';brand.appendChild(g);
      exists('./assets/refday-badge-1517.png?v=1',function(ok){if(ok){var i=new Image();i.src='./assets/refday-badge-1517.png?v=1';i.alt='';g.prepend(i)}});}
    var hero=document.getElementById('top');
    if(hero){var l=document.createElement('div');l.className='rd-hero-layer';l.setAttribute('aria-hidden','true');hero.appendChild(l)}
    var h=document.querySelector('#reformation .head .kicker');
    if(h){var c=document.createElement('span');c.className='rd-chip';c.textContent='October 31 · Reformation Day';h.appendChild(c)}
    var fx=document.createElement('div');fx.className='rd-fx';fx.setAttribute('aria-hidden','true');document.body.appendChild(fx);
    exists('./assets/refday-stickers.png?v=1',function(ok){fx.dataset.stickers=ok?'1':''});
  }
  function spawn(){
    var fx=document.querySelector('.rd-fx');if(!fx||document.hidden||fx.children.length>28)return;
    var r=Math.random(),e=document.createElement('div');
    if(r<.3){e.className='rd-p rd-scrap';e.textContent='95'}
    else if(r<.65)e.className='rd-p rd-spark';
    else if(r<.95||!fx.dataset.stickers)e.className='rd-p rd-conf';
    else{e.className='rd-p rd-sticker s'+ (1+Math.floor(Math.random()*5));}
    var d=9+Math.random()*10;e.style.left=(Math.random()*100)+'vw';e.style.animationDuration=d+'s';
    if(e.className.indexOf('conf')>-1)e.style.background=['#e8c46a','#f4ead2','#c9a24a','#8fa6c9'][Math.floor(Math.random()*4)];
    fx.appendChild(e);setTimeout(function(){e.remove()},d*1000);
  }
  function on(){
    build();document.documentElement.classList.add('refday');document.body.classList.add('refday');
    var k=document.querySelector('#top .kicker');if(k&&origKicker===null){origKicker=k.innerHTML;k.textContent='October 31 · Happy Reformation Day · 1517'}
    var v=document.querySelector('#top .hero-theses-video');
    if(v&&origVideo===null){origVideo=v.getAttribute('src');exists('./assets/refday-celebrate.mp4?v=2',function(ok){if(ok&&document.documentElement.classList.contains('refday')){v.src='./assets/refday-celebrate.mp4?v=2';v.muted=true;v.loop=true;v.play&&v.play().catch(function(){})}})}
    if(!fxTimer&&!matchMedia('(prefers-reduced-motion: reduce)').matches)fxTimer=setInterval(spawn,700);
  }
  function off(){
    document.documentElement.classList.remove('refday');document.body.classList.remove('refday');
    var k=document.querySelector('#top .kicker');if(k&&origKicker!==null){k.innerHTML=origKicker;origKicker=null}
    var v=document.querySelector('#top .hero-theses-video');if(v&&origVideo!==null){if(v.getAttribute('src')!==origVideo){v.src=origVideo;v.play&&v.play().catch(function(){})}origVideo=null}
    if(fxTimer){clearInterval(fxTimer);fxTimer=null}
    var fx=document.querySelector('.rd-fx');if(fx)fx.innerHTML='';
  }
  function check(){active()?on():off()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check);else check();
  setInterval(check,60000);
})();
