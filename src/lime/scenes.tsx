import React, {useContext} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import type {Scene} from '../types';
import {useFadeOut} from '../cute/parts';
import {ACCENT, BG, CARD, CTA_TITLE, DESC, FONT, FONT_TITLE, INK, INK_ACCENT, INK_SUB, MUTED, TITLE} from './theme';
import {Check, clean, CountText, Rich, SHAPES, Star, useBounce, useIn, Wave} from './parts';
import {TitleFxContext, useTitleStroke} from './parts';
import type {ShapeKind} from './parts';

/** 영상 위 작은 글자가 묻히지 않도록 짙은 그림자를 깐다 */
const SHADOW = '0 2px 14px rgba(0,0,0,0.7), 0 0 3px rgba(0,0,0,0.5)';
const SHADOW_SOFT = '0 4px 24px rgba(0,0,0,0.35)';

const pad = (n: number) => String(n).padStart(2, '0');

/** 도형 자리(머리글 기준): 제목 오른쪽 위, 카드 모서리에 살짝 걸치기, 제목 위쪽 오른쪽을 돌려 쓴다 */
const SHAPE_SPOTS: ((wide?: boolean) => React.CSSProperties)[] = [
  (w) => ({right: w ? 70 : 40, top: -96}),
  (w) => ({right: w ? 20 : -26, bottom: -64}),
  (w) => ({right: w ? 90 : 70, top: -92}),
];

const Fade: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => {
  const out = useFadeOut(frames);
  return <AbsoluteFill style={{opacity: out, fontFamily: FONT}}>{children}</AbsoluteFill>;
};

const rise = (p: number): React.CSSProperties => ({opacity: Math.min(p, 1), transform: `translateY(${(1 - Math.min(p, 1)) * 36}px)`});


/** 표지 말풍선: 살짝 울퉁불퉁한 윤곽(모서리는 둥글게 다듬음)과 뾰족한 꼬리. 색·글자색은 스타일 값 */
const SOFT_BUBBLE = '3,30 8,10 50,4 92,8 98,32 98,56 94,74 78,77 76,100 62,77 20,78 4,68';
const SoftBubble: React.FC<{bg: string; color: string; fontSize: number; px: number; py: number; tail?: number; shift?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({bg, color, fontSize, px, py, tail = 44, shift = 0, style, children}) => (
  <div style={{position: 'relative', display: 'inline-block', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.3))', ...style}}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible'}}>
      <polygon points={SOFT_BUBBLE} fill={bg} stroke={bg} strokeWidth={26} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
    <div style={{position: 'relative', color, fontFamily: FONT_TITLE, fontWeight: 900, fontSize, lineHeight: 1.3, letterSpacing: '-0.02em', padding: `${py + shift}px ${px}px ${py + tail - shift}px`, textAlign: 'center', whiteSpace: 'nowrap'}}>{children}</div>
  </div>
);

/** 종이 오림 느낌 스티커(물음표·느낌표): 아이보리 테두리 + 라임 채움 */
const MarkSticker: React.FC<{ch: '?' | '!'; size?: number; style?: React.CSSProperties}> = ({ch, size = 250, style}) => {
  const p = useBounce(12);
  return (
    <div style={{position: 'absolute', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: size, lineHeight: 1, color: ACCENT, WebkitTextStroke: '26px #F5F5EF', paintOrder: 'stroke fill', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.32))', opacity: Math.min(p, 1), transform: `rotate(${-10 * Math.min(p, 1) + 6}deg) scale(${0.5 + 0.5 * p})`, ...style}}>
      {ch}
    </div>
  );
};

/** 표지: 화면 한가운데 가운데 정렬. 검정 알약(계정 글자) → 큰 제목(양옆 도형) → 작은 두 줄(숫자는 라임색) */
export const LimeCover: React.FC<{frames: number; label?: string; sub?: string; text: string; brand?: string; mark?: '?' | '!'}> = ({frames, label, sub, text, brand, mark}) => {
  const pPill = useIn(2);
  const p1 = useIn(5);
  const p2 = useIn(12);
  const p3 = useIn(18);
  const lines = text.split('\n');
  const longest = Math.max(...lines.map((l) => [...l.replace(/\[\[|\]\]/g, '')].length), 1);
  const stroke = useTitleStroke();
  const fx = useContext(TitleFxContext);
  const fxAll = [...text.replace(/\[\[|\]\]/g, '').replace(/\s/g, '')].length;
  const titleSize = Math.min(110, Math.floor(830 / (longest * 0.75)));
  return (
    <Fade frames={frames}>
      <div style={{position: 'absolute', left: 100, right: 100, top: 0, bottom: 96, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        {brand && (
          <SoftBubble bg="#000" color={TITLE} fontSize={52} px={52} py={19} tail={43} shift={9} style={{marginBottom: 60, ...rise(pPill)}}>
            {clean(brand)}
          </SoftBubble>
        )}
        <div style={{color: TITLE, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: titleSize, lineHeight: 1.4, letterSpacing: '-0.03em', textShadow: SHADOW_SOFT, ...stroke, ...rise(p1)}}>
          {lines.map((ln, i) => (
            <div key={i} style={{position: 'relative', display: 'table', margin: '0 auto'}}>
              <Rich text={ln} marker fx={fx} fxStart={8} fxTotal={fxAll} fxOffset={lines.slice(0, i).join('').replace(/\[\[|\]\]/g, '').replace(/\s/g, '').length} />
              {i === 0 && <Star w={86} kind="sparkle" style={{left: -112, top: -46}} delay={14} />}
              {i === 0 && <Star w={96} kind="burst" style={{right: -124, top: 62}} delay={8} />}
              {i === 0 && mark && <MarkSticker ch={mark} size={210} style={{right: -140, top: -160}} />}
            </div>
          ))}
        </div>
        {label && (
          <div style={{color: TITLE, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 58, lineHeight: 1.4, letterSpacing: '-0.02em', marginTop: 50, textShadow: SHADOW, ...rise(p2)}}>
            <Rich text={label} />
          </div>
        )}
        {sub && <div style={{color: TITLE, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 40, lineHeight: 1.4, letterSpacing: '-0.02em', marginTop: 36, opacity: 0.92, textShadow: SHADOW, whiteSpace: 'pre-line', ...rise(p3)}}>{clean(sub)}</div>}
      </div>
    </Fade>
  );
};

type Row = {left: string; right?: string};

const InfoRows: React.FC<{rows: Row[]}> = ({rows}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
    {rows.map((r, i) => (
      <InfoRow key={i} r={r} i={i} />
    ))}
  </div>
);

/** 카드 안 글자에서 [[강조]]를 형광 칸으로 보여 준다 */
const Em: React.FC<{text: string}> = ({text}) => (
  <>
    {text.split(/(\[\[[^\]]*\]\])/g).map((part, k) =>
      part.startsWith('[[') && part.endsWith(']]') ? (
        <span key={k} style={{background: ACCENT, color: INK, fontWeight: 900, borderRadius: 12, padding: '2px 16px', margin: '0 2px'}}>{part.slice(2, -2)}</span>
      ) : (
        <React.Fragment key={k}>{part}</React.Fragment>
      ),
    )}
  </>
);

const InfoRow: React.FC<{r: Row; i: number}> = ({r, i}) => {
  const p = useBounce(16 + i * 8);
  const tilt = [-1.4, 1.1, -0.9, 1.3][i % 4];
  const single = r.right === undefined;
  return (
    <div style={{minHeight: 172, borderRadius: 30, background: CARD, boxShadow: '0 10px 28px rgba(0,0,0,0.28)', padding: '28px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, wordBreak: 'keep-all', ...rise(p), transform: `translateY(${(1 - p) * 48}px) rotate(${tilt}deg)`}}>
      <div style={{color: single ? INK : INK_ACCENT, fontWeight: 800, fontSize: single ? 50 : 42, lineHeight: 1.25, letterSpacing: -1.5}}><Em text={r.left} /></div>
      {single ? <Check /> : <div style={{color: INK_SUB, fontWeight: 700, fontSize: 42, lineHeight: 1.25, letterSpacing: -1.5, textAlign: 'right'}}><Em text={r.right ?? ''} /></div>}
    </div>
  );
};

type Step = {n: string; label: string; detail?: string};

const StepCards: React.FC<{steps: Step[]; noNum?: boolean}> = ({steps, noNum}) => (
  <div style={{display: 'flex', gap: 20}}>
    {steps.map((s, i) => (
      <StepCard key={i} s={s} i={i} compact={steps.every((x) => !x.detail)} noNum={noNum} />
    ))}
  </div>
);

const StepCard: React.FC<{s: Step; i: number; compact?: boolean; noNum?: boolean}> = ({s, i, compact, noNum}) => {
  const p = useBounce(16 + i * 8);
  const tilt = [-2, 1.4, -1][i % 3];
  const hi = i === 0;
  return (
    <div style={{flex: 1, minHeight: noNum ? 420 : compact ? 390 : 560, borderRadius: 30, padding: 32, background: hi ? ACCENT : CARD, color: INK, boxShadow: '0 10px 28px rgba(0,0,0,0.28)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', wordBreak: 'keep-all', ...rise(p), transform: `translateY(${(1 - p) * 60}px) rotate(${tilt}deg)`}}>
      {!noNum && <div style={{fontWeight: 700, fontSize: 88, letterSpacing: -2}}>{s.n}</div>}
      <div>
        <div style={{fontWeight: 800, fontSize: noNum ? 56 : 46, lineHeight: 1.2, letterSpacing: -1.5}}>{s.label}</div>
        {s.detail && (
          <>
            <div style={{height: 1, background: 'rgba(20,23,19,0.30)', margin: '20px 0'}} />
            <div style={{fontWeight: 700, fontSize: noNum ? 44 : 36, lineHeight: 1.35, letterSpacing: -1, color: hi ? INK : INK_SUB, minHeight: noNum ? 0 : 94}}>{s.detail}</div>
          </>
        )}
      </div>
    </div>
  );
};


/** 카드 없이 영상 위에 바로 놓는 체크 줄 */
const PlainLines: React.FC<{lines: string[]}> = ({lines}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
    {lines.map((t, i) => (
      <PlainLine key={i} t={t} i={i} />
    ))}
  </div>
);

const PlainLine: React.FC<{t: string; i: number}> = ({t, i}) => {
  const p = useBounce(16 + i * 8);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 26, wordBreak: 'keep-all', opacity: Math.min(p, 1), transform: `translateX(${(1 - p) * -50}px) rotate(${[-0.8, 0.6, -0.5][i % 3]}deg)`}}>
      <div style={{flex: '0 0 auto', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))'}}>
        <Check size={64} color={ACCENT} />
      </div>
      <div style={{color: TITLE, fontWeight: 800, fontSize: 54, lineHeight: 1.25, letterSpacing: -1.5, textShadow: SHADOW}}>{t}</div>
    </div>
  );
};

/** 카드 없는 번호 목록: 큰 라임 숫자 + 글자 + 가는 구분선 */
const NumList: React.FC<{items: {label: string; detail?: string}[]; start?: number}> = ({items, start = 0}) => (
  <div>
    {items.map((it, i) => (
      <NumRow key={i} it={it} i={i} no={i + start} last={i === items.length - 1} />
    ))}
  </div>
);

const NumRow: React.FC<{it: {label: string; detail?: string}; i: number; no: number; last: boolean}> = ({it, i, no, last}) => {
  const p = useBounce(14 + i * 8);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 36, padding: '30px 0', borderBottom: last ? 'none' : '3px solid rgba(255,255,255,0.35)', wordBreak: 'keep-all', opacity: Math.min(p, 1), transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{flex: '0 0 120px', color: ACCENT, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 108, lineHeight: 1, letterSpacing: '-0.02em', textShadow: SHADOW_SOFT}}>{pad(no + 1)}</div>
      <div>
        <div style={{color: TITLE, fontWeight: 800, fontSize: 54, lineHeight: 1.2, letterSpacing: -1.5, textShadow: SHADOW}}>{it.label}</div>
        {it.detail && <div style={{color: TITLE, fontWeight: 700, fontSize: 38, lineHeight: 1.25, letterSpacing: -1, marginTop: 8, opacity: 0.92, textShadow: SHADOW}}>{it.detail}</div>}
      </div>
    </div>
  );
};

/** 세로 타임라인: 라임 선 위에 번호 동그라미가 이어지고 오른쪽에 글자 */

/** 카드 한 장 안에 항목을 묶는다. numbered면 라임 번호 동그라미(+작은 설명), 아니면 체크 줄 */
const BoxCard: React.FC<{items: {label: string; detail?: string}[]; numbered?: boolean}> = ({items, numbered}) => {
  const p = useBounce(14);
  return (
    <div style={{borderRadius: 34, background: CARD, boxShadow: '0 12px 32px rgba(0,0,0,0.3)', padding: '20px 52px', wordBreak: 'keep-all', ...rise(p), transform: `translateY(${(1 - Math.min(p, 1)) * 48}px) rotate(-0.8deg)`}}>
      {items.map((it, i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, padding: '30px 0', borderTop: i ? '2px solid rgba(0,0,0,0.1)' : 'none'}}>
          {numbered && <div style={{flex: '0 0 66px', width: 66, height: 66, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 34}}>{i + 1}</div>}
          <div style={{flex: 1}}>
            <div style={{color: INK, fontWeight: 800, fontSize: numbered ? 46 : 44, lineHeight: 1.25, letterSpacing: -1.5}}>{it.label}</div>
            {it.detail && <div style={{color: INK_SUB, fontWeight: 700, fontSize: 36, lineHeight: 1.3, letterSpacing: -1, marginTop: 6}}>{it.detail}</div>}
          </div>
          {!numbered && <Check />}
        </div>
      ))}
    </div>
  );
};

const Timeline: React.FC<{items: {label: string; detail?: string}[]}> = ({items}) => {
  const lineP = Math.min(useIn(10), 1);
  return (
    <div style={{position: 'relative', paddingLeft: 0}}>
      <div style={{position: 'absolute', left: 33, top: 36, bottom: 36, width: 8, borderRadius: 4, background: ACCENT, transformOrigin: 'top', transform: `scaleY(${lineP})`, boxShadow: '0 0 12px rgba(0,0,0,0.4)'}} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 64}}>
        {items.map((it, i) => (
          <TimeRow key={i} it={it} i={i} />
        ))}
      </div>
    </div>
  );
};

const TimeRow: React.FC<{it: {label: string; detail?: string}; i: number}> = ({it, i}) => {
  const p = useBounce(14 + i * 10);
  return (
    <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 34, wordBreak: 'keep-all', opacity: Math.min(p, 1), transform: `translateX(${(1 - p) * -50}px)`}}>
      <div style={{flex: '0 0 74px', width: 74, height: 74, borderRadius: '50%', background: ACCENT, border: `6px solid ${BG}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 36, boxShadow: '0 6px 16px rgba(0,0,0,0.4)'}}>{i + 1}</div>
      <div>
        <div style={{color: TITLE, fontWeight: 800, fontSize: 56, lineHeight: 1.2, letterSpacing: -1.5, textShadow: SHADOW}}>{it.label}</div>
        {it.detail && <div style={{color: TITLE, fontWeight: 700, fontSize: 38, lineHeight: 1.25, letterSpacing: -1, marginTop: 6, opacity: 0.92, textShadow: SHADOW}}>{it.detail}</div>}
      </div>
    </div>
  );
};

/** 좌우 분할: 왼쪽 큰 라임 숫자·글자, 오른쪽 설명 줄 (카드 없음) */
const Split: React.FC<{big: string; sub?: string; lines: {label: string; detail?: string}[]}> = ({big, sub, lines}) => {
  const p = useBounce(10);
  return (
    <div>
      <div style={{display: 'flex', flexDirection: [...big].length > 3 ? 'column' : 'row', alignItems: [...big].length > 3 ? 'flex-start' : 'flex-end', gap: [...big].length > 3 ? 8 : 28, marginBottom: 34, opacity: Math.min(p, 1), transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: 'left center'}}>
        <div style={{color: ACCENT, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 176, lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap', textShadow: SHADOW_SOFT}}>
          <CountText text={big} />
        </div>
        {sub && <div style={{color: TITLE, fontWeight: 800, fontSize: 48, lineHeight: 1.25, letterSpacing: -1.5, paddingBottom: [...big].length > 3 ? 0 : 14, textShadow: SHADOW, whiteSpace: 'pre-line'}}>{sub}</div>}
      </div>
      <InfoRows rows={lines.map((l) => ({left: [l.label, l.detail].filter(Boolean).join(' ').replace(/\n/g, ' ')}))} />
    </div>
  );
};

const SplitLine: React.FC<{l: {label: string; detail?: string}; i: number}> = ({l, i}) => {
  const p = useBounce(18 + i * 8);
  return (
    <div style={{padding: '16px 0', wordBreak: 'keep-all', whiteSpace: 'pre-line', opacity: Math.min(p, 1), transform: `translateX(${(1 - p) * 40}px)`}}>
      <div style={{color: TITLE, fontWeight: 800, fontSize: 46, lineHeight: 1.2, letterSpacing: -1.5, textShadow: SHADOW}}>{l.label}</div>
      {l.detail && <div style={{color: TITLE, fontWeight: 700, fontSize: 34, lineHeight: 1.25, marginTop: 4, opacity: 0.92, textShadow: SHADOW}}>{l.detail}</div>}
    </div>
  );
};


/** 가로 눈금 막대: 적정 구간을 라임색으로 채우고, 위에 검정 말풍선으로 값을 가리킨다 */
const Scale: React.FC<{min: number; max: number; from: number; to: number; mark: number; unit?: string}> = ({min, max, from, to, mark, unit = ''}) => {
  const frame = useCurrentFrame();
  const p = useBounce(10);
  const stroke = useTitleStroke();
  const grow = interpolate(frame, [14, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / 2) * 2; v <= max; v += 2) ticks.push(v);
  return (
    <div style={{opacity: Math.min(p, 1)}}>
      <div style={{textAlign: 'center', color: ACCENT, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 380, lineHeight: 1, letterSpacing: '-0.02em', textShadow: SHADOW_SOFT, ...stroke}}>
        <CountText text={`${mark}${unit}`} />
      </div>
      <div style={{position: 'relative', height: 190, margin: '40px 20px 0'}}>
        <div style={{position: 'absolute', left: `${pct(mark)}%`, top: 0, width: 0, height: 0, marginLeft: -26, borderLeft: '26px solid transparent', borderRight: '26px solid transparent', borderTop: '40px solid #000'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 54, height: 64, borderRadius: 32, background: 'rgba(255,255,255,0.5)'}} />
        <div style={{position: 'absolute', left: `${pct(from)}%`, width: `${(pct(to) - pct(from)) * grow}%`, top: 54, height: 64, borderRadius: 32, background: ACCENT}} />
        {ticks.map((v) => (
          <div key={v} style={{position: 'absolute', left: `${pct(v)}%`, top: 136, transform: 'translateX(-50%)', color: TITLE, fontWeight: 900, fontSize: 46, textShadow: SHADOW}}>{v}</div>
        ))}
      </div>
    </div>
  );
};

/** 질문(검정, 오른쪽)과 답(아이보리, 왼쪽) 말풍선 대화 */
const Chat: React.FC<{items: {side: 'q' | 'a'; text: string}[]}> = ({items}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 56}}>
    {items.map((it, i) => (
      <Bubble key={i} it={it} i={i} />
    ))}
  </div>
);
const Bubble: React.FC<{it: {side: 'q' | 'a'; text: string}; i: number}> = ({it, i}) => {
  const p = useBounce(14 + i * 12);
  const q = it.side === 'q';
  return (
    <div style={{alignSelf: q ? 'flex-end' : 'flex-start', maxWidth: '94%', position: 'relative', background: q ? '#000' : CARD, color: q ? TITLE : INK, fontWeight: 800, fontSize: 76, lineHeight: 1.3, letterSpacing: -2, padding: '56px 80px', borderRadius: 96, wordBreak: 'keep-all', boxShadow: '0 10px 28px rgba(0,0,0,0.25)', opacity: Math.min(p, 1), transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})`, transformOrigin: q ? 'right bottom' : 'left bottom'}}>
      <Rich text={it.text} marker />
      <div style={{position: 'absolute', bottom: 26, [q ? 'right' : 'left']: -12, width: 38, height: 38, background: q ? '#000' : CARD, borderRadius: 12, transform: 'rotate(45deg)'}} />
    </div>
  );
};

/** 강 → 약 처럼 바꾸는 모습: 흐린 칸에서 라임 칸으로 화살표 */
const Swap: React.FC<{from: string; to: string}> = ({from, to}) => {
  const p1 = useBounce(10);
  const p2 = useBounce(22);
  const box: React.CSSProperties = {width: 380, height: 380, borderRadius: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 230, letterSpacing: '-0.02em'};
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 44, marginBottom: 30}}>
      <div style={{...box, background: 'rgba(245,245,239,0.9)', color: INK_SUB, opacity: Math.min(p1, 1) * 0.85, transform: `scale(${0.7 + 0.3 * p1})`}}>{from}</div>
      <svg width="140" height="90" viewBox="0 0 110 70" style={{opacity: Math.min(p2, 1)}}>
        <path d="M6 35 H92 M68 10 L98 35 L68 60" fill="none" stroke={ACCENT} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{...box, background: ACCENT, color: INK, opacity: Math.min(p2, 1), transform: `scale(${0.7 + 0.3 * p2})`}}>{to}</div>
    </div>
  );
};

/** 번호 배지: 이 컷에 해당하는 번호만 라임 알약으로(예: 01 / 02 03 / 덤) */
const NumTracker: React.FC<{no: string; total: number; style?: React.CSSProperties}> = ({no, style}) => {
  const nums = /[가-힣]/.test(no) || /^\s*\d+\s*\/\s*\d+\s*$/.test(no) ? null : no.match(/\d+/g); // '1/5'처럼 번호/전체 표기도 그대로 한 칩에 보여 준다 // 한글이 섞인 글(예: '5가지 중 첫째')은 숫자만 뽑지 않고 그대로 보여 준다
  const labels = nums ? nums.map((n) => pad(Number(n))) : [no];
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26, ...style}}>
      {labels.map((t) => (
        <div key={t} style={{background: ACCENT, color: INK, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 52, lineHeight: 1, letterSpacing: '-0.02em', padding: '14px 32px', borderRadius: 999}}>
          {t}
        </div>
      ))}
    </div>
  );
};

/** 본문 공통 틀: 상단 로고, 라벨·제목·설명, 아래쪽 내용, 별 */
const Frame: React.FC<{count?: boolean; shape?: ShapeKind; frames: number; index: number; total: number; brand?: string; label?: string; title: string; desc?: string; wide?: boolean; fill?: boolean; no?: string; noSub?: string; noTotal?: number; children?: React.ReactNode}> = ({no, noTotal, fill, count, shape, frames, index, total, brand, label, title, desc, wide, children}) => {
  const p0 = useIn(2);
  const p1 = useIn(6);
  const stroke = useTitleStroke();
  return (
    <Fade frames={frames}>
      <div style={{position: 'absolute', left: 100, right: 100, top: fill ? 170 : 0, bottom: fill ? 210 : 96, display: 'flex', flexDirection: 'column', justifyContent: fill ? 'flex-start' : 'center'}}>
        <div style={{position: 'relative', marginBottom: fill ? 20 : 48, textAlign: 'left'}}>
          {no && <NumTracker no={no} total={noTotal ?? 6} style={rise(p0)} />}
          {label && <div style={{color: ACCENT, fontWeight: 800, fontSize: 44, lineHeight: 1.16, letterSpacing: -1.5, marginBottom: 28, textShadow: SHADOW, ...rise(p0)}}>{label}</div>}
          <div style={{color: TITLE, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 100, lineHeight: 1.3, letterSpacing: '-0.03em', textShadow: SHADOW_SOFT, wordBreak: 'keep-all', ...stroke, ...rise(p1)}}>
            <Rich text={title} marker count={count} />
          </div>
          {!title.includes('[[') && !desc && <Wave style={{marginTop: 18}} />}
          {desc && <div style={{color: TITLE, fontWeight: 700, fontSize: 48, lineHeight: 1.16, letterSpacing: -1.5, marginTop: 28, textShadow: SHADOW, ...rise(p1)}}>{desc}</div>}
          <Star w={92} kind={shape ?? SHAPES[index % SHAPES.length]} style={SHAPE_SPOTS[index % SHAPE_SPOTS.length](wide)} delay={12} />
        </div>
        <div style={fill ? {flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'} : undefined}>{children}</div>
      </div>
    </Fade>
  );
};

/** 스크립트의 한 컷(kind)을 라임 레이아웃으로 바꿔 그린다 */
export const LimeScene: React.FC<{s: Scene; frames: number; index: number; total: number; brand?: string}> = ({s, frames, index, total, brand}) => {
  const kind = s.kind ?? 'text';
  const base = {frames, index, total, brand, shape: (s.shape as ShapeKind | undefined), no: s.no, noTotal: 6};
  const label = clean(s.label ?? '');
  const items = (s.cards ?? []).map((c) => ({label: clean(c.big), detail: clean(c.small ?? '') || undefined}));

  if (kind === 'scale' && s.scale) {
    return (
      <Frame {...base} fill label={label} title={s.text ?? ''}>
        <Scale {...s.scale} />
        {s.chips && <InfoRows rows={s.chips.map((c) => ({left: clean(c)}))} />}
      </Frame>
    );
  }
  if (kind === 'chat' && s.chat) {
    return (
      <Frame {...base} fill label={label} title={s.text ?? ''}>
        <Chat items={s.chat.map((c) => ({side: c.side, text: clean(c.text)}))} />
      </Frame>
    );
  }
  if (kind === 'swap' && s.swap) {
    return (
      <Frame {...base} fill label={label} title={s.text ?? ''}>
        <Swap from={clean(s.swap.from)} to={clean(s.swap.to)} />
        {s.stat && <Split big={clean(s.stat.big)} sub={clean(s.stat.sub ?? '')} lines={items} />}
      </Frame>
    );
  }
  if (kind === 'box') {
    return (
      <Frame {...base} title={s.text ?? label}>
        <BoxCard items={items} numbered={s.boxNum} />
      </Frame>
    );
  }
  if (kind === 'plain') {
    return (
      <Frame {...base} label={label} title={s.text ?? ''}>
        <PlainLines lines={[...(s.chips ?? []).map(clean), ...items.map((x) => x.label)]} />
      </Frame>
    );
  }
  if (kind === 'list') {
    return (
      <Frame {...base} title={label}>
        <NumList items={items} start={s.numStart ?? 0} />
      </Frame>
    );
  }
  if (kind === 'timeline') {
    return (
      <Frame {...base} title={label}>
        <Timeline items={items} />
      </Frame>
    );
  }
  if (kind === 'split' && s.stat) {
    return (
      <Frame {...base} label={label} title={s.text ?? ''}>
        <Split big={clean(s.stat.big)} sub={clean(s.stat.sub ?? '')} lines={items} />
      </Frame>
    );
  }

  if (kind === 'text') {
    const num = (s.text ?? '').match(/\[\[([^\]]*\d[^\]]*)\]\]/);
    return (
      <Frame {...base} count={!!num} label={label} title={s.text ?? ''}>
        {s.chips && <InfoRows rows={s.chips.map((c) => ({left: clean(c)}))} />}
      </Frame>
    );
  }
  if (kind === 'checklist' && s.stat) {
    return (
      <Frame {...base} count label={label} title={`[[${clean(s.stat.big)}]]`} desc={clean(s.stat.sub ?? '')}>
        <InfoRows rows={(s.cards ?? []).map((c) => ({left: clean(c.big)}))} />
      </Frame>
    );
  }
  if (kind === 'table' && s.table) {
    return (
      <Frame {...base} title={label}>
        <InfoRows rows={s.table.rows.map((r) => ({left: clean(r[0]), right: clean(r.slice(1).join(' '))}))} />
      </Frame>
    );
  }
  if ((kind === 'steps' || kind === 'flow' || kind === 'cards') && s.cards && s.cards.length <= 3 && s.cards.length >= 2) {
    return (
      <Frame {...base} title={label} wide>
        <StepCards steps={s.cards.map((c, i) => ({n: pad(i + 1 + (s.numStart ?? 0)), label: clean(c.big), detail: clean(c.small ?? '')}))} noNum={!!s.no} />
      </Frame>
    );
  }
  if (s.cards) {
    return (
      <Frame {...base} title={label}>
        <InfoRows rows={s.cards.map((c) => ({left: clean(c.big), right: clean(c.small ?? '') || undefined}))} />
      </Frame>
    );
  }
  if (kind === 'stat' && s.stat) {
    return (
      <Frame {...base} title={label}>
        <div style={{color: ACCENT, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 220, lineHeight: 1.05, letterSpacing: '-0.02em', textShadow: SHADOW_SOFT}}><CountText text={clean(s.stat.big)} /></div>
        {s.stat.sub && <div style={{color: TITLE, fontWeight: 700, fontSize: 46, lineHeight: 1.2, letterSpacing: -1.5, margin: '12px 0 40px', whiteSpace: 'pre-line', textShadow: SHADOW}}>{clean(s.stat.sub)}</div>}
        {s.stat.chips && <InfoRows rows={s.stat.chips.map((c) => ({left: clean(c)}))} />}
      </Frame>
    );
  }
  if (kind === 'compare' && s.compare) {
    const c = s.compare;
    return (
      <Frame {...base} title={label}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 44}}>
          {[
            {t: c.leftTitle, items: c.leftItems},
            {t: c.rightTitle, items: c.rightItems},
          ].map((g, gi) => (
            <div key={gi}>
              <div style={{color: ACCENT, fontWeight: 800, fontSize: 44, letterSpacing: -1.5, marginBottom: 18, textShadow: SHADOW}}>{clean(g.t)}</div>
              <InfoRows rows={g.items.map((x) => ({left: clean(x)}))} />
            </div>
          ))}
        </div>
      </Frame>
    );
  }
  return <Frame {...base} title={label} />;
};

/** 마지막 화면 팔로우 카드: 프로필 + 라임 팔로우 버튼(누를 수 없는 그림이라 손가락은 그리지 않는다) */
const FollowCard: React.FC<{id: string; sub?: string; avatar?: string}> = ({id, sub, avatar}) => {
  const p = useIn(26);
  const f = useCurrentFrame();
  const pulse = 1 + 0.035 * Math.sin(Math.max(0, f - 40) / 6);
  return (
    <div style={{marginTop: 56, width: '100%', boxSizing: 'border-box', background: '#000', borderRadius: 48, padding: '38px 44px', display: 'flex', alignItems: 'center', gap: 32, boxShadow: '0 10px 28px rgba(0,0,0,0.4)', ...rise(p)}}>
      {avatar ? (
        <Img src={staticFile(avatar)} style={{width: 112, height: 112, borderRadius: '50%', objectFit: 'cover', flex: '0 0 112px'}} />
      ) : (
        <div style={{width: 112, height: 112, flex: '0 0 112px', borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK, fontFamily: FONT, fontWeight: 800, fontSize: 56, WebkitTextStroke: '0px transparent', textShadow: 'none'}}>{[...id][0]?.toUpperCase()}</div>
      )}
      <div style={{flex: 1, minWidth: 0, textAlign: 'left', wordBreak: 'keep-all'}}>
        <div style={{color: TITLE, fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: '-0.02em', lineHeight: 1.2, whiteSpace: 'nowrap', WebkitTextStroke: '0px transparent', textShadow: 'none'}}>{id}</div>
        {sub && <div style={{color: DESC, fontWeight: 700, fontSize: 32, lineHeight: 1.3, marginTop: 6, letterSpacing: -0.5, WebkitTextStroke: '0px transparent', textShadow: 'none'}}>{sub}</div>}
      </div>
      <div style={{flex: '0 0 auto', background: ACCENT, color: INK, fontFamily: FONT, fontWeight: 700, fontSize: 36, letterSpacing: '-0.02em', padding: '20px 40px', borderRadius: 999, WebkitTextStroke: '0px transparent', textShadow: 'none', transform: `scale(${pulse})`}}>팔로우</div>
    </div>
  );
};

/** 마지막 화면: 화면 가운데 가운데 정렬 문구 + 라임 버튼 + 아래쪽 트랙 */
export const LimeCta: React.FC<{frames: number; label?: string; text: string; brand?: string; icon?: 'bookmark' | 'comment'; follow?: {id: string; sub?: string; avatar?: string}}> = ({frames, label, text, brand, icon = 'bookmark', follow}) => {
  const p0 = useIn(2);
  const p1 = useIn(8);
  const p2 = useIn(16);
  const stroke = useTitleStroke();
  const fx = useContext(TitleFxContext);
  return (
    <Fade frames={frames}>
      <div style={{position: 'absolute', left: 96, right: 96, top: 0, bottom: follow ? 110 : 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        {brand && !follow && <div style={{color: ACCENT, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 36, letterSpacing: '-0.02em', marginBottom: 48, textShadow: SHADOW, ...rise(p0)}}>{clean(brand)}</div>}
        <div style={{position: 'relative'}}>
          <div style={{color: CTA_TITLE, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: follow ? 96 : 110, lineHeight: 1.4, letterSpacing: '-0.03em', textShadow: SHADOW_SOFT, ...stroke, ...rise(p1)}}>
            <Rich text={text} fx={fx} fxStart={8} />
          </div>
          <Star w={92} kind="sparkle" style={{right: -70, top: -78}} delay={14} />
        </div>
        {label && (
          <div style={{marginTop: 64, background: ACCENT, color: BG, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 40, letterSpacing: '-0.02em', lineHeight: 1.4, padding: '24px 40px', borderRadius: 36, display: 'flex', alignItems: 'center', gap: 16, ...rise(p2)}}>
            {icon === 'comment' ? (
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke={BG} strokeWidth={2.4} strokeLinejoin="round" fill={BG} /></svg>
            ) : (
              <svg width={34} height={34} viewBox="0 0 24 24" fill="none"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" stroke={BG} strokeWidth={2.6} strokeLinejoin="round" fill={BG} /></svg>
            )}
            {clean(label)}
          </div>
        )}
        {follow && brand && <div style={{marginTop: 40, color: ACCENT, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 38, letterSpacing: '-0.02em', textShadow: SHADOW, ...rise(p2)}}>{clean(brand)}</div>}
        {follow && <FollowCard id={follow.id} sub={follow.sub} avatar={follow.avatar} />}
      </div>
    </Fade>
  );
};
