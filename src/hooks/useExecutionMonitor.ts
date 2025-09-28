import { useState, useEffect, useRef } from "react";
import { pipelineApi } from "@/lib/api";
import type { PipelineStatusResponse } from "@/lib/types";

export interface ExecutionSummary {
  total: number;
  running: number;
  completed: number;
  failed: number;
  recentExecutions: PipelineStatusResponse[];
}

export interface UseExecutionMonitorOptions {
  pollingInterval?: number;
  autoStart?: boolean;
  includeCompleted?: boolean;
}

export function useExecutionMonitor(options: UseExecutionMonitorOptions = {}) {
  const {
    pollingInterval = 15000,
    autoStart = true,
    includeCompleted = false
  } = options;

  const [executions, setExecutions] = useState<PipelineStatusResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useRef로 interval 관리 (재생성 방지)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  // 실행 목록 요약 계산
  const summary: ExecutionSummary = {
    total: executions.length,
    running: executions.filter(e => e.data.overallStatus === 'running').length,
    completed: executions.filter(e => e.data.overallStatus === 'completed').length,
    failed: executions.filter(e => e.data.overallStatus === 'failed').length,
    recentExecutions: executions.slice(0, 5)
  };

  // 간단한 fetch 함수 (useCallback 없이)
  const fetchExecutions = async () => {
    try {
      setError(null);
      const allExecutions = await pipelineApi.getAllExecutions();

      const filteredExecutions = allExecutions.filter(execution => {
        if (!execution.success) return false;

        const status = execution.data.overallStatus;
        if (status === 'running' || status === 'paused' || status === 'failed') {
          return true;
        }

        return includeCompleted && status === 'completed';
      });

      setExecutions(filteredExecutions);
    } catch (err) {
      setError(err instanceof Error ? err.message : '실행 목록 조회 중 오류가 발생했습니다.');
    }
  };

  // 단순한 폴링 시작
  const startPolling = () => {
    if (isPollingRef.current) return;

    isPollingRef.current = true;
    fetchExecutions(); // 즉시 실행

    intervalRef.current = setInterval(fetchExecutions, pollingInterval);
  };

  // 단순한 폴링 중지
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
  };

  // 수동 새로고침
  const refresh = async () => {
    setIsLoading(true);
    await fetchExecutions();
    setIsLoading(false);
  };

  // 특정 실행의 상세 상태 조회
  const getExecutionDetail = async (executionId: number) => {
    try {
      return await pipelineApi.getStatus(executionId);
    } catch (err) {
      console.error(`Failed to get execution detail for ${executionId}:`, err);
      return null;
    }
  };

  // 마운트시 자동 시작
  useEffect(() => {
    if (autoStart) {
      startPolling();
    }

    // cleanup
    return () => {
      stopPolling();
    };
  }, []); // 의존성 없음 - 마운트시에만

  return {
    executions,
    summary,
    isLoading,
    error,
    isPolling: isPollingRef.current,
    startPolling,
    stopPolling,
    refresh,
    getExecutionDetail
  };
}