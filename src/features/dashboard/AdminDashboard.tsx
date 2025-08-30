"use client";

import { useState, useEffect } from "react";
import { ScheduleManagement } from "../schedule";
import { KeywordExtraction } from "../keyword";
import { ProductSearchCrawling } from "../product";
import { LLMContentGeneration } from "../content";
import { PublishingManagement } from "../publishing";
import { ResultMonitoring } from "../monitoring";

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("대시보드");

  useEffect(() => {
    // 진행률 애니메이션
    const timer = setTimeout(() => {
      const progressBars = document.querySelectorAll(".progress-fill");
      progressBars.forEach((bar: Element) => {
        const htmlBar = bar as HTMLElement;
        const width = htmlBar.style.width;
        htmlBar.style.width = "0%";
        setTimeout(() => {
          htmlBar.style.width = width;
        }, 100);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { label: "대시보드" },
    { label: "스케줄 관리" },
    { label: "키워드 추출" },
    { label: "상품 검색" },
    { label: "크롤링 관리" },
    { label: "LLM 콘텐츠" },
    { label: "발행 관리" },
    { label: "결과 모니터링" },
  ];

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
            <h2 className="text-gray-800 text-3xl font-bold mb-2">
              AI 콘텐츠 자동화 시스템 대시보드
            </h2>
            <p className="text-gray-600 text-sm">
              ssadagu.kr 상품 기반 네이버 블로그 자동 발행 시스템
            </p>
          </div>

          {/* 대시보드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ScheduleManagement />
            <KeywordExtraction />
            <ProductSearchCrawling />
            <LLMContentGeneration />
            <PublishingManagement />
            <ResultMonitoring />
          </div>
        </main>
      </div>
    </div>
  );
}
