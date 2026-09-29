import React from 'react';
import { MapPin, Calendar, Clock, CloudRain, ShieldCheck, Activity } from 'lucide-react';
import { DISTRICTS, DATES } from '../../data/demoData';
import { formatDateLabel, getConfidenceLevel } from '../../utils/calculations';

export default function ControlBar({
  district,
  date,
  onDistrictChange,
  onDateChange,
  blendedValue,
  confidence,
  regime,
  onTabChange,
}) {
  const conf = getConfidenceLevel(confidence);

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
      
      {/* Left: Operational Selectors */}
      <div className="flex flex-wrap items-center gap-2.5">
        
        {/* District Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs shadow-inner">
          <MapPin size={14} className="text-cyan-400 shrink-0" />
          <span className="text-slate-400 text-xs font-medium">District:</span>
          <select
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer text-xs pr-1"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-slate-100">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs shadow-inner">
          <Calendar size={14} className="text-cyan-400 shrink-0" />
          <span className="text-slate-400 text-xs font-medium">Valid Date:</span>
          <select
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer text-xs pr-1"
          >
            {DATES.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-slate-100">
                {formatDateLabel(d)}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Time Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
          <Clock size={13} className="text-slate-400 shrink-0" />
          <span className="font-semibold text-cyan-300">24h Lead</span>
        </div>

        {/* Regime Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <CloudRain size={13} className="text-sky-400 shrink-0" />
          <span className="text-slate-400">Regime:</span>
          <span className={`font-bold ${regime === 'Heavy Rain' ? 'text-rose-400' : 'text-sky-300'}`}>
            {regime}
          </span>
        </div>

      </div>

      {/* Right: Operational Metric Badges */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 md:pb-0">
        
        {/* Consensus Blend Pill */}
        <button
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-700/60 hover:bg-cyan-950/80 transition-colors text-xs shrink-0 shadow-sm"
        >
          <Activity size={14} className="text-cyan-400 shrink-0" />
          <span className="text-slate-300 font-medium">Consensus:</span>
          <strong className="text-cyan-300 font-mono text-sm">{blendedValue} mm</strong>
        </button>

        {/* Confidence Pill */}
        <button
          onClick={() => onTabChange('validation')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-950/70 transition-colors text-xs shrink-0"
        >
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">Confidence:</span>
          <strong className="text-emerald-400 font-mono">{Math.round(confidence * 100)}% ({conf.label})</strong>
        </button>

      </div>
    </div>
  );
}
