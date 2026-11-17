import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const BLUE = '#2457F5';
const NAVY = '#13213F';
const LIGHT = '#DDEBFF';
const YELLOW = '#FFD84D';
const CORAL = '#FF7A8A';
const MINT = '#5ED6B8';

/** 주제에 어울리는 납작한 일러스트들 (200×200). 흰 테두리(스티커 느낌)는 필터로 둘러준다. */
const ART: Record<string, (text?: string) => React.ReactNode> = {
  phone: () => (
    <g>
      <rect x={58} y={12} width={84} height={176} rx={20} fill={NAVY} />
      <rect x={66} y={28} width={68} height={144} rx={10} fill="#fff" />
      <rect x={90} y={17} width={20} height={6} rx={3} fill="#3a4a7a" />
      <rect x={76} y={58} width={48} height={32} rx={6} fill={BLUE} />
      <rect x={76} y={68} width={48} height={7} fill={NAVY} opacity={0.35} />
      <circle cx={100} cy={128} r={17} fill={MINT} />
      <polyline points="91,128 98,136 111,120" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  card: () => (
    <g>
      <rect x={14} y={42} width={172} height={116} rx={16} fill={BLUE} />
      <rect x={14} y={68} width={172} height={22} fill={NAVY} />
      <rect x={30} y={102} width={32} height={24} rx={5} fill={YELLOW} />
      <rect x={78} y={110} width={58} height={8} rx={4} fill="#fff" opacity={0.85} />
      <rect x={78} y={126} width={36} height={8} rx={4} fill="#fff" opacity={0.6} />
    </g>
  ),
  train: () => (
    <g>
      <rect x={52} y={14} width={96} height={12} rx={6} fill={NAVY} />
      <rect x={32} y={26} width={136} height={138} rx={34} fill={BLUE} />
      <rect x={52} y={46} width={96} height={56} rx={14} fill={LIGHT} />
      <rect x={32} y={108} width={136} height={10} fill="#fff" opacity={0.85} />
      <circle cx={68} cy={136} r={10} fill={YELLOW} />
      <circle cx={132} cy={136} r={10} fill={YELLOW} />
      <rect x={48} y={168} width={104} height={9} rx={4} fill="#B7C3E4" />
    </g>
  ),
  coin: () => (
    <g>
      <circle cx={100} cy={100} r={78} fill={YELLOW} />
      <circle cx={100} cy={100} r={58} fill="none" stroke="#FFB800" strokeWidth={9} />
      <text x={100} y={127} textAnchor="middle" fontSize={84} fontWeight={900} fill="#E59A00" fontFamily="Pretendard, sans-serif">
        ₩
      </text>
    </g>
  ),
  calendar: (text = '16') => (
    <g>
      <rect x={28} y={36} width={144} height={136} rx={18} fill="#fff" />
      <path d="M28 54 a18 18 0 0 1 18 -18 h108 a18 18 0 0 1 18 18 v28 h-144z" fill={CORAL} />
      <rect x={62} y={22} width={14} height={30} rx={7} fill={NAVY} />
      <rect x={124} y={22} width={14} height={30} rx={7} fill={NAVY} />
      <text x={100} y={146} textAnchor="middle" fontSize={62} fontWeight={900} fill={NAVY} fontFamily="Pretendard, sans-serif">
        {text}
      </text>
    </g>
  ),
  cap: () => (
    <g>
      <path d="M48 104 v38 q52 34 104 0 v-38z" fill="#3A5BD0" />
      <polygon points="100,38 188,82 100,126 12,82" fill={NAVY} />
      <line x1={170} y1={86} x2={170} y2={140} stroke={YELLOW} strokeWidth={7} strokeLinecap="round" />
      <circle cx={170} cy={146} r={9} fill={YELLOW} />
    </g>
  ),
  house: () => (
    <g>
      <rect x={134} y={40} width={18} height={40} fill={NAVY} />
      <polygon points="100,26 186,96 14,96" fill={CORAL} />
      <rect x={36} y={94} width={128} height={82} fill="#fff" />
      <rect x={84} y={126} width={32} height={50} rx={5} fill={BLUE} />
      <rect x={48} y={110} width={26} height={26} rx={4} fill={LIGHT} />
      <rect x={126} y={110} width={26} height={26} rx={4} fill={LIGHT} />
    </g>
  ),
  ticket: () => (
    <g>
      <rect x={14} y={52} width={172} height={96} rx={14} fill={YELLOW} />
      <circle cx={14} cy={100} r={13} fill="#7FB0F0" opacity={0} />
      <line x1={136} y1={60} x2={136} y2={140} stroke="#E59A00" strokeWidth={5} strokeDasharray="8 8" />
      <polygon points="76,72 85,94 108,95 90,110 96,132 76,119 56,132 62,110 44,95 67,94" fill={NAVY} />
      <rect x={146} y={84} width={28} height={7} rx={3} fill="#E59A00" />
      <rect x={146} y={100} width={20} height={7} rx={3} fill="#E59A00" />
    </g>
  ),
  briefcase: () => (
    <g>
      <path d="M72 70 v-18 q0 -10 10 -10 h36 q10 0 10 10 v18" fill="none" stroke={NAVY} strokeWidth={12} strokeLinecap="round" />
      <rect x={22} y={68} width={156} height={102} rx={18} fill={BLUE} />
      <rect x={22} y={104} width={156} height={10} fill="#fff" opacity={0.35} />
      <rect x={88} y={96} width={24} height={26} rx={6} fill={YELLOW} />
    </g>
  ),
  book: () => (
    <g>
      <rect x={12} y={50} width={176} height={116} rx={12} fill={BLUE} />
      <path d="M100 64 Q62 48 26 62 V148 Q62 134 100 150Z" fill="#fff" />
      <path d="M100 64 Q138 48 174 62 V148 Q138 134 100 150Z" fill="#F3F7FF" />
      <line x1={100} y1={64} x2={100} y2={150} stroke="#B7C3E4" strokeWidth={4} />
      <rect x={40} y={80} width={46} height={7} rx={3} fill="#B7C3E4" />
      <rect x={40} y={96} width={36} height={7} rx={3} fill="#B7C3E4" />
      <rect x={116} y={80} width={46} height={7} rx={3} fill="#B7C3E4" />
    </g>
  ),
};

export const ILLUST_NAMES = Object.keys(ART);

/** 일러스트: 통통 튀며 등장하고 살짝 흔들린다. 흰 테두리 + 그림자(스티커 느낌) */
export const Illust: React.FC<{name: string; size?: number; rotate?: number; text?: string; delay?: number; style?: React.CSSProperties}> = ({
  name,
  size = 300,
  rotate = 0,
  text,
  delay = 14,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 9, stiffness: 140}});
  const bob = Math.sin(frame / 10) * 6;
  const art = ART[name];
  if (!art) return null;
  const id = `ol-${name}`;
  return (
    <div style={{position: 'absolute', width: size, height: size, transform: `translateY(${bob}px) rotate(${rotate + Math.sin(frame / 15) * 2}deg) scale(${Math.max(s, 0)})`, transformOrigin: '50% 80%', ...style}}>
      <svg viewBox="0 0 200 200" width={size} height={size} style={{overflow: 'visible', filter: 'drop-shadow(0 10px 14px rgba(10,20,80,0.32))'}}>
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" operator="dilate" radius={5} result="d" />
            <feFlood floodColor="#fff" result="w" />
            <feComposite in="w" in2="d" operator="in" result="o" />
            <feMerge>
              <feMergeNode in="o" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter={`url(#${id})`}>{art(text)}</g>
      </svg>
    </div>
  );
};
