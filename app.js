(function(){
"use strict";
var S=window.SOLA, $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function el(t,a,h){var e=document.createElement(t);if(a)for(var k in a){if(k==="class")e.className=a[k];else e.setAttribute(k,a[k]);}if(h!=null)e.innerHTML=h;return e;}
function src(u,l){return '<a class="src" href="'+u+'" target="_blank" rel="noopener">'+(l||"Source")+'</a>';}
function roveKeys(container,sel,activate){container.addEventListener("keydown",function(e){var items=$$(sel,container).filter(function(b){return b.offsetParent!==null});var i=items.indexOf(document.activeElement);if(i<0)return;var n=null;if(e.key==="ArrowRight"||e.key==="ArrowDown")n=(i+1)%items.length;if(e.key==="ArrowLeft"||e.key==="ArrowUp")n=(i-1+items.length)%items.length;if(n!=null){e.preventDefault();items[n].focus();activate(items[n]);}});}

/* depth */
function setDepth(d){document.body.dataset.depth=d;$$(".depth button").forEach(function(b){b.setAttribute("aria-checked",b.dataset.d===d?"true":"false")});
  if(d==="3")$$("details.layer").forEach(function(x){x.open=true});
  try{localStorage.setItem("sola-depth",d)}catch(e){} }
$$(".depth button").forEach(function(b){b.addEventListener("click",function(){setDepth(b.dataset.d)})});
try{var sd=localStorage.getItem("sola-depth");if(sd)setDepth(sd)}catch(e){}

/* solas */
var tabs=$("#sola-tabs"),panel=$("#sola-panel");
S.solas.forEach(function(s,i){var b=el("button",{role:"tab",id:"tab-"+s.key,"aria-selected":"false",tabindex:"-1"},'<span>'+s.latin+'</span><small>'+s.en+'</small>');b.addEventListener("click",function(){showSola(i)});tabs.appendChild(b);});
function showSola(i){var s=S.solas[i];$$("button",tabs).forEach(function(b,j){b.setAttribute("aria-selected",j===i);b.tabIndex=j===i?0:-1});
  panel.setAttribute("aria-labelledby","tab-"+s.key);
  panel.innerHTML='<p class="big-latin">'+s.latin+'</p><p class="lead">'+s.intro+'</p><p class="d2">'+s.study+'</p><dl class="d2 meta"><dt>Key text</dt><dd>'+s.text+'</dd><dt>Confessions</dt><dd>'+s.conf+'</dd></dl><p class="d3">'+src(s.src,"Read more")+'</p>';
  panel.classList.remove("pop");void panel.offsetWidth;panel.classList.add("pop");}
roveKeys(tabs,"button",function(b){b.click()});showSola(0);

/* confessions */
var cl=$("#conf-list"),cc=$("#conf-card");
S.confessions.forEach(function(c,i){var li=el("li");var b=el("button",{role:"tab","aria-selected":"false",tabindex:"-1"},'<time>'+c.year+'</time><span>'+c.name+'</span>');b.addEventListener("click",function(){showConf(i)});li.appendChild(b);cl.appendChild(li);});
function showConf(i){var c=S.confessions[i];$$("button",cl).forEach(function(b,j){b.setAttribute("aria-selected",j===i);b.tabIndex=j===i?0:-1});
  cc.innerHTML='<p class="kicker">'+c.year+' · '+c.place+' · '+c.tradition+'</p><h3>'+c.name+'</h3><p>'+c.about+'</p><dl class="meta"><dt>Written by</dt><dd>'+c.author+'</dd><dt>Shape</dt><dd>'+c.shape+'</dd><dt class="d2">Today</dt><dd class="d2">'+c.today+'</dd></dl>'+src(c.src,"Read the text & history");
  cc.classList.remove("pop");void cc.offsetWidth;cc.classList.add("pop");}
roveKeys(cl,"button",function(b){b.click()});showConf(0);
var chips=$("#cmp-chips"),grid=$("#cmp-grid");
S.compare.topics.forEach(function(t,i){var b=el("button",{class:"chip"+(i===1?" on":""),"aria-pressed":i===1?"true":"false"},t);b.addEventListener("click",function(){$$(".chip",chips).forEach(function(x){x.classList.remove("on");x.setAttribute("aria-pressed","false")});b.classList.add("on");b.setAttribute("aria-pressed","true");cmp(i)});chips.appendChild(b)});
function cmp(i){grid.innerHTML="";S.confessions.forEach(function(c){var v=S.compare.rows[c.id][i];var na=v.charAt(0)==="(";grid.appendChild(el("div",{class:"cmp-cell"+(na?" na":"")},'<small>'+c.name+'</small><b>'+v.replace(/[()]/g,"")+'</b>'))});}
cmp(1);

/* timeline + map */
var TL=S.timeline,range=$("#tl-range"),ticks=$("#tl-ticks"),tcard=$("#tl-card");range.max=TL.length-1;
TL.forEach(function(e,i){var b=el("button",{class:"tick","aria-label":e.y+": "+e.t,style:"left:"+(i/(TL.length-1)*100)+"%"},'<span>'+e.y+'</span>');b.addEventListener("click",function(){range.value=i;showTL(i)});ticks.appendChild(b)});
function showTL(i){var e=TL[i],p=S.places[e.place];$$(".tick",ticks).forEach(function(b,j){b.classList.toggle("on",j===i)});
  tcard.innerHTML='<p class="tl-year">'+e.y+'</p><div><h3>'+e.t+'</h3><p>'+e.d+'</p><p class="small"><button class="linkbtn" data-place="'+e.place+'">📍 '+p.n+' on the map</button> · '+src(e.src)+'</p></div>';
  highlight(e.place,false);}
range.addEventListener("input",function(){showTL(+range.value)});
tcard.addEventListener("click",function(e){var b=e.target.closest("[data-place]");if(b){highlight(b.dataset.place,true);$("#map").scrollIntoView({behavior:"smooth"});}});

var svg=$("#map-svg"),NS="http://www.w3.org/2000/svg",info=$("#map-info");
function sv(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);return e;}
// Europe: lon -8..18, lat 44..58 → 40..560 x, 30..490 y ; inset New England lon -74..-69, lat 41..44 → 600..780, 330..490
function projE(lon,lat){return[40+(lon+8)/26*520,30+(58-lat)/14*460]}
function projN(lon,lat){return[600+(lon+74)/5*180,340+(44-lat)/3*140]}
var g=sv("g",{class:"grat"});for(var lo=-5;lo<=15;lo+=5){var a=projE(lo,58),b=projE(lo,44);g.appendChild(sv("line",{x1:a[0],y1:a[1],x2:b[0],y2:b[1]}))}for(var la=45;la<=57;la+=3){var c=projE(-8,la),d=projE(18,la);g.appendChild(sv("line",{x1:c[0],y1:c[1],x2:d[0],y2:d[1]}))}svg.appendChild(g);
// rough land silhouettes (schematic)
function poly(pts,pr,cls){return sv("path",{class:cls||"land",d:"M"+pts.map(function(p){var q=pr(p[0],p[1]);return q[0].toFixed(1)+","+q[1].toFixed(1)}).join("L")+"Z"})}
svg.appendChild(poly([[-5.7,50],[-3,50.6],[1.4,51.1],[1.7,52.7],[0.2,53.5],[-0.5,54.5],[-1.6,55.6],[-2.1,57.1],[-1.8,57.6],[-4,57.6],[-5,58.5],[-6,57.5],[-5.6,56],[-4.9,55.1],[-3,54.6],[-3.4,53.3],[-4.6,52.8],[-4.2,51.6],[-5.7,50]],projE));
svg.appendChild(poly([[-6,52],[-6.3,54.1],[-7.7,55.2],[-8,51.5]],projE));
svg.appendChild(poly([[-1.6,44],[-1.2,46.2],[-2.5,47.3],[-4.6,48.4],[-1.4,48.7],[-1.3,49.7],[0.2,49.7],[1.6,50.9],[3.2,51.4],[4.8,52.9],[5.6,53.4],[7,53.6],[8.6,53.9],[8.9,54.9],[8.2,55.6],[8.1,56.8],[10.6,57.7],[10.6,56.2],[12,54.4],[14,54],[18,54.8],[18,44],[12.3,44.6],[13.7,45.6],[10,44],[7,43.6],[3.2,43.3],[3.1,42.4]],projE));
svg.appendChild(sv("rect",{x:590,y:322,width:200,height:180,rx:8,class:"inset"}));
svg.appendChild(poly([[-74,41],[-71.9,41.3],[-70.6,41.6],[-70,41.7],[-70.2,42.1],[-70.7,42.4],[-70.6,43.1],[-70,43.8],[-69,44],[-74,44]],projN));
var it=sv("text",{x:600,y:340,class:"inset-label"});it.textContent="NEW ENGLAND";svg.appendChild(it);
Object.keys(S.places).forEach(function(k){var p=S.places[k],xy=p.ne?projN(p.lon,p.lat):projE(p.lon,p.lat);
  var gg=sv("g",{class:"city",tabindex:"0",role:"button","data-k":k,"aria-label":p.n,transform:"translate("+xy[0].toFixed(1)+","+xy[1].toFixed(1)+")"});
  gg.appendChild(sv("circle",{r:14,class:"halo"}));gg.appendChild(sv("circle",{r:6,class:"dot"}));
  var L=p.lab||[10,-10,"start"];var tx=sv("text",{x:L[0],y:L[1],"text-anchor":L[2]});tx.textContent=p.n;gg.appendChild(tx);
  gg.addEventListener("click",function(){highlight(k,true)});gg.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();highlight(k,true)}});svg.appendChild(gg);});
function highlight(k,showInfo){$$(".city",svg).forEach(function(c){c.classList.toggle("on",c.dataset.k===k)});var p=S.places[k];
  var evs=TL.map(function(e,i){return[e,i]}).filter(function(x){return x[0].place===k});
  info.innerHTML='<p class="kicker">Place</p><h3>'+p.n+'</h3><p>'+p.note+'</p>'+(evs.length?'<p class="small">On the timeline:</p><ul class="tight">'+evs.map(function(x){return'<li><button class="linkbtn" data-tl="'+x[1]+'">'+x[0].y+' · '+x[0].t+'</button></li>'}).join("")+'</ul>':"");}
info.addEventListener("click",function(e){var b=e.target.closest("[data-tl]");if(b){range.value=b.dataset.tl;showTL(+b.dataset.tl);$("#era").scrollIntoView({behavior:"smooth"});}});
showTL(2);highlight("wittenberg",true);

/* people */
var era={wycliffe:"fore",hus:"fore",luther:"ref",zwingli:"ref",tyndale:"ref",calvin:"ref",knox:"ref",perkins:"pur",owen:"pur",bunyan:"pur",henry:"pur",edwards:"pur"};
var pg=$("#people-grid");
S.people.forEach(function(p){var c=el("div",{class:"person","data-era":era[p.id]});
  c.innerHTML='<button class="flip" aria-pressed="false" aria-label="'+p.n+', show biography"><span class="face front"><img src="./assets/people/'+p.id+'.jpg" alt="Portrait of '+p.n+'" loading="lazy"><span class="cap"><b>'+p.n+'</b><small>'+p.d+'</small></span></span><span class="face back"><small class="kicker">'+p.role+'</small><b>'+p.n+'</b><small>'+p.d+'</small><span class="bio">'+p.bio+'</span></span></button><a class="src" href="'+p.src+'" target="_blank" rel="noopener">Biography</a>';
  var f=$(".flip",c);f.addEventListener("click",function(){var on=c.classList.toggle("flipped");f.setAttribute("aria-pressed",on)});pg.appendChild(c);});
filterChips("#ppl-chips",function(f){$$(".person",pg).forEach(function(p){p.hidden=!(f==="all"||p.dataset.era===f)})});
function filterChips(sel,fn){var w=$(sel);$$(".chip",w).forEach(function(b){b.setAttribute("aria-pressed",b.classList.contains("on"));b.addEventListener("click",function(){$$(".chip",w).forEach(function(x){x.classList.remove("on");x.setAttribute("aria-pressed","false")});b.classList.add("on");b.setAttribute("aria-pressed","true");fn(b.dataset.f)})});}

/* shelf */
var shelf=$("#bookshelf"),bc=$("#book-card");
S.books.forEach(function(b,i){var s=el("button",{class:"spine",role:"listitem","data-cat":b.cat,style:"--c:"+b.c+";--h:"+b.h+"px","aria-label":b.t+" by "+b.a},'<span class="st">'+b.t+'</span><span class="sa">'+b.a.split(" ").slice(-1)[0]+'</span>');
  s.addEventListener("click",function(){$$(".spine",shelf).forEach(function(x){x.classList.toggle("out",x===s)});
    bc.innerHTML='<div class="cover" style="--c:'+b.c+'"><span>'+b.t+'</span><small>'+b.a+'</small></div><div><p class="kicker">'+b.cat+' · '+b.y+'</p><h3>'+b.t+'</h3><p class="by">'+b.a+'</p><p>'+b.about+'</p><p class="d2"><b>Where to start:</b> '+b.start+'</p>'+src(b.src,"Read / learn more")+'</div>';
    bc.classList.remove("pop");void bc.offsetWidth;bc.classList.add("pop");});shelf.appendChild(s);});
filterChips("#shelf-chips",function(f){$$(".spine",shelf).forEach(function(s){s.hidden=!(f==="all"||s.dataset.cat===f)})});
$(".spine",shelf).click();

/* paths */
var PATHS=[
 {id:"new",t:"New to the Reformed faith",d:"About 20 minutes",steps:[["#solas","Read all five solas"],["#reformation-day","Reformation Day: why 1517 matters"],["#election","Election: 'In plain words'"],["#people","Meet Luther, Calvin and Bunyan"],["#shelf","Pick up The Pilgrim's Progress"]]},
 {id:"study",t:"Church class / student",d:"Two or three sittings",steps:[["#confessions","Compare the five confessions"],["#election","Election: what the confessions teach"],["#era","Walk the timeline from 1382 to 1741"],["#puritans","The Puritans"],["#shelf","Choose one theology and one commentary"]]},
 {id:"deep",t:"Deeper study",d:"Ongoing",steps:[["#election","Election: deeper study and key texts"],["#confessions","Read Dort Head 1 and Westminster ch. 3"],["#shelf","Owen's Death of Death and Turretin"],["#map","Trace the Geneva–Edinburgh–London links"],["#quiz","Score 8/8 on the quiz"]]}];
var done={};try{done=JSON.parse(localStorage.getItem("sola-path")||"{}")}catch(e){}
var pw=$("#paths");
PATHS.forEach(function(p){var c=el("div",{class:"path"});var h='<h3>'+p.t+'</h3><p class="small">'+p.d+'</p><div class="bar"><i></i></div><ol>';
  p.steps.forEach(function(s,j){var id=p.id+j;h+='<li><label><input type="checkbox" data-id="'+id+'"'+(done[id]?" checked":"")+'> <a href="'+s[0]+'">'+s[1]+'</a></label></li>'});c.innerHTML=h+'</ol>';pw.appendChild(c);
  function upd(){var cb=$$("input",c),n=cb.filter(function(x){return x.checked}).length;$(".bar i",c).style.width=(n/cb.length*100)+"%";}
  c.addEventListener("change",function(e){done[e.target.dataset.id]=e.target.checked;try{localStorage.setItem("sola-path",JSON.stringify(done))}catch(_){}upd()});upd();});

/* quiz */
var qz=$("#quiz"),qi=0,score=0;qz.id="quiz";
function renderQ(){if(qi>=S.quiz.length){qz.innerHTML='<p class="kicker">Result</p><h3>You scored '+score+' of '+S.quiz.length+'</h3><p>'+(score===S.quiz.length?"Excellent — soli Deo gloria!":"Review the sections linked in the answers and try again.")+'</p><button class="btn" id="q-again">Try again</button>';$("#q-again").onclick=function(){qi=0;score=0;renderQ()};return;}
  var q=S.quiz[qi];qz.innerHTML='<div class="q-top"><p class="kicker">Question '+(qi+1)+' of '+S.quiz.length+'</p><div class="bar"><i style="width:'+(qi/S.quiz.length*100)+'%"></i></div></div><h3 id="q-h">'+q.q+'</h3><div class="opts" role="group" aria-labelledby="q-h">'+q.o.map(function(o,j){return'<button class="opt" data-j="'+j+'">'+o+'</button>'}).join("")+'</div><p class="fb" aria-live="polite"></p>';
  $$(".opt",qz).forEach(function(b){b.addEventListener("click",function(){var j=+b.dataset.j,ok=j===q.a;if(ok)score++;$$(".opt",qz).forEach(function(x){x.disabled=true;if(+x.dataset.j===q.a)x.classList.add("right")});if(!ok)b.classList.add("wrong");
    $(".fb",qz).innerHTML=(ok?"✓ Correct. ":"✗ Not quite. ")+q.why+' <a href="'+q.sec+'">Review</a> <button class="btn sm" id="q-next">'+(qi<S.quiz.length-1?"Next":"See result")+'</button>';$("#q-next").onclick=function(){qi++;renderQ()};$("#q-next").focus();})});}
renderQ();

/* reveal */
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.08});$$(".head,.fade-in").forEach(function(x){x.classList.add("rv");io.observe(x)});}
})();

// Election PDF preview modal
(()=>{const D={exec:{t:"Unconditional Election — Executive Summary",f:"assets/docs/election-executive-summary"},quick:{t:"Unconditional Election — Quick Hits",f:"assets/docs/election-quick-hits"}};
const m=document.getElementById('docModal');if(!m)return;const dlg=m.querySelector('.doc-dialog');let last=null;
const mobile=matchMedia('(max-width:700px)').matches;
function open(k){const d=D[k];if(!d)return;last=document.activeElement;
m.querySelector('#docModalTitle').textContent=d.t;const o=document.getElementById('docObj'),i=document.getElementById('docImg');
i.src=d.f+'-preview.jpg';i.alt='First page of '+d.t;o.data=mobile?'':d.f+'.pdf#view=FitH';
const n=o.cloneNode(true);o.replaceWith(n);
document.getElementById('docDl').href=d.f+'.pdf';document.getElementById('docOpen').href=d.f+'.pdf';
m.hidden=false;document.body.style.overflow='hidden';m.querySelector('.doc-close').focus();}
function close(){m.hidden=true;document.body.style.overflow='';const o=document.getElementById('docObj');o.data='';last&&last.focus();}
document.querySelectorAll('[data-doc]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.doc)));
m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.doc-close'))close();});
document.addEventListener('keydown',e=>{if(m.hidden)return;if(e.key==='Escape')close();
if(e.key==='Tab'){const f=[...dlg.querySelectorAll('button,a[href]')];const a=f[0],z=f[f.length-1];
if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}});})();
