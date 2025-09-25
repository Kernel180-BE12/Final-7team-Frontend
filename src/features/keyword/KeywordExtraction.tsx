import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePipelineData } from "@/hooks/usePipelineData"

interface KeywordData {
  keyword: string;
  selected?: boolean;
}



export default function KeywordExtraction() {
  // 파이프라인 데이터 가져오기
  const pipelineData = usePipelineData()

  // 실제 파이프라인 데이터 사용
  const keywordResults: KeywordData[] = Array.isArray(pipelineData.stageResults.keywordExtraction)
    ? pipelineData.stageResults.keywordExtraction.map(item => ({
        keyword: item.keyword,
        selected: item.relevanceScore > 0.8 // 점수가 높은 것을 선택된 것으로 표시
      }))
    : []

  const keywordProgress = pipelineData.progress.keyword_extraction || { status: 'pending', progress: 0 }

  // 파이프라인이 실행 중이거나 데이터가 있는 경우
  const hasData = pipelineData.isRunning || keywordResults.length > 0

  const keywords = hasData ? {
    collectedKeywords: keywordResults.length,
    selectedKeywords: keywordResults.filter((k: KeywordData) => k && k.selected).length || (keywordResults.length > 0 ? 1 : 0),
    selectedKeyword: keywordResults.find((k: KeywordData) => k && k.selected)?.keyword || keywordResults[0]?.keyword || '키워드 없음',
    keywords: keywordResults.map((k: KeywordData) => k && k.keyword).filter(Boolean) || [],
    logs: [
      {
        id: '1',
        title: `키워드 수집 ${keywordProgress.status === 'completed' ? '완료' : keywordProgress.status === 'running' ? '진행 중' : '대기 중'}`,
        description: `${keywordResults.length}개 키워드 추출 ${keywordProgress.status === 'completed' ? '성공' : keywordProgress.status === 'running' ? '진행 중' : '대기 중'}`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      ...(keywordProgress.status === 'completed' && keywordResults.length > 0 ? [{
        id: '2',
        title: `선택된 키워드: "${keywordResults.find((k: KeywordData) => k.selected)?.keyword || keywordResults[0]?.keyword}"`,
        description: '우선순위 1위 키워드 자동 선택',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      }] : [])
    ],
  } : null

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          키워드 추출 현황
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1 overflow-y-auto">
        {keywords ? (
          <>
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

            {/* 진행률 표시 */}
            {pipelineData.isRunning && keywordProgress.status === 'running' && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>키워드 추출 진행률</span>
                  <span>{keywordProgress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${keywordProgress.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

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
          </>
        ) : (
          // 데이터가 없을 때 대체 화면
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">키워드 데이터 없음</h3>
            <p className="text-sm text-gray-500 mb-4">파이프라인을 실행하면 키워드 추출 결과를 확인할 수 있습니다.</p>
            <div className="text-xs text-gray-400">스케줄 관리에서 '즉시 실행' 버튼을 클릭해보세요.</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}