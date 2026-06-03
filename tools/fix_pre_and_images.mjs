import { readFileSync, writeFileSync, existsSync } from 'fs';
import { request } from 'http';

const PROXY = 'http://localhost:3456';
const BASE = 'C:/Personal folder/CourseLearningTask/Analysis and Design of Algorithms';
const TMP = process.env.TMP;
const OJ = 'https://acm-scau-edu-cn-s.vpn.scau.edu.cn/uoj8000';
const PIDS = {2:841,3:842,4:843,5:844};
const SECS = ['Description','输入格式','输出格式','输入样例','输出样例','提示'];

// All affected probs
const ALL = new Set([8594,8595,8596,8597,8599,8600,8603,9718,10303,10304,10343,10344,10346,
  11074,11078,11079,11082,11083,11085,11086,11087,11088,11089,11090,11091,
  17082,17083,17084,17088,17092,17093,17094,17095,17096,17102,17965]);

// Build problem→unit mapping
const probMap = {};
for(const u of [2,3,4,5]){
  const lines = readFileSync(`${TMP}/unit${u}_parsed.txt`,'utf8').trim().split('\n');
  for(const l of lines) { const [id] = l.split('|'); probMap[parseInt(id)] = u; }
}

function req(method, path, body) {
  return new Promise(resolve => {
    const u = new URL(PROXY + path);
    const opts = {hostname:u.hostname,port:u.port,path:u.pathname+u.search,method,timeout:30000,
      headers: body?{'Content-Type':'application/x-www-form-urlencoded','Content-Length':Buffer.byteLength(body)}:{}};
    const rq = request(opts, res => {let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve(d));});
    rq.on('error',e=>resolve('ERROR:'+e.message)); rq.on('timeout',()=>{rq.destroy();resolve('TIMEOUT');});
    if(body) rq.write(body); rq.end();
  });
}
function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }
async function open(url) { const r=await req('POST','/new',url); try{return JSON.parse(r).targetId}catch{return null} }
async function evalJS(id,js) { const r=await req('POST','/eval?target='+id,js); try{return JSON.parse(r).value}catch{return r} }
async function close(id) { await req('GET','/close?target='+id) }
function dec(s) { return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' '); }

const PRE_SEP = '||||PRESEP||||';

// Get all links for a unit from its list page
async function getUnitLinks(unit) {
  const pid = PIDS[unit];
  console.log(`  Opening list page for unit ${unit}...`);
  const ltid = await open(`${OJ}/common_ojTreeNode_listProblemNodes_PUBLIC.html?pid=${pid}`);
  if(!ltid) return {};
  for(let i=0;i<6;i++){await sleep(2000);const t=await evalJS(ltid,'document.body.innerText.length');if(t&&parseInt(t)>200)break;}

  // Get hrefs and problem IDs using simple separators (no JSON)
  const idsRaw = await evalJS(ltid, `Array.from(document.querySelectorAll('a')).filter(function(a){return a.href&&a.href.indexOf('problemId')>=0}).map(function(a){var u=new URL(a.href);return u.searchParams.get('problemId')}).join('|')`);
  const hrefsRaw = await evalJS(ltid, `Array.from(document.querySelectorAll('a')).filter(function(a){return a.href&&a.href.indexOf('problemId')>=0}).map(function(a){return a.href}).join('|')`);
  await close(ltid);

  const ids = idsRaw.split('|');
  const hrefs = hrefsRaw.split('|');
  const links = {};
  for(let i=0;i<Math.min(ids.length,hrefs.length);i++){
    links[parseInt(ids[i])] = hrefs[i];
  }
  console.log(`  Got ${Object.keys(links).length} links`);
  return links;
}

// Process one problem
async function processProblem(id, href) {
  const vpnUrl = href.replace('acm.scau.edu.cn','acm-scau-edu-cn-s.vpn.scau.edu.cn');
  const ptid = await open(vpnUrl);
  if(!ptid){console.log(`    FAIL`);return null;}
  for(let i=0;i<8;i++){await sleep(2000);const t=await evalJS(ptid,'document.body.innerText.length');if(t&&parseInt(t)>200)break;}

  const presRaw = await evalJS(ptid, `var ps=document.querySelectorAll('pre');var s='';for(var i=0;i<ps.length;i++){if(i>0)s+='${PRE_SEP}';s+=ps[i].innerHTML}s`);
  await close(ptid);

  const preBlocks = presRaw.split(PRE_SEP);
  let desc = '';
  for(let i=0;i<Math.min(preBlocks.length,SECS.length);i++){
    let t = dec(preBlocks[i]).replace(/<!--[\s\S]*?-->/g,'').replace(/<br\s*\/?>/gi,'').trim();
    if(!t) continue;
    desc += SECS[i] + '\n' + t + '\n\n';
  }
  return desc.trim();
}

// Main
let total = 0;
for(const unit of [2,3,4,5]){
  // Filter affected probs in this unit
  const unitProbs = [...ALL].filter(id => probMap[id] === unit);
  if(!unitProbs.length) continue;
  console.log(`\n=== Unit ${unit}: ${unitProbs.length} problems ===`);

  const links = await getUnitLinks(unit);
  await sleep(3000);

  for(const id of unitProbs){
    total++;
    console.log(`  [${total}/${ALL.size}] ${id}`);
    const href = links[id];
    if(!href){console.log(`    No link`);continue;}

    const desc = await processProblem(id, href);
    if(desc){
      writeFileSync(`${BASE}/descriptions/${id}_fixed.txt`, desc, 'utf8');
      console.log(`    OK (${desc.length}c)`);
    }
    console.log('    zzz 5s');
    await sleep(5000);
  }
}
console.log(`\nDone! ${total} processed`);
