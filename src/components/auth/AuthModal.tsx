import React, { useState } from 'react';
import { User, UserRole, LSPProfile } from '../../types';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Building, 
  Phone, 
  Eye, 
  EyeOff, 
  Key, 
  ShieldCheck, 
  Package, 
  Ship, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  X,
  Sparkles,
  FileText
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onLoginSuccess: (user: User, token: string) => void;
  onRegisterSuccess: (newUser: User, newLspProfile: LSPProfile | undefined, token: string) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  onRegisterSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('trader@craftsexports.in');
  const [loginPassword, setLoginPassword] = useState('CargoSpace2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Signup Form State
  const [signupRole, setSignupRole] = useState<UserRole>('trader');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  // LSP specific signup fields
  const [signupIecCode, setSignupIecCode] = useState('');
  const [signupGstin, setSignupGstin] = useState('');
  const [signupServedPorts, setSignupServedPorts] = useState<string[]>([
    'JNPT Nhava Sheva', 'Mundra Port'
  ]);

  if (!isOpen) return null;

  // Generate realistic JWT token string
  const createMockJWT = (userId: string, role: UserRole) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: userId, role, exp: Date.now() + 86400 * 1000 }));
    const signature = btoa('cargospace_hmac_secret_key');
    return `${header}.${payload}.${signature}`;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Find matching user by email (case-insensitive)
    const matchedUser = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());

    if (!matchedUser) {
      setAuthError('No account found with this email address. Please sign up first.');
      return;
    }

    // Verify password if set, or accept default demo credentials
    if (matchedUser.password && matchedUser.password !== loginPassword) {
      setAuthError('Invalid password. Please check your credentials.');
      return;
    }

    const jwtToken = createMockJWT(matchedUser.id, matchedUser.role);
    localStorage.setItem('cargospace_jwt_token', jwtToken);
    onLoginSuccess(matchedUser, jwtToken);
    onClose();
  };

  const handleQuickDemoLogin = (email: string) => {
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      const jwtToken = createMockJWT(matchedUser.id, matchedUser.role);
      localStorage.setItem('cargospace_jwt_token', jwtToken);
      onLoginSuccess(matchedUser, jwtToken);
      onClose();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!signupName || !signupEmail || !signupPassword || !signupCompany) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    const existingUser = users.find(u => u.email.toLowerCase() === signupEmail.toLowerCase());
    if (existingUser) {
      setAuthError('An account with this email address already exists.');
      return;
    }

    const newUserId = `usr_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      email: signupEmail,
      password: signupPassword,
      name: signupName,
      role: signupRole,
      companyName: signupCompany,
      phone: signupPhone || '+91 98765 99999',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`
    };

    let newLspProfile: LSPProfile | undefined = undefined;
    if (signupRole === 'lsp') {
      newLspProfile = {
        id: `lsp_${Date.now()}`,
        userId: newUserId,
        companyName: signupCompany,
        iecCode: signupIecCode || '0519999999',
        gstin: signupGstin || '27AAAAA9999A1Z1',
        status: 'pending', // Starts pending admin inspection approval!
        servedPorts: signupServedPorts,
        inspectionChecklist: {
          kycDocumentVerified: true,
          icegateIntegrationVerified: false,
          physicalWarehouseAudited: false,
          insuranceCoverageVerified: true,
          hazmatHandlingPermit: false
        },
        rating: 5.0,
        completedShipments: 0
      };
    }

    const jwtToken = createMockJWT(newUserId, signupRole);
    localStorage.setItem('cargospace_jwt_token', jwtToken);
    onRegisterSuccess(newUser, newLspProfile, jwtToken);
    onClose();
  };

  const togglePortSelection = (port: string) => {
    if (signupServedPorts.includes(port)) {
      setSignupServedPorts(signupServedPorts.filter(p => p !== port));
    } else {
      setSignupServedPorts([...signupServedPorts, port]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-blue-500/40 shadow-2xl relative my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 mx-auto mb-2 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold font-outfit text-white">CargoSpace Authentication</h2>
          <p className="text-xs text-slate-400 mt-0.5">Secure JWT Access Control &amp; Role-Based Identity</p>
        </div>

        {/* Tab Switcher (Login vs Signup) */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            onClick={() => { setMode('login'); setAuthError(null); }}
            className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In (Login)
          </button>
          <button
            onClick={() => { setMode('signup'); setAuthError(null); }}
            className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'signup'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Error Notification */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="name@company.com"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="••••••••••••"
                  required
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 text-xs cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate &amp; Generate JWT Token</span>
            </button>

            {/* Quick 1-Click Demo Login Options */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="text-[10px] text-slate-400 font-mono uppercase text-center flex items-center justify-center space-x-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Quick Demo Login Shortcut:</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('trader@craftsexports.in')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/40 text-[11px] font-semibold text-blue-300 transition text-center"
                >
                  <Package className="w-3.5 h-3.5 mx-auto mb-1 text-blue-400" />
                  <span>Trader</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('lsp@apexlogistics.com')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-semibold text-cyan-300 transition text-center"
                >
                  <Ship className="w-3.5 h-3.5 mx-auto mb-1 text-cyan-400" />
                  <span>LSP</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@cargospace.com')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-[11px] font-semibold text-indigo-300 transition text-center"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-400" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {/* Role Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Account Persona Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSignupRole('trader')}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center transition ${
                    signupRole === 'trader'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Trader (Exporter)
                </button>

                <button
                  type="button"
                  onClick={() => setSignupRole('lsp')}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center transition ${
                    signupRole === 'lsp'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  LSP Consolidator
                </button>

                <button
                  type="button"
                  onClick={() => setSignupRole('admin')}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center transition ${
                    signupRole === 'admin'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Admin Inspector
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Representative Name</label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Rahul Verma"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email Address</label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                placeholder="rahul@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Registered Name</label>
              <input
                type="text"
                value={signupCompany}
                onChange={(e) => setSignupCompany(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Apex Global Exports Ltd"
                required
              />
            </div>

            {/* Role specific fields for LSP */}
            {signupRole === 'lsp' && (
              <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">IEC Import-Export Code</label>
                  <input
                    type="text"
                    value={signupIecCode}
                    onChange={(e) => setSignupIecCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono"
                    placeholder="10-digit IEC"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={signupGstin}
                    onChange={(e) => setSignupGstin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono"
                    placeholder="15-digit GSTIN"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 text-xs cursor-pointer mt-2"
            >
              <UserIcon className="w-4 h-4" />
              <span>Register Account &amp; Log In Immediately</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
