// Dashboard API Types
export interface DashboardTestParams {
  role: string;
  userName: string;
}

export interface DashboardTestResponse {
  message?: string;
  error?: string;
}

// Menu Types
export interface MenuItem {
  id: number;
  label: string;
  path: string;
  icon?: string;
  orderSeq: number;
  roleRequired: string;
  isActive: boolean;
}

export interface MenuApiResponse {
  success: boolean;
  data: MenuItem[];
  message?: string;
}

// 기본 메뉴 데이터 (API 실패 시 또는 초기 로드용)
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 1, label: "대시보드", path: "/dashboard", orderSeq: 1, roleRequired: "admin", isActive: true },
  { id: 2, label: "스케줄 관리", path: "/schedule", orderSeq: 2, roleRequired: "admin", isActive: true },
  { id: 3, label: "키워드 추출", path: "/keyword", orderSeq: 3, roleRequired: "admin", isActive: true },
  { id: 4, label: "상품 검색", path: "/product", orderSeq: 4, roleRequired: "admin", isActive: true },
  { id: 5, label: "LLM 콘텐츠", path: "/content", orderSeq: 5, roleRequired: "admin", isActive: true },
  { id: 6, label: "발행 관리", path: "/publishing", orderSeq: 6, roleRequired: "admin", isActive: true },
  { id: 7, label: "결과 모니터링", path: "/monitoring", orderSeq: 7, roleRequired: "admin", isActive: true },
];

// Schedule Types
export type ExecutionCycle = '매일 실행' | '주간 실행' | '월간 실행';

// ExecutionCycle 옵션들을 배열로 제공
export const EXECUTION_CYCLE_OPTIONS: ExecutionCycle[] = [
  '매일 실행',
  '주간 실행', 
  '월간 실행'
];

export interface ScheduleRequest {
  executionCycle: ExecutionCycle;
  executionTime: string;
  keywordCount: number;
  publishCount: number;
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  scheduleId?: number;
}

// 추후 다른 API 타입들도 여기에 추가