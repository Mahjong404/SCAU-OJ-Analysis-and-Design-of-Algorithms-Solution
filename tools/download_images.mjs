import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { request } from 'http';

const PROXY = 'http://localhost:3456';
const BASE = 'C:/Personal folder/CourseLearningTask/Analysis and Design of Algorithms';
const OJ = 'https://acm-scau-edu-cn-s.vpn.scau.edu.cn/uoj8000';
const IMG_PROBS = [8599,8600,8603,10303,10304,10343,11074,11082,11088,17084,17092,17093,17094,17095,17096,17102,17965];

const TMP = process.env.TMP;
const probMap = {};
for(const u of [2,3,4,5]){
  const lines = readFileSync(`${TMP}/unit${u}_parsed.txt`,'utf8').trim().split('\n');
  for(const l of lines) { const [id] = l.split('|'); probMap[parseInt(id)] = u; }
}
const PIDS = {2:841,3:842,4:843,5:844};
const UNIT_DIRS = {2:'2Recursion and Divide and Conquer',3:'3Dynamic Programming',4:'4Greedy Algorithm',5:'5Search Algorithm'};

// id→folder mapping
const folderMap = {};
for(const dn of Object.values(UNIT_DIRS)) {
  const dp = BASE+'/'+dn;
  if(!existsSync(dp)) continue;
  for(const e of readdirSync(dp,{withFileTypes:true})) {
    if(!e.isDirectory()) continue;
    const m = e.name.match(/^(\d+)/);
    if(m) folderMap[m[1]] = e.name;
  }
}

function req(method, path, body) {
  return new Promise(resolve => {
    const u = new URL(PROXY + path);
    const opts = {hostname:u.hostname,port:u.port,path:u.pathname+u.search,method,timeout:30000,
      headers: body?{'Content-Type':'application/x-www-form-urlencoded','Content-Length':Buffer.byteLength(body)}:{}};
    const rq = request(opts, res => {let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve(d));});
    rq.on('error',e=>resolve('E:'+e.message)); rq.on('timeout',()=>{rq.destroy();resolve('T');});
    if(body) rq.write(body); rq.end();
  });
}
function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }
async function open(url) { const r=await req('POST','/new',url); try{return JSON.parse(r).targetId}catch{return null} }
async function evalJS(id,js) { const r=await req('POST','/eval?target='+id,js); try{return JSON.parse(r).value}catch{return r} }
async function close(id) { await req('GET','/close?target='+id) }

// Use curl to extract image via canvas (avoids Node HTTP issues)
import { exec } from 'node:child_process';
async function saveImage(tid, filePath) {
  return new Promise(resolve => {
    const cmd = `curl -s -X POST "http://localhost:3456/eval?target=${tid}" -d "var img=document.querySelector('img');var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);c.toDataURL('image/png')"`;
    exec(cmd, {encoding:'utf8',timeout:15000}, (err, stdout) => {
      if(err || !stdout) { resolve(false); return; }
      const m = stdout.match(/"value":"data:image\/png;base64,([^"]+)"/);
      if(!m) { resolve(false); return; }
      const b64 = m[1];
      if(b64.length < 100) { resolve(false); return; }
      try { writeFileSync(filePath, Buffer.from(b64,'base64')); resolve(true); }
      catch(e) { resolve(false); }
    });
  });
}

async function getLinks(unit) {
  const pid = PIDS[unit];
  const ltid = await open(`${OJ}/common_ojTreeNode_listProblemNodes_PUBLIC.html?pid=${pid}`);
  if(!ltid) return {};
  for(let i=0;i<6;i++){await sleep(2000);const t=await evalJS(ltid,'document.body.innerText.length');if(t&&parseInt(t)>200)break;}
  const idsRaw = await evalJS(ltid, `Array.from(document.querySelectorAll('a')).filter(function(a){return a.href&&a.href.indexOf('problemId')>=0}).map(function(a){var u=new URL(a.href);return u.searchParams.get('problemId')}).join('|')`);
  const hrefsRaw = await evalJS(ltid, `Array.from(document.querySelectorAll('a')).filter(function(a){return a.href&&a.href.indexOf('problemId')>=0}).map(function(a){return a.href}).join('|')`);
  await close(ltid);
  const links = {};
  const ids = idsRaw.split('|'), hrefs = hrefsRaw.split('|');
  for(let i=0;i<Math.min(ids.length,hrefs.length);i++) links[parseInt(ids[i])] = hrefs[i];
  return links;
}

// Group by unit
const byUnit = {};
for(const id of IMG_PROBS) {
  const u = probMap[id]||2;
  if(!byUnit[u]) byUnit[u] = [];
  byUnit[u].push(id);
}

let total = 0;
for(const [unit, probs] of Object.entries(byUnit)) {
  console.log(`\n=== Unit ${unit}: ${probs.length} problems ===`);
  const links = await getLinks(parseInt(unit));
  await sleep(3000);

  for(const id of probs) {
    total++;
    console.log(`  [${total}/${IMG_PROBS.length}] ${id}`);
    const href = links[id];
    if(!href){console.log(`    No link`);continue;}

    const vpnUrl = href.replace('acm.scau.edu.cn','acm-scau-edu-cn-s.vpn.scau.edu.cn');
    const ptid = await open(vpnUrl);
    if(!ptid){console.log(`    FAIL`);continue;}
    for(let i=0;i<6;i++){await sleep(2000);const t=await evalJS(ptid,'document.body.innerText.length');if(t&&parseInt(t)>200)break;}

    // Get image URLs from problem page
    const imgsRaw = await evalJS(ptid, `Array.from(document.querySelectorAll('img')).filter(function(i){return i.src&&i.src.indexOf('logo')<0}).map(function(i){return i.src}).join('|')`);
    await close(ptid);

    const imgs = imgsRaw.split('|').filter(s=>s);
    if(!imgs.length){console.log(`    No images`);console.log('    zzz 3s');await sleep(3000);continue;}

    const unitDir = UNIT_DIRS[parseInt(unit)];
    const folder = folderMap[id];
    const dirPath = `${BASE}/${unitDir}/${folder}`;
    mkdirSync(dirPath, {recursive: true});

    for(let idx=0;idx<imgs.length;idx++){
      // Build full image URL (use acm.scau.edu.cn domain since images need original domain)
      const src = imgs[idx];
      let imgUrl = src.startsWith('http') ? src :
                   src.startsWith('/') ? 'https://acm.scau.edu.cn' + src :
                   'https://acm.scau.edu.cn/uoj8000/' + src;
      // Use VPN domain for images too (since we're on VPN)
      imgUrl = imgUrl.replace('acm.scau.edu.cn','acm-scau-edu-cn-s.vpn.scau.edu.cn');

      const imgName = idx===0 ? 'problem.png' : `problem${idx+1}.png`;
      const filePath = `${dirPath}/${imgName}`;
      console.log(`    ${imgName}`);

      const iid = await open(imgUrl);
      if(!iid){console.log(`      FAIL open`);continue;}
      await sleep(2000);

      const ok = await saveImage(iid, filePath);
      await close(iid);
      console.log(`      ${ok?'OK':'FAIL'}`);
      await sleep(2000);
    }
    console.log('    zzz 3s');
    await sleep(3000);
  }
}
console.log(`\nDone!`);
