import { create } from 'zustand'

// 스케줄 설정 타입
interface ScheduleSettings {
  executionCycle: '매일 실행' | '주간 실행' | '월간 실행'
  executionTime: string
  keywordCount: number
  publishCount: number
}

// 모니터링 데이터 타입
interface MonitoringData {
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

// 상품 검색 데이터 타입
interface ProductSearchData {
  targetSite: string
  searchResults: number
  progress: number
  status: 'searching' | 'crawling' | 'completed'
  logs: Array<{
    id: string
    title: string
    description: string
    timestamp: string
  }>
}

// 콘텐츠 생성 데이터 타입
interface ContentGenerationData {
  selectedModel: 'OpenAI GPT-4' | 'Google Gemini'
  progress: number
  generatedCharacters: number
  generatedTags: number
  status: 'idle' | 'generating' | 'completed'
  logs: Array<{
    id: string
    title: string
    description: string
    timestamp: string
  }>
}

// 키워드 추출 데이터 타입
interface KeywordData {
  collectedKeywords: number
  selectedKeywords: number
  selectedKeyword: string
  keywords: string[]
  logs: Array<{
    id: string
    title: string
    description: string
    timestamp: string
  }>
}

// 발행 관리 데이터 타입
interface PublishingData {
  naverBlogConnection: 'connected' | 'disconnected' | 'connecting'
  uploadStatus: 'idle' | 'uploading' | 'completed' | 'error'
  logs: Array<{
    id: string
    title: string
    description: string
    status: 'connected' | 'uploading' | 'completed'
  }>
}

// 전체 앱 상태 타입
interface AppState {
  // 네비게이션
  activeNav: string
  
  // 각 기능별 데이터
  schedule: ScheduleSettings
  monitoring: MonitoringData
  productSearch: ProductSearchData
  contentGeneration: ContentGenerationData
  keywords: KeywordData
  publishing: PublishingData

  // 액션들
  setActiveNav: (nav: string) => void
  
  // 스케줄 관련 액션
  updateScheduleSettings: (settings: Partial<ScheduleSettings>) => void
  
  // 모니터링 관련 액션
  updateMonitoringData: (data: Partial<MonitoringData>) => void
  addMonitoringLog: (log: MonitoringData['recentLogs'][0]) => void
  
  // 상품 검색 관련 액션
  updateProductSearchData: (data: Partial<ProductSearchData>) => void
  addProductSearchLog: (log: ProductSearchData['logs'][0]) => void
  
  // 콘텐츠 생성 관련 액션
  updateContentGeneration: (data: Partial<ContentGenerationData>) => void
  addContentGenerationLog: (log: ContentGenerationData['logs'][0]) => void
  
  // 키워드 관련 액션
  updateKeywordData: (data: Partial<KeywordData>) => void
  addKeywordLog: (log: KeywordData['logs'][0]) => void
  setSelectedKeyword: (keyword: string) => void
  
  // 발행 관련 액션
  updatePublishingData: (data: Partial<PublishingData>) => void
  addPublishingLog: (log: PublishingData['logs'][0]) => void
}

export const useAppStore = create<AppState>((set) => ({
  // 초기 상태
  activeNav: '대시보드',
  
  schedule: {
    executionCycle: '매일 실행',
    executionTime: '08:00',
    keywordCount: 50,
    publishCount: 1,
  },
  
  monitoring: {
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
  
  productSearch: {
    targetSite: 'ssadagu.kr',
    searchResults: 15,
    progress: 75,
    status: 'crawling',
    logs: [
      {
        id: '1',
        title: '상품 검색 완료',
        description: '검색 결과 15개 상품 발견',
        timestamp: '08:02',
      },
      {
        id: '2',
        title: '상품 정보 크롤링 중',
        description: '상품명, 가격, 스펙 추출 중...',
        timestamp: '08:03',
      },
    ],
  },
  
  contentGeneration: {
    selectedModel: 'OpenAI GPT-4',
    progress: 60,
    generatedCharacters: 1247,
    generatedTags: 5,
    status: 'generating',
    logs: [
      {
        id: '1',
        title: '콘텐츠 생성 시작',
        description: '상품 정보 기반 블로그 글 작성 중',
        timestamp: '08:04',
      },
    ],
  },
  
  keywords: {
    collectedKeywords: 50,
    selectedKeywords: 1,
    selectedKeyword: '겨울 패딩',
    keywords: ['겨울 패딩', '패딩 추천', '겨울 코트', '방한용품', '아우터'],
    logs: [
      {
        id: '1',
        title: '트렌드 키워드 수집 완료',
        description: '상위 50개 키워드 추출 성공',
        timestamp: '08:00',
      },
      {
        id: '2',
        title: '선택된 키워드: "겨울 패딩"',
        description: '우선순위 1위 키워드 자동 선택',
        timestamp: '08:01',
      },
    ],
  },
  
  publishing: {
    naverBlogConnection: 'connected',
    uploadStatus: 'uploading',
    logs: [
      {
        id: '1',
        title: '네이버 블로그 연동',
        description: 'Naver Blog API 인증 완료',
        status: 'connected',
      },
      {
        id: '2',
        title: '콘텐츠 업로드 중',
        description: '제목, 본문, 태그 자동 게시',
        status: 'uploading',
      },
    ],
  },

  // 액션 구현
  setActiveNav: (nav) => set({ activeNav: nav }),
  
  updateScheduleSettings: (settings) =>
    set((state) => ({
      schedule: { ...state.schedule, ...settings },
    })),
  
  updateMonitoringData: (data) =>
    set((state) => ({
      monitoring: { ...state.monitoring, ...data },
    })),
  
  addMonitoringLog: (log) =>
    set((state) => ({
      monitoring: {
        ...state.monitoring,
        recentLogs: [log, ...state.monitoring.recentLogs.slice(0, 9)],
      },
    })),
  
  updateProductSearchData: (data) =>
    set((state) => ({
      productSearch: { ...state.productSearch, ...data },
    })),
  
  addProductSearchLog: (log) =>
    set((state) => ({
      productSearch: {
        ...state.productSearch,
        logs: [log, ...state.productSearch.logs.slice(0, 9)],
      },
    })),
  
  updateContentGeneration: (data) =>
    set((state) => ({
      contentGeneration: { ...state.contentGeneration, ...data },
    })),
  
  addContentGenerationLog: (log) =>
    set((state) => ({
      contentGeneration: {
        ...state.contentGeneration,
        logs: [log, ...state.contentGeneration.logs.slice(0, 9)],
      },
    })),
  
  updateKeywordData: (data) =>
    set((state) => ({
      keywords: { ...state.keywords, ...data },
    })),
  
  addKeywordLog: (log) =>
    set((state) => ({
      keywords: {
        ...state.keywords,
        logs: [log, ...state.keywords.logs.slice(0, 9)],
      },
    })),
  
  setSelectedKeyword: (keyword) =>
    set((state) => ({
      keywords: { ...state.keywords, selectedKeyword: keyword },
    })),
  
  updatePublishingData: (data) =>
    set((state) => ({
      publishing: { ...state.publishing, ...data },
    })),
  
  addPublishingLog: (log) =>
    set((state) => ({
      publishing: {
        ...state.publishing,
        logs: [log, ...state.publishing.logs.slice(0, 9)],
      },
    })),
}))