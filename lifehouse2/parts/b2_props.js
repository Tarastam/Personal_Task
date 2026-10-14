
/* ================= props ================= */
var WOOD=0xdaa86e,DWOOD=0x9a6b43,LWOOD=0xe8c48f,CREAM=0xf6ebd9,TERRA=0xd9805f,SAGE=0x8fb996,MUSTARD=0xf0b94a,NAVY=0x2f3a5c,DARK=0x2d3047,METAL=0x9aa4b5,LIGHT=0xf3efe6,BLUSH=0xe9a6a0,TEAL=0x4aa3a0,WHITE=0xffffff,RED=0xd9534f;
function chair(g,x,z,c,ry){var s=new T.Group();box(.9,.14,.9,c,0,.9,0,s);box(.9,.9,.14,c,0,1.4,-.42,s);cyl(.06,.06,.8,DARK,0,.45,0,s,6);box(.7,.06,.7,DARK,0,.04,0,s,true);s.position.set(x,0,z);s.rotation.y=ry||0;g.add(s)}
function deskBase(g,w){box(w,.14,1.5,WOOD,0,1.0,0,g);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(p){box(.12,.95,.12,DWOOD,p[0]*(w/2-.15),.5,p[1]*.6,g,true)})}
function floorLamp(g,x,z,s){var lp=new T.Group();cyl(.35,.35,.1,DARK,0,.05,0,lp,10);cyl(.05,.05,2.8,DARK,0,1.4,0,lp,6);cyl(.5,.35,.6,lampMat,0,2.9,0,lp,10);lp.position.set(x,0,z);lp.scale.setScalar(s||1);g.add(lp)}
function pot(g,x,z,s,c){var p=new T.Group();cyl(.55,.4,.8,c||0xe0a37a,0,.4,0,p,12);ball(.8,0x66bd80,0,1.5,0,p);ball(.55,0x86d29a,.4,2.0,.1,p);ball(.4,0x5cae75,-.4,1.9,-.1,p);p.position.set(x,0,z);p.scale.setScalar(s||1);g.add(p)}
function pframe(g,x,y,z,w,h,c,ry){var f=new T.Group();box(w+.3,h+.3,.12,WOOD,0,0,0,f,true);box(w,h,.14,0xfff7ea,0,0,0,f,true);box(w*.7,h*.45,.16,c,-w*.05,h*.1,0,f,true);box(w*.3,h*.25,.16,MUSTARD,w*.18,-h*.2,0,f,true);f.position.set(x,y,z);f.rotation.y=ry||0;g.add(f)}
var PROPS={
 deskMonitor:function(g,c){deskBase(g,2.8);box(.14,.5,.14,METAL,0,1.3,-.25,g,true);box(1.5,.9,.08,DARK,0,1.95,-.3,g);box(1.34,.76,.02,GLOW(c,.7),0,1.95,-.25,g,true);box(.9,.05,.3,LIGHT,0,1.1,.35,g,true);cyl(.16,.13,.28,WHITE,1.0,1.2,.1,g,10);chair(g,0,1.5,c,PI);return 2.6},
 laptopDesk:function(g,c){deskBase(g,2.8);box(1.1,.06,.8,METAL,0,1.07,.1,g,true);var lid=box(1.1,.7,.05,DARK,0,1.45,-.3,g);lid.rotation.x=-.3;var sc=box(.96,.56,.02,GLOW(c,.7),0,1.46,-.27,g,true);sc.rotation.x=-.3;cyl(.14,.12,.25,WHITE,1.0,1.2,.2,g,10);box(.5,.1,.4,0xe9a6a0,-.9,1.12,.2,g,true);chair(g,0,1.5,c,PI);return 2.2},
 tradingDesk:function(g,c){deskBase(g,3.2);[[-1,0x3ddc97],[0,0xff6b6b],[1,c]].forEach(function(m){var s=box(.95,.65,.06,DARK,m[0]*1.0,1.8,-.35,g);s.rotation.y=-m[0]*.18;var d=box(.82,.52,.02,GLOW(m[1],.7),m[0]*1.0,1.8,-.31,g,true);d.rotation.y=-m[0]*.18;box(.1,.5,.1,METAL,m[0]*1.0,1.3,-.35,g,true)});chair(g,0,1.5,c,PI);return 2.5},
 whiteboard:function(g,c){box(2.8,1.7,.1,WHITE,0,2.3,0,g);box(2.9,.1,.14,METAL,0,1.43,0,g,true);cyl(.06,.06,1.5,METAL,-1.1,.75,-.1,g,6);cyl(.06,.06,1.5,METAL,1.1,.75,-.1,g,6);[[-.8,2.7,0xffd23f],[-.2,2.5,c],[.5,2.7,0xff8fa3],[.9,2.2,0x7cd992]].forEach(function(n){box(.5,.5,.03,n[2],n[0],n[1],.08,g,true)});box(1.6,.05,.02,0x65708f,0,1.9,.07,g,true);return 3.3},
 bookshelf:function(g,c){box(.12,3.2,.8,DWOOD,-1.25,1.7,0,g);box(.12,3.2,.8,DWOOD,1.25,1.7,0,g);box(2.6,.12,.8,DWOOD,0,.15,0,g);box(2.6,.12,.8,DWOOD,0,3.3,0,g);box(2.5,3.1,.06,0xb08358,0,1.7,-.37,g,true);
   var cols=[c,0xf5b82e,0x3b6fe8,0xe0507a,0x7cd992,WHITE,0x14a89b];
   [.55,1.45,2.35].forEach(function(y,r){box(2.4,.08,.78,DWOOD,0,y-.08,0,g,true);for(var i=0;i<8;i++){var h=.5+((i*7+r*3)%4)*.08;box(.18,h,.5,cols[(i+r*2)%cols.length],-1.0+i*.29,y-.04+h/2,0,g,true)}});return 3.5},
 globe:function(g,c){cyl(.9,.9,.1,DWOOD,0,.8,0,g,16);cyl(.12,.12,.8,DWOOD,0,.4,0,g,6);box(1.8,.12,1.2,WOOD,0,.76,0,g);cyl(.55,.55,.1,DWOOD,0,.04,0,g,16);ball(.75,0x5b9bd5,0,1.8,0,g);ball(.28,0x7cd992,.3,1.95,.5,g);ball(.2,0x7cd992,-.45,1.6,.4,g);var rg=new T.Mesh(new T.TorusGeometry(.82,.04,6,24),M(METAL));rg.position.set(0,1.8,0);rg.rotation.y=PI/2;g.add(rg);return 2.8},
 armchair:function(g,c){box(1.7,.6,1.6,c,0,.6,0,g);box(1.7,1.2,.4,c,0,1.2,-.62,g);box(.35,.9,1.6,c,-.9,.95,0,g);box(.35,.9,1.6,c,.9,.95,0,g);box(1.2,.25,1.2,CREAM,0,1.0,.1,g,true);[[-.7,-.6],[.7,-.6],[-.7,.6],[.7,.6]].forEach(function(p){box(.1,.3,.1,DWOOD,p[0],.15,p[1],g,true)});return 2.0},
 easel:function(g,c){var l=box(.1,3,.1,DWOOD,-.8,1.5,0,g);l.rotation.z=-.12;var r=box(.1,3,.1,DWOOD,.8,1.5,0,g);r.rotation.z=.12;var b=box(.1,2.4,.1,DWOOD,0,1.2,-.7,g);b.rotation.x=.3;box(1.8,1.3,.08,WHITE,0,2.0,.05,g);box(.8,.5,.02,c,-.3,2.15,.1,g,true);box(.5,.5,.02,0xf5b82e,.4,1.8,.1,g,true);box(2,.08,.3,DWOOD,0,1.25,.1,g,true);return 3.2},
 workbench:function(g,c){box(2.9,.2,1.5,0xa9825a,0,1.0,0,g);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(p){box(.14,.95,.14,DARK,p[0]*1.25,.5,p[1]*.6,g,true)});box(2.8,1.4,.1,0xe6dccb,0,2.1,-.7,g);[[-1,0xe5484d],[-.4,0xf5b82e],[.2,c],[.8,0x7cd992]].forEach(function(t){box(.18,.7,.08,t[1],t[0],2.1,-.62,g,true)});box(.5,.35,.4,METAL,1.0,1.28,.2,g,true);box(.5,.3,.5,0xe5484d,-.8,1.25,.2,g,true);return 2.9},
 machine:function(g,c){box(2.4,1.2,1.8,0x8da0c4,0,.7,0,g);box(2.0,.7,1.4,c,0,1.65,0,g);box(.9,.6,.1,DARK,.5,1.15,.95,g,true);ball(.1,GLOW(0x3ddc97,.9),.3,1.15,1.03,g);ball(.1,GLOW(0xff6b6b,.9),.65,1.15,1.03,g);cyl(.18,.18,2.2,METAL,-.6,2.2,-.2,g,10);box(2.5,.12,1.9,DARK,0,.1,0,g,true);return 2.7},
 conveyor:function(g,c){box(3.4,.4,1.1,0x39415b,0,.95,0,g);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(p){box(.12,.9,.12,METAL,p[0]*1.5,.45,p[1]*.45,g,true)});for(var i=0;i<6;i++)cyl(.1,.1,1.0,METAL,-1.4+i*.56,1.17,0,g,8).rotation.x=PI/2;box(.9,.6,.8,0xd8aa6b,-.9,1.5,0,g);box(.8,.5,.7,0xd8aa6b,.7,1.45,0,g);box(3.4,.2,.08,c,0,1.3,.58,g,true);return 2.2},
 cabinet:function(g,c){box(2.4,2.6,.9,0xb3bfd8,0,1.6,0,g);box(.05,2.5,.02,DARK,0,1.6,.46,g,true);box(.1,.4,.06,METAL,-.2,1.6,.48,g,true);box(.1,.4,.06,METAL,.2,1.6,.48,g,true);box(2.45,.12,.95,c,0,2.95,0,g,true);box(.8,.5,.6,0xd8aa6b,-.6,3.25,0,g);box(.7,.4,.6,0xd8aa6b,.5,3.2,0,g);return 3.5},
 plant:function(g,c){pot(g,0,0,1);return 2.6},
 planter:function(g,c){box(2.8,.7,1.4,DWOOD,0,.35,0,g);box(2.5,.12,1.1,0x6b4a33,0,.72,0,g,true);var cols=[c,0xf5b82e,0xffffff,0xe9a6a0,0xb08cf0];for(var i=0;i<9;i++){var x=-1.1+(i%5)*.55,z=(i<5?-.25:.25);cyl(.03,.03,.5,0x4a9d5e,x,.95,z,g,5);ball(.2,cols[i%cols.length],x,1.25,z,g)}return 1.8},
 bench:function(g,c){box(2.8,.18,1.0,WOOD,0,.95,0,g);box(2.8,.9,.14,WOOD,0,1.5,-.45,g);[-1.2,1.2].forEach(function(x){box(.14,.9,.9,DARK,x,.45,0,g,true)});box(.7,.25,.5,c,-.7,1.2,.1,g,true);return 2.4},
 birdbath:function(g,c){cyl(.35,.5,1.1,0xd8d2c6,0,.55,0,g,10);cyl(1.0,.3,.3,0xd8d2c6,0,1.25,0,g,14);cyl(.8,.8,.05,0x6fcbe8,0,1.42,0,g,14);ball(.18,c,.3,1.6,.1,g);return 2.0},
 gardenTree:function(g,c){cyl(.25,.34,1.6,0xa8764a,0,.8,0,g,6);ball(1.4,0x7bc58f,0,2.6,0,g);ball(1.0,0x5fb27a,.7,3.4,.2,g);ball(.5,c,.9,2.2,1.1,g);ball(.4,c,-.8,2.9,.9,g);return 4.2}
};

PROPS.tableLaptop=function(g,c){
  box(3.2,.14,1.8,LWOOD,0,1.0,0,g);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(p){box(.14,.95,.14,DWOOD,p[0]*1.4,.5,p[1]*.75,g,true)});
  box(1.1,.06,.8,METAL,-.4,1.07,.15,g,true);var lid=box(1.1,.7,.05,DARK,-.4,1.45,-.25,g);lid.rotation.x=-.3;var sc=box(.96,.56,.02,GLOW(c,.7),-.4,1.46,-.22,g,true);sc.rotation.x=-.3;
  cyl(.14,.12,.25,WHITE,.7,1.2,.3,g,10);cyl(.4,.28,.22,TERRA,1.1,1.15,-.3,g,12);ball(.15,RED,1.0,1.35,-.3,g);ball(.15,MUSTARD,1.25,1.33,-.25,g);
  chair(g,0,1.6,c,PI);chair(g,0,-1.6,c,0);return 2.4};
PROPS.barLaptop=function(g,c){
  box(3.4,.18,1.3,WOOD,0,1.75,0,g);box(3.2,1.7,.2,0xf1e3cf,0,.9,-.5,g);[-1.5,1.5].forEach(function(x){box(.16,1.7,1.0,0xf1e3cf,x,.9,0,g,true)});
  box(1.1,.06,.8,METAL,-.4,1.87,.05,g,true);var lid=box(1.1,.7,.05,DARK,-.4,2.25,-.3,g);lid.rotation.x=-.3;var sc=box(.96,.56,.02,GLOW(c,.7),-.4,2.26,-.27,g,true);sc.rotation.x=-.3;
  cyl(.14,.12,.25,WHITE,.9,2.0,.1,g,10);
  [-.9,.9].forEach(function(x){var st=new T.Group();cyl(.4,.4,.14,c,0,1.25,0,st,12);cyl(.07,.07,1.1,METAL,0,.6,0,st,6);cyl(.3,.3,.06,METAL,0,.05,0,st,10);st.position.set(x,0,1.6);g.add(st)});return 3.0};
PROPS.ideaBoard=function(g,c){
  box(2.9,1.9,.12,0xb98a5c,0,2.4,0,g);box(2.6,1.6,.14,0xd9b88a,0,2.4,0,g,true);cyl(.06,.06,1.5,METAL,-1.1,.75,-.1,g,6);cyl(.06,.06,1.5,METAL,1.1,.75,-.1,g,6);
  [[-.8,2.9,0xffd23f],[-.2,2.6,c],[.5,2.9,0xff8fa3],[.9,2.4,0x7cd992],[-.7,2.2,0xffffff],[.1,2.2,0xffd23f]].forEach(function(n){box(.5,.5,.03,n[2],n[0],n[1],.1,g,true)});
  box(1.6,.04,.02,0x65708f,0,2.7,.09,g,true);ball(.2,lampMat,0,3.65,0,g);box(.3,.2,.3,METAL,0,3.4,0,g,true);return 3.9};
var ROOMPROPS={
 work:['workbench','machine','conveyor','cabinet','workbench','machine'],
 apps:['deskMonitor','whiteboard','cabinet','bookshelf','whiteboard','cabinet'],
 growth:['bookshelf','laptopDesk','armchair','globe','bookshelf','deskMonitor'],
 income:['tableLaptop','ideaBoard','barLaptop','tableLaptop','ideaBoard','barLaptop'],
 life:['easel','armchair','plant','bookshelf','easel','plant'],
 garden:['planter','bench','birdbath','gardenTree','planter','gardenTree']
};

/* routine hubs */
PROPS.gymHub=function(g,c){box(3.4,.1,1.6,c,0,.06,0,g,true);var mt=box(3.2,.06,1.4,0x5d6f84,0,.14,0,g,true);cyl(.22,.22,1.2,DARK,-1.2,.3,.1,g,8).rotation.z=PI/2;ball(.3,DARK,.8,.4,.1,g);box(.1,.12,.5,METAL,.8,.76,.1,g,true);cyl(.3,.3,.12,RED,1.3,.3,-.1,g,10);box(1.5,.7,.1,0xe6dccb,0,2.2,-.7,g);box(1.2,.45,.12,GLOW(c,.45),0,2.25,-.65,g,true);return 2.8};
PROPS.bathHub=function(g,c){cyl(1.6,1.6,.1,0xe9d5b8,0,.07,0,g,24);cyl(.85,.9,.45,c,0,.32,0,g,18);cyl(.6,.65,.16,CREAM,0,.62,0,g,16);[[-1.2,.5],[1.3,.2],[.2,-1.3]].forEach(function(q){cyl(.12,.12,.34,CREAM,q[0],.27,q[1],g,8);var fl=ball(.08,lanternMat,q[0],.5,q[1],g);fl.castShadow=false});return 1.4};
PROPS.poolHub=function(g,c){return 0.2};

/* ================= trophy + tv + clock ================= */
var tvCanvas=document.createElement('canvas');tvCanvas.width=512;tvCanvas.height=288;
var tvTex=new T.CanvasTexture(tvCanvas);tvTex.anisotropy=4;
var tvMat=new T.MeshBasicMaterial({map:tvTex});
var trophyG=new T.Group();scene.add(trophyG);
var livingStatic=new T.Group();scene.add(livingStatic);
function drawTV(){
  var c=tvCanvas,x=c.getContext('2d'),W=c.width,H=c.height;
  var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#151a2b');g.addColorStop(1,'#0e1120');x.fillStyle=g;x.fillRect(0,0,W,H);
  var q=qstats(S.projects),hh=Math.floor(TM.h),mm=Math.floor((TM.h-hh)*60);
  x.fillStyle='#f0a23c';x.font='800 22px Manrope,"Noto Sans Thai",sans-serif';x.textBaseline='middle';x.fillText('QUEST BOARD',22,28);
  x.fillStyle='#a09db4';x.font='500 20px "IBM Plex Mono",monospace';x.textAlign='right';x.fillText((hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm,W-22,28);x.textAlign='left';
  x.fillStyle='rgba(255,255,255,.12)';x.fillRect(22,50,W-44,7);x.fillStyle='#f0a23c';x.fillRect(22,50,(W-44)*(q.n?q.d/q.n:0),7);
  x.fillStyle='#eeebf6';x.font='700 44px Manrope,sans-serif';x.fillText(q.d+'/'+q.n,22,100);x.fillStyle='#a09db4';x.font='500 18px "Noto Sans Thai",sans-serif';x.fillText('เควสที่ขีดฆ่าแล้ว',150,104);
  var open=[];S.projects.forEach(function(p){(p.tasks||[]).forEach(function(t){if(!t.done&&open.length<3)open.push(t)})});
  x.font='500 21px "Noto Sans Thai",Manrope,sans-serif';
  open.forEach(function(t,i){var y=148+i*40;x.strokeStyle='#eeebf6';x.lineWidth=2.5;x.strokeRect(24,y-11,20,20);x.fillStyle='#eeebf6';var tx=t.text.length>26?t.text.slice(0,25)+'…':t.text;x.fillText(tx,58,y)});
  x.fillStyle='#6d6a80';x.font='600 15px Manrope,sans-serif';x.fillText('คลิกทีวีเพื่อเปิดแดชบอร์ด',22,H-18);
  tvTex.needsUpdate=true;
}
try{if(document.fonts&&document.fonts.ready)document.fonts.ready.then(drawTV)}catch(e){}

function buildLivingDecor(){
  var g=livingStatic;
  /* rug + sofa + table */
  box(9.2,.06,5.6,0xe4b08c,11,.62,5.4,g,true);box(8,.07,4.4,0xf3d9b8,11,.64,5.4,g,true);
  var sofa=new T.Group();box(4.2,.8,1.7,TERRA,0,.65,0,sofa);box(4.2,1.2,.45,TERRA,0,1.5,-.62,sofa);box(.5,1.1,1.7,0xc86d4e,-2.1,1.1,0,sofa);box(.5,1.1,1.7,0xc86d4e,2.1,1.1,0,sofa);
  box(1.8,.32,1.3,CREAM,-.95,1.2,.1,sofa,true);box(1.8,.32,1.3,CREAM,.95,1.2,.1,sofa,true);box(.7,.7,.25,MUSTARD,-1.6,1.55,-.2,sofa,true);box(.7,.7,.25,TEAL,1.5,1.5,-.2,sofa,true);
  sofa.position.set(11,.55,7.9);sofa.rotation.y=PI;g.add(sofa);
  var tb=new T.Group();box(2.6,.14,1.4,WOOD,0,.9,0,tb);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(p){box(.12,.85,.12,DWOOD,p[0]*1.1,.45,p[1]*.55,tb,true)});box(.7,.12,.5,SAGE,-.4,1.02,0,tb,true);cyl(.18,.14,.3,WHITE,.6,1.1,.1,tb,10);tb.position.set(11,.55,4.3);g.add(tb);
  /* armchairs, plants, lamp */
  var ac=new T.Group();PROPS.armchair(ac,MUSTARD);ac.position.set(6.2,.55,6.4);ac.rotation.y=PI/2*1.2;g.add(ac);
  pot(g,21,11.8,1);pot(g,1.4,1.4,.9);floorLamp(g,16.4,10.6,1);floorLamp(g,5.5,1.2,.9);
  g.children.forEach(function(){});
  /* dog bed */
  var db=new T.Group();box(2.6,.35,2.0,0x8b6f9e,0,.2,0,db);box(2.1,.25,1.5,0xc9b3da,0,.4,0,db,true);db.position.set(3.4,.55,10.2);g.add(db);
  /* tv unit */
  var tvg=new T.Group();box(5.4,.95,1.4,WOOD,0,.5,0,tvg);box(5.2,.1,1.5,DWOOD,0,1.0,0,tvg,true);[[-1.8],[0],[1.8]].forEach(function(a){box(1.5,.6,.06,0xc89a64,a[0],.55,.72,tvg,true);box(.3,.08,.08,METAL,a[0],.7,.78,tvg,true)});
  box(4.2,2.4,.2,DARK,0,2.45,0,tvg);box(.5,.45,.5,METAL,0,1.25,0,tvg,true);
  var scr=new T.Mesh(new T.PlaneGeometry(3.9,2.1),tvMat);scr.position.set(0,2.45,.11);scr.userData.keep=true;tvg.add(scr);
  box(.9,1.6,.9,0x7d5a3c,-3.1,1.1,0,tvg);box(.9,1.6,.9,0x7d5a3c,3.1,1.1,0,tvg);ball(.28,0xf0a23c,-3.1,2.3,0,tvg);
  tvg.position.set(11,.55,1.2);tvg.userData.sel='__tv';mergeStatic(tvg);
  var hitTv=new T.Mesh(G(7.4,4.4,2.6),new T.MeshBasicMaterial({visible:false}));hitTv.position.set(0,2.4,.4);hitTv.userData.keep=true;tvg.add(hitTv);
  scene.add(tvg);tvPick=tvg;
  /* wall clock = floor clock */
  var cg=new T.Group();box(1.5,5.0,1.0,DWOOD,0,2.5,0,cg);box(1.7,.3,1.2,0xb98a5c,0,5.1,0,cg,true);box(1.7,.3,1.2,0xb98a5c,0,.1,0,cg,true);
  var face=cyl(.6,.6,.1,CREAM,0,3.9,.52,cg,24);face.rotation.x=PI/2;
  for(var i=0;i<12;i++){var a=i/12*PI*2;box(.06,.12,.04,DARK,Math.sin(a)*.48,3.9+Math.cos(a)*.48,.6,cg,true).rotation.z=-a}
  box(.7,1.3,.06,0x6b4a33,0,2.1,.52,cg,true);cyl(.22,.22,.06,MUSTARD,0,1.5,.55,cg,10).rotation.x=PI/2;
  mergeStatic(cg);
  var hr=new T.Group(),mn=new T.Group();hr.position.set(0,3.9,.62);mn.position.set(0,3.9,.64);
  var hm=box(.1,.3,.04,DARK,0,.15,0,hr,true);hm.scale.y=1.0;hm.geometry=new T.BoxGeometry(.1,.3,.04);hm.userData.keep=true;
  var mm2=box(.07,.46,.04,DARK,0,.23,0,mn,true);mm2.userData.keep=true;cg.add(hr);cg.add(mn);clockHands={hr:hr,mn:mn};
  cg.position.set(20.8,.55,1.6);cg.rotation.y=-.0;scene.add(cg);
  mergeStatic(g);
}
var tvPick=null,trophyPick=new T.Group();
function buildTrophyShelf(){
  var sh=new T.Group(),W=3.7,Dp=.8;
  box(.12,4.0,Dp,DWOOD,-W/2,2.0,0,sh);box(.12,4.0,Dp,DWOOD,W/2,2.0,0,sh);box(W+.12,.14,Dp,DWOOD,0,.15,0,sh);box(W+.3,.16,Dp+.1,DWOOD,0,4.02,0,sh);box(W,3.9,.08,0xc89a64,0,2.0,-Dp/2+.04,sh,true);
  [1.3,2.4,3.5].forEach(function(y){box(W,.1,Dp-.1,DWOOD,0,y,0,sh,true)});
  sh.position.set(.6,.55,11.0);sh.rotation.y=PI/2;scene.add(sh);
  mergeStatic(sh);
  var hit=new T.Mesh(G(1.8,4.4,W+.6),new T.MeshBasicMaterial({visible:false}));hit.position.set(0,2.2,0);hit.rotation.y=PI/2;hit.userData.keep=true;sh.add(hit);
  sh.userData.sel='__trophy';trophyPick=sh;
  sh.add(trophyG);trophyG.position.set(0,0,0);
}
function rebuildTrophies(){
  while(trophyG.children.length)trophyG.remove(trophyG.children[0]);
  var done=S.projects.filter(function(p){return p.status==='done'}).slice(0,8),bl=badgeList();
  done.forEach(function(p,i){var cup=new T.Group(),c=room(p.dist).c;cyl(.3,.16,.4,0xf5b82e,0,.45,0,cup,10);cyl(.16,.16,.24,0xe0a020,0,.2,0,cup,8);box(.56,.12,.4,c,0,.06,0,cup,true);
    var hnd=new T.Mesh(new T.TorusGeometry(.15,.035,6,10),M(0xf5b82e));hnd.position.set(-.33,.48,0);cup.add(hnd);var h2=hnd.clone();h2.position.x=.33;cup.add(h2);
    cup.position.set(-1.05+(i%4)*.7,(i<4?1.35:2.45),.0);trophyG.add(cup)});
  bl.forEach(function(b,i){var m=new T.Group(),col=b.ok?0xf5b82e:0x8f8aa0;cyl(.15,.15,.05,col,0,0,0,m,14).rotation.x=PI/2;cyl(.09,.09,.07,b.ok?0xfff0b8:0xb5b0c4,0,0,.02,m,14).rotation.x=PI/2;
    if(b.ok)box(.07,.24,.02,0xd9534f,0,-.24,-.02,m,true);
    m.position.set(-1.36+i*.34,3.05,-.28);trophyG.add(m)});
  mergeStatic(trophyG);
}
function buildOtherDecor(){
  var g=new T.Group();scene.add(g);
  /* ---- bedroom ---- */
  var bd=new T.Group();box(4.8,.7,6.4,DWOOD,0,.45,0,bd);box(4.5,.55,6.0,CREAM,0,.95,0,bd,true);box(4.8,2.2,.3,0xb98a5c,0,1.55,-3.1,bd);box(4.5,.3,3.8,0x7a62d6,0,1.28,1.0,bd,true);
  box(1.8,.35,1.0,WHITE,-1.1,1.4,-2.3,bd,true);box(1.8,.35,1.0,WHITE,1.1,1.4,-2.3,bd,true);box(4.5,.1,.5,0xe9d5ff,0,1.46,-.7,bd,true);
  bd.position.set(7.8,.55,-9.7);g.add(bd);
  var ns=new T.Group();box(1.3,1.1,1.1,WOOD,0,.55,0,ns);cyl(.3,.3,.7,lampMat,0,1.6,0,ns,10);ns.position.set(10.3,.55,-11.9);g.add(ns);
  var rg=cyl(2.2,2.2,.05,0xe2cdb6,0,.6,0,g,24);rg.position.set(4,.62,-6.5);rg.scale.set(1,1,.8);
  var wd=new T.Group();box(2.6,4.4,1.2,0xf1e3cf,0,2.2,0,wd);box(.06,4.2,.04,DWOOD,0,2.2,.62,wd,true);box(.14,.5,.08,METAL,-.3,2.2,.66,wd,true);box(.14,.5,.08,METAL,.3,2.2,.66,wd,true);wd.position.set(9.6,.55,-1.1);wd.userData={};g.add(wd);
  /* ---- kitchen ---- */
  var CT=0xf1e3cf;
  function counter(z,len,sink){var k=new T.Group();box(1.5,1.8,len,CT,0,.9,0,k);box(1.7,.14,len+.1,0xfff7ea,0,1.82,0,k,true);box(.1,.7,len-.3,DWOOD,.78,.55,0,k,true);
    for(var d=-1;d<=1;d+=2)box(.04,.9,len/2-.3,0xb98a5c,.78,1.2,d*len/4,k,true);
    if(sink){box(1.0,.1,1.6,0x6f7a8c,.1,1.9,0,k,true);cyl(.05,.05,.7,METAL,-.45,2.25,0,k,6);box(.3,.05,.3,METAL,-.2,2.62,0,k,true);cyl(.22,.22,.1,WHITE,.2,1.96,1.2,k,10);box(.8,.5,.5,0xe8d9bd,.1,2.1,-1.1,k,true)}
    else{[-.8,.8].forEach(function(zz){[-.3,.4].forEach(function(xx){var cc=cyl(.28,.28,.06,DARK,xx,1.92,zz,k,12);cc.castShadow=false})});cyl(.4,.4,.5,0x9aa4b5,-.3,2.2,-.8,k,12);cyl(.42,.42,.08,0x7d8798,-.3,2.5,-.8,k,12);box(.5,.1,.14,DARK,.95,2.0,.8,k,true);cyl(.34,.3,.4,0xd9534f,.4,2.1,.8,k,12);box(.9,.5,.1,DARK,.76,1.3,0,k,true);box(.1,.7,.2,METAL,.76,1.5,-.9,k,true)}
    k.position.set(-9.0,.55,z);return k}
  g.add(counter(2.8,3.4,true));g.add(counter(9.2,3.2,false));
  var fr=new T.Group();box(1.8,4.6,1.7,0xe8eef0,0,2.3,0,fr);box(1.82,.06,1.72,METAL,0,3.0,0,fr,true);box(.1,.9,.1,METAL,.7,3.8,.9,fr,true);box(.1,1.1,.1,METAL,.7,1.7,.9,fr,true);box(.04,.5,.4,0xffd23f,.9,4.0,0,fr,true);box(.04,.4,.3,0xff8fa3,.9,3.3,.2,fr,true);fr.position.set(-9.0,.55,12.0);g.add(fr);
  var is=new T.Group();box(4.0,1.9,1.7,CT,0,.95,0,is);box(4.4,.16,2.0,0xfff7ea,0,1.95,0,is,true);box(3.8,.8,.1,DWOOD,0,.55,.88,is,true);
  [-1.2,1.2].forEach(function(x){var st=new T.Group();cyl(.4,.4,.14,MUSTARD,0,1.25,0,st,12);cyl(.07,.07,1.1,METAL,0,.6,0,st,6);cyl(.3,.3,.06,METAL,0,.05,0,st,10);st.position.set(x,0,1.7);is.add(st)});
  cyl(.5,.4,.3,0xc9a36b,-.9,2.2,0,is,12);ball(.2,0xe5484d,-1.0,2.45,0,is);ball(.2,0xf5b82e,-.75,2.42,.1,is);cyl(.3,.4,.3,WHITE,1.0,2.12,.1,is,10);box(.9,.1,.5,DWOOD,.2,2.08,-.4,is,true);box(.6,.1,.5,0xe7eef0,.2,2.12,.1,is,true);
  is.position.set(-4.6,.55,6.7);g.add(is);
  var bc=new T.Group();box(2.4,1.8,1.4,CT,0,.9,0,bc);box(2.6,.14,1.5,0xfff7ea,0,1.82,0,bc,true);box(.9,.5,.7,0xe8e8ee,-.6,2.15,0,bc,true);box(.5,.8,.5,DARK,.6,2.3,-.1,bc,true);box(.1,.12,.5,0xe5484d,.6,2.5,.2,bc,true);cyl(.15,.12,.2,WHITE,.2,2.0,.4,bc,8);bc.position.set(-1.7,.55,1.0);g.add(bc);
  var pn=new T.Group();box(1.8,4.4,1.1,0xd9b88a,0,2.2,0,pn);box(.04,4.0,.04,DWOOD,0,2.2,.57,pn,true);box(.1,.5,.06,METAL,-.2,2.2,.6,pn,true);box(.1,.5,.06,METAL,.2,2.2,.6,pn,true);pn.position.set(-1.0,.55,12.0);pn.rotation.y=-.0;g.add(pn);
  box(6.4,.05,3.8,0xe3c9a0,-4.6,.62,7.6,g,true);
  pot(g,-9.0,.9,.8,0xd9805f);
  /* ---- garage ---- */
  var tw=new T.Group();box(.2,2.6,4.2,0xd6cbb6,0,3.3,0,tw);[[-1.4,0xe5484d],[-.5,0xf5b82e],[.4,0x3b6fe8],[1.3,0x7cd992]].forEach(function(t){box(.1,1.3,.2,t[1],.16,3.4,t[0],tw,true)});tw.position.set(-21.6,.55,2.8);g.add(tw);
  [[-12.6,10.8],[-11.6,11.6]].forEach(function(p){cyl(.55,.55,1.5,0x4a6fa5,p[0],1.3,p[1],g,10)});
  /* ---- office: game corner (TV + PS5 + sofa) ---- */
  box(6.4,.05,4.2,0x8a9fc4,-5,.62,-9.4,g,true);box(5.6,.06,3.4,0xaec0dc,-5,.64,-9.4,g,true);
  var tu=new T.Group();box(5.0,.95,1.3,0x6b4a33,0,.5,0,tu);box(4.8,.1,1.4,0x4f3624,0,1.0,0,tu,true);[-1.6,0,1.6].forEach(function(a2){box(1.3,.6,.06,0x8a6644,a2,.55,.67,tu,true)});
  box(3.8,2.1,.16,DARK,-.35,2.3,0,tu);box(3.5,1.8,.06,GLOW(0x4a6cff,.75),-.35,2.3,.09,tu,true);box(1.4,.5,.04,GLOW(0xff5ca8,.8),-.9,2.6,.13,tu,true);box(1.0,.9,.04,GLOW(0x3ddc97,.8),.5,2.2,.13,tu,true);box(.5,.4,.4,METAL,-.35,1.2,0,tu,true);
  var ps=new T.Group();box(.18,1.5,1.0,WHITE,-.2,0,0,ps,true);box(.18,1.5,1.0,WHITE,.2,0,0,ps,true);box(.24,1.4,.9,0x1b1d28,0,0,0,ps,true);box(.04,1.2,.04,GLOW(0x3a8bff,.9),0,0,.5,ps,true);box(.5,.14,1.1,0xd8dce6,0,-.8,0,ps,true);ps.position.set(1.95,1.85,.1);tu.add(ps);
  box(.3,.2,.14,WHITE,1.0,1.1,.4,tu,true);box(.12,.05,.1,0x3a8bff,1.0,1.21,.4,tu,true);
  tu.position.set(-5,.55,-11.9);g.add(tu);
  var sf=new T.Group();box(4.0,.8,1.7,0x5a6f9c,0,.65,0,sf);box(4.0,1.2,.45,0x5a6f9c,0,1.5,-.62,sf);box(.5,1.1,1.7,0x4a5f8c,-2.0,1.1,0,sf);box(.5,1.1,1.7,0x4a5f8c,2.0,1.1,0,sf);box(1.7,.32,1.3,0x7d92bd,-.9,1.2,.1,sf,true);box(1.7,.32,1.3,0x7d92bd,.9,1.2,.1,sf,true);box(.7,.7,.25,MUSTARD,-1.5,1.55,-.2,sf,true);box(.7,.7,.25,TERRA,1.5,1.5,-.2,sf,true);
  sf.position.set(-5,.55,-7.2);sf.rotation.y=PI;g.add(sf);
  var ct=new T.Group();box(2.4,.14,1.2,0x6b4a33,0,.8,0,ct);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){box(.12,.75,.12,0x4f3624,q[0]*1.0,.4,q[1]*.45,ct,true)});box(.45,.12,.3,WHITE,-.4,.92,0,ct,true);box(.3,.1,.2,0x1b1d28,.3,.92,.1,ct,true);box(.25,.25,.25,RED,.9,.98,-.2,ct,true);ct.position.set(-5,.55,-9.6);g.add(ct);
  pot(g,-9.0,-0.9,.9);floorLamp(g,-1.3,-11.8,1);
  /* ---- gym ---- */
  var tm=new T.Group();box(2.2,.35,4.2,DARK,0,.4,0);box(1.7,.12,3.6,0x4c556b,0,.64,.1,tm,true);cyl(.08,.08,2.6,METAL,-.85,1.8,-1.7,tm,6);cyl(.08,.08,2.6,METAL,.85,1.8,-1.7,tm,6);box(1.9,.6,.5,DARK,0,3.2,-1.7,tm);box(1.5,.35,.06,GLOW(0x3f7fd9,.8),0,3.2,-1.43,tm,true);
  tm.add(box(2.2,.35,4.2,DARK,0,.4,0));tm.position.set(-19.8,.55,-9.4);g.add(tm);
  var bp=new T.Group();box(1.2,.5,3.2,DARK,0,.9,0.4,bp);box(1.0,.15,2.8,RED,0,1.2,.4,bp,true);[-1.2,1.2].forEach(function(x){box(.14,2.2,.14,METAL,x,1.4,-.9,bp,true)});box(3.6,.1,.1,METAL,0,2.5,-.9,bp,true);[-1.4,-1.1,1.1,1.4].forEach(function(x){cyl(.5,.5,.14,DARK,x,2.5,-.9,bp,12).rotation.z=PI/2});bp.position.set(-14.8,.55,-10.2);g.add(bp);
  var dr=new T.Group();box(3.4,.18,1.0,DARK,0,1.6,0,dr);box(3.4,.18,1.0,DARK,0,.9,0,dr);[-1.6,1.6].forEach(function(x){box(.14,1.6,.9,METAL,x,.85,0,dr,true)});
  for(var i=0;i<5;i++){cyl(.18,.18,.5,i%2?0x3f7fd9:RED,-1.3+i*.65,1.95,0,dr,8).rotation.z=PI/2;cyl(.16,.16,.5,0x555d73,-1.3+i*.65,1.25,0,dr,8).rotation.z=PI/2}
  dr.position.set(-11.4,.55,-11.9);g.add(dr);
  var mr=new T.Group();box(.12,3.6,4.4,0xcfe2ee,0,0,0,mr,true);box(.16,3.8,4.6,WOOD,-.02,0,0,mr,true);mr.position.set(-21.55,3.3,-2.2);g.add(mr);
  pot(g,-20.8,-0.9,.9);
  /* ---- bath ---- */
  var bt=new T.Group();box(5.0,1.5,2.4,WHITE,0,.75,0);box(4.5,.4,1.9,0x8fd7ea,0,1.55,0,bt,true);box(5.2,.2,2.6,0xe7eef0,0,1.55,0,bt,true);cyl(.08,.08,.7,METAL,-2.1,2.0,0,bt,6);bt.add(box(5.0,1.5,2.4,WHITE,0,.75,0));bt.position.set(15,.55,-11.4);g.add(bt);
  var vn=new T.Group();box(2.6,1.7,1.3,WOOD,0,.85,0,vn);box(2.8,.14,1.4,WHITE,0,1.75,0,vn,true);cyl(.5,.4,.2,0xe7eef0,0,1.85,0,vn,14);cyl(.05,.05,.5,METAL,0,2.2,-.3,vn,6);vn.position.set(19.6,.55,-11.9);g.add(vn);
  pframe(g,19.6,4.3,-12.65,1.8,1.5,0x2aa3c4,0);
  var tl=new T.Group();box(1.1,.8,1.5,WHITE,0,.4,0,tl);box(1.2,1.4,.5,WHITE,0,1.3,-.8,tl);tl.position.set(20.7,.55,-8.9);tl.rotation.y=-PI/2;g.add(tl);
  box(1.0,.06,.6,0xf3d6a8,12.4,.62,-1.8,g,true);pot(g,20.6,-1.7,1);
  /* ---- pool ---- */
  var px=33,pz=3,pw=15,pd=9.4;
  box(pw+1.2,.4,pd+1.2,WHITE,px,.7,pz,g);box(pw-.6,.1,pd-.6,0xbdeaf5,px,.82,pz,g,true);
  var water=new T.Mesh(G(pw-.4,.12,pd-.4),new T.MeshLambertMaterial({color:0x4fc3ea,emissive:0x2a8fb5,emissiveIntensity:.35,transparent:true,opacity:.82}));water.position.set(px,.9,pz);water.receiveShadow=true;g.add(water);
  [[0,-pd/2],[0,pd/2]].forEach(function(a){box(pw+1.2,.2,.7,0xf1ebe0,px,.98,pz+a[1],g,true)});[[-pw/2,0],[pw/2,0]].forEach(function(a){box(.7,.2,pd,0xf1ebe0,px+a[0],.98,pz,g,true)});
  for(var l=1;l<5;l++)box(.1,.02,pd-1,0xffffff,px-pw/2+l*(pw/5),.97,pz,g,true);
  var ring=new T.Mesh(new T.TorusGeometry(.7,.28,8,16),M(0xf06a8a));ring.rotation.x=PI/2;ring.position.set(px+3.5,1.05,pz-1.4);g.add(ring);
  [-1,1].forEach(function(s){var ld=cyl(.06,.06,1.6,METAL,px-pw/2-.1,1.3,pz+s*1.0,g,6);var cc=cyl(.06,.06,.9,METAL,px-pw/2+.5,2.0,pz+s*1.0,g,6);cc.rotation.z=PI/2});
  for(var k=0;k<2;k++){var lg=new T.Group();box(1.5,.3,3.4,WHITE,0,.55,0,lg);box(1.4,.2,1.2,TEAL,0,.78,-1.2,lg,true);var bk=box(1.4,.2,1.4,TEAL,0,1.2,1.4,lg,true);bk.rotation.x=-.55;[[-.6,-1.4],[.6,-1.4],[-.6,1.4],[.6,1.4]].forEach(function(p){box(.12,.4,.12,METAL,p[0],.25,p[1],lg,true)});lg.position.set(px-5.5+k*3.0,.5,pz+pd/2+2.6);lg.rotation.y=PI;g.add(lg)}
  var pa=new T.Group();cyl(.07,.07,3.6,METAL,0,1.8,0,pa,6);var cn=new T.Mesh(new T.ConeGeometry(2.4,.9,10),M(TERRA));cn.position.y=3.9;cn.castShadow=true;pa.add(cn);pa.position.set(px+4.6,.5,pz+pd/2+2.6);g.add(pa);
  /* ---- garden / lot ---- */
  function tree(x,z,s,c){var t=new T.Group();cyl(.28*s,.38*s,2.2*s,0xa8764a,0,1.1*s,0,t,6);ball(1.9*s,c||0x7bc58f,0,3.2*s,0,t);ball(1.4*s,0x62b57c,.9*s,4.2*s,.3*s,t);ball(1.0*s,0x8fd09f,-.9*s,3.9*s,.6*s,t);t.position.set(x,0,z);g.add(t)}
  [[-30,-14,1.4],[-31,6,1.2],[-30,30,1.3],[-8,-19,1.3],[10,-19.5,1.5],[28,-17,1.2],[42,-12,1.3],[44,22,1.3],[40,32,1.1],[-24,35,1],[25,35,1.1],[-34,-4,1]].forEach(function(a){tree(a[0],a[1],a[2],a[2]>1.25?0x7bc58f:0x8ccf86)});
  function bush(x,z,s){ball(1.0*s,0x77c68c,x,.8*s,z,g);ball(.75*s,0x62b57c,x+.9*s,.55*s,z+.3*s,g);ball(.6*s,0x8bd29b,x-.8*s,.5*s,z+.2*s,g)}
  [-19,-9.5,-4,1,5,11,16,20].forEach(function(x,i){bush(x,14.4+(i%2)*.2,.9)});bush(-24,8,1);bush(-24,-4,1);bush(24,-14.8,1);bush(-4,-14.8,1);
  function flowers(x,z,w,d,c1,c2){box(w,.45,d,0x7a5538,x,.25,z,g);for(var i=0;i<Math.floor(w*d*1.1);i++){var fx=x+(Math.random()-.5)*(w-.4),fz=z+(Math.random()-.5)*(d-.4);ball(.2,[c1,c2,0xffffff,0xf5b82e][i%4],fx,.75+Math.random()*.2,fz,g)}}
  var rs=(function(){var s=7;return function(){s=(s*9301+49297)%233280;return s/233280}})();var oldR=Math.random;Math.random=rs;
  flowers(2.5,16.4,5,2.2,0xe0507a,0xf08a24);flowers(14.5,16.4,6,2.2,0x8a5cf0,0xe0507a);flowers(-5,16.4,5.4,2.2,0xf5b82e,0xf06a8a);
  Math.random=oldR;
  /* fence */
  for(var fx2=-33;fx2<=45;fx2+=1.6){if((fx2>-21&&fx2<-11)||(fx2>6.5&&fx2<10.5))continue;box(.22,1.5,.22,WHITE,fx2,.75,38.4,g,true)}
  box(24,.18,.14,WHITE,-27,1.15,38.4,g,true);box(16,.18,.14,WHITE,-1.2,1.15,38.4,g,true);box(34.5,.18,.14,WHITE,28.3,1.15,38.4,g,true);box(34.5,.18,.14,WHITE,28.3,.6,38.4,g,true);
  /* mailbox + lamps */
  var mb=new T.Group();box(.2,1.6,.2,DWOOD,0,.8,0,mb,true);box(1.1,.7,.7,RED,0,1.8,0,mb);mb.position.set(12,0,36.6);g.add(mb);
  [[5.2,19],[11.2,19],[5.2,30],[11.2,30],[-8,36.5]].forEach(function(p){var lp=new T.Group();cyl(.1,.1,2.6,DARK,0,1.3,0,lp,6);ball(.34,lanternMat,0,2.8,0,lp).castShadow=false;lp.position.set(p[0],0,p[1]);g.add(lp)});
  /* car on driveway */
  var car=new T.Group();box(5.8,1.3,3.0,0x6fb3a8,0,1.1,0,car);box(3.2,1.1,2.7,0x6fb3a8,-.2,2.3,0,car);box(3.0,.8,2.72,winMat,-.2,2.35,0,car,true);
  [[-1.8,-1.5],[1.8,-1.5],[-1.8,1.5],[1.8,1.5]].forEach(function(w){var wh=cyl(.6,.6,.5,DARK,w[0],.6,w[1],car,14);wh.rotation.x=PI/2});
  ball(.22,lanternMat,2.95,1.3,-1.0,car);ball(.22,lanternMat,2.95,1.3,1.0,car);
  car.position.set(-16,0,22);car.rotation.y=-PI/2;g.add(car);
  /* back wall deco for gym outside / AC unit */
  box(2.2,1.4,1.2,0xdcd7cc,26,.7,-14.6,g);
  mergeStatic(g);
}
buildLivingDecor();buildTrophyShelf();buildOtherDecor();
