import axios, { type InternalAxiosRequestConfig } from 'axios';
import useLocalStorage from '../hooks/useLocalStorage';

// 요청 재시도 여부를 나타내는 플래그 추가 - 무한 재귀 방지
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 이미 진행 중인 리프레시 요청을 재사용하여 중복 요청 방지
let refreshPromise: Promise<string> | null = null;

const {
  getItem: getAccessToken,
  setItem: setAccessToken,
  removeItem: removeAccessToken,
} = useLocalStorage('accessToken');

const {
  getItem: getRefreshToken,
  setItem: setRefreshToken,
  removeItem: removeRefreshToken,
} = useLocalStorage('refreshToken');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청 전에 Access Token을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken<string>();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 발생 시 Refresh Token을 통한 토큰 갱신 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // 리프레시 엔드포인트에서 401 에러 발생 시 → 중복 재시도 방지를 위해 로그아웃 처리
      if (originalRequest.url === '/v1/auth/refresh') {
        removeAccessToken();
        removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // 재시도 플래그 설정 - 이 요청이 다시 401을 받아도 무한 루프 방지
      originalRequest._retry = true;

      // 이미 리프레시 요청이 진행 중이면 해당 프로미스를 재사용
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshToken = getRefreshToken<string>();
            const { data } = await axiosInstance.post('/v1/auth/refresh', {
              refresh: refreshToken,
            });

            const newAccessToken: string = data.data.accessToken;
            const newRefreshToken: string = data.data.refreshToken;

            // 새로운 토큰을 로컬 스토리지에 저장
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            // 새 Access Token을 반환하여 다른 대기 요청들이 사용할 수 있게 함
            return newAccessToken;
          } catch (refreshError) {
            removeAccessToken();
            removeRefreshToken();
            window.location.href = '/login';
            throw refreshError;
          } finally {
            // 리프레시 요청 완료 후 초기화
            refreshPromise = null;
          }
        })();
      }

      try {
        const newAccessToken = await refreshPromise;
        // 원본 요청의 Authorization 헤더를 갱신된 토큰으로 업데이트 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const LOCAL_STORAGE_KEY = {
  ACCESS_TOKEN: 'accessToken',
} as const;

export default axiosInstance;
