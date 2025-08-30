import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KeywordExtraction() {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          키워드 추출 현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="flex-1">
              <div className="font-medium text-sm">트렌드 키워드 수집 완료</div>
              <div className="text-xs text-gray-600">상위 50개 키워드 추출 성공</div>
            </div>
            <div className="text-xs text-gray-600">08:00</div>
          </div>

          <div className="flex justify-between items-center py-3">
            <div className="flex-1">
              <div className="font-medium text-sm">선택된 키워드: "겨울 패딩"</div>
              <div className="text-xs text-gray-600">우선순위 1위 키워드 자동 선택</div>
            </div>
            <div className="text-xs text-gray-600">08:01</div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">50</div>
            <div className="text-xs text-gray-600">수집 키워드</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">1</div>
            <div className="text-xs text-gray-600">선택 키워드</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}