import React from 'react';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import type {Bg, Script} from './types';
import {Background} from './components/Background';
import {TextScene} from './components/TextScene';
import {CoverScene} from './components/CoverScene';
import {CardsScene} from './components/CardsScene';
import {TableScene} from './components/TableScene';
import {CTA_SEC, FPS, HOOK_SEC} from './Root';

// 폰트 규칙: 큰 제목(첫 화면·마지막 화면)은 히피체, 내용·작은 정보성 글은 Pretendard.
// 파일은 public/fonts/ 에 있다. (히피체: Project-Noonnu 배포본, Pretendard: OFL)
export const FONT_TITLE = 'Hippie';
export const FONT_BODY = 'Pretendard';
const fonts: {family: string; weight: string; file: string}[] = [
  {family: FONT_TITLE, weight: '400', file: 'hippie.woff2'},
  {family: FONT_BODY, weight: '400', file: 'Pretendard-Regular.woff2'},
  {family: FONT_BODY, weight: '700', file: 'Pretendard-Bold.woff2'},
  {family: FONT_BODY, weight: '800', file: 'Pretendard-ExtraBold.woff2'},
  {family: FONT_BODY, weight: '900', file: 'Pretendard-Black.woff2'},
];
fonts.forEach(({family, weight, file}) =>
  loadFont({family, url: staticFile(`fonts/${file}`), weight}).catch((e) =>
    console.error('font load failed', file, e),
  ),
);

/** 사용자가 backgroundSrc 로 지정한 파일이 있으면 모든 장면에 우선 적용 */
const pickBg = (script: Script, bg?: Bg): Bg | undefined =>
  script.backgroundSrc ? {src: script.backgroundSrc} : bg;

export const Reel: React.FC<{script: Script}> = ({script}) => {
  const accent = script.accentColor ?? '#FF8A1F';
  const showDisclaimer = script.status !== 'confirmed' && !!script.disclaimer_overlay;

  let cursor = 0;
  const hookFrames = Math.round(HOOK_SEC * FPS);
  const ctaFrames = Math.round(CTA_SEC * FPS);

  const blocks: React.ReactNode[] = [];

  blocks.push(
    <Sequence key="hook" from={cursor} durationInFrames={hookFrames}>
      <Background bg={pickBg(script, script.hookBg)} frames={hookFrames} dim={0.12} />
      <CoverScene
        label={script.hookLabel}
        text={script.hook}
        brand={script.brand}
        disclaimer={showDisclaimer ? script.disclaimer_overlay : undefined}
        accent={accent}
        size={128}
      />
    </Sequence>,
  );
  cursor += hookFrames;

  script.scenes.forEach((s, i) => {
    const frames = Math.round(s.t * FPS);
    const kind = s.kind ?? 'text';
    blocks.push(
      <Sequence key={`s${i}`} from={cursor} durationInFrames={frames}>
        <Background bg={pickBg(script, s.bg)} frames={frames} dim={kind === 'text' ? 0.22 : 0.22} />
        {kind === 'cards' && s.cards ? (
          <CardsScene label={s.label} text={s.text} cards={s.cards} accent={accent} frames={frames} />
        ) : kind === 'table' && s.table ? (
          <TableScene label={s.label} text={s.text} table={s.table} accent={accent} frames={frames} />
        ) : (
          <TextScene label={s.label} text={s.text ?? ''} accent={accent} frames={frames} size={94} title />
        )}
      </Sequence>,
    );
    cursor += frames;
  });

  blocks.push(
    <Sequence key="cta" from={cursor} durationInFrames={ctaFrames}>
      <Background bg={pickBg(script, script.ctaBg)} frames={ctaFrames} dim={0.24} />
      <TextScene label={script.ctaLabel} text={script.cta} accent={accent} size={112} title />
    </Sequence>,
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#0b1020', fontFamily: `'${FONT_BODY}', sans-serif`}}>
      {blocks}
    </AbsoluteFill>
  );
};
