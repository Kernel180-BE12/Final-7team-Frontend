import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import Sidebar from "@/components/layout/Sidebar";
import { ScheduleManagement } from "../schedule";
import { KeywordExtraction } from "../keyword";
import { ProductSearchCrawling } from "../product";
import { LLMContentGeneration } from "../content";
import { PublishingManagement } from "../publishing";
import { ResultMonitoring } from "../monitoring";
import { ApiTest } from "@/components/ApiTest";

export default function AdminDashboard() {
  // 전역 상태에서 현재 활성 네비게이션만 가져오기 (메뉴 로직은 Sidebar 컴포넌트로 이동)
  const { activeNav } = useAppStore();

  useEffect(() => {
    // 진행률 애니메이션
    const timer = setTimeout(() => {
      const progressBars = document.querySelectorAll(".progress-fill"); // 진행률 바 요소들 선택
      progressBars.forEach((bar: Element) => {
        const htmlBar = bar as HTMLElement;
        const width = htmlBar.style.width; // 원래 너비 저장
        htmlBar.style.width = "0%"; // 너비를 0으로 초기화
        setTimeout(() => {
          htmlBar.style.width = width; // 애니메이션으로 원래 너비로 복원
        }, 100);
      });
    }, 1000); // 1초 후 애니메이션 시작

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#FEFEFE" }}> {/* 전체 레이아웃 컨테이너 */}
      <div className="flex min-h-screen"> {/* 사이드바와 메인 콘텐츠를 나란히 배치 */}
        {/* 사이드바 네비게이션 컴포넌트 */}
        <Sidebar />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-8 overflow-y-auto"> {/* 메인 콘텐츠 영역 */}
          {/* 헤더 */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-200"> {/* 대시보드 헤더 */}
            <h2 className="text-gray-800 text-3xl font-bold mb-2">
              AI 콘텐츠 자동화 시스템 대시보드
            </h2>
            <p className="text-gray-600 text-sm">
              ssadagu.kr 상품 기반 네이버 블로그 자동 발행 시스템
            </p>
          </div>

          {/* 백엔드 연결 테스트 */}
          <div className="mb-8"> {/* API 연결 테스트 섹션 */}
            <ApiTest />
          </div>

          {/* 선택된 메뉴에 따른 콘텐츠 표시 */}
          {activeNav === "대시보드" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> {/* 대시보드 기능 카드들 그리드 */}
              <ScheduleManagement />
              <KeywordExtraction />
              <ProductSearchCrawling />
              <LLMContentGeneration />
              <PublishingManagement />
              <ResultMonitoring />
            </div>
          )}
          
          {activeNav === "스케줄 관리" && (
            <div className="max-w-2xl mx-auto"> {/* 스케줄 관리 단독 표시 */}
              <ScheduleManagement />
            </div>
          )}
          
          {activeNav === "키워드 추출" && (
            <div className="max-w-2xl mx-auto"> {/* 키워드 추출 단독 표시 */}
              <KeywordExtraction />
            </div>
          )}
          
          {activeNav === "상품 검색" && (
            <div className="max-w-2xl mx-auto"> {/* 상품 검색 단독 표시 */}
              <ProductSearchCrawling />
            </div>
          )}
          
          {activeNav === "LLM 콘텐츠" && (
            <div className="max-w-2xl mx-auto"> {/* LLM 콘텐츠 단독 표시 */}
              <LLMContentGeneration />
            </div>
          )}
          
          {activeNav === "발행 관리" && (
            <div className="max-w-2xl mx-auto"> {/* 발행 관리 단독 표시 */}
              <PublishingManagement />
            </div>
          )}
          
          {activeNav === "결과 모니터링" && (
            <div className="max-w-2xl mx-auto"> {/* 결과 모니터링 단독 표시 */}
              <ResultMonitoring />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
