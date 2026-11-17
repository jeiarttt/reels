import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import type {Bg} from '../types';

const isVideo = (bg: Bg) =>
  bg.type ? bg.type === 'video' : /\.(mp4|mov|webm|m4v)$/i.test(bg.src);

/** 배경 사진/영상 + 천천히 확대(켄 번즈) + 가독성용 어두운 오버레이 */
export const Background: React.FC<{bg?: Bg; frames: number; dim?: number}> = ({bg, frames, dim = 0.55}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, frames], [1.0, 1.09], {extrapolateRight: 'clamp'});
  const fade = interpolate(frame, [0, 8, frames - 8, frames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fill: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: bg?.position ?? 'center'};

  return (
    <AbsoluteFill style={{opacity: fade, backgroundColor: '#0b1020'}}>
      {bg && (
        <AbsoluteFill style={{transform: `scale(${scale})`}}>
          {isVideo(bg) ? (
            <OffthreadVideo src={staticFile(bg.src)} startFrom={Math.round((bg.startFrom ?? 0) * 30)} muted style={fill} />
          ) : (
            <Img src={staticFile(bg.src)} style={fill} />
          )}
        </AbsoluteFill>
      )}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(6,10,24,${dim}) 0%, rgba(6,10,24,${Math.min(
            dim + 0.14,
            0.6,
          )}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
