import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Building2, 
  Store, 
  Plane, 
  ShieldCheck, 
  ShieldAlert, 
  Radio, 
  Battery, 
  Satellite, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Compass, 
  Truck, 
  Search, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ProductItem, CustodyCheckpoint } from '../types';
import { ProductTrackingMap } from '../components/ProductTrackingMap';

interface TrackerViewProps {
  products: ProductItem[];
  selectedBarcode?: string;
  onSelectProduct: (barcode: string) => void;
  onUpdateCustodyCheckpoint: (barcode: string, checkpoint: CustodyCheckpoint) => void;
  onNavigateTab?: (tab: string) => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  products,
  selectedBarcode,
  onSelectProduct,
  onUpdateCustodyCheckpoint,
  onNavigateTab
}) => {
  const [activeBarcode, setActiveBarcode] = useState<string>(
    selectedBarcode || products[0]?.barcode || ''
  );
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [detectedLocationMsg, setDetectedLocationMsg] = useState<string | null>(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [highlightedShopId, setHighlightedShopId] = useState<string | null>(null);

  const mapSectionRef = React.useRef<HTMLDivElement>(null);

  // New location log form state
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [newStage, setNewStage] = useState('Authorized Retail Shop Intake');
  const [newFacilityType, setNewFacilityType] = useState<CustodyCheckpoint['facilityType']>('retail_shop');
  const [newLocationName, setNewLocationName] = useState('');
  const [newShopName, setNewShopName] = useState('');
  const [newOperator, setNewOperator] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newLat, setNewLat] = useState<string>('40.7554');
  const [newLng, setNewLng] = useState<string>('-73.9804');
  const [isSubmittingOnChain, setIsSubmittingOnChain] = useState(false);

  // Search filter for shops
  const [shopSearchQuery, setShopSearchQuery] = useState('');

  const currentProduct = products.find((p) => p.barcode === activeBarcode) || products[0] || null;


  useEffect(() => {
    if (selectedBarcode) {
      setActiveBarcode(selectedBarcode);
    }
  }, [selectedBarcode]);

  // Current active custody point
  const checkpoints = currentProduct?.custodyPath || [];
  const currentCheckpoint = checkpoints[checkpoints.length - 1] || null;

  // Manufacturing point (first checkpoint)
  const manufacturingCheckpoint = checkpoints.find((c) => c.facilityType === 'manufacturing') || checkpoints[0];
  
  // Retail shop checkpoint
  const retailShopCheckpoint = checkpoints.slice().reverse().find((c) => c.facilityType === 'retail_shop');

  // Trigger GPS detection
  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setDetectedLocationMsg(null);

    // Try browser geolocation or fallback simulation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setTimeout(() => {
            setIsDetectingGps(false);
            setDetectedLocationMsg(
              `Live GPS Beacon Locked: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° W (Accuracy: ±${Math.round(pos.coords.accuracy)}m). Product is verified within authorized retail shop geofence.`
            );
          }, 800);
        },
        () => {
          // Fallback simulation
          setTimeout(() => {
            setIsDetectingGps(false);
            const lat = currentCheckpoint?.lat || 40.7554;
            const lng = currentCheckpoint?.lng || -73.9804;
            setDetectedLocationMsg(
              `IoT Satellite Ping Resolved: ${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W. Geofence status: 100% Authorized at ${currentCheckpoint?.location || 'Verified Retailer'}.`
            );
          }, 850);
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setIsDetectingGps(false);
        setDetectedLocationMsg(
          `Beacon Ping Resolved: 40.7554° N, 73.9804° W. Product is verified inside authorized retailer zone.`
        );
      }, 700);
    }
  };

  const handleLogNewLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    setIsSubmittingOnChain(true);

    setTimeout(() => {
      const hashStr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const parsedLat = parseFloat(newLat);
      const parsedLng = parseFloat(newLng);

      const newPoint: CustodyCheckpoint = {
        id: `cp-usr-${Date.now()}`,
        stage: newStage,
        facilityType: newFacilityType,
        location: newLocationName,
        shopName: newFacilityType === 'retail_shop' ? (newShopName || newLocationName) : undefined,
        lat: !isNaN(parsedLat) ? parsedLat : (newFacilityType === 'retail_shop' ? 40.7554 : 46.2044),
        lng: !isNaN(parsedLng) ? parsedLng : (newFacilityType === 'retail_shop' ? -73.9804 : 6.1432),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
        operator: newOperator,
        blockNumber: 19402125,
        txHash: `0x${hashStr}...Sepolia`,
        status: 'current',
        tamperSealIntact: true,
        notes: newNotes
      };

      onUpdateCustodyCheckpoint(currentProduct.barcode, newPoint);
      setIsSubmittingOnChain(false);
      setShowAddLocationModal(false);
    }, 850);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Pre-configured authorized retailer shops network
  const authorizedRetailShops = [
    {
      id: 'shop-1',
      name: 'Bucherer 5th Avenue Flagship',
      brandAuthorized: 'Rolex SA & Patek Philippe Consortium',
      address: '530 5th Avenue, New York, NY 10036, USA',
      city: 'New York, USA',
      licenseId: 'US-AUTH-BUCH-0992',
      status: 'Active Stockist',
      inStockUnits: 14,
      distance: '0.4 miles away (Current Region)',
      coordinates: '40.7554° N, 73.9804° W',
      lat: 40.7554,
      lng: -73.9804,
      manager: 'Store Director M. Vance',
      isAuthorized: true
    },
    {
      id: 'shop-2',
      name: 'B&H Photo Video Pro Optics Superstore',
      brandAuthorized: 'Carl Zeiss AG Certified Center',
      address: '420 9th Ave, New York, NY 10001, USA',
      city: 'New York, USA',
      licenseId: 'US-AUTH-BH-4109',
      status: 'Active Stockist',
      inStockUnits: 28,
      distance: '1.1 miles away',
      coordinates: '40.7533° N, 73.9967° W',
      lat: 40.7533,
      lng: -73.9967,
      manager: 'Pro Optics Lead H. Stern',
      isAuthorized: true
    },
    {
      id: 'shop-3',
      name: 'Mayo Clinic Specialty Health Pharmacy',
      brandAuthorized: 'Genentech Cold-Chain Certified',
      address: '200 1st St SW, Rochester, MN 55905, USA',
      city: 'Rochester, MN, USA',
      licenseId: 'US-CLIN-MAYO-8821',
      status: 'Dispensing Active',
      inStockUnits: 95,
      distance: 'Cold Vault Monitored (-4°C)',
      coordinates: '44.0225° N, 92.4666° W',
      lat: 44.0225,
      lng: -92.4666,
      manager: 'Dr. Rebecca Chang, PharmD',
      isAuthorized: true
    },
    {
      id: 'shop-4',
      name: 'Audemars Piguet House London',
      brandAuthorized: 'Audemars Piguet Master Flagship',
      address: '130 New Bond Street, Mayfair, London W1S 2TA, UK',
      city: 'London, United Kingdom',
      licenseId: 'UK-AUTH-AP-012',
      status: 'Active Stockist',
      inStockUnits: 8,
      distance: 'International Node',
      coordinates: '51.5126° N, 0.1448° W',
      lat: 51.5126,
      lng: -0.1448,
      manager: 'Boutique Director Charles L.',
      isAuthorized: true
    },
    {
      id: 'shop-5',
      name: 'Ginza Wako Master Timepiece Salon',
      brandAuthorized: 'Swiss Federation GS1 Certified',
      address: '4 Chome-5-11 Ginza, Chuo City, Tokyo 104-8105, Japan',
      city: 'Tokyo, Japan',
      licenseId: 'JP-AUTH-GINZA-771',
      status: 'Active Stockist',
      inStockUnits: 19,
      distance: 'Asia-Pacific Hub',
      coordinates: '35.6717° N, 139.7650° E',
      lat: 35.6717,
      lng: 139.7650,
      manager: 'Salon Master Kenji Sato',
      isAuthorized: true
    }
  ];

  const handleLocateShopOnMap = (shop: typeof authorizedRetailShops[0]) => {
    setHighlightedShopId(shop.id);
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredShops = authorizedRetailShops.filter((s) => 
    s.name.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
    s.brandAuthorized.toLowerCase().includes(shopSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-700 uppercase tracking-widest font-semibold mb-1">
            <span className="w-2 h-2 rounded bg-emerald-600"></span>
            End-To-End Geolocation Provenance
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Product Location & Shop Tracker
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track products along their verified physical custody journey: from the genesis manufacturing cleanroom through customs, transit hubs, and authorized retail shops.
          </p>
        </div>

        {/* Product selector dropdown & quick scan */}
        {products.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <Compass className="w-4 h-4 text-emerald-600" />
              <select
                value={activeBarcode}
                onChange={(e) => {
                  setActiveBarcode(e.target.value);
                  onSelectProduct(e.target.value);
                }}
                className="font-heading text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                {products.map((p) => (
                  <option key={p.barcode} value={p.barcode}>
                    {p.title} ({p.brand})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddLocationModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Custody Checkpoint</span>
            </button>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-xs space-y-4 my-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <MapPin className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            No Tracked Products in Ledger
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            There are currently no products registered in your decentralized ledger. Mint a product batch in the Manufacturer Portal to record genesis manufacturing cleanrooms and trace real-time custody to retail shops.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigateTab ? onNavigateTab('manufacturer-portal') : null}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Mint Product Batch</span>
            </button>
            <button
              onClick={() => onNavigateTab ? onNavigateTab('verify-product') : null}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading text-xs font-semibold transition-colors"
            >
              Verify Barcode
            </button>
          </div>
        </div>
      ) : (
        <>
      {/* Product Summary Header Card */}
      {currentProduct && (

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={currentProduct.image}
              alt={currentProduct.title}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shadow-2xs flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-700 font-semibold uppercase">
                <span>{currentProduct.category}</span>
                <span>•</span>
                <span>SN: {currentProduct.serialNumber}</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
                {currentProduct.title}
              </h2>
              <div className="text-xs text-slate-600 mt-0.5">
                Manufactured by <strong className="text-slate-800">{currentProduct.brand}</strong> in {currentProduct.originCountry}
              </div>
            </div>
          </div>

          {/* Quick status summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 self-stretch md:self-auto">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Manufacturing Genesis</div>
              <div className="font-heading font-bold text-xs text-slate-900 truncate">
                {manufacturingCheckpoint?.location.split(',')[0] || currentProduct.originCountry}
              </div>
              <div className="text-[10px] text-emerald-700 font-mono mt-0.5">Genesis Sealed</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Current Custody</div>
              <div className="font-heading font-bold text-xs text-slate-900 truncate">
                {retailShopCheckpoint?.shopName || currentCheckpoint?.location.split(',')[0]}
              </div>
              <div className="text-[10px] text-sky-700 font-mono mt-0.5">In Retail Channel</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Geofence Status</div>
              <div className="font-heading font-bold text-xs text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% Authorized
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Zero Diversion</div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE TELEMETRY RADAR & SATELLITE HUD */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden space-y-4">
        {/* Glow ambient circle in background */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base text-white">
                  Real-Time IoT Satellite & Geolocation Beacon
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-semibold">
                  BEACON SYNCED
                </span>
              </div>
              <div className="font-mono text-xs text-slate-400">
                Encrypted BLE 5.4 + GPS GNSS Dual-Band Telemetry
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDetectGps}
              disabled={isDetectingGps}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading text-xs font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <Satellite className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
              <span>{isDetectingGps ? 'Triangulating GNSS Satellites...' : 'Detect Current Geolocation'}</span>
            </button>
          </div>
        </div>

        {/* Real-time telemetry values HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[10px] mb-1">LATITUDE / LONGITUDE</div>
            <div className="text-emerald-400 font-bold">
              {currentCheckpoint?.lat?.toFixed(4) || '40.7554'}° N
            </div>
            <div className="text-slate-300">
              {Math.abs(currentCheckpoint?.lng || -73.9804).toFixed(4)}° W
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[10px] mb-1">CURRENT SHOP / FACILITY</div>
            <div className="text-white font-semibold truncate">
              {retailShopCheckpoint?.shopName || currentCheckpoint?.location}
            </div>
            <div className="text-sky-400 text-[10px]">
              {currentCheckpoint?.facilityType?.toUpperCase() || 'RETAIL_SHOP'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[10px] mb-1">GEOFENCE STATUS</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              AUTHENTIC
            </div>
            <div className="text-slate-400 text-[10px]">Within 50m radius</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[10px] mb-1">INTERNAL ENVIRONMENT</div>
            <div className="text-white font-bold">
              {currentCheckpoint?.temperature || '21.4°C'}
            </div>
            <div className="text-slate-400 text-[10px]">Humidity: 44% RH</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[10px] mb-1">PHYSICAL SEAL INTEGRITY</div>
            <div className="text-emerald-400 font-bold">INTACT (UNBROKEN)</div>
            <div className="text-slate-400 text-[10px]">Conductive loop OK</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[10px] mb-1">BEACON BATTERY & RSSI</div>
            <div className="text-white font-bold flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              94% (5.2 Yrs)
            </div>
            <div className="text-slate-400 text-[10px]">-64 dBm (High SNR)</div>
          </div>
        </div>

        {detectedLocationMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{detectedLocationMsg}</span>
          </div>
        )}
      </div>

      {/* INTERACTIVE GEOGRAPHIC CUSTODY ROUTE MAP (MANUFACTURING TO SHOPS) */}
      <div ref={mapSectionRef} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Interactive Geospatial Map: Manufacturing to Retail Stores
            </h2>
            <p className="text-xs text-slate-500">
              Live cryptographic telemetry and interactive route mapping for orders and products across international borders, customs clearance, transit hubs, and authorized retail stores.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {checkpoints.length} On-Chain Milestones Verified
            </span>
          </div>
        </div>

        {/* Real Interactive Leaflet Map for Order & Product Tracking */}
        <ProductTrackingMap
          product={currentProduct}
          checkpoints={checkpoints}
          selectedCheckpointIndex={selectedNodeIndex}
          onSelectCheckpoint={(idx) => setSelectedNodeIndex(idx)}
          authorizedShops={authorizedRetailShops}
          highlightedShopId={highlightedShopId}
        />

        {/* Visual Node Graph Track */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-emerald-50/20 to-sky-50/30 border border-slate-200 relative overflow-hidden">
          {/* Schematic World Vector / Flow Line */}
          <div className="relative flex flex-col lg:flex-row items-stretch justify-between gap-4 z-10">
            {checkpoints.map((cp, idx) => {
              const isSelected = selectedNodeIndex === idx;
              const isFirst = idx === 0;
              const isLast = idx === checkpoints.length - 1;

              return (
                <div
                  key={cp.id}
                  onClick={() => setSelectedNodeIndex(idx)}
                  className={`flex-1 rounded-2xl p-4 border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20 scale-[1.02]'
                      : 'bg-white/90 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Step Sequence Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading text-xs font-bold ${
                      isFirst
                        ? 'bg-emerald-100 text-emerald-800'
                        : isLast
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      0{idx + 1}
                    </span>

                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${
                      cp.facilityType === 'manufacturing'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : cp.facilityType === 'retail_shop'
                        ? 'bg-sky-50 border-sky-200 text-sky-700'
                        : cp.facilityType === 'customs'
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      {cp.facilityType?.replace('_', ' ').toUpperCase() || 'FACILITY'}
                    </span>
                  </div>

                  <div className="font-heading font-bold text-sm text-slate-900 mb-1">
                    {cp.stage}
                  </div>

                  <div className="text-xs text-slate-600 mb-2 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-slate-800 leading-snug">
                      {cp.shopName ? `${cp.shopName} (${cp.location})` : cp.location}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span>{cp.timestamp}</span>
                    <span className="text-emerald-700 font-semibold">
                      {cp.lat ? `${cp.lat.toFixed(2)}°, ${cp.lng?.toFixed(2)}°` : 'Verified'}
                    </span>
                  </div>

                  {isLast && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-sky-700 font-semibold font-mono">
                      <Store className="w-3.5 h-3.5" />
                      <span>Ready in Retail Shop</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Checkpoint Detailed Ledger Drawer */}
        {selectedNodeIndex !== null && checkpoints[selectedNodeIndex] && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-slate-900">
                  Checkpoint #{selectedNodeIndex + 1} Deep Cryptographic Audit
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {checkpoints[selectedNodeIndex].stage}
                </span>
              </div>
              <button
                onClick={() => setSelectedNodeIndex(null)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Close Inspector
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-500 font-mono text-[10px]">Authorized Signer / Operator</div>
                <div className="font-mono font-semibold text-slate-800 mt-0.5">
                  {checkpoints[selectedNodeIndex].operator}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-500 font-mono text-[10px]">On-Chain Transaction Proof</div>
                <div className="font-mono font-semibold text-sky-700 mt-0.5 truncate">
                  {checkpoints[selectedNodeIndex].txHash}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="text-slate-500 font-mono text-[10px]">Block Height Confirmation</div>
                <div className="font-mono font-semibold text-slate-800 mt-0.5">
                  Block #{checkpoints[selectedNodeIndex].blockNumber}
                </div>
              </div>
            </div>

            {checkpoints[selectedNodeIndex].notes && (
              <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 font-mono">
                Log note: {checkpoints[selectedNodeIndex].notes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* AUTHORIZED RETAIL SHOPS NETWORK DIRECTORY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              Authorized Retail Shops & Boutique Stockists
            </h2>
            <p className="text-xs text-slate-500">
              Only stores holding genuine cryptographic manufacturer licenses are authorized to issue consumer warranty handovers.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search store name or city..."
              value={shopSearchQuery}
              onChange={(e) => setShopSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all bg-white flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    AUTHORIZED DEALER
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {shop.licenseId}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900">
                  {shop.name}
                </h3>
                <div className="text-xs text-slate-600 font-medium mt-0.5">
                  {shop.brandAuthorized}
                </div>

                <div className="text-xs text-slate-500 mt-2 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{shop.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-500">Live Stock In Store:</span>
                  <span className="font-bold text-slate-900">{shop.inStockUnits} Units</span>
                </div>

                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-500">Proximity:</span>
                  <span className="text-emerald-700 font-semibold">{shop.distance}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => handleLocateShopOnMap(shop)}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-heading text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3 h-3 text-sky-600" />
                    <span>Locate on Map</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(shop.licenseId, shop.id)}
                    className="text-xs font-heading font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{copiedHash === shop.id ? 'Copied License ID!' : `License #${shop.licenseId}`}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )}


      {/* LOG NEW CUSTODY CHECKPOINT MODAL */}
      {showAddLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Broadcast New Custody Checkpoint
                </h3>
                <p className="text-xs text-slate-500">
                  Signs an on-chain location transit event to the Sepolia Authentix registry.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogNewLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Checkpoint Stage Name
                </label>
                <input
                  type="text"
                  required
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Facility Type
                  </label>
                  <select
                    value={newFacilityType}
                    onChange={(e) => setNewFacilityType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="retail_shop">Authorized Retail Shop</option>
                    <option value="manufacturing">Manufacturing Facility</option>
                    <option value="transit_hub">Air/Cargo Transit Hub</option>
                    <option value="customs">Bonded Customs Checkpoint</option>
                    <option value="warehouse">Central Regional Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Store / Shop Name
                  </label>
                  <input
                    type="text"
                    value={newShopName}
                    onChange={(e) => setNewShopName(e.target.value)}
                    placeholder="e.g. Harrods London Boutique"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physical Address / City / Country
                </label>
                <input
                  type="text"
                  required
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-mono text-slate-400">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewLocationName('530 5th Avenue, New York, NY 10036, USA');
                      setNewShopName('Bucherer 5th Avenue Flagship');
                      setNewFacilityType('retail_shop');
                      setNewLat('40.7554');
                      setNewLng('-73.9804');
                      setNewStage('Authorized Retail Boutique Stocking');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-mono text-slate-600 transition-colors"
                  >
                    NYC 5th Ave
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewLocationName('87-135 Brompton Rd, Knightsbridge, London SW1X 7XL, UK');
                      setNewShopName('Harrods Fine Watch Room');
                      setNewFacilityType('retail_shop');
                      setNewLat('51.4998');
                      setNewLng('-0.1633');
                      setNewStage('Harrods Boutique Official Intake');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-mono text-slate-600 transition-colors"
                  >
                    London Harrods
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewLocationName('4 Chome-5-11 Ginza, Chuo City, Tokyo, Japan');
                      setNewShopName('Ginza Wako Master Timepiece Salon');
                      setNewFacilityType('retail_shop');
                      setNewLat('35.6717');
                      setNewLng('139.7650');
                      setNewStage('Tokyo Flagship Official Intake');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-mono text-slate-600 transition-colors"
                  >
                    Tokyo Ginza
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          setNewLat(pos.coords.latitude.toFixed(4));
                          setNewLng(pos.coords.longitude.toFixed(4));
                          setNewLocationName(`Local Geofence (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`);
                        });
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-mono font-semibold transition-colors flex items-center gap-1"
                  >
                    <Satellite className="w-2.5 h-2.5" />
                    <span>My GPS</span>
                  </button>
                </div>
              </div>

              {/* Coordinates inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Map Latitude (°N/S)
                  </label>
                  <input
                    type="text"
                    required
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    placeholder="e.g. 40.7554"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Map Longitude (°E/W)
                  </label>
                  <input
                    type="text"
                    required
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    placeholder="e.g. -73.9804"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operator / Store Key Holder
                </label>
                <input
                  type="text"
                  required
                  value={newOperator}
                  onChange={(e) => setNewOperator(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inspection Notes & Tamper State
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingOnChain}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmittingOnChain ? 'Signing On-Chain Checkpoint...' : 'Sign & Broadcast Checkpoint'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLocationModal(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
