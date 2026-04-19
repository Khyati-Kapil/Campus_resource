import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Bell,
  FileSearch,
  CircleCheckBig,
  LogOut,
  Menu,
  X,
  Search,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Plus,
  Box,
  Layout,
  Microscope,
  Database
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../store/useAppStore';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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

  return (
    <div className="min-h-screen bg-black flex text-white selection:bg-[#14b8a6] selection:text-black">

      <aside
        className={`relative z-30 bg-[#111111] border-r-8 border-black transition-all duration-300 ${
          isSidebarOpen ? 'w-80' : 'w-24'
        } flex flex-col`}
      >
        <div className="p-10 mb-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.75rem] bg-[#14b8a6] flex items-center justify-center shrink-0 shadow-2xl">
            <Building2 className="text-black w-10 h-10" />
          </div>
          {isSidebarOpen && <span className="text-3xl font-black uppercase tracking-tighter">Sync</span>}
        </div>

        <nav className="flex-1 px-6 space-y-4">
           {navigation.filter(i => i.show !== false).map((item) => (
             <NavLink
               key={item.name}
               to={item.href}
               className={({ isActive }) =>
                 `flex items-center gap-6 px-6 py-5 rounded-[2rem] transition-all group ${
                   isActive 
                     ? 'bg-white text-black' 
                     : 'text-zinc-600 hover:bg-zinc-900 hover:text-white'
                 }`
               }
             >
               <item.icon className={`w-6 h-6 ${isSidebarOpen ? '' : 'mx-auto'}`} />
               {isSidebarOpen && <span className="font-black uppercase text-xs tracking-widest">{item.name}</span>}
             </NavLink>
           ))}
        </nav>

        <div className="p-8">
           <div className={`p-6 rounded-[3rem] bg-zinc-900 border-4 border-zinc-800 flex items-center gap-5 ${isSidebarOpen ? '' : 'justify-center'}`}>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0">
                 <User className="text-black w-7 h-7" />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-black uppercase truncate">{user?.name}</p>
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{user?.role}</p>
                </div>
              )}
           </div>
           {isSidebarOpen && (
             <button onClick={handleLogout} className="mt-8 w-full flex items-center justify-center gap-4 px-6 py-5 rounded-[2rem] bg-black border-4 border-zinc-900 text-zinc-600 hover:text-red-500 font-black uppercase text-[10px] tracking-widest transition-all">
                <LogOut className="w-5 h-5" /> Sign Out
             </button>
           )}
        </div>
        

        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-5 top-12 w-10 h-10 bg-white border-4 border-black rounded-2xl flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-transform z-50"
        >
          {isSidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </aside>


      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        <header className="h-28 flex items-center justify-between px-16 border-b-8 border-black bg-[#111111]">
           <div className="flex items-center gap-10 flex-1">
              <div className="relative max-w-xl w-full">
                 <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-700" />
                 <input
                   type="text"
                   placeholder="SEARCH..."
                   className="w-full bg-black rounded-[2.5rem] pl-20 pr-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] outline-none border-4 border-zinc-900 focus:border-[#14b8a6]/20 transition-all text-white placeholder:text-zinc-800"
                 />
              </div>
           </div>

           <div className="flex items-center gap-8">
              <Button variant="ghost" className="relative w-16 h-16 rounded-[1.5rem] bg-zinc-900 border-4 border-zinc-800 p-0 flex items-center justify-center">
                 <Bell className="w-7 h-7" />
                 {notifications.length > 0 && <div className="absolute top-3 right-3 w-4 h-4 bg-[#14b8a6] rounded-full border-4 border-black" />}
              </Button>
              <Button className="h-16 px-10 rounded-[2rem] bg-[#84cc16] text-black font-black uppercase text-xs tracking-widest border-none shadow-2xl">
                 New Request
              </Button>
           </div>
        </header>


        <div className="flex-1 overflow-y-auto p-16 bg-black">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3 }}
           >
              {children}
           </motion.div>
        </div>
      </main>
    </div>
  );
};
