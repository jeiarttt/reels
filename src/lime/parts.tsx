import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, FONT, STAR} from './theme';

/** 이모지·특수 기호를 지운다(라임 스타일은 이모지를 쓰지 않는다) */
export const clean = (t = ''): string =>
  t
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim();

/** [[강조]] 는 라임색, \n 은 줄바꿈 */
export const Rich: React.FC<{text: string; accent?: string}> = ({text, accent = ACCENT}) => {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        const parts = line.split(/(\[\[|\]\])/);
        let on = false;
        return (
          <div key={li}>
            {parts.map((p, i) => {
              if (p === '[[') {
                on = true;
                return null;
              }
              if (p === ']]') {
                on = false;
                return null;
              }
              return (
                <span key={i} style={on ? {color: accent} : undefined}>
                  {p}
                </span>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

/** 등장: 아래에서 살짝 올라오며 나타난다 */
export const useIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return Math.max(spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 120}}), 0);
};

/** 뾰족한 별(스파클). 가로 w, 세로는 w*1.27 */
export const Star: React.FC<{w: number; style?: React.CSSProperties; delay?: number}> = ({w, style, delay = 10}) => {
  const p = useIn(delay);
  const h = Math.round(w * 1.27);
  const n = 12;
  const pts: string[] = [];
  for (let k = 0; k < n * 2; k++) {
    const r = k % 2 === 0 ? 1 : 0.42;
    const a = (Math.PI * k) / n - Math.PI / 2;
    pts.push(`${(50 + 50 * r * Math.cos(a)).toFixed(2)},${(64 + 64 * r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg width={w} height={h} viewBox="0 0 100 128" style={{position: 'absolute', opacity: Math.min(p, 1), transform: `scale(${0.6 + 0.4 * Math.min(p, 1)}) rotate(${(1 - Math.min(p, 1)) * -40}deg)`, ...style}}>
      <polygon points={pts.join(' ')} fill={STAR} />
    </svg>
  );
};

/** 겹친 둥근 선(트랙). 노선도처럼 이어지는 선 모양 */
export const Track: React.FC<{style?: React.CSSProperties}> = ({style}) => (
  <svg width={1340} height={665} viewBox="0 0 1340 665" style={{position: 'absolute', ...style}}>
    {[0, 1, 2, 3, 4].map((i) => {
      const h = 620 - i * 90;
      return <rect key={i} x={i * 45 + 1.25} y={45 + i * 45} width={1340 - i * 90 - 2.5} height={h} rx={h / 2} fill="none" stroke={ACCENT} strokeOpacity={0.39} strokeWidth={2.5} />;
    })}
  </svg>
);

/** 로고 자리: 계정 이름 글자(로고 파일이 없을 때) */
export const Wordmark: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) => (
  <div style={{position: 'absolute', color: ACCENT, fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: -1, ...style}}>{text}</div>
);

export const Check: React.FC<{size?: number}> = ({size = 44}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 12.5l5 5L20 6.5" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
