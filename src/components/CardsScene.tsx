import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import type {CardItem} from '../types';
import {Label} from './Label';
import {Words, wordCount} from './Words';

/** 요약 카드: 핵심 숫자 3~4개를 카드로 하나씩 등장 */
export const CardsScene: React.FC<{
  label?: string;
  text?: string;
  cards: CardItem[];
  accent: string;
  frames: number;
}> = ({label, text, cards, accent, frames}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [frames - 8, frames], [1, 0], {extrapolateLeft: 'clamp'});
  const titleEnd = text ? 6 + wordCount(text) * 3 + 10 : 6;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 70px 140px', opacity: out}}>
      <div style={{width: '100%', textAlign: 'center'}}>
        <Label text={label} accent={accent} />
        {text && (
          <Words
            text={text}
            accent={accent}
            startFrame={6}
            style={{color: '#fff', fontWeight: 900, fontSize: 60, lineHeight: 1.35, marginBottom: 48, textShadow: '0 4px 24px rgba(0,0,0,.5)'}}
          />
        )}
        <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
          {cards.map((c, i) => {
            const s = titleEnd + i * 10;
            const p = interpolate(frame, [s, s + 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px) scale(${0.97 + 0.03 * p})`,
                  background: '#ffffff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                  borderRadius: 36,
                  padding: '34px 40px',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 24,
                  wordBreak: 'keep-all',
                  textAlign: 'left',
                }}
              >
                <span style={{color: accent, fontWeight: 900, fontSize: 80, letterSpacing: -2, whiteSpace: 'nowrap'}}>
                  {c.big}
                </span>
                {c.small && (
                  <span style={{color: '#1b2236', fontWeight: 700, fontSize: 40, textAlign: 'right'}}>{c.small}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
