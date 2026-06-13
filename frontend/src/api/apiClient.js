import axios from "axios";

  const apiClient = axios.create({
  baseURL: "https://h-o-m-e.onrender.com", 
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("home_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 1. 로그인 API
export const apiLogin = async (userId, password) => {
  const res = await apiClient.post("/api/auth/login", { userId, password });
  if (res.data?.token) {
    localStorage.setItem("home_token", res.data.token); 
  }
  return res.data;
};

// 2. 회원가입 API
export const apiRegister = async (userId, password, name) => {
  const res = await apiClient.post("/api/auth/register", { userId, password, name });
  if (res.data?.token) {
    localStorage.setItem("home_token", res.data.token); 
  }
  return res.data;
};

// 3. 비용 계산 API 
export const apiCalculateCost = async (payload) => {
  const res = await apiClient.post("/api/analysis", payload);
  return res.data; 
};

// 4. 최종 선택 결과 저장 API 
export const apiSaveSelection = async (menuName, chosenOption) => {
  const res = await apiClient.post("/api/analysis/select", { 
    menuName: menuName, 
    chosen: chosenOption 
  });
  return res.data;
};

// 5. 월별 리포트 조회 API
export const apiGetMonthlyReport = async () => {
  const res = await apiClient.get("/api/report/monthly");
  return res.data;
};

// 6. 전체 분석 로그 조회 API 
export const apiGetAllLogs = async () => {
  const res = await apiClient.get("/api/analysis/logs"); 
  return res.data;
};

// 7. 로그아웃
export const logout = () => {
  localStorage.removeItem("home_token"); 
};

export default {
  apiLogin,
  apiRegister,
  apiCalculateCost,
  apiSaveSelection,
  apiGetMonthlyReport,
  apiGetAllLogs,
  logout
};