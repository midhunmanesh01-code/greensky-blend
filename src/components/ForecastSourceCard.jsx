import React from 'react';
import { TrendingUp } from 'lucide-react';

const MODEL_META = {
  ifs:  { name: "ECMWF IFS",  type: "NWP",            badgeClass: "badge-nwp",  accent: "from-blue-600 to-blue-400",   border: "border-blue-100", bg: "from-blue-50 to-white" },
  gfs:  { name: "NCEP GFS",   type: "NWP",            badgeClass: "badge-nwp",  accent: "from-green-600 to-green-400", border: "border-green-100",bg: "from-green-50 to-white" },
  aifs: { name: "ECMWF AIFS", type: "AI Weather Model",badgeClass: "badge-ai",  accent: "from-violet-600 to-violet-400",border: "border-violet-100",bg: "from-violet-50 to-white" },
};

export default function ForecastSourceCard({ modelKey, value, weight }) {
  const meta = MODEL_META[modelKey];
  const weightPct = Math.round(weight * 100);

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${meta.border} bg-gradient-to-b ${meta.bg} p-5 shadow-sm flex flex-col gap-3`}>
      {/* Top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${meta.accent} rounded-t-2xl`} />

      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Forecast Source</p>
          <h3 className="text-base font-bold text-slate-900 leading-tight">{meta.name}</h3>
        </div>
        <span className={meta.badgeClass}>{meta.type}</span>
      </div>

      {/* Rainfall value */}
      <div className="flex items-end gap-1">
        <span className="text-4xl font-extrabold text-slate-900 leading-none">{value}</span>
        <span className="text-base font-semibold text-slate-400 mb-1">mm</span>
      </div>

      {/* Weight bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 font-medium">Adaptive weight</span>
          <span className="text-xs font-bold text-slate-700">{weightPct}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${meta.accent} rounded-full transition-all duration-700`}
            style={{ width: `${weightPct}%` }}
          />
        </div>
      </div>

      {/* Trend indicator */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>24-hour rainfall forecast</span>
        <span className="ml-auto badge-illustrative text-[10px]">Illustrative</span>
      </div>
    </div>
  );
}
