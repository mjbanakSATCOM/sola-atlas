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
  var built=false,origKicker=null,origVideo=null;
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
    var mottos=['Reformation Day · Oct 31','1517 · Ninety-Five Theses','Post tenebras lux','Sola Scriptura','Sola Fide','Sola Gratia','Solus Christus','Soli Deo Gloria'];
    var cols=['#c9a24a','#f4ead2','#8fa6c9','#e8c46a','#1d2f4a'];
    var flags='';for(var i=0;i<60;i++){var x=i*40;flags+='<path d="M'+x+' 6 L'+(x+40)+' 6 L'+(x+20)+' 50 Z" fill="'+cols[i%5]+'" stroke="#14201c" stroke-opacity=".35"/>'}
    var svg='<svg viewBox="0 0 2400 56" preserveAspectRatio="xMinYMin slice" aria-hidden="true"><path d="M0 6 H2400" stroke="#c9a24a" stroke-width="3"/>'+flags+'</svg>';
    document.querySelectorAll('main section[id], body > section[id], section.sec[id], #top').forEach(function(s,idx){
      if(s.querySelector(':scope > .rd-bunting'))return;
      var d=document.createElement('div');d.className='rd-bunting';d.setAttribute('aria-hidden','true');d.innerHTML=svg;
      var r=document.createElement('div');r.className='rd-ribbon';r.setAttribute('aria-hidden','true');r.textContent='✦ '+mottos[idx%mottos.length]+' ✦';
      s.classList.add('rd-sec');s.prepend(r);s.prepend(d);
    });
  }
  function on(){
    build();document.documentElement.classList.add('refday');document.body.classList.add('refday');
    var k=document.querySelector('#top .kicker');if(k&&origKicker===null){origKicker=k.innerHTML;k.textContent='October 31 · Happy Reformation Day · 1517'}
    var v=document.querySelector('#top .hero-theses-video');
    if(v&&origVideo===null){origVideo=v.getAttribute('src');exists('./assets/refday-celebrate.mp4?v=2',function(ok){if(ok&&document.documentElement.classList.contains('refday')){v.src='./assets/refday-celebrate.mp4?v=2';v.muted=true;v.loop=true;v.play&&v.play().catch(function(){})}})}
  }
  function off(){
    document.documentElement.classList.remove('refday');document.body.classList.remove('refday');
    var k=document.querySelector('#top .kicker');if(k&&origKicker!==null){k.innerHTML=origKicker;origKicker=null}
    var v=document.querySelector('#top .hero-theses-video');if(v&&origVideo!==null){if(v.getAttribute('src')!==origVideo){v.src=origVideo;v.play&&v.play().catch(function(){})}origVideo=null}
  }
  function check(){active()?on():off()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check);else check();
  setInterval(check,60000);
})();
