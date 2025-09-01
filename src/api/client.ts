import axios from 'axios';

// 1. 기본 API URL 설정 (환경변수에서 가져오거나 기본값 사용)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// 2. axios 인스턴스 생성 - 기본 설정값들을 미리 구성
const apiClient = axios.create({
  baseURL: API_BASE_URL, // 모든 요청에 기본으로 붙을 URL
  timeout: 10000, // 요청 타임아웃: 10초
  headers: {
    'Content-Type': 'application/json', // JSON 형태로 데이터 전송
    'Accept': 'application/json', // JSON 형태로 응답 받기
  },
});



export default apiClient;