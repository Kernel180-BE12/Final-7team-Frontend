import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/appStore"

export default function ScheduleManagement() {
  const { schedule, updateScheduleSettings } = useAppStore()

  const handleScheduleSubmit = () => {
    // 스케줄 등록 로직
    console.log('스케줄 등록:', schedule)
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          스케줄 관리
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-800 text-sm">실행 주기</label>
          <select 
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={schedule.executionCycle}
            onChange={(e) => updateScheduleSettings({ executionCycle: e.target.value as any })}
          >
            <option>매일 실행</option>
            <option>주간 실행</option>
            <option>월간 실행</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-800 text-sm">실행 시간</label>
          <input
            type="time"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={schedule.executionTime}
            onChange={(e) => updateScheduleSettings({ executionTime: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-800 text-sm">키워드 추출 개수</label>
          <input
            type="number"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={schedule.keywordCount}
            onChange={(e) => updateScheduleSettings({ keywordCount: parseInt(e.target.value) })}
            placeholder="트렌드 키워드 개수"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-800 text-sm">발행 개수</label>
          <input
            type="number"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={schedule.publishCount}
            onChange={(e) => updateScheduleSettings({ publishCount: parseInt(e.target.value) })}
            placeholder="생성할 콘텐츠 수"
          />
        </div>

        <Button 
          className="w-full bg-gray-700 text-white hover:bg-gray-600"
          onClick={handleScheduleSubmit}
        >
          스케줄 등록
        </Button>
      </CardContent>
    </Card>
  )
}