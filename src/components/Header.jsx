import React from 'react';
import { CloudRain, MapPin, Clock } from 'lucide-react';

const NAV_ITEMS = ['Dashboard', 'Forecast Replay', 'Model Contribution', 'Validation'];

export default function Header({ activeNav, onNavChange }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-green-500 shadow-sm">
              <CloudRain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900 leading-none">GreenSky Blend</span>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium">by NEXA_CHN</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5 hidden sm:block">
                Hybrid AI–NWP Multi-Model Forecast Blending System
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => onNavChange(item)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeNav === item
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Region Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 tracking-wider">KERALA</span>
              <span className="w-px h-3 bg-emerald-300" />
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">24-HOUR FORECAST</span>
            </div>
          </div>
        </div>

        {/* Mobile nav — horizontally scrollable with right-fade indicator */}
        <div className="relative flex md:hidden pb-2">
          {/* Fade-out gradient to signal horizontal scroll */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-8 z-10"
            style={{ background: 'linear-gradient(to right, transparent, white)' }}
          />
          <div className="flex gap-1 overflow-x-auto scrollbar-none pr-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => onNavChange(item)}
                className={`flex-shrink-0 whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeNav === item
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
