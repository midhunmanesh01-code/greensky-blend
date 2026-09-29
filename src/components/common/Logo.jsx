import React, { useId } from 'react';

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');

  const sizeMap = {
    xs: { box: 'w-6 h-6', text: 'text-xs', sub: 'text-[8px]' },
    sm: { box: 'w-8 h-8', text: 'text-xs', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', text: 'text-sm', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', text: 'text-base', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', text: 'text-lg', sub: 'text-xs' },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      {/* SVG Icon Emblem */}
      <div className={`${s.box} shrink-0 relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`bg_${uid}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id={`sky_${uid}`} x1="15" y1="20" x2="85" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id={`blend_${uid}`} x1="30" y1="40" x2="70" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Squircle Badge Base */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="22"
            fill={`url(#bg_${uid})`}
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />

          {/* Atmospheric Cloud Arc 1 */}
          <path
            d="M 22 58 C 22 48 30 42 40 42 C 44 32 58 30 68 38 C 76 38 82 44 82 54 C 82 62 76 68 68 68 L 26 68 C 22 68 22 62 22 58 Z"
            fill={`url(#sky_${uid})`}
            opacity="0.9"
          />

          {/* ML Adaptive Blending Fusion Layer */}
          <path
            d="M 32 64 C 36 54 46 50 56 50 C 66 50 72 56 74 64 L 32 64 Z"
            fill={`url(#blend_${uid})`}
            opacity="0.8"
          />

          {/* Rainfall Streaks */}
          <line x1="34" y1="74" x2="28" y2="84" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="74" x2="44" y2="86" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="66" y1="74" x2="60" y2="84" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />

          {/* AI Consensus Pulse Signal */}
          <circle cx="56" cy="32" r="4.5" fill="#22d3ee" />
          <circle cx="56" cy="32" r="8.5" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.75" />
        </svg>
      </div>

      {/* Typography Lockup */}
      {showText && (
        <div className="min-w-0 flex flex-col justify-center">
          <div className={`${s.text} font-bold text-slate-100 tracking-wide leading-tight truncate`}>
            GreenSky Blend
          </div>
          <div className={`${s.sub} font-semibold text-cyan-400 uppercase tracking-widest font-mono truncate`}>
            Kerala Pilot · 24H
          </div>
        </div>
      )}
    </div>
  );
}
