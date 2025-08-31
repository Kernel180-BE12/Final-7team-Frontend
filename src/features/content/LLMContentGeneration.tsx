import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/store/appStore"

export default function LLMContentGeneration() {
  const { contentGeneration, updateContentGeneration } = useAppStore()

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
            onChange={(e) => updateContentGeneration({ selectedModel: e.target.value as any })}
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