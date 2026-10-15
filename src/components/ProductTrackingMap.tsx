import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  CustodyCheckpoint, 
  ProductItem 
} from '../types';
import { 
  Layers, 
  Maximize2, 
  Minimize2, 
  Navigation, 
  Factory, 
  Store, 
  Plane, 
  Building2, 
  ShieldCheck, 
  Play, 
  RotateCcw,
  Compass,
  MapPin
} from 'lucide-react';

interface ProductTrackingMapProps {
  product: ProductItem | null;
  checkpoints: CustodyCheckpoint[];
  selectedCheckpointIndex: number | null;
  onSelectCheckpoint: (index: number) => void;
  authorizedShops?: Array<{
    id: string;
    name: string;
    address: string;
    lat?: number;
    lng?: number;
    coordinates?: string;
    isAuthorized?: boolean;
    inStockUnits?: number;
  }>;
  highlightedShopId?: string | null;
}

// Calculate Haversine distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const ProductTrackingMap: React.FC<ProductTrackingMapProps> = ({
  product,
  checkpoints,
  selectedCheckpointIndex,
  onSelectCheckpoint,
  authorizedShops = [],
  highlightedShopId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const transitPulseMarkerRef = useRef<L.Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showAllShops, setShowAllShops] = useState<boolean>(true);
  const [isSimulatingTransit, setIsSimulatingTransit] = useState<boolean>(false);
  const [transitProgress, setTransitProgress] = useState<number>(0);

  // Filter valid coordinates
  const validCheckpoints = checkpoints.filter(
    (cp) => typeof cp.lat === 'number' && typeof cp.lng === 'number' && !isNaN(cp.lat) && !isNaN(cp.lng)
  );

  // Total journey distance
  const totalDistanceKm = validCheckpoints.reduce((acc, curr, idx) => {
    if (idx === 0) return 0;
    const prev = validCheckpoints[idx - 1];
    return acc + calculateDistance(prev.lat!, prev.lng!, curr.lat!, curr.lng!);
  }, 0);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = validCheckpoints.length > 0 
        ? [validCheckpoints[0].lat!, validCheckpoints[0].lng!] 
        : [46.2044, 6.1432];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 4,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Attribution small in bottom left
      L.control.attribution({
        position: 'bottomleft',
        prefix: '<span class="text-[10px] text-slate-500 font-mono">Authentix GPS · Leaflet · © OSM</span>'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mapType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let options: L.TileLayerOptions = {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    };

    if (mapType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      options = { maxZoom: 18 };
    } else if (mapType === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      options = { maxZoom: 19, subdomains: 'abcd' };
    }

    const layer = L.tileLayer(url, options).addTo(map);
    tileLayerRef.current = layer;
  }, [mapType]);

  // Update Markers and Polyline Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing checkpoint markers & polyline
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (transitPulseMarkerRef.current) {
      map.removeLayer(transitPulseMarkerRef.current);
      transitPulseMarkerRef.current = null;
    }

    if (validCheckpoints.length === 0) return;

    const latLngs: [number, number][] = validCheckpoints.map((cp) => [cp.lat!, cp.lng!]);

    // Draw Transit Polyline route
    const polyline = L.polyline(latLngs, {
      color: mapType === 'dark' ? '#10b981' : '#059669',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(map);
    polylineRef.current = polyline;

    // Create markers for each milestone
    validCheckpoints.forEach((cp, idx) => {
      const isManufacturing = cp.facilityType === 'manufacturing' || idx === 0;
      const isRetail = cp.facilityType === 'retail_shop' || idx === validCheckpoints.length - 1;
      const isSelected = selectedCheckpointIndex === idx;

      let badgeBg = 'bg-slate-800 text-white border-slate-700';
      let iconColor = 'text-white';
      let pinLabel = `0${idx + 1}`;
      let haloColor = 'border-slate-400';

      if (isManufacturing) {
        badgeBg = 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/50';
        iconColor = 'text-white';
        haloColor = 'border-emerald-400 animate-ping';
      } else if (isRetail) {
        badgeBg = 'bg-sky-600 text-white border-sky-400 shadow-sky-500/50';
        iconColor = 'text-white';
        haloColor = 'border-sky-400 animate-ping';
      } else if (cp.facilityType === 'customs') {
        badgeBg = 'bg-amber-600 text-white border-amber-400';
      }

      const customHtml = `
        <div class="relative group cursor-pointer flex flex-col items-center">
          ${isSelected ? `<div class="absolute -inset-3 rounded-full border-2 border-emerald-500 animate-pulse pointer-events-none"></div>` : ''}
          ${(isManufacturing || isRetail) ? `<div class="absolute -inset-1.5 rounded-full border ${haloColor} opacity-75 pointer-events-none"></div>` : ''}
          <div class="w-8 h-8 rounded-full ${badgeBg} border-2 flex items-center justify-center font-heading font-bold text-xs shadow-md transition-transform transform hover:scale-110">
            ${pinLabel}
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-mono tracking-tight font-semibold shadow-xs whitespace-nowrap border border-slate-700/80 pointer-events-none">
            ${isManufacturing ? '🏭 Factory Origin' : isRetail ? '🏬 Retail Store' : cp.stage.slice(0, 18)}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-checkpoint-marker',
        html: customHtml,
        iconSize: [40, 50],
        iconAnchor: [20, 25]
      });

      const marker = L.marker([cp.lat!, cp.lng!], { icon: customIcon }).addTo(map);

      // Popup card
      const popupContent = `
        <div class="p-3 font-sans text-slate-800 max-w-xs space-y-2">
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
            <span class="text-[10px] font-mono uppercase font-bold text-emerald-600">
              Checkpoint #0${idx + 1} · ${cp.facilityType?.toUpperCase() || 'NODE'}
            </span>
            <span class="text-[10px] font-mono text-slate-400">
              Block #${cp.blockNumber || 19402120}
            </span>
          </div>

          <div class="font-heading font-bold text-sm text-slate-900 leading-tight">
            ${cp.stage}
          </div>

          <div class="text-xs text-slate-600 flex items-start gap-1">
            <span class="font-semibold text-slate-700">${cp.shopName ? `${cp.shopName} - ` : ''}</span>
            <span>${cp.location}</span>
          </div>

          <div class="text-[10px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
            <div class="flex justify-between">
              <span>Timestamp:</span>
              <span class="text-slate-800 font-medium">${cp.timestamp}</span>
            </div>
            <div class="flex justify-between">
              <span>GPS Coordinates:</span>
              <span class="text-emerald-700 font-semibold">${cp.lat?.toFixed(4)}°, ${cp.lng?.toFixed(4)}°</span>
            </div>
            <div class="flex justify-between">
              <span>Signer Key:</span>
              <span class="truncate max-w-[140px] text-slate-700">${cp.operator}</span>
            </div>
            <div class="flex justify-between">
              <span>Tamper Seal:</span>
              <span class="${cp.tamperSealIntact ? 'text-emerald-600' : 'text-rose-600'} font-bold">
                ${cp.tamperSealIntact ? '✓ SEALED INTACT' : '⚠ TAMPERED'}
              </span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'authentix-custom-popup',
        maxWidth: 280
      });

      marker.on('click', () => {
        onSelectCheckpoint(idx);
      });

      markersRef.current.push(marker);
    });

    // Fit map bounds to show full route
    if (validCheckpoints.length > 1) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
    } else if (validCheckpoints.length === 1) {
      map.setView([validCheckpoints[0].lat!, validCheckpoints[0].lng!], 11);
    }
  }, [validCheckpoints, selectedCheckpointIndex, mapType]);

  // When selectedCheckpointIndex changes, pan smoothly to that node
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || selectedCheckpointIndex === null) return;
    const cp = validCheckpoints[selectedCheckpointIndex];
    if (cp && typeof cp.lat === 'number' && typeof cp.lng === 'number') {
      map.flyTo([cp.lat, cp.lng], 13, { duration: 1.2 });
      if (markersRef.current[selectedCheckpointIndex]) {
        markersRef.current[selectedCheckpointIndex].openPopup();
      }
    }
  }, [selectedCheckpointIndex]);

  // Render Authorized Retail Shops as secondary pins if enabled
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !showAllShops) return;

    const shopMarkers: L.Marker[] = [];

    authorizedShops.forEach((shop) => {
      let lat: number | undefined = shop.lat;
      let lng: number | undefined = shop.lng;

      if ((!lat || !lng) && shop.coordinates) {
        // Parse from "40.7554° N, 73.9804° W"
        const parts = shop.coordinates.split(',');
        if (parts.length === 2) {
          const latVal = parseFloat(parts[0]);
          const lngVal = parseFloat(parts[1]);
          const latDir = parts[0].includes('S') ? -1 : 1;
          const lngDir = parts[1].includes('W') ? -1 : 1;
          lat = latVal * latDir;
          lng = lngVal * lngDir;
        }
      }

      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

      const isHighlighted = highlightedShopId === shop.id;

      const shopHtml = `
        <div class="relative group cursor-pointer flex flex-col items-center">
          ${isHighlighted ? `<div class="absolute -inset-2 rounded-full border-2 border-sky-400 animate-ping"></div>` : ''}
          <div class="w-6 h-6 rounded-lg ${isHighlighted ? 'bg-sky-500 scale-125' : 'bg-slate-700 hover:bg-sky-600'} text-white border border-white flex items-center justify-center shadow-md transition-all">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div class="mt-0.5 px-1.5 py-0.2 rounded bg-slate-900/80 text-[9px] text-white font-mono whitespace-nowrap shadow-xs">
            ${shop.name.slice(0, 16)}
          </div>
        </div>
      `;

      const shopIcon = L.divIcon({
        className: 'authorized-shop-marker',
        html: shopHtml,
        iconSize: [32, 40],
        iconAnchor: [16, 20]
      });

      const m = L.marker([lat, lng], { icon: shopIcon }).addTo(map);

      m.bindPopup(`
        <div class="p-2.5 font-sans text-slate-800 space-y-1">
          <div class="text-[10px] font-mono text-sky-700 font-bold uppercase">Authorized Retail Boutique</div>
          <div class="font-heading font-bold text-xs text-slate-900">${shop.name}</div>
          <div class="text-[11px] text-slate-600">${shop.address}</div>
          ${shop.inStockUnits ? `<div class="text-[10px] font-mono text-emerald-700 font-semibold mt-1">✓ In-Stock: ${shop.inStockUnits} Units</div>` : ''}
        </div>
      `);

      shopMarkers.push(m);
    });

    return () => {
      shopMarkers.forEach((m) => map.removeLayer(m));
    };
  }, [showAllShops, authorizedShops, highlightedShopId]);

  // Center on Manufacturing Genesis
  const handleFocusManufacturing = () => {
    const map = mapInstanceRef.current;
    if (!map || validCheckpoints.length === 0) return;
    const origin = validCheckpoints[0];
    onSelectCheckpoint(0);
    map.flyTo([origin.lat!, origin.lng!], 13, { duration: 1.2 });
  };

  // Center on Current Destination / Retail Shop
  const handleFocusDestination = () => {
    const map = mapInstanceRef.current;
    if (!map || validCheckpoints.length === 0) return;
    const destIdx = validCheckpoints.length - 1;
    const dest = validCheckpoints[destIdx];
    onSelectCheckpoint(destIdx);
    map.flyTo([dest.lat!, dest.lng!], 13, { duration: 1.2 });
  };

  // Fit entire transit path
  const handleFitEntireRoute = () => {
    const map = mapInstanceRef.current;
    if (!map || validCheckpoints.length === 0) return;
    const latLngs: [number, number][] = validCheckpoints.map((cp) => [cp.lat!, cp.lng!]);
    map.fitBounds(latLngs, { padding: [60, 60], maxZoom: 12 });
  };

  // Simulate in-transit cargo journey along the path
  const handleSimulateTransit = () => {
    const map = mapInstanceRef.current;
    if (!map || validCheckpoints.length < 2) return;

    if (isSimulatingTransit) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (transitPulseMarkerRef.current) map.removeLayer(transitPulseMarkerRef.current);
      setIsSimulatingTransit(false);
      setTransitProgress(0);
      return;
    }

    setIsSimulatingTransit(true);
    setTransitProgress(0);

    const points = validCheckpoints.map((cp) => [cp.lat!, cp.lng!] as [number, number]);
    const duration = 8000; // 8 seconds journey
    const startTime = performance.now();

    // Create transit beacon icon
    const transitHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping"></div>
        <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg text-white">
          <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </div>
        <div class="absolute top-9 px-2 py-0.5 rounded-full bg-emerald-900 text-white font-mono text-[9px] font-bold whitespace-nowrap shadow-md">
          LIVE CARGO IN TRANSIT
        </div>
      </div>
    `;

    const beaconIcon = L.divIcon({
      className: 'transit-beacon-marker',
      html: transitHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const beaconMarker = L.marker(points[0], { icon: beaconIcon }).addTo(map);
    transitPulseMarkerRef.current = beaconMarker;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setTransitProgress(Math.round(progress * 100));

      // Calculate position along polyline segments
      const totalSegments = points.length - 1;
      const segmentProgress = progress * totalSegments;
      const currentSegment = Math.min(Math.floor(segmentProgress), totalSegments - 1);
      const segmentT = segmentProgress - currentSegment;

      const p1 = points[currentSegment];
      const p2 = points[currentSegment + 1];

      const currentLat = p1[0] + (p2[0] - p1[0]) * segmentT;
      const currentLng = p1[1] + (p2[1] - p1[1]) * segmentT;

      beaconMarker.setLatLng([currentLat, currentLng]);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSimulatingTransit(false);
        // Popup when reached destination shop
        beaconMarker.bindPopup(`
          <div class="p-2 text-xs font-sans text-slate-800">
            <strong class="text-emerald-700">✓ In-Transit Delivery Handover Completed!</strong>
            <p class="text-slate-600 mt-1">Product securely checked into destination store inventory.</p>
          </div>
        `).openPopup();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : ''}`}>
      {/* Top Map Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                Interactive Geospatial Supply Chain Map
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-semibold">
                LIVE GPS
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{validCheckpoints.length} On-Chain Geographic Milestones</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">
                {totalDistanceKm.toLocaleString()} km Total Transit Path
              </span>
            </div>
          </div>
        </div>

        {/* Action button toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Map Layer switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setMapType('streets')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                mapType === 'streets' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Streets
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                mapType === 'satellite' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                mapType === 'dark' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cyber Dark
            </button>
          </div>

          {/* Focus Manufacturing */}
          <button
            onClick={handleFocusManufacturing}
            title="Focus Factory of Origin"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Factory className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Genesis Origin</span>
          </button>

          {/* Focus Retail Shop */}
          <button
            onClick={handleFocusDestination}
            title="Focus Destination Retail Store"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Current Shop</span>
          </button>

          {/* Reset / Fit all bounds */}
          <button
            onClick={handleFitEntireRoute}
            title="View entire flight and road transit"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Fit Route</span>
          </button>

          {/* Simulate in-transit beacon */}
          <button
            onClick={handleSimulateTransit}
            disabled={validCheckpoints.length < 2}
            className={`px-3 py-1.5 rounded-xl font-heading text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isSimulatingTransit
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isSimulatingTransit ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Stop Flight ({transitProgress}%)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Transit</span>
              </>
            )}
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div
          ref={mapContainerRef}
          className={`w-full transition-all ${isFullscreen ? 'h-[80vh]' : 'h-[440px] sm:h-[500px]'}`}
          style={{ minHeight: '360px' }}
        />

        {/* Floating Route Legend & Key */}
        <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/90 shadow-lg text-xs space-y-2 pointer-events-auto max-w-[240px]">
          <div className="font-heading font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Transit Milestones</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white flex-shrink-0 shadow-2xs"></span>
              <span className="text-slate-700 font-medium">Genesis Factory Plant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white flex-shrink-0 shadow-2xs"></span>
              <span className="text-slate-700 font-medium">Customs & Air Cargo Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-700 border border-white flex-shrink-0 shadow-2xs"></span>
              <span className="text-slate-700 font-medium">Bonded Warehouse Vault</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-600 border border-white flex-shrink-0 shadow-2xs"></span>
              <span className="text-slate-700 font-medium">Authorized Retail Store</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Dashed Green Line:</span>
            <span className="text-emerald-700 font-semibold">Verified Safe Route</span>
          </div>
        </div>

        {/* Floating Toggle for Authorized Retail Network Pins */}
        <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAllShops}
              onChange={(e) => setShowAllShops(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="font-heading font-semibold text-slate-800 text-xs">
              Show All Authorized Shops ({authorizedShops.length})
            </span>
          </label>
        </div>

        {/* Floating Bottom Quick Location Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none flex justify-center">
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-slate-700/80 shadow-xl flex items-center gap-4 text-xs font-mono max-w-2xl overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Click any stop to inspect on-chain details:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {validCheckpoints.map((cp, idx) => (
                <button
                  key={cp.id}
                  onClick={() => onSelectCheckpoint(idx)}
                  className={`px-2 py-1 rounded-lg text-[10px] transition-colors ${
                    selectedCheckpointIndex === idx
                      ? 'bg-emerald-600 text-white font-bold ring-1 ring-emerald-300'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  #{idx + 1} {cp.stage.slice(0, 14)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
