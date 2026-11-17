// 사용법: npm run render:job -- <job-id> [--force] [--skip-validate] [--script=data/script.cute.json]
// data/script.json 의 id 와 같은 job 을 out/<id>.mp4 로 렌더한다.
import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync, mkdirSync, writeFileSync} from 'node:fs';

const args = process.argv.slice(2);
const force = args.includes('--force');
const id = args.find((a) => !a.startsWith('--'));
const scriptArg = args.find((a) => a.startsWith('--script='));
const scriptPath = scriptArg ? scriptArg.slice('--script='.length) : 'data/script.json';
const script = JSON.parse(readFileSync(scriptPath, 'utf8'));

if (!id) {
  console.error('job id 를 넣어주세요. 예: npm run render:job -- ' + script.id);
  process.exit(1);
}
if (id !== script.id) {
  console.error(`${scriptPath} 의 id 는 "${script.id}" 입니다. (입력: "${id}")`);
  process.exit(1);
}
// 렌더 전 대본 검사: 오류가 있으면 렌더하지 않는다. (--skip-validate 로 건너뛸 수 있지만 권장하지 않아요)
if (!args.includes('--skip-validate')) {
  const v = spawnSync('node', ['scripts/validate-script.mjs', scriptPath], {stdio: 'inherit'});
  if (v.status !== 0) {
    console.error('대본 검사에서 오류가 나서 렌더를 중단했어요. 대본을 고친 뒤 다시 실행하세요.');
    process.exit(1);
  }
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

writeFileSync('out/.props.json', JSON.stringify({script}));
const cli = ['remotion', 'render', 'src/index.ts', 'Reel', out, '--codec=h264', '--crf=20', '--concurrency=2', '--props=out/.props.json'];
if (browser) cli.push(`--browser-executable=${browser}`, '--chromium-options=no-sandbox'); // 샌드박스 환경용
const r = spawnSync('npx', cli, {stdio: 'inherit'});
process.exit(r.status ?? 1);
