import API from '../utils/API/API';

const AuthService = {
    login: (email: string, password: string) => API.post('/auth/login', { email, password }),
    register: (name: string, email: string, password: string, confirmPassword: string) =>
        API.post('/auth/register', { name, email, password, confirmPassword }),
};

export default AuthService;