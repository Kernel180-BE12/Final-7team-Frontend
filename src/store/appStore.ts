import { create } from 'zustand'
import type { ExecutionCycle } from '@/lib/types'

// 스케줄 설정 타입 (실제 사용 중)
export interface ScheduleSettings {
  executionCycle: ExecutionCycle
  executionTime: string
  keywordCount: number
  publishCount: number
  aiModel: string
}

// 앱의 핵심 상태만 관리 (네비게이션 + 실제 사용 중인 스케줄)
interface AppState {
  // 네비게이션 상태
  activeNav: string
  setActiveNav: (nav: string) => void
  
  // 스케줄 상태 및 액션
  schedule: ScheduleSettings
  updateScheduleSettings: (settings: Partial<ScheduleSettings>) => void
}

export const useAppStore = create<AppState>((set) => ({
  // 초기 상태
  activeNav: '대시보드',
  
  // 스케줄 초기값
  schedule: {
    executionCycle: '매일 실행',
    executionTime: '08:00',
    keywordCount: 50,
    publishCount: 1,
    aiModel: 'GPT-4',
  },

  // 액션 구현
  setActiveNav: (nav) => set({ activeNav: nav }),
  
  updateScheduleSettings: (settings) =>
    set((state) => ({
      schedule: { ...state.schedule, ...settings },
    })),
}))