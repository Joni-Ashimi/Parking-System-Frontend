import Axios from "axios";
import { store } from "@/store/store";
import { logOut, loginSucces } from "@/store/auth/authSlice";

const API = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

const refreshAPI = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const guestRoutes = ['/auth/login', '/auth/register'];

API.interceptors.request.use(
    (config: any) => {
        const accessToken = store.getState().auth.accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

API.interceptors.response.use(
    (res : any) => res,
    async (error : any) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !guestRoutes.includes(originalRequest.url) // perhaps remove?
        ) {
            originalRequest._retry = true;

            // Begin refreshing the token
            try {
                const { refreshToken, user } = store.getState().auth;
                if (!refreshToken) {
                    store.dispatch(logOut());
                    return Promise.reject(error);
                }

                const response = await API.post(`/auth/refresh`, {
                    userId: user?.id,
                    refreshToken,
                });
                const { accessToken: newAccessToken, user: newUser } = response.data.data;
                store.dispatch(
                    loginSucces({
                        user: newUser,
                        accessToken: newAccessToken,
                        refreshToken,
                    })
                );
                API.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return API(originalRequest);
            } catch (err) {
                store.dispatch(logOut());
                window.location.reload();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default API;