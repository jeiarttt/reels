import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import type {TableData} from '../types';
import {Label} from './Label';
import {Words, wordCount} from './Words';

/** 비교표: 머리글 → 행이 위에서부터 차례로 등장 */
export const TableScene: React.FC<{
  label?: string;
  text?: string;
  table: TableData;
  accent: string;
  frames: number;
}> = ({label, text, table, accent, frames}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [frames - 8, frames], [1, 0], {extrapolateLeft: 'clamp'});
  const base = text ? 6 + wordCount(text) * 3 + 8 : 6;
  const cols = table.head.length;
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: cols === 3 ? '0.8fr 1.25fr 1fr' : `repeat(${cols}, 1fr)`,
  };
  const reveal = (s: number) => {
    const p = interpolate(frame, [s, s + 12], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
    return {opacity: p, transform: `translateY(${(1 - p) * 20}px)`};
  };
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 56px 140px', opacity: out}}>
      <div style={{width: '100%', textAlign: 'center'}}>
        <Label text={label} accent={accent} />
        {text && (
          <Words
            text={text}
            accent={accent}
            startFrame={6}
            style={{color: '#fff', fontFamily: "'Hippie', 'Pretendard', sans-serif", fontWeight: 400, WebkitTextStroke: '0.035em currentColor', letterSpacing: '-0.01em', fontSize: 72, lineHeight: 1.35, marginBottom: 44, textShadow: '0 4px 24px rgba(0,0,0,.5)'}}
          />
        )}
        <div style={{borderRadius: 32, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.28)', background: 'rgba(8,12,28,0.55)'}}>
          <div style={{...grid, ...reveal(base), background: accent, color: '#101522', fontWeight: 900, fontSize: 38}}>
            {table.head.map((h, i) => (
              <div key={i} style={{padding: '24px 16px', wordBreak: 'keep-all'}}>{h}</div>
            ))}
          </div>
          {table.rows.map((r, ri) => (
            <div
              key={ri}
              style={{
                ...grid,
                ...reveal(base + 10 + ri * 9),
                borderTop: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: 38,
                lineHeight: 1.35,
              }}
            >
              {r.map((c, ci) => (
                <div
                  key={ci}
                  style={{
                    padding: '26px 16px',
                    wordBreak: 'keep-all',
                    whiteSpace: 'pre-line',
                    fontWeight: ci === 0 ? 900 : 700,
                    color: ci === 0 ? accent : '#fff',
                    opacity: c === '미공고' ? 0.75 : 1,
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
