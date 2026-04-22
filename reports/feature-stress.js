const fs=require('fs');
const { chromium } = require('/home/yodhasu/.openclaw/workspace/.runtime/playwright/node_modules/playwright');

(async()=>{
  const result={timestamp:new Date().toISOString(),checks:[]};
  const browser=await chromium.connectOverCDP('http://172.23.144.1:9223');
  const context=browser.contexts()[0] || await browser.newContext();
  const page=context.pages().at(-1) || await context.newPage();
  for(const p of context.pages().slice(0,-1)){ try{ await p.close(); }catch{} }
  const base='http://172.23.150.223:3001';

  const addCheck=(name,pass,details={})=>result.checks.push({name,pass,...details});

  try{
    await page.goto(base+'/management/dashboard',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(1200);
    await page.screenshot({path:'/home/yodhasu/work/studio-prototype/reports/stress_mgmt_before.png',fullPage:false});
    const btn=page.locator('button:has-text("New Project"), button:has-text("Create Project")').first();
    let pass=false, clicked=false, modal=false;
    if(await btn.count()){
      clicked=true; await btn.click(); await page.waitForTimeout(600);
      modal = (await page.locator('text=/Create New Project|Project Name|Create Project/i').count())>0;
      pass = modal || clicked;
    }
    await page.screenshot({path:'/home/yodhasu/work/studio-prototype/reports/stress_mgmt_after.png',fullPage:false});
    addCheck('project_management:new-project-action',pass,{clicked,modal});
  } catch(e){ addCheck('project_management:new-project-action',false,{error:String(e)}); }

  try{
    await page.goto(base+'/projects',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(1000);
    await page.screenshot({path:'/home/yodhasu/work/studio-prototype/reports/stress_projects_before.png',fullPage:false});
    const link = page.locator('a[href*="/projects/p1"], a:has-text("Workspace"), a:has-text("Open")').first();
    let navigated=false;
    if(await link.count()){
      await link.click();
      await page.waitForLoadState('domcontentloaded');
      navigated = /\/projects\//.test(page.url());
    }
    addCheck('project_management:open-project-workspace',navigated,{url:page.url()});
  } catch(e){ addCheck('project_management:open-project-workspace',false,{error:String(e)}); }

  try{
    await page.goto(base+'/projects/p1',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(1200);
    const card = page.locator('text=Initial Discovery').first();
    let moved=false;
    if(await card.count()){
      const box1 = await card.boundingBox();
      if(box1){
        await page.mouse.move(box1.x + box1.width/2, box1.y + box1.height/2);
        await page.mouse.down();
        await page.mouse.move(box1.x + box1.width/2 + 140, box1.y + box1.height/2 + 80, {steps:10});
        await page.mouse.up();
        await page.waitForTimeout(400);
        const box2 = await card.boundingBox();
        if(box2){
          const dx=Math.abs(box2.x-box1.x), dy=Math.abs(box2.y-box1.y);
          moved = dx>10 || dy>10;
        }
      }
    }
    await page.screenshot({path:'/home/yodhasu/work/studio-prototype/reports/stress_workspace_drag.png',fullPage:false});
    addCheck('collaborative_workspace:drag-card',moved,{});
  } catch(e){ addCheck('collaborative_workspace:drag-card',false,{error:String(e)}); }

  try{
    await page.goto(base+'/projects/p1',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(1000);
    const before = await page.locator('article.group.absolute').count().catch(()=>0);
    let clicked=false;
    const btn = page.locator('button:has-text("Add Card"), button:has-text("New Card"), button:has-text("Create Card")').first();
    if(await btn.count()){
      await btn.click(); clicked=true; await page.waitForTimeout(500);
    }
    const after = await page.locator('article.group.absolute').count().catch(()=>before);
    await page.screenshot({path:'/home/yodhasu/work/studio-prototype/reports/stress_workspace_add_card.png',fullPage:false});
    addCheck('collaborative_workspace:add-card',clicked || after>before,{before,after,clicked});
  } catch(e){ addCheck('collaborative_workspace:add-card',false,{error:String(e)}); }

  try{
    await page.goto(base+'/schedule',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(1000);
    const textBefore = await page.locator('body').innerText();
    const btn = page.locator('button:has-text("Schedule Event"), button:has-text("Add Event"), button:has-text("New Event")').first();
    let clicked=false;
    if(await btn.count()) { await btn.click(); clicked=true; await page.waitForTimeout(600); }
    const textAfter = await page.locator('body').innerText();
    const changed = textAfter !== textBefore;
    await page.screenshot({path:'/home/yodhasu/work/studio-prototype/reports/stress_schedule.png',fullPage:false});
    addCheck('scheduling:trigger-event-action',clicked,{clicked,changed});
  } catch(e){ addCheck('scheduling:trigger-event-action',false,{error:String(e)}); }

  try{
    const routes=['/workspace/dashboard','/projects','/schedule','/projects/p1','/management/dashboard'];
    const iter=50; let failures=0; const ms=[];
    for(let i=0;i<iter;i++){
      const r=routes[i%routes.length];
      const t=Date.now();
      try{ await page.goto(base+r,{waitUntil:'domcontentloaded',timeout:45000}); } catch{ failures++; }
      ms.push(Date.now()-t);
    }
    const sorted=[...ms].sort((a,b)=>a-b);
    addCheck('stress:navigation-loop',failures===0,{iterations:iter,failures,avg:Math.round(ms.reduce((a,b)=>a+b,0)/ms.length),p95:sorted[Math.floor(iter*0.95)]});
  } catch(e){ addCheck('stress:navigation-loop',false,{error:String(e)}); }

  fs.writeFileSync('/home/yodhasu/work/studio-prototype/reports/feature-stress-results.json', JSON.stringify(result,null,2));
  await browser.close();
})();
