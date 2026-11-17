#!/usr/bin/env bash
# Mac에서 영상을 만들어 내 폴더에 저장한다.
# 사용법:  ./scripts/mac-render.sh [basic|cute]
#   basic = 기본 버전(data/script.json), cute = 귀여운 버전(data/script.cute.json). 기본값 cute
# 저장 폴더: 환경변수 REELS_OUT, 없으면 ~/릴스  (예: REELS_OUT="/Users/leeyeonjae/릴스" ./scripts/mac-render.sh cute)
set -euo pipefail
cd "$(dirname "$0")/.."

MODE="${1:-cute}"
OUT_DIR="${REELS_OUT:-$HOME/릴스}"

case "$MODE" in
  basic) SCRIPT="data/script.json" ;;
  cute)  SCRIPT="data/script.cute.json" ;;
  *) echo "사용법: $0 [basic|cute]"; exit 1 ;;
esac

ID="$(node -e "console.log(JSON.parse(require('fs').readFileSync('$SCRIPT','utf8')).id)")"
echo "▶ 대본: $SCRIPT  (id: $ID)"
echo "▶ 저장 폴더: $OUT_DIR"

[ -d node_modules ] || npm install --no-audit --no-fund

npm run render:job -- "$ID" --force --script="$SCRIPT" --out-dir="$OUT_DIR"

echo "✔ 완료: $OUT_DIR/$ID.mp4"
open "$OUT_DIR" 2>/dev/null || true   # Finder로 폴더 열기(Mac)
