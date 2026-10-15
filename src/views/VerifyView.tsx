import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  Copy, 
  Check, 
  Share2, 
  Download, 
  ShieldAlert, 
  ExternalLink, 
  ArrowRight, 
  Thermometer, 
  Lock, 
  Layers, 
  Cpu, 
  Building2, 
  MapPin, 
  Clock, 
  FileText,
  RefreshCw,
  Sparkles,
  Route,
  Navigation
} from 'lucide-react';
import { verifyBarcodeInLedger } from '../data/mockBlockchain';
import { ProductItem } from '../types';

interface VerifyViewProps {
  initialBarcode?: string;
  productsMap?: Record<string, ProductItem>;
  onSelectTab: (tab: string) => void;
  onOpenTracker?: (barcode?: string) => void;
}

export const VerifyView: React.FC<VerifyViewProps> = ({ 
  initialBarcode, 
  productsMap = {}, 
  onSelectTab, 
  onOpenTracker 
}) => {
  const [barcodeInput, setBarcodeInput] = useState(initialBarcode || '');
  const [activeMode, setActiveMode] = useState<'camera' | 'manual' | 'upload'>('camera');
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [verificationStage, setVerificationStage] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Camera stream ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBarcode && initialBarcode.trim() !== '') {
      setBarcodeInput(initialBarcode);
      executeVerification(initialBarcode);
    }
  }, [initialBarcode]);


  // Handle camera preview toggle
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeMode === 'camera') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
          }
          setCameraActive(true);
          setCameraError(null);
        })
        .catch(() => {
          setCameraActive(false);
          setCameraError('Camera access not permitted or unavailable in iframe. Using high-fidelity optical scanner simulation.');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeMode]);

  const executeVerification = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setIsVerifying(true);
    setVerificationStage(1);

    // Simulated 4-stage pipeline
    setTimeout(() => setVerificationStage(2), 250);
    setTimeout(() => setVerificationStage(3), 500);
    setTimeout(() => setVerificationStage(4), 800);

    setTimeout(() => {
      const item = verifyBarcodeInLedger(trimmed, productsMap);
      setProduct(item);
      setIsVerifying(false);
      setVerificationStage(0);

      if (item.status === 'GENUINE') {
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#059669', '#10b981', '#0284c7', '#38bdf8']
          });
        } catch (_) {}
      }
    }, 1100);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const downloadCertificate = () => {
    if (!product) return;
    const certData = {
      platform: 'AUTHENTIX LEDGER v2.4',
      network: 'Ethereum Sepolia Testnet',
      timestamp: new Date().toISOString(),
      product: {
        barcode: product.barcode,
        title: product.title,
        brand: product.brand,
        serialNumber: product.serialNumber,
        batchNumber: product.batchNumber,
        status: product.status
      },
      cryptographicProof: product.proof,
      custodyCheckpoints: product.custodyPath
    };
    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `authentix-certificate-${product.barcode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const registeredItems = Object.values(productsMap);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-700 uppercase tracking-widest font-semibold mb-1">
            <span className="w-2 h-2 rounded bg-emerald-600"></span>
            Authentix Verification Lab
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Verify Product Authenticity
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Query the Sepolia blockchain ledger to validate product serial numbers, manufacturer signatures, and custody integrity.
          </p>
        </div>

        {/* Registered items or ready badge */}
        <div className="flex flex-wrap items-center gap-2">
          {registeredItems.length > 0 ? (
            <>
              <span className="font-mono text-xs text-slate-500">Registered In Ledger:</span>
              {registeredItems.slice(0, 3).map((item) => (
                <button
                  key={item.barcode}
                  onClick={() => { setBarcodeInput(item.barcode); executeVerification(item.barcode); }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold transition-colors"
                >
                  {item.brand.split(' ')[0]} ({item.barcode})
                </button>
              ))}
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Ledger Oracle Ready · Enter Barcode</span>
            </div>
          )}
        </div>
      </div>


      {/* Main Grid: Left Scanner / Controls, Right Live Verification Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 Cols): Scanner Viewport & Manual Entry */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-5">
              <button
                onClick={() => setActiveMode('camera')}
                className={`py-2 rounded-lg font-heading text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMode === 'camera'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Web Scanner</span>
              </button>
              <button
                onClick={() => setActiveMode('manual')}
                className={`py-2 rounded-lg font-heading text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMode === 'manual'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Manual Entry</span>
              </button>
              <button
                onClick={() => setActiveMode('upload')}
                className={`py-2 rounded-lg font-heading text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMode === 'upload'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Image File</span>
              </button>
            </div>

            {/* Mode 1: Camera Scanner Viewfinder */}
            {activeMode === 'camera' && (
              <div className="space-y-4">
                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-300">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                      {/* Simulated optical grid background */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                      
                      {/* Barcode graphic simulated in center */}
                      <div className="relative z-10 p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col items-center gap-2 shadow-2xl">
                        <div className="flex items-center gap-1 h-12 px-2 bg-white rounded">
                          {[2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4].map((w, idx) => (
                            <div
                              key={idx}
                              style={{ width: `${w * 2}px` }}
                              className={`h-full ${idx % 2 === 0 ? 'bg-slate-900' : 'bg-transparent'}`}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-xs text-emerald-400 font-semibold tracking-widest">
                          {barcodeInput || '8901030865421'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Optical Reticle & Scanning Laser Beam Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {/* Corner Target Brackets */}
                    <div className="w-56 h-36 border-2 border-dashed border-emerald-400/80 rounded-xl relative flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 -mt-1 -ml-1"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 -mt-1 -mr-1"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 -mb-1 -ml-1"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 -mb-1 -mr-1"></div>
                      
                      {/* Animated Laser Scanning Line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-[scanline_2.5s_ease-in-out_infinite]"></div>
                    </div>
                  </div>

                  {/* Viewport Top Tag */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-900/80 text-emerald-400 font-mono text-[10px] flex items-center gap-1.5 backdrop-blur-xs border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>OPTICAL SENSOR ACTIVE</span>
                  </div>

                  {/* Viewport Bottom Resolution */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 font-mono text-[10px]">
                    1080p · Auto-Focus Reticle
                  </div>
                </div>

                {cameraError && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    ℹ️ {cameraError}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => executeVerification(barcodeInput)}
                    disabled={isVerifying}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? 'Verifying on Sepolia...' : 'Trigger Instant Scan'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Manual Input */}
            {activeMode === 'manual' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-heading text-xs font-semibold text-slate-700 mb-1.5">
                    GS1 Barcode or Token Identifier
                  </label>
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Enter EAN-13, UPC-A, or serial..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Supported Formats:</div>
                  <div className="font-mono text-[11px] text-slate-500">
                    • EAN-13 (Standard Retail Barcode)<br />
                    • UPC-A (12-digit North American Format)<br />
                    • GS1 DataMatrix (Healthcare & Aerospace)<br />
                    • ERC-721 / ERC-1155 Token IDs
                  </div>
                </div>

                <button
                  onClick={() => executeVerification(barcodeInput)}
                  disabled={isVerifying}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Verifying on Sepolia...' : 'Verify Product on Ledger'}</span>
                </button>
              </div>
            )}

            {/* Mode 3: Upload Image */}
            {activeMode === 'upload' && (
              <div className="space-y-4">
                <div 
                  onClick={() => executeVerification(barcodeInput)}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20"
                >
                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                  <div className="font-heading text-sm font-semibold text-slate-900 mb-1">
                    Upload Barcode or Label Photo
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs mb-3">
                    Drag and drop a PNG, JPG, or PDF packaging label. Our neural decoder will extract GS1 barcodes automatically.
                  </p>
                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 font-heading text-xs font-semibold text-slate-700 shadow-2xs">
                    Choose Local File
                  </span>
                </div>

                <button
                  onClick={() => executeVerification(barcodeInput)}
                  disabled={isVerifying}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-heading text-xs font-semibold"
                >
                  Simulate Sample Label Upload
                </button>
              </div>
            )}
          </div>

          {/* Verification Protocol Lifecycle Steps */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="font-heading text-sm font-semibold text-slate-900 flex items-center justify-between">
              <span>Cryptographic Proof Pipeline</span>
              <span className="font-mono text-xs text-emerald-700 font-medium">ECDSA + Merkle</span>
            </div>

            <div className="space-y-3">
              {[
                { stage: 1, label: 'GS1 Barcode Ingestion & Optical Checksum', desc: 'Validates modulo-10 algorithm and GTIN prefix authenticity' },
                { stage: 2, label: 'Sepolia Smart Contract Oracle Query', desc: 'Queries AuthentixRegistry contract at 0x71F32A... on block #19402118' },
                { stage: 3, label: 'ECDSA secp256k1 Signature & IPFS CID', desc: 'Verifies manufacturer genesis private key signature against public ledger' },
                { stage: 4, label: 'Zero-Knowledge Merkle Root Consensus', desc: 'Traverses 12-layer Keccak256 tree with 24/24 validator nodes' }
              ].map((step) => {
                const isStepActive = isVerifying && verificationStage === step.stage;
                const isStepDone = (!isVerifying && product) || (isVerifying && verificationStage > step.stage);

                return (
                  <div
                    key={step.stage}
                    className={`p-3 rounded-xl border transition-all ${
                      isStepActive
                        ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-500/20'
                        : isStepDone
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isStepDone
                          ? 'bg-emerald-600 text-white'
                          : isStepActive
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isStepDone ? '✓' : step.stage}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-heading text-xs font-semibold text-slate-900 truncate">
                          {step.label}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (7 Cols): Comprehensive Digital Twin & Provenance Certificate */}
        <div className="lg:col-span-7 space-y-6">
          
          {product ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              
              {/* Top Verdict Ribbon */}
              <div className={`p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                product.status === 'GENUINE'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700'
                  : product.status === 'TAMPERED'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-700'
                  : 'bg-gradient-to-r from-rose-600 to-red-700'
              }`}>
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner">
                    {product.status === 'GENUINE' ? (
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    ) : product.status === 'TAMPERED' ? (
                      <AlertTriangle className="w-7 h-7 text-white" />
                    ) : (
                      <XCircle className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider font-semibold opacity-90">
                        VERDICT STATUS
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/25 text-white font-mono text-[10px] font-bold">
                        {product.proof.tokenStandard}
                      </span>
                    </div>
                    <div className="font-heading text-2xl font-bold tracking-tight">
                      {product.status === 'GENUINE'
                        ? 'GENUINE PRODUCT CONFIRMED'
                        : product.status === 'TAMPERED'
                        ? 'TAMPER WARNING · CUSTODY BREACH'
                        : 'COUNTERFEIT / ROGUE DUPLICATE'}
                    </div>
                    <div className="text-xs sm:text-sm text-white/90 mt-0.5">
                      {product.statusMessage}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-white/20">
                  <div className="font-mono text-xs text-white/80">Proof Depth</div>
                  <div className="font-heading font-bold text-lg">{product.proof.merkleDepth} Layers (Keccak)</div>
                </div>
              </div>

              {/* Product Profile & Specs */}
              <div className="p-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Product Image */}
                  <div className="md:col-span-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square relative group">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white font-mono text-[11px] flex items-center justify-between">
                      <span>GS1: {product.barcode}</span>
                      <span className="text-emerald-400 font-semibold">{product.upcFormat}</span>
                    </div>
                  </div>

                  {/* Metadata Fields */}
                  <div className="md:col-span-7 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-emerald-700 uppercase font-mono tracking-wider">
                        {product.category}
                      </div>
                      <h2 className="font-heading text-xl font-bold text-slate-900">
                        {product.title}
                      </h2>
                      <div className="text-sm text-slate-600 font-medium">
                        By {product.brand}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-mono">Serial Number</div>
                        <div className="font-mono text-xs font-semibold text-slate-800 truncate">
                          {product.serialNumber}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-mono">Batch Number</div>
                        <div className="font-mono text-xs font-semibold text-slate-800 truncate">
                          {product.batchNumber}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-mono">Manufacturing Origin</div>
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {product.originCountry}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-mono">Genesis Date</div>
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {new Date(product.manufacturingDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications Accordion / Grid */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="font-heading text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Engineering & Regulatory Specifications</span>
                    <span className="font-mono text-[11px] text-slate-500">ISO/IEC 15459 Compliant</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex items-start justify-between p-2 rounded bg-white border border-slate-200 gap-2">
                        <span className="text-slate-500">{key}:</span>
                        <span className="font-medium text-slate-900 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cryptographic Ledger Proof Card */}
                <div className="p-5 rounded-xl bg-slate-900 text-slate-100 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <span className="font-heading text-sm font-semibold text-white">
                        On-Chain Cryptographic Proof Details
                      </span>
                    </div>
                    <span className="font-mono text-xs text-sky-400 font-semibold">
                      Ethereum Sepolia #19,402,118
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400 font-mono text-[11px] mb-1">Contract Address</div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700">
                        <span className="font-mono text-[11px] text-emerald-400 truncate">
                          {product.proof.contractAddress}
                        </span>
                        <button
                          onClick={() => copyToClipboard(product.proof.contractAddress, 'contract')}
                          className="text-slate-400 hover:text-white ml-2 flex-shrink-0"
                        >
                          {copiedHash === 'contract' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-mono text-[11px] mb-1">Transaction Hash</div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700">
                        <span className="font-mono text-[11px] text-sky-400 truncate">
                          {product.proof.txHash}
                        </span>
                        <button
                          onClick={() => copyToClipboard(product.proof.txHash, 'tx')}
                          className="text-slate-400 hover:text-white ml-2 flex-shrink-0"
                        >
                          {copiedHash === 'tx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-mono text-[11px] mb-1">Merkle Root Hash</div>
                      <div className="p-2 rounded bg-slate-800/80 border border-slate-700 font-mono text-[11px] text-slate-300 truncate">
                        {product.proof.merkleRoot}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-mono text-[11px] mb-1">ECDSA secp256k1 Signature</div>
                      <div className="p-2 rounded bg-slate-800/80 border border-slate-700 font-mono text-[11px] text-slate-300 truncate">
                        {product.proof.ecdsaSignature}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate-400">
                    <span>IPFS Metadata URI: {product.proof.ipfsMetadataUri || 'N/A'}</span>
                    <span className="text-emerald-400 font-semibold">{product.proof.oracleConsensus}</span>
                  </div>
                </div>

                {/* Supply Chain Custody Journey Timeline */}
                <div className="space-y-4">
                  <div className="font-heading text-sm font-semibold text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Route className="w-4 h-4 text-emerald-600" />
                      Immutable Custody Provenance Path
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {product.custodyPath.length} Verified Checkpoints
                    </span>
                  </div>

                  {product.custodyPath.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                      No custody milestones registered on-chain for this artifact.
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                      {product.custodyPath.map((cp, idx) => {
                        const isLast = idx === product.custodyPath.length - 1;
                        return (
                          <div key={cp.id} className="relative group">
                            {/* Milestone Dot */}
                            <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${
                              cp.status === 'completed'
                                ? 'border-emerald-600 text-emerald-600'
                                : cp.status === 'current'
                                ? 'border-sky-600 text-sky-600 ring-4 ring-sky-100'
                                : 'border-slate-300 text-slate-300'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                cp.status === 'completed' ? 'bg-emerald-600' : cp.status === 'current' ? 'bg-sky-600 animate-pulse' : 'bg-slate-300'
                              }`}></span>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <div className="font-heading font-semibold text-sm text-slate-900">
                                  {cp.stage}
                                </div>
                                <div className="font-mono text-[11px] text-slate-500">
                                  {cp.timestamp}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-2">
                                <span className="flex items-center gap-1 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  {cp.location}
                                </span>
                                <span>•</span>
                                <span className="text-slate-500">
                                  Operator: {cp.operator}
                                </span>
                                {cp.temperature && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-emerald-700 font-mono font-semibold">
                                      <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                                      {cp.temperature}
                                    </span>
                                  </>
                                )}
                              </div>

                              {cp.notes && (
                                <p className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-200/80 font-mono">
                                  {cp.notes}
                                </p>
                              )}

                              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between font-mono text-[11px] text-slate-400">
                                <span>Block #{cp.blockNumber}</span>
                                <span className="text-sky-700">{cp.txHash}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Certificate Action Footer */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={downloadCertificate}
                      className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Cryptographic Proof (JSON)</span>
                    </button>

                    <button
                      onClick={() => onOpenTracker ? onOpenTracker(product.barcode) : onSelectTab('geo-tracker')}
                      className="px-3.5 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-heading text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 text-emerald-700" />
                      <span>Track Order & Route on Map</span>
                    </button>

                    <button
                      onClick={() => onSelectTab('blockchain-explorer')}
                      className="px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-heading text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <span>Audit on Explorer</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200 font-heading text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Report Fraud / Tamper Incident</span>
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center">
              <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
              <div className="font-heading text-lg font-bold text-slate-800">
                Awaiting Product Query
              </div>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Scan a barcode using the optical camera on the left or enter an EAN-13 serial number to trigger smart contract resolution.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Fraud Reporting Incident Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  File Cryptographic Incident Report
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcasts flagged duplicate or tampered packaging hash to GS1 consortium & law enforcement.
                </p>
              </div>
            </div>

            {reportSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div className="font-heading text-lg font-bold text-slate-900">
                  Incident Quarantined on Sepolia
                </div>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Report TX #0x99A8F... created. Authorized brand manufacturer and Interpol GS1 fraud database have been notified.
                </p>
                <button
                  onClick={() => { setReportSubmitted(false); setReportModalOpen(false); }}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-heading text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Suspected Incident Type
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white">
                    <option>Photocopied / Duplicate Barcode Label</option>
                    <option>Physical Seal Tampered / Broken Tamper Tape</option>
                    <option>Cold Chain Storage Thermal Breach</option>
                    <option>Unauthorized Retail Channel / Diverted Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Purchase or Discovery Location
                  </label>
                  <input
                    type="text"
                    defaultValue="Retail Store / Online Marketplace"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Observer Notes & Serial Verification
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={`Flagged item: ${product?.title} (Barcode: ${product?.barcode})`}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setReportSubmitted(true)}
                    className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-heading text-xs font-semibold transition-colors"
                  >
                    Submit Cryptographic Incident
                  </button>
                  <button
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
