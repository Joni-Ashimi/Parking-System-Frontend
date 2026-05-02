import Axios from "axios";
import { store } from "@/store/store";
import { logOut, loginSucces } from "@/store/auth/authSlice";

const refreshAPI = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: { "Content-Type": "application/json" },
});

export const API = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
});

const isGuestUrl = (url?: string) =>
    ["/auth/login", "/auth/register"].some((route) => url?.includes(route));

let refreshTokenPromise: Promise<string | null> | null = null;

const getNewToken = async (): Promise<string | null> => {
    try {
        const { refreshToken } = store.getState().auth;
        if (!refreshToken) throw new Error("No refresh token");

        const response = await refreshAPI.post("/auth/refresh", { refreshToken });
        const { accessToken: newAccessToken, user: newUser } = response.data;

        store.dispatch(loginSucces({
            user: newUser,
            accessToken: newAccessToken,
            refreshToken: refreshToken,
        }));

        return newAccessToken;
    } catch (error) {
        store.dispatch(logOut());
        if (typeof window !== "undefined") window.location.href = "/login";
        return null;
    } finally {
        refreshTokenPromise = null;
    }
};

API.interceptors.request.use((config) => {
    if (isGuestUrl(config.url)) return config;

    const { accessToken } = store.getState().auth;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !isGuestUrl(originalRequest.url)) {
            originalRequest._retry = true;
            if (!refreshTokenPromise) {
                refreshTokenPromise = getNewToken();
            }

            const token = await refreshTokenPromise;

            if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return API(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default API;