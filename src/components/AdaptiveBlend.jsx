import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import {
  calculateBlendedForecast,
  calculateContributionMm,
  weightsToPercent,
} from '../utils/calculations';

const MODEL_COLORS = {
  ifs:  { bar: 'bg-blue-500',   label: 'text-blue-700' },
  gfs:  { bar: 'bg-green-500',  label: 'text-green-700' },
  aifs: { bar: 'bg-violet-500', label: 'text-violet-700' },
};

function WeightBar({ modelKey, name, pct, contrib }) {
  const [width, setWidth] = useState(0);
  const colors = MODEL_COLORS[modelKey];

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 150);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-right">
        <span className="text-sm font-semibold text-slate-700">{name}</span>
      </div>
      <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-lg flex items-center px-2 transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        >
          {width > 15 && (
            <span className="text-xs font-bold text-white">{contrib} mm</span>
          )}
        </div>
      </div>
      <div className="w-12 text-right">
        <span className={`text-sm font-bold ${colors.label}`}>{pct}%</span>
      </div>
    </div>
  );
}

export default function AdaptiveBlend({ forecasts, weights }) {
  const blended = calculateBlendedForecast(forecasts, weights);
  const pct = weightsToPercent(weights);
  const contrib = calculateContributionMm(forecasts, weights);

  const models = [
    { key: 'ifs',  name: 'ECMWF IFS'  },
    { key: 'gfs',  name: 'NCEP GFS'   },
    { key: 'aifs', name: 'ECMWF AIFS' },
  ];

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-600 to-green-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              GreenSky Adaptive Blending
            </h2>
          </div>
          <p className="text-xs text-slate-400 ml-3 max-w-lg">
            Context-aware weights adapt according to forecast behaviour, weather regime, location, lead time and historical performance.
          </p>
        </div>
        <span className="badge-illustrative whitespace-nowrap">Illustrative Data</span>
      </div>

      {/* Weight bars */}
      <div className="flex flex-col gap-3 mb-6">
        {models.map(({ key, name }) => (
          <WeightBar
            key={key}
            modelKey={key}
            name={name}
            pct={pct[key]}
            contrib={contrib[key]}
          />
        ))}
      </div>

      {/* Equation */}
      <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100">
        <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">Blending Equation</p>
        <div className="text-sm text-slate-700 font-mono">
          <span className="text-blue-600 font-semibold">{forecasts.ifs}</span>
          <span className="text-slate-400"> × {(weights.ifs).toFixed(2)} </span>
          <span className="text-slate-500">+</span>
          <span className="text-green-600 font-semibold"> {forecasts.gfs}</span>
          <span className="text-slate-400"> × {(weights.gfs).toFixed(2)} </span>
          <span className="text-slate-500">+</span>
          <span className="text-violet-600 font-semibold"> {forecasts.aifs}</span>
          <span className="text-slate-400"> × {(weights.aifs).toFixed(2)} </span>
          <span className="text-slate-500">= </span>
          <span className="font-bold text-slate-900">{blended} mm</span>
        </div>
      </div>

      {/* Blended result */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">
            GreenSky Blended Forecast
          </p>
          <div className="flex items-end gap-1.5">
            <span className="text-5xl font-extrabold text-white leading-none">{blended}</span>
            <span className="text-white/70 text-lg mb-1">mm</span>
          </div>
          <p className="text-blue-100 text-xs mt-1">24-hour rainfall — adaptive blend</p>
        </div>
        <div className="text-right">
          <div className="text-white/60 text-xs mb-1">Weight sum</div>
          <div className="text-white font-bold text-sm">{pct.ifs + pct.gfs + pct.aifs}%</div>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-400">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>
          The adaptive blending model conceptually uses a gradient-boosted meta-learner (XGBoost / LightGBM)
          to generate context-dependent source weights. Weight bars show contribution in mm.
        </span>
      </div>
    </div>
  );
}
