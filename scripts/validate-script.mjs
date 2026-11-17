// 사용법: node scripts/validate-script.mjs [대본경로=data/script.json]
// 오류(ERROR)가 있으면 종료 코드 1, 경고(WARN)만 있으면 0.
import {existsSync, readFileSync} from 'node:fs';

const path = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'data/script.json';
const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

let s;
try {
  s = JSON.parse(readFileSync(path, 'utf8'));
} catch (e) {
  console.error(`ERROR: ${path} 를 읽을 수 없어요: ${e.message}`);
  process.exit(1);
}

const strip = (t = '') => t.replace(/\[\[|\]\]/g, '');
const lines = (t = '') => strip(t).split('\n');
const FORBIDDEN = ['무조건', '100%', '누구나', '반드시 받', '확실히', '대박', '충격', '절대 손해'];
const KINDS = ['text', 'cards', 'table'];

// ── 필수 항목 ──
for (const k of ['id', 'mode', 'hook', 'cta', 'status', 'caption']) if (!s[k]) err(`필수 항목 없음: ${k}`);
if (!Array.isArray(s.scenes) || s.scenes.length < 3) err('scenes 는 3개 이상 필요해요');
if (!Array.isArray(s.hashtags) || s.hashtags.length === 0) err('hashtags 가 비어 있어요');
else if (s.hashtags.some((h) => !String(h).startsWith('#'))) warn('hashtags 중 # 로 시작하지 않는 항목이 있어요');
if (!Array.isArray(s.sources) || s.sources.length === 0) err('sources(출처)가 비어 있어요. 출처 없는 내용은 쓰지 않아요');
else if (s.sources.some((u) => !/^https?:\/\//.test(u))) warn('sources 에 http(s) 주소가 아닌 항목이 있어요');
if (!Array.isArray(s.verify_before_post) || s.verify_before_post.length === 0) err('verify_before_post 가 비어 있어요');
else if (!s.verify_before_post.some((v) => /공식/.test(v)))
  warn('verify_before_post 에 "공식 출처 확인 여부"가 적혀 있지 않아요 (직접 확인/못 함을 구분해서 적어요)');

// ── 상태·면책 ──
if (s.status !== 'pending' && s.status !== 'confirmed') err('status 는 pending 또는 confirmed 여야 해요');
if (s.status === 'confirmed') warn('status 가 confirmed 예요. 사람이 공식 공고로 확인했을 때만 바꿔요');
if (s.status !== 'confirmed' && !s.disclaimer_overlay) err('status 가 pending 인데 disclaimer_overlay 가 없어요');

// ── 장면 ──
const bodyTexts = [];
const bgUsage = {};
const useBg = (bg, where) => {
  if (!bg || !bg.src) return;
  bgUsage[bg.src] = (bgUsage[bg.src] ?? 0) + 1;
  if (!existsSync(`public/${bg.src}`)) err(`${where}: 배경 파일이 없어요 (public/${bg.src})`);
};
if (!s.backgroundSrc) {
  useBg(s.hookBg, 'hookBg');
  useBg(s.ctaBg, 'ctaBg');
} else if (!existsSync(`public/${s.backgroundSrc}`)) err(`backgroundSrc 파일이 없어요 (public/${s.backgroundSrc})`);

(s.scenes ?? []).forEach((sc, i) => {
  const w = `scenes[${i}]`;
  const kind = sc.kind ?? 'text';
  if (!(sc.t > 0)) err(`${w}: t(초)가 올바르지 않아요`);
  else if (sc.t < 3 || sc.t > 9) warn(`${w}: t=${sc.t}초. 보통 4~7초가 좋아요`);
  if (!KINDS.includes(kind)) warn(`${w}: kind "${kind}" 는 기본 제공 형식이 아니에요. 컴포넌트가 연결돼 있는지 확인해요`);
  if (!s.backgroundSrc) {
    if (!sc.bg) warn(`${w}: bg 가 없어요`);
    useBg(sc.bg, w);
  }
  if (kind === 'text') {
    if (!sc.text) err(`${w}: text 가 비어 있어요`);
    bodyTexts.push(sc.text ?? '');
  }
  if (sc.label) bodyTexts.push(sc.label);
  if (sc.text) {
    const ls = lines(sc.text);
    if (ls.length > 4) warn(`${w}: 줄이 ${ls.length}줄이에요 (최대 3~4줄)`);
    ls.forEach((l, j) => {
      const n = [...l].length;
      if (n > 16) err(`${w}: ${j + 1}번째 줄이 ${n}자예요. 히피체는 폭을 넘길 수 있어요 (14자 안팎으로 \\n 나누기)`);
      else if (n > 14) warn(`${w}: ${j + 1}번째 줄이 ${n}자예요 ("${l}")`);
    });
  }
  if (kind === 'cards') {
    const c = sc.cards ?? [];
    if (c.length < 3 || c.length > 4) warn(`${w}: 카드는 3~4개가 좋아요 (현재 ${c.length})`);
    c.forEach((x, k) => {
      if (!x.big) err(`${w}.cards[${k}]: big 이 비어 있어요`);
      else if ([...x.big].length > 12) warn(`${w}.cards[${k}]: big 이 ${[...x.big].length}자예요 (10자 안팎)`);
      bodyTexts.push(x.big ?? '', x.small ?? '');
    });
  }
  if (kind === 'table') {
    const t = sc.table;
    if (!t || !t.head || !t.rows) err(`${w}: table.head / rows 가 필요해요`);
    else {
      if (t.head.length < 2 || t.head.length > 3) warn(`${w}: 표 열은 2~3개가 좋아요`);
      if (t.rows.length < 2 || t.rows.length > 4) warn(`${w}: 표 행은 2~4개가 좋아요`);
      t.rows.forEach((r, k) => {
        if (r.length !== t.head.length) err(`${w}.rows[${k}]: 열 수(${r.length})가 머리글(${t.head.length})과 달라요`);
        r.forEach((cell) => {
          if (lines(cell).length > 2) warn(`${w}.rows[${k}]: 셀이 3줄 이상이에요`);
          if (/미공고|미정|추후/.test(cell)) warn(`${w}.rows[${k}]: "${cell}" 칸이 있어요. 후킹이 그 내용을 약속하면 영상을 만들지 않아요`);
        });
        bodyTexts.push(r.join(' '));
      });
      bodyTexts.push(t.head.join(' '));
    }
  }
});
bodyTexts.push(s.cta ?? '');

// ── 사진 중복 ──
for (const [src, n] of Object.entries(bgUsage)) if (n >= 3) err(`같은 배경(${src})을 ${n}번 써요. 3번 이상은 쓰지 않아요`);

// ── 후킹 ↔ 본문 일치 ──
const hookLines = lines(s.hook);
if (hookLines.length > 3) warn(`hook 이 ${hookLines.length}줄이에요 (최대 2~3줄)`);
hookLines.forEach((l, j) => {
  const n = [...l].length;
  if (n > 16) err(`hook ${j + 1}번째 줄이 ${n}자예요. 14자 안팎으로 \\n 나누기`);
});
const body = bodyTexts.join(' ').replace(/\s+/g, '');
const hookPlain = strip(s.hook).replace(/\s+/g, '');
const tokens = new Set([
  ...(hookPlain.match(/20\d\d년?/g) ?? []),
  ...(hookPlain.match(/\d[\d,.]*(?:%|원|만원|일|개월|년|세|명|단계|가지|곳|배)/g) ?? []),
]);
for (const t of tokens) {
  const core = t.replace(/년$/, '');
  if (!body.includes(t.replace(/\s/g, '')) && !body.includes(core))
    err(`후킹의 "${t}" 가 본문에 나오지 않아요. 후킹이 약속한 내용이 본문에 있어야 해요`);
}
const yearInHook = (hookPlain.match(/20\d\d/g) ?? [])[0];
if (yearInHook && bodyTexts.join(' ').match(/미공고/)) err(`후킹이 ${yearInHook}년을 말하는데 본문에 "미공고"가 있어요. 확정 내용이 없으면 영상을 만들지 않아요`);

// ── 금지 표현 / 이모지 ──
const all = [s.hook, s.caption, ...bodyTexts].join(' ');
for (const f of FORBIDDEN) if (all.includes(f)) err(`금지·과장 표현 "${f}" 이 들어 있어요`);
const emoji = /\p{Extended_Pictographic}/u;
(s.scenes ?? []).forEach((sc, i) => {
  if (emoji.test([sc.text, sc.label].join(' '))) warn(`scenes[${i}]: 이모지는 첫 화면과 캡션에서만 써요`);
});
if (emoji.test(s.cta ?? '')) warn('cta 에 이모지가 있어요');
const hl = ([s.hook, ...bodyTexts].join(' ').match(/\[\[/g) ?? []).length;
if (hl > 3) err(`[[ ]] 강조가 ${hl}곳이에요. 전체 3곳 이내로 줄여요 (핵심 숫자·단어만)`);
if ((all.match(/\[\[/g) ?? []).length !== (all.match(/\]\]/g) ?? []).length) err('[[ ]] 짝이 맞지 않아요');

// ── 출력 ──
console.log(`검사 대상: ${path}  (id: ${s.id ?? '-'})`);
warns.forEach((m) => console.log(`WARN  ${m}`));
errors.forEach((m) => console.log(`ERROR ${m}`));
console.log(errors.length ? `\n오류 ${errors.length}개, 경고 ${warns.length}개 → 렌더하지 않아요.` : `\n오류 없음, 경고 ${warns.length}개`);
process.exit(errors.length ? 1 : 0);
