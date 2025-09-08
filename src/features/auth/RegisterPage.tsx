import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUiStore } from "@/store/uiStore";
import { authApi } from "@/lib/api";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  
  // 회원가입 폼 데이터
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });

  // UI 상태 관리
  const { isLoading, errors, setLoading, setError, clearError } = useUiStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError("register");
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("register", "모든 필수 항목을 입력해주세요.");
      return false;
    }

    if (formData.username.length < 3) {
      setError("register", "아이디는 3자 이상이어야 합니다.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("register", "올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("register", "비밀번호는 6자 이상이어야 합니다.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("register", "비밀번호가 일치하지 않습니다.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading("register", true);
    clearError("register");

    try {
      // confirmPassword는 API로 전송하지 않음 (클라이언트 검증용)
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      const response = await authApi.register(registerData);
      
      if (response.success) {
        // 회원가입 성공 - 로그인 페이지로 이동
        navigate("/login");
      } else {
        setError("register", response.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError("register", errorMessage);
    } finally {
      setLoading("register", false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* 로고 영역 */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">AI 콘텐츠</h1>
          <p className="text-gray-400 text-sm">자동화 시스템</p>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white text-center mb-6">회원가입</h2>
          
          {/* 에러 메시지 */}
          {errors.register && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
              {errors.register}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 아이디 입력 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                아이디 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                placeholder="아이디를 입력하세요"
                disabled={isLoading.register}
              />
            </div>

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                이메일 <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                placeholder="이메일을 입력하세요"
                disabled={isLoading.register}
              />
            </div>

            {/* 역할 선택 */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                역할
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                disabled={isLoading.register}
              >
                <option value="user">사용자</option>
                <option value="admin">관리자</option>
              </select>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                비밀번호 <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                placeholder="비밀번호를 입력하세요 (6자 이상)"
                disabled={isLoading.register}
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                비밀번호 확인 <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                placeholder="비밀번호를 다시 입력하세요"
                disabled={isLoading.register}
              />
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={isLoading.register}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center text-sm mt-6"
            >
              {isLoading.register ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  가입 처리 중...
                </>
              ) : (
                "회원가입"
              )}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              이미 계정이 있으신가요?{" "}
              <button 
                type="button"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                onClick={() => navigate("/login")}
              >
                로그인
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}