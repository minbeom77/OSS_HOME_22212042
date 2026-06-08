import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("home_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("home_token");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

// 1. 로그인 
export const apiLogin = async (userId, password) => {
  const res = await apiClient.post("/api/auth/login", {
    userId,
    password,
  });
  return res.data;
};

// 2. 회원가입 
export const apiRegister = async (userId, password, name) => {
  const res = await apiClient.post("/api/auth/register", {
    userId,
    password,
    name,
  });
  return res.data;
};

// 3. 비용 분석 연산
export const apiAnalyze = async (payload) => {
  const res = await apiClient.post("/api/analysis", payload);
  return res.data;
};

export default apiClient;