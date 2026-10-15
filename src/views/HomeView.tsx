import React, { useState } from 'react';
import { ThreeMeshCanvas } from '../components/ThreeMeshCanvas';
import { 
  ShieldCheck, 
  ArrowDown, 
  Terminal, 
  Barcode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Zap, 
  FileCheck, 
  Lock, 
  Cpu, 
  Route, 
  QrCode, 
  Sparkles,
  ExternalLink,
  Radio,
  Fingerprint,
  Building2,
  Database,
  Layers,
  Scale,
  Gauge,
  Scan,
  Shield,
  RefreshCw
} from 'lucide-react';
import { verifyBarcodeInLedger } from '../data/mockBlockchain';
import { ProductItem } from '../types';

interface HomeViewProps {
  onSelectTab: (tab: string) => void;
  onVerifyBarcode: (barcode: string) => void;
  productsMap?: Record<string, ProductItem>;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab, onVerifyBarcode, productsMap = {} }) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [quickResult, setQuickResult] = useState<ProductItem | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleQuickVerify = (codeToTest?: string) => {
    const code = (codeToTest !== undefined ? codeToTest : barcodeInput).trim();
    if (!code) return;
    setIsVerifying(true);
    setTimeout(() => {
      const found = verifyBarcodeInLedger(code, productsMap);
      setQuickResult(found);
      setIsVerifying(false);
    }, 350);
  };

  const setSample = (code: string) => {
    setBarcodeInput(code);
    handleQuickVerify(code);
  };


  return (
    <div className="w-full">
      {/* HERO SECTION WITH EMBEDDED 3D WEBGL ENGINE */}
      <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
        {/* Ambient Radial Aura Gradients */}
        <div className="absolute -top-32 left-1/4 w-[640px] h-[640px] rounded-full bg-sky-200/30 blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-[-10%] w-[520px] h-[520px] rounded-full bg-emerald-200/30 blur-[140px] pointer-events-none -z-10"></div>

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            
            {/* Live Ledger Badge Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-mono text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                Protocol v2.4 Active
              </span>
              <span className="text-slate-400 font-mono text-xs">·</span>
              <span className="font-mono text-xs text-slate-600">
                Zero-Knowledge Oracle Genesis
              </span>
            </div>

            {/* Headline with Sharp Contrast */}
            <div className="space-y-2">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
                Trust Every Product.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
                  Verify Every Scan.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Scan a barcode. Verify the product's digital identity. Discover authenticity records backed by immutable blockchain technology.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => onSelectTab('verify-product')}
                className="group relative inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-sm sm:text-base font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  <span>Verify a Product</span>
                </span>
              </button>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 font-heading text-sm sm:text-base font-medium shadow-xs transition-all backdrop-blur-md hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-1.5">
                  <span>Explore How It Works</span>
                  <ArrowDown className="w-4 h-4 text-slate-400" />
                </span>
              </a>
            </div>

            {/* Quick Test Barcode Bar with Interactive Dispatcher */}
            <div className="laser-beam-container w-full bg-white/95 border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-3 backdrop-blur-xl group">
              <div className="laser-beam-line"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-600 font-semibold">
                  <Terminal className="w-4 h-4 text-sky-600" />
                  <span>FAST HASH / BARCODE DISPATCHER</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Sepolia Node 0x94B
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Barcode className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickVerify()}
                    placeholder="Enter UPC-A, EAN-13, or GS1 Serial..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-inner"
                  />
                </div>
                
                <button
                  onClick={() => handleQuickVerify()}
                  disabled={isVerifying}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-heading text-xs sm:text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-xs disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isVerifying ? 'Verifying...' : 'Quick Verify'}</span>
                </button>
              </div>

              {/* Registered Items Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {Object.keys(productsMap).length > 0 ? (
                  <>
                    <span className="font-mono text-[11px] text-slate-500">Registered in Ledger:</span>
                    {Object.values(productsMap).slice(0, 3).map((item) => (
                      <button
                        key={item.barcode}
                        type="button"
                        onClick={() => setSample(item.barcode)}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono text-[11px] transition-colors flex items-center gap-1.5"
                      >
                        <span>{item.barcode}</span>
                        <span className="text-emerald-700 font-semibold">({item.brand.split(' ')[0]})</span>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Ledger ready for input · Enter any barcode above to audit</span>
                  </div>
                )}
              </div>


              {/* Dynamic Verification Feedback Drawer */}
              {quickResult && (
                <div className="mt-2 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in slide-in-from-top-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      {quickResult.status === 'GENUINE' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                      ) : quickResult.status === 'TAMPERED' ? (
                        <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      )}
                      
                      <div>
                        <div className="font-heading font-bold text-sm sm:text-base text-slate-900">
                          {quickResult.title}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">
                          TX: {quickResult.proof.txHash.slice(0, 10)}... · Block #{quickResult.proof.blockNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold border ${
                        quickResult.status === 'GENUINE'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : quickResult.status === 'TAMPERED'
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-rose-100 border-rose-300 text-rose-800'
                      }`}>
                        {quickResult.status} · {quickResult.proof.tokenStandard}
                      </span>
                      
                      <button
                        onClick={() => onVerifyBarcode(quickResult.barcode)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-emerald-700 hover:text-emerald-800 transition-colors"
                        title="View Full Cryptographic Audit Certificate"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right 3D Visualizer Canvas (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* 3D Scene Wrapper */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-white/95 border border-emerald-100/90 shadow-xl shadow-emerald-500/5 backdrop-blur-md">
              
              {/* Glass Top Header Bar */}
              <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="ml-2 font-mono text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Three.js Cryptographic Mesh Runtime
                  </span>
                </div>
                
                <div className="font-mono text-[11px] text-sky-700 font-medium flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span>60 FPS · Interactive Parallax</span>
                </div>
              </div>

              {/* Three.js Canvas Container */}
              <div className="w-full h-[460px] relative bg-gradient-to-br from-emerald-50/60 via-slate-50/80 to-cyan-50/40">
                <ThreeMeshCanvas />
              </div>

              {/* Floating Cryptographic Provenance Overlay Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 border border-slate-200 shadow-md flex items-center justify-between backdrop-blur-md animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading text-xs sm:text-sm text-slate-900 font-semibold">
                      Merkle Batch Node #41,209
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      Laser Verification Signature Ok
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-semibold">
                  0.0018s latency
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Trust & Network Proof Bar (Asymmetric Bento Highlight) */}
        <div className="max-w-[1440px] mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-4 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-slate-900">1.4M+</div>
              <div className="text-xs text-slate-600">
                Scans Verified across 840+ Authorized Manufacturers
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-4 hover:shadow-lg hover:border-sky-300 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-slate-900">0.000%</div>
              <div className="text-xs text-slate-600">
                Zero False Positives reported in Q1 2025 Ledger Audits
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-4 hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-slate-900">ERC-721 / 1155</div>
              <div className="text-xs text-slate-600">
                Standardized Authenticity Twin & Soulbound Cert Compliant
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: 4-STEP "HOW IT WORKS" FLOW */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-y border-slate-200/70" id="how-it-works">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-sky-700 uppercase tracking-widest font-semibold">
                <span className="w-2 h-2 rounded bg-sky-600"></span>
                End-To-End Mathematical Guarantee
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                How The Authentix Protocol Operates
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                From the camera aperture to decentralized consensus in less than 400 milliseconds. Here is the lifecycle of an authentic product scan.
              </p>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
              <span className="text-emerald-700 font-semibold">4 Verification Gates</span>
              <span>·</span>
              <span>Zero Knowledge Consensus</span>
            </div>
          </div>

          {/* 4 Stepper Cards with Continuous Dynamic Connector */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col p-6 rounded-2xl bg-white border border-slate-200 shadow-xs group hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-600 text-slate-900 group-hover:text-white flex items-center justify-center font-heading text-xl font-bold transition-colors shadow-2xs">
                  01
                </div>
                <QrCode className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-slate-900 mb-1.5">Scan Code</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                User scans EAN-13, UPC-A, or DataMatrix QR code via camera viewfinder or manual GS1 hardware entry.
              </p>
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-500">
                <span>Input Format</span>
                <span className="text-slate-900 font-semibold">GS1 / EAN13</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col p-6 rounded-2xl bg-white border border-slate-200 shadow-xs group hover:shadow-lg hover:border-sky-300 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-sky-600 text-slate-900 group-hover:text-white flex items-center justify-center font-heading text-xl font-bold transition-colors shadow-2xs">
                  02
                </div>
                <RefreshCw className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-slate-900 mb-1.5">Query Ledger</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Smart contract retrieves the registered digital twin and authenticated manufacturer genesis record directly on-chain.
              </p>
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-500">
                <span>Contract Protocol</span>
                <span className="text-sky-700 font-semibold">0x71F...Sepolia</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col p-6 rounded-2xl bg-white border border-slate-200 shadow-xs group hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-amber-600 text-slate-900 group-hover:text-white flex items-center justify-center font-heading text-xl font-bold transition-colors shadow-2xs">
                  03
                </div>
                <Fingerprint className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-slate-900 mb-1.5">Cryptographic Proof</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Compares physical serial numbers, timestamped batch proofs, and issuer ECDSA cryptographic signatures in real-time.
              </p>
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-500">
                <span>Validation Engine</span>
                <span className="text-amber-800 font-semibold">ECDSA secp256k1</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col p-6 rounded-2xl bg-white border border-slate-200 shadow-xs group hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-600 text-slate-900 group-hover:text-white flex items-center justify-center font-heading text-xl font-bold transition-colors shadow-2xs">
                  04
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-slate-900 mb-1.5">Instant Verdict</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Delivers transparent Verified, Mismatch, or Unregistered status with cryptographic audit logs and immutable chain certificate.
              </p>
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-500">
                <span>Audit Result</span>
                <span className="text-emerald-700 font-bold">100% Immutable</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: ANTI-COUNTERFEITING ARCHITECTURAL PILLARS */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
          
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs text-emerald-700 font-semibold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Architectural Superiority
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
              Three Pillars of Zero-Counterfeit Verification
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Built to withstand organized fraud syndicates, label duplication attacks, and physical repackaging.
            </p>
          </div>

          {/* Bento Grid Architectural Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pillar Card 1 */}
            <div className="flex flex-col rounded-2xl bg-white border border-slate-200 p-8 shadow-xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-emerald-700" />
              </div>
              <div className="font-mono text-xs text-emerald-700 font-semibold uppercase mb-1">
                Cryptographic Pairing
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                Double-Layer Security
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Barcode identification is paired with on-chain cryptographic soulbound certificates. Photocopying or duplicating physical labels fails instantly because each physical item requires an unspent cryptographic mint receipt.
              </p>

              {/* Rich Mini Telemetry Visualizer */}
              <div className="mt-auto p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-600">Twin Entropy Score</span>
                  <span className="text-emerald-700 font-semibold">256-bit Secure</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full w-[94%]"></div>
                </div>
                <div className="font-mono text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Physical UPC Tag</span>
                  <span className="text-slate-700 font-medium">Soulbound ERC-5192</span>
                </div>
              </div>
            </div>

            {/* Pillar Card 2 */}
            <div className="flex flex-col rounded-2xl bg-white border border-slate-200 p-8 shadow-xs hover:shadow-lg hover:border-sky-300 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-6">
                <Scale className="w-8 h-8 text-sky-700" />
              </div>
              <div className="font-mono text-xs text-sky-700 font-semibold uppercase mb-1">
                Heuristic Consensus
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                Zero Trust Verification
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Never assume a barcode alone is genuine. AUTHENTIX verifies serial numbers against Merkle root trees and decentralized consensus validators before issuing a trusted verdict.
              </p>

              {/* Merkle Visualizer Graphic */}
              <div className="mt-auto p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-600">Merkle Root Status</span>
                  <span className="text-sky-700 font-semibold">Root Hash Valid</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 py-1">
                  <div className="h-7 rounded bg-sky-100 border border-sky-200 flex items-center justify-center font-mono text-[11px] text-sky-800 font-semibold">H₁</div>
                  <div className="h-7 rounded bg-sky-100 border border-sky-200 flex items-center justify-center font-mono text-[11px] text-sky-800 font-semibold">H₂</div>
                  <div className="h-7 rounded bg-sky-100 border border-sky-200 flex items-center justify-center font-mono text-[11px] text-sky-800 font-semibold">H₃</div>
                  <div className="h-7 rounded bg-sky-100 border border-sky-200 flex items-center justify-center font-mono text-[11px] text-sky-800 font-semibold">H₄</div>
                </div>
                <div className="font-mono text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Keccak256 Proof</span>
                  <span className="text-slate-800 font-medium">Verified Depth 12</span>
                </div>
              </div>
            </div>

            {/* Pillar Card 3 */}
            <div className="flex flex-col rounded-2xl bg-white border border-slate-200 p-8 shadow-xs hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <Route className="w-8 h-8 text-amber-700" />
              </div>
              <div className="font-mono text-xs text-amber-700 font-semibold uppercase mb-1">
                Lifecycle Provenance
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                Supply Chain Traceability
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Follow every product milestone from factory genesis seal to shipping hub, customs validation, and retail shelf with immutable timestamped block signatures.
              </p>

              {/* Timeline Mini Node Visualizer */}
              <div className="mt-auto p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-600">Active Custody Path</span>
                  <span className="text-emerald-700 font-bold">5 Checkpoints</span>
                </div>
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0"></span>
                  <span className="h-0.5 flex-1 bg-emerald-600"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0"></span>
                  <span className="h-0.5 flex-1 bg-emerald-600"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0"></span>
                  <span className="h-0.5 flex-1 bg-sky-500 animate-pulse flex-shrink-0"></span>
                  <span className="h-0.5 flex-1 bg-slate-300"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 flex-shrink-0"></span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Factory → Hub → Port</span>
                  <span className="text-sky-700 font-semibold">In Retail Custody</span>
                </div>
                <button
                  onClick={() => onSelectTab('geo-tracker')}
                  className="mt-2 w-full py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors border border-emerald-200"
                >
                  <span>Launch Factory & Shop Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION BANNER FOR BRANDS & REVIEWERS */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-100/80 p-8 sm:p-12 shadow-md">
          
          {/* Glow ambient backdrop inside banner */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-200/40 blur-[90px] pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-sky-200/40 blur-[90px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>ENTERPRISE & HACKATHON LIVE DEPLOYMENT</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                Protect Your Catalog. Verify With Mathematical Certainty.
              </h2>
              
              <p className="text-sm sm:text-base text-slate-700">
                Whether you are an authorized manufacturer looking to issue cryptographic batch certificates or a reviewer auditing our smart contracts, AUTHENTIX delivers instantaneous on-chain verification.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
                <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Gasless Verify Ready</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 font-medium">
                  <Database className="w-4 h-4 text-sky-600" />
                  <span>IPFS Metadata Redundancy</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 font-medium">
                  <Gauge className="w-4 h-4 text-amber-600" />
                  <span>Sub-second Latency</span>
                </div>
              </div>
            </div>

            {/* Action Links Split */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
              <button
                onClick={() => onSelectTab('verify-product')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-base font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Scan className="w-5 h-5" />
                <span>Launch Web Scanner</span>
              </button>

              <button
                onClick={() => onSelectTab('manufacturer-portal')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-emerald-700 font-heading text-sm font-semibold shadow-xs transition-all"
              >
                <Building2 className="w-5 h-5" />
                <span>Manufacturer Portal</span>
              </button>

              <button
                onClick={() => onSelectTab('blockchain-explorer')}
                className="inline-flex items-center justify-center gap-1.5 font-mono text-xs text-sky-700 hover:text-sky-900 font-semibold transition-colors py-1"
              >
                <span>Inspect Sepolia Smart Contracts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
