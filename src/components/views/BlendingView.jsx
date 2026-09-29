import React from 'react';
import { Database, Cpu, CloudRain, ArrowRight, ArrowDown, Activity, Layers } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { DISTRICTS, SPATIAL_WEIGHTS } from '../../data/demoData';
import {
  calculateBlendedForecast,
  weightsToPercent,
  calculateContributionMm,
  calculateSourceContribution,
} from '../../utils/calculations';

const COLORS = { ifs: '#38bdf8', gfs: '#34d399', aifs: '#a78bfa', blend: '#22d3ee' };

function DonutTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1628] border border-cyan-500/30 rounded-lg p-2 text-xs shadow-xl">
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
  const { forecasts, weights } = data;
  const blended = calculateBlendedForecast(forecasts, weights);
  const pct = weightsToPercent(weights);
  const contrib = calculateContributionMm(forecasts, weights);
  const pieData = calculateSourceContribution(weights);

  const models = [
    { key: 'ifs', name: 'ECMWF IFS', desc: 'Physics NWP (9km)', color: COLORS.ifs, icon: Database },
    { key: 'gfs', name: 'NCEP GFS', desc: 'Physics NWP (13km)', color: COLORS.gfs, icon: Database },
    { key: 'aifs', name: 'ECMWF AIFS', desc: 'Deep Learning AI', color: COLORS.aifs, icon: Cpu },
  ];

  return (
    <div className="space-y-4">
      
      {/* 1. Visual ML Architecture Pipeline */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Adaptive Blending Architecture
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Intelligent multi-model combination weighting learned by gradient-boosted meta-learner
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
            Pipeline Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center">
          
          {/* Input Sources (3 Cols) */}
          <div className="lg:col-span-3 space-y-2">
            {models.map(({ key, name, desc, color, icon: Icon }) => (
              <div
                key={key}
                className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-800">
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{desc}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold" style={{ color }}>
                  {forecasts[key]} mm
                </span>
              </div>
            ))}
          </div>

          {/* Connector Arrow (1 Col) */}
          <div className="lg:col-span-1 flex justify-center text-slate-600">
            <ArrowRight className="hidden lg:block w-5 h-5 text-cyan-500/60" />
            <ArrowDown className="lg:hidden w-5 h-5 text-cyan-500/60" />
          </div>

          {/* ML Context Layer (4 Cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#0c233d] to-[#071628] border border-cyan-500/40 rounded-xl p-3.5 text-center shadow-md">
            <div className="inline-flex p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mb-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contextual ML Meta-Learner
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              XGBoost / LightGBM meta-model generates dynamic weights derived from regime, topography, lead time, and historical bias.
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] font-mono text-cyan-300">
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/40">Regime</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/40">Terrain</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/40">Spread</span>
            </div>
          </div>

          {/* Connector Arrow (1 Col) */}
          <div className="lg:col-span-1 flex justify-center text-slate-600">
            <ArrowRight className="hidden lg:block w-5 h-5 text-cyan-500/60" />
            <ArrowDown className="lg:hidden w-5 h-5 text-cyan-500/60" />
          </div>

          {/* Consensus Output (2 Cols) */}
          <div className="lg:col-span-2 bg-[#091b30] border border-cyan-500/30 rounded-xl p-3.5 text-center flex flex-col justify-center">
            <CloudRain className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">GreenSky Blend</span>
            <div className="text-2xl font-extrabold font-mono text-white my-0.5">
              {blended} <span className="text-xs font-normal text-slate-400">mm</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">24h Adaptive Consensus</span>
          </div>

        </div>
      </div>

      {/* 2. Weight Distribution & Donut Chart + Live Equation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Weight Distribution Bars & Equation */}
        <div className="lg:col-span-2 bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Dynamic Weight Allocation — {district}
            </h4>

            <div className="space-y-3 mb-4">
              {models.map(({ key, name, color }) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">
                      {name} <span className="text-slate-500 font-mono text-[11px]">({forecasts[key]} mm raw)</span>
                    </span>
                    <span className="font-mono font-bold" style={{ color }}>
                      {pct[key]}% Wt · {contrib[key]} mm
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
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
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Active Blending Equation
            </span>
            <div className="flex items-center gap-1.5 flex-wrap text-slate-300">
              <span style={{ color: COLORS.ifs }}>({forecasts.ifs} × {weights.ifs.toFixed(2)})</span>
              <span className="text-slate-500">+</span>
              <span style={{ color: COLORS.gfs }}>({forecasts.gfs} × {weights.gfs.toFixed(2)})</span>
              <span className="text-slate-500">+</span>
              <span style={{ color: COLORS.aifs }}>({forecasts.aifs} × {weights.aifs.toFixed(2)})</span>
              <span className="text-slate-500">=</span>
              <span className="font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                {blended} mm
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Donut Chart */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
            Source Contribution
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
              <span className="text-xl font-bold font-mono text-white">{blended}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">mm total</span>
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

      {/* 3. Regional Spatial Model-Weight Profiles (6 Pilot Districts) */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Regional Model-Weight Profiles — 6 Pilot Districts
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Terrain and regime-specific weight distribution across Western Ghats and coastal Kerala
            </p>
          </div>
          <span className="text-[10px] text-slate-400 italic">Click card to switch active district</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {DISTRICTS.map((d) => {
            const w = SPATIAL_WEIGHTS[d];
            const p = weightsToPercent(w);
            const isSelected = d === district;

            const dominant = p.ifs >= p.gfs && p.ifs >= p.aifs ? 'IFS' : p.gfs >= p.aifs ? 'GFS' : 'AIFS';
            const domColor = dominant === 'IFS' ? COLORS.ifs : dominant === 'GFS' ? COLORS.gfs : COLORS.aifs;

            return (
              <button
                key={d}
                onClick={() => onDistrictSelect(d)}
                className={`p-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500/60 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {d}
                  </span>
                </div>

                <div className="space-y-1 mb-2">
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-slate-500 w-6">IFS</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-1">
                      <div className="h-full rounded-full" style={{ width: `${p.ifs}%`, background: COLORS.ifs }} />
                    </div>
                    <span className="font-mono text-slate-400 w-5 text-right">{p.ifs}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-slate-500 w-6">GFS</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-1">
                      <div className="h-full rounded-full" style={{ width: `${p.gfs}%`, background: COLORS.gfs }} />
                    </div>
                    <span className="font-mono text-slate-400 w-5 text-right">{p.gfs}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-slate-500 w-6">AIFS</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-1">
                      <div className="h-full rounded-full" style={{ width: `${p.aifs}%`, background: COLORS.aifs }} />
                    </div>
                    <span className="font-mono text-slate-400 w-5 text-right">{p.aifs}%</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono font-bold flex items-center justify-between" style={{ color: domColor }}>
                  <span>{dominant} Lead</span>
                  <span>{p[dominant.toLowerCase()]}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
