// Reformed Atlas — gentle scroll-in motion on phones only (skipped for reduced motion)
(function(){
  if(!window.matchMedia||!('IntersectionObserver' in window))return;
  if(!matchMedia('(max-width:768px)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var sel='.sec .head,.ref-block,.ref-voices figure,.vid-thumb,.layer,.conf-card,.study-pair>article,.sola-panel,.scot-grid,.hymn-grid,.marks,.tl-card,.map-info,.docs,.path,.quiz,.shelves,.book-card';
  document.documentElement.classList.add('m-motion');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('m-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px',threshold:0.06});
  function scan(){var els=document.querySelectorAll(sel);for(var i=0;i<els.length;i++){var el=els[i];if(el.classList.contains('m-rv'))continue;var r=el.getBoundingClientRect();el.classList.add('m-rv');if(r.top<innerHeight&&r.bottom>0)el.classList.add('m-in');else io.observe(el);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
  addEventListener('load',scan);
})();
