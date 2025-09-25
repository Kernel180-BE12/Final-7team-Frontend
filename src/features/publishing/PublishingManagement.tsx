import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePipelineData } from "@/hooks/usePipelineData";


export default function PublishingManagement() {
  // 파이프라인 데이터 가져오기
  const pipelineData = usePipelineData();

  // 지역 상태로 업로드 상태 관리
  const [uploadStatus, setUploadStatus] = useState<"connected" | "uploading" | "completed">(
    "connected"
  );

  // 실제 파이프라인 데이터 사용
  const publishingProgress = pipelineData.progress.content_publishing || { status: "pending", progress: 0 }
  const publishingResult = pipelineData.stageResults.contentPublishing

  // 파이프라인이 실행 중이거나 데이터가 있는 경우
  const hasData = pipelineData.isRunning || publishingResult !== null

  const mapPipelineStatus = (
    status: string
  ): "connected" | "uploading" | "completed" => {
    switch (status) {
      case "running":
        return "uploading";
      case "completed":
        return "completed";
      default:
        return "connected";
    }
  };

  const publishing = hasData ? {
    uploadStatus: mapPipelineStatus(publishingProgress.status),
    logs: [
      {
        id: "1",
        title: "네이버 블로그 연결 성공",
        description: "블로그 API 인증 완료",
        status: "connected" as "connected" | "uploading" | "completed",
      },
      ...(publishingProgress.status === "completed" && publishingResult
        ? [
            {
              id: "2",
              title: "자동 발행 완료",
              description: `${publishingResult.publications?.length || 0}개 글 발행 성공`,
              status: "completed" as "connected" | "uploading" | "completed",
            },
          ]
        : publishingProgress.status === "running"
        ? [
            {
              id: "2",
              title: "자동 발행 진행 중",
              description: `블로그 글 업로드 중... (${publishingProgress.progress}%)`,
              status: "uploading" as "connected" | "uploading" | "completed",
            },
          ]
        : []),
    ],
  } : null

  const getStatusBadge = (status: "connected" | "uploading" | "completed") => {
    switch (status) {
      case "connected":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            연결됨
          </span>
        );
      case "uploading":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            진행중
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            완료
          </span>
        );
      default:
        return null;
    }
  };

  const handleManualPublish = () => {
    setUploadStatus("uploading");
    // 3초 후 완료 상태로 변경 (데모용)
    setTimeout(() => setUploadStatus("completed"), 3000);
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          자동 발행
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1 overflow-y-auto">
        {publishing ? (
          <>
            <div className="space-y-3">
              {publishing.logs.map((log, index) => (
                <div
                  key={log.id}
                  className={`flex justify-between items-center py-3 ${
                    index < publishing.logs.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{log.title}</div>
                    <div className="text-xs text-gray-600">{log.description}</div>
                  </div>
                  {getStatusBadge(log.status)}
                </div>
              ))}
            </div>

            {/* 진행률 표시 */}
            {pipelineData.isRunning && publishingProgress.status === 'running' && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>발행 진행률</span>
                  <span>{publishingProgress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${publishingProgress.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-green-600 text-white hover:bg-green-500 mt-4"
              onClick={handleManualPublish}
              disabled={uploadStatus === "uploading"}
            >
              {uploadStatus === "uploading"
                ? "발행 중..."
                : "수동 발행 실행"}
            </Button>
          </>
        ) : (
          // 데이터가 없을 때 대체 화면
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">발행 데이터 없음</h3>
            <p className="text-sm text-gray-500 mb-4">파이프라인을 실행하면 자동 발행 결과를 확인할 수 있습니다.</p>
            <Button
              className="bg-green-600 text-white hover:bg-green-500"
              onClick={handleManualPublish}
              disabled={uploadStatus === "uploading"}
            >
              {uploadStatus === "uploading"
                ? "발행 중..."
                : "수동 발행 실행"}
            </Button>
            <div className="text-xs text-gray-400 mt-3">스케줄 관리에서 '즉시 실행' 버튼을 클릭해보세요.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
