import { AxiosResponse } from 'axios';

export type ApiResponse<TData> = AxiosResponse<{
    message?: string;
    data: TData;
    status_code?: number;
    success?: boolean;
}>;

export type ApiError = {
    message: string;
};