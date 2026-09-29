import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FORECAST_DATA } from '../data/demoData';
import { calculateBlendedForecast, getRainfallColorClass, getConfidenceLevel, weightsToPercent } from '../utils/calculations';
import { X } from 'lucide-react';

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

function DistrictPanel({ district, date, onClose }) {
  if (!district) return null;
  const distData = FORECAST_DATA[district] || {};
  const data = distData[date] || Object.values(distData)[0];
  if (!data) return null;

  const { forecasts, weights, confidence } = data;
  const blended = calculateBlendedForecast(forecasts, weights);
  const pct = weightsToPercent(weights);
  const confLevel = getConfidenceLevel(confidence);

  const models = [
    { key: 'ifs', label: 'ECMWF IFS', color: COLORS.ifs },
    { key: 'gfs', label: 'NCEP GFS', color: COLORS.gfs },
    { key: 'aifs', label: 'ECMWF AIFS', color: COLORS.aifs },
  ];

  return (
    <div className="absolute top-3 right-3 z-[1000] w-60"
      style={{ background: 'rgba(10,22,40,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 14 }}>
      <div className="p-4" style={{ borderBottom: '1px solid rgba(56,189,248,0.1)' }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">Pilot District</p>
            <h3 className="text-sm font-bold text-white">{district}</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-1">
          <p className="text-[10px] text-slate-500">Blended Forecast</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-white">{blended}</span>
            <span className="text-slate-500 text-xs mb-0.5">mm</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sources</p>
        <div className="space-y-1.5 mb-3">
          {models.map(({ key, label, color }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{label}</span>
              <span className="text-[11px] font-bold" style={{ color }}>{forecasts[key]} mm</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Weights</p>
        <div className="space-y-1.5 mb-3">
          {models.map(({ key, color }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 w-8">{key.toUpperCase()}</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.1)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct[key]}%`, background: color }} />
              </div>
              <span className="text-[10px] font-bold w-7 text-right" style={{ color }}>{pct[key]}%</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(56,189,248,0.08)' }}>
          <span className="text-[10px] text-slate-500">Confidence</span>
          <span className={`text-[11px] font-bold ${confLevel.color}`}>{confLevel.label}</span>
        </div>
      </div>
    </div>
  );
}

export default function KeralaMap({ district, date, onDistrictSelect }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const getDistrictData = (d) => {
    const distData = FORECAST_DATA[d] || {};
    return distData[date] || Object.values(distData)[0];
  };

  const styleFeature = (feature) => {
    const d = feature.properties.district;
    const data = getDistrictData(d);
    if (!data) return { fillColor: '#1e3a5c', weight: 1, color: '#334155', fillOpacity: 0.5 };

    const blended = calculateBlendedForecast(data.forecasts, data.weights);
    const fillColor = getRainfallColorClass(blended);
    const isSelected = d === district;

    return {
      fillColor,
      weight: isSelected ? 2.5 : 1,
      color: isSelected ? '#22d3ee' : '#475569',
      fillOpacity: isSelected ? 0.85 : 0.65,
    };
  };

  const onEachFeature = (feature, layer) => {
    const d = feature.properties.district;
    const data = getDistrictData(d);
    const blended = data ? calculateBlendedForecast(data.forecasts, data.weights) : '—';

    layer.bindTooltip(
      `<div style="font-family:Inter,system-ui;padding:4px 8px;background:rgba(10,22,40,0.95);border:1px solid rgba(56,189,248,0.2);border-radius:8px;backdrop-filter:blur(8px)">
        <div style="font-weight:700;color:#e2e8f0;font-size:12px">${d}</div>
        <div style="font-size:11px;color:#94a3b8">GreenSky: <strong style="color:#22d3ee">${blended} mm</strong></div>
      </div>`,
      { permanent: false, sticky: true, direction: 'top', className: '' }
    );

    layer.on({
      click: () => { setSelectedFeature(d); onDistrictSelect(d); },
      mouseover: (e) => { e.target.setStyle({ weight: 2.5, fillOpacity: 0.9 }); },
      mouseout: (e) => { e.target.setStyle(styleFeature(feature)); },
    });
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">Kerala Pilot — Rainfall Map</h2>
        </div>
        <span className="text-xs text-slate-500">6 pilot districts</span>
      </div>

      <div className="relative rounded-xl overflow-hidden" style={{ height: 400, border: '1px solid rgba(56,189,248,0.08)' }}>
        <MapContainer center={[10.2, 76.4]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={true} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <GeoJSON key={`${date}-${district}`} data={KERALA_GEOJSON} style={styleFeature} onEachFeature={onEachFeature} />
        </MapContainer>
        <DistrictPanel district={selectedFeature} date={date} onClose={() => setSelectedFeature(null)} />
      </div>

      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-500 mr-1">Rainfall (mm):</span>
        {[
          { color: '#1e3a5c', label: '0–10' },
          { color: '#1e40af', label: '10–25' },
          { color: '#2563eb', label: '25–50' },
          { color: '#3b82f6', label: '50–100' },
          { color: '#60a5fa', label: '100+' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ background: item.color }} />
            <span className="text-[10px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
