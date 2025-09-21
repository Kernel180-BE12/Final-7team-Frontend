import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/uiStore";
import { scheduleApi } from "@/lib/api";
import type { ScheduleRequest } from "@/lib/types";
import { useState, useEffect } from "react";

export default function ScheduleList() {
  // UI 상태 관리
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

  // 스케줄 목록 상태 (scheduleId 포함)
  const [scheduleList, setScheduleList] = useState<(ScheduleRequest & { scheduleId: number })[]>([]);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalCount] = useState(0);
  const pageSize = 5; // 페이지당 표시할 스케줄 수

  // 스케줄 목록 조회 함수
  const fetchScheduleList = async (page: number = currentPage) => {
    try {
      setLoading('schedule', true);
      clearError('schedule');
      clearSuccessMessage('schedule');

      const response = await scheduleApi.getSchedules({
        page,
        limit: pageSize
      });

      if (!response.success) {
        // 백엔드 오류 처리
        setScheduleList([]);
        setError('schedule', `백엔드 오류: ${response.message || '알 수 없는 오류가 발생했습니다.'}`);
        return;
      }

      if (response.data && (response.data as any).content && Array.isArray((response.data as any).content)) {
        // API 응답의 data.content가 배열이므로 각 항목을 변환
        const schedules = (response.data as any).content.map((item: any) => ({
          scheduleId: item.scheduleId,
          scheduleType: item.scheduleType,
          executionTime: item.executionTime?.replace(/"/g, '') || '', // 따옴표 제거
          keywordCount: item.keywordCount || 0,
          contentCount: item.contentCount || 0,
          aiModel: item.aiModel || '알 수 없음'
        }));

        setScheduleList(schedules);

        // 백엔드에서 제공하는 페이징 정보 사용
        setTotalCount((response.data as any).totalElements || 0);
        setTotalPages((response.data as any).totalPages || 1);
        setCurrentPage((response.data as any).currentPage || 1);

        setSuccessMessage('schedule', `${schedules.length}개의 스케줄을 조회했습니다. (${(response.data as any).currentPage}/${(response.data as any).totalPages} 페이지)`);
      } else {
        setScheduleList([]);
        setSuccessMessage('schedule', '등록된 스케줄이 없습니다.');
      }
    } catch (error) {
      console.error("스케줄 조회 에러:", error);
      setError('schedule', "스케줄 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading('schedule', false);
    }
  };

  // 스케줄 삭제 함수
  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm('정말로 이 스케줄을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setLoading('schedule', true);
      clearError('schedule');

      const response = await scheduleApi.deleteSchedule(scheduleId);

      if (response.success) {
        setSuccessMessage('schedule', '스케줄이 성공적으로 삭제되었습니다.');
        // 삭제 후 목록 새로고침
        fetchScheduleList();
      } else {
        setError('schedule', response.message || '스케줄 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error("스케줄 삭제 에러:", error);
      setError('schedule', "스케줄 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading('schedule', false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      fetchScheduleList(page);
    }
  };

  // 컴포넌트 마운트 시 스케줄 목록 조회
  useEffect(() => {
    fetchScheduleList();
  }, []);

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            스케줄 목록
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchScheduleList()}
            disabled={isLoading.schedule}
          >
            {isLoading.schedule ? '새로고침 중...' : '새로고침'}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex-1 overflow-y-auto">
        {/* 메시지 표시 영역 */}
        {successMessages.schedule && (
          <div className="mb-4 p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
            {successMessages.schedule}
          </div>
        )}

        {errors.schedule && (
          <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            {errors.schedule}
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading.schedule && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">스케줄을 불러오는 중...</span>
          </div>
        )}

        {/* 스케줄 목록 */}
        {!isLoading.schedule && scheduleList.length > 0 && (
          <div className="space-y-4">
            {scheduleList.map((scheduleItem) => (
              <div key={scheduleItem.scheduleId} className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">스케줄 #{scheduleItem.scheduleId}</h3>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteSchedule(scheduleItem.scheduleId)}
                    disabled={isLoading.schedule}
                  >
                    삭제
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">실행 주기:</span>
                    <span className="font-medium">{scheduleItem.scheduleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">실행 시간:</span>
                    <span className="font-medium">{scheduleItem.executionTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">키워드 수:</span>
                    <span className="font-medium">{scheduleItem.keywordCount}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">콘텐츠 수:</span>
                    <span className="font-medium">{scheduleItem.contentCount}개</span>
                  </div>
                  <div className="flex justify-between md:col-span-2">
                    <span className="text-gray-600">AI 모델:</span>
                    <span className="font-medium">{scheduleItem.aiModel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading.schedule && scheduleList.length === 0 && !errors.schedule && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">등록된 스케줄이 없습니다</h3>
            <p className="text-gray-500 mb-6">스케줄 관리 페이지에서 새로운 스케줄을 등록해보세요.</p>
            <Button
              onClick={() => window.location.href = '/schedule'}
              variant="outline"
            >
              스케줄 등록하기
            </Button>
          </div>
        )}

        {/* 페이징 */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded text-sm font-medium transition-colors bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded text-sm font-medium transition-colors bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}