import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, BG, FONT, INK, INK_ACCENT, STAR} from './theme';

/** 이모지·특수 기호를 지운다(라임 스타일은 이모지를 쓰지 않는다) */
export const clean = (t = ''): string =>
  t
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim();

/** 단계별로(8칸) 차오르는 진행률 0~1. 숫자와 게이지가 같이 쓴다 */
export const STEPS = 8;
export const stepP = (frame: number, from = 8, frames = 26) => {
  const t = interpolate(frame, [from, from + frames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return Math.min(1, Math.ceil(t * STEPS - 1e-6) / STEPS);
};

/** 숫자와 함께 칸씩 차오르는 게이지(ratio: 최종 채움 0~1) */
export const Gauge: React.FC<{ratio: number; w?: number; from?: number; frames?: number; style?: React.CSSProperties}> = ({ratio, w = 520, from = 8, frames = 26, style}) => {
  const frame = useCurrentFrame();
  const p = stepP(frame, from, frames);
  const h = 26;
  return (
    <div style={{width: w, height: h, borderRadius: h, background: 'rgba(255,255,255,0.28)', overflow: 'hidden', margin: '0 auto', ...style}}>
      <div style={{width: `${ratio * p * 100}%`, height: '100%', borderRadius: h, background: ACCENT}} />
    </div>
  );
};

/** 숫자가 0에서 올라가며 센다(첫 숫자 덩어리만). 쉼표가 있으면 쉼표를 살린다 */
export const CountText: React.FC<{text: string; from?: number; frames?: number}> = ({text, from = 8, frames = 26}) => {
  const frame = useCurrentFrame();
  const m = text.match(/\d[\d,]*(?:\.\d+)?/);
  if (!m || m.index === undefined) return <>{text}</>;
  const target = parseFloat(m[0].replace(/,/g, ''));
  const p = stepP(frame, from, frames);
  const val = Math.round(target * p);
  const shown = m[0].includes(',') ? val.toLocaleString('en-US') : String(val);
  return <>{text.slice(0, m.index)}{shown}{text.slice(m.index + m[0].length)}</>;
};

/** [[강조]] 는 라임색(marker면 형광펜 칠 + 어두운 글자), \n 은 줄바꿈. count면 강조 안의 숫자가 올라간다 */
const WROT = [-1.8, 1.3, -0.9, 1.9, -1.4, 1.1];
/** 큰 제목 글자마다 각도만 조금씩 다르게(과하지 않게) */
const Wob: React.FC<{t: string}> = ({t}) => (
  <>
    {[...t].map((c, i) =>
      c === ' ' ? <span key={i}> </span> : <span key={i} style={{display: 'inline-block', transform: `rotate(${WROT[i % 6]}deg)`}}>{c}</span>,
    )}
  </>
);

export const Rich: React.FC<{text: string; accent?: string; marker?: boolean; count?: boolean; wobble?: boolean}> = ({text, accent = ACCENT, marker, count, wobble}) => {
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
              if (!on) return <span key={i}>{wobble ? <Wob t={p} /> : p}</span>;
              const inner = count ? <CountText text={p} /> : p;
              return marker ? (
                <span key={i} style={{background: accent, color: INK, padding: '0 0.3em', margin: '0 0.1em', borderRadius: '0.22em', display: 'inline-block', transform: 'rotate(-1.2deg)', textShadow: 'none', lineHeight: 1.25}}>
                  {inner}
                </span>
              ) : (
                <span key={i} style={{color: accent}}>
                  {wobble && !count ? <Wob t={p} /> : inner}
                </span>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

/** 손으로 그은 듯한 물결 밑줄 */
export const Wave: React.FC<{w?: number; style?: React.CSSProperties; delay?: number}> = ({w = 260, style, delay = 14}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg width={w} height={26} viewBox="0 0 260 26" style={{display: 'block', transform: 'rotate(-1.2deg)', ...style}}>
      <path d="M4 14 Q 22 2 40 14 T 76 14 T 112 14 T 148 14 T 184 14 T 220 14 T 256 14" fill="none" stroke={ACCENT} strokeWidth={7} strokeLinecap="round" strokeDasharray={320} strokeDashoffset={320 * (1 - p)} />
    </svg>
  );
};

/** 등장: 아래에서 살짝 올라오며 나타난다 */
export const useIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return Math.max(spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 120}}), 0);
};

/** 통통 튀는 등장(살짝 넘쳤다가 돌아온다) */
export const useBounce = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return Math.max(spring({frame: frame - delay, fps, config: {damping: 8, stiffness: 150}}), 0);
};

export type ShapeKind = 'burst' | 'sparkle' | 'ring' | 'plus' | 'dots' | 'moon';
export const SHAPES: ShapeKind[] = ['sparkle', 'ring', 'burst', 'plus', 'dots', 'moon'];

/** 장식 도형(가로세로 비율 1:1, 찌그러지지 않게). 모양은 컷마다 돌려 쓴다 */
export const Star: React.FC<{w: number; kind?: ShapeKind; style?: React.CSSProperties; delay?: number}> = ({w, kind = 'burst', style, delay = 10}) => {
  const p = Math.min(useBounce(delay), 1.25);
  const frame = useCurrentFrame();
  const wig = Math.sin(frame / 9 + w) * 9;
  const bob = Math.sin(frame / 11 + w / 20) * 7;
  let body: React.ReactNode;
  if (kind === 'burst') {
    const n = 12;
    const pts: string[] = [];
    for (let k = 0; k < n * 2; k++) {
      const r = k % 2 === 0 ? 1 : 0.42;
      const a = (Math.PI * k) / n - Math.PI / 2;
      pts.push(`${(50 + 50 * r * Math.cos(a)).toFixed(2)},${(50 + 50 * r * Math.sin(a)).toFixed(2)}`);
    }
    body = <polygon points={pts.join(' ')} fill={STAR} />;
  } else if (kind === 'sparkle') {
    body = <path d="M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0 Z" fill={STAR} />;
  } else if (kind === 'ring') {
    body = <circle cx="50" cy="50" r="38" fill="none" stroke={STAR} strokeWidth="16" />;
  } else if (kind === 'plus') {
    body = (
      <>
        <rect x="38" y="4" width="24" height="92" rx="12" fill={STAR} />
        <rect x="4" y="38" width="92" height="24" rx="12" fill={STAR} />
      </>
    );
  } else if (kind === 'dots') {
    body = (
      <>
        <circle cx="20" cy="20" r="14" fill={STAR} />
        <circle cx="50" cy="50" r="14" fill={STAR} />
        <circle cx="80" cy="80" r="14" fill={STAR} />
      </>
    );
  } else {
    body = <path d="M70 6 A44 44 0 1 0 94 70 A34 34 0 1 1 70 6 Z" fill={STAR} />;
  }
  return (
    <svg width={w} height={w} viewBox="0 0 100 100" style={{position: 'absolute', opacity: Math.min(p, 1), transform: `translateY(${bob}px) scale(${0.5 + 0.5 * p}) rotate(${(1 - Math.min(p, 1)) * -40 + wig}deg)`, ...style}}>
      {body}
    </svg>
  );
};

/** 노선도 선: 겹친 둥근 노선 3개 + 정거장 동그라미(상경·이동 느낌). 화면 아래에서 잘린다 */
export const Track: React.FC<{style?: React.CSSProperties}> = ({style}) => {
  const lines = [0, 1, 2].map((i) => ({x: i * 70 + 2, y: 50 + i * 70, w: 1340 - i * 140 - 4, h: 560 - i * 140}));
  const stations: [number, number][] = [];
  lines.forEach((l, i) => {
    [0.18, 0.4, 0.62, 0.84].forEach((f) => stations.push([l.x + l.w * f, l.y]));
    if (i === 0) stations.push([l.x + l.w, l.y + l.h / 2], [l.x, l.y + l.h / 2]);
  });
  return (
    <svg width={1340} height={640} viewBox="0 0 1340 640" style={{position: 'absolute', ...style}}>
      {lines.map((l, i) => (
        <rect key={i} x={l.x} y={l.y} width={l.w} height={l.h} rx={l.h / 2} fill="none" stroke={ACCENT} strokeOpacity={0.75} strokeWidth={7} />
      ))}
      {stations.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={14} fill={BG} stroke={ACCENT} strokeWidth={6} />
      ))}
    </svg>
  );
};

/** 로고 자리: 계정 이름 글자(로고 파일이 없을 때) */
export const Wordmark: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) => (
  <div style={{position: 'absolute', color: ACCENT, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: -1, textShadow: '0 2px 14px rgba(0,0,0,0.7), 0 0 3px rgba(0,0,0,0.5)', ...style}}>{text}</div>
);

export const Check: React.FC<{size?: number; color?: string}> = ({size = 44, color = INK_ACCENT}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 12.5l5 5L20 6.5" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
