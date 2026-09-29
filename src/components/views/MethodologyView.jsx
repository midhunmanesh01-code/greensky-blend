import React from 'react';
import { Database, Layers, Clock, Cpu, BarChart2, Map, ArrowDown, ShieldCheck, CheckCircle2 } from 'lucide-react';

const METHODOLOGY_PIPELINE = [
  {
    step: 1,
    title: 'Forecast Source Acquisition',
    desc: 'Automated retrieval of ECMWF IFS025 (9km native) and NOAA NCEP GFS Seamless (13km native) numerical forecast grids from previous operational runs.',
    icon: Database,
    color: '#38bdf8',
  },
  {
    step: 2,
    title: 'Temporal Accumulation Alignment (Convention B)',
    desc: 'Aligning model hourly accumulations to the official IMD window ((D-1) 03:00 UTC → D 03:00 UTC / 08:30 IST), eliminating the 5.5-hour phase discrepancy present in UTC calendar-day models.',
    icon: Clock,
    color: '#f59e0b',
    highlight: true,
  },
  {
    step: 3,
    title: 'Spatial Grid Alignment & Regridding',
    desc: 'Spatial interpolation of NWP forecast outputs to the standard 0.25° × 0.25° IMD gridded observation resolution covering Kerala meteorological grid cells.',
    icon: Layers,
    color: '#34d399',
  },
  {
    step: 4,
    title: 'Quality Control & Triplet-Repeat Resolution',
    desc: 'Detection and correction of 3-hourly native bucket repetitions in hourly feeds, ensuring physically accurate millimeter rainfall accumulations.',
    icon: ShieldCheck,
    color: '#a78bfa',
  },
  {
    step: 5,
    title: 'Training Split (Zero Lookahead)',
    desc: 'Strict chronological partitioning: June 01 to August 03, 2025 (64 days) used for learning regime weights. No test period observations are ever exposed during training.',
    icon: Database,
    color: '#38bdf8',
  },
  {
    step: 6,
    title: 'Adaptive Regime ML Blending',
    desc: 'Forecast space partitioned into 4 regimes (Dry <5mm, Light 5-15mm, Moderate 15-35mm, Heavy ≥35mm) from NWP mean forecast. Optimal convex weights learned per regime.',
    icon: Cpu,
    color: '#f59e0b',
    highlight: true,
  },
  {
    step: 7,
    title: 'Chronological Unseen Testing',
    desc: 'Model evaluation on the locked 28-day held-out test split (August 04 to August 31, 2025) and independent sub-period robustness split (July 01 to August 03).',
    icon: BarChart2,
    color: '#fbbf24',
  },
  {
    step: 8,
    title: 'WMO Standard Skill Evaluation',
    desc: 'Quantitative scoring using Mean Absolute Error (MAE), Root Mean Square Error (RMSE), and Critical Success Index (CSI@15.6mm & CSI@64.5mm) against ground-truth IMD gauges.',
    icon: CheckCircle2,
    color: '#34d399',
  },
];

const DATA_STAGES = [
  '1. Raw Numerical Weather Predictions (ECMWF IFS025 & NCEP GFS)',
  '2. Temporal Alignment: (D-1) 03:00 UTC → D 03:00 UTC (Convention B)',
  '3. Spatial Grid Regridding to IMD 0.25° Resolution',
  '4. Triplet Bucket Quality Control & Unit Harmonization',
  '5. Forecast Regime Classification (Dry, Light, Moderate, Heavy)',
  '6. Adaptive Convex Weight Optimization (∑ w_i = 1)',
  '7. Consensus Telemetry Dispatched to Decision Dashboards',
];

export default function MethodologyView() {
  return (
    <div className="space-y-4">
      
      {/* 1. Methodology Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2.5 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              Scientific Methodology & Verification Framework
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              End-to-end meteorological pipeline for multi-model numerical weather prediction synthesis
            </p>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800/50 self-start sm:self-auto">
            SIH26081 Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {METHODOLOGY_PIPELINE.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
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
                        {step.step}
                      </span>
                      <h5 className="text-xs font-bold text-white">{step.title}</h5>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{step.desc}</p>
                </div>

                {step.highlight && (
                  <div className="mt-3 pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-300 flex items-center justify-between">
                    <span>Core ML Pipeline</span>
                    <span>Convention B</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Data Alignment Pipeline & Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Data Alignment Flow */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Data Pipeline & Accumulation Window Alignment
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">Convention B</span>
          </div>

          <div className="space-y-1.5">
            {DATA_STAGES.map((stage, i) => (
              <React.Fragment key={stage}>
                <div className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                  i === DATA_STAGES.length - 1
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 font-bold'
                    : i === 1
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <span className="font-mono text-[11px] text-slate-400">{stage}</span>
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
                Scientific Software Stack
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">Reproducible</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                  Benchmark Analysis & Machine Learning
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Python 3.11', 'Scikit-Learn', 'GradientBoostingRegressor', 'RandomForestRegressor', 'NumPy', 'Pandas', 'Pathlib', 'Requests'].map((tech) => (
                    <span key={tech} className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                  Meteorological Datasets & Standard APIs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['IMD 0.25° Gridded Gauge (Pai et al.)', 'Open-Meteo Previous Runs API', 'ECMWF IFS025 (9km)', 'NOAA NCEP GFS Seamless (13km)'].map((tech) => (
                    <span key={tech} className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-amber-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                  Interactive GIS & Visualization Layer
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['React 19', 'Vite', 'Tailwind CSS v4', 'Leaflet', 'React-Leaflet', 'Recharts', 'Lucide Icons'].map((tech) => (
                    <span key={tech} className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-normal">
            Modular architecture: Benchmark scripts in <code className="text-amber-300 font-mono">greensky-benchmark</code> operate stand-alone, outputting validated CSV artifacts consumed by this frontend interface.
          </div>
        </div>

      </div>

    </div>
  );
}
