import React from 'react';
import { Radio } from 'lucide-react';

export default function DemoModeBanner() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <span className="font-bold text-slate-100 text-xs tracking-wider uppercase truncate">
          GreenSky Operational Command
        </span>
        <span className="text-slate-600 hidden md:inline">•</span>
        <span className="text-slate-400 font-mono text-[11px] hidden md:inline truncate">
          SIH26081 &bull; Adaptive Multi-Model Rainfall Blending &bull; Kerala Pilot
        </span>
      </div>

      <div className="flex items-center gap-3 font-mono text-[11px] shrink-0 pl-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
          <Radio size={12} className="text-emerald-400 animate-pulse shrink-0" />
          <span className="font-semibold text-[10px] sm:text-[11px] hidden xs:inline">LIVE FEEDS CONNECTED</span>
          <span className="font-semibold text-[10px] xs:hidden">LIVE</span>
        </div>
      </div>
    </div>
  );
}
