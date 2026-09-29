import React from 'react';
import { BarChart2, CheckCircle2, Activity, ShieldCheck, Target } from 'lucide-react';

const METRICS = [
  { key: 'MAE', label: 'Mean Absolute Error', desc: 'Average magnitude of forecast errors in mm', unit: 'mm', icon: BarChart2, color: '#38bdf8' },
  { key: 'RMSE', label: 'Root Mean Square Error', desc: 'Penalizes large outlier forecast errors more heavily', unit: 'mm', icon: Target, color: '#a78bfa' },
  { key: 'CSI', label: 'Critical Success Index', desc: 'Hit rate for rainfall threshold exceedance (0 to 1)', unit: 'score', icon: ShieldCheck, color: '#34d399' },
  { key: 'ETS', label: 'Equitable Threat Score', desc: 'Skill score adjusted for random baseline chance hits', unit: 'score', icon: Activity, color: '#fbbf24' },
];

const PHASES = [
  { 
    title: 'Phase 1: Initial Two-Source Feasibility', 
    sources: 'ECMWF IFS + NCEP GFS', 
    status: 'Demonstrated', 
    detail: 'Blending of two physical NWP sources evaluated on historical Kerala monsoon periods against IMD observation network.',
    active: false,
    done: true
  },
  { 
    title: 'Phase 2: Three-Source Hybrid Integration', 
    sources: 'ECMWF IFS + NCEP GFS + ECMWF AIFS', 
    status: 'Active Validation', 
    detail: 'Integration of deep learning ECMWF AIFS as third source with chronological unseen-data testing across pilot districts.',
    active: true,
    done: false
  },
];

export default function ValidationView() {
  return (
    <div className="space-y-4">
      
      {/* 1. Metric Definition Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.key}
              className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-mono text-white my-1">{m.key}</div>
              <p className="text-[11px] text-slate-500 leading-tight">{m.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 2. Verification Framework & Baseline Ladder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Verification Pipeline */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Chronological Verification Pipeline
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">Strict Time Order</span>
          </div>

          <div className="space-y-2">
            {[
              { step: '1. Ingest Data', text: 'Historical NWP/AI Forecasts + IMD Observed Gauges' },
              { step: '2. Training Window', text: 'Historical calibration period (no future data leakage)' },
              { step: '3. Context Blending', text: 'Gradient-Boosted ML Meta-Model weight optimization' },
              { step: '4. Chronological Test', text: 'Held-out unseen test sequences across 6 pilot districts' },
              { step: '5. Verification', text: 'WMO standard skill metric evaluation (MAE, RMSE, CSI, ETS)' },
            ].map((item) => (
              <div key={item.step} className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-cyan-400 text-[11px]">{item.step}</span>
                <span className="text-slate-300 text-[11px]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Baseline Ladder */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Evaluation Baseline Ladder
            </h4>
            <span className="text-[10px] font-mono text-emerald-400">Benchmarking</span>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">Level 1: Individual Standalone Forecasts</span>
                <span className="text-[10px] font-mono text-slate-500">IFS / GFS / AIFS</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Raw model precipitation without post-processing or multi-model combination.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">Level 2: Fixed Equal-Weight Ensemble</span>
                <span className="text-[10px] font-mono text-slate-500">33.3% Constant</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Static arithmetic mean treating all models identically across all conditions and regions.
              </p>
            </div>

            <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-cyan-300">Level 3: GreenSky Adaptive Consensus</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">Context ML</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dynamic weighting conditioned on rainfall regime, topography, lead time, and learned model biases.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Validation Phase Status */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
          Project Validation Phases
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PHASES.map((phase) => (
            <div
              key={phase.title}
              className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                phase.done
                  ? 'bg-emerald-950/20 border-emerald-800/40'
                  : 'bg-cyan-950/20 border-cyan-800/40'
              }`}
            >
              <div className="mt-0.5">
                {phase.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-xs font-bold text-white">{phase.title}</h5>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    phase.done ? 'bg-emerald-900/60 text-emerald-300' : 'bg-cyan-900/60 text-cyan-300'
                  }`}>
                    {phase.status}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{phase.sources}</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{phase.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
