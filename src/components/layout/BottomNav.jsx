import React from 'react';
import {
  LayoutDashboard,
  Map,
  Layers,
  History,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { id: 'dashboard', label: 'Forecast', icon: LayoutDashboard },
  { id: 'risk-map', label: 'GIS Map', icon: Map },
  { id: 'blending', label: 'Blending', icon: Layers },
  { id: 'historical', label: 'Replay', icon: History },
  { id: 'validation', label: 'Validation', icon: CheckCircle2 },
  { id: 'extreme', label: 'Extreme', icon: AlertTriangle },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe px-1"
    >
      <div className="flex items-center justify-around h-14">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full py-1 px-0.5 relative transition-colors
                ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              )}
              <Icon size={18} className={`mb-0.5 ${isActive ? 'text-amber-400 stroke-[2.5]' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight leading-tight truncate max-w-[54px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
