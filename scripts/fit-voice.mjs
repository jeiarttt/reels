#!/usr/bin/env node
// 음성 파일 길이에 맞춰 컷 길이(hookSec·scene.t·ctaSec)를 정한다.
// 사용: node scripts/fit-voice.mjs data/script.xxx.json [여유초=0.5] [--write]
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const [file, padArg] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!file) { console.error('대본 파일이 필요해요'); process.exit(1); }
const pad = Number(padArg ?? 0.5);
const write = process.argv.includes('--write');
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
const dur = (p) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `public/${p}`]).toString().trim());
let total = 0, miss = 0;
const rows = [];
const fit = (label, voice, get, set) => {
  if (!voice || !fs.existsSync(`public/${voice}`)) { rows.push([label, '음성 없음', get()]); miss++; total += get(); return; }
  const d = dur(voice); const t = Math.round((d + pad) * 10) / 10;
  rows.push([label, `${d.toFixed(2)}초`, `${get()} → ${t}`]); if (write) set(t); total += t;
};
fit('표지', s.hookVoice, () => s.hookSec ?? 3.5, (t) => (s.hookSec = t));
s.scenes.forEach((sc, i) => fit(`컷${i + 1}`, sc.voice, () => sc.t, (t) => (sc.t = t)));
fit('마지막', s.ctaVoice, () => s.ctaSec ?? 4, (t) => (s.ctaSec = t));
for (const r of rows) console.log(r.join('  |  '));
console.log(`예상 총 길이 약 ${total.toFixed(1)}초${miss ? ` (음성 없는 구간 ${miss}개는 현재 길이)` : ''}`);
if (write) { fs.writeFileSync(file, JSON.stringify(s, null, 2)); console.log('대본에 길이를 반영했어요'); }
