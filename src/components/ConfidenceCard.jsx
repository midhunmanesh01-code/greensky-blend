import React from 'react';
import { Info } from 'lucide-react';
import { getConfidenceLevel, calculateSourceAgreement } from '../utils/calculations';

export default function ConfidenceCard({ confidence, forecasts }) {
  const level = getConfidenceLevel(confidence);
  const agreement = calculateSourceAgreement(forecasts);
  const pct = Math.round(confidence * 100);

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full bg-emerald-500" />
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Forecast Confidence</h2>
      </div>

      {/* Confidence ring */}
      <div className="flex flex-col items-center py-4">
        <div className="relative flex items-center justify-center mb-3">
          <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={confidence >= 0.85 ? "#10b981" : confidence >= 0.75 ? "#3b82f6" : confidence >= 0.65 ? "#f59e0b" : "#ef4444"}
              strokeWidth="10"
              strokeDasharray={`${pct * 2.638} 263.8`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-extrabold text-slate-900">{pct}%</span>
          </div>
        </div>

        <div className={`px-4 py-1.5 rounded-full border font-bold text-sm ${level.bg} ${level.color} ${level.border}`}>
          {level.label}
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Source Agreement</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${agreement}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700">{agreement}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Reliability Score</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700">{pct}%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-1.5 text-xs text-slate-400">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>Prototype indicator based on source agreement and model reliability. Not a calibrated probability.</span>
      </div>
    </div>
  );
}
