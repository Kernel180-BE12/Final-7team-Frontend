import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SystemNotification, NotificationSettings } from "@/lib/types";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "high" | "critical">("all");
  const [settings, setSettings] = useState<NotificationSettings>({
    enableEmail: true,
    enablePush: true,
    enableInApp: true,
    types: {
      systemErrors: true,
      pipelineEvents: true,
      scheduleUpdates: true,
      performanceAlerts: true,
    },
    priority: {
      low: true,
      medium: true,
      high: true,
      critical: true,
    },
  });

  useEffect(() => {
    if (import.meta.env.DEV) {
      const sampleNotifications: SystemNotification[] = [
        {
          id: "1",
          type: "error",
          title: "파이프라인 실행 실패",
          message: "실행 ID 1003에서 콘텐츠 생성 단계 중 오류가 발생했습니다.",
          source: "pipeline",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          isRead: false,
          priority: "high",
          metadata: { executionId: 1003, stage: "content_generation" },
        },
        {
          id: "2",
          type: "warning",
          title: "시스템 성능 경고",
          message: "크롤러 서비스 응답 시간이 임계값을 초과했습니다.",
          source: "system",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          isRead: false,
          priority: "medium",
          metadata: { service: "crawler", responseTime: 850 },
        },
        {
          id: "3",
          type: "success",
          title: "파이프라인 완료",
          message: "실행 ID 1002가 성공적으로 완료되었습니다.",
          source: "pipeline",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: true,
          priority: "low",
          metadata: { executionId: 1002 },
        },
        {
          id: "4",
          type: "info",
          title: "스케줄 업데이트",
          message: "일일 실행 스케줄이 오후 2시로 변경되었습니다.",
          source: "scheduler",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          isRead: true,
          priority: "low",
          metadata: { scheduleId: 1 },
        },
      ];
      setNotifications(sampleNotifications);
    }
  }, []);

  const getTypeIcon = (type: SystemNotification["type"]) => {
    switch (type) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };


  const getPriorityBadge = (priority: SystemNotification["priority"]) => {
    const colors = {
      low: "bg-gray-100 text-gray-600",
      medium: "bg-yellow-100 text-yellow-600",
      high: "bg-orange-100 text-orange-600",
      critical: "bg-red-100 text-red-600",
    };
    return colors[priority];
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case "unread":
        return !notif.isRead;
      case "high":
        return notif.priority === "high";
      case "critical":
        return notif.priority === "critical";
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                알림 센터
              </h1>
              <p className="text-gray-600">
                시스템 알림 및 파이프라인 이벤트를 관리합니다
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                모두 읽음 처리
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    알림 목록 ({unreadCount}개 읽지 않음)
                  </CardTitle>
                  <div className="flex gap-2">
                    {["all", "unread", "high", "critical"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          filter === f
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {f === "all" ? "전체" : f === "unread" ? "읽지 않음" : f === "high" ? "높음" : "긴급"}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    표시할 알림이 없습니다
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.isRead ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">
                                {getTypeIcon(notification.type)}
                              </span>
                              <h3 className="font-medium text-gray-800">
                                {notification.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadge(
                                  notification.priority
                                )}`}
                              >
                                {notification.priority === "low" ? "낮음" :
                                 notification.priority === "medium" ? "보통" :
                                 notification.priority === "high" ? "높음" : "긴급"}
                              </span>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>
                                {new Date(notification.timestamp).toLocaleString("ko-KR")}
                              </span>
                              <span>소스: {notification.source}</span>
                              {notification.metadata && (
                                <span>
                                  {notification.metadata.executionId &&
                                    `실행 ID: ${notification.metadata.executionId}`}
                                  {notification.metadata.service &&
                                    `서비스: ${notification.metadata.service}`}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                              >
                                읽음
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">알림 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">알림 방식</h4>
                  <div className="space-y-2">
                    {[
                      { key: "enableInApp" as const, label: "앱 내 알림" },
                      { key: "enableEmail" as const, label: "이메일" },
                      { key: "enablePush" as const, label: "푸시 알림" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={settings[key]}
                          onChange={(e) =>
                            setSettings(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))
                          }
                          className="mr-2"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">알림 유형</h4>
                  <div className="space-y-2">
                    {[
                      { key: "systemErrors" as const, label: "시스템 오류" },
                      { key: "pipelineEvents" as const, label: "파이프라인 이벤트" },
                      { key: "scheduleUpdates" as const, label: "스케줄 변경" },
                      { key: "performanceAlerts" as const, label: "성능 경고" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={settings.types[key]}
                          onChange={(e) =>
                            setSettings(prev => ({
                              ...prev,
                              types: { ...prev.types, [key]: e.target.checked }
                            }))
                          }
                          className="mr-2"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">우선순위 필터</h4>
                  <div className="space-y-2">
                    {[
                      { key: "critical" as const, label: "긴급" },
                      { key: "high" as const, label: "높음" },
                      { key: "medium" as const, label: "보통" },
                      { key: "low" as const, label: "낮음" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={settings.priority[key]}
                          onChange={(e) =>
                            setSettings(prev => ({
                              ...prev,
                              priority: { ...prev.priority, [key]: e.target.checked }
                            }))
                          }
                          className="mr-2"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  설정 저장
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}