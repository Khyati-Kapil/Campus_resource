import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
// Layout & Pages
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BookingsPage } from "./pages/BookingsPage";
import { ApprovalsPage } from "./pages/ApprovalsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { AuditPage } from "./pages/AuditPage";
// Stores
import { useAuthStore } from "./store/useAuthStore";
import { useAppStore } from "./store/useAppStore";
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000/api";
export default function App() {
    const { token, user } = useAuthStore();
    const { fetchResources, fetchBookings, fetchNotifications, fetchAdminData, addNotification } = useAppStore();
    const location = useLocation();
    const isAdmin = user?.role === "ADMIN";
    // Socket.io for Real-time
    useEffect(() => {
        if (!token)
            return;
        const socket = io(API_BASE.replace("/api", ""), {
            auth: { token }
        });
        socket.on("notification:new", (n) => {
            addNotification(n);
        });
        return () => {
            socket.disconnect();
        };
    }, [token, addNotification]);
    // Initial Data Load
    useEffect(() => {
        if (!token)
            return;
        void fetchResources(token);
        void fetchBookings(token);
        void fetchNotifications(token);
        if (isAdmin) {
            void fetchAdminData(token, true);
        }
    }, [token, isAdmin, fetchResources, fetchBookings, fetchNotifications, fetchAdminData]);
    // Protected Route Wrapper
    const ProtectedRoute = ({ children, requiredRole }) => {
        if (!token)
            return _jsx(Navigate, { to: "/auth", state: { from: location }, replace: true });
        if (requiredRole && user?.role !== requiredRole && user?.role !== 'ADMIN') {
            return _jsx(Navigate, { to: "/overview", replace: true });
        }
        return _jsx(DashboardLayout, { children: children });
    };
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/auth", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "/overview", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/bookings", element: _jsx(ProtectedRoute, { children: _jsx(BookingsPage, {}) }) }), _jsx(Route, { path: "/resources", element: _jsx(ProtectedRoute, { children: _jsx(ResourcesPage, {}) }) }), _jsx(Route, { path: "/approvals", element: _jsx(ProtectedRoute, { requiredRole: "FACULTY", children: _jsx(ApprovalsPage, {}) }) }), _jsx(Route, { path: "/audit", element: _jsx(ProtectedRoute, { requiredRole: "ADMIN", children: _jsx(AuditPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }));
}
