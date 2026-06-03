import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { request } from 'http';

const PROXY = 'http://localhost:3456';
const BASE = 'C:/Personal folder/CourseLearningTask/Analysis and Design of Algorithms';
const PID = {2:841,3:842,4:843,5:844};
const DIR = {2:'2Recursion and DivideConquer',3:'3Dynamic Programming',4:'4Greedy',5:'5Search'};

function req(method, path, body) {
  return new Promise((resolve) => {
    const u = new URL(PROXY + path);
    const opts = {
      hostname: u.hostname, port: u.port, path: u.pathname + u.search, method,
      headers: body ? {'Content-Type':'application/x-www-form-urlencoded','Content-Length':Buffer.byteLength(body)} : {},
      timeout: 15000
    };
    const rq = request(opts, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(d)); });
    rq.on('error',e=>resolve('E:'+e.message));
    rq.on('timeout',()=>{rq.destroy();resolve('TIMEOUT');});
    if(body) rq.write(body);
    rq.end();
  });
}

function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }

async function open(url) {
  const r=await req('POST','/new',url);
  try{return JSON.parse(r).targetId;}catch{return null;}
}
async function evalJS(id,js) {
  const r=await req('POST','/eval?target='+id,js);
  try{return JSON.parse(r).value;}catch{return r;}
}
async function close(id) { await req('GET','/close?target='+id); }

async function getLinks(unitNum) {
  const pid = PID[unitNum];
  const tid = await open(`https://acm.scau.edu.cn/uoj8000/common_ojTreeNode_listProblemNodes_PUBLIC.html?pid=${pid}`);
  if(!tid) return [];

  // Wait for page load
  for(let i=0;i<10;i++) {
    await sleep(1500);
    const t = await evalJS(tid, 'document.body.innerText.length');
    if(t && parseInt(t)>200) break;
  }

  // Get hrefs and names as simple pipe-separated strings (avoids JSON issues)
  const hrefs = await evalJS(tid, "Array.from(document.querySelectorAll('a')).filter(function(a){return a.href&&a.href.indexOf('problemId')>=0}).map(function(a){return a.href}).join('|||')");
  const names = await evalJS(tid, "Array.from(document.querySelectorAll('a')).filter(function(a){return a.href&&a.href.indexOf('problemId')>=0}).map(function(a){return a.innerText.trim()}).join('|||')");
  await close(tid);

  const h = hrefs.split('|||');
  const n = names.split('|||');
  const probs = [];
  for(let i=0;i<h.length;i++) {
    try {
      const u = new URL(h[i]);
      probs.push({id: u.searchParams.get('problemId'), name: n[i]||'', href: h[i]});
    } catch {}
  }
  return probs;
}

async function processUnit(unitNum) {
  console.log(`\n=== Unit ${unitNum}: ${DIR[unitNum]} ===`);
  const probs = await getLinks(unitNum);
  if(!probs.length){console.log('  No links');return;}
  console.log(`  ${probs.length} problems`);

  const descDir = BASE + '/descriptions';
  mkdirSync(descDir,{recursive:true});

  let c=0;
  for(const p of probs) {
    c++;
    console.log(`  [${c}/${probs.length}] ${p.id} ${p.name}`);

    const tid = await open(p.href);
    if(!tid){console.log('    FAIL open');await sleep(3000);continue;}

    let content='';
    for(let i=0;i<8;i++) {
      await sleep(2000);
      content = await evalJS(tid, 'document.body.innerText');
      if(content && content.length>200 && content.indexOf('无法访问')<0 && content.indexOf('loading..')<0) break;
      console.log(`    wait ${i+1}...`);
    }

    if(content && content.length>200) {
      writeFileSync(`${descDir}/${p.id}.html`, content, 'utf8');
      console.log(`    OK (${content.length}c)`);
    } else {
      console.log(`    SKIP (${content?content.length:0}c)`);
    }

    await close(tid);
    console.log(`    zzz 4s...`);
    await sleep(4000);
  }
  console.log(`Unit ${unitNum} done!`);
}

const u = parseInt(process.argv[2])||0;
if(u) await processUnit(u);
else for(const x of [4,3,5,2]) await processUnit(x);
console.log('\nAll done!');
