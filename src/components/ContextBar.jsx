import React from 'react';
import { MapPin, Calendar, Clock, CloudRain, Activity, ShieldCheck } from 'lucide-react';
import { DISTRICTS, DATES } from '../data/demoData';
import { formatDateLabel, getConfidenceLevel } from '../utils/calculations';

export default function ContextBar({ 
  district, 
  date, 
  onDistrictChange, 
  onDateChange, 
  blendedValue, 
  confidence, 
  regime 
}) {
  const conf = getConfidenceLevel(confidence);

  return (
    <div className="bg-[#0b1528] border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Interactive Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* District Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Pilot District:</span>
            <select
              value={district}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-slate-100">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Valid Date:</span>
            <select
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1"
            >
              {DATES.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-slate-100">
                  {formatDateLabel(d)}
                </option>
              ))}
            </select>
          </div>

          {/* Lead Time Badge */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono font-semibold text-cyan-300">24-Hour Lead</span>
          </div>

          {/* Regime Badge */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 text-[11px]">Regime:</span>
            <span className={`font-bold ${regime === 'Heavy Rain' ? 'text-rose-400' : 'text-sky-300'}`}>
              {regime}
            </span>
          </div>

        </div>

        {/* Right: Live Telemetry & Metrics */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          
          {/* GreenSky Blended Value */}
          <div className="flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/60 rounded-lg px-3 py-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-cyan-300 font-medium">GreenSky Blend:</span>
            <span className="font-mono font-bold text-white text-sm">{blendedValue} mm</span>
          </div>

          {/* Confidence Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1">
            <ShieldCheck className={`w-3.5 h-3.5 ${conf.color}`} />
            <span className="text-[11px] text-slate-400">Confidence:</span>
            <span className={`font-bold ${conf.color}`}>{Math.round(confidence * 100)}% ({conf.label})</span>
          </div>

        </div>

      </div>
    </div>
  );
}
