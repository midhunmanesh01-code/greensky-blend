import React from 'react';
import { BarChart2, CheckCircle, Activity, ArrowDown, Shield, Target } from 'lucide-react';

const METRICS = [
  { key: 'MAE', label: 'Mean Absolute Error', desc: 'Average magnitude of forecast errors (mm)', icon: BarChart2 },
  { key: 'RMSE', label: 'Root Mean Square Error', desc: 'Penalizes large errors more heavily', icon: Target },
  { key: 'CSI', label: 'Critical Success Index', desc: 'Hit rate for rainfall threshold exceedance', icon: Shield },
  { key: 'ETS', label: 'Equitable Threat Score', desc: 'Skill score adjusted for random hits', icon: Activity },
];

const PHASES = [
  { title: 'Initial Two-Source Feasibility', desc: 'ECMWF IFS + NCEP GFS', done: true, detail: 'Blending of two NWP sources evaluated on historical Kerala monsoon periods.' },
  { title: 'Three-Source Hybrid Integration', desc: 'ECMWF IFS + NCEP GFS + ECMWF AIFS', done: false, detail: 'Integration of ECMWF AIFS as a third source with full chronological validation.' },
];

export default function ValidationSection() {
  return (
    <section id="validation" className="section-spacing">
      <div className="section-container">
        <p className="section-label">Forecast Validation</p>
        <h2 className="section-title">Forecast Validation</h2>
        <p className="section-desc mb-12">
          GreenSky is evaluated against individual forecast sources and a fixed equal-weight baseline using chronological unseen periods.
        </p>

        {/* Evaluation Pipeline */}
        <div className="glass-panel mb-10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6">Evaluation Framework</h3>
          <div className="flex flex-col items-center gap-0 max-w-md mx-auto">
            {[
              'Historical Forecasts + IMD Observations',
              'Training Period',
              'Adaptive ML Model',
              'Chronological Test Data',
              'Evaluation',
            ].map((step, i, arr) => (
              <div key={step} className="w-full flex flex-col items-center">
                <div className="w-full text-center py-3 px-4 rounded-lg text-sm font-medium"
                  style={{
                    background: i === 2 ? 'rgba(34,211,238,0.08)' : 'rgba(15,31,56,0.6)',
                    border: `1px solid ${i === 2 ? 'rgba(34,211,238,0.2)' : 'rgba(56,189,248,0.08)'}`,
                    color: i === 2 ? '#22d3ee' : '#94a3b8',
                  }}>
                  {step}
                </div>
                {i < arr.length - 1 && <ArrowDown className="w-4 h-4 text-slate-600 my-1" />}
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
                  <span className="text-lg font-bold text-white">{m.key}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{m.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Baseline Ladder */}
        <div className="glass-panel mb-10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Evaluation Baseline Ladder</h3>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="text-center sm:text-left px-4 py-3 rounded-lg flex-1" style={{ background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)' }}>
              <p className="text-xs font-bold text-slate-400">Individual Forecasts</p>
              <p className="text-[10px] text-slate-500 mt-0.5">IFS / GFS / AIFS</p>
            </div>
            <span className="text-slate-600 text-lg">→</span>
            <div className="text-center sm:text-left px-4 py-3 rounded-lg flex-1" style={{ background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)' }}>
              <p className="text-xs font-bold text-slate-400">Equal-Weight Ensemble</p>
              <p className="text-[10px] text-slate-500 mt-0.5">33% each source</p>
            </div>
            <span className="text-slate-600 text-lg">→</span>
            <div className="text-center sm:text-left px-4 py-3 rounded-lg flex-1" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)' }}>
              <p className="text-xs font-bold text-cyan-400">Adaptive Blend</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Context-aware weights</p>
            </div>
          </div>
        </div>

        {/* Validation Phases */}
        <div className="space-y-3">
          {PHASES.map(phase => (
            <div key={phase.title} className="glass-panel flex items-start gap-3"
              style={{ border: `1px solid ${phase.done ? 'rgba(52,211,153,0.15)' : 'rgba(34,211,238,0.15)'}` }}>
              <div className="mt-0.5">
                {phase.done
                  ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                  : <Activity className="w-5 h-5 text-cyan-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-sm font-bold text-white">{phase.title}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{phase.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{
                      background: phase.done ? 'rgba(52,211,153,0.1)' : 'rgba(34,211,238,0.1)',
                      color: phase.done ? '#34d399' : '#22d3ee',
                      border: `1px solid ${phase.done ? 'rgba(52,211,153,0.2)' : 'rgba(34,211,238,0.2)'}`,
                    }}>
                    {phase.done ? 'Feasibility demonstrated' : 'Integration active'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">{phase.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-600 mt-6">
          GreenSky Blend is a decision-support layer and does not replace IMD, NCMRWF or official forecasts and warnings.
        </p>
      </div>
    </section>
  );
}
