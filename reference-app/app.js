/* HerFuel v5 — comprehensive interview prototype. General macro tracker + optional life-stage modules
   + integrations + BUILT-IN FEEDBACK MODE (tap any feature to comment). Mock only, not medical advice. */
(function(){
'use strict';
/* ── Async feedback collection ──────────────────────────────────────────────
   Paste your Formspree form URL here (free tier: https://formspree.io → New form).
   When set, the "Send to me" button POSTs each tester's notes to your inbox —
   no Maze account needed. Leave '' to keep export-only (copy/paste).            */
var FB_ENDPOINT='https://formspree.io/f/YOUR_FORM_ID';
var screen=document.getElementById('screen'), tabbar=document.getElementById('tabbar'),
    overlay=document.getElementById('overlay'), fab=document.getElementById('fab'),
    phone=document.getElementById('phone'), panel=document.getElementById('panel');

var DEFAULTS={ tab:'today', onboarded:false, obStep:0, obTailor:false, activeModule:null,
  demo:true, noNumbers:false, showEvidence:true, meals:[], wellbeing:{}, connected:{applehealth:true},
  waterOz:16, measure:'weight', fbMode:false, feedback:[], snackOn:false,
  dayOffset:0, collapsed:{promo:true, activity:true},   /* tips (coach) expand by default when a module is on */
  stagePos:{pregnancy:22, breastfeeding:9, cycle:23}, gamify:true, stepsAdded:0, circleTab:'learn',
  units:{energy:'kcal', system:'us'},
  profile:{name:'Maya', sex:'Female', age:31, height:'5’6"', weight:'148 lb', activity:'Lightly active'},
  customFoods:[], customRecipes:[], customMeals:[], fabActions:['search','scan','saved','exercise'],
  circleCat:'For you', joinedGroups:[], joinedChallenges:[], chat:{},
  fasting:{active:false, plan:'16:8', startTs:null} };
var S;
try{ S=Object.assign({},DEFAULTS,JSON.parse(localStorage.getItem('cf_v5')||'{}')); }catch(e){ S=Object.assign({},DEFAULTS); }
/* merge locally-created items back into the runtime data (data.js resets each load, so re-merge each load) */
CF.RECIPES.mine = (S.customRecipes||[]).slice();
(S.customFoods||[]).forEach(function(f){ if(!CF.foodById(f.id)) CF.FOODS.push(f); });
(S.customMeals||[]).forEach(function(m){ CF.MEALS_SAVED.push(m); });
function val(id){ var e=document.getElementById(id); return e?e.value.trim():''; }
function lines(id){ return val(id).split('\n').map(function(s){return s.trim();}).filter(Boolean); }
function finp(id,label,ph,type){ return '<label class="finp"><span>'+label+'</span><input id="'+id+'" type="'+(type||'text')+'" placeholder="'+(ph||'')+'"/></label>'; }
function save(){ try{ localStorage.setItem('cf_v5',JSON.stringify(S)); }catch(e){} }
function set(p){ Object.assign(S,p); save(); render(); }
function seedDemo(){ S.meals=CF.DEMO.meals.map(function(m){return Object.assign({},m);}); }
if(S.demo && S.meals.length===0) seedDemo();

/* derived */
function mod(){ return S.activeModule ? CF.STAGES[S.activeModule] : null; }
function stagePos(mk){ var p=S.stagePos&&S.stagePos[mk]; return p!=null?p:(CF.STAGE_POS_DEFAULT[mk]||0); }
function target(){ return S.activeModule ? CF.target(S.activeModule, stagePos(S.activeModule)) : CF.GENERAL; }
/* where she is within the stage → the honest, *changing* sub-line, focus chips & target message */
function stageContext(mk){ var s=CF.STAGES[mk], pos=stagePos(mk);
  if(mk==='pregnancy'){ var tri=CF.trimester(pos);
    return {1:{sub:'First trimester · Week '+pos, focus:['Folate','Hydration','No kcal change'],
               honesty:{grade:'strong', text:'Your target stays at baseline in the first trimester — energy needs barely change yet. Folate is what matters most right now.'}},
            2:{sub:'Second trimester · Week '+pos, focus:['+340 kcal','Iron','Calcium'],
               honesty:{grade:'strong', text:'Established science, not a guess — your energy needs genuinely rise this trimester. Your body is building a person.'}},
            3:{sub:'Third trimester · Week '+pos, focus:['+452 kcal','Iron','Smaller meals'],
               honesty:{grade:'strong', text:'Smaller, more frequent meals help as baby crowds your stomach — and iron stays high.'}}}[tri]; }
  if(mk==='cycle'){ var ph=CF.cyclePhase(pos);
    var cp={menstrual:{name:'Menstrual', focus:['Iron','Comfort','Hydration']},
            follicular:{name:'Follicular', focus:['Protein','Energy','Strength']},
            ovulatory:{name:'Ovulatory', focus:['Protein','Fibre','Antioxidants']},
            luteal:{name:'Luteal', focus:['Calcium','Magnesium','Steady carbs']}}[ph];
    return {sub:cp.name+' phase · Day '+pos, focus:cp.focus, honesty:s.honesty}; }
  if(mk==='breastfeeding'){ return {sub:pos+' weeks postpartum',
    focus: pos<=6?['Recovery','+400 kcal','Hydration']:['Protein','Calcium','Hydration'], honesty:s.honesty}; }
  return {sub:s.sub, focus:s.focus, honesty:s.honesty}; }
function totals(meals){ meals=meals||S.meals; var t={kcal:0,protein:0,carbs:0,fat:0,iron:0,fiber:0,calcium:0,mag:0};
  meals.forEach(function(m){ var f=CF.foodById(m.foodId); if(!f) return;
    t.kcal+=f.kcal;t.protein+=f.p;t.carbs+=f.c;t.fat+=f.f;t.iron+=f.iron;t.fiber+=f.fiber;t.calcium+=f.calcium;t.mag+=f.mag; }); return t; }
/* day navigation (Cal AI–style) — 0 = today, <0 past, >0 upcoming */
function dayDate(off){ var d=new Date(); d.setDate(d.getDate()+(off==null?S.dayOffset:off)); return d; }
function dayMeals(){ if(S.dayOffset===0) return S.meals;
  if(S.dayOffset<0) return (CF.DEMO&&CF.DEMO.yesterday)?CF.DEMO.yesterday.map(function(m){return {foodId:m.foodId,meal:m.meal,time:''};}):[];
  return []; }
function dayHeading(){ var rel=({'-1':'Yesterday','1':'Tomorrow','0':'Today'})[String(S.dayOffset)];
  var d=dayDate(); var wd=d.toLocaleDateString(undefined,{weekday:'long'});
  return rel||wd; }
function daySub(){ var d=dayDate(); return d.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'}); }
function dayLogged(o){ if(o<0) return true; if(o===0) return S.meals.length>0; return false; }  /* did that day get logged? */
function dayStrip(){ var sel=S.dayOffset, chips='';
  for(var o=-4;o<=2;o++){ var d=dayDate(o); var on=o===sel;
    var wd=['S','M','T','W','T','F','S'][d.getDay()];
    chips+='<button class="day'+(on?' on':'')+(o>0?' future':'')+(dayLogged(o)?' logged':'')+'" data-act="day:'+o+'">'+
      '<span class="dw">'+wd+'</span><span class="dcirc"><span class="dn">'+d.getDate()+'</span></span></button>'; }
  return '<div class="daystrip">'+chips+'</div>'; }
/* collapsible section — lean screen, expand on demand. S.collapsed[key]===true ⇒ hidden */
function section(key,title,body){ var open=!S.collapsed[key];
  return '<div class="sect"><button class="sect-h'+(open?' open':'')+'" data-act="collapse:'+key+'"><span>'+title+'</span><span class="chev">'+(open?'⌄':'›')+'</span></button>'+(open?'<div class="sect-b">'+body+'</div>':'')+'</div>'; }
function pct(v,m){ return Math.max(0,Math.min(100,Math.round(v/m*100))); }
function suggest(){ return CF.SUGGEST[S.activeModule||'general']; }
function activeSections(){ return S.snackOn?['Breakfast','Lunch','Dinner','Snack']:['Breakfast','Lunch','Dinner']; }
function sectionTotal(items){ return items.reduce(function(a,m){var f=CF.foodById(m.foodId);return a+(f?f.kcal:0);},0); }

/* components */
function evBadge(g){ var m=CF.GRADE_META[g]; return m?'<span class="ev '+m.cls+'"><span class="dots">'+m.dots+'</span> '+m.label+'</span>':''; }
function coachCard(c,color,because){ return '<div class="card coach" style="border-color:'+(color||'var(--plum)')+'">'+
  '<div class="spread" style="margin-bottom:6px"><span class="pill" style="background:var(--surface2);color:'+(color||'var(--plum)')+'">'+c.tag+'</span>'+evBadge(c.grade)+'</div>'+
  (because?'<div class="because">Because '+because+'</div>':'')+
  '<h3>'+c.title+'</h3><p>'+c.body+'</p><p class="note muted">'+c.note+'</p></div>'; }
function dial(v,m,l,c,u,disp,act){ var tag=act?'button':'div', a=act?(' data-act="'+act+'"'):'';
  return '<'+tag+' class="ring'+(act?' tappable':'')+'"'+a+'><div class="dial" style="--p:'+pct(v,m)+';--c:'+(c||'var(--teal)')+'">'+
  '<div class="inner"><b class="num-hide">'+(disp!=null?disp:v)+'</b><small>'+(u||'')+'</small></div></div><div class="lbl">'+l+(act?' ＋':'')+'</div></'+tag+'>'; }
function mealRow(m, idx){ var f=CF.foodById(m.foodId); if(!f) return ''; var tap=(idx!=null);
  return '<div class="meal"'+(tap?' data-act="rowmenu:'+idx+'" style="cursor:pointer"':'')+'><div class="ic">'+f.emoji+'</div><div style="flex:1"><div class="nm">'+f.name+'</div>'+
    '<div class="mt">'+(m.meal||'')+(m.time?' · '+m.time:'')+'</div></div><div class="kc num-hide">'+f.kcal+'</div>'+(tap?'<span class="rowmore">⋯</span>':'')+'</div>'; }

/* ---- views ---- */
var views={};
views.today=function(){
  var m=mod(), T=target(), accent = m ? m.color : 'var(--ink)';
  var today=S.dayOffset===0, dm=dayMeals(), t=totals(dm);
  var ctx = m ? stageContext(S.activeModule) : null;   /* where she is within the stage (drives sub/focus/honesty) */
  var rings = S.noNumbers
    ? '<div class="card"><div class="spread"><b>Nourishment</b><span class="muted" style="font-size:12px">on track</span></div><div class="bar"><i style="width:'+pct(t.kcal,T.kcal)+'%;background:'+accent+'"></i></div></div>'
    : nutCarousel(t);
  var header = m ? ''   /* module: phase + week now live inside the target card, not a separate row */
    : '<div class="spread" style="margin-top:6px"><span class="muted" style="font-size:12px;font-weight:700;letter-spacing:.5px">GENERAL TRACKING</span><button class="pill" data-act="tab:modules" style="background:var(--surface2);border:1px solid var(--line);cursor:pointer">+ Add a module</button></div>';
  /* honest target stays visible (compact); the longer, contingent guidance collapses to save space */
  var pm = m ? CF.posMeta[S.activeModule] : null;   /* a scrubber appears only for time-based stages */
  var scrub = pm ? '<div class="scrub"><span class="sl">'+pm.label+'</span><button data-act="pos:-1" aria-label="back">‹</button><b>'+stagePos(S.activeModule)+'</b><button data-act="pos:1" aria-label="forward">›</button></div>' : '';
  var g = m ? todaysGuidance(S.activeModule) : [];
  var feel = '<button class="btn ghost" data-act="logsym" style="margin-top:2px">'+((ctx&&g.some(function(x){return x.it.kind==='symptom';}))?'Update how you feel':'How do you feel today? — tips adapt')+'</button>';
  var dlt = m ? (T.kcal-CF.BASE.kcal) : 0;
  var hero = dlt ? '<b class="num-hide">'+(dlt>0?'+':'')+dlt+'</b> <span class="tunit">kcal today</span>' : '<b>Target holds</b> <span class="tunit">at baseline</span>';
  var triLabel = m ? ctx.sub.split('·')[0].trim() : '';
  var middle = m
    ? '<div class="card tcard" style="border:1px solid '+m.color+';background:linear-gradient(180deg,var(--surface),'+(m.color==='#0E6E68'?'var(--teal-soft)':'var(--surface2)')+')">'+
        '<div class="spread"><span class="phase-chip" style="background:'+m.color+'">'+m.emoji+' '+m.label+'</span>'+scrub+'</div>'+
        '<div class="spread" style="align-items:flex-end;margin-top:12px"><div class="tnum">'+hero+'<div class="muted" style="font-size:12px;font-weight:600;margin-top:1px">'+triLabel+'</div></div>'+evBadge(ctx.honesty.grade)+'</div>'+
        '<p style="margin:10px 0 0;font-size:13px;line-height:1.5;color:var(--ink2)">'+ctx.honesty.text+'</p></div>'+
        section('coach','Today’s tips · '+g.length, (g.length?g.map(function(x){return coachCard(x.it,m.color,x.because);}).join(''):'<div class="card"><p class="sub" style="margin:0">Log a meal or how you feel and tips will appear here.</p></div>')+feel)
    : section('promo','✨ Make HerFuel yours',
        '<div class="card" style="border:1px dashed var(--line);background:var(--surface2)">'+
        '<p class="sub" style="margin:0">Turn on a module — cycle, pregnancy, breastfeeding, PCOS, perimenopause — and HerFuel tailors your targets, coaching &amp; nutrients honestly. Or keep using it as a clean tracker.</p>'+
        '<button class="btn" style="margin-top:12px" data-act="tab:modules">Explore modules</button></div>');
  var banner = today ? '' :
    '<div class="card" style="background:var(--surface2);border:1px dashed var(--line);padding:11px 14px"><span class="muted" style="font-size:12.5px">'+(S.dayOffset<0?'👀 Viewing a past day — logging is read-only in this demo.':'🗓️ Upcoming day — plan ahead (read-only in this demo).')+'</span></div>';
  return '<div class="pad">'+ dayStrip() + header +
    '<div class="h1">'+(today?'Good morning, Maya':dayHeading())+'</div>'+
    ((!today)?'<p class="sub">'+daySub()+'</p>':(m?'':'<p class="sub">Calories &amp; macros — your day at a glance.</p>'))+
    banner +
    (today?fastingBanner():'')+
    middle +
    '<div class="h2">Your nutrition</div>'+ rings +
    (today?fuelCard():'')+
    '<div class="h2 spread"><span>'+(today?'Today’s food':'Food logged')+'</span>'+(today?'<button class="pill" data-act="log:copy" style="background:var(--surface2);color:var(--ink);border:1px solid var(--line);cursor:pointer">↻ Copy yesterday</button>':'')+'</div>'+
    (function(){ var by={}; activeSections().forEach(function(s){by[s]=[];}); var other=[];
      dm.forEach(function(mm,idx){ var rec={m:mm,i:idx}; if(by[mm.meal]) by[mm.meal].push(rec); else other.push(rec); });
      var sumOf=function(arr){ return sectionTotal(arr.map(function(x){return x.m;})); };
      var rows=function(arr){ return arr.map(function(x){return mealRow(x.m, today?x.i:null);}).join(''); };
      var html=activeSections().map(function(sec){ var items=by[sec];
        return '<div class="card"><div class="spread"><b style="font-size:14px">'+sec+'</b><span class="muted num-hide" style="font-size:12px">'+sumOf(items)+' cal</span></div>'+
          (items.length?rows(items):'<p class="sub" style="padding:6px 0;margin:0">Nothing logged'+(today?' yet':'')+'</p>')+
          (today?'<button class="btn ghost" data-act="addto:'+sec+'" style="margin-top:8px;padding:9px">+ Add to '+sec+'</button>':'')+'</div>';
      }).join('');
      if(other.length) html+='<div class="card"><div class="spread"><b style="font-size:14px">Other</b><span class="muted num-hide" style="font-size:12px">'+sumOf(other)+' cal</span></div>'+rows(other)+'</div>';
      return html; })()+
  '</div>';
};
/* P1: phase-aware Fuel Score (honest, never a calorie verdict) that doubles as the "hit your goal" nudge */
function bestFoodFor(key){ return CF.FOODS.slice().sort(function(a,b){return (b[key]||0)-(a[key]||0);})[0]; }
function fuelCard(){
  var m=mod(), T=target(), t=totals(); if(t.kcal===0) return '';
  var microKey = m ? m.key.tkey : 'iron', microMaxV = m ? m.key.max : 18, microLabel = m ? m.key.label : 'Iron';
  var foodKey = microKey==='protein'?'p':microKey;
  var unit = {iron:'mg',calcium:'mg',mag:'mg',fiber:'g',protein:'g'}[microKey]||'';
  var parts=[
    {r:t.protein/T.protein, gap:Math.max(0,Math.round(T.protein-t.protein)), unit:'g protein', food:bestFoodFor('p')},
    {r:(t[microKey]||0)/microMaxV, gap:Math.max(0,Math.round(microMaxV-(t[microKey]||0))), unit:unit+' '+microLabel.toLowerCase(), food:bestFoodFor(foodKey)},
    {r:(t.fiber||0)/28, gap:Math.max(0,Math.round(28-(t.fiber||0))), unit:'g fibre', food:bestFoodFor('fiber')} ];
  var cal=Math.min(1,t.kcal/T.kcal);
  var score=Math.round((Math.min(1,parts[0].r)*0.4 + Math.min(1,parts[1].r)*0.25 + Math.min(1,parts[2].r)*0.2 + cal*0.15)*100);
  var label = score>=80?'Well fuelled':score>=55?'Getting there':'Room to nourish more';
  var lever = parts.filter(function(p){return p.gap>0 && p.food;}).sort(function(a,b){return a.r-b.r;})[0];
  var col = m?m.color:'var(--teal)';
  var leverHtml = lever ? '<div class="opt" data-act="pick:'+lever.food.id+'" style="margin-top:12px"><div class="ic">'+lever.food.emoji+'</div><div style="flex:1"><div class="t">'+lever.food.name+'</div><div class="s">about +'+lever.gap+' '+lever.unit+' — would lift your score</div></div><span style="color:var(--teal);font-size:22px">+</span></div>'
    : '<p class="sub" style="margin:10px 0 0">Beautifully balanced today. 💚</p>';
  return '<div class="h2">Today’s fuel score</div><div class="card">'+
    '<div class="row" style="align-items:center;gap:16px"><div class="dial" style="--p:'+score+';--c:'+col+';width:74px;height:74px;margin:0"><div class="inner"><b class="num-hide" style="font-size:18px">'+score+'</b><small>/100</small></div></div>'+
    '<div style="flex:1"><b style="font-size:15px">'+label+'</b><p class="sub" style="margin:4px 0 0">How well you fuelled '+(m?'for your '+m.label.toLowerCase():'today')+' — not a calorie verdict, never a judgment.</p></div></div>'+
    leverHtml+'</div>'; }
function openRowMenu(idx){ var m=S.meals[idx]; if(!m) return; var f=CF.foodById(m.foodId); if(!f) return;
  var secs=activeSections().filter(function(s){return s!==m.meal;});
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:19px;margin:2px 0 10px">'+f.emoji+' '+f.name+'</div>'+
    '<div class="h2" style="margin-top:0">Copy to another meal</div>'+
    secs.map(function(s){return optRow('mealcopy:'+idx+':'+s,'🍽️',s,'');}).join('')+
    optRow('mealcopy:'+idx+':tomorrow','🗓️','Tomorrow','Plan it for tomorrow')+
    '<button class="btn ghost" data-act="mealdel:'+idx+'" style="margin-top:10px;color:#B23A48">Remove from '+m.meal+'</button>'+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Close</button></div>'); }
/* P1: fasting / IF timer, with a perinatal-safety caution */
function fastTargetHrs(){ return ({'16:8':16,'14:10':14,'18:6':18})[S.fasting&&S.fasting.plan]||16; }
function fastElapsedMs(){ try{ return Date.now()-((S.fasting&&S.fasting.startTs)||Date.now()); }catch(e){ return 0; } }
function fastElapsed(){ var ms=fastElapsedMs(); return Math.floor(ms/3600000)+'h '+Math.floor(ms%3600000/60000)+'m'; }
function fastPct(){ return Math.min(100,Math.round(fastElapsedMs()/3600000/fastTargetHrs()*100)); }
function fastingBanner(){ if(!S.fasting||!S.fasting.active) return '';
  return '<div class="card" data-act="fasting:open" style="cursor:pointer"><div class="spread"><b style="font-size:14px">⏳ Fasting · '+fastElapsed()+'</b><span class="pill" style="background:var(--surface2)">'+S.fasting.plan+' · goal '+fastTargetHrs()+'h</span></div><div class="bar" style="margin-top:8px"><i style="width:'+fastPct()+'%;background:var(--ink)"></i></div></div>'; }
function openFasting(){ var mk=S.activeModule;
  if(mk==='pregnancy'||mk==='breastfeeding'){
    return showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
      '<div class="h1" style="font-size:20px;margin:2px 0 8px">⏳ Fasting</div>'+
      '<div class="card" style="border:1px solid var(--plum)"><b style="font-size:15px">Not recommended right now</b><p class="sub" style="margin-top:6px">Intermittent fasting isn’t advised while '+(mk==='pregnancy'?'pregnant':'breastfeeding')+' — your body needs regular, nourishing meals. We’ll keep the timer off for now.</p></div>'+
      '<button class="btn ghost" data-act="close" style="margin-top:10px">Close</button></div>'); }
  if(!S.fasting) S.fasting={active:false,plan:'16:8',startTs:null};
  var body;
  if(S.fasting.active){
    body='<div style="text-align:center;margin:8px 0"><div class="num-hide" style="font-size:38px;font-weight:800;letter-spacing:-1px">'+fastElapsed()+'</div><div class="muted">into your '+S.fasting.plan+' fast · goal '+fastTargetHrs()+'h</div></div>'+
      '<div class="bar" style="margin:8px 0 14px"><i style="width:'+fastPct()+'%;background:var(--teal)"></i></div>'+
      '<button class="btn" data-act="fasting:end">End fast</button>';
  } else {
    body='<div class="row" style="gap:8px;margin:8px 0 12px">'+['16:8','14:10','18:6'].map(function(p){return '<button class="btn ghost" data-act="fasting:start:'+p+'" style="margin:0">'+p+'</button>';}).join('')+'</div>'+
      '<p class="sub">Pick a window to start. It’s a tool, not a test — never a streak to lose.</p>';
  }
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;margin:2px 0 6px">⏳ Fasting timer</div>'+body+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Close</button></div>'); }
function waterCard(){ var goal=64, oz=S.waterOz, cups=Math.round(oz/8);
  return '<div class="card"><div class="spread"><b style="font-size:14px">💧 Water</b><span class="muted num-hide" style="font-size:12px">'+oz+' / '+goal+' oz · '+cups+' cups</span></div>'+
    '<div class="bar" style="margin-top:8px"><i style="width:'+pct(oz,goal)+'%;background:#3E7CB1"></i></div>'+
    '<div class="row" style="gap:8px;margin-top:12px"><button class="btn ghost" data-act="water:8" style="margin:0;padding:11px">+ Glass · 8 oz</button><button class="btn ghost" data-act="water:16" style="margin:0;padding:11px">+ Bottle · 16 oz</button></div></div>'; }
function stepsCard(){
  var on = S.connected.garmin || S.connected.applehealth;
  if(!on) return '<div class="card"><div class="spread"><b style="font-size:14px">👟 Steps</b><button class="pill" data-act="tab:me" style="background:var(--surface2);border:1px solid var(--line);cursor:pointer">Connect a device</button></div><p class="sub" style="margin-top:8px">Connect Apple Health or Garmin to track steps automatically.</p></div>';
  var steps=S.connected.garmin?8140:6420, src=S.connected.garmin?'Garmin':'Apple Health';
  return '<div class="card"><div class="spread"><b style="font-size:14px">👟 Steps</b><span class="muted" style="font-size:11px">from '+src+'</span></div>'+
    '<div class="row" style="justify-content:space-between;margin-top:8px"><div><div class="num-hide" style="font-size:22px;font-weight:700">'+steps.toLocaleString()+'</div><div class="muted" style="font-size:11px">of 8,000 goal</div></div>'+
    '<div style="text-align:right"><div class="num-hide" style="font-size:22px;font-weight:700">'+(S.connected.garmin?410:330)+'</div><div class="muted" style="font-size:11px">cal burned</div></div></div>'+
    '<div class="bar" style="margin-top:10px"><i style="width:'+pct(steps,8000)+'%;background:var(--teal)"></i></div></div>'; }

/* ── swipeable summary carousel (Cal AI / Carb Manager style) ──
   Page 1 calories+macros · Page 2 move & hydrate · Page 3 the nutrients
   women most often fall short on — adapts to the active life-stage module. */
function kfmt(n){ return n>=1000?(n/1000).toFixed(1).replace(/\.0$/,'')+'k':String(Math.round(n)); }
var MICRO_META={ iron:{l:'Iron',c:'#A85A3C',u:'mg'}, calcium:{l:'Calcium',c:'#5B7FA6',u:'mg'},
  fiber:{l:'Fibre',c:'#5E8C61',u:'g'}, mag:{l:'Magnesium',c:'#7C5CBF',u:'mg'} };
var MICRO_PLAN={
  general:{trio:['iron','calcium','fiber'], why:'Iron, calcium &amp; fibre — the nutrients women most often run low on.'},
  cycle:{trio:['iron','calcium','mag'], why:'Iron replaces what your period loses; magnesium &amp; calcium ease cramps and mood.'},
  pregnancy:{trio:['iron','calcium','fiber'], why:'Iron for your growing blood volume, calcium for baby’s bones, fibre to ease digestion. Folate is flagged on foods.'},
  breastfeeding:{trio:['calcium','iron','fiber'], why:'Calcium protects your bones while you nurse; iron &amp; fibre support recovery.'},
  pcos:{trio:['fiber','mag','iron'], why:'Fibre steadies blood sugar and magnesium supports insulin sensitivity.'},
  perimenopause:{trio:['calcium','iron','fiber'], why:'Calcium defends bone density as estrogen falls; fibre eases the transition.'} };
function microMax(key,mk){ if(key==='iron') return mk==='pregnancy'?27:18; if(key==='calcium') return 1000;
  if(key==='fiber') return mk==='pcos'?30:28; if(key==='mag') return 320; return 100; }
function nutCarousel(t){
  var m=mod(), T=target(), mk=S.activeModule||'general', accent=m?m.color:'var(--ink)';
  var kcalLeft=Math.max(0,T.kcal-t.kcal);
  var third=m?{v:t[m.key.tkey]||0,max:m.key.max,l:m.key.label,c:m.key.color,u:m.key.unit}
             :{v:t.carbs,max:CF.GENERAL.carbs,l:'Carbs',c:'var(--plum)',u:'g'};
  var p1='<div class="rings">'+
    '<div class="ring lead"><div class="dial" style="--p:'+pct(t.kcal,T.kcal)+';--c:'+accent+'"><div class="inner"><b class="num-hide">'+kcalLeft+'</b><small>left</small></div></div><div class="lbl">Calories</div></div>'+
    dial(t.protein,T.protein,'Protein','var(--teal)','g')+
    dial(third.v,third.max,third.l,third.c,third.u)+'</div>'+
    '<p class="cwhy">'+(kcalLeft>0?kcalLeft+' kcal left':'Target reached')+' · of '+T.kcal+' kcal · '+t.protein+' g protein in</p>';
  var on=S.connected.garmin||S.connected.applehealth;
  var baseSteps=on?(S.connected.garmin?8140:6420):0, steps=baseSteps+(S.stepsAdded||0);
  var burned=on?(S.connected.garmin?410:330):0;
  var p2='<div class="rings">'+
    dial(steps,8000,'Steps','var(--teal)','',kfmt(steps),'steps:log')+
    dial(S.waterOz,64,'Water','#3E7CB1','oz',null,'water:log')+
    dial(burned,500,'Active','#C2693B','cal')+'</div>'+
    '<p class="cwhy">Tap the <b>Water</b> or <b>Steps</b> ring to log.'+(on?'':' Or connect a device in <b>Me</b> for auto steps &amp; burn.')+'</p>';
  var plan=MICRO_PLAN[mk]||MICRO_PLAN.general;
  var p3='<div class="rings">'+plan.trio.map(function(key){ var meta=MICRO_META[key];
      return dial(Math.round((t[key]||0)*10)/10, microMax(key,mk), meta.l, meta.c, meta.u); }).join('')+'</div>'+
    '<p class="cwhy">'+plan.why+'</p>';
  var titles=['Calories &amp; macros', m?(m.emoji+' '+m.label+' nutrients'):'Nutrients for you', 'Move &amp; hydrate'];
  var pages=[p1,p3,p2];
  return '<div class="carousel"><div class="ctrack" id="nutTrack">'+
    pages.map(function(pg,i){ return '<div class="cpage"><div class="card cpage-card">'+
      '<div class="spread" style="margin-bottom:10px"><b style="font-size:13.5px">'+titles[i]+'</b><span class="muted" style="font-size:11px">swipe ›</span></div>'+pg+'</div></div>'; }).join('')+
    '</div><div class="cdots" id="nutDots">'+pages.map(function(_,i){return '<button class="cdot'+(i===0?' on':'')+'" aria-label="summary page '+(i+1)+'"></button>';}).join('')+'</div></div>'; }
var nutPage=0;   /* remembered so a re-render (e.g. logging water) keeps the carousel on the same page */
function wireCarousel(){ var tr=document.getElementById('nutTrack'); if(!tr) return;
  var dots=document.querySelectorAll('#nutDots .cdot');
  function upd(){ var i=Math.round(tr.scrollLeft/Math.max(1,tr.clientWidth)); nutPage=i; dots.forEach(function(d,j){ d.classList.toggle('on',j===i); }); }
  tr.addEventListener('scroll',upd);
  dots.forEach(function(d,j){ d.addEventListener('click',function(){ tr.scrollTo({left:j*tr.clientWidth,behavior:'smooth'}); }); });
  if(nutPage){ tr.scrollLeft=nutPage*tr.clientWidth; } upd(); }
/* Cal AI–style water logger: quick tiles + running total */
function openWaterLog(){
  var tiles=[['8','🥛','+1 Glass','8 oz'],['16','🍶','+1 Bottle','16 oz'],['24','🚰','+1 Large Bottle','24 oz']];
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;text-align:center;margin:2px 0 6px">Log Water</div>'+
    '<div style="text-align:center;margin:6px 0 2px"><span class="num-hide" style="font-size:36px;font-weight:700;letter-spacing:-1px">'+S.waterOz+'</span> <span class="muted">fl oz today · '+Math.round(S.waterOz/8)+' cups</span></div>'+
    '<div class="bar" style="margin:8px 0 16px"><i style="width:'+pct(S.waterOz,64)+'%;background:#3E7CB1"></i></div>'+
    '<div class="wtiles">'+tiles.map(function(t){return '<button class="wtile" data-act="wadd:'+t[0]+'"><div class="wt-ic">'+t[1]+'</div><div class="wt-t">'+t[2]+'</div><div class="wt-s muted">'+t[3]+'</div></button>';}).join('')+'</div>'+
    (S.waterOz>0?'<button class="btn ghost" data-act="wadd:-8" style="margin-top:12px">↺ Remove a glass</button>':'')+
    '<button class="btn" data-act="close" style="margin-top:10px">Done</button></div>'); }
/* tap-the-ring step logger (same pattern as water) */
function openStepsLog(){
  var base=(S.connected.garmin?8140:(S.connected.applehealth?6420:0)), cur=base+(S.stepsAdded||0);
  var tiles=[['1000','🚶‍♀️','+ Walk','1,000 steps'],['2500','🏃‍♀️','+ Jog','2,500 steps'],['5000','🥾','+ Hike','5,000 steps']];
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;text-align:center;margin:2px 0 6px">Log Steps</div>'+
    '<div style="text-align:center;margin:6px 0 2px"><span class="num-hide" style="font-size:36px;font-weight:700;letter-spacing:-1px">'+cur.toLocaleString()+'</span> <span class="muted">steps today · goal 8,000</span></div>'+
    '<div class="bar" style="margin:8px 0 16px"><i style="width:'+pct(cur,8000)+'%;background:var(--teal)"></i></div>'+
    '<div class="wtiles">'+tiles.map(function(t){return '<button class="wtile" data-act="sadd:'+t[0]+'"><div class="wt-ic">'+t[1]+'</div><div class="wt-t">'+t[2]+'</div><div class="wt-s muted">'+t[3]+'</div></button>';}).join('')+'</div>'+
    ((S.stepsAdded||0)>0?'<button class="btn ghost" data-act="sadd:-1000" style="margin-top:12px">↺ Remove 1,000</button>':'')+
    '<button class="btn" data-act="close" style="margin-top:10px">Done</button></div>'); }

/* ── contingent guidance: pick today's tips by what's actually true ──
   priority 1 = symptom/data (reacts to her) · 2 = stage (week/phase) · 3 = evergreen.
   Ties rotate by day so it stays fresh without being random for its own sake. */
var NUTL={iron:'Iron',calcium:'Calcium',fiber:'Fibre',protein:'Protein',mag:'Magnesium'};
function hashId(s){ var h=0; for(var i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))%9973; return h; }
function daySeed(){ var d=dayDate(); return Math.floor((d-new Date(d.getFullYear(),0,0))/86400000); }
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function guideMatch(it,ctx){
  if(it.symptom){ return ctx.syms.indexOf(it.symptom)>=0 ? {ok:true,p:1,because:'you logged “'+it.symptom+'”'} : {ok:false}; }
  if(it.gap){ var n=it.gap.n;
    if(n==='water'){ return S.waterOz<64 ? {ok:true,p:1,because:'hydration’s low so far'} : {ok:false}; }
    if(!ctx.logged) return {ok:false};
    var max={iron:ctx.T.iron,calcium:ctx.T.calcium,fiber:ctx.T.fiber,protein:ctx.T.protein,mag:ctx.T.mag}[n]||100;
    return (ctx.t[n]||0) < (it.gap.pct||0.5)*max ? {ok:true,p:1,because:(NUTL[n]||n)+' is low so far today'} : {ok:false}; }
  if(it.phase){ return ctx.phase===it.phase ? {ok:true,p:2,because:cap(it.phase)+' phase'} : {ok:false}; }
  if(it.weeks){ return (ctx.pos>=it.weeks[0]&&ctx.pos<=it.weeks[1])
      ? {ok:true,p:2,because: ctx.tri?('trimester '+ctx.tri):('week '+ctx.pos)} : {ok:false}; }
  if(it.always) return {ok:true,p:3,because:CF.STAGES[ctx.mk].label.toLowerCase()+' focus'};
  return {ok:false};
}
function todaysGuidance(mk){
  var pos=stagePos(mk), t=totals(dayMeals()), T=target();
  var ctx={mk:mk,pos:pos,t:t,T:T,logged:t.kcal>0,
    syms:Object.keys(S.wellbeing||{}).filter(function(k){return S.wellbeing[k];}),
    phase: mk==='cycle'?CF.cyclePhase(pos):null, tri: mk==='pregnancy'?CF.trimester(pos):null};
  var seed=daySeed(), out=[], seen={};
  (CF.GUIDE[mk]||[]).map(function(it){ var r=guideMatch(it,ctx); return r.ok?{it:it,p:r.p,because:r.because}:null; })
    .filter(Boolean)
    .sort(function(a,b){ return a.p!==b.p ? a.p-b.p : ((hashId(a.it.id)+seed)%97)-((hashId(b.it.id)+seed)%97); })
    .forEach(function(x){ if(seen[x.it.tag]) return; seen[x.it.tag]=1; out.push(x); });   /* one card per topic */
  return out.slice(0,3);
}

views.modules=function(){
  var cur=S.activeModule, genActive=!cur;
  var head = '<div class="pad"><button class="pill" data-act="tab:me" style="background:var(--surface2);border:1px solid var(--line);cursor:pointer;margin-top:4px">‹ Back to Profile</button><div class="h1">Modules</div>'+
    '<p class="sub">Optional add-ons that tailor HerFuel to your body — turn on what fits you now, off anytime. <b>HerFuel works great as a plain tracker too.</b></p>'+
    '<div class="card" data-act="module:general" style="cursor:pointer;border-color:'+(genActive?'var(--ink)':'var(--line)')+(genActive?';box-shadow:0 0 0 1px var(--ink)':'')+'">'+
      '<div class="spread"><div class="row"><div class="ic" style="width:38px;height:38px;border-radius:11px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:19px">🍽️</div><div><div class="t" style="font-weight:600">General tracking</div><div class="s muted" style="font-size:12px">Just calories &amp; macros — no life-stage features</div></div></div>'+
      '<span class="pill" style="background:'+(genActive?'var(--teal-soft)':'var(--surface2)')+';color:'+(genActive?'var(--teal)':'var(--ink2)')+'">'+(genActive?'On':'Use')+'</span></div></div>';
  var cards = CF.MODULES.map(function(md){ var s=CF.STAGES[md.key]; var on=cur===md.key;
    return '<div class="card" data-act="module:'+md.key+'" style="cursor:pointer;border-color:'+(on?s.color:'var(--line)')+(on?';box-shadow:0 0 0 1px '+s.color:'')+'">'+
      '<div class="spread"><div class="row"><div class="ic" style="width:38px;height:38px;border-radius:11px;background:'+(on?s.color:'var(--surface2)')+';color:'+(on?'#fff':'var(--ink)')+';display:flex;align-items:center;justify-content:center;font-size:19px">'+s.emoji+'</div>'+
        '<b style="font-size:15px">'+s.label+'</b></div>'+
        '<span class="pill" style="background:'+(on?s.color:'var(--surface2)')+';color:'+(on?'#fff':'var(--ink2)')+'">'+(on?'On ✓':'Turn on')+'</span></div>'+
      '<p class="sub" style="margin-top:10px">'+md.adds+'</p></div>';
  }).join('');
  return head + cards + '<p class="muted" style="font-size:12px;text-align:center;margin-top:6px">One life-stage at a time; switch whenever your body does. Nothing is forced.</p></div>';
};

views.me=function(){
  var energy=S.units.energy, sysu=S.units.system;
  return '<div class="pad"><div class="h1">Me</div>'+
    /* profile header */
    '<div class="card" data-act="profile" style="cursor:pointer"><div class="row" style="align-items:center;gap:14px"><div class="avatar">M</div>'+
      '<div style="flex:1"><div style="font-weight:700;font-size:17px">Maya</div><div class="muted num-hide" style="font-size:12px">'+S.profile.height+' · '+S.profile.weight+' · '+S.profile.age+' yrs</div></div><span class="muted">Edit ›</span></div></div>'+
    '<div class="h2">Goals &amp; tracking</div>'+
    '<div class="card">'+
      '<div class="opt" data-act="goals"><div class="ic">🎯</div><div style="flex:1"><div class="t">Calorie &amp; macro goals</div><div class="s">View / edit your targets</div></div><span class="muted">›</span></div>'+
      '<div class="opt" data-act="reminders"><div class="ic">⏰</div><div style="flex:1"><div class="t">Reminders</div><div class="s">Meal &amp; logging nudges</div></div><span class="muted">›</span></div>'+
      '<div class="opt" data-act="fabconfig"><div class="ic">➕</div><div style="flex:1"><div class="t">Quick-add (＋) button</div><div class="s">'+fabKeys().map(function(k){return LOG_CATALOG[k][1];}).join(' · ')+'</div></div><span class="muted">›</span></div>'+
      '<div class="opt" data-act="tab:modules"><div class="ic">✨</div><div style="flex:1"><div class="t">Life-stage modules</div><div class="s">'+(S.activeModule?CF.STAGES[S.activeModule].label+' on':'General')+'</div></div><span class="muted">›</span></div>'+
      '<div class="opt" data-act="tab:integrations"><div class="ic">🔗</div><div style="flex:1"><div class="t">Connected apps &amp; devices</div><div class="s">Apple Health · Oura · Whoop</div></div><span class="muted">›</span></div>'+
    '</div>'+
    '<div class="h2">Units</div>'+
    '<div class="card">'+
      '<div class="opt" data-act="unit:energy"><div class="ic">🔥</div><div style="flex:1"><div class="t">Energy</div><div class="s">Calories or kilojoules</div></div><span class="pill" style="background:var(--surface2)">'+(energy==='kcal'?'Calories':'Kilojoules')+'</span></div>'+
      '<div class="opt" data-act="unit:system"><div class="ic">🌍</div><div style="flex:1"><div class="t">Measurement system</div><div class="s">Weight, height &amp; volume</div></div><span class="pill" style="background:var(--surface2)">'+(sysu==='us'?'US (lb, oz)':'Metric (kg, ml)')+'</span></div>'+
    '</div>'+
    '<div class="h2">Meal sections</div>'+
    '<div class="card">'+
      toggle('toggle:snack','Snack section','Add a Snack section to your daily food (Breakfast / Lunch / Dinner are always on).',S.snackOn)+
    '</div>'+
    '<div class="h2">Experience</div>'+
    '<div class="card">'+
      toggle('toggle:nonum','No-numbers mode','Track foods & feelings without seeing calories.',S.noNumbers)+
      toggle('toggle:gamify','Streaks &amp; badges','Celebrate consistency &amp; self-care. Counts check-ins, never deficits — turn off anytime.',S.gamify)+
      toggle('toggle:ev','Evidence labels','Show how strong the science is behind each tip.',S.showEvidence)+
      toggle('toggle:demo','Demo data','Fill the app with sample meals.',S.demo)+
    '</div>'+
    '<div class="h2">Your plan</div>'+
    '<div class="card"><div class="spread"><div><div class="nm" style="font-weight:600">Premium</div><div class="mt muted" style="font-size:12px">7-day free trial · then $7.99/mo (yearly)</div></div><span class="pill" style="background:var(--teal-soft);color:var(--teal)">Trial</span></div>'+
      '<p class="sub" style="margin-top:12px">Cancel in two taps — we remind you before it ends. Your data is encrypted and never sold.</p>'+
      '<button class="btn ghost" data-act="manageplan" style="margin-top:10px">Manage subscription</button></div>'+
    '<div class="h2">Support &amp; about</div>'+
    '<div class="card">'+
      '<div class="opt" data-act="support:help"><div class="ic">💬</div><div style="flex:1"><div class="t">Help &amp; support</div></div><span class="muted">›</span></div>'+
      '<div class="opt" data-act="support:feature"><div class="ic">💡</div><div style="flex:1"><div class="t">Request a feature</div></div><span class="muted">›</span></div>'+
      '<div class="opt" data-act="support:rate"><div class="ic">⭐</div><div style="flex:1"><div class="t">Rate HerFuel</div></div><span class="muted">›</span></div>'+
      '<div class="opt" data-act="support:terms"><div class="ic">📄</div><div style="flex:1"><div class="t">Terms &amp; Privacy</div></div><span class="muted">›</span></div>'+
    '</div>'+
    '<div class="card">'+
      '<div class="opt" data-act="account:logout"><div class="ic">↩︎</div><div style="flex:1"><div class="t">Log out</div></div></div>'+
      '<div class="opt" data-act="account:delete"><div class="ic">🗑️</div><div style="flex:1"><div class="t" style="color:#B23A48">Delete account</div><div class="s">Permanently erase your data</div></div></div>'+
    '</div>'+
    '<button class="btn ghost" data-act="restart" style="margin-top:14px">Replay onboarding</button>'+
    '<p class="muted" style="text-align:center;font-size:11px;margin-top:12px">HerFuel · v5 prototype · not medical advice</p></div>';
};
function openProfile(){
  var p=S.profile;
  var row=function(act,label,val){ return '<div class="opt" data-act="'+act+'"><div style="flex:1"><div class="t">'+label+'</div></div><span class="num-hide" style="font-weight:600">'+val+'</span><span class="muted" style="margin-left:8px">›</span></div>'; };
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;margin:2px 0 10px">Profile</div>'+
    row('profile:name','Name',p.name)+row('profile:sex','Sex',p.sex)+row('profile:age','Age',p.age+' yrs')+
    row('profile:height','Height',p.height)+row('profile:weight','Weight',p.weight)+row('profile:activity','Activity level',p.activity)+
    '<button class="btn" data-act="goals" style="margin-top:12px">Recalculate my targets</button>'+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Done</button></div>'); }

/* helpers */
function optRow(a,ic,t,s){ return '<div class="opt" data-act="'+a+'"><div class="ic">'+ic+'</div><div style="flex:1"><div class="t">'+t+'</div><div class="s">'+s+'</div></div></div>'; }
function toggle(a,t,s,on){ return '<div class="toggle"><div><div class="t">'+t+'</div><div class="s">'+s+'</div></div><div class="sw'+(on?' on':'')+'" data-act="'+a+'"><i></i></div></div>'; }
function bars(vals,max,color){ return '<div style="display:flex;align-items:flex-end;gap:3px;height:54px">'+
  vals.map(function(v){var h=Math.max(6,Math.round(v/max*100));return '<div style="flex:1;height:'+h+'%;background:'+color+';border-radius:2px;opacity:.85"></div>';}).join('')+'</div>'; }
function spark(vals,color){ var mn=Math.min.apply(null,vals),mx=Math.max.apply(null,vals),r=(mx-mn)||1;
  var pts=vals.map(function(v,i){return (i/(vals.length-1)*100).toFixed(1)+','+(96-((v-mn)/r*88)).toFixed(1);}).join(' ');
  return '<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:54px"><polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>'; }

views.progress=function(){
  var ms=CF.measureById(S.measure)||CF.MEASURES[0];
  var srcOk=(ms.source==='manual'||ms.source==='logged')||!!S.connected[ms.source];
  var cats={}; CF.MEASURES.forEach(function(x){ (cats[x.cat]=cats[x.cat]||[]).push(x); });
  var picker=Object.keys(cats).map(function(cat){ return '<div class="muted" style="font-size:10px;font-weight:700;letter-spacing:.5px;margin:6px 0 4px">'+cat.toUpperCase()+'</div><div style="display:flex;flex-wrap:wrap">'+
    cats[cat].map(function(x){var on=x.id===S.measure; return '<button class="pill" data-act="measure:'+x.id+'" style="background:'+(on?'var(--ink)':'var(--surface2)')+';color:'+(on?'#fff':'var(--ink)')+';border:1px solid '+(on?'var(--ink)':'var(--line)')+';cursor:pointer;margin:0 6px 8px 0">'+x.label+'</button>';}).join('')+'</div>';}).join('');
  var body;
  if(!srcOk){
    body='<div class="card"><div class="spread"><b style="font-size:15px">'+ms.label+'</b><span class="muted" style="font-size:12px">'+ms.cat+'</span></div>'+
      '<div style="text-align:center;padding:22px 0"><div style="font-size:32px">🔌</div><p class="sub" style="margin-top:8px">Connect <b>'+CF.intName(ms.source)+'</b> to auto-fill '+ms.label.toLowerCase()+' and see its history here.</p>'+
      '<button class="btn" data-act="tab:me" style="margin-top:8px">Connect device</button></div></div>';
  } else {
    var d=ms.data, last=d[d.length-1], avg=Math.round(d.reduce(function(a,b){return a+b;},0)/d.length*10)/10;
    var srcLabel=(ms.source==='logged')?'from your food logs':(ms.source==='manual')?'manual entries':'auto-synced from '+CF.intName(ms.source);
    body='<div class="card"><div class="spread"><b style="font-size:15px">'+ms.label+(ms.unit?' ('+ms.unit+')':'')+'</b><span class="muted" style="font-size:11px">'+srcLabel+'</span></div>'+
      '<div class="row" style="gap:6px;margin:10px 0"><span class="pill" style="background:var(--surface2)">1W</span><span class="pill" style="background:var(--surface2)">1M</span><span class="pill" style="background:var(--ink);color:#fff">All</span></div>'+
      spark(d,'var(--teal)')+
      '<div class="spread" style="margin-top:12px"><div><div class="num-hide" style="font-size:20px;font-weight:700">'+last+(ms.unit?' '+ms.unit:'')+'</div><div class="muted" style="font-size:11px">latest</div></div>'+
        '<div style="text-align:right"><div class="num-hide" style="font-size:20px;font-weight:700">'+avg+'</div><div class="muted" style="font-size:11px">average</div></div></div>'+
      (ms.goal?'<div class="pill" style="background:var(--teal-soft);color:var(--teal);margin-top:12px">'+ms.goal+'</div>':'')+'</div>'+
      '<div class="h2">History</div><div class="card">'+d.slice().reverse().slice(0,6).map(function(v,i){return '<div class="meal"><div><div class="nm num-hide">'+v+(ms.unit?' '+ms.unit:'')+'</div><div class="mt">Jun '+(9-i)+', 2026</div></div></div>';}).join('')+'</div>'+
      '<button class="btn ghost" data-act="addmeasure" style="margin-top:12px">+ Add '+ms.label.toLowerCase()+' manually</button>';
  }
  return '<div class="pad"><div class="h1">Progress</div><p class="sub">Your measurements &amp; trends. Connected devices auto-fill these — or add manually.</p>'+
    consistencyCard()+picker+body+
    '<button class="btn ghost" data-act="logsym" style="margin-top:14px">＋ Log today’s symptoms</button></div>';
};
/* Cal AI-style Milestones — two tiles (streak + badges) + hexagon badge grid.
   DE-safe: a 0 streak is a "fresh start" (never "you lost 14"); counts check-ins, not deficits. */
function mileTiles(linked){
  var st=CF.STREAK, earned=CF.BADGES.filter(function(b){return b.earned;}).length;
  var tag=function(act,inner){ return linked?'<button class="mtile" data-act="'+act+'">'+inner+'</button>':'<div class="mtile">'+inner+'</div>'; };
  return '<div class="miletiles">'+
    tag('streakinfo','<div class="mt-top"><span class="mt-em">🔥</span><span class="mt-num num-hide">'+st.current+'</span></div>'+
      '<div class="mt-l">Day streak</div><div class="mt-pill">best: '+st.best+' days</div>')+
    tag('milestones','<div class="mt-top"><span class="mt-em">🏅</span><span class="mt-num num-hide">'+earned+'</span></div>'+
      '<div class="mt-l">Badges earned</div><div class="mt-pill">'+earned+' / '+CF.BADGES.length+'</div>')+
    '</div>'; }
function badgeCell(b){
  return '<button class="bcell'+(b.earned?'':' locked')+'" data-act="badge:'+b.id+'">'+
    '<div class="bhex" style="background:'+(b.earned?b.color:'#D9D5CE')+'">'+b.icon+'</div>'+
    '<div class="bname">'+b.label+'</div><div class="breq muted">'+b.req+'</div></button>'; }
function consistencyCard(){
  if(!S.gamify) return '';
  return '<div class="h2">Milestones</div>'+ mileTiles(true) + '<div class="h2">Measurements</div>';
}
function openStreakInfo(){
  var st=CF.STREAK, fresh=st.current===0;
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="text-align:center"><div class="grab"></div>'+
    '<div style="font-size:54px;line-height:1;margin-top:6px">🔥</div>'+
    '<div class="num-hide" style="font-size:40px;font-weight:800;letter-spacing:-1px;margin-top:2px">'+st.current+'</div>'+
    '<div class="muted" style="font-size:12px;font-weight:700;letter-spacing:.04em">DAY CHECK-IN STREAK</div>'+
    '<div class="h1" style="font-size:22px;margin:10px 0 2px">'+(fresh?'🌱 Fresh start — today is day 1':'Keep it gentle')+'</div>'+
    '<p class="sub" style="margin:0 14px">'+(fresh
      ? 'Your best run is '+st.best+' days — that didn’t go anywhere. Log anything, or how you feel, today to begin again.'
      : 'Your best is '+st.best+' days. Checking in counts — a perfect day isn’t required.')+'</p>'+
    '<p class="note muted" style="margin:14px 14px 0">Your streak counts every day you <b>check in</b> (log a meal or how you feel) — never days under a calorie goal. <a data-act="tab:me" style="color:var(--teal);cursor:pointer">Turn off in Me</a>.</p>'+
    '<button class="btn ghost" data-act="milestones" style="margin-top:16px">See your badges</button>'+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Close</button></div>'); }
function openMilestones(){
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:22px;margin:2px 0 12px">Milestones</div>'+
    mileTiles(false)+
    '<div class="badgegrid" style="margin-top:14px">'+CF.BADGES.map(badgeCell).join('')+'</div>'+
    '<p class="note muted" style="margin-top:12px;text-align:center">Counts days you check in — never days under a calorie goal.</p>'+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Done</button></div>'); }
function openBadge(id){ var b=CF.BADGES.filter(function(x){return x.id===id;})[0]; if(!b) return;
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="text-align:center">'+'<div class="grab"></div>'+
    '<div class="bhex big" style="background:'+(b.earned?b.color:'#D9D5CE')+';margin:14px auto 0">'+b.icon+'</div>'+
    '<div class="muted" style="font-size:12px;font-weight:700;letter-spacing:.04em;margin-top:14px">'+(b.earned?'BADGE UNLOCKED':'LOCKED')+'</div>'+
    '<div class="h1" style="font-size:24px;margin:2px 0 2px">'+b.label+'</div>'+
    '<p class="sub" style="margin:0 0 4px">'+b.req+'</p>'+
    (b.earned?'<button class="btn" data-act="badge:share" style="margin-top:16px">Share your badge</button>'
             :'<div class="pill" style="background:var(--surface2);margin-top:16px">Keep going to unlock</div>')+
    '<button class="btn ghost" data-act="milestones" style="margin-top:8px">View all badges</button>'+
    '<p class="note muted" style="margin-top:8px">Not into badges? <a data-act="tab:me" style="color:var(--teal);cursor:pointer">Turn them off in Me</a>.</p>'+
    '<button class="btn ghost" data-act="close" style="margin-top:4px">Close</button></div>'); }
views.articles=function(){
  var m=mod(), sug=suggest();
  var more=[{t:'Reading a nutrition label in 10 seconds',m:'3 min read'},{t:'Macros vs calories: what actually matters',m:'5 min read'},{t:'Building a logging habit that sticks',m:'4 min read'}];
  return '<div class="pad"><div class="h1">Articles</div><p class="sub">Evidence-graded reads'+(m?' — tuned to your '+m.label.toLowerCase()+' module':'')+'.</p>'+
    '<div class="h2">For you'+(m?' · '+m.label.toLowerCase():'')+'</div>'+
    sug.articles.map(function(a){return articleCard(a, m?m.color:'var(--teal)');}).join('')+
    '<div class="h2">Nutrition basics</div>'+
    more.map(function(a){return articleCard(a,'var(--ink2)');}).join('')+'</div>';
};
function articleCard(a,color){ return '<div class="card" data-act="article" style="cursor:pointer"><div class="spread"><div style="flex:1"><div class="nm" style="font-weight:600;font-size:14px">'+a.t+'</div><div class="mt muted" style="font-size:12px;margin-top:3px">'+a.m+'</div></div><span style="color:'+color+';font-size:18px;margin-left:10px">›</span></div></div>'; }

var HUB_TILES=[['my:foods','🍎','My Foods','#E3EFED'],['my:recipes','🍲','My Recipes','#FBEEDD'],
  ['my:meals','🍱','My Meals','#F1E7EE'],['my:plans','🗓️','Meal Plans','#E6EEF5'],['my:favs','❤️','Favourites','#F7E7E9']];
views.meals=function(){
  var m=mod(), sug=suggest(), ph=m?m.label.toLowerCase():'you';
  var tiles='<div class="htiles">'+HUB_TILES.map(function(t){return '<button class="htile" data-act="'+t[0]+'" style="background:'+t[3]+'"><div class="hic">'+t[1]+'</div><div class="hl">'+t[2]+'</div></button>';}).join('')+'</div>';
  var ideas=sug.meals.map(function(ml){return '<div class="card"><div class="row"><div class="ic" style="width:38px;height:38px;border-radius:11px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:18px">🍴</div><div><div class="nm" style="font-weight:600;font-size:14px">'+ml.t+'</div><div class="mt muted" style="font-size:12px">'+ml.d+'</div></div></div></div>';}).join('');
  var mk=S.activeModule||'general';
  var recipes=(CF.RECIPES[mk]||CF.RECIPES.general).map(function(r,i){return '<div class="meal" data-act="recipe:'+mk+':'+i+'" style="cursor:pointer"><div class="ic">'+r.emoji+'</div><div style="flex:1"><div class="nm">'+r.name+'</div><div class="mt">'+r.kcal+' cal · '+r.mins+' min · ★ '+r.rating+'</div></div><span class="muted" style="font-size:18px">›</span></div>';}).join('');
  var plans=CF.MEAL_PLANS.map(function(p,i){return '<div class="opt" data-act="plan:'+i+'"><div class="ic">🗓️</div><div style="flex:1"><div class="t">'+p.name+'</div><div class="s">'+p.sub+'</div></div><span class="muted">›</span></div>';}).join('');
  return '<div class="pad"><div class="spread" style="margin-top:6px"><div class="h1" style="margin:0">Meals</div>'+
      '<button class="pill" data-act="meals:create" style="background:var(--ink);color:#fff;cursor:pointer;padding:8px 14px">＋ Create</button></div>'+
    '<p class="sub">Find your foods, recipes, meals &amp; plans — suggestions below are tuned to '+(m?'your '+ph+' phase':'your goals')+'.</p>'+
    tiles +
    '<div class="h2 spread"><span>Suggested for '+(m?'your '+ph:'you')+'</span>'+(m?'<span class="phase-chip" style="background:'+m.color+'">'+m.emoji+' '+m.label+'</span>':'')+'</div>'+ ideas +
    '<div class="h2">Recipes to try'+(m?' · '+ph:'')+'</div><div class="card" style="padding:4px 16px">'+recipes+'</div>'+
    '<div class="h2">Meal plans'+(m?' · '+ph:'')+'</div>'+ plans +
  '</div>';
};
function moduleCatOf(mk){ return {cycle:'Cycle',pregnancy:'Pregnancy',breastfeeding:'Postpartum',pcos:'PCOS',perimenopause:'Perimenopause'}[mk]||'Basics'; }
function circleFilter(items){
  var cat=S.circleCat||'For you', mc=moduleCatOf(S.activeModule);
  return items.filter(function(it){ if(cat==='All') return true; if(cat==='For you') return it.cat===mc||it.cat==='Basics'; return it.cat===cat; }); }
views.circle=function(){
  var ct=S.circleTab||'learn', m=mod(), col=m?m.color:'var(--teal)';
  var tabs='<div class="ctabs">'+CIRCLE_TABS.map(function(t){return '<button class="ctab'+(ct===t[0]?' on':'')+'" data-act="circletab:'+t[0]+'">'+t[1]+'</button>';}).join('')+'</div>';
  var body='';
  if(ct==='learn'||ct==='watch'){
    var chips='<div class="ctabs" style="margin-top:6px">'+CF.CIRCLE.cats.map(function(c){return '<button class="ctab'+((S.circleCat||'For you')===c?' on':'')+'" data-act="circlecat:'+encodeURIComponent(c)+'">'+c+'</button>';}).join('')+'</div>';
    var search='<input id="circleSearch" class="csearch" placeholder="🔍 Search '+(ct==='learn'?'articles':'videos')+'…"/>';
    var list;
    if(ct==='learn'){
      list=circleFilter(CF.CIRCLE.articles).map(function(a){return '<div class="crow card" data-act="article" data-search="'+(a.t+' '+a.cat).toLowerCase()+'"><div class="row" style="justify-content:space-between"><div style="flex:1"><div class="nm" style="font-weight:600;font-size:14px">'+a.t+'</div><div class="mt muted" style="font-size:12px">'+a.cat+' · '+a.m+(a.by?' · '+a.by:'')+'</div></div><span class="muted" style="font-size:18px">›</span></div></div>';}).join('');
    } else {
      list=circleFilter(CF.CIRCLE.videos).map(function(v){return '<div class="crow card vid" data-act="article" data-search="'+(v.t+' '+v.cat).toLowerCase()+'"><div class="vthumb">▶</div><div style="flex:1"><div class="nm" style="font-weight:600;font-size:14px">'+v.t+'</div><div class="mt muted" style="font-size:12px">'+v.cat+' · '+v.m+'</div></div></div>';}).join('');
    }
    body=search+chips+'<div id="circleList" style="margin-top:10px">'+list+'</div><p class="muted" id="circleEmpty" style="display:none;text-align:center;padding:18px 0">No matches — try another search or category.</p>';
  } else if(ct==='challenges'){
    body='<div class="h2">Join a challenge</div>'+CF.CIRCLE.challenges.map(function(c){ var on=(S.joinedChallenges||[]).indexOf(c.id)>=0;
      return '<div class="opt"><div class="ic">'+c.icon+'</div><div style="flex:1"><div class="t">'+c.t+'</div><div class="s">'+c.sub+' · '+c.who+'</div>'+(on?'<div class="bar" style="margin-top:8px"><i style="width:40%;background:var(--teal)"></i></div>':'')+'</div><button class="pill" data-act="joinch:'+c.id+'" style="background:'+(on?'var(--teal)':'var(--teal-soft)')+';color:'+(on?'#fff':'var(--teal)')+';cursor:pointer">'+(on?'Joined ✓':'Join')+'</button></div>';}).join('');
  } else {
    body='<div class="opt" style="border-style:dashed"><div class="ic">🔍</div><div style="flex:1"><div class="t">Find your people</div><div class="s">Browse groups by stage or topic</div></div></div>'+
      CF.CIRCLE.groups.map(function(g){ var on=(S.joinedGroups||[]).indexOf(g.id)>=0;
        return '<div class="opt"'+(on?' data-act="chat:'+g.id+'" style="cursor:pointer"':'')+'><div class="ic">'+g.icon+'</div><div style="flex:1"><div class="t">'+g.t+'</div><div class="s">'+g.who+(on?' · tap to open chat':'')+'</div></div><button class="pill" data-act="'+(on?'chat:'+g.id:'joingroup:'+g.id)+'" style="background:'+(on?'var(--teal)':'var(--surface2)')+';color:'+(on?'#fff':'var(--ink)')+';cursor:pointer">'+(on?'Open':'Join')+'</button></div>';}).join('');
  }
  return '<div class="pad"><div class="h1">Circle</div><p class="sub">Learn, watch, take on challenges &amp; find women in your stage. A kinder corner of the internet.</p>'+tabs+body+'</div>';
};
function wireCircleSearch(){ var inp=document.getElementById('circleSearch'); if(!inp) return;
  inp.addEventListener('input',function(){ var q=inp.value.trim().toLowerCase(), rows=document.querySelectorAll('#circleList .crow'), shown=0;
    rows.forEach(function(r){ var ok=!q||r.getAttribute('data-search').indexOf(q)>=0; r.style.display=ok?'':'none'; if(ok)shown++; });
    var e=document.getElementById('circleEmpty'); if(e) e.style.display=shown?'none':'block'; }); }
function openGroupChat(id){
  var g=CF.CIRCLE.groups.filter(function(x){return x.id===id;})[0]; if(!g) return;
  if(!S.chat) S.chat={}; if(!S.chat[id]) S.chat[id]=CF.CIRCLE.chat.map(function(m){return {who:m.who,text:m.text,t:m.t};});
  var msgs=S.chat[id].map(function(m){var me=m.who==='You'; return '<div class="cmsg'+(me?' me':'')+'"><div class="cmw"><div class="cmn">'+m.who+' · '+m.t+'</div><div class="cmt">'+m.text+'</div></div></div>';}).join('');
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="max-height:90%;overflow-y:auto"><div class="grab"></div>'+
    '<div class="spread"><div class="h1" style="font-size:19px;margin:2px 0">'+g.icon+' '+g.t+'</div><span class="muted" style="font-size:12px">'+g.who+'</span></div>'+
    '<p class="muted" style="font-size:11px;margin:2px 0 10px">Anonymous &amp; supportive — be kind. Not medical advice.</p>'+
    '<div class="chat">'+msgs+'</div>'+
    '<div class="row" style="gap:8px;margin-top:12px"><input id="chatInput" class="csearch" style="flex:1;margin:0" placeholder="Write something kind…"/><button class="btn" data-act="chatsend:'+id+'" style="margin:0;width:auto;padding:12px 16px">Send</button></div>'+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Close</button></div>');
  setTimeout(function(){var c=document.querySelector('.chat'); if(c)c.scrollTop=c.scrollHeight;},40); }
function openMyList(kind){
  var title, rows;
  if(kind==='foods'){ title='My Foods'; rows=CF.FOODS.map(function(f){return optRow('pick:'+f.id,f.emoji,f.name,f.kcal+' cal · '+f.serving);}).join('')+optRow('create:food','＋','Create a food','Add a custom food'); }
  else if(kind==='recipes'){ title='My Recipes'; var rmk=S.activeModule||'general'; var mine=CF.RECIPES.mine||[];
    rows=mine.map(function(r,i){return optRow('recipe:mine:'+i,r.emoji,r.name,r.kcal+' cal · '+r.mins+' min · yours');}).join('')+
      (CF.RECIPES[rmk]||CF.RECIPES.general).map(function(r,i){return optRow('recipe:'+rmk+':'+i,r.emoji,r.name,r.kcal+' cal · '+r.mins+' min · '+r.ingredients.length+' ingredients');}).join('')+
      optRow('create:recipe','＋','Create a recipe','Ingredients &amp; steps'); }
  else if(kind==='meals'){ title='My Meals'; rows=CF.MEALS_SAVED.map(function(sm,i){return optRow('meal:'+i,'🍱',sm.name,sm.items.map(function(id){return CF.foodById(id).name;}).join(' + ')+' · '+sm.kcal+' cal');}).join('')+optRow('create:meal','＋','Create a meal','Save a combo you eat often'); }
  else if(kind==='plans'){ title='Meal Plans'; rows=CF.MEAL_PLANS.map(function(p,i){return optRow('plan:'+i,'🗓️',p.name,p.sub);}).join('')+optRow('create:plan','＋','Build a plan','Multi-day'); }
  else { title='Favourites'; rows=CF.MEALS_SAVED.slice(0,2).map(function(sm,i){return optRow('meal:'+i,'🍱',sm.name,sm.kcal+' cal');}).join('')+CF.FOODS.slice(0,3).map(function(f){return optRow('pick:'+f.id,f.emoji,f.name,f.kcal+' cal');}).join(''); }
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;margin:2px 0 10px">'+title+'</div>'+rows+
    '<button class="btn ghost" data-act="close" style="margin-top:10px">Close</button></div>'); }
function macroDonut(r){ var pc=r.p*4,cc=r.c*4,fc=r.f*9,tot=pc+cc+fc||1; var a=Math.round(pc/tot*100),b=Math.round((pc+cc)/tot*100);
  return '<div class="mdonut" style="background:conic-gradient(var(--teal) 0 '+a+'%,var(--plum) '+a+'% '+b+'%,#C2693B '+b+'% 100%)"><div class="mdc"><b class="num-hide">'+r.kcal+'</b><small>cal</small></div></div>'; }
function openRecipe(phase,i){
  var r=(CF.RECIPES[phase]||CF.RECIPES.general)[i]; if(!r) return;
  var legend=[['Protein','var(--teal)',r.p+'g'],['Carbs','var(--plum)',r.c+'g'],['Fat','#C2693B',r.f+'g'],['Fibre','#5E8C61',r.fiber+'g']];
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="max-height:90%;overflow-y:auto"><div class="grab"></div>'+
    '<div class="spread"><span class="src" style="color:var(--teal)">RECIPE</span><span class="muted" style="font-size:12px">★ '+r.rating+' · '+r.serv+' serving'+(r.serv>1?'s':'')+'</span></div>'+
    '<div class="h1" style="font-size:22px;margin:2px 0 2px">'+r.emoji+' '+r.name+'</div>'+
    '<p class="sub" style="margin:0">'+r.mins+' min'+(r.tags?' · '+r.tags.join(' · '):'')+'</p>'+
    '<div class="card" style="margin-top:12px"><div class="row" style="align-items:center;gap:16px">'+macroDonut(r)+
      '<div style="flex:1">'+legend.map(function(l){return '<div class="spread" style="margin:3px 0"><span style="font-size:12.5px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+l[1]+';margin-right:7px;vertical-align:middle"></span>'+l[0]+'</span><b class="num-hide" style="font-size:12.5px">'+l[2]+'</b></div>';}).join('')+
      '<div style="border-top:1px solid var(--line);margin-top:5px;padding-top:5px"><span class="muted" style="font-size:11px">Iron '+r.iron+'mg · Calcium '+r.calcium+'mg</span></div></div></div></div>'+
    '<div class="h2">Ingredients</div><div class="card">'+r.ingredients.map(function(x){return '<div style="font-size:14px;padding:6px 0;border-bottom:1px solid var(--line)">• '+x+'</div>';}).join('')+'</div>'+
    '<div class="h2">Method</div><div class="card">'+r.steps.map(function(s,si){return '<div class="row" style="gap:10px;align-items:flex-start;margin-bottom:'+(si===r.steps.length-1?'0':'12px')+'"><span class="pill" style="background:var(--surface2);flex:0 0 auto;font-weight:700">'+(si+1)+'</span><div style="font-size:14px;line-height:1.45">'+s+'</div></div>';}).join('')+'</div>'+
    '<button class="btn" data-act="rlog:'+phase+':'+i+'" style="margin-top:14px">＋ Add to '+draftSection+'</button>'+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Close</button></div>'); }
function openPlan(i){
  var p=CF.MEAL_PLANS[i]; if(!p) return;
  var secs=[['b','🌅 Breakfast'],['l','☀️ Lunch'],['dn','🌙 Dinner'],['s','🍎 Snack']];
  var days=p.sample.map(function(day){
    return '<div class="card"><b style="font-size:14px">'+day.d+'</b>'+
      secs.map(function(sx){ return '<div class="spread" style="margin-top:8px"><span class="muted" style="font-size:12px">'+sx[1]+'</span><span style="font-size:13px;font-weight:600;text-align:right;max-width:62%">'+(day[sx[0]]||'—')+'</span></div>'; }).join('')+
    '</div>';
  }).join('');
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="max-height:90%;overflow-y:auto"><div class="grab"></div>'+
    '<span class="src" style="color:var(--teal)">MEAL PLAN</span>'+
    '<div class="h1" style="font-size:22px;margin:2px 0 2px">'+p.name+'</div>'+
    '<p class="sub" style="margin:0">'+p.days+' days · ~'+p.kcal+' kcal/day</p>'+
    '<p style="margin:10px 0 0;font-size:13.5px;line-height:1.5;color:var(--ink2)">'+p.why+'</p>'+
    '<div class="h2">Sample days</div>'+days+
    '<button class="btn" data-act="plan:start:'+i+'" style="margin-top:14px">Start this plan</button>'+
    '<button class="btn ghost" data-act="plan:logday:'+i+'" style="margin-top:8px">Log Day 1 to today</button>'+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Close</button></div>'); }
function openCreateMenu(){
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;margin:2px 0 10px">Create</div>'+
    optRow('create:food','🍎','Food','A single custom food')+
    optRow('create:recipe','🍲','Recipe','Ingredients + cooking steps')+
    optRow('create:meal','🍱','Meal','Save a combo you eat together')+
    optRow('create:plan','🗓️','Meal plan','A multi-day plan')+
    '<button class="btn ghost" data-act="close" style="margin-top:10px">Cancel</button></div>'); }

views.integrations=function(){
  return '<div class="pad">'+
    '<button class="pill" data-act="tab:me" style="background:var(--surface2);border:1px solid var(--line);cursor:pointer;margin-top:4px">‹ Back</button>'+
    '<div class="h1">Connected apps</div>'+
    '<p class="sub">HerFuel reads from your devices to cut manual logging and (with a module on) sharpen your coaching — and writes your nutrition back to Apple Health.</p>'+
    CF.INTEGRATIONS.map(function(it){ var on=!!S.connected[it.id];
      var data = (on && CF.INTDATA[it.id]) ? '<div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
        CF.INTDATA[it.id].map(function(r){return '<div style="background:var(--surface2);border-radius:10px;padding:9px 11px"><div class="muted" style="font-size:11px">'+r[0]+'</div><div class="num-hide" style="font-weight:700;font-size:14px">'+r[1]+'</div></div>';}).join('')+'</div>' : '';
      return '<div class="card" style="'+(on?'border-color:var(--teal)':'')+'"><div class="spread"><div class="row"><div class="ic" style="width:38px;height:38px;border-radius:11px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:19px">'+it.icon+'</div><b style="font-size:15px">'+it.name+'</b></div>'+
        '<span class="pill" data-act="conn:'+it.id+'" style="background:'+(on?'var(--teal)':'var(--surface2)')+';color:'+(on?'#fff':'var(--ink)')+';border:1px solid '+(on?'var(--teal)':'var(--line)')+';cursor:pointer">'+(on?'Disconnect':'Connect')+'</span></div>'+
        '<p class="sub" style="margin-top:10px"><b>Imports:</b> '+it.imports+'</p>'+(it.exports?'<p class="sub" style="margin-top:4px"><b>Writes back:</b> '+it.exports+'</p>':'')+
        (on?'<div class="muted" style="font-size:11px;font-weight:700;letter-spacing:.5px;margin-top:14px">LIVE DATA</div>'+data:'')+'</div>';
    }).join('')+
    '<div class="card" style="border-color:var(--ink)"><b style="font-size:14px">Why we don’t auto-add “calories burned”</b>'+
      '<p class="sub" style="margin-top:8px">Wearable activity informs your <i>context and coaching</i>, not a secret calorie bump. Your target moves on your life-stage module (real science) — never on a fuzzy burn estimate. '+evBadge('supported')+'</p></div>'+
  '</div>';
};

/* overlay */
function showOverlay(h){ overlay.innerHTML=h; overlay.classList.add('show'); document.body.classList.add('hide-fab'); }
function hideOverlay(){ overlay.classList.remove('show'); overlay.innerHTML=''; document.body.classList.remove('hide-fab'); }

var OB=[
  { art:'🍽️', bg:'var(--surface2)', title:'A nutrition tracker that works for you',
    body:'Fast, accurate food logging — calories, macros, the lot. Use it exactly as much as you want, with optional features built for your body.', cta:'Get started' },
  { art:'🤍', bg:'var(--teal-soft)', title:'How would you like to start?', choose:true, cta:'' },
];
function renderOB(){
  var step=OB[S.obStep], choose='';
  if(step.choose){
    if(!S.obTailor){
      choose='<div style="margin:8px 0">'+
        '<div class="opt" data-act="ob:general"><div class="ic">🍽️</div><div><div class="t">Just track my nutrition</div><div class="s">A clean, fast macro tracker — nothing extra</div></div></div>'+
        '<div class="opt" data-act="ob:tailor"><div class="ic">✨</div><div><div class="t">Tailor it to my body</div><div class="s">Turn on a life-stage module for adaptive guidance</div></div></div>'+
        '<p class="muted" style="font-size:12px;text-align:center;margin-top:6px">You can change this anytime — nothing is locked in.</p></div>';
    } else {
      choose='<p class="sub" style="margin:4px 0 8px">Pick what fits you now (optional — change anytime):</p>'+
        CF.MODULES.map(function(md){var s=CF.STAGES[md.key];
          return '<div class="opt" data-act="ob:pick:'+md.key+'"><div class="ic">'+s.emoji+'</div><div><div class="t">'+s.label+'</div><div class="s">'+s.sub+'</div></div></div>';}).join('')+
        '<div class="opt" data-act="ob:general"><div class="ic">🍽️</div><div><div class="t">Actually, just track for now</div><div class="s">Start general — add a module later</div></div></div>';
    }
  }
  return '<div class="full"><div class="pad"><div class="ob-art" style="background:'+step.bg+'">'+step.art+'</div>'+
    '<div class="h1">'+step.title+'</div><p class="sub">'+(step.body||'')+'</p>'+choose+
    '<div style="flex:1"></div><div class="ob-dots">'+OB.map(function(_,k){return '<i class="'+(k===S.obStep?'on':'')+'"></i>';}).join('')+'<i></i></div>'+
    (step.cta?'<button class="btn" data-act="ob:next">'+step.cta+'</button>':'')+
    '</div></div>';
}
function renderPaywall(){
  return '<div class="full"><div class="pad"><div class="ob-art" style="background:var(--teal-soft);font-size:60px">🌿</div>'+
    '<div class="h1">Start your 7-day free trial</div><p class="sub">A great tracker'+(S.activeModule?' — tailored to your '+CF.STAGES[S.activeModule].label.toLowerCase()+' stage':'')+'. Add or change modules anytime.</p>'+
    '<div class="card" style="margin-top:16px">'+['Fast logging — scan, voice, copy meals','Accurate macros & micros (USDA + branded)','Optional life-stage modules — on your terms','No-numbers mode · no body shame, ever','Private &amp; encrypted — never sold']
      .map(function(x){return '<div class="row" style="padding:7px 0"><span style="color:var(--teal)">✓</span><span style="font-size:14px">'+x+'</span></div>';}).join('')+'</div>'+
    '<div style="flex:1"></div><p class="muted" style="text-align:center;font-size:12px;margin:8px 0">No payment now. We’ll remind you 2 days before it ends.</p>'+
    '<button class="btn teal" data-act="ob:finish">Start free trial</button>'+
    '<p class="muted" style="text-align:center;font-size:11px;margin-top:10px">Cancel anytime in two taps · Terms · Privacy</p></div></div>';
}

/* log flow */
/* ＋ fans out in place (no modal yet) — a modal opens only after the user picks an action */
var logMenuOpen=false;
/* the ＋ button's quick actions are user-configurable (Me → Quick-add). Catalog of choices: */
var LOG_CATALOG={
  search:['🔍','Search food','log:search'], scan:['📷','Scan food','log:scan'],
  saved:['🔖','Saved foods','log:saved'], exercise:['🏃‍♀️','Log exercise','log:exercise'],
  barcode:['▥','Scan barcode','log:barcode'], water:['💧','Log water','water:log'],
  voice:['🎙️','Voice / describe','log:voice'], copy:['↻','Copy yesterday','log:copy'],
  createfood:['＋','Create a food','create:food'], fasting:['⏳','Fasting timer','fasting:open'] };
var FAB_DEFAULT=['search','scan','saved','exercise'];
function fabKeys(){ var k=(S.fabActions&&S.fabActions.length)?S.fabActions:FAB_DEFAULT; return k.filter(function(x){return LOG_CATALOG[x];}).slice(0,4); }
function openLogMenu(){
  closeLogMenu();
  var keys=fabKeys();
  var el=document.createElement('div'); el.id='fabmenu';
  el.innerHTML='<div class="fabmenu-scrim" data-act="logclose"></div><div class="fabmenu-items">'+
    '<span class="fabmenu-cap">Quick add</span>'+
    keys.map(function(k,i){var c=LOG_CATALOG[k]; return '<button class="fab-item" style="--i:'+(keys.length-i)+'" data-act="'+c[2]+'"><span class="fi-ic">'+c[0]+'</span>'+c[1]+'</button>';}).join('')+
    '</div>';
  phone.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('show'); });
  document.body.classList.add('fab-open'); logMenuOpen=true; }
function openFabConfig(){
  var sel=S.fabActions||FAB_DEFAULT;
  var rows=Object.keys(LOG_CATALOG).map(function(k){var c=LOG_CATALOG[k];var n=sel.indexOf(k);
    return '<div class="opt" data-act="fab:'+k+'"><div class="ic">'+c[0]+'</div><div style="flex:1"><div class="t">'+c[1]+'</div></div>'+
      (n>=0?'<span class="pill" style="background:var(--teal);color:#fff">'+(n+1)+'</span>':'<span class="muted" style="font-size:20px">＋</span>')+'</div>';}).join('');
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="max-height:90%;overflow-y:auto"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;margin:2px 0 2px">Quick-add (＋) button</div>'+
    '<p class="sub">Pick up to 4 actions — they appear when you tap ＋. The number shows their order.</p>'+
    '<div style="margin-top:8px">'+rows+'</div>'+
    '<button class="btn ghost" data-act="close" style="margin-top:10px">Done</button></div>'); }
function closeLogMenu(){ var el=document.getElementById('fabmenu'); if(el) el.parentNode.removeChild(el); document.body.classList.remove('fab-open'); logMenuOpen=false; }
function openLogMore(){
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="spread"><div class="h1" style="font-size:20px;margin:2px 0">More ways to add</div><span class="pill" style="background:var(--surface2)">to '+draftSection+'</span></div>'+
    '<div style="margin-top:8px"></div>'+
    optRow('log:voice','🎙️','Voice / describe','Say or type what you ate')+
    optRow('log:barcode','▥','Scan barcode','Packaged foods')+
    optRow('create:food','＋','Create a food','Add a custom food')+
    optRow('log:copy','↻','Copy yesterday','Re-log a repeat day')+
    '</div>'); }
/* per-meal add dialog — opens with a "Recommended" list of what you usually log at that meal */
function mealRecs(section){
  var map={Breakfast:['oats','eggs','yogurt','smoothie','pbtoast'],Lunch:['chicken','lentil','salmon','spinach','cottage'],
    Dinner:['salmon','chicken','spinach','lentil','eggs'],Snack:['cottage','yogurt','pbtoast','smoothie']};
  return (map[section]||['chicken','eggs','yogurt']).map(function(id){return CF.foodById(id);}).filter(Boolean); }
function openAddTo(section){
  draftSection=section;
  var quick='<div class="row" style="gap:8px;margin:4px 0 6px">'+
    '<button class="btn ghost" data-act="log:search" style="margin:0;padding:10px">🔍 Search</button>'+
    '<button class="btn ghost" data-act="log:scan" style="margin:0;padding:10px">📷 Scan</button>'+
    '<button class="btn ghost" data-act="log:saved" style="margin:0;padding:10px">🔖 Saved</button></div>';
  var recs=mealRecs(section).map(function(f){return '<div class="opt" data-act="pick:'+f.id+'"><div class="ic">'+f.emoji+'</div><div style="flex:1"><div class="t">'+f.name+'</div><div class="s">'+f.kcal+' cal · '+f.serving+'</div></div><span style="color:var(--teal);font-size:22px">+</span></div>';}).join('');
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="max-height:90%;overflow-y:auto"><div class="grab"></div>'+
    '<div class="spread"><div class="h1" style="font-size:20px;margin:2px 0">Add to '+section+'</div><span class="pill" style="background:var(--surface2)">'+section+'</span></div>'+
    quick+
    '<div class="h2" style="margin-top:10px">⭐ You usually log at '+section.toLowerCase()+'</div>'+recs+
    '<button class="btn ghost" data-act="log:more" style="margin-top:8px">More ways to add</button>'+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Cancel</button></div>'); }
function openSaved(){
  var meals=CF.MEALS_SAVED.map(function(sm,i){return '<div class="opt" data-act="meal:'+i+'"><div class="ic">🍱</div><div style="flex:1"><div class="t">'+sm.name+'</div><div class="s">'+sm.items.map(function(id){return CF.foodById(id).name;}).join(' + ')+' · '+sm.kcal+' cal</div></div><span style="color:var(--teal);font-size:22px">+</span></div>';}).join('');
  var foods=CF.FOODS.slice(0,6).map(function(f){return '<div class="opt" data-act="pick:'+f.id+'"><div class="ic">'+f.emoji+'</div><div style="flex:1"><div class="t">'+f.name+'</div><div class="s">'+f.kcal+' cal · '+f.serving+'</div></div><span style="color:var(--teal);font-size:22px">+</span></div>';}).join('');
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;margin:2px 0 8px">Saved foods &amp; meals</div>'+
    '<div class="h2" style="margin-top:0">My meals</div>'+ meals + optRow('create:meal','＋','Create a meal','Save a combo you eat often')+
    '<div class="h2">Recent &amp; favourite foods</div>'+ foods +'</div>'); }
function openSymptoms(){
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;margin:2px 0 4px">Log how you feel</div>'+
    '<p class="sub">Tap any that apply today. We connect these to your food &amp; phase — read from Apple Health where available, or add here.</p>'+
    '<div class="sym" style="margin-top:8px">'+CF.SYMPTOM_OPTIONS.map(function(s){var on=S.wellbeing[s]?' on':''; return '<button class="'+(on?'on':'')+'" data-act="sym:'+encodeURIComponent(s)+'">'+s+'</button>';}).join('')+'</div>'+
    '<button class="btn" style="margin-top:14px" data-act="symsave">Save</button><button class="btn ghost" style="margin-top:8px" data-act="close">Cancel</button></div>'); }
function openSearch(){ showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
  '<div class="h1" style="font-size:20px;margin:2px 0 10px">Search foods</div>'+
  '<div class="card" style="padding:12px;margin-bottom:10px"><span class="muted">🔍 Describe what you ate…</span></div>'+
  CF.FOODS.map(function(f){return '<div class="opt" data-act="pick:'+f.id+'"><div class="ic">'+f.emoji+'</div><div style="flex:1"><div class="t">'+f.name+'</div><div class="s">'+f.kcal+' cal · '+f.serving+'</div></div><span style="color:var(--teal);font-size:22px">+</span></div>';}).join('')+'</div>'); }
function openCreateFood(){ showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="max-height:90%;overflow-y:auto"><div class="grab"></div>'+
  '<div class="h1" style="font-size:20px;margin:2px 0 10px">Create a food</div>'+
  finp('cf_name','Name','e.g. Mom’s granola')+ finp('cf_serv','Serving','e.g. 1 cup')+
  '<div class="frow">'+finp('cf_kcal','Calories','kcal','number')+finp('cf_p','Protein (g)','','number')+'</div>'+
  '<div class="frow">'+finp('cf_c','Carbs (g)','','number')+finp('cf_f','Fat (g)','','number')+'</div>'+
  '<button class="btn" data-act="cf:save" style="margin-top:10px">Save food</button><button class="btn ghost" data-act="close" style="margin-top:8px">Cancel</button></div>');
  setTimeout(function(){var e=document.getElementById('cf_name');if(e)e.focus();},60); }
function openCreateRecipe(){ showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="max-height:90%;overflow-y:auto"><div class="grab"></div>'+
  '<div class="h1" style="font-size:20px;margin:2px 0 10px">Create a recipe</div>'+
  finp('cr_name','Name','e.g. My lentil curry')+
  '<div class="frow">'+finp('cr_kcal','Calories / serving','kcal','number')+finp('cr_mins','Time (min)','','number')+'</div>'+
  '<label class="finp"><span>Ingredients (one per line)</span><textarea id="cr_ing" rows="4" placeholder="1 cup red lentils&#10;2 cups spinach&#10;…"></textarea></label>'+
  '<label class="finp"><span>Method (one step per line)</span><textarea id="cr_steps" rows="4" placeholder="Sauté onion &amp; spices&#10;Add lentils &amp; water; simmer&#10;…"></textarea></label>'+
  '<button class="btn" data-act="cr:save" style="margin-top:10px">Save recipe</button><button class="btn ghost" data-act="close" style="margin-top:8px">Cancel</button></div>');
  setTimeout(function(){var e=document.getElementById('cr_name');if(e)e.focus();},60); }
function openCreateMeal(){ var picks=CF.FOODS.map(function(f){return '<label class="fcheck"><input type="checkbox" value="'+f.id+'"/><span>'+f.emoji+' '+f.name+'</span><span class="muted num-hide" style="margin-left:auto;font-size:12px">'+f.kcal+' cal</span></label>';}).join('');
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet" style="max-height:90%;overflow-y:auto"><div class="grab"></div>'+
  '<div class="h1" style="font-size:20px;margin:2px 0 10px">Create a meal</div>'+
  finp('cm_name','Name','e.g. My usual breakfast')+
  '<div class="muted" style="font-size:12px;margin:10px 0 6px">Pick the foods in this meal</div><div class="picklist">'+picks+'</div>'+
  '<button class="btn" data-act="cm:save" style="margin-top:10px">Save meal</button><button class="btn ghost" data-act="close" style="margin-top:8px">Cancel</button></div>');
  setTimeout(function(){var e=document.getElementById('cm_name');if(e)e.focus();},60); }
function openExercise(){ showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
  '<div class="h1" style="font-size:20px;margin:2px 0 8px">Log exercise</div>'+
  optRow('ex:save','🏃‍♀️','Run','Running, jogging')+optRow('ex:save','🏋️‍♀️','Strength','Weights, resistance')+optRow('ex:save','🧘‍♀️','Yoga / mobility','Gentle movement')+optRow('ex:save','✏️','Describe it','Free text → AI estimate')+
  '<p class="muted" style="font-size:12px;margin-top:8px">Note: in a module, exercise informs <i>context</i> — it won’t silently inflate your calorie target.</p></div>'); }
function openGoals(){ var T=target();
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
  '<div class="h1" style="font-size:20px;margin:2px 0 4px">Calorie &amp; macro goals</div>'+
  '<p class="sub">'+(S.activeModule?'Set by your '+mod().label.toLowerCase()+' module (evidence-based).':'Set from your profile.')+' Tap to adjust.</p>'+
  [['Calories',T.kcal+' kcal'],['Protein',T.protein+' g'],['Carbs',(CF.GENERAL.carbs)+' g'],['Fat','60 g']].map(function(r){return '<div class="opt"><div style="flex:1"><div class="t">'+r[0]+'</div></div><span class="num-hide" style="font-weight:700">'+r[1]+'</span></div>';}).join('')+
  '<button class="btn" data-act="close" style="margin-top:10px">Done</button></div>'); }
function draftFromFood(f,src){ return {title:f.name,source:src||'Database',emoji:f.emoji,kcal:f.kcal,p:f.p,c:f.c,f:f.f,iron:f.iron,calcium:f.calcium,mag:f.mag,fiber:f.fiber,foodId:f.id,parts:[[f.name,f.serving]]}; }
var pendingDraft=null, draftSection='Snack';
function showDraft(d){ var m=mod(), hl='';
  if(m){ if((m.key==='breastfeeding'||m.key==='perimenopause') && d.p>=18) hl='<div class="pill" style="background:var(--teal-soft);color:var(--teal);margin-top:10px">💪 High in protein — supports '+(m.key==='breastfeeding'?'recovery &amp; supply':'muscle')+'</div>';
    else if(m.key==='pregnancy' && d.iron>=2) hl='<div class="pill" style="background:var(--surface2);color:'+m.color+';margin-top:10px">🩸 Iron-rich — great in pregnancy</div>'; }
  var secs=['Breakfast','Lunch','Dinner','Snack'].map(function(s){var on=s===draftSection; return '<span class="pill" data-act="sec:'+s+'" style="cursor:pointer;background:'+(on?'var(--ink)':'var(--surface2)')+';color:'+(on?'#fff':'var(--ink)')+';margin:0 6px 0 0">'+s+'</span>';}).join('');
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet draft"><div class="grab"></div>'+
    '<div class="src">✨ '+d.source+'</div><div class="h1" style="font-size:20px;margin:0 0 2px">'+d.title+'</div>'+
    '<p class="sub">Check it’s right, then confirm. Tap any item to fix.</p>'+
    (/AI|Photo|Voice/.test(d.source)?'<div class="pill" style="background:#FBEEDD;color:#9A6A1F;margin:0 0 8px">~80% confident — AI estimates portions; tap an item to adjust</div>':'')+
    '<div style="display:flex;flex-wrap:wrap;margin:8px 0 4px">'+secs+'</div>'+
    '<div class="macro-row"><div class="macro"><b>'+d.kcal+'</b><small>kcal</small></div><div class="macro"><b>'+d.p+'g</b><small>protein</small></div><div class="macro"><b>'+d.c+'g</b><small>carbs</small></div><div class="macro"><b>'+d.f+'g</b><small>fat</small></div></div>'+hl+
    '<div style="margin:12px 0 4px"><span class="h2" style="margin:0">Ingredients</span></div>'+
    d.parts.map(function(p){return '<div class="ingredient"><span>'+p[0]+'</span><span class="muted">'+p[1]+'</span></div>';}).join('')+
    '<button class="btn" style="margin-top:16px" data-act="confirm">Confirm &amp; log to '+draftSection+'</button><button class="btn ghost" style="margin-top:8px" data-act="close">Cancel</button></div>');
  pendingDraft=d; }
function commitDraft(){ if(!pendingDraft) return; var f=pendingDraft.foodId?CF.foodById(pendingDraft.foodId):null;
  if(!f){ f={id:'ai'+CF.FOODS.length,name:pendingDraft.title,emoji:pendingDraft.emoji,serving:'1 serving',kcal:pendingDraft.kcal,p:pendingDraft.p,c:pendingDraft.c,f:pendingDraft.f,iron:pendingDraft.iron,calcium:pendingDraft.calcium,mag:pendingDraft.mag,fiber:pendingDraft.fiber}; CF.FOODS.push(f); }
  S.meals.push({foodId:f.id,time:'now',meal:draftSection}); pendingDraft=null; save(); hideOverlay(); set({tab:'today'}); toast('Logged to '+draftSection+'.'); }
function copyYesterday(){ CF.DEMO.yesterday.forEach(function(m){ S.meals.push({foodId:m.foodId,time:'copied',meal:m.meal}); }); save(); hideOverlay(); set({tab:'today'}); toast('↻ 3 meals copied from yesterday.'); }
function toast(msg){ var el=document.createElement('div'); el.className='toast'; el.innerHTML='✓ '+msg; phone.appendChild(el); setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },2400); }

/* ---------- FEEDBACK MODE ---------- */
var pendingFb='', pendingFbPos=null, pendingShot=null, lastExport='', suppressNextClick=false;
var shotStream=null, shotVideo=null;
function ensureShotStream(){
  if(shotVideo && shotStream && shotStream.active) return Promise.resolve(shotVideo);
  if(!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return Promise.reject('unsupported');
  return navigator.mediaDevices.getDisplayMedia({video:true, audio:false, preferCurrentTab:true}).then(function(stream){
    shotStream=stream; shotVideo=document.createElement('video'); shotVideo.srcObject=stream; shotVideo.muted=true;
    return shotVideo.play().then(function(){
      return new Promise(function(res){ if(shotVideo.videoWidth) return res(shotVideo); shotVideo.onloadedmetadata=function(){ res(shotVideo); }; }); }); }); }
function startAreaSelect(){
  var ov=document.createElement('div'); ov.id='areasel';
  ov.innerHTML='<div class="as-hint">Drag to select an area · Esc to cancel</div><div class="as-rect" style="display:none"></div>';
  document.body.appendChild(ov);
  var rectEl=ov.querySelector('.as-rect'), sx=0, sy=0, active=false;
  function place(x,y){ var l=Math.min(sx,x),t=Math.min(sy,y); rectEl.style.left=l+'px';rectEl.style.top=t+'px';rectEl.style.width=Math.abs(x-sx)+'px';rectEl.style.height=Math.abs(y-sy)+'px'; }
  function down(e){ sx=e.clientX; sy=e.clientY; active=true; rectEl.style.display='block'; place(sx,sy); e.preventDefault(); }
  function move(e){ if(active) place(e.clientX,e.clientY); }
  function up(e){ if(!active) return; active=false;
    var l=Math.min(sx,e.clientX),t=Math.min(sy,e.clientY),w=Math.abs(e.clientX-sx),h=Math.abs(e.clientY-sy);
    cleanup(); suppressNextClick=true;
    if(w<8||h<8){ return toast('Selection too small — try again.'); }
    captureRegion({x:l,y:t,w:w,h:h}); }
  function esc(e){ if(e.key==='Escape'){ cleanup(); } }
  function cleanup(){ document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); document.removeEventListener('keydown',esc); if(ov.parentNode) ov.parentNode.removeChild(ov); }
  ov.addEventListener('mousedown',down); document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); document.addEventListener('keydown',esc); }
function captureRegion(rect){
  toast('Capturing… (allow screen share if asked)');
  ensureShotStream().then(function(video){
    setTimeout(function(){   /* let the selection overlay clear from the captured frame */
      var sx=video.videoWidth/window.innerWidth, sy=video.videoHeight/window.innerHeight;
      var c=document.createElement('canvas'); c.width=Math.max(1,Math.round(rect.w*sx)); c.height=Math.max(1,Math.round(rect.h*sy));
      c.getContext('2d').drawImage(video, rect.x*sx, rect.y*sy, rect.w*sx, rect.h*sy, 0,0,c.width,c.height);
      pendingShot=c.toDataURL('image/png');
      var sr=screen.getBoundingClientRect();
      pendingFbPos={x:Math.round(rect.x+rect.w/2-sr.left), y:Math.round(rect.y+rect.h/2-sr.top+screen.scrollTop)};
      openFbComment('📷 Area on '+S.tab);
    }, 90);
  }).catch(function(){ pendingShot=null; toast('Screenshot skipped — add a comment anyway.'); openFbComment('📷 Area on '+S.tab); }); }
function captureLabel(t){ var el=t.closest('.card,.meal,.opt,.ring,.toggle,.h2,.h1,button,.pill,.coach'); if(!el) return S.tab;
  var lab=el.querySelector('.nm,.t,b,h3,.lbl'); var txt=((lab?lab.textContent:el.textContent)||'').replace(/\s+/g,' ').trim(); return txt.slice(0,55)||S.tab; }
function openFbComment(targetLabel){ pendingFb=targetLabel;
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="src" style="color:var(--plum)">💬 Feedback</div><div class="h1" style="font-size:18px;margin:0 0 2px">On: '+targetLabel+'</div>'+
    '<p class="sub">What would you change, add, or love about this? (Screen: '+S.tab+')</p>'+
    (pendingShot?'<img class="shotprev" src="'+pendingShot+'" alt="selected area"/>':'')+
    '<textarea id="fbtext" rows="4" placeholder="Type your feedback…" style="width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;padding:12px;font-size:15px;font-family:inherit;margin-top:8px"></textarea>'+
    '<button class="btn" style="margin-top:12px" data-act="fbsave">Save feedback</button><button class="btn ghost" style="margin-top:8px" data-act="close">Cancel</button></div>');
  setTimeout(function(){ var t=document.getElementById('fbtext'); if(t) t.focus(); },60); }
function saveFb(){ var t=document.getElementById('fbtext'); var v=t?t.value.trim():''; if(!v){ hideOverlay(); return; }
  var comp=pendingFb, scr=S.tab, pos=pendingFbPos, shot=pendingShot;
  var n=S.feedback.length+1;
  S.feedback.push({n:n, screen:scr, target:comp, text:v, pos:pos, shot:!!shot, ts:nowStr()}); save(); pendingFbPos=null; pendingShot=null; hideOverlay(); render();
  toast(shot?'Sent with screenshot 📷':'Feedback saved — thank you!');
  /* Tier-3 live bridge: when served by live-server.js, send the comment (+ optional screenshot) to Claude's inbox */
  try{ fetch('/comment',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({n:n, component:comp, screen:scr, text:v, pos:pos, shot:shot})})
    .then(function(r){ if(r&&r.ok) toast('Sent to Claude 👋 — making the change…'); }).catch(function(){}); }catch(e){} }
function renderPins(){
  var old=document.getElementById('fbpins'); if(old) old.parentNode.removeChild(old);
  if(!S.fbMode) return;
  var pinned=S.feedback.filter(function(f){return f.pos && f.screen===S.tab;});
  if(!pinned.length) return;
  var layer=document.createElement('div'); layer.id='fbpins';
  layer.innerHTML=pinned.map(function(f){return '<span class="fbpin" style="left:'+f.pos.x+'px;top:'+f.pos.y+'px" title="'+(f.text||'').replace(/"/g,'&quot;')+'">'+f.n+'</span>';}).join('');
  screen.appendChild(layer); }
function nowStr(){ try{ return new Date().toLocaleString(); }catch(e){ return ''; } }
function openFbList(){
  var items = S.feedback.length ? S.feedback.map(function(f,i){return '<div class="card" style="padding:12px"><div class="muted" style="font-size:11px">['+f.screen+'] '+f.target+'</div><div style="margin-top:4px;font-size:14px">'+f.text+'</div></div>';}).join('') : '<p class="sub" style="text-align:center;padding:18px 0">No feedback yet. Turn on feedback mode and tap any feature.</p>';
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="spread"><div class="h1" style="font-size:20px;margin:2px 0">Your feedback ('+S.feedback.length+')</div></div>'+
    items + (S.feedback.length?'<button class="btn" data-act="fbexport" style="margin-top:12px">Export / copy all</button><button class="btn ghost" data-act="fbclear" style="margin-top:8px">Clear</button>':'')+
    '<button class="btn ghost" data-act="close" style="margin-top:8px">Close</button></div>'); }
function openFbExport(){
  lastExport = 'HerFuel prototype feedback ('+S.feedback.length+' notes)\n\n'+S.feedback.map(function(f,i){return (i+1)+'. ['+f.screen+'] '+f.target+'\n   '+f.text+(f.ts?'\n   ('+f.ts+')':'');}).join('\n\n');
  showOverlay('<div class="scrim" data-act="close"></div><div class="sheet"><div class="grab"></div>'+
    '<div class="h1" style="font-size:20px;margin:2px 0 8px">Export feedback</div>'+
    '<textarea readonly rows="12" style="width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;padding:12px;font-size:13px;font-family:inherit">'+lastExport.replace(/</g,'&lt;')+'</textarea>'+
    (FB_ENDPOINT.indexOf('YOUR_FORM_ID')<0?'<button class="btn" data-act="fbsend" style="margin-top:10px">Send to me</button>':'')+
    '<button class="btn'+(FB_ENDPOINT.indexOf('YOUR_FORM_ID')<0?' ghost':'')+'" data-act="fbcopy" style="margin-top:10px">Copy to clipboard</button><button class="btn ghost" data-act="close" style="margin-top:8px">Close</button></div>'); }
function fbSend(){
  if(FB_ENDPOINT.indexOf('YOUR_FORM_ID')>=0){ return toast('Set FB_ENDPOINT in app.js first.'); }
  toast('Sending…');
  fetch(FB_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({app:'HerFuel v5 prototype',count:S.feedback.length,feedback:lastExport})})
    .then(function(r){ hideOverlay(); toast(r.ok?'Sent — thank you! 💜':'Couldn’t send — try Copy instead.'); })
    .catch(function(){ hideOverlay(); toast('Offline — try Copy instead.'); }); }
function renderFbBar(){
  var bar=document.getElementById('fbbar');
  if(!S.fbMode){ if(bar) bar.parentNode.removeChild(bar); document.body.classList.remove('fb-on'); return; }
  document.body.classList.add('fb-on');
  if(!bar){ bar=document.createElement('div'); bar.id='fbbar'; phone.appendChild(bar); }
  bar.innerHTML='<span>💬 Tap a feature to comment</span><span class="fbb-actions"><button data-fbctl="area">📷 Area</button><button data-fbctl="general">General</button><button data-fbctl="list">'+S.feedback.length+'</button><button data-fbctl="off">Done</button></span>';
}

/* render */
var TABS=[['today','Today','◉'],['meals','Meals','◍'],['circle','Circle','✿'],['progress','Progress','◔'],['me','Me','○']];
var CIRCLE_TABS=[['learn','Learn'],['watch','Watch'],['challenges','Challenges'],['groups','Groups']];
function render(){
  if(!S.collapsed) S.collapsed={}; if(S.dayOffset==null) S.dayOffset=0;  /* guard older saved state */
  if(!S.stagePos) S.stagePos={pregnancy:22,breastfeeding:9,cycle:23};
  if(S.gamify==null) S.gamify=true; if(S.stepsAdded==null) S.stepsAdded=0; if(!S.circleTab) S.circleTab='learn';
  if(!S.units) S.units={energy:'kcal',system:'us'};
  if(!S.profile) S.profile={name:'Maya',sex:'Female',age:31,height:'5’6"',weight:'148 lb',activity:'Lightly active'};
  if(!S.fabActions) S.fabActions=['search','scan','saved','exercise'];
  if(!S.circleCat) S.circleCat='For you'; if(!S.joinedGroups) S.joinedGroups=[]; if(!S.joinedChallenges) S.joinedChallenges=[]; if(!S.chat) S.chat={};
  if(!S.fasting) S.fasting={active:false,plan:'16:8',startTs:null};
  if(!S._tipsOpenV1){ if(S.collapsed) delete S.collapsed.coach; S._tipsOpenV1=true; }  /* migrate: tips now open by default */
  document.body.classList.toggle('hide-num',S.noNumbers);
  document.body.classList.toggle('hide-ev',!S.showEvidence);
  if(!S.onboarded){ if(S.obStep>=OB.length) showOverlay(renderPaywall()); else showOverlay(renderOB()); }
  screen.innerHTML=(views[S.tab]||views.today)();
  tabbar.innerHTML=TABS.map(function(t){return '<button class="tab'+(S.tab===t[0]?' on':'')+'" data-act="tab:'+t[0]+'"><span class="ico">'+t[2]+'</span>'+t[1]+'</button>';}).join('');
  renderFbBar(); wireCarousel(); renderPins(); wireCircleSearch();
}

/* actions */
function handle(act){
  if(!act) return;
  if(act==='logclose') return closeLogMenu();
  if(logMenuOpen) closeLogMenu();   /* picking any fan action collapses it, then opens that flow */
  if(act==='log:more') return openLogMore();
  if(act.indexOf('tab:')===0) return set({tab:act.slice(4)});
  if(act==='close') return hideOverlay();
  if(act==='log:scan') return showDraft(CF.AI.scan);
  if(act==='log:voice') return showDraft(CF.AI.voice);
  if(act==='log:search') return openSearch();
  if(act==='log:barcode') return showDraft(draftFromFood(CF.foodById('cottage'),'Barcode'));
  if(act==='log:exercise') return openExercise();
  if(act==='log:copy') return copyYesterday();
  if(act.indexOf('pick:')===0) return showDraft(draftFromFood(CF.foodById(act.slice(5)),'Database'));
  if(act.indexOf('sec:')===0){ draftSection=act.slice(4); return showDraft(pendingDraft); }
  if(act==='confirm') return commitDraft();
  if(act==='create:food') return openCreateFood();
  if(act==='create:recipe') return openCreateRecipe();
  if(act==='create:meal') return openCreateMeal();
  if(act==='cf:save'){ var nm=val('cf_name'); if(!nm) return toast('Add a name first.');
    var f={id:'u'+Date.now(),name:nm,emoji:'🍽️',serving:val('cf_serv')||'1 serving',kcal:+val('cf_kcal')||0,p:+val('cf_p')||0,c:+val('cf_c')||0,f:+val('cf_f')||0,iron:0,calcium:0,mag:0,fiber:0};
    S.customFoods.push(f); CF.FOODS.push(f); save(); hideOverlay(); return toast('Saved “'+nm+'” to My Foods.'); }
  if(act==='cr:save'){ var rn=val('cr_name'); if(!rn) return toast('Add a name first.');
    var r={name:rn,emoji:'🍲',kcal:+val('cr_kcal')||0,mins:+val('cr_mins')||0,rating:5,serv:1,p:0,c:0,f:0,fiber:0,iron:0,calcium:0,tags:['Mine'],ingredients:lines('cr_ing'),steps:lines('cr_steps'),items:[]};
    S.customRecipes.push(r); CF.RECIPES.mine=(CF.RECIPES.mine||[]).concat([r]); save(); hideOverlay(); return toast('Saved “'+rn+'” to My Recipes.'); }
  if(act==='cm:save'){ var mn=val('cm_name'); if(!mn) return toast('Add a name first.');
    var ids=[].map.call(document.querySelectorAll('.picklist input:checked'),function(x){return x.value;});
    if(!ids.length) return toast('Pick at least one food.');
    var kc=ids.reduce(function(a,id){var ff=CF.foodById(id);return a+(ff?ff.kcal:0);},0);
    var meal={name:mn,items:ids,kcal:kc}; S.customMeals.push(meal); CF.MEALS_SAVED.push(meal); save(); hideOverlay(); return toast('Saved “'+mn+'” to My Meals.'); }
  if(act==='ex:save'){ hideOverlay(); return toast('Exercise logged (demo).'); }
  if(act==='goals') return openGoals();
  if(act==='reminders'){ return toast('Reminders (demo).'); }
  if(act.indexOf('circletab:')===0) return set({circleTab:act.slice(10)});
  if(act.indexOf('circlecat:')===0) return set({circleCat:decodeURIComponent(act.slice(10))});
  if(act.indexOf('joinch:')===0){ var cid=act.slice(7); var ja=S.joinedChallenges.slice(); var jx=ja.indexOf(cid); if(jx>=0)ja.splice(jx,1);else ja.push(cid); S.joinedChallenges=ja; save(); render(); return toast(jx>=0?'Left challenge.':'Joined — good luck! 💪'); }
  if(act.indexOf('joingroup:')===0){ var gid=act.slice(10); if(S.joinedGroups.indexOf(gid)<0) S.joinedGroups.push(gid); save(); render(); openGroupChat(gid); return; }
  if(act.indexOf('chat:')===0) return openGroupChat(act.slice(5));
  if(act.indexOf('chatsend:')===0){ var gi=act.slice(9); var t=document.getElementById('chatInput'); var v=t?t.value.trim():''; if(!v) return; if(!S.chat[gi])S.chat[gi]=[]; S.chat[gi].push({who:'You',text:v,t:'now'}); save(); return openGroupChat(gi); }
  if(act==='profile') return openProfile();
  if(act==='fabconfig') return openFabConfig();
  if(act.indexOf('fab:')===0){ var fk=act.slice(4); var arr=(S.fabActions||FAB_DEFAULT).slice(); var fi=arr.indexOf(fk);
    if(fi>=0) arr.splice(fi,1); else { if(arr.length>=4){ toast('Pick up to 4 — remove one first.'); return; } arr.push(fk); }
    S.fabActions=arr; save(); return openFabConfig(); }
  if(act.indexOf('profile:')===0){ return toast('Edit '+act.slice(8)+' (demo).'); }
  if(act==='unit:energy'){ S.units.energy = S.units.energy==='kcal'?'kJ':'kcal'; return set({}); }
  if(act==='unit:system'){ S.units.system = S.units.system==='us'?'metric':'us'; return set({}); }
  if(act==='manageplan'){ return toast('Manage subscription (demo).'); }
  if(act.indexOf('support:')===0){ return toast(({help:'Help & support',feature:'Request a feature',rate:'Rate HerFuel',terms:'Terms & Privacy'}[act.slice(8)]||'Support')+' (demo).'); }
  if(act==='account:logout'){ return toast('Logged out (demo).'); }
  if(act==='account:delete'){ return toast('Delete account (demo) — would confirm twice.'); }
  if(act==='log:saved') return openSaved();
  if(act.indexOf('addto:')===0){ return openAddTo(act.slice(6)); }
  if(act==='toggle:snack') return set({snackOn:!S.snackOn});
  if(act.indexOf('day:')===0) return set({dayOffset:parseInt(act.slice(4),10)});
  if(act.indexOf('pos:')===0){ var mk=S.activeModule, pm=mk&&CF.posMeta[mk]; if(!pm) return;
    var nv=stagePos(mk)+parseInt(act.slice(4),10); S.stagePos[mk]=Math.max(pm.min,Math.min(pm.max,nv)); return set({}); }
  if(act.indexOf('collapse:')===0){ var ck=act.slice(9); S.collapsed[ck]=!S.collapsed[ck]; return set({}); }
  if(act==='logsym') return openSymptoms();
  if(act.indexOf('sym:')===0){ var sy=decodeURIComponent(act.slice(4)); S.wellbeing[sy]=!S.wellbeing[sy]; save(); return openSymptoms(); }
  if(act==='symsave'){ hideOverlay(); render(); return toast('Saved — your tips now reflect how you feel.'); }
  if(act.indexOf('conn:')===0){ var cid=act.slice(5); S.connected[cid]=!S.connected[cid]; return set({}); }
  if(act==='article') return toast('Opening article… (demo)');
  if(act==='water:8'){ S.waterOz+=8; return set({}); }
  if(act==='water:16'){ S.waterOz+=16; return set({}); }
  if(act==='water:undo'){ S.waterOz=Math.max(0,S.waterOz-8); return set({}); }
  if(act.indexOf('rowmenu:')===0) return openRowMenu(+act.slice(8));
  if(act.indexOf('mealcopy:')===0){ var cp=act.slice(9).split(':'); var src=S.meals[+cp[0]]; if(!src) return; var sec=cp[1];
    if(sec==='tomorrow'){ hideOverlay(); return toast('Copied to tomorrow (demo).'); }
    S.meals.push({foodId:src.foodId,time:'now',meal:sec}); save(); hideOverlay(); render(); return toast('Copied to '+sec+'.'); }
  if(act.indexOf('mealdel:')===0){ var di=+act.slice(8); var dn=S.meals[di]&&CF.foodById(S.meals[di].foodId); if(S.meals[di]){ S.meals.splice(di,1); save(); hideOverlay(); render(); toast('Removed'+(dn?' '+dn.name:'')+'.'); } return; }
  if(act==='fasting:open') return openFasting();
  if(act.indexOf('fasting:start:')===0){ S.fasting={active:true,plan:act.slice(14),startTs:Date.now()}; save(); hideOverlay(); render(); return toast('Fast started — you’ve got this.'); }
  if(act==='fasting:end'){ if(S.fasting) S.fasting.active=false; save(); hideOverlay(); render(); return toast('Fast ended. Nicely done.'); }
  if(act==='water:log') return openWaterLog();
  if(act.indexOf('wadd:')===0){ S.waterOz=Math.max(0,S.waterOz+parseInt(act.slice(5),10)); save(); render(); return openWaterLog(); }
  if(act==='steps:log') return openStepsLog();
  if(act.indexOf('sadd:')===0){ var base=(S.connected.garmin?8140:(S.connected.applehealth?6420:0)); S.stepsAdded=Math.max(-base,(S.stepsAdded||0)+parseInt(act.slice(5),10)); save(); render(); return openStepsLog(); }
  if(act.indexOf('measure:')===0) return set({measure:act.slice(8)});
  if(act==='addmeasure') return toast('Add measurement (demo).');
  if(act==='meals:create') return openCreateMenu();
  if(act.indexOf('my:')===0) return openMyList(act.slice(3));
  if(act.indexOf('recipe:')===0){ var rp=act.slice(7).split(':'); return openRecipe(rp[0],+rp[1]); }
  if(act.indexOf('rlog:')===0){ var qp=act.slice(5).split(':'); var rc=(CF.RECIPES[qp[0]]||[])[+qp[1]]; if(rc){ rc.items.forEach(function(id){S.meals.push({foodId:id,time:'now',meal:draftSection});}); save(); hideOverlay(); set({tab:'today'}); toast('Logged “'+rc.name+'” to '+draftSection+'.'); } return; }
  if(act.indexOf('meal:')===0){ var sm=CF.MEALS_SAVED[+act.slice(5)]; sm.items.forEach(function(id){S.meals.push({foodId:id,time:'now',meal:draftSection});}); save(); hideOverlay(); set({tab:'today'}); return toast('Logged “'+sm.name+'” to '+draftSection+'.'); }
  if(act.indexOf('plan:start:')===0){ hideOverlay(); return toast('Plan started (demo).'); }
  if(act.indexOf('plan:logday:')===0){ hideOverlay(); return toast('Day 1 logged (demo).'); }
  if(act.indexOf('plan:')===0){ return openPlan(+act.slice(5)); }
  if(act.indexOf('create:')===0){ hideOverlay(); return toast('Create flow (demo).'); }
  if(act==='module:general') return set({activeModule:null});
  if(act.indexOf('module:')===0){ var k=act.slice(7); return set({activeModule: S.activeModule===k?null:k}); }
  if(act==='toggle:nonum') return set({noNumbers:!S.noNumbers});
  if(act==='toggle:gamify') return set({gamify:!S.gamify});
  if(act==='milestones') return openMilestones();
  if(act==='streakinfo') return openStreakInfo();
  if(act==='badge:share'){ return toast('Shared your badge (demo).'); }
  if(act.indexOf('badge:')===0) return openBadge(act.slice(6));
  if(act==='toggle:ev') return set({showEvidence:!S.showEvidence});
  if(act==='toggle:demo'){ S.demo=!S.demo; if(S.demo) seedDemo(); else S.meals=[]; return set({}); }
  if(act==='ob:next') return set({obStep:S.obStep+1});
  if(act==='ob:general') return set({activeModule:null, obStep:OB.length});
  if(act==='ob:tailor') return set({obTailor:true});
  if(act.indexOf('ob:pick:')===0) return set({activeModule:act.slice(8), obStep:OB.length});
  if(act==='ob:finish'){ S.onboarded=true; S.obStep=0; hideOverlay(); return set({tab:'today'}); }
  if(act==='restart'){ S.onboarded=false; S.obStep=0; S.obTailor=false; return set({}); }
  /* feedback */
  if(act==='fbsave') return saveFb();
  if(act==='fbexport') return openFbExport();
  if(act==='fbsend') return fbSend();
  if(act==='fbcopy'){ try{ navigator.clipboard.writeText(lastExport); toast('Copied to clipboard.'); }catch(e){ toast('Select the text & copy.'); } return; }
  if(act==='fbclear'){ S.feedback=[]; save(); hideOverlay(); render(); return toast('Feedback cleared.'); }
}
function handleFbCtl(c){ if(c==='area') return startAreaSelect(); if(c==='general'){ pendingFbPos=null; pendingShot=null; return openFbComment('Overall ('+S.tab+')'); } if(c==='list') return openFbList(); if(c==='off') return set({fbMode:false}); }

/* delegated clicks: feedback controls → feedback capture → normal actions */
document.addEventListener('click',function(e){
  if(suppressNextClick){ suppressNextClick=false; e.preventDefault(); e.stopPropagation(); return; }   /* swallow the click that ends an area drag */
  var ctl=e.target.closest('[data-fbctl]'); if(ctl){ handleFbCtl(ctl.getAttribute('data-fbctl')); return; }
  if(S.fbMode){
    var inScreen=e.target.closest('#screen');
    var navOk=e.target.closest('#tabbar, [data-act^="tab:"], [data-act^="module:"]');
    if(inScreen && !navOk){ e.preventDefault(); e.stopPropagation();
      var sr=screen.getBoundingClientRect();
      pendingFbPos={x:Math.round(e.clientX-sr.left), y:Math.round(e.clientY-sr.top+screen.scrollTop)};
      openFbComment(captureLabel(e.target)); return; }
  }
  var el=e.target.closest('[data-act]'); if(!el) return; handle(el.getAttribute('data-act'));
});
fab.addEventListener('click',function(){ if(S.fbMode){ openFbComment('Log button (＋)'); return; } if(logMenuOpen) closeLogMenu(); else openLogMenu(); });
panel.addEventListener('click',function(e){ var el=e.target.closest('[data-act]'); if(!el) return; var a=el.getAttribute('data-act');
  if(a==='restart'){ S.onboarded=false; S.obStep=0; S.obTailor=false; set({}); }
  else if(a==='demo'){ S.demo=!S.demo; if(S.demo) seedDemo(); else S.meals=[]; set({}); }
  else if(a==='nonum'){ set({noNumbers:!S.noNumbers}); }
  else if(a==='fbtoggle'){ set({fbMode:!S.fbMode}); }
  else if(a==='fbexport'){ openFbExport(); }
  else if(a==='reset'){ localStorage.removeItem('cf_v5'); location.reload(); } });

render();
})();
