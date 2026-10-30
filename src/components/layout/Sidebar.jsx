import React, { useEffect } from 'react';
import Logo from '../common/Logo';
import {
  LayoutDashboard,
  Map,
  Layers,
  History,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  ShieldAlert,
  BookOpen,
  X,
  Radio,
  Target,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard & Consensus', icon: LayoutDashboard },
  { id: 'risk-map', label: 'Kerala GIS Map', icon: Map },
  { id: 'district-pilot', label: '6-District Pilot (Phase 3)', icon: Target, badge: 'NEW' },
  { id: 'blending', label: 'Adaptive Blending', icon: Layers },
  { id: 'historical', label: 'Forecast Replay', icon: History },
  { id: 'validation', label: 'Validation & Skill', icon: CheckCircle2 },
  { id: 'extreme', label: 'Extreme Rainfall', icon: AlertTriangle },
  { id: 'methodology', label: 'Methodology & ML', icon: Cpu },
  { id: 'impact', label: 'Decision Support', icon: ShieldAlert },
  { id: 'references', label: 'References & Data', icon: BookOpen },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  mobileOpen = false,
  onCloseMobile = () => {},
}) {
  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const handleSelect = (id) => {
    onTabChange(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Slide-over drawer on mobile, static column on desktop) */}
      <aside
        className={`
          fixed top-0 left-0 h-[100dvh] w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 z-50
          flex flex-col transition-transform duration-200 ease-out shadow-2xl pt-safe
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none lg:pointer-events-auto'}
          lg:translate-x-0 lg:static lg:z-auto lg:w-64 lg:h-full lg:shadow-none shrink-0
        `}
        aria-label="Sidebar Navigation"
      >
        {/* Drawer / Sidebar Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center min-w-0">
            <Logo size="md" showText={true} />
          </div>

          {/* Close button inside mobile drawer with 44px touch target */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 active:bg-slate-800 min-w-[42px] min-h-[42px] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close navigation drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-3 px-2.5 overflow-y-auto touch-scroll">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg text-xs sm:text-[13px] font-medium
                    transition-colors duration-150 text-left min-h-[44px] cursor-pointer touch-manipulation
                    ${
                      isActive
                        ? 'bg-amber-600/15 text-amber-400 border-l-2 border-amber-500 font-semibold shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 active:bg-slate-800/60 border-l-2 border-transparent'
                    }
                  `}
                >
                  <Icon size={18} className={`shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom — Operational Station Status */}
        <div className="px-3.5 py-3.5 border-t border-slate-800 space-y-2 bg-slate-950/90 shrink-0 pb-safe">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-950/40 border border-emerald-800/30">
            <Radio size={12} className="text-emerald-400 animate-pulse shrink-0" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Operational Status
            </span>
          </div>
          <div className="px-1 text-[10px] text-slate-400 font-mono space-y-0.5">
            <div className="text-slate-300 font-medium truncate">Kerala SEOC &bull; SIH26081</div>
            <div className="text-slate-500 text-[9px] truncate">ECMWF &bull; GFS &bull; IMD Feeds Active</div>
          </div>
        </div>
      </aside>
    </>
  );
}
