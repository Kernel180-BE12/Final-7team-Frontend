// Dashboard API Types
export interface DashboardTestParams {
  role: string;
  userName: string;
}

export interface DashboardTestResponse {
  message?: string;
  error?: string;
}

// 추후 다른 API 타입들도 여기에 추가