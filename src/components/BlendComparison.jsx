import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  calculateBlendedForecast,
  calculateEqualWeightForecast,
  weightsToPercent,
} from '../utils/calculations';

export default function BlendComparison({ forecasts, weights }) {
  const adaptive = calculateBlendedForecast(forecasts, weights);
  const equalWeight = calculateEqualWeightForecast(forecasts);
  const pct = weightsToPercent(weights);
  const EQ = 33;

  const models = [
    { key: 'ifs',  label: 'ECMWF IFS',  color: 'bg-blue-500'   },
    { key: 'gfs',  label: 'NCEP GFS',   color: 'bg-green-500'  },
    { key: 'aifs', label: 'ECMWF AIFS', color: 'bg-violet-500' },
  ];

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full bg-slate-300" />
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Fixed vs Adaptive Blending</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Fixed Equal Weight */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Fixed Equal-Weight Blend</p>
          <div className="flex flex-col gap-2 mb-4">
            {models.map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-slate-600 flex-1">{label}</span>
                <span className="text-xs font-bold text-slate-600">{EQ}%</span>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${EQ}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-400 mb-0.5">Fixed Forecast</p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-slate-700">{equalWeight}</span>
              <span className="text-slate-400 text-sm mb-0.5">mm</span>
            </div>
          </div>
        </div>

        {/* Adaptive */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">GreenSky Adaptive Blend</p>
          <div className="flex flex-col gap-2 mb-4">
            {models.map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-slate-700 flex-1 font-medium">{label}</span>
                <span className="text-xs font-bold text-slate-800">{pct[key]}%</span>
                <div className="w-16 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct[key]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-500 mb-0.5">GreenSky Forecast</p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-blue-800">{adaptive}</span>
              <span className="text-blue-400 text-sm mb-0.5">mm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <ArrowRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
        <span>
          <strong className="text-slate-700">Adaptive weights respond to forecast context</strong> — regime, location,
          lead time and historical source reliability — rather than treating all sources equally.
        </span>
      </div>
    </div>
  );
}
