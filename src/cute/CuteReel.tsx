import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {Bg, Script} from '../types';
import {Background} from '../components/Background';
import {ctaSecOf, FPS, hookSecOf} from '../Root';
import {CuteBubble, CuteCards, CuteCompare, CuteCover, CuteCta, CuteGrid, CuteList, CuteStat, CuteSteps} from './scenes';

const pick = (script: Script, bg?: Bg): Bg | undefined => (script.backgroundSrc ? {src: script.backgroundSrc} : bg);

/** 귀여운 테마: 밝고 부드러운 사진 + 스티커·말풍선·이모지 카드. 컷은 짧고 글자는 최소로. */
export const CuteReel: React.FC<{script: Script}> = ({script}) => {
  const hookFrames = Math.round(hookSecOf(script) * FPS);
  const ctaFrames = Math.round(ctaSecOf(script) * FPS);
  const total = script.scenes.length + 2;
  const bgProps = {dim: script.bgDim ?? 0.3, veil: 0, fade: 3};

  let cursor = 0;
  const blocks: React.ReactNode[] = [];

  blocks.push(
    <Sequence key="hook" from={cursor} durationInFrames={hookFrames}>
      <Background bg={pick(script, script.hookBg)} frames={hookFrames} {...bgProps} />
      <CuteCover
        index={0}
        total={total}
        label={script.hookLabel}
        text={script.hook}
        brand={script.brand}
        sticker={script.hookSticker}
        sfx={script.hookSfx}
        deco={script.hookDeco}
        decoPos={script.hookDecoPos}
        frames={hookFrames}
      />
    </Sequence>,
  );
  cursor += hookFrames;

  script.scenes.forEach((s, i) => {
    const frames = Math.round(s.t * FPS);
    const kind = s.kind ?? 'text';
    const common = {index: i + 1, total, frames, label: s.label, sticker: s.sticker, sfx: s.sfx, tone: s.tone, deco: s.deco, decoText: s.decoText, decoPos: s.decoPos};
    blocks.push(
      <Sequence key={`s${i}`} from={cursor} durationInFrames={frames}>
        <Background bg={pick(script, s.bg)} frames={frames} {...bgProps} />
        {kind === 'cards' && s.cards ? (
          <CuteCards {...common} cards={s.cards} />
        ) : kind === 'steps' && s.cards ? (
          <CuteSteps {...common} cards={s.cards} />
        ) : kind === 'grid' && s.cards ? (
          <CuteGrid {...common} cards={s.cards} />
        ) : kind === 'stat' && s.stat ? (
          <CuteStat {...common} stat={s.stat} />
        ) : kind === 'compare' && s.compare ? (
          <CuteCompare {...common} compare={s.compare} />
        ) : kind === 'table' && s.table ? (
          <CuteList {...common} table={s.table} />
        ) : (
          <CuteBubble {...common} text={s.text ?? ''} />
        )}
      </Sequence>,
    );
    cursor += frames;
  });

  blocks.push(
    <Sequence key="cta" from={cursor} durationInFrames={ctaFrames}>
      <Background bg={pick(script, script.ctaBg)} frames={ctaFrames} {...bgProps} />
      <CuteCta
        index={total - 1}
        total={total}
        frames={ctaFrames}
        label={script.ctaLabel}
        text={script.cta}
        sticker={script.ctaSticker}
        sfx={script.ctaSfx}
        deco={script.ctaDeco}
        decoPos={script.ctaDecoPos}
      />
    </Sequence>,
  );

  return <AbsoluteFill style={{backgroundColor: '#dfe8ff', fontFamily: "'Pretendard', sans-serif"}}>{blocks}</AbsoluteFill>;
};
