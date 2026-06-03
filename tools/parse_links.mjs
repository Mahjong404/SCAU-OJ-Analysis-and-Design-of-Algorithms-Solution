import { readFileSync, writeFileSync } from 'fs';

const tmp = process.env.TMP;

for (const u of [2, 3, 4, 5]) {
  const raw = readFileSync(`${tmp}/unit${u}_links.json`, 'utf8');
  const obj = JSON.parse(raw);
  // The CDP proxy double-escapes the JSON string
  const v = JSON.parse(obj.value);

  if (typeof v === 'string') {
    // Still escaped - try one more level
    const v2 = JSON.parse(v);
    const out = v2.map(p => {
      const url = new URL(p.href);
      return `${url.searchParams.get('problemId')}|${p.text}|${p.href}`;
    }).join('\n');
    writeFileSync(`${tmp}/unit${u}_parsed.txt`, out);
    console.log(`Unit ${u}: ${v2.length} problems saved`);
  } else if (Array.isArray(v)) {
    const out = v.map(p => {
      const url = new URL(p.href);
      return `${url.searchParams.get('problemId')}|${p.text}|${p.href}`;
    }).join('\n');
    writeFileSync(`${tmp}/unit${u}_parsed.txt`, out);
    console.log(`Unit ${u}: ${v.length} problems saved`);
  }
}
