export type Bg = {
  /** public/ 기준 경로. 예: "stock/seoul-dusk.jpg" 또는 "user/내영상.mp4" */
  src: string;
  /** 생략하면 확장자로 판단 (mp4/mov/webm = video) */
  type?: 'image' | 'video';
  /** 영상 재생 시작 지점(초) */
  startFrom?: number;
};

export type CardItem = {big: string; small?: string};
export type TableData = {head: string[]; rows: string[][]};

export type Scene = {
  t: number;
  kind?: 'text' | 'cards' | 'table';
  label?: string;
  text?: string;
  cards?: CardItem[];
  table?: TableData;
  bg?: Bg;
};

export type Script = {
  id: string;
  mode: 'card_news';
  style?: 'photo';
  /** 내가 준 이미지/영상으로 전체 배경을 덮어쓸 때. public/user/ 에 넣고 "user/파일명" */
  backgroundSrc?: string;
  hookLabel?: string;
  hook: string;
  hookBg?: Bg;
  scenes: Scene[];
  ctaLabel?: string;
  cta: string;
  ctaBg?: Bg;
  accentColor?: string;
  status: 'pending' | 'confirmed';
  disclaimer_overlay?: string;
  caption?: string;
  hashtags?: string[];
  sources?: string[];
  verify_before_post?: string[];
};
