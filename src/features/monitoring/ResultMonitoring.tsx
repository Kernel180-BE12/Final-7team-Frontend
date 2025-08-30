import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResultMonitoring() {
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
            <div className="text-2xl font-bold text-gray-700">23</div>
            <div className="text-xs text-gray-600">성공 발행</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">2</div>
            <div className="text-xs text-gray-600">실패 발행</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">92%</div>
            <div className="text-xs text-gray-600">성공률</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="flex-1">
              <div className="font-medium text-sm">발행 완료</div>
              <div className="text-xs text-gray-600">겨울 패딩 관련 블로그 글 게시 성공</div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">성공</span>
          </div>

          <div className="flex justify-between items-center py-3">
            <div className="flex-1">
              <div className="font-medium text-sm">다음 스케줄 대기</div>
              <div className="text-xs text-gray-600">내일 08:00 자동 실행 예정</div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
              대기중
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}