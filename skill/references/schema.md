# 대본 JSON 포맷

`data/script.json` 한 파일이 영상 한 편이다. 렌더는 `npm run render:job -- <id> --force`.

- `id`, `mode`: "card_news"
- `style`: "photo"(사진·영상 배경, 모든 장면 가운데 정렬) 또는 생략(네이비 카드)
- `backgroundSrc`: 사용자가 준 이미지·영상으로 **전체 배경을 덮어쓸 때만** 채운다. public/user/ 에 넣고 "user/파일명". 비워두면 장면별 `bg`(스톡)를 쓴다
- `hookLabel`(선택), `hook`, `hookBg`: 첫 화면(3.5초)
- `scenes[]`: `{ t(초), kind, label(선택), bg, ... }` 5~6개, 장면당 4~7초
  - `kind: "text"`(기본): `text`
  - `kind: "cards"`: 요약 카드 `cards: [{ big, small }]` 3~4개 (핵심 숫자·기간·금액)
  - `kind: "table"`: 비교표 `table: { head: [...], rows: [[...]] }` 열 2~3개, 행 3~4개
  - `bg: { src, type?, startFrom? }`: 장면 배경. src는 public/ 기준(`stock/…`, `user/…`). mp4/mov/webm은 영상, 그 외는 이미지
- `ctaLabel`(선택), `cta`, `ctaBg`: 마지막 화면(4초)
- `accentColor`: 포인트 컬러(기본 #FF8A1F)
- `status`: "pending"(확정 전) 또는 "confirmed". confirmed가 아니면 `disclaimer_overlay` 문구가 영상 하단에 자동 표시된다
- `disclaimer_overlay`, `caption`, `hashtags`, `sources`, `verify_before_post`
