import { useState, useEffect } from 'react';
import type { ApiError } from '@/lib/api';

interface ApiErrorState {
  hasError: boolean;
  error: ApiError | null;
  errorCount: number;
  lastErrorTime: Date | null;
}

export function useApiError() {
  const [state, setState] = useState<ApiErrorState>({
    hasError: false,
    error: null,
    errorCount: 0,
    lastErrorTime: null,
  });

  const [showGlobalError, setShowGlobalError] = useState(false);

  useEffect(() => {
    const handleApiError = (event: CustomEvent<ApiError>) => {
      const error = event.detail;
      
      setState(prev => ({
        hasError: true,
        error,
        errorCount: prev.errorCount + 1,
        lastErrorTime: new Date(),
      }));

      // 네트워크 오류나 서버 오류인 경우 전역 알림 표시
      if (error.isNetworkError || error.isServerError) {
        setShowGlobalError(true);
      }

      console.error('API Error:', error);
    };

    window.addEventListener('api-error', handleApiError as EventListener);

    return () => {
      window.removeEventListener('api-error', handleApiError as EventListener);
    };
  }, []);

  const clearError = () => {
    setState({
      hasError: false,
      error: null,
      errorCount: 0,
      lastErrorTime: null,
    });
    setShowGlobalError(false);
  };

  const dismissGlobalError = () => {
    setShowGlobalError(false);
  };

  const retryLastRequest = () => {
    // 마지막 요청 재시도 로직
    // 실제로는 실패한 요청을 다시 수행하는 로직이 필요
    clearError();
    window.location.reload(); // 임시로 페이지 새로고침
  };

  return {
    ...state,
    showGlobalError,
    clearError,
    dismissGlobalError,
    retryLastRequest,
    
    // 편의 속성들
    isNetworkError: state.error?.isNetworkError ?? false,
    isTimeout: state.error?.isTimeout ?? false,
    isServerError: state.error?.isServerError ?? false,
    errorMessage: state.error?.message ?? '',
  };
}

// 컴포넌트별 API 오류 처리 훅
export function useComponentApiError(componentName: string) {
  const [localError, setLocalError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: ApiError) => void
  ): Promise<T | null> => {
    setIsLoading(true);
    setLocalError(null);

    try {
      const result = await apiCall();
      onSuccess?.(result);
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setLocalError(apiError);
      onError?.(apiError);
      
      console.error(`${componentName} API Error:`, apiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearLocalError = () => {
    setLocalError(null);
  };

  const retryWithHandler = (retryFn: () => Promise<any>) => {
    clearLocalError();
    return handleApiCall(retryFn);
  };

  return {
    localError,
    isLoading,
    handleApiCall,
    clearLocalError,
    retryWithHandler,
    
    // 편의 속성들
    hasLocalError: !!localError,
    localErrorMessage: localError?.message ?? '',
    isNetworkError: localError?.isNetworkError ?? false,
    isTimeout: localError?.isTimeout ?? false,
    isServerError: localError?.isServerError ?? false,
  };
}