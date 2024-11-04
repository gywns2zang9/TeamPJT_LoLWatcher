import axios from 'axios';

// axios 인스턴스 생성
const refreshTokenApi = axios.create({
  baseURL: 'https://lolwatcher.com/api',
});

// 요청 인터셉터 설정
refreshTokenApi.interceptors.response.use(
  (response) => response, // 응답이 성공적이면 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 시 확인
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지
      try {
        // refreshToken으로 accessToken 재발급 요청

        const authApiURL = process.env.AUTH_API_URL!;

        const refreshToken = sessionStorage.getItem('refreshToken');
        const response = await axios.post(`${authApiURL}/refresh`, { refreshToken });

        // 새로운 accessToken을 sessionStorage에 저장
        sessionStorage.setItem('accessToken', response.data.accessToken);

        // 요청 헤더에 새로운 accessToken 추가
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

        // 원래 요청 다시 시도
        return refreshTokenApi(originalRequest);
      } catch (err) {
        console.error('토큰 갱신 실패:', err);
        sessionStorage.clear(); // 세션 정리
        window.location.href = '/login'; // 로그인 페이지로 리디렉션
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default refreshTokenApi;
export {};
