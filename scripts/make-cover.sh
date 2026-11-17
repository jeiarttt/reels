#!/usr/bin/env bash
# 릴스 커버 이미지(1080x1920 PNG)를 대본의 표지 컷에서 뽑는다.
# 사용: ./scripts/make-cover.sh <대본 id> [대본 파일] [프레임]
#   예: ./scripts/make-cover.sh 20261117-2027-청년혜택-6가지-cute data/script.cute.json
set -euo pipefail
ID="${1:?대본 id가 필요해요}"
SCRIPT="${2:-data/script.json}"
FRAME="${3:-60}"
cd "$(dirname "$0")/.."
PROPS="/tmp/reels-props-cover-${ID}.json"
node -e 'const fs=require("fs");const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));fs.writeFileSync(process.argv[2],JSON.stringify({script:s}))' "$SCRIPT" "$PROPS"
CH="${CHROME:-/opt/pw-browsers/chromium-1243/chrome-linux64/chrome}"
EXTRA=()
[ -x "$CH" ] && EXTRA=(--browser-executable="$CH" --chromium-options=no-sandbox)
mkdir -p out
npx remotion still src/index.ts Reel "out/${ID}-cover.png" --frame="$FRAME" --props="$PROPS" "${EXTRA[@]}"
echo "커버: out/${ID}-cover.png"
