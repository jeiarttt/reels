#!/usr/bin/env python3
"""라임 스타일 표지를 SVG(1080x1920)로 만든다.
사용: python3 scripts/make-cover-svg.py <대본.json> <출력폴더> [배경 영상 초(기본 0.8)]
만드는 파일:
  <id>-cover.svg           글자를 편집할 수 있는 버전(글꼴 woff2를 안에 넣음)
  <id>-cover-outline.svg   글자를 도형(path)으로 바꾼 버전(글꼴이 없어도 똑같이 보임)
"""
import base64, json, math, os, subprocess, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

W, H = 1080, 1920
ACCENT, STAR, INK, WHITE, BG = '#E6FF65', '#E6FF63', '#141713', '#FFFFFF', '#141713'
FONTS = {
    'title': ('public/fonts/Paperlogy-8ExtraBold.woff2', 'Paperlogy', 800),
    'brand': ('public/fonts/Pretendard-ExtraBold.woff2', 'Pretendard', 800),
    'body': ('public/fonts/Pretendard-Bold.woff2', 'Pretendard', 700),
}
script_path, out_dir = sys.argv[1], sys.argv[2]
t_bg = float(sys.argv[3]) if len(sys.argv) > 3 else 0.8
os.makedirs(out_dir, exist_ok=True)
s = json.load(open(script_path, encoding='utf-8'))
sid = s['id']

fonts = {k: TTFont(v[0]) for k, v in FONTS.items()}
def metrics(key):
    f = fonts[key]
    return f['head'].unitsPerEm, f['hhea'].ascent, f['hhea'].descent, f.getBestCmap(), f['hmtx']
def width(key, text, size, ls):
    upm, _, _, cmap, hmtx = metrics(key)
    return sum(hmtx[cmap[ord(c)]][0] for c in text if ord(c) in cmap) * size / upm + ls * len(text)
def baseline(key, center_y, size):
    upm, asc, desc, _, _ = metrics(key)
    return center_y + (asc + desc) / 2 * size / upm  # desc 는 음수
def outline(key, text, x, y, size, ls):
    upm, _, _, cmap, hmtx = metrics(key)
    gs = fonts[key].getGlyphSet()
    d, cx = [], x
    k = size / upm
    for c in text:
        name = cmap.get(ord(c))
        if name is None:
            continue
        pen = SVGPathPen(gs)
        gs[name].draw(TransformPen(pen, (k, 0, 0, -k, cx, y)))
        d.append(pen.getCommands())
        cx += hmtx[name][0] * k + ls
    return ' '.join(d)

# ── 배경 이미지: 영상에서 한 장 뽑기
bg_src = (s.get('hookBg') or {}).get('src', '')
bg_b64 = ''
if bg_src and os.path.exists('public/' + bg_src):
    tmp = os.path.join(out_dir, '_bg.jpg')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t_bg), '-i', 'public/' + bg_src, '-frames:v', '1', '-q:v', '3', '-vf', f'scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}'], check=True) if False else subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t_bg), '-i', 'public/' + bg_src, '-frames:v', '1', '-q:v', '3', '-vf', f'scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}', tmp], check=True)
    bg_b64 = base64.b64encode(open(tmp, 'rb').read()).decode()
    os.remove(tmp)

# ── 글자 배치 계산
hook_lines = s['hook'].split('\n')           # [[강조]] 포함
desc = s.get('hookLabel', '')
sub = s.get('hookSub', '')
brand = s.get('brand', '')
TS, DS, SS, BS = 100, 48, 34, 40
LS = -2
title_h, desc_h, sub_h = 2 * 125 if len(hook_lines) == 2 else len(hook_lines) * 125, DS * 1.16, SS * 1.4
total = title_h + (56 + desc_h if desc else 0) + (36 + sub_h if sub else 0)
top = H / 2 - total / 2
items = []   # (kind, ...) 그릴 요소
cy = top
for line in hook_lines:
    cy_line = cy + 62.5
    segs, cur, on = [], '', False
    for part in line.replace('[[', '\x01').replace(']]', '\x02'):
        if part == '\x01':
            if cur: segs.append((cur, False))
            cur, on = '', True
        elif part == '\x02':
            if cur: segs.append((cur, True))
            cur, on = '', False
        else:
            cur += part
    if cur: segs.append((cur, on))
    pad = 0.22 * TS
    widths = [width('title', t, TS, LS) + (2 * pad - 0.08 * TS if m else 0) for t, m in segs]
    x = W / 2 - sum(widths) / 2
    for (t, m), w in zip(segs, widths):
        if m:
            items.append(('marker', x, cy_line, w, t, pad))
        else:
            items.append(('text', 'title', t, x, cy_line, TS, LS, WHITE))
        x += w
    cy += 125
cy = top + title_h
if desc:
    cy += 56
    dw = width('body', desc, DS, -1.5)
    items.append(('text', 'body', desc, W / 2 - dw / 2, cy + desc_h / 2, DS, -1.5, WHITE))
    cy += desc_h
if sub:
    cy += 36
    sw = width('body', sub, SS, -1)
    items.append(('text', 'body', sub, W / 2 - sw / 2, cy + sub_h / 2, SS, -1, WHITE, 0.92))
if brand:
    bw = width('brand', brand, BS, -1)
    items.append(('text', 'brand', brand, W / 2 - bw / 2, 112, BS, -1, ACCENT))

def star_polygon(cx, cy, w, n=12):
    pts = []
    for k in range(n * 2):
        r = 1 if k % 2 == 0 else 0.42
        a = math.pi * k / n - math.pi / 2
        pts.append(f'{cx + w / 2 * r * math.cos(a):.2f},{cy + w / 2 * r * math.sin(a):.2f}')
    return ' '.join(pts)

# 도형 위치: 제목 첫 줄 양옆
first_line_w = sum(w for _, *_ in [()] ) if False else None
l1_widths = [it for it in items if it[0] in ('text', 'marker')][:0]
title_items = [it for it in items if (it[0] == 'marker') or (it[0] == 'text' and it[1] == 'title')]
xs = []
for it in title_items:
    if it[0] == 'marker': xs.append((it[1], it[1] + it[3]))
    else: xs.append((it[3], it[3] + width('title', it[2], TS, LS)))
line1_left = min(x[0] for x in xs)
line1_right = max(x[1] for x in xs)
sparkle_c = (line1_left - 70, top + 30)
burst_c = (line1_right + 70, top + 30)

SPARKLE = 'M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0 Z'

def subset_b64(key, chars):
    """쓰는 글자만 남긴 woff2(용량 절약). 새 글자를 쓰려면 글꼴을 설치해야 해요."""
    from fontTools import subset
    import io
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    f = TTFont(FONTS[key][0])
    sub = subset.Subsetter(opts)
    sub.populate(text=''.join(sorted(set(chars))) + ''.join(chr(c) for c in range(32, 127)))
    sub.subset(f)
    buf = io.BytesIO()
    f.flavor = 'woff2'
    f.save(buf)
    return base64.b64encode(buf.getvalue()).decode()

def used_chars():
    d = {'title': set(), 'brand': set(), 'body': set()}
    for it in items:
        if it[0] == 'marker':
            d['title'] |= set(it[4])
        else:
            d[it[1]] |= set(it[2])
    return d

def common_defs(embed_fonts):
    css = ''
    if embed_fonts:
        chars = used_chars()
        for key, (path, fam, wt) in FONTS.items():
            b = subset_b64(key, chars[key])
            css += f"@font-face{{font-family:'{fam}';font-weight:{wt};src:url(data:font/woff2;base64,{b}) format('woff2');}}"
    return f'''<defs>
<style>{css}</style>
<linearGradient id="dim" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="{BG}" stop-opacity="0.30"/><stop offset="0.45" stop-color="{BG}" stop-opacity="0.50"/><stop offset="1" stop-color="{BG}" stop-opacity="0.65"/>
</linearGradient>
<filter id="sh" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="7" flood-color="#000" flood-opacity="0.7"/></filter>
<filter id="shs" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000" flood-opacity="0.35"/></filter>
</defs>'''

def build(outlined):
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">', common_defs(not outlined)]
    out.append(f'<rect width="{W}" height="{H}" fill="{BG}"/>')
    if bg_b64:
        out.append(f'<image href="data:image/jpeg;base64,{bg_b64}" x="0" y="0" width="{W}" height="{H}" preserveAspectRatio="xMidYMid slice"/>')
    out.append(f'<rect width="{W}" height="{H}" fill="url(#dim)"/>')
    # 별
    sx, sy = sparkle_c
    k = 86 / 100
    out.append(f'<path d="{SPARKLE}" fill="{STAR}" transform="translate({sx - 43:.1f} {sy - 43:.1f}) scale({k})"/>')
    bx, by = burst_c
    out.append(f'<polygon points="{star_polygon(bx, by, 96)}" fill="{STAR}"/>')
    # 글자
    for it in items:
        if it[0] == 'marker':
            _, x, cyl, w, t, pad = it
            h = 1.12 * TS
            out.append(f'<g transform="rotate(-1.2 {x + w / 2:.1f} {cyl:.1f})"><rect x="{x:.1f}" y="{cyl - h / 2:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{0.22 * TS:.1f}" fill="{ACCENT}"/>')
            tx = x + pad - 0.04 * TS
            by_ = baseline('title', cyl, TS)
            if outlined:
                out.append(f'<path d="{outline("title", t, tx, by_, TS, LS)}" fill="{INK}"/></g>')
            else:
                out.append(f'<text x="{tx:.1f}" y="{by_:.1f}" font-family="Paperlogy" font-weight="800" font-size="{TS}" letter-spacing="{LS}" fill="{INK}">{t}</text></g>')
        else:
            kind, key, t, x, cyl, size, ls, fill = it[:8]
            op = it[8] if len(it) > 8 else 1
            fam, wt = FONTS[key][1], FONTS[key][2]
            y = baseline(key, cyl, size)
            flt = 'shs' if key == 'title' else 'sh'
            if outlined:
                out.append(f'<path d="{outline(key, t, x, y, size, ls)}" fill="{fill}" opacity="{op}" filter="url(#{flt})"/>')
            else:
                out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-family="{fam}" font-weight="{wt}" font-size="{size}" letter-spacing="{ls}" fill="{fill}" opacity="{op}" filter="url(#{flt})">{t}</text>')
    out.append('</svg>')
    return '\n'.join(out)

for name, outlined in (('cover', False), ('cover-outline', True)):
    path = os.path.join(out_dir, f'{sid}-{name}.svg')
    open(path, 'w', encoding='utf-8').write(build(outlined))
    print(path, os.path.getsize(path) // 1024, 'KB')
