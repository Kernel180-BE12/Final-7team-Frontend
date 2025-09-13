import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConnectionStatusProps {
  isConnected: boolean;
  lastError?: string;
  onRetry?: () => void;
  showDetails?: boolean;
}

export function ConnectionStatus({ 
  isConnected, 
  lastError, 
  onRetry,
  showDetails = false 
}: ConnectionStatusProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  if (isConnected && !lastError) {
    return null; // 정상 상태에서는 표시하지 않음
  }

  return (
    <Card className={`mb-4 border-2 ${
      isConnected 
        ? 'border-green-200 bg-green-50' 
        : 'border-red-200 bg-red-50'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'
            }`} />
            <div>
              <p className={`font-medium ${
                isConnected ? 'text-green-800' : 'text-red-800'
              }`}>
                {isConnected ? 'API 서버 연결됨' : 'API 서버 연결 실패'}
              </p>
              {lastError && showDetails && (
                <p className={`text-sm mt-1 ${
                  isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {lastError}
                </p>
              )}
            </div>
          </div>

          {!isConnected && onRetry && (
            <Button
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRetrying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  재시도 중...
                </>
              ) : (
                '다시 연결'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// API 상태 모니터링 컴포넌트
export function ApiStatusMonitor() {
  const [status, setStatus] = useState({
    isConnected: true,
    lastError: '',
    lastChecked: new Date(),
  });

  // 주기적으로 API 상태 체크
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // 간단한 헬스체크 요청
        const response = await fetch('/api/health', {
          method: 'GET',
          timeout: 5000,
        });
        
        if (response.ok) {
          setStatus({
            isConnected: true,
            lastError: '',
            lastChecked: new Date(),
          });
        } else {
          throw new Error(`API 응답 오류: ${response.status}`);
        }
      } catch (error) {
        setStatus({
          isConnected: false,
          lastError: error instanceof Error ? error.message : '연결 실패',
          lastChecked: new Date(),
        });
      }
    };

    // 초기 체크
    checkApiStatus();

    // 30초마다 체크
    const interval = setInterval(checkApiStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    // 상태를 일시적으로 리셋하고 재연결 시도
    setStatus(prev => ({ ...prev, lastError: '', isConnected: true }));
    
    // 실제 API 재연결 로직은 여기에 구현
    window.location.reload();
  };

  return (
    <ConnectionStatus
      isConnected={status.isConnected}
      lastError={status.lastError}
      onRetry={handleRetry}
      showDetails={true}
    />
  );
}

// 전역 오류 표시 컴포넌트 (페이지 상단에 고정)
export function GlobalApiError({ 
  show, 
  message, 
  onDismiss, 
  onRetry 
}: {
  show: boolean;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">API 서버 연결 오류:</span>
          <span>{message}</span>
        </div>

        <div className="flex items-center space-x-2">
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="border-white text-white hover:bg-white hover:text-red-600"
            >
              재시도
            </Button>
          )}
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="text-white hover:bg-red-700"
            >
              ✕
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}