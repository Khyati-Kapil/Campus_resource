import { create } from 'zustand';
import { apiRequest } from '../services/api';
export const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('campussync_user') || 'null'),
    token: localStorage.getItem('campussync_access_token'),
    setUser: (user) => {
        localStorage.setItem('campussync_user', JSON.stringify(user));
        set({ user });
    },
    setToken: (token) => {
        if (token)
            localStorage.setItem('campussync_access_token', token);
        else
            localStorage.removeItem('campussync_access_token');
        set({ token });
    },
    login: async (email, password) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        get().setToken(data.accessToken);
        get().setUser(data.user);
    },
    signup: async (email, password, name, role) => {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, role }),
            headers: { 'Content-Type': 'application/json' }
        });
        get().setToken(data.accessToken);
        get().setUser(data.user);
    },
    logout: () => {
        localStorage.removeItem('campussync_user');
        localStorage.removeItem('campussync_access_token');
        set({ user: null, token: null });
    },
}));
