import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/store/appStore"

export default function KeywordExtraction() {
  const { keywords } = useAppStore()

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
          {keywords.logs.map((log, index) => (
            <div key={log.id} className={`flex justify-between items-center py-3 ${index < keywords.logs.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex-1">
                <div className="font-medium text-sm">{log.title}</div>
                <div className="text-xs text-gray-600">{log.description}</div>
              </div>
              <div className="text-xs text-gray-600">{log.timestamp}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{keywords.collectedKeywords}</div>
            <div className="text-xs text-gray-600">수집 키워드</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{keywords.selectedKeywords}</div>
            <div className="text-xs text-gray-600">선택 키워드</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}