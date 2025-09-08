import { create } from "zustand";
import type {
  PipelineHistoryItem,
  PipelineStatusResponse,
  PipelineResultResponse,
} from "@/lib/types";

interface PipelineState {
  // 현재 실행 중인 파이프라인들
  activeExecutions: Map<number, PipelineStatusResponse["data"]>;
  
  // 실행 히스토리
  history: PipelineHistoryItem[];
  
  // 선택된 실행의 상세 결과
  selectedResult: PipelineResultResponse["data"] | null;
  
  // UI 상태
  isPolling: boolean;
  selectedExecutionId: number | null;
  
  // 액션들
  setActiveExecution: (executionId: number, data: PipelineStatusResponse["data"]) => void;
  removeActiveExecution: (executionId: number) => void;
  updateExecutionStatus: (executionId: number, data: Partial<PipelineStatusResponse["data"]>) => void;
  
  setHistory: (history: PipelineHistoryItem[]) => void;
  addToHistory: (item: PipelineHistoryItem) => void;
  
  setSelectedResult: (result: PipelineResultResponse["data"] | null) => void;
  setSelectedExecutionId: (id: number | null) => void;
  
  startPolling: () => void;
  stopPolling: () => void;
  
  // 헬퍼 메서드
  getExecutionById: (executionId: number) => PipelineStatusResponse["data"] | undefined;
  getActiveExecutionsList: () => PipelineStatusResponse["data"][];
  isExecutionActive: (executionId: number) => boolean;
  
  // 상태 리셋
  reset: () => void;
}

const initialState = {
  activeExecutions: new Map(),
  history: [],
  selectedResult: null,
  isPolling: false,
  selectedExecutionId: null,
};

export const usePipelineStore = create<PipelineState>((set, get) => ({
  ...initialState,

  // 활성 실행 관리
  setActiveExecution: (executionId, data) =>
    set((state) => {
      const newActiveExecutions = new Map(state.activeExecutions);
      newActiveExecutions.set(executionId, data);
      return { activeExecutions: newActiveExecutions };
    }),

  removeActiveExecution: (executionId) =>
    set((state) => {
      const newActiveExecutions = new Map(state.activeExecutions);
      newActiveExecutions.delete(executionId);
      return { activeExecutions: newActiveExecutions };
    }),

  updateExecutionStatus: (executionId, updates) =>
    set((state) => {
      const newActiveExecutions = new Map(state.activeExecutions);
      const existingExecution = newActiveExecutions.get(executionId);
      
      if (existingExecution) {
        newActiveExecutions.set(executionId, {
          ...existingExecution,
          ...updates,
        });
      }
      
      return { activeExecutions: newActiveExecutions };
    }),

  // 히스토리 관리
  setHistory: (history) => set({ history }),
  
  addToHistory: (item) =>
    set((state) => ({
      history: [item, ...state.history.slice(0, 49)], // 최대 50개 유지
    })),

  // 선택된 결과 관리
  setSelectedResult: (result) => set({ selectedResult: result }),
  
  setSelectedExecutionId: (id) => set({ selectedExecutionId: id }),

  // 폴링 상태 관리
  startPolling: () => set({ isPolling: true }),
  
  stopPolling: () => set({ isPolling: false }),

  // 헬퍼 메서드
  getExecutionById: (executionId) => {
    const { activeExecutions } = get();
    return activeExecutions.get(executionId);
  },

  getActiveExecutionsList: () => {
    const { activeExecutions } = get();
    return Array.from(activeExecutions.values());
  },

  isExecutionActive: (executionId) => {
    const { activeExecutions } = get();
    const execution = activeExecutions.get(executionId);
    return execution?.overallStatus === "running" || execution?.overallStatus === "paused";
  },

  // 상태 리셋
  reset: () => set(initialState),
}));