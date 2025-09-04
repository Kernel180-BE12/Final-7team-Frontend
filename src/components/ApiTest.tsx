import { useState } from "react";
import { dashboardApi } from "@/lib/api";
import { useUiStore } from "@/store/uiStore";

export function ApiTest() {
  // API 응답 데이터는 로컬 상태로 관리 (UI가 아닌 데이터)
  const [response, setResponse] = useState<string>("");
  
  // UI 상태는 중앙 관리
  const { 
    isLoading, 
    errors, 
    setLoading, 
    setError, 
    clearError 
  } = useUiStore();

  const testConnection = async () => {
    setLoading('apiTest', true);
    clearError('apiTest');
    setResponse("");

    try {
      const result = await dashboardApi.testConnection("admin", "테스트 사용자");
      setResponse(result);
      console.log("백엔드 응답:", result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류";
      setError('apiTest', `연결 실패: ${errorMessage}`);
      console.error("API 에러:", err);
    } finally {
      setLoading('apiTest', false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border">
      <h3 className="text-lg font-bold mb-4">백엔드 연결 테스트</h3>

      <button
        onClick={testConnection}
        disabled={isLoading.apiTest}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading.apiTest ? "테스트 중..." : "백엔드 연결 테스트"}
      </button>

      {response && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 font-semibold">✅ 연결 성공!</p>
          <p className="text-sm text-green-600">백엔드 응답: {response}</p>
        </div>
      )}

      {errors.apiTest && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 font-semibold">❌ 연결 실패</p>
          <p className="text-sm text-red-600">{errors.apiTest}</p>
        </div>
      )}
    </div>
  );
}
