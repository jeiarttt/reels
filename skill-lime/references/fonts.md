# 라임 스타일 글꼴과 라이선스 (2026-11-19 확인)

| 용도 | 글꼴 | 파일 | 라이선스 |
|---|---|---|---|
| 큰 제목 | 페이퍼로지(Paperlogy) ExtraBold | `public/fonts/Paperlogy-8ExtraBold.woff2` | SIL OFL 1.1. 눈누 안내: 글꼴 단독 판매·라이선스 변경만 제외하고 상업 이용·수정·재배포 가능, **영상(유튜브·CF·자막 등) 사용 가능**, 웹 임베딩 가능 |
| 본문 | Pretendard | `public/fonts/Pretendard-*.woff2` | SIL OFL 1.1 |

- 확인 출처: 눈누 페이퍼로지 페이지 https://noonnu.cc/font_page/1456 (웹폰트 주소: `https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-8ExtraBold.woff2`). 눈누 안내문 자체가 "정확한 사용범위는 저작권자 확인 필요"라고 밝히므로, 새 글꼴을 쓸 때마다 해당 눈누 페이지의 라이선스 본문과 요약표를 읽고 '영상' 항목이 사용 가능인 것만 쓴다.
- 같이 검토한 후보(라이선스 확인): G마켓 산스(제약 없음), 프리젠테이션(OFL), 빗썸고딕(OFL). 여기어때 잘난체·에스코어드림·메모먼트 꾹꾹체는 개작·표기·웹폰트 제한 조건이 있어 쓰지 않았다.
- 글꼴 파일은 로컬 woff2로 두고 `src/Reel.tsx`의 `loadFont`로 불러온다. OFL 전문은 요청 시 첨부한다.
