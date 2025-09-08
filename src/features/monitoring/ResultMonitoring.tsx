import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 임시 더미 데이터 (나중에 monitoringStore나 별도 스토어로 이동 예정)
const dummyMonitoring = {
  successCount: 23,
  failureCount: 2,
  successRate: 92,
  recentLogs: [
    {
      id: '1',
      title: '블로그 발행 성공',
      description: '"겨울 패딩 추천" 글 발행 완료',
      type: 'success' as 'success' | 'failure' | 'pending',
    },
    {
      id: '2',
      title: '이미지 업로드 실패',
      description: '파일 크기 초과로 업로드 실패',
      type: 'failure' as 'success' | 'failure' | 'pending',
    },
    {
      id: '3',
      title: '다음 발행 대기중',
      description: '예약 시간: 내일 08:00',
      type: 'pending' as 'success' | 'failure' | 'pending',
    },
  ],
}

export default function ResultMonitoring() {
  const monitoring = dummyMonitoring // 임시로 더미 데이터 사용

  const getStatusBadge = (type: 'success' | 'failure' | 'pending') => {
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
      default:
        return null
    }
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          결과 모니터링
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{monitoring.successCount}</div>
            <div className="text-xs text-gray-600">성공 발행</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{monitoring.failureCount}</div>
            <div className="text-xs text-gray-600">실패 발행</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{monitoring.successRate}%</div>
            <div className="text-xs text-gray-600">성공률</div>
          </div>
        </div>

        <div className="space-y-3">
          {monitoring.recentLogs.map((log, index) => (
            <div key={log.id} className={`flex justify-between items-center py-3 ${index < monitoring.recentLogs.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex-1">
                <div className="font-medium text-sm">{log.title}</div>
                <div className="text-xs text-gray-600">{log.description}</div>
              </div>
              {getStatusBadge(log.type)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}