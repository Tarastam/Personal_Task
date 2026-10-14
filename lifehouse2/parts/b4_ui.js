
/* ================= state + helpers ================= */
var st={sel:null,filter:'all'};
var tv={open:false,tab:'quests',proj:null,form:null,qf:'all',pick:null,newRoom:'work'};
var toastT;function toast(m){var el=$('#toast');el.textContent=m;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('on')},2600)}
function itemById(id){return items.filter(function(i){return i.id===id})[0]}
function taskHTML(p,t){return '<label class="q'+(t.done?' done':'')+'"><input type="checkbox" data-t="'+p.id+'|'+t.id+'"'+(t.done?' checked':'')+'><span class="ck"></span><span class="tx">'+esc(t.text)+'</span><button type="button" class="qx" data-del="'+p.id+'|'+t.id+'" aria-label="ลบเควส">×</button></label>'}
function sortedTasks(p){return (p.tasks||[]).filter(function(t){return !t.done}).concat((p.tasks||[]).filter(function(t){return t.done}))}
function nextQuest(p){var t=(p.tasks||[]).filter(function(x){return !x.done})[0];return t?t.text:null}

/* ================= chips + card ================= */
function renderChips(){
  var h='<button class="chip" aria-pressed="'+(st.filter==='all')+'" data-f="all"><i style="--c:#2e2638"></i>ทั้งบ้าน</button>';
  ROOMS.forEach(function(r){h+='<button class="chip" aria-pressed="'+(st.filter===r.k)+'" data-f="'+r.k+'"><i style="--c:'+r.css+'"></i>'+r.n+'</button>'});
  $('#chips').innerHTML=h;
}
$('#chips').addEventListener('click',function(e){var b=e.target.closest('[data-f]');if(!b)return;if(b.dataset.f==='all'){st.sel=null;flyHome()}else flyRoom(b.dataset.f);refreshSel()});
function cardHTML(it){
  var r=it.r,x='<button class="x" data-a="close" aria-label="ปิด"><svg class="i" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
  if(it.kind==='p'){
    var p=it.p,s=STATUS[p.status]||STATUS.active,pr=prog(p),nq=nextQuest(p),tn=(p.tasks||[]).length,td=(p.tasks||[]).filter(function(t){return t.done}).length;
    return x+'<div class="cap" style="color:'+r.css+'">'+r.n+' · '+r.en+'</div><h3>'+esc(p.name)+'</h3>'+
     '<div class="row"><span class="pill '+s.cls+'">'+s.n+'</span><div class="bar" style="--c:'+r.css+'"><i style="width:'+pr+'%"></i></div><b class="num">'+pr+'%</b></div>'+
     '<div class="next">'+(tn?(nq?'<b>เควสถัดไป</b> · '+esc(nq):'<b>ครบทุกเควสแล้ว</b> · เก่งมาก'):'ยังไม่มีเควสในโปรเจกต์นี้')+(tn?'<span class="num" style="float:right;color:var(--muted)">'+td+'/'+tn+'</span>':'')+'</div>'+
     '<div class="acts"><button class="btn pri" data-a="tv"><svg class="i" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>เปิดบนทีวี</button><button class="btn" data-a="close">ปิด</button></div>';
  }
  var rt=it.rt,rs=rstat(rt),ti=todayIdx(),d=rt.days[ti],has=d.plan&&d.plan.trim();
  return x+'<div class="cap" style="color:'+r.css+'">'+r.n+' · '+r.en+'</div><h3>'+esc(rt.name)+'</h3>'+
   '<div class="row"><span class="pill blue">สัปดาห์นี้ '+rs.done+'/'+rs.planned+' วัน</span><div class="bar" style="--c:'+r.css+'"><i style="width:'+rs.pct+'%"></i></div><b class="num">'+rs.pct+'%</b></div>'+
   '<div class="next"><b>วันนี้ ('+DAYS[ti]+')</b> · '+(has?esc(d.plan)+(d.done?' — ทำแล้ว':''):'วันพัก')+'</div>'+
   '<div class="acts">'+(has?'<button class="btn dark" data-a="today">'+(d.done?'ยกเลิกการติ๊กวันนี้':'ติ๊กว่าทำวันนี้แล้ว')+'</button>':'')+'<button class="btn pri" data-a="tv">ดูตารางบนทีวี</button></div>';
}
function refreshSel(){
  renderChips();
  var it=st.sel?itemById(st.sel):null;
  items.forEach(function(i){var on=i.id===st.sel;i.el.classList.toggle('sel',on);i.el.classList.toggle('dim',st.filter!=='all'&&i.r.k!==st.filter&&!on);
    i.el.querySelector('small').textContent=i.kind==='p'?prog(i.p)+'%':rstat(i.rt).done+'/'+rstat(i.rt).planned;i.el.querySelector('span').textContent=i.kind==='p'?i.p.name:i.rt.name});
  var c=$('#card');
  if(it){c.innerHTML=cardHTML(it);c.classList.add('on')}else{c.classList.remove('on')}
}
$('#card').addEventListener('click',function(e){
  var a=e.target.closest('[data-a]');if(!a)return;var k=a.dataset.a,it=st.sel?itemById(st.sel):null;
  if(k==='close'){st.sel=null;refreshSel()}
  else if(k==='tv'&&it){if(it.kind==='p')openTV('projects',it.id);else openTV('week')}
  else if(k==='today'&&it){var d=it.rt.days[todayIdx()];d.done=!d.done;save();toast(d.done?'ติ๊กแล้ว เก่งมาก':'ยกเลิกแล้ว');rebuild()}
});

/* ================= TV ================= */
var TABS=[['quests','กระดานเควส','M5 6h14M5 12h14M5 18h9'],['projects','โปรเจกต์','M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'],['week','ตารางสัปดาห์','M4 6h16v14H4zM4 10h16M8 3v4M16 3v4'],['trophies','ถ้วยรางวัล','M7 4h10v5a5 5 0 0 1-10 0ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 20h8'],['summary','สรุป','M5 20V10M12 20V4M19 20v-7']];
var saveCam=null;
function tvNavHTML(){
  var q=qstats(S.projects);
  return TABS.map(function(t){var sm=t[0]==='quests'?q.d+'/'+q.n:'';return '<button role="tab" data-nav="'+t[0]+'" aria-selected="'+(tv.tab===t[0])+'"><svg class="i" viewBox="0 0 24 24" style="font-size:17px"><path d="'+t[2]+'"/></svg>'+t[1]+(sm?' <small>'+sm+'</small>':'')+'</button>'}).join('');
}
function tvQuests(){
  var list=S.projects.filter(function(p){return tv.qf==='all'||p.dist===tv.qf}),q=qstats(list),pct=q.n?q.d/q.n*100:0;
  var sel=tv.pick&&list.some(function(p){return p.id===tv.pick})?tv.pick:(list[0]?list[0].id:'');
  var h='<h2>กระดานเควส</h2><p class="sub">ติ๊กเพื่อขีดฆ่าเควสที่ทำเสร็จ เมื่อครบทุกข้อ โปรเจกต์จะกลายเป็นถ้วยรางวัลบนชั้นในห้องรับแขก</p>';
  h+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px"><button class="tvb sm" data-a="qf" data-v="all" style="'+(tv.qf==='all'?'background:var(--ta);color:#241504;border-color:var(--ta)':'')+'">ทุกห้อง</button>'+
    PROJROOMS.map(function(r){return '<button class="tvb sm" data-a="qf" data-v="'+r.k+'" style="'+(tv.qf===r.k?'background:var(--ta);color:#241504;border-color:var(--ta)':'')+'">'+r.n+'</button>'}).join('')+'</div>';
  h+='<div class="board"><div class="bHead"><b>Quest Board</b><span>'+q.d+'/'+q.n+'</span></div><div class="bBar"><i style="width:'+pct+'%"></i></div>';
  h+='<form class="qAdd" id="qAdd" autocomplete="off"><select id="qProj" aria-label="โปรเจกต์">'+list.map(function(p){return '<option value="'+p.id+'"'+(p.id===sel?' selected':'')+'>'+esc(p.name)+'</option>'}).join('')+'</select><input type="text" id="qText" maxlength="60" placeholder="เขียนเควสใหม่..." aria-label="เควสใหม่"><button type="submit">เพิ่ม</button></form><div class="qCols">';
  PROJROOMS.forEach(function(r){list.filter(function(p){return p.dist===r.k}).forEach(function(p){var tn=(p.tasks||[]).length,td=(p.tasks||[]).filter(function(t){return t.done}).length;
    h+='<div class="qGroup" style="--c:'+r.css+'"><div class="qG"><i></i>'+esc(p.name)+'<small>'+td+'/'+tn+'</small></div>'+(tn?sortedTasks(p).map(function(t){return taskHTML(p,t)}).join(''):'<div class="none">ยังไม่มีเควส</div>')+'</div>'})});
  if(!list.length)h+='<div class="none">ห้องนี้ยังไม่มีโปรเจกต์</div>';
  return h+'</div></div>';
}
function tvProjects(){
  if(tv.form)return tvForm();
  var p=tv.proj?proj(tv.proj):null;
  if(p){
    var r=room(p.dist),s=STATUS[p.status]||STATUS.active,pr=prog(p),tn=(p.tasks||[]).length,td=(p.tasks||[]).filter(function(t){return t.done}).length;
    return '<button class="back" data-a="back"><svg class="i" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>โปรเจกต์ทั้งหมด</button><div class="cap" style="color:'+r.css+';filter:brightness(1.4)">'+r.n+' · '+r.en+'</div><h2>'+esc(p.name)+'</h2>'+
     '<div style="margin-top:8px"><span class="pill tvp '+s.cls+'">'+s.n+'</span></div><div class="big num">'+pr+'<small>%</small></div><div class="tvc" style="--c:'+r.css+';padding:0;border:0;background:none"><div class="bar" style="background:#2c3248;height:8px"><i style="width:'+pr+'%;background:'+r.css+'"></i></div></div>'+
     '<div class="kp" style="grid-template-columns:1fr 1fr;max-width:420px"><div><span class="kl">เควสที่สำเร็จ</span><b class="num">'+td+'/'+tn+'</b></div><div><span class="kl">ชั่วโมง / สัปดาห์</span><b class="num">'+p.hrs+'</b></div></div>'+
     '<div class="cap" style="margin-top:20px">เควสของโปรเจกต์นี้</div><div class="onTv" style="max-width:560px">'+(tn?sortedTasks(p).map(function(t){return taskHTML(p,t)}).join(''):'<div class="none" style="padding-left:0">ยังไม่มีเควส เพิ่มได้ที่แท็บกระดานเควส</div>')+'</div>'+
     '<div class="acts"><button class="tvb pri" data-a="edit">แก้ไขโปรเจกต์</button><button class="tvb" data-a="gonow" data-v="'+p.id+'">ให้ Amorn ไปทำ</button></div>';
  }
  var h='<div style="display:flex;align-items:center;gap:10px"><div><h2>โปรเจกต์</h2><p class="sub">แต่ละโปรเจกต์คือของหนึ่งชิ้นในบ้าน ความคืบหน้ามาจากเควสที่ขีดฆ่าแล้ว</p></div><span class="sp" style="flex:1"></span><button class="tvb pri" data-a="newproj">+ เพิ่มโปรเจกต์</button></div>';
  PROJROOMS.forEach(function(r){var ps=S.projects.filter(function(p){return p.dist===r.k});if(!ps.length)return;
    h+='<div class="grp" style="--c:'+r.css+'"><div class="cap"><i></i>'+r.n+' · '+r.en+'</div><div class="grid">'+ps.map(function(p){var q=qstats([p]);
      return '<button class="tvc" style="--c:'+r.css+'" data-open="'+p.id+'"><div class="r"><span class="sw"></span><b>'+esc(p.name)+'</b></div><div class="r" style="margin-top:6px"><span class="pill tvp '+(STATUS[p.status]||STATUS.active).cls+'">'+(STATUS[p.status]||STATUS.active).n+'</span><small>เควส '+q.d+'/'+q.n+' · '+prog(p)+'%</small></div><div class="bar"><i style="width:'+prog(p)+'%;background:'+r.css+'"></i></div></button>'}).join('')+'</div></div>'});
  return h;
}
function tvForm(){
  var p=tv.form==='edit'?proj(tv.proj):null,v=p||{name:'',dist:tv.newRoom,status:'planning',prog:0,hrs:1,tasks:[]};
  var opt=function(list,sel){return list.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===sel?' selected':'')+'>'+o[1]+'</option>'}).join('')};
  var hasT=v.tasks&&v.tasks.length;
  return '<button class="back" data-a="cancel"><svg class="i" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>ย้อนกลับ</button><h2>'+(p?'แก้ไขโปรเจกต์':'เพิ่มโปรเจกต์ใหม่')+'</h2>'+
   '<form class="frm" id="frm" autocomplete="off"><label>ชื่อโปรเจกต์<input type="text" id="fName" maxlength="40" required value="'+esc(v.name)+'"></label>'+
   '<div class="two"><label>ห้อง<select id="fDist">'+opt(PROJROOMS.map(function(d){return [d.k,d.n]}),v.dist)+'</select></label><label>สถานะ<select id="fStatus">'+opt(Object.keys(STATUS).map(function(k){return [k,STATUS[k].n]}),v.status)+'</select></label></div>'+
   (hasT?'<div class="sub">ความคืบหน้านับจากเควสที่ขีดฆ่าแล้ว ('+prog(v)+'%)</div>':'<label>ความคืบหน้า (ยังไม่มีเควส) <span id="fProgV" class="num">'+Math.round(v.prog)+'%</span><input type="range" id="fProg" min="0" max="100" step="5" value="'+v.prog+'"></label>')+
   '<label>ชั่วโมง / สัปดาห์<input type="number" id="fHrs" min="0" max="80" step="0.5" value="'+v.hrs+'"></label>'+
   '<div class="acts" style="margin-top:2px"><button type="submit" class="tvb pri">บันทึก</button><button type="button" class="tvb" data-a="cancel">ยกเลิก</button>'+(p?'<button type="button" class="tvb danger" data-a="delproj">ลบโปรเจกต์</button>':'')+'</div></form>';
}
function tvWeek(){
  var ti=todayIdx(),h='<h2>ตารางสัปดาห์</h2><p class="sub">พิมพ์แผนของแต่ละวัน แล้วกดติ๊กเมื่อทำเสร็จ ทุกวันจันทร์ระบบจะเคลียร์ช่องติ๊กให้เริ่มสัปดาห์ใหม่ (แผนยังอยู่)</p>';
  S.routines.forEach(function(rt){var r=room(rt.id),rs=rstat(rt);
    h+='<section class="rt" style="--c:'+r.css+'"><div class="h"><b>'+esc(r.n)+' · '+esc(rt.name)+'</b><span class="pc num">'+rs.done+'/'+rs.planned+' วัน · '+rs.pct+'%</span></div><div class="bar"><i style="width:'+rs.pct+'%;background:'+r.css+'"></i></div><div class="days">';
    rt.days.forEach(function(d,i){var has=d.plan&&d.plan.trim();
      h+='<div class="dy'+(i===ti?' today':'')+'"><div class="dn"><span>'+DAYS[i]+'</span>'+(i===ti?'<span>วันนี้</span>':'')+'</div><input type="text" maxlength="24" data-plan="'+rt.id+'|'+i+'" value="'+esc(d.plan||'')+'" placeholder="พัก" aria-label="แผนวัน'+DAYS[i]+'"><button type="button" class="tg'+(d.done?' done':'')+'" data-day="'+rt.id+'|'+i+'"'+(has?'':' disabled')+'>'+(d.done?'ทำแล้ว':(has?'ติ๊ก':'พัก'))+'</button></div>'});
    h+='</div></section>'});
  return h;
}
function medal(ok){var c=ok?'#f5b82e':'#4a4d60',c2=ok?'#fff0b8':'#6a6d80';return '<svg viewBox="0 0 48 48"><path d="M16 3h6l3 12h-6zM32 3h-6l-3 12h6z" fill="'+(ok?'#d9534f':'#3c3f50')+'"/><circle cx="24" cy="30" r="14" fill="'+c+'"/><circle cx="24" cy="30" r="9" fill="'+c2+'"/>'+(ok?'<path d="M19 30l4 4 7-8" stroke="#8a5a00" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>':'')+'</svg>'}
function cup(c){return '<svg viewBox="0 0 48 48"><path d="M14 6h20v12a10 10 0 0 1-20 0z" fill="#f5b82e"/><path d="M14 9H7v3a7 7 0 0 0 7 7M34 9h7v3a7 7 0 0 1-7 7" stroke="#e0a020" stroke-width="3" fill="none"/><rect x="21" y="27" width="6" height="8" fill="#e0a020"/><rect x="14" y="35" width="20" height="6" rx="2" fill="'+c+'"/></svg>'}
function tvTrophies(){
  var dp=S.projects.filter(function(p){return p.status==='done'}),bl=badgeList(),got=bl.filter(function(b){return b.ok}).length;
  var h='<h2>ถ้วยรางวัลและป้ายความสำเร็จ</h2><p class="sub">โปรเจกต์ที่ปิดงานได้จะกลายเป็นถ้วยบนชั้นโชว์ในห้องรับแขก ป้ายความสำเร็จเปิดให้เมื่อถึงเป้าหมายย่อย</p>';
  h+='<div class="grp"><div class="cap">ถ้วยรางวัล · '+dp.length+' ใบ</div><div class="tro">'+(dp.length?dp.map(function(p){return '<div>'+cup(room(p.dist).css)+'<b>'+esc(p.name)+'</b><small>'+room(p.dist).n+'</small></div>'}).join(''):'<div class="off"><b>ยังไม่มีถ้วย</b><small>ปิดเควสให้ครบทุกข้อของโปรเจกต์หนึ่ง</small></div>')+'</div></div>';
  h+='<div class="grp"><div class="cap">ป้ายความสำเร็จ · '+got+'/'+bl.length+'</div><div class="tro">'+bl.map(function(b){return '<div class="'+(b.ok?'':'off')+'">'+medal(b.ok)+'<b>'+b.n+'</b><small>'+b.d+'</small></div>'}).join('')+'</div></div>';
  return h;
}
function tvSummary(){
  var s=pstats(S.projects),q=qstats(S.projects),rsAll=S.routines.map(function(r){return rstat(r)}),pl=rsAll.reduce(function(a,r){return a+r.planned},0),dn=rsAll.reduce(function(a,r){return a+r.done},0);
  var h='<h2>สรุปภาพรวม</h2><p class="sub">ตัวเลขทั้งหมดเป็นข้อมูลตัวอย่าง แก้ไขได้ทุกอย่าง</p><div class="kp">'+
   '<div><span class="kl">โปรเจกต์ทั้งหมด</span><b class="num">'+s.n+'</b><small>'+S.projects.filter(function(p){return p.status==='active'}).length+' กำลังทำ</small></div>'+
   '<div><span class="kl">เควสที่สำเร็จ</span><b class="num">'+q.d+'/'+q.n+'</b><small>ขีดฆ่าแล้ว</small></div>'+
   '<div><span class="kl">ความคืบหน้าเฉลี่ย</span><b class="num">'+Math.round(s.avg)+'%</b><small>ทุกโปรเจกต์</small></div>'+
   '<div><span class="kl">ชั่วโมง / สัปดาห์</span><b class="num">'+(Math.round(s.h*10)/10)+'</b><small>รวมทุกห้อง</small></div>'+
   '<div><span class="kl">ตารางสัปดาห์นี้</span><b class="num">'+dn+'/'+pl+'</b><small>ออกกำลังกาย สมาธิ ว่ายน้ำ</small></div></div>';
  h+='<div class="grp"><div class="cap">ความคืบหน้าแต่ละห้อง</div><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">';
  PROJROOMS.forEach(function(r){var ps=S.projects.filter(function(p){return p.dist===r.k}),a=pstats(ps),qq=qstats(ps);
    h+='<button class="tvc" style="--c:'+r.css+'" data-room="'+r.k+'"><div class="r"><span class="sw"></span><b>'+r.n+'</b><small>'+a.n+' โปรเจกต์ · เควส '+qq.d+'/'+qq.n+'</small></div><div class="bar"><i style="width:'+a.avg+'%;background:'+r.css+'"></i></div></button>'});
  S.routines.forEach(function(rt){var r=room(rt.id),a=rstat(rt);h+='<button class="tvc" style="--c:'+r.css+'" data-room="'+r.k+'"><div class="r"><span class="sw"></span><b>'+r.n+'</b><small>'+a.done+'/'+a.planned+' วัน</small></div><div class="bar"><i style="width:'+a.pct+'%;background:'+r.css+'"></i></div></button>'});
  return h+'</div></div><p class="sub" style="margin-top:20px">ข้อมูลเก็บไว้ในเบราว์เซอร์นี้เท่านั้น ใช้ปุ่มคัดลอก JSON มุมขวาบนเพื่อสำรองไว้</p>';
}
function renderTV(){
  var sc=$('#screen'),old=sc.querySelector('.tvMain'),top=old?old.scrollTop:0,fo=document.activeElement&&document.activeElement.id;
  var body=tv.tab==='quests'?tvQuests():tv.tab==='projects'?tvProjects():tv.tab==='week'?tvWeek():tv.tab==='trophies'?tvTrophies():tvSummary();
  sc.innerHTML='<div class="tvTop"><div class="ttl"><i></i>AMORN TV</div><span class="tt">'+$('#clkT').textContent+'</span><span class="sp"></span>'+
   '<button class="tvb" data-a="copy"><svg class="i" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg><span class="t">คัดลอก JSON</span></button>'+
   '<button class="tvb" data-a="reset"><svg class="i" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.6h4.6"/></svg><span class="t">รีเซ็ต</span></button>'+
   '<button class="tvb pri" data-a="tvclose" id="tvX"><svg class="i" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg><span class="t">ปิดทีวี</span></button></div>'+
   '<nav class="tvNav" role="tablist" aria-label="เมนูทีวี">'+tvNavHTML()+'</nav><main class="tvMain onTv">'+body+'</main>';
  var m=sc.querySelector('.tvMain');m.scrollTop=top;
  if(fo){var f=document.getElementById(fo);if(f&&f.focus)f.focus()}
}
function openTV(tab,projId){
  if(tab)tv.tab=tab;tv.form=null;if(projId){tv.proj=projId}else if(tab==='projects'&&!projId){tv.proj=null}
  if(!tv.open){tv.open=true;saveCam={gx:cs.gx,gz:cs.gz,gzoom:cs.gzoom,gaz:cs.gaz};
    if(!roofOpen)setRoof(true);
    cs.gx=11;cs.gz=1.4;cs.gzoom=3.6;cs.gaz=Math.round(cs.gaz/360)*360+45;st.sel=null;refreshSel();
    var show=function(){var el=$('#tv');renderTV();el.classList.add('on');el.setAttribute('aria-hidden','false');requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('show');var b=$('#tvX');if(b)b.focus({preventScroll:true})})})};
    if(reduced)show();else setTimeout(show,720);
  }else renderTV();
}
function closeTV(){
  if(!tv.open)return;tv.open=false;var el=$('#tv');el.classList.remove('show');el.setAttribute('aria-hidden','true');
  setTimeout(function(){el.classList.remove('on')},reduced?0:420);
  if(saveCam){cs.gx=saveCam.gx;cs.gz=saveCam.gz;cs.gzoom=saveCam.gzoom;cs.gaz=saveCam.gaz}
}
function afterData(delay){setTimeout(function(){rebuild();if(tv.open)renderTV()},reduced?0:delay||0)}
var tvEl=$('#tv');
tvEl.addEventListener('click',function(e){
  if(e.target===tvEl){closeTV();return}
  var n=e.target.closest('[data-nav]');if(n){tv.tab=n.dataset.nav;tv.form=null;if(tv.tab!=='projects')tv.proj=null;renderTV();return}
  var del=e.target.closest('[data-del]');
  if(del){e.preventDefault();e.stopPropagation();var ids=del.dataset.del.split('|'),p=proj(ids[0]);if(p){p.tasks=p.tasks.filter(function(t){return t.id!==ids[1]});save();afterData(0)}return}
  var op=e.target.closest('[data-open]');if(op){tv.proj=op.dataset.open;renderTV();return}
  var rm=e.target.closest('[data-room]');if(rm){var k=rm.dataset.room;if(room(k).routine){tv.tab='week'}else{tv.tab='quests';tv.qf=k}renderTV();return}
  var dy=e.target.closest('[data-day]');
  if(dy){var a=dy.dataset.day.split('|'),rt=rout(a[0]),d=rt&&rt.days[+a[1]];if(d&&d.plan&&d.plan.trim()){d.done=!d.done;save();if(d.done){toast('บันทึกแล้ว '+rt.name+' '+DAYS[+a[1]]);var it=itemById('r:'+rt.id);S.last='r:'+rt.id;if(it)sendAmorn(it)}afterData(0)}return}
  var b=e.target.closest('[data-a]');if(!b)return;var k2=b.dataset.a;
  if(k2==='tvclose')closeTV();
  else if(k2==='back'){tv.proj=null;renderTV()}
  else if(k2==='edit'){tv.form='edit';renderTV()}
  else if(k2==='newproj'){tv.form='new';tv.newRoom='work';renderTV()}
  else if(k2==='cancel'){tv.form=null;renderTV()}
  else if(k2==='qf'){tv.qf=b.dataset.v;renderTV()}
  else if(k2==='gonow'){var it2=itemById(b.dataset.v);if(it2){S.last=it2.id;sendAmorn(it2);toast('Amorn กำลังเดินไปทำโปรเจกต์นี้')}}
  else if(k2==='delproj'){S.projects=S.projects.filter(function(x){return x.id!==tv.proj});tv.proj=null;tv.form=null;save();afterData(0);toast('ลบแล้ว')}
  else if(k2==='copy'){var txt=JSON.stringify(S,null,1);try{navigator.clipboard.writeText(txt).then(function(){toast('คัดลอก JSON แล้ว')},function(){toast('เบราว์เซอร์ไม่อนุญาตให้คัดลอก')})}catch(err){toast('เบราว์เซอร์ไม่อนุญาตให้คัดลอก')}}
  else if(k2==='reset'){S=freshState();save();tv.proj=null;tv.form=null;tv.qf='all';afterData(0);toast('รีเซ็ตเป็นข้อมูลตัวอย่างแล้ว')}
});
tvEl.addEventListener('change',function(e){
  var c=e.target.closest('[data-t]');
  if(c){var ids=c.dataset.t.split('|'),p=proj(ids[0]);if(!p)return;var t=p.tasks.filter(function(x){return x.id===ids[1]})[0];if(!t)return;
    t.done=c.checked;c.closest('.q').classList.toggle('done',t.done);
    var all=p.tasks.every(function(x){return x.done});
    if(all&&p.status!=='done'){p.status='done';toast('โปรเจกต์สำเร็จ ได้ถ้วยรางวัลแล้ว: '+p.name)}
    else if(!all&&p.status==='done'){p.status='active'}
    else if(t.done)toast('เควสสำเร็จ');
    if(t.done){S.last=p.id;var it=itemById(p.id);if(it)sendAmorn(it)}
    save();afterData(420);return}
  var pl=e.target.closest('[data-plan]');
  if(pl){var a=pl.dataset.plan.split('|'),rt=rout(a[0]),d=rt&&rt.days[+a[1]];if(d){d.plan=pl.value.trim();if(!d.plan)d.done=false;save();afterData(0)}}
});
tvEl.addEventListener('submit',function(e){
  e.preventDefault();
  if(e.target.id==='qAdd'){var txt=$('#qText').value.trim(),pid=$('#qProj').value,p=proj(pid);if(!txt||!p)return;
    p.tasks=p.tasks||[];p.tasks.push(Q(txt));if(p.status==='done')p.status='active';tv.pick=pid;save();afterData(0);toast('เพิ่มเควสแล้ว');return}
  if(e.target.id==='frm'){
    var name=$('#fName').value.trim();if(!name)return;
    var vals={name:name,dist:$('#fDist').value,status:$('#fStatus').value,hrs:Math.max(0,+$('#fHrs').value||0)};
    var pe=$('#fProg');if(pe)vals.prog=+pe.value;
    var p2=tv.form==='edit'?proj(tv.proj):null;
    if(p2){Object.assign(p2,vals)}else{if(S.projects.filter(function(x){return x.dist===vals.dist}).length>=6){toast('ห้องนี้เต็มแล้ว (สูงสุด 6 โปรเจกต์)');return}p2=Object.assign({id:'p'+Date.now(),tasks:[],prog:vals.prog||0},vals);S.projects.push(p2);tv.proj=p2.id}
    if(p2.status==='done'&&!(p2.tasks||[]).length)p2.prog=100;
    save();tv.form=null;afterData(0);toast('บันทึกแล้ว')}
});
tvEl.addEventListener('input',function(e){if(e.target.id==='fProg')$('#fProgV').textContent=e.target.value+'%'});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(tv.open)closeTV();else if(st.sel){st.sel=null;refreshSel()}}});

/* ================= top buttons ================= */
function setRoof(open){
  roofOpen=open;$('#bRoof').setAttribute('aria-pressed',open);$('#roofT').textContent=open?'ปิดหลังคา':'เปิดหลังคา';
  if(!open){st.sel=null;refreshSel()}
  showHint(open?'คลิกของในบ้านเพื่อดูโปรเจกต์ หรือคลิกทีวีเพื่อเปิดแดชบอร์ด':'คลิกบ้านหรือกด “เปิดหลังคา” เพื่อดูห้องข้างใน');
}
var hintT;function showHint(m){var h=$('#hint');h.textContent=m;h.classList.add('on');clearTimeout(hintT);hintT=setTimeout(function(){h.classList.remove('on')},4200)}
$('#bRoof').onclick=function(){setRoof(!roofOpen)};
$('#bTv').onclick=function(){openTV()};
$('#bClock').onclick=function(){var tb=$('#timebar');tb.classList.toggle('on');if(tb.classList.contains('on')){$('#tbR').value=curH();$('#tbL').textContent=$('#clkT').textContent}};
$('#tbR').addEventListener('input',function(e){tOver=+e.target.value;applyTime();$('#tbL').textContent=$('#clkT').textContent});
$('#tbNow').onclick=function(){tOver=null;applyTime();$('#tbR').value=curH();$('#tbL').textContent=$('#clkT').textContent};

/* ================= camera ================= */
var cs={x:5,z:10,gx:5,gz:10,zoom:.86,gzoom:.86,az:45,gaz:45},EL=33*PI/180;
function updCam(dt){
  var k=1-Math.exp(-8*dt);cs.x+=(cs.gx-cs.x)*k;cs.z+=(cs.gz-cs.z)*k;cs.zoom+=(cs.gzoom-cs.zoom)*k;cs.az+=(cs.gaz-cs.az)*k;
  var a=cs.az*PI/180,D=400;
  cam.position.set(cs.x+Math.sin(a)*Math.cos(EL)*D,Math.sin(EL)*D,cs.z+Math.cos(a)*Math.cos(EL)*D);cam.lookAt(cs.x,0,cs.z);
  var W=window.innerWidth,Hh=window.innerHeight,asp=W/Hh,vh=45/cs.zoom,vw=vh*asp;
  if(vw<58/cs.zoom){vw=58/cs.zoom;vh=vw/asp}
  cam.left=-vw/2;cam.right=vw/2;cam.top=vh/2;cam.bottom=-vh/2;cam.updateProjectionMatrix();
  var ss=clamp(70/Math.max(cs.zoom,1),30,72);sc.left=-ss;sc.right=ss;sc.top=ss;sc.bottom=-ss;sc.updateProjectionMatrix();
  var d=sun.userData.dir||[40,70,30];sun.position.set(cs.x+d[0],d[1],cs.z+d[2]);sun.target.position.set(cs.x,0,cs.z);
}
function resize(){renderer.setSize(window.innerWidth,window.innerHeight,false)}
window.addEventListener('resize',resize);resize();
function flyHome(){cs.gx=5;cs.gz=10;cs.gzoom=window.innerWidth<900?1.0:.86;st.filter='all'}
function flyRoom(k){var r=room(k);st.filter=k;st.sel=null;cs.gx=r.cx;cs.gz=r.cz;cs.gzoom=r.k==='pool'?1.6:r.k==='garden'?1.1:2.0;if(!r.outdoor&&!roofOpen)setRoof(true)}
function select(id,fly){
  if(id==='__tv'){openTV();return}
  if(id==='__trophy'){openTV('trophies');return}
  if(id==='__amorn'){toast('Amorn · '+amorn.text);return}
  if(id==='__dog'){toast('บอร์เดอร์คอลลี่ · โฮ่ง!');dog.followT=.01;return}
  var it=itemById(id);if(!it)return;
  if(!it.r.outdoor&&!roofOpen)setRoof(true);
  st.sel=id;st.filter=it.r.k;S.last=id;save();sendAmorn(it);
  if(fly){cs.gx=it.x;cs.gz=it.z;cs.gzoom=Math.max(cs.gzoom,2.3)}
  refreshSel();
}
flyHome();cs.x=cs.gx;cs.z=cs.gz;cs.zoom=cs.gzoom;

var ptrs={},drag=null,pinch=0;
canvas.addEventListener('pointerdown',function(e){canvas.setPointerCapture(e.pointerId);ptrs[e.pointerId]={x:e.clientX,y:e.clientY};
  if(Object.keys(ptrs).length===1){drag={moved:0};canvas.classList.add('drag')}
  if(Object.keys(ptrs).length===2){var p=Object.values(ptrs);pinch=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);drag=null}});
canvas.addEventListener('pointermove',function(e){
  if(!ptrs[e.pointerId]){hoverAt(e.clientX,e.clientY);return}
  var prev=ptrs[e.pointerId];ptrs[e.pointerId]={x:e.clientX,y:e.clientY};
  if(Object.keys(ptrs).length===2){var p=Object.values(ptrs),dd=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(pinch)cs.gzoom=clamp(cs.gzoom*dd/pinch,.5,4);pinch=dd;return}
  if(!drag)return;
  var dx=e.clientX-prev.x,dy=e.clientY-prev.y;drag.moved+=Math.abs(dx)+Math.abs(dy);
  var s=(cam.top-cam.bottom)/window.innerHeight,a=cs.az*PI/180;
  cs.gx-=Math.cos(a)*dx*s;cs.gz+=Math.sin(a)*dx*s;cs.gx+=-Math.sin(a)*dy*s/Math.sin(EL);cs.gz+=-Math.cos(a)*dy*s/Math.sin(EL);
  cs.gx=clamp(cs.gx,-40,50);cs.gz=clamp(cs.gz,-26,42)});
var rc=new T.Raycaster(),v2=new T.Vector2();
function pickAt(px,py){v2.set(px/window.innerWidth*2-1,-(py/window.innerHeight)*2+1);rc.setFromCamera(v2,cam);
  var hits=rc.intersectObjects(pickables,true);for(var i=0;i<hits.length;i++){var o=hits[i].object;while(o){if(o.userData&&o.userData.sel)return o.userData.sel;o=o.parent}}return null}
function hitHouse(px,py){v2.set(px/window.innerWidth*2-1,-(py/window.innerHeight)*2+1);rc.setFromCamera(v2,cam);
  var tg=[roof];Object.keys(extWalls).forEach(function(k){tg.push(extWalls[k])});return rc.intersectObjects(tg,true).length>0}
function isIndoor(id){if(id==='__tv'||id==='__trophy'||id==='__amorn'&&nodeAt(amorn.x,amorn.z)!=='garden'&&nodeAt(amorn.x,amorn.z)!=='pool'||id==='__dog'&&nodeAt(dog.x,dog.z)!=='garden'&&nodeAt(dog.x,dog.z)!=='pool')return true;var it=itemById(id);return !!it&&!it.r.outdoor}
function endPtr(e){var was=drag;delete ptrs[e.pointerId];canvas.classList.remove('drag');if(Object.keys(ptrs).length<2)pinch=0;
  if(e.type==='pointerup'&&was&&was.moved<6){
    var id=pickAt(e.clientX,e.clientY);
    if(id&&!roofOpen&&isIndoor(id))id=null;
    if(id)select(id,true);
    else if(!roofOpen&&hitHouse(e.clientX,e.clientY))setRoof(true);
    else if(st.sel){st.sel=null;refreshSel()}
  }drag=null}
canvas.addEventListener('pointerup',endPtr);canvas.addEventListener('pointercancel',endPtr);
canvas.addEventListener('wheel',function(e){e.preventDefault();cs.gzoom=clamp(cs.gzoom*Math.exp(-e.deltaY*.0012),.5,4)},{passive:false});
var hovT=0;function hoverAt(x,y){var n=performance.now();if(n-hovT<80)return;hovT=n;var id=pickAt(x,y);if(id&&!roofOpen&&isIndoor(id))id=null;canvas.classList.toggle('hov',!!id||(!roofOpen&&hitHouse(x,y)))}
$('#zIn').onclick=function(){cs.gzoom=clamp(cs.gzoom*1.25,.5,4)};$('#zOut').onclick=function(){cs.gzoom=clamp(cs.gzoom/1.25,.5,4)};
$('#rL').onclick=function(){cs.gaz-=90};$('#rR').onclick=function(){cs.gaz+=90};
$('#zHome').onclick=function(){st.sel=null;flyHome();cs.gaz=Math.round(cs.gaz/360)*360+45;refreshSel()};

var vt=new T.Vector3();
function proj3(x,y,z){vt.set(x,y,z);vt.project(cam);return [(vt.x+1)/2*window.innerWidth,(1-vt.y)/2*window.innerHeight]}
function updLabels(){
  var inside=roofT>.85,thr=window.innerWidth>900?1.25:1.7,tvv=tv.open;
  ROOMS.forEach(function(r){var p=proj3(r.k==='pool'?r.cx:r.cx,.9,r.k==='pool'?r.z1-3.5:r.z1-1.4);r.el.style.transform='translate('+(p[0]|0)+'px,'+(p[1]|0)+'px) translate(-50%,-50%)';
    r.el.style.display=(!tvv&&cs.zoom<=2.7&&(window.innerWidth>900||cs.zoom>1.25)&&(r.outdoor||inside))?'block':'none'});
  items.forEach(function(it){var p=proj3(it.x,it.h+(it.r.k==='garden'?.8:.6)+(it.r.k==='pool'?-1.5:0)+(it.kind==='r'&&it.r.k==='pool'?0:0),it.z);it.el.style.transform='translate('+(p[0]|0)+'px,'+(p[1]|0)+'px) translate(-50%,-100%)';
    var vis=!tvv&&(it.r.outdoor||inside)&&(it.id===st.sel||(cs.zoom>thr&&(st.filter==='all'||it.r.k===st.filter)));it.el.style.display=vis?'flex':'none'});
  var am=$('#amLab'),ap=proj3(amorn.x,amorn.y+(amorn.mode==='sleep'?2.8:3.6),amorn.z),aIn=nodeAt(amorn.x,amorn.z),aOut=aIn==='garden'||aIn==='pool';
  am.style.transform='translate('+(ap[0]|0)+'px,'+(ap[1]|0)+'px) translate(-50%,-100%)';am.style.display=(!tvv&&(aOut||inside)&&cs.zoom>.7)?'flex':'none';
  var s=st.sel?itemById(st.sel):null;
  if(s){ring.visible=true;ring.position.set(s.x,baseY(s.r)+.15,s.z);var q=1+Math.sin(performance.now()/260)*.04;ring.scale.set(q,q,q)}else ring.visible=false;
}

/* ================= loop ================= */
var last=performance.now(),tmT=0,lastMin=-1;
var wallFacing=function(g){var a=cs.az*PI/180;return g.userData.nx*Math.sin(a)+g.userData.nz*Math.cos(a)>.25};
var roofShadow=true;
function frame(now){
  var dt=Math.min(.05,(now-last)/1000);last=now;clock+=dt;
  items.forEach(function(it){var g=it.g;if(g.scale.x<1){var t=clamp((clock-it.t0)/.5,0,1),e=1-Math.pow(1-t,3)+Math.sin(t*PI)*.12;g.scale.setScalar(Math.max(.001,t>=1?1:e))}});
  markers.forEach(function(m){m.o.position.y=m.base+Math.sin(clock*2+m.ph)*.15;if(m.st==='done'||m.st==='planning')m.o.rotation.y=clock*1.4;if(m.st==='active'){var s=1+.18*Math.sin(clock*3+m.ph);m.o.scale.setScalar(s)}});
  /* roof + walls */
  var rt=roofOpen?1:0;roofT+=clamp(rt-roofT,-1,1)*Math.min(1,dt*(reduced?60:2.6));if(Math.abs(rt-roofT)<.002)roofT=rt;
  var e=roofT*roofT*(3-2*roofT);roof.position.y=.5+EXTH+1.55+e*10;roof.visible=roofT<.995;
  var op=1-clamp((roofT-.12)/.6,0,1);roofMats.forEach(function(m){m.opacity=op});
  var sh=roofT<.2;if(sh!==roofShadow){roofShadow=sh;roof.traverse(function(o){if(o.isMesh)o.castShadow=sh})}
  Object.keys(extWalls).forEach(function(k){var g=extWalls[k],target=(roofOpen&&wallFacing(g))?.13:1;g.scale.y+=(target-g.scale.y)*Math.min(1,dt*7);g.userData.s=g.scale.y});
  /* time */
  tmT+=dt;if(tmT>(tOver===null?10:99)){tmT=0;if(tOver===null)applyTime()}
  if(tvTexNeeds){var mn=Math.floor(TM.h*60);if(mn!==lastMin){lastMin=mn;drawTV()}tvTexNeeds=0}
  poseAgents(dt);
  updCam(dt);updLabels();renderer.render(scene,cam);requestAnimationFrame(frame);
}
applyTime();
rebuild();refreshSel();
if(reduced){roofT=1;setRoof(true)}else{setTimeout(function(){if(!roofOpen)setRoof(true)},1700)}
sendAmorn(itemById(S.last)||items.filter(function(i){return i.kind==='p'&&i.p.status==='active'})[0]);
amorn.x=amorn.cur?amorn.cur.x:amorn.x;amorn.z=amorn.cur?amorn.cur.z:amorn.z;amorn.path=[];arrive(amorn);
window.__lh={renderer:renderer,trophyG:trophyG,scene:scene,st:st,tv:tv,get S(){return S},setTime:function(h){tOver=h;applyTime()},openTV:openTV,closeTV:closeTV,setRoof:setRoof,select:select,cs:cs,items:function(){return items},amorn:amorn,dog:dog,roofT:function(){return roofT}};
requestAnimationFrame(frame);
})();
</script>
