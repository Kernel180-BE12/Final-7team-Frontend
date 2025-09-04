import { create } from 'zustand'

// 모니터링 데이터 타입
export interface MonitoringData {
  successCount: number
  failureCount: number
  successRate: number
  recentLogs: Array<{
    id: string
    type: 'success' | 'failure' | 'pending'
    title: string
    description: string
    timestamp?: string
  }>
}

// 모니터링 스토어 상태
interface MonitoringState {
  data: MonitoringData
  
  // 액션들
  updateData: (data: Partial<MonitoringData>) => void
  addLog: (log: MonitoringData['recentLogs'][0]) => void
  clearLogs: () => void
}

export const useMonitoringStore = create<MonitoringState>((set) => ({
  // 초기 데이터 (나중에 API에서 가져올 수 있음)
  data: {
    successCount: 23,
    failureCount: 2,
    successRate: 92,
    recentLogs: [
      {
        id: '1',
        type: 'success',
        title: '발행 완료',
        description: '겨울 패딩 관련 블로그 글 게시 성공',
      },
      {
        id: '2',
        type: 'pending',
        title: '다음 스케줄 대기',
        description: '내일 08:00 자동 실행 예정',
      },
    ],
  },

  // 모니터링 데이터 업데이트
  updateData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),

  // 로그 추가 (최대 10개까지만 유지)
  addLog: (log) =>
    set((state) => ({
      data: {
        ...state.data,
        recentLogs: [log, ...state.data.recentLogs.slice(0, 9)],
      },
    })),

  // 로그 초기화
  clearLogs: () =>
    set((state) => ({
      data: { ...state.data, recentLogs: [] },
    })),
}))