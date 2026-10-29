/* Reformed Atlas – walkable 3D gallery hall for #people. Uses S.people only. */
(function(){
  var S=window.SOLA;if(!S||!S.people)return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return; // keep 2D flip-card grid
  var grid=document.getElementById("people-grid");if(!grid)return;
  var era={wycliffe:"fore",hus:"fore",luther:"ref",zwingli:"ref",tyndale:"ref",calvin:"ref",knox:"ref",perkins:"pur",owen:"pur",bunyan:"pur",henry:"pur",edwards:"pur"};
  var GAP=520,X=300,ANG=58;
  var m=document.createElement("div");m.className="museum";m.tabIndex=0;m.setAttribute("role","region");m.setAttribute("aria-label","3D gallery hall of reformers. Use left and right arrow keys to walk.");
  m.innerHTML='<div class="mu-stage"><div class="mu-world"><div class="mu-wall l"></div><div class="mu-wall r"></div><div class="mu-floor"></div><div class="mu-ceil"></div><div class="mu-end"><span>SOLI DEO GLORIA</span></div></div><div class="mu-vign"></div><div class="mu-feat" hidden><div class="mu-feat-light"></div><figure><div class="mu-frame"><img alt=""></div><figcaption class="mu-plaque"><b></b><small></small></figcaption></figure><button type="button" class="mu-feat-x" aria-label="Close featured portrait">×</button></div></div><div class="mu-hud"><button type="button" data-d="-1" aria-label="Previous exhibit">←</button><button type="button" data-d="1" aria-label="Next exhibit">→</button><span class="mu-count"></span></div><div class="mu-panel" aria-live="polite"></div>';
  var world=m.querySelector(".mu-world"),panel=m.querySelector(".mu-panel"),count=m.querySelector(".mu-count"),end=m.querySelector(".mu-end");
  var ex=S.people.map(function(p,i){
    var e=document.createElement("div");e.className="mu-ex";e.dataset.era=era[p.id];
    e.innerHTML='<div class="mu-light"></div><button type="button" aria-label="'+p.n+', '+p.d+'"><div class="mu-lamp"></div><div class="mu-frame"><img src="./assets/people/'+p.id+'.jpg" alt="Portrait of '+p.n+'" loading="lazy"></div><div class="mu-plaque"><b>'+p.n+'</b><small>'+p.d+'</small></div></button>';
    e.querySelector("button").addEventListener("click",function(ev){ev.stopPropagation();go(vis.indexOf(i));feature(e)});
    world.appendChild(e);return e;});
  var vis=[],cur=0,feat=m.querySelector(".mu-feat"),fig=feat.querySelector("figure");
  function fill(){var p=S.people[vis[cur]];var im=fig.querySelector("img");im.src="./assets/people/"+p.id+".jpg";im.alt="Portrait of "+p.n;fig.querySelector("b").textContent=p.n;fig.querySelector("small").textContent=p.d;}
  function feature(e){fill();feat.hidden=false;m.classList.add("featuring");
    var a=e.querySelector(".mu-frame").getBoundingClientRect(),b=fig.querySelector(".mu-frame").getBoundingClientRect();
    if(a.width&&b.width&&fig.animate)fig.animate([{transform:"translate("+(a.left+a.width/2-b.left-b.width/2)+"px,"+(a.top+a.height/2-b.top-b.height/2)+"px) scale("+(a.width/b.width)+")",opacity:.6},{transform:"none",opacity:1}],{duration:650,easing:"cubic-bezier(.2,.7,.2,1)"});}
  function unfeature(){feat.hidden=true;m.classList.remove("featuring");}
  feat.addEventListener("click",function(ev){if(!ev.target.closest(".mu-frame"))unfeature()});
  m.addEventListener("keydown",function(e){if(e.key==="Escape")unfeature()});
  function layout(){vis.forEach(function(idx,k){var s=k%2?1:-1;ex[idx].style.transform="translate3d("+(s*X)+"px,0,"+(-k*GAP/2-GAP*.6)+"px) rotateY("+(-s*ANG)+"deg)";});
    end.style.transform="translateZ("+(-(vis.length/2)*GAP-GAP)+"px)";}
  function go(k){if(!vis.length)return;cur=Math.max(0,Math.min(vis.length-1,k));var s=cur%2?1:-1;
    world.style.transform="translateZ("+(cur*GAP/2+GAP*.6-430)+"px) rotateY("+(-s*22)+"deg) translateX("+(-s*60)+"px)";
    ex.forEach(function(e,i){e.classList.toggle("on",i===vis[cur]);e.classList.toggle("dim",i!==vis[cur])});
    var p=S.people[vis[cur]];panel.innerHTML='<p class="kicker">'+p.role+'</p><h3>'+p.n+'</h3><p class="small" style="margin:0">'+p.d+'</p><p>'+p.bio+'</p><a href="'+p.src+'" target="_blank" rel="noopener">Biography ↗</a>';
    if(!feat.hidden)fill();
    count.textContent="Exhibit "+(cur+1)+" of "+vis.length;}
  function step(d){go(cur+d);if(feat.hidden)feature(ex[vis[cur]]);else if(fig.animate)fig.animate([{opacity:.3,transform:"translateX("+(d*40)+"px) scale(.96)"},{opacity:1,transform:"none"}],{duration:380,easing:"ease-out"});}
  function showFirst(){if(!vis.length){unfeature();return}go(0);feature(ex[vis[0]]);}
  function filter(f){vis=[];ex.forEach(function(e,i){var ok=f==="all"||e.dataset.era===f;e.hidden=!ok;if(ok)vis.push(i)});layout();
    // Safari often measures 0-size frames before paint; wait a couple frames then open
    requestAnimationFrame(function(){requestAnimationFrame(showFirst)});}
  m.querySelectorAll(".mu-hud button").forEach(function(b){b.addEventListener("click",function(){step(+b.dataset.d)})});
  m.addEventListener("keydown",function(e){if(e.key==="ArrowRight"||e.key==="ArrowUp"){step(1);e.preventDefault()}else if(e.key==="ArrowLeft"||e.key==="ArrowDown"){step(-1);e.preventDefault()}});
  var st=m.querySelector(".mu-stage"),x0=null;
  st.addEventListener("pointerdown",function(e){x0=e.clientX});
  window.addEventListener("pointerup",function(e){if(x0===null)return;var dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40){go(cur+(dx<0?1:-1));if(feat.hidden&&vis.length)feature(ex[vis[cur]]);}});
  st.addEventListener("wheel",function(e){if(Math.abs(e.deltaX)>Math.abs(e.deltaY)&&Math.abs(e.deltaX)>20){go(cur+(e.deltaX>0?1:-1));if(feat.hidden&&vis.length)feature(ex[vis[cur]]);e.preventDefault()}},{passive:false});
  document.querySelectorAll("#ppl-chips .chip").forEach(function(b){b.addEventListener("click",function(){filter(b.dataset.f)})});
  grid.hidden=true;grid.parentNode.insertBefore(m,grid);
  var h=document.querySelector("#people .head > p:not(.kicker)");if(h)h.textContent="Walk the gallery hall: drag or swipe, use the arrow keys, or click a portrait to bring it to the center. Filter by era.";
  filter("all");
  // When the hall scrolls into view (Safari / late layout), ensure first portrait is featured
  if("IntersectionObserver" in window){
    var seen=false;
    var io=new IntersectionObserver(function(es){
      if(!es[0].isIntersecting)return;
      if(feat.hidden&&vis.length)showFirst();
      if(!seen){seen=true;io.disconnect();}
    },{threshold:.2});
    io.observe(m);
  }
})();
