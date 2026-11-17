import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

export const Label: React.FC<{text?: string; accent: string}> = ({text, accent}) => {
  const frame = useCurrentFrame();
  if (!text) return null;
  const p = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        display: 'inline-block',
        padding: '10px 28px',
        borderRadius: 999,
        background: accent,
        color: '#101522',
        fontWeight: 900,
        fontSize: 36,
        marginBottom: 36,
      }}
    >
      {text}
    </div>
  );
};
