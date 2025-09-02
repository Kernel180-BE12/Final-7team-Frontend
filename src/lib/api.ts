import axios from "axios";

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: "/v1", // vite.config.ts의 프록시 설정으로 localhost:8080에 연결
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
