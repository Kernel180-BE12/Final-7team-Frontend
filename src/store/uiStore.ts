import { create } from 'zustand'

// UI 관련 상태 타입
interface UiState {
  // 로딩 상태 관리
  isLoading: {
    sidebar: boolean
    schedule: boolean
    apiTest: boolean
    login: boolean
    register: boolean
    pipeline: boolean
    pipelineHistory: boolean
    pipelineResult: boolean
  }
  
  // 에러 상태 관리
  errors: {
    sidebar: string
    schedule: string
    apiTest: string
    login: string
    register: string
    pipeline: string
    pipelineHistory: string
    pipelineResult: string
  }
  
  // 성공 메시지
  successMessages: {
    schedule: string
    apiTest: string
    login: string
    register: string
    pipeline: string
  }
  
  // 액션들
  setLoading: (key: keyof UiState['isLoading'], loading: boolean) => void
  setError: (key: keyof UiState['errors'], error: string) => void
  clearError: (key: keyof UiState['errors']) => void
  setSuccessMessage: (key: keyof UiState['successMessages'], message: string) => void
  clearSuccessMessage: (key: keyof UiState['successMessages']) => void
  
  // 전체 리셋
  resetUi: () => void
}

const initialState = {
  isLoading: {
    sidebar: false,
    schedule: false,
    apiTest: false,
    login: false,
    register: false,
    pipeline: false,
    pipelineHistory: false,
    pipelineResult: false,
  },
  errors: {
    sidebar: '',
    schedule: '',
    apiTest: '',
    login: '',
    register: '',
    pipeline: '',
    pipelineHistory: '',
    pipelineResult: '',
  },
  successMessages: {
    schedule: '',
    apiTest: '',
    login: '',
    register: '',
    pipeline: '',
  },
}

export const useUiStore = create<UiState>((set) => ({
  ...initialState,

  // 로딩 상태 설정
  setLoading: (key, loading) =>
    set((state) => ({
      isLoading: { ...state.isLoading, [key]: loading },
    })),

  // 에러 설정
  setError: (key, error) =>
    set((state) => ({
      errors: { ...state.errors, [key]: error },
    })),

  // 에러 초기화
  clearError: (key) =>
    set((state) => ({
      errors: { ...state.errors, [key]: '' },
    })),

  // 성공 메시지 설정
  setSuccessMessage: (key, message) =>
    set((state) => ({
      successMessages: { ...state.successMessages, [key]: message },
    })),

  // 성공 메시지 초기화
  clearSuccessMessage: (key) =>
    set((state) => ({
      successMessages: { ...state.successMessages, [key]: '' },
    })),

  // 전체 UI 상태 리셋
  resetUi: () => set(initialState),
}))