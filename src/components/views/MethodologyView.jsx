import React from 'react';
import { Database, Layers, Clock, Cpu, BarChart2, Map, ArrowDown } from 'lucide-react';

const STEPS = [
  { num: 1, title: 'Forecast Collection', desc: 'Acquisition of ECMWF IFS (9km), NCEP GFS (13km), and ECMWF AIFS (0.25°) numerical model outputs.', icon: Database, color: '#38bdf8' },
  { num: 2, title: 'Data Alignment & QC', desc: 'Spatial bilinear regridding to 0.25° common resolution, temporal validity alignment, and outlier removal.', icon: Layers, color: '#94a3b8' },
  { num: 3, title: 'Context & Feature Engineering', desc: 'Extraction of spatial orographic terrain indices, rainfall regime classification, lead time, and inter-model spread.', icon: Clock, color: '#a78bfa' },
  { num: 4, title: 'Adaptive ML Meta-Learner', desc: 'Gradient-boosted decision tree ensemble (XGBoost/LightGBM) generating context-aware convex weights.', icon: Cpu, color: '#f59e0b', highlight: true },
  { num: 5, title: 'Chronological Test Verification', desc: 'Unseen evaluation with strictly chronological held-out sequences preventing lookahead leakage.', icon: BarChart2, color: '#fbbf24' },
  { num: 6, title: 'Visualization & Telemetry', desc: 'Spatial map generation, interactive 6-district inspection, and operational alert delivery.', icon: Map, color: '#34d399' },
];

const DATA_STAGES = [
  'Raw Forecast Models (IFS, GFS, AIFS)',
  'Temporal Alignment (24h Lead Valid Sync)',
  'Spatial Interpolation (0.25° Grid Regrid)',
  'Quality Control & Range Masking',
  'Feature Matrix Construction',
  'Gradient-Boosted Blending Model'
];

export default function MethodologyView() {
  return (
    <div className="space-y-4">
      
      {/* 1. Six-Step Research Methodology Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-800">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            6-Stage Research Methodology & Machine Learning Workflow
          </h4>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">SIH26081 Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`p-3.5 rounded-lg border flex flex-col justify-between ${
                  step.highlight
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-md'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        step.highlight ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {step.num}
                      </span>
                      <h5 className="text-xs font-bold text-white">{step.title}</h5>
                    </div>
                    <Icon className="w-3.5 h-3.5" style={{ color: step.color }} />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                </div>

                {step.highlight && (
                  <div className="mt-3 pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-300 flex items-center justify-between">
                    <span>Core ML Layer</span>
                    <span>Convex Weight ∑ w_i = 1</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Data Alignment Pipeline & Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Data Alignment Pipeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Data Preprocessing & Grid Alignment
            </h4>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Provenance</span>
          </div>

          <div className="space-y-1.5">
            {DATA_STAGES.map((stage, i) => (
              <React.Fragment key={stage}>
                <div className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                  i === DATA_STAGES.length - 1
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <span className="font-mono text-[11px] text-slate-500 w-5">{i + 1}.</span>
                  <span className="flex-1">{stage}</span>
                </div>
                {i < DATA_STAGES.length - 1 && (
                  <div className="flex justify-center my-0.5 text-slate-600">
                    <ArrowDown className="w-3 h-3" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Tech Stack & Implementation Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Technology Stack & Frameworks
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">Production Ready</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                  Machine Learning & Core Analytics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Python 3.11', 'XGBoost', 'LightGBM', 'Scikit-Learn', 'NumPy', 'Pandas', 'Xarray', 'NetCDF4'].map((tech) => (
                    <span key={tech} className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                  Interactive GIS & Operational Frontend
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['React 19', 'Vite 8', 'Tailwind CSS v4', 'Leaflet', 'React-Leaflet', 'Recharts', 'Lucide Icons'].map((tech) => (
                    <span key={tech} className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-amber-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-normal">
            Modular architecture: ML inference pipeline can operate headless for automated scheduled runs or serve realtime telemetry to the dashboard.
          </div>
        </div>

      </div>

    </div>
  );
}
