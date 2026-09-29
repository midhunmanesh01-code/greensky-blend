import React from 'react';
import { Database, Cpu, TrendingUp, Info, Activity } from 'lucide-react';
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

const COLORS = { ifs: '#38bdf8', gfs: '#34d399', aifs: '#a78bfa', blend: '#22d3ee' };
const MODEL_META = {
  ifs: { name: 'ECMWF IFS', type: 'Physics NWP', desc: 'Global 9km deterministic model', color: COLORS.ifs, icon: Database },
  gfs: { name: 'NCEP GFS', type: 'Physics NWP', desc: 'NOAA 13km global model', color: COLORS.gfs, icon: Database },
  aifs: { name: 'ECMWF AIFS', type: 'AI Deep Learning', desc: 'Data-driven neural weather model', color: COLORS.aifs, icon: Cpu },
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
  const { forecasts, weights, confidence } = data;
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
    { name: 'GreenSky Blend', value: blended, fill: COLORS.blend },
  ];

  return (
    <div className="space-y-4">
      {/* Top 4-Column Source & Consensus Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Source Models: IFS, GFS, AIFS */}
        {['ifs', 'gfs', 'aifs'].map((key) => {
          const meta = MODEL_META[key];
          const Icon = meta.icon;
          return (
            <div
              key={key}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-4.5 flex flex-col justify-between relative overflow-hidden shadow-sm"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: meta.color }}
              />

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1.5 rounded-md"
                      style={{ background: `${meta.color}15` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-xs leading-tight">{meta.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{meta.type}</p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0"
                    style={{ background: `${meta.color}15`, color: meta.color }}
                  >
                    {pct[key]}% Wt
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 my-2.5">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                    {forecasts[key]}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold">mm</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60">
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct[key]}%`, background: meta.color }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Contrib: {(forecasts[key] * weights[key]).toFixed(1)} mm</span>
                  <span className="text-slate-500">24h precip</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* 4th Column: GreenSky Blended Forecast Spotlight */}
        <div className="bg-gradient-to-br from-slate-900 to-cyan-950/50 border border-cyan-500/40 rounded-xl p-4 sm:p-4.5 flex flex-col justify-between relative overflow-hidden shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-emerald-400" />
          
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Consensus Blend
              </span>
              <span className="text-[10px] font-mono bg-cyan-950 px-2 py-0.5 rounded text-cyan-300 border border-cyan-800/40 shrink-0">
                Adaptive ML
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-300 tracking-tight">
                {blended}
              </span>
              <span className="text-cyan-400/80 text-xs font-semibold">mm / 24h</span>
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-mono text-[10px]">{district} consensus</span>
            <span className="font-mono font-bold text-cyan-300 text-[10px]">
              Spread: {(Math.max(...Object.values(forecasts)) - Math.min(...Object.values(forecasts))).toFixed(1)} mm
            </span>
          </div>
        </div>

      </div>

      {/* Main 2-Column Comparison & Baseline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Recharts Forecast Comparison */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Multi-Source Model Comparison
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Physics-based NWP & AI weather model predictions versus adaptive consensus
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {district}
            </span>
          </div>

          <div className="h-[250px] w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 12, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                  unit=" mm"
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" /> ECMWF IFS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34d399]" /> NCEP GFS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a78bfa]" /> ECMWF AIFS
              </span>
              <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-[#22d3ee]" /> GreenSky Blend
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
                    <span className="text-slate-400">Source Agreement:</span>
                    <span className="font-mono font-bold text-slate-200">{agreement}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${agreement}%` }} />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Quantified from inter-model spread and historical reliability.
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
                <p className="text-[10px] text-slate-500 uppercase font-mono">Fixed (33% each)</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-mono font-bold text-slate-300">{equalWeight}</span>
                  <span className="text-[10px] text-slate-500">mm</span>
                </div>
              </div>

              <div className="bg-cyan-950/40 border border-cyan-800/40 rounded-lg p-3">
                <p className="text-[10px] text-cyan-400 uppercase font-mono font-semibold">Adaptive Blend</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-mono font-bold text-cyan-300">{blended}</span>
                  <span className="text-[10px] text-cyan-400/80">mm</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-3 leading-normal flex items-start gap-1.5">
              <Info size={13} className="text-cyan-400 shrink-0 mt-0.5" />
              <span>Adaptive weights shift dynamically based on rainfall regime and local terrain.</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
