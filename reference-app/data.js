/* HerFuel v3 — life-stage (perinatal-led) model. Pure data. Mock only, not medical advice. */
const CF = {};

/* base maintenance for the demo persona (phase-independent baseline) */
CF.BASE = { kcal:1900, protein:90 };

/* ---- the hormonal-journey stages ---- */
/* targetDelta = honest, evidence-sourced adjustment to the calorie/protein TARGET.
   Cycle delta is ZERO on purpose (the science doesn't support a metabolic bump). */
CF.STAGES = {
  cycle: { key:'cycle', label:'Cycle', sub:'Luteal phase · Day 23', emoji:'🌙', color:'#8A4A66',
    kcalDelta:0, proteinDelta:5,
    honesty:{grade:'supported', text:'Your calorie target stays steady across your cycle — the metabolic “luteal bump” isn’t supported by the science. We adjust the *plan* (cravings, iron, calcium), not the number.'},
    key:{label:'Calcium', tkey:'calcium', max:1000, unit:'mg', color:'#8A4A66'},
    focus:['Calcium','Magnesium'],
    coach:[
      {grade:'supported', tag:'Cravings', title:'Cravings are normal right now',
       body:'Progesterone genuinely raises appetite this phase. Reach for satisfying foods that steady blood sugar — pair carbs with protein and fat.',
       note:'Supported: luteal appetite rises. We don’t fake a calorie change — we help you ride it.'},
    ]},
  pregnancy: { key:'pregnancy', label:'Pregnancy', sub:'Second trimester · Week 22', emoji:'🤰', color:'#3E7CB1',
    kcalDelta:340, proteinDelta:25,
    honesty:{grade:'strong', text:'+340 kcal in your second trimester — this is established science, not a guess. Your body is building a person.'},
    key:{label:'Iron', tkey:'iron', max:27, unit:'mg', color:'#3E7CB1'},
    focus:['Folate','Iron','Protein'],
    coach:[
      {grade:'strong', tag:'Energy', title:'You need a bit more now',
       body:'Energy needs rise ~340 kcal/day in the second trimester. We’ve already added it — no need to “earn” it.',
       note:'Established (Institute of Medicine trimester estimates).'},
      {grade:'strong', tag:'Folate', title:'Folate & iron matter most',
       body:'Folate protects your baby’s development; iron supports your expanding blood volume. We’ll flag foods rich in both.',
       note:'Strong evidence for folate (neural tube) and iron in pregnancy.'},
    ]},
  breastfeeding: { key:'breastfeeding', label:'Breastfeeding', sub:'9 weeks postpartum', emoji:'🤱', color:'#0E6E68',
    kcalDelta:400, proteinDelta:20,
    honesty:{grade:'strong', text:'Your body needs about +400 kcal today to make milk — that’s real physiology, not a cheat day. Eat to support your supply.'},
    key:{label:'Calcium', tkey:'calcium', max:1000, unit:'mg', color:'#0E6E68'},
    focus:['Protein','Calcium','Hydration'],
    coach:[
      {grade:'strong', tag:'Supply', title:'Fuel for milk-making',
       body:'Making milk burns roughly 400–500 kcal/day. We’ve built that into your target — under-eating can dent your supply and your energy.',
       note:'Strong: lactation raises energy needs ~330–500 kcal/day (NAS).'},
      {grade:'supported', tag:'Be kind', title:'No rush to “bounce back”',
       body:'You’re 9 weeks in — we won’t nudge you into a deficit yet. Recovery and supply come first; gentle changes can come later.',
       note:'Supported: a 6–8 week recovery window before any deficit.'},
      {grade:'supported', tag:'Hydration', title:'Keep water close',
       body:'Thirst spikes while nursing. Aim to drink whenever you feed — we’ll keep a gentle nudge here.',
       note:'Supported.'},
    ]},
  pcos: { key:'pcos', label:'PCOS', sub:'Insulin-aware mode', emoji:'🌸', color:'#B5852A',
    kcalDelta:-100, proteinDelta:20,
    honesty:{grade:'supported', text:'We lean lower-GI to support insulin sensitivity — one of the best-studied approaches for PCOS. We won’t promise weight loss the evidence can’t back.'},
    key:{label:'Fibre', tkey:'fiber', max:30, unit:'g', color:'#B5852A'},
    focus:['Fibre','Protein','Lower-GI'],
    coach:[
      {grade:'supported', tag:'Insulin', title:'Steady your blood sugar',
       body:'Pairing carbs with protein and fibre blunts glucose spikes — helpful for insulin resistance and cravings.',
       note:'Supported: low-GI is among the most-studied PCOS diet approaches.'},
    ]},
  perimenopause: { key:'perimenopause', label:'Perimenopause', sub:'Muscle-protecting mode', emoji:'🌿', color:'#7C5CBF',
    kcalDelta:0, proteinDelta:30,
    honesty:{grade:'strong', text:'We push protein higher (≈1.2 g/kg) to protect the muscle you naturally lose through perimenopause. Strong evidence — and it helps sleep too.'},
    key:{label:'Protein', tkey:'protein', max:120, unit:'g', color:'#7C5CBF'},
    focus:['Protein','Calcium','Vitamin D'],
    coach:[
      {grade:'strong', tag:'Muscle', title:'Protein protects you now',
       body:'Muscle declines measurably through the menopausal transition. Higher protein (spread across meals) defends strength, metabolism and sleep.',
       note:'Strong: 1.0–1.6 g/kg/day supports lean mass; safe for healthy kidneys.'},
    ]},
};
CF.STAGE_ORDER = ['cycle','pregnancy','breastfeeding','perimenopause']; // journey path (PCOS = cross-cutting)

CF.GRADE_META = {
  strong:      { label:'Strong evidence', dots:'●●●', cls:'strong' },
  supported:   { label:'Supported',       dots:'●●○', cls:'supported' },
  exploratory: { label:'Worth a try',     dots:'●○○', cls:'exploratory' },
};

/* where the user is *within* a stage (drives honest, changing guidance) */
CF.STAGE_POS_DEFAULT = { pregnancy:22, breastfeeding:9, cycle:23 };
CF.trimester  = function(week){ return week<=13?1:(week<=27?2:3); };
CF.cyclePhase = function(day){ return day<=5?'menstrual':(day<=13?'follicular':(day<=16?'ovulatory':'luteal')); };
CF.posMeta = { pregnancy:{label:'Week',     min:1, max:40},
               breastfeeding:{label:'Wk PP', min:0, max:52},
               cycle:{label:'Cycle day',     min:1, max:28} };

/* Consistency & badges — DE-safe by design: the streak counts days you CHECKED IN
   (logged anything / how you feel), never days under a calorie goal; badges reward
   process & self-care, never weight or deficit. Optional (toggle in Me).
   Demo seeds current:0 / best:14 on purpose to show the fresh-start (not loss) framing. */
CF.STREAK = { current:0, best:14, unit:'days' };
/* Cal AI-style milestone badges — but DE-safe by design: streak = days CHECKED IN
   (best:14 means the streak badges up to 14 are earned), and NO weight/deficit badges. */
CF.BADGES = [
  /* check-in streak milestones */
  {id:'rookie',      icon:'🔥', label:'Rookie',         req:'3-day check-in streak',   earned:true,  color:'#E07A3F'},
  {id:'getting',     icon:'🌤️', label:'Getting going',  req:'7-day check-in streak',   earned:true,  color:'#E07A3F'},
  {id:'committed',   icon:'💪', label:'Committed',       req:'14-day check-in streak',  earned:true,  color:'#E07A3F'},
  {id:'locked-in',   icon:'🔒', label:'Locked in',       req:'30-day check-in streak',  earned:false, color:'#E07A3F'},
  {id:'centurion',   icon:'💯', label:'Centurion',       req:'100-day check-in streak', earned:false, color:'#E07A3F'},
  /* logging / process */
  {id:'first-log',   icon:'🍽️', label:'First log',       req:'Logged your first meal',  earned:true,  color:'#0E6E68'},
  {id:'forking',     icon:'🍴', label:'Forking around',  req:'Logged 5 meals',          earned:true,  color:'#0E6E68'},
  {id:'mission',     icon:'🥗', label:'Mission: nutrition',req:'Logged 50 meals',       earned:false, color:'#0E6E68'},
  {id:'logfather',   icon:'🍝', label:'The logfather',   req:'Logged 500 meals',        earned:false, color:'#0E6E68'},
  {id:'speed',       icon:'💾', label:'Speed logger',    req:'Saved 10 meals',          earned:false, color:'#0E6E68'},
  /* hydration */
  {id:'hydrated',    icon:'💧', label:'Hydrated',        req:'Logged water once',       earned:true,  color:'#3E7CB1'},
  {id:'sippin',      icon:'🥤', label:'Sippin’',         req:'Water goal 3 days',       earned:false, color:'#3E7CB1'},
  {id:'aquaholic',   icon:'🚰', label:'Aquaholic',       req:'Water goal 10 days',      earned:false, color:'#3E7CB1'},
  /* self-care & women-specific — our differentiator, never weight/deficit */
  {id:'tuned-in',    icon:'💗', label:'Tuned in',        req:'Logged how you feel ×7',  earned:true,  color:'#8A4A66'},
  {id:'fresh',       icon:'🌅', label:'Fresh start',     req:'Came back after a break', earned:true,  color:'#B5852A'},
  {id:'protein',     icon:'🍗', label:'Protein pro',     req:'Hit protein target ×5',   earned:false, color:'#7C5CBF'},
  {id:'iron',        icon:'🩸', label:'Iron-rich',       req:'3 iron-rich days',        earned:false, color:'#A85A3C'},
  {id:'fibre',       icon:'🌾', label:'Fibre friend',    req:'Hit fibre target ×5',     earned:false, color:'#5E8C61'},
];

CF.target = function(stageKey, pos){
  var s=CF.STAGES[stageKey], kd=s.kcalDelta, pd=s.proteinDelta;
  if(stageKey==='pregnancy'){                     /* honest, trimester-based — the number really should change */
    var tri = CF.trimester(pos==null?CF.STAGE_POS_DEFAULT.pregnancy:pos);
    kd = tri===1?0   : tri===2?340 : 452;
    pd = tri===1?5   : tri===2?25  : 28;
  }
  return { kcal: CF.BASE.kcal + kd, protein: CF.BASE.protein + pd,
           iron:27, calcium:1000, fiber:30, mag:320, kcalDelta:kd };
};

/* ── Contingent guidance library ──────────────────────────────────────────────
   Each tip carries a TRIGGER so it only shows when it's actually relevant, and a
   kind that sets priority: 'symptom'/'data' (1, contingent) > 'stage' (2) > always (3).
   Triggers: weeks:[lo,hi] (stage position) · phase:'luteal' · symptom:'Nausea'
             · gap:{n:'iron',pct:0.5} (logged < pct of target) · always:true        */
CF.GUIDE = {
  pregnancy:[
    {id:'pg-nausea', kind:'symptom', symptom:'Nausea', tag:'Comfort', grade:'supported',
     title:'Eating through nausea', body:'Small, frequent, bland carbs — crackers, toast, rice — plus ginger settle queasiness better than big meals. Vitamin B6 can help too.', note:'Supported for first-trimester nausea.'},
    {id:'pg-fatigue', kind:'symptom', symptom:'Fatigue', tag:'Energy', grade:'supported',
     title:'Fighting the fatigue', body:'Pregnancy tiredness often tracks with iron and blood sugar. Pair iron-rich foods with vitamin C and try not to skip meals.', note:'Supported.'},
    {id:'pg-gap-iron', kind:'data', gap:{n:'iron',pct:0.5}, tag:'Iron', grade:'strong',
     title:'Iron’s low so far today', body:'You’re under half your iron target. Lentils, spinach or lean red meat with a squeeze of citrus boosts absorption.', note:'Strong: iron needs are high in pregnancy.'},
    {id:'pg-gap-cal', kind:'data', gap:{n:'calcium',pct:0.5}, tag:'Calcium', grade:'strong',
     title:'Calcium’s running low', body:'Baby’s bones draw calcium from you. Yoghurt, milk, fortified plant milks or tofu top you up.', note:'Strong evidence.'},
    {id:'pg-gap-protein', kind:'data', gap:{n:'protein',pct:0.5}, tag:'Protein', grade:'supported',
     title:'Protein’s lagging today', body:'Anchor each meal with protein — it supports baby’s growth and steadies your energy.', note:'Supported.'},
    {id:'pg-t1-folate', kind:'stage', weeks:[1,13], tag:'Folate', grade:'strong',
     title:'Folate is the priority this trimester', body:'Folate protects neural-tube development in these early weeks. Leafy greens, legumes and fortified grains — plus your prenatal.', note:'Strong evidence (neural tube).'},
    {id:'pg-t1-energy', kind:'stage', weeks:[1,13], tag:'Energy', grade:'strong',
     title:'No extra calories needed yet', body:'First-trimester energy needs barely change — your target stays at baseline. Quality over quantity right now.', note:'Established: no T1 calorie increase.'},
    {id:'pg-t2-energy', kind:'stage', weeks:[14,27], tag:'Energy', grade:'strong',
     title:'+340 kcal — already added', body:'Second-trimester energy needs rise about 340 kcal/day. We built it into your target; no need to “earn” it.', note:'Established (IOM trimester estimates).'},
    {id:'pg-iron-stage', kind:'stage', weeks:[14,40], tag:'Iron', grade:'strong',
     title:'Iron is climbing now', body:'Your blood volume is expanding — iron needs jump to 27 mg. Pair iron-rich foods with vitamin C to absorb more.', note:'Strong evidence in pregnancy.'},
    {id:'pg-t3-meals', kind:'stage', weeks:[28,40], tag:'Comfort', grade:'supported',
     title:'Smaller, more frequent meals help now', body:'As baby crowds your stomach, big meals bring heartburn. Five smaller meals beat three large ones in the third trimester.', note:'Supported for late-pregnancy reflux.'},
  ],
  cycle:[
    {id:'cy-cramps', kind:'symptom', symptom:'Cramps', tag:'Comfort', grade:'supported',
     title:'Easing cramps', body:'Magnesium-rich foods — dark chocolate, nuts, leafy greens — plus staying hydrated may ease cramping. Omega-3s can help too.', note:'Supported, modest effect.'},
    {id:'cy-lowmood', kind:'symptom', symptom:'Low mood', tag:'Mood', grade:'exploratory',
     title:'Steadying low mood', body:'Steady blood sugar and magnesium may take the edge off premenstrual dips. Regular meals beat long gaps.', note:'Exploratory.'},
    {id:'cy-cravings', kind:'symptom', symptom:'Cravings', tag:'Cravings', grade:'supported',
     title:'Cravings are real right now', body:'Don’t fight them on an empty stomach — protein + fibre first, then enjoy the thing. We don’t fake a calorie change, we help you ride it.', note:'Supported: luteal appetite rises.'},
    {id:'cy-gap-iron', kind:'data', gap:{n:'iron',pct:0.5}, tag:'Iron', grade:'supported',
     title:'Iron’s low today', body:'Especially worth topping up around your period. Pair plant iron with vitamin C.', note:'Supported.'},
    {id:'cy-menstrual-iron', kind:'stage', phase:'menstrual', tag:'Iron', grade:'strong',
     title:'Replace the iron your period loses', body:'Bleeding depletes iron — top up with lentils, spinach or lean meat, paired with vitamin C.', note:'Strong: menstrual iron loss is well established.'},
    {id:'cy-follicular', kind:'stage', phase:'follicular', tag:'Energy', grade:'exploratory',
     title:'Your energy tends to climb now', body:'Many women feel strongest in the follicular phase — a good window for protein-forward meals and more active days.', note:'Exploratory: variation is high.'},
    {id:'cy-luteal-cal', kind:'stage', phase:'luteal', tag:'Steady', grade:'supported',
     title:'Steady carbs help the luteal dip', body:'Pair carbs with protein and fat to keep blood sugar even — it blunts cravings and mood swings without a calorie change.', note:'Supported.'},
  ],
  breastfeeding:[
    {id:'bf-fatigue', kind:'symptom', symptom:'Fatigue', tag:'Energy', grade:'supported',
     title:'Running on empty?', body:'Postpartum fatigue worsens if you under-eat. Protein + iron-rich snacks and not skipping meals protect your energy and supply.', note:'Supported.'},
    {id:'bf-hydration', kind:'data', gap:{n:'water'}, tag:'Hydration', grade:'supported',
     title:'Keep water close while nursing', body:'Thirst spikes when you feed. Aim to drink whenever baby does.', note:'Supported.'},
    {id:'bf-gap-cal', kind:'data', gap:{n:'calcium',pct:0.5}, tag:'Calcium', grade:'strong',
     title:'Calcium’s low today', body:'Nursing draws on your calcium stores. Dairy, fortified milks or tofu protect your bones.', note:'Strong.'},
    {id:'bf-gap-protein', kind:'data', gap:{n:'protein',pct:0.5}, tag:'Protein', grade:'supported',
     title:'Protein’s lagging', body:'Protein supports recovery and milk-making. Anchor each meal and snack with some.', note:'Supported.'},
    {id:'bf-early', kind:'stage', weeks:[0,6], tag:'Recovery', grade:'supported',
     title:'These weeks: supply & recovery first', body:'In the first 6 weeks we won’t nudge you into any deficit. Eat enough to establish supply and recover — gentle changes come later.', note:'Supported recovery window.'},
    {id:'bf-energy', kind:'stage', always:true, tag:'Supply', grade:'strong',
     title:'+400 kcal to make milk', body:'Lactation burns roughly 400–500 kcal/day. We built that into your target — under-eating can dent supply and energy.', note:'Strong (NAS).'},
  ],
  pcos:[
    {id:'pc-cravings', kind:'symptom', symptom:'Cravings', tag:'Cravings', grade:'supported',
     title:'Riding a craving', body:'Don’t fight it on an empty stomach — protein + fibre first, then enjoy the thing. Steadier blood sugar means fewer spikes.', note:'Supported.'},
    {id:'pc-gap-fiber', kind:'data', gap:{n:'fiber',pct:0.5}, tag:'Fibre', grade:'supported',
     title:'Fibre’s low today', body:'Fibre slows glucose absorption and supports fullness. Beans, oats, veg and berries lift it fast.', note:'Supported.'},
    {id:'pc-gap-protein', kind:'data', gap:{n:'protein',pct:0.5}, tag:'Protein', grade:'supported',
     title:'Protein’s low today', body:'Protein steadies blood sugar and curbs cravings — useful with PCOS. Anchor each meal.', note:'Supported.'},
    {id:'pc-gi', kind:'stage', always:true, tag:'Insulin', grade:'supported',
     title:'Steady your blood sugar', body:'Pairing carbs with protein and fibre blunts glucose spikes — helpful for insulin resistance and cravings.', note:'Supported: low-GI is among the most-studied PCOS approaches.'},
  ],
  perimenopause:[
    {id:'pm-hotflash', kind:'symptom', symptom:'Hot flashes', tag:'Triggers', grade:'exploratory',
     title:'Taming hot flashes', body:'Caffeine, alcohol and big blood-sugar swings trigger flashes for some. Steady, balanced meals may reduce them.', note:'Exploratory: triggers vary.'},
    {id:'pm-sleep', kind:'symptom', symptom:'Poor sleep', tag:'Sleep', grade:'exploratory',
     title:'Eating for better sleep', body:'A little evening protein + complex carb and some magnesium may help. Avoid late caffeine and heavy late meals.', note:'Exploratory.'},
    {id:'pm-gap-protein', kind:'data', gap:{n:'protein',pct:0.6}, tag:'Protein', grade:'strong',
     title:'Protein’s behind today', body:'You’re under target — aim for ~30 g per meal to protect muscle as estrogen falls.', note:'Strong.'},
    {id:'pm-gap-cal', kind:'data', gap:{n:'calcium',pct:0.5}, tag:'Calcium', grade:'strong',
     title:'Calcium’s low today', body:'Bone density falls as estrogen declines — calcium and vitamin D matter more now.', note:'Strong.'},
    {id:'pm-protein', kind:'stage', always:true, tag:'Muscle', grade:'strong',
     title:'Protein protects you now', body:'Muscle declines through the transition. Higher protein, spread across meals, defends strength, metabolism and sleep.', note:'Strong: 1.0–1.6 g/kg/day supports lean mass.'},
  ],
};

/* mini food DB (per serving). iron/calcium/mag in mg */
CF.FOODS = [
  {id:'oats',    name:'Oats & berries', emoji:'🥣', serving:'1 bowl', kcal:280, p:9,  c:48, f:6,  iron:3.4, calcium:60,  mag:90, fiber:8},
  {id:'lentil',  name:'Lentil soup',    emoji:'🍲', serving:'1 bowl', kcal:230, p:15, c:36, f:3,  iron:6.6, calcium:40,  mag:70, fiber:9},
  {id:'salmon',  name:'Grilled salmon', emoji:'🐟', serving:'150 g',  kcal:280, p:34, c:0,  f:16, iron:0.8, calcium:15,  mag:45, fiber:0},
  {id:'spinach', name:'Spinach salad',  emoji:'🥗', serving:'2 cups', kcal:120, p:6,  c:9,  f:7,  iron:2.7, calcium:90,  mag:80, fiber:4},
  {id:'yogurt',  name:'Greek yoghurt',  emoji:'🥛', serving:'1 cup',  kcal:150, p:17, c:9,  f:4,  iron:0.1, calcium:200, mag:18, fiber:0},
  {id:'chicken', name:'Chicken & rice', emoji:'🍗', serving:'1 plate',kcal:420, p:35, c:45, f:10, iron:1.5, calcium:30,  mag:55, fiber:2},
  {id:'eggs',    name:'Scrambled eggs', emoji:'🍳', serving:'2 eggs',  kcal:180, p:12, c:1,  f:13, iron:1.8, calcium:50,  mag:12, fiber:0},
  {id:'pbtoast', name:'PB toast',       emoji:'🍞', serving:'1 slice', kcal:220, p:8,  c:24, f:11, iron:1.2, calcium:60,  mag:35, fiber:5},
  {id:'smoothie',name:'Green smoothie',  emoji:'🥤', serving:'1 large', kcal:210, p:6,  c:40, f:3,  iron:2.0, calcium:120, mag:55, fiber:6},
  {id:'cottage', name:'Cottage cheese',  emoji:'🧀', serving:'1 cup',  kcal:180, p:24, c:8,  f:5,  iron:0.3, calcium:140, mag:11, fiber:0},
];
CF.foodById = function(id){ return CF.FOODS.find(function(f){return f.id===id;}); };

/* simulated AI logging results */
CF.AI = {
  scan: { title:'Salmon, spinach & quinoa bowl', source:'Photo · AI draft', emoji:'🥗',
    kcal:520, p:38, c:34, f:24, iron:4.2, calcium:120, mag:140, fiber:9,
    parts:[['Grilled salmon','150 g'],['Baby spinach','2 cups'],['Quinoa','¾ cup'],['Olive oil','1 tbsp']] },
  voice: { title:'Greek yoghurt, berries & walnuts', source:'Voice · AI draft', emoji:'🥛',
    kcal:240, p:18, c:20, f:10, iron:1.1, calcium:210, mag:55, fiber:4,
    parts:[['Greek yoghurt','1 cup'],['Mixed berries','½ cup'],['Walnuts','2 tbsp']] },
};

CF.DEMO = {
  stage:'breastfeeding',
  meals:[ {foodId:'oats',time:'7:40 AM',meal:'Breakfast'}, {foodId:'eggs',time:'7:45 AM',meal:'Breakfast'},
          {foodId:'chicken',time:'12:50 PM',meal:'Lunch'} ],
  yesterday:[ {foodId:'smoothie',meal:'Breakfast'}, {foodId:'lentil',meal:'Lunch'}, {foodId:'salmon',meal:'Dinner'} ],
  wellbeing:{ supply:true, tired:true },
};
CF.WELLBEING = { breastfeeding:['Supply','Energy','Mood','Sleep','Hydration'],
  pregnancy:['Nausea','Energy','Mood','Sleep'], cycle:['Cravings','Energy','Mood','Cramps','Bloating'],
  pcos:['Energy','Cravings','Mood','Bloating'], perimenopause:['Sleep','Energy','Mood','Hot flushes'] };

/* demo trend data for the Insights screen */
CF.TREND = {
  weightLbs:[167,166.2,165.6,165,164.4,163.9,163.4,163,162.6,162.3], // ~10 wks postpartum, gentle
  logging:[1,1,0,1,1,1,1,0,1,1,1,1,1,1], // last 14 days logged? (1=yes) → consistency, not perfection
  proteinG:[95,108,72,110,101,88,115,67,104,98,112,76,109,103], // last 14 days vs ~110g target
};

/* device integrations — what each imports + how HerFuel uses it */
CF.INTEGRATIONS = [
  {id:'applehealth', name:'Apple Health', icon:'❤️', defaultOn:true,
   imports:'weight, steps, workouts, sleep — and your menstrual flow, cycle, BBT / wrist-temp & symptoms',
   exports:'calories, macros, micros, water & weight written back to Health'},
  {id:'oura', name:'Oura Ring', icon:'💍',
   imports:'sleep, readiness, HRV & body temperature → cycle phase, period prediction + recovery-aware coaching'},
  {id:'whoop', name:'Whoop', icon:'🟥',
   imports:'strain, recovery, sleep & menstrual-cycle phase coaching → context (not a calorie bump — see note)'},
  {id:'garmin', name:'Garmin', icon:'⌚',
   imports:'activity, steps, sleep, stress & menstrual-cycle tracking'},
  {id:'scale', name:'Smart scale (Withings / Renpho)', icon:'⚖️',
   imports:'weight, body-fat % & pregnancy-weight mode → automatic body trends'},
];
/* the data each integration surfaces once connected (gone when disconnected) */
CF.INTDATA = {
  applehealth:[['Weight','162.3 lb'],['Steps today','6,420'],['Sleep','7h 12m'],['Cycle data','synced ✓']],
  oura:[['Readiness','82'],['Sleep score','78'],['HRV','48 ms'],['Body temp','+0.3°C (luteal)']],
  whoop:[['Recovery','64%'],['Day strain','11.2'],['Sleep','6h 48m'],['Resting HR','58 bpm']],
  garmin:[['Steps','8,140'],['Active cals','410'],['Stress','38 / mod'],['Sleep','7h 02m']],
  scale:[['Weight','162.3 lb'],['Body fat','28.4%'],['Trend','↘ 0.6 lb/wk']],
};

/* module-aware content: suggested foods, meal ideas, articles change per module (incl. general) */
CF.SUGGEST = {
  general:       { foods:['chicken','eggs','cottage','smoothie'],
    meals:[{t:'High-protein breakfast',d:'Greek yoghurt, berries & eggs'},{t:'Balanced lunch',d:'Chicken, rice & spinach'}],
    articles:[{t:'How many calories do you actually need?',m:'4 min read'},{t:'Protein 101: how much, and when',m:'5 min read'}] },
  breastfeeding: { foods:['salmon','cottage','lentil','yogurt'],
    meals:[{t:'Supply-supporting breakfast',d:'Oats, eggs & plenty of water'},{t:'Protein-rich lunch',d:'Salmon, quinoa & greens'}],
    articles:[{t:'Eating to protect your milk supply',m:'6 min read'},{t:'Why not to rush a postpartum deficit',m:'5 min read'}] },
  pregnancy:     { foods:['spinach','lentil','salmon','eggs'],
    meals:[{t:'Folate & iron breakfast',d:'Spinach omelette & wholegrain toast'},{t:'Second-trimester lunch',d:'Lentils, brown rice & veg'}],
    articles:[{t:'Trimester-by-trimester nutrition',m:'7 min read'},{t:'Foods to enjoy & avoid in pregnancy',m:'6 min read'}] },
  cycle:         { foods:['lentil','spinach','cottage','smoothie'],
    meals:[{t:'Luteal: satisfying & steady',d:'PB toast, then chicken & rice'},{t:'Iron boost (menstrual)',d:'Lentil soup & spinach salad'}],
    articles:[{t:'Why your appetite shifts across your cycle',m:'5 min read'},{t:'Iron, energy & your period',m:'6 min read'}] },
  pcos:          { foods:['cottage','eggs','spinach','lentil'],
    meals:[{t:'Lower-GI breakfast',d:'Eggs, avocado toast & berries'},{t:'Insulin-steady lunch',d:'Chicken, lentils & greens'}],
    articles:[{t:'Low-GI eating for PCOS, honestly',m:'6 min read'},{t:'PCOS & insulin resistance: the basics',m:'5 min read'}] },
  perimenopause: { foods:['cottage','salmon','eggs','yogurt'],
    meals:[{t:'Protein-forward breakfast',d:'Cottage cheese, eggs & fruit'},{t:'Muscle-supporting dinner',d:'Salmon & quinoa'}],
    articles:[{t:'Protein & muscle through perimenopause',m:'6 min read'},{t:'Nutrition for better midlife sleep',m:'5 min read'}] },
};

/* ---- Carb-Manager-style logging: saved meals, meal plans, recents ---- */
CF.MEALS_SAVED = [
  {name:'My usual breakfast', items:['oats','eggs'], kcal:460},
  {name:'Post-workout',       items:['smoothie','cottage'], kcal:390},
  {name:'Go-to dinner',       items:['chicken','spinach'], kcal:540},
];
CF.MEAL_PLANS = [
  {name:'Balanced week', tag:'general', days:7, kcal:1900, sub:'7 days · ~1,900 kcal/day · balanced macros',
   why:'A flexible, protein-forward week for steady energy and easy logging.',
   sample:[ {d:'Day 1', b:'Greek yogurt power bowl', l:'Chicken quinoa burrito bowl', dn:'Salmon & sweet-potato bowl', s:'Apple & peanut butter'},
            {d:'Day 2', b:'Veggie omelette & toast', l:'Chicken & lentil salad', dn:'Beef & broccoli stir-fry', s:'Greek yogurt & berries'},
            {d:'Day 3', b:'Overnight oats & chia', l:'Tuna grain bowl', dn:'Tofu & veg stir-fry', s:'Hummus & carrots'} ]},
  {name:'Second-trimester week', tag:'pregnancy', days:7, kcal:2240, sub:'7 days · +340 kcal · iron & folate focus',
   why:'Iron-, folate- and calcium-rich days for the second trimester (+340 kcal built in).',
   sample:[ {d:'Day 1', b:'Spinach & feta baked eggs', l:'Lentil bolognese', dn:'Salmon & sweet-potato bowl', s:'Yogurt, berries & seeds'},
            {d:'Day 2', b:'Fortified oats & fruit', l:'Chickpea & spinach salad', dn:'Beef & greens with rice', s:'Cheese & wholegrain crackers'},
            {d:'Day 3', b:'Green smoothie & toast', l:'Lentil soup & salad', dn:'Chicken, quinoa & broccoli', s:'Orange & almonds'} ]},
  {name:'Breastfeeding recovery week', tag:'breastfeeding', days:7, kcal:2300, sub:'7 days · +400 kcal · protein, calcium & hydration',
   why:'Supply-supporting, no-deficit week with extra protein, calcium and fluids.',
   sample:[ {d:'Day 1', b:'Oatmeal lactation bowl', l:'Salmon rice bowl', dn:'Chicken & sweet potato', s:'Berry protein parfait'},
            {d:'Day 2', b:'Eggs, avocado & toast', l:'Lentil & veg soup', dn:'Beef & greens', s:'Greek yogurt & granola'},
            {d:'Day 3', b:'Smoothie + nut butter', l:'Chicken quinoa bowl', dn:'Salmon & veg', s:'Cheese & fruit'} ]},
  {name:'Lower-GI reset', tag:'pcos', days:5, kcal:1800, sub:'5 days · PCOS-friendly · fibre & protein',
   why:'Lower-glycaemic, high-fibre days to steady blood sugar and curb cravings.',
   sample:[ {d:'Day 1', b:'Egg & avocado breakfast', l:'Chickpea buddha bowl', dn:'Chicken & lentil salad', s:'Greek yogurt & berries'},
            {d:'Day 2', b:'Cottage cheese & berries', l:'Tuna & bean salad', dn:'Tofu & veg stir-fry', s:'Nuts & apple'},
            {d:'Day 3', b:'Veggie omelette', l:'Lentil soup & salad', dn:'Salmon & greens', s:'Hummus & veg'} ]},
  {name:'Iron-boost cycle week', tag:'cycle', days:7, kcal:1900, sub:'7 days · iron & magnesium for your period',
   why:'Iron- and magnesium-rich days to replace what your period loses and ease symptoms.',
   sample:[ {d:'Day 1', b:'Oats, berries & seeds', l:'Lentil & spinach dahl', dn:'Beef & broccoli stir-fry', s:'Dark-choc oat bites'},
            {d:'Day 2', b:'Spinach omelette', l:'Chicken & lentil salad', dn:'Salmon & greens', s:'Yogurt & pumpkin seeds'},
            {d:'Day 3', b:'Green smoothie', l:'Bean & veg bowl', dn:'Steak & sweet potato', s:'Nuts & fruit'} ]},
];
/* 3 real recipes per phase — tailored to each phase's nutrition focus. Macros per serving. */
CF.RECIPES = {
  general:[
    {name:'Greek yogurt power bowl', emoji:'🥣', kcal:380, p:32, c:44, f:8, fiber:6, iron:2, calcium:300, serv:1, mins:5, rating:4.7, tags:['High-protein','No-cook'],
     ingredients:['1 cup Greek yogurt','½ cup mixed berries','¼ cup granola','1 tbsp honey','1 tbsp chia seeds'],
     steps:['Spoon the yogurt into a bowl.','Top with berries, granola and chia seeds.','Drizzle with honey and serve.'], items:['yogurt']},
    {name:'Chicken quinoa burrito bowl', emoji:'🍲', kcal:520, p:42, c:50, f:16, fiber:9, iron:4, calcium:80, serv:1, mins:25, rating:4.8, tags:['High-protein','Meal-prep'],
     ingredients:['120g grilled chicken','¾ cup cooked quinoa','½ cup black beans','¼ avocado','Salsa & lime'],
     steps:['Cook the quinoa and warm the beans.','Slice the chicken and avocado.','Assemble the bowl and top with salsa and lime.'], items:['chicken']},
    {name:'Veggie omelette & toast', emoji:'🍳', kcal:350, p:24, c:22, f:18, fiber:5, iron:3, calcium:150, serv:1, mins:12, rating:4.5, tags:['Vegetarian','Quick'],
     ingredients:['3 eggs','Handful of spinach','¼ bell pepper','30g cheese','1 slice wholegrain toast'],
     steps:['Whisk the eggs; sauté the veg.','Pour eggs over the veg, add cheese and fold.','Serve with toast.'], items:['eggs']} ],
  cycle:[
    {name:'Lentil & spinach dahl', emoji:'🍲', kcal:410, p:22, c:58, f:9, fiber:14, iron:8, calcium:120, serv:2, mins:30, rating:4.7, tags:['Iron-rich','Vegan'],
     ingredients:['1 cup red lentils','2 cups spinach','1 onion','Garlic, ginger & cumin','400ml coconut milk'],
     steps:['Sauté onion, garlic, ginger and spices.','Add lentils and 2 cups water; simmer 20 min.','Stir in spinach and coconut milk; serve with rice.'], items:['lentil','spinach']},
    {name:'Dark-choc oat energy bites', emoji:'🍫', kcal:180, p:5, c:22, f:9, fiber:4, iron:3, calcium:40, serv:6, mins:15, rating:4.6, tags:['Magnesium','Luteal craving'],
     ingredients:['1 cup oats','½ cup peanut butter','¼ cup dark chocolate chips','3 tbsp honey','1 tbsp chia'],
     steps:['Mix all ingredients in a bowl.','Roll into 12 bites.','Chill 20 min; keep in the fridge.'], items:['oats']},
    {name:'Beef & broccoli stir-fry', emoji:'🥩', kcal:480, p:38, c:28, f:24, fiber:6, iron:6, calcium:90, serv:2, mins:20, rating:4.8, tags:['Iron-rich'],
     ingredients:['250g lean beef strips','2 cups broccoli','Soy sauce, garlic & ginger','1 tbsp sesame oil','Cooked rice to serve'],
     steps:['Sear the beef in sesame oil; set aside.','Stir-fry broccoli with garlic and ginger.','Return beef, add soy sauce; serve over rice.'], items:['chicken','spinach']} ],
  pregnancy:[
    {name:'Spinach & feta baked eggs', emoji:'🍳', kcal:320, p:20, c:10, f:22, fiber:4, iron:4, calcium:280, serv:2, mins:20, rating:4.7, tags:['Folate','Calcium'],
     ingredients:['4 eggs','3 cups spinach','60g feta','1 tomato','Olive oil'],
     steps:['Wilt the spinach with tomato in an oven dish.','Make wells, crack in the eggs, crumble over feta.','Bake 12–15 min at 190°C until set.'], items:['eggs','spinach']},
    {name:'Salmon & sweet-potato bowl', emoji:'🐟', kcal:540, p:38, c:44, f:22, fiber:8, iron:3, calcium:90, serv:1, mins:30, rating:4.8, tags:['Omega-3','Iron'],
     ingredients:['150g salmon fillet','1 roasted sweet potato','1 cup kale','Olive oil & lemon','Pumpkin seeds'],
     steps:['Roast sweet potato and salmon for 20 min.','Massage the kale with oil and lemon.','Assemble the bowl; top with pumpkin seeds.'], items:['salmon']},
    {name:'Lentil bolognese', emoji:'🍝', kcal:460, p:20, c:70, f:10, fiber:15, iron:7, calcium:80, serv:2, mins:35, rating:4.6, tags:['Folate','Fibre'],
     ingredients:['1 cup lentils','Wholewheat pasta','Tomato passata','Onion, carrot & garlic','Mixed herbs'],
     steps:['Sauté onion, carrot and garlic.','Add lentils and passata; simmer 25 min.','Serve over cooked pasta.'], items:['lentil']} ],
  breastfeeding:[
    {name:'Oatmeal lactation bowl', emoji:'🥣', kcal:420, p:14, c:62, f:14, fiber:8, iron:4, calcium:200, serv:1, mins:10, rating:4.7, tags:['Supply-supporting','Hydrating'],
     ingredients:['1 cup oats','1 cup milk','1 tbsp flaxseed','1 tbsp brewer’s yeast','Banana & berries'],
     steps:['Cook the oats in milk.','Stir in flaxseed and brewer’s yeast.','Top with banana and berries.'], items:['oats']},
    {name:'Berry protein parfait', emoji:'🥛', kcal:340, p:28, c:40, f:6, fiber:6, iron:1, calcium:350, serv:1, mins:5, rating:4.6, tags:['Calcium','Protein'],
     ingredients:['1 cup Greek yogurt','½ cup berries','¼ cup granola','1 scoop protein (optional)','Honey'],
     steps:['Layer yogurt, berries and granola.','Add protein if using.','Drizzle with honey and serve.'], items:['yogurt','cottage']},
    {name:'Salmon rice bowl', emoji:'🍚', kcal:560, p:40, c:52, f:20, fiber:5, iron:2, calcium:80, serv:1, mins:25, rating:4.8, tags:['Protein','Omega-3'],
     ingredients:['150g salmon','1 cup cooked rice','Edamame','Avocado','Soy & sesame'],
     steps:['Bake or pan-fry the salmon.','Assemble rice, edamame and avocado.','Flake salmon on top; dress with soy and sesame.'], items:['salmon','chicken']} ],
  pcos:[
    {name:'Chickpea buddha bowl', emoji:'🥗', kcal:480, p:20, c:56, f:18, fiber:16, iron:5, calcium:120, serv:1, mins:20, rating:4.7, tags:['High-fibre','Lower-GI'],
     ingredients:['1 cup chickpeas','Mixed greens','¼ avocado','Cherry tomatoes','Tahini-lemon dressing'],
     steps:['Roast the chickpeas with spices.','Build the bowl with greens, avocado and tomatoes.','Drizzle with tahini dressing.'], items:['lentil','spinach']},
    {name:'Egg & avocado breakfast', emoji:'🥑', kcal:380, p:20, c:18, f:26, fiber:8, iron:3, calcium:90, serv:1, mins:10, rating:4.6, tags:['Low-GI','Protein'],
     ingredients:['2 eggs','½ avocado','1 slice rye bread','Chilli flakes','Lemon'],
     steps:['Boil or poach the eggs.','Mash avocado on rye with lemon and chilli.','Top with the eggs.'], items:['eggs']},
    {name:'Chicken & lentil salad', emoji:'🍗', kcal:440, p:40, c:34, f:14, fiber:12, iron:6, calcium:70, serv:1, mins:20, rating:4.7, tags:['Protein','Fibre'],
     ingredients:['120g grilled chicken','¾ cup lentils','Rocket & cucumber','Olive oil & vinegar','Mixed seeds'],
     steps:['Grill and slice the chicken.','Toss lentils, rocket and cucumber.','Add chicken, dress, and top with seeds.'], items:['chicken','lentil']} ],
  perimenopause:[
    {name:'Cottage cheese & berry bowl', emoji:'🥣', kcal:300, p:26, c:30, f:8, fiber:5, iron:1, calcium:200, serv:1, mins:5, rating:4.5, tags:['Protein','Calcium'],
     ingredients:['1 cup cottage cheese','½ cup berries','1 tbsp flaxseed','Handful of walnuts','Cinnamon'],
     steps:['Spoon the cottage cheese into a bowl.','Top with berries, walnuts and flaxseed.','Dust with cinnamon.'], items:['cottage']},
    {name:'Tofu & edamame stir-fry', emoji:'🥘', kcal:420, p:30, c:34, f:18, fiber:9, iron:5, calcium:350, serv:2, mins:20, rating:4.6, tags:['Calcium','Phyto-estrogen'],
     ingredients:['200g firm tofu','1 cup edamame','Broccoli & peppers','Soy, garlic & ginger','Sesame oil'],
     steps:['Pan-fry the tofu until golden.','Stir-fry the veg and edamame.','Add tofu and sauce; serve.'], items:['cottage','spinach']},
    {name:'Sardine & white-bean toast', emoji:'🍞', kcal:390, p:28, c:34, f:16, fiber:9, iron:4, calcium:300, serv:1, mins:10, rating:4.4, tags:['Calcium','Vitamin D'],
     ingredients:['1 tin sardines','½ cup white beans','2 slices wholegrain toast','Lemon & parsley','Olive oil'],
     steps:['Mash the beans with lemon and oil.','Spread on toast; top with sardines.','Finish with parsley.'], items:['salmon','pbtoast']} ],
};

/* "Circle" — female-oriented community (HerFuel's take on Carb Manager's "Connect"): learn / watch / challenges / groups.
   Articles & videos carry a category + are searchable/filterable; "For you" maps to the active module. */
CF.CIRCLE = {
  cats:['For you','All','Basics','Cycle','Pregnancy','Postpartum','PCOS','Perimenopause'],
  articles:[
    {t:'How many calories do you actually need?', m:'4 min read', cat:'Basics', by:'Dr. Lena Ortiz, RD'},
    {t:'Protein 101: how much, and when', m:'5 min read', cat:'Basics', by:'Dr. Lena Ortiz, RD'},
    {t:'Reading a nutrition label in 10 seconds', m:'3 min read', cat:'Basics'},
    {t:'Macros vs calories: what actually matters', m:'5 min read', cat:'Basics'},
    {t:'Why your appetite shifts across your cycle', m:'5 min read', cat:'Cycle', by:'Dr. Lena Ortiz, RD'},
    {t:'Iron, energy & your period', m:'6 min read', cat:'Cycle', by:'Dr. Priya Nair, MD'},
    {t:'Trimester-by-trimester nutrition', m:'7 min read', cat:'Pregnancy', by:'Dr. Priya Nair, MD'},
    {t:'Folate & iron: the pregnancy essentials', m:'6 min read', cat:'Pregnancy', by:'Dr. Priya Nair, MD'},
    {t:'Eating through morning sickness', m:'4 min read', cat:'Pregnancy'},
    {t:'Eating to protect your milk supply', m:'6 min read', cat:'Postpartum', by:'Dr. Lena Ortiz, RD'},
    {t:'No rush to “bounce back”: postpartum fuel', m:'5 min read', cat:'Postpartum'},
    {t:'Low-GI eating for PCOS, honestly', m:'6 min read', cat:'PCOS', by:'Dr. Lena Ortiz, RD'},
    {t:'PCOS & insulin resistance: the basics', m:'5 min read', cat:'PCOS', by:'Dr. Priya Nair, MD'},
    {t:'Protein & muscle through perimenopause', m:'6 min read', cat:'Perimenopause', by:'Dr. Lena Ortiz, RD'},
    {t:'Calcium, vitamin D & your bones', m:'5 min read', cat:'Perimenopause', by:'Dr. Priya Nair, MD'},
    {t:'Nutrition for better midlife sleep', m:'5 min read', cat:'Perimenopause'} ],
  videos:[
    {t:'5-minute iron-rich dinners', cat:'Basics', m:'4:30'},
    {t:'Iron & your cycle', cat:'Cycle', m:'5:30'},
    {t:'Eating through morning sickness', cat:'Pregnancy', m:'6:10'},
    {t:'Gentle postpartum movement', cat:'Postpartum', m:'8:15'},
    {t:'Snacks that steady blood sugar', cat:'PCOS', m:'4:48'},
    {t:'Protein at every meal in perimenopause', cat:'Perimenopause', m:'5:02'} ],
  challenges:[
    {id:'hydration', t:'7-day hydration', sub:'Hit your water goal for a week', who:'2,140 joined', icon:'💧'},
    {id:'protein',   t:'Protein goal week', sub:'Meet your protein target 5 of 7 days', who:'1,580 joined', icon:'💪'},
    {id:'iron',      t:'Iron-rich week', sub:'An iron-rich meal every day', who:'960 joined', icon:'🩸'},
    {id:'tunein',    t:'Tune-in challenge', sub:'Log how you feel for 7 days', who:'1,210 joined', icon:'💗'} ],
  groups:[
    {id:'ttc', t:'Trying to conceive', who:'12k members', icon:'🌱'},
    {id:'preg', t:'Pregnancy', who:'28k members', icon:'🤰'},
    {id:'pp', t:'Postpartum & feeding', who:'22k members', icon:'🤱'},
    {id:'pcos', t:'PCOS sisters', who:'15k members', icon:'🌸'},
    {id:'peri', t:'Perimenopause', who:'9k members', icon:'🌿'},
    {id:'cycle', t:'Cycle syncing', who:'18k members', icon:'🌙'} ],
  chat:[
    {who:'Aisha', text:'My iron came back low — anyone found foods that actually helped?', t:'2h'},
    {who:'Maria', text:'Lentil dahl + a squeeze of lemon for absorption 🍋 game-changer for me', t:'1h'},
    {who:'Jess', text:'Pairing spinach with vitamin C is the move. Also the iron-rich week challenge here is great motivation', t:'42m'} ],
};

/* ---- Measurements / Progress (Carb-Manager "Goals"): chart + history; integration data fills these ---- */
/* source: an integration id (auto-fills when connected) OR 'manual' / 'logged' (always available) */
CF.MEASURES = [
  {id:'weight',  label:'Weight',        unit:'lb',     cat:'Body',      source:'scale',  goal:'Goal 155 lb',
   data:[167,166.2,165.6,165,164.4,163.9,163.4,163,162.6,162.3]},
  {id:'bodyfat', label:'Body fat',      unit:'%',      cat:'Body',      source:'scale',  goal:'',
   data:[30.1,29.8,29.5,29.2,29.0,28.9,28.7,28.6,28.5,28.4]},
  {id:'steps',   label:'Steps',         unit:'',       cat:'Lifestyle', source:'garmin', goal:'Goal 8,000',
   data:[5400,7200,6420,8100,9050,6800,7600,8140,5900,6420]},
  {id:'sleep',   label:'Sleep',         unit:'h',      cat:'Lifestyle', source:'oura',   goal:'Goal 8h',
   data:[6.5,7.1,6.8,7.4,6.2,7.0,6.9,7.2,6.4,6.8]},
  {id:'hrv',     label:'HRV',           unit:'ms',     cat:'Health',    source:'oura',   goal:'',
   data:[42,46,44,49,41,47,45,48,43,48]},
  {id:'glucose', label:'Blood glucose', unit:'mg/dL',  cat:'Health',    source:'manual', goal:'',
   data:[95,92,98,90,94,91,96,89,93,92]},
  {id:'calories',label:'Calories',      unit:'kcal',   cat:'Diet',      source:'logged', goal:'Target 2,300',
   data:[2100,2250,1980,2300,2180,2050,2310,1990,2240,2160]},
  {id:'protein', label:'Protein',       unit:'g',      cat:'Diet',      source:'logged', goal:'Target 110',
   data:[95,108,72,110,101,88,115,67,104,98]},
  {id:'cyclelen',label:'Cycle length',  unit:'days',   cat:'Cycle & body', source:'applehealth', goal:'~28 days',
   data:[29,28,30,27,29,28,28,31,28,29]},
  {id:'flow',    label:'Period flow',   unit:'(1–3)',  cat:'Cycle & body', source:'applehealth', goal:'',
   data:[0,0,1,2,3,2,1,0,0,0]},
  {id:'bbt',     label:'BBT / skin temp', unit:'°F',   cat:'Cycle & body', source:'oura', goal:'',
   data:[97.8,97.7,97.9,97.8,98.1,98.3,98.4,98.3,98.2,98.4]},
];
/* manual symptom logger options (read from Apple Health where present, else added manually) */
CF.SYMPTOM_OPTIONS=['Cramps','Bloating','Breast tenderness','Headache','Low mood','Fatigue','Cravings','Acne','Hot flashes','Night sweats','Nausea','Poor sleep'];
CF.measureById=function(id){ return CF.MEASURES.find(function(m){return m.id===id;}); };
CF.intName=function(id){ var i=CF.INTEGRATIONS.find(function(x){return x.id===id;}); return i?i.name:id; };

/* optional life-stage modules (the "Carb Manager model" — toggle on/off) */
CF.MODULES = [
  {key:'cycle',         adds:'Cycle-phase view · craving anticipation · iron & PMS nutrient focus · period-app / Apple Health sync'},
  {key:'pregnancy',     adds:'Trimester calorie targets (+340 in T2) · folate & iron focus · food-safety awareness · healthy-gain framing'},
  {key:'breastfeeding', adds:'Higher target (+400 kcal, evidence-based) · supply-safe guidance · protein & calcium focus'},
  {key:'pcos',          adds:'Lower-GI / insulin-aware coaching · fibre & protein focus · symptom tracking'},
  {key:'perimenopause', adds:'Higher protein for muscle (≈1.2 g/kg) · calcium & vitamin-D focus · sleep-aware'},
];
/* general (no module) baseline target */
CF.GENERAL = { kcal:CF.BASE.kcal, protein:CF.BASE.protein, carbs:230, iron:18, calcium:1000, fiber:28 };
