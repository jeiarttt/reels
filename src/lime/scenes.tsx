import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Scene} from '../types';
import {useFadeOut} from '../cute/parts';
import {ACCENT, BG, CARD, CTA_TITLE, DESC, FONT, FONT_TITLE, INK, INK_ACCENT, INK_SUB, MUTED, TITLE} from './theme';
import {Check, clean, CountText, Rich, SHAPES, Star, useBounce, useIn, Wave, Wordmark} from './parts';
import type {ShapeKind} from './parts';

/** 영상 위 작은 글자가 묻히지 않도록 짙은 그림자를 깐다 */
const SHADOW = '0 2px 14px rgba(0,0,0,0.7), 0 0 3px rgba(0,0,0,0.5)';
const SHADOW_SOFT = '0 4px 24px rgba(0,0,0,0.35)';

const pad = (n: number) => String(n).padStart(2, '0');

/** 도형 자리(머리글 기준): 제목 오른쪽 위, 카드 모서리에 살짝 걸치기, 제목 위쪽 오른쪽을 돌려 쓴다 */
const SHAPE_SPOTS: ((wide?: boolean) => React.CSSProperties)[] = [
  (w) => ({right: w ? 40 : 0, top: -10}),
  (w) => ({right: w ? 20 : -26, bottom: -64}),
  (w) => ({right: w ? 90 : 70, top: -92}),
];

const Fade: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => {
  const out = useFadeOut(frames);
  return <AbsoluteFill style={{opacity: out, fontFamily: FONT}}>{children}</AbsoluteFill>;
};

const rise = (p: number): React.CSSProperties => ({opacity: Math.min(p, 1), transform: `translateY(${(1 - Math.min(p, 1)) * 36}px)`});

/** 표지: 화면 한가운데 가운데 정렬. 검정 알약(계정 글자) → 큰 제목(양옆 도형) → 작은 두 줄(숫자는 라임색) */
export const LimeCover: React.FC<{frames: number; label?: string; sub?: string; text: string; brand?: string}> = ({frames, label, sub, text, brand}) => {
  const pPill = useIn(2);
  const p1 = useIn(5);
  const p2 = useIn(12);
  const p3 = useIn(18);
  const lines = text.split('\n');
  const longest = Math.max(...lines.map((l) => [...l.replace(/\[\[|\]\]/g, '')].length), 1);
  const titleSize = Math.min(100, Math.floor(900 / (longest * 0.75)));
  return (
    <Fade frames={frames}>
      <div style={{position: 'absolute', left: 72, right: 72, top: 0, bottom: 96, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        {brand && (
          <div style={{background: '#000', color: TITLE, fontWeight: 700, fontSize: 36, letterSpacing: -1, height: 87, lineHeight: '87px', padding: '0 58px', borderRadius: 999, marginBottom: 58, ...rise(pPill)}}>{clean(brand)}</div>
        )}
        <div style={{color: TITLE, fontFamily: FONT_TITLE, fontWeight: 800, fontSize: titleSize, lineHeight: 1.38, letterSpacing: -2, textShadow: SHADOW_SOFT, ...rise(p1)}}>
          {lines.map((ln, i) => (
            <div key={i} style={{position: 'relative', display: 'table', margin: '0 auto'}}>
              <Rich text={ln} marker />
              {i === 0 && <Star w={86} kind="sparkle" style={{left: -116, top: 2}} delay={14} />}
              {i === 0 && <Star w={96} kind="burst" style={{right: -102, top: -3}} delay={8} />}
            </div>
          ))}
        </div>
        {label && (
          <div style={{color: TITLE, fontWeight: 700, fontSize: 50, lineHeight: 1.92, letterSpacing: -1.5, marginTop: 54, textShadow: SHADOW, ...rise(p2)}}>
            <Rich text={label} />
          </div>
        )}
        {sub && <div style={{color: TITLE, fontWeight: 700, fontSize: 34, lineHeight: 1.4, letterSpacing: -1, marginTop: 36, opacity: 0.92, textShadow: SHADOW, whiteSpace: 'pre-line', ...rise(p3)}}>{clean(sub)}</div>}
      </div>
    </Fade>
  );
};

type Row = {left: string; right?: string};

const InfoRows: React.FC<{rows: Row[]}> = ({rows}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
    {rows.map((r, i) => (
      <InfoRow key={i} r={r} i={i} />
    ))}
  </div>
);

const InfoRow: React.FC<{r: Row; i: number}> = ({r, i}) => {
  const p = useBounce(16 + i * 8);
  const tilt = [-1.4, 1.1, -0.9, 1.3][i % 4];
  const single = r.right === undefined;
  return (
    <div style={{minHeight: 196, borderRadius: 30, background: CARD, boxShadow: '0 10px 28px rgba(0,0,0,0.28)', padding: '34px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, wordBreak: 'keep-all', ...rise(p), transform: `translateY(${(1 - p) * 48}px) rotate(${tilt}deg)`}}>
      <div style={{color: single ? INK : INK_ACCENT, fontWeight: 800, fontSize: single ? 50 : 42, lineHeight: 1.25, letterSpacing: -1.5}}>{r.left}</div>
      {single ? <Check /> : <div style={{color: INK_SUB, fontWeight: 700, fontSize: 42, lineHeight: 1.25, letterSpacing: -1.5, textAlign: 'right'}}>{r.right}</div>}
    </div>
  );
};

type Step = {n: string; label: string; detail?: string};

const StepCards: React.FC<{steps: Step[]}> = ({steps}) => (
  <div style={{display: 'flex', gap: 20}}>
    {steps.map((s, i) => (
      <StepCard key={i} s={s} i={i} compact={steps.every((x) => !x.detail)} />
    ))}
  </div>
);

const StepCard: React.FC<{s: Step; i: number; compact?: boolean}> = ({s, i, compact}) => {
  const p = useBounce(16 + i * 8);
  const tilt = [-2, 1.4, -1][i % 3];
  const hi = i === 0;
  return (
    <div style={{flex: 1, minHeight: compact ? 430 : 620, borderRadius: 30, padding: 32, background: hi ? ACCENT : CARD, color: INK, boxShadow: '0 10px 28px rgba(0,0,0,0.28)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', wordBreak: 'keep-all', ...rise(p), transform: `translateY(${(1 - p) * 60}px) rotate(${tilt}deg)`}}>
      <div style={{fontWeight: 700, fontSize: 88, letterSpacing: -2}}>{s.n}</div>
      <div>
        <div style={{fontWeight: 800, fontSize: 46, lineHeight: 1.2, letterSpacing: -1.5}}>{s.label}</div>
        {s.detail && (
          <>
            <div style={{height: 1, background: 'rgba(20,23,19,0.30)', margin: '20px 0'}} />
            <div style={{fontWeight: 700, fontSize: 36, lineHeight: 1.3, letterSpacing: -1, color: hi ? INK : INK_SUB, minHeight: 94}}>{s.detail}</div>
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
const NumList: React.FC<{items: {label: string; detail?: string}[]}> = ({items}) => (
  <div>
    {items.map((it, i) => (
      <NumRow key={i} it={it} i={i} last={i === items.length - 1} />
    ))}
  </div>
);

const NumRow: React.FC<{it: {label: string; detail?: string}; i: number; last: boolean}> = ({it, i, last}) => {
  const p = useBounce(14 + i * 8);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 36, padding: '30px 0', borderBottom: last ? 'none' : '3px solid rgba(255,255,255,0.35)', wordBreak: 'keep-all', opacity: Math.min(p, 1), transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{flex: '0 0 120px', color: ACCENT, fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 108, lineHeight: 1, letterSpacing: -4, textShadow: SHADOW_SOFT}}>{pad(i + 1)}</div>
      <div>
        <div style={{color: TITLE, fontWeight: 800, fontSize: 54, lineHeight: 1.2, letterSpacing: -1.5, textShadow: SHADOW}}>{it.label}</div>
        {it.detail && <div style={{color: TITLE, fontWeight: 700, fontSize: 38, lineHeight: 1.25, letterSpacing: -1, marginTop: 8, opacity: 0.92, textShadow: SHADOW}}>{it.detail}</div>}
      </div>
    </div>
  );
};

/** 세로 타임라인: 라임 선 위에 번호 동그라미가 이어지고 오른쪽에 글자 */
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
      <div style={{flex: '0 0 74px', width: 74, height: 74, borderRadius: '50%', background: ACCENT, border: `6px solid ${BG}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK, fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 36, boxShadow: '0 6px 16px rgba(0,0,0,0.4)'}}>{i + 1}</div>
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
    <div style={{display: 'flex', alignItems: 'center', gap: 44}}>
      <div style={{flex: '0 0 410px', opacity: Math.min(p, 1), transform: `scale(${0.7 + 0.3 * p}) rotate(${-2 * Math.min(p, 1)}deg)`, transformOrigin: 'left center'}}>
        <div style={{color: ACCENT, fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 176, lineHeight: 1, letterSpacing: -7, whiteSpace: 'nowrap', textShadow: SHADOW_SOFT}}>
          <CountText text={big} />
        </div>
        {sub && <div style={{color: TITLE, fontWeight: 800, fontSize: 44, lineHeight: 1.2, letterSpacing: -1.5, marginTop: 12, textShadow: SHADOW, whiteSpace: 'pre-line'}}>{sub}</div>}
      </div>
      <div style={{flex: 1, borderLeft: '4px solid rgba(255,255,255,0.45)', paddingLeft: 36}}>
        {lines.map((l, i) => (
          <SplitLine key={i} l={l} i={i} />
        ))}
      </div>
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

/** 본문 공통 틀: 상단 로고, 라벨·제목·설명, 아래쪽 내용, 별 */
const Frame: React.FC<{count?: boolean; shape?: ShapeKind; frames: number; index: number; total: number; brand?: string; label?: string; title: string; desc?: string; wide?: boolean; children?: React.ReactNode}> = ({count, shape, frames, index, total, brand, label, title, desc, wide, children}) => {
  const p0 = useIn(2);
  const p1 = useIn(6);
  return (
    <Fade frames={frames}>
      {brand && <Wordmark text={clean(brand)} style={{right: 120, top: 90}} />}
      <div style={{position: 'absolute', left: wide ? 72 : 120, right: wide ? 72 : 120, top: 240, bottom: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{position: 'relative', marginBottom: 72, paddingLeft: wide ? 48 : 0, paddingRight: wide ? 48 : 0}}>
          {label && <div style={{color: ACCENT, fontWeight: 800, fontSize: 44, lineHeight: 1.16, letterSpacing: -1.5, marginBottom: 28, textShadow: SHADOW, ...rise(p0)}}>{label}</div>}
          <div style={{color: TITLE, fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 92, lineHeight: 1.25, letterSpacing: -2, textShadow: SHADOW_SOFT, ...rise(p1)}}>
            <Rich text={title} marker count={count} />
          </div>
          {!title.includes('[[') && !desc && <Wave style={{marginTop: 18}} />}
          {desc && <div style={{color: TITLE, fontWeight: 700, fontSize: 48, lineHeight: 1.16, letterSpacing: -1.5, marginTop: 28, textShadow: SHADOW, ...rise(p1)}}>{desc}</div>}
          <Star w={92} kind={shape ?? SHAPES[index % SHAPES.length]} style={SHAPE_SPOTS[index % SHAPE_SPOTS.length](wide)} delay={12} />
        </div>
        <div>{children}</div>
      </div>
    </Fade>
  );
};

/** 스크립트의 한 컷(kind)을 라임 레이아웃으로 바꿔 그린다 */
export const LimeScene: React.FC<{s: Scene; frames: number; index: number; total: number; brand?: string}> = ({s, frames, index, total, brand}) => {
  const kind = s.kind ?? 'text';
  const base = {frames, index, total, brand, shape: (s.shape as ShapeKind | undefined)};
  const label = clean(s.label ?? '');
  const items = (s.cards ?? []).map((c) => ({label: clean(c.big), detail: clean(c.small ?? '') || undefined}));

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
        <NumList items={items} />
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
    return (
      <Frame {...base} label={label} title={s.text ?? ''}>
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
        <StepCards steps={s.cards.map((c, i) => ({n: pad(i + 1), label: clean(c.big), detail: clean(c.small ?? '')}))} />
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
        <div style={{color: ACCENT, fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 220, lineHeight: 1.05, letterSpacing: -6, textShadow: SHADOW_SOFT}}><CountText text={clean(s.stat.big)} /></div>
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

/** 마지막 화면: 화면 가운데 가운데 정렬 문구 + 라임 버튼 + 아래쪽 트랙 */
export const LimeCta: React.FC<{frames: number; label?: string; text: string; brand?: string; icon?: 'bookmark' | 'comment'}> = ({frames, label, text, brand, icon = 'bookmark'}) => {
  const p0 = useIn(2);
  const p1 = useIn(8);
  const p2 = useIn(16);
  return (
    <Fade frames={frames}>
      <div style={{position: 'absolute', left: 64, right: 64, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        {brand && <div style={{color: ACCENT, fontWeight: 800, fontSize: 36, letterSpacing: -1, marginBottom: 48, textShadow: SHADOW, ...rise(p0)}}>{clean(brand)}</div>}
        <div style={{color: CTA_TITLE, fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 98, lineHeight: 1.22, letterSpacing: -2, textShadow: SHADOW_SOFT, ...rise(p1)}}>
          <Rich text={text} marker />
        </div>
        {label && (
          <div style={{marginTop: 64, background: ACCENT, color: BG, fontWeight: 800, fontSize: 40, letterSpacing: -1.5, lineHeight: 1.4, padding: '24px 40px', borderRadius: 36, display: 'flex', alignItems: 'center', gap: 16, ...rise(p2)}}>
            {icon === 'comment' ? (
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke={BG} strokeWidth={2.4} strokeLinejoin="round" fill={BG} /></svg>
            ) : (
              <svg width={34} height={34} viewBox="0 0 24 24" fill="none"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" stroke={BG} strokeWidth={2.6} strokeLinejoin="round" fill={BG} /></svg>
            )}
            {clean(label)}
          </div>
        )}
      </div>
    </Fade>
  );
};
