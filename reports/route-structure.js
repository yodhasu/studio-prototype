const fs=require('fs');
const { chromium } = require('/home/yodhasu/.openclaw/workspace/.runtime/playwright/node_modules/playwright');
(async()=>{
  const browser=await chromium.connectOverCDP('http://172.23.144.1:9223');
  const context=browser.contexts()[0] || await browser.newContext();
  const page=context.pages().at(-1) || await context.newPage();
  for(const p of context.pages().slice(0,-1)) { try{ await p.close(); }catch{} }
  const base='http://172.23.150.223:3001';
  const routes=['/projects','/projects/p1','/schedule'];
  const out={};
  for(const r of routes){
    await page.goto(base+r,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(1200);
    const buttons=await page.$$eval('button',bs=>bs.map(b=>(b.textContent||'').trim()).filter(Boolean).slice(0,30));
    const links=await page.$$eval('a',as=>as.map(a=>({t:(a.textContent||'').trim(),h:a.getAttribute('href')})).filter(x=>x.t).slice(0,40));
    const headings=await page.$$eval('h1,h2,h3',hs=>hs.map(h=>(h.textContent||'').trim()).filter(Boolean).slice(0,20));
    const text=(await page.locator('body').innerText()).split('\n').map(s=>s.trim()).filter(Boolean);
    out[r]={url:page.url(),title:await page.title(),headings,buttons,links,textSample:text.slice(0,80)};
  }
  fs.writeFileSync('/home/yodhasu/work/studio-prototype/reports/route-structure.json',JSON.stringify(out,null,2));
  await browser.close();
})();
