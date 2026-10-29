// HERO DRAFT: soft parallax for hero image (skipped for reduced motion)
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var img=document.querySelector('.hero-art img'),hero=document.querySelector('.hero');if(!img||!hero)return;
  var t=false;function u(){var y=Math.min(scrollY,hero.offsetHeight);img.style.setProperty('--hp',(y*0.25)+'px');t=false}
  addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(u)}},{passive:true});
})();
