# Final-7team-Frontend: AI 콘텐츠 자동화 시스템

**ssadagu.kr 상품 기반 네이버 블로그 자동 발행 시스템**의 관리자 대시보드 프론트엔드

## 📋 프로젝트 개요

이 프로젝트는 AI를 활용한 블로그 콘텐츠 자동화 시스템의 프론트엔드입니다. 키워드 검색부터 상품 크롤링, LLM 기반 콘텐츠 생성, 자동 발행까지의 전체 파이프라인을 관리할 수 있는 웹 대시보드를 제공합니다.

## ✨ 주요 기능

### 🎯 핵심 기능 모듈
- **📊 대시보드**: 전체 자동화 파이프라인 현황 및 실시간 모니터링
- **⏰ 스케줄 관리**: 자동 실행 주기 설정 (매일/주간/월간)
- **🔍 키워드 추출**: 트렌드 키워드 자동 수집 및 선별
- **🛍️ 상품 검색**: ssadagu.kr 상품 정보 크롤링 및 분석
- **🤖 LLM 콘텐츠 생성**: OpenAI GPT-4/Google Gemini 기반 블로그 글 작성
- **📝 발행 관리**: 네이버 블로그 자동 포스팅 및 상태 관리
- **📈 결과 모니터링**: 성공률 통계 및 실시간 로그 추적

### 🔧 기술적 특징
- **TypeScript**: 전체 프로젝트 타입 안전성 보장
- **반응형 UI**: Tailwind CSS 기반 모바일 친화적 디자인
- **실시간 상태 관리**: Zustand를 통한 효율적 상태 분산 관리
- **API 통합**: Axios 기반 백엔드 완전 연동
- **에러 처리**: 포괄적 에러 핸들링 및 사용자 피드백

## 🛠 기술 스택

### 핵심 기술
| 분류 | 기술 스택 | 버전 | 용도 |
|------|-----------|------|------|
| **Language** | TypeScript | ~5.8.3 | 타입 안전성 보장 |
| **Framework** | React | ^19.1.1 | UI 라이브러리 |
| **Build Tool** | Vite | ^7.1.2 | 빠른 개발 서버 및 빌드 |
| **Styling** | Tailwind CSS | ^3.4.17 | 유틸리티 기반 CSS |
| **State Management** | Zustand | ^5.0.8 | 경량 상태 관리 |
| **HTTP Client** | Axios | ^1.11.0 | API 통신 |
| **Routing** | React Router | ^7.8.2 | 클라이언트 사이드 라우팅 |
| **Server State** | TanStack Query | ^5.85.5 | 서버 상태 캐싱 |
| **Icons** | Lucide React | ^0.542.0 | 아이콘 라이브러리 |

### 개발 도구
- **ESLint**: 코드 품질 관리
- **TypeScript**: 정적 타입 검사
- **PostCSS**: CSS 후처리
- **Autoprefixer**: 브라우저 호환성

## 📁 프로젝트 구조

```
src/
├── 📁 components/                # 재사용 가능한 컴포넌트
│   ├── 📁 common/               # 공통 컴포넌트 (모달, 타이틀 등)
│   ├── 📁 layout/               # 레이아웃 컴포넌트
│   │   ├── MainLayout.tsx       # 메인 레이아웃
│   │   └── Sidebar.tsx          # 동적 사이드바 네비게이션
│   ├── 📁 ui/                   # UI 기본 컴포넌트
│   └── ApiTest.tsx              # API 연결 테스트 컴포넌트
├── 📁 features/                 # 🎯 기능별 도메인 모듈
│   ├── 📁 dashboard/            # 📊 관리자 대시보드
│   ├── 📁 schedule/             # ⏰ 스케줄 관리
│   ├── 📁 keyword/              # 🔍 키워드 추출
│   ├── 📁 product/              # 🛍️ 상품 검색/크롤링
│   ├── 📁 content/              # 🤖 LLM 콘텐츠 생성
│   ├── 📁 publishing/           # 📝 발행 관리
│   ├── 📁 monitoring/           # 📈 결과 모니터링
│   └── 📁 settings/             # ⚙️ 설정 관리
├── 📁 lib/                      # 외부 라이브러리 설정
│   ├── api.ts                   # Axios 클라이언트 및 API 함수들
│   ├── types.ts                 # TypeScript 타입 정의
│   └── utils.ts                 # 유틸리티 함수들
├── 📁 store/                    # 전역 상태 관리
│   ├── appStore.ts              # 앱 핵심 상태 (네비게이션, 스케줄)
│   ├── uiStore.ts               # UI 상태 (로딩, 에러, 성공메시지)
│   └── monitoringStore.ts       # 모니터링 전용 상태
├── 📁 router/                   # 라우팅 설정
│   └── AppRouter.tsx            # 라우트 정의
├── App.tsx                      # 앱 최상위 컴포넌트
└── main.tsx                     # 앱 진입점
```

## 🏗 아키텍처 설계

### 상태 관리 아키텍처
프로젝트는 **도메인 분리 원칙**에 따라 상태를 분산 관리합니다:

- **`appStore`**: 네비게이션 + 스케줄 설정 (핵심 앱 상태)
- **`uiStore`**: 로딩/에러/성공메시지 (UI 상태)
- **`monitoringStore`**: 모니터링 데이터 (도메인별 상태)

### API 클라이언트 구조
```typescript
// src/lib/api.ts
export const menuApi = {
  getMenuItems: (role: string) => Promise<MenuApiResponse>
}

export const dashboardApi = {
  testConnection: (role: string, userName: string) => Promise<string>
}

export const scheduleApi = {
  createSchedule: (data: ScheduleRequest) => Promise<ScheduleResponse>,
  getSchedules: () => Promise<ScheduleRequest[]>,
  updateSchedule: (id: number, data: ScheduleRequest) => Promise<ScheduleResponse>
}
```

### TypeScript 타입 시스템
- **인터페이스 기반**: 모든 API 응답 및 컴포넌트 Props 타입 정의
- **유니온 타입**: 상태값 제한 (`ExecutionCycle = '매일 실행' | '주간 실행' | '월간 실행'`)
- **제네릭 활용**: 재사용 가능한 타입 구조

## 🚀 시작하기

### 필수 조건
- **Node.js**: v18.x 이상
- **npm**: v8.x 이상

### 설치 및 실행

1. **레포지토리 클론**
```bash
git clone https://github.com/your-repository/Final-7team-Frontend.git
cd Final-7team-Frontend
```

2. **의존성 설치**
```bash
npm install
```

3. **환경변수 설정**
```bash
# .env 파일 생성
VITE_API_BASE_URL=http://localhost:8080
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **빌드**
```bash
npm run build
```

6. **린트 검사**
```bash
npm run lint
```

## 📱 주요 페이지 구성

### 🏠 메인 대시보드 (`/dashboard`)
- 전체 자동화 파이프라인 현황
- 실시간 작업 상태 모니터링
- 성공률 통계 및 최근 활동 로그

### ⏰ 스케줄 관리 (`/schedule`)
- 실행 주기 설정 (매일/주간/월간)
- 실행 시간 및 개수 설정
- 스케줄 히스토리 관리

### 🔍 키워드 추출 (`/keyword`)
- 트렌드 키워드 수집 현황
- 키워드 우선순위 설정
- 수집된 키워드 목록 관리

### 🛍️ 상품 검색 (`/product`)
- ssadagu.kr 상품 검색 및 크롤링
- 상품 정보 추출 진행률
- 검색 결과 및 로그 확인

### 🤖 LLM 콘텐츠 생성 (`/content`)
- AI 모델 선택 (OpenAI GPT-4 / Google Gemini)
- 콘텐츠 생성 진행률 추적
- 생성된 콘텐츠 미리보기 및 수정

### 📝 발행 관리 (`/publishing`)
- 네이버 블로그 연동 상태
- 자동 발행 설정 및 제어
- 발행 결과 및 상태 확인

### 📈 결과 모니터링 (`/monitoring`)
- 전체 작업 성공/실패 통계
- 실시간 로그 스트리밍
- 에러 분석 및 알림

## 🔧 개발 가이드

### 커밋 컨벤션
이 프로젝트는 **Conventional Commits** 규칙을 따릅니다:

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
docs: 문서 수정
style: 코드 스타일 변경
test: 테스트 추가/수정
chore: 빌드 과정 또는 보조 기능 수정
```

### 파일 네이밍 규칙
- **컴포넌트**: PascalCase (`AdminDashboard.tsx`)
- **훅/유틸**: camelCase (`useApiTest.ts`)
- **상수**: UPPER_SNAKE_CASE (`DEFAULT_MENU_ITEMS`)
- **스토어**: camelCase + Store suffix (`appStore.ts`)

### 코드 스타일
- **TypeScript**: 엄격한 타입 검사 활성화
- **ESLint**: React Hooks 규칙 적용
- **Prettier**: 코드 포맷팅 자동화
- **Path Alias**: `@/` 절대경로 사용

## 🚀 배포

### 빌드 최적화
- **코드 분할**: React.lazy를 통한 컴포넌트 지연 로딩
- **Tree Shaking**: Vite의 ES모듈 기반 최적화
- **번들 분석**: `npm run build`로 빌드 사이즈 확인

### 환경별 설정
- **Development**: HMR 활성화, 상세 에러 메시지
- **Production**: 코드 압축, 소스맵 제거

## 🤝 기여 방법

1. 이슈 등록 및 확인
2. Feature 브랜치 생성 (`feature/기능명`)
3. 커밋 컨벤션 준수
4. Pull Request 생성
5. 코드 리뷰 후 병합

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**🔗 관련 링크**
- [백엔드 저장소](링크)
- [API 문서](링크)
- [배포 환경](링크)
- [이슈 트래커](링크)