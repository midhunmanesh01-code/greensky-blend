import React from 'react';
import { MapPin, Calendar, Clock, CloudRain, ShieldCheck, Activity, Layers } from 'lucide-react';
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
    <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
      {/* Left: District & Date Selector Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        
        {/* District Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs shadow-inner">
          <MapPin size={13} className="text-cyan-400 shrink-0" />
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">District:</span>
          <select
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer text-xs"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-slate-100">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Date Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs shadow-inner">
          <Calendar size={13} className="text-cyan-400 shrink-0" />
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Date:</span>
          <select
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer text-xs"
          >
            {DATES.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-slate-100">
                {formatDateLabel(d)}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Time Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
          <Clock size={12} className="text-slate-400 shrink-0" />
          <span className="font-semibold text-cyan-300">24h Lead</span>
        </div>

        {/* Regime Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px]">
          <CloudRain size={12} className="text-sky-400 shrink-0" />
          <span className="text-slate-400">Regime:</span>
          <span className={`font-bold ${regime === 'Heavy Rain' ? 'text-rose-400' : 'text-sky-300'}`}>
            {regime}
          </span>
        </div>

      </div>

      {/* Right: Metric Pills (ls-monitor style) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-0.5 sm:pb-0">
        
        {/* Consensus Blend Value Pill */}
        <button
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/60 hover:bg-cyan-950/70 transition-colors text-xs shrink-0"
        >
          <Activity size={13} className="text-cyan-400 shrink-0" />
          <span className="text-slate-300 font-medium">Consensus Blend:</span>
          <strong className="text-cyan-400 font-mono">{blendedValue} mm</strong>
        </button>

        {/* Confidence Pill */}
        <button
          onClick={() => onTabChange('validation')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-950/70 transition-colors text-xs shrink-0"
        >
          <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">Confidence:</span>
          <strong className="text-emerald-400 font-mono">{Math.round(confidence * 100)}% ({conf.label})</strong>
        </button>

        {/* Spatial Map Pill */}
        <button
          onClick={() => onTabChange('risk-map')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-colors text-xs shrink-0"
        >
          <Layers size={13} className="text-slate-400 shrink-0" />
          <span className="text-slate-300 font-medium">Pilot:</span>
          <strong className="text-slate-200 font-mono">6 Districts</strong>
        </button>

      </div>
    </div>
  );
}
