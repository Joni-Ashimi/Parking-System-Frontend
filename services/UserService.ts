import API from '../utils/API/API';

const UserService = {
    getAll: (userId?: string) => API.get('/users'),
    getById: (id: string) => API.get(`/users/${id}`),
    getMe: () => API.get('/users/me'),
    partialUpdateMe: (data: { name?: string; email?: string}) => API.patch('/users/me', data),
    requestPassword: (data: { currentPassword: string}) => API.post('/auth/password/request', data),
    confirmPassword: (data: { code: string; newPassword: string}) => API.post('/auth/password/confirm', data),
    deleteMe: () => API.delete('/me'),
};

export default UserService;