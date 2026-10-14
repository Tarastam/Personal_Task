const { chromium } = require('playwright-core');
const fs=require('fs');
const vp=process.argv[2]||'desk';
const steps=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const three=fs.readFileSync(require('path').join(__dirname,'node_modules/three/build/three.min.js'),'utf8');
  const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
  const [w,h]=vp==='phone'?[400,820]:[1440,860];
  const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
  const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push('PE '+e.stack));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_FAILED'))errs.push('CE '+m.text());if(m.type()==='log')console.log('LOG',m.text())});
  await p.route('**/*',r=>{const u=r.request().url();
    if(u.includes('three.min.js'))return r.fulfill({body:three,contentType:'application/javascript'});
    if(u==='https://test.local/')return r.fulfill({body:'<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="margin:0">'+html,contentType:'text/html'});
    return r.abort()});
  await p.goto('https://test.local/');await p.waitForTimeout(6000);
  for(const s of steps){
    if(s.js){const r=await p.evaluate(s.js);if(r!==undefined)console.log('R',JSON.stringify(r))}
    await p.waitForTimeout(s.wait||4000);
    if(s.shot)await p.screenshot({path:s.shot});
  }
  console.log(vp,errs);
  await ctx.close();await b.close();
})();
