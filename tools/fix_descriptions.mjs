import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';

const BASE = 'C:/Personal folder/CourseLearningTask/Analysis and Design of Algorithms';
const DESC = `${BASE}/descriptions`;
const SECTIONS = ['Description', '输入格式', '输出格式', '输入样例', '输出样例', '提示'];

function buildComment(text) {
  const lines = text.split('\n');
  let out = '';
  let inBody = false;
  let prevBlank = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const t = raw.trim();

    // Stop at author/version lines
    if (t.startsWith('作者 ') || t.startsWith('Version') || t.startsWith('Designer') || t.startsWith('粤ICP')) break;

    // Skip meta header lines
    if (t.includes('时间限制') || t.includes('提交次数') || t.includes('题型') || t.includes('语言:')) continue;
    // Skip the first line (title with problem ID)
    if (i === 0 && t.match(/^\d+/)) continue;

    // Section headers: ensure blank line before
    if (SECTIONS.includes(t)) {
      if (prevBlank) out = out.slice(0, -1); // remove trailing newline
      out += '\n' + t + '\n';
      inBody = true;
      prevBlank = false;
      continue;
    }

    // Blank lines
    if (!t) {
      if (inBody) {
        out += '\n';
        prevBlank = true;
      }
      continue;
    }

    // Body content
    out += t + '\n';
    prevBlank = false;
  }

  return out.trim();
}

function processFile(cppPath) {
  let content = readFileSync(cppPath, 'utf8');

  // Extract the problem ID from the first line
  const headerMatch = content.match(/^\/\/(\d+)\s+(.+)/);
  if (!headerMatch) return;

  const id = headerMatch[1];
  const htmlFile = `${DESC}/${id}.html`;
  if (!existsSync(htmlFile)) { console.log(`  SKIP ${id}: no description`); return; }

  const rawText = readFileSync(htmlFile, 'utf8');
  const desc = buildComment(rawText);

  // Find the /* ... */ block and replace it
  const blockStart = content.indexOf('/*');
  const blockEnd = content.lastIndexOf('*/');
  if (blockStart < 0) return;

  const before = content.substring(0, blockStart);
  const newBlock = '/*\n' + desc + '\n*/';
  const newContent = before + newBlock;

  writeFileSync(cppPath, newContent, 'utf8');
  console.log(`  Fixed ${id}`);
}

// Walk through all unit directories
const unitDirs = ['1General Methods', '2Recursion and Divide and Conquer', '3Dynamic Programming', '4Greedy Algorithm', '5Search Algorithm'];
let count = 0;

for (const dirName of unitDirs) {
  const dirPath = `${BASE}/${dirName}`;
  if (!existsSync(dirPath)) continue;

  // Fix main.cpp in each problem folder
  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      const cppPath = `${dirPath}/${e.name}/main.cpp`;
      if (existsSync(cppPath)) {
        processFile(cppPath);
        count++;
      }
    }
  }

  // Fix .txt files
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith('.txt')) {
      const cppPath = dirPath + '/' + e.name + '/main.cpp';
      // Actually .txt is at chapter level - check if it exists as txt
      if (existsSync(cppPath)) {
        // Main.cpp was already processed above
      };
      // Process .txt files separately
      const txtPath = `${dirPath}/${e.name}`;
      if (existsSync(txtPath)) processFile(txtPath);
    }
  }
}

// Also fix .txt files directly
for (const dirName of unitDirs) {
  const dirPath = `${BASE}/${dirName}`;
  if (!existsSync(dirPath)) continue;
  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith('.txt')) {
      const txtPath = `${dirPath}/${e.name}`;
      processFile(txtPath);
      count++;
    }
  }
}

console.log(`\nTotal fixed: ${count}`);

// Sync .txt from main.cpp for all problems
console.log('\nSyncing .txt files...');
for (const dirName of unitDirs) {
  const dirPath = `${BASE}/${dirName}`;
  if (!existsSync(dirPath)) continue;
  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      const cppPath = `${dirPath}/${e.name}/main.cpp`;
      const txtPath = `${dirPath}/${e.name}.txt`;
      if (existsSync(cppPath)) {
        const content = readFileSync(cppPath, 'utf8');
        writeFileSync(txtPath, content, 'utf8');
        console.log(`  Synced ${e.name}.txt`);
      }
    }
  }
}

console.log('Done!');
