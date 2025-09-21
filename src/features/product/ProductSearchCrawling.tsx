import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePipelineData } from "@/hooks/usePipelineData"

// 임시 더미 데이터 (나중에 monitoringStore나 별도 스토어로 이동 예정)
const dummyProductSearch = {
  status: 'completed' as 'searching' | 'crawling' | 'completed',
  targetSite: 'ssadagu.kr',
  progress: 100,
  logs: [
    {
      id: '1',
      title: '"겨울 패딩" 키워드 검색 완료',
      description: '총 25개 상품 검색됨',
      timestamp: '08:02',
    },
    {
      id: '2', 
      title: '상품 정보 크롤링 진행중',
      description: '15/25 상품 크롤링 완료',
      timestamp: '08:03',
    },
  ],
}

export default function ProductSearchCrawling() {
  // 파이프라인 데이터 가져오기
  const pipelineData = usePipelineData()
  
  
  // 파이프라인에서 상품 크롤링 데이터가 있으면 사용, 없으면 더미 데이터 사용
  const productResults = Array.isArray(pipelineData.stageResults.productCrawling) 
    ? pipelineData.stageResults.productCrawling 
    : []
  const productProgress = pipelineData.progress.product_crawling || { status: 'pending', progress: 0 }
  
  const productSearch = pipelineData.isRunning ? {
    status: productProgress.status as 'searching' | 'crawling' | 'completed',
    targetSite: 'ssadagu.kr',
    progress: productProgress.progress,
    logs: [
      {
        id: '1',
        title: `상품 검색 ${productProgress.status === 'completed' ? '완료' : productProgress.status === 'running' ? '진행 중' : '대기 중'}`,
        description: `총 ${productResults.length}개 상품 검색됨`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      ...(productProgress.status === 'completed' && productResults.length > 0 ? [{
        id: '2',
        title: '상품 정보 크롤링 완료',
        description: `${productResults.length}개 상품 크롤링 완료`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      }] : [])
    ],
  } : dummyProductSearch

  const getStatusMessage = () => {
    switch (productSearch.status) {
      case 'searching':
        return '선택된 키워드로 상품 검색 중...'
      case 'crawling':
        return '상품 정보 크롤링 중...'
      case 'completed':
        return '상품 검색 및 크롤링 완료'
      default:
        return '대기 중...'
    }
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          상품 검색 & 크롤링
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1 overflow-y-auto">
        <div className="mb-4">
          <div className="font-medium">타겟 사이트: {productSearch.targetSite}</div>
          <div className="text-sm text-gray-600">{getStatusMessage()}</div>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-3">
          <div
            className="progress-fill h-full bg-gray-600 rounded-full transition-all duration-300"
            style={{ width: `${productSearch.progress}%` }}
          ></div>
        </div>

        <div className="space-y-3">
          {productSearch.logs.map((log, index) => (
            <div key={log.id} className={`flex justify-between items-center py-3 ${index < productSearch.logs.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex-1">
                <div className="font-medium text-sm">{log.title}</div>
                <div className="text-xs text-gray-600">{log.description}</div>
              </div>
              <div className="text-xs text-gray-600">{log.timestamp}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}