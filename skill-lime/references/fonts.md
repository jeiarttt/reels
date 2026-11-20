# 라임 스타일 글꼴과 라이선스 (2026-11-20 갱신)

| 용도 | 글꼴 | 파일 | 라이선스 |
|---|---|---|---|
| 큰 글자(표지·큰 제목·큰 숫자·마지막 제목) | 서울알림체(SeoulAlrim) Heavy 900 | `public/fonts-local/SeoulAlrimTTF-Heavy.woff2` (**저장소에 올리지 않음**, `scripts/fetch-seoul-font.sh`로 받음) | 서울서체 저작권: 누구나 무료 사용, **영상(유튜브·CF·영상 자막 등)·인쇄·웹·임베딩 사용 가능**, 서울서체를 유료로 양도·판매하는 것과 **파일 수정·복제·배포는 금지** |
| 본문 | Pretendard | `public/fonts/Pretendard-*.woff2` | SIL OFL 1.1 |

- 서울알림체 확인 출처: 눈누 서울알림체 페이지 https://noonnu.cc/font_page/1604 (2026-11-20 확인). 웹폰트 주소: `https://cdn.jsdelivr.net/gh/projectnoonnu/2505-1@1.0/SeoulAlrimTTF-Heavy.woff2`. 눈누 안내문이 "정확한 사용범위는 저작권자 확인 필요"라고 밝혀 서울시 원문까지 직접 확인한 것은 아니다.
- 렌더용 브라우저는 CDN에 직접 접속하지 못하므로(이 환경 기준) 폰트를 로컬 파일로 읽는다. 새 세션에서는 렌더·미리보기 전에 `scripts/fetch-seoul-font.sh`를 먼저 실행한다.
- 이전에 쓰던 페이퍼로지 ExtraBold(SIL OFL 1.1, 눈누 https://noonnu.cc/font_page/1456)는 `public/fonts/`에 파일이 남아 있고 서울알림체가 안 불러지면 대체 글꼴로만 쓰인다.
- 새 글꼴을 고를 때는 눈누 페이지의 라이선스 본문과 요약표를 읽고 '영상' 항목이 사용 가능인 것만 쓴다. 검토한 후보(상업 이용 가능 확인): Google Fonts의 Black Han Sans·연성체·개구체·가쓰오원·Gugi 등(OFL), G마켓 산스, 프리젠테이션, 빗썸고딕. 여기어때 잘난체·에스코어드림·메모먼트 꾹꾹체는 제한 조건이 있어 쓰지 않았다.
