# Final-7team-Frontend: AI 콘텐츠 자동화 시스템

---

ssadagu.kr 상품 기반 네이버 블로그 자동 발행 시스템의 관리자 대시보드 프론트엔드 프로젝트입니다.

## 주요 기능

---

- 대시보드: 전체 자동화 파이프라인의 현재 상태 및 결과 모니터링

- 스케줄 관리: 콘텐츠 자동 생성 및 발행 주기 설정

- 키워드 관리: 트렌드 키워드 검색 및 추출 현황 확인

- 콘텐츠 관리: LLM을 통해 생성된 콘텐츠 확인 및 수정

- 발행 관리: 네이버 블로그 등 타겟 플랫폼으로의 발행 제어

- 결과/로그 확인: 자동화 작업의 성공/실패 로그 및 통계 확인

## 기술 스택

---

이 프로젝트는 다음과 같은 기술 스택으로 구성되어 있습니다.
| 구분 (Category) | 스택명 (Stack Name) |
| :--- | :--- |
| **Language** | `TypeScript` |
| **Build Tool** | `Vite` |
| **UI Library** | `MUI (Material-UI)` |
| **Styling** | `Emotion` |
| **State Management** | `Zustand` |
| **Server State** | `TanStack Query (React Query)` |
| **HTTP Client** | `Axios` |
| **Routing** | `React Router` |
| **EC2 Instance** | `MyWebServer` |

## 폴더 구조

---

```text
프로젝트는 기능별 도메인을 중심으로 하는 확장성 있는 구조를 따릅니다.
src/
├── assets/             # 이미지, 폰트 등 정적 리소스
├── components/         # 재사용 가능한 공통 컴포넌트 (레이아웃, 버튼 등)
├── features/           # ✨ 핵심: 기능별 도메인 폴더
│   ├── dashboard/      # 대시보드
│   ├── schedule/       # 스케줄 설정
│   ├── keyword/        # 키워드 (검색, 추출)
│   ├── product/        # 상품 (검색, 크롤링)
│   ├── content/        # LLM 콘텐츠 생성
│   ├── publishing/     # 발행
│   ├── monitoring/     # 결과/로그 확인
│   └── settings/       # 설정
├── lib/                # 외부 라이브러리 설정 (axios 인스턴스 등)
├── router/             # 라우팅 설정
├── store/              # 전역 상태 관리 (Zustand)
├── styles/             # 전역 스타일 및 MUI 테마
├── App.tsx             # 앱 최상위 컴포넌트
└── main.tsx            # 앱 진입점 (Provider 설정)
```

## 시작하기

---

Prerequisites

- Node.js (v18.x 이상)
- Yarn

Installation

1. 레포지토리 클론:

```text
git clone https://github.com/Kernel180-BE12/Final-7team-Frontend.git
cd Final-7team-Frontend
```

2. 패키지 설치:

```text
yarn
```

3. 개발 서버 실행:

```text
yarn dev
```

## 커밋 컨벤션

---

이 프로젝트는 Conventional Commits 규칙을 따릅니다.
