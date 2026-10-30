import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { PILOT_DISTRICTS, DISTRICTS, DISTRICT_METRICS } from '../../data/benchmarkData';
import { FORECAST_DATA } from '../../data/demoData';
import { calculateBlendedForecast, getRainfallColorClass, getConfidenceLevel, weightsToPercent } from '../../utils/calculations';
import { MapPin, Layers, CheckCircle2, ShieldCheck, Database, Scale } from 'lucide-react';

const KERALA_GEOJSON = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { district: "Thiruvananthapuram" }, geometry: { type: "Polygon", coordinates: [[[76.70,8.18],[77.20,8.18],[77.35,8.45],[77.20,8.80],[76.90,8.90],[76.70,8.70],[76.55,8.45],[76.70,8.18]]] }},
    { type: "Feature", properties: { district: "Kottayam" }, geometry: { type: "Polygon", coordinates: [[[76.35,9.35],[76.90,9.35],[77.05,9.70],[76.90,10.00],[76.55,10.00],[76.35,9.70],[76.20,9.50],[76.35,9.35]]] }},
    { type: "Feature", properties: { district: "Pathanamthitta" }, geometry: { type: "Polygon", coordinates: [[[76.60,8.90],[77.15,8.90],[77.30,9.25],[77.10,9.50],[76.75,9.55],[76.55,9.35],[76.45,9.10],[76.60,8.90]]] }},
    { type: "Feature", properties: { district: "Idukki" }, geometry: { type: "Polygon", coordinates: [[[76.80,9.55],[77.30,9.55],[77.55,9.90],[77.45,10.30],[77.05,10.40],[76.75,10.25],[76.60,9.90],[76.80,9.55]]] }},
    { type: "Feature", properties: { district: "Ernakulam" }, geometry: { type: "Polygon", coordinates: [[[76.15,9.90],[76.65,9.90],[76.85,10.20],[76.80,10.50],[76.45,10.55],[76.10,10.35],[76.00,10.10],[76.15,9.90]]] }},
    { type: "Feature", properties: { district: "Wayanad" }, geometry: { type: "Polygon", coordinates: [[[75.75,11.40],[76.20,11.40],[76.35,11.75],[76.15,12.00],[75.80,12.00],[75.55,11.75],[75.60,11.55],[75.75,11.40]]] }},
  ]
};

const COLORS = { ifs: '#38bdf8', gfs: '#34d399', imd: '#a78bfa' };

export default function SpatialMapView({ district, date, onDistrictSelect }) {
  const districtData = (FORECAST_DATA[district] && FORECAST_DATA[district][date]) || {
    date: date || '2025-08-28',
    district: district || 'Pathanamthitta',
    lat: 9.25,
    lon: 76.75,
    elevation_m: 15,
    forecasts: { ifs: 34.4, gfs: 62.2, aifs: 49.7 },
    weights: { ifs: 0.45, gfs: 0.55 },
    adaptive_blend: 49.7,
    transferred_blend: 49.7,
    imd_rain: 41.2,
    regime: 'Heavy (>= 35 mm)',
    confidence: 0.82
  };

  const districtMeta = PILOT_DISTRICTS.find((d) => d.name === district) || PILOT_DISTRICTS[0];
  const districtMetrics = (DISTRICT_METRICS[district] && DISTRICT_METRICS[district]['Transferred Benchmark Blend']) || {};

  const forecasts = districtData.forecasts;
  const weights = districtData.weights;
  const blended = districtData.transferred_blend || districtData.adaptive_blend || calculateBlendedForecast(forecasts, weights);
  const pct = weightsToPercent(weights);

  const styleFeature = (feature) => {
    const d = feature.properties.district;
    const dForecast = (FORECAST_DATA[d] && FORECAST_DATA[d][date] && (FORECAST_DATA[d][date].transferred_blend || FORECAST_DATA[d][date].adaptive_blend)) || blended;
    const fillColor = getRainfallColorClass(dForecast);
    const isSelected = d === district;

    return {
      fillColor,
      weight: isSelected ? 3 : 1.2,
      color: isSelected ? '#f59e0b' : '#475569',
      fillOpacity: isSelected ? 0.9 : 0.65,
    };
  };

  const onEachFeature = (feature, layer) => {
    const d = feature.properties.district;
    const dForecast = (FORECAST_DATA[d] && FORECAST_DATA[d][date] && (FORECAST_DATA[d][date].transferred_blend || FORECAST_DATA[d][date].adaptive_blend)) || blended;

    layer.bindTooltip(
      `<div style="font-family:Inter,system-ui;padding:4px 8px;background:rgba(15,23,42,0.95);border:1px solid rgba(245,158,11,0.4);border-radius:6px;color:#fff;">
        <div style="font-weight:700;font-size:12px;">${d}</div>
        <div style="font-size:10px;color:#94a3b8;">${feature.properties.district} Pilot Cell</div>
        <div style="font-size:11px;color:#f59e0b;margin-top:2px;">Consensus Blend: <strong>${dForecast} mm</strong></div>
      </div>`,
      { permanent: false, sticky: true, direction: 'top' }
    );

    layer.on({
      click: () => { onDistrictSelect(d); },
      mouseover: (e) => { e.target.setStyle({ weight: 3, fillOpacity: 0.95 }); },
      mouseout: (e) => { e.target.setStyle(styleFeature(feature)); },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      {/* Left 2 Cols: Interactive Map Container */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Kerala 6-District Pilot — Spatial Map
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select any district to inspect its representative IMD 0.25° grid cell. All values derive from Phase 3 historical evaluations.
            </p>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800/60 self-start sm:self-auto">
            {district}: {districtMeta.lat}°N, {districtMeta.lon}°E ({districtMeta.elevation_m}m)
          </span>
        </div>

        {/* Map */}
        <div className="relative rounded-lg overflow-hidden border border-slate-800 h-[300px] sm:h-[380px] lg:h-[440px]">
          <MapContainer 
            center={[10.2, 76.4]} 
            zoom={7} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', background: '#020617' }} 
            zoomControl={true} 
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; CartoDB" />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <GeoJSON key={`${date}-${district}`} data={KERALA_GEOJSON} style={styleFeature} onEachFeature={onEachFeature} />
          </MapContainer>

          {/* Floating Map Legend */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-[1000] bg-slate-950/95 border border-slate-700/80 rounded-lg p-2 sm:p-2.5 text-[9px] sm:text-[10px] backdrop-blur-md shadow-xl max-w-[calc(100%-16px)]">
            <span className="font-bold text-slate-300 block mb-1 font-mono">Precipitation Scale (mm/24h):</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { color: '#1e3a5c', label: '< 5' },
                { color: '#1e40af', label: '5–15' },
                { color: '#2563eb', label: '15–35' },
                { color: '#3b82f6', label: '35–65' },
                { color: '#60a5fa', label: '65+' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ background: item.color }} />
                  <span className="text-slate-400 font-mono">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right 1 Col: District Telemetry Inspector & Quick Selector Grid */}
      <div className="space-y-4">
        
        {/* Selected District Telemetry */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
            <div>
              <p className="text-[10px] font-mono uppercase text-amber-400 font-bold">{districtMeta.zone}</p>
              <h4 className="text-lg font-bold text-white">{district}</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-mono">Transferred Blend</span>
              <span className="text-2xl font-extrabold font-mono text-amber-400">{blended} mm</span>
            </div>
          </div>

          <div className="space-y-2 my-3 text-xs">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Grid Cell Coordinates</span>
              <span className="text-slate-200 font-medium font-mono">
                {districtMeta.lat.toFixed(2)}°N, {districtMeta.lon.toFixed(2)}°E &bull; Elev: {districtMeta.elevation_m}m
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Topography & Terrain</span>
              <span className="text-slate-200 font-medium">{districtMeta.terrain}</span>
            </div>
            {districtMetrics.mae !== undefined && (
              <div className="p-2 rounded bg-slate-950 border border-amber-500/30 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Locked Test MAE:</span>
                <span className="font-bold text-white">{districtMetrics.mae.toFixed(2)} mm</span>
                <span className="text-slate-400 ml-2">CSI-15.6:</span>
                <span className="font-bold text-amber-400">{districtMetrics.csi_15_6 !== null ? districtMetrics.csi_15_6.toFixed(3) : '0.000'}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Forecast Inputs ({date})</p>
            
            {[
              { label: 'ECMWF IFS (9km)', val: forecasts.ifs, wt: pct.ifs, color: COLORS.ifs },
              { label: 'NCEP GFS (13km)', val: forecasts.gfs, wt: pct.gfs, color: COLORS.gfs },
            ].map(({ label, val, wt, color }) => (
              <div key={label} className="bg-slate-950 rounded-lg p-2.5 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{label}</span>
                  <span className="font-mono font-bold text-white">{val} mm</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${wt}%`, background: color }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold w-9 text-right" style={{ color }}>{wt}%</span>
                </div>
              </div>
            ))}
          </div>

          {districtData.imd_rain !== undefined && (
            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">IMD Ground Truth:</span>
              <span className="font-bold text-purple-300 font-mono">{districtData.imd_rain} mm</span>
            </div>
          )}
        </div>

        {/* 6 Pilot Districts Quick Switcher */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Switch Pilot District (6-District Scope)
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {PILOT_DISTRICTS.map((d) => {
              const isCurrent = d.name === district;

              return (
                <button
                  key={d.name}
                  onClick={() => onDistrictSelect(d.name)}
                  className={`p-2.5 rounded-lg text-left transition-all text-xs border flex flex-col justify-between min-h-[44px] cursor-pointer touch-manipulation ${
                    isCurrent
                      ? 'bg-amber-600 text-slate-950 border-amber-500 shadow-md font-bold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{d.name}</span>
                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />}
                  </div>
                  <span className={`text-[10px] font-mono mt-1 truncate ${isCurrent ? 'text-slate-950' : 'text-slate-400'}`}>
                    {d.zone}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
