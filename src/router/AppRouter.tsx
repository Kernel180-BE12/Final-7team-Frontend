import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { LoginPage, RegisterPage } from "@/features/auth";
import { AdminDashboard } from "@/features/dashboard";

// 보호된 라우트 컴포넌트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  // 개발 중 임시 우회 (나중에 제거)
  const isDevelopment = import.meta.env.DEV;
  
  if (!isAuthenticated && !isDevelopment) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// 인증된 사용자가 접근하면 안 되는 라우트 (로그인, 회원가입)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 인증 페이지들 */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        
        {/* 보호된 페이지들 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* 기본 리다이렉트 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 페이지 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-gray-400 mb-8">페이지를 찾을 수 없습니다.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  홈으로 돌아가기
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}