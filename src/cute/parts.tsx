import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BLUE, HIPPIE_SHIFT_EM, NAVY, PAPER, PAPER_SHADOW, POSTIT, TITLE_FONT} from './theme';

/**
 * 라벨 상자: 줄 높이 1 + 위아래 대칭 여백 + 히피체 보정 → 글자가 도형 한가운데 온다.
 * (모든 라벨·태그는 이 상자를 쓴다. 높이를 바깥에서 늘리지 않는다.)
 */
export const LabelBox: React.FC<{
  size: number;
  padX: number;
  padY: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({size, padX, padY, style, children}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${padY}px ${padX}px`,
      fontFamily: TITLE_FONT,
      fontSize: size,
      fontWeight: 400,
      lineHeight: 1,
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    <span style={{display: 'inline-block', lineHeight: 1, transform: `translateY(${size * HIPPIE_SHIFT_EM}px)`}}>{children}</span>
  </div>
);

/** 상단 진행 점 (현재 페이지 / 전체) */
export const ProgressDots: React.FC<{index: number; total: number}> = ({index, total}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 92, pointerEvents: 'none'}}>
    <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
      {Array.from({length: total}).map((_, i) => (
        <div
          key={i}
          style={{
            height: 16,
            width: i === index ? 52 : 16,
            borderRadius: 8,
            background: i === index ? BLUE : 'rgba(255,255,255,0.85)',
            border: i === index ? '3px solid #fff' : 'none',
            boxShadow: '0 3px 10px rgba(20,40,120,0.25)',
          }}
        />
      ))}
    </div>
  </AbsoluteFill>
);

/** 동그란 스티커 사진: 통통 튀며 등장하고 계속 살짝 흔들린다 */
export const StickerImg: React.FC<{
  name: string;
  size: number;
  rotate?: number;
  style?: React.CSSProperties;
  delay?: number;
}> = ({name, size, rotate = 0, style, delay = 8}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 9, stiffness: 150}});
  const bob = Math.sin(frame / 9) * 7;
  const wob = Math.sin(frame / 14) * 2.2;
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        transform: `translateY(${bob}px) rotate(${rotate + wob}deg) scale(${Math.max(s, 0)})`,
        transformOrigin: '50% 90%',
        ...style,
      }}
    >
      <Img
        src={staticFile(`stickers/${name}.png`)}
        style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 12px 18px rgba(20,40,120,0.38))'}}
      />
    </div>
  );
};

/** 의성어 말풍선 태그 (예: "헉!", "냠냠") */
export const Sfx: React.FC<{text: string; rotate?: number; style?: React.CSSProperties; delay?: number}> = ({
  text,
  rotate = -8,
  style,
  delay = 16,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 8, stiffness: 170}});
  return (
    <div style={{position: 'absolute', transform: `rotate(${rotate}deg) scale(${Math.max(s, 0)})`, ...style}}>
      <LabelBox
        size={54}
        padX={30}
        padY={16}
        style={{background: BLUE, color: '#fff', border: '6px solid #fff', borderRadius: 40, boxShadow: '0 10px 24px rgba(20,40,120,0.3)'}}
      >
        {text}
      </LabelBox>
    </div>
  );
};

/** 마스킹 테이프(와시테이프): 줄무늬 + 톱니 끝 */
export const Washi: React.FC<{style?: React.CSSProperties; rotate?: number; w?: number; tone?: 'blue' | 'pink' | 'yellow'}> = ({
  style,
  rotate = -4,
  w = 190,
  tone = 'blue',
}) => {
  const c = tone === 'blue' ? 'rgba(36,87,245,0.42)' : tone === 'pink' ? 'rgba(255,120,160,0.5)' : 'rgba(255,214,64,0.62)';
  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        height: 50,
        background: `repeating-linear-gradient(45deg, ${c} 0 12px, rgba(255,255,255,0.55) 12px 24px)`,
        transform: `rotate(${rotate}deg)`,
        clipPath: 'polygon(0 0,4% 12%,0 25%,4% 38%,0 50%,4% 62%,0 75%,4% 88%,0 100%,100% 100%,96% 88%,100% 75%,96% 62%,100% 50%,96% 38%,100% 25%,96% 12%,100% 0)',
        filter: 'drop-shadow(0 3px 4px rgba(20,30,80,0.2))',
        ...style,
      }}
    />
  );
};

/** 컷 번호 동그라미 (다이어리 페이지 번호) */
export const NumTag: React.FC<{n: number; style?: React.CSSProperties}> = ({n, style}) => (
  <div style={{position: 'absolute', ...style}}>
    <LabelBox
      size={52}
      padX={0}
      padY={0}
      style={{width: 88, height: 88, borderRadius: '50%', background: BLUE, color: '#fff', border: '6px solid #fff', boxShadow: '0 8px 18px rgba(20,30,80,0.3)'}}
    >
      {n}
    </LabelBox>
  </div>
);

/** 줄 노트 종이: 크림색 + 파란 가로줄 + 테이프 두 조각 */
export const Paper: React.FC<{
  children: React.ReactNode;
  tilt?: number;
  lineGap?: number;
  linePad?: number;
  pad?: string;
  pop?: number;
  num?: number;
  style?: React.CSSProperties;
}> = ({children, tilt = -1, lineGap, linePad = 0, pad = '56px 48px 60px', pop = 1, num, style}) => (
  <div
    style={{
      position: 'relative',
      background: PAPER,
      backgroundImage: lineGap
        ? `repeating-linear-gradient(to bottom, transparent 0 ${lineGap - 3}px, rgba(36,87,245,0.20) ${lineGap - 3}px ${lineGap}px)`
        : undefined,
      backgroundPosition: `0 ${linePad}px`,
      borderRadius: 14,
      padding: pad,
      boxShadow: PAPER_SHADOW,
      transform: `translateY(${(1 - pop) * 44}px) rotate(${tilt}deg)`,
      opacity: Math.min(pop, 1),
      ...style,
    }}
  >
    <Washi style={{left: 36, top: -26}} rotate={-6} />
    <Washi style={{right: 36, top: -26}} rotate={5} tone="yellow" w={150} />
    {num !== undefined && <NumTag n={num} style={{left: -22, top: -44}} />}
    {children}
  </div>
);

/** 라벨: 파란 말풍선 (꼬리 달림) */
export const Pill: React.FC<{text?: string; tilt?: number; align?: 'center' | 'left'}> = ({text, tilt = -2, align = 'center'}) => {
  const frame = useCurrentFrame();
  if (!text) return null;
  const p = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{height: 132, display: 'flex', justifyContent: align === 'left' ? 'flex-start' : 'center', alignItems: 'flex-start', paddingLeft: align === 'left' ? 90 : 0}}>
      <div style={{position: 'relative', opacity: p, transform: `translateY(${(1 - p) * 14}px) rotate(${tilt}deg)`}}>
        <div style={{position: 'absolute', left: 64, bottom: -14, width: 44, height: 44, background: BLUE, borderRadius: 8, transform: 'rotate(45deg)'}} />
        <LabelBox
          size={52}
          padX={44}
          padY={22}
          style={{position: 'relative', background: BLUE, color: '#fff', borderRadius: 46, boxShadow: '0 10px 22px rgba(10,20,80,0.32)'}}
        >
          {text}
        </LabelBox>
      </div>
    </div>
  );
};

/** 어두운 알약 태그 (작은 분류 표시) */
export const NavyTag: React.FC<{text: string; tilt?: number; size?: number}> = ({text, tilt = -1.5, size = 44}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 12}px) rotate(${tilt}deg)`}}>
      <LabelBox size={size} padX={42} padY={18} style={{background: NAVY, color: '#E6EEFF', borderRadius: 999, boxShadow: '0 8px 18px rgba(10,20,60,0.3)'}}>
        {text}
      </LabelBox>
    </div>
  );
};

type DoodleKind = 'sparkle' | 'heart' | 'swirl' | 'arrow' | 'star';
const DOODLES: Record<DoodleKind, {d: string; vb: string}> = {
  sparkle: {d: 'M50 8V92 M13 29L87 71 M13 71L87 29', vb: '0 0 100 100'},
  heart: {d: 'M50 88 C12 60 8 30 30 20 C42 15 50 26 50 32 C50 26 58 15 70 20 C92 30 88 60 50 88Z', vb: '0 0 100 100'},
  swirl: {d: 'M6 34 C26 6 44 60 68 30 S104 12 124 34', vb: '0 0 130 70'},
  arrow: {d: 'M6 54 C36 14 76 84 116 40 M96 22 L118 40 L94 56', vb: '0 0 130 90'},
  star: {d: 'M50 10 L61 38 L91 40 L68 59 L76 88 L50 72 L24 88 L32 59 L9 40 L39 38Z', vb: '0 0 100 100'},
};

/** 손으로 그린 듯한 흰 선 낙서. 선을 그리는 효과 대신 부드럽게 커지며 나타난다(점·깨짐 방지) */
export const Doodle: React.FC<{kind: DoodleKind; size?: number; rotate?: number; delay?: number; style?: React.CSSProperties}> = ({
  kind,
  size = 96,
  rotate = 0,
  delay = 12,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = Math.max(spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 120}}), 0);
  const dd = DOODLES[kind];
  return (
    <svg
      viewBox={dd.vb}
      width={size}
      height={size}
      style={{
        position: 'absolute',
        overflow: 'visible',
        opacity: Math.min(pop * 1.4, 1),
        transform: `rotate(${rotate}deg) scale(${0.6 + 0.4 * pop})`,
        filter: 'drop-shadow(0 3px 6px rgba(10,20,60,0.4))',
        ...style,
      }}
    >
      <path d={dd.d} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const useFadeOut = (frames: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [frames - 4, frames], [1, 0], {extrapolateLeft: 'clamp'});
};

export const navyText: React.CSSProperties = {color: NAVY};
