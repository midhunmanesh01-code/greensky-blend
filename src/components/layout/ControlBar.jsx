import React from 'react';
import { MapPin, Calendar, Clock, CloudRain, ShieldCheck, Activity, ChevronDown } from 'lucide-react';
import { DISTRICTS, DATES } from '../../data/demoData';
import { formatDateLabel, getConfidenceLevel } from '../../utils/calculations';
import { PILOT_DISTRICTS } from '../../data/benchmarkData';

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
  const activeMeta = PILOT_DISTRICTS?.find((d) => d.name === district);
  const gridLabel = activeMeta ? `${activeMeta.lat}°N, ${activeMeta.lon}°E` : '10.75°N, 76.25°E';
  const gridStation = activeMeta?.station || 'Benchmark';

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-3 shrink-0">
      
      {/* Selectors Group */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
        
        {/* District Context Selector */}
        <div className="relative flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 sm:py-1.5 min-h-[42px] sm:min-h-0 shadow-inner">
          <MapPin size={14} className="text-amber-400 shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 leading-none mb-0.5 sm:hidden font-medium">District</span>
            <select
              value={district}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer text-xs pr-4 truncate w-full appearance-none"
              aria-label="Select district context"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-slate-100">
                  {d}
                </option>
              ))}
            </select>
          </div>
          <ChevronDown size={12} className="text-slate-400 shrink-0 pointer-events-none absolute right-2 sm:static" />
        </div>

        {/* Date Selector */}
        <div className="relative flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 sm:py-1.5 min-h-[42px] sm:min-h-0 shadow-inner">
          <Calendar size={14} className="text-amber-400 shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 leading-none mb-0.5 sm:hidden font-medium">Date</span>
            <select
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer text-xs pr-4 truncate w-full appearance-none"
              aria-label="Select valid date"
            >
              {DATES.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-slate-100">
                  {formatDateLabel(d)}
                </option>
              ))}
            </select>
          </div>
          <ChevronDown size={12} className="text-slate-400 shrink-0 pointer-events-none absolute right-2 sm:static" />
        </div>

        {/* Desktop-only Representative IMD Grid Location Badge */}
        <button
          type="button"
          onClick={() => onTabChange && onTabChange('district-pilot')}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-xs text-slate-400 font-mono transition-colors cursor-pointer text-left"
          title={`Representative IMD ground-truth grid cell for ${district} (${gridStation}). Click to open 6-District Pilot evaluation.`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span>IMD Grid: <strong className="text-slate-200 font-bold">{gridLabel}</strong></span>
          <span className="text-[10px] text-amber-400/90 font-sans uppercase font-bold bg-amber-950/60 px-1 rounded ml-1">Pilot</span>
        </button>

        {/* Desktop-only Lead Time & Regime Badges */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
          <Clock size={13} className="text-slate-400 shrink-0" />
          <span className="font-semibold text-amber-400">24h Lead</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <CloudRain size={13} className="text-sky-400 shrink-0" />
          <span className="text-slate-400">Regime:</span>
          <span className={`font-bold ${regime === 'Heavy Rain' ? 'text-rose-400' : 'text-sky-300'}`}>
            {regime}
          </span>
        </div>

      </div>

      {/* Telemetry Metrics Bar (Horizontally scrollable on mobile, flex on desktop) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 lg:py-0 shrink-0">
        
        {/* Consensus Blend Pill */}
        <button
          type="button"
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-700/60 hover:bg-amber-950/70 active:bg-amber-900/60 transition-colors text-xs shrink-0 shadow-sm cursor-pointer min-h-[36px]"
          title="Click to view full Consensus Forecast"
        >
          <Activity size={13} className="text-amber-400 shrink-0" />
          <span className="text-slate-300 font-medium text-[11px] sm:text-xs">Consensus:</span>
          <strong className="text-amber-400 font-mono text-xs sm:text-sm">{blendedValue} mm</strong>
        </button>

        {/* Confidence Pill */}
        <button
          type="button"
          onClick={() => onTabChange('validation')}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-950/70 active:bg-emerald-900/60 transition-colors text-xs shrink-0 cursor-pointer min-h-[36px]"
          title="Click to view Validation & Skill metrics"
        >
          <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium text-[11px] sm:text-xs">Conf:</span>
          <strong className="text-emerald-400 font-mono text-xs sm:text-sm">{Math.round(confidence * 100)}% ({conf.label})</strong>
        </button>

        {/* Mobile-only Regime Pill */}
        <div className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] shrink-0 min-h-[36px]">
          <CloudRain size={12} className="text-sky-400 shrink-0" />
          <span className="text-slate-400">Regime:</span>
          <span className={`font-bold font-mono ${regime === 'Heavy Rain' ? 'text-rose-400' : 'text-sky-300'}`}>
            {regime}
          </span>
        </div>

        {/* Mobile-only Lead Time Pill */}
        <div className="sm:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-400 font-mono shrink-0 min-h-[36px]">
          <Clock size={12} className="text-slate-400 shrink-0" />
          <span>24h</span>
        </div>

      </div>
    </div>
  );
}
