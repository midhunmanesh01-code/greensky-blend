import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Radio, Database, Cpu, CloudRain, ShieldCheck } from 'lucide-react';

const BOOT_STAGES = [
  { text: 'Connecting to ECMWF IFS & NCEP GFS numerical feeds...', icon: Database },
  { text: 'Calibrating ECMWF AIFS deep learning neural weights...', icon: Cpu },
  { text: 'Synchronizing Kerala spatial topography grid (0.25°)...', icon: CloudRain },
  { text: 'Executing gradient-boosted adaptive meta-learner...', icon: Cpu },
  { text: 'Statewide command telemetry online.', icon: ShieldCheck },
];

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(15);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFading(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 350);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 20) + 14;
        return next > 100 ? 100 : next;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onFinish]);

  const stageIndex =
    progress < 25 ? 0 :
    progress < 50 ? 1 :
    progress < 75 ? 2 :
    progress < 95 ? 3 : 4;

  const CurrentIcon = BOOT_STAGES[stageIndex].icon;

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 select-none transition-opacity duration-300 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-amber-500/[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        
        {/* Clean Logo without additional surrounding boxes */}
        <div className="mb-5 flex items-center justify-center">
          <Logo size="xl" showText={false} />
        </div>

        {/* Title Lockup */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
          GreenSky Blend
        </h1>
        <p className="text-xs font-mono font-semibold text-amber-400 mt-1 uppercase tracking-wider">
          Adaptive Multi-Model Weather Forecasting
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
          Kerala State Meteorological Command &bull; SIH26081
        </p>

        {/* Progress & Telemetry Panel */}
        <div className="w-full mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          
          {/* Live Stage Message */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0 text-left">
              <CurrentIcon size={14} className="text-amber-400 shrink-0 animate-pulse" />
              <span className="text-slate-200 font-medium text-[11px] truncate">
                {BOOT_STAGES[stageIndex].text}
              </span>
            </div>
            <span className="font-mono font-bold text-amber-400 text-xs shrink-0 pl-2">
              {progress}%
            </span>
          </div>

          {/* High-Precision Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 p-0.5 border border-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-150 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Telemetry Status Bar */}
          <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-400 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">LIVE FEEDS CONNECTED</span>
            </div>
            <span className="text-slate-400">24H LEAD &bull; KERALA REGION</span>
          </div>
        </div>

        {/* Sub-Footer Provenance */}
        <div className="mt-5 flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <Radio size={11} className="text-slate-500" />
          <span>OPERATIONAL DECISION SUPPORT &bull; TEAM NEXA_CHN</span>
        </div>

      </div>
    </div>
  );
}
