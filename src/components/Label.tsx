import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

/** 모든 장면에서 라벨·제목이 시작하는 위치를 같게 맞춘다(화면 정중앙보다 조금 위). */
export const LABEL_TOP = 560;
/** 라벨 칸 높이. 라벨이 없는 장면도 같은 높이를 비워 제목 시작 위치를 동일하게 유지한다. */
export const LABEL_SLOT = 120;

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
        padding: '12px 32px',
        borderRadius: 999,
        background: accent,
        color: '#101522',
        fontWeight: 900,
        fontSize: 40,
      }}
    >
      {text}
    </div>
  );
};

export const LabelSlot: React.FC<{text?: string; accent: string}> = ({text, accent}) => (
  <div style={{height: LABEL_SLOT, display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
    <Label text={text} accent={accent} />
  </div>
);
