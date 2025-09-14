import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePipelineStore } from "@/store/pipelineStore";
import type {
  MonitoringOverview,
  SystemNotification,
  PipelineAlert,
} from "@/lib/types";

export default function MonitoringDashboard() {
  const [overview, setOverview] = useState<MonitoringOverview | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<SystemNotification[]>([]);
  const [pipelineAlerts, setPipelineAlerts] = useState<PipelineAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getActiveExecutionsList } = usePipelineStore();
  const activeExecutions = getActiveExecutionsList();

  useEffect(() => {
    if (import.meta.env.DEV) {
      const sampleOverview: MonitoringOverview = {
        systemHealth: {
          overall: "healthy",
          services: {
            database: "up",
            llm: "up",
            crawler: "degraded",
            scheduler: "up",
          },
        },
        activePipelines: activeExecutions.length,
        recentAlerts: 3,
        unreadNotifications: 5,
        performance: {
          avgResponseTime: 245,
          errorRate: 2.1,
          uptime: 99.8,
        },
      };

      const sampleNotifications: SystemNotification[] = [
        {
          id: "1",
          type: "warning",
          title: "크롤러 성능 저하",
          message: "크롤러 서비스의 응답 시간이 평균보다 30% 증가했습니다.",
          source: "system",
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          isRead: false,
          priority: "medium",
        },
        {
          id: "2",
          type: "error",
          title: "파이프라인 실행 실패",
          message: "실행 ID 1005에서 콘텐츠 생성 중 오류가 발생했습니다.",
          source: "pipeline",
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          isRead: false,
          priority: "high",
          metadata: { executionId: 1005 },
        },
        {
          id: "3",
          type: "success",
          title: "스케줄 실행 완료",
          message: "일일 파이프라인이 성공적으로 완료되었습니다.",
          source: "scheduler",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          isRead: true,
          priority: "low",
        },
      ];

      const sampleAlerts: PipelineAlert[] = [
        {
          id: "alert-1",
          executionId: 1003,
          type: "performance",
          severity: "medium",
          title: "콘텐츠 생성 지연",
          description: "평균 처리 시간이 예상보다 50% 초과했습니다.",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          resolved: false,
          metadata: {
            threshold: 300,
            actualValue: 450,
            stage: "content_generation",
          },
        },
        {
          id: "alert-2",
          executionId: 1004,
          type: "error",
          severity: "high",
          title: "API 호출 실패",
          description: "외부 API 연결이 반복적으로 실패하고 있습니다.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          resolved: false,
          metadata: {
            stage: "product_crawling",
          },
        },
      ];

      setOverview(sampleOverview);
      setRecentNotifications(sampleNotifications);
      setPipelineAlerts(sampleAlerts);
      setIsLoading(false);
    }
  }, [activeExecutions.length]);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return "✅";
      case "degraded":
        return "⚠️";
      case "down":
        return "❌";
      default:
        return "❓";
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 border-red-300";
      case "high":
        return "text-red-500 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            통합 모니터링 대시보드
          </h1>
          <p className="text-gray-600">
            시스템 상태와 파이프라인을 한눈에 모니터링합니다
          </p>
        </div>

        {/* 개요 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">시스템 상태</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getHealthStatusColor(
                        overview?.systemHealth.overall || "unknown"
                      )}`}
                    >
                      {overview?.systemHealth.overall === "healthy"
                        ? "정상"
                        : overview?.systemHealth.overall === "degraded"
                        ? "저하"
                        : "위험"}
                    </span>
                  </div>
                </div>
                <div className="text-2xl">🏥</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">활성 파이프라인</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overview?.activePipelines || 0}
                  </p>
                </div>
                <div className="text-2xl">⚡</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">최근 경고</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overview?.recentAlerts || 0}
                  </p>
                </div>
                <div className="text-2xl">🚨</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">읽지 않은 알림</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overview?.unreadNotifications || 0}
                  </p>
                </div>
                <div className="text-2xl">📢</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 시스템 서비스 상태 */}
          <Card>
            <CardHeader>
              <CardTitle>서비스 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview?.systemHealth.services &&
                  Object.entries(overview.systemHealth.services).map(([service, status]) => (
                    <div key={service} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {service === "database"
                          ? "데이터베이스"
                          : service === "llm"
                          ? "LLM 서비스"
                          : service === "crawler"
                          ? "크롤러"
                          : "스케줄러"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{getServiceStatusIcon(status)}</span>
                        <span className="text-sm text-gray-600">
                          {status === "up" ? "정상" : status === "degraded" ? "저하" : "중단"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* 성능 지표 */}
          <Card>
            <CardHeader>
              <CardTitle>성능 지표</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">평균 응답 시간</span>
                  <span className="text-sm text-gray-600">
                    {overview?.performance.avgResponseTime || 0}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">오류율</span>
                  <span className="text-sm text-gray-600">
                    {overview?.performance.errorRate || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">업타임</span>
                  <span className="text-sm text-gray-600">
                    {overview?.performance.uptime || 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 알림 */}
          <Card>
            <CardHeader>
              <CardTitle>최근 알림</CardTitle>
            </CardHeader>
            <CardContent>
              {recentNotifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">알림이 없습니다</p>
              ) : (
                <div className="space-y-3">
                  {recentNotifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        !notification.isRead ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">
                              {notification.type === "error"
                                ? "❌"
                                : notification.type === "warning"
                                ? "⚠️"
                                : notification.type === "success"
                                ? "✅"
                                : "ℹ️"}
                            </span>
                            <span className="text-sm font-medium">{notification.title}</span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.timestamp).toLocaleString("ko-KR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 파이프라인 경고 */}
          <Card>
            <CardHeader>
              <CardTitle>파이프라인 경고</CardTitle>
            </CardHeader>
            <CardContent>
              {pipelineAlerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">경고가 없습니다</p>
              ) : (
                <div className="space-y-3">
                  {pipelineAlerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getAlertSeverityColor(
                        alert.severity
                      )}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{alert.title}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getAlertSeverityColor(
                                alert.severity
                              )}`}
                            >
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>실행 ID: {alert.executionId}</span>
                            <span>
                              {new Date(alert.timestamp).toLocaleString("ko-KR")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}