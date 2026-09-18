# 박물관 QR 탐험 게임

HTML, CSS, Vanilla JavaScript만으로 실행되는 정적 모바일 웹 프로토타입입니다. 외부 라이브러리, 폰트, 네트워크 의존성이 없습니다.

## 실행

이 폴더에서 `node server.cjs`를 실행하고 http://localhost:8080 을 여세요. 종료는 Ctrl+C입니다. Node는 개발용 정적 서버와 검증에만 사용하며 게임은 브라우저에서 실행됩니다.

HTML을 직접 열 수도 있지만 file:// 환경의 localStorage 동작은 브라우저마다 다르므로 로컬 HTTP 서버 사용을 권장합니다.

## 파일

- index.html: 시작 및 이전 기록 안내
- collection.html: 수집북, 진행도, 위치 힌트, 개발용 QR 링크
- quiz.html: id에 해당하는 문제, 정답/오답, 보상
- complete.html: 완성 이미지, 수집북 재열기, 초기화
- css/style.css: 모바일 우선 공통 스타일
- js/data.js: 7개 아이템의 문제, 정답, 위치 힌트, 이미지
- js/storage.js: museumBowGame 배열 저장, 중복/잘못된 데이터 처리
- js/index.js, collection.js, quiz.js, complete.js: 페이지별 동작
- assets/images/: 교체 가능한 SVG 임시 그림 8개
- server.cjs: 외부 패키지 없는 개발 서버 (127.0.0.1:8080)
- verify.cjs: 저장/복원/중복/초기화/링크 검증 (`node verify.cjs`)
- create-assets.cjs: 임시 SVG 재생성 도구 (실제 이미지로 교체 후 실행하지 마세요)

## 콘텐츠 교체

js/data.js의 question, answer, hint, image 값을 변경하세요. answer는 문자열입니다. 현재 답안은 앞뒤 공백을 제거한 문자열로 비교합니다. 숫자 외 교육 답안을 사용할 때 quiz.html의 inputmode="numeric"과 숫자 입력 안내를 변경하면 됩니다. 아이템 id는 저장 및 QR 주소에 사용하므로 유지하세요.

PNG를 assets/images에 넣고 image 경로를 해당 PNG로 바꾸세요. 수집북 이미지에는 item-grip, item-upper 등의 고유 id가 있습니다. 완성 이미지는 index.html과 complete.html의 assets/images/complete.svg 경로를 함께 교체하세요.

개발용 메뉴 제거: collection.html의 div.dev-test-menu 전체를 삭제하세요. 나머지 게임 기능에 영향이 없습니다.

## 실제 QR 연결

프로젝트 폴더의 내용을 정적 웹 호스팅에 배포한 뒤 다음 공개 HTTPS 주소를 각각 QR로 만들어 출력합니다. 예시 도메인은 실제 배포 주소로 교체하세요.

| QR | 아이템 | 주소 |
|---|---|---|
| A | 줌통 | https://YOUR-DOMAIN/quiz.html?id=grip |
| B | 위쪽 활채 | https://YOUR-DOMAIN/quiz.html?id=upper |
| C | 아래쪽 활채 | https://YOUR-DOMAIN/quiz.html?id=lower |
| D | 시위 | https://YOUR-DOMAIN/quiz.html?id=string |
| E | 살대 | https://YOUR-DOMAIN/quiz.html?id=shaft |
| F | 화살촉 | https://YOUR-DOMAIN/quiz.html?id=arrowhead |
| G | 깃과 오늬 | https://YOUR-DOMAIN/quiz.html?id=feather |

하위 폴더에 배포하면 주소에도 해당 폴더를 포함하세요. 휴대폰 기본 카메라나 QR 앱으로 링크를 열면 됩니다. 수집북의 QR 스캔 → 카메라 연결에서 카메라 미리보기를 실행할 수 있습니다. 현재 QR 자동 인식은 포함하지 않으며, QR 테스트 버튼에서 문제를 선택합니다. 카메라는 HTTPS 또는 localhost에서 권한을 허용해 사용하세요. 닫기·테스트 전환·페이지 이탈 시 카메라를 중지합니다. localhost는 실제 배포용 QR 주소가 아닙니다.

진행도는 같은 사이트 주소의 같은 브라우저에 저장됩니다. QR을 매번 같은 브라우저로 열어야 이어집니다. 장치/브라우저 간 동기화는 없습니다.

마지막 정답의 보상을 표시한 후 ‘수집북으로 돌아가기’를 누르면 complete.html로 이동합니다. 이미 7개를 모은 상태에서 collection.html을 열어도 완료 화면으로 이동합니다. 완료 화면의 ‘수집북 다시 보기’는 collection.html?view=all을 사용하여 이동 반복을 방지합니다.

## 검증

브라우저에서 C → F → A → D → B → G → E 순서로 모든 문제를 풀고 완료 화면 도달을 확인했습니다. 오답 후 재도전, 새로고침 복원, 중복 방지, 힌트, 수집북 다시 보기, 초기화 및 잘못된 id 안내를 확인했습니다. 360px와 430px 화면을 점검했습니다. 추가 저장 예외와 초기화 취소/확인은 node verify.cjs로 검증합니다.

