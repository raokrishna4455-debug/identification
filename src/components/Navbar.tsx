import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Wallet, 
  Layers, 
  BarChart3, 
  Binary, 
  Building2, 
  Menu, 
  X,
  ExternalLink,
  Copy,
  Check,
  Fuel,
  RefreshCw,
  MapPin,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenQuickScan?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  onSelectTab, 
  onOpenQuickScan,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const walletAddress = currentUser?.walletAddress || '0x7F2e918c42a8b9e1028374829104829108a9D882';

  const copyWallet = () => {
    navigator.clipboard?.writeText(walletAddress);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Layers },
    { id: 'verify-product', label: 'Verify Product', icon: QrCode },
    { id: 'geo-tracker', label: 'Geo-Tracker', icon: MapPin },
    { id: 'authenticity-dashboard', label: 'Authenticity Dashboard', icon: BarChart3 },
    { id: 'blockchain-explorer', label: 'Blockchain Explorer', icon: Binary },
    { id: 'manufacturer-portal', label: 'Manufacturer Portal', icon: Building2 },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_1px_12px_rgba(15,23,42,0.04)]">
        <div className="h-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Protocol Badge */}
          <div 
            onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 flex-shrink-0 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  AUTHENTIX
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] font-semibold">
                  v2.4
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-[11px] text-slate-500 font-medium">ETH Sepolia Network</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-4 py-2 rounded-lg font-heading text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Live Block Telemetry */}
            <div className="hidden 2xl:flex flex-col items-end">
              <span className="font-mono text-[11px] text-sky-700 font-semibold">
                12.4s block time · Sync 99.98%
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <span className="font-mono text-[11px] text-slate-500">Sepolia Consensus Active</span>
              </div>
            </div>

            {/* Wallet Chip */}
            <button
              onClick={() => setWalletModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 font-mono text-xs transition-colors shadow-xs"
              title="Click to view wallet & testnet balances"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-800">0x7F2...8a9D</span>
            </button>

            {/* Scan Barcode Primary CTA */}
            <button
              onClick={() => {
                onSelectTab('verify-product');
                if (onOpenQuickScan) onOpenQuickScan();
              }}
              className="relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-heading text-xs sm:text-sm font-semibold shadow-sm hover:bg-emerald-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Barcode</span>
            </button>

            {/* User Profile or Sign In CTA */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-slate-900 transition-colors shadow-2xs group"
                  title="Account Profile & Settings"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-heading font-semibold text-xs leading-tight text-slate-900 truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          {currentUser.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-heading font-bold text-sm text-slate-900 truncate">
                            {currentUser.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {currentUser.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-semibold capitalize">
                          {currentUser.role} Account
                        </span>
                        {currentUser.organization && (
                          <span className="text-[11px] text-slate-500 font-medium truncate">
                            {currentUser.organization}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-2.5 space-y-1">
                      <div className="text-[10px] font-mono uppercase font-semibold text-slate-400 px-2 mb-1">
                        Workspace Fast Links
                      </div>
                      
                      {currentUser.role === 'manufacturer' && (
                        <button
                          onClick={() => { onSelectTab('manufacturer-portal'); setProfileDropdownOpen(false); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-heading font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                        >
                          <span>Manufacturer Portal</span>
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      )}

                      <button
                        onClick={() => { onSelectTab('geo-tracker'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-heading font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Factory & Shop Geo-Tracker</span>
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => { onSelectTab('verify-product'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-heading font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Verify Product Certificate</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => { setWalletModalOpen(true); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-heading font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Sepolia Wallet & Gas</span>
                        <Wallet className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          if (onLogout) onLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          onSelectTab('auth');
                          setProfileDropdownOpen(false);
                        }}
                        className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                      >
                        Switch Identity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth();
                  else onSelectTab('auth');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-heading text-xs font-semibold transition-colors shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sign In / Sign Up</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-heading text-sm font-semibold transition-all flex items-center gap-3 text-left ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
            {currentUser ? (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-xs text-slate-900">{currentUser.name}</div>
                    <div className="text-[10px] text-emerald-700 capitalize font-mono">{currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onSelectTab('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-heading text-xs font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In or Create Account</span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-500 px-2">
              <span>Sepolia Testnet: Connected</span>
              <span className="text-emerald-600 font-semibold">14.2 Gwei</span>
            </div>
          </div>
        )}
      </header>

      {/* Connected Wallet Modal */}
      {walletModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setWalletModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">Sepolia Cryptographic Identity</h3>
                <p className="text-xs text-slate-500">Connected via Authentix Zero-Knowledge Web Provider</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Account Address</span>
                <span className="text-emerald-700 font-semibold">Verified Auditor</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-slate-800 break-all bg-white px-2 py-1 rounded border border-slate-200 flex-1">
                  {walletAddress}
                </span>
                <button
                  onClick={copyWallet}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex-shrink-0"
                  title="Copy address"
                >
                  {copiedWallet ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 mb-0.5">Testnet Balance</div>
                <div className="font-heading font-bold text-lg text-slate-900">2.418 SepoliaETH</div>
                <div className="text-[11px] text-emerald-600 font-mono">~$0.00 (Testnet Gas)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 mb-0.5">Authenticity Tokens</div>
                <div className="font-heading font-bold text-lg text-slate-900">14 Twins</div>
                <div className="text-[11px] text-sky-600 font-mono">Soulbound ERC-5192</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert('Testnet faucet requested: +0.5 SepoliaETH credited to wallet simulator.');
                }}
                className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-heading text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Request Testnet Faucet
              </button>
              <button
                onClick={() => setWalletModalOpen(false)}
                className="py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-heading text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
