import React, { useState } from 'react';
import { User, LSPProfile, UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/initialData';
import {
  Boxes, Ship, Package, ShieldCheck, Eye, EyeOff,
  ArrowRight, LogIn, UserPlus, Globe, Zap,
  Lock, Mail, Building2, Phone, User as UserIcon,
  CheckCircle2, Key
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User, token: string) => void;
  onRegisterSuccess: (newUser: User, newLspProfile?: LSPProfile, token?: string) => void;
}

const PLATFORM_STATS = [
  { label: 'Active LSPs', value: '48' },
  { label: 'Bookings / Mo', value: '1.2K' },
  { label: 'Avg. CBM Saved', value: '18%' },
  { label: 'Corridors', value: '12' },
];

const FEATURES = [
  { icon: ShieldCheck, text: 'Inspection-verified LSPs only' },
  { icon: Zap, text: 'Constraint-aware matching engine' },
  { icon: Lock, text: 'Atomic capacity holds & payments' },
  { icon: Globe, text: 'Real-time shipment milestone tracking' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onRegisterSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state - Prefilled with default trader credentials for seamless entry!
  const [loginEmail, setLoginEmail] = useState('trader@craftsexports.in');
  const [loginPassword, setLoginPassword] = useState('CargoSpace2026!');
  const [loginError, setLoginError] = useState('');

  // Register form state (Admin option excluded as per directive)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('trader');
  const [regError, setRegError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    // Match exact user or check against demo accounts
    const found = INITIAL_USERS.find(
      u => u.email.toLowerCase() === loginEmail.toLowerCase()
    );

    if (!found) {
      setLoginError('Invalid email address or unregistered account.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(found, `jwt_${found.role}_${Date.now()}`);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName || !regEmail || !regPassword || !regCompany) {
      setRegError('Please fill all required fields.');
      return;
    }

    setIsLoading(true);
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: regEmail,
      password: regPassword,
      name: regName,
      role: regRole, // 'trader' or 'lsp' only
      companyName: regCompany,
      phone: regPhone || '+91 98765 00000',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${regEmail}`,
    };

    let newLsp: LSPProfile | undefined;
    if (regRole === 'lsp') {
      newLsp = {
        id: `lsp_${Date.now()}`,
        userId: newUser.id,
        companyName: regCompany,
        iecCode: 'PENDING',
        gstin: 'PENDING',
        status: 'pending',
        servedPorts: [],
        inspectionChecklist: {
          kycDocumentVerified: false,
          icegateIntegrationVerified: false,
          physicalWarehouseAudited: false,
          insuranceCoverageVerified: false,
          hazmatHandlingPermit: false,
        },
        rating: 5.0,
        completedShipments: 0,
      };
    }

    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess(newUser, newLsp, `jwt_new_${regRole}_${Date.now()}`);
    }, 600);
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-[#070F1B] text-slate-100 font-sans moving-grid-bg">
      
      {/* ===== DYNAMIC MOVING BACKGROUND MESH BLOBS ===== */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/10 blur-[120px] pointer-events-none animate-blob-1 z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-teal-500/15 via-blue-600/15 to-indigo-600/10 blur-[140px] pointer-events-none animate-blob-2 z-0" />
      <div className="absolute top-[40%] right-[35%] w-[450px] h-[450px] rounded-full bg-cyan-400/10 blur-[130px] pointer-events-none animate-blob-3 z-0" />

      {/* ===== LEFT HERO PANEL ===== */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[54%] flex-col justify-between p-8 lg:p-12 xl:p-14 relative z-10 border-r border-slate-800/60 bg-slate-950/40 backdrop-blur-md overflow-hidden">
        
        {/* Brand Logo Header */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Boxes className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-outfit tracking-tight text-white">
              Cargo<span className="text-cyan-400">Space</span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-wide">Verified LCL Freight Platform</p>
          </div>
        </div>

        {/* Hero Central Content */}
        <div className="space-y-6 my-auto py-4">
          
          {/* Main Hero Typography */}
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black font-outfit text-white leading-[1.12]">
              Verified Shared <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                Freight Booking
              </span> <br />
              for Exporters
            </h1>
            <p className="text-sm xl:text-base text-slate-300 max-w-lg leading-relaxed font-sans">
              Connect with inspection-approved logistics providers. Publish, match, hold, and track LCL consolidations — all in one place with bank-grade security.
            </p>
          </div>

          {/* 2x2 Feature Cards */}
          <div className="grid grid-cols-2 gap-3 max-w-xl">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200 shadow-sm hover:border-cyan-500/40 transition">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <f.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold leading-tight">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Platform Stats Grid */}
          <div className="grid grid-cols-4 gap-3 max-w-xl pt-2 border-t border-slate-800/80">
            {PLATFORM_STATS.map((s, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center shadow-inner">
                <div className="text-2xl xl:text-3xl font-black font-mono text-cyan-400">{s.value}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Research Tag */}
        <div className="text-xs text-slate-400 font-mono">
          Final Year Major Project — Constraint-Aware LCL Matching Engine Research Prototype
        </div>

      </div>

      {/* ===== RIGHT AUTH FORM PANEL ===== */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 xl:p-16 relative z-10 my-auto overflow-hidden">
        
        {/* Mobile Header Logo */}
        <div className="flex lg:hidden items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg flex items-center justify-center">
            <Boxes className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold font-outfit text-white">
            Cargo<span className="text-cyan-400">Space</span>
          </div>
        </div>

        {/* FIXED LENGTH AUTH CONTAINER: h-[520px] for 100% Identical Height in Login & Register */}
        <div className="w-full max-w-md h-[520px] p-7 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-blue-500/30 shadow-2xl shadow-cyan-950/40 flex flex-col justify-between overflow-hidden">
          
          {/* Top Segmented Control Switcher */}
          <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold shrink-0">
            <button
              onClick={() => { setMode('login'); setLoginError(''); }}
              className={`w-1/2 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setMode('register'); setRegError(''); }}
              className={`w-1/2 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>

          {/* LOGIN FORM MODE */}
          {mode === 'login' && (
            <div className="flex-1 flex flex-col justify-between pt-4 animate-fadeIn space-y-3">
              <div>
                <h2 className="text-2xl font-bold font-outfit text-white">Welcome back</h2>
                <p className="text-xs text-slate-400 mt-1">Sign in to access your CargoSpace account &amp; bookings</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="trader@craftsexports.in"
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono transition"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1 font-mono">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono transition"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="text-xs p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Credentials Auto-Fill Box */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1.5">
                <div className="text-slate-400 font-semibold flex items-center justify-between text-[10px] uppercase tracking-wider">
                  <span className="text-cyan-400 font-bold">Quick Fill Demo Credentials:</span>
                  <span className="text-slate-500 font-normal">Click any role</span>
                </div>
                
                <div 
                  onClick={() => { setLoginEmail('trader@craftsexports.in'); setLoginPassword('CargoSpace2026!'); }}
                  className="flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-900 transition cursor-pointer"
                >
                  <span>Trader: <strong className="text-slate-100">trader@craftsexports.in</strong></span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">Fill</span>
                </div>

                <div 
                  onClick={() => { setLoginEmail('lsp@apexlogistics.com'); setLoginPassword('CargoSpace2026!'); }}
                  className="flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-900 transition cursor-pointer"
                >
                  <span>LSP: <strong className="text-slate-100">lsp@apexlogistics.com</strong></span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">Fill</span>
                </div>

                <div 
                  onClick={() => { setLoginEmail('admin@cargospace.com'); setLoginPassword('CargoSpace2026!'); }}
                  className="flex items-center justify-between text-slate-300 hover:text-white p-1 rounded hover:bg-slate-900 transition cursor-pointer"
                >
                  <span>Admin: <strong className="text-slate-100">admin@cargospace.com</strong></span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">Fill</span>
                </div>
              </div>

            </div>
          )}

          {/* REGISTER FORM MODE (Strictly Trader & LSP identities) */}
          {mode === 'register' && (
            <div className="flex-1 flex flex-col justify-between pt-4 animate-fadeIn space-y-3">
              <div>
                <h2 className="text-2xl font-bold font-outfit text-white">Create Account</h2>
                <p className="text-xs text-slate-400 mt-1">Join the CargoSpace freight consolidation network</p>
              </div>

              {/* Role Selection - Strictly Trader vs LSP */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5 font-mono">
                  Select Account Identity
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['trader', 'lsp'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegRole(r)}
                      className={`py-2 rounded-xl font-bold uppercase transition border cursor-pointer ${
                        regRole === r
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {r === 'trader' ? 'Trader Exporter' : 'Logistics Provider (LSP)'}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Full Name*</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Priya Sharma"
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Company Name*</label>
                    <input
                      type="text"
                      value={regCompany}
                      onChange={e => setRegCompany(e.target.value)}
                      placeholder="Apex Exports"
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Work Email Address*</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Password*</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Phone Number</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {regRole === 'lsp' && (
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300">
                    <strong>LSP Note:</strong> Physical warehouse &amp; ICEGATE inspection required after registration.
                  </div>
                )}

                {regError && (
                  <div className="text-xs p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300">
                    {regError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 cursor-pointer mt-1"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account &amp; Enter Platform</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-xs text-center text-slate-400 pt-1">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
