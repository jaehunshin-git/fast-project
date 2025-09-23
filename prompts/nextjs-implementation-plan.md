**핵심 목표**
- 프로젝트 이름과 협업 툴 선택만으로 노션 대시보드를 자동 생성해 수동 세팅을 제거
- 기본 페이지에 일정, 회의록, 팀원 DB, 툴 링크, 문서 구조를 즉시 구성
- 선택된 Discord, GitHub, Figma 등 외부 툴로 이동할 수 있는 링크 허브 제공
- 화이트·블랙 톤 중심의 심플한 UI로 빠른 입력과 확인이 가능한 경험 설계

**앱 구조**
- src/app/layout.js에 공통 헤더·푸터와 다크/라이트 대비가 강조된 컨테이너 배치
- src/app/page.js를 싱글 페이지 마법사로 구성: ①프로젝트 정보 ②툴 선택 ③요약·생성
- 선택 요약 및 완료 화면을 src/app/components/SummaryCard.jsx 등으로 컴포넌트화
- Notion API 호출을 위해 src/app/api/notion/route.js에 POST 핸들러 구현
- 재사용 로직(폼 스키마, Notion payload builder)은 src/lib에 분리

**데이터 & 연동**
- 입력 상태는 React 서버 컴포넌트 + 클라이언트 컴포넌트 조합, useFormState 또는 eact-hook-form 사용
- 프로젝트 구조 객체 { projectName, description, tools: ToolKey[], notionTemplates: [...] } 정의
- Notion 통합은 @notionhq/client; 비동기 래퍼 createProjectDashboard(payload) 작성
- 환경 변수 NOTION_API_KEY, NOTION_PARENT_PAGE_ID를 .env.local에 저장하고 런타임에서 process.env로 주입
- 외부 툴 링크는 config(src/lib/tools.js)에 메타데이터(아이콘, 설명, URL 템플릿)로 선언

**UI/UX 및 테마**
- Tailwind에서 	heme.extend.colors 혹은 CSS 변수로 --bg-primary: #0A0A0A, --fg-primary: #FFFFFF 정의
- 입력 폼은 화이트 카드, 블랙 배경 대비를 주고 포커스·호버 시 라인 하이라이트 적용
- 툴 선택 영역은 토글형 카드(Grid 3열)로 구성하고 체크 상태를 흰색 강조, 미선택은 회색
- 완료 화면은 생성된 노션 페이지 링크와 선택한 툴 링크를 버튼 형태로 정렬
- 접근성 고려: 명도 대비 7:1 이상, 키보드 포커스 링 및 스크린리더 레이블 명시

**구현 단계**
- 1단계: Tailwind 테마 설정, 글로벌 레이아웃, 베이스 폰트/색상 적용
- 2단계: 프로젝트 입력/툴 선택 폼 컴포넌트 구현 및 상태 관리 연결
- 3단계: Notion payload 빌더 작성, API Route에서 생성 로직·에러 처리 구현
- 4단계: 완료 화면 및 외부 툴 링크 허브 구성, 로딩/성공/실패 상태 UX 정리
- 5단계: 입력 검증(필수 필드, 최소 툴 선택), 에러 메시지 및 토스트 피드백 추가

**검증**
- 수동 테스트: 프로젝트명 입력 → 툴 2종 선택 → 노션 페이지 생성 확인 → Discord/GitHub/Figma 버튼 이동 확인
- 에러 시나리오: Notion 키 누락·API 실패·툴 미선택 상태를 각각 재현해 피드백 확인
- UI 리뷰: 데스크톱 폭 1280px, 태블릿 768px, 모바일 375px에서 레이아웃 이상 여부 점검
- 
pm run lint로 규칙 준수 확인 후 README에 필요한 환경 변수 및 수동 테스트 절차 기록
