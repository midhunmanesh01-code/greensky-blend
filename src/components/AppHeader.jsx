import React from 'react';
import { 
  CloudRain, 
  LayoutDashboard, 
  Map, 
  Layers, 
  PlayCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ShieldAlert, 
  BookOpen 
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Forecast', icon: LayoutDashboard },
  { id: 'map', label: 'Kerala Map', icon: Map },
  { id: 'blending', label: 'Adaptive Blending', icon: Layers },
  { id: 'replay', label: 'Historical Replay', icon: PlayCircle },
  { id: 'validation', label: 'Validation', icon: CheckCircle2 },
  { id: 'extreme', label: 'Extreme Rain', icon: AlertTriangle },
  { id: 'methodology', label: 'Methodology', icon: Cpu },
  { id: 'impact', label: 'Decision Support', icon: ShieldAlert },
  { id: 'references', label: 'References', icon: BookOpen },
];

export default function AppHeader({ activeTab, onTabChange }) {
  return (
    <header className="bg-[#070e1c] border-b border-slate-800/80 sticky top-0 z-50">
      {/* Top Brand Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 border-b border-slate-800/50">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <CloudRain className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight leading-none">GreenSky Blend</span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 text-cyan-400">
                  SIH26081
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block mt-0.5">
                Adaptive Multi-Model Weather Forecasting
              </p>
            </div>
          </div>

          {/* Pilot Scope Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-400">KERALA PILOT</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">6 DISTRICTS</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-400">24H LEAD</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
