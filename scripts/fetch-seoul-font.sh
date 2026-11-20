#!/usr/bin/env bash
# 서울알림체 Heavy 내려받기. 서울서체는 파일 재배포가 금지라 저장소에는 넣지 않고(.gitignore) 렌더 전에 받는다.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/fonts-local
f=public/fonts-local/SeoulAlrimTTF-Heavy.woff2
[ -s "$f" ] || curl -fsSL -o "$f" https://cdn.jsdelivr.net/gh/projectnoonnu/2505-1@1.0/SeoulAlrimTTF-Heavy.woff2
echo "ok: $f"
