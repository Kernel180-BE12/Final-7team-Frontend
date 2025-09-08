import axios from "axios";
import type {
  MenuApiResponse,
  ScheduleRequest,
  ScheduleResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  PipelineExecuteRequest,
  PipelineExecuteResponse,
  PipelineStatusResponse,
  PipelineControlRequest,
  PipelineControlResponse,
  PipelineHistoryResponse,
  PipelineResultResponse,
} from "./types";

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: "/v1", // vite.config.ts의 프록시 설정으로 localhost:8080에 연결
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API 함수들
export const menuApi = {
  // 사용자 권한에 따른 메뉴 목록 가져오기
  getMenuItems: async (role: string): Promise<MenuApiResponse> => {
    const response = await apiClient.get<MenuApiResponse>(
      "/dashboard/navMenu",
      {
        params: { role },
      }
    );
    return response.data;
  },
};

export const dashboardApi = {
  // 대시보드 테스트 API
  testConnection: async (role: string, userName: string): Promise<string> => {
    const response = await apiClient.get<string>("/dashboard/connectTest", {
      params: { role, userName },
    });
    return response.data;
  },
};

export const scheduleApi = {
  // 스케줄 등록 API
  createSchedule: async (
    scheduleData: ScheduleRequest
  ): Promise<ScheduleResponse> => {
    const response = await apiClient.post<ScheduleResponse>(
      "/schedule",
      scheduleData
    );
    return response.data;
  },

  // 스케줄 조회 API
  getSchedules: async (): Promise<ScheduleRequest[]> => {
    const response = await apiClient.get<ScheduleRequest[]>("/schedule");
    return response.data;
  },

  // 스케줄 수정 API
  updateSchedule: async (
    scheduleId: number,
    scheduleData: ScheduleRequest
  ): Promise<ScheduleResponse> => {
    const response = await apiClient.put<ScheduleResponse>(
      `/schedule/${scheduleId}`,
      scheduleData
    );
    return response.data;
  },

  // 스케줄 삭제 API
  deleteSchedule: async (scheduleId: number): Promise<ScheduleResponse> => {
    const response = await apiClient.delete<ScheduleResponse>(
      `/schedule/${scheduleId}`
    );
    return response.data;
  },

  // 스케줄 즉시 실행 API (파이프라인 실행과 연계)
  executeNow: async (scheduleId: number): Promise<ScheduleResponse> => {
    const response = await apiClient.post<ScheduleResponse>(
      `/schedule/${scheduleId}/execute`
    );
    return response.data;
  },
};

export const authApi = {
  // 로그인 API
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      loginData
    );
    return response.data;
  },

  // 회원가입 API
  register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      registerData
    );
    return response.data;
  },

  // 로그아웃 API
  logout: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/logout");
    return response.data;
  },

  // 토큰 검증 API
  validateToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<AuthResponse>("/auth/validate");
    return response.data;
  },
};

export const pipelineApi = {
  // 파이프라인 실행
  execute: async (data: PipelineExecuteRequest): Promise<PipelineExecuteResponse> => {
    const response = await apiClient.post<PipelineExecuteResponse>(
      "/pipeline/execute",
      data
    );
    return response.data;
  },

  // 파이프라인 상태 조회
  getStatus: async (executionId: number): Promise<PipelineStatusResponse> => {
    const response = await apiClient.get<PipelineStatusResponse>(
      `/pipeline/status/${executionId}`
    );
    return response.data;
  },

  // 파이프라인 제어 (일시정지/재개/중단)
  control: async (
    executionId: number,
    controlData: PipelineControlRequest
  ): Promise<PipelineControlResponse> => {
    const response = await apiClient.post<PipelineControlResponse>(
      `/pipeline/control/${executionId}`,
      controlData
    );
    return response.data;
  },

  // 파이프라인 실행 히스토리 조회
  getHistory: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PipelineHistoryResponse> => {
    const response = await apiClient.get<PipelineHistoryResponse>(
      "/pipeline/history",
      { params }
    );
    return response.data;
  },

  // 파이프라인 실행 결과 상세 조회
  getResult: async (executionId: number): Promise<PipelineResultResponse> => {
    const response = await apiClient.get<PipelineResultResponse>(
      `/pipeline/result/${executionId}`
    );
    return response.data;
  },
};

export default apiClient;
