import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  CheckCircle2, 
  Printer, 
  Download, 
  Layers, 
  Cpu, 
  MapPin, 
  Barcode, 
  QrCode, 
  Route, 
  Lock, 
  FileCheck, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ProductItem } from '../types';

interface ManufacturerViewProps {
  onAddNewProduct: (product: ProductItem) => void;
  existingProducts: ProductItem[];
  onSelectTab: (tab: string) => void;
}

export const ManufacturerView: React.FC<ManufacturerViewProps> = ({ 
  onAddNewProduct, 
  existingProducts,
  onSelectTab 
}) => {
  const [activeTab, setActiveTab] = useState<'mint' | 'catalog' | 'labels'>('mint');
  
  // Mint form state
  const [brand, setBrand] = useState('Audemars Piguet & Co.');
  const [productName, setProductName] = useState('Royal Oak Selfwinding Flying Tourbillon');
  const [category, setCategory] = useState<ProductItem['category']>('Luxury Timepiece');
  const [barcodeInput, setBarcodeInput] = useState('7613298410294');
  const [batchNumber, setBatchNumber] = useState('BATCH-AP-2025-TOURB-01');
  const [quantity, setQuantity] = useState(250);
  const [manufacturingPlant, setManufacturingPlant] = useState('Le Brassus, Vallée de Joux, Switzerland');
  const [tokenStandard, setTokenStandard] = useState<'ERC-721' | 'ERC-1155' | 'ERC-5192 Soulbound'>('ERC-5192 Soulbound');
  const [coldChainMonitored, setColdChainMonitored] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState<ProductItem | null>(null);

  // Label print preview modal
  const [selectedProductForLabels, setSelectedProductForLabels] = useState<ProductItem | null>(existingProducts[0] || null);

  const handleMintBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);

    setTimeout(() => {
      const cleanBarcode = barcodeInput.trim() || '7613298410294';
      const hashStr = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const newProduct: ProductItem = {
        barcode: cleanBarcode,
        upcFormat: 'EAN-13 (GS1 Switzerland)',
        title: productName,
        brand: brand,
        category: category,
        modelNumber: `MOD-${cleanBarcode.slice(-4)}`,
        serialNumber: `SN-${brand.slice(0, 3).toUpperCase()}-${cleanBarcode}`,
        batchNumber: batchNumber,
        manufacturingDate: new Date().toISOString(),
        originCountry: manufacturingPlant,
        authorizedManufacturer: `${brand} Genesis Authority`,
        manufacturerAddress: '0x71F32A4B892c9082d4992147FeE7bF05719Ab301',
        status: 'GENUINE',
        statusMessage: 'Cryptographically Verified · Genesis Batch Minted on Sepolia',
        image: category === 'Luxury Timepiece'
          ? 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
          : category === 'Biotechnology'
          ? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        description: `Authentic digital twin backed by soulbound certificate. Minted for ${brand} with tamper-evident physical barcode integration.`,
        specifications: {
          'Batch Volume': `${quantity} Units`,
          'Mint Standard': tokenStandard,
          'Validation Mechanism': 'ECDSA secp256k1 + Merkle Proof',
          'Production Facility': manufacturingPlant
        },
        proof: {
          contractAddress: '0x71F32A4B892c9082d4992147FeE7bF05719Ab301',
          tokenId: `${Math.floor(Math.random() * 9000 + 1000)}`,
          tokenStandard: tokenStandard,
          merkleRoot: `0x${hashStr}`,
          merkleLeafHash: `0x${hashStr.slice(0, 40)}`,
          merkleDepth: 12,
          ecdsaSignature: `0x${hashStr}1c`,
          issuerPublicKey: `0x04${hashStr}`,
          blockNumber: 19402121,
          blockTimestamp: new Date().toISOString(),
          txHash: `0x${hashStr}`,
          ipfsMetadataUri: `ipfs://bafybei${cleanBarcode}/batch.json`,
          gasUsed: '84,920 gas',
          oracleConsensus: 'Consensus 100% · Sepolia Validator Quorum Confirmed'
        },
        custodyPath: [
          {
            id: `cp-${Date.now()}-1`,
            stage: 'Genesis Manufacture & Cryptographic Inscription',
            location: manufacturingPlant,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
            operator: `${brand} Genesis Master Key`,
            blockNumber: 19402121,
            txHash: `0x${hashStr.slice(0, 8)}...`,
            status: 'completed',
            tamperSealIntact: true,
            notes: 'Batch Merkle root submitted to Sepolia smart contract'
          },
          {
            id: `cp-${Date.now()}-2`,
            stage: 'Central Vault Logistical Dispatch',
            location: 'Geneva Freeport Bonded Hub, Switzerland',
            timestamp: 'Pending Handover',
            operator: 'Authorized Carrier Key',
            blockNumber: 19402122,
            txHash: 'Pending',
            status: 'current',
            tamperSealIntact: true,
            notes: 'Ready for retail boutique distribution'
          }
        ]
      };

      onAddNewProduct(newProduct);
      setMintSuccess(newProduct);
      setSelectedProductForLabels(newProduct);
      setIsMinting(false);
    }, 900);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-700 uppercase tracking-widest font-semibold mb-1">
            <span className="w-2 h-2 rounded bg-emerald-600"></span>
            Enterprise Manufacturer Console
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Batch Minting & Catalog Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Issue tamper-evident cryptographic digital twins, generate GS1 bar code manifests, and sign on-chain custody transfers.
          </p>
        </div>

        {/* Identity session badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs">
              AP
            </div>
            <div>
              <div className="font-heading font-semibold text-xs text-slate-900">
                Audemars Piguet & Co.
              </div>
              <div className="font-mono text-[10px] text-emerald-700 font-semibold">
                Authorized Tier-1 Issuer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('mint')}
          className={`px-4 py-2 rounded-lg font-heading text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'mint'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Batch Minting Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-lg font-heading text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Minted Catalog ({existingProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('labels')}
          className={`px-4 py-2 rounded-lg font-heading text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'labels'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Print Barcode & Packaging Labels</span>
        </button>
      </div>

      {/* TAB 1: BATCH MINTING STUDIO */}
      {activeTab === 'mint' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Minting Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Issue New Cryptographic Batch
              </h2>
              <p className="text-xs text-slate-500">
                Submits Merkle root leaves to the Sepolia AuthentixRegistry contract with issuer ECDSA signature.
              </p>
            </div>

            <form onSubmit={handleMintBatch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Manufacturer / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Industry Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="Luxury Timepiece">Luxury Timepiece</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Precision Optics">Precision Optics</option>
                    <option value="Fine Spirits">Fine Spirits</option>
                    <option value="Consumer Tech">Consumer Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GS1 Barcode (EAN-13)
                  </label>
                  <input
                    type="text"
                    required
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batch Size (Units)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batch Serial Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Manufacturing Facility
                  </label>
                  <input
                    type="text"
                    required
                    value={manufacturingPlant}
                    onChange={(e) => setManufacturingPlant(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cryptographic Token Standard
                  </label>
                  <select
                    value={tokenStandard}
                    onChange={(e) => setTokenStandard(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                  >
                    <option value="ERC-5192 Soulbound">ERC-5192 Soulbound (Non-Transferable)</option>
                    <option value="ERC-721">ERC-721 Authenticity NFT</option>
                    <option value="ERC-1155">ERC-1155 Multi-Token Batch</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-5">
                  <input
                    type="checkbox"
                    id="coldchain"
                    checked={coldChainMonitored}
                    onChange={(e) => setColdChainMonitored(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="coldchain" className="text-xs text-slate-700 cursor-pointer">
                    Enable IoT Cold-Chain & Tamper Sensor Oracle
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">
                  Estimated Gas: 84,920 gas (~0.0012 SepoliaETH)
                </span>

                <button
                  type="submit"
                  disabled={isMinting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  <Cpu className="w-4 h-4" />
                  <span>{isMinting ? 'Computing Merkle Tree & Minting...' : 'Deploy Batch to Sepolia'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Minting Receipt / Status Display (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {mintSuccess ? (
              <div className="bg-white rounded-2xl border-2 border-emerald-500/60 p-6 shadow-md space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-base text-slate-900">
                      Batch Mint Confirmed!
                    </div>
                    <div className="font-mono text-xs text-emerald-700">
                      Block #{mintSuccess.proof.blockNumber} · Sepolia Testnet
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Barcode:</span>
                    <span className="font-bold text-slate-900">{mintSuccess.barcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Token ID:</span>
                    <span className="text-emerald-700 font-bold">#{mintSuccess.proof.tokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Merkle Root:</span>
                    <span className="text-slate-700 truncate max-w-[180px]">{mintSuccess.proof.merkleRoot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Standard:</span>
                    <span className="text-sky-700">{mintSuccess.proof.tokenStandard}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onSelectTab('verify-product');
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Test In Scanner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveTab('labels')}
                    className="px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Labels</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Zero-Knowledge Proof Guarantee
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When you deploy a batch through the Authentix Manufacturer Console, each individual item receives a 256-bit cryptographically unique sub-leaf. Even if someone photocopies the barcode, the Authentix oracle immediately detects duplicates and halts unauthorized warranty claims.
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-500 space-y-1">
                  <div>• Modulo-10 GS1 Checksum Enforcement</div>
                  <div>• ECDSA secp256k1 Signature Embedding</div>
                  <div>• Decentralized IPFS Metadata Anchoring</div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: MINTED CATALOG */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Active Registered Batches & Digital Twins
            </h2>
            <p className="text-xs text-slate-500">
              Manufactured product runs with active smart contract certificates on Ethereum Sepolia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingProducts.map((item) => (
              <div 
                key={item.barcode}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all space-y-3 bg-white"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-semibold text-xs text-slate-900 truncate">
                      {item.title}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">
                      GS1: {item.barcode}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Batch:</span>
                    <span className="font-semibold text-slate-800">{item.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Token Standard:</span>
                    <span className="text-emerald-700 font-semibold">{item.proof.tokenStandard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Checkpoints:</span>
                    <span>{item.custodyPath.length} logged</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setSelectedProductForLabels(item);
                      setActiveTab('labels');
                    }}
                    className="text-xs text-sky-700 hover:underline font-heading font-medium flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Generate Label
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('verify-product');
                    }}
                    className="text-xs text-emerald-700 hover:underline font-heading font-semibold flex items-center gap-1"
                  >
                    View Twin
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRINT PACKAGING LABELS */}
      {activeTab === 'labels' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                GS1 Optical Packaging & Tamper-Tape Label Preview
              </h2>
              <p className="text-xs text-slate-500">
                Print ready-to-affix physical labels with micro-etched holographic hashes and unspent twin vouchers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sticker Sheet</span>
              </button>
            </div>
          </div>

          {selectedProductForLabels ? (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-100 rounded-2xl border border-slate-200">
              {/* Actual Printable Label Artifact Card */}
              <div className="w-full max-w-md p-6 bg-white rounded-2xl border-2 border-slate-900 shadow-xl space-y-4 text-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="font-heading font-bold text-sm tracking-tight">
                      AUTHENTIX VERIFIED GS1 LABEL
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    ETH SEPOLIA v2.4
                  </span>
                </div>

                <div>
                  <div className="font-heading font-bold text-base">
                    {selectedProductForLabels.title}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {selectedProductForLabels.brand} · {selectedProductForLabels.originCountry}
                  </div>
                </div>

                {/* High contrast barcode rendering */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1 h-16 w-full max-w-[280px] justify-center px-2">
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 3].map((w, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${w * 3}px` }}
                        className={`h-full ${idx % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-sm font-bold tracking-widest text-slate-900">
                    {selectedProductForLabels.barcode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 truncate">
                    SN: {selectedProductForLabels.serialNumber}
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 truncate">
                    BATCH: {selectedProductForLabels.batchNumber}
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 truncate col-span-2">
                    ROOT: {selectedProductForLabels.proof.merkleRoot.slice(0, 32)}...
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>TAMPER PROOF CIRCUIT INTEGRATED</span>
                  <span className="text-emerald-700 font-bold">ERC-5192 SOULBOUND</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Select a product from the catalog to generate packaging labels.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
