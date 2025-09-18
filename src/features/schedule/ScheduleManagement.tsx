// UI 컴포넌트 및 타입 import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { useUiStore } from "@/store/uiStore";
import { usePipelineStore } from "@/store/pipelineStore";
import { scheduleApi, pipelineApi } from "@/lib/api";
import type { ScheduleType } from "@/lib/types";
import { SCHEDULE_TYPE_OPTIONS } from "@/lib/types";

export default function ScheduleManagement() {
  // 앱 상태에서 스케줄 관련 데이터와 업데이트 함수 가져오기
  const { schedule, updateScheduleSettings } = useAppStore();

  // UI 상태 관리 (로딩, 에러, 성공 메시지)
  const {
    isLoading,
    errors,
    successMessages,
    setLoading,
    setError,
    clearError,
    setSuccessMessage,
    clearSuccessMessage
  } = useUiStore();

  // 파이프라인 상태 관리
  const { setActiveExecution } = usePipelineStore();

  // 입력값 검증 함수
  const validateForm = (): string | null => {
    if (!schedule.executionTime) {
      return "실행 시간을 설정해주세요.";
    }
    if (schedule.keywordCount <= 0 || schedule.keywordCount > 1000) {
      return "키워드 추출 개수는 1~1000 사이여야 합니다.";
    }
    if (schedule.contentCount <= 0 || schedule.contentCount > 100) {
      return "콘텐츠 개수는 1~100 사이여야 합니다.";
    }
    return null; // 검증 통과
  };

  // 스케줄 등록 버튼 클릭 핸들러
  const handleScheduleSubmit = async () => {
    try {
      setLoading('schedule', true); // 제출 시작
      clearError('schedule'); // 기존 에러 초기화
      clearSuccessMessage('schedule'); // 기존 성공 메시지 초기화

      // 입력값 검증
      const validationError = validateForm();
      if (validationError) {
        setError('schedule', validationError);
        return;
      }

      // API 호출로 스케줄 등록
      const response = await scheduleApi.createSchedule(schedule as any);

      if (response.success) {
        setSuccessMessage('schedule', response.message || "스케줄이 성공적으로 등록되었습니다.");
      } else {
        setError('schedule', response.message || "스케줄 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("스케줄 등록 에러:", error);
      setError('schedule', "네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading('schedule', false); // 제출 완료
    }
  };

  // 파이프라인 즉시 실행 핸들러
  const handleImmediateExecution = async () => {
    try {
      setLoading('pipeline', true);
      clearError('pipeline');
      clearSuccessMessage('pipeline');

      // 입력값 검증 - 즉시 실행을 위한 기본값 설정
      const validationError = validateForm();
      if (validationError) {
        setError('schedule', validationError);
        return;
      }

      // 파이프라인 실행 요청
      const executeResponse = await pipelineApi.execute({
        keywordCount: schedule.keywordCount,
        contentCount: schedule.contentCount,
        aiModel: (schedule as any).aiModel,
        executeImmediately: true
      });

      if (executeResponse.success && executeResponse.data) {
        // 실행된 파이프라인을 활성 실행 목록에 추가
        setActiveExecution(executeResponse.data.executionId, {
          executionId: executeResponse.data.executionId,
          overallStatus: "running",
          currentStage: "키워드 추출",
          progress: {
            keyword_extraction: { status: "running", progress: 0 },
            product_crawling: { status: "pending", progress: 0 },
            content_generation: { status: "pending", progress: 0 },
            content_publishing: { status: "pending", progress: 0 }
          },
          startedAt: new Date().toISOString(),
          logs: []
        });

        setSuccessMessage('pipeline', `파이프라인 실행이 시작되었습니다. (실행 ID: ${executeResponse.data.executionId})`);
      } else {
        setError('pipeline', executeResponse.message || "파이프라인 실행에 실패했습니다.");
      }
    } catch (error) {
      console.error("파이프라인 즉시 실행 에러:", error);
      setError('pipeline', "네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading('pipeline', false);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      {" "}
      {/* 호버 시 그림자 및 이동 효과가 있는 카드 */}
      <CardHeader>
        <CardTitle className="flex items-center">
          {/* 스케줄 아이콘 */}
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          스케줄 관리
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4 flex-1 overflow-y-auto">
        {" "}
        {/* 카드 내용 영역, 각 필드 간 간격 */}

        {/* 실행 주기 선택 필드 */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 text-sm">
            실행 주기
          </label>
          <select
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={schedule.scheduleType}
            onChange={(e) =>
              updateScheduleSettings({
                scheduleType: e.target.value as ScheduleType,
              })
            } // 실행 주기 변경 시 상태 업데이트
          >
            {SCHEDULE_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {/* 실행 시간 설정 필드 */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 text-sm">
            실행 시간
          </label>
          <input
            type="time"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={schedule.executionTime}
            onChange={(e) =>
              updateScheduleSettings({ executionTime: e.target.value })
            } // 실행 시간 변경 시 상태 업데이트
          />
        </div>
        {/* 키워드 추출 개수 설정 필드 */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 text-sm">
            키워드 추출 개수
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={schedule.keywordCount}
            onChange={(e) =>
              updateScheduleSettings({
                keywordCount: parseInt(e.target.value) || 0,
              })
            } // 숫자로 변환하여 상태 업데이트 (빈 값일 때 0)
            placeholder="트렌드 키워드 개수 (1-1000)"
          />
        </div>
        {/* 발행 개수 설정 필드 */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 text-sm">
            콘텐츠 개수
          </label>
          <input
            type="number"
            min="1"
            max="100"
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={schedule.contentCount}
            onChange={(e) =>
              updateScheduleSettings({
                contentCount: parseInt(e.target.value) || 0,
              })
            } // 숫자로 변환하여 상태 업데이트 (빈 값일 때 0)
            placeholder="생성할 콘텐츠 수 (1-100)"
          />
        </div>
        
        {/* AI 모델 선택 필드 */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 text-sm">
            AI 모델 선택
          </label>
          <select 
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
            value={(schedule as any).aiModel}
            onChange={(e) =>
              updateScheduleSettings({
                aiModel: e.target.value,
              } as any)
            }
          >
            <option value="OpenAI GPT-4">OpenAI GPT-4</option>
            <option value="Google Gemini">Google Gemini</option>
            <option value="Claude 3.5">Claude 3.5</option>
          </select>
        </div>
        
        {/* 메시지 표시 영역 */}
        {successMessages.schedule && (
          <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
            {successMessages.schedule}
          </div>
        )}
        
        {successMessages.pipeline && (
          <div className="p-3 rounded-lg text-sm bg-blue-50 text-blue-700 border border-blue-200">
            {successMessages.pipeline}
          </div>
        )}
        
        {errors.schedule && (
          <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            {errors.schedule}
          </div>
        )}

        {errors.pipeline && (
          <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            {errors.pipeline}
          </div>
        )}

        
        {/* 버튼 그룹 */}
        <div className="space-y-3">
          {/* 즉시 실행 버튼 */}
          <Button
            className="w-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleImmediateExecution}
            disabled={isLoading.pipeline || isLoading.schedule}
          >
            {isLoading.pipeline ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                실행 중...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                즉시 실행
              </div>
            )}
          </Button>
          
          {/* 스케줄 등록 버튼 */}
          <Button
            className="w-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleScheduleSubmit} // 등록 버튼 클릭 시 핸들러 호출
            disabled={isLoading.schedule} // 제출 중일 때 버튼 비활성화
          >
            {isLoading.schedule ? "등록 중..." : "스케줄 등록"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
