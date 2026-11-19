#!/usr/bin/env bash
# 렌더 전에 컷 미리보기 이미지를 뽑는다(영상 렌더보다 훨씬 싸다).
# 사용: ./scripts/preview-cuts.sh <대본 id> <대본 파일> <프레임> [프레임 ...]   → out/preview/<id>-f<프레임>.png (절반 크기)
set -euo pipefail
ID="${1:?대본 id가 필요해요}"; SCRIPT="${2:?대본 파일이 필요해요}"; shift 2
cd "$(dirname "$0")/.."
PROPS="/tmp/reels-props-preview-${ID}.json"
node -e 'const fs=require("fs");const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));fs.writeFileSync(process.argv[2],JSON.stringify({script:s}))' "$SCRIPT" "$PROPS"
CH="${CHROME:-/opt/pw-browsers/chromium-1243/chrome-linux64/chrome}"
EXTRA=(); [ -x "$CH" ] && EXTRA=(--browser-executable="$CH" --chromium-options=no-sandbox)
mkdir -p out/preview
for F in "$@"; do
  npx remotion still src/index.ts Reel "out/preview/${ID}-f${F}.png" --frame="$F" --scale=0.5 --props="$PROPS" "${EXTRA[@]}" >/dev/null
  echo "out/preview/${ID}-f${F}.png"
done
