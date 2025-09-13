import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNetworkStatus } from '@/components/common/ApiErrorBoundary';

export function NetworkStatusTest() {
  const { isOnline, wasOffline } = useNetworkStatus();

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>🌐 네트워크 상태 테스트</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg border-2 ${
          isOnline 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'
            }`} />
            <span className={`font-medium ${
              isOnline ? 'text-green-800' : 'text-red-800'
            }`}>
              {isOnline ? '온라인' : '오프라인'}
            </span>
          </div>
          <p className={`text-sm mt-2 ${
            isOnline ? 'text-green-600' : 'text-red-600'
          }`}>
            {isOnline 
              ? '인터넷 연결이 정상입니다.' 
              : '인터넷 연결을 확인해주세요.'
            }
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">연결 이력</h4>
          <p className="text-sm text-blue-600">
            {wasOffline 
              ? '이전에 연결이 끊어진 적이 있습니다.' 
              : '연결이 계속 유지되고 있습니다.'
            }
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">테스트 방법</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 네트워크를 끄고 켜서 상태 변화 확인</p>
            <p>• 브라우저 개발자 도구의 Network 탭에서 "Offline" 시뮬레이션</p>
            <p>• WiFi/이더넷 연결을 끊었다가 다시 연결</p>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>현재 시간: {new Date().toLocaleTimeString()}</p>
          <p>navigator.onLine: {navigator.onLine ? 'true' : 'false'}</p>
        </div>
      </CardContent>
    </Card>
  );
}