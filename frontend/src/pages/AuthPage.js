import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Building2, ShieldCheck, AlertCircle, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuthStore();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            }
            else {
                await signup(email, password, name, role);
            }
            navigate('/overview');
        }
        catch (err) {
            setError(err.message || 'Authentication failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex selection:bg-[#14b8a6] selection:text-black bg-black text-white relative overflow-hidden", children: [_jsxs("div", { className: "hidden lg:flex lg:w-1/2 flex-col justify-between p-20 relative", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "flex items-center gap-4 font-black text-4xl tracking-tighter uppercase", children: [_jsx("div", { className: "w-14 h-14 rounded-[1.5rem] bg-[#14b8a6] flex items-center justify-center shadow-2xl", children: _jsx(Building2, { className: "text-black w-8 h-8" }) }), _jsx("span", { children: "CampusSync" })] }), _jsxs("div", { className: "max-w-xl", children: [_jsxs(motion.h2, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-7xl font-black tracking-tight text-white mb-10 leading-[0.9] uppercase", children: ["The ", _jsx("br", {}), " ", _jsx("span", { className: "text-[#14b8a6]", children: "Standard" }), " ", _jsx("br", {}), " In Campus ", _jsx("br", {}), " Orchestration."] }), _jsx("p", { className: "text-xl text-zinc-500 font-bold uppercase tracking-tight leading-relaxed mb-16", children: "Centralized management for every institutional asset. Precision. Security. Governance." }), _jsx("div", { className: "grid grid-cols-2 gap-8", children: [
                                    { icon: ShieldCheck, text: 'Audit Logs', color: 'text-white', bg: 'bg-zinc-900' },
                                    { icon: CalendarDays, text: 'Conflict Free', color: 'text-white', bg: 'bg-zinc-900' },
                                ].map((item, i) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 + i * 0.1 }, className: "flex items-center gap-4 p-6 rounded-[2rem] bg-zinc-900 border-4 border-zinc-800", children: [_jsx(item.icon, { className: `w-6 h-6 ${item.color}` }), _jsx("span", { className: "font-black text-[10px] uppercase tracking-widest", children: item.text })] }, item.text))) })] }), _jsx("p", { className: "text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em]", children: "\u00A9 2026 CampusSync OS" })] }), _jsx("div", { className: "w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "w-full max-w-md", children: _jsx("div", { className: "bg-[#111111] rounded-[3rem] border-8 border-zinc-900 overflow-hidden shadow-2xl", children: _jsxs("div", { className: "p-12", children: [_jsxs("div", { className: "mb-12", children: [_jsx("h3", { className: "text-4xl font-black tracking-tighter uppercase text-white mb-4", children: isLogin ? 'Access' : 'Initialize' }), _jsx("p", { className: "text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]", children: isLogin ? 'Enter credentials to authorize access.' : 'Configure your institutional account.' })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsx(AnimatePresence, { mode: "wait", children: !isLogin && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "space-y-8 overflow-hidden", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-2", children: "Full Name" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-800" }), _jsx("input", { type: "text", required: !isLogin, value: name, onChange: (e) => setName(e.target.value), className: "w-full bg-black border-4 border-zinc-900 rounded-[1.5rem] pl-16 pr-6 py-5 text-xs font-black uppercase tracking-widest outline-none focus:border-[#14b8a6]/30 transition-all text-white placeholder:text-zinc-800", placeholder: "John Doe" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-2", children: "Institutional Role" }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: ['STUDENT', 'FACULTY', 'ADMIN'].map((r) => (_jsx("button", { type: "button", onClick: () => setRole(r), className: `py-4 rounded-xl text-[10px] font-black tracking-widest border-4 transition-all ${role === r
                                                                        ? 'bg-[#14b8a6] border-[#14b8a6] text-black shadow-lg shadow-teal-500/20'
                                                                        : 'bg-black border-zinc-900 text-zinc-700 hover:border-zinc-800'}`, children: r }, r))) })] })] })) }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-2", children: "Auth Identifier (Email)" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-800" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-black border-4 border-zinc-900 rounded-[1.5rem] pl-16 pr-6 py-5 text-xs font-black uppercase tracking-widest outline-none focus:border-[#14b8a6]/30 transition-all text-white placeholder:text-zinc-800", placeholder: "USER@INSTITUTION.EDU" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex justify-between items-center px-2", children: _jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700", children: "Access Key (Password)" }) }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-800" }), _jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-black border-4 border-zinc-900 rounded-[1.5rem] pl-16 pr-6 py-5 text-xs font-black uppercase tracking-widest outline-none focus:border-[#14b8a6]/30 transition-all text-white placeholder:text-zinc-800", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] }), error && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "p-5 bg-red-900/20 border-4 border-red-900/40 rounded-[1.5rem] flex items-center gap-4 text-red-500 text-xs font-black uppercase tracking-widest", children: [_jsx(AlertCircle, { className: "w-5 h-5 shrink-0" }), error] })), _jsxs(Button, { type: "submit", disabled: loading, className: "w-full h-20 rounded-[1.5rem] bg-[#14b8a6] hover:bg-teal-600 text-black font-black text-sm uppercase tracking-[0.3em] border-none shadow-2xl transition-transform active:scale-95 disabled:opacity-50 gap-4", children: [loading ? 'Authenticating...' : isLogin ? 'Authorize Access' : 'Initialize Account', !loading && _jsx(ArrowRight, { className: "w-6 h-6" })] })] }), _jsx("div", { className: "mt-12 text-center", children: _jsx("button", { type: "button", onClick: () => setIsLogin(!isLogin), className: "text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 hover:text-white transition-colors", children: isLogin ? "Request Access (Sign Up)" : "Return to Access Portal (Log In)" }) })] }) }) }) })] }));
};
