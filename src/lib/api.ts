import axios from "axios";
import type {
  MenuApiResponse,
  ScheduleRequest,
  ScheduleResponse,
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
};

export default apiClient;
