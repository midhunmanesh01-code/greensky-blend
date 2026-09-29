import React from 'react';
import { Database, TrendingUp, Info, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  calculateBlendedForecast,
  calculateEqualWeightForecast,
  weightsToPercent,
  getConfidenceLevel,
  calculateSourceAgreement,
} from '../../utils/calculations';

const COLORS = {
  ifs: '#38bdf8',
  gfs: '#34d399',
  equal: '#94a3b8',
  blend: '#f59e0b',
  imd: '#a78bfa',
};

const MODEL_META = {
  ifs: { name: 'ECMWF IFS', type: 'Physics NWP (9km)', desc: 'Global deterministic ECMWF model', color: COLORS.ifs, icon: Database },
  gfs: { name: 'NCEP GFS', type: 'Physics NWP (13km)', desc: 'NOAA seamless global forecast model', color: COLORS.gfs, icon: Database },
};

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs">
        <p className="font-bold text-slate-200 mb-1">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 my-0.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-mono font-bold text-white">{p.value} mm</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function DashboardView({ district, data }) {
  const { forecasts, weights, confidence, imd_rain, regime, date } = data;
  const blended = calculateBlendedForecast(forecasts, weights);
  const equalWeight = calculateEqualWeightForecast(forecasts);
  const pct = weightsToPercent(weights);
  const confLevel = getConfidenceLevel(confidence);
  const agreement = calculateSourceAgreement(forecasts);
  const confPct = Math.round(confidence * 100);

  // Model comparison chart comparing NWP models, blends, and Ground Truth IMD rain
  const chartData = [
    { name: 'ECMWF IFS', value: forecasts.ifs, fill: COLORS.ifs },
    { name: 'NCEP GFS', value: forecasts.gfs, fill: COLORS.gfs },
    { name: 'Equal Blend (50/50)', value: equalWeight, fill: COLORS.equal },
    { name: 'GreenSky Blend', value: blended, fill: COLORS.blend },
    { name: 'IMD Ground Truth', value: imd_rain, fill: COLORS.imd },
  ];

  const blendDelta = imd_rain !== undefined ? (blended - imd_rain).toFixed(1) : null;
  const equalDelta = imd_rain !== undefined ? (equalWeight - imd_rain).toFixed(1) : null;

  return (
    <div className="space-y-4">
      
      {/* Benchmark Grid & District Context Notification */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <p className="text-slate-300">
            <strong className="text-slate-100 font-semibold">Benchmark Grid Cell:</strong> <span className="font-mono text-amber-400">10.75°N, 76.25°E</span> (Central Kerala · IMD Reference Gauge) &bull; <strong className="text-slate-100 font-semibold">District Context:</strong> <span className="text-amber-300 font-bold">{district}</span>
          </p>
        </div>
        <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
          Kerala 6-District Pilot &bull; Historical Benchmark
        </span>
      </div>

      {/* Top 4-Column Source & Consensus Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. ECMWF IFS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-4.5 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: COLORS.ifs }} />
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md" style={{ background: `${COLORS.ifs}15` }}>
                  <Database className="w-3.5 h-3.5" style={{ color: COLORS.ifs }} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-xs leading-tight">ECMWF IFS</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Physics NWP (9km)</p>
                </div>
              </div>
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0"
                style={{ background: `${COLORS.ifs}15`, color: COLORS.ifs }}
              >
                {pct.ifs}% Wt
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {forecasts.ifs}
              </span>
              <span className="text-slate-400 text-xs font-semibold">mm</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60">
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct.ifs}%`, background: COLORS.ifs }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Contrib: {(forecasts.ifs * (weights.ifs ?? 1)).toFixed(1)} mm</span>
              <span className="text-slate-500">24h forecast</span>
            </div>
          </div>
        </div>

        {/* 2. NCEP GFS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-4.5 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: COLORS.gfs }} />
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md" style={{ background: `${COLORS.gfs}15` }}>
                  <Database className="w-3.5 h-3.5" style={{ color: COLORS.gfs }} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-xs leading-tight">NCEP GFS</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Physics NWP (13km)</p>
                </div>
              </div>
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0"
                style={{ background: `${COLORS.gfs}15`, color: COLORS.gfs }}
              >
                {pct.gfs}% Wt
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {forecasts.gfs}
              </span>
              <span className="text-slate-400 text-xs font-semibold">mm</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60">
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct.gfs}%`, background: COLORS.gfs }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Contrib: {(forecasts.gfs * (weights.gfs ?? 0)).toFixed(1)} mm</span>
              <span className="text-slate-500">24h forecast</span>
            </div>
          </div>
        </div>

        {/* 3. IMD Ground Truth Observation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-4.5 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: COLORS.imd }} />
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md" style={{ background: `${COLORS.imd}15` }}>
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: COLORS.imd }} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-xs leading-tight">IMD Ground Truth</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Rain Gauge Network (0.25°)</p>
                </div>
              </div>
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 bg-purple-950 text-purple-300 border border-purple-800/50"
              >
                Observed
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-purple-300 tracking-tight">
                {imd_rain}
              </span>
              <span className="text-slate-400 text-xs font-semibold">mm</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Accumulation: 24h</span>
            <span className="text-slate-500">03:00 UTC (08:30 IST)</span>
          </div>
        </div>

        {/* 4. GreenSky Blended Consensus */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/40 rounded-xl p-4 sm:p-4.5 flex flex-col justify-between relative overflow-hidden shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600" />
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> Consensus Blend
              </span>
              <span className="text-[10px] font-mono bg-amber-950 px-2 py-0.5 rounded text-amber-300 border border-amber-800/60 shrink-0">
                {regime || 'Adaptive ML'}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 tracking-tight">
                {blended}
              </span>
              <span className="text-amber-400/80 text-xs font-semibold">mm / 24h</span>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-mono text-[10px]">Benchmark Grid ({district} context)</span>
            <span className="font-mono font-bold text-amber-400 text-[10px]">
              Error vs IMD: {blendDelta > 0 ? `+${blendDelta}` : blendDelta} mm
            </span>
          </div>
        </div>

      </div>

      {/* Main 2-Column Comparison & Baseline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Recharts Forecast Comparison with Ground Truth */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                Multi-Source NWP & Adaptive Consensus vs Ground Truth
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Evaluated at Benchmark Grid (10.75°N, 76.25°E) against IMD 0.25° rain gauge (Convention B: 03:00 UTC)
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              Benchmark Grid • {date}
            </span>
          </div>

          <div className="h-[250px] w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 12, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#94a3b8' }} 
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#94a3b8' }} 
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                  unit=" mm"
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(245,158,11,0.04)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={44}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 gap-2">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" /> ECMWF IFS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34d399]" /> NCEP GFS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#94a3b8]" /> Equal Blend
              </span>
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> GreenSky Blend
              </span>
              <span className="flex items-center gap-1.5 font-bold text-purple-400">
                <span className="w-2 h-2 rounded-full bg-[#a78bfa]" /> IMD Observed
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Confidence Circular Indicator & Equal-Weight Comparison */}
        <div className="space-y-4">
          
          {/* Confidence Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Consensus Confidence
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${confLevel.color}`} style={{ background: confLevel.bg }}>
                {confLevel.label}
              </span>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0f172a" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={confidence >= 0.85 ? '#34d399' : confidence >= 0.75 ? '#38bdf8' : '#fbbf24'}
                    strokeWidth="10"
                    strokeDasharray={`${confPct * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute font-mono font-bold text-white text-sm">
                  {confPct}%
                </span>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">Model Agreement:</span>
                    <span className="font-mono font-bold text-slate-200">{agreement}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${agreement}%` }} />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Quantified from inter-model spread (|ECMWF - GFS| = {Math.abs(forecasts.ifs - forecasts.gfs).toFixed(1)} mm).
                </p>
              </div>
            </div>
          </div>

          {/* Equal-Weight vs Adaptive Comparison */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
              Fixed vs Adaptive Baseline
            </h4>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase font-mono">Fixed (50/50)</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-mono font-bold text-slate-300">{equalWeight}</span>
                  <span className="text-[10px] text-slate-500">mm</span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  Err: {equalDelta > 0 ? `+${equalDelta}` : equalDelta} mm
                </p>
              </div>

              <div className="bg-amber-950/40 border border-amber-800/50 rounded-lg p-3">
                <p className="text-[10px] text-amber-400 uppercase font-mono font-semibold">Adaptive Blend</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-mono font-bold text-amber-400">{blended}</span>
                  <span className="text-[10px] text-amber-400/80">mm</span>
                </div>
                <p className="text-[10px] font-mono text-amber-400/90 mt-1">
                  Err: {blendDelta > 0 ? `+${blendDelta}` : blendDelta} mm
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-3 leading-normal flex items-start gap-1.5">
              <Info size={13} className="text-amber-400 shrink-0 mt-0.5" />
              <span>Learned regime weights shift allocation dynamically based on rainfall intensity regime.</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
