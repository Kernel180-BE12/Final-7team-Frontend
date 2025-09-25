import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { monitoringApi } from "@/lib/api";
import type { MonitoringStatus } from "@/lib/types";

export default function ResultMonitoring() {
  const [monitoring, setMonitoring] = useState<MonitoringStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMonitoringStats = async () => {
      try {
        setIsLoading(true);
        const response = await monitoringApi.getStats();
        if (response.success) {
          setMonitoring(response.data);
        } else {
          console.error('모니터링 통계 조회 실패:', response.message);
        }
      } catch (error) {
        console.error('모니터링 통계 조회 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonitoringStats();

    // 30초마다 자동 새로고침
    const interval = setInterval(fetchMonitoringStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (type: 'success' | 'failure' | 'pending' | 'running') => {
    switch (type) {
      case 'success':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            성공
          </span>
        )
      case 'failure':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            실패
          </span>
        )
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            대기중
          </span>
        )
      case 'running':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            실행중
          </span>
        )
      default:
        return null
    }
  }


  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          결과 모니터링
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        ) : monitoring ? (
          <>
            <div className="flex justify-between mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{monitoring.successCount}</div>
                <div className="text-xs text-gray-600">성공 실행</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{monitoring.failureCount}</div>
                <div className="text-xs text-gray-600">실패 실행</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{monitoring.successRate}%</div>
                <div className="text-xs text-gray-600">성공률</div>
              </div>
            </div>

            <div className="space-y-3">
              {monitoring.recentActivities.map((activity, index) => (
                <div key={activity.id} className={`flex justify-between items-center py-3 ${index < monitoring.recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.title}</div>
                    <div className="text-xs text-gray-600">{activity.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString('ko-KR')}
                    </div>
                  </div>
                  {getStatusBadge(activity.type)}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">
            모니터링 데이터를 불러올 수 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  )
}