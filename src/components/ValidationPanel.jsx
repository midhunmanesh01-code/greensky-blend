import React from 'react';
import { CheckCircle, Clock, AlertCircle, BarChart2 } from 'lucide-react';

const METRICS = [
  { key: 'MAE',  label: 'Mean Absolute Error',    desc: 'Average magnitude of forecast errors (mm)' },
  { key: 'RMSE', label: 'Root Mean Square Error',  desc: 'Penalizes large errors more heavily' },
  { key: 'CSI',  label: 'Critical Success Index',  desc: 'Hit rate for rainfall threshold exceedance' },
  { key: 'ETS',  label: 'Equitable Threat Score',  desc: 'Skill score adjusted for random hits' },
];

const PHASES = [
  {
    title: 'Initial Two-Source Feasibility',
    description: 'ECMWF IFS + NCEP GFS',
    status: 'done',
    statusLabel: 'Initial feasibility demonstrated',
    detail: 'Blending of two NWP sources evaluated on historical Kerala monsoon periods.',
  },
  {
    title: 'Three-Source Hybrid Validation',
    description: 'ECMWF IFS + NCEP GFS + ECMWF AIFS',
    status: 'in-progress',
    statusLabel: 'Validation in progress',
    detail: 'Integration of ECMWF AIFS as a third source. Full chronological validation underway.',
  },
];

export default function ValidationPanel() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full bg-amber-500" />
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Validation Framework</h2>
      </div>

      <p className="text-xs text-slate-500 mb-5 max-w-2xl">
        GreenSky is evaluated against individual forecast sources and a fixed equal-weight baseline
        using chronological unseen periods. Metrics below are computed on held-out data.
      </p>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {METRICS.map((m) => (
          <div key={m.key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-sm font-bold text-slate-900">{m.key}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Validation phases */}
      <div className="space-y-3">
        {PHASES.map((phase) => (
          <div
            key={phase.title}
            className={`rounded-xl border p-4 flex items-start gap-3 ${
              phase.status === 'done'
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div className="mt-0.5">
              {phase.status === 'done' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">{phase.title}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{phase.description}</p>
                </div>
                <span
                  className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full border ${
                    phase.status === 'done'
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                  }`}
                >
                  {phase.statusLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">{phase.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-1.5 text-xs text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
        <span>
          Three-source validation results are not yet available. No performance claims are made for the ECMWF AIFS integration.
          Quantitative metrics will be published upon validation completion.
        </span>
      </div>
    </div>
  );
}
