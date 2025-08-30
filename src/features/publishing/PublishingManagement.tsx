import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PublishingManagement() {
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
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="flex-1">
              <div className="font-medium text-sm">네이버 블로그 연동</div>
              <div className="text-xs text-gray-600">Naver Blog API 인증 완료</div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              연결됨
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <div className="flex-1">
              <div className="font-medium text-sm">콘텐츠 업로드 중</div>
              <div className="text-xs text-gray-600">제목, 본문, 태그 자동 게시</div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
              진행중
            </span>
          </div>
        </div>

        <Button className="w-full bg-green-600 text-white hover:bg-green-500 mt-4">
          수동 발행 실행
        </Button>
      </CardContent>
    </Card>
  )
}