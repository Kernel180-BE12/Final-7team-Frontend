import { useState, useEffect } from "react";
import { useExecutionMonitor } from "../../hooks/useExecutionMonitor";
import type {
  PipelineStatusResponse,
  PipelineStageProgress,
} from "@/lib/types";
// Progress component removed - using div instead
// Badge component removed - using span instead

export default function PipelineStatus() {
  const { executions, summary, isLoading, error, getExecutionDetail } = useExecutionMonitor({
    pollingInterval: 15000,
    includeCompleted: true // 모든 실행 포함
  });

  const [detailStates, setDetailStates] = useState<Record<number, PipelineStatusResponse>>({});

  // 실행 중인 파이프라인의 상세 정보 가져오기
  useEffect(() => {
    const fetchDetails = async () => {
      for (const execution of executions) {
        if (execution.data.overallStatus === 'running' || execution.data.overallStatus === 'paused') {
          try {
            const detail = await getExecutionDetail(execution.data.executionId);
            if (detail) {
              setDetailStates(prev => ({
                ...prev,
                [execution.data.executionId]: detail
              }));
            }
          } catch (err) {
            console.error(`Failed to get detail for execution ${execution.data.executionId}:`, err);
          }
        }
      }
    };

    if (executions.length > 0) {
      fetchDetails();
    }
  }, [executions, getExecutionDetail]);

  const activeExecutions = executions.filter(exec =>
    exec.data.overallStatus === 'running' || exec.data.overallStatus === 'paused'
  );

  // 실행 데이터를 상세 정보와 결합


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

  const getProgressPercentage = (executionId: number) => {
    const detail = detailStates[executionId];
    if (!detail) return 0;

    const stages = Object.values(detail.data.progress);
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

        {isLoading && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 요약 통계 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{summary.running}</div>
          <div className="text-xs text-gray-600">실행 중</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{summary.completed}</div>
          <div className="text-xs text-gray-600">완료</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
          <div className="text-xs text-gray-600">실패</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-700">{summary.total}</div>
          <div className="text-xs text-gray-600">전체</div>
        </div>
      </div>

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
          {activeExecutions.map((execution) => {
            const detail = detailStates[execution.data.executionId];
            return (
              <div key={execution.data.executionId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">
                      실행 ID: {execution.data.executionId}
                    </span>
                    {execution.data.scheduleId && (
                      <span className="ml-2 text-xs text-gray-500">
                        (스케줄 {execution.data.scheduleId})
                      </span>
                    )}
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        execution.data.overallStatus
                      )}`}
                    >
                      {getStatusText(execution.data.overallStatus)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {getProgressPercentage(execution.data.executionId)}% 완료
                  </span>
                </div>

                {/* 진행률 바 */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(execution.data.executionId)}%` }}
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
                  현재 단계: {detail?.data.currentStage || execution.data.currentStage || "준비 중"}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  시작 시간:{" "}
                  {new Date(execution.data.startedAt).toLocaleString("ko-KR")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

