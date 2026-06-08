import apiClient from "./api"; 

// 1. 로그인 API
export const apiLogin = async (userId, password) => {
  const res = await apiClient.post("/api/auth/login", { userId, password });
  if (res.data?.token) {
    localStorage.setItem("home_token", res.data.token); //
  }
  return res.data;
};

// 2. 회원가입 API
export const apiRegister = async (userId, password, name) => {
  const res = await apiClient.post("/api/auth/register", { userId, password, name });
  if (res.data?.token) {
    localStorage.setItem("home_token", res.data.token); //
  }
  return res.data;
};

// 3. 비용 계산 API 
export const apiCalculateCost = async (payload) => {
  const res = await apiClient.post("/api/analysis", payload);
  return res.data; // 백엔드가 정밀 연산한 { delivery, mealkit, cooking, best, breakdown } 리턴
};

// 4. 월별 리포트 조회 API
export const apiGetMonthlyReport = async () => {
  const res = await apiClient.get("/api/report/monthly");
  return res.data;
};

// 5. 전체 분석 로그 조회 API
export const apiGetAllLogs = async () => {
  const res = await apiClient.get("/api/report/logs");
  return res.data;
};

// 6. 로그아웃
export const logout = () => {
  localStorage.removeItem("home_token"); //
};

export default {
  apiLogin,
  apiRegister,
  apiCalculateCost,
  apiGetMonthlyReport,
  apiGetAllLogs,
  logout
};