import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {parse} from '../components/Words';
import {BLUE, TITLE_FONT} from './theme';

type Seg = {text: string; accent: boolean; word: number};

/** 한 줄의 단어·조각을 "연속된 강조 구간은 하나의 칩, 나머지는 일반 글자"로 묶는다. */
const segments = (words: ReturnType<typeof parse>[number], base: number): Seg[] => {
  const out: Seg[] = [];
  words.forEach((w, wi) => {
    w.forEach((pc, pi) => {
      const last = out[out.length - 1];
      const joinSpace = pi === 0 && wi > 0;
      if (last && last.accent === pc.accent && (pi > 0 || (joinSpace && pc.accent && last.accent))) {
        last.text += (joinSpace ? ' ' : '') + pc.text;
      } else {
        out.push({text: (joinSpace ? ' ' : '') + pc.text, accent: pc.accent, word: base + wi});
      }
    });
  });
  return out;
};

/** 마커로 칠한 듯한 파란 띠 위에 흰 글자. 강조 구간은 흰 칩 + 파란 글자 */
export const CuteTitle: React.FC<{text: string; size?: number; startFrame?: number}> = ({text, size = 116, startFrame = 0}) => {
  const frame = useCurrentFrame();
  const lines = parse(text);
  let base = 0;
  return (
    <div style={{textAlign: 'center', wordBreak: 'keep-all'}}>
      {lines.map((words, li) => {
        const segs = segments(words, base);
        base += words.length;
        return (
          <div key={li}>
            <div
              style={{
                display: 'inline-block',
                background: BLUE,
                color: '#fff',
                padding: '0 30px 12px',
                borderRadius: 26,
                margin: '9px 0',
                transform: `rotate(${li % 2 ? 1.3 : -1.5}deg)`,
                fontFamily: TITLE_FONT,
                fontSize: size,
                lineHeight: 1.22,
                letterSpacing: '-0.01em',
                boxShadow: '0 12px 28px rgba(20,40,160,0.35)',
                whiteSpace: 'nowrap',
              }}
            >
              {segs.map((sg, k) => {
                const start = startFrame + sg.word * 4;
                const p = interpolate(frame, [start, start + 12], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.cubic),
                });
                return (
                  <span
                    key={k}
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'pre',
                      opacity: p,
                      transform: `translateY(${(1 - p) * 22}px)`,
                      ...(sg.accent ? {background: '#fff', color: BLUE, borderRadius: 22, padding: '0 18px', margin: '0 6px'} : {}),
                    }}
                  >
                    {sg.accent ? sg.text.trim() : sg.text}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
