import axiosInstance from "./axiosInstance";

// 회원가입 API
export const postRegistAPI = async (
  userId: string,
  password: string,
  riotId: string,
  riotPassword: string
) => {
  const response = await axiosInstance.post("/auth/signup", {
    userId,
    password,
    riotId,
    riotPassword
  });
  return response.data;
};

// 로그인 API
export const postLoginAPI = async (userId: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    userId,
    password
  });
  localStorage.setItem("accessToken", response.data.accessToken);
  return response.data;
};

//로그아웃 함수
export const functionLogout = async (accessToken: string) => {
  localStorage.removeItem(accessToken);
  return;
};

//accessToken 함수
export const functionAccessToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken;
};
