import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductSearchCrawling() {
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
          <div className="font-medium">타겟 사이트: ssadagu.kr</div>
          <div className="text-sm text-gray-600">선택된 키워드로 상품 검색 중...</div>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-3">
          <div
            className="progress-fill h-full bg-gray-600 rounded-full transition-all duration-300"
            style={{ width: "75%" }}
          ></div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="flex-1">
              <div className="font-medium text-sm">상품 검색 완료</div>
              <div className="text-xs text-gray-600">검색 결과 15개 상품 발견</div>
            </div>
            <div className="text-xs text-gray-600">08:02</div>
          </div>

          <div className="flex justify-between items-center py-3">
            <div className="flex-1">
              <div className="font-medium text-sm">상품 정보 크롤링 중</div>
              <div className="text-xs text-gray-600">상품명, 가격, 스펙 추출 중...</div>
            </div>
            <div className="text-xs text-gray-600">08:03</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}