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

/** 라벨: 노란 포스트잇 */
export const Pill: React.FC<{text?: string; tilt?: number}> = ({text, tilt = -2}) => {
  const frame = useCurrentFrame();
  if (!text) return null;
  const p = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{height: 118, display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
      <div style={{opacity: p, transform: `translateY(${(1 - p) * 14}px) rotate(${tilt}deg)`}}>
        <LabelBox
          size={50}
          padX={40}
          padY={20}
          style={{background: POSTIT, color: BLUE, borderRadius: 8, boxShadow: '0 10px 18px rgba(20,30,80,0.26), inset 0 -10px 14px rgba(255,200,0,0.18)'}}
        >
          {text}
        </LabelBox>
      </div>
    </div>
  );
};

export const useFadeOut = (frames: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [frames - 4, frames], [1, 0], {extrapolateLeft: 'clamp'});
};

export const navyText: React.CSSProperties = {color: NAVY};
