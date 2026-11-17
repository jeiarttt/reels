# 깃 규칙 (귀여운 버전 분리)

- 귀여운 버전의 파일은 **전용 위치**에 둔다: `skill-cute/`(스킬), `src/cute/`(렌더 코드), `public/stickers/`(스티커), `data/script.cute.json`(작업 대본), `scripts/make-sticker.py`.
- 기본 버전 파일(`skill/`, `data/script.json`, `src/components/` 등)은 귀여운 버전 작업 중에 **고치지 않는다.** 공용 렌더 코드(`src/Reel.tsx`, `src/Root.tsx`)를 고칠 때는 기본 버전 영상이 그대로 렌더되는지 확인한다.
- 커밋 메시지는 `[cute]`로 시작한다. 예: `[cute] 표지 마커 띠 제목 추가`
- 결과 영상 id는 `-cute`로 끝낸다. 예: `20261117-청년미래적금-2차-cute`
- 푸시는 개발 브랜치에만 한다. 브랜치까지 따로 나누고 싶으면 사용자에게 먼저 묻는다.
