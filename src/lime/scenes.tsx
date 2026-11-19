import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Scene} from '../types';
import {useFadeOut} from '../cute/parts';
import {ACCENT, BG, CTA_TITLE, DESC, FONT, MUTED, ROW, TITLE} from './theme';
import {Check, clean, Rich, Star, Track, useIn, Wordmark} from './parts';

const pad = (n: number) => String(n).padStart(2, '0');

const Fade: React.FC<{frames: number; children: React.ReactNode; bg?: boolean}> = ({frames, children, bg}) => {
  const out = useFadeOut(frames);
  return <AbsoluteFill style={{opacity: out, background: bg ? BG : undefined, fontFamily: FONT}}>{children}</AbsoluteFill>;
};

const rise = (p: number): React.CSSProperties => ({opacity: Math.min(p, 1), transform: `translateY(${(1 - Math.min(p, 1)) * 36}px)`});

/** 표지: 전면 사진(영상) + 하단 그라디언트 + 아래쪽 큰 제목 */
export const LimeCover: React.FC<{frames: number; label?: string; text: string; brand?: string}> = ({frames, label, text, brand}) => {
  const p1 = useIn(4);
  const p2 = useIn(12);
  return (
    <Fade frames={frames}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.30) 72%, rgba(0,0,0,0.80) 100%)'}} />
      {brand && <Wordmark text={clean(brand)} style={{left: 72, top: 72}} />}
      <Star w={77} style={{left: 63, top: 760}} delay={14} />
      <Star w={101} style={{right: 100, bottom: 360}} delay={8} />
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 150}}>
        <div style={{color: TITLE, fontWeight: 700, fontSize: 88, lineHeight: 1.2, letterSpacing: -2, ...rise(p1)}}>
          <Rich text={text} />
        </div>
        {label && <div style={{color: DESC, fontWeight: 400, fontSize: 40, lineHeight: 1.16, letterSpacing: -2, marginTop: 28, ...rise(p2)}}>{clean(label)}</div>}
      </div>
    </Fade>
  );
};

type Row = {left: string; right?: string};

const InfoRows: React.FC<{rows: Row[]}> = ({rows}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
    {rows.map((r, i) => (
      <InfoRow key={i} r={r} i={i} />
    ))}
  </div>
);

const InfoRow: React.FC<{r: Row; i: number}> = ({r, i}) => {
  const p = useIn(16 + i * 8);
  const single = r.right === undefined;
  return (
    <div style={{minHeight: 170, borderRadius: 30, background: ROW, padding: '34px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, wordBreak: 'keep-all', ...rise(p)}}>
      <div style={{color: single ? TITLE : ACCENT, fontWeight: single ? 700 : 700, fontSize: single ? 44 : 36, lineHeight: 1.25, letterSpacing: -1.5}}>{r.left}</div>
      {single ? <Check /> : <div style={{color: DESC, fontWeight: 400, fontSize: 36, lineHeight: 1.25, letterSpacing: -1.5, textAlign: 'right'}}>{r.right}</div>}
    </div>
  );
};

type Step = {n: string; label: string; detail?: string};

const StepCards: React.FC<{steps: Step[]}> = ({steps}) => (
  <div style={{display: 'flex', gap: 20}}>
    {steps.map((s, i) => (
      <StepCard key={i} s={s} i={i} />
    ))}
  </div>
);

const StepCard: React.FC<{s: Step; i: number}> = ({s, i}) => {
  const p = useIn(16 + i * 8);
  const hi = i === 0;
  return (
    <div style={{flex: 1, minHeight: 560, borderRadius: 30, padding: 30, background: hi ? ACCENT : ROW, color: hi ? BG : TITLE, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', wordBreak: 'keep-all', ...rise(p)}}>
      <div style={{fontWeight: 700, fontSize: 76, letterSpacing: -2}}>{s.n}</div>
      <div>
        <div style={{fontWeight: 700, fontSize: 40, lineHeight: 1.2, letterSpacing: -1.5}}>{s.label}</div>
        {s.detail && (
          <>
            <div style={{height: 1, background: hi ? 'rgba(20,23,19,0.35)' : 'rgba(255,255,255,0.25)', margin: '20px 0'}} />
            <div style={{fontWeight: 400, fontSize: 30, lineHeight: 1.3, letterSpacing: -1, color: hi ? BG : DESC}}>{s.detail}</div>
          </>
        )}
      </div>
    </div>
  );
};

/** 본문 공통 틀: 상단 로고, 라벨·제목·설명, 아래쪽 내용, 별 */
const Frame: React.FC<{frames: number; index: number; total: number; brand?: string; label?: string; title: string; desc?: string; wide?: boolean; children?: React.ReactNode}> = ({frames, index, total, brand, label, title, desc, wide, children}) => {
  const p0 = useIn(2);
  const p1 = useIn(6);
  return (
    <Fade frames={frames} bg>
      {brand && <Wordmark text={clean(brand)} style={{right: 120, top: 90}} />}
      <div style={{position: 'absolute', left: wide ? 72 : 120, right: wide ? 72 : 120, top: 240, bottom: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{position: 'relative', marginBottom: 150, paddingLeft: wide ? 48 : 0, paddingRight: wide ? 48 : 0}}>
          {label && <div style={{color: ACCENT, fontWeight: 700, fontSize: 36, lineHeight: 1.16, letterSpacing: -2, marginBottom: 28, ...rise(p0)}}>{label}</div>}
          <div style={{color: TITLE, fontWeight: 700, fontSize: 80, lineHeight: 1.2, letterSpacing: -2, ...rise(p1)}}>
            <Rich text={title} />
          </div>
          {desc && <div style={{color: DESC, fontWeight: 400, fontSize: 40, lineHeight: 1.16, letterSpacing: -2, marginTop: 28, ...rise(p1)}}>{desc}</div>}
          <Star w={101} style={{right: wide ? 28 : -20, bottom: -132}} delay={12} />
        </div>
        <div>{children}</div>
      </div>
      <div style={{position: 'absolute', right: 72, bottom: 96, color: MUTED, fontWeight: 700, fontSize: 28, letterSpacing: 1}}>{pad(index)} / {pad(total)}</div>
    </Fade>
  );
};

/** 스크립트의 한 컷(kind)을 라임 레이아웃으로 바꿔 그린다 */
export const LimeScene: React.FC<{s: Scene; frames: number; index: number; total: number; brand?: string}> = ({s, frames, index, total, brand}) => {
  const kind = s.kind ?? 'text';
  const base = {frames, index, total, brand};
  const label = clean(s.label ?? '');

  if (kind === 'text') {
    return (
      <Frame {...base} label={label} title={s.text ?? ''}>
        {s.chips && <InfoRows rows={s.chips.map((c) => ({left: clean(c)}))} />}
      </Frame>
    );
  }
  if (kind === 'checklist' && s.stat) {
    return (
      <Frame {...base} label={label} title={`[[${clean(s.stat.big)}]]`} desc={clean(s.stat.sub ?? '')}>
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
        <div style={{color: ACCENT, fontWeight: 800, fontSize: 220, lineHeight: 1.05, letterSpacing: -6}}>{clean(s.stat.big)}</div>
        {s.stat.sub && <div style={{color: DESC, fontWeight: 400, fontSize: 40, lineHeight: 1.2, letterSpacing: -2, margin: '12px 0 40px', whiteSpace: 'pre-line'}}>{clean(s.stat.sub)}</div>}
        {s.stat.chips && <InfoRows rows={s.stat.chips.map((c) => ({left: clean(c)}))} />}
      </Frame>
    );
  }
  if (kind === 'compare' && s.compare) {
    const c = s.compare;
    return (
      <Frame {...base} title={label}>
        <InfoRows rows={[...c.leftItems.map((x) => ({left: clean(c.leftTitle), right: clean(x)})), ...c.rightItems.map((x) => ({left: clean(c.rightTitle), right: clean(x)}))]} />
      </Frame>
    );
  }
  return <Frame {...base} title={label} />;
};

/** 마지막 화면: 중앙 문구 + 라임 버튼 + 아래쪽 트랙 */
export const LimeCta: React.FC<{frames: number; label?: string; text: string; brand?: string}> = ({frames, label, text, brand}) => {
  const p0 = useIn(2);
  const p1 = useIn(8);
  const p2 = useIn(16);
  return (
    <Fade frames={frames} bg>
      <Track style={{left: -65, top: 1200}} />
      {brand && <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', color: ACCENT, fontWeight: 800, fontSize: 32, letterSpacing: -1, ...rise(p0)}}>{clean(brand)}</div>}
      <div style={{position: 'absolute', left: 64, right: 64, top: 600, textAlign: 'center', color: CTA_TITLE, fontWeight: 700, fontSize: 88, lineHeight: 1.16, letterSpacing: -2, ...rise(p1)}}>
        <Rich text={text} />
      </div>
      {label && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', ...rise(p2)}}>
          <div style={{background: ACCENT, color: BG, fontWeight: 700, fontSize: 32, letterSpacing: -2, lineHeight: 1.4, padding: '20px 32px', borderRadius: 32}}>{clean(label)} ↗</div>
        </div>
      )}
    </Fade>
  );
};
