import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Label} from './Label';
import {Words, wordCount} from './Words';
import {Disclaimer} from './Disclaimer';

/**
 * 표지(첫 화면): 위에 채널 태그, 아래쪽에 큰 제목 + 강조 줄, 맨 아래에 면책 문구.
 * 사진이 위쪽에 넓게 보이고, 제목이 앉는 아래쪽에는 그라데이션을 깔아 읽기 쉽게 한다.
 */
export const CoverScene: React.FC<{
  label?: string;
  text: string;
  brand?: string;
  disclaimer?: string;
  accent: string;
  size?: number;
}> = ({label, text, brand, disclaimer, accent, size = 128}) => {
  const frame = useCurrentFrame();
  const tagP = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const wordsEnd = (label ? 6 : 0) + wordCount(text) * 4 + 12;
  const barW = interpolate(frame, [wordsEnd, wordsEnd + 14], [0, 150], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      {/* 제목이 앉는 아래쪽을 받쳐 주는 그라데이션 */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(0deg, rgba(6,10,24,0.62) 0%, rgba(6,10,24,0.34) 38%, rgba(6,10,24,0) 62%)',
        }}
      />

      {brand && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 150}}>
          <div
            style={{
              opacity: tagP,
              transform: `translateY(${(1 - tagP) * -12}px)`,
              padding: '14px 34px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.88)',
              color: '#1b2236',
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            {brand}
          </div>
        </AbsoluteFill>
      )}

      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', padding: '0 70px 330px'}}>
        <div style={{textAlign: 'center'}}>
          <Label text={label} accent={accent} />
          <Words
            text={text}
            accent={accent}
            startFrame={label ? 6 : 0}
            stagger={4}
            style={{
              color: '#fff',
              fontFamily: "'Hippie', 'Pretendard', sans-serif",
              fontWeight: 400,
              WebkitTextStroke: '0.035em currentColor',
              letterSpacing: '-0.01em',
              fontSize: size,
              lineHeight: 1.3,
              textShadow: '0 4px 28px rgba(0,0,0,0.6)',
            }}
          />
          <div
            style={{
              margin: '44px auto 0',
              height: 12,
              width: barW,
              borderRadius: 6,
              background: accent,
            }}
          />
        </div>
      </AbsoluteFill>

      {disclaimer && <Disclaimer text={disclaimer} />}
    </AbsoluteFill>
  );
};
