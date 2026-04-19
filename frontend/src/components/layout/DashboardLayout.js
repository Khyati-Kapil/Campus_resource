import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, CalendarDays, Building2, Bell, FileSearch, CircleCheckBig, LogOut, Search, User, ChevronLeft, ChevronRight, Database } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
export const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuthStore();
    const { notifications } = useAppStore();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const navigate = useNavigate();
    const isAdmin = user?.role === 'ADMIN';
    const canApprove = isAdmin || user?.role === 'FACULTY';
    const navigation = [
        { name: 'Dashboard', href: '/overview', icon: LayoutDashboard },
        { name: 'Reservations', href: '/bookings', icon: CalendarDays },
        { name: 'Assets', href: '/resources', icon: Database },
        { name: 'Approvals', href: '/approvals', icon: CircleCheckBig, show: canApprove },
        { name: 'Audit', href: '/audit', icon: FileSearch, show: isAdmin },
    ];
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (_jsxs("div", { className: "min-h-screen bg-black flex text-white selection:bg-[#14b8a6] selection:text-black", children: [_jsxs("aside", { className: `relative z-30 bg-[#111111] border-r-8 border-black transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-24'} flex flex-col`, children: [_jsxs("div", { className: "p-10 mb-10 flex items-center gap-6", children: [_jsx("div", { className: "w-16 h-16 rounded-[1.75rem] bg-[#14b8a6] flex items-center justify-center shrink-0 shadow-2xl", children: _jsx(Building2, { className: "text-black w-10 h-10" }) }), isSidebarOpen && _jsx("span", { className: "text-3xl font-black uppercase tracking-tighter", children: "Sync" })] }), _jsx("nav", { className: "flex-1 px-6 space-y-4", children: navigation.filter(i => i.show !== false).map((item) => (_jsxs(NavLink, { to: item.href, className: ({ isActive }) => `flex items-center gap-6 px-6 py-5 rounded-[2rem] transition-all group ${isActive
                                ? 'bg-white text-black'
                                : 'text-zinc-600 hover:bg-zinc-900 hover:text-white'}`, children: [_jsx(item.icon, { className: `w-6 h-6 ${isSidebarOpen ? '' : 'mx-auto'}` }), isSidebarOpen && _jsx("span", { className: "font-black uppercase text-xs tracking-widest", children: item.name })] }, item.name))) }), _jsxs("div", { className: "p-8", children: [_jsxs("div", { className: `p-6 rounded-[3rem] bg-zinc-900 border-4 border-zinc-800 flex items-center gap-5 ${isSidebarOpen ? '' : 'justify-center'}`, children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0", children: _jsx(User, { className: "text-black w-7 h-7" }) }), isSidebarOpen && (_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-black uppercase truncate", children: user?.name }), _jsx("p", { className: "text-[10px] font-black text-zinc-500 uppercase tracking-widest", children: user?.role })] }))] }), isSidebarOpen && (_jsxs("button", { onClick: handleLogout, className: "mt-8 w-full flex items-center justify-center gap-4 px-6 py-5 rounded-[2rem] bg-black border-4 border-zinc-900 text-zinc-600 hover:text-red-500 font-black uppercase text-[10px] tracking-widest transition-all", children: [_jsx(LogOut, { className: "w-5 h-5" }), " Sign Out"] }))] }), _jsx("button", { onClick: () => setSidebarOpen(!isSidebarOpen), className: "absolute -right-5 top-12 w-10 h-10 bg-white border-4 border-black rounded-2xl flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-transform z-50", children: isSidebarOpen ? _jsx(ChevronLeft, { className: "w-6 h-6" }) : _jsx(ChevronRight, { className: "w-6 h-6" }) })] }), _jsxs("main", { className: "flex-1 flex flex-col h-screen overflow-hidden", children: [_jsxs("header", { className: "h-28 flex items-center justify-between px-16 border-b-8 border-black bg-[#111111]", children: [_jsx("div", { className: "flex items-center gap-10 flex-1", children: _jsxs("div", { className: "relative max-w-xl w-full", children: [_jsx(Search, { className: "absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-700" }), _jsx("input", { type: "text", placeholder: "SEARCH...", className: "w-full bg-black rounded-[2.5rem] pl-20 pr-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] outline-none border-4 border-zinc-900 focus:border-[#14b8a6]/20 transition-all text-white placeholder:text-zinc-800" })] }) }), _jsxs("div", { className: "flex items-center gap-8", children: [_jsxs(Button, { variant: "ghost", className: "relative w-16 h-16 rounded-[1.5rem] bg-zinc-900 border-4 border-zinc-800 p-0 flex items-center justify-center", children: [_jsx(Bell, { className: "w-7 h-7" }), notifications.length > 0 && _jsx("div", { className: "absolute top-3 right-3 w-4 h-4 bg-[#14b8a6] rounded-full border-4 border-black" })] }), _jsx(Button, { className: "h-16 px-10 rounded-[2rem] bg-[#84cc16] text-black font-black uppercase text-xs tracking-widest border-none shadow-2xl", children: "New Request" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-16 bg-black", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: children }) })] })] }));
};
