import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePipelineData } from "@/hooks/usePipelineData"
import { useAppStore } from "@/store/appStore"

// 임시 더미 데이터 (나중에 monitoringStore나 별도 스토어로 이동 예정)
const dummyContentGeneration = {
  selectedModel: 'OpenAI GPT-4',
  progress: 100,
  generatedCharacters: 2850,
  generatedTags: 8,
  generatedContent: {
    title: "2024년 겨울 필수템! 따뜻하고 스타일리시한 패딩 추천 BEST 5",
    content: `안녕하세요! 추운 겨울이 다가오면서 가장 중요한 것은 바로 따뜻한 아우터인데요. 오늘은 올겨울 꼭 필요한 패딩 추천을 해드리려고 합니다.

**1. 프리미엄 다운 패딩**
최고급 거위털을 사용한 프리미엄 패딩으로 뛰어난 보온성을 자랑합니다. 세련된 디자인으로 일상복으로도 완벽하며, 물세탁이 가능해 관리가 편리합니다.

**2. 울트라라이트 패딩**
가벼움과 따뜻함을 동시에 잡은 혁신적인 제품입니다. 압축팩 구성으로 휴대가 간편하며, 아웃도어 활동시에도 활용도가 높습니다.

**3. 롱패딩**
무릎까지 오는 길이로 하체까지 완벽하게 보온해주는 제품입니다. 시크한 컬러와 슬림한 실루엣으로 스타일링하기 좋습니다.

이번 겨울, 따뜻하고 스타일리시하게 보내세요! 패딩 선택에 도움이 되시길 바랍니다.`,
    tags: ["겨울패딩", "아우터", "다운패딩", "보온", "겨울준비", "패션", "스타일", "방한용품"],
    wordCount: 2850,
    summary: "겨울철 필수 아이템인 패딩 3종류를 소개하고 각각의 특징과 장점을 상세히 설명한 블로그 포스트"
  },
  logs: [
    {
      id: '1',
      title: '키워드 분석 및 콘텐츠 구조 생성',
      description: '겨울 패딩 관련 키워드를 분석하고 글 구조를 설계했습니다',
      timestamp: '08:04',
    },
    {
      id: '2',
      title: '제목 및 소제목 생성 완료',
      description: 'SEO 최적화된 제목과 흥미로운 소제목들을 생성했습니다',
      timestamp: '08:05',
    },
    {
      id: '3',
      title: '본문 콘텐츠 작성 완료',
      description: '2,850자 분량의 고품질 블로그 콘텐츠를 완성했습니다',
      timestamp: '08:06',
    },
    {
      id: '4',
      title: '태그 및 요약 생성 완료',
      description: '8개의 관련 태그와 콘텐츠 요약을 생성했습니다',
      timestamp: '08:07',
    },
  ],
}

interface LLMContentGenerationProps {
  compact?: boolean; // 대시보드용 컴팩트 모드
}

export default function LLMContentGeneration({ compact = false }: LLMContentGenerationProps) {
  // 파이프라인 데이터 가져오기
  const pipelineData = usePipelineData()
  
  // 스케줄에서 설정된 AI 모델 가져오기
  const { schedule } = useAppStore()
  const selectedModel = schedule.aiModel
  
  // 파이프라인에서 콘텐츠 생성 데이터가 있으면 사용, 개발 환경이거나 데이터가 없으면 더미 데이터 사용
  const contentResult = pipelineData.stageResults.contentGeneration || null
  const contentProgress = pipelineData.progress.content_generation || { status: 'pending', progress: 0 }
  
  // 개발 환경이거나 데이터가 없으면 더미 데이터 사용
  let contentGeneration;
  if (import.meta.env.DEV || !contentResult) {
    contentGeneration = { ...dummyContentGeneration, selectedModel };
  } else {
    contentGeneration = {
      selectedModel,
      progress: contentProgress.progress,
      generatedCharacters: contentResult.contents?.[0]?.wordCount || 0,
      generatedTags: contentResult.contents?.length || 0,
      logs: [
        {
          id: '1',
          title: `블로그 글 작성 ${contentProgress.status === 'completed' ? '완료' : contentProgress.status === 'running' ? '진행 중' : '대기 중'}`,
          description: `${selectedModel}로 콘텐츠 생성 ${contentProgress.status === 'completed' ? '완료' : '중...'}`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        },
        ...(contentProgress.status === 'completed' && contentResult ? [{
          id: '2',
          title: '제목 및 태그 생성 완료',
          description: `${contentResult.contents?.length || 0}개 콘텐츠와 매력적인 제목 생성`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        }] : [])
      ],
    };
  }


  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          LLM 콘텐츠 생성
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1 overflow-y-auto">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <label className="block mb-1 font-semibold text-gray-800 text-sm">현재 사용 중인 AI 모델</label>
          <div className="text-lg font-medium text-gray-700">{contentGeneration.selectedModel}</div>
          <div className="text-xs text-gray-500 mt-1">※ 모델 변경은 스케줄 관리에서 가능합니다</div>
        </div>

        {contentGeneration.logs.map((log, index) => (
          <div key={log.id} className={`flex justify-between items-center py-3 mb-3 ${index < contentGeneration.logs.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="flex-1">
              <div className="font-medium text-sm">{log.title}</div>
              <div className="text-xs text-gray-600">{log.description}</div>
            </div>
            <div className="text-xs text-gray-600">{log.timestamp}</div>
          </div>
        ))}

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-3">
          <div
            className="progress-fill h-full bg-gray-600 rounded-full transition-all duration-300"
            style={{ width: `${contentGeneration.progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{contentGeneration.generatedCharacters.toLocaleString()}</div>
            <div className="text-xs text-gray-600">생성 글자 수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{contentGeneration.generatedTags}</div>
            <div className="text-xs text-gray-600">생성 태그 수</div>
          </div>
        </div>

        {/* 생성된 콘텐츠 결과 표시 */}
        {contentGeneration.progress === 100 && contentGeneration.generatedContent && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 생성된 콘텐츠</h3>
            
            {compact ? (
              /* 대시보드용 컴팩트 모드 */
              <div className="space-y-3">
                {/* 제목 미리보기 */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <label className="block text-xs font-semibold text-blue-800 mb-1">제목</label>
                  <h4 className="text-sm font-medium text-blue-900 line-clamp-2">{contentGeneration.generatedContent.title}</h4>
                </div>

                {/* 요약 */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-800 mb-1">요약</label>
                  <p className="text-xs text-gray-700 line-clamp-2">{contentGeneration.generatedContent.summary}</p>
                </div>

                {/* 태그 미리보기 */}
                <div className="flex flex-wrap gap-1">
                  {contentGeneration.generatedContent.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                  {contentGeneration.generatedContent.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                      +{contentGeneration.generatedContent.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* 전체 보기 버튼 */}
                <button 
                  onClick={() => {
                    const { setActiveNav } = useAppStore.getState();
                    setActiveNav("LLM 콘텐츠");
                  }}
                  className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  전체 내용 보기 →
                </button>
              </div>
            ) : (
              /* 개별 탭용 전체 모드 */
              <>
                {/* 제목 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">제목</label>
                  <h4 className="text-lg font-medium text-blue-900">{contentGeneration.generatedContent.title}</h4>
                </div>

                {/* 태그 */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-green-800 mb-2">태그</label>
                  <div className="flex flex-wrap gap-2">
                    {contentGeneration.generatedContent.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 본문 미리보기 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">본문 미리보기</label>
                  <div className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-line">
                    {contentGeneration.generatedContent.content}
                  </div>
                </div>

                {/* 요약 */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-yellow-800 mb-2">콘텐츠 요약</label>
                  <p className="text-sm text-yellow-900">{contentGeneration.generatedContent.summary}</p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    전체 내용 보기
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                    내용 편집
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}