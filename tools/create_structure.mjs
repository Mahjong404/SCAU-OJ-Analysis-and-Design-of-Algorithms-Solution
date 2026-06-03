import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const BASE = 'C:/Personal folder/CourseLearningTask/Analysis and Design of Algorithms';
const TMP = process.env.TMP;

const UNITS = {
  2: '2Recursion and Divide and Conquer',
  3: '3Dynamic Programming',
  4: '4Greedy Algorithm',
  5: '5Search Algorithm',
};

const EN = {
  8594:'Permutation with Duplicates', 17088:'Mode by Divide and Conquer',
  9714:'Christmas Gifts', 9718:'Integer Factorization',
  10302:'Integer Special Partition', 10304:'Planar Graph Coloring',
  10343:'Convex Polygon Triangulation', 10344:'Catalan Matrix Chain',
  11073:'Top K Search Strings', 11074:'Plane Partition',
  11081:'Post Office Location', 11082:'Catalan Complete Binary Trees',
  11085:'Catalan Ticket Change', 11086:'Sorting Revisited',
  11087:'Counting Inversions', 11088:'Integer Partition Extended',
  17082:'Kth of Two Sorted Arrays', 17083:'Multiple Power Counting',
  17965:'Lucky Star', 17087:'Output All Combinations', 9716:'Union of Rectangles',
  8596:'LIS', 18708:'Max Subarray Sum', 19182:'Stone Merge Basic',
  8597:'Stone Partition', 19185:'01 Knapsack', 9717:'Number Game',
  10303:'Number Triangle', 10349:'Number Skiing',
  11077:'Longest Common Substring', 11078:'Static Stone Merge',
  11080:'Swim Ring Max Submatrix', 11083:'Travel Knapsack',
  11090:'Max m-Segment', 8595:'Coin Combination',
  17089:'Max m-Subsegment Sum', 17098:'Billboard Placement',
  17099:'Weekly Work Schedule', 17102:'Max Independent Set on Path',
  19187:'Billboard Placement II', 8598:'Divisible by 15',
  8602:'Interval Intersection', 8605:'Delete Digits',
  10346:'Job Scheduling with Deadlines', 11079:'Movable Stone Merge',
  17964:'Water Bucket', 17103:'Base Station Construction',
  11091:'Optimal Natural Decomposition',
  8599:'Egyptian Fraction', 8600:'Knight Problem',
  8603:'Subset Sum', 8604:'Best Athlete Pairing',
  10347:'Busy Bricklayer', 11089:'Multi-Machine Scheduling',
  17080:'Latin Matrix', 17081:'Gem Arrangement',
  17084:'Romeo Juliet Maze', 17085:'Job Assignment',
  17090:'Painting Gallery', 17091:'Max Continuous Postage',
  17092:'Push Box Shortest Path', 17093:'Shortest Addition Chain',
  17094:'Representative Selection', 17095:'Min Weight Vertex Cover',
  17096:'Max Cut', 17097:'Two Ships Loading',
};

function sanitize(s) { return s.replace(/[<>:"/\\|?*]/g,'').trim(); }

// Build unit→problems mapping from parsed files
const unitProbs = {};
for (const u of [2,3,4,5]) {
  const f = `${TMP}/unit${u}_parsed.txt`;
  if (!existsSync(f)) { console.log(`Missing: unit${u}_parsed.txt`); continue; }
  const lines = readFileSync(f,'utf8').trim().split('\n').filter(Boolean);
  unitProbs[u] = lines.map(line => {
    const [id, name] = line.split('|');
    return { id, name: name.trim() };
  });
  console.log(`Unit ${u}: ${unitProbs[u].length} problems`);
}

let total = 0;

for (const [unitNum, dirName] of Object.entries(UNITS)) {
  const probs = unitProbs[parseInt(unitNum)];
  if (!probs) continue;
  console.log(`\n=== Unit ${unitNum}: ${dirName} ===`);

  for (const p of probs) {
    const txtFile = `${BASE}/descriptions/${p.id}.html`;
    if (!existsSync(txtFile)) { console.log(`  SKIP ${p.id}: no description`); continue; }

    const text = readFileSync(txtFile, 'utf8');
    // Extract Chinese name from first line
    const firstLine = text.split('\n')[0].trim();
    const cnName = firstLine.replace(/^\d+\s*/, '').trim().replace(/[  ]+/g, ' ');

    // Build description block
    let desc = '';
    const lines = text.split('\n');
    let inDesc = false, skipMeta = true;
    for (const line of lines) {
      const t = line.trim();
      if (!t) { inDesc = false; continue; }
      // Skip meta header
      if (t.includes('时间限制') || t.includes('提交次数') || t.includes('题型') ||
          t.includes('Version') || t.includes('Designer') || t.includes('粤ICP')) continue;
      if (t.match(/^[0-9]+\s*[^0-9]/) && skipMeta) {
        // First line with problem ID - already captured as cnName
        skipMeta = false;
        desc = 'Description\n';
        continue;
      }
      if (t === 'Description' || t === '输入格式' || t === '输出格式' ||
          t === '输入样例' || t === '输出样例' || t === '提示') {
        desc += t + '\n';
        continue;
      }
      desc += t + '\n';
    }

    const enName = EN[parseInt(p.id)] || p.id;
    const folderName = `${p.id} ${sanitize(enName)}`;

    // Create folder
    const folderPath = `${BASE}/${dirName}/${folderName}`;
    mkdirSync(folderPath, { recursive: true });

    // Build content
    const header = `//${p.id} ${cnName}`;
    const code = `${header}
#include <iostream>
using namespace std;

int main() {
    // TODO: implement

    return 0;
}

/*
${desc}*/`;

    writeFileSync(`${folderPath}/main.cpp`, code, 'utf8');
    writeFileSync(`${BASE}/${dirName}/${folderName}.txt`, code, 'utf8');
    console.log(`  ${p.id} ${enName}`);
    total++;
  }
}

console.log(`\nTotal: ${total} problems created`);
