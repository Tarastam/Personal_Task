<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function(){
'use strict';
var T=window.THREE,$=function(s){return document.querySelector(s)};
var PI=Math.PI,lerp=function(a,b,t){return a+(b-a)*t},clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};
var reduced=false;try{reduced=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var DAYS=['จ.','อ.','พ.','พฤ.','ศ.','ส.','อา.'];

/* ================= rooms ================= */
function R(o){o.cx=(o.x0+o.x1)/2;o.cz=(o.z0+o.z1)/2;o.c=parseInt(o.css.slice(1),16);return o}
var ROOMS=[
 R({k:'work',n:'โรงรถ',en:'Garage · งานโรงงาน',css:'#d9683a',x0:-22,x1:-10,z0:0,z1:13,node:'garage',slots:[[-19.4,2.4,0],[-12.4,2.4,0],[-20.4,6.8,PI/2],[-20.4,10.6,PI/2],[-16,10.8,0],[-11.9,8.6,-PI/2]]}),
 R({k:'apps',n:'ห้องทำงาน',en:'Office · แอปและเครื่องมือ',css:'#2f9e8f',x0:-10,x1:0,z0:-13,z1:0,node:'office',slots:[[-8.4,-3.4,PI/2],[-2.2,-3.0,0],[-1.2,-10.2,-PI/2],[-8.8,-10.4,PI/2],[-5,-3.0,0],[-8.8,-6.6,PI/2]]}),
 R({k:'growth',n:'ห้องนอน',en:'Bedroom · พัฒนาตัวเอง',css:'#7a62d6',x0:0,x1:11,z0:-13,z1:0,node:'bed',slots:[[3.2,-11.4,0],[1.9,-3.4,0],[9.2,-3.0,0],[9.8,-4.6,-PI/2],[2.0,-7.4,PI/2],[6,-6.6,0]]}),
 R({k:'income',n:'ครัว',en:'Kitchen · รายได้เสริม',css:'#e9a02a',x0:-10,x1:0,z0:0,z1:13,node:'kitchen',slots:[[-7.4,10.8,0],[-2.6,10.8,0],[-7.0,2.8,0],[-8.4,7.2,PI/2],[-1.4,6.8,-PI/2],[-4.6,2.8,0]]}),
 R({k:'life',n:'ห้องรับแขก',en:'Living · งานอดิเรก',css:'#d9487a',x0:0,x1:22,z0:0,z1:13,node:'livA',slots:[[20,2.5,0],[2.3,2.4,0],[20.3,11,0],[6.2,11.2,0],[14.6,11.2,0],[2.6,6.6,PI/2]]}),
 R({k:'garden',n:'สวนหน้าบ้าน',en:'Front garden',css:'#4fa64f',x0:-26,x1:26,z0:13,z1:34,node:'garden',outdoor:true,slots:[[-12,19,0],[14.5,19.5,0],[-19,26,0],[20,26,0],[-5.5,25,0],[5.5,30,0]]}),
 R({k:'gym',n:'ห้องออกกำลังกาย',en:'Gym · ตารางประจำสัปดาห์',css:'#3f7fd9',x0:-22,x1:-10,z0:-13,z1:0,node:'gym',routine:true,hub:[-12.6,-3.4,0]}),
 R({k:'bath',n:'ห้องน้ำ · สมาธิ',en:'Bathroom · Meditation',css:'#2aa3c4',x0:11,x1:22,z0:-13,z1:0,node:'bath',routine:true,hub:[13.4,-3.4,0]}),
 R({k:'pool',n:'สระว่ายน้ำ',en:'Pool · ตารางประจำสัปดาห์',css:'#2b8fe0',x0:22,x1:44,z0:-6,z1:14,node:'pool',routine:true,outdoor:true,hub:[34.2,10.8,0]})
];
var room=function(k){return ROOMS.filter(function(r){return r.k===k})[0]||ROOMS[0]};
var PROJROOMS=ROOMS.filter(function(r){return !r.routine});
var ROUTROOMS=ROOMS.filter(function(r){return r.routine});
var STATUS={active:{n:'กำลังทำ',cls:'good'},planning:{n:'วางแผน',cls:'blue'},paused:{n:'พักไว้',cls:'idle'},done:{n:'เสร็จแล้ว',cls:'warn'}};

/* ================= data (example values, editable on the TV) ================= */
function Q(text,done){return {id:'t'+Math.random().toString(36).slice(2,8),text:text,done:!!done}}
function defaultProjects(){return [
 {id:'p1',name:'Production Quality Improvement',dist:'work',status:'active',prog:0,hrs:6,tasks:[Q('สรุป Pareto ของเสียประจำสัปดาห์'),Q('ตั้งเป้าลดของเสียของ 1 ไลน์',1),Q('รายงานผลให้ QA')]},
 {id:'p2',name:'Line Issue Log',dist:'work',status:'active',prog:0,hrs:3,tasks:[Q('เพิ่มช่องบันทึกสาเหตุและผู้รับผิดชอบ'),Q('ให้ Line Leader ทดลองใช้',1)]},
 {id:'p3',name:'Production Daily Report',dist:'work',status:'active',prog:0,hrs:2,tasks:[Q('ตรวจสูตรสรุปยอดผลิตรายกะ'),Q('ทำหน้ารายงานพิมพ์ A4',1)]},
 {id:'p4',name:'OT Management Plan',dist:'work',status:'planning',prog:0,hrs:1.5,tasks:[Q('ร่างตาราง OT ของ 6 ไลน์'),Q('ตรวจร่างกับ Line Leader')]},
 {id:'p5',name:'Experimental Follow-up',dist:'work',status:'active',prog:0,hrs:2,tasks:[Q('อัปเดตสถานะการทดลองที่ค้างอยู่'),Q('ทำตารางติดตามผล',1)]},
 {id:'p6',name:'Tantalum Request Material',dist:'work',status:'active',prog:0,hrs:2,tasks:[Q('ทดสอบฟอร์มขอเบิกกับไลน์จริง'),Q('เชื่อมกับรายการวัตถุดิบ',1),Q('สรุปปัญหาที่เจอ')]},
 {id:'p7',name:'Project Management App',dist:'apps',status:'planning',prog:0,hrs:3,tasks:[Q('สเก็ตช์หน้าจอหลัก'),Q('ออกแบบโครงข้อมูล')]},
 {id:'p8',name:'Material Inventory App',dist:'apps',status:'active',prog:0,hrs:2,tasks:[Q('วางแผน Phase 2'),Q('ใช้งานจริงกับหน้างานหนึ่งแห่ง',1)]},
 {id:'p9',name:'PSLB Welding Dashboard',dist:'apps',status:'active',prog:0,hrs:3,tasks:[Q('ทำหน้า Power BI สำหรับหัวหน้าไลน์'),Q('ต่อข้อมูลจาก Excel',1)]},
 {id:'p10',name:'My Life House',dist:'apps',status:'done',prog:0,hrs:0,tasks:[Q('ออกแบบห้องและของในบ้าน',1),Q('ทำกระดานเควสบนทีวี',1)]},
 {id:'p11',name:'Extra Income Plan',dist:'income',status:'planning',prog:0,hrs:2,tasks:[Q('เลือกแนวทางหลักหนึ่งอย่าง'),Q('ตั้งเป้าหมายรายเดือน')]},
 {id:'p12',name:'AI Trading',dist:'income',status:'planning',prog:0,hrs:1,tasks:[Q('กำหนดกติกาการทดสอบย้อนหลัง'),Q('รวบรวมข้อมูลราคา')]},
 {id:'p13',name:'AI Agent Company',dist:'income',status:'planning',prog:0,hrs:1,tasks:[Q('ร่างแผนกและหน้าที่ของ agent')]},
 {id:'p14',name:'Baldr the Writer',dist:'income',status:'active',prog:0,hrs:2,tasks:[Q('ทดลองเขียนตอนใหม่หนึ่งตอน'),Q('ตั้งโครงเรื่องหลัก',1)]},
 {id:'p15',name:'Data Career Switch',dist:'growth',status:'active',prog:0,hrs:4,tasks:[Q('ทำงานตัวอย่างสำหรับ portfolio'),Q('รวบรวมตำแหน่งงานที่สนใจ',1),Q('ปรับ resume')]},
 {id:'p16',name:'Excel / VBA / Power BI',dist:'growth',status:'active',prog:0,hrs:3,tasks:[Q('ฝึก Power Query กับข้อมูลหน้างาน'),Q('ทำ dashboard Power BI หนึ่งชิ้น'),Q('จบบทเรียน VBA เบื้องต้น',1)]},
 {id:'p17',name:'Creative Hobbies',dist:'life',status:'paused',prog:40,hrs:1,tasks:[]},
 {id:'p18',name:'Front Garden Makeover',dist:'garden',status:'planning',prog:0,hrs:1,tasks:[Q('เลือกไม้ดอกที่ทนแดด'),Q('ทำที่รดน้ำอัตโนมัติ'),Q('จัดทางเดินหินหน้าบ้าน',1)]}
]}
function wk(plans){var ti=(new Date().getDay()+6)%7;return plans.map(function(p,i){return {plan:p,done:!!(p&&i<ti&&i%3!==1)}})}
function defaultRoutines(){return [
 {id:'gym',name:'ตารางออกกำลังกาย',days:wk(['อก + ไหล่','','ขา + ก้น','คาร์ดิโอ 30 นาที','หลัง + แขน','ยืดเหยียด',''])},
 {id:'bath',name:'นั่งสมาธิ',days:wk(['10 นาที','10 นาที','10 นาที','10 นาที','10 นาที','15 นาที','15 นาที'])},
 {id:'pool',name:'ว่ายน้ำ',days:wk(['','ว่าย 20 รอบ','','ว่าย 20 รอบ','','ว่าย 30 รอบ',''])}
]}
function weekKey(){var d=new Date();d.setHours(0,0,0,0);var w=(d.getDay()+6)%7;d.setDate(d.getDate()-w);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function todayIdx(){return (new Date().getDay()+6)%7}
var KEY='lifehouse.v2';
function freshState(){return {projects:defaultProjects(),routines:defaultRoutines(),week:weekKey(),last:'p1'}}
function load(){
  var s=null;try{var r=localStorage.getItem(KEY);if(r){var a=JSON.parse(r);if(a&&Array.isArray(a.projects)&&Array.isArray(a.routines))s=a}}catch(e){}
  if(!s)s=freshState();
  if(s.week!==weekKey()){s.routines.forEach(function(rt){rt.days.forEach(function(d){d.done=false})});s.week=weekKey()}
  return s;
}
var S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function proj(id){return S.projects.filter(function(p){return p.id===id})[0]}
function rout(id){return S.routines.filter(function(r){return r.id===id})[0]}
function prog(p){return p.tasks&&p.tasks.length?Math.round(p.tasks.filter(function(t){return t.done}).length/p.tasks.length*100):Math.round(p.prog||0)}
function rstat(rt){var pl=rt.days.filter(function(d){return d.plan&&d.plan.trim()}),dn=pl.filter(function(d){return d.done});return {planned:pl.length,done:dn.length,pct:pl.length?Math.round(dn.length/pl.length*100):0}}
function qstats(list){var n=0,d=0;list.forEach(function(p){(p.tasks||[]).forEach(function(t){n++;if(t.done)d++})});return {n:n,d:d}}
function pstats(list){var n=list.length,avg=n?list.reduce(function(s,p){return s+prog(p)},0)/n:0,h=list.reduce(function(s,p){return s+(+p.hrs||0)},0);return {n:n,avg:avg,h:h}}
function badgeList(){
  var q=qstats(S.projects),dp=S.projects.filter(function(p){return p.status==='done'}).length,g=rstat(rout('gym')),m=rstat(rout('bath')),p=rstat(rout('pool'));
  var rooms=PROJROOMS.filter(function(r){return S.projects.some(function(x){return x.dist===r.k&&(x.tasks||[]).some(function(t){return t.done})})}).length;
  return [
   {k:'q1',n:'เควสแรก',d:'ขีดฆ่าเควสแรก',ok:q.d>=1},
   {k:'q10',n:'สิบเควส',d:'ทำเควสครบ 10 ข้อ',ok:q.d>=10},
   {k:'q25',n:'ยี่สิบห้าเควส',d:'ทำเควสครบ 25 ข้อ',ok:q.d>=25},
   {k:'p1',n:'โปรเจกต์แรกสำเร็จ',d:'ปิดโปรเจกต์แรกได้',ok:dp>=1},
   {k:'p5',n:'ห้าโปรเจกต์',d:'ปิดโปรเจกต์ครบ 5 งาน',ok:dp>=5},
   {k:'all',n:'ทุกห้องมีผลงาน',d:'ทำเควสสำเร็จในทุกห้องโปรเจกต์',ok:rooms>=PROJROOMS.length},
   {k:'gym',n:'ครบสัปดาห์ออกกำลังกาย',d:'ทำตามตารางออกกำลังกายครบทั้งสัปดาห์',ok:g.planned>0&&g.done===g.planned},
   {k:'med',n:'สมาธิห้าวัน',d:'นั่งสมาธิครบ 5 วันในสัปดาห์',ok:m.done>=5},
   {k:'pool',n:'นักว่ายน้ำ',d:'ว่ายน้ำครบตามตาราง',ok:p.planned>0&&p.done===p.planned}
  ];
}

/* ================= three ================= */
var canvas=$('#gl');
var renderer=new T.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.setClearColor(0x000000,0);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
var scene=new T.Scene();
var cam=new T.OrthographicCamera(-1,1,1,-1,1,1000);
var hemi=new T.HemisphereLight(0xffffff,0xc2b79d,0.9);scene.add(hemi);
var sun=new T.DirectionalLight(0xffffff,0.8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-0.0006;
var sc=sun.shadow.camera;sc.near=1;sc.far=400;scene.add(sun);scene.add(sun.target);
var mats={},geos={},gl={};
function M(c){return mats[c]||(mats[c]=new T.MeshLambertMaterial({color:c}))}
function GLOW(c,k){var key=c+'g'+(k||0);return gl[key]||(gl[key]=new T.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:k||.65}))}
function G(w,h,d){var k=w+'|'+h+'|'+d;return geos[k]||(geos[k]=new T.BoxGeometry(w,h,d))}
function box(w,h,d,c,x,y,z,p,ns){var m=new T.Mesh(G(w,h,d),typeof c==='object'?c:M(c));m.position.set(x||0,y||0,z||0);if(!ns)m.castShadow=true;m.receiveShadow=true;if(p)p.add(m);return m}
function cyl(rt,rb,h,c,x,y,z,p,seg){var m=new T.Mesh(new T.CylinderGeometry(rt,rb,h,seg||14),typeof c==='object'?c:M(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(p)p.add(m);return m}
function ball(r,c,x,y,z,p){var m=new T.Mesh(new T.SphereGeometry(r,14,10),typeof c==='object'?c:M(c));m.position.set(x,y,z);m.castShadow=true;if(p)p.add(m);return m}

/* merge static meshes of a group by material (cuts draw calls a lot) */
function mergeStatic(root){
  root.updateMatrixWorld(true);
  var inv=new T.Matrix4().copy(root.matrixWorld).invert(),buckets={},list=[];
  root.traverse(function(o){
    if(o.isMesh&&!o.userData.keep&&o.geometry&&!Array.isArray(o.material)&&o.material.visible!==false){
      var key=o.material.uuid+(o.castShadow?'c':'')+(o.receiveShadow?'r':'');
      (buckets[key]=buckets[key]||{m:o.material,c:o.castShadow,r:o.receiveShadow,l:[]}).l.push(o);list.push(o);
    }
  });
  Object.keys(buckets).forEach(function(k){
    var b=buckets[k],pos=[],nor=[],idx=[],off=0;
    b.l.forEach(function(o){
      var g=o.geometry.clone();g.applyMatrix4(new T.Matrix4().multiplyMatrices(inv,o.matrixWorld));
      var p=g.attributes.position.array,n=g.attributes.normal.array;
      for(var i=0;i<p.length;i++){pos.push(p[i]);nor.push(n[i])}
      var ix=g.index?g.index.array:null;
      if(ix){for(var j=0;j<ix.length;j++)idx.push(ix[j]+off)}else{for(var j2=0;j2<p.length/3;j2++)idx.push(j2+off)}
      off+=p.length/3;g.dispose();
    });
    var geo=new T.BufferGeometry();
    geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new T.Float32BufferAttribute(nor,3));
    geo.setIndex(off>65000?new T.Uint32BufferAttribute(idx,1):new T.Uint16BufferAttribute(idx,1));
    var m=new T.Mesh(geo,b.m);m.castShadow=b.c;m.receiveShadow=b.r;root.add(m);
  });
  list.forEach(function(o){if(o.parent)o.parent.remove(o)});
}

/* ================= time of day ================= */
function C(s){return new T.Color(s)}
var KF=[
 [0,'#0a1230','#1d2c56','#8da2f0',.26,'#5a6bb0','#1c2244',.5,1],
 [5,'#0a1230','#1d2c56','#8da2f0',.26,'#5a6bb0','#1c2244',.5,1],
 [6.3,'#6f80b8','#f6b48c','#ffc08a',.5,'#d8c4cc','#6d6272',.66,.45],
 [8.2,'#7ec3f2','#e8f4fb','#fff1da',.7,'#ffffff','#a9b894',.7,0],
 [12,'#6bb8f0','#dcf0fb','#fffaf0',.78,'#ffffff','#aebd98',.72,0],
 [16,'#78bff0','#eaf2f6','#ffeccf',.74,'#ffffff','#a9b894',.7,0],
 [17.9,'#8f8fc4','#ffc08a','#ffa860',.64,'#f7d4c2','#7c6c6c',.72,.2],
 [19.2,'#363c72','#df7480','#ff8a70',.34,'#8480b0','#3c3652',.54,.75],
 [20.6,'#0e1636','#26335f','#8da2f0',.26,'#5a6bb0','#1c2244',.5,1],
 [24,'#0a1230','#1d2c56','#8da2f0',.26,'#5a6bb0','#1c2244',.5,1]
].map(function(a){return {h:a[0],top:C(a[1]),bot:C(a[2]),sun:C(a[3]),si:a[4],hs:C(a[5]),hg:C(a[6]),hi:a[7],nf:a[8]}});
var tOver=null;
function curH(){if(tOver!==null)return tOver;var d=new Date();return d.getHours()+d.getMinutes()/60+d.getSeconds()/3600}
var TM={nf:0,h:12};
var winMat=new T.MeshLambertMaterial({color:0xbfe3fb,emissive:0x8cc8f0,emissiveIntensity:.5});
var lampMat=new T.MeshLambertMaterial({color:0xfff1c2,emissive:0xffd88a,emissiveIntensity:.2});
var lanternMat=new T.MeshLambertMaterial({color:0xfff1c2,emissive:0xffd88a,emissiveIntensity:.2});
var glowDecals=[],clockHands=null,tvTexNeeds=0;
var tmpA=C('#000000'),tmpB=C('#000000'),warm=C('#ffd48a');
function applyTime(){
  var h=curH(),i=0;for(i=0;i<KF.length-2&&h>KF[i+1].h;i++){}
  var a=KF[i],b=KF[i+1],t=clamp((h-a.h)/(b.h-a.h),0,1);
  tmpA.copy(a.top).lerp(b.top,t);var top='#'+tmpA.getHexString();tmpB.copy(a.bot).lerp(b.bot,t);var bot='#'+tmpB.getHexString();
  $('#sky').style.background='linear-gradient('+top+','+bot+')';
  var nf=lerp(a.nf,b.nf,t);TM.nf=nf;TM.h=h;
  hemi.color.copy(a.hs).lerp(b.hs,t);hemi.groundColor.copy(a.hg).lerp(b.hg,t);hemi.intensity=lerp(a.hi,b.hi,t);
  sun.color.copy(a.sun).lerp(b.sun,t);sun.intensity=lerp(a.si,b.si,t);
  /* sun / moon position */
  var dayT=(h-6)/12,isDay=dayT>=0&&dayT<=1,ang=isDay?dayT*PI:((h>=18?h-18:h+6)/12)*PI;
  var sx=Math.cos(ang)*60,sy=Math.max(14,Math.sin(ang)*80);
  sun.userData.dir=[sx,sy,30];
  var orb=$('#orb'),px=8+(isDay?dayT:(((h>=18?h-18:h+6)/12)))*84,py=24-Math.sin(ang)*18;
  orb.style.left=px+'%';orb.style.top=py+'%';
  if(isDay){var warmK=1-Math.sin(ang);orb.style.background='radial-gradient(circle at 40% 40%,#fffbe0,#ffd25a '+(60+warmK*10)+'%,#ff9a3c)';orb.style.setProperty('--glow','rgba(255,'+(220-warmK*80|0)+','+(130-warmK*60|0)+',.6)')}
  else{orb.style.background='radial-gradient(circle at 36% 38%,#fff,#dfe6ff 62%,#a9b6e6)';orb.style.setProperty('--glow','rgba(170,190,255,.35)')}
  orb.style.width=orb.style.height=(isDay?54:40)+'px';
  $('#stars').style.opacity=clamp((nf-.3)/.7,0,1);
  document.querySelectorAll('.cloud').forEach(function(c){c.style.opacity=lerp(.85,.18,nf)});
  /* windows / lamps */
  tmpA.copy(a.bot).lerp(b.bot,t).lerp(warm,clamp(nf*1.2,0,1));
  winMat.color.copy(tmpA);winMat.emissive.copy(tmpA);winMat.emissiveIntensity=.4+.55*nf;
  lampMat.emissiveIntensity=.12+.95*nf;lanternMat.emissiveIntensity=.1+1.1*nf;
  glowDecals.forEach(function(g){g.material.opacity=nf*.6});
  /* clock + labels in HTML */
  var hh=Math.floor(h),mm=Math.floor((h-hh)*60);
  $('#clkT').textContent=(hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm;
  $('#clkP').textContent=h<5||h>=19.6?'กลางคืน':h<7.8?'เช้าตรู่':h<11.5?'เช้า':h<15.5?'บ่าย':h<18?'เย็น':'ค่ำ';
  var night=nf>.55;$('#clkIco').innerHTML=night?'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>':'<circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>';
  if(clockHands){clockHands.hr.rotation.z=-((h%12)/12)*PI*2;clockHands.mn.rotation.z=-((h%1))*PI*2}
  tvTexNeeds=1;
}

/* ================= lot (floating diorama) ================= */
var LOT={x0:-36,x1:46,z0:-24,z1:40};
var lotG=new T.Group();scene.add(lotG);
(function(){
  var w=LOT.x1-LOT.x0,d=LOT.z1-LOT.z0,cx=(LOT.x0+LOT.x1)/2,cz=(LOT.z0+LOT.z1)/2;
  box(w,.7,d,0x78bb68,cx,-.35,cz,lotG);
  box(w-.3,3.2,d-.3,0x8a6446,cx,-2.3,cz,lotG);
  box(w-1.2,1.6,d-1.2,0x6f4f36,cx,-4.7,cz,lotG);
  /* house plinth */
  box(45.4,.5,26.9,0xd9cdb8,0,.25,0,lotG);
  /* pool deck */
  box(22.4,.5,20.6,0xd8b184,33.2,.25,4,lotG);
  /* driveway + path */
  box(9,.12,28,0xc4bfb4,-16,.06,27,lotG,true);
  for(var s=0;s<8;s++)box(2.6,.14,1.7,s%2?0xe6dfd2:0xdcd4c4,8.2+(s%2?.25:-.25),.07,15.5+s*2.6,lotG,true);
  /* soft lawn stripes */
  for(var i=0;i<8;i++)box(w-3,.04,3.4,i%2?0x86c476:0x73b363,cx,.02,LOT.z0+6+i*8.2,lotG,true);
})();

/* ================= house ================= */
var WALLC=0xf6ead8,WALLD=0xe3d3bb,TRIM=0xfff7ea,EXTH=6.3,BH=8.4,INH=1.7,FLOORY=.55;
var extWalls={};
var houseStatic=new T.Group();scene.add(houseStatic);

function rooms_floor(){
  var fl={work:0xb9bdc4,apps:0xc99b69,growth:0xe8d6c2,income:0xefe2cc,life:0xd9ab76,gym:0x8d9aa8,bath:0xcfe3e6};
  Object.keys(fl).forEach(function(k){var r=room(k);box(r.x1-r.x0,.08,r.z1-r.z0,fl[k],r.cx,.54,r.cz,houseStatic,true)});
  /* wood plank stripes */
  [['life',0xd9ab76,0xcf9f69],['apps',0xc99b69,0xbd8f5c],['growth',0xe8d6c2,0xe0cdb7]].forEach(function(a){var r=room(a[0]);
    for(var z=r.z0+.6;z<r.z1;z+=1.2){box(r.x1-r.x0,.02,.6,a[2],r.cx,.6,z,houseStatic,true)}});
  /* kitchen + bath tiles */
  [['income',0xe8d9bd,0xf3e9d5],['bath',0xbcd7dc,0xdceced]].forEach(function(a){var r=room(a[0]);
    for(var i=0;i<Math.floor((r.x1-r.x0)/2);i++)for(var j=0;j<Math.floor((r.z1-r.z0)/2);j++){if((i+j)%2===0)box(2,.02,2,a[1],r.x0+1+i*2,.6,r.z0+1+j*2,houseStatic,true)}});
  /* garage stripes */
  for(var i2=0;i2<5;i2++)box(.25,.015,13,0xe7c24a,-21+i2*0+0,.6,6.5,houseStatic,true);
  /* gym rubber tiles accent */
  var g=room('gym');box(g.x1-g.x0-1.2,.02,g.z1-g.z0-1.2,0x6f7d8c,g.cx,.6,g.cz,houseStatic,true);
}

/* build one straight wall run with openings; axis 'x' => along x at fixed z; 'z' => along z at fixed x */
function run(g,axis,fixed,a0,a1,gaps,h,t,col,lintelFrom){
  var segs=[],cur=a0;gaps=(gaps||[]).slice().sort(function(p,q){return p[0]-q[0]});
  gaps.forEach(function(gp){if(gp[0]>cur)segs.push([cur,gp[0]]);cur=gp[1]});if(cur<a1)segs.push([cur,a1]);
  function put(s0,s1,y0,y1){var L=s1-s0,hh=y1-y0,c=(s0+s1)/2;if(axis==='x')box(L,hh,t,col,c,y0+hh/2,fixed,g);else box(t,hh,L,col,fixed,y0+hh/2,c,g)}
  segs.forEach(function(s){put(s[0],s[1],0,h)});
  gaps.forEach(function(gp){var lf=gp[2]||lintelFrom||h-1.1;if(lf<h)put(gp[0],gp[1],lf,h)});
}
/* window: axis 'x' wall (faces +/-z by dir) or 'z' wall (faces +/-x) */
function addWin(g,axis,fixed,pos,y,w,h,dir){
  var wg=new T.Group();
  box(w,h,.7,winMat,0,0,0,wg,true);
  box(w+.5,.25,.84,TRIM,0,h/2+.1,0,wg,true);box(w+.5,.25,.84,TRIM,0,-h/2-.1,0,wg,true);
  box(.25,h,.84,TRIM,-w/2-.12,0,0,wg,true);box(.25,h,.84,TRIM,w/2+.12,0,0,wg,true);
  if(w>2.5)box(.1,h,.78,TRIM,0,0,0,wg,true);if(h>2.6)box(w,.1,.78,TRIM,0,h*.18,0,wg,true);
  box(w+.9,.2,.6,TRIM,0,-h/2-.3,.5,wg,true);
  if(axis==='x'){wg.position.set(pos,y,fixed);wg.rotation.y=dir>0?0:PI}else{wg.position.set(fixed,y,pos);wg.rotation.y=dir>0?PI/2:-PI/2}
  g.add(wg);
}
function extWall(name,nx,nz){var g=new T.Group();g.userData={nx:nx,nz:nz,s:1};extWalls[name]=g;scene.add(g);return g}

function buildShell(){
  var T6=.6,Hh=EXTH;
  /* back wall (z=-13) */
  var b=extWall('back',0,-1);run(b,'x',-13,-22.3,22.3,[],BH,T6,WALLC);
  box(44.8,.3,.9,TRIM,0,BH+.05,-13,b);addWin(b,'x',-13,0,7.3,38,1.0,-1);
  addWin(b,'x',-13,-16,3.6,5,3.4,-1);addWin(b,'x',-13,-5,3.4,6.4,3.6,-1);addWin(b,'x',-13,5.5,3.4,5.2,3.4,-1);addWin(b,'x',-13,16.8,4,3,2,-1);
  /* left wall (x=-22) */
  var l=extWall('left',-1,0);run(l,'z',-22,-12.7,12.7,[],Hh,T6,WALLC);
  box(.9,.3,25.4,TRIM,-22,Hh+.05,0,l);
  addWin(l,'z',-22,-6.5,3.6,6,3.4,-1);addWin(l,'z',-22,3.2,4.4,3.4,1.6,-1);addWin(l,'z',-22,10.4,3.8,3.4,2.2,-1);
  /* front wall (z=13): garage door gap + front door gap */
  var f=extWall('front',0,1);run(f,'x',13,-22.3,22.3,[[-19.6,-12.4,5.3],[6.9,9.5,3.8]],Hh,T6,WALLC);
  box(44.8,.3,.9,TRIM,0,Hh+.05,13,f);
  addWin(f,'x',13,-5,3.4,6.4,3.4,1);addWin(f,'x',13,14.6,3.4,8.4,3.8,1);addWin(f,'x',13,2.6,3.4,3.2,3.4,1);
  /* garage door panel */
  var gd=new T.Group();box(7.2,5.0,.3,0xe9e3d6,0,0,0,gd);for(var i=0;i<5;i++)box(7.0,.08,.34,0xcfc6b3,0,-2.0+i*1.0,0,gd,true);box(7.6,.3,.5,TRIM,0,2.6,0,gd,true);gd.position.set(-16,2.5,13);f.add(gd);
  /* front door */
  var fd=new T.Group();box(2.8,.3,.7,TRIM,0,3.45,0,fd,true);box(.3,3.5,.7,TRIM,-1.35,1.7,0,fd,true);box(.3,3.5,.7,TRIM,1.35,1.7,0,fd,true);
  var leaf=box(2.3,3.2,.2,0xb9703f,0,1.6,0,fd);box(.9,1.5,.25,winMat,-.4,2.2,.02,fd,true);box(.15,.5,.3,0xf0cf80,.8,1.6,.14,fd,true);fd.position.set(8.2,0,13);f.add(fd);
  /* wood cladding strip beside front door */
  for(var k=0;k<9;k++)box(.32,5.4,.2,k%2?0xc98f5a:0xb97f4c,10.6+k*.45,2.7,13.3,f,true);
  for(var k2=0;k2<6;k2++)box(.32,5.4,.2,k2%2?0xc98f5a:0xb97f4c,3.9-k2*.45,2.7,13.3,f,true);
  /* right wall (x=22) with sliding door gap */
  var r=extWall('right',1,0);run(r,'z',22,-12.7,12.7,[[3.4,9.6,4.9]],Hh,T6,WALLC);
  box(.9,.3,25.4,TRIM,22,Hh+.05,0,r);
  addWin(r,'z',22,-6.5,4,3.4,2.0,1);
  /* sliding glass door */
  box(.2,4.8,3.0,winMat,22,2.4,4.9,r,true);box(.2,4.8,3.0,winMat,22.12,2.4,8.1,r,true);
  box(.4,.25,6.4,TRIM,22,0.12,6.5,r,true);box(.4,.3,6.4,TRIM,22,4.9,6.5,r,true);box(.4,4.8,.2,TRIM,22,2.4,6.5,r,true);
  [[l,-21.7],[r,22.3]].forEach(function(a){var sh=new T.Shape();sh.moveTo(-12.7,0);sh.lineTo(12.7,0);sh.lineTo(12.7,.15);sh.lineTo(-12.7,2.1);sh.lineTo(-12.7,0);
    var geo=new T.ExtrudeGeometry(sh,{depth:.6,bevelEnabled:false}),m=new T.Mesh(geo,M(WALLC));m.rotation.y=-PI/2;m.position.set(a[1],Hh,0);m.castShadow=true;m.receiveShadow=true;a[0].add(m)});
  Object.keys(extWalls).forEach(function(k){var g=extWalls[k];mergeStatic(g);g.position.y=.5});
}
/* interior partitions */
function buildPartitions(){
  var g=houseStatic,t=.34;
  function seg(axis,fixed,a0,a1,gaps){var gg=new T.Group();run(gg,axis,fixed,a0,a1,gaps,INH,t,WALLC,INH);
    /* wooden cap */
    var cur=a0;(gaps||[]).slice().sort(function(p,q){return p[0]-q[0]}).concat([[a1,a1]]).forEach(function(gp){if(gp[0]>cur){var L=gp[0]-cur,c=(cur+gp[0])/2;if(axis==='x')box(L,.12,t+.12,0xb98a5c,c,INH+.06,fixed,gg,true);else box(t+.12,.12,L,0xb98a5c,fixed,INH+.06,c,gg,true)}cur=gp[1]});
    gg.position.y=.55;g.add(gg)}
  seg('z',-10,-13,0,[[-8,-5]]);seg('z',-10,0,13,[[5,8]]);
  seg('z',0,-13,0,[[-8,-5]]);seg('z',0,0,13,[[3,9]]);
  seg('z',11,-13,0,[[-8,-5]]);
  seg('x',0,-22,22,[[-17.5,-14.5],[-6.5,-3.5],[4,7],[15,18]]);
}
/* roof (mono-pitch, high at back) */
var roof=new T.Group(),roofMats=[],roofT=0,roofOpen=false;
function RM(c){var m=new T.MeshLambertMaterial({color:c,transparent:true,opacity:1});roofMats.push(m);return m}
function buildRoof(){
  var slab=box(49,.8,32.4,RM(0x4b4f62),0,0,0,roof);slab.rotation.x=.075;
  var f=box(49.4,.55,.6,RM(0xe9c9a0),0,-.1,16.3,roof,true);f.rotation.x=.075;f.position.y=-1.15;f.position.z=16.1;
  var fb=box(49.4,1.0,.6,RM(0xe9c9a0),0,.55,-16.1,roof,true);fb.position.y=1.15;fb.position.z=-16.1;
  /* solar panels */
  for(var i=0;i<6;i++)for(var j=0;j<2;j++){var p=box(5.6,.14,3.4,RM(0x2d4a7a),-16.5+i*6.6,0,-10+j*4.2,roof,true);p.rotation.x=.075;p.position.y=.5-(-10+j*4.2)*.075+.0;p.position.y=.46+(-(-10+j*4.2))*.075}
  /* skylight strip */
  var sk=box(10,.12,3,winMat,3,0,6,roof,true);sk.rotation.x=.075;sk.position.y=.46-6*.075;
  box(1.1,1.4,1.1,RM(0xe9c9a0),-19,1.4,-8,roof,true);
  roof.position.set(0,.5+EXTH+1.55,0);scene.add(roof);
}
rooms_floor();buildShell();buildPartitions();buildRoof();

/* glow decals (warm light pools at night) */
(function(){
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d'),g=x.createRadialGradient(64,64,4,64,64,64);
  g.addColorStop(0,'rgba(255,214,140,.95)');g.addColorStop(.55,'rgba(255,190,110,.4)');g.addColorStop(1,'rgba(255,170,90,0)');x.fillStyle=g;x.fillRect(0,0,128,128);
  var tex=new T.CanvasTexture(c);
  ['work','apps','growth','income','life','gym','bath'].forEach(function(k){var r=room(k);
    var m=new T.Mesh(new T.PlaneGeometry((r.x1-r.x0)*1.1,(r.z1-r.z0)*1.1),new T.MeshBasicMaterial({map:tex,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));
    m.rotation.x=-PI/2;m.position.set(r.cx,.7,r.cz);m.renderOrder=2;scene.add(m);glowDecals.push(m)});
})();
