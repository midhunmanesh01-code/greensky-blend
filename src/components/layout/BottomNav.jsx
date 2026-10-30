import React from 'react';
import {
  LayoutDashboard,
  Map,
  Target,
  Layers,
  AlertTriangle,
  Menu,
} from 'lucide-react';

const PRIMARY_TABS = [
  { id: 'dashboard', label: 'Forecast', icon: LayoutDashboard },
  { id: 'risk-map', label: 'GIS Map', icon: Map },
  { id: 'district-pilot', label: 'Pilot', icon: Target },
  { id: 'blending', label: 'Blend', icon: Layers },
  { id: 'extreme', label: 'Extreme', icon: AlertTriangle },
];

const SECONDARY_TAB_IDS = ['historical', 'validation', 'methodology', 'impact', 'references'];

export default function BottomNav({ activeTab, onTabChange, onOpenMenu }) {
  const isMoreActive = SECONDARY_TAB_IDS.includes(activeTab);

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-around h-14">
        {PRIMARY_TABS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full py-1 px-0.5 relative transition-colors touch-manipulation cursor-pointer
                ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 active:text-slate-100'
                }
              `}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              )}
              <Icon size={18} className={`mb-0.5 ${isActive ? 'text-amber-400 stroke-[2.5]' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight leading-tight truncate max-w-[56px]">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          type="button"
          onClick={onOpenMenu}
          className={`
            flex flex-col items-center justify-center flex-1 h-full py-1 px-0.5 relative transition-colors touch-manipulation cursor-pointer
            ${
              isMoreActive
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 active:text-slate-100'
            }
          `}
          aria-label="More navigation options"
        >
          {isMoreActive && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          )}
          <Menu size={18} className={`mb-0.5 ${isMoreActive ? 'text-amber-400 stroke-[2.5]' : 'text-slate-400'}`} />
          <span className="text-[10px] tracking-tight leading-tight truncate max-w-[56px]">
            More
          </span>
        </button>
      </div>
    </nav>
  );
}
