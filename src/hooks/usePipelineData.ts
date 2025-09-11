import { usePipelineStore } from "@/store/pipelineStore";

// 파이프라인 데이터를 다른 컴포넌트에서 사용할 수 있는 커스텀 훅
export function usePipelineData() {
  const { getActiveExecutionsList } = usePipelineStore();
  const activeExecutions = getActiveExecutionsList();
  
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