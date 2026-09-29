import React from 'react';
import { CheckCircle2, Clock, AlertCircle, BarChart2, ShieldCheck } from 'lucide-react';
import { EXPERIMENT_METRICS } from '../data/benchmarkData';

const METRICS = [
  { key: 'MAE',  label: 'Mean Absolute Error',    desc: 'Average magnitude of forecast errors (mm)' },
  { key: 'RMSE', label: 'Root Mean Square Error',  desc: 'Penalizes large errors more heavily' },
  { key: 'CSI',  label: 'Critical Success Index',  desc: 'Hit rate for rainfall threshold exceedance' },
  { key: 'ETS',  label: 'Equitable Threat Score',  desc: 'Skill score adjusted for random hits' },
];

export default function ValidationPanel() {
  const exp1 = EXPERIMENT_METRICS.experiment1_regime;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 rounded-full bg-amber-500" />
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Historical Benchmark & Validation Framework</h2>
      </div>

      <p className="text-xs text-slate-400 mb-5 max-w-2xl leading-relaxed">
        GreenSky is evaluated against individual forecast sources and a fixed equal-weight baseline
        using chronological unseen periods (Convention B aligned: 03:00 UTC). Metrics below represent actual results on held-out test data.
      </p>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {METRICS.map((m) => (
          <div key={m.key} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-bold text-slate-200">{m.key}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Experiment 1 Summary Table */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-400 font-mono">Locked Test Results (Aug 04–31, 2025)</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
            Validated
          </span>
        </div>
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-[10px]">
              <th className="pb-1.5 font-bold uppercase">Model</th>
              <th className="pb-1.5 font-bold uppercase text-right">MAE</th>
              <th className="pb-1.5 font-bold uppercase text-right">RMSE</th>
              <th className="pb-1.5 font-bold uppercase text-right">CSI@15.6</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {exp1.models.map((m) => (
              <tr key={m.name} className={m.highlight ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                <td className="py-1.5">{m.name}</td>
                <td className="py-1.5 text-right">{m.mae.toFixed(2)} mm</td>
                <td className="py-1.5 text-right">{m.rmse.toFixed(2)} mm</td>
                <td className="py-1.5 text-right">{m.csi15 !== null ? m.csi15.toFixed(3) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Validation phases */}
      <div className="space-y-3">
        <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-sm font-bold text-white">Physical NWP Benchmark (ECMWF IFS + NOAA GFS)</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Convention B (03:00 UTC Accumulation)</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-800/60">
                Historical Benchmark (92 Days)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Dual-NWP regime-conditioned adaptive blending evaluated across the 2025 Southwest Monsoon season against IMD ground truth rain gauges.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-sm font-bold text-white">Atmospheric ML & Spatial Pilot Scaling</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">ECMWF AIFS + Multi-Variable Context ML</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-800/60">
                Active Validation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Extending multi-variable atmospheric reanalysis (CAPE, wind shear) and evaluating operational deployment across the 6 Kerala pilot districts.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-start gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
        <span>
          GreenSky Blend is a decision-support platform designed to augment early warning protocols and does not replace official meteorological agency bulletins.
        </span>
      </div>
    </div>
  );
}
