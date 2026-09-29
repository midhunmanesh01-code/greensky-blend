import React from 'react';
import { BarChart2, CheckCircle, Activity, ArrowDown, Shield, Target } from 'lucide-react';
import { EXPERIMENT_METRICS } from '../data/benchmarkData';

const METRICS = [
  { key: 'MAE', label: 'Mean Absolute Error', desc: 'Average magnitude of forecast errors (8.80 mm on test)', icon: BarChart2 },
  { key: 'RMSE', label: 'Root Mean Square Error', desc: 'Penalizes large errors (12.30 mm on test)', icon: Target },
  { key: 'CSI@15.6', label: 'Critical Success Index', desc: 'Hit rate for rainfall exceedance (0.286 on test)', icon: Shield },
  { key: 'Convention B', label: 'Time-Aligned', desc: '03:00 UTC accumulation matching IMD 08:30 IST', icon: Activity },
];

const PHASES = [
  { 
    title: 'Physical NWP Benchmark (ECMWF IFS + NOAA GFS)', 
    desc: 'Convention B (03:00 UTC) Aligned against IMD Gridded Gauges', 
    done: true, 
    statusText: 'Historical Benchmark (92 Days)',
    detail: 'Regime-conditioned adaptive blending evaluated across the 2025 Monsoon season with locked unseen testing.' 
  },
  { 
    title: 'Atmospheric ML & Spatial Pilot Scaling', 
    desc: 'ECMWF AIFS + Multi-Variable Atmospheric Machine Learning', 
    done: false, 
    statusText: 'Active Validation',
    detail: 'Integrating multi-variable atmospheric predictors (CAPE, shear) and scaling across the 6 Kerala pilot districts.' 
  },
];

export default function ValidationSection() {
  const exp1 = EXPERIMENT_METRICS.experiment1_regime;

  return (
    <section id="validation" className="section-spacing">
      <div className="section-container">
        <p className="section-label">Quantitative Forecast Validation</p>
        <h2 className="section-title">Model Evaluation & Benchmark Verification</h2>
        <p className="section-desc mb-12">
          GreenSky is evaluated against standalone numerical weather prediction models and a fixed equal-weight baseline using chronological unseen test periods.
        </p>

        {/* Evaluation Pipeline */}
        <div className="glass-panel mb-10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6">Chronological Evaluation Framework</h3>
          <div className="flex flex-col items-center gap-0 max-w-md mx-auto">
            {[
              'ECMWF IFS & NOAA GFS + IMD Ground Truth',
              'Convention B Alignment (03:00 UTC Window)',
              'Training Split (Jun 01 – Aug 03, n=64)',
              'Adaptive Regime ML Blending',
              'Locked Test Split (Aug 04 – Aug 31, n=28)',
              'WMO Standard Verification (MAE, RMSE, CSI)',
            ].map((step, i, arr) => (
              <div key={step} className="w-full flex flex-col items-center">
                <div className="w-full text-center py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium"
                  style={{
                    background: i === 3 ? 'rgba(245,158,11,0.1)' : 'rgba(15,31,56,0.6)',
                    border: `1px solid ${i === 3 ? 'rgba(245,158,11,0.3)' : 'rgba(56,189,248,0.08)'}`,
                    color: i === 3 ? '#f59e0b' : '#94a3b8',
                  }}>
                  {step}
                </div>
                {i < arr.length - 1 && <ArrowDown className="w-3.5 h-3.5 text-slate-600 my-0.5" />}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {METRICS.map(m => {
            const Icon = m.icon;
            return (
              <div key={m.key} className="glass-panel-sm">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-base sm:text-lg font-bold text-white">{m.key}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{m.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Baseline Ladder */}
        <div className="glass-panel mb-10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Evaluation Baseline Ladder</h3>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="text-center sm:text-left px-4 py-3 rounded-lg flex-1" style={{ background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)' }}>
              <p className="text-xs font-bold text-slate-400">Standalone NWP Models</p>
              <p className="text-[10px] text-slate-500 mt-0.5">ECMWF (9.03 mm) · GFS (10.80 mm)</p>
            </div>
            <span className="text-slate-600 text-lg">→</span>
            <div className="text-center sm:text-left px-4 py-3 rounded-lg flex-1" style={{ background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)' }}>
              <p className="text-xs font-bold text-slate-400">Equal-Weight Ensemble</p>
              <p className="text-[10px] text-slate-500 mt-0.5">MAE: 9.02 mm · RMSE: 13.62 mm</p>
            </div>
            <span className="text-slate-600 text-lg">→</span>
            <div className="text-center sm:text-left px-4 py-3 rounded-lg flex-1" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <p className="text-xs font-bold text-amber-400">GreenSky Adaptive Blend</p>
              <p className="text-[10px] text-amber-300 font-mono mt-0.5">MAE: 8.80 mm · RMSE: 12.30 mm</p>
            </div>
          </div>
        </div>

        {/* Validation Phases */}
        <div className="space-y-3">
          {PHASES.map(phase => (
            <div key={phase.title} className="glass-panel flex items-start gap-3"
              style={{ border: `1px solid ${phase.done ? 'rgba(52,211,153,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
              <div className="mt-0.5">
                {phase.done
                  ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                  : <Activity className="w-5 h-5 text-amber-400 animate-pulse" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-sm font-bold text-white">{phase.title}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{phase.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: phase.done ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)',
                      color: phase.done ? '#34d399' : '#f59e0b',
                      border: `1px solid ${phase.done ? 'rgba(52,211,153,0.25)' : 'rgba(245,158,11,0.25)'}`,
                    }}>
                    {phase.statusText}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{phase.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-6">
          GreenSky Blend is a decision-support system and does not replace official bulletins from the India Meteorological Department (IMD) or State Disaster Management Authorities.
        </p>
      </div>
    </section>
  );
}
