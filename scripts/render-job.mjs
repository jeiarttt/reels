// 사용법: npm run render:job -- <job-id> [--force]
// data/script.json 의 id 와 같은 job 을 out/<id>.mp4 로 렌더한다.
import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync, mkdirSync} from 'node:fs';

const args = process.argv.slice(2);
const force = args.includes('--force');
const id = args.find((a) => !a.startsWith('--'));
const script = JSON.parse(readFileSync('data/script.json', 'utf8'));

if (!id) {
  console.error('job id 를 넣어주세요. 예: npm run render:job -- ' + script.id);
  process.exit(1);
}
if (id !== script.id) {
  console.error(`data/script.json 의 id 는 "${script.id}" 입니다. (입력: "${id}")`);
  process.exit(1);
}
mkdirSync('out', {recursive: true});
const out = `out/${id}.mp4`;
if (existsSync(out) && !force) {
  console.error(`${out} 가 이미 있어요. 덮어쓰려면 --force 를 붙이세요.`);
  process.exit(1);
}

const chromeCandidates = [
  process.env.BROWSER_EXECUTABLE,
  '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',
].filter(Boolean);
const browser = chromeCandidates.find((p) => existsSync(p));

const cli = ['remotion', 'render', 'src/index.ts', 'Reel', out, '--codec=h264', '--crf=20', '--concurrency=2'];
if (browser) cli.push(`--browser-executable=${browser}`, '--chromium-options=no-sandbox'); // 샌드박스 환경용
const r = spawnSync('npx', cli, {stdio: 'inherit'});
process.exit(r.status ?? 1);
