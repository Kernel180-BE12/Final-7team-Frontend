import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/store/appStore"

export default function ProductSearchCrawling() {
  const { productSearch } = useAppStore()

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
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          상품 검색 & 크롤링
        </CardTitle>
      </CardHeader>
      <CardContent>
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