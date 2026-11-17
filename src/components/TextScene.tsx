import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Label} from './Label';
import {Words} from './Words';

export const TextScene: React.FC<{
  label?: string;
  text: string;
  accent: string;
  size?: number;
  hook?: boolean;
  /** true 면 큰 제목용 히피체, 아니면 Pretendard */
  title?: boolean;
  frames?: number;
}> = ({label, text, accent, size = 70, hook, title, frames}) => {
  const frame = useCurrentFrame();
  const out = frames ? interpolate(frame, [frames - 8, frames], [1, 0], {extrapolateLeft: 'clamp'}) : 1;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 80px 140px', opacity: out}}>
      <div style={{textAlign: 'center'}}>
        <Label text={label} accent={accent} />
        <Words
          text={text}
          accent={accent}
          startFrame={label ? 6 : 0}
          stagger={hook ? 4 : 3}
          style={{
            color: '#fff',
            ...(title
              ? {fontFamily: "'Hippie', 'Pretendard', sans-serif", fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.3, WebkitTextStroke: '0.035em currentColor'}
              : {fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.38}),
            fontSize: size,
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
