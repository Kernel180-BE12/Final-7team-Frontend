// 사이드바 네비게이션 컴포넌트
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/appStore";
import { useUiStore } from "@/store/uiStore";
import { menuApi } from "@/lib/api";
import type { MenuItem } from "@/lib/types";
import { DEFAULT_MENU_ITEMS } from "@/lib/types";

export default function Sidebar() {
  // 앱 상태에서 현재 활성 네비게이션 가져오기
  const { activeNav, setActiveNav } = useAppStore();

  // UI 상태 관리
  const { isLoading, errors, setLoading, setError, clearError } = useUiStore();

  // 메뉴 아이템 로컬 상태 (API 데이터이므로 로컬 관리)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);

  // 컴포넌트 마운트 시 메뉴 데이터 로드
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading("sidebar", true);
        clearError("sidebar");

        const response = await menuApi.getMenuItems("admin"); // 관리자 메뉴 조회

        if (response.success) {
          // 성공 시 API 데이터 사용
          const sortedItems = response.data.sort(
            (a, b) => a.orderSeq - b.orderSeq
          ); // 순서대로 정렬
          setMenuItems(sortedItems.filter((item) => item.isActive)); // 활성화된 메뉴만 필터링
        } else {
          setError(
            "sidebar",
            response.message || "메뉴를 불러오는데 실패했습니다."
          ); // API 실패 에러 처리
          // 실패해도 기본 메뉴는 유지됨 (이미 DEFAULT_MENU_ITEMS로 초기화되어 있음)
        }
      } catch (err) {
        console.error("메뉴 로드 에러:", err);
        setError("sidebar", "네트워크 오류가 발생했습니다."); // 네트워크 에러 처리
        // catch에서도 기본 메뉴는 유지됨
      } finally {
        setLoading("sidebar", false); // 로딩 종료
      }
    };

    fetchMenuItems();
  }, [setLoading, setError, clearError]);

  const handleMenuClick = (item: MenuItem) => {
    setActiveNav(item.label);
    // 대시보드 내에서 컴포넌트 전환만
  };

  return (
    <nav className="w-70 bg-gray-800 p-8 shadow-2xl sticky top-0 h-screen overflow-y-auto">
      {" "}
      {/* 사이드바 네비게이션 - sticky로 고정 */}
      {/* 로고 영역 */}
      <div className="text-center mb-10">
        <h1 className="text-white text-xl font-bold mb-1">AI 콘텐츠</h1>
        <p className="text-gray-400 text-xs">자동화 시스템</p>
      </div>
      {/* 에러 메시지 표시 (기본 메뉴는 계속 표시) */}
      {errors.sidebar && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
          {errors.sidebar} (기본 메뉴 사용 중)
        </div>
      )}
      {/* 메뉴 리스트 */}
      <ul className="space-y-3">
        {menuItems.map(
          (
            item // 동적 메뉴 아이템 렌더링
          ) => (
            <li key={item.id}>
              <button
                onClick={() => handleMenuClick(item)} // 메뉴 클릭 시 활성 상태 변경 및 페이지 이동
                className={`w-full flex items-center px-5 py-4 rounded-xl transition-all duration-300 font-medium ${
                  activeNav === item.label
                    ? "bg-gray-700 text-white transform translate-x-1"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white hover:transform hover:translate-x-1"
                }`}
              >
                {item.icon && ( // 아이콘이 있으면 표시
                  <span className="mr-3">{item.icon}</span>
                )}
                {item.label}
                {isLoading.sidebar &&
                  item === menuItems[0] && ( // 첫 번째 메뉴에만 로딩 표시
                    <span className="ml-auto text-xs">로딩중...</span>
                  )}
              </button>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
