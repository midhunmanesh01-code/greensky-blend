import React from 'react';
import { Database, Cpu, CloudRain, ArrowRight, ArrowDown, Activity, Layers, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { PILOT_DISTRICTS, REGIME_WEIGHTS } from '../../data/benchmarkData';
import {
  calculateBlendedForecast,
  weightsToPercent,
  calculateContributionMm,
  calculateSourceContribution,
} from '../../utils/calculations';

const COLORS = { ifs: '#38bdf8', gfs: '#34d399', blend: '#f59e0b', imd: '#a78bfa' };

function DonutTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs shadow-xl">
        <p className="font-bold text-white">{payload[0].name}</p>
        <p className="font-mono font-bold" style={{ color: payload[0].payload.color }}>
          {payload[0].value}% Weight
        </p>
      </div>
    );
  }
  return null;
}

export default function BlendingView({ district, data, onDistrictSelect }) {
  const { forecasts, weights, regime, imd_rain, date } = data;
  const blended = calculateBlendedForecast(forecasts, weights);
  const pct = weightsToPercent(weights);
  const contrib = calculateContributionMm(forecasts, weights);
  const pieData = calculateSourceContribution(weights);

  const models = [
    { key: 'ifs', name: 'ECMWF IFS', desc: 'Physics NWP (9km resolution)', color: COLORS.ifs, icon: Database },
    { key: 'gfs', name: 'NCEP GFS', desc: 'Physics NWP (13km resolution)', color: COLORS.gfs, icon: Database },
  ];

  return (
    <div className="space-y-4">
      
      {/* 1. Visual ML Architecture Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2.5 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              Regime-Conditioned Adaptive Blending Architecture
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Intelligent convex combination learned via training-set MAE minimization across rainfall regimes
            </p>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800/60 self-start sm:self-auto">
            Active Regime: {regime || 'Moderate'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center">
          
          {/* Input NWP Sources (3 Cols) */}
          <div className="lg:col-span-3 space-y-2">
            {models.map(({ key, name, desc, color, icon: Icon }) => (
              <div
                key={key}
                className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{desc}</span>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold" style={{ color }}>
                  {forecasts[key]} mm
                </span>
              </div>
            ))}
          </div>

          {/* Connector Arrow (1 Col) */}
          <div className="lg:col-span-1 flex justify-center text-slate-600">
            <ArrowRight className="hidden lg:block w-5 h-5 text-amber-500/60" />
            <ArrowDown className="lg:hidden w-5 h-5 text-amber-500/60" />
          </div>

          {/* ML Context Layer (4 Cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/40 rounded-xl p-3.5 text-center shadow-md">
            <div className="inline-flex p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-1.5">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Regime-Conditioned Adaptive Blender
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Calculates mean NWP forecast to determine intensity regime, then applies optimal learned weights without look-ahead bias.
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-mono text-amber-300 flex-wrap">
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/40">Dry (&lt;5mm)</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/40">Light (5-15mm)</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/40">Moderate (15-35mm)</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/40">Heavy (≥35mm)</span>
            </div>
          </div>

          {/* Connector Arrow (1 Col) */}
          <div className="lg:col-span-1 flex justify-center text-slate-600">
            <ArrowRight className="hidden lg:block w-5 h-5 text-amber-500/60" />
            <ArrowDown className="lg:hidden w-5 h-5 text-amber-500/60" />
          </div>

          {/* Consensus Output (2 Cols) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-950 to-amber-950/30 border border-amber-500/40 rounded-xl p-3.5 text-center flex flex-col justify-center">
            <CloudRain className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">GreenSky Blend</span>
            <div className="text-2xl font-extrabold font-mono text-amber-400 my-0.5">
              {blended} <span className="text-xs font-normal text-slate-400">mm</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">24h Adaptive Consensus</span>
          </div>

        </div>
      </div>

      {/* 2. Weight Distribution & Donut Chart + Live Equation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Weight Distribution Bars & Equation */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Regime Weight Allocation — Valid Date: {date} (District Context: {district})
            </h4>

            <div className="space-y-3 mb-4">
              {models.map(({ key, name, color }) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">
                      {name} <span className="text-slate-500 font-mono text-[11px]">({forecasts[key]} mm raw)</span>
                    </span>
                    <span className="font-mono font-bold" style={{ color }}>
                      {pct[key]}% Weight · {contrib[key]} mm contribution
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct[key]}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Blending Equation */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Active Blending Equation (Convex Weighted Sum)
            </span>
            <div className="flex items-center gap-1.5 flex-wrap text-slate-300">
              <span style={{ color: COLORS.ifs }}>({forecasts.ifs} × {(weights.ifs ?? 1).toFixed(2)})</span>
              <span className="text-slate-500">+</span>
              <span style={{ color: COLORS.gfs }}>({forecasts.gfs} × {(weights.gfs ?? 0).toFixed(2)})</span>
              <span className="text-slate-500">=</span>
              <span className="font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">
                {blended} mm
              </span>
              {imd_rain !== undefined && (
                <span className="text-slate-500 text-[11px] ml-1">
                  (IMD Ground Truth: <strong className="text-purple-300">{imd_rain} mm</strong>)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Donut Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
            Model Weight Share
          </h4>

          <div className="relative h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold font-mono text-amber-400">{blended}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">mm consensus</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Learned Regime Weight Table from Benchmark Training */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Empirically Learned Regime Weights (Experiment 1)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Learned via grid-search on 64 training days at the Benchmark Grid Cell (10.75°N, 76.25°E). Weights are conditioned on forecasted rainfall intensity, not independently trained per district.
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">w_ECMWF + w_GFS = 1.0</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(REGIME_WEIGHTS).map(([key, item]) => {
            const isCurrent = regime && regime.startsWith(key);
            return (
              <div
                key={key}
                className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-md'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-200">{item.label}</span>
                    {isCurrent && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 font-mono text-[11px] my-2">
                    <div className="flex justify-between text-sky-400">
                      <span>ECMWF Weight:</span>
                      <span className="font-bold">{(item.ecmwf * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>GFS Weight:</span>
                      <span className="font-bold">{(item.gfs * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 leading-tight">
                  {item.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Regional Pilot Scope (6 Pilot Districts) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Kerala 6-District Pilot — Regional Hazard & Orographic Context
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Demonstrating regional terrain, elevation, and hazard vulnerability profiles across 6 pilot districts. Numerical evaluation is rooted in the central Benchmark Grid (10.75°N, 76.25°E).
            </p>
          </div>
          <span className="text-[10px] text-slate-400 italic">Select district context</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PILOT_DISTRICTS.map((d) => {
            const isSelected = d.name === district;

            return (
              <button
                key={d.name}
                onClick={() => onDistrictSelect(d.name)}
                className={`p-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-amber-600 text-slate-950 border-amber-500 shadow-md font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs truncate ${isSelected ? 'text-slate-950 font-bold' : 'text-slate-200 font-semibold'}`}>
                    {d.name}
                  </span>
                </div>
                <p className={`text-[10px] truncate ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                  {d.stationDist}
                </p>
                <p className={`text-[9px] font-mono mt-2 truncate ${isSelected ? 'text-slate-950 font-bold' : 'text-amber-400'}`}>
                  {d.zone}
                </p>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
