import React, { useState } from 'react';
import { BarChart2, CheckCircle2, Activity, ShieldCheck, Target, Layers, FileText } from 'lucide-react';
import { EXPERIMENT_METRICS } from '../../data/benchmarkData';

const METRICS = [
  { key: 'MAE', label: 'Mean Absolute Error', desc: 'Average magnitude of daily forecast errors in mm against IMD gauge.', unit: 'mm', icon: BarChart2, color: '#38bdf8' },
  { key: 'RMSE', label: 'Root Mean Square Error', desc: 'Penalizes larger forecast outliers and severe discrepancies.', unit: 'mm', icon: Target, color: '#a78bfa' },
  { key: 'CSI@15.6', label: 'Critical Success Index (15.6mm)', desc: 'Categorical threat score for moderate-to-heavy rainfall events.', unit: 'score', icon: ShieldCheck, color: '#34d399' },
  { key: 'Alignment', label: 'Convention B (03:00 UTC)', desc: 'Corrected 24h accumulation matching IMD 08:30 IST gauge read.', unit: 'UTC', icon: Activity, color: '#f59e0b' },
];

export default function ValidationView() {
  const [selectedExp, setSelectedExp] = useState('experiment1_regime');
  const expData = EXPERIMENT_METRICS[selectedExp];

  return (
    <div className="space-y-4">
      
      {/* 1. Metric Definition & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.key}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-white my-1">{m.key}</div>
              <p className="text-[11px] text-slate-400 leading-tight">{m.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 2. Interactive Experiment Selector & Verified Benchmark Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Quantitative Benchmark Evaluation Results
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verified outcomes from greensky-benchmark repository evaluated at the Benchmark Grid Cell (10.75°N, 76.25°E) against ground-truth IMD observations (Convention B: 03:00 UTC)
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'experiment1_regime', label: 'Exp 1: Locked Test (Aug 4–31)' },
              { id: 'experiment2_robustness', label: 'Exp 2: Robustness (Jul 1–Aug 3)' },
              { id: 'experiment3_calibration', label: 'Exp 3: Calibration' },
              { id: 'experiment4_atmospheric', label: 'Exp 4: Atmos Context' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedExp(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  selectedExp === tab.id
                    ? 'bg-amber-600 text-slate-950 border-amber-500 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experiment Details Header */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-amber-400 font-mono block sm:inline mr-2">{expData.title}</span>
            <span className="text-slate-400 font-mono text-[11px]">{expData.split}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0 self-start sm:self-auto">
            {expData.status}
          </span>
        </div>

        {/* Real Benchmark Numbers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2.5 font-bold uppercase tracking-wider">Model / Pipeline</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">MAE (mm)</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">RMSE (mm)</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">CSI @ 15.6mm</th>
                {selectedExp === 'experiment1_regime' && (
                  <>
                    <th className="pb-2.5 font-bold uppercase tracking-wider text-right">Hits</th>
                    <th className="pb-2.5 font-bold uppercase tracking-wider text-right">Misses</th>
                    <th className="pb-2.5 font-bold uppercase tracking-wider text-right">False Alarms</th>
                  </>
                )}
                {selectedExp === 'experiment2_robustness' && (
                  <th className="pb-2.5 font-bold uppercase tracking-wider text-right">CSI @ 64.5mm</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {expData.models.map((m) => (
                <tr
                  key={m.name}
                  className={`${
                    m.highlight
                      ? 'bg-amber-950/20 text-amber-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/30'
                  }`}
                >
                  <td className="py-2.5 pr-2 flex items-center gap-2">
                    {m.highlight && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                    <span>{m.name}</span>
                    {m.type && <span className="text-[10px] text-slate-500 font-normal">({m.type})</span>}
                  </td>
                  <td className="py-2.5 text-right font-bold">{m.mae.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-bold">{m.rmse.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-bold">
                    {m.csi15 !== null && m.csi15 !== undefined ? m.csi15.toFixed(3) : 'N/A'}
                  </td>
                  {selectedExp === 'experiment1_regime' && (
                    <>
                      <td className="py-2.5 text-right text-emerald-400">{m.hits15 ?? '—'}</td>
                      <td className="py-2.5 text-right text-rose-400">{m.misses15 ?? '—'}</td>
                      <td className="py-2.5 text-right text-amber-400">{m.fa15 ?? '—'}</td>
                    </>
                  )}
                  {selectedExp === 'experiment2_robustness' && (
                    <td className="py-2.5 text-right text-slate-500">
                      {m.csi64 !== null && m.csi64 !== undefined ? m.csi64.toFixed(3) : 'N/A'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Experiment Scientific Verdict */}
        <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-amber-500/20 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
          <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-400 font-mono">Scientific Finding: </strong>
            {expData.verdict}
          </div>
        </div>
      </div>

      {/* 3. Verification Pipeline & Evaluation Baseline Ladder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Verification Pipeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Chronological Verification Pipeline
            </h4>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">Strict Time Order</span>
          </div>

          <div className="space-y-2">
            {[
              { step: '1. Ingest Data', text: 'ECMWF IFS + NOAA GFS Forecasts + IMD Gauge Observations' },
              { step: '2. Time Alignment', text: 'Convention B: (D-1) 03:00 UTC to D 03:00 UTC (no phase lag)' },
              { step: '3. Training Split', text: 'Historical calibration period (Jun 01 – Aug 03, n=64 days)' },
              { step: '4. Regime Blending', text: 'Convex weight optimization per rainfall intensity regime' },
              { step: '5. Locked Test', text: 'Chronological unseen testing (Aug 04 – Aug 31, n=28 days)' },
              { step: '6. Verification', text: 'Standard WMO skill metric calculation (MAE, RMSE, CSI, Hits, FAs)' },
            ].map((item) => (
              <div key={item.step} className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-400 text-[11px]">{item.step}</span>
                <span className="text-slate-300 text-[11px] text-right">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Baseline Ladder */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Evaluation Baseline Ladder
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">4-Tier Hierarchy</span>
          </div>

          <div className="space-y-2.5">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">Level 1: Standalone NWP Models</span>
                <span className="text-[10px] font-mono text-slate-500">ECMWF: 9.03 mm | GFS: 10.80 mm</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Raw model precipitation from global numerical weather prediction grids without post-processing.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">Level 2: Fixed Equal-Weight Ensemble</span>
                <span className="text-[10px] font-mono text-slate-500">MAE: 9.02 mm | RMSE: 13.62 mm</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Static 50/50 arithmetic mean treating both NWP models equally regardless of regime or topography.
              </p>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/40 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-300">Level 3: GreenSky Regime-Adaptive Blender</span>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">MAE: 8.80 mm | RMSE: 12.30 mm</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dynamic convex weights learned on training data alone, conditioned on forecast intensity regime.
              </p>
            </div>

            <div className="bg-purple-950/20 border border-purple-800/40 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-purple-300">Level 4: Atmospheric Context Machine Learning</span>
                <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-800/60">CSI@15.6: 0.471</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Exp 4 prototype adding CAPE, Lifted Index, RH, and wind shear predictors to resolve misclassified severe storms.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Research Validation Status Phases */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-3">
          Research Validation Phases
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg border bg-emerald-950/20 border-emerald-800/40 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-bold text-white">Phase 1: Physical NWP Benchmark</h5>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300">
                  Historical Benchmark (92 Days)
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">ECMWF IFS + NOAA GFS Seamless vs IMD 0.25° Ground Truth</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Evaluated under Convention B (03:00 UTC accumulation) across the entire 2025 Monsoon season with locked chronological testing.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border bg-amber-950/20 border-amber-800/40 flex items-start gap-3">
            <Activity className="w-4 h-4 text-amber-400 mt-0.5 shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-bold text-white">Phase 2: Atmospheric ML & Spatial Scaling</h5>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300">
                  Research Prototype (Active Validation)
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">ECMWF AIFS + Multi-Variable Context ML across 6 Kerala Pilot Districts</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Evaluating spatial scaling across Western Ghats orographic barriers and expanding multi-variable atmospheric reanalysis.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
