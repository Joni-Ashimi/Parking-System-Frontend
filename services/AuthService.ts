import API from '../utils/API/API';

const AuthService = {
    login: (email: string, password: string) => API.post('/auth/login', {email, password}),
    register: (name: string, email: string, phoneNumber: string, gender: string, password: string, confirmPassword: string) =>
        API.post('/auth/register', {name, email, phoneNumber, gender, password, confirmPassword}),
    refreshToken: (refreshToken: string) => API.post('/auth/refresh', {refreshToken}),
};

export default AuthService;