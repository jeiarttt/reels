#!/usr/bin/env python3
"""사진 한 장을 '피사체 모양대로 오린 스티커'(흰 테두리 다이컷 PNG)로 만든다.
사용법: python3 scripts/make-sticker.py <사진> <출력.png> <x,y,w,h(0~1 비율, 피사체를 감싸는 사각형)>
예: python3 scripts/make-sticker.py dog.jpg public/stickers/dog.png 0.02,0.08,0.96,0.9
필요: pip install opencv-python-headless numpy pillow
GrabCut(배경 제거)이라 배경이 피사체와 구분될수록 잘 오려진다. 결과는 반드시 눈으로 확인한다.
"""
import sys
import cv2
import numpy as np
from PIL import Image

OUT_MAX = 640   # 출력 한 변 최대 픽셀
OUTLINE = 20    # 흰 테두리 두께(출력 기준 px)


def cutout(path, rect, work=900):
    img = cv2.imread(path)
    h, w = img.shape[:2]
    s = min(1.0, work / max(h, w))
    small = cv2.resize(img, (int(w * s), int(h * s)), interpolation=cv2.INTER_AREA)
    sh, sw = small.shape[:2]
    x, y, rw, rh = rect
    r = (int(x * sw), int(y * sh), int(rw * sw), int(rh * sh))
    mask = np.zeros((sh, sw), np.uint8)
    bg = np.zeros((1, 65), np.float64)
    fg = np.zeros((1, 65), np.float64)
    cv2.grabCut(small, mask, r, bg, fg, 6, cv2.GC_INIT_WITH_RECT)
    m = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    # 가장 큰 덩어리만 남기고 구멍 메우기, 가장자리 부드럽게
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    if n > 1:
        k = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        m = np.where(lab == k, 255, 0).astype(np.uint8)
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filled = np.zeros_like(m)
    cv2.drawContours(filled, cnts, -1, 255, -1)
    k = max(3, int(min(sh, sw) * 0.012)) | 1
    filled = cv2.morphologyEx(filled, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    filled = cv2.GaussianBlur(filled, (k * 2 + 1, k * 2 + 1), 0)
    filled = np.where(filled > 127, 255, 0).astype(np.uint8)
    rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
    return rgb, filled


def main():
    src, dst, rs = sys.argv[1], sys.argv[2], sys.argv[3]
    rect = tuple(float(v) for v in rs.split(','))
    rgb, m = cutout(src, rect)
    ys, xs = np.where(m > 0)
    pad = 6
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, m.shape[1])
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, m.shape[0])
    rgb, m = rgb[y0:y1, x0:x1], m[y0:y1, x0:x1]
    scale = (OUT_MAX - 2 * OUTLINE - 8) / max(m.shape)
    nw, nh = int(m.shape[1] * scale), int(m.shape[0] * scale)
    rgb = cv2.resize(rgb, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
    m = cv2.resize(m, (nw, nh), interpolation=cv2.INTER_LINEAR)
    m = np.where(m > 127, 255, 0).astype(np.uint8)
    pad2 = OUTLINE + 4
    canvas_h, canvas_w = nh + 2 * pad2, nw + 2 * pad2
    subj = np.zeros((canvas_h, canvas_w, 3), np.uint8)
    subj[pad2:pad2 + nh, pad2:pad2 + nw] = rgb
    sm = np.zeros((canvas_h, canvas_w), np.uint8)
    sm[pad2:pad2 + nh, pad2:pad2 + nw] = m
    # 흰 테두리 = 피사체 마스크를 바깥으로 부풀린 것 (모양을 따라가는 다이컷)
    ker = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (OUTLINE * 2 + 1, OUTLINE * 2 + 1))
    outline = cv2.dilate(sm, ker)
    outline = cv2.GaussianBlur(outline, (5, 5), 0)
    sm_soft = cv2.GaussianBlur(sm, (3, 3), 0)
    out = np.zeros((canvas_h, canvas_w, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = outline
    a = (sm_soft.astype(np.float32) / 255.0)[..., None]
    out[..., :3] = (subj * a + out[..., :3] * (1 - a)).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(dst, optimize=True)
    print(dst, out.shape[1], 'x', out.shape[0])


if __name__ == '__main__':
    main()
