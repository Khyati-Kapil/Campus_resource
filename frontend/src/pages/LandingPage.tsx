import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  CalendarDays, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Box,
  Microscope,
  Search,
  Cpu,
  Lock,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#14b8a6] selection:text-black font-sans">
      {/* SOLID NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-black border-b-4 border-zinc-900 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14b8a6] flex items-center justify-center">
            <Building2 className="text-black w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase">CampusSync</span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10">
          {['Resources', 'Workflow', 'Security', 'Enterprise'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <NavLink to="/auth">
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white">Sign In</Button>
          </NavLink>
          <NavLink to="/auth">
            <Button className="h-12 px-8 rounded-xl bg-[#14b8a6] hover:bg-teal-500 text-black font-black uppercase text-[10px] tracking-[0.2em] border-none shadow-lg shadow-teal-500/10">
              Get Started
            </Button>
          </NavLink>
        </div>
      </header>

      <main className="pt-20">
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 pt-32 pb-48 border-b-8 border-zinc-900">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block px-5 py-2 rounded-full bg-[#84cc16] text-black text-[10px] font-black uppercase tracking-[0.4em] mb-12"
              >
                Next-Generation Campus OS
              </motion.div>
              
              <h1 className="text-6xl lg:text-[7.5rem] font-black tracking-tighter mb-12 leading-[0.85] uppercase">
                Control <br /> Your <span className="text-[#14b8a6]">Campus</span> <br /> Assets.
              </h1>
              
              <p className="text-2xl font-bold text-zinc-500 max-w-2xl mb-16 uppercase tracking-tight leading-relaxed">
                Centralized orchestration for rooms, laboratories, and high-value equipment. Precise scheduling. zero conflicts. Absolute governance.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <NavLink to="/auth">
                  <Button className="h-24 px-16 rounded-[2.5rem] bg-white text-black hover:bg-zinc-200 text-2xl font-black uppercase tracking-widest border-none shadow-2xl transition-transform hover:scale-105">
                    Start Now <ArrowRight className="ml-4 w-8 h-8" />
                  </Button>
                </NavLink>
                <Button variant="outline" className="h-24 px-12 rounded-[2.5rem] border-8 border-zinc-900 hover:bg-zinc-900 text-2xl font-black uppercase tracking-widest">
                  Watch Demo
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-[#111111] border-8 border-zinc-900 rounded-[4rem] p-12 aspect-square flex flex-col justify-between"
               >
                  <div className="flex justify-between">
                     <div className="w-24 h-24 rounded-[2.5rem] bg-[#a78bfa] flex items-center justify-center shadow-2xl shadow-purple-500/10">
                        <Cpu className="text-black w-12 h-12" />
                     </div>
                     <div className="w-24 h-24 rounded-[2.5rem] bg-[#84cc16] flex items-center justify-center shadow-2xl shadow-lime-500/10">
                        <Zap className="text-black w-12 h-12" />
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="h-4 bg-zinc-900 rounded-full w-full" />
                     <div className="h-4 bg-zinc-900 rounded-full w-3/4" />
                     <div className="h-16 bg-[#14b8a6] rounded-3xl w-full flex items-center justify-center text-black font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20">
                        Access Verified
                     </div>
                  </div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* CORE UTILITY (SOLID BENTO) */}
        <section id="resources" className="container mx-auto px-6 py-40 border-b-8 border-zinc-900">
           <div className="text-center mb-24">
              <h2 className="text-5xl lg:text-7xl font-black uppercase leading-[0.9] mb-8">Unified <span className="text-[#a78bfa]">Governance</span></h2>
              <p className="text-xl text-zinc-500 font-bold uppercase tracking-widest max-w-2xl mx-auto">One platform to rule every laboratory, auditorium, and digital device on campus.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-10">
              {[
                { title: 'Room Hub', desc: 'Real-time booking for lecture halls, labs, and collaborative spaces.', icon: Building2, color: 'bg-[#14b8a6]' },
                { title: 'Asset Logic', desc: 'Secure tracking and access logs for high-value research equipment.', icon: Microscope, color: 'bg-[#a78bfa]' },
                { title: 'Conflict Shield', desc: 'Institutional-grade prevention engine for zero scheduling overlaps.', icon: ShieldCheck, color: 'bg-[#84cc16]' },
              ].map((f, i) => (
                <motion.div key={f.title} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                   <div className="p-14 rounded-[3.5rem] bg-[#111111] border-8 border-zinc-900 hover:border-zinc-700 transition-all h-full flex flex-col justify-between group">
                      <div className={`w-20 h-20 rounded-[2rem] ${f.color} flex items-center justify-center mb-12 shadow-2xl transition-transform group-hover:scale-110`}>
                         <f.icon className="w-10 h-10 text-black" />
                      </div>
                      <div>
                         <h3 className="text-4xl font-black mb-6 uppercase leading-none">{f.title}</h3>
                         <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest leading-relaxed">{f.desc}</p>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* WORKFLOW ENGINE */}
        <section id="workflow" className="container mx-auto px-6 py-40 bg-zinc-950">
           <div className="flex flex-col lg:flex-row gap-24 items-center max-w-7xl mx-auto">
              <div className="lg:w-1/2">
                 <h2 className="text-6xl font-black uppercase leading-[0.85] mb-12">Engineered <br /> for <span className="text-[#14b8a6]">Speed.</span></h2>
                 <p className="text-2xl font-bold text-zinc-500 uppercase leading-relaxed mb-16">Remove the friction of institutional logistics. Automated routing. Instant approvals. Seamless flow.</p>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="p-10 bg-black border-4 border-zinc-900 rounded-[3rem]">
                       <p className="text-5xl font-black text-[#84cc16] mb-2">99%</p>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Efficiency</p>
                    </div>
                    <div className="p-10 bg-black border-4 border-zinc-900 rounded-[3rem]">
                       <p className="text-5xl font-black text-[#a78bfa] mb-2">Zero</p>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Conflicts</p>
                    </div>
                 </div>
              </div>
              <div className="lg:w-1/2 w-full">
                 <div className="bg-[#111111] border-8 border-zinc-900 rounded-[4rem] p-16 space-y-12">
                    {[
                      { step: '01', title: 'Find Asset', icon: Search },
                      { step: '02', title: 'Request Use', icon: Zap },
                      { step: '03', title: 'Confirmed', icon: CheckCircle2 },
                    ].map(s => (
                      <div key={s.step} className="flex items-center gap-8 group">
                         <div className="w-20 h-20 rounded-[2rem] bg-black border-4 border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-[#14b8a6] transition-colors">
                            <s.icon className="w-8 h-8 text-zinc-700 group-hover:text-[#14b8a6]" />
                         </div>
                         <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 mb-2">Step {s.step}</p>
                            <h4 className="text-2xl font-black uppercase">{s.title}</h4>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* FINAL DEPLOYMENT CTA */}
        <section className="container mx-auto px-6 py-48 text-center">
           <div className="bg-[#14b8a6] rounded-[5rem] p-24 lg:p-40 flex flex-col items-center text-black">
              <h2 className="text-6xl lg:text-[9rem] font-black mb-16 leading-[0.8] tracking-tighter uppercase">Deploy <br /> Now.</h2>
              <p className="text-2xl font-black uppercase tracking-[0.2em] mb-20 text-black/50">Modernize your institutional infrastructure today.</p>
              <div className="flex flex-col sm:flex-row gap-10 w-full justify-center">
                 <NavLink to="/auth" className="w-full sm:w-auto">
                   <Button className="h-24 px-20 rounded-[3rem] bg-black text-white hover:bg-zinc-900 text-3xl font-black uppercase tracking-widest border-none shadow-2xl">
                      Start Now
                   </Button>
                 </NavLink>
                 <Button variant="outline" className="h-24 px-16 rounded-[3rem] border-8 border-black hover:bg-black/10 text-3xl font-black uppercase tracking-widest w-full sm:w-auto">
                    Contact Sales
                 </Button>
              </div>
           </div>
        </section>
      </main>

      {/* SOLID FOOTER */}
      <footer className="border-t-8 border-zinc-900 py-32 bg-black">
         <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
               <div className="lg:col-span-6">
                  <div className="flex items-center gap-5 mb-12">
                     <div className="w-14 h-14 rounded-[1.5rem] bg-[#14b8a6] flex items-center justify-center">
                        <Building2 className="text-black w-8 h-8" />
                     </div>
                     <span className="text-4xl font-black uppercase tracking-tighter">CampusSync</span>
                  </div>
                  <p className="text-zinc-600 font-bold uppercase tracking-tight text-base leading-relaxed max-w-lg mb-12">
                     The institutional standard for resource management. Precision. Governance. Scalability.
                  </p>
                  <div className="flex gap-8">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-16 h-16 rounded-[2rem] bg-[#111111] border-4 border-zinc-900 flex items-center justify-center hover:bg-[#14b8a6] transition-all cursor-pointer group">
                          <Globe className="w-7 h-7 text-zinc-700 group-hover:text-black" />
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="lg:col-span-6 grid grid-cols-2 gap-20">
                  {['Product', 'Enterprise'].map(group => (
                    <div key={group}>
                       <h5 className="font-black text-xs uppercase tracking-[0.4em] text-zinc-800 mb-10">{group}</h5>
                       <ul className="space-y-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          <li className="hover:text-white cursor-pointer transition-colors">Resource Registry</li>
                          <li className="hover:text-white cursor-pointer transition-colors">Conflict Engine</li>
                          <li className="hover:text-white cursor-pointer transition-colors">Audit Analytics</li>
                          <li className="hover:text-white cursor-pointer transition-colors">Security Protocol</li>
                       </ul>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="pt-16 border-t-8 border-zinc-900 flex justify-between items-center text-[11px] font-black uppercase tracking-[0.5em] text-zinc-800">
               <p>© 2026 CampusSync OS. Powering Academia.</p>
               <div className="flex gap-16">
                  <span className="hover:text-white cursor-pointer">Privacy</span>
                  <span className="hover:text-white cursor-pointer">Security</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};
