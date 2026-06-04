// auto_submit.mjs — strip comments and submit solution to SCAU OJ via CDP
//
// Usage: node tools/auto_submit.mjs <problemId> <path/to/main.cpp>
// Example: node tools/auto_submit.mjs 11075 "1General Methods/11075 Dividing Coins/main.cpp"

import { readFileSync } from 'fs';
import { request } from 'http';

const PROXY = 'http://localhost:3456';
const OJ = 'https://acm-scau-edu-cn-s.vpn.scau.edu.cn/uoj8000';
const BASE = 'C:/Personal folder/CourseLearningTask/Analysis and Design of Algorithms';

// ========== CDP helpers ==========
function req(method, path, body) {
  return new Promise(resolve => {
    const u = new URL(PROXY + path);
    const opts = {
      hostname: u.hostname, port: u.port, path: u.pathname + u.search,
      method, timeout: 30000,
      headers: body ? {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      } : {}
    };
    const rq = request(opts, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(d)); });
    rq.on('error', e => resolve('E:' + e.message));
    rq.on('timeout', () => { rq.destroy(); resolve('T'); });
    if (body) rq.write(body); rq.end();
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function open(url) { const r = await req('POST', '/new', url); try { return JSON.parse(r).targetId } catch { return null } }
async function evalJS(id, js) { const r = await req('POST', '/eval?target=' + id, js); try { return JSON.parse(r).value } catch { return r } }
async function close(id) { await req('GET', '/close?target=' + id) }
async function click(id, sel) { await req('POST', '/click?target=' + id, sel) }

// ========== Strip comments ==========
function stripComments(code) {
  // 1. Remove first line "//题号 题目名"
  code = code.replace(/^\/\/[^\n]*\n/, '');

  // 2. Remove all // line comments (but keep code before //)
  code = code.replace(/^([^"'\n]*?)\s*\/\/[^\n]*$/gm, (_, prefix) => prefix);

  // 3. Remove all /* ... */ block comments
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');

  // 4. Collapse multiple blank lines
  code = code.replace(/\n{3,}/g, '\n\n');

  // 5. Trim leading blank lines
  code = code.replace(/^\n+/, '');

  return code;
}

// ========== Main ==========
async function main() {
  const problemId = process.argv[2];
  const cppPath = process.argv[3];

  if (!problemId || !cppPath) {
    console.log('Usage: node tools/auto_submit.mjs <problemId> <path/to/main.cpp>');
    console.log('Example: node tools/auto_submit.mjs 11075 "1General Methods/11075 Dividing Coins/main.cpp"');
    process.exit(1);
  }

  // Read and strip
  const fullPath = cppPath.includes(':') ? cppPath : `${BASE}/${cppPath}`;
  let code;
  try { code = readFileSync(fullPath, 'utf8'); }
  catch { console.error(`ERROR: cannot read ${fullPath}`); process.exit(1); }

  const stripped = stripComments(code);

  console.log('=== Stripped code (preview) ===');
  console.log(stripped);
  console.log('=== End preview ===\n');

  // Open submit page
  const submitUrl = `${OJ}/common_solution_edit_PUBLIC.html?problemId=${problemId}&fixedLanguage=MDsxOzI7Mw==`;
  console.log(`Opening: ${submitUrl}`);
  const tid = await open(submitUrl);
  if (!tid) { console.error('ERROR: failed to open submit page'); process.exit(1); }

  // Wait for page to load
  for (let i = 0; i < 8; i++) {
    await sleep(2000);
    const len = await evalJS(tid, 'document.body.innerText.length');
    if (len && parseInt(len) > 100) break;
  }
  console.log('Page loaded.');

  // Fill the code textarea (needs proper escaping for CDP eval)
  const escaped = stripped
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  // Use a safer approach: encode the code via base64 and decode in JS
  const b64 = Buffer.from(stripped, 'utf8').toString('base64');
  await evalJS(tid,
    `var ta=document.getElementById('areaSource');if(!ta)ta=document.querySelector('textarea');` +
    `ta.value=atob('${b64}');'filled'`
  );
  console.log('Code pasted.');

  // Click submit button
  await click(tid, 'input[type="submit"][name="submit"]');
  console.log('Submit clicked. Waiting for redirect...');

  // Wait for loading page + redirect (3s + buffer)
  let result = '';
  for (let i = 0; i < 6; i++) {
    await sleep(2000);
    const url = await evalJS(tid, 'location.href');
    result = await evalJS(tid, 'document.body.innerText');
    // Check if we've arrived at the result page (no longer "loading..")
    if (result && !result.includes('loading') && !result.includes('跳转')) {
      console.log('Result page reached.');
      break;
    }
    console.log(`  still waiting... (${(i+1)*2}s)`);
  }

  // Parse result — verify submission belongs to our user+problem
  result = (result || '').replace(/\s+/g, ' ').trim();
  console.log('Result:', result.substring(0, 400));

  // Find our submission entry: "提交编号 用户名 ... 题目编号 评判结果 ..."
  // Pattern: digits + ourUser + problemId + resultWord + ...
  const ourUser = '202425310617';
  const re = new RegExp(`(\\d+)\\s+${ourUser}\\s+\\S+\\s+${problemId}\\s+(\\S+)`);
  const match = result.match(re);

  if (match) {
    const [, sid, verdict] = match;
    console.log(`  Solution #${sid}: ${verdict}`);
    if (verdict === '通过' || verdict === 'Accepted') {
      console.log('>>> PASS <<<');
    } else if (verdict === '错误') {
      // Check if there's an [出错提示] link for this submission
      if (result.includes(`出错提示`)) {
        console.log('>>> FAIL: Error with hint — check common_solution_viewTip_PUBLIC.html?solutionId=' + sid + ' <<<');
      } else {
        console.log('>>> FAIL: Wrong Answer <<<');
      }
    } else {
      console.log('>>> FAIL: ' + verdict + ' <<<');
    }
  } else {
    // Fallback: old detection logic
    console.log('  (result detection fallback)');
    if (result.includes('通过') || result.includes('Accepted') || result.includes('AC'))
      console.log('>>> PASS <<<');
    else if (result.includes('答案错误') || result.includes('Wrong') || result.includes('WA'))
      console.log('>>> FAIL: Wrong Answer <<<');
    else if (result.includes('编译') && result.includes('错'))
      console.log('>>> FAIL: Compile Error <<<');
    else if (result.includes('操作过于频繁'))
      console.log('>>> RATE LIMITED <<<');
    else if (result.includes('500') && result.includes('Internal Server Error'))
      console.log('>>> OJ 500 Error — retry after 15s <<<');
    else
      console.log('>>> Status unclear — check manually <<<');
  }

  await close(tid);

  // Inter-submission cool-down (anti-rate-limit)
  console.log('Cool-down 20s...');
  await sleep(20000);
  console.log('Ready for next submission.');
}

main().catch(e => { console.error(e); process.exit(1); });
