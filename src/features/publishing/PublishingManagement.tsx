import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/appStore"

export default function PublishingManagement() {
  const { publishing, updatePublishingData } = useAppStore()

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
    updatePublishingData({ uploadStatus: 'uploading' })
    console.log('수동 발행 실행')
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