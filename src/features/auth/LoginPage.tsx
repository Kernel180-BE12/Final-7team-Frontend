import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  
  // 로그인 폼 데이터
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  // UI 상태 관리
  const { isLoading, errors, setLoading, setError, clearError } = useUiStore();
  
  // 인증 상태 관리
  const { login } = useAuthStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError("login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("login", "아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading("login", true);
    clearError("login");

    try {
      const response = await authApi.login(formData);
      
      if (response.success && response.data?.user && response.data?.token) {
        // 로그인 성공
        login(response.data.user, response.data.token);
        navigate("/dashboard");
      } else {
        setError("login", response.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError("login", errorMessage);
    } finally {
      setLoading("login", false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI 콘텐츠</h1>
          <p className="text-gray-400">자동화 시스템</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">로그인</h2>
          
          {/* 에러 메시지 */}
          {errors.login && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
              {errors.login}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 입력 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                아이디
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="아이디를 입력하세요"
                disabled={isLoading.login}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading.login}
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading.login}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading.login ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </>
              ) : (
                "로그인"
              )}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              계정이 없으신가요?{" "}
              <button 
                type="button"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                onClick={() => navigate("/register")}
              >
                회원가입
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}