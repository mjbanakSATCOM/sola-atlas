/* chapter progress rail + offscreen video pause */
(function(){
var ACTS=[["Europe",["top","reformation","england","scotland"]],["Doctrine",["solas","confessions","election"]],["Atlantic",["puritans","awakening"]],["Explore",["era","map","people","hymns","shelf"]],["Learn",["path"]]];
var actOf={};ACTS.forEach(function(a,i){a[1].forEach(function(id){actOf[id]=i})});
var nav=document.getElementById("site-nav");
if(nav)[].forEach.call(nav.querySelectorAll("a[href^='#']"),function(a){var i=actOf[a.getAttribute("href").slice(1)];if(i!=null)a.title="Act "+(i+1)+" · "+ACTS[i][0]});
var rail=document.createElement("nav");rail.className="act-rail";rail.setAttribute("aria-label","Acts");
rail.innerHTML=ACTS.map(function(a,i){return'<a href="#'+a[1][0]+'" data-act="'+i+'"><b>'+(i+1)+'</b><span>'+a[0]+'</span></a>'}).join("");
document.body.appendChild(rail);
var secs=Object.keys(actOf).map(function(id){return document.getElementById(id)}).filter(Boolean);
function mark(id){var i=actOf[id];
 [].forEach.call(rail.children,function(a){a.classList.toggle("on",+a.dataset.act===i)});
 if(nav)[].forEach.call(nav.querySelectorAll("a"),function(a){var on=a.getAttribute("href")==="#"+id;a.classList.toggle("on",on);if(on)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current")});}
if("IntersectionObserver" in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)mark(e.target.id)})},{rootMargin:"-45% 0px -50% 0px"});
 secs.forEach(function(s){io.observe(s)});
 var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
 var vids=document.querySelectorAll("main video[autoplay]");
 var vo=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(rm){v.pause();return}
  if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})},{rootMargin:"200px 0px"});
 [].forEach.call(vids,function(v){if(rm){v.removeAttribute("autoplay");v.pause();v.preload="none"}vo.observe(v)});
}
})();
