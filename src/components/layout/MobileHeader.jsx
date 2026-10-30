import React from 'react';
import Logo from '../common/Logo';
import { Menu } from 'lucide-react';

export default function MobileHeader({ onOpenMenu }) {
  return (
    <header className="lg:hidden shrink-0 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3.5 py-2.5 pt-safe flex items-center justify-between z-30 w-full">
      <div className="flex items-center min-w-0">
        <Logo size="sm" showText={true} />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800/50 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">LIVE</span>
        </div>

        <button
          type="button"
          onClick={onOpenMenu}
          className="p-2.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-700/80 hover:bg-slate-800 active:bg-slate-700 transition-colors flex items-center justify-center min-w-[42px] min-h-[42px] touch-manipulation cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={20} className="text-slate-200" />
        </button>
      </div>
    </header>
  );
}
