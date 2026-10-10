import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  Building2, 
  Clock, 
  Search, 
  Filter, 
  Globe2, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight,
  RefreshCw,
  Fuel
} from 'lucide-react';

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

const INITIAL_SCANS: ScanEvent[] = [
  { id: 'sc-1', barcode: '8901030865421', productName: 'Chronograph Regalia · Ref. 4109', brand: 'Rolex SA', location: 'Geneva, Switzerland', status: 'GENUINE', timestamp: '3s ago', gasPrice: 14.1, block: 19402120 },
  { id: 'sc-2', barcode: '079357318392', productName: 'BioTech Peptide Serum #98B', brand: 'Genentech', location: 'San Francisco, USA', status: 'GENUINE', timestamp: '8s ago', gasPrice: 13.8, block: 19402119 },
  { id: 'sc-3', barcode: '9998887776665', productName: 'Duplicate Label Collision Detected', brand: 'Unauthorized Copy', location: 'Guangzhou, CN', status: 'COUNTERFEIT', timestamp: '15s ago', gasPrice: 16.5, block: 19402119 },
  { id: 'sc-4', barcode: '4006381333931', productName: 'Zeiss Optic Lens 50mm f/1.2 S', brand: 'Carl Zeiss AG', location: 'Frankfurt, Germany', status: 'GENUINE', timestamp: '24s ago', gasPrice: 14.2, block: 19402118 },
  { id: 'sc-5', barcode: '1112223334445', productName: 'Cold Chain Pharma Excursion', brand: 'Apex BioTherapeutics', location: 'Frankfurt Air Hub, DE', status: 'TAMPERED', timestamp: '42s ago', gasPrice: 14.0, block: 19402117 },
  { id: 'sc-6', barcode: '5901234123457', productName: 'Vintage Bordeaux Grand Cru 2018', brand: 'Château Margaux', location: 'Bordeaux, France', status: 'GENUINE', timestamp: '1m ago', gasPrice: 13.9, block: 19402116 },
  { id: 'sc-7', barcode: '8901030865421', productName: 'Chronograph Regalia · Ref. 4109', brand: 'Rolex SA', location: 'New York Boutique, USA', status: 'GENUINE', timestamp: '2m ago', gasPrice: 14.4, block: 19402115 }
];

export const DashboardView: React.FC<{ onInspectBarcode?: (code: string) => void }> = ({ onInspectBarcode }) => {
  const [scans, setScans] = useState<ScanEvent[]>(INITIAL_SCANS);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Periodic simulated live ticker pulse
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const locations = ['London, UK', 'Tokyo, Japan', 'Seoul, South Korea', 'Milan, Italy', 'Singapore', 'Zurich, Switzerland'];
      const sampleNames = [
        { name: 'Rolex Oyster Perpetual Cosmograph', brand: 'Rolex SA', code: '8901030865421', status: 'GENUINE' as const },
        { name: 'Genentech Oncological Antibody Vial', brand: 'Genentech', code: '079357318392', status: 'GENUINE' as const },
        { name: 'Zeiss Cine High-Speed Lens T1.3', brand: 'Carl Zeiss AG', code: '4006381333931', status: 'GENUINE' as const },
        { name: 'Rogue Serial Duplicate Collision', brand: 'Unknown Replica Syndicate', code: '9998887776665', status: 'COUNTERFEIT' as const }
      ];
      const randomSample = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomLoc = locations[Math.floor(Math.random() * locations.length)];
      const newScan: ScanEvent = {
        id: `sc-${Date.now()}`,
        barcode: randomSample.code,
        productName: randomSample.name,
        brand: randomSample.brand,
        location: randomLoc,
        status: randomSample.status,
        timestamp: 'Just now',
        gasPrice: Number((13.5 + Math.random() * 2).toFixed(1)),
        block: 19402120 + Math.floor(Math.random() * 10)
      };

      setScans((prev) => [newScan, ...prev.slice(0, 19)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const filteredScans = scans.filter((s) => {
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
            Global scan throughput, counterfeit interception vectors, and smart contract health across all nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold flex items-center gap-2 transition-colors ${
              isLiveStreaming
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{isLiveStreaming ? 'Live Stream Active' : 'Stream Paused'}</span>
          </button>

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
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Total Scans Audited</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900">1,429,812</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% vs last epoch (Sepolia)</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-sky-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Consensus Accuracy</span>
            <span className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900">99.82%</div>
          <div className="text-xs text-slate-500 font-mono">
            0.000% False Positives (Q1 Audit)
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Counterfeits Quarantined</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900">2,574</div>
          <div className="text-xs text-rose-600 font-medium">
            100% duplicate attempts intercepted
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider">Active Manufacturers</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading text-3xl font-bold text-slate-900">842 Brands</div>
          <div className="text-xs text-slate-500 font-mono">
            Across 42 sovereign jurisdictions
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
                Verification Volume by Industry Sector
              </h2>
              <p className="text-xs text-slate-500">
                Percentage of on-chain zero-knowledge queries by high-value product categories
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500">30-Day Window</span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Haute Horlogerie & Luxury Timepieces', pct: 38, count: '543,328', color: 'bg-emerald-600' },
              { label: 'Biotechnology & Cold-Chain Pharmaceuticals', pct: 28, count: '400,347', color: 'bg-sky-600' },
              { label: 'Precision Optics & Industrial Instruments', pct: 18, count: '257,366', color: 'bg-teal-600' },
              { label: 'Fine Wines, Spirits & Agro-Provenance', pct: 11, count: '157,279', color: 'bg-amber-600' },
              { label: 'High-End Consumer Electronics & Avionics', pct: 5, count: '71,492', color: 'bg-slate-700' }
            ].map((cat) => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{cat.label}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500">{cat.count} scans</span>
                    <span className="font-semibold text-slate-900 w-10 text-right">{cat.pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`${cat.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Primary Standard: GS1 General Specs v23.0</span>
            <span className="text-emerald-700 font-semibold">Zero-Knowledge Oracle Synced</span>
          </div>
        </div>

        {/* Threat Radar & Fraud Defense (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Interception Vectors
              </h2>
              <p className="text-xs text-slate-500">
                Active fraud mechanisms blocked by protocol rules
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[11px] font-semibold">
              Live Radar
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Duplicate Barcode Collision Attack',
                desc: 'Photocopied EAN-13 labels queried from conflicting geographic IP coordinates within 15 minutes.',
                count: '1,894 Blocked',
                severity: 'High'
              },
              {
                title: 'Cold-Chain IoT Temperature Excursions',
                desc: 'Oracle flagged transit temperature exceeding 8°C in biological vaccine payloads.',
                count: '412 Quarantined',
                severity: 'Critical'
              },
              {
                title: 'Unspent Token Replay Attempt',
                desc: 'Black market reseller attempting to redeem revoked or previously transferred soulbound warranty.',
                count: '268 Rejected',
                severity: 'Medium'
              }
            ].map((threat, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold text-xs text-slate-900">{threat.title}</span>
                  <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {threat.count}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {threat.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Oracle Node Status: 24/24 Online</span>
            <span className="text-emerald-700 font-mono font-semibold">100% Defense Rate</span>
          </div>
        </div>

      </div>

      {/* Global Real-Time Scan Stream Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-600" />
              Live Global Verification Stream
            </h2>
            <p className="text-xs text-slate-500">
              Real-time audit events ingested across authorized point-of-sale and customs checkpoints
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
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                    No scan logs matching active search criteria.
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
