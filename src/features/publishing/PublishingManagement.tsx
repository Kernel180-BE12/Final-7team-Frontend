import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { usePipelineData } from "../pipeline/PipelineStatus"

// 임시 더미 데이터 (나중에 monitoringStore나 별도 스토어로 이동 예정)
const dummyPublishing = {
  uploadStatus: 'completed' as 'connected' | 'uploading' | 'completed',
  logs: [
    {
      id: '1',
      title: '네이버 블로그 연결 성공',
      description: '블로그 API 인증 완료',
      status: 'connected' as 'connected' | 'uploading' | 'completed',
    },
    {
      id: '2',
      title: '자동 발행 완료',
      description: '"겨울 패딩" 관련 글 발행 성공',
      status: 'completed' as 'connected' | 'uploading' | 'completed',
    },
  ],
}

export default function PublishingManagement() {
  // 파이프라인 데이터 가져오기
  const pipelineData = usePipelineData()
  
  // 지역 상태로 업로드 상태 관리
  const [uploadStatus, setUploadStatus] = useState(dummyPublishing.uploadStatus)
  
  // 파이프라인에서 발행 데이터가 있으면 사용, 없으면 더미 데이터 사용
  const publishingResult = pipelineData.stageResults.contentPublishing || null
  const publishingProgress = pipelineData.progress.content_publishing || { status: 'pending', progress: 0 }
  
  const publishing = publishingResult ? {
    uploadStatus: publishingProgress.status as 'connected' | 'uploading' | 'completed',
    logs: [
      {
        id: '1',
        title: '네이버 블로그 연결 성공',
        description: '블로그 API 인증 완료',
        status: 'connected' as 'connected' | 'uploading' | 'completed',
      },
      ...(publishingProgress.status === 'completed' ? [{
        id: '2',
        title: '자동 발행 완료',
        description: `블로그 글 발행 성공`,
        status: 'completed' as 'connected' | 'uploading' | 'completed',
      }] : publishingProgress.status === 'running' ? [{
        id: '2',
        title: '자동 발행 진행 중',
        description: `블로그 글 업로드 중...`,
        status: 'uploading' as 'connected' | 'uploading' | 'completed',
      }] : [])
    ],
  } : { ...dummyPublishing, uploadStatus }

  const getStatusBadge = (status: 'connected' | 'uploading' | 'completed') => {
    switch (status) {
      case 'connected':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            연결됨
          </span>
        )
      case 'uploading':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            진행중
          </span>
        )
      case 'completed':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            완료
          </span>
        )
      default:
        return null
    }
  }

  const handleManualPublish = () => {
    setUploadStatus('uploading')
    console.log('수동 발행 실행')
    // 3초 후 완료 상태로 변경 (데모용)
    setTimeout(() => setUploadStatus('completed'), 3000)
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
            <div className="w-6 h-6 bg-white rounded opacity-80"></div>
          </div>
          자동 발행
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {publishing.logs.map((log, index) => (
            <div key={log.id} className={`flex justify-between items-center py-3 ${index < publishing.logs.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex-1">
                <div className="font-medium text-sm">{log.title}</div>
                <div className="text-xs text-gray-600">{log.description}</div>
              </div>
              {getStatusBadge(log.status)}
            </div>
          ))}
        </div>

        <Button 
          className="w-full bg-green-600 text-white hover:bg-green-500 mt-4"
          onClick={handleManualPublish}
          disabled={publishing.uploadStatus === 'uploading'}
        >
          {publishing.uploadStatus === 'uploading' ? '발행 중...' : '수동 발행 실행'}
        </Button>
      </CardContent>
    </Card>
  )
}