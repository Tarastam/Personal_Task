
/* ================= project + routine objects ================= */
var objs=new T.Group();scene.add(objs);
var items=[],markers=[],pickables=[],built=0,clock=0;
var ring=new T.Mesh(new T.RingGeometry(2.1,2.4,40),new T.MeshBasicMaterial({color:0x2e2638,transparent:true,opacity:.9,side:T.DoubleSide}));
ring.rotation.x=-PI/2;ring.position.y=.7;ring.visible=false;scene.add(ring);
var DESKS={deskMonitor:1,laptopDesk:1,tradingDesk:1,tableLaptop:1,barLaptop:1};
function baseY(r){return r.k==='garden'?0:(r.k==='pool'?.5:.55)}
function makeMarker(st,c,h){
  var m;
  if(st==='active'){m=new T.Mesh(new T.SphereGeometry(.3,14,10),GLOW(c,.85))}
  else if(st==='planning'){m=new T.Mesh(new T.ConeGeometry(.3,.6,4),GLOW(0xf5b82e,.5));m.rotation.x=PI}
  else if(st==='paused'){m=new T.Group();box(.22,.6,.22,0x8a94ad,-.2,0,0,m,true);box(.22,.6,.22,0x8a94ad,.2,0,0,m,true)}
  else{m=new T.Mesh(new T.OctahedronGeometry(.4),GLOW(0xf5b82e,.7));m.scale.y=1.4}
  m.position.y=h+1.1;return m;
}
function addItem(o){
  var r=o.room,g=new T.Group(),y=baseY(r);
  var h=PROPS[o.prop](g,o.status==='paused'?0x9aa3b8:r.c);mergeStatic(g);
  var pr=o.pct,gx=1.9,gz=.9;
  if(o.prop!=='poolHub'){
    box(.26,2.4,.26,0xece2d0,gx,1.8,gz,g,true);var fh=Math.max(.04,pr/100*2.36);box(.2,fh,.2,o.status==='paused'?0x9aa3b8:r.c,gx,.62+fh/2,gz,g,true);ball(.16,o.status==='done'?0xf5b82e:r.c,gx,3.1,gz,g);
  }else{
    var gp=new T.Group();box(.34,2.6,.34,0xece2d0,0,1.3,0,gp,true);var fh2=Math.max(.04,pr/100*2.56);box(.26,fh2,.26,r.c,0,.04+fh2/2,0,gp,true);ball(.22,r.c,0,2.8,0,gp);gp.position.set(-1.2,0,0);g.add(gp);
  }
  var mk=makeMarker(o.status,r.c,h);g.add(mk);markers.push({o:mk,base:mk.position.y,st:o.status,ph:items.length});
  var hs=o.hit||[3.6,h+1.2,3,0,0];
  var hit=new T.Mesh(G(hs[0],hs[1],hs[2]),new T.MeshBasicMaterial({visible:false}));hit.position.set(hs[3]||0,hs[1]/2,hs[4]||0);hit.userData.keep=true;g.add(hit);
  g.position.set(o.x,y,o.z);g.rotation.y=o.ry||0;g.userData.sel=o.id;objs.add(g);pickables.push(g);
  if(!reduced&&built===0)g.scale.setScalar(.001);
  var el=document.createElement('div');el.className='lab bLab';el.style.setProperty('--c',r.css);
  el.innerHTML='<i></i><span>'+esc(o.name)+'</span><small>'+esc(o.tag)+'</small>';
  $('#labels').appendChild(el);el.addEventListener('pointerdown',function(e){e.stopPropagation();select(o.id,true)});
  var it={id:o.id,kind:o.kind,p:o.p,rt:o.rt,r:r,g:g,x:o.x,z:o.z,ry:o.ry||0,prop:o.prop,h:h+2.2,el:el,t0:o.delay||0,tag:o.tag};
  items.push(it);return it;
}
function rebuild(){
  while(objs.children.length)objs.remove(objs.children[0]);
  items.forEach(function(it){it.el.remove()});items=[];markers=[];pickables=[tvPick,trophyPick,amorn.g,dog.g];
  var del=0;
  PROJROOMS.forEach(function(r){
    var list=S.projects.filter(function(p){return p.dist===r.k});
    list.forEach(function(p,i){var s=r.slots[i%r.slots.length];
      addItem({id:p.id,kind:'p',p:p,name:p.name,room:r,x:s[0],z:s[1],ry:s[2],prop:ROOMPROPS[r.k][i%6],status:p.status,pct:prog(p),tag:prog(p)+'%',delay:built===0?del*.12:0});del++});
  });
  S.routines.forEach(function(rt){
    var r=room(rt.id),st=rstat(rt),hit=rt.id==='pool'?[15,2.6,9.6,-0.2,-7.8]:(rt.id==='gym'?[4.2,3,3.4,0,0]:[3.4,2.4,3.4,0,0]);
    addItem({id:'r:'+rt.id,kind:'r',rt:rt,name:rt.name,room:r,x:r.hub[0],z:r.hub[1],ry:r.hub[2],prop:rt.id+'Hub',status:st.pct>=100?'done':'active',pct:st.pct,tag:st.done+'/'+st.planned,hit:hit,delay:built===0?del*.12:0});del++;
  });
  built++;rebuildTrophies();drawTV();
  if(typeof refreshSel==='function')refreshSel();
}
ROOMS.forEach(function(r){var el=document.createElement('div');el.className='lab dLab';el.style.setProperty('--c',r.css);el.textContent=r.n;$('#labels').appendChild(el);
  el.addEventListener('pointerdown',function(e){e.stopPropagation();flyRoom(r.k)});r.el=el});

/* ================= characters ================= */
var SKIN=0xf0c19a,HAIR=0x2b211d,SHIRT=0x3f9e8d,PANTS=0x35405e,SHOE=0x3a2c26;
function limb(w,l,c,x,y,z,p){var g=new T.Group();box(w,l,w*1.05,c,0,-l/2,0,g);g.position.set(x,y,z);p.add(g);return g}
function makeAmorn(){
  var g=new T.Group(),body=new T.Group();g.add(body);
  var lg=[limb(.36,1.05,PANTS,-.24,1.05,0,body),limb(.36,1.05,PANTS,.24,1.05,0,body)];
  lg.forEach(function(l){box(.4,.22,.62,SHOE,0,-1.0,.12,l,true)});
  box(.98,1.0,.6,SHIRT,0,1.58,0,body);box(.98,.12,.62,0x2d7f71,0,1.08,0,body,true);
  var ar=[limb(.3,1.0,SHIRT,-.65,2.0,0,body),limb(.3,1.0,SHIRT,.65,2.0,0,body)];ar.forEach(function(a){ball(.16,SKIN,0,-1.02,0,a)});
  box(.22,.2,.22,SKIN,0,2.15,0,body,true);
  var hd=new T.Group();hd.position.set(0,2.45,0);body.add(hd);ball(.36,SKIN,0,0,0,hd);box(.78,.2,.78,HAIR,0,.28,-.02,hd,true);box(.74,.34,.2,HAIR,0,.12,-.3,hd,true);
  box(.08,.1,.06,DARK,-.14,.02,.33,hd,true);box(.08,.1,.06,DARK,.14,.02,.33,hd,true);box(.2,.04,.04,0xb86e5c,0,-.14,.34,hd,true);
  g.scale.setScalar(1.1);
  var hit=new T.Mesh(G(1.6,3.2,1.6),new T.MeshBasicMaterial({visible:false}));hit.position.y=1.6;hit.userData.keep=true;g.add(hit);g.userData.sel='__amorn';
  g.rotation.order='YXZ';scene.add(g);
  return {g:g,body:body,lg:lg,ar:ar,hd:hd};
}
function makeDog(){
  var g=new T.Group(),body=new T.Group();g.add(body);
  var BK=0x23242c,WH=0xf7f4ee;
  box(1.5,.62,.62,BK,0,.78,0,body);box(.62,.64,.64,WH,.62,.72,0,body,true);box(.6,.5,.68,BK,-.6,.8,0,body,true);
  var hd=new T.Group();hd.position.set(1.0,1.05,0);body.add(hd);box(.56,.5,.5,BK,0,0,0,hd);box(.46,.3,.34,WH,.38,-.1,0,hd,true);box(.12,.1,.12,DARK,.62,-.02,0,hd,true);
  box(.06,.1,.06,0xffd45a,.2,.1,.15,hd,true);box(.06,.1,.06,0xffd45a,.2,.1,-.15,hd,true);box(.16,.34,.12,BK,-.02,.24,.26,hd,true).rotation.z=.4;box(.16,.34,.12,BK,-.02,.24,-.26,hd,true).rotation.z=.4;
  box(.08,.5,.3,WH,.12,.1,0,hd,true);
  var tail=new T.Group();tail.position.set(-.78,.9,0);body.add(tail);box(.8,.2,.22,BK,-.38,0,0,tail,true).rotation.z=-.25;box(.3,.22,.24,WH,-.8,-.1,0,tail,true);
  var legs=[];[[.5,.24],[.5,-.24],[-.5,.24],[-.5,-.24]].forEach(function(p){var l=new T.Group();l.position.set(p[0],.55,p[1]);body.add(l);box(.18,.55,.18,BK,0,-.27,0,l);box(.2,.16,.2,WH,0,-.5,.0,l,true);legs.push(l)});
  g.scale.setScalar(1.15);
  var hit=new T.Mesh(G(2.4,1.6,1.2),new T.MeshBasicMaterial({visible:false}));hit.position.y=.8;hit.userData.keep=true;g.add(hit);g.userData.sel='__dog';
  scene.add(g);
  return {g:g,body:body,hd:hd,tail:tail,legs:legs};
}
var amorn=makeAmorn(),dog=makeDog();

/* walking graph (doors + room centres) */
var NODES={gym:[-16,-6.5],office:[-5,-6.5],bed:[5.5,-6.5],bath:[16.5,-6.5],garage:[-16,6.5],kitchen:[-5,6.5],livA:[5.5,5.2],livB:[16.5,5.2],
 d_go:[-10,-6.5],d_ob:[0,-6.5],d_bb:[11,-6.5],d_gg:[-16,0],d_ok:[-5,0],d_bl:[5.5,0],d_tl:[16.5,0],d_gk:[-10,6.5],d_kl:[0,6.5],
 frontIn:[8.2,11.6],frontOut:[8.2,15.6],garden:[8.2,21],slideIn:[20.2,6.5],slideOut:[25,6.5],pool:[26.5,9.2]};
var EDGES=[['gym','d_go'],['d_go','office'],['office','d_ob'],['d_ob','bed'],['bed','d_bb'],['d_bb','bath'],['gym','d_gg'],['d_gg','garage'],['office','d_ok'],['d_ok','kitchen'],
 ['bed','d_bl'],['d_bl','livA'],['bath','d_tl'],['d_tl','livB'],['garage','d_gk'],['d_gk','kitchen'],['kitchen','d_kl'],['d_kl','livA'],['livA','livB'],['livA','frontIn'],['frontIn','frontOut'],['frontOut','garden'],
 ['livB','slideIn'],['slideIn','slideOut'],['slideOut','pool']];
var ADJ={};EDGES.forEach(function(e){(ADJ[e[0]]=ADJ[e[0]]||[]).push(e[1]);(ADJ[e[1]]=ADJ[e[1]]||[]).push(e[0])});
function nodeAt(x,z){
  if(x>22.3&&z>-6&&z<14.6)return 'pool';
  if(x<-22.3||x>22.3||z<-13.3||z>13.3)return 'garden';
  if(z<0){return x<-10?'gym':x<0?'office':x<11?'bed':'bath'}
  if(x<-10)return 'garage';if(x<0)return 'kitchen';return x<11?'livA':'livB';
}
function pathTo(from,to){
  if(from===to)return [to];var prev={},q=[from],seen={};seen[from]=1;
  while(q.length){var n=q.shift();if(n===to)break;(ADJ[n]||[]).forEach(function(m){if(!seen[m]){seen[m]=1;prev[m]=n;q.push(m)}})}
  var out=[],c=to;while(c){out.unshift(c);c=prev[c]}return out;
}
function yAt(x,z){if(x>=-22&&x<=22&&z>=-13&&z<=13)return .55;if(x>22&&z>-6&&z<14.6&&x<44.2)return .5;return 0}
function mkAgent(o,speed,x,z){o.x=x;o.z=z;o.y=yAt(x,z);o.h=0;o.ht=0;o.path=[];o.speed=speed;o.mode='idle';o.phase=0;o.rest=0;o.destV=0;return o}
mkAgent(amorn,4.8,-5,-4);mkAgent(dog,6.4,4,9);
amorn.text='';amorn.cur=null;amorn.idleT=0;dog.followV=-1;dog.t=0;
function setPath(a,x,z,node,face){
  var from=nodeAt(a.x,a.z),names=pathTo(from,node),pts=[];
  names.forEach(function(n,i){pts.push(NODES[n].slice())});
  /* skip first node if we're already past it toward the next */
  pts.push([x,z]);a.path=pts;a.face=face;a.arrived=false;
}
function angLerp(a,b,t){var d=((b-a+PI)%(PI*2)+PI*2)%(PI*2)-PI;return a+d*t}
function seatOf(it){var off=DESKS[it.prop]?1.5:2.1;return [it.x+Math.sin(it.ry)*off,it.z+Math.cos(it.ry)*off]}
function destFor(it){
  var r=it.r;
  if(it.kind==='r'){
    if(r.k==='pool')return {node:'pool',x:33,z:3,face:0,mode:'swim',text:'ว่ายน้ำ',it:it};
    if(r.k==='gym')return {node:'gym',x:it.x,z:it.z+1.6,face:0,mode:'gym',text:'ออกกำลังกาย',it:it};
    return {node:'bath',x:it.x,z:it.z+.2,face:0,mode:'med',text:'นั่งสมาธิ',it:it};
  }
  var s=seatOf(it);
  return {node:r.node,x:s[0],z:s[1],face:it.ry+PI,mode:DESKS[it.prop]?'sit':'stand',text:'กำลังทำ: '+it.p.name,it:it};
}
function sendAmorn(it){
  if(!it||sleepHour())return;var d=destFor(it);amorn.cur=d;amorn.destV++;amorn.idleT=0;
  setPath(amorn,d.x,d.z,d.node,d.face);amorn.mode='walk';amorn.sleepy=false;
}
function sleepHour(){var h=TM.h;return h>=23||h<6}
function goSleep(){
  var d={node:'bed',x:6.8,z:-6.2,face:PI,mode:'sleep',text:'หลับอยู่ Zzz'};amorn.cur=d;amorn.destV++;
  setPath(amorn,d.x,d.z,d.node,d.face);amorn.mode='walk';
}
function arrive(a){
  a.arrived=true;
  if(a===amorn){var d=a.cur;if(!d)return;a.mode=d.mode;a.ht=d.face;a.destV++;
    if(d.mode==='sleep'){a.sleepAnim=0}
  }else{a.mode=a.dogMode||'idle';a.rest=0}
}
function dogFollow(){
  var d=amorn.cur,x=amorn.x,z=amorn.z;
  if(amorn.mode==='sleep'||(d&&d.mode==='sleep')){dog.dogMode='sleep';setPath(dog,3.4,10.2,'livA',0);dog.mode='walk';return}
  var tx=(d?d.x:x)+1.9,tz=(d?d.z:z)+.9;
  var node=d?d.node:nodeAt(x,z);
  if(node==='pool'){tx=30;tz=11.4}
  /* keep dog inside the room it is following into */
  var rr=node==='garden'?null:null;
  dog.dogMode='lie';setPath(dog,tx,tz,node,0);dog.mode='walk';
}
function pickRoam(){
  var cand=items.filter(function(it){return it.kind==='p'&&it.p.status==='active'});
  var hr=TM.h;if(hr>=6&&hr<21)cand=cand.concat(items.filter(function(it){return it.kind==='r'}));
  if(!cand.length)cand=items;return cand[Math.floor(Math.random()*cand.length)];
}
var tmpV=new T.Vector3();
function poseAgents(dt){
  /* ---- Amorn ---- */
  var a=amorn,moving=a.mode==='walk';
  if(a.path.length){
    var p=a.path[0],dx=p[0]-a.x,dz=p[1]-a.z,d=Math.hypot(dx,dz),stp=a.speed*dt;
    if(d<=stp){a.x=p[0];a.z=p[1];a.path.shift();if(!a.path.length)arrive(a)}else{a.x+=dx/d*stp;a.z+=dz/d*stp;a.ht=Math.atan2(dx,dz)}
  }
  var swim=a.mode==='swim',sleep=a.mode==='sleep';
  if(swim){ /* laps */
    a.swimT=(a.swimT||0)+dt;var ph=(a.swimT*3.4)%24,dir=ph<12?1:-1;a.x=27+(dir>0?ph:24-ph);a.z=2.4+Math.sin(a.swimT*.9)*.4;a.ht=dir>0?PI/2:-PI/2;
  }
  if(sleep){a.x=6.8;a.z=-9.3;a.ht=0}
  a.h=angLerp(a.h,a.ht,1-Math.exp(-(swim?30:11)*dt));
  var ty=swim?.98:(sleep?2.18:yAt(a.x,a.z));a.y+=(ty-a.y)*(1-Math.exp(-12*dt));
  a.phase+=dt*(moving?9:0);var s=Math.sin(a.phase)*.75,bob=moving?Math.abs(Math.sin(a.phase))*.08:0;
  var g=a.g,b=a.body;
  g.position.set(a.x,a.y,a.z);g.rotation.y=a.h;
  var rx=0,ly=0,legX=[s,-s],armX=[-s,s],armZ=[0,0],bodyY=0,hdX=0;
  if(moving){}
  else if(a.mode==='sit'){legX=[-PI/2+.1,-PI/2+.1];armX=[-1.0+Math.sin(clock*11)*.07,-1.0+Math.sin(clock*11+2)*.07];hdX=Math.sin(clock*1.3)*.06;bodyY=0}
  else if(a.mode==='gym'){legX=[0,0];var c2=Math.sin(clock*3.2);armX=[-.4-.9*Math.max(0,c2),-.4-.9*Math.max(0,-c2)];bodyY=-Math.abs(Math.sin(clock*1.6))*.1}
  else if(a.mode==='med'){legX=[-PI/2,-PI/2];armX=[-.5,-.5];armZ=[.45,-.45];bodyY=-.95;hdX=.1;legX=[-PI/2+.2,-PI/2+.2]}
  else if(a.mode==='swim'){legX=[Math.sin(clock*12)*.5,-Math.sin(clock*12)*.5];armX=[Math.sin(clock*5)*2.2+PI,Math.sin(clock*5+PI)*2.2+PI];rx=PI/2;bodyY=0}
  else if(a.mode==='sleep'){legX=[0,0];armX=[0,0];rx=-PI/2}
  else if(a.mode==='stand'){var c3=Math.sin(clock*2.4);armX=[-.5+c3*.3,-.5-c3*.3];hdX=Math.sin(clock*1.1)*.08;legX=[0,0]}
  else{legX=[0,0];armX=[Math.sin(clock*1.2)*.05,-Math.sin(clock*1.2)*.05];hdX=Math.sin(clock*.8)*.05}
  g.rotation.x=rx;
  b.position.y=bodyY+bob;
  a.lg[0].rotation.x=legX[0];a.lg[1].rotation.x=legX[1];a.ar[0].rotation.x=armX[0];a.ar[1].rotation.x=armX[1];a.ar[0].rotation.z=armZ[0];a.ar[1].rotation.z=armZ[1];a.hd.rotation.x=hdX;
  /* ---- dog ---- */
  var o=dog,om=o.mode==='walk';
  if(o.path.length){var q=o.path[0],ex=q[0]-o.x,ez=q[1]-o.z,ed=Math.hypot(ex,ez),es=o.speed*dt;
    if(ed<=es){o.x=q[0];o.z=q[1];o.path.shift();if(!o.path.length)arrive(o)}else{o.x+=ex/ed*es;o.z+=ez/ed*es;o.ht=Math.atan2(ex,ez)}}
  o.h=angLerp(o.h,o.ht,1-Math.exp(-12*dt));
  o.y+=(((o.mode==='sleep')?.45+(yAt(o.x,o.z)):yAt(o.x,o.z))-o.y)*(1-Math.exp(-10*dt));
  o.phase+=dt*(om?15:0);var ds=Math.sin(o.phase)*.7;
  o.g.position.set(o.x,o.y-(o.mode==='sleep'?.4:0),o.z);o.g.rotation.y=o.h+PI/2*0;
  /* dog model faces +x locally: rotate so its forward (+x) follows heading (+z) */
  o.g.rotation.y=o.h-PI/2;
  var lie=(o.mode==='lie'||o.mode==='sleep'||o.mode==='idle'&&o.rest>3);
  if(o.mode==='idle'||o.mode==='lie'||o.mode==='sleep')o.rest+=dt;
  o.legs.forEach(function(l,i){l.rotation.z=om?(i%2?ds:-ds)*(i<2?1:-1):0;l.visible=!(o.mode==='sleep'||o.mode==='lie')});
  o.body.position.y=o.mode==='sleep'||o.mode==='lie'?-.42:(om?Math.abs(Math.sin(o.phase))*.07:0);
  o.hd.rotation.z=o.mode==='sleep'?-.9:(o.mode==='lie'?-.1+Math.sin(clock*1.2)*.04:(om?Math.sin(o.phase*.5)*.1:Math.sin(clock*1.5)*.1));
  o.tail.rotation.y=(o.mode==='sleep')?0:Math.sin(clock*(om?9:6))*(om?.5:.7);
  /* dog follows Amorn */
  if(o.followV!==amorn.destV&&a.mode!=='walk'){o.followV=amorn.destV;o.followT=1.0+Math.random()*1.0}
  if(o.followT>0){o.followT-=dt;if(o.followT<=0)dogFollow()}
  /* Amorn autonomous behaviour */
  a.idleT+=dt;
  if(sleepHour()){ if(a.mode!=='sleep'&&!(a.cur&&a.cur.mode==='sleep'))goSleep() }
  else if(a.mode==='sleep'){ a.mode='idle';a.ar[0].rotation.x=0;sendAmorn(items.filter(function(i){return S.last===i.id})[0]||pickRoam()) }
  else if(a.mode!=='walk'&&a.idleT>(reduced?9999:26)){sendAmorn(pickRoam());}
  /* label */
  var txt=a.mode==='walk'?(a.cur&&a.cur.it?'เดินไป '+a.cur.it.r.n:'กำลังเดินไปนอน'):(a.cur?a.cur.text:'');
  if(txt!==a.text){a.text=txt;$('#amLab span').textContent='Amorn · '+txt}
}
(function(){var el=document.createElement('div');el.id='amLab';el.className='lab amLab';el.innerHTML='<i></i><span>Amorn</span>';$('#labels').appendChild(el)})();
