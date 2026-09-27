import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FORECAST_DATA, SPATIAL_WEIGHTS } from '../data/demoData';
import {
  calculateBlendedForecast,
  getRainfallColorClass,
  getConfidenceLevel,
  weightsToPercent,
} from '../utils/calculations';
import { X } from 'lucide-react';

// Simplified Kerala GeoJSON — district polygon approximations
// These are simplified bounding polygons for prototype visualization purposes.
const KERALA_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { district: "Thiruvananthapuram" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.70, 8.18], [77.20, 8.18], [77.35, 8.45], [77.20, 8.80],
          [76.90, 8.90], [76.70, 8.70], [76.55, 8.45], [76.70, 8.18]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { district: "Kottayam" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.35, 9.35], [76.90, 9.35], [77.05, 9.70], [76.90, 10.00],
          [76.55, 10.00], [76.35, 9.70], [76.20, 9.50], [76.35, 9.35]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { district: "Pathanamthitta" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.60, 8.90], [77.15, 8.90], [77.30, 9.25], [77.10, 9.50],
          [76.75, 9.55], [76.55, 9.35], [76.45, 9.10], [76.60, 8.90]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { district: "Idukki" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.80, 9.55], [77.30, 9.55], [77.55, 9.90], [77.45, 10.30],
          [77.05, 10.40], [76.75, 10.25], [76.60, 9.90], [76.80, 9.55]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { district: "Ernakulam" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.15, 9.90], [76.65, 9.90], [76.85, 10.20], [76.80, 10.50],
          [76.45, 10.55], [76.10, 10.35], [76.00, 10.10], [76.15, 9.90]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { district: "Wayanad" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.75, 11.40], [76.20, 11.40], [76.35, 11.75], [76.15, 12.00],
          [75.80, 12.00], [75.55, 11.75], [75.60, 11.55], [75.75, 11.40]
        ]]
      }
    },
  ]
};

function DistrictPanel({ district, date, onClose }) {
  if (!district) return null;

  const data = FORECAST_DATA[district]?.[date];
  if (!data) return null;

  const { forecasts, weights, confidence } = data;
  const blended = calculateBlendedForecast(forecasts, weights);
  const pct = weightsToPercent(weights);
  const confLevel = getConfidenceLevel(confidence);

  const models = [
    { key: 'ifs',  label: 'ECMWF IFS',   color: 'bg-blue-500',   text: 'text-blue-700'   },
    { key: 'gfs',  label: 'NCEP GFS',    color: 'bg-green-500',  text: 'text-green-700'  },
    { key: 'aifs', label: 'ECMWF AIFS',  color: 'bg-violet-500', text: 'text-violet-700' },
  ];

  return (
    <div className="absolute top-3 right-3 z-[1000] w-64 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Pilot District</p>
            <h3 className="text-white font-bold text-base leading-tight">{district}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2">
          <p className="text-blue-100 text-[10px]">GreenSky Blended Forecast</p>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-extrabold text-white">{blended}</span>
            <span className="text-white/70 text-sm mb-0.5">mm</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Sources */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sources</p>
        <div className="space-y-1.5 mb-3">
          {models.map(({ key, label, text }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{label}</span>
              <span className={`text-xs font-bold ${text}`}>{forecasts[key]} mm</span>
            </div>
          ))}
        </div>

        {/* Weights */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Adaptive Weights</p>
        <div className="space-y-1.5 mb-3">
          {models.map(({ key, label, color, text }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 w-16 truncate">{label.split(' ')[1]}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${pct[key]}%` }} />
              </div>
              <span className={`text-[10px] font-bold ${text} w-7 text-right`}>{pct[key]}%</span>
            </div>
          ))}
        </div>

        {/* Confidence */}
        <div className={`rounded-lg border px-3 py-2 flex items-center justify-between ${confLevel.bg} ${confLevel.border}`}>
          <span className="text-[10px] text-slate-500">Confidence</span>
          <span className={`text-xs font-bold ${confLevel.color}`}>{confLevel.label}</span>
        </div>

        <p className="text-[9px] text-slate-400 mt-2 italic">Illustrative Data</p>
      </div>
    </div>
  );
}

export default function KeralaMap({ district, date, onDistrictSelect }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [geoKey, setGeoKey] = useState(0);

  // Re-render GeoJSON when date changes to update colors
  useEffect(() => {
    setGeoKey(k => k + 1);
  }, [date]);

  const getDistrictData = (districtName) => {
    return FORECAST_DATA[districtName]?.[date];
  };

  const styleFeature = (feature) => {
    const d = feature.properties.district;
    const data = getDistrictData(d);
    if (!data) return { fillColor: '#e2e8f0', weight: 1, color: '#94a3b8', fillOpacity: 0.7 };

    const blended = calculateBlendedForecast(data.forecasts, data.weights);
    const fillColor = getRainfallColorClass(blended);

    const isSelected = d === district;
    return {
      fillColor,
      weight: isSelected ? 3 : 1.5,
      color: isSelected ? '#0ea5e9' : '#64748b',
      fillOpacity: isSelected ? 0.85 : 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const d = feature.properties.district;
    const data = getDistrictData(d);
    const blended = data ? calculateBlendedForecast(data.forecasts, data.weights) : '—';

    layer.bindTooltip(
      `<div style="font-family:system-ui;padding:4px 8px">
        <div style="font-weight:700;color:#1e293b">${d}</div>
        <div style="font-size:12px;color:#64748b">GreenSky: <strong>${blended} mm</strong></div>
      </div>`,
      { permanent: false, sticky: true, direction: 'top' }
    );

    layer.on({
      click: () => {
        setSelectedFeature(d);
        onDistrictSelect(d);
      },
      mouseover: (e) => {
        e.target.setStyle({ weight: 2.5, fillOpacity: 0.9 });
      },
      mouseout: (e) => {
        e.target.setStyle(styleFeature(feature));
      },
    });
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-emerald-500" />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Kerala Pilot — Rainfall Map</h2>
        </div>
        <span className="badge-illustrative">Illustrative Data</span>
      </div>
      <p className="text-xs text-slate-400 mb-3">6 pilot districts shown. Click a district to view detailed forecast breakdown.</p>

      <div className="relative rounded-xl overflow-hidden border border-slate-200" style={{ height: 400 }}>
        <MapContainer
          center={[10.2, 76.4]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CartoDB'
          />
          <GeoJSON
            key={`${geoKey}-${district}`}
            data={KERALA_GEOJSON}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        </MapContainer>

        <DistrictPanel
          district={selectedFeature}
          date={date}
          onClose={() => setSelectedFeature(null)}
        />
      </div>

      {/* Color legend */}
      <div className="mt-3 flex items-center gap-1 flex-wrap">
        <span className="text-[10px] text-slate-500 mr-1">Rainfall (mm):</span>
        {[
          { color: '#bfdbfe', label: '0–10' },
          { color: '#60a5fa', label: '10–25' },
          { color: '#2563eb', label: '25–50' },
          { color: '#1e3a8a', label: '50–100' },
          { color: '#0f172a', label: '100+' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ background: item.color }} />
            <span className="text-[10px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
