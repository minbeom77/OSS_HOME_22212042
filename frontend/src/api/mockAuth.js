import apiClient from "./apiClient";

// 성공 시 JWT 토큰 localStorage 저장
export async function mockLogin(id, pw) {
  try {
    const res = await apiClient.post("/api/auth/login", {
      userId: id,
      password: pw,
    });
    // JWT 토큰 저장
    localStorage.setItem("home_token", res.data.token);
    return { userId: res.data.userId, name: res.data.name };
  } catch (error) {
    const code = error.response?.data?.code || "SERVER_ERROR";
    const message = error.response?.data?.message || "서버 오류가 발생했습니다.";
    throw { code, message };
  }
}

// 회원가입
// 성공 시 자동 로그인 (토큰 저장)
export async function mockRegister(id, pw, name) {
  try {
    const res = await apiClient.post("/api/auth/register", {
      userId: id,
      password: pw,
      name,
    });
    localStorage.setItem("home_token", res.data.token);
    return { userId: res.data.userId, name: res.data.name };
  } catch (error) {
    const code = error.response?.data?.code || "SERVER_ERROR";
    const message = error.response?.data?.message || "서버 오류가 발생했습니다.";
    throw { code, message };
  }
}

// 로그아웃
export function logout() {
  localStorage.removeItem("home_token");
}
