import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

type Piece = {text: string; accent: boolean};
type Word = Piece[];

/**
 * 텍스트를 "단어(공백 기준)" 단위로 쪼갠다.
 * - \n 은 강제 줄바꿈, [[ ]] 안은 포인트 컬러.
 * - 한 단어는 절대 중간에서 끊기지 않는다(조사 포함: "[[20만 원]]을" → "원을"이 한 덩어리).
 */
export const parse = (text: string): Word[][] =>
  text.split('\n').map((line) => {
    const words: Word[] = [];
    let cur: Word = [];
    let accent = false;
    for (const tok of line.match(/\[\[|\]\]|\s+|[^\s\[\]]+/g) ?? []) {
      if (tok === '[[') accent = true;
      else if (tok === ']]') accent = false;
      else if (/^\s+$/.test(tok)) {
        if (cur.length) words.push(cur);
        cur = [];
      } else cur.push({text: tok, accent});
    }
    if (cur.length) words.push(cur);
    return words;
  });

/** 단어가 하나씩 아래에서 살짝 올라오며 나타남. 과하지 않게 짧은 간격·작은 이동량. */
export const Words: React.FC<{
  text: string;
  accent: string;
  startFrame?: number;
  stagger?: number;
  style?: React.CSSProperties;
  accentStyle?: React.CSSProperties;
}> = ({text, accent, startFrame = 0, stagger = 3, style, accentStyle}) => {
  const frame = useCurrentFrame();
  let idx = 0;
  const lines = parse(text);

  return (
    <div
      style={{
        // 단어 단위 줄바꿈: 한글을 글자 중간에서 끊지 않는다
        wordBreak: 'keep-all',
        overflowWrap: 'normal',
        lineBreak: 'strict',
        textAlign: 'center',
        ...style,
      }}
    >
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, wi) => {
            const start = startFrame + idx * stagger;
            idx += 1;
            const p = interpolate(frame, [start, start + 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            return (
              <React.Fragment key={wi}>
                <span
                  style={{
                    display: 'inline-block',
                    opacity: p,
                    transform: `translateY(${(1 - p) * 22}px)`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {w.map((pc, pi) => (
                    <span key={pi} style={pc.accent ? {color: accent, ...accentStyle} : undefined}>
                      {pc.text}
                    </span>
                  ))}
                </span>{' '}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const wordCount = (text: string) => parse(text).reduce((a, l) => a + l.length, 0);
