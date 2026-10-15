import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Wallet, 
  Building2, 
  Store, 
  UserCheck, 
  FileCheck2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigateHome: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields - clean slate without preloaded dummy credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('manufacturer');
  const [organization, setOrganization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (mode === 'signup' && !agreedTerms) {
      setErrorMsg('Please accept the Authentix Protocol Terms & Cryptographic Standards to register.');
      setIsLoading(false);
      return;
    }

    if (!email || !password) {
      setErrorMsg('Please provide a valid email and password.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      const userProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name || (email.split('@')[0].toUpperCase()),
        email: email,
        role: role,
        organization: organization || (role === 'manufacturer' ? 'Authorized Brand' : 'Authentix Member'),
        licenseNumber: licenseNumber,
        walletAddress: '0x7F2e918c42a8b9e1028374829104829108a9D882',
        avatarUrl: '',
        joinedDate: new Date().toISOString()
      };
      onLoginSuccess(userProfile);
    }, 700);
  };

  const handleWeb3WalletSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userProfile: UserProfile = {
        id: `usr-wallet-${Date.now()}`,
        name: 'Sepolia Wallet Signer',
        email: '0x7F2e...8a9D@sepolia.eth',
        role: 'auditor',
        organization: 'Ethereum Sepolia Keypair',
        walletAddress: '0x7F2e918c42a8b9e1028374829104829108a9D882',
        joinedDate: new Date().toISOString()
      };
      onLoginSuccess(userProfile);
    }, 600);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotModalOpen(false);
    }, 2500);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
        
        {/* Left Branding & Protocol Guarantee Column (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-sky-500/10 blur-[90px] pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div 
              onClick={onNavigateHome}
              className="inline-flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl text-white tracking-tight">
                  AUTHENTIX
                </span>
                <span className="font-mono text-[10px] text-emerald-400">
                  PROTOCOL v2.4 · ETH SEPOLIA
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                Institutional Authenticity. Zero-Counterfeit Consensus.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect to the decentralized product registry. Issue cryptographically paired digital twins, track physical custody handovers, and audit immutable supply chain records.
              </p>
            </div>

            {/* Protocol Pillars */}
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-white">Zero-Knowledge Oracle Genesis</span>
                  <p className="text-slate-400 mt-0.5">Prove authenticity without leaking sensitive manufacturing recipes.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-white">ERC-5192 Soulbound Twins</span>
                  <p className="text-slate-400 mt-0.5">Non-transferable unspent warranties bind directly to verified serials.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-white">GPS & IoT Cold-Chain Surveillance</span>
                  <p className="text-slate-400 mt-0.5">Detect geofence departures and temperature anomalies in real-time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Stat */}
          <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>24/24 Sepolia Validators</span>
            <span className="text-emerald-400 font-semibold">100% Defense Rate</span>
          </div>
        </div>

        {/* Right Authentication Form Column (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          
          {/* Header Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                {mode === 'login' ? 'Sign In to Your Account' : 'Create Authentix Identity'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {mode === 'login' 
                  ? 'Access the manufacturer console, verification suites, and telemetry.' 
                  : 'Register as an authorized brand, boutique retailer, or independent auditor.'}
              </p>
            </div>

            {/* Toggle Mode Pill */}
            <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className={`px-4 py-1.5 rounded-lg font-heading text-xs font-semibold transition-all ${
                  mode === 'login' 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                className={`px-4 py-1.5 rounded-lg font-heading text-xs font-semibold transition-all ${
                  mode === 'signup' 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>



          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Signup: Role Selector Cards */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="block text-xs font-heading font-semibold text-slate-700">
                  Select Your Operational Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'manufacturer', label: 'Brand Manufacturer', icon: Building2, desc: 'Batch Minting' },
                    { id: 'retailer', label: 'Retail Boutique', icon: Store, desc: 'Shop Intake' },
                    { id: 'customs', label: 'Customs Officer', icon: FileCheck2, desc: 'Port Clearance' },
                    { id: 'auditor', label: 'Consumer Auditor', icon: UserCheck, desc: 'Scan & Verify' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as UserRole)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        role === item.id
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 mb-1.5 ${role === item.id ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <div className="font-heading font-semibold text-xs leading-snug">{item.label}</div>
                      <div className="font-mono text-[10px] text-slate-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Name (if Signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Authorized Representative
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marc Jacobs or Dr. Klaus Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Organization / License (if Signup or Manufacturer/Retailer) */}
            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rolex SA, Zeiss AG"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GS1 Organization / License ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GS1-GLN-88204"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setForgotModalOpen(true); setForgotEmail(email); }}
                    className="text-xs text-emerald-700 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox: Remember me or Terms */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              {mode === 'login' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>I agree to Authentix Protocol Standards & Cryptographic Terms</span>
                </label>
              )}
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating with Sepolia Node...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Console' : 'Register Cryptographic Identity'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Web3 Sign-In */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[11px] font-mono">OR WEB3 NATIVE IDENTITY</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleWeb3WalletSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200"
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Sign In with Ethereum (Sepolia Keypair 0x7F2...8a9D)</span>
            </button>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
              Reset Authentix Credentials
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your work email address to receive an ECDSA signature challenge link.
            </p>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold">Challenge Link Sent!</div>
                <div>Check {forgotEmail} for password recovery instructions.</div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold"
                  >
                    Send Recovery Challenge
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-heading text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
