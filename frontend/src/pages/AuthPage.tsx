import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  User, 
  Building2, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  CalendarDays
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'ADMIN'>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const deploymentWarning = (() => {
    if (typeof window === 'undefined') return '';
    const host = window.location.hostname;
    const isRemote = host !== 'localhost' && host !== '127.0.0.1';
    const raw = (import.meta.env.VITE_API_BASE as string | undefined)?.trim() ?? '';
    const missing = raw.length === 0;
    const localApi = raw.includes('localhost') || raw.includes('127.0.0.1');
    if (!isRemote) return '';
    if (missing) return 'Backend URL is not set. Configure Vercel env var VITE_API_BASE to your backend URL ending with /api.';
    if (localApi) return 'Backend URL points to localhost. Update Vercel env var VITE_API_BASE to your deployed backend URL ending with /api.';
    return '';
  })();
  
  const { login, signup } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name, role);
      }
      navigate('/overview');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-[#14b8a6] selection:text-black bg-black text-white relative overflow-hidden">



      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-20 relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 font-black text-4xl tracking-tighter uppercase"
        >
          <div className="w-14 h-14 rounded-[1.5rem] bg-[#14b8a6] flex items-center justify-center shadow-2xl">
            <Building2 className="text-black w-8 h-8" />
          </div>
          <span>CampusSync</span>
        </motion.div>

        <div className="max-w-xl">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-7xl font-black tracking-tight text-white mb-10 leading-[0.9] uppercase"
           >
             The <br /> <span className="text-[#14b8a6]">Standard</span> <br /> In Campus <br /> Orchestration.
           </motion.h2>
           <p className="text-xl text-zinc-500 font-bold uppercase tracking-tight leading-relaxed mb-16">
             Centralized management for every institutional asset. Precision. Security. Governance.
           </p>
           
           <div className="grid grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck, text: 'Audit Logs', color: 'text-white', bg: 'bg-zinc-900' },
                { icon: CalendarDays, text: 'Conflict Free', color: 'text-white', bg: 'bg-zinc-900' },
              ].map((item, i) => (
                <motion.div 
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 p-6 rounded-[2rem] bg-zinc-900 border-4 border-zinc-800"
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <span className="font-black text-[10px] uppercase tracking-widest">{item.text}</span>
                </motion.div>
              ))}
           </div>
        </div>

        <p className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em]">© 2026 CampusSync OS</p>
      </div>


      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#111111] rounded-[3rem] border-8 border-zinc-900 overflow-hidden shadow-2xl">
            <div className="p-12">
              <div className="mb-12">
                <h3 className="text-4xl font-black tracking-tighter uppercase text-white mb-4">
                  {isLogin ? 'Access' : 'Initialize'}
                </h3>
                <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                  {isLogin ? 'Enter credentials to authorize access.' : 'Configure your institutional account.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {deploymentWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-amber-900/10 border-4 border-amber-900/30 rounded-[1.5rem] flex items-center gap-4 text-amber-300 text-xs font-black uppercase tracking-widest"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {deploymentWarning}
                  </motion.div>
                )}
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-8 overflow-hidden"
                    >
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-800" />
                          <input
                            type="text"
                            required={!isLogin}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black border-4 border-zinc-900 rounded-[1.5rem] pl-16 pr-6 py-5 text-xs font-black uppercase tracking-widest outline-none focus:border-[#14b8a6]/30 transition-all text-white placeholder:text-zinc-800"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-2">Institutional Role</label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['STUDENT', 'FACULTY', 'ADMIN'] as const).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRole(r)}
                              className={`py-4 rounded-xl text-[10px] font-black tracking-widest border-4 transition-all ${
                                role === r 
                                  ? 'bg-[#14b8a6] border-[#14b8a6] text-black shadow-lg shadow-teal-500/20' 
                                  : 'bg-black border-zinc-900 text-zinc-700 hover:border-zinc-800'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 ml-2">Auth Identifier (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-800" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border-4 border-zinc-900 rounded-[1.5rem] pl-16 pr-6 py-5 text-xs font-black uppercase tracking-widest outline-none focus:border-[#14b8a6]/30 transition-all text-white placeholder:text-zinc-800"
                      placeholder="USER@INSTITUTION.EDU"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Access Key (Password)</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-800" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border-4 border-zinc-900 rounded-[1.5rem] pl-16 pr-6 py-5 text-xs font-black uppercase tracking-widest outline-none focus:border-[#14b8a6]/30 transition-all text-white placeholder:text-zinc-800"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-red-900/20 border-4 border-red-900/40 rounded-[1.5rem] flex items-center gap-4 text-red-500 text-xs font-black uppercase tracking-widest"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-20 rounded-[1.5rem] bg-[#14b8a6] hover:bg-teal-600 text-black font-black text-sm uppercase tracking-[0.3em] border-none shadow-2xl transition-transform active:scale-95 disabled:opacity-50 gap-4"
                >
                  {loading ? 'Authenticating...' : isLogin ? 'Authorize Access' : 'Initialize Account'}
                  {!loading && <ArrowRight className="w-6 h-6" />}
                </Button>
              </form>

              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 hover:text-white transition-colors"
                >
                  {isLogin ? "Request Access (Sign Up)" : "Return to Access Portal (Log In)"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
