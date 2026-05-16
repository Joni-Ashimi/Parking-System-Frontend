import {Bounce, toast} from 'react-toastify';
import axios from 'axios';
import {ApiError} from "@/utils/types/ApiResponse";

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export const safePercent = (users: any, count: number) =>
    users.length ? Math.round((count / users.length) * 100) : 0;

export const showSuccess = (message: string, timeout = 2000) => {
    toast.success(message, {
        position: 'top-center',
        autoClose: timeout,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        transition: Bounce
    });
};

export const showError = (message: string, timeout = 3000) => {
    toast.error(message, {
        position: 'top-center',
        autoClose: timeout,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        transition: Bounce
    });
};

export const showInfo = (message: string, timeout = 2000) => {
    toast.info(message, {
        position: 'top-center',
        autoClose: timeout,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        transition: Bounce
    });
};

export const showWarning = (message: string, timeout = 2000) => {
    toast.warning(message, {
        position: 'top-center',
        autoClose: timeout,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        transition: Bounce
    });
};

export const handleRequestErrors = (err: unknown) => {
    if (axios.isAxiosError<ApiError>(err) && err.response?.data) {
        showError(err.response.data.message);
    } else if (typeof err === "string") {
        showError(err);
    } else if (err instanceof Error) {
        showError(err.message);
    } else {
        showError('Something went wrong!');
    }
};
