import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobLog {
  log_id: string;
  execution_id: string;
  step_code: string | null;
  source_table: string | null;
  source_id: string | null;
  business_key: string | null;
  log_category: string;
  log_level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  status_code: "SUCCESS" | "FAILURE" | "RUNNING";
  log_message: string;
  created_at: string;
}

interface JobLogFilter {
  executionId: string;
  startDate: string;
  endDate: string;
  status: "all" | "SUCCESS" | "FAILURE" | "RUNNING";
  level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "ALL";
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<JobLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<JobLogFilter>({
    executionId: "",
    startDate: "",
    endDate: "",
    status: "all",
    level: "ALL",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchLogs = () => {
    if (!filter.executionId.trim()) {
      alert("실행 ID를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    // 개발 모드용 샘플 데이터
    if (import.meta.env.DEV) {
      setTimeout(() => {
        // 2001 실행 ID로 고정된 샘플 데이터 (filter.executionId와 관계없이)
        const sampleLogs: JobLog[] = [
          {
            log_id: "10001",
            execution_id: "2001",
            step_code: null,
            source_table: null,
            source_id: null,
            business_key: null,
            log_category: "DAILY_WORKFLOW",
            log_level: "INFO",
            status_code: "SUCCESS",
            log_message: "일일 콘텐츠 생성 워크플로우 시작",
            created_at: "2025-09-13 09:00:00",
          },
          {
            log_id: "10002",
            execution_id: "2001",
            step_code: "F-002",
            source_table: "trend_data",
            source_id: "301",
            business_key: "AI 쇼핑",
            log_category: "BUSINESS",
            log_level: "INFO",
            status_code: "SUCCESS",
            log_message: "키워드 추출 완료: AI 쇼핑 (점수: 95)",
            created_at: "2025-09-13 09:00:30",
          },
          {
            log_id: "10003",
            execution_id: "2001",
            step_code: "F-003",
            source_table: null,
            source_id: null,
            business_key: "AI 쇼핑",
            log_category: "BUSINESS",
            log_level: "INFO",
            status_code: "SUCCESS",
            log_message: "상품 검색 완료: 25개 상품 발견, 1개 선택",
            created_at: "2025-09-13 09:01:00",
          },
          {
            log_id: "10004",
            execution_id: "2001",
            step_code: "F-004",
            source_table: null,
            source_id: null,
            business_key: "AI 쇼핑",
            log_category: "BUSINESS",
            log_level: "INFO",
            status_code: "SUCCESS",
            log_message: "상품 크롤링 완료: 제목 및 상세정보 추출",
            created_at: "2025-09-13 09:01:15",
          },
          {
            log_id: "10005",
            execution_id: "2001",
            step_code: "F-005",
            source_table: "ai_content",
            source_id: "501",
            business_key: "AI 쇼핑",
            log_category: "BUSINESS",
            log_level: "INFO",
            status_code: "SUCCESS",
            log_message: "AI 콘텐츠 생성 완료 (품질점수: 87)",
            created_at: "2025-09-13 09:02:00",
          },
          {
            log_id: "10006",
            execution_id: "2001",
            step_code: "F-006",
            source_table: "publish_log",
            source_id: "701",
            business_key: "AI 쇼핑",
            log_category: "BUSINESS",
            log_level: "INFO",
            status_code: "SUCCESS",
            log_message: "네이버 블로그 발행 완료",
            created_at: "2025-09-13 09:02:30",
          },
          {
            log_id: "10007",
            execution_id: "2001",
            step_code: null,
            source_table: null,
            source_id: null,
            business_key: null,
            log_category: "DAILY_WORKFLOW",
            log_level: "INFO",
            status_code: "SUCCESS",
            log_message: "일일 콘텐츠 생성 워크플로우 완료",
            created_at: "2025-09-13 09:02:35",
          },
        ];
        setLogs(sampleLogs);
        setTotalPages(1);
        setIsLoading(false);
      }, 1000);
    }
  };

  const getLevelColor = (level: JobLog["log_level"]) => {
    switch (level) {
      case "ERROR":
        return "text-red-700 bg-red-50 border-red-200";
      case "WARN":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "INFO":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "DEBUG":
        return "text-gray-700 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getLevelIcon = (level: JobLog["log_level"]) => {
    switch (level) {
      case "ERROR":
        return "❌";
      case "WARN":
        return "⚠️";
      case "INFO":
        return "ℹ️";
      case "DEBUG":
        return "🔍";
      default:
        return "📝";
    }
  };

  const getStatusColor = (status: JobLog["status_code"]) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-700 bg-green-50 border-green-200";
      case "FAILURE":
        return "text-red-700 bg-red-50 border-red-200";
      case "RUNNING":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: JobLog["status_code"]) => {
    switch (status) {
      case "SUCCESS":
        return "✅";
      case "FAILURE":
        return "❌";
      case "RUNNING":
        return "⏳";
      default:
        return "❓";
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter.level !== "ALL" && log.log_level !== filter.level) {
      return false;
    }
    if (filter.status !== "all" && log.status_code !== filter.status) {
      return false;
    }
    if (filter.startDate && log.created_at < filter.startDate) {
      return false;
    }
    if (filter.endDate && log.created_at > filter.endDate) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            작업 로그 조회
          </h1>
          <p className="text-gray-600">
            특정 작업의 상세 로그를 조회하고 필터링합니다
          </p>
        </div>

        {/* 검색 필터 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>로그 조회 조건</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">실행 ID *</label>
                <input
                  type="text"
                  value={filter.executionId}
                  onChange={(e) => setFilter(prev => ({ ...prev, executionId: e.target.value }))}
                  placeholder="예: 2001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">시작일</label>
                <input
                  type="date"
                  value={filter.startDate}
                  onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">종료일</label>
                <input
                  type="date"
                  value={filter.endDate}
                  onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">상태</label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체</option>
                  <option value="SUCCESS">성공</option>
                  <option value="FAILURE">실패</option>
                  <option value="RUNNING">실행중</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">로그 레벨</label>
                <select
                  value={filter.level}
                  onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">전체</option>
                  <option value="DEBUG">DEBUG</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={searchLogs}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "조회 중..." : "조회"}
              </button>
              <button
                onClick={() => {
                  setFilter({
                    executionId: "",
                    startDate: "",
                    endDate: "",
                    status: "all",
                    level: "ALL",
                  });
                  setLogs([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
              >
                초기화
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 로그 결과 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                로그 목록 {logs.length > 0 && `(${filteredLogs.length}/${logs.length}개)`}
              </CardTitle>
              {logs.length > 0 && (
                <div className="text-sm text-gray-500">
                  실행 ID: {filter.executionId}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span>로그를 조회하는 중...</span>
                </div>
              </div>
            ) : filteredLogs.length === 0 && logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>실행 ID를 입력하고 조회 버튼을 클릭하세요.</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>필터 조건에 맞는 로그가 없습니다.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <div key={log.log_id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">
                        {getLevelIcon(log.log_level)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(
                              log.log_level
                            )}`}
                          >
                            {log.log_level}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                              log.status_code
                            )}`}
                          >
                            {getStatusIcon(log.status_code)} {log.status_code === "SUCCESS" ? "성공" : log.status_code === "FAILURE" ? "실패" : "실행중"}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                            {log.log_category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {log.created_at}
                          </span>
                        </div>
                        <p className="text-gray-800 text-sm mb-2 break-words">
                          {log.log_message}
                        </p>
                        {(log.step_code || log.source_table || log.business_key) && (
                          <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {log.step_code && (
                                <div className="flex">
                                  <span className="font-medium min-w-0 flex-shrink-0">단계 코드:</span>
                                  <span className="ml-1 break-all">{log.step_code}</span>
                                </div>
                              )}
                              {log.source_table && (
                                <div className="flex">
                                  <span className="font-medium min-w-0 flex-shrink-0">소스 테이블:</span>
                                  <span className="ml-1 break-all">{log.source_table}</span>
                                </div>
                              )}
                              {log.source_id && (
                                <div className="flex">
                                  <span className="font-medium min-w-0 flex-shrink-0">소스 ID:</span>
                                  <span className="ml-1 break-all">{log.source_id}</span>
                                </div>
                              )}
                              {log.business_key && (
                                <div className="flex">
                                  <span className="font-medium min-w-0 flex-shrink-0">비즈니스 키:</span>
                                  <span className="ml-1 break-all">{log.business_key}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}