import { useState, useCallback } from 'react';
import { useNetworkStatus } from '@/components/common/ApiErrorBoundary';
import type { CustomApiError } from '@/lib/api';

interface UseApiWithNetworkStatusReturn<T> {
  data: T | null;
  loading: boolean;
  error: CustomApiError | null;
  execute: () => Promise<T | null>;
  networkOffline: boolean;
}

export function useApiWithNetworkStatus<T>(
  apiCall: () => Promise<T>
): UseApiWithNetworkStatusReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CustomApiError | null>(null);
  const { isOnline } = useNetworkStatus();

  const execute = useCallback(async (): Promise<T | null> => {
    // 네트워크가 오프라인인 경우 즉시 에러 반환
    if (!isOnline) {
      const networkError: CustomApiError = {
        message: '네트워크 연결을 확인해주세요. 인터넷에 연결되지 않았습니다.',
        isNetworkError: true,
        isTimeout: false,
        isServerError: false,
      };
      setError(networkError);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const apiError = err as CustomApiError;
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall, isOnline]);

  return {
    data,
    loading,
    error,
    execute,
    networkOffline: !isOnline,
  };
}