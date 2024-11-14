import axiosInstance from './axiosInstance';

// 회원가입 API
export const postSignupAPI = async (userId: string, password: string, riotId: string, riotPassword: string) => {
  const response = await axiosInstance.post('/auth/signup', {
    userId,
    password,
    riotId,
    riotPassword,
  });
  return response.data;
};

// 로그인 API
export const postLoginAPI = async (userId: string, password: string) => {
  const BASE_URL = process.env.REACT_APP_LOLWATCHER_API_URL!;
  console.log('-----------------');
  console.log('BASE_URL:', BASE_URL);
  console.log('----------------');

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Login request failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data;
};

//로그아웃 함수
export const functionLogout = async (accessToken: string) => {
  localStorage.removeItem('accessToken');
  return;
};

//accessToken 함수
export const functionAccessToken = async () => {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken;
};
