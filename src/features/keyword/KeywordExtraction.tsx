import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePipelineData } from "@/hooks/usePipelineData"

interface KeywordData {
  keyword: string;
  selected?: boolean;
}


// 임시 더미 데이터 (파이프라인 데이터가 없을 때 사용)
const dummyKeywords = {
  collectedKeywords: 50,
  selectedKeywords: 1,
  selectedKeyword: '겨울 패딩',
  keywords: ['겨울 패딩', '패딩 추천', '겨울 코트', '방한용품', '아우터'],
  logs: [
    {
      id: '1',
      title: '트렌드 키워드 수집 완료',
      description: '상위 50개 키워드 추출 성공',
      timestamp: '08:00',
    },
    {
      id: '2',
      title: '선택된 키워드: "겨울 패딩"',
      description: '우선순위 1위 키워드 자동 선택',
      timestamp: '08:01',
    },
  ],
}

export default function KeywordExtraction() {
  // 파이프라인 데이터 가져오기
  const pipelineData = usePipelineData()
  
  // 개발 환경이면 더미 데이터 우선 사용
  const keywordResults: KeywordData[] = import.meta.env.DEV 
    ? [
        { keyword: "겨울 패딩", selected: true },
        { keyword: "방한용품", selected: false },
        { keyword: "아우터", selected: false },
        { keyword: "패딩 추천", selected: false },
        { keyword: "겨울 코트", selected: false }
      ]
    : (Array.isArray(pipelineData.stageResults.keywordExtraction) 
        ? pipelineData.stageResults.keywordExtraction 
        : [])
  
  const keywordProgress = import.meta.env.DEV 
    ? { status: 'completed', progress: 100 }
    : (pipelineData.progress.keyword_extraction || { status: 'pending', progress: 0 })
  
  const keywords = (import.meta.env.DEV || keywordResults.length > 0) ? {
    collectedKeywords: keywordResults.length,
    selectedKeywords: keywordResults.filter((k: KeywordData) => k && k.selected).length || 1,
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
  } : dummyKeywords

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
      </CardContent>
    </Card>
  )
}