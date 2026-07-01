import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = "http://localhost:5510/api";

export const publicAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const privateAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

privateAxios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token as string);
    }
  });
  failedQueue = [];
};

privateAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return privateAxios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await publicAxios.get("/auth/refresh");
        const { accessToken, user } = response.data;
        useAuthStore.getState().setAccessToken(accessToken);
        useAuthStore.setState({ user, isAuthenticated: true });
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return privateAxios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.setState({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
