// HERO DRAFT: soft parallax for hero image (skipped for reduced motion)
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var img=document.querySelector('.hero-art img'),hero=document.querySelector('.hero');if(!img||!hero)return;
  var t=false;function u(){var y=Math.min(scrollY,hero.offsetHeight);img.style.setProperty('--hp',(y*0.25)+'px');t=false}
  addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(u)}},{passive:true});
})();
// HERO STARS DRAFT: inject stars, sparkles, light orbs (static under reduced motion)
(function(){
  var fx=document.querySelector('.hero-fx');if(!fx)return;
  var w=document.createElement('div');w.className='hero-stars';
  var R=Math.random,h='<i class="glow g1"></i><i class="glow g2"></i><i class="shoot"></i>';
  var small=innerWidth<700,ns=small?45:90,np=small?8:16,no=small?6:12;
  function st(c,s,d){return '<i class="'+c+'" style="left:'+(R()*100).toFixed(1)+'%;top:'+(R()*100).toFixed(1)+'%;--s:'+s+'px;--d:'+d+'s;--dl:-'+(R()*d).toFixed(1)+'s'}
  for(var i=0;i<ns;i++)h+=st('st',(1+R()*2.2).toFixed(1),(2+R()*4).toFixed(1))+'"></i>';
  for(i=0;i<np;i++)h+=st('sp',(10+R()*14).toFixed(0),(3+R()*4).toFixed(1))+'"></i>';
  for(i=0;i<no;i++)h+=st('orb',(30+R()*90).toFixed(0),(10+R()*12).toFixed(1))+';--x:'+((R()-.5)*160).toFixed(0)+'px;--y:'+(-40-R()*120).toFixed(0)+'px"></i>';
  w.innerHTML=h;fx.appendChild(w);
})();
