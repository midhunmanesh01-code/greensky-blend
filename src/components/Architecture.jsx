import React from 'react';
import { ArrowDown, Database, Cpu, Layers, BarChart2, Map } from 'lucide-react';

const STEPS = [
  {
    icon: Database,
    label: 'Forecast Sources',
    sub: 'ECMWF IFS · NCEP GFS · ECMWF AIFS',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: Layers,
    label: 'Alignment & Quality Checks',
    sub: 'Regridding · Temporal sync · QC filtering',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
  {
    icon: Cpu,
    label: 'Context / Regime Features',
    sub: 'Weather regime · Location · Lead time · Source spread',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    icon: Cpu,
    label: 'Adaptive Blending Model',
    sub: 'Gradient-Boosted Meta-Model (XGBoost / LightGBM)',
    subDetail: 'Learns source reliability from: forecast values, weather regime, location, lead time, historical performance, source disagreement',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    highlight: true,
  },
  {
    icon: BarChart2,
    label: 'Forecast + Confidence',
    sub: 'Blended rainfall · Source contribution · Confidence indicator',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    icon: Map,
    label: 'Visualization',
    sub: 'Kerala district map · Time series · Weight spatial map',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
];

export default function Architecture() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-5 rounded-full bg-slate-400" />
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">System Architecture</h2>
      </div>

      <div className="flex flex-col items-center gap-0 max-w-md mx-auto">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="w-full flex flex-col items-center">
              <div
                className={`w-full rounded-xl border p-3.5 ${step.bg} ${step.border} ${
                  step.highlight ? 'ring-2 ring-green-300 ring-offset-1 shadow-sm' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg bg-white border ${step.border}`}>
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${step.color}`}>{step.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.sub}</p>
                    {step.subDetail && (
                      <p className="text-[10px] text-slate-400 mt-1 italic leading-relaxed">{step.subDetail}</p>
                    )}
                    {step.highlight && (
                      <span className="inline-flex mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded bg-green-200 text-green-800">
                        Core Component
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowDown className="w-4 h-4 text-slate-300 my-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
