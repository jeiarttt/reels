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

export type Scene = {
  t: number;
  kind?: 'text' | 'cards' | 'table';
  /** 귀여운 테마: 밝은 배경이면 'dark'(진한 남색 글자). 기본 'light'(흰 글자) */
  tone?: 'light' | 'dark';
  label?: string;
  /** 귀여운 테마: stickers/ 안 파일 이름(확장자 제외)과 의성어 태그 */
  sticker?: string;
  sfx?: string;
  text?: string;
  cards?: CardItem[];
  table?: TableData;
  bg?: Bg;
};

export type Script = {
  id: string;
  mode: 'card_news';
  /** 'cute' 면 귀여운 디자인(스티커·말풍선·이모지 카드)으로 렌더 */
  theme?: 'cute';
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
  hook: string;
  hookBg?: Bg;
  scenes: Scene[];
  ctaLabel?: string;
  cta: string;
  ctaBg?: Bg;
  /** 귀여운 테마: 배경 어둡기(0~0.6). 밝은 사진이면 낮춘다. 기본 0.3 */
  bgDim?: number;
  accentColor?: string;
  status: 'pending' | 'confirmed';
  disclaimer_overlay?: string;
  caption?: string;
  hashtags?: string[];
  sources?: string[];
  verify_before_post?: string[];
};
