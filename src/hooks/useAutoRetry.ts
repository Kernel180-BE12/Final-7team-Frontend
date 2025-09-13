import { useEffect, useRef, useCallback } from 'react';
import { useNetworkStatus } from '@/components/common/ApiErrorBoundary';

interface UseAutoRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: () => void;
  enabled?: boolean;
}

export function useAutoRetry(
  failedApiCall: (() => Promise<any>) | null,
  options: UseAutoRetryOptions = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 2000,
    onRetry,
    enabled = true
  } = options;

  const { isOnline, wasOffline } = useNetworkStatus();
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const executeRetry = useCallback(async () => {
    if (!failedApiCall || !enabled || retryCountRef.current >= maxRetries) {
      return;
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    retryTimeoutRef.current = setTimeout(async () => {
      try {
        retryCountRef.current++;
        onRetry?.();
        await failedApiCall();
        // 성공 시 카운터 리셋
        retryCountRef.current = 0;
      } catch (error) {
        // 실패 시 다시 재시도 대기
        if (retryCountRef.current < maxRetries) {
          executeRetry();
        }
      }
    }, retryDelay);
  }, [failedApiCall, enabled, maxRetries, retryDelay, onRetry]);

  // 네트워크가 복구되면 자동으로 재시도
  useEffect(() => {
    if (isOnline && wasOffline && failedApiCall && enabled) {
      retryCountRef.current = 0; // 네트워크 복구 시 카운터 리셋
      executeRetry();
    }
  }, [isOnline, wasOffline, executeRetry, failedApiCall, enabled]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    retryCount: retryCountRef.current,
    maxRetries,
    isRetrying: retryCountRef.current > 0 && retryCountRef.current < maxRetries,
  };
}