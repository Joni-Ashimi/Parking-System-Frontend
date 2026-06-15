import API from '../utils/API/API';

const UserService = {
    getAll: (params: {
        page?: number;
        pageSize?: number;
        qs?: string,
        sortBy?: string,
        sortOrder?: "ASC" | "DESC"
    }) => API.get('/users', {params}),
    getUsersStats: () => API.get('/users/stats'),
    getMe: () => API.get('/users/me'),
    deleteUser: (id: string) => API.delete(`/users/${id}`),
    partialUpdateMe: (data: { name?: string; email?: string }) => API.patch('/users/me', data),
    requestPassword: (data: { currentPassword: string }) => API.post('/auth/password/request', data),
    confirmPassword: (data: { code: string; newPassword: string }) => API.post('/auth/password/confirm', data),
    deleteMe: () => API.delete('/users/me'),
    activateUser: (id: string) => API.patch(`/users/${id}/activate`),
    banUser: (id: string, payload: { reason?: string, penaltyAmount?: number, violationType?: string }) =>
        API.patch(`/users/${id}/ban`, payload),
    uploadAvatar: (data: FormData) => API.patch('/users/me/avatar', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default UserService;