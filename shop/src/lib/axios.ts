import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/api";

// PUBLIC — no token (login, register, refresh)
export const publicAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// PRIVATE — attaches access token, auto-refreshes on 401
export const privateAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Lazy import to avoid circular dependency
const getStore = () => import("@/store/authStore").then((m) => m.useAuthStore);

privateAxios.interceptors.request.use(async (config) => {
    const useAuthStore = await getStore();
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (t: string) => void; reject: (e: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
    failedQueue = [];
};

privateAxios.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (error.response?.status !== 401 || original._retry) return Promise.reject(error);

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                original.headers.Authorization = `Bearer ${token}`;
                return privateAxios(original);
            });
        }

        original._retry = true;
        isRefreshing = true;

        try {
            const res = await publicAxios.get("/auth/refresh");
            const newToken = res.data.accessToken;
            const useAuthStore = await getStore();
            useAuthStore.getState().setAccessToken(newToken);
            processQueue(null, newToken);
            original.headers.Authorization = `Bearer ${newToken}`;
            return privateAxios(original);
        } catch (err) {
            processQueue(err, null);
            const useAuthStore = await getStore();
            useAuthStore.getState().logout();
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);
