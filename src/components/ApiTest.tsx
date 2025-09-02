import { useState } from "react";
import apiClient from "@/lib/api";

export function ApiTest() {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const testConnection = async () => {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await apiClient.get("/test");
      setResponse(result.data);
      console.log("백엔드 응답:", result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(`연결 실패: ${errorMessage}`);
      console.error("API 에러:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border">
      <h3 className="text-lg font-bold mb-4">백엔드 연결 테스트</h3>

      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "테스트 중..." : "백엔드 연결 테스트"}
      </button>

      {response && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 font-semibold">✅ 연결 성공!</p>
          <p className="text-sm text-green-600">백엔드 응답: {response}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 font-semibold">❌ 연결 실패</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
