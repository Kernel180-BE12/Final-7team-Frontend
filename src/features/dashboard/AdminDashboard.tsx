"use client"

import { useState, useEffect } from "react"

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("대시보드")

  useEffect(() => {
    // 진행률 애니메이션
    const timer = setTimeout(() => {
      const progressBars = document.querySelectorAll(".progress-fill")
      progressBars.forEach((bar: Element) => {
        const htmlBar = bar as HTMLElement
        const width = htmlBar.style.width
        htmlBar.style.width = "0%"
        setTimeout(() => {
          htmlBar.style.width = width
        }, 100)
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const navItems = [
    { label: "대시보드" },
    { label: "스케줄 관리" },
    { label: "키워드 추출" },
    { label: "상품 검색" },
    { label: "크롤링 관리" },
    { label: "LLM 콘텐츠" },
    { label: "발행 관리" },
    { label: "결과 모니터링" },
  ]

  return (
    <div className="min-h-screen" style={{ background: "#FEFEFE" }}>
      <div className="flex min-h-screen">
        {/* 사이드바 */}
        <nav className="w-70 bg-gray-800 p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-white text-xl font-bold mb-1">AI 콘텐츠</h1>
            <p className="text-gray-400 text-xs">자동화 시스템</p>
          </div>

          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => setActiveNav(item.label)}
                  className={`w-full flex items-center px-5 py-4 rounded-xl transition-all duration-300 font-medium ${
                    activeNav === item.label
                      ? "bg-gray-700 text-white transform translate-x-1"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white hover:transform hover:translate-x-1"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-200">
            <h2 className="text-gray-800 text-3xl font-bold mb-2">AI 콘텐츠 자동화 시스템 대시보드</h2>
            <p className="text-gray-600 text-sm">ssadagu.kr 상품 기반 네이버 블로그 자동 발행 시스템</p>
          </div>

          {/* 대시보드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* 스케줄 관리 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <div className="text-lg font-semibold text-gray-800">스케줄 관리</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-800 text-sm">실행 주기</label>
                  <select className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600">
                    <option>매일 실행</option>
                    <option>주간 실행</option>
                    <option>월간 실행</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-800 text-sm">실행 시간</label>
                  <input
                    type="time"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
                    defaultValue="08:00"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-800 text-sm">키워드 추출 개수</label>
                  <input
                    type="number"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
                    defaultValue="50"
                    placeholder="트렌드 키워드 개수"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-800 text-sm">발행 개수</label>
                  <input
                    type="number"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600"
                    defaultValue="1"
                    placeholder="생성할 콘텐츠 수"
                  />
                </div>

                <button className="w-full bg-gray-700 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                  스케줄 등록
                </button>
              </div>
            </div>

            {/* 키워드 추출 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <div className="text-lg font-semibold text-gray-800">키워드 추출 현황</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-sm">트렌드 키워드 수집 완료</div>
                    <div className="text-xs text-gray-600">상위 50개 키워드 추출 성공</div>
                  </div>
                  <div className="text-xs text-gray-600">08:00</div>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div className="flex-1">
                    <div className="font-medium text-sm">선택된 키워드: "겨울 패딩"</div>
                    <div className="text-xs text-gray-600">우선순위 1위 키워드 자동 선택</div>
                  </div>
                  <div className="text-xs text-gray-600">08:01</div>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">50</div>
                  <div className="text-xs text-gray-600">수집 키워드</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">1</div>
                  <div className="text-xs text-gray-600">선택 키워드</div>
                </div>
              </div>
            </div>

            {/* 상품 검색 & 크롤링 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <div className="text-lg font-semibold text-gray-800">상품 검색 & 크롤링</div>
              </div>

              <div className="mb-4">
                <div className="font-medium">타겟 사이트: ssadagu.kr</div>
                <div className="text-sm text-gray-600">선택된 키워드로 상품 검색 중...</div>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-3">
                <div
                  className="progress-fill h-full bg-gray-600 rounded-full transition-all duration-300"
                  style={{ width: "75%" }}
                ></div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-sm">상품 검색 완료</div>
                    <div className="text-xs text-gray-600">검색 결과 15개 상품 발견</div>
                  </div>
                  <div className="text-xs text-gray-600">08:02</div>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div className="flex-1">
                    <div className="font-medium text-sm">상품 정보 크롤링 중</div>
                    <div className="text-xs text-gray-600">상품명, 가격, 스펙 추출 중...</div>
                  </div>
                  <div className="text-xs text-gray-600">08:03</div>
                </div>
              </div>
            </div>

            {/* LLM 콘텐츠 생성 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <div className="text-lg font-semibold text-gray-800">LLM 콘텐츠 생성</div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800 text-sm">AI 모델 선택</label>
                <select className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 bg-white focus:outline-none focus:border-gray-600">
                  <option>OpenAI GPT-4</option>
                  <option>Google Gemini</option>
                </select>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100 mb-3">
                <div className="flex-1">
                  <div className="font-medium text-sm">콘텐츠 생성 시작</div>
                  <div className="text-xs text-gray-600">상품 정보 기반 블로그 글 작성 중</div>
                </div>
                <div className="text-xs text-gray-600">08:04</div>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-3">
                <div
                  className="progress-fill h-full bg-gray-600 rounded-full transition-all duration-300"
                  style={{ width: "60%" }}
                ></div>
              </div>

              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">1,247</div>
                  <div className="text-xs text-gray-600">생성 글자 수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">5</div>
                  <div className="text-xs text-gray-600">생성 태그 수</div>
                </div>
              </div>
            </div>

            {/* 발행 관리 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <div className="text-lg font-semibold text-gray-800">자동 발행</div>
              </div>

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

              <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-sm font-semibold mt-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                수동 발행 실행
              </button>
            </div>

            {/* 결과 모니터링 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <div className="text-lg font-semibold text-gray-800">결과 모니터링</div>
              </div>

              <div className="flex justify-between mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">23</div>
                  <div className="text-xs text-gray-600">성공 발행</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">2</div>
                  <div className="text-xs text-gray-600">실패 발행</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">92%</div>
                  <div className="text-xs text-gray-600">성공률</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-sm">발행 완료</div>
                    <div className="text-xs text-gray-600">겨울 패딩 관련 블로그 글 게시 성공</div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">성공</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div className="flex-1">
                    <div className="font-medium text-sm">다음 스케줄 대기</div>
                    <div className="text-xs text-gray-600">내일 08:00 자동 실행 예정</div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                    대기중
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}