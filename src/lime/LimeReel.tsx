import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {Bg, Script} from '../types';
import {Background} from '../components/Background';
import {ctaSecOf, FPS, hookSecOf} from '../Root';
import {LimeCover, LimeCta, LimeScene} from './scenes';
import {BG, FONT} from './theme';

const pick = (script: Script, bg?: Bg): Bg | undefined => (script.backgroundSrc ? {src: script.backgroundSrc} : bg);

/** 라임 테마: 어두운 단색 배경의 정보 컷 + 사진(영상) 표지. 스티커·말풍선 없이 별과 트랙만 쓴다. */
export const LimeReel: React.FC<{script: Script}> = ({script}) => {
  const hookFrames = Math.round(hookSecOf(script) * FPS);
  const ctaFrames = Math.round(ctaSecOf(script) * FPS);
  const total = script.scenes.length + 2;
  let cursor = 0;
  const blocks: React.ReactNode[] = [];

  blocks.push(
    <Sequence key="hook" from={cursor} durationInFrames={hookFrames}>
      <Background bg={pick(script, script.hookBg)} frames={hookFrames} dim={0} veil={0} fade={3} />
      <LimeCover frames={hookFrames} label={script.hookLabel} text={script.hook} brand={script.brand} />
    </Sequence>,
  );
  cursor += hookFrames;

  script.scenes.forEach((s, i) => {
    const frames = Math.round(s.t * FPS);
    blocks.push(
      <Sequence key={`s${i}`} from={cursor} durationInFrames={frames}>
        <LimeScene s={s} frames={frames} index={i + 1} total={total - 1} brand={script.brand} />
      </Sequence>,
    );
    cursor += frames;
  });

  blocks.push(
    <Sequence key="cta" from={cursor} durationInFrames={ctaFrames}>
      <LimeCta frames={ctaFrames} label={script.ctaLabel} text={script.cta} brand={script.brand} />
    </Sequence>,
  );

  return <AbsoluteFill style={{backgroundColor: BG, fontFamily: FONT}}>{blocks}</AbsoluteFill>;
};
