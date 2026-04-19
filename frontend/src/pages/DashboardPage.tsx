import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  Building2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Activity,
  Zap,
  ShieldCheck,
  LayoutDashboard,
  Box,
  Rocket,
  ArrowRight,
  Microscope,
  Cpu,
  Monitor,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const DashboardPage = () => {
  const { usage, bookings, resources } = useAppStore();

  const stats = [
    { label: 'Campus Assets', value: resources.length, icon: Box, color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-500/20' },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'APPROVED').length, icon: CalendarCheck, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-500/20' },
    { label: 'Pending Requests', value: bookings.filter(b => b.status === 'PENDING').length, icon: Clock, color: 'text-lime-400', bg: 'bg-lime-400/10', border: 'border-lime-500/20' },
    { label: 'Conflicts Found', value: usage?.conflicts || 0, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/20' },
  ];

  const chartData = usage?.peakHours || [
    { hour: '08:00', count: 12 },
    { hour: '10:00', count: 24 },
    { hour: '12:00', count: 32 },
    { hour: '14:00', count: 28 },
    { hour: '16:00', count: 18 },
    { hour: '18:00', count: 8 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Operational Dashboard</h1>
          <p className="text-slate-500 text-sm">Real-time overview of campus resources and scheduling.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/10 hover:bg-white/5 text-sm font-semibold rounded-xl px-5 h-11">
              Download Report
           </Button>
           <Button className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl px-6 h-11 border-none shadow-lg shadow-teal-500/10">
              Refresh Data
           </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`p-6 rounded-2xl bg-white/5 border ${stat.border} hover:bg-white/[0.08] transition-all group cursor-pointer`}>
            <div className="flex justify-between items-start mb-4">
               <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
               </div>
               <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
            </div>
            <div>
               <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
               <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART AREA */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-white/5 border border-white/10">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-lg font-bold">Resource Utilization</h3>
                <p className="text-xs text-slate-500">Peak hours and usage patterns over the last 24h.</p>
              </div>
              <Badge className="bg-teal-500/10 text-teal-400 border-none font-bold text-[10px] px-3 py-1 uppercase tracking-wider">Live View</Badge>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#475569" 
                      fontSize={11} 
                      fontWeight={500}
                      tickLine={false} 
                      axisLine={false}
                      dy={15}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={11} 
                      fontWeight={500}
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', padding: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#14b8a6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                      animationDuration={2000}
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col h-full">
           <h3 className="text-lg font-bold mb-8">Recent Activity</h3>
           <div className="space-y-8 flex-1">
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="flex gap-4 group cursor-pointer">
                   <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-teal-500/20 group-hover:border-teal-500/40 transition-all">
                      <Clock className="w-4 h-4 text-slate-500 group-hover:text-teal-400" />
                   </div>
                   <div className="flex-1 border-b border-white/5 pb-4 group-last:border-0">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{b.purpose || 'Resource Booking'}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Asset {b.resourceId.slice(-4)}</span>
                         <div className="w-1 h-1 rounded-full bg-slate-700" />
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{b.status}</span>
                      </div>
                   </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center gap-4">
                   <Activity className="w-10 h-10 text-slate-800" />
                   <p className="text-sm text-slate-600 font-medium">No activity recorded yet.</p>
                </div>
              )}
           </div>
           <Button variant="ghost" className="w-full mt-6 text-xs font-bold text-slate-500 hover:text-white transition-colors h-11 border border-white/5 rounded-xl">
              View Audit Log
           </Button>
        </div>
      </div>
    </div>
  );
};
