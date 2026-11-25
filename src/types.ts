export type Bg = {
  /** public/ 기준 경로. 예: "stock/seoul-dusk.jpg" 또는 "user/내영상.mp4" */
  src: string;
  /** 생략하면 확장자로 판단 (mp4/mov/webm = video) */
  type?: 'image' | 'video';
  /** 영상 재생 시작 지점(초) */
  startFrom?: number;
  /** 세로로 잘릴 때 보여줄 위치. 예: "68% 50%" (기본 가운데) */
  position?: string;
};

export type CardItem = {big: string; small?: string; /** 귀여운 테마의 카드 아이콘 */ emoji?: string};
export type TableData = {head: string[]; rows: string[][]};
/** 귀여운 테마 'stat' 컷: 큰 숫자 하나 (gauge 0~100 이면 고리 게이지) */
export type StatData = {big: string; sub?: string; emoji?: string; gauge?: number; /** 원 아래 알약(조건 문구) */ chips?: string[]};
/** 귀여운 테마 'compare' 컷: 되는 것 / 안 되는 것 두 칸 비교 */
export type CompareData = {leftTitle: string; leftItems: string[]; rightTitle: string; rightItems: string[]; /** true면 ✅/❌ 없이 두 대상을 나란히 보여줌 */ neutral?: boolean; /** true면 두 칸을 위아래로 쌓아 글자를 크게 */ stack?: boolean};

export type Scene = {
  t: number;
  kind?: 'text' | 'cards' | 'table' | 'steps' | 'stat' | 'compare' | 'grid' | 'checklist' | 'flow' | 'plain' | 'list' | 'timeline' | 'split' | 'scale' | 'chat' | 'swap' | 'box';
  /** 라임 스타일 장식 도형 모양(burst·sparkle·ring·plus·dots·moon). 생략하면 컷마다 돌려 쓴다 */
  shape?: string;
  /** 글자 컷 아래에 붙이는 작은 알약 문구 */
  chips?: string[];
  /** 귀여운 테마: 밝은 배경이면 'dark'(진한 남색 글자). 기본 'light'(흰 글자) */
  tone?: 'light' | 'dark';
  /** 귀여운 테마: 주제에 어울리는 일러스트 이름(phone·card·train·coin·calendar·cap·house·ticket·briefcase·book)과 위치(tl·tr·bl·br), calendar의 숫자 */
  deco?: string;
  decoPos?: 'tl' | 'tr' | 'bl' | 'br';
  decoText?: string;
  label?: string;
  /** 라임: 제목 아래 작은 설명 한 줄(3칸 이상 표 컷 등) */
  desc?: string;
  /** 라임: 본문 제목 글자 크기(기본 100) */
  titleSize?: number;
  /** 라임 번호 칸(steps·list)의 시작 번호 보정(예: 1이면 02부터) */
  numStart?: number;
  /** 라임: 제목 위에 붙는 번호 배지(예: '01', '02·03', '덤')와 옆 작은 글자(예: '6가지 중') */
  no?: string;
  noSub?: string;
  /** 라임: 이 컷만 배경 딤을 따로 정할 때(없으면 대본 bgDim) */
  dim?: number;
  /** 라임 scale 컷: 가로 눈금 막대(구간 강조 + 표시 말풍선) */
  scale?: {min: number; max: number; from: number; to: number; mark: number; unit?: string};
  /** 라임 chat 컷: 질문(q, 오른쪽 검정)·답(a, 왼쪽 아이보리) 말풍선 */
  chat?: {side: 'q' | 'a'; text: string}[];
  /** 컷별 나레이션 글과 음성 파일 */
  narration?: string;
  voice?: string;
  /** 라임 box 컷: true면 번호 동그라미(1·2·3), 아니면 체크 줄. cards 항목을 카드 한 장 안에 묶는다 */
  boxNum?: boolean;
  /** 라임 swap 컷: 강 → 약 처럼 바꾸는 모습 */
  swap?: {from: string; to: string};
  /** 귀여운 테마: stickers/ 안 파일 이름(확장자 제외)과 의성어 태그 */
  sticker?: string;
  sfx?: string;
  text?: string;
  cards?: CardItem[];
  table?: TableData;
  stat?: StatData;
  compare?: CompareData;
  bg?: Bg;
};

export type Script = {
  id: string;
  mode: 'card_news';
  /** 'cute' 면 귀여운 디자인(스티커·말풍선·이모지 카드)으로 렌더 */
  theme?: 'cute' | 'lime';
  /** 표지·마지막 화면 길이(초). 기본 3.5 / 4 */
  hookSec?: number;
  ctaSec?: number;
  hookSticker?: string;
  hookSfx?: string;
  ctaSticker?: string;
  ctaSfx?: string;
  style?: 'photo';
  /** 내가 준 이미지/영상으로 전체 배경을 덮어쓸 때. public/user/ 에 넣고 "user/파일명" */
  backgroundSrc?: string;
  /** 표지 위쪽 채널 태그(선택). 예: "2030 상경러 · 청년 혜택" */
  brand?: string;
  hookLabel?: string;
  /** 라임 스타일 표지 맨 아래 작은 글씨(여러 줄 가능) */
  hookSub?: string;
  /** 라임 스타일 마지막 컷 라벨 아이콘: bookmark(저장) 또는 comment(댓글) */
  ctaIcon?: 'bookmark' | 'comment';
  hook: string;
  hookBg?: Bg;
  scenes: Scene[];
  ctaLabel?: string;
  /** 음성 나레이션: 대본 글과 public/ 안 음성 파일(예: 'voice/hook.mp3'). 파일이 있으면 해당 컷에서 재생 */
  hookNarration?: string;
  hookVoice?: string;
  ctaNarration?: string;
  ctaVoice?: string;
  voiceVolume?: number;
  /** 라임: 마지막 컷 위 작은 글자(없으면 brand). 예: "저장하고 팔로우" */
  ctaBrand?: string;
  /** 라임: 마지막 컷 팔로우 카드(계정 아이디). 없으면 카드를 그리지 않는다 */
  followId?: string;
  /** 팔로우 카드 아래 한 줄 소개 */
  followSub?: string;
  /** 팔로우 카드 프로필 사진(public 기준 경로). 없으면 첫 글자 원 */
  followAvatar?: string;
  cta: string;
  ctaBg?: Bg;
  /** 귀여운 테마: 배경 어둡기(0~0.6). 밝은 사진이면 낮춘다. 기본 0.3 */
  bgDim?: number;
  /** 라임: 큰 제목 글자 바깥 검은 테두리 두께(px, 0이면 없음) */
  titleStroke?: number;
  /** 라임: 큰 글자 글꼴 이름(Reel.tsx 에서 불러온 family, 예: 'Dunggeun'). 없으면 서울알림체 */
  titleFont?: string;
  /** 라임: 모든 장식 도형을 이 모양으로 통일(예: 'snow' 눈 결정) */
  shapeKind?: string;
  /** 라임: 표지·마지막 장 큰 제목 등장 효과('pop' 글자 톡톡, 'type' 타자기) */
  titleFx?: 'pop' | 'type';
  /** 라임: 표지 제목 옆 종이 오림 스티커 물음표·느낌표 */
  hookMark?: '?' | '!';
  /** 라임: 배경 사진 흐림 정도(px, 0이면 선명). 글자가 더 깔끔하게 보이도록 */
  bgBlur?: number;
  hookDeco?: string;
  hookDecoPos?: 'tl' | 'tr' | 'bl' | 'br';
  ctaDeco?: string;
  ctaDecoPos?: 'tl' | 'tr' | 'bl' | 'br';
  accentColor?: string;
  status: 'pending' | 'confirmed';
  disclaimer_overlay?: string;
  caption?: string;
  hashtags?: string[];
  sources?: string[];
  verify_before_post?: string[];
};
