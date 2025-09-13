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
  SystemHealthResponse,
} from "./types";


// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: "/v1", // vite.config.ts의 프록시 설정으로 localhost:8080에 연결
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API 오류 타입 정의
export interface ApiError {
  message: string;
  status?: number;
  isNetworkError?: boolean;
  isTimeout?: boolean;
  isServerError?: boolean;
  isNotImplemented?: boolean;
}

// API 응답 인터셉터 - 오류 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: '알 수 없는 오류가 발생했습니다.',
      isNetworkError: false,
      isTimeout: false,
      isServerError: false,
    };

    if (error.code === 'ECONNABORTED') {
      // 타임아웃 오류
      apiError.message = 'API 요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.';
      apiError.isTimeout = true;
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      // 네트워크 오류 (서버 연결 불가)
      apiError.message = 'API 서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
      apiError.isNetworkError = true;
    } else if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response.status;
      apiError.status = status;

      if (status >= 500) {
        apiError.message = `서버 내부 오류가 발생했습니다. (${status})`;
        apiError.isServerError = true;
      } else if (status === 404) {
        console.warn(`API 엔드포인트가 구현되지 않음: ${error.config?.url}`);
        apiError.message = '해당 기능이 아직 구현되지 않았습니다.';
        // 404는 구현되지 않은 API로 처리
        apiError.isNotImplemented = true;
        return Promise.reject(apiError);
      } else if (status === 401) {
        apiError.message = '인증이 필요합니다. 다시 로그인해주세요.';
      } else if (status === 403) {
        apiError.message = '접근 권한이 없습니다.';
      } else {
        apiError.message = error.response.data?.message || `API 오류가 발생했습니다. (${status})`;
      }
    }

    // 전역 오류 이벤트 발생
    window.dispatchEvent(new CustomEvent('api-error', { 
      detail: apiError 
    }));

    return Promise.reject(apiError);
  }
);

// API 연결 상태 체크 함수
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health', { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
};


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

  // 전체 실행 목록 조회
  getAllExecutions: async (): Promise<PipelineStatusResponse[]> => {
    const response = await apiClient.get<PipelineStatusResponse[]>("/pipeline/executions");
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
    try {
      const response = await apiClient.get<PipelineHistoryResponse>(
        "/pipeline/history",
        { params }
      );
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.isNotImplemented) {
        // 백엔드 미구현 시 임시 데이터 반환
        return {
          success: true,
          data: {
            executions: [
              {
                executionId: 1,
                scheduleId: 1,
                status: "completed",
                startedAt: new Date(Date.now() - 3600000).toISOString(),
                completedAt: new Date().toISOString(),
                duration: "1시간",
                results: {
                  keywordsExtracted: 15,
                  productsCrawled: 42,
                  contentsGenerated: 8,
                  contentsPublished: 6
                }
              },
              {
                executionId: 2,
                scheduleId: 1,
                status: "running",
                startedAt: new Date(Date.now() - 1800000).toISOString(),
                duration: "30분",
                results: {
                  keywordsExtracted: 10,
                  productsCrawled: 25,
                  contentsGenerated: 0,
                  contentsPublished: 0
                }
              }
            ],
            pagination: {
              currentPage: params?.page || 1,
              totalPages: 1,
              totalCount: 2
            }
          }
        };
      }
      throw error;
    }
  },

  // 파이프라인 실행 결과 상세 조회
  getResult: async (executionId: number): Promise<PipelineResultResponse> => {
    const response = await apiClient.get<PipelineResultResponse>(
      `/pipeline/result/${executionId}`
    );
    return response.data;
  },
};

// System Health API
export const systemApi = {
  // 시스템 전체 상태 조회
  getHealth: async (): Promise<SystemHealthResponse> => {
    try {
      const response = await apiClient.get<SystemHealthResponse>('/system/health');
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.isNotImplemented) {
        // 백엔드 미구현 시 임시 데이터 반환
        return {
          success: true,
          data: {
            status: "healthy",
            services: {
              database: "up",
              llm: "up", 
              crawler: "degraded",
              scheduler: "up"
            },
            version: "1.0.0-dev",
            lastChecked: new Date().toISOString()
          },
          message: "시스템 상태 API가 구현 중입니다. 임시 데이터를 표시합니다."
        };
      }
      throw error;
    }
  },

  // 특정 서비스 상태 조회
  getServiceStatus: async (serviceName: string): Promise<SystemHealthResponse> => {
    try {
      const response = await apiClient.get<SystemHealthResponse>(`/system/health/${serviceName}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.isNotImplemented) {
        // 백엔드 미구현 시 임시 데이터 반환
        return {
          success: true,
          data: {
            status: "healthy",
            services: {
              database: serviceName === "database" ? "up" : "up",
              llm: serviceName === "llm" ? "up" : "up",
              crawler: serviceName === "crawler" ? "degraded" : "up", 
              scheduler: serviceName === "scheduler" ? "up" : "up"
            },
            version: "1.0.0-dev",
            lastChecked: new Date().toISOString()
          },
          message: `${serviceName} 상태 API가 구현 중입니다. 임시 데이터를 표시합니다.`
        };
      }
      throw error;
    }
  },
};

export default apiClient;
