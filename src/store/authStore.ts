import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  // 상태
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  
  // 액션
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isAuthenticated: false,
      user: null,
      token: null,

      // 로그인 액션
      login: (user: User, token: string) => {
        set({
          isAuthenticated: true,
          user,
          token
        });
      },

      // 로그아웃 액션
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null
        });
      },

      // 사용자 정보 업데이트 액션
      updateUser: (updatedUser: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updatedUser }
          });
        }
      },

      // 토큰 설정 액션
      setToken: (token: string | null) => {
        set({ token });
        
        // 토큰이 없으면 로그아웃 처리
        if (!token) {
          set({
            isAuthenticated: false,
            user: null
          });
        }
      }
    }),
    {
      name: "auth-storage", // localStorage 키 이름
      partialize: (state) => ({
        // 필요한 상태만 localStorage에 저장
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      })
    }
  )
);