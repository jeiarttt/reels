import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Disclaimer: React.FC<{text: string}> = ({text}) => (
  <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150}}>
    <div
      style={{
        color: 'rgba(255,255,255,0.85)',
        fontSize: 30,
        fontWeight: 700,
        background: 'rgba(0,0,0,0.38)',
        padding: '10px 26px',
        borderRadius: 999,
        wordBreak: 'keep-all',
      }}
    >
      {text}
    </div>
  </AbsoluteFill>
);
