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
  {
    id: 1,
    label: "대시보드",
    path: "/dashboard",
    orderSeq: 1,
    roleRequired: "admin",
    isActive: true,
  },
  {
    id: 7,
    label: "결과 모니터링",
    path: "/monitoring",
    orderSeq: 7,
    roleRequired: "admin",
    isActive: true,
  },
  {
    id: 2,
    label: "스케줄 등록",
    path: "/schedule",
    orderSeq: 2,
    roleRequired: "admin",
    isActive: true,
  },
  {
    id: 3,
    label: "스케줄 목록",
    path: "/schedule/list",
    orderSeq: 3,
    roleRequired: "admin",
    isActive: true,
  },
  {
    id: 10,
    label: "작업 로그",
    path: "/logs",
    orderSeq: 8,
    roleRequired: "admin",
    isActive: true,
  },
  {
    id: 8,
    label: "시스템 상태",
    path: "/system",
    orderSeq: 9,
    roleRequired: "admin",
    isActive: true,
  },
  {
    id: 9,
    label: "네트워크 테스트",
    path: "/network-test",
    orderSeq: 10,
    roleRequired: "admin",
    isActive: true,
  },
];

// Schedule Types
export type ScheduleType = "매일 실행" | "주간 실행" | "월간 실행";

// ScheduleType 옵션들을 배열로 제공
export const SCHEDULE_TYPE_OPTIONS: ScheduleType[] = [
  "매일 실행",
  "주간 실행",
  "월간 실행",
];

export interface ScheduleRequest {
  scheduleType: ScheduleType;
  executionTime: string;
  keywordCount: number;
  contentCount: number;
  aiModel: string;
  executeImmediately?: boolean;
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  scheduleId?: number;
  data?: {
    scheduleId: number;
    scheduleType: ScheduleType;
    executionTime: string;
    keywordCount: number;
    contentCount: number;
    aiModel: string;
    isActive: boolean;
    createdAt: string;
    nextExecutionAt: string;
    executionId?: number; // 즉시 실행 시에만 포함
  };
}

// 스케줄 목록 조회 응답 타입
export interface ScheduleListResponse {
  success: boolean;
  message: string;
  data?: Array<{
    scheduleId: number;
    scheduleType: ScheduleType;
    executionTime: string;
    keywordCount: number;
    contentCount: number;
    aiModel: string;
    isActive: boolean;
    createdAt: string;
    nextExecutionAt: string;
  }>;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: {
      id: number;
      username: string;
      email: string;
      role: string;
    };
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Pipeline Types
export interface PipelineConfig {
  keywordCount: number;
  contentCount: number;
  contentType: "blog" | "review" | "description";
  platforms: Array<"naver" | "coupang" | "11st" | "gmarket">;
  publishTargets: Array<"blog" | "social" | "website">;
}

export interface PipelineExecuteRequest {
  keywordCount: number;
  contentCount: number;
  aiModel: string;
  executeImmediately?: boolean;
}

export interface PipelineExecuteResponse {
  success: boolean;
  message: string;
  data: {
    executionId: number;
    status: "started";
    estimatedDuration: string;
    stages: string[];
  };
}

// 각 단계별 결과 타입들
export interface KeywordExtractionResult {
  keywords: Array<{
    keyword: string;
    relevanceScore: number;
    category: string;
  }>;
  totalCount: number;
}

export interface ProductCrawlingResult {
  products: Array<{
    title: string;
    price: number;
    platform: string;
    productUrl: string;
  }>;
  totalCount: number;
}

export interface ContentGenerationResult {
  contents: Array<{
    title: string;
    contentType: string;
    wordCount: number;
    contentPreview: string;
  }>;
  totalCount: number;
}

export interface ContentPublishingResult {
  publications: Array<{
    platform: string;
    publishedUrl: string;
    status: "published" | "failed";
  }>;
  successCount: number;
  failedCount: number;
}

// 단계별 결과 타입 유니온
export type StageResult =
  | KeywordExtractionResult
  | ProductCrawlingResult
  | ContentGenerationResult
  | ContentPublishingResult;

export interface PipelineStageProgress {
  status: "completed" | "running" | "pending" | "failed";
  progress: number;
  startedAt?: string;
  completedAt?: string;
  result?: StageResult;
}

export interface PipelineStatusResponse {
  success: boolean;
  data: {
    executionId: number;
    scheduleId?: number; // 스케줄에서 실행된 경우에만 포함
    overallStatus: "running" | "completed" | "failed" | "paused";
    startedAt: string;
    completedAt?: string;
    currentStage: string;
    progress: {
      keyword_extraction: PipelineStageProgress;
      product_crawling: PipelineStageProgress;
      content_generation: PipelineStageProgress;
      content_publishing: PipelineStageProgress;
    };
    stageResults?: {
      keywordExtraction: Array<{
        keyword: string;
        relevanceScore: number;
        category: string;
      }>;
      productCrawling: Array<{
        title: string;
        price: number;
        platform: string;
        productUrl: string;
      }>;
      contentGeneration: {
        contents: Array<{
          title: string;
          contentType: string;
          wordCount: number;
          contentPreview: string;
        }>;
        totalCount: number;
      } | null;
      contentPublishing: {
        publications: Array<{
          platform: string;
          publishedUrl: string;
          status: "published" | "failed";
        }>;
        successCount: number;
        failedCount: number;
      } | null;
    };
    results?: {
      keywords?: Array<{
        keyword: string;
        relevanceScore: number;
        category: string;
      }>;
      products?: Array<{
        title: string;
        price: number;
        platform: string;
        productUrl: string;
      }>;
      content?: {
        contents: Array<{
          title: string;
          contentType: string;
          wordCount: number;
          contentPreview: string;
        }>;
        totalCount: number;
      };
      publishingStatus?: {
        publications: Array<{
          platform: string;
          publishedUrl: string;
          status: "published" | "failed";
        }>;
        successCount: number;
        failedCount: number;
      };
    };
    logs: Array<{
      timestamp: string;
      stage: string;
      level: "info" | "warning" | "error";
      message: string;
    }>;
  };
}

export interface PipelineControlRequest {
  action: "pause" | "resume" | "cancel";
  reason?: string;
}

export interface PipelineControlResponse {
  success: boolean;
  message: string;
  data: {
    executionId: number;
    newStatus: string;
    timestamp: string;
  };
}

export interface PipelineHistoryItem {
  executionId: number;
  scheduleId: number;
  status: string;
  startedAt: string;
  completedAt?: string;
  duration?: string;
  results: {
    keywordsExtracted: number;
    productsCrawled: number;
    contentsGenerated: number;
    contentsPublished: number;
  };
}

export interface PipelineHistoryResponse {
  success: boolean;
  data: {
    executions: PipelineHistoryItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
    };
  };
}

export interface PipelineResultResponse {
  success: boolean;
  data: {
    executionId: number;
    summary: {
      totalDuration: string;
      successRate: number;
      keywordsExtracted: number;
      productsCrawled: number;
      contentsGenerated: number;
      contentsPublished: number;
    };
    stageResults: {
      keyword_extraction: {
        keywords: Array<{
          keyword: string;
          relevanceScore: number;
          category: string;
        }>;
      };
      product_crawling: {
        products: Array<{
          title: string;
          price: number;
          platform: string;
          productUrl: string;
        }>;
      };
      content_generation: {
        contents: Array<{
          title: string;
          contentType: string;
          wordCount: number;
          contentPreview: string;
        }>;
      };
      content_publishing: {
        publications: Array<{
          platform: string;
          publishedUrl: string;
          status: "published" | "failed";
        }>;
      };
    };
    errors: Array<{
      stage: string;
      error: string;
      timestamp: string;
    }>;
  };
}

// System Health Types
export interface SystemHealthResponse {
  success: boolean;
  data?: {
    status: "healthy" | "degraded" | "down";
    services: {
      database: "up" | "down" | "degraded";
      llm: "up" | "down" | "degraded";
      crawler: "up" | "down" | "degraded";
      scheduler: "up" | "down" | "degraded";
    };
    version: string;
    lastChecked?: string;
  };
  message?: string;
}

export interface ServiceStatus {
  name: string;
  status: "up" | "down" | "degraded";
  responseTime?: number;
  lastChecked: string;
  description: string;
}

// Notification & Alert Types
export interface SystemNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  source: "system" | "pipeline" | "scheduler" | "user";
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "critical";
  metadata?: {
    executionId?: number;
    scheduleId?: number;
    service?: string;
    [key: string]: any;
  };
}

export interface NotificationSettings {
  enableEmail: boolean;
  enablePush: boolean;
  enableInApp: boolean;
  types: {
    systemErrors: boolean;
    pipelineEvents: boolean;
    scheduleUpdates: boolean;
    performanceAlerts: boolean;
  };
  priority: {
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
}

// System Log Types
export interface SystemLog {
  id: string;
  timestamp: string;
  level: "debug" | "info" | "warn" | "error" | "fatal";
  source: string;
  message: string;
  metadata?: {
    userId?: number;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
    duration?: number;
    statusCode?: number;
    [key: string]: any;
  };
  tags?: string[];
}

export interface LogFilter {
  level?: SystemLog["level"][];
  source?: string[];
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  tags?: string[];
}

export interface LogsResponse {
  success: boolean;
  data: {
    logs: SystemLog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  };
}

// Pipeline Monitoring Extended Types
export interface PipelineMetrics {
  executionId: number;
  totalDuration: number;
  avgStageTime: {
    keywordExtraction: number;
    productCrawling: number;
    contentGeneration: number;
    contentPublishing: number;
  };
  resourceUsage: {
    cpuPeak: number;
    memoryPeak: number;
    diskIO: number;
    networkIO: number;
  };
  errorRate: number;
  successRate: number;
}

export interface PipelineAlert {
  id: string;
  executionId: number;
  type: "performance" | "error" | "timeout" | "resource";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  metadata?: {
    threshold?: number;
    actualValue?: number;
    stage?: string;
    [key: string]: any;
  };
}

// Monitoring Dashboard Types
export interface MonitoringOverview {
  systemHealth: {
    overall: "healthy" | "degraded" | "critical";
    services: {
      database: "up" | "down" | "degraded";
      llm: "up" | "down" | "degraded";
      crawler: "up" | "down" | "degraded";
      scheduler: "up" | "down" | "degraded";
    };
  };
  activePipelines: number;
  recentAlerts: number;
  unreadNotifications: number;
  performance: {
    avgResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

// Job Log Types (for /v1/monitoring/logs API)
export interface JobLog {
  log_id: string;
  execution_id: string;
  step_code: string | null;
  source_table: string | null;
  source_id: string | null;
  business_key: string | null;
  log_category: string;
  log_level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  status_code: "SUCCESS" | "FAILURE" | "RUNNING";
  log_message: string;
  created_at: string;
}

export interface JobLogFilter {
  executionId: string;
  startDate?: string;
  endDate?: string;
  status?: "all" | "SUCCESS" | "FAILURE" | "RUNNING";
  level?: "DEBUG" | "INFO" | "WARN" | "ERROR" | "ALL";
  page?: number;
  size?: number;
}

export interface JobLogsResponse {
  success: boolean;
  data: {
    logs: JobLog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  };
  message?: string;
}

// Monitoring Status Types (for /v1/monitoring/status API)
export interface MonitoringStatus {
  successCount: number;
  failureCount: number;
  successRate: number;
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    type: 'success' | 'failure' | 'pending' | 'running';
    timestamp: string;
  }>;
  totalExecutions: number;
  activeExecutions: number;
}

export interface MonitoringStatusResponse {
  success: boolean;
  data: MonitoringStatus;
  message?: string;
}

// 추후 다른 API 타입들도 여기에 추가
