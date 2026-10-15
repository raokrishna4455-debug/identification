import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  Building2, 
  Search, 
  Globe2, 
  Cpu, 
  Fuel,
  PlusCircle,
  MapPin,
  QrCode
} from 'lucide-react';
import { ProductItem } from '../types';

interface ScanEvent {
  id: string;
  barcode: string;
  productName: string;
  brand: string;
  location: string;
  status: 'GENUINE' | 'COUNTERFEIT' | 'TAMPERED';
  timestamp: string;
  gasPrice: number;
  block: number;
}

interface DashboardViewProps {
  products?: ProductItem[];
  onInspectBarcode?: (code: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  products = [], 
  onInspectBarcode,
  onNavigateTab 
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Derive real scans from user registered products and their custody events
  const productScans: ScanEvent[] = products.flatMap((p) => {
    const events: ScanEvent[] = [
      {
        id: `sc-mint-${p.barcode}`,
        barcode: p.barcode,
        productName: p.title,
        brand: p.brand,
        location: p.originCountry || 'Manufacturing Plant',
        status: p.status === 'GENUINE' ? 'GENUINE' : p.status === 'TAMPERED' ? 'TAMPERED' : 'COUNTERFEIT',
        timestamp: 'Genesis Mint',
        gasPrice: 14.1,
        block: p.proof?.blockNumber || 19402120
      }
    ];

    if (p.custodyPath && Array.isArray(p.custodyPath)) {
      p.custodyPath.forEach((cp, idx) => {
        events.push({
          id: `sc-cp-${p.barcode}-${idx}`,
          barcode: p.barcode,
          productName: p.title,
          brand: p.brand,
          location: cp.location || 'Custody Hub',
          status: cp.tamperSealIntact ? 'GENUINE' : 'TAMPERED',
          timestamp: cp.timestamp || 'Recent',
          gasPrice: 13.8,
          block: cp.blockNumber || 19402122
        });
      });
    }
    return events;
  });

  // Calculate live dynamic metrics
  const totalProducts = products.length;
  const totalCheckpoints = products.reduce((acc, p) => acc + (p.custodyPath?.length || 0), 0);
  const totalScansAudited = productScans.length;
  const activeBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
  const uniqueFacilities = Array.from(
    new Set(products.flatMap((p) => p.custodyPath?.map((c) => c.location).filter(Boolean) || []))
  );

  // Dynamic category breakdown
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.category || 'Other Goods';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryEntries = Object.entries(categoryCounts).map(([label, count]) => ({
    label,
    count,
    pct: totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0
  }));

  const filteredScans = productScans.filter((s) => {
    const matchesFilter = filterStatus === 'ALL' || s.status === filterStatus;
    const matchesSearch = s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.barcode.includes(searchQuery) ||
                          s.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-sky-700 uppercase tracking-widest font-semibold mb-1">
            <span className="w-2 h-2 rounded bg-sky-600"></span>
            Real-Time Registry Telemetry
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Authenticity Dashboard & Metrics
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Global scan throughput, custody checkpoints, and smart contract health computed directly from active ledger data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 font-mono text-xs text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Ledger Sync: Active</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs text-slate-600">
            <Fuel className="w-3.5 h-3.5 text-amber-500" />
            <span>Gas: 14.2 Gwei</span>
          </div>
        </div>
      </div>

      {/* KPI BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Registered Products</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {totalProducts}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{totalProducts > 0 ? `${totalProducts} active digital twins` : 'Awaiting first batch mint'}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-sky-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Custody Checkpoints</span>
            <span className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {totalCheckpoints}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {uniqueFacilities.length} physical facilities recorded
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Ledger Events Ingested</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {totalScansAudited}
          </div>
          <div className="text-xs text-purple-700 font-medium">
            100% on-chain cryptographic consensus
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Active Brand Authorities</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {activeBrands.length} {activeBrands.length === 1 ? 'Brand' : 'Brands'}
          </div>
          <div className="text-xs text-slate-500 font-mono truncate">
            {activeBrands.length > 0 ? activeBrands.join(', ') : 'No registered brands yet'}
          </div>
        </div>

      </div>

      {/* Middle Row: Category Breakdown & Threat Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900">
                Registered Product Categories
              </h2>
              <p className="text-xs text-slate-500">
                Breakdown of active batches and physical product lines on the blockchain ledger
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500">Live State</span>
          </div>

          {categoryEntries.length > 0 ? (
            <div className="space-y-4">
              {categoryEntries.map((cat) => (
                <div key={cat.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{cat.label}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-500">{cat.count} {cat.count === 1 ? 'batch' : 'batches'}</span>
                      <span className="font-semibold text-slate-900 w-10 text-right tabular-nums">{cat.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                      style={{ width: `${cat.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl space-y-2">
              <BarChart3 className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-semibold text-slate-700">No Product Categories Enrolled</div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Mint your first product batch in the Manufacturer Portal to view live categorization and telemetry.
              </p>
            </div>
          )}
        </div>

        {/* Security & Consensus Integrity (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-heading text-base font-bold text-slate-900">
                Cryptographic Consensus
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-semibold">
                Sepolia Testnet
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Zero-knowledge proof verification pipeline and validator consensus status
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600 font-medium">Merkle Root Engine</span>
              <span className="font-mono text-emerald-700 font-semibold">Keccak256 (SHA-3)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600 font-medium">Signature Standard</span>
              <span className="font-mono text-sky-700 font-semibold">ECDSA secp256k1</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600 font-medium">Smart Contract State</span>
              <span className="font-mono text-slate-700 font-semibold">0x71F32A...Verified</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Validator Nodes Sync</span>
            <span className="text-emerald-700 font-semibold">24 / 24 Connected</span>
          </div>
        </div>

      </div>

      {/* Real-Time Live Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-600" />
              Live Ledger Audit Stream
            </h2>
            <p className="text-xs text-slate-500">
              Audit events ingested across authorized point-of-sale and manufacturing checkpoints
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search barcode or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-56"
              />
            </div>

            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-mono">
              {['ALL', 'GENUINE', 'COUNTERFEIT', 'TAMPERED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterStatus === st
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 font-mono text-slate-500 bg-slate-50/70">
                <th className="py-2.5 px-3 font-semibold">STATUS</th>
                <th className="py-2.5 px-3 font-semibold">PRODUCT & BRAND</th>
                <th className="py-2.5 px-3 font-semibold">GS1 BARCODE</th>
                <th className="py-2.5 px-3 font-semibold">LOCATION</th>
                <th className="py-2.5 px-3 font-semibold">BLOCK #</th>
                <th className="py-2.5 px-3 font-semibold">GAS</th>
                <th className="py-2.5 px-3 font-semibold text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                    <div className="space-y-3 max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-semibold text-slate-700">No Ledger Audit Records Found</div>
                      <p className="text-xs text-slate-500">
                        There are no verification events recorded yet. Mint a product batch or scan a barcode to generate live telemetry.
                      </p>
                      {onNavigateTab && (
                        <div className="pt-1 flex justify-center gap-2">
                          <button
                            onClick={() => onNavigateTab('manufacturer-portal')}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Mint First Batch</span>
                          </button>
                          <button
                            onClick={() => onNavigateTab('verify-product')}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading text-xs font-semibold transition-colors"
                          >
                            Scan Barcode
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredScans.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onInspectBarcode && onInspectBarcode(item.barcode)}
                  >
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        item.status === 'GENUINE'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : item.status === 'TAMPERED'
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'GENUINE' ? 'bg-emerald-500' : item.status === 'TAMPERED' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.brand}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-semibold">
                      {item.barcode}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-600">
                      {item.location}
                    </td>
                    <td className="py-3 px-3 text-sky-700">
                      #{item.block}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {item.gasPrice} Gwei
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-sans">
                      {item.timestamp}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
