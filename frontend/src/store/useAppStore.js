import { create } from 'zustand';
import { apiRequest, getAuthHeaders } from '../services/api';
export const useAppStore = create((set, get) => ({
    resources: [],
    bookings: [],
    notifications: [],
    auditLogs: [],
    usage: null,
    loadingStates: {},
    errors: {},
    setLoading: (key, state) => set((s) => ({ loadingStates: { ...s.loadingStates, [key]: state } })),
    setError: (key, error) => set((s) => ({ errors: { ...s.errors, [key]: error } })),
    fetchResources: async (token) => {
        get().setLoading('resources', 'loading');
        try {
            const data = await apiRequest('/resources', { headers: getAuthHeaders(token) });
            set({ resources: data.items || [] });
            get().setLoading('resources', 'loaded');
        }
        catch (e) {
            get().setError('resources', e.message);
            get().setLoading('resources', 'error');
        }
    },
    fetchBookings: async (token) => {
        get().setLoading('bookings', 'loading');
        try {
            const data = await apiRequest('/bookings', { headers: getAuthHeaders(token) });
            set({ bookings: data.items || [] });
            get().setLoading('bookings', 'loaded');
        }
        catch (e) {
            get().setError('bookings', e.message);
            get().setLoading('bookings', 'error');
        }
    },
    fetchNotifications: async (token) => {
        get().setLoading('notifications', 'loading');
        try {
            const data = await apiRequest('/notifications', { headers: getAuthHeaders(token) });
            set({ notifications: data.items || [] });
            get().setLoading('notifications', 'loaded');
        }
        catch (e) {
            get().setError('notifications', e.message);
            get().setLoading('notifications', 'error');
        }
    },
    fetchAdminData: async (token, isAdmin) => {
        if (!isAdmin)
            return;
        get().setLoading('analytics', 'loading');
        get().setLoading('audit', 'loading');
        try {
            const usage = await apiRequest('/analytics/usage', { headers: getAuthHeaders(token) });
            set({ usage });
            get().setLoading('analytics', 'loaded');
        }
        catch (e) {
            get().setError('analytics', e.message);
            get().setLoading('analytics', 'error');
        }
        try {
            const audit = await apiRequest('/audit', { headers: getAuthHeaders(token) });
            set({ auditLogs: audit.items || [] });
            get().setLoading('audit', 'loaded');
        }
        catch (e) {
            get().setError('audit', e.message);
            get().setLoading('audit', 'error');
        }
    },
    addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications].slice(0, 50) })),
}));
