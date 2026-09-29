import React, { useState, useEffect } from 'react';
import { FORECAST_DATA, DISTRICTS, DATES, SPATIAL_WEIGHTS } from '../data/demoData';
import {
  calculateBlendedForecast,
  weightsToPercent,
  calculateContributionMm,
  calculateSourceContribution,
} from '../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { ArrowRight, ArrowDown, Database, Cpu, CloudRain, Layers, Activity } from 'lucide-react';

const COLORS = { ifs: '#38bdf8', gfs: '#34d399', aifs: '#a78bfa', blend: '#22d3ee' };

function WeightBar({ modelKey, name, pct, contrib }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  const color = COLORS[modelKey];
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-300 font-medium">{name} <span className="text-slate-500 text-xs ml-1">({contrib} mm)</span></span>
        <span className="font-bold font-mono" style={{ color }}>{pct}%</span>
      </div>
      <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}

function DonutTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 12, padding: '8px 14px', backdropFilter: 'blur(12px)' }}>
        <p className="text-sm font-semibold text-slate-200">{payload[0].name}</p>
        <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

export default function BlendingSection() {
  const [district, setDistrict] = useState('Pathanamthitta');
  const [date, setDate] = useState('2026-07-01');

  const data = FORECAST_DATA[district]?.[date] || FORECAST_DATA['Pathanamthitta']['2026-07-01'];
  const { forecasts, weights } = data;

  const blended = calculateBlendedForecast(forecasts, weights);
  const pct = weightsToPercent(weights);
  const contrib = calculateContributionMm(forecasts, weights);
  const pieData = calculateSourceContribution(weights);

  const models = [
    { key: 'ifs', name: 'ECMWF IFS' },
    { key: 'gfs', name: 'NCEP GFS' },
    { key: 'aifs', name: 'ECMWF AIFS' },
  ];

  return (
    <section id="blending" className="section-spacing relative">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.04) 0%, transparent 70%)' }} />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="section-label">Adaptive Blending</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Adaptive Model <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Blending</span>
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Different weather models can disagree, and their reliability can vary across rainfall regimes and forecast conditions.
            GreenSky Blend learns how to combine these forecasts adaptively rather than relying on a fixed average.
          </p>
        </div>

        {/* Visual Pipeline */}
        <div className="mb-20">
          <div className="glass-panel glow-cyan p-6 sm:p-10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)' }} />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
              {/* Source Models */}
              <div className="flex flex-col gap-3 w-full lg:w-[22%]">
                {[
                  { icon: Database, name: 'ECMWF IFS', desc: 'Physics-based NWP', color: COLORS.ifs, bg: 'rgba(56,189,248,0.1)' },
                  { icon: Database, name: 'NCEP GFS', desc: 'Physics-based NWP', color: COLORS.gfs, bg: 'rgba(52,211,153,0.1)' },
                  { icon: Cpu, name: 'ECMWF AIFS', desc: 'AI Weather Model', color: COLORS.aifs, bg: 'rgba(167,139,250,0.1)' },
                ].map(({ icon: Icon, name, desc, color, bg }) => (
                  <div key={name} className="glass-panel-sm flex items-center gap-3 py-3 px-4">
                    <div className="p-2 rounded-lg" style={{ background: bg }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{name}</p>
                      <p className="text-[11px] text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center text-slate-600"><ArrowRight className="w-6 h-6" /></div>
              <div className="lg:hidden flex items-center text-slate-600"><ArrowDown className="w-6 h-6" /></div>

              {/* ML Layer */}
              <div className="w-full lg:w-[30%] relative group">
                <div className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"
                  style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(56,189,248,0.15))', filter: 'blur(20px)' }}
                />
                <div className="relative z-10 text-center py-10 px-6 rounded-2xl" style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.25)' }}>
                  <div className="inline-flex p-3 rounded-xl mb-3" style={{ background: 'rgba(34,211,238,0.1)' }}>
                    <Cpu className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">ML Context Layer</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Gradient-boosted meta-learner generates context-dependent source weights
                  </p>
                  <div className="mt-3 inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold text-cyan-400"
                    style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                    Core Component
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center text-slate-600"><ArrowRight className="w-6 h-6" /></div>
              <div className="lg:hidden flex items-center text-slate-600"><ArrowDown className="w-6 h-6" /></div>

              {/* Output */}
              <div className="w-full lg:w-[22%]">
                <div className="glass-panel-sm text-center py-10 px-6 relative">
                  <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(34,211,238,0.1), transparent 70%)' }} />
                  <CloudRain className="w-10 h-10 text-cyan-400 mx-auto mb-3 relative z-10" />
                  <h4 className="text-lg font-bold text-white relative z-10">GreenSky Blend</h4>
                  <p className="text-sm text-cyan-400 font-medium relative z-10">Adaptive Forecast</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Weights & Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-16">
          {/* Weight Bars */}
          <div className="lg:col-span-3 glass-panel">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Adaptive Weight Distribution
              </h3>
              <div className="flex gap-2">
                <select value={district} onChange={e => setDistrict(e.target.value)}
                  className="text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  style={{ background: 'rgba(15,31,56,0.8)', color: '#e2e8f0', border: '1px solid rgba(56,189,248,0.15)' }}>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={date} onChange={e => setDate(e.target.value)}
                  className="text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  style={{ background: 'rgba(15,31,56,0.8)', color: '#e2e8f0', border: '1px solid rgba(56,189,248,0.15)' }}>
                  {DATES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-5">
              {models.map(({ key, name }) => (
                <WeightBar key={key} modelKey={key} name={name} pct={pct[key]} contrib={contrib[key]} />
              ))}
            </div>

            {/* Blending Equation */}
            <div className="mt-6 p-4 rounded-xl font-mono text-sm overflow-x-auto"
              style={{ background: 'rgba(15,31,56,0.6)', border: '1px solid rgba(56,189,248,0.1)' }}>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-sans mb-2">Blending Equation</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span style={{ color: COLORS.ifs }}>{forecasts.ifs}</span>
                <span className="text-slate-500">×</span>
                <span style={{ color: COLORS.ifs }}>{weights.ifs.toFixed(2)}</span>
                <span className="text-slate-500">+</span>
                <span style={{ color: COLORS.gfs }}>{forecasts.gfs}</span>
                <span className="text-slate-500">×</span>
                <span style={{ color: COLORS.gfs }}>{weights.gfs.toFixed(2)}</span>
                <span className="text-slate-500">+</span>
                <span style={{ color: COLORS.aifs }}>{forecasts.aifs}</span>
                <span className="text-slate-500">×</span>
                <span style={{ color: COLORS.aifs }}>{weights.aifs.toFixed(2)}</span>
                <span className="text-slate-500">=</span>
                <span className="font-bold text-cyan-400 px-2 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.1)' }}>{blended} mm</span>
              </div>
            </div>

            {/* Blended Result */}
            <div className="mt-5 p-5 rounded-xl flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(56,189,248,0.05))', border: '1px solid rgba(34,211,238,0.2)' }}>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-cyan-400/70 font-semibold mb-1">GreenSky Blended Forecast</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white text-glow-cyan">{blended}</span>
                  <span className="text-slate-400 text-lg mb-0.5">mm</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">24-hour rainfall — adaptive blend</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Weight sum</p>
                <p className="text-sm font-bold text-white">{pct.ifs + pct.gfs + pct.aifs}%</p>
              </div>
            </div>
          </div>

          {/* Source Contribution Donut */}
          <div className="lg:col-span-2 glass-panel flex flex-col">
            <h3 className="text-lg font-bold text-white mb-1">Source Contribution</h3>
            <p className="text-xs text-slate-500 mb-4">Current adaptive contribution</p>

            <div className="flex-1 relative" style={{ minHeight: 220 }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">{blended}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">mm</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-slate-400 flex-1">{item.name}</span>
                  <span className="text-xs font-bold text-slate-300">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spatial Weight Map */}
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Regional Weight Distribution
            </h3>
            <p className="text-sm text-slate-500 mt-1">Each of the 6 pilot districts receives different adaptive source weights based on location characteristics.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISTRICTS.map(d => {
              const w = SPATIAL_WEIGHTS[d];
              const p = weightsToPercent(w);
              const isActive = d === district;

              const dominantKey = Object.entries(p).sort((a, b) => b[1] - a[1])[0][0];
              const domColor = { ifs: '#38bdf8', gfs: '#34d399', aifs: '#a78bfa' }[dominantKey];

              return (
                <button key={d} onClick={() => setDistrict(d)}
                  className="text-left p-4 rounded-xl transition-all duration-300"
                  style={{
                    background: isActive ? 'rgba(34,211,238,0.05)' : 'rgba(10,22,40,0.5)',
                    border: isActive ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(56,189,248,0.08)',
                    boxShadow: isActive ? '0 0 20px rgba(34,211,238,0.08)' : 'none',
                  }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? 'text-cyan-400' : 'text-slate-300'}`}>{d}</p>
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color: domColor }}>
                        Dominant: {dominantKey.toUpperCase()}
                      </p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ background: domColor }} />
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'ifs', label: 'IFS', color: COLORS.ifs },
                      { key: 'gfs', label: 'GFS', color: COLORS.gfs },
                      { key: 'aifs', label: 'AIFS', color: COLORS.aifs },
                    ].map(({ key, label, color }) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 w-7">{label}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.1)' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p[key]}%`, background: color }} />
                        </div>
                        <span className="text-[10px] font-bold w-7 text-right font-mono" style={{ color }}>{p[key]}%</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
