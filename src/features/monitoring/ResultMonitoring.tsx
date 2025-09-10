import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePipelineData } from "../pipeline/PipelineStatus"

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
  // 파이프라인 데이터 가져오기
  const pipelineData = usePipelineData()
  
  // 파이프라인 데이터를 기반으로 모니터링 정보 생성
  const getCurrentPipelineStatus = () => {
    try {
      const { progress, currentExecution } = pipelineData || {}
      if (!currentExecution || !progress) return dummyMonitoring
      
      // progress 객체의 안전한 처리
      const stages = Object.values(progress || {}).filter(stage => stage && typeof stage === 'object' && stage.status)
      const completedStages = stages.filter(stage => stage.status === 'completed').length
      const failedStages = stages.filter(stage => stage.status === 'failed').length
      
      return {
      successCount: completedStages,
      failureCount: failedStages,
      successRate: completedStages > 0 ? Math.round((completedStages / (completedStages + failedStages)) * 100) : 0,
      recentLogs: [
        ...(progress?.keyword_extraction?.status === 'completed' ? [{
          id: '1',
          title: '키워드 추출 성공',
          description: `${Array.isArray(pipelineData?.stageResults?.keywordExtraction) ? pipelineData.stageResults.keywordExtraction.length : 0}개 키워드 추출 완료`,
          type: 'success' as 'success' | 'failure' | 'pending',
        }] : progress?.keyword_extraction?.status === 'running' ? [{
          id: '1',
          title: '키워드 추출 진행 중',
          description: `키워드 추출 ${progress.keyword_extraction?.progress || 0}% 진행`,
          type: 'pending' as 'success' | 'failure' | 'pending',
        }] : []),
        ...(progress?.product_crawling?.status === 'completed' ? [{
          id: '2',
          title: '상품 크롤링 성공',
          description: `${Array.isArray(pipelineData?.stageResults?.productCrawling) ? pipelineData.stageResults.productCrawling.length : 0}개 상품 크롤링 완료`,
          type: 'success' as 'success' | 'failure' | 'pending',
        }] : progress?.product_crawling?.status === 'running' ? [{
          id: '2',
          title: '상품 크롤링 진행 중',
          description: `상품 크롤링 ${progress?.product_crawling?.progress || 0}% 진행`,
          type: 'pending' as 'success' | 'failure' | 'pending',
        }] : []),
        ...(progress?.content_generation?.status === 'completed' ? [{
          id: '3',
          title: '콘텐츠 생성 성공',
          description: `블로그 콘텐츠 생성 완료`,
          type: 'success' as 'success' | 'failure' | 'pending',
        }] : progress?.content_generation?.status === 'running' ? [{
          id: '3',
          title: '콘텐츠 생성 진행 중',
          description: `콘텐츠 생성 ${progress?.content_generation?.progress || 0}% 진행`,
          type: 'pending' as 'success' | 'failure' | 'pending',
        }] : []),
        ...(progress?.content_publishing?.status === 'completed' ? [{
          id: '4',
          title: '블로그 발행 성공',
          description: `네이버 블로그 발행 완료`,
          type: 'success' as 'success' | 'failure' | 'pending',
        }] : progress?.content_publishing?.status === 'running' ? [{
          id: '4',
          title: '블로그 발행 진행 중',
          description: `블로그 발행 ${progress?.content_publishing?.progress || 0}% 진행`,
          type: 'pending' as 'success' | 'failure' | 'pending',
        }] : [])
      ].slice(0, 3) // 최대 3개만 표시
    }
    } catch (error) {
      console.error('ResultMonitoring getCurrentPipelineStatus error:', error)
      return dummyMonitoring
    }
  }
  
  const monitoring = pipelineData?.isRunning ? getCurrentPipelineStatus() : dummyMonitoring

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