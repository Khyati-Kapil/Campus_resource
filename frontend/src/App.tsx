import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { io } from "socket.io-client";


import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BookingsPage } from "./pages/BookingsPage";
import { ApprovalsPage } from "./pages/ApprovalsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { AuditPage } from "./pages/AuditPage";


import { useAuthStore } from "./store/useAuthStore";
import { useAppStore } from "./store/useAppStore";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000/api";

export default function App() {
  const { token, user } = useAuthStore();
  const { 
    fetchResources, 
    fetchBookings, 
    fetchNotifications, 
    fetchAdminData, 
    addNotification 
  } = useAppStore();
  
  const location = useLocation();
  const isAdmin = user?.role === "ADMIN";


  useEffect(() => {
    if (!token) return;
    
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


  useEffect(() => {
    if (!token) return;

    void fetchResources(token);
    void fetchBookings(token);
    void fetchNotifications(token);
    
    if (isAdmin) {
      void fetchAdminData(token, true);
    }
  }, [token, isAdmin, fetchResources, fetchBookings, fetchNotifications, fetchAdminData]);


  const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
    if (!token) return <Navigate to="/auth" state={{ from: location }} replace />;
    if (requiredRole && user?.role !== requiredRole && user?.role !== 'ADMIN') {
      return <Navigate to="/overview" replace />;
    }
    return <DashboardLayout>{children}</DashboardLayout>;
  };

  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />


      <Route path="/overview" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
      

      <Route 
        path="/approvals" 
        element={
          <ProtectedRoute requiredRole="FACULTY">
            <ApprovalsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/audit" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AuditPage />
          </ProtectedRoute>
        } 
      />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
