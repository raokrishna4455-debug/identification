import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-16">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Node Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
                AUTHENTIX
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-semibold">
                LEDGER v2.4
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Building trust through verifiable product identity with decentralized consensus and zero-knowledge provenance verification.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-xs text-emerald-700 font-semibold">
                Sepolia Node Verified
              </span>
            </div>
          </div>

          {/* Col 2: Verification Suite */}
          <div className="space-y-3">
            <div className="font-heading text-sm font-semibold text-slate-900">
              Verification Suite
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <button 
                  onClick={() => onSelectTab('verify-product')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Barcode & QR Lookup
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('authenticity-dashboard')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Registry Metrics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('blockchain-explorer')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Merkle Proof Engine
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('geo-tracker')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Factory & Shop Geo-Tracker
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('manufacturer-portal')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Batch Cryptographic Minting
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Protocol & Developers */}
          <div className="space-y-3">
            <div className="font-heading text-sm font-semibold text-slate-900">
              Protocol & Developers
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <button
                  onClick={() => onSelectTab('blockchain-explorer')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Etherscan Sepolia Contract</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('blockchain-explorer')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <span>API Documentation & ABI</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('blockchain-explorer')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Zero-Knowledge Snark Circuit Specs</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('auth')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Sign In / Identity Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('blockchain-explorer')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Node Telemetry Specs</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hackathon Showcase */}
          <div className="space-y-3">
            <div className="font-heading text-sm font-semibold text-slate-900">
              Hackathon Showcase
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="font-heading text-xs font-semibold text-sky-700 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                SIH Presentation Deployment
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed and engineered for national-level innovation track in tamper-evident supply chain traceability.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2025 AUTHENTIX Foundation</span>
            <span>·</span>
            <span>All Cryptographic Proofs On-Chain</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sky-700 font-medium">Gas: 14.2 Gwei</span>
            <span className="text-emerald-700 font-semibold">Status: Consensus Optimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
