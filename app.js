(function(){
"use strict";
var S=window.SOLA, $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function el(t,a,h){var e=document.createElement(t);if(a)for(var k in a){if(k==="class")e.className=a[k];else e.setAttribute(k,a[k]);}if(h!=null)e.innerHTML=h;return e;}
function src(u,l){return '<a class="src" href="'+u+'" target="_blank" rel="noopener">'+(l||"Source")+'</a>';}
function roveKeys(container,sel,activate){container.addEventListener("keydown",function(e){var items=$$(sel,container).filter(function(b){return b.offsetParent!==null});var i=items.indexOf(document.activeElement);if(i<0)return;var n=null;if(e.key==="ArrowRight"||e.key==="ArrowDown")n=(i+1)%items.length;if(e.key==="ArrowLeft"||e.key==="ArrowUp")n=(i-1+items.length)%items.length;if(n!=null){e.preventDefault();items[n].focus();activate(items[n]);}});}

/* full depth always */
$$("details.layer").forEach(function(x){x.open=true});
try{localStorage.removeItem("sola-depth")}catch(e){}

/* solas */
var tabs=$("#sola-tabs"),panel=$("#sola-panel");
S.solas.forEach(function(s,i){var b=el("button",{role:"tab",id:"tab-"+s.key,"aria-selected":"false",tabindex:"-1"},'<span>'+s.latin+'</span><small>'+s.en+'</small>');b.addEventListener("click",function(){showSola(i)});tabs.appendChild(b);});
function showSola(i){var s=S.solas[i];$$("button",tabs).forEach(function(b,j){b.setAttribute("aria-selected",j===i);b.tabIndex=j===i?0:-1});
  panel.setAttribute("aria-labelledby","tab-"+s.key);
  panel.innerHTML='<p class="big-latin">'+s.latin+'</p><p class="lead">'+s.intro+'</p><p class="d2">'+s.study+'</p><dl class="d2 meta"><dt>Key text</dt><dd>'+s.text+'</dd><dt>Confessions</dt><dd>'+s.conf+'</dd></dl>'+(s.verses?'<h4 class="sv-h">Supporting verses <small>(KJV)</small></h4><ul class="sola-verses">'+s.verses.map(function(v){return '<li><blockquote>“'+v.t+'”</blockquote><a href="'+v.u+'" target="_blank" rel="noopener">'+v.ref+'</a></li>'}).join('')+'</ul>':'')+(s.quote?'<figure class="sola-quote"><blockquote>“'+s.quote.t+'”</blockquote><figcaption>— '+s.quote.by+' · <a href="'+s.quote.u+'" target="_blank" rel="noopener">source</a></figcaption></figure>':'')+'<p class="d3">'+src(s.src,"Read more")+'</p>';
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
var defs=sv("defs",{});defs.innerHTML='<linearGradient id="mg-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0e3"/><stop offset="1" stop-color="#b9d0d6"/></linearGradient><linearGradient id="mg-land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6efdc"/><stop offset="1" stop-color="#e9dcbc"/></linearGradient><filter id="mg-sh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#3b4f55" flood-opacity=".35"/></filter><clipPath id="mg-ins"><rect x="590" y="322" width="200" height="180" rx="8"/></clipPath>';svg.appendChild(defs);
svg.appendChild(sv("rect",{x:0,y:0,width:800,height:520,fill:"url(#mg-sea)"}));
var g=sv("g",{class:"grat"});for(var lo=-10;lo<=30;lo+=5){var a=projE(lo,60),b=projE(lo,42);g.appendChild(sv("line",{x1:a[0],y1:a[1],x2:b[0],y2:b[1]}))}for(var la=44;la<=58;la+=2){var c=projE(-12,la),d=projE(32,la);g.appendChild(sv("line",{x1:c[0],y1:c[1],x2:d[0],y2:d[1]}))}svg.appendChild(g);
function drawLand(list,cls){var lg=sv("g",{class:"landg",filter:"url(#mg-sh)"});list.forEach(function(c){var p=sv("path",{class:cls,d:c[1]});var t=sv("title",{});t.textContent=c[0];p.appendChild(t);lg.appendChild(p)});return lg;}
var MD=window.MAPD||{eu:[],ne:[],lakes:[]};
svg.appendChild(drawLand(MD.eu,"land"));
var lkg=sv("g",{class:"lakes"});MD.lakes.forEach(function(d){lkg.appendChild(sv("path",{d:d}))});svg.appendChild(lkg);
function lbl(x,y,t,cls,rot){var e=sv("text",{x:x,y:y,class:cls,"text-anchor":"middle"});if(rot)e.setAttribute("transform","rotate("+rot+" "+x+" "+y+")");e.textContent=t;svg.appendChild(e);}
[[-5.2,46.9,"ATLANTIC",0],[3.6,55.6,"NORTH SEA",0],[-2.6,49.75,"English Channel",-8],[-5.2,53.7,"Irish Sea",0],[15.5,55.2,"Baltic",0]].forEach(function(s){var q=projE(s[0],s[1]);lbl(q[0],q[1],s[2],"sea-label",s[3])});
[[2.2,47.4,"FRANCE"],[10.2,51.0,"GERMAN LANDS"],[-1.6,53.0,"ENGLAND"],[-3.6,57.15,"SCOTLAND"],[-7.3,52.9,"IRELAND"],[8.9,46.45,"SWISS"],[15.6,49.4,"BOHEMIA"],[6.3,52.75,"NETHERLANDS"],[10.5,44.6,"ITALY"]].forEach(function(s){var q=projE(s[0],s[1]);lbl(q[0],q[1],s[2],"region-label")});
svg.appendChild(sv("rect",{x:584,y:316,width:212,height:192,rx:11,class:"inset-mat"}));
svg.appendChild(sv("rect",{x:590,y:322,width:200,height:180,rx:8,class:"inset"}));
var ig=sv("g",{"clip-path":"url(#mg-ins)"});ig.appendChild(drawLand(MD.ne,"land"));svg.appendChild(ig);
var it=sv("text",{x:600,y:340,class:"inset-label"});it.textContent="NEW ENGLAND";svg.appendChild(it);
var q2=projN(-70.0,41.0);lbl(q2[0],q2[1],"Atlantic","sea-label sm");
var sc=sv("text",{x:16,y:510,class:"map-credit"});sc.textContent="Modern coastlines & borders for orientation · Natural Earth";svg.appendChild(sc);
Object.keys(S.places).forEach(function(k){var p=S.places[k],xy=p.ne?projN(p.lon,p.lat):projE(p.lon,p.lat);
  var gg=sv("g",{class:"city",tabindex:"0",role:"button","data-k":k,"aria-label":p.n,transform:"translate("+xy[0].toFixed(1)+","+xy[1].toFixed(1)+")"});
  gg.appendChild(sv("circle",{r:15,class:"halo"}));gg.appendChild(sv("circle",{r:7.5,class:"ring"}));gg.appendChild(sv("circle",{r:4.5,class:"dot"}));
  var L=p.lab||[10,-10,"start"];var tx=sv("text",{x:L[0],y:L[1],"text-anchor":L[2]});tx.textContent=p.n;gg.appendChild(tx);
  gg.addEventListener("click",function(){highlight(k,true)});gg.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();highlight(k,true)}});svg.appendChild(gg);});
function highlight(k,showInfo){$$(".city",svg).forEach(function(c){c.classList.toggle("on",c.dataset.k===k)});var p=S.places[k];
  var evs=TL.map(function(e,i){return[e,i]}).filter(function(x){return x[0].place===k});
  info.innerHTML='<p class="kicker">Place</p><h3>'+p.n+'</h3><p>'+p.note+'</p>'+(p.img?'<img class="place-photo" src="'+p.img+'" alt="'+p.n+'" loading="lazy" width="1200" height="800">':'')+(evs.length?'<p class="small">On the timeline:</p><ul class="tight">'+evs.map(function(x){return'<li><button class="linkbtn" data-tl="'+x[1]+'">'+x[0].y+' · '+x[0].t+'</button></li>'}).join("")+'</ul>':"");}
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

/* tulips */
(function(){var w=document.createElement("div");w.className="shelf-tulips";w.setAttribute("aria-hidden","true");w.innerHTML='<img src="assets/shelf-tulips.png" alt="" draggable="false" loading="lazy">';window._tl=w;})();
/* shelf */
function sparkle(s){$$(".spk",s).forEach(function(x){x.remove()});for(var i=0;i<14;i++){var p=document.createElement("i");p.className="spk"+(i%4===0?" r":"");p.style.left=(10+Math.random()*80)+"%";p.style.top=(5+Math.random()*90)+"%";p.style.setProperty("--dx",(Math.random()*30-15)+"px");p.style.setProperty("--dy",(Math.random()*30-15)+"px");p.style.animationDelay=(i*55)+"ms";s.appendChild(p)}setTimeout(function(){$$(".spk",s).forEach(function(x){x.remove()})},2200)}
var shelf=$("#bookshelf"),bc=$("#book-card"),spines=[];
S.books.forEach(function(b,i){var s=el("button",{class:"spine",role:"listitem","data-cat":b.cat,style:"--c:"+b.c+";--h:"+b.h+"px","aria-label":b.t+" by "+b.a},'<span class="st">'+b.t+'</span><span class="sa">'+b.a.split(" ").slice(-1)[0]+'</span>');
  s.addEventListener("click",function(){$$(".spine",shelf).forEach(function(x){x.classList.toggle("out",x===s)});
    bc.innerHTML='<div class="cover" style="--c:'+b.c+'"><span>'+b.t+'</span><small>'+b.a+'</small></div><div><p class="kicker">'+b.cat+' · '+b.y+'</p><h3>'+b.t+'</h3><p class="by">'+b.a+'</p><p>'+b.about+'</p><p class="d2"><b>Where to start:</b> '+b.start+'</p>'+src(b.src,"Read / learn more")+'</div>';
    bc.classList.remove("pop");void bc.offsetWidth;bc.classList.add("pop");sparkle(s);if(window._shelfReady)flyBook(s,b);});spines.push(s);});
var shelfLbl={all:"Shelf",theology:"Theology",commentary:"Commentaries",puritan:"Puritan classics",devotional:"Devotional",biography:"Biography"};
function layShelves(f){window._shelfF=f;shelf.innerHTML="";var row;spines.filter(function(s){s.hidden=!(f==="all"||s.dataset.cat===f);return !s.hidden}).forEach(function(s,i){if(i%((window.matchMedia&&matchMedia("(max-width:480px)").matches)?8:16)===0){row=el("div",{class:"shelf",role:"list"});shelf.appendChild(row)}s.hidden=false;row.appendChild(s)});$$(".shelf",shelf).forEach(function(r,k){r.appendChild(el("span",{class:"shelf-plate","aria-hidden":"true"},(shelfLbl[f]||"Shelf")+" · "+["I","II","III","IV","V","VI","VII","VIII"][k]));$$(".spine",r).forEach(function(sp,j){sp.style.transitionDelay="0s,0s,0s,0s,"+(j*45+k*120)+"ms,"+(j*45+k*120)+"ms"})});if(window._sd)shelf.appendChild(window._sd);if(window._tl)shelf.appendChild(window._tl);}
layShelves("all");
filterChips("#shelf-chips",layShelves);
$(".spine",shelf).click();window._shelfReady=true;
/* shelf wow: dust + staggered entrance */
(function(){var d=el("div",{class:"shelf-dust","aria-hidden":"true"});for(var i=0;i<14;i++){var p=document.createElement("i");p.style.left=(5+i*6.7)+"%";p.style.animationDelay=(i*1.3)+"s";p.style.animationDuration=(14+i%5*2)+"s";d.appendChild(p)}window._sd=d;shelf.appendChild(d);
var mq=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;if(mq||!("IntersectionObserver" in window))return;shelf.classList.add("pre");
var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){shelf.classList.remove("pre");o.disconnect()}},{threshold:.15});o.observe(shelf);})();

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
const mobile=!!(window.matchMedia&&matchMedia('(max-width:700px)').matches);
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

(()=>{const b=document.querySelector('.menu-btn'),n=document.getElementById('site-nav');if(!b||!n)return;
const set=o=>{n.classList.toggle('open',o);b.setAttribute('aria-expanded',o);document.body.classList.toggle('menu-open',o);};
b.addEventListener('click',e=>{e.stopPropagation();set(!n.classList.contains('open'));});
n.addEventListener('click',e=>{if(e.target.closest('a'))set(false);});
document.addEventListener('click',e=>{if(n.classList.contains('open')&&!n.contains(e.target)&&!b.contains(e.target))set(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&n.classList.contains('open')){set(false);b.focus();}});
var _wm=window.matchMedia&&matchMedia('(min-width:981px)');_wm&&_wm.addEventListener&&_wm.addEventListener('change',m=>{if(m.matches)set(false);});})();
(function(){var styles=[
 {ff:"'Playfair Display',var(--f-display)",fw:600,fi:'normal',ls:'.01em',tt:'none'},
 {ff:"'EB Garamond',var(--f-body)",fw:500,fi:'italic',ls:'0',tt:'none'},
 {ff:"'Cinzel',var(--f-display)",fw:700,fi:'normal',ls:'.06em',tt:'uppercase'},
 {ff:"'Libre Baskerville',var(--f-body)",fw:700,fi:'normal',ls:'.01em',tt:'none'},
 {ff:"'Cormorant Garamond',var(--f-display)",fw:600,fi:'italic',ls:'0',tt:'none'},
 {ff:"'Cinzel',var(--f-display)",fw:600,fi:'normal',ls:'.08em',tt:'uppercase'},
 {ff:'var(--f-display)',fw:600,fi:'italic',ls:'.01em',tt:'none'},
 {ff:"'Cormorant Garamond',var(--f-display)",fw:700,fi:'normal',ls:'.1em',tt:'uppercase'}];
function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
function fit(){document.querySelectorAll('#bookshelf .spine').forEach(function(sp){var st=sp.querySelector('.st');if(!st||sp.hidden)return;
 if(!st.dataset.v){var n=st.textContent.length,v=styles[hash(st.textContent)%styles.length];if(n>26&&(v.tt==='uppercase'||v.ls!=='0'))v=[styles[1],styles[4],styles[6],styles[0]][hash(st.textContent)%4];st.style.setProperty('--ff',v.ff);st.style.setProperty('--fw',v.fw);st.style.setProperty('--fi',v.fi);st.style.setProperty('--ls',v.ls);st.style.setProperty('--tt',v.tt);st.dataset.v=1;sp.style.flexGrow=n>40?1.7:n>30?1.35:n>22?1.1:.85}
 var sa=sp.querySelector('.sa');var avail=sp.clientHeight-72, across=sp.clientWidth-(sa?sa.offsetWidth:0)-10; if(avail<20)return;st.style.height='auto';st.style.maxHeight=avail+'px';
 var fs=Math.round(Math.max(11,Math.min(24,Math.min(sp.clientWidth*.42,sp.clientHeight/13)))*2)/2;st.style.setProperty('--fs',fs+'px');
 while(fs>9&&(st.scrollHeight>avail+1||st.offsetWidth>across)){fs-=.5;st.style.setProperty('--fs',fs+'px')}});}
window._fitSpines=fit;var _nm=window.matchMedia&&matchMedia('(max-width:480px)');_nm&&_nm.addEventListener&&_nm.addEventListener('change',function(){try{layShelves(window._shelfF||'all')}catch(e){}setTimeout(fit,50)});var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(fit,150)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);setTimeout(fit,50);
document.querySelectorAll('#shelf-chips button,#shelf-chips [data-f]').forEach(function(b){b.addEventListener('click',function(){setTimeout(fit,30)})});})();

function flyBook(s,b){var bc=document.getElementById("book-card");if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;var cv=bc.querySelector(".cover");if(!cv||!s.animate)return;var a=s.getBoundingClientRect(),t=cv.getBoundingClientRect();
var f=s.cloneNode(true);f.className="spine fly-book";f.removeAttribute("aria-label");f.setAttribute("aria-hidden","true");f.style.cssText="--c:"+b.c+";position:fixed;left:"+a.left+"px;top:"+a.top+"px;width:"+a.width+"px;height:"+a.height+"px;margin:0;z-index:999;pointer-events:none;transform-origin:center";document.body.appendChild(f);
cv.style.opacity="0";var dx=t.left+t.width/2-(a.left+a.width/2),dy=t.top+t.height/2-(a.top+a.height/2),sc=Math.max(t.height/a.height,.6);
var an=f.animate([{transform:"translate(0,0) rotate(0) scale(1)",filter:"drop-shadow(0 0 0 gold)"},{offset:.18,transform:"translate(0,-40px) rotate(-8deg) scale(1.05)",filter:"drop-shadow(0 0 14px rgba(255,215,120,.9))"},{offset:.6,transform:"translate("+dx*.6+"px,"+(dy*.6-120)+"px) rotate(200deg) scale("+(1+sc)/2+")",filter:"drop-shadow(0 0 22px rgba(255,215,120,.9))"},{transform:"translate("+dx+"px,"+dy+"px) rotate(360deg) scale("+sc+")",filter:"drop-shadow(0 0 0 gold)",opacity:.2}],{duration:1100,easing:"cubic-bezier(.45,.05,.3,1)"});
var tr=setInterval(function(){var r=f.getBoundingClientRect(),p=document.createElement("i");p.className="fly-spk";p.style.left=(r.left+r.width/2)+"px";p.style.top=(r.top+r.height/2)+"px";document.body.appendChild(p);setTimeout(function(){p.remove()},800)},50);
an.onfinish=function(){clearInterval(tr);f.remove();cv.style.opacity="";cv.animate([{transform:"scale(1.08)",boxShadow:"0 0 30px rgba(255,215,120,.8)"},{transform:"scale(1)",boxShadow:"0 0 0 rgba(255,215,120,0)"}],{duration:500,easing:"ease-out"});sparkle(bc)};}
