import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CardItem, TableData} from '../types';
import {Words, wordCount} from '../components/Words';
import {Disclaimer} from '../components/Disclaimer';
import {CuteTitle, RawTitle} from './CuteTitle';
import {Doodle, LabelBox, NavyTag, NumTag, Paper, Pill, Sfx, StickerImg, useFadeOut, Washi} from './parts';
import {BLUE, CONTENT_TOP, MARKER, NAVY, PAPER, PAPER_SHADOW, POSTIT, SKY, SOFT_SHADOW, TITLE_FONT} from './theme';

type Common = {index: number; total: number; frames: number; label?: string; sticker?: string; sfx?: string; tone?: 'light' | 'dark'};

const usePop = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return Math.max(spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 140}}), 0);
};

/** 표지: 사진 위에 바로 놓는 큰 글자 + 말풍선 라벨 + 어두운 태그 + 흰 선 낙서 */
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
}> = ({label, text, brand, sticker, sfx, frames}) => {
  const out = useFadeOut(frames);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', left: 130, right: 130}}>
        <Pill text={label} tilt={-3} align="left" />
        <div style={{height: 24}} />
        <RawTitle text={text} size={112} startFrame={label ? 6 : 0} />
        {brand && (
          <div style={{marginTop: 44}}>
            <NavyTag text={brand} />
          </div>
        )}
      </div>
      <Doodle kind="sparkle" size={96} rotate={8} delay={14} style={{left: 110, top: 1340}} />
      <Doodle kind="heart" size={92} rotate={-10} delay={20} style={{right: 120, top: 1360}} />
      <Doodle kind="swirl" size={150} rotate={-4} delay={26} style={{right: 360, top: 1320}} />
      {sticker && <StickerImg name={sticker} size={400} rotate={9} style={{right: 30, top: 200}} />}
      {sfx && <Sfx text={sfx} rotate={-9} style={{right: 390, top: 240}} />}
    </AbsoluteFill>
  );
};

/** 큰 글자 컷: 종이 없이 사진 위에 바로 */
export const CuteBubble: React.FC<Common & {text: string}> = ({index, frames, label, text, sticker, sfx, tone}) => {
  const dark = tone === 'dark';
  const out = useFadeOut(frames);
  const odd = index % 2 === 1;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background: dark
            ? 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0) 62%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(10,20,60,0.36) 0%, rgba(10,20,60,0) 62%)',
        }}
      />
      <div style={{position: 'absolute', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', left: 120, right: 120}}>
        <Pill text={label} tilt={odd ? -2 : 2} />
        <div style={{height: 22}} />
        <RawTitle text={text} size={84} startFrame={8} dark={dark} />
      </div>
      <Doodle kind={odd ? 'sparkle' : 'heart'} color={dark ? BLUE : '#fff'} size={88} rotate={odd ? 10 : -8} delay={16} style={{right: 110, top: 640}} />
      <Doodle kind={odd ? 'swirl' : 'star'} color={dark ? BLUE : '#fff'} size={odd ? 140 : 76} rotate={-6} delay={22} style={{left: 120, top: 1270}} />
      {sticker && <StickerImg name={sticker} size={330} rotate={-8} style={{left: 64, top: 1230}} />}
      {sfx && <Sfx text={sfx} rotate={7} style={{left: 420, top: 1290}} />}
    </AbsoluteFill>
  );
};

/** 이모지 카드 */
export const CuteCards: React.FC<Common & {cards: CardItem[]}> = ({index, frames, label, cards, sticker, sfx}) => {
  const out = useFadeOut(frames);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', left: 120, right: 120}}>
        <Pill text={label} tilt={2} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
          {cards.map((c, i) => (
            <Card key={i} c={c} i={i} />
          ))}
        </div>
      </div>
      <Doodle kind="sparkle" size={84} rotate={10} delay={30} style={{right: 110, top: 540}} />
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
        gap: 30,
        background: '#fff',
        borderRadius: 34,
        padding: '32px 40px',
        boxShadow: PAPER_SHADOW,
        textAlign: 'left',
        transform: `translateY(${(1 - pop) * 40}px) rotate(${i % 2 ? 1.2 : -1.2}deg)`,
        opacity: Math.min(pop, 1),
      }}
    >
      <div
        style={{
          width: 112,
          height: 112,
          flex: '0 0 112px',
          borderRadius: '50%',
          background: POSTIT,
          boxShadow: '0 6px 12px rgba(20,30,80,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 70,
        }}
      >
        {c.emoji ?? '⭐'}
      </div>
      <div style={{wordBreak: 'keep-all'}}>
        <div style={{color: BLUE, fontWeight: 900, fontSize: 72, lineHeight: 1.1, letterSpacing: -2}}>{c.big}</div>
        {c.small && <div style={{color: NAVY, fontWeight: 700, fontSize: 42, marginTop: 8}}>{c.small}</div>}
      </div>
    </div>
  );
};

/** 체크 메모 (표) */
export const CuteList: React.FC<Common & {table: TableData}> = ({index, frames, label, table, sticker, sfx}) => {
  const out = useFadeOut(frames);
  const head = usePop(10);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', left: 120, right: 120}}>
        <Pill text={label} tilt={-2} />
        <div
          style={{
            position: 'relative',
            background: PAPER,
            borderRadius: 14,
            boxShadow: PAPER_SHADOW,
            transform: `translateY(${(1 - head) * 44}px) rotate(-1deg)`,
            opacity: Math.min(head, 1),
          }}
        >
          <Washi style={{left: 36, top: -26}} rotate={-6} />
          <Washi style={{right: 36, top: -26}} rotate={5} tone="yellow" w={150} />
          <NumTag n={index} style={{left: -22, top: -44}} />
          <div style={{display: 'flex', justifyContent: 'center', gap: 22, padding: '40px 0 0'}}>
            {Array.from({length: 7}).map((_, k) => (
              <div key={k} style={{width: 24, height: 24, borderRadius: '50%', background: '#cfd8f0', boxShadow: 'inset 0 3px 5px rgba(20,30,80,0.35)'}} />
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
        borderBottom: last ? 'none' : `4px dashed rgba(36,87,245,0.28)`,
        opacity: Math.min(pop, 1),
        transform: `translateX(${(1 - pop) * -30}px)`,
        textAlign: 'left',
        wordBreak: 'keep-all',
      }}
    >
      <div style={{fontSize: 58}}>✅</div>
      <div style={{flex: '0 0 250px', background: POSTIT, color: BLUE, fontWeight: 900, fontSize: 46, borderRadius: 8, padding: '14px 18px', textAlign: 'center', boxShadow: '0 5px 10px rgba(20,30,80,0.2)'}}>
        {r[0]}
      </div>
      <div style={{color: NAVY, fontWeight: 800, fontSize: 46, lineHeight: 1.3, whiteSpace: 'pre-line'}}>{r.slice(1).join(' ')}</div>
    </div>
  );
};

/** 마지막 화면 */
export const CuteCta: React.FC<Common & {text: string}> = ({frames, label, text, sticker, sfx}) => {
  const out = useFadeOut(frames);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(10,20,60,0.36) 0%, rgba(10,20,60,0) 62%)',
        }}
      />
      <div style={{position: 'absolute', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', left: 130, right: 130}}>
        <Pill text={label} tilt={-2} />
        <div style={{height: 22}} />
        <RawTitle text={text} size={100} startFrame={8} />
      </div>
      <Doodle kind="arrow" size={150} rotate={20} delay={20} style={{right: 120, top: 1230}} />
      <Doodle kind="sparkle" size={84} rotate={-6} delay={14} style={{left: 120, top: 660}} />
      {sticker && <StickerImg name={sticker} size={320} rotate={-9} style={{left: 56, top: 1290}} />}
      {sfx && <Sfx text={sfx} rotate={8} style={{left: 400, top: 1330}} />}
    </AbsoluteFill>
  );
};

export {wordCount};
