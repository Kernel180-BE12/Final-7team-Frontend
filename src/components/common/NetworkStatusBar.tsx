import React from 'react';
import { useNetworkStatus } from '@/components/common/ApiErrorBoundary';

export function NetworkStatusBar() {
  const { isOnline, wasOffline } = useNetworkStatus();

  // 온라인이고 오프라인 경험이 없으면 표시하지 않음 (깔끔한 UX)
  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-2 text-center text-sm font-medium transition-all duration-300 ${
      isOnline 
        ? 'bg-green-600 text-white' 
        : 'bg-red-600 text-white'
    }`}>
      <div className="flex items-center justify-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-white' : 'bg-white animate-pulse'
        }`} />
        <span>
          {isOnline 
            ? '네트워크 연결이 복구되었습니다' 
            : '네트워크 연결을 확인해주세요'
          }
        </span>
      </div>
    </div>
  );
}