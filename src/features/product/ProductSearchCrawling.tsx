import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePipelineData } from "@/hooks/usePipelineData"


export default function ProductSearchCrawling() {
  // 파이프라인 데이터 가져오기
  const pipelineData = usePipelineData()

  // 실제 파이프라인 데이터 사용
  const productResults = Array.isArray(pipelineData.stageResults.productCrawling)
    ? pipelineData.stageResults.productCrawling
    : []
  const productProgress = pipelineData.progress.product_crawling || { status: 'pending', progress: 0 }

  // 파이프라인이 실행 중이거나 데이터가 있는 경우
  const hasData = pipelineData.isRunning || productResults.length > 0

  const productSearch = hasData ? {
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
  } : null

  const getStatusMessage = () => {
    if (!productSearch) return '대기 중...'
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
        {productSearch ? (
          <>
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
          </>
        ) : (
          // 데이터가 없을 때 대체 화면
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">상품 데이터 없음</h3>
            <p className="text-sm text-gray-500 mb-4">파이프라인을 실행하면 상품 검색 및 크롤링 결과를 확인할 수 있습니다.</p>
            <div className="text-xs text-gray-400">스케줄 관리에서 '즉시 실행' 버튼을 클릭해보세요.</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}