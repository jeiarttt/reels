# 릴스 카드뉴스 자동 제작

인스타 릴스용 세로 영상(1080×1920)을 대본 JSON으로 만든다. Remotion 기반.

## Mac에서 영상 만들기 (내 폴더에 저장)

처음 한 번:
```bash
git clone https://github.com/jeiarttt/reels.git
cd reels
git checkout claude/insta-reels-automation-setup-m2y20f
```

영상 만들기 (귀여운 버전 / 기본 버전):
```bash
./scripts/mac-render.sh cute
./scripts/mac-render.sh basic
```

- 저장 폴더는 기본 `~/릴스`(= `/Users/<내 계정>/릴스`). 다른 곳에 저장하려면:
  ```bash
  REELS_OUT="/Users/leeyeonjae/릴스" ./scripts/mac-render.sh cute
  ```
- 필요한 것: Node.js 18 이상. 첫 실행 때 `npm install`을 자동으로 하고, 렌더용 브라우저는 Remotion이 알아서 받는다(인터넷 필요).
- 완료되면 Finder로 폴더가 열린다.

## 구성
- `data/script.json` 기본 버전 대본 / `data/script.cute.json` 귀여운 버전 대본
- `skill/` 기본 스킬, `skill-cute/` 귀여운 스킬
- `src/` 렌더 코드(`src/cute/`는 귀여운 디자인), `public/` 사진·폰트·스티커
- 대본 검사: `npm run validate -- data/script.cute.json`
