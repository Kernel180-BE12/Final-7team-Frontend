import { useEffect, useState } from "react";
import { usePipelineStore } from "@/store/pipelineStore";
import { useUiStore } from "@/store/uiStore";
import { pipelineApi } from "@/lib/api";
import type {
  PipelineStatusResponse,
  PipelineStageProgress,
} from "@/lib/types";

export default function PipelineStatus() {
  const { getActiveExecutionsList, setActiveExecution, removeActiveExecution } =
    usePipelineStore();
  const { isLoading, errors, setLoading, setError, clearError } = useUiStore();

  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const activeExecutions = getActiveExecutionsList();

  // 샘플 데이터 제거 - 실제 API 데이터만 사용

  // 활성 파이프라인들의 상태를 주기적으로 확인하고 각 단계별 데이터를 통합 관리
  useEffect(() => {
    const fetchActiveStatuses = async () => {
      if (activeExecutions.length === 0) return;

      try {
        setLoading("pipeline", true);
        clearError("pipeline");

        for (const execution of activeExecutions) {
          if (
            execution.overallStatus === "running" ||
            execution.overallStatus === "paused"
          ) {
            try {
              const response: PipelineStatusResponse =
                await pipelineApi.getStatus(execution.executionId);

              // 파이프라인 데이터 통합 관리 - 각 단계별 결과 데이터도 포함
              const updatedExecution = {
                ...response.data,
                stageResults: {
                  keywordExtraction: response.data.progress.keyword_extraction.status === 'completed' 
                    ? response.data.results?.keywords || [] : [],
                  productCrawling: response.data.progress.product_crawling.status === 'completed'
                    ? response.data.results?.products || [] : [],
                  contentGeneration: response.data.progress.content_generation.status === 'completed'
                    ? response.data.results?.content || null : null,
                  contentPublishing: response.data.progress.content_publishing.status === 'completed'
                    ? response.data.results?.publishingStatus || null : null
                }
              };

              // 완료된 경우 활성 목록에서 제거
              if (
                response.data.overallStatus === "completed" ||
                response.data.overallStatus === "failed"
              ) {
                removeActiveExecution(execution.executionId);
              } else {
                setActiveExecution(execution.executionId, updatedExecution);
              }
            } catch (error) {
              console.error(
                `Failed to fetch status for execution ${execution.executionId}:`,
                error
              );
            }
          }
        }
      } catch (err) {
        console.error("Pipeline status fetch error:", err);
        setError("pipeline", "파이프라인 상태 조회 중 오류가 발생했습니다.");
      } finally {
        setLoading("pipeline", false);
      }
    };

    // 개발 환경에서는 API 호출 비활성화 (샘플 데이터 사용)
    if (!import.meta.env.DEV && activeExecutions.length > 0) {
      fetchActiveStatuses(); // 즉시 한 번 실행
      const interval = setInterval(fetchActiveStatuses, 2000); // 2초마다 상태 확인
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [activeExecutions.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "실행 중";
      case "paused":
        return "일시 정지";
      case "completed":
        return "완료";
      case "failed":
        return "실패";
      default:
        return "알 수 없음";
    }
  };

  const getProgressPercentage = (execution: PipelineStatusResponse["data"]) => {
    const stages = Object.values(execution.progress);
    const totalProgress = stages.reduce(
      (sum: number, stage: PipelineStageProgress) => sum + stage.progress,
      0
    );
    return Math.round(totalProgress / stages.length);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2 mr-3">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              파이프라인 실행 상태
            </h3>
            <p className="text-sm text-gray-600">현재 실행 중인 자동화 작업</p>
          </div>
        </div>

        {isLoading.pipeline && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        )}
      </div>

      {errors.pipeline && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.pipeline}
        </div>
      )}

      {activeExecutions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            현재 실행 중인 파이프라인이 없습니다
          </p>
          <p className="text-gray-400 text-xs mt-1">
            스케줄에 따라 자동 실행되거나 수동으로 실행할 수 있습니다
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeExecutions.map((execution) => (
            <div key={execution.executionId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">
                    실행 ID: {execution.executionId}
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      execution.overallStatus
                    )}`}
                  >
                    {getStatusText(execution.overallStatus)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {getProgressPercentage(execution)}% 완료
                </span>
              </div>

              {/* 진행률 바 */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(execution)}%` }}
                ></div>
              </div>

              {/* 현재 단계 */}
              <div className="flex items-center text-sm text-gray-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                현재 단계: {execution.currentStage || "준비 중"}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                시작 시간:{" "}
                {new Date(execution.startedAt).toLocaleString("ko-KR")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

