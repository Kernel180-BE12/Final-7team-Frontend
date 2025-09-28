import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiErrorMessage } from "@/components/common/ApiErrorMessage";
import { systemApi, dashboardApi } from "@/lib/api";
import { useUiStore } from "@/store/uiStore";
import type { SystemHealthResponse } from "@/lib/types";

export default function SystemStatus() {
  const [systemHealth, setSystemHealth] = useState<SystemHealthResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [apiError, setApiError] = useState<{ message: string; isNotImplemented: boolean } | null>(null);

  // API 테스트를 위한 상태
  const [apiResponse, setApiResponse] = useState<string>("");
  const {
    isLoading: uiLoading,
    errors,
    setLoading,
    setError,
    clearError,
  } = useUiStore();

  // 시스템 상태 조회
  const fetchSystemHealth = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const data = await systemApi.getHealth();
      setSystemHealth(data);
      setLastUpdated(new Date());
    } catch (error: unknown) {
      console.error("시스템 상태 조회 실패:", error);
      
      // 에러 객체 타입 가드
      const isApiError = (err: unknown): err is { 
        isNotImplemented?: boolean; 
        message?: string; 
        data?: SystemHealthResponse | null;
      } => {
        return typeof err === 'object' && err !== null;
      };
      
      if (isApiError(error) && error.isNotImplemented) {
        // API가 구현되지 않은 경우 - 자동으로 임시 데이터가 반환됨
        setSystemHealth(error.data || null);
        setApiError({
          message: error.message || "해당 기능이 아직 구현되지 않았습니다.",
          isNotImplemented: true
        });
      } else {
        // 다른 에러의 경우
        const errorMessage = isApiError(error) && error.message 
          ? error.message 
          : "시스템 상태를 조회할 수 없습니다.";
          
        setApiError({
          message: errorMessage,
          isNotImplemented: false
        });
        setSystemHealth({
          success: false,
          message: "조회 실패 - 백엔드 서버에 연결할 수 없습니다",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 시스템 상태 조회
  useEffect(() => {
    fetchSystemHealth();
  }, []);

  // 자동 새로고침 제거 - 수동 새로고침만 사용

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "up":
        return "text-green-600 bg-green-100";
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "down":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "up":
        return "●";
      case "degraded":
        return "◐";
      case "down":
        return "●";
      default:
        return "○";
    }
  };

  const getServiceDisplayName = (service: string) => {
    const serviceNames: { [key: string]: string } = {
      database: "데이터베이스",
      llm: "LLM 서비스",
      crawler: "크롤러 서비스",
      scheduler: "스케줄러",
    };
    return serviceNames[service] || service;
  };

  // 백엔드 연결 테스트
  const testConnection = async () => {
    setLoading("apiTest", true);
    clearError("apiTest");
    setApiResponse("");

    try {
      const result = await dashboardApi.testConnection("admin", "ronlee");
      setApiResponse(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류";
      setError("apiTest", `연결 실패: ${errorMessage}`);
    } finally {
      setLoading("apiTest", false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                시스템 상태 조회
              </h1>
              <p className="text-gray-600">
                시스템 및 서비스 상태를 실시간으로 모니터링합니다
              </p>
            </div>
            <div className="text-right">
              <button
                onClick={() => fetchSystemHealth()}
                className="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                새로고침
              </button>
              <div className="text-sm text-gray-500">
                마지막 업데이트: {lastUpdated.toLocaleTimeString("ko-KR")}
              </div>
            </div>
          </div>
        </div>

        {/* API 에러 메시지 */}
        {apiError && (
          <div className="mb-6">
            <ApiErrorMessage
              message={apiError.message}
              isNotImplemented={apiError.isNotImplemented}
              onRetry={() => fetchSystemHealth()}
            />
          </div>
        )}

        {/* 백엔드 연결 테스트 */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">백엔드 연결 테스트</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <button
                onClick={testConnection}
                disabled={uiLoading.apiTest}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {uiLoading.apiTest ? "테스트 중..." : "백엔드 연결 테스트"}
              </button>

              {apiResponse && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">✅ 연결 성공!</p>
                  <p className="text-sm text-green-600">
                    백엔드 응답: {apiResponse.replace(/<[^>]*>/g, "")}
                  </p>
                </div>
              )}

              {errors.apiTest && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">❌ 연결 실패</p>
                  <p className="text-sm text-red-600">{errors.apiTest}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 전체 상태 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">전체 상태</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {systemHealth?.success ? (
                <div className="flex items-center">
                  <span
                    className={`text-2xl mr-3 ${
                      getStatusColor(systemHealth.data?.status || "down").split(
                        " "
                      )[0]
                    }`}
                  >
                    {getStatusIcon(systemHealth.data?.status || "down")}
                  </span>
                  <div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        systemHealth.data?.status || "down"
                      )}`}
                    >
                      {systemHealth.data?.status === "healthy"
                        ? "정상"
                        : systemHealth.data?.status === "degraded"
                        ? "성능 저하"
                        : "서비스 중단"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      버전: {systemHealth.data?.version}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-2xl mr-3 text-red-600">●</span>
                  <div>
                    <div className="px-3 py-1 rounded-full text-sm font-semibold text-red-600 bg-red-100">
                      조회 실패
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {systemHealth?.message}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">서비스 현황</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {systemHealth?.success ? (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(systemHealth.data?.services || {}).map(
                    ([service, status]) => (
                      <div
                        key={service}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">
                          {getServiceDisplayName(service)}
                        </span>
                        <div className="flex items-center">
                          <span
                            className={`text-lg mr-2 ${
                              getStatusColor(status).split(" ")[0]
                            }`}
                          >
                            {getStatusIcon(status)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                              status
                            )}`}
                          >
                            {status === "up"
                              ? "정상"
                              : status === "degraded"
                              ? "저하"
                              : "중단"}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  서비스 상태를 불러올 수 없습니다
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 상세 서비스 상태 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemHealth?.success && systemHealth.data?.services
            ? Object.entries(systemHealth.data.services).map(
                ([service, status]) => (
                  <Card
                    key={service}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{getServiceDisplayName(service)}</span>
                        <span
                          className={`text-xl ${
                            getStatusColor(status).split(" ")[0]
                          }`}
                        >
                          {getStatusIcon(status)}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div
                        className={`px-3 py-2 rounded-full text-center text-sm font-semibold mb-3 ${getStatusColor(
                          status
                        )}`}
                      >
                        {status === "up"
                          ? "정상 운영"
                          : status === "degraded"
                          ? "성능 저하"
                          : "서비스 중단"}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">응답 시간:</span>
                          <span>
                            {status === "up"
                              ? "< 100ms"
                              : status === "degraded"
                              ? "> 500ms"
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">마지막 체크:</span>
                          <span>
                            {new Date().toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )
            : // 에러 상태일 때 빈 카드들 표시
              Array.from({ length: 4 }, (_, index) => (
                <Card key={index} className="opacity-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">서비스 상태</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="text-center text-gray-500">상태 불명</div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
}
