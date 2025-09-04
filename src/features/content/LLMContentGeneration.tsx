import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

// 임시 더미 데이터 (나중에 monitoringStore나 별도 스토어로 이동 예정)
const dummyContentGeneration = {
  selectedModel: 'OpenAI GPT-4',
  progress: 75,
  generatedCharacters: 2450,
  generatedTags: 12,
  logs: [
    {
      id: '1',
      title: '블로그 글 작성 시작',
      description: 'GPT-4로 콘텐츠 생성 중...',
      timestamp: '08:04',
    },
    {
      id: '2',
      title: '제목 및 태그 생성 완료',
      description: '12개 태그와 매력적인 제목 생성',
      timestamp: '08:05',
    },
  ],
}

export default function LLMContentGeneration() {
  // 지역 상태로 모델 선택 관리
  const [selectedModel, setSelectedModel] = useState(dummyContentGeneration.selectedModel)
  const contentGeneration = { ...dummyContentGeneration, selectedModel } // 임시로 더미 데이터 사용

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          LLM 콘텐츠 생성
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-800 text-sm">AI 모델 선택</label>
          <select 
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={contentGeneration.selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option>OpenAI GPT-4</option>
            <option>Google Gemini</option>
          </select>
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
      </CardContent>
    </Card>
  )
}