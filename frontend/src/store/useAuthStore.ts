import { create } from 'zustand';
import { UserSummary } from '../types';
import { apiRequest } from '../services/api';

interface AuthState {
  user: UserSummary | null;
  token: string | null;
  setUser: (user: UserSummary | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('campussync_user') || 'null'),
  token: localStorage.getItem('campussync_access_token'),
  setUser: (user) => {
    localStorage.setItem('campussync_user', JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    if (token) localStorage.setItem('campussync_access_token', token);
    else localStorage.removeItem('campussync_access_token');
    set({ token });
  },
  login: async (email, password) => {
    const data = await apiRequest<{ accessToken: string; user: UserSummary }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    get().setToken(data.accessToken);
    get().setUser(data.user);
  },
  signup: async (email, password, name, role) => {
    const data = await apiRequest<{ accessToken: string; user: UserSummary }>('/auth/register', {
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
