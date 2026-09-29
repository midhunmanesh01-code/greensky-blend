import React, { useState } from 'react';
import { MapPin, Calendar, Database, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { DISTRICTS, DATES, FORECAST_DATA } from '../data/demoData';
import {
  calculateBlendedForecast,
  calculateEqualWeightForecast,
  weightsToPercent,
  getConfidenceLevel,
  calculateSourceAgreement,
  formatDateLabel,
} from '../utils/calculations';
import KeralaMap from './KeralaMap';
import ForecastReplay from './ForecastReplay';

const COLORS = { ifs: '#38bdf8', gfs: '#34d399', aifs: '#a78bfa', blend: '#22d3ee' };
const MODEL_META = {
  ifs: { name: 'ECMWF IFS', type: 'NWP', badge: 'badge-nwp', color: COLORS.ifs },
  gfs: { name: 'NCEP GFS', type: 'NWP', badge: 'badge-nwp', color: COLORS.gfs },
  aifs: { name: 'ECMWF AIFS', type: 'AI Weather Model', badge: 'badge-ai', color: COLORS.aifs },
};

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(12px)' }}>
        <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-bold text-white">{p.value} mm</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function ForecastSection() {
  const [district, setDistrict] = useState('Pathanamthitta');
  const [date, setDate] = useState('2026-07-01');

  const data = FORECAST_DATA[district]?.[date] || FORECAST_DATA['Pathanamthitta']['2026-07-01'];
  const { forecasts, weights, confidence, regime } = data;
  const blended = calculateBlendedForecast(forecasts, weights);
  const equalWeight = calculateEqualWeightForecast(forecasts);
  const pct = weightsToPercent(weights);
  const confLevel = getConfidenceLevel(confidence);
  const agreement = calculateSourceAgreement(forecasts);
  const confPct = Math.round(confidence * 100);

  const chartData = [
    { name: 'ECMWF IFS', value: forecasts.ifs, fill: COLORS.ifs },
    { name: 'NCEP GFS', value: forecasts.gfs, fill: COLORS.gfs },
    { name: 'ECMWF AIFS', value: forecasts.aifs, fill: COLORS.aifs },
    { name: 'GreenSky', value: blended, fill: COLORS.blend },
  ];

  return (
    <section id="forecast" className="section-spacing">
      <div className="section-container">
        <p className="section-label">Forecast Overview</p>
        <h2 className="section-title">Multi-Source Rainfall Forecast</h2>
        <p className="section-desc mb-10">
          GreenSky combines multiple forecast sources to produce an adaptive blended rainfall prediction for the Kerala pilot region.
        </p>

        {/* Controls */}
        <div className="glass-panel mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Pilot District
              </label>
              <select value={district} onChange={e => setDistrict(e.target.value)}
                className="w-full text-sm font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                style={{ background: 'rgba(15,31,56,0.8)', color: '#e2e8f0', border: '1px solid rgba(56,189,248,0.15)' }}>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Forecast Date
              </label>
              <select value={date} onChange={e => setDate(e.target.value)}
                className="w-full text-sm font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                style={{ background: 'rgba(15,31,56,0.8)', color: '#e2e8f0', border: '1px solid rgba(56,189,248,0.15)' }}>
                {DATES.map(d => <option key={d} value={d}>{formatDateLabel(d)}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Lead Time
              </label>
              <div className="w-full text-sm font-bold rounded-lg px-3 py-2 text-cyan-400"
                style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)' }}>
                24 Hours
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" /> Weather Regime
              </label>
              <div className="w-full text-sm font-bold rounded-lg px-3 py-2"
                style={{ background: regime === 'Heavy Rain' ? 'rgba(251,113,133,0.08)' : 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', color: regime === 'Heavy Rain' ? '#fb7185' : '#38bdf8' }}>
                {regime}
              </div>
            </div>
          </div>
        </div>

        {/* Source Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {['ifs', 'gfs', 'aifs'].map(key => {
            const m = MODEL_META[key];
            return (
              <div key={key} className="glass-panel relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: m.color }} />
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Forecast Source</p>
                    <h3 className="text-sm font-bold text-white">{m.name}</h3>
                  </div>
                  <span className={m.badge}>{m.type}</span>
                </div>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-3xl font-bold text-white">{forecasts[key]}</span>
                  <span className="text-slate-500 text-sm mb-0.5">mm</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Adaptive weight</span>
                    <span className="text-xs font-bold font-mono" style={{ color: m.color }}>{pct[key]}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.1)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct[key]}%`, background: m.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Blended Result + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 glass-panel">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Forecast Comparison</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(56,189,248,0.1)' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(56,189,248,0.1)' }}
                  label={{ value: 'mm', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
                <Bar dataKey="value" name="Rainfall" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Confidence */}
          <div className="glass-panel flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4 self-start">Confidence</h3>
            <div className="relative mb-4">
              <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none"
                  stroke={confidence >= 0.85 ? '#34d399' : confidence >= 0.75 ? '#38bdf8' : confidence >= 0.65 ? '#fbbf24' : '#fb7185'}
                  strokeWidth="8" strokeDasharray={`${confPct * 2.638} 263.8`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{confPct}%</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${confLevel.color}`}
              style={{ background: confLevel.bg, border: `1px solid ${confLevel.border?.includes('/') ? 'rgba(56,189,248,0.2)' : confLevel.border}` }}>
              {confLevel.label}
            </div>
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Agreement</span>
                <span className="font-bold text-white">{agreement}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.1)' }}>
                <div className="h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${agreement}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Equal vs Adaptive Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="glass-panel">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Fixed Equal-Weight Blend</p>
            {['ifs', 'gfs', 'aifs'].map(k => (
              <div key={k} className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[k] }} />
                <span className="text-xs text-slate-400 flex-1">{MODEL_META[k].name}</span>
                <span className="text-xs font-bold text-slate-400 font-mono">33%</span>
              </div>
            ))}
            <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}>
              <p className="text-xs text-slate-500 mb-0.5">Fixed Forecast</p>
              <span className="text-2xl font-bold text-slate-300">{equalWeight}</span>
              <span className="text-slate-500 text-sm ml-1">mm</span>
            </div>
          </div>
          <div className="glass-panel" style={{ border: '1px solid rgba(34,211,238,0.15)' }}>
            <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3">GreenSky Adaptive Blend</p>
            {['ifs', 'gfs', 'aifs'].map(k => (
              <div key={k} className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[k] }} />
                <span className="text-xs text-slate-300 flex-1 font-medium">{MODEL_META[k].name}</span>
                <span className="text-xs font-bold font-mono" style={{ color: COLORS[k] }}>{pct[k]}%</span>
              </div>
            ))}
            <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(34,211,238,0.1)' }}>
              <p className="text-xs text-cyan-400/70 mb-0.5">GreenSky Forecast</p>
              <span className="text-2xl font-bold text-white text-glow-cyan">{blended}</span>
              <span className="text-slate-500 text-sm ml-1">mm</span>
            </div>
          </div>
        </div>

        {/* Kerala Map */}
        <div className="mb-8">
          <KeralaMap district={district} date={date} onDistrictSelect={setDistrict} />
        </div>

        {/* Forecast Replay */}
        <ForecastReplay district={district} />
      </div>
    </section>
  );
}
