import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BLUE, NAVY, TITLE_FONT} from './theme';

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
    <div
      style={{
        position: 'absolute',
        transform: `rotate(${rotate}deg) scale(${Math.max(s, 0)})`,
        background: BLUE,
        color: '#fff',
        border: '6px solid #fff',
        borderRadius: 40,
        padding: '6px 28px 14px',
        fontFamily: TITLE_FONT,
        fontSize: 54,
        boxShadow: '0 10px 24px rgba(20,40,120,0.3)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** 라벨 알약 */
export const Pill: React.FC<{text?: string; tilt?: number}> = ({text, tilt = -2}) => {
  const frame = useCurrentFrame();
  if (!text) return null;
  const p = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{height: 118, display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
      <div
        style={{
          opacity: p,
          transform: `translateY(${(1 - p) * 14}px) rotate(${tilt}deg)`,
          background: '#fff',
          color: BLUE,
          border: `5px solid ${BLUE}`,
          borderRadius: 999,
          padding: '10px 36px',
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: -0.5,
          boxShadow: '0 8px 20px rgba(20,40,120,0.2)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const useFadeOut = (frames: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [frames - 4, frames], [1, 0], {extrapolateLeft: 'clamp'});
};

export const navyText: React.CSSProperties = {color: NAVY};
