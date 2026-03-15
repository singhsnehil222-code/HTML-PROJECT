'use strict';
// ═══════════════════════════════════════════════════════
//  INTRO SCREEN SETUP
// ═══════════════════════════════════════════════════════

// Stars
(function initIntroStars(){
  const cv=document.getElementById('intro-stars');
  function resize(){cv.width=innerWidth;cv.height=innerHeight;}
  resize();window.addEventListener('resize',resize);
  const ctx=cv.getContext('2d');
  const stars=Array.from({length:160},()=>({
    x:Math.random()*cv.width,y:Math.random()*cv.height*.6,
    r:.3+Math.random()*1.4,a:Math.random()*Math.PI*2,spd:.005+Math.random()*.015,
    col:['#ffffff','#ffeecc','#ccddff','#ffccff'][Math.floor(Math.random()*4)]
  }));
  cv.style.position='absolute';cv.style.inset='0';cv.style.zIndex='2';cv.style.pointerEvents='none';
  (function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    stars.forEach(s=>{
      s.a+=s.spd;const op=.2+.8*Math.abs(Math.sin(s.a));
      ctx.globalAlpha=op;ctx.fillStyle=s.col;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    });
    ctx.globalAlpha=1;
    if(document.getElementById('intro'))requestAnimationFrame(draw);
  })();
})();

// Pixel clouds — drawn as blocky squares
(function initClouds(){
  const wrap=document.getElementById('intro-clouds');
  wrap.style.cssText='position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden';
  const cloudDefs=[
    {top:'10%',left:'5%', w:96, h:40, spd:35, alpha:.85},
    {top:'22%',left:'30%',w:140,h:52, spd:50, alpha:.75},
    {top:'14%',left:'58%',w:110,h:44, spd:40, alpha:.8},
    {top:'28%',left:'75%',w:80, h:36, spd:28, alpha:.7},
    {top:'6%', left:'82%',w:60, h:28, spd:45, alpha:.65},
  ];
  cloudDefs.forEach((cd,i)=>{
    const cv=document.createElement('canvas');
    const px=8; // pixel size for blocky look
    const cw=Math.ceil(cd.w/px)*px, ch=Math.ceil(cd.h/px)*px;
    cv.width=cw;cv.height=ch;
    cv.style.cssText=`position:absolute;top:${cd.top};left:${cd.left};image-rendering:pixelated;animation:cloudDrift ${cd.spd}s linear ${i*-8}s infinite`;
    const ctx=cv.getContext('2d');
    // Draw blocky cloud pixels
    const shape=[
      [0,0,1,1,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,0,0,0,0,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
    ];
    const cols=shape[0].length, rows=shape.length;
    const bw=Math.floor(cw/cols), bh=Math.floor(ch/rows);
    ctx.fillStyle=`rgba(255,255,255,${cd.alpha})`;
    shape.forEach((row,ry)=>row.forEach((cell,cx2)=>{if(cell)ctx.fillRect(cx2*bw,ry*bh,bw,bh);}));
    wrap.appendChild(cv);
  });
})();

// Pixel buildings spread wide across screen
(function initBuildings(){
  const wrap=document.getElementById('intro-buildings');
  const buildings=[
    {w:22,h:110,col:'rgba(15,8,45,.8)',winCol:'rgba(255,210,80,.55)'},
    {w:18,h:65, col:'rgba(20,12,50,.75)',winCol:'rgba(100,200,255,.5)'},
    {w:28,h:140,col:'rgba(10,6,36,.85)',winCol:'rgba(255,200,80,.55)'},
    {w:16,h:48, col:'rgba(25,14,55,.7)',winCol:'rgba(200,100,255,.5)'},
    {w:32,h:90, col:'rgba(12,8,40,.8)',winCol:'rgba(255,210,80,.55)'},
    {w:20,h:72, col:'rgba(18,10,42,.75)',winCol:'rgba(80,220,255,.5)'},
    {w:14,h:38, col:'rgba(22,12,48,.7)',winCol:'rgba(255,180,80,.5)'},
    {w:26,h:115,col:'rgba(8,5,32,.85)',winCol:'rgba(255,210,80,.6)'},
    {w:18,h:60, col:'rgba(20,12,50,.75)',winCol:'rgba(120,255,150,.5)'},
    {w:24,h:95, col:'rgba(14,8,38,.8)',winCol:'rgba(255,200,80,.55)'},
    {w:16,h:50, col:'rgba(24,14,52,.7)',winCol:'rgba(200,150,255,.5)'},
    {w:30,h:130,col:'rgba(10,6,36,.85)',winCol:'rgba(255,215,80,.6)'},
    {w:18,h:55, col:'rgba(22,14,50,.7)',winCol:'rgba(80,200,255,.5)'},
    {w:22,h:80, col:'rgba(16,10,42,.78)',winCol:'rgba(255,200,80,.55)'},
  ];
  buildings.forEach(b=>{
    const el=document.createElement('div');
    el.style.cssText=`width:${b.w}px;height:${b.h}px;background:${b.col};border-top:2px solid rgba(255,215,0,.25);position:relative;overflow:hidden;flex-shrink:0;image-rendering:pixelated;animation:floatCity ${3.5+Math.random()*2}s ease-in-out ${Math.random()*2}s infinite`;
    // Windows
    const winRows=Math.floor(b.h/14);const winCols=Math.floor(b.w/8);
    for(let r=0;r<winRows;r++) for(let c=0;c<winCols;c++){
      if(Math.random()>.35){
        const w=document.createElement('div');
        w.style.cssText=`position:absolute;width:4px;height:4px;left:${c*7+2}px;top:${r*12+6}px;background:${b.winCol};image-rendering:pixelated`;
        el.appendChild(w);
      }
    }
    // Antenna on tall buildings
    if(b.h>100){
      const ant=document.createElement('div');
      ant.style.cssText=`position:absolute;top:-8px;left:${Math.floor(b.w/2)-1}px;width:2px;height:8px;background:rgba(200,200,200,.6)`;
      el.appendChild(ant);
      const dot=document.createElement('div');
      dot.style.cssText=`position:absolute;top:-10px;left:${Math.floor(b.w/2)-2}px;width:4px;height:4px;background:#ff3333;border-radius:50%;animation:twinkle ${1+Math.random()}s ease-in-out infinite`;
      el.appendChild(dot);
    }
    wrap.appendChild(el);
  });
})();

// Pixel trees spread across
(function initTrees(){
  const wrap=document.getElementById('intro-trees');
  const positions=[8,16,24,32,40,50,60,68,76,84,92];
  positions.forEach((pct,i)=>{
    const size=Math.random()>.4?1.2:0.8;
    const px=6*size;
    const cv=document.createElement('canvas');
    cv.width=Math.round(32*size);cv.height=Math.round(48*size);
    cv.style.cssText=`position:absolute;bottom:0;left:${pct}%;image-rendering:pixelated;animation:floatCity ${4+Math.random()*3}s ease-in-out ${Math.random()*3}s infinite`;
    const ctx=cv.getContext('2d');
    // Trunk
    ctx.fillStyle='#5a3010';
    ctx.fillRect(Math.round(cv.width/2-px/4),Math.round(cv.height*.6),Math.round(px/2),Math.round(cv.height*.4));
    // Layered leaves — blocky pixel style
    const leafColors=['#1a5a1a','#228822','#2ea02e','#3ab83a'];
    const layers=[{w:.9,y:.36},{w:.75,y:.22},{w:.55,y:.1}];
    layers.forEach((l,li)=>{
      ctx.fillStyle=leafColors[li];
      const lw=Math.round(cv.width*l.w), lh=Math.round(cv.height*.22);
      ctx.fillRect(Math.round((cv.width-lw)/2),Math.round(cv.height*l.y),lw,lh);
    });
    wrap.appendChild(cv);
  });
})();

// Walking pixel characters across ground
(function initWalkers(){
  const wrap=document.getElementById('intro-walkers');
  const chars=[
    {col:'#FF6B9D',shirt:'#4488FF',dir:'left', spd:18, delay:0, scale:1},
    {col:'#FFB347',shirt:'#FF6B9D',dir:'right',spd:22, delay:3, scale:.9},
    {col:'#87CEEB',shirt:'#2AFFDB',dir:'left', spd:28, delay:7, scale:1.1},
    {col:'#FFE87C',shirt:'#6EFF7A',dir:'right',spd:20, delay:12, scale:.85},
    {col:'#FF9B3D',shirt:'#FFD700',dir:'left', spd:24, delay:5, scale:1},
  ];
  chars.forEach((c,i)=>{
    const el=document.createElement('div');
    el.className='i-walker';
    el.style.cssText=`${c.dir==='left'?'left:110%':'right:110%'};animation:walk${c.dir==='left'?'Left':'Right'} ${c.spd}s linear ${c.delay}s infinite`;
    // Build pixel char with canvas
    const cv=document.createElement('canvas');
    const s=c.scale;cv.width=Math.round(14*s);cv.height=Math.round(22*s);
    cv.style.cssText='image-rendering:pixelated';
    const ctx=cv.getContext('2d');
    const px=Math.round(4*s);
    // Head
    ctx.fillStyle=c.col;ctx.fillRect(Math.round(cv.width/2-px/2),0,px,px);
    // Body
    ctx.fillStyle=c.shirt;ctx.fillRect(Math.round(cv.width/2-px*.75),px,Math.round(px*1.5),Math.round(px*1.2));
    // Legs
    ctx.fillStyle='#334466';
    ctx.fillRect(Math.round(cv.width/2-px*.6),Math.round(px*2.2),Math.round(px*.55),Math.round(px*.9));
    ctx.fillRect(Math.round(cv.width/2+px*.05),Math.round(px*2.2),Math.round(px*.55),Math.round(px*.9));
    el.appendChild(cv);
    wrap.appendChild(el);
  });
})();

// Center character row
(function initCharRow(){
  const row=document.getElementById('char-row');
  if(!row)return;
  const chars=[
    {skin:'#FFB347',shirt:'#FF6B9D',pants:'#333388',hat:null,   anim:'bob .9s ease-in-out infinite'},
    {skin:'#87CEEB',shirt:'#4488FF',pants:'#222255',hat:'#FFD700',anim:'bob 1.1s ease-in-out .2s infinite'},
    {skin:'#FFE87C',shirt:'#2AFFDB',pants:'#1a3355',hat:null,   anim:'bobBig 1.2s ease-in-out .4s infinite',big:true},
    {skin:'#FF9B3D',shirt:'#6EFF7A',pants:'#224422',hat:null,   anim:'bob 1s ease-in-out .6s infinite'},
  ];
  chars.forEach(c=>{
    const el=document.createElement('div');
    el.className='px-c';el.style.animation=c.anim;
    const scale=c.big?1.5:1;
    const cv=document.createElement('canvas');
    const cw=Math.round(20*scale),ch=Math.round(36*scale);
    cv.width=cw;cv.height=ch;cv.style.cssText='image-rendering:pixelated';
    const ctx=cv.getContext('2d');
    const px=Math.round(5*scale);
    // Hat
    if(c.hat){ctx.fillStyle=c.hat;ctx.fillRect(Math.round(cw/2-px*.8),0,Math.round(px*1.6),Math.round(px*.6));}
    // Head
    const hoy=c.hat?Math.round(px*.5):0;
    ctx.fillStyle=c.skin;ctx.fillRect(Math.round(cw/2-px*.7),hoy,Math.round(px*1.4),Math.round(px*1.3));
    // Eyes
    ctx.fillStyle='#000';
    ctx.fillRect(Math.round(cw/2-px*.35),hoy+Math.round(px*.4),Math.round(px*.25),Math.round(px*.25));
    ctx.fillRect(Math.round(cw/2+px*.1),hoy+Math.round(px*.4),Math.round(px*.25),Math.round(px*.25));
    // Smile
    ctx.fillStyle='#cc4444';
    ctx.fillRect(Math.round(cw/2-px*.2),hoy+Math.round(px*.85),Math.round(px*.5),Math.round(px*.18));
    // Body
    const by=hoy+Math.round(px*1.3);
    ctx.fillStyle=c.shirt;ctx.fillRect(Math.round(cw/2-px*.8),by,Math.round(px*1.6),Math.round(px*1.5));
    // Arms
    ctx.fillStyle=c.skin;
    ctx.fillRect(Math.round(cw/2-px*1.3),by,Math.round(px*.5),Math.round(px*1.2));
    ctx.fillRect(Math.round(cw/2+px*.8),by,Math.round(px*.5),Math.round(px*1.2));
    // Pants
    const py2=by+Math.round(px*1.5);
    ctx.fillStyle=c.pants;
    ctx.fillRect(Math.round(cw/2-px*.75),py2,Math.round(px*.7),Math.round(px*1.2));
    ctx.fillRect(Math.round(cw/2+px*.05),py2,Math.round(px*.7),Math.round(px*1.2));
    el.appendChild(cv);
    row.appendChild(el);
  });
})();

// Guide character in HTP
(function initGuideSprite(){
  const wrap=document.getElementById('guide-sprite');
  const cv=document.createElement('canvas');cv.width=40;cv.height=64;
  cv.style.cssText='image-rendering:pixelated;width:40px;height:64px';
  const ctx=cv.getContext('2d');const px=8;
  // Hat
  ctx.fillStyle='#FFD700';ctx.fillRect(12,0,16,5);
  ctx.fillStyle='#CC9900';ctx.fillRect(10,5,20,4);
  // Head
  ctx.fillStyle='#FFB347';ctx.fillRect(12,9,16,14);
  // Eyes
  ctx.fillStyle='#000';ctx.fillRect(15,14,4,4);ctx.fillRect(22,14,4,4);
  // Smile
  ctx.fillStyle='#cc4444';ctx.fillRect(15,21,10,3);
  // Shirt
  ctx.fillStyle='#2AFFDB';ctx.fillRect(10,23,20,16);
  // Arms
  ctx.fillStyle='#FFB347';ctx.fillRect(2,23,8,12);ctx.fillRect(30,23,8,12);
  // Wave hand
  ctx.fillStyle='#FFB347';ctx.fillRect(2,18,8,5);
  // Pants
  ctx.fillStyle='#224466';ctx.fillRect(10,39,8,14);ctx.fillRect(22,39,8,14);
  // Shoes
  ctx.fillStyle='#111133';ctx.fillRect(8,52,12,6);ctx.fillRect(20,52,12,6);
  // Mayor badge
  ctx.fillStyle='#FFD700';ctx.fillRect(14,27,12,6);
  ctx.fillStyle='#000';
  // star on badge
  ctx.fillRect(19,29,2,2);
  wrap.appendChild(cv);
})();

// ═══════════════════════════════════════════════════════
//  HOW TO PLAY LOGIC
// ═══════════════════════════════════════════════════════
function openHTP(){document.getElementById('htp-overlay').classList.add('on');}
function closeHTP(){document.getElementById('htp-overlay').classList.remove('on');}

// ── INTRO: Pine tree row (like image 7 foreground) ──
(function initPines(){
  const wrap=document.getElementById('intro-pines');
  if(!wrap)return;
  const pineCount=18;
  for(let i=0;i<pineCount;i++){
    const pct=(i/(pineCount-1))*100;
    const h=55+Math.random()*40;// height varies 55–95px
    const w=Math.round(h*.55);
    const cv=document.createElement('canvas');
    cv.width=w;cv.height=h;
    cv.style.cssText=`position:absolute;bottom:0;left:${pct}%;transform:translateX(-50%);image-rendering:pixelated;animation:floatCity ${5+Math.random()*4}s ease-in-out ${Math.random()*4}s infinite`;
    const ctx=cv.getContext('2d');
    // Pine colors — dark teal-green like image 7
    const pineColors=['#1a5e2a','#1e6a30','#154e22','#2a7a3a','#17562a'];
    const col=pineColors[i%pineColors.length];
    const darkCol=pineColors[(i+2)%pineColors.length];
    // Trunk
    ctx.fillStyle='#5a3010';
    const tw=Math.round(w*.18),th=Math.round(h*.25);
    ctx.fillRect(Math.round((w-tw)/2),h-th,tw,th);
    // Pine layers — 4 triangular pixel tiers
    const layers=4;
    for(let l=0;l<layers;l++){
      const ly=Math.round(h*.05+l*(h*.2));
      const lw=Math.round(w*(.9-l*.12));
      const lh=Math.round(h*.28);
      ctx.fillStyle=l%2===0?col:darkCol;
      // Draw as a stepped triangle
      for(let row=0;row<lh;row++){
        const rowW=Math.round(lw*(1-row/lh));
        const rowX=Math.round((w-rowW)/2);
        ctx.fillRect(rowX,ly+row,rowW,1);
      }
    }
    // Snow tips occasionally
    if(Math.random()>.65){ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(Math.round(w/2-1),Math.round(h*.05),2,3);}
    wrap.appendChild(cv);
  }
})();

// ── INTRO: Hot air balloon floating ──
(function initBalloon(){
  const cv=document.getElementById('balloon-cv');
  if(!cv)return;
  cv.width=innerWidth;cv.height=innerHeight;
  window.addEventListener('resize',()=>{cv.width=innerWidth;cv.height=innerHeight;});
  const ctx=cv.getContext('2d');
  let bx=innerWidth*.72,by=innerHeight*.22,bvx=-.3,bvy=.08,bPhase=0;
  const stripeColors=['#e83030','#f0f0f0','#3388ff','#ffcc00','#ff6600','#33cc44'];
  function drawBalloon(x,y){
    ctx.clearRect(0,0,cv.width,cv.height);
    const r=28,px=Math.round(x),py=Math.round(y);
    // Balloon body — striped pixel circle
    ctx.save();ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.clip();
    for(let s=0;s<stripeColors.length;s++){
      ctx.fillStyle=stripeColors[s];
      ctx.fillRect(px-r+s*(r*2/stripeColors.length),py-r,r*2/stripeColors.length,r*2);
    }
    ctx.restore();
    // Outline
    ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.stroke();
    // Highlight
    ctx.fillStyle='rgba(255,255,255,.25)';ctx.beginPath();ctx.ellipse(px-8,py-10,10,7,-.4,0,Math.PI*2);ctx.fill();
    // Basket
    ctx.fillStyle='#8B5C2A';ctx.fillRect(px-10,py+r+2,20,14);
    ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1;ctx.strokeRect(px-10,py+r+2,20,14);
    // Ropes
    ctx.strokeStyle='#5a3a10';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(px-8,py+r);ctx.lineTo(px-8,py+r+2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(px+8,py+r);ctx.lineTo(px+8,py+r+2);ctx.stroke();
    // Tiny pilot pixel person
    ctx.fillStyle='#FFB347';ctx.fillRect(px-2,py+r+1,5,5);// head
    ctx.fillStyle='#3388ff';ctx.fillRect(px-3,py+r+5,7,6);// body
  }
  function animBalloon(){
    if(!document.getElementById('intro'))return;
    bPhase+=.012;
    by+=Math.sin(bPhase)*.35+bvy;
    bx+=bvx;
    if(bx<-60)bx=cv.width+60;
    if(by<cv.height*.08)bvy=.06;
    if(by>cv.height*.4)bvy=-.06;
    drawBalloon(bx,by);
    requestAnimationFrame(animBalloon);
  }
  animBalloon();
})();
document.getElementById('htp-open-btn').addEventListener('click',openHTP);
document.getElementById('htp-close').addEventListener('click',closeHTP);
document.getElementById('htp-start-btn').addEventListener('click',()=>{closeHTP();});
document.getElementById('htp-game-btn').addEventListener('click',openHTP);

// ═══════════════════════════════════════════════════════
//  GAME CONSTANTS & STATE
// ═══════════════════════════════════════════════════════
const GRID_SIZE=20, TILE=2.2, HALF=GRID_SIZE/2;

const DEFS={
  house:    {cost:200,  pop:4,  happy:2,  income:0,  h:1.8, emoji:'🏠', name:'House',      key:'h'},
  apart:    {cost:500,  pop:12, happy:3,  income:0,  h:2.8, emoji:'🏢', name:'Apartment',  key:'a'},
  sky:      {cost:1500, pop:40, happy:1,  income:0,  h:5.0, emoji:'🏙️',name:'Skyscraper', key:'k', lock:true, lockMoney:1500},
  factory:  {cost:500,  pop:0,  happy:-3, income:12, h:2.4, emoji:'🏭', name:'Factory',    key:'f'},
  shop:     {cost:350,  pop:0,  happy:3,  income:7,  h:1.4, emoji:'🏪', name:'Shop',       key:'s'},
  park:     {cost:150,  pop:1,  happy:8,  income:0,  h:0.3, emoji:'🌳', name:'Park',       key:'p'},
  bush:     {cost:30,   pop:0,  happy:2,  income:0,  h:0.3, emoji:'🌿', name:'Bush',       key:'b'},
  fence:    {cost:20,   pop:0,  happy:0,  income:0,  h:0.4, emoji:'🪵', name:'Fence',      key:'e'},
  road:     {cost:50,   pop:0,  happy:0,  income:0,  h:0.1, emoji:'🛣️',name:'Road',       key:'r'},
  hospital: {cost:800,  pop:10, happy:20, income:0,  h:2.2, emoji:'🏥', name:'Hospital',   key:'j'},
  school:   {cost:600,  pop:8,  happy:12, income:0,  h:2.0, emoji:'🏫', name:'School',     key:'c'},
  lake:     {cost:100,  pop:0,  happy:5,  income:0,  h:0.1, emoji:'🌊', name:'Lake',       key:'l'},
  bridge:   {cost:150,  pop:0,  happy:1,  income:0,  h:0.2, emoji:'🌉', name:'Bridge',     key:'g'},
  demolish: {cost:0,    pop:0,  happy:0,  income:0,  h:0,   emoji:'💥', name:'Demolish',   key:'d'},
};

const ACHS=[
  {id:'a1',icon:'🏗',name:'Builder',  check:()=>Object.keys(G.grid).length>=1},
  {id:'a2',icon:'👥',name:'Town',     check:()=>G.pop>=10},
  {id:'a3',icon:'💰',name:'Rich',     check:()=>G.totalEarned>=10000},
  {id:'a4',icon:'🏭',name:'Industry', check:()=>(G.counts.factory||0)>=5},
  {id:'a5',icon:'🏙',name:'City',     check:()=>G.pop>=100},
  {id:'a6',icon:'😄',name:'Utopia',   check:()=>G.happy>=90},
];

const G={
  money:5000, pop:0, happy:50, score:0,
  day:1, timeOfDay:0.45, weather:'clear',
  grid:{}, tool:'house', playerName:'PLAYER',
  counts:{}, totalEarned:0, achievements:new Set(),
  over:false,
};

// ═══════════════════════════════════════════════════════
//  THREE.JS SETUP
// ═══════════════════════════════════════════════════════
const wrap=document.getElementById('cw');
const scene=new THREE.Scene();
// No scene.fog — dewy cloud canvas handles atmosphere

const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('gc'),antialias:true,powerPreference:'high-performance',alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.1;
renderer.setClearColor(0x000000,0);// fully transparent — sky canvas shows through

function resizeR(){
  const w=wrap.clientWidth,h=wrap.clientHeight;
  renderer.setSize(w,h);// true = also sets canvas.style.width/height so getBoundingClientRect matches
  cam.aspect=w/h;cam.updateProjectionMatrix();
  const skyCV=document.getElementById('sky-backdrop');
  const fogCV=document.getElementById('fog-clouds');
  if(skyCV){skyCV.width=w;skyCV.height=h;}
  if(fogCV){fogCV.width=w;fogCV.height=h;}
}

const cam=new THREE.PerspectiveCamera(48,1,.1,400);
cam.position.set(35,38,35);cam.lookAt(0,0,0);

// Lights
const ambL=new THREE.AmbientLight(0xffd8a8,.9);scene.add(ambL);
const sun=new THREE.DirectionalLight(0xfff4dd,1.8);
sun.position.set(25,45,20);sun.castShadow=true;
sun.shadow.mapSize.width=sun.shadow.mapSize.height=1024;
const sc=HALF*TILE*1.4;
sun.shadow.camera.left=-sc;sun.shadow.camera.right=sc;
sun.shadow.camera.top=sc;sun.shadow.camera.bottom=-sc;
sun.shadow.bias=-.001;scene.add(sun);
const moonL=new THREE.DirectionalLight(0x3344aa,0);moonL.position.set(-20,35,-15);scene.add(moonL);
const hemiL=new THREE.HemisphereLight(0x87ceeb,0x4a9a30,.65);scene.add(hemiL);

// Improved checkerboard ground with terrain variety
const gGeo=new THREE.BoxGeometry(TILE,.28,TILE);
const grassColors=[0x5aaa3a,0x4e9a30,0x62b840,0x56a436,0x4a9430];
for(let gx=0;gx<GRID_SIZE;gx++) for(let gz=0;gz<GRID_SIZE;gz++){
  const seed2=(gx*31+gz*17)%5;
  const baseCol=(gx+gz)%2===0?grassColors[seed2]:grassColors[(seed2+2)%5];
  const m=new THREE.Mesh(gGeo,new THREE.MeshLambertMaterial({color:baseCol}));
  m.position.set((gx-HALF+.5)*TILE,-.14,(gz-HALF+.5)*TILE);
  m.receiveShadow=true;scene.add(m);
}
// Terrain border — deep water/dirt surround
const bord=new THREE.Mesh(new THREE.BoxGeometry(GRID_SIZE*TILE+4,.2,GRID_SIZE*TILE+4),new THREE.MeshLambertMaterial({color:0x2a6a8a}));
bord.position.y=-.4;scene.add(bord);
// Shallow water edge strips around border
const shoreColors=[0x3a8aaa,0x2a7a9a];
[[-HALF*TILE-TILE/2,0,0,TILE,0.3,GRID_SIZE*TILE+2*TILE],[HALF*TILE+TILE/2,0,0,TILE,0.3,GRID_SIZE*TILE+2*TILE],[0,0,-HALF*TILE-TILE/2,GRID_SIZE*TILE,0.3,TILE],[0,0,HALF*TILE+TILE/2,GRID_SIZE*TILE,0.3,TILE]].forEach(([x,y,z,w,h,d],i)=>{
  const shore=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:shoreColors[i%2],transparent:true,opacity:.85}));shore.position.set(x,-.22,z);scene.add(shore);
});

// Stars 3D
const sGeo=new THREE.BufferGeometry();const sPos=new Float32Array(300*3);
for(let i=0;i<300;i++){sPos[i*3]=(Math.random()-.5)*300;sPos[i*3+1]=40+Math.random()*80;sPos[i*3+2]=(Math.random()-.5)*300;}
sGeo.setAttribute('position',new THREE.BufferAttribute(sPos,3));
const sMat=new THREE.PointsMaterial({color:0xffffff,size:.22,transparent:true,opacity:0});
const stars3=new THREE.Points(sGeo,sMat);scene.add(stars3);

// Pixel moon
const moonG=new THREE.Group();const moonM=new THREE.MeshBasicMaterial({color:0xf0e8d8});
[[2,0],[3,0],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[0,3],[1,3],[2,3],[1,4],[2,4]].forEach(([bx,by])=>{
  const mb=new THREE.Mesh(new THREE.BoxGeometry(.9,.9,.4),moonM);mb.position.set(bx-1.5,-by+2,0);moonG.add(mb);
});
moonG.position.set(80,120,-120);moonG.visible=false;scene.add(moonG);

// Hover tile
const hovMesh=new THREE.Mesh(
  new THREE.BoxGeometry(TILE*.94,.06,TILE*.94),
  new THREE.MeshBasicMaterial({color:0x2AFFDB,transparent:true,opacity:.45,depthWrite:false})
);
hovMesh.visible=false;scene.add(hovMesh);

// ── MATERIAL CACHE (moved up so buildTerrain can use M/MS) ──
const MC={};
const M=(c)=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:c}));
const MS=(c,o={})=>{const k='s'+c+JSON.stringify(o);return MC[k]||(MC[k]=new THREE.MeshStandardMaterial({color:c,...o}));};

// ── g2w / gkey helpers (moved up for buildTerrain) ──
function g2w(gx,gz){return{wx:(gx-HALF+.5)*TILE,wz:(gz-HALF+.5)*TILE};}
function gkey(gx,gz){return `${gx},${gz}`;}

// Arrays for animated lake/bridge/fountain objects
const lakeShimmerMeshes=[];
const lakeReedMeshes=[];
const bridgeLanterns=[];
const bridgePedestrians=[];
const fountainLights=[];
// Lake tile positions (also used by jungle tree exclusion below)
const lakeTiles=[[15,0],[16,0],[17,0],[18,0],[19,0],[15,1],[16,1],[17,1],[18,1],[19,1],[15,2],[16,2],[17,2],[18,2],[19,2],[16,3],[17,3],[18,3],[19,3],[17,4],[18,4],[19,4],[18,5],[19,5]];
  // ── REALISTIC LAKE — layered depth, reeds, lily pads, shimmer ──
  const lakeDeep   =new THREE.MeshLambertMaterial({color:0x0d5a9a,transparent:true,opacity:.96});
  const lakeMid    =new THREE.MeshLambertMaterial({color:0x1a7acc,transparent:true,opacity:.88});
  const lakeShallow=new THREE.MeshLambertMaterial({color:0x38a8d8,transparent:true,opacity:.72});
  const lakeEdge   =new THREE.MeshLambertMaterial({color:0x5abfe0,transparent:true,opacity:.55});

  // Deep base (lowest layer)
  const lakeBase=new THREE.Mesh(new THREE.BoxGeometry(TILE*7,0.08,TILE*6.5),new THREE.MeshLambertMaterial({color:0x07304a}));
  lakeBase.position.set(g2w(17,2).wx,-.22,g2w(17,2).wz);scene.add(lakeBase);

  lakeTiles.forEach(([gx,gz])=>{
    const{wx,wz}=g2w(gx,gz);
    // Distance from center of lake for depth variation
    const cx=17,cz=2;
    const dist=Math.sqrt((gx-cx)**2+(gz-cz)**2);
    const mat=dist<1.2?lakeDeep:dist<2.5?lakeMid:dist<3.8?lakeShallow:lakeEdge;
    const waterH=dist<1.2?-.02:dist<2.5?-.04:dist<3.8?-.06:-.08;
    const lk=new THREE.Mesh(new THREE.BoxGeometry(TILE,.22,TILE),mat);
    lk.position.set(wx,waterH,wz);lk.receiveShadow=true;scene.add(lk);

    // Animated shimmer streaks on surface
    if(Math.random()>.42){
      const shimW=TILE*(.12+Math.random()*.28),shimD=TILE*(.04+Math.random()*.06);
      const sh=new THREE.Mesh(new THREE.BoxGeometry(shimW,.225,shimD),new THREE.MeshBasicMaterial({color:0xaaddff,transparent:true,opacity:.18+Math.random()*.22}));
      sh.position.set(wx+(Math.random()-.5)*TILE*.55,waterH+.01,wz+(Math.random()-.5)*TILE*.55);
      sh.userData.shimmerPhase=Math.random()*Math.PI*2;sh.userData.shimmerAmp=.08+Math.random()*.12;
      scene.add(sh);lakeShimmerMeshes.push(sh);
    }
    // Depth shadow (sandy bottom tint peeking through shallow edges)
    if(dist>3&&Math.random()>.6){
      const sand=new THREE.Mesh(new THREE.BoxGeometry(TILE*.9,.15,TILE*.9),new THREE.MeshLambertMaterial({color:0x8a7040,transparent:true,opacity:.3}));
      sand.position.set(wx,-.14,wz);scene.add(sand);
    }
  });

  // Lily pads
  const lilyColors=[0x228833,0x2a9940,0x1e7a2c];
  [[16,1,.3],[17,2,0],[18,1,.5],[16,2,.2],[17,1,-.3],[18,2,.1]].forEach(([gx,gz,rot])=>{
    const{wx,wz}=g2w(gx,gz);
    const lp=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.03,8),new THREE.MeshLambertMaterial({color:lilyColors[Math.floor(Math.random()*3)]}));
    lp.position.set(wx+(Math.random()-.5)*.8,-.01,wz+(Math.random()-.5)*.8);lp.rotation.y=rot;scene.add(lp);
    // Lily flower
    if(Math.random()>.5){
      const fl=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.08,6),new THREE.MeshLambertMaterial({color:[0xffeeaa,0xffccdd,0xffffff][Math.floor(Math.random()*3)]}));
      fl.position.set(lp.position.x,lp.position.y+.06,lp.position.z);scene.add(fl);
    }
  });

  // Reeds around lake edge
  const reedMat=new THREE.MeshLambertMaterial({color:0x3a7a20});
  [[15,0],[15,1],[15,2],[19,0],[19,1],[19,2],[16,3],[17,3],[15,3]].forEach(([gx,gz])=>{
    const{wx,wz}=g2w(gx,gz);
    for(let r=0;r<3;r++){
      const h=.5+Math.random()*.6;
      const reed=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,h,4),reedMat);
      reed.position.set(wx+(Math.random()-.5)*TILE*.7,.03,wz+(Math.random()-.5)*TILE*.7);
      reed.userData.reedPhase=Math.random()*Math.PI*2;scene.add(reed);lakeReedMeshes.push(reed);
      // Reed tip
      const tip=new THREE.Mesh(new THREE.CylinderGeometry(.042,.025,.12,4),new THREE.MeshLambertMaterial({color:0x5a3010}));
      tip.position.set(reed.position.x,h+.1,reed.position.z);scene.add(tip);
    }
  });

  // ── GRAND ARCHED BRIDGE over lake — wider, stone-arch style ──
  {
    const bridgeWood=new THREE.MeshLambertMaterial({color:0x7a5030});
    const bridgeStone=new THREE.MeshLambertMaterial({color:0x8a7860});
    const bridgeDark=new THREE.MeshLambertMaterial({color:0x5a3a18});
    const bridgeRail=new THREE.MeshLambertMaterial({color:0x6a4a28});
    const bridgeLanternMat=MS(0xfffacc,{emissive:0xfff060,emissiveIntensity:0});

    // Bridge spans tiles [13,3],[14,3],[15,3],[16,3] — wider crossing
    [[13,3],[14,3],[15,3],[16,3]].forEach(([gx,gz],idx)=>{
      const{wx,wz}=g2w(gx,gz);
      // Stone base arch per segment
      const archH=idx===1||idx===2?.28:.18;// higher arch in middle
      const stoneBase=new THREE.Mesh(new THREE.BoxGeometry(TILE*.95,archH+.05,TILE*.95),bridgeStone);
      stoneBase.position.set(wx,-.02+archH/2,wz);scene.add(stoneBase);
      // Arched underside (inset box to fake arch)
      const archCut=new THREE.Mesh(new THREE.BoxGeometry(TILE*.6,.22,TILE*.85),bridgeWood);
      archCut.position.set(wx,archH*.25,wz);scene.add(archCut);
      // Deck planks (7 planks per tile, cross-grain)
      for(let p=0;p<7;p++){
        const plank=new THREE.Mesh(new THREE.BoxGeometry(TILE*.9,.07,TILE*.12),bridgeWood);
        plank.position.set(wx,archH+.1,wz-TILE*.42+p*(TILE*.14));
        plank.receiveShadow=true;scene.add(plank);
      }
      // Long-grain brace running full tile
      const brace=new THREE.Mesh(new THREE.BoxGeometry(TILE*.06,.07,TILE*.88),bridgeDark);
      brace.position.set(wx,archH+.08,wz);scene.add(brace);
      // Side railings (thicker, stone-topped)
      [-TILE*.46,TILE*.46].forEach(xo=>{
        // Lower rail
        const rail1=new THREE.Mesh(new THREE.BoxGeometry(.1,.14,TILE*.9),bridgeStone);
        rail1.position.set(wx+xo,archH+.21,wz);scene.add(rail1);
        // Upper rail cap
        const rail2=new THREE.Mesh(new THREE.BoxGeometry(.14,.06,TILE*.9),bridgeStone);
        rail2.position.set(wx+xo,archH+.32,wz);scene.add(rail2);
        // Baluster posts every ~0.3 units
        for(let pp=0;pp<4;pp++){
          const bal=new THREE.Mesh(new THREE.BoxGeometry(.08,.28,.08),bridgeRail);
          bal.position.set(wx+xo,archH+.15,wz-TILE*.38+pp*(TILE*.26));
          scene.add(bal);
        }
      });
      // Stone arch support piers at ends
      if(idx===0||idx===3){
        [-TILE*.44,TILE*.44].forEach(xo=>{
          const pier=new THREE.Mesh(new THREE.BoxGeometry(.32,.65,.32),bridgeStone);
          pier.position.set(wx+xo,.12,wz+(idx===0?-1:1)*TILE*.44);
          pier.castShadow=true;scene.add(pier);
        });
      }
      // Bridge lanterns at entry/exit points
      if(idx===0||idx===3){
        [-TILE*.46,TILE*.46].forEach(xo=>{
          const side2=idx===0?-1:1;
          const pole=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,.7,5),bridgeDark);
          pole.position.set(wx+xo,archH+.4,wz+side2*TILE*.44);scene.add(pole);
          const lantern=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.18),bridgeLanternMat.clone());
          lantern.position.set(wx+xo,archH+.82,wz+side2*TILE*.44);
          lantern.userData.isBridgeLantern=true;scene.add(lantern);
          const lpt=new THREE.PointLight(0xffee88,0,3);
          lpt.position.copy(lantern.position);scene.add(lpt);
          bridgeLanterns.push({mesh:lantern,light:lpt});
        });
      }
    });

    // ── Bridge pedestrians — 2 pixel people walking across ──
    const pedColors=[[0x3366cc,0xffccaa],[0xcc3366,0xffddbb]];
    pedColors.forEach(([shirtCol,skinCol],pi)=>{
      const ped=new THREE.Group();
      // Head
      const hd=new THREE.Mesh(new THREE.BoxGeometry(.14,.14,.14),new THREE.MeshLambertMaterial({color:skinCol}));hd.position.y=.62;ped.add(hd);
      // Body
      const bd=new THREE.Mesh(new THREE.BoxGeometry(.12,.18,.1),new THREE.MeshLambertMaterial({color:shirtCol}));bd.position.y=.44;ped.add(bd);
      // Legs
      const lm=new THREE.MeshLambertMaterial({color:0x334466});
      [[-.03,.22],[.03,.22]].forEach(([x,y])=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.045,.16,.045),lm);l.position.set(x,y,0);ped.add(l);});
      // Arm swing
      const am=new THREE.MeshLambertMaterial({color:skinCol});
      const armL=new THREE.Mesh(new THREE.BoxGeometry(.04,.12,.04),am);armL.position.set(-.09,.44,0);ped.add(armL);
      const armR=new THREE.Mesh(new THREE.BoxGeometry(.04,.12,.04),am);armR.position.set(.09,.44,0);ped.add(armR);
      // Hat (different per pedestrian)
      const hat=new THREE.Mesh(new THREE.BoxGeometry(.16,.06,.16),new THREE.MeshLambertMaterial({color:pi===0?0x224488:0xaa2244}));hat.position.y=.70;ped.add(hat);
      // Position on bridge deck — different lanes
      const{wx:bx,wz:bz}=g2w(14,3);
      ped.position.set(bx+(pi===0?-TILE*.22:TILE*.22),0.35,bz);
      ped.rotation.y=pi===0?Math.PI/2:-Math.PI/2;
      scene.add(ped);
      bridgePedestrians.push({
        mesh:ped,armL,armR,
        startX:bx+(pi===0?-TILE*.22:TILE*.22),
        dir:pi===0?1:-1,
        prog:pi===0?0:.5,// start at different offsets
        bobPhase:Math.random()*Math.PI*2,
        speed:.004+Math.random()*.002
      });
    });
  }

  // ── DOCKYARD (wood planks along lake edge) ──
  const dockMat=new THREE.MeshLambertMaterial({color:0x8B5C2A});
  [[15,-1],[16,-1],[17,-1]].forEach(([gx,gz])=>{
    const{wx,wz}=g2w(gx,gz);
    const pl=new THREE.Mesh(new THREE.BoxGeometry(TILE,.28,TILE),dockMat);pl.position.set(wx,.02,wz);pl.receiveShadow=true;scene.add(pl);
    const cp=new THREE.Mesh(new THREE.BoxGeometry(TILE,.29,.08),new THREE.MeshLambertMaterial({color:0x7a4e20}));cp.position.set(wx,.025,wz);scene.add(cp);
    [-.8,.8].forEach(ox=>{const post=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.9,5),new THREE.MeshLambertMaterial({color:0x6B4020}));post.position.set(wx+ox*.48,.32,wz);post.castShadow=true;scene.add(post);});
  });
  // Boat
  const{wx:bwx,wz:bwz}=g2w(17,1);
  const bHull=new THREE.Mesh(new THREE.BoxGeometry(.9,.24,1.6),new THREE.MeshLambertMaterial({color:0xcc8833}));bHull.position.set(bwx,.08,bwz);scene.add(bHull);
  const bDeck=new THREE.Mesh(new THREE.BoxGeometry(.76,.14,.9),new THREE.MeshLambertMaterial({color:0xfff8e0}));bDeck.position.set(bwx,.2,bwz-.15);scene.add(bDeck);
  const bMast=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,.95,4),new THREE.MeshLambertMaterial({color:0x8b5c2a}));bMast.position.set(bwx,.6,bwz-.15);scene.add(bMast);
  const bSail=new THREE.Mesh(new THREE.BoxGeometry(.5,.6,.04),new THREE.MeshLambertMaterial({color:0xfff0cc}));bSail.position.set(bwx,.8,bwz-.15);scene.add(bSail);
  const{wx:dsx,wz:dsz}=g2w(16,-1);
  const dPole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.4,5),new THREE.MeshLambertMaterial({color:0x5a3010}));dPole.position.set(dsx,.7,dsz+TILE*.4);scene.add(dPole);
  const dBoard=new THREE.Mesh(new THREE.BoxGeometry(.9,.32,.09),new THREE.MeshLambertMaterial({color:0xaa7733}));dBoard.position.set(dsx,1.22,dsz+TILE*.4);scene.add(dBoard);

  // ── GRAND PIXELATED FOUNTAIN — with night lighting ──
  const fMat=new THREE.MeshLambertMaterial({color:0xb8c8d8});
  const fAccent=new THREE.MeshLambertMaterial({color:0xd4e4f4});
  const fWatMat=new THREE.MeshLambertMaterial({color:0x44aaee,transparent:true,opacity:.85});
  const{wx:fx,wz:fz}=g2w(9,9);const fcx=fx+TILE/2,fcz=fz+TILE/2;
  [[9,9],[10,9],[9,10],[10,10]].forEach(([gx,gz])=>{
    const{wx:pgx,wz:pgz}=g2w(gx,gz);
    const pg=new THREE.Mesh(new THREE.BoxGeometry(TILE,.14,TILE),new THREE.MeshLambertMaterial({color:0x55cc66}));pg.position.set(pgx,-.07,pgz);pg.receiveShadow=true;scene.add(pg);
    const tile2=new THREE.Mesh(new THREE.BoxGeometry(TILE*.9,.15,TILE*.9),new THREE.MeshLambertMaterial({color:0xc8b890}));tile2.position.set(pgx,-.06,pgz);tile2.receiveShadow=true;scene.add(tile2);
  });
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.3,.18,12),fMat);rim.position.set(fcx,.09,fcz);scene.add(rim);
  const bWater=new THREE.Mesh(new THREE.CylinderGeometry(1.08,1.08,.1,12),fWatMat);bWater.position.set(fcx,.2,fcz);scene.add(bWater);
  const mid1f=new THREE.Mesh(new THREE.CylinderGeometry(.55,.7,.22,8),fAccent);mid1f.position.set(fcx,.46,fcz);scene.add(mid1f);
  const mid2f=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.1,8),fWatMat);mid2f.position.set(fcx,.6,fcz);scene.add(mid2f);
  const top1f=new THREE.Mesh(new THREE.CylinderGeometry(.22,.3,.2,8),fMat);top1f.position.set(fcx,.82,fcz);scene.add(top1f);
  const top2f=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.08,8),fWatMat);top2f.position.set(fcx,.96,fcz);scene.add(top2f);
  const spire=new THREE.Mesh(new THREE.CylinderGeometry(.04,.1,.5,6),fAccent);spire.position.set(fcx,1.06,fcz);scene.add(spire);
  const spireTop=new THREE.Mesh(new THREE.SphereGeometry(.1,6,6),new THREE.MeshLambertMaterial({color:0xaaccee}));spireTop.position.set(fcx,1.36,fcz);scene.add(spireTop);
  // Water cascades
  for(let i=0;i<8;i++){
    const ang=i/8*Math.PI*2;const r=.72;
    const cascade=new THREE.Mesh(new THREE.BoxGeometry(.06,.4,.06),new THREE.MeshLambertMaterial({color:0x88ccff,transparent:true,opacity:.55}));
    cascade.position.set(fcx+Math.cos(ang)*r,.32,fcz+Math.sin(ang)*r);cascade.rotation.z=ang*.3;scene.add(cascade);
  }
  // Koi fish
  const koiColors=[0xff4444,0xff8800,0xffffff,0xff6644];
  for(let k=0;k<4;k++){
    const ang=k/4*Math.PI*2;
    const koi=new THREE.Mesh(new THREE.BoxGeometry(.25,.06,.12),new THREE.MeshLambertMaterial({color:koiColors[k]}));
    koi.position.set(fcx+Math.cos(ang)*.7,.22,fcz+Math.sin(ang)*.7);koi.rotation.y=ang;koi.userData.koiAng=ang;scene.add(koi);
  }
  // Benches
  const benchMat2=new THREE.MeshLambertMaterial({color:0x8B5C2A});
  [[0,1.6],[1.6,0],[-1.6,0],[0,-1.6]].forEach(([bx2,bz2])=>{
    const bench2=new THREE.Mesh(new THREE.BoxGeometry(.8,.08,.3),benchMat2);bench2.position.set(fcx+bx2,.24,fcz+bz2);bench2.rotation.y=Math.atan2(bx2,bz2);scene.add(bench2);
    const leg2a=new THREE.Mesh(new THREE.BoxGeometry(.08,.2,.08),benchMat2);leg2a.position.set(fcx+bx2-.3,.14,fcz+bz2);leg2a.rotation.y=Math.atan2(bx2,bz2);scene.add(leg2a);
    const leg2b=leg2a.clone();leg2b.position.set(fcx+bx2+.3,.14,fcz+bz2);scene.add(leg2b);
  });
  // ── FOUNTAIN NIGHT LIGHTS — 4 coloured underwater point lights + central glow ──
  const fountainLightColors=[0x4488ff,0x44ffcc,0xff44aa,0xffcc44];
  fountainLightColors.forEach((col,i)=>{
    const ang=i/4*Math.PI*2;
    const fl=new THREE.PointLight(col,0,5);
    fl.position.set(fcx+Math.cos(ang)*.6,.3,fcz+Math.sin(ang)*.6);
    fl.userData.isFountainLight=true;fl.userData.phase=i/4*Math.PI*2;
    scene.add(fl);fountainLights.push(fl);
  });
  // Central upward spotlight
  const fSpot=new THREE.PointLight(0xaaddff,0,6);fSpot.position.set(fcx,.5,fcz);
  fSpot.userData.isFountainLight=true;fSpot.userData.phase=0;
  scene.add(fSpot);fountainLights.push(fSpot);

  // ── JUNGLE MAP — Dense demolishable trees filling most of the grid ──
  // These are placed into G.grid so player can demolish them for refund
  const jungleTreePositions=[];
  for(let gx=0;gx<GRID_SIZE;gx++){
    for(let gz=0;gz<GRID_SIZE;gz++){
      const key=gkey(gx,gz);
      // Skip: lake tiles, dock tiles, fountain area, edges for roads
      const isLake=lakeTiles.some(([lx,lz])=>lx===gx&&lz===gz);
      const isDock=[[15,-1],[16,-1],[17,-1]].some(([dx,dz])=>dx===gx&&dz===gz);
      const isFountain=(gx>=9&&gx<=10&&gz>=9&&gz<=10);
      const isEdge=(gx===0||gx===19||gz===0||gz===19);
      if(isLake||isDock||isFountain)continue;
      // 70% of non-edge tiles get jungle trees
      const density=isEdge?0.3:0.7;
      if(Math.random()<density){jungleTreePositions.push([gx,gz]);}
    }
  }
  jungleTreePositions.forEach(([gx,gz])=>{
    const{wx,wz}=g2w(gx,gz);
    const grp=new THREE.Group();grp.position.set(wx,0,wz);
    const treeType=Math.floor(Math.random()*4);
    const trunkH=.5+Math.random()*.4;
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,trunkH,6),new THREE.MeshLambertMaterial({color:0x5a3010}));trunk.position.y=trunkH/2;trunk.castShadow=true;grp.add(trunk);
    const leafColors=[[0x1a6012,0x228822,0x33aa33],[0x155a10,0x1e7a1e,0x2a992a],[0x226622,0x2d882d,0x44aa44],[0x1a5510,0x287028,0x33883a]];
    const lc=leafColors[treeType];
    const lh=1.2+Math.random()*.8;
    if(treeType<2){// Round canopy
      [[.55,trunkH+lh*.3,lc[0]],[.42,trunkH+lh*.6,lc[1]],[.28,trunkH+lh*.85,lc[2]]].forEach(([r,y,c])=>{
        const lm=new THREE.Mesh(new THREE.BoxGeometry(r*2,r,r*2),new THREE.MeshLambertMaterial({color:c}));lm.position.y=y;lm.castShadow=true;grp.add(lm);
      });
    } else {// Layered pine style
      [[.32,trunkH+lh*.2,lc[0]],[.24,trunkH+lh*.45,lc[1]],[.16,trunkH+lh*.65,lc[2]],[.08,trunkH+lh*.82,lc[2]]].forEach(([r,y,c])=>{
        const lm=new THREE.Mesh(new THREE.BoxGeometry(r*2.5,r*.8,r*2.5),new THREE.MeshLambertMaterial({color:c}));lm.position.y=y;lm.castShadow=true;grp.add(lm);
      });
    }
    scene.add(grp);
    // Mark as demolishable jungle tree in grid
    G.grid[gkey(gx,gz)]={type:'jungle',mesh:grp,gx,gz,lastInc:0};
  });
// end terrain setup

const wins=[], lampLights=[];
// CLEAR DIFFERENTIATION: each building type has a unique dominant color identity
const palettes={
  house:    [[0x3399FF,0x1155CC],[0xFF7744,0xCC4422],[0x44CCFF,0x2299BB]],// bright blue / warm orange / cyan
  apart:    [[0xD4CCA8,0xA09070],[0xC0B890,0x907840]],// sandy beige — distinct from house
  sky:      [[0x222244,0x111133],[0x1A2236,0x0D1520]],// very dark navy — premium
  factory:  [[0xFF5500,0xCC3300],[0xFF8800,0xCC5500],[0x666666,0x444444]],// orange/grey industrial
  shop:     [[0xFF2266,0xCC0044],[0xFF9900,0xCC6600],[0x00AA88,0x006655]],// hot pink / amber / teal
  hospital: [[0xFFFFFF,0xDDDDEE],[0xEEEEFF,0xCCCCDD]],// WHITE — unmistakable
  school:   [[0xFFCC00,0xCC9900],[0xFFAA00,0xCC7700]],// bright YELLOW — distinct
};
function pickCol(t){const p=palettes[t]||[[0x888888,0x666666]];return p[Math.floor(Math.random()*p.length)];}

// ═══════════════════════════════════════════════════════
//  BUILDING MESHES
// ═══════════════════════════════════════════════════════
function makeMesh(type,gx,gz){
  const{wx,wz}=g2w(gx,gz);
  const grp=new THREE.Group();grp.position.set(wx,0,wz);
  const seed=gx*31+gz*17;

  if(type==='bush'){
    // Pixel bush — round green cluster
    const grp2=new THREE.Group();grp2.position.set(wx,0,wz);
    const bushColors=[[0x22aa33,0x338844],[0x44bb22,0x228833],[0x33cc44,0x229933]];
    const[bc3,bc4]=bushColors[seed%bushColors.length];
    const bBase=new THREE.Mesh(new THREE.BoxGeometry(TILE*.55,.32,TILE*.55),M(bc3));bBase.position.y=.16;bBase.castShadow=true;bBase.receiveShadow=true;grp2.add(bBase);
    const bTop=new THREE.Mesh(new THREE.BoxGeometry(TILE*.4,.28,TILE*.4),M(bc4));bTop.position.y=.38;grp2.add(bTop);
    const bTip=new THREE.Mesh(new THREE.BoxGeometry(TILE*.22,.22,TILE*.22),M(0x44dd55));bTip.position.y=.55;grp2.add(bTip);
    // Flowers occasionally
    if(seed%3===0){
      const flowerCols=[0xff4488,0xffcc00,0xff8844,0xaa44ff,0x4488ff];
      const fCol=flowerCols[seed%flowerCols.length];
      [[-.2,.52,.2],[.2,.52,-.2],[0,.56,0]].forEach(([fx,fy,fz])=>{
        const fl=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,.1),M(fCol));fl.position.set(fx,fy,fz);grp2.add(fl);
      });
    }
    scene.add(grp2);return grp2;
  }
  if(type==='fence'){
    const grp2=new THREE.Group();grp2.position.set(wx,0,wz);
    const fMat=M(0xc8a060);
    // Direction-aware: check neighboring tiles to determine fence orientation
    const hasLeft=!!G.grid[gkey(gx-1,gz)];const hasRight=!!G.grid[gkey(gx+1,gz)];
    const hasUp=!!G.grid[gkey(gx,gz-1)];const hasDown=!!G.grid[gkey(gx,gz+1)];
    // If neighbors on Z axis (up/down) prefer Z-axis orientation, else X-axis
    const faceZ=(hasUp||hasDown)&&!(hasLeft||hasRight);
    const ang=faceZ?Math.PI/2:0;
    grp2.rotation.y=ang;
    // Horizontal rails
    const rail=new THREE.Mesh(new THREE.BoxGeometry(TILE*.9,.07,.07),fMat);rail.position.set(0,.38,0);grp2.add(rail);
    const rail2=new THREE.Mesh(new THREE.BoxGeometry(TILE*.9,.07,.07),fMat);rail2.position.set(0,.22,0);grp2.add(rail2);
    // Vertical pickets
    const pCount=5;
    for(let i=0;i<pCount;i++){
      const px2=-TILE*.4+i*(TILE*.8/(pCount-1));
      const pic=new THREE.Mesh(new THREE.BoxGeometry(.08,.5,.08),fMat);
      pic.position.set(px2,.25,0);pic.castShadow=true;grp2.add(pic);
      const tip=new THREE.Mesh(new THREE.BoxGeometry(.1,.12,.1),M(0xaa8840));tip.position.set(px2,.54,0);grp2.add(tip);
    }
    scene.add(grp2);return grp2;
  }

  if(type==='road'){
    const rm=new THREE.Mesh(new THREE.BoxGeometry(TILE,.1,TILE),M(0x445566));rm.position.y=.05;rm.receiveShadow=true;grp.add(rm);
    const dm=new THREE.Mesh(new THREE.BoxGeometry(.07,.11,TILE*.52),M(0xffffff));dm.position.y=.055;grp.add(dm);
    // Always spawn lamp for more street lighting
    {
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,1.05,5),M(0x888899));
      pole.position.set(TILE*.37,.53,TILE*.37);pole.castShadow=true;grp.add(pole);
      const lampMesh=new THREE.Mesh(new THREE.SphereGeometry(.085,5,5),MS(0xffffd0,{emissive:0xffffd0,emissiveIntensity:0}));
      lampMesh.position.set(TILE*.37,1.1,TILE*.37);grp.add(lampMesh);
      const ptl=new THREE.PointLight(0xffeeaa,0,4);ptl.position.copy(lampMesh.position);grp.add(ptl);
      lampLights.push({mesh:lampMesh,light:ptl});
    }
    scene.add(grp);return grp;
  }
  if(type==='park'){
    const gm=new THREE.Mesh(new THREE.BoxGeometry(TILE*.92,.16,TILE*.92),M(0x44CC55));gm.position.y=.08;gm.receiveShadow=true;grp.add(gm);
    // Varied tree types based on seed
    const treeType=seed%4;
    const tc=1+Math.floor(Math.random()*2);
    for(let i=0;i<tc;i++){
      const tx=(Math.random()-.5)*TILE*.5,tz=(Math.random()-.5)*TILE*.5;
      const trk=new THREE.Mesh(new THREE.CylinderGeometry(.07,.11,.6,6),M(treeType<2?0x7a4a1a:0x5a3a10));trk.position.set(tx,.44,tz);trk.castShadow=true;grp.add(trk);
      if(treeType===0){[[.42,1.3,0x228833],[.32,1.58,0x33aa44],[.22,1.78,0x44cc55]].forEach(([s,y,c])=>{
          const lm=new THREE.Mesh(new THREE.BoxGeometry(s*1.6,s,s*1.6),M(c));lm.position.set(tx,y,tz);lm.castShadow=true;grp.add(lm);});
      } else if(treeType===1){[[.28,1.1,0x1a6022],[.22,1.5,0x228833],[.14,1.85,0x33aa44],[.08,2.1,0x44cc55]].forEach(([s,y,c])=>{
          const lm=new THREE.Mesh(new THREE.BoxGeometry(s*2,s*.8,s*2),M(c));lm.position.set(tx,y,tz);lm.castShadow=true;grp.add(lm);});
      } else if(treeType===2){[[.38,1.3,0x228833],[.3,1.6,0xdd4488],[.2,1.82,0xff66aa]].forEach(([s,y,c])=>{
          const lm=new THREE.Mesh(new THREE.BoxGeometry(s*1.5,s,s*1.5),M(c));lm.position.set(tx,y,tz);lm.castShadow=true;grp.add(lm);});
      } else {[[.4,1.3,0x228833],[.32,1.56,0xff8822],[.22,1.78,0xffaa33]].forEach(([s,y,c])=>{
          const lm=new THREE.Mesh(new THREE.BoxGeometry(s*1.5,s,s*1.5),M(c));lm.position.set(tx,y,tz);lm.castShadow=true;grp.add(lm);});}
    }
    const benchMat=M(0x9a6420);
    const bench=new THREE.Mesh(new THREE.BoxGeometry(.55,.06,.18),benchMat);bench.position.set(TILE*.2,.22,TILE*.2);bench.castShadow=true;grp.add(bench);
    const leg1=new THREE.Mesh(new THREE.BoxGeometry(.06,.18,.06),benchMat);leg1.position.set(TILE*.1,.12,TILE*.2);grp.add(leg1);
    const leg2=leg1.clone();leg2.position.set(TILE*.3,.12,TILE*.2);grp.add(leg2);
    const pp=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.9,5),M(0x888899));pp.position.set(-TILE*.3,.45,-TILE*.3);pp.castShadow=true;grp.add(pp);
    const plamp=new THREE.Mesh(new THREE.SphereGeometry(.075,5,5),MS(0xffffd0,{emissive:0xffffd0,emissiveIntensity:0}));plamp.position.set(-TILE*.3,.96,-TILE*.3);grp.add(plamp);
    const pptl=new THREE.PointLight(0xffeeaa,0,3.5);pptl.position.copy(plamp.position);grp.add(pptl);
    lampLights.push({mesh:plamp,light:pptl});
    // Pixel flower patches using uploaded sprite colors
    const flowerPalettes=[[0xff6b9d,0xffcc00],[0x88aaff,0x44cc88],[0xff8844,0xaa44ff],[0xff4466,0x44ffcc]];
    const fp2=flowerPalettes[seed%flowerPalettes.length];
    for(let f=0;f<3;f++){
      const fx2=(Math.random()-.5)*TILE*.7,fz2=(Math.random()-.5)*TILE*.7;
      const stem=new THREE.Mesh(new THREE.BoxGeometry(.02,.14,.02),M(0x228822));stem.position.set(fx2,.22,fz2);grp.add(stem);
      const petal=new THREE.Mesh(new THREE.BoxGeometry(.12,.05,.12),M(fp2[f%2]));petal.position.set(fx2,.3,fz2);grp.add(petal);
    }
    scene.add(grp);return grp;
  }
  if(type==='lake'){
    // Placeable lake tile with ripple effect
    const grp2=new THREE.Group();grp2.position.set(wx,0,wz);
    const lakeMat2=new THREE.MeshLambertMaterial({color:0x1a7acc,transparent:true,opacity:.9});
    const lk2=new THREE.Mesh(new THREE.BoxGeometry(TILE,.18,TILE),lakeMat2);lk2.position.y=-.05;lk2.receiveShadow=true;grp2.add(lk2);
    const rip2=new THREE.Mesh(new THREE.BoxGeometry(TILE*.6,.19,TILE*.1),new THREE.MeshLambertMaterial({color:0x55bbff,transparent:true,opacity:.5}));rip2.position.set(0,-.04,0);grp2.add(rip2);
    // Add lily pad
    if(seed%3===0){const lp=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.03,8),M(0x22aa44));lp.position.set((Math.random()-.5)*.5,-.03,(Math.random()-.5)*.5);grp2.add(lp);}
    scene.add(grp2);return grp2;
  }
  if(type==='bridge'){
    // Direction-aware bridge over water
    const grp2=new THREE.Group();grp2.position.set(wx,0,wz);
    const hasLakeLeft=G.grid[gkey(gx-1,gz)]?.type==='lake'||false;
    const hasLakeRight=G.grid[gkey(gx+1,gz)]?.type==='lake'||false;
    const hasLakeUp=G.grid[gkey(gx,gz-1)]?.type==='lake'||false;
    const hasLakeDown=G.grid[gkey(gx,gz+1)]?.type==='lake'||false;
    const bridgeZ=(hasLakeUp||hasLakeDown)&&!(hasLakeLeft||hasLakeRight);
    grp2.rotation.y=bridgeZ?Math.PI/2:0;
    const dockMat2=new THREE.MeshLambertMaterial({color:0x8B5C2A});
    // Deck planks
    for(let p=0;p<5;p++){
      const plank=new THREE.Mesh(new THREE.BoxGeometry(TILE*.88,.08,TILE*.17),dockMat2);
      plank.position.set(0,.12,-TILE*.35+p*(TILE*.18));plank.castShadow=true;grp2.add(plank);
    }
    // Side rails
    [-TILE*.42,TILE*.42].forEach(xo=>{
      const rail=new THREE.Mesh(new THREE.BoxGeometry(.08,.22,TILE*.9),M(0x7a4e20));rail.position.set(xo,.18,0);grp2.add(rail);
    });
    // Support pillars
    [[-.3,0],[.3,0]].forEach(([xo,zo])=>{
      const post=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.5,5),M(0x6B4020));post.position.set(xo,-.1,zo);post.castShadow=true;grp2.add(post);
    });
    scene.add(grp2);return grp2;
  }

  const def=DEFS[type];
  // Very varied heights — houses: small cottages to tall townhouses
  const heightVariance={
    house:.7+Math.random()*.9,// 0.7–1.6x → small cottages to tall houses
    apart:.85+Math.random()*.4,
    sky:.9+Math.random()*.2,
    factory:.88+Math.random()*.24,
    shop:.75+Math.random()*.5,
    hospital:.9+Math.random()*.15,
    school:.88+Math.random()*.2,
  };
  const h=def.h*(heightVariance[type]||(.88+Math.random()*.22));
  const[bc,rc]=pickCol(type);const bw=TILE*(.78+Math.random()*.14);
  const fm=new THREE.Mesh(new THREE.BoxGeometry(bw+.07,.12,bw+.07),M(0x777888));fm.position.y=.06;fm.receiveShadow=true;grp.add(fm);
  const body=new THREE.Mesh(new THREE.BoxGeometry(bw,h,bw),MS(bc));body.position.y=h/2+.12;body.castShadow=true;body.receiveShadow=true;grp.add(body);
  const winMat=MS(0xFFFCC0,{emissive:0xFFFCC0,emissiveIntensity:0});
  const floors=Math.max(1,Math.floor(h/.55)),cols=Math.min(3,Math.floor(bw/.28));
  for(let fl=0;fl<floors;fl++) for(let c=0;c<cols;c++){
    const xo=cols===1?0:(c-(cols-1)/2)*.26,yo=.28+fl*.5;
    if(Math.random()>.2){const w=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,.02),winMat.clone());w.position.set(xo,h/2+.12+yo-h/2+.08,bw/2+.01);w.userData={isWin:true,flicker:seed*.4+fl*5+c};wins.push(w);grp.add(w);}
    if(Math.random()>.2){const w=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,.02),winMat.clone());w.position.set(xo,h/2+.12+yo-h/2+.08,-(bw/2+.01));w.userData={isWin:true,flicker:seed*.4+fl*5+c+10};wins.push(w);grp.add(w);}
  }
  const rf=new THREE.Mesh(new THREE.BoxGeometry(bw*.8,.16,bw*.8),M(rc));rf.position.y=h+.16+.12;rf.castShadow=true;grp.add(rf);
  const ac=new THREE.Mesh(new THREE.BoxGeometry(.26,.22,.26),M(0x888899));ac.position.set((Math.random()-.5)*bw*.35,h+.16+.12+.19,(Math.random()-.5)*bw*.35);ac.castShadow=true;grp.add(ac);
  if(type==='factory'){
    [.16,-.16].forEach(xo=>{const ch=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,1.1,5),M(0x444455));ch.position.set(xo,h+.16+.12+.55,0);ch.castShadow=true;grp.add(ch);});
    grp.userData.chimney={wx,wz,top:h+1.4};
  }
  if(type==='hospital'){
    const crm=new THREE.MeshBasicMaterial({color:0xff2222});
    const cv2=new THREE.Mesh(new THREE.BoxGeometry(.09,.38,.09),crm);cv2.position.set(0,h+.52+.12,bw/2+.02);grp.add(cv2);
    const ch2=new THREE.Mesh(new THREE.BoxGeometry(.32,.09,.09),crm);ch2.position.set(0,h+.52+.12,bw/2+.02);grp.add(ch2);
  }
  if(type==='school'){
    const fp=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,1.4,5),M(0xaaaaaa));fp.position.set(bw*.3,h+.7,bw*.3);grp.add(fp);
    const flag=new THREE.Mesh(new THREE.BoxGeometry(.6,.32,.04),M(0xff2222));flag.position.set(bw*.3+.3,h+1.2,bw*.3);grp.add(flag);
  }
  if(type==='sky'){
    const sp=new THREE.Mesh(new THREE.CylinderGeometry(.04,.1,h*.4,6),M(0x2e2c48));sp.position.y=h+.16+.12+h*.2;grp.add(sp);
    const dot=new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),MS(0xff2222,{emissive:0xff1111,emissiveIntensity:1}));dot.position.y=h+.16+.12+h*.4+.12;dot.userData.blink=Math.random()*Math.PI*2;grp.add(dot);
  }
  if(type==='shop'){
    const aN=5,aW=bw/aN;
    for(let i=0;i<aN;i++){const s2=i%2===0?0xdd2020:0xfafafa;const stripe=new THREE.Mesh(new THREE.BoxGeometry(aW-.02,.18,.6),M(s2));stripe.position.set(-bw/2+aW*(i+.5),h*.45,bw/2*.3);stripe.rotation.x=-Math.PI/10;grp.add(stripe);}
  }
  if(type==='apart'){
    for(let f=0;f<Math.floor(h/1.1);f++){const b=new THREE.Mesh(new THREE.BoxGeometry(bw+.06,.1,bw+.06),M(0x303042));b.position.y=f*1.1+.06;grp.add(b);}
  }
  scene.add(grp);return grp;
}

// ═══════════════════════════════════════════════════════
//  PLACE / DEMOLISH
// ═══════════════════════════════════════════════════════
function placeBuilding(gx,gz,type){
  if(gx<0||gx>=GRID_SIZE||gz<0||gz>=GRID_SIZE)return;
  const key=gkey(gx,gz);
  if(type==='demolish'){demolishBuilding(gx,gz);return;}
  const def=DEFS[type];
  if(!def){toast('Select a building first!','wn');return;}
  // Allow bridge to be placed on lake tiles
  if(G.grid[key]){
    const existing=G.grid[key];
    if(type==='bridge'&&(existing.type==='lake')){
      // Place bridge over lake — just overlay it
    } else if(existing.type==='jungle'){toast('🌴 Select 💥 DEMOLISH to clear jungle first!','wn');}
    else{toast('Tile occupied!','wn');}
    if(!(type==='bridge'&&existing.type==='lake'))return;
  }
  if(def.lock&&G.money<1500){toast('🔒 Need 💰1500 saved to unlock Skyscraper!','wn');return;}
  if(G.money<def.cost){toast(`Need 💰${def.cost}! Build factories to earn money.`,'er');return;}
  G.money-=def.cost;
  G.pop+=def.pop;
  G.happy=Math.max(0,Math.min(100,G.happy+def.happy));
  G.counts[type]=(G.counts[type]||0)+1;
  const mesh=makeMesh(type,gx,gz);
  G.grid[key]={type,mesh,gx,gz,lastInc:performance.now()};
  // Smooth rise animation
  mesh.scale.y=.01;
  const t0=performance.now();
  (function rise(now){
    const elapsed=now-t0;const t=Math.min(elapsed/400,1);
    const e=1-Math.pow(1-t,3);// cubic ease out
    mesh.scale.y=e;
    if(t<1)requestAnimationFrame(rise);
  })(performance.now());
  updateUI();checkAch();
  toast(`${def.emoji} ${def.name} placed! -💰${def.cost}`,'ok');
  addEcoLog(`Built ${def.name} -$${def.cost}`,'neg');
  if(def.income>0){toast(`💡 This ${def.name} earns $${def.income}/sec passively!`,'nf');}
}

function demolishBuilding(gx,gz){
  const key=gkey(gx,gz),tile=G.grid[key];
  if(!tile){toast('Nothing here to demolish!','wn');return;}

  // Jungle tree special demolish — clearing bonus
  if(tile.type==='jungle'){
    const refund=15+Math.floor(Math.random()*20);
    G.money+=refund;G.totalEarned+=refund;
    const mesh=tile.mesh;const t0=performance.now();
    (function shake(now){
      const elapsed=now-t0;const t=Math.min(elapsed/350,1);
      const wobble=Math.sin(elapsed*.09)*(1-t)*.18;
      mesh.rotation.z=wobble;mesh.rotation.x=wobble*.4;
      const sc=Math.max(0,1-t*t);mesh.scale.set(sc,sc,sc);
      if(t<1){requestAnimationFrame(shake);}
      else{scene.remove(mesh);mesh.traverse(c=>{if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose();});}
    })(performance.now());
    delete G.grid[key];
    hayDayCoinBurst(gx,gz,refund);
    toast(`🌳 Jungle cleared! +💰${refund}`,'ok');
    addEcoLog(`Cleared jungle tree +$${refund}`,'pos');
    updateUI();return;
  }

  const def=DEFS[tile.type];if(!def)return;
  const refund=Math.floor(def.cost*.25);
  G.money+=refund;
  G.pop=Math.max(0,G.pop-def.pop);
  G.happy=Math.max(0,Math.min(100,G.happy-Math.abs(def.happy)*.5));
  if(G.counts[tile.type])G.counts[tile.type]--;
  const mesh=tile.mesh;const t0=performance.now();
  (function shrink(now){
    const elapsed=now-t0;const t=Math.min(elapsed/250,1);
    const e=1-Math.pow(t,2);mesh.scale.set(e,e,e);
    if(t<1){requestAnimationFrame(shrink);}
    else{scene.remove(mesh);mesh.traverse(c=>{if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose();});}
  })(performance.now());
  delete G.grid[key];
  hayDayCoinBurst(gx,gz,refund);
  updateUI();
  toast(`💥 Demolished! +💰${refund} refund`,'nf');
  addEcoLog(`Demolished ${def.name} +$${refund}`,'pos');
}

// ── HAY DAY Coin Burst — coins arc to the money counter ──
function hayDayCoinBurst(gx,gz,amount){
  if(!document.getElementById('game').classList.contains('on'))return;
  const{wx,wz}=g2w(gx,gz);
  const sp=proj3(wx,1.5,wz);
  const rw=renderer.domElement.clientWidth,rh=renderer.domElement.clientHeight;
  const rRect=renderer.domElement.getBoundingClientRect();
  // Convert canvas-local coords to screen coords
  const screenX=rRect.left+sp.x,screenY=rRect.top+sp.y;
  if(sp.x<100||sp.x>rw-100||sp.y<50||sp.y>rh-50)return;
  const coinCount=Math.min(10,Math.max(2,Math.floor(amount/8)));
  const moneyEl=document.getElementById('vm');
  const target=moneyEl?moneyEl.getBoundingClientRect():{left:window.innerWidth*.35,top:30,width:60,height:20};
  const tx=target.left+target.width/2,ty=target.top+target.height/2;
  for(let i=0;i<coinCount;i++){
    setTimeout(()=>{
      const coin=document.createElement('div');
      coin.style.cssText=`position:fixed;z-index:500;pointer-events:none;width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#FFF8A0,#FFD700 50%,#CC9900);border:2px solid #8B6914;box-shadow:0 2px 8px rgba(255,215,0,.9),0 0 12px rgba(255,215,0,.5);display:flex;align-items:center;justify-content:center;font-size:8px;color:#5a3000;font-weight:900;font-family:monospace;will-change:transform`;
      coin.textContent='$';
      const sx=screenX+(Math.random()-.5)*50,sy=screenY+(Math.random()-.5)*30;
      coin.style.left=sx+'px';coin.style.top=sy+'px';
      document.body.appendChild(coin);
      const dur=500+Math.random()*250;
      const arcHeight=60+Math.random()*80;
      let start=null;
      (function anim(ts){
        if(!start)start=ts;
        const raw=(ts-start)/dur;if(raw>1){
          coin.remove();
          if(moneyEl){moneyEl.style.transition='transform .1s,color .1s';moneyEl.style.transform='scale(1.35)';moneyEl.style.color='#FFF8A0';setTimeout(()=>{moneyEl.style.transform='';moneyEl.style.color='';},150);}
          return;
        }
        // Ease in-out cubic
        const p=raw<.5?4*raw*raw*raw:(raw-1)*(2*raw-2)*(2*raw-2)+1;
        const cx=sx+(tx-sx)*p;
        const cy=sy+(ty-sy)*p - Math.sin(raw*Math.PI)*arcHeight;
        const sc=1-.5*p;
        coin.style.transform=`translate(${cx-sx}px,${cy-sy}px) scale(${sc}) rotate(${raw*540}deg)`;
        coin.style.opacity=p>.8?(1-(p-.8)/.2):1;
        requestAnimationFrame(anim);
      })(performance.now());
    },i*90+(Math.random()*40));
  }
}

// ═══════════════════════════════════════════════════════
//  SMOKE PARTICLES
// ═══════════════════════════════════════════════════════
const smokeArr=[];
function spawnSmoke(wx,wz,top){
  const m=new THREE.Mesh(new THREE.SphereGeometry(.09,4,4),new THREE.MeshBasicMaterial({color:0x999999,transparent:true,opacity:.5}));
  m.position.set(wx+(Math.random()-.5)*.1,top,wz+(Math.random()-.5)*.1);
  m.userData={vy:.018+Math.random()*.01,vx:(Math.random()-.5)*.007,vz:(Math.random()-.5)*.007,life:1};
  scene.add(m);smokeArr.push(m);
}
function updateSmoke(dt){
  for(let i=smokeArr.length-1;i>=0;i--){
    const p=smokeArr[i];p.userData.life-=dt/3200;
    if(p.userData.life<=0){scene.remove(p);smokeArr.splice(i,1);continue;}
    p.position.y+=p.userData.vy;p.position.x+=p.userData.vx;p.position.z+=p.userData.vz;
    p.material.opacity=p.userData.life*.4;const s=1+(1-p.userData.life)*1.5;p.scale.set(s,s,s);
  }
}

// ═══════════════════════════════════════════════════════
//  VEHICLES & CITIZENS
// ═══════════════════════════════════════════════════════
const vehicles=[], citizens=[];
let vTimer=0,cTimer=0;
function getRoads(){return Object.values(G.grid).filter(t=>t.type==='road');}
function spawnVehicle(){
  if(vehicles.length>=2)return;// max 2 cars
  const roads=getRoads();if(roads.length<3)return;
  const grp=new THREE.Group();
  const col=[0xFF2200,0xFFCC00,0x0088FF,0x00FF88,0xFF88CC,0xFFAA00][Math.floor(Math.random()*6)];
  const car=new THREE.Mesh(new THREE.BoxGeometry(.5,.2,.75),new THREE.MeshLambertMaterial({color:col}));car.position.y=.1;car.castShadow=true;grp.add(car);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(.36,.15,.42),new THREE.MeshLambertMaterial({color:0x222233}));roof.position.y=.25;grp.add(roof);
  [[.22,.055,.26],[-.22,.055,.26],[.22,.055,-.26],[-.22,.055,-.26]].forEach(([x,y,z])=>{
    const w=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,.055,6),new THREE.MeshLambertMaterial({color:0x111111}));w.position.set(x,y,z);w.rotation.z=Math.PI/2;grp.add(w);
  });
  const start=roads[Math.floor(Math.random()*roads.length)];
  const{wx,wz}=g2w(start.gx,start.gz);
  grp.position.set(wx,0,wz);scene.add(grp);
  vehicles.push({mesh:grp,roads:roads.map(r=>({gx:r.gx,gz:r.gz})),idx:0,t:0,spd:.005+Math.random()*.004});
}
function updateVehicles(){
  for(const v of vehicles){
    if(v.roads.length<2)continue;
    const cur=v.roads[v.idx%v.roads.length],nxt=v.roads[(v.idx+1)%v.roads.length];
    const cw2=g2w(cur.gx,cur.gz),nw=g2w(nxt.gx,nxt.gz);
    v.t+=v.spd;if(v.t>=1){v.t=0;v.idx=(v.idx+1)%v.roads.length;}
    v.mesh.position.x=cw2.wx+(nw.wx-cw2.wx)*v.t;v.mesh.position.z=cw2.wz+(nw.wz-cw2.wz)*v.t;
    const dx=nw.wx-cw2.wx,dz=nw.wz-cw2.wz;if(Math.abs(dx)+Math.abs(dz)>.01)v.mesh.rotation.y=Math.atan2(dx,dz);
  }
}
function spawnCitizen(){
  if(citizens.length>=5||G.pop<2)return;
  const grp=new THREE.Group();
  const skins=[0xFFCCAA,0xFFBB88,0xCC8844];const shirts=[0xFF6B9D,0x4488FF,0xFF9B3D,0x6EFF7A,0x2AFFDB,0xFFD700];
  const sk=skins[Math.floor(Math.random()*skins.length)],sh=shirts[Math.floor(Math.random()*shirts.length)];
  const hd=new THREE.Mesh(new THREE.BoxGeometry(.13,.13,.13),new THREE.MeshLambertMaterial({color:sk}));hd.position.y=.34;grp.add(hd);
  const bd=new THREE.Mesh(new THREE.BoxGeometry(.11,.18,.1),new THREE.MeshLambertMaterial({color:sh}));bd.position.y=.19;grp.add(bd);
  const lm=new THREE.MeshLambertMaterial({color:0x334466});
  [-.03,.03].forEach(x=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.045,.14,.045),lm);l.position.set(x,.07,0);grp.add(l);});
  const x=(Math.random()-.5)*(GRID_SIZE-2)*TILE,z=(Math.random()-.5)*(GRID_SIZE-2)*TILE;
  grp.position.set(x,0,z);scene.add(grp);
  citizens.push({mesh:grp,tx:x+(Math.random()-.5)*TILE*7,tz:z+(Math.random()-.5)*TILE*7,spd:.010+Math.random()*.005,bob:Math.random()*Math.PI*2});
}
function updateCitizens(dt){
  citizens.forEach(c=>{
    const dx=c.tx-c.mesh.position.x,dz=c.tz-c.mesh.position.z,dist=Math.sqrt(dx*dx+dz*dz);
    if(dist<.28){c.tx=(Math.random()-.5)*(GRID_SIZE-2)*TILE;c.tz=(Math.random()-.5)*(GRID_SIZE-2)*TILE;}
    else{c.mesh.position.x+=dx/dist*c.spd;c.mesh.position.z+=dz/dist*c.spd;c.mesh.rotation.y=Math.atan2(dx,dz);}
    c.bob+=dt*.005;c.mesh.position.y=Math.abs(Math.sin(c.bob))*.04;
  });
}

// ═══════════════════════════════════════════════════════
//  PIXEL ANIMALS & BIRDS (from uploaded sprite sheets)
// ═══════════════════════════════════════════════════════
const animals=[], birds=[];
const ANIMAL_TYPES=[
  {name:'raccoon',  colors:[0x222222,0x888888,0xffffff], size:.14, ground:true},
  {name:'hedgehog', colors:[0x886644,0xddaa77,0x222222], size:.12, ground:true},
  {name:'fox',      colors:[0xcc5500,0xffffff,0x222222], size:.14, ground:true},
  {name:'rabbit',   colors:[0xffffff,0xffcccc,0x222222], size:.11, ground:true},
  {name:'squirrel', colors:[0xcc6600,0xffaa44,0xffffff], size:.12, ground:true},
  {name:'frog',     colors:[0x44bb22,0x88dd44,0xffffff], size:.10, ground:true},
];
const BIRD_TYPES=[
  {name:'toucan',   colors:[0x111111,0xff8800,0xffffff], wing:0x111111},
  {name:'cardinal', colors:[0xee2222,0x882222,0x111111], wing:0xdd3333},
  {name:'parrot',   colors:[0x44cc22,0xff8800,0x2244ff], wing:0x44cc22},
  {name:'robin',    colors:[0xcc7722,0xff6633,0x333333], wing:0x8B4513},
  {name:'finch',    colors:[0xffcc00,0xff8800,0x222222], wing:0xffaa00},
  {name:'bluebird', colors:[0x2266ff,0xffaa44,0xaaddff], wing:0x2266ff},
];

function makePixelAnimal(type){
  const grp=new THREE.Group();
  const[c1,c2,c3]=type.colors;const s=type.size;
  // Pixel body (box representation)
  const body=new THREE.Mesh(new THREE.BoxGeometry(s*2,s,s*1.6),M(c1));body.position.y=s*.5;body.castShadow=true;grp.add(body);
  // Head
  const head=new THREE.Mesh(new THREE.BoxGeometry(s*1.2,s*1.1,s*1.1),M(c2));head.position.set(s*.9,s*.8,0);grp.add(head);
  // Eyes
  const eye=new THREE.Mesh(new THREE.BoxGeometry(s*.25,s*.25,s*.05),M(c3));eye.position.set(s*1.42,s*.9,s*.3);grp.add(eye);
  const eye2=eye.clone();eye2.position.set(s*1.42,s*.9,-s*.3);grp.add(eye2);
  // Legs
  [-.4,.4].forEach(xo=>{const l=new THREE.Mesh(new THREE.BoxGeometry(s*.3,s*.4,s*.25),M(c2));l.position.set(xo*s,s*.08,0);grp.add(l);});
  // Tail
  const tail=new THREE.Mesh(new THREE.BoxGeometry(s*.8,s*.5,s*.6),M(c3||c1));tail.position.set(-s*1,s*.4,0);grp.add(tail);
  return grp;
}

function makePixelBird(type){
  const grp=new THREE.Group();
  const[c1,c2,c3]=type.colors;const s=.09;
  // Body
  const body=new THREE.Mesh(new THREE.BoxGeometry(s*1.8,s*1.1,s*1.0),M(c1));body.position.y=.14;body.castShadow=true;grp.add(body);
  // Head
  const head=new THREE.Mesh(new THREE.BoxGeometry(s*1.0,s*1.0,s*1.0),M(c2));head.position.set(s*.8,.2,0);grp.add(head);
  // Beak
  const beak=new THREE.Mesh(new THREE.BoxGeometry(s*.7,s*.3,s*.3),M(0xff8800));beak.position.set(s*1.3,.18,0);grp.add(beak);
  // Wings (spread on hover)
  const wingL=new THREE.Mesh(new THREE.BoxGeometry(s*.2,s*.15,s*1.6),M(type.wing));wingL.position.set(0,.16,s*1.0);grp.add(wingL);
  const wingR=wingL.clone();wingR.position.set(0,.16,-s*1.0);grp.add(wingR);
  grp.userData.wingL=wingL;grp.userData.wingR=wingR;
  // Eye
  const eye=new THREE.Mesh(new THREE.BoxGeometry(s*.25,s*.25,.02),M(c3));eye.position.set(s*1.1,.22,s*.3);grp.add(eye);
  return grp;
}

function spawnAnimal(){
  if(animals.length>=8)return;
  const type=ANIMAL_TYPES[Math.floor(Math.random()*ANIMAL_TYPES.length)];
  const grp=makePixelAnimal(type);
  const x=(Math.random()-.5)*(GRID_SIZE-4)*TILE;const z=(Math.random()-.5)*(GRID_SIZE-4)*TILE;
  grp.position.set(x,0,z);
  grp.rotation.y=Math.random()*Math.PI*2;
  scene.add(grp);
  animals.push({mesh:grp,tx:x+(Math.random()-.5)*TILE*8,tz:z+(Math.random()-.5)*TILE*8,spd:.006+Math.random()*.004,bob:Math.random()*Math.PI*2,pauseT:0,type});
}

function spawnBird(){
  if(birds.length>=3)return;// max 3 birds at a time
  const type=BIRD_TYPES[Math.floor(Math.random()*BIRD_TYPES.length)];
  const grp=makePixelBird(type);
  const x=(Math.random()-.5)*(GRID_SIZE-2)*TILE;const z=(Math.random()-.5)*(GRID_SIZE-2)*TILE;
  const flyH=2+Math.random()*3;
  grp.position.set(x,flyH,z);
  scene.add(grp);
  birds.push({mesh:grp,tx:x+(Math.random()-.5)*TILE*12,tz:z+(Math.random()-.5)*TILE*12,spd:.015+Math.random()*.01,bob:Math.random()*Math.PI*2,flyH,wingPhase:Math.random()*Math.PI*2,type});
}

// ── LAKE shimmer, reed sway, pedestrian walk, fountain night lights ──
function updateLakeAndBridge(dt){
  const now=performance.now()*.001;
  // Water shimmer — opacity pulses and slight scale breathe
  lakeShimmerMeshes.forEach(sh=>{
    sh.userData.shimmerPhase+=dt*.0018;
    const op=.12+.22*Math.abs(Math.sin(sh.userData.shimmerPhase));
    sh.material.opacity=op;
    const sx=1+.18*Math.sin(sh.userData.shimmerPhase*.7);
    sh.scale.set(sx,1,1+.12*Math.sin(sh.userData.shimmerPhase*.5+1));
  });
  // Reed gentle sway
  lakeReedMeshes.forEach(r=>{
    r.userData.reedPhase+=dt*.0008;
    r.rotation.z=Math.sin(r.userData.reedPhase)*.055;
    r.rotation.x=Math.cos(r.userData.reedPhase*.7)*.03;
  });
  // Bridge pedestrians — walk back and forth
  bridgePedestrians.forEach(p=>{
    p.prog+=p.speed*p.dir;
    if(p.prog>1){p.prog=1;p.dir=-1;p.mesh.rotation.y+=Math.PI;}
    if(p.prog<0){p.prog=0;p.dir=1;p.mesh.rotation.y+=Math.PI;}
    // Walk path: Z from gz=3 tile range
    const{wx:bx,wz:bzStart}=g2w(14,2);
    const{wz:bzEnd}=g2w(14,4);
    p.mesh.position.z=bzStart+(bzEnd-bzStart)*p.prog;
    // Bob up and down (walking motion)
    p.bobPhase+=dt*.012;
    p.mesh.position.y=0.32+Math.abs(Math.sin(p.bobPhase))*.04;
    // Arm swing
    if(p.armL&&p.armR){
      p.armL.rotation.x=Math.sin(p.bobPhase)*.35;
      p.armR.rotation.x=-Math.sin(p.bobPhase)*.35;
    }
  });
  // Bridge lanterns — glow at night
  const nf=skyPhase==='night'?1:skyPhase==='dusk'?0.6:skyPhase==='dawn'?0.3:0;
  bridgeLanterns.forEach(bl=>{
    if(bl.mesh){// {mesh, light} pair
      bl.mesh.material.emissiveIntensity=nf*(0.8+.2*Math.sin(now*.9+bl.mesh.position.x));
      bl.light.intensity=nf*(.6+.15*Math.sin(now*.7+bl.mesh.position.z));
    }
  });
  // Fountain night lights — colourful underwater glow, slow rotation
  fountainLights.forEach((fl,i)=>{
    if(fl.userData.isFountainLight){
      const pulse=0.5+0.5*Math.sin(now*1.2+fl.userData.phase+i);
      fl.intensity=nf*(0.8+0.6*pulse);
    }
  });
}

function updateAnimals(dt){
  animals.forEach(a=>{
    a.pauseT-=dt;if(a.pauseT>0)return;
    const dx=a.tx-a.mesh.position.x,dz=a.tz-a.mesh.position.z,dist=Math.sqrt(dx*dx+dz*dz);
    if(dist<.3){
      a.tx=(Math.random()-.5)*(GRID_SIZE-4)*TILE;a.tz=(Math.random()-.5)*(GRID_SIZE-4)*TILE;
      a.pauseT=1200+Math.random()*2000;// pause before moving again
    } else {
      a.mesh.position.x+=dx/dist*a.spd;a.mesh.position.z+=dz/dist*a.spd;
      a.mesh.rotation.y=Math.atan2(dx,dz);
    }
    a.bob+=dt*.008;a.mesh.position.y=Math.abs(Math.sin(a.bob))*.03;
  });
}

function updateBirds(dt){
  birds.forEach(b=>{
    const dx=b.tx-b.mesh.position.x,dz=b.tz-b.mesh.position.z,dist=Math.sqrt(dx*dx+dz*dz);
    if(dist<.5){b.tx=(Math.random()-.5)*(GRID_SIZE-2)*TILE;b.tz=(Math.random()-.5)*(GRID_SIZE-2)*TILE;}
    else{b.mesh.position.x+=dx/dist*b.spd;b.mesh.position.z+=dz/dist*b.spd;b.mesh.rotation.y=Math.atan2(dx,dz);}
    b.bob+=dt*.004;b.mesh.position.y=b.flyH+Math.sin(b.bob)*.4;
    // Flap wings
    b.wingPhase+=dt*.012;
    if(b.mesh.userData.wingL)b.mesh.userData.wingL.rotation.z=Math.sin(b.wingPhase)*0.4;
    if(b.mesh.userData.wingR)b.mesh.userData.wingR.rotation.z=-Math.sin(b.wingPhase)*0.4;
  });
}

// Spawn initial animals and birds
setTimeout(()=>{
  for(let i=0;i<5;i++)spawnAnimal();
  for(let i=0;i<2;i++)spawnBird();
},2000);
let aTimer=0,bTimer=0;

// ═══════════════════════════════════════════════════════
//  RAIN
// ═══════════════════════════════════════════════════════
const rcv=document.getElementById('rcv'),rctx=rcv.getContext('2d');
let rdrops=[],wtimer=0;
function resizeRain(){rcv.width=wrap.clientWidth;rcv.height=wrap.clientHeight;}
function initRain(){rdrops=Array.from({length:130},()=>({x:Math.random()*rcv.width,y:Math.random()*rcv.height,l:10+Math.random()*15,s:4+Math.random()*4,o:.15+Math.random()*.3}));}
function drawRain(){
  rctx.clearRect(0,0,rcv.width,rcv.height);if(G.weather!=='rain')return;
  rctx.lineWidth=1;rctx.strokeStyle='rgba(160,210,255,.75)';
  for(const d of rdrops){rctx.globalAlpha=d.o;rctx.beginPath();rctx.moveTo(d.x,d.y);rctx.lineTo(d.x-1.5,d.y+d.l);rctx.stroke();d.y+=d.s;d.x-=1;if(d.y>rcv.height){d.y=-d.l;d.x=Math.random()*rcv.width;}}
  rctx.globalAlpha=1;
}
function updateWeather(dt){
  wtimer+=dt;if(wtimer<90000)return;wtimer=0;// 90 second weather cycle
  const prev=G.weather;
  G.weather=['clear','clear','clear','rain','fog'][Math.floor(Math.random()*5)];
  rcv.style.opacity=G.weather==='rain'?'1':'0';
  // Dewy fog cloud canvas (not scene blur)
  const fogCV=document.getElementById('fog-clouds');
  if(fogCV)fogCV.style.opacity=G.weather==='fog'?'1':'0';
  document.getElementById('fov').style.opacity='0';// old fullscreen fog off
  const msgs={clear:'☀️ WEATHER CLEARING',rain:'🌧 RAIN INCOMING',fog:'🌫 MORNING DEW ROLLING IN'};
  const banner=document.getElementById('weather-banner');
  banner.textContent=msgs[G.weather]||'🌤 WEATHER CHANGING';
  banner.className='show '+G.weather;
  setTimeout(()=>banner.className='',3500);
}

// ═══════════════════════════════════════════════════════
//  PIXEL SKY BACKDROP — 2D canvas painted behind Three.js
//  Smooth per-channel RGB interpolation, no jarring jumps
// ═══════════════════════════════════════════════════════

// Each phase: top, mid, horizon, mtn-far, mtn-near, ground (all [R,G,B])
const SKYPAL={
  night:{top:[2,2,20],   mid:[4,6,32],    hor:[8,14,52],   mf:[14,22,52], mn:[8,14,36], gnd:[10,18,12]},
  dawn: {top:[24,14,64], mid:[180,80,50], hor:[255,190,90], mf:[68,44,90], mn:[40,26,64],gnd:[40,68,22]},
  day:  {top:[56,136,216],mid:[122,200,244],hor:[184,228,252],mf:[42,120,58],mn:[30,90,44],gnd:[74,154,48]},
  dusk: {top:[34,16,68], mid:[200,60,30], hor:[255,160,60], mf:[58,32,66], mn:[34,18,46],gnd:[42,62,24]},
};
// Smooth per-channel current state (starts at night)
let SC={...SKYPAL.night}; // current rendered colours
let ST={...SKYPAL.night}; // target colours
let skyPhase='night';
let dayT=0,autoT=true;
let lastTimeLabel='';

// 3D light targets per phase
const LIGHTS={
  night:{amb:0.06, sun:0.0,  moon:0.45, hemi:0.08, hSky:0x050820, hGnd:0x080e10, moonV:true,  sunCol:0xfff4dd, ambCol:0x1a2050},
  dawn: {amb:0.35, sun:0.75, moon:0.0,  hemi:0.40, hSky:0xff8844, hGnd:0x2a4820, moonV:false, sunCol:0xffcc88, ambCol:0xff9966},
  day:  {amb:0.62, sun:1.60, moon:0.0,  hemi:0.72, hSky:0x87ceeb, hGnd:0x4a9a30, moonV:false, sunCol:0xfff4dd, ambCol:0xffd8a8},
  dusk: {amb:0.28, sun:0.55, moon:0.08, hemi:0.32, hSky:0xdd5522, hGnd:0x2a3818, moonV:false, sunCol:0xff8822, ambCol:0xff6633},
};
// Smooth 3D-light state

function lerpChannel(a,b,t){return a+(b-a)*t;}
function lerpRGB3(a,b,t){return[lerpChannel(a[0],b[0],t),lerpChannel(a[1],b[1],t),lerpChannel(a[2],b[2],t)];}
function toRGB(c){return`rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;}
function toHex(c){return(Math.round(c[0])<<16)|(Math.round(c[1])<<8)|Math.round(c[2]);}

// Procedural mountain silhouettes (generated once)
const MTN=[];
(function genMtn(){
  for(let row=0;row<3;row++){
    const pts=[];const W=4096,S=100;
    const amps=[[.28,.14,.08,.06],[.18,.09,.06,.04],[.07,.04,.03,.02]];
    const frqs=[[.19,.44,.9,1.8],[.28,.62,1.1,2.2],[.40,.80,1.6,3.0]];
    const offs=[[1.3,.8,2.1,3.5],[.6,1.2,3.1,4.2],[.9,2.0,1.8,3.8]];
    const base=[.18,.10,.04];
    for(let i=0;i<=S;i++){
      let h=base[row];
      for(let j=0;j<4;j++)h+=amps[row][j]*Math.abs(Math.sin(i*frqs[row][j]+offs[row][j]));
      pts.push([i/S*W,h]);
    }
    MTN.push(pts);
  }
})();
let mtnScroll=0;

// Pixel star field
const STARS=Array.from({length:220},()=>({
  x:Math.random()*4000,y:Math.random(),r:.5+Math.random()*1.8,
  ph:Math.random()*Math.PI*2,sp:.008+Math.random()*.025,
  col:['#ffffff','#ffe8cc','#ccdeff','#ffddff'][Math.floor(Math.random()*4)]
}));
// Pixel clouds
const CLOUDS=Array.from({length:9},(_,i)=>({
  x:Math.random()*2200,y:.06+Math.random()*.28,w:70+Math.random()*160,h:26+Math.random()*40,
  sp:.08+Math.random()*.20,a:.55+Math.random()*.35,tier:i%3
}));
// Dewy fog puffs
const FOGPUFFS=Array.from({length:22},()=>({
  x:Math.random()*3000,y:.60+Math.random()*.28,w:80+Math.random()*200,h:16+Math.random()*30,
  sp:.06+Math.random()*.10,a:.20+Math.random()*.35,ph:Math.random()*Math.PI*2
}));

function drawBlockCloud(ctx,x,y,w,h,col,alpha){
  const ps=4;ctx.globalAlpha=alpha;
  [[x,y+h*.38,w,h*.62],[x+w*.08,y+h*.18,w*.76,h*.56],[x+w*.18,y,w*.52,h*.48],
   [x+w*.04,y+h*.28,w*.32,h*.44],[x+w*.58,y+h*.22,w*.30,h*.42]].forEach(([bx,by,bw,bh])=>{
    for(let dy=0;dy<bh;dy+=ps)for(let dx=0;dx<bw;dx+=ps){
      ctx.fillStyle=col;ctx.fillRect(Math.round(bx+dx),Math.round(by+dy),ps,ps);
    }
  });ctx.globalAlpha=1;
}

function drawSkyBackdrop(){
  const el=document.getElementById('sky-backdrop');if(!el)return;
  const W=el.width,H=el.height;if(!W||!H)return;
  const ctx=el.getContext('2d'),t=performance.now()*.001;
  ctx.clearRect(0,0,W,H);

  // SC is already smoothly lerped each frame by lerpSky()
  const top=SC.top,mid=SC.mid,hor=SC.hor,mf=SC.mf,mn=SC.mn,gnd=SC.gnd;

  const skyH=H*.62;

  // ── Sky gradient (3-stop: top→mid→horizon)
  const g=ctx.createLinearGradient(0,0,0,skyH);
  g.addColorStop(0,toRGB(top));g.addColorStop(.5,toRGB(mid));g.addColorStop(1,toRGB(hor));
  ctx.fillStyle=g;ctx.fillRect(0,0,W,skyH);
  // Pixelate the bottom 30% of sky in 8px bands
  const ps8=8;
  for(let py=Math.round(skyH*.70);py<skyH;py+=ps8){
    const t2=(py-skyH*.70)/(skyH*.30);
    const c=lerpRGB3(mid,hor,t2);
    ctx.fillStyle=toRGB(c);ctx.fillRect(0,py,W,ps8);
  }

  // ── Stars (night & transitioning)
  const duskFrac=Math.max(0,(dayT*4%1-.4)/.55); // ramps in during dusk
  const dawnFrac=Math.max(0,(1-(dayT*4%1)/.3));  // fades during dawn
  const starAlpha=skyPhase==='night'?1:skyPhase==='dusk'?duskFrac*.8:skyPhase==='dawn'?Math.max(0,1-dayT*4%1*3.5)*.8:0;
  if(starAlpha>0.02){
    STARS.forEach(s=>{
      s.ph+=s.sp*.016;
      const op=starAlpha*(.25+.75*Math.abs(Math.sin(s.ph)));
      ctx.globalAlpha=op;ctx.fillStyle=s.col;
      ctx.fillRect(Math.round(s.x%W),Math.round(s.y*skyH*.84),Math.ceil(s.r),Math.ceil(s.r));
    });
    ctx.globalAlpha=1;
  }

  // ── Pixelated Sun
  const sunVisible=skyPhase==='day'||skyPhase==='dawn'||skyPhase==='dusk';
  if(sunVisible){
    const ang=dayT*Math.PI*2-Math.PI*.5;
    const sx=W*.5+Math.cos(ang)*W*.38;
    const sy=skyH*.52-Math.sin(ang)*skyH*.60;
    const sr=Math.max(14,Math.round(H*.026));
    if(sy>-sr&&sy<skyH*.93){
      const isDusk=skyPhase==='dusk';const isDawn=skyPhase==='dawn';
      // Glow halo
      const glow=ctx.createRadialGradient(sx,sy,sr*.4,sx,sy,sr*4);
      glow.addColorStop(0,isDusk||isDawn?'rgba(255,110,30,.65)':'rgba(255,245,110,.60)');
      glow.addColorStop(.35,isDusk||isDawn?'rgba(255,80,20,.20)':'rgba(255,210,50,.18)');
      glow.addColorStop(1,'rgba(255,150,0,0)');
      ctx.fillStyle=glow;ctx.beginPath();ctx.arc(sx,sy,sr*4,0,Math.PI*2);ctx.fill();
      // Blocky sun body
      const ps2=Math.max(2,Math.round(sr/4.5));
      const c1=isDusk?'#ffbb33':isDawn?'#ffdd88':'#fffaaa';
      const c2=isDusk?'#ff8811':isDawn?'#ffbb44':'#ffe833';
      for(let dy=-sr;dy<sr;dy+=ps2)for(let dx=-sr;dx<sr;dx+=ps2){
        if(Math.sqrt(dx*dx+dy*dy)<sr){
          ctx.fillStyle=(Math.floor((dx+dy)/ps2))%2===0?c1:c2;
          ctx.fillRect(Math.round(sx+dx),Math.round(sy+dy),ps2,ps2);
        }
      }
      // 8 animated pixel rays
      const rayCol=isDusk?'rgba(255,160,50,.55)':isDawn?'rgba(255,200,80,.50)':'rgba(255,255,160,.60)';
      ctx.fillStyle=rayCol;
      for(let ri=0;ri<8;ri++){
        const ra=ri/8*Math.PI*2+t*.38;
        const rl=sr*(1.15+.45*Math.abs(Math.sin(t+ri)));
        for(let rr=sr+ps2;rr<sr+rl;rr+=ps2){
          ctx.globalAlpha=(1-(rr-sr)/rl)*.55;
          ctx.fillRect(Math.round(sx+Math.cos(ra)*rr-ps2/2),Math.round(sy+Math.sin(ra)*rr-ps2/2),ps2,ps2);
        }
      }
      ctx.globalAlpha=1;
    }
  }

  // ── Moon (night only)
  if(skyPhase==='night'||(skyPhase==='dusk'&&duskFrac>.6)||(skyPhase==='dawn'&&starAlpha>.3)){
    const ma=dayT*Math.PI*2+Math.PI*.5;
    const mx=W*.5+Math.cos(ma)*W*.36;const my=skyH*.48-Math.sin(ma)*skyH*.52;
    const mr=Math.max(10,Math.round(H*.020));
    if(mx>-mr&&mx<W+mr&&my>0&&my<skyH*.92){
      const mglow=ctx.createRadialGradient(mx,my,mr*.3,mx,my,mr*2.8);
      mglow.addColorStop(0,'rgba(210,225,255,.38)');mglow.addColorStop(1,'rgba(180,200,255,0)');
      ctx.fillStyle=mglow;ctx.beginPath();ctx.arc(mx,my,mr*2.8,0,Math.PI*2);ctx.fill();
      const mps=Math.max(2,Math.round(mr/4));
      for(let dy=-mr;dy<mr;dy+=mps)for(let dx=-mr;dx<mr;dx+=mps){
        if(Math.sqrt(dx*dx+dy*dy)<mr&&Math.sqrt((dx-mr*.45)*(dx-mr*.45)+dy*dy)>mr*.65){
          ctx.fillStyle=(Math.floor((dx+dy)/mps))%2===0?'#f0ecd8':'#e4dfc8';
          ctx.fillRect(Math.round(mx+dx),Math.round(my+dy),mps,mps);
        }
      }
    }
  }

  // ── Pixel clouds
  const cAlpha=skyPhase==='night'?.10:skyPhase==='dusk'?.32:skyPhase==='dawn'?.48:.84;
  const cCols=[
    skyPhase==='night'?'#1a2040':skyPhase==='dusk'?'#ffaa66':skyPhase==='dawn'?'#ffd8aa':'#f8f8ff',
    skyPhase==='night'?'#141830':skyPhase==='dusk'?'#ff8844':skyPhase==='dawn'?'#ffccaa':'#ebebf5',
    skyPhase==='night'?'#10142a':skyPhase==='dusk'?'#dd6633':skyPhase==='dawn'?'#ffc088':'#dde8f5',
  ];
  mtnScroll=(mtnScroll+.07)%4096;
  CLOUDS.forEach(cl=>{cl.x-=cl.sp;if(cl.x+cl.w<0)cl.x=W+cl.w;
    const cy=cl.y*skyH*.88;const col=cCols[cl.tier];
    drawBlockCloud(ctx,cl.x%W,cy,cl.w,cl.h,col,cl.a*cAlpha);
    if(cl.x<cl.w)drawBlockCloud(ctx,cl.x+W,cy,cl.w,cl.h,col,cl.a*cAlpha);
  });

  // ── Dawn / dusk horizon glow stripe
  if(skyPhase==='dawn'||skyPhase==='dusk'){
    const blend4=Math.min(.70,(dayT*4%1)*.9);
    const gc=[skyPhase==='dusk'?[255,100,25]:[255,145,55]];
    const hgrd=ctx.createLinearGradient(0,skyH*.65,0,skyH);
    hgrd.addColorStop(0,`rgba(${gc[0]},0)`);
    hgrd.addColorStop(.45,`rgba(${gc[0]},${blend4})`);
    hgrd.addColorStop(1,`rgba(${gc[0]},0)`);
    ctx.fillStyle=hgrd;ctx.fillRect(0,skyH*.65,W,skyH*.35);
  }

  // ── 3 parallax mountain rows
  const groundY=H*.80;
  [[0,mf,skyH,skyH+(groundY-skyH)*.28,.90],
   [1,mn,skyH+(groundY-skyH)*.14,skyH+(groundY-skyH)*.52,.72],
   [2,gnd,skyH+(groundY-skyH)*.38,groundY,.55]
  ].forEach(([ri,col,yMin,yMax,par])=>{
    const pts=MTN[ri];const scroll=(mtnScroll*par)%4096;
    ctx.beginPath();ctx.moveTo(0,yMax);
    for(let pass=0;pass<2;pass++){
      pts.forEach(([px2,ph],ii)=>{
        const sx2=(px2-scroll+pass*4096)*(W/1200);
        const sy2=yMin+(yMax-yMin)*(1-ph);
        if(ii===0&&pass===0)ctx.lineTo(sx2,sy2);else ctx.lineTo(sx2,sy2);
      });
    }
    ctx.lineTo(W,yMax);ctx.closePath();
    const mg=ctx.createLinearGradient(0,yMin,0,yMax);
    mg.addColorStop(0,`rgb(${Math.min(255,Math.round(col[0]+20))},${Math.min(255,Math.round(col[1]+18))},${Math.min(255,Math.round(col[2]+10))})`);
    mg.addColorStop(.4,toRGB(col));
    mg.addColorStop(1,`rgb(${Math.max(0,Math.round(col[0]-22))},${Math.max(0,Math.round(col[1]-16))},${Math.max(0,Math.round(col[2]-8))})`);
    ctx.fillStyle=mg;ctx.fill();
    // Dithered pixel edge on top of first two mountain rows
    if(ri<2){
      const ps3=4;ctx.globalAlpha=.32;
      pts.forEach(([px2,ph])=>{
        const sx2=(px2-scroll)*(W/1200),sy2=yMin+(yMax-yMin)*(1-ph);
        if(sx2>=0&&sx2<W&&Math.random()>.52){ctx.fillStyle=toRGB([Math.min(255,col[0]+38),Math.min(255,col[1]+30),Math.min(255,col[2]+14)]);ctx.fillRect(Math.round(sx2),Math.round(sy2-ps3),ps3,ps3);}
      });ctx.globalAlpha=1;
    }
  });

  // ── Ground band (connects mountain base to Three.js terrain)
  const ggrd=ctx.createLinearGradient(0,groundY,0,H);
  ggrd.addColorStop(0,toRGB(gnd));
  ggrd.addColorStop(.35,`rgb(${Math.max(0,Math.round(gnd[0]-18))},${Math.max(0,Math.round(gnd[1]-12))},${Math.max(0,Math.round(gnd[2]-6))})`);
  ggrd.addColorStop(1,`rgb(${Math.max(0,Math.round(gnd[0]-36))},${Math.max(0,Math.round(gnd[1]-26))},${Math.max(0,Math.round(gnd[2]-12))})`);
  ctx.fillStyle=ggrd;ctx.fillRect(0,groundY,W,H-groundY);
  // Pixel dither on ground join
  const ps4=6;ctx.globalAlpha=.22;
  for(let dx=0;dx<W;dx+=ps4){if(Math.random()>.5){ctx.fillStyle=toRGB(gnd);ctx.fillRect(dx,groundY-ps4,ps4,ps4);}}
  ctx.globalAlpha=1;
}

// ── Dewy fog cloud canvas
function drawFogClouds(){
  const el=document.getElementById('fog-clouds');if(!el)return;
  if(el.style.opacity==='0'||el.style.opacity==='')return;
  const W=el.width,H=el.height;if(!W||!H)return;
  const ctx=el.getContext('2d'),t=performance.now()*.001,ps=8;
  ctx.clearRect(0,0,W,H);
  FOGPUFFS.forEach((p,i)=>{
    p.x-=p.sp;p.ph+=.008;
    if(p.x+p.w<0)p.x=W+p.w;
    const py=p.y*H+Math.sin(p.ph+i)*.9;
    const pw=p.w*(1+.12*Math.sin(t*.3+i*.7));
    [[0,.38*p.h,pw,.60*p.h],[pw*.08,.18*p.h,pw*.78,.52*p.h],[pw*.18,0,pw*.54,.44*p.h]].forEach(([bx,by,bw,bh])=>{
      for(let dy=0;dy<bh;dy+=ps)for(let dx=0;dx<bw;dx+=ps){
        ctx.fillStyle=(Math.floor((dx+dy)/ps))%2===0?'rgba(205,225,245,.52)':'rgba(185,212,238,.38)';
        ctx.globalAlpha=p.a;ctx.fillRect(Math.round(p.x+bx+dx),Math.round(py+by+dy),ps,ps);
      }
    });
    if(p.x<p.w){
      [[0,.38*p.h,pw,.60*p.h],[pw*.08,.18*p.h,pw*.78,.52*p.h]].forEach(([bx,by,bw,bh])=>{
        for(let dy=0;dy<bh;dy+=ps)for(let dx=0;dx<bw;dx+=ps){ctx.fillStyle='rgba(205,225,245,.52)';ctx.globalAlpha=p.a;ctx.fillRect(Math.round(p.x+W+bx+dx),Math.round(py+by+dy),ps,ps);}
      });
    }
  });ctx.globalAlpha=1;
}

// ── UI colour tinting per phase — panels, border, chip bg, accent all shift with sky
const UI_TINT={
  night:{
    border:'rgba(60,80,180,.34)',topBg:'rgba(4,3,18,.99)',panelBg:'rgba(8,5,20,.98)',
    chipBg:'rgba(0,0,0,.75)',chipBorder:'rgba(255,255,255,.07)',
    logo:'#4488ff',scoreCol:'#88aaff',timeCol:'#4488ff'
  },
  dawn:{
    border:'rgba(220,120,50,.40)',topBg:'rgba(18,10,5,.98)',panelBg:'rgba(22,12,6,.97)',
    chipBg:'rgba(20,10,4,.75)',chipBorder:'rgba(255,160,80,.10)',
    logo:'#FFD700',scoreCol:'#FFB366',timeCol:'#ff9944'
  },
  day:{
    border:'rgba(255,215,0,.30)',topBg:'rgba(8,5,20,.99)',panelBg:'rgba(8,5,20,.98)',
    chipBg:'rgba(8,5,20,.72)',chipBorder:'rgba(255,255,255,.09)',
    logo:'#FFD700',scoreCol:'#FF9B3D',timeCol:'#2AFFDB'
  },
  dusk:{
    border:'rgba(200,70,25,.38)',topBg:'rgba(16,8,3,.99)',panelBg:'rgba(18,9,3,.97)',
    chipBg:'rgba(18,8,2,.75)',chipBorder:'rgba(255,120,40,.10)',
    logo:'#FFD700',scoreCol:'#FF9B3D',timeCol:'#ff7733'
  },
};
function applyUITint(phase){
  const t=UI_TINT[phase]||UI_TINT.day;
  const root=document.documentElement;
  root.style.setProperty('--border',t.border);
  // Top bar tint
  const topEl=document.getElementById('top');
  if(topEl){topEl.style.background=`linear-gradient(180deg,${t.topBg},${t.topBg.replace('.99','.96')})`;topEl.style.borderBottomColor=t.border;}
  // Left/right panels
  document.querySelectorAll('#lp,#rp').forEach(el=>{if(el)el.style.background=`linear-gradient(180deg,${t.panelBg},${t.panelBg.replace('.98','.96')})`;});
  // Resource chips
  document.querySelectorAll('.rchip').forEach(el=>{
    el.style.background=t.chipBg;el.style.borderColor=t.chipBorder;
  });
  // Logo / score colours
  const logo=document.querySelector('.t-logo');if(logo)logo.style.color=t.logo;
  const score=document.querySelector('.sctxt');if(score)score.style.color=t.scoreCol;
  const time=document.getElementById('vtime');if(time)time.style.color=t.timeCol;
}

// ═══════════════════════════════════════════════════════
//  DAY/NIGHT — smooth per-channel transitions, ~3 min cycle
// ═══════════════════════════════════════════════════════
const SKY={
  night:{amb:0.06, sun:0.00, moon:0.45, hemi:0.08, moonV:true},
  dawn: {amb:0.35, sun:0.75, moon:0.00, hemi:0.40, moonV:false},
  day:  {amb:0.62, sun:1.60, moon:0.00, hemi:0.72, moonV:false},
  dusk: {amb:0.28, sun:0.55, moon:0.08, hemi:0.32, moonV:false},
};
// Float light state (no more Three.Color lerp — avoids jarring jumps)
let cLamb=0.06,cLsun=0.00,cLmoon=0.45,cLhemi=0.08;
let tLamb=0.06,tLsun=0.00,tLmoon=0.45,tLhemi=0.08;
let prevPhase='night';

function lerpSky(dtMs){
  // 0.012 per frame at 60fps → ~5 seconds to complete a phase transition
  const sp=Math.min(dtMs/1000*0.75,1);
  const L=(a,b)=>a+(b-a)*sp;
  cLamb =L(cLamb, tLamb);
  cLsun =L(cLsun, tLsun);
  cLmoon=L(cLmoon,tLmoon);
  cLhemi=L(cLhemi,tLhemi);
  // Same speed for sky colour channels
  SC.top=lerpRGB3(SC.top,ST.top,sp);SC.mid=lerpRGB3(SC.mid,ST.mid,sp);
  SC.hor=lerpRGB3(SC.hor,ST.hor,sp);SC.mf=lerpRGB3(SC.mf,ST.mf,sp);
  SC.mn=lerpRGB3(SC.mn,ST.mn,sp);SC.gnd=lerpRGB3(SC.gnd,ST.gnd,sp);
}

function applySky(){
  // Three.js renderer stays transparent — sky canvas handles background
  renderer.setClearColor(0x000000,0);
  // Apply smoothly lerped 3D lights
  ambL.intensity=cLamb;
  sun.intensity=Math.max(0,cLsun);
  moonL.intensity=cLmoon;
  hemiL.intensity=cLhemi;
  // Tint hemisphere to match sky phase
  hemiL.color.setHex(LIGHTS[skyPhase].hSky);
  hemiL.groundColor.setHex(LIGHTS[skyPhase].hGnd);
  // Sun colour shifts with phase
  sun.color.setHex(LIGHTS[skyPhase].sunCol);
  ambL.color.setHex(LIGHTS[skyPhase].ambCol);
  moonG.visible=SKY[skyPhase].moonV;
  sMat.opacity=0;// stars on 2D canvas only
  // Night: windows glow, lamps on
  const nf=Math.max(0,skyPhase==='night'?1:skyPhase==='dusk'?0.5:skyPhase==='dawn'?0.3:0);
  const now2=performance.now();
  wins.forEach(w=>{if(w.userData.isWin)w.material.emissiveIntensity=nf*(0.6+.4*Math.abs(Math.sin(now2*.001+w.userData.flicker)));});
  lampLights.forEach(l=>{l.light.intensity=nf>0.2?(0.6+Math.sin(now2*.0018)*.08):0;l.mesh.material.emissiveIntensity=nf>0.2?1:0;});
  // Sun arc in 3D scene
  const ang=dayT*Math.PI*2-Math.PI*.5;
  sun.position.set(Math.cos(ang)*100,Math.sin(ang)*80+10,40);
  // Draw 2D pixel sky
  drawSkyBackdrop();
  drawFogClouds();
}

function updateDayNight(dtMs){
  if(autoT){
    // ~3.5 minutes per full cycle
    dayT=(dayT+dtMs*.0000048)%1;
    const phases=['night','dawn','day','dusk'];
    const phaseIdx=Math.floor(dayT*4);
    const phase=phases[phaseIdx];
    // When phase changes: update targets
    if(phase!==prevPhase){
      ST={...SKYPAL[phase]};
      tLamb=SKY[phase].amb;tLsun=SKY[phase].sun;tLmoon=SKY[phase].moon;tLhemi=SKY[phase].hemi;
      applyUITint(phase);
    }
    prevPhase=phase;skyPhase=phase;
    const lblMap={night:'🌙 NIGHT',dawn:'🌅 DAWN',day:'☀️ DAY',dusk:'🌆 DUSK'};
    const lbl=lblMap[phase];
    document.getElementById('vtime').textContent=`${lbl} · DAY ${G.day}`;
    if(lbl!==lastTimeLabel){
      lastTimeLabel=lbl;
      const tp=document.getElementById('time-popup');
      if(tp){tp.textContent=lbl;tp.classList.add('show');setTimeout(()=>tp.classList.remove('show'),3200);}
    }
    if(dayT<.002&&G.day>0)G.day++;
  }
}

// ═══════════════════════════════════════════════════════
//  INCOME — PASSIVE with Hay Day coin burst
// ═══════════════════════════════════════════════════════
function proj3(wx,wy,wz){
  const v=new THREE.Vector3(wx,wy,wz).project(cam);
  const rc=renderer.domElement;
  return{x:(v.x*.5+.5)*rc.clientWidth,y:(-v.y*.5+.5)*rc.clientHeight};
}
// Legacy single coin (for placement feedback)
function coinFlyEl(x,y,txt){
  const el=document.createElement('div');el.className='cf';el.textContent=txt;
  el.style.left=x+'px';el.style.top=y+'px';
  document.body.appendChild(el);setTimeout(()=>el.remove(),1200);
}

let incomeTickTimer=0;
const INCOME_INTERVAL=4000;
function processIncome(dt){
  incomeTickTimer+=dt;
  if(incomeTickTimer<INCOME_INTERVAL)return;
  incomeTickTimer=0;
  let totalEarned=0;
  for(const tile of Object.values(G.grid)){
    const def=DEFS[tile.type];
    if(!def||def.income<=0)continue;
    G.money+=def.income;G.totalEarned+=def.income;totalEarned+=def.income;
    // Hay Day coin burst from each income building
    hayDayCoinBurst(tile.gx,tile.gz,def.income);
    if(tile.type==='factory'&&Math.random()>.4){
      const ct=tile.mesh.userData.chimney;if(ct)spawnSmoke(ct.wx,ct.wz,ct.top);
    }
  }
  if(totalEarned>0){
    const popup=document.createElement('div');popup.className='inc-popup';
    popup.textContent=`+$${totalEarned} INCOME`;
    document.body.appendChild(popup);setTimeout(()=>popup.remove(),900);
    addEcoLog(`+$${totalEarned} passive income`,'pos');
  }
}

// ═══════════════════════════════════════════════════════
//  CAMERA
// ═══════════════════════════════════════════════════════
let theta=Math.PI/4,phi=.88,radius=52,tgtX=0,tgtZ=0;
let dragging=false,lmx=0,lmy=0,cinT=0,cinDone=false;
function applyCamera(){
  cam.position.x=tgtX+radius*Math.sin(phi)*Math.sin(theta);
  cam.position.y=radius*Math.cos(phi)+3;
  cam.position.z=tgtZ+radius*Math.sin(phi)*Math.cos(theta);
  cam.lookAt(tgtX,0,tgtZ);
}
function doCin(dt){
  if(cinDone)return;cinT+=dt/2600;if(cinT>=1){cinDone=true;return;}
  const e=1-Math.pow(1-cinT,3);theta=Math.PI/4+cinT*.5;phi=.2+e*(.88-.2);radius=85-e*33;applyCamera();
}

wrap.addEventListener('mousedown',e=>{if(e.target!==renderer.domElement)return;dragging=true;lmx=e.clientX;lmy=e.clientY;wrap.classList.add('drag');});
window.addEventListener('mousemove',e=>{
  if(dragging){theta+=(e.clientX-lmx)*.007;phi=Math.max(.18,Math.min(Math.PI/2.1,phi+(e.clientY-lmy)*.005));lmx=e.clientX;lmy=e.clientY;applyCamera();}
  updateHover(e.clientX,e.clientY);
});
window.addEventListener('mouseup',()=>{dragging=false;wrap.classList.remove('drag');});
wrap.addEventListener('wheel',e=>{radius=Math.max(16,Math.min(88,radius+e.deltaY*.038));applyCamera();},{passive:true});
window.addEventListener('keydown',e=>{
  const k=e.key;const s=1.4;
  if(k==='ArrowLeft')tgtX-=s;if(k==='ArrowRight')tgtX+=s;if(k==='ArrowUp')tgtZ-=s;if(k==='ArrowDown')tgtZ+=s;
  if(k!=='ArrowLeft'&&k!=='ArrowRight'&&k!=='ArrowUp'&&k!=='ArrowDown')applyCamera();
  // Hotkeys
  const hk={'h':'house','a':'apart','k':'sky','f':'factory','s':'shop','p':'park','b':'bush','e':'fence','r':'road','j':'hospital','c':'school','d':'demolish','l':'lake','g':'bridge'};
  const m=hk[k.toLowerCase()];if(m)setTool(m);
  if(k==='Escape')setTool('house');
  if(k==='Enter'&&document.getElementById('intro').style.display!=='none'){
    document.getElementById('ibtn').click();
  }
});

// ═══════════════════════════════════════════════════════
//  RAYCASTER — BUILDING PLACEMENT (FIXED)
// ═══════════════════════════════════════════════════════
const rc=new THREE.Raycaster(),mv=new THREE.Vector2();
const gndPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
const tt=document.getElementById('tt');
let lastClick=0; // debounce

function getGridFromEvent(clientX,clientY){
  const rect=renderer.domElement.getBoundingClientRect();
  mv.x=((clientX-rect.left)/rect.width)*2-1;
  mv.y=-((clientY-rect.top)/rect.height)*2+1;
  rc.setFromCamera(mv,cam);
  const pt=new THREE.Vector3();
  const hit=rc.ray.intersectPlane(gndPlane,pt);
  if(!hit)return null;
  const gx=Math.floor(pt.x/TILE+HALF);
  const gz=Math.floor(pt.z/TILE+HALF);
  if(gx<0||gx>=GRID_SIZE||gz<0||gz>=GRID_SIZE)return null;
  return{gx,gz};
}

function updateHover(clientX,clientY){
  if(dragging||!document.getElementById('game').classList.contains('on')){hovMesh.visible=false;tt.style.display='none';return;}
  const pos=getGridFromEvent(clientX,clientY);
  if(!pos){hovMesh.visible=false;tt.style.display='none';return;}
  const{wx,wz}=g2w(pos.gx,pos.gz);
  hovMesh.position.set(wx,.03,wz);hovMesh.visible=true;
  const occ=!!G.grid[gkey(pos.gx,pos.gz)];
  hovMesh.material.color.setHex(G.tool==='demolish'?0xFF5252:(occ?0xff6600:0x2AFFDB));
  const rect=renderer.domElement.getBoundingClientRect(),def=DEFS[G.tool];
  tt.style.display='block';
  tt.style.left=(clientX-rect.left+14)+'px';
  tt.style.top=(clientY-rect.top-32)+'px';
  tt.textContent=G.tool==='demolish'?'💥 DEMOLISH':(occ?'⛔ OCCUPIED':`${def?.emoji} ${def?.name}${def?.cost?' · 💰'+def.cost:''}`);
}

// Click to place
renderer.domElement.addEventListener('click',e=>{
  if(dragging)return;
  if(!document.getElementById('game').classList.contains('on'))return;
  const now=performance.now();
  if(now-lastClick<200)return;// debounce
  lastClick=now;
  const pos=getGridFromEvent(e.clientX,e.clientY);
  if(!pos)return;
  placeBuilding(pos.gx,pos.gz,G.tool);
  // Coin fly at click position
  if(G.tool!=='demolish'&&DEFS[G.tool]?.cost)coinFlyEl(e.clientX,e.clientY-20,'-💰'+DEFS[G.tool].cost);
});

// ═══════════════════════════════════════════════════════
//  TOOL
// ═══════════════════════════════════════════════════════
function setTool(t){
  G.tool=t;
  document.querySelectorAll('.bb').forEach(b=>b.classList.toggle('s',b.dataset.type===t));
}
document.querySelectorAll('.bb').forEach(btn=>{
  btn.addEventListener('click',()=>setTool(btn.dataset.type));
});

// ═══════════════════════════════════════════════════════
//  UI UPDATE
// ═══════════════════════════════════════════════════════
function updateUI(){
  const m=Math.floor(G.money);
  document.getElementById('vm').textContent=m.toLocaleString();
  document.getElementById('vp').textContent=G.pop;
  document.getElementById('vh').textContent=G.happy+'%';
  let ir=0;for(const t of Object.values(G.grid)){if(DEFS[t.type])ir+=DEFS[t.type].income||0;}
  document.getElementById('vi').textContent='+$'+ir.toFixed(0)+'/4s';
  G.score=Math.floor(G.pop*10+G.happy*5+Math.min(G.totalEarned,50000)*.1+G.day*2);
  document.getElementById('vscore').textContent=G.score.toLocaleString();
  const bld=Object.values(G.counts).reduce((a,b)=>a+b,0)-(G.counts.road||0)-(G.counts.fence||0)-(G.counts.lake||0)-(G.counts.bridge||0)-(G.counts.jungle||0);
  document.getElementById('stb').textContent=Math.max(0,bld);
  document.getElementById('str').textContent=G.counts.road||0;
  document.getElementById('stf').textContent=(G.counts.factory||0)+(G.counts.shop||0);
  document.getElementById('stp').textContent=(G.counts.park||0)+(G.counts.bush||0);
  // City Health — fix meaningful ranges
  const eco=Math.min(100,Math.max(0,m/100));// $10000 = 100%
  const pop=Math.min(100,Math.max(0,G.pop));// 100 pop = 100%
  const hap=Math.min(100,Math.max(0,G.happy));
  document.getElementById('pfe').style.width=eco+'%';document.getElementById('phe').textContent=Math.round(eco)+'%';
  document.getElementById('pfp').style.width=pop+'%';document.getElementById('php').textContent=Math.round(pop)+'%';
  document.getElementById('pfh').style.width=hap+'%';document.getElementById('phh').textContent=Math.round(hap)+'%';
  document.getElementById('sps-pop').textContent=G.pop*10;
  document.getElementById('sps-hap').textContent=Math.round(G.happy*5);
  document.getElementById('sps-mon').textContent=Math.round(G.money*.04);
  document.getElementById('sps-day').textContent=G.day*2;
  document.getElementById('sps-total').textContent=G.score.toLocaleString();
  if(G.money>=1500){const el=document.getElementById('bb-sky');if(el){el.classList.remove('locked');if(DEFS.sky)DEFS.sky.lock=false;}}

  // Wire cinematic btn once
  const cinBtn=document.getElementById('btn-cin');
  if(cinBtn&&!cinBtn.dataset.wired){
    cinBtn.dataset.wired='1';
    cinBtn.addEventListener('click',()=>{
      cinDone=!cinDone;
      if(!cinDone){cinT=0;}
      cinBtn.classList.toggle('tl',!cinDone);
      toast(cinDone?'Cinematic OFF':'🎬 Cinematic ON — drag to exit','nf');
    });
  }
  if(!G.over){
    if(G.pop>=1000){G.over=true;showModal(true);}
    else if(G.money<0){G.over=true;showModal(false);}
  }
  updateLB();
}

// ═══════════════════════════════════════════════════════
//  LEADERBOARD
// ═══════════════════════════════════════════════════════
function saveScore(){
  const all=JSON.parse(localStorage.getItem('pcv3')||'[]');
  all.push({name:G.playerName,pop:G.pop,score:G.score});
  all.sort((a,b)=>b.score-a.score);
  const u=[],s=new Set();for(const e of all){if(!s.has(e.name)){s.add(e.name);u.push(e);}}
  localStorage.setItem('pcv3',JSON.stringify(u.slice(0,10)));
  updateLB();document.getElementById('modal').classList.remove('on');toast('Score saved! 🏆','ok');
}
function updateLB(){
  const all=JSON.parse(localStorage.getItem('pcv3')||'[]');
  const mc=['rg','rs2','rb3'],med=['🥇','🥈','🥉'];
  const rows=all.slice(0,5).map((e,i)=>`<tr><td><span class="${mc[i]||''}">${med[i]||i+1}</span></td><td style="font-size:9px">${e.name}</td><td style="font-size:9px">${e.pop}</td><td><span class="lbs">${e.score.toLocaleString()}</span></td></tr>`).join('');
  const empty='<tr><td colspan="4" style="text-align:center;color:var(--dim);font-size:9px;padding:10px">No scores yet!</td></tr>';
  ['lbb','modal-lbb'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=rows||empty;});
}
function showModal(won){
  const m=document.getElementById('modal');m.classList.add('on');
  if(won)m.style.animation='winPulse 1.5s ease-in-out infinite';
  document.getElementById('modal-title').textContent=won?'🏆 CITY COMPLETE!':'💸 BANKRUPT!';
  document.getElementById('modal-title').style.color=won?'var(--gold)':'var(--red)';
  document.getElementById('modal-score').textContent='SCORE: '+G.score.toLocaleString();
  document.getElementById('modal-sub').textContent=won
    ?`Mayor ${G.playerName}! City of ${G.pop} citizens thriving! 🎉`
    :`Bankrupt on Day ${G.day}. Build more factories for income!`;
}

// ═══════════════════════════════════════════════════════
//  ACHIEVEMENTS
// ═══════════════════════════════════════════════════════
function checkAch(){
  ACHS.forEach(a=>{
    if(!G.achievements.has(a.id)&&a.check()){
      G.achievements.add(a.id);
      document.getElementById(a.id)?.classList.add('on');
      toast(`${a.icon} ACHIEVEMENT: ${a.name}!`,'nf');
    }
  });
}

// ═══════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════
function toast(msg,type='nf'){
  const c=document.getElementById('tc2');
  const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=msg;
  c.appendChild(el);setTimeout(()=>el.remove(),3100);
}

// ═══════════════════════════════════════════════════════
//  RESTART
// ═══════════════════════════════════════════════════════
function confirmRestart(){
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;z-index:600;backdrop-filter:blur(4px)';
  ov.innerHTML=`<div style="background:#080514;border:2px solid var(--gold);padding:24px 32px;text-align:center;max-width:300px;border-radius:8px;box-shadow:0 0 40px rgba(255,215,0,.15)">
    <div style="font-family:var(--px);font-size:8px;color:#ccc;line-height:2.4;margin-bottom:16px">RESTART CITY?<br><span style="color:var(--dim);font-size:7px">Score: ${G.score} · Day: ${G.day}</span></div>
    <div style="display:flex;gap:10px;justify-content:center">
      <button style="background:var(--gold);color:#000;font-family:var(--px);font-size:7px;padding:9px 18px;border:none;cursor:pointer;border-radius:3px" onclick="location.reload()">YES</button>
      <button style="background:transparent;color:#555;font-family:var(--px);font-size:7px;padding:9px 18px;border:1.5px solid #333;cursor:pointer;border-radius:3px" id="cno">NO</button>
    </div></div>`;
  document.body.appendChild(ov);
  document.getElementById('cno').onclick=()=>ov.remove();
}

// ═══════════════════════════════════════════════════════
//  ECONOMY LOG
// ═══════════════════════════════════════════════════════
function addEcoLog(msg,type='info'){
  const log=document.getElementById('eco-log');if(!log)return;
  const d=document.createElement('div');
  d.className='eco-log-entry eco-log-'+type;
  d.textContent=`Day ${G.day}: ${msg}`;
  log.insertBefore(d,log.firstChild);
  while(log.children.length>20)log.removeChild(log.lastChild);
}

// ═══════════════════════════════════════════════════════
//  MAYOR EARN BUTTON — bonus every 30s
// ═══════════════════════════════════════════════════════
let mayorLastEarn=0;
const MAYOR_COOLDOWN=30000;
document.getElementById('mayor-earn-btn').addEventListener('click',()=>{
  const now=performance.now();
  const elapsed=now-mayorLastEarn;
  if(elapsed<MAYOR_COOLDOWN&&mayorLastEarn>0){
    const rem=Math.ceil((MAYOR_COOLDOWN-elapsed)/1000);
    toast(`⏳ Collect again in ${rem}s`,'wn');return;
  }
  mayorLastEarn=now;
  const bonus=50;G.money+=bonus;G.totalEarned+=bonus;
  coinFlyEl(window.innerWidth/2,window.innerHeight/2,'+$'+bonus+' BONUS!');
  toast(`🪙 Mayor collected +$${bonus} bonus!`,'ok');
  addEcoLog(`Mayor collected $${bonus} bonus`,'pos');
  updateUI();
  // Show cooldown label
  const cd=document.getElementById('mayor-earn-cooldown');cd.style.display='block';
  setTimeout(()=>{cd.style.display='none';},MAYOR_COOLDOWN);
});

// ═══════════════════════════════════════════════════════
//  FORUM FUNCTIONS
// ═══════════════════════════════════════════════════════
function renderForum(){
  const posts=JSON.parse(localStorage.getItem('pcv3_forum')||'[]');
  const el=document.getElementById('forum-posts');if(!el)return;
  if(!posts.length){el.innerHTML='<div class="forum-empty">No posts yet! Share a city strategy.</div>';return;}
  el.innerHTML=posts.slice(-15).reverse().map(p=>`
    <div class="forum-post">
      <div class="forum-post-author">${p.name} <span class="forum-post-day">· Day ${p.day} · Score ${p.score}</span></div>
      <div class="forum-post-text">${p.msg}</div>
    </div>`).join('');
}
document.getElementById('forum-post-btn').addEventListener('click',()=>{
  const inp=document.getElementById('forum-input');
  const msg=(inp.value||'').trim();if(!msg){toast('Write something first!','wn');return;}
  const posts=JSON.parse(localStorage.getItem('pcv3_forum')||'[]');
  posts.push({name:G.playerName,msg:msg.slice(0,100),day:G.day,score:G.score});
  localStorage.setItem('pcv3_forum',JSON.stringify(posts.slice(-30)));
  inp.value='';renderForum();toast('Post shared! 💬','ok');
});
document.getElementById('forum-clear-btn').addEventListener('click',()=>{
  localStorage.removeItem('pcv3_forum');renderForum();toast('Forum cleared.','nf');
});
document.getElementById('forum-close-btn').addEventListener('click',()=>{
  document.getElementById('forum-panel').classList.remove('on');
  document.querySelectorAll('.nb').forEach(b=>b.classList.toggle('on',b.dataset.tab==='city'));
});

// ═══════════════════════════════════════════════════════
//  ECONOMY PANEL UPDATE
// ═══════════════════════════════════════════════════════
function updateEcoPanel(){
  const m=Math.floor(G.money);
  let ir=0;for(const t of Object.values(G.grid)){if(DEFS[t.type])ir+=DEFS[t.type].income||0;}
  document.getElementById('eco-money').textContent='$'+m.toLocaleString();
  document.getElementById('eco-income').textContent='$'+ir.toFixed(0)+'/4s';
  document.getElementById('eco-earned').textContent='$'+G.totalEarned.toLocaleString();
  document.getElementById('eco-score').textContent=G.score.toLocaleString();
  document.getElementById('eco-bar-money').style.width=Math.min(100,m/100)+'%';
  document.getElementById('eco-bar-income').style.width=Math.min(100,ir*3)+'%';
  document.getElementById('eco-bar-earned').style.width=Math.min(100,G.totalEarned/200)+'%';
  document.getElementById('eco-bar-score').style.width=Math.min(100,G.score/50)+'%';
}
document.getElementById('eco-close-btn').addEventListener('click',()=>{
  document.getElementById('eco-panel').classList.remove('on');
  document.querySelectorAll('.nb').forEach(b=>b.classList.toggle('on',b.dataset.tab==='city'));
});

// ═══════════════════════════════════════════════════════
//  BOTTOM NAV — FULLY WIRED
// ═══════════════════════════════════════════════════════
document.querySelectorAll('.nb').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.nb').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    const tab=b.dataset.tab;
    // Hide all overlay panels first
    document.getElementById('eco-panel').classList.remove('on');
    document.getElementById('forum-panel').classList.remove('on');
    if(tab==='economy'){document.getElementById('eco-panel').classList.add('on');updateEcoPanel();}
    else if(tab==='forum'){document.getElementById('forum-panel').classList.add('on');renderForum();}
  });
});
document.getElementById('blb').addEventListener('click',()=>{updateLB();document.getElementById('modal-lb').classList.add('on');});
document.getElementById('clb').addEventListener('click',()=>document.getElementById('modal-lb').classList.remove('on'));
document.getElementById('brs').addEventListener('click',confirmRestart);

// ═══════════════════════════════════════════════════════
//  INTRO → START GAME
// ═══════════════════════════════════════════════════════
function startGame(){
  const n=document.getElementById('pname').value.trim();
  G.playerName=n||'PLAYER_1';
  const intro=document.getElementById('intro');
  intro.style.transition='opacity 1s ease';
  intro.style.opacity='0';
  setTimeout(()=>{
    intro.style.display='none';
    document.getElementById('game').classList.add('on');
    resizeR();resizeRain();initRain();applyCamera();
    updateUI();updateLB();setTool('house');
    toast(`Welcome, Mayor ${G.playerName}! 🏙 Click tiles to build!`,'ok');
    setTimeout(()=>toast('💡 Build Factories & Shops to earn passive income!','nf'),2500);
  },1100);
}
document.getElementById('ibtn').addEventListener('click',startGame);

// ═══════════════════════════════════════════════════════
//  MAIN LOOP
// ═══════════════════════════════════════════════════════
let lastT=performance.now(),uiT=0;
// Start at midday so city is visible immediately
dayT=0.45;skyPhase='day';prevPhase='day';
ST={...SKYPAL.day};SC={...SKYPAL.day};
tLamb=SKY.day.amb;tLsun=SKY.day.sun;tLmoon=SKY.day.moon;tLhemi=SKY.day.hemi;
cLamb=SKY.day.amb;cLsun=SKY.day.sun;cLmoon=SKY.day.moon;cLhemi=SKY.day.hemi;
// Apply initial colours to lights and UI
ambL.intensity=cLamb;sun.intensity=cLsun;moonL.intensity=cLmoon;hemiL.intensity=cLhemi;
hemiL.color.setHex(LIGHTS.day.hSky);hemiL.groundColor.setHex(LIGHTS.day.hGnd);
sun.color.setHex(LIGHTS.day.sunCol);ambL.color.setHex(LIGHTS.day.ambCol);
setTimeout(()=>applyUITint('day'),50);// after DOM ready
(function loop(){
  requestAnimationFrame(loop);
  const now=performance.now(),dt=Math.min(now-lastT,80);lastT=now;
  // Always update sky (even on intro screen)
  updateDayNight(dt);
  lerpSky(dt);
  applySky();
  if(!document.getElementById('game').classList.contains('on'))return;
  if(!cinDone)doCin(dt);else applyCamera();
  updateWeather(dt);
  updateSmoke(dt);
  drawRain();
  processIncome(dt);
  updateVehicles();
  updateCitizens(dt);
  updateLakeAndBridge(dt);
  updateAnimals(dt);
  updateBirds(dt);
  vTimer+=dt;if(vTimer>5500){vTimer=0;spawnVehicle();}
  cTimer+=dt;if(cTimer>4500){cTimer=0;spawnCitizen();}
  aTimer+=dt;if(aTimer>8000){aTimer=0;spawnAnimal();}
  bTimer+=dt;if(bTimer>25000){bTimer=0;spawnBird();}
  if(hovMesh.visible){hovMesh.position.y=.03+Math.sin(now*.005)*.04;hovMesh.material.opacity=.35+Math.sin(now*.006)*.14;}
  uiT+=dt;if(uiT>1500){uiT=0;updateUI();checkAch();}
  renderer.render(scene,cam);
})();

window.addEventListener('resize',()=>{resizeR();resizeRain();});
resizeR();