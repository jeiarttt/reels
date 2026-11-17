import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CardItem, TableData} from '../types';
import {Words, wordCount} from '../components/Words';
import {Disclaimer} from '../components/Disclaimer';
import {CuteTitle} from './CuteTitle';
import {LabelBox, Pill, ProgressDots, Sfx, StickerImg, useFadeOut} from './parts';
import {BLUE, CONTENT_TOP, NAVY, SKY, SOFT_SHADOW, TITLE_FONT} from './theme';

type Common = {index: number; total: number; frames: number; label?: string; sticker?: string; sfx?: string};

const usePop = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return Math.max(spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 140}}), 0);
};

/** 표지 */
export const CuteCover: React.FC<{
  index: number;
  total: number;
  label?: string;
  text: string;
  brand?: string;
  disclaimer?: string;
  sticker?: string;
  sfx?: string;
  frames: number;
}> = ({index, total, label, text, brand, disclaimer, sticker, sfx, frames}) => {
  const out = useFadeOut(frames);
  const frame = useCurrentFrame();
  const tag = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{opacity: out}}>
      <ProgressDots index={index} total={total} />
      {brand && (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 150}}>
          <div style={{opacity: tag}}>
            <LabelBox
              size={42}
              padX={38}
              padY={16}
              style={{background: '#fff', color: BLUE, border: `5px solid ${BLUE}`, borderRadius: 999, boxShadow: '0 8px 18px rgba(20,40,120,0.2)'}}
            >
              {brand}
            </LabelBox>
          </div>
        </AbsoluteFill>
      )}
      <div style={{position: 'absolute', top: CONTENT_TOP + 60, left: 0, right: 0, textAlign: 'center'}}>
        <Pill text={label} tilt={-3} />
        <CuteTitle text={text} size={132} startFrame={label ? 6 : 0} />
      </div>
      {sticker && <StickerImg name={sticker} size={400} rotate={9} style={{right: 30, top: 230}} />}
      {sfx && <Sfx text={sfx} rotate={-9} style={{right: 390, top: 270}} />}
      {disclaimer && <Disclaimer text={disclaimer} />}
    </AbsoluteFill>
  );
};

/** 말풍선 문구 */
export const CuteBubble: React.FC<Common & {text: string}> = ({index, total, frames, label, text, sticker, sfx}) => {
  const out = useFadeOut(frames);
  const pop = usePop(4);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <ProgressDots index={index} total={total} />
      <div style={{position: 'absolute', top: CONTENT_TOP, left: 64, right: 64, textAlign: 'center'}}>
        <Pill text={label} tilt={-2} />
        <div
          style={{
            position: 'relative',
            background: '#fff',
            borderRadius: 68,
            padding: '56px 40px 64px',
            boxShadow: SOFT_SHADOW,
            transform: `scale(${0.9 + 0.1 * pop})`,
            opacity: Math.min(pop, 1),
          }}
        >
          <Words
            text={text}
            accent={BLUE}
            startFrame={8}
            stagger={3}
            style={{
              color: NAVY,
              fontFamily: TITLE_FONT,
              fontWeight: 400,
              fontSize: 88,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}
          />
          {sticker && (
          <div
            style={{
              position: 'absolute',
              left: 150,
              bottom: -34,
              width: 76,
              height: 76,
              background: '#fff',
              borderRadius: 16,
              transform: 'rotate(45deg)',
              boxShadow: '14px 14px 30px rgba(30,70,200,0.18)',
            }}
          />
          )}
        </div>
      </div>
      {sticker && <StickerImg name={sticker} size={330} rotate={-8} style={{left: 64, top: 1230}} />}
      {sfx && <Sfx text={sfx} rotate={7} style={{left: 420, top: 1290}} />}
    </AbsoluteFill>
  );
};

/** 이모지 카드 */
export const CuteCards: React.FC<Common & {cards: CardItem[]}> = ({index, total, frames, label, cards, sticker, sfx}) => {
  const out = useFadeOut(frames);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <ProgressDots index={index} total={total} />
      <div style={{position: 'absolute', top: CONTENT_TOP, left: 84, right: 84, textAlign: 'center'}}>
        <Pill text={label} tilt={2} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
          {cards.map((c, i) => (
            <Card key={i} c={c} i={i} />
          ))}
        </div>
      </div>
      {sticker && <StickerImg name={sticker} size={270} rotate={12} style={{right: 40, top: 330}} />}
      {sfx && <Sfx text={sfx} rotate={-7} style={{right: 290, top: 400}} />}
    </AbsoluteFill>
  );
};

const Card: React.FC<{c: CardItem; i: number}> = ({c, i}) => {
  const pop = usePop(16 + i * 9);
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        background: '#fff',
        borderRadius: 52,
        padding: '38px 46px',
        boxShadow: SOFT_SHADOW,
        textAlign: 'left',
        transform: `rotate(${i % 2 ? 1.1 : -1.1}deg) scale(${0.85 + 0.15 * pop})`,
        opacity: Math.min(pop, 1),
      }}
    >
      {/* 마스킹 테이프 */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          width: 150,
          height: 38,
          marginLeft: -75,
          background: 'rgba(36,87,245,0.28)',
          borderRadius: 6,
          transform: `rotate(${i % 2 ? 4 : -3}deg)`,
        }}
      />
      <div
        style={{
          width: 128,
          height: 128,
          flex: '0 0 128px',
          borderRadius: '50%',
          background: SKY,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 70,
        }}
      >
        {c.emoji ?? '⭐'}
      </div>
      <div style={{wordBreak: 'keep-all'}}>
        <div style={{color: BLUE, fontWeight: 900, fontSize: 80, lineHeight: 1.1, letterSpacing: -2}}>{c.big}</div>
        {c.small && <div style={{color: NAVY, fontWeight: 700, fontSize: 42, marginTop: 8}}>{c.small}</div>}
      </div>
    </div>
  );
};

/** 체크 메모 (표) */
export const CuteList: React.FC<Common & {table: TableData}> = ({index, total, frames, label, table, sticker, sfx}) => {
  const out = useFadeOut(frames);
  const head = usePop(10);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <ProgressDots index={index} total={total} />
      <div style={{position: 'absolute', top: CONTENT_TOP, left: 72, right: 72, textAlign: 'center'}}>
        <Pill text={label} tilt={-2} />
        <div
          style={{
            background: '#fff',
            borderRadius: 56,
            overflow: 'hidden',
            boxShadow: SOFT_SHADOW,
            transform: `scale(${0.92 + 0.08 * head})`,
            opacity: Math.min(head, 1),
          }}
        >
          <div style={{background: BLUE, display: 'flex', justifyContent: 'center', gap: 14, padding: '16px 0 12px'}}>
            {Array.from({length: 7}).map((_, k) => (
              <div key={k} style={{width: 26, height: 26, borderRadius: '50%', background: '#fff', opacity: 0.9}} />
            ))}
          </div>
          {table.rows.map((r, ri) => (
            <Row key={ri} r={r} i={ri} last={ri === table.rows.length - 1} />
          ))}
        </div>
      </div>
      {sticker && <StickerImg name={sticker} size={260} rotate={-10} style={{right: 48, top: 1330}} />}
      {sfx && <Sfx text={sfx} rotate={6} style={{right: 80, top: 1290}} />}
    </AbsoluteFill>
  );
};

const Row: React.FC<{r: string[]; i: number; last: boolean}> = ({r, i, last}) => {
  const pop = usePop(20 + i * 10);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '52px 40px',
        borderBottom: last ? 'none' : `4px dashed ${SKY}`,
        opacity: Math.min(pop, 1),
        transform: `translateX(${(1 - pop) * -30}px)`,
        textAlign: 'left',
        wordBreak: 'keep-all',
      }}
    >
      <div style={{fontSize: 58}}>✅</div>
      <div style={{flex: '0 0 250px', background: SKY, color: BLUE, fontWeight: 900, fontSize: 46, borderRadius: 26, padding: '14px 18px', textAlign: 'center'}}>
        {r[0]}
      </div>
      <div style={{color: NAVY, fontWeight: 800, fontSize: 46, lineHeight: 1.3, whiteSpace: 'pre-line'}}>{r.slice(1).join(' ')}</div>
    </div>
  );
};

/** 마지막 화면 */
export const CuteCta: React.FC<Common & {text: string}> = ({index, total, frames, label, text, sticker, sfx}) => {
  const out = useFadeOut(frames);
  const frame = useCurrentFrame();
  const beat = 1 + Math.sin(frame / 5) * 0.035;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <ProgressDots index={index} total={total} />
      <div style={{position: 'absolute', top: CONTENT_TOP - 20, left: 0, right: 0, textAlign: 'center'}}>
        {label && (
          <div style={{height: 150, display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
            <div style={{transform: `scale(${beat})`}}>
              <LabelBox
                size={62}
                padX={56}
                padY={22}
                style={{background: '#fff', color: BLUE, border: `6px solid ${BLUE}`, borderRadius: 999, boxShadow: SOFT_SHADOW}}
              >
                {label}
              </LabelBox>
            </div>
          </div>
        )}
        <CuteTitle text={text} size={102} startFrame={8} />
      </div>
      {sticker && <StickerImg name={sticker} size={320} rotate={-9} style={{left: 56, top: 1290}} />}
      {sfx && <Sfx text={sfx} rotate={8} style={{left: 400, top: 1330}} />}
    </AbsoluteFill>
  );
};

export {wordCount};
