import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DISTRICTS, FORECAST_DATA } from '../../data/demoData';
import { calculateBlendedForecast, getRainfallColorClass, getConfidenceLevel, weightsToPercent } from '../../utils/calculations';
import { MapPin, Layers, CheckCircle2 } from 'lucide-react';

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

const COLORS = { ifs: '#38bdf8', gfs: '#34d399', aifs: '#a78bfa' };

export default function SpatialMapView({ district, date, onDistrictSelect }) {
  const selectedData = FORECAST_DATA[district]?.[date] || FORECAST_DATA['Pathanamthitta']['2026-07-01'];
  const { forecasts, weights, confidence } = selectedData;
  const blended = calculateBlendedForecast(forecasts, weights);
  const pct = weightsToPercent(weights);
  const confLevel = getConfidenceLevel(confidence);

  const getDistrictData = (d) => FORECAST_DATA[d]?.[date];

  const styleFeature = (feature) => {
    const d = feature.properties.district;
    const data = getDistrictData(d);
    if (!data) return { fillColor: '#1e3a5c', weight: 1, color: '#334155', fillOpacity: 0.5 };

    const b = calculateBlendedForecast(data.forecasts, data.weights);
    const fillColor = getRainfallColorClass(b);
    const isSelected = d === district;

    return {
      fillColor,
      weight: isSelected ? 3 : 1.2,
      color: isSelected ? '#22d3ee' : '#475569',
      fillOpacity: isSelected ? 0.9 : 0.65,
    };
  };

  const onEachFeature = (feature, layer) => {
    const d = feature.properties.district;
    const data = getDistrictData(d);
    const b = data ? calculateBlendedForecast(data.forecasts, data.weights) : '—';

    layer.bindTooltip(
      `<div style="font-family:Inter,system-ui;padding:4px 8px;background:rgba(10,22,40,0.95);border:1px solid rgba(56,189,248,0.3);border-radius:6px;color:#fff;">
        <div style="font-weight:700;font-size:12px;">${d}</div>
        <div style="font-size:11px;color:#38bdf8;">Blend: <strong>${b} mm</strong></div>
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
      <div className="lg:col-span-2 bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Kerala Pilot — Spatial Precipitation Map
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Interactive 6-district pilot demonstration. Click any district polygon or card to inspect source blend.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
            6 Pilot Districts
          </span>
        </div>

        {/* Map */}
        <div className="relative rounded-lg overflow-hidden border border-slate-800" style={{ height: 440 }}>
          <MapContainer 
            center={[10.2, 76.4]} 
            zoom={7} 
            style={{ height: '100%', width: '100%', background: '#050a14' }} 
            zoomControl={true} 
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; CartoDB" />
            <GeoJSON key={`${date}-${district}`} data={KERALA_GEOJSON} style={styleFeature} onEachFeature={onEachFeature} />
          </MapContainer>

          {/* Floating Map Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-[#070e1c]/95 border border-slate-700/80 rounded-lg p-2 text-[10px] backdrop-blur-md shadow-xl">
            <span className="font-bold text-slate-300 block mb-1.5 font-mono">Precipitation (mm):</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { color: '#1e3a5c', label: '0–10' },
                { color: '#1e40af', label: '10–25' },
                { color: '#2563eb', label: '25–50' },
                { color: '#3b82f6', label: '50–100' },
                { color: '#60a5fa', label: '100+' },
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
        <div className="bg-[#0b1528] border border-cyan-500/30 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
            <div>
              <p className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Inspected District</p>
              <h4 className="text-lg font-bold text-white">{district}</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-mono">Consensus Output</span>
              <span className="text-2xl font-extrabold font-mono text-cyan-300">{blended} mm</span>
            </div>
          </div>

          <div className="space-y-2.5 my-3">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Model Inputs & Weight Share</p>
            
            {[
              { key: 'ifs', label: 'ECMWF IFS', color: COLORS.ifs },
              { key: 'gfs', label: 'NCEP GFS', color: COLORS.gfs },
              { key: 'aifs', label: 'ECMWF AIFS', color: COLORS.aifs },
            ].map(({ key, label, color }) => (
              <div key={key} className="bg-slate-900/80 rounded-lg p-2 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{label}</span>
                  <span className="font-mono font-bold text-white">{forecasts[key]} mm</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct[key]}%`, background: color }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold w-9 text-right" style={{ color }}>{pct[key]}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400">Model Confidence:</span>
            <span className={`font-bold ${confLevel.color}`}>{Math.round(confidence * 100)}% ({confLevel.label})</span>
          </div>
        </div>

        {/* 6 Pilot Districts Quick Switcher */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Switch Pilot District
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {DISTRICTS.map((d) => {
              const dData = FORECAST_DATA[d]?.[date];
              const dBlended = dData ? calculateBlendedForecast(dData.forecasts, dData.weights) : 0;
              const isCurrent = d === district;

              return (
                <button
                  key={d}
                  onClick={() => onDistrictSelect(d)}
                  className={`p-2 rounded-lg text-left transition-all text-xs border flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold truncate">{d}</span>
                    {isCurrent && <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                  </div>
                  <span className="text-[11px] font-mono font-bold mt-1 text-slate-400">
                    {dBlended} mm
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
