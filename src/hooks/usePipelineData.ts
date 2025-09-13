import { usePipelineStore } from "@/store/pipelineStore";

// 개발 환경용 더미 실행 데이터
const dummyExecution = {
  executionId: 1,
  overallStatus: "running" as const,
  currentStage: "콘텐츠 생성",
  progress: {
    keyword_extraction: { status: "completed" as const, progress: 100 },
    product_crawling: { status: "completed" as const, progress: 100 },
    content_generation: { status: "running" as const, progress: 75 },
    content_publishing: { status: "pending" as const, progress: 0 }
  },
  startedAt: new Date().toISOString(),
  logs: [],
  stageResults: {
    keywordExtraction: [
      { keyword: "겨울 패딩", selected: true },
      { keyword: "방한용품", selected: false },
      { keyword: "아우터", selected: false },
      { keyword: "패딩 추천", selected: false },
      { keyword: "겨울 코트", selected: false }
    ],
    productCrawling: [
      { title: "프리미엄 겨울 패딩", price: "89000원", image: "/dummy-image.jpg" }
    ],
    contentGeneration: {
      title: "추운 겨울 필수템! 베스트 패딩 추천",
      content: "올겨울 따뜻하게 보낼 수 있는 패딩 추천드립니다...",
      tags: ["겨울", "패딩", "아우터"]
    },
    contentPublishing: null
  }
};

// 파이프라인 데이터를 다른 컴포넌트에서 사용할 수 있는 커스텀 훅
export function usePipelineData() {
  const { getActiveExecutionsList } = usePipelineStore();
  const activeExecutions = getActiveExecutionsList();
  
  // 개발 환경에서는 더미 데이터 사용
  if (import.meta.env.DEV) {
    return {
      isRunning: true,
      currentExecution: dummyExecution,
      stageResults: dummyExecution.stageResults,
      progress: dummyExecution.progress
    };
  }
  
  // 가장 최신 실행 중인 파이프라인의 데이터 반환
  const latestExecution = activeExecutions.find(
    execution => execution.overallStatus === "running" || execution.overallStatus === "paused"
  ) || activeExecutions[0];

  return {
    isRunning: activeExecutions.some(execution => 
      execution.overallStatus === "running" || execution.overallStatus === "paused"
    ),
    currentExecution: latestExecution,
    stageResults: latestExecution?.stageResults || {
      keywordExtraction: [],
      productCrawling: [],
      contentGeneration: null,
      contentPublishing: null
    },
    progress: latestExecution?.progress || {
      keyword_extraction: { status: "pending", progress: 0 },
      product_crawling: { status: "pending", progress: 0 },
      content_generation: { status: "pending", progress: 0 },
      content_publishing: { status: "pending", progress: 0 }
    }
  };
}