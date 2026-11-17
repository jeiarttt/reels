import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CardItem, CompareData, StatData, TableData} from '../types';
import {Words, wordCount} from '../components/Words';
import {Disclaimer} from '../components/Disclaimer';
import {CuteTitle, RawTitle} from './CuteTitle';
import {Illust} from './illust';
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
            background: '#fff',
            borderRadius: 34,
            boxShadow: PAPER_SHADOW,
            transform: `translateY(${(1 - head) * 44}px) rotate(-1deg)`,
            opacity: Math.min(head, 1),
          }}
        >
          <div style={{display: 'flex', justifyContent: 'center', gap: 22, padding: '34px 0 0'}}>
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

const FLEX_CENTER: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 120,
  right: 120,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
};

const DANGER = '#FF5A5F';

/** 세로 단계: 번호 동그라미가 점선으로 이어지는 타임라인 (방법·절차용) */
export const CuteSteps: React.FC<Common & {cards: CardItem[]}> = ({frames, label, cards, sticker, sfx, tone}) => {
  const out = useFadeOut(frames);
  const frame = useCurrentFrame();
  const dark = tone === 'dark';
  const line = interpolate(frame, [10, 10 + cards.length * 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={FLEX_CENTER}>
        <Pill text={label} tilt={-2} />
        <div style={{height: 10}} />
        <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 30}}>
          <div
            style={{
              position: 'absolute',
              left: 46,
              top: 60,
              bottom: 60,
              width: 8,
              borderRadius: 4,
              background: `repeating-linear-gradient(to bottom, ${dark ? BLUE : '#fff'} 0 14px, transparent 14px 26px)`,
              opacity: 0.9,
              transform: `scaleY(${line})`,
              transformOrigin: 'top',
            }}
          />
          {cards.map((c, i) => (
            <StepRow key={i} c={c} i={i} />
          ))}
        </div>
      </div>
      <Doodle kind="sparkle" color={dark ? BLUE : '#fff'} size={84} rotate={10} delay={30} style={{right: 110, top: 520}} />
      {sticker && <StickerImg name={sticker} size={270} rotate={12} style={{right: 40, top: 330}} />}
      {sfx && <Sfx text={sfx} rotate={-7} style={{right: 290, top: 400}} />}
    </AbsoluteFill>
  );
};

const StepRow: React.FC<{c: CardItem; i: number}> = ({c, i}) => {
  const pop = usePop(14 + i * 12);
  return (
    <div style={{position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 26, opacity: Math.min(pop, 1), transform: `translateX(${(1 - pop) * -40}px)`}}>
      <div style={{flex: '0 0 100px', display: 'flex', justifyContent: 'center'}}>
        <LabelBox
          size={58}
          padX={0}
          padY={0}
          style={{width: 100, height: 100, borderRadius: '50%', background: BLUE, color: '#fff', border: '6px solid #fff', boxShadow: '0 8px 18px rgba(10,20,80,0.3)'}}
        >
          {i + 1}
        </LabelBox>
      </div>
      <div
        style={{
          flex: 1,
          background: '#fff',
          borderRadius: 34,
          padding: '26px 34px',
          boxShadow: SOFT_SHADOW,
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          wordBreak: 'keep-all',
        }}
      >
        <div style={{flex: 1}}>
          <div style={{color: BLUE, fontWeight: 900, fontSize: 54, lineHeight: 1.1, letterSpacing: -1.5}}>{c.big}</div>
          {c.small && <div style={{color: NAVY, fontWeight: 700, fontSize: 36, marginTop: 6}}>{c.small}</div>}
        </div>
        <div style={{fontSize: 64}}>{c.emoji ?? ''}</div>
      </div>
    </div>
  );
};

/** 큰 숫자 하나 (게이지 고리 선택): 핵심 수치·날짜·나이를 크게 보여줄 때 */
export const CuteStat: React.FC<Common & {stat: StatData}> = ({frames, label, stat, sticker, sfx, tone}) => {
  const out = useFadeOut(frames);
  const frame = useCurrentFrame();
  const dark = tone === 'dark';
  const pop = usePop(6);
  const R = 262;
  const C = 2 * Math.PI * R;
  const g = stat.gauge ?? 0;
  const prog = interpolate(frame, [12, 46], [0, g / 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const bigSize = [...stat.big].length <= 3 ? 210 : [...stat.big].length <= 5 ? 160 : 118;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={FLEX_CENTER}>
        <Pill text={label} tilt={2} />
        <div style={{height: 14}} />
        <div style={{position: 'relative', width: 600, height: 600, margin: '0 auto', transform: `scale(${0.85 + 0.15 * pop})`, opacity: Math.min(pop, 1)}}>
          <svg width={600} height={600} viewBox="0 0 600 600" style={{position: 'absolute', left: 0, top: 0}}>
            <circle cx={300} cy={300} r={R} fill="none" stroke={dark ? 'rgba(36,87,245,0.2)' : 'rgba(255,255,255,0.45)'} strokeWidth={34} strokeDasharray={g ? undefined : '3 26'} strokeLinecap="round" />
            {g > 0 && (
              <circle
                cx={300}
                cy={300}
                r={R}
                fill="none"
                stroke={BLUE}
                strokeWidth={34}
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - prog)}
                transform="rotate(-90 300 300)"
              />
            )}
          </svg>
          <div
            style={{
              position: 'absolute',
              left: 52,
              top: 52,
              width: 496,
              height: 496,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: SOFT_SHADOW,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              wordBreak: 'keep-all',
            }}
          >
            {stat.emoji && <div style={{fontSize: 78, lineHeight: 1, marginBottom: 6}}>{stat.emoji}</div>}
            <div style={{fontFamily: TITLE_FONT, fontSize: bigSize, lineHeight: 1.05, color: BLUE, letterSpacing: '-0.02em'}}>{stat.big}</div>
            {stat.sub && <div style={{color: NAVY, fontWeight: 800, fontSize: 40, marginTop: 10, lineHeight: 1.3, whiteSpace: 'pre-line', maxWidth: 380}}>{stat.sub}</div>}
          </div>
        </div>
        {stat.chips && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 20}}>
            {stat.chips.map((c, k) => (
              <StatChip key={k} text={c} i={k} />
            ))}
          </div>
        )}
      </div>
      <Doodle kind="sparkle" color={dark ? BLUE : '#fff'} size={90} rotate={8} delay={26} style={{left: 110, top: 440}} />
      <Doodle kind="heart" color={dark ? BLUE : '#fff'} size={80} rotate={-10} delay={32} style={{right: 120, top: 1470}} />
      {sticker && <StickerImg name={sticker} size={300} rotate={-8} style={{left: 64, top: 1280}} />}
      {sfx && <Sfx text={sfx} rotate={7} style={{left: 380, top: 1330}} />}
    </AbsoluteFill>
  );
};

const StatChip: React.FC<{text: string; i: number}> = ({text, i}) => {
  const pop = usePop(24 + i * 8);
  return (
    <div
      style={{
        background: '#fff',
        color: NAVY,
        fontWeight: 800,
        fontSize: 42,
        lineHeight: 1.2,
        padding: '14px 36px',
        borderRadius: 999,
        boxShadow: SOFT_SHADOW,
        whiteSpace: 'nowrap',
        opacity: Math.min(pop, 1),
        transform: `translateY(${(1 - pop) * 24}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** 두 칸 비교: 되는 것 / 안 되는 것 */
export const CuteCompare: React.FC<Common & {compare: CompareData}> = ({frames, label, compare, sticker, sfx, tone}) => {
  const out = useFadeOut(frames);
  const dark = tone === 'dark';
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={FLEX_CENTER}>
        <Pill text={label} tilt={-2} />
        <div style={{height: 14}} />
        <div style={{display: 'flex', flexDirection: compare.stack ? 'column' : 'row', gap: compare.stack ? 26 : 34, alignItems: 'stretch'}}>
          <ComparePanel ok stack={compare.stack} neutral={compare.neutral} title={compare.leftTitle} items={compare.leftItems} delay={10} />
          <ComparePanel stack={compare.stack} neutral={compare.neutral} title={compare.rightTitle} items={compare.rightItems} delay={22} />
        </div>
      </div>
      <Doodle kind="sparkle" color={dark ? BLUE : '#fff'} size={84} rotate={10} delay={34} style={{right: 110, top: 520}} />
      {sticker && <StickerImg name={sticker} size={300} rotate={-8} style={{left: 64, top: 1300}} />}
      {sfx && <Sfx text={sfx} rotate={7} style={{left: 380, top: 1350}} />}
    </AbsoluteFill>
  );
};

const ComparePanel: React.FC<{ok?: boolean; neutral?: boolean; stack?: boolean; title: string; items: string[]; delay: number}> = ({ok, neutral, stack, title, items, delay}) => {
  const pop = usePop(delay);
  const col = neutral ? (ok ? BLUE : '#14B8A6') : ok ? BLUE : DANGER;
  return (
    <div style={{flex: stack ? 'none' : 1, background: '#fff', borderRadius: 38, padding: '0 0 28px', boxShadow: SOFT_SHADOW, overflow: 'hidden', opacity: Math.min(pop, 1), transform: `translateY(${(1 - pop) * 40}px) rotate(${ok ? -1 : 1}deg)`}}>
      <div style={{background: col, color: '#fff', padding: '4px 0 0'}}>
        <LabelBox size={50} padX={20} padY={22} style={{display: 'flex', width: '100%'}}>
          {neutral ? '' : ok ? '✅ ' : '❌ '}{title}
        </LabelBox>
      </div>
      <div style={{display: 'flex', flexDirection: stack ? 'row' : 'column', flexWrap: stack ? 'wrap' : 'nowrap', gap: stack ? '14px 34px' : 18, padding: '26px 34px 0', textAlign: 'left', wordBreak: 'keep-all'}}>
        {items.map((it, k) => (
          <div key={k} style={{display: 'flex', alignItems: 'center', gap: 12, color: NAVY, fontWeight: 800, fontSize: stack ? 42 : 36, lineHeight: 1.2, whiteSpace: 'nowrap'}}>
            <span style={{color: col, fontWeight: 900, fontSize: stack ? 44 : 40}}>{neutral ? '•' : ok ? '✓' : '✕'}</span>
            <span>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/** 격자 타일(2열): 항목 4~6개를 한눈에 */
export const CuteGrid: React.FC<Common & {cards: CardItem[]}> = ({frames, label, cards, sticker, sfx, tone}) => {
  const out = useFadeOut(frames);
  const dark = tone === 'dark';
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={FLEX_CENTER}>
        <Pill text={label} tilt={2} />
        <div style={{height: 10}} />
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 26, justifyContent: 'center'}}>
          {cards.map((c, i) => (
            <GridTile key={i} c={c} i={i} />
          ))}
        </div>
      </div>
      <Doodle kind="sparkle" color={dark ? BLUE : '#fff'} size={84} rotate={10} delay={30} style={{right: 100, top: 480}} />
      {sticker && <StickerImg name={sticker} size={260} rotate={12} style={{right: 40, top: 300}} />}
      {sfx && <Sfx text={sfx} rotate={-7} style={{right: 290, top: 380}} />}
    </AbsoluteFill>
  );
};

const GridTile: React.FC<{c: CardItem; i: number}> = ({c, i}) => {
  const pop = usePop(10 + i * 7);
  return (
    <div
      style={{
        width: 400,
        background: '#fff',
        borderRadius: 34,
        padding: '26px 24px 24px',
        boxShadow: SOFT_SHADOW,
        opacity: Math.min(pop, 1),
        transform: `translateY(${(1 - pop) * 40}px) rotate(${i % 2 ? 1 : -1}deg)`,
        wordBreak: 'keep-all',
      }}
    >
      <div style={{width: 92, height: 92, borderRadius: '50%', background: POSTIT, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54}}>{c.emoji ?? '⭐'}</div>
      <div style={{color: BLUE, fontWeight: 900, fontSize: 50, lineHeight: 1.1, letterSpacing: -1.5}}>{c.big}</div>
      {c.small && <div style={{color: NAVY, fontWeight: 700, fontSize: 32, marginTop: 6}}>{c.small}</div>}
    </div>
  );
};

const DECO_POS: Record<string, React.CSSProperties> = {
  tl: {left: 70, top: 230},
  tr: {right: 70, top: 230},
  bl: {left: 70, bottom: 300},
  br: {right: 70, bottom: 300},
};

/** 주제 일러스트 한 개를 모서리에 놓는다 (컷이 끝날 때 같이 사라진다) */
export const DecoLayer: React.FC<{name?: string; pos?: 'tl' | 'tr' | 'bl' | 'br'; text?: string; frames: number}> = ({name, pos = 'tr', text, frames}) => {
  const out = useFadeOut(frames);
  if (!name) return null;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Illust name={name} text={text} size={290} rotate={pos.endsWith('l') ? -8 : 8} style={DECO_POS[pos]} />
    </AbsoluteFill>
  );
};

export {wordCount};
