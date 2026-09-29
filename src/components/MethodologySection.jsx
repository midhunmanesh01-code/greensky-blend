import React from 'react';
import { ArrowDown, Database, Layers, Cpu, BarChart2, Map, Clock } from 'lucide-react';

const STEPS = [
  { num: 1, label: 'Forecast Collection', desc: 'Multi-source NWP and AI weather model outputs acquired for Kerala pilot region', icon: Database, color: '#38bdf8' },
  { num: 2, label: 'Data Alignment', desc: 'Temporal synchronization, spatial regridding to common grid, quality control filtering', icon: Layers, color: '#94a3b8' },
  { num: 3, label: 'Feature / Context Preparation', desc: 'Weather regime detection, location encoding, lead time features, source disagreement metrics', icon: Clock, color: '#a78bfa' },
  { num: 4, label: 'Adaptive ML Blending', desc: 'Gradient-boosted meta-learner (XGBoost/LightGBM) trained to generate context-dependent source weights', icon: Cpu, color: '#22d3ee', highlight: true },
  { num: 5, label: 'Chronological Evaluation', desc: 'Strictly time-ordered test periods ensuring no future data leakage in validation', icon: BarChart2, color: '#fbbf24' },
  { num: 6, label: 'Forecast Visualization', desc: 'Interactive exploration of blended forecasts, model contributions, and spatial weight distributions', icon: Map, color: '#34d399' },
];

const PIPELINE = ['Forecast Sources', 'Temporal Alignment', 'Spatial Alignment', 'Quality Control', 'Training Dataset', 'Adaptive ML Model'];

export default function MethodologySection() {
  return (
    <section id="methodology" className="section-spacing">
      <div className="section-container">
        <p className="section-label">Methodology</p>
        <h2 className="section-title">Research Methodology</h2>
        <p className="section-desc mb-12">
          GreenSky follows a structured pipeline from multi-source forecast collection through adaptive ML blending to chronological evaluation.
        </p>

        {/* Methodology Timeline */}
        <div className="max-w-2xl mx-auto mb-16">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: step.highlight ? 'rgba(34,211,238,0.15)' : 'rgba(148,163,184,0.08)',
                      border: `1px solid ${step.highlight ? 'rgba(34,211,238,0.3)' : 'rgba(148,163,184,0.15)'}`,
                      color: step.color,
                      boxShadow: step.highlight ? '0 0 15px rgba(34,211,238,0.1)' : 'none',
                    }}>
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-px flex-1 min-h-[32px]" style={{ background: 'rgba(56,189,248,0.1)' }} />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-6 flex-1 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                  <div className="glass-panel-sm" style={{
                    border: step.highlight ? '1px solid rgba(34,211,238,0.2)' : '1px solid rgba(56,189,248,0.08)',
                    boxShadow: step.highlight ? '0 0 20px rgba(34,211,238,0.05)' : 'none',
                  }}>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg" style={{ background: `${step.color}15` }}>
                        <Icon className="w-4 h-4" style={{ color: step.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{step.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                        {step.highlight && (
                          <span className="inline-flex mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded"
                            style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
                            Core Component
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Alignment Pipeline */}
        <div className="glass-panel mb-10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6">Data & Alignment Pipeline</h3>
          <div className="flex flex-col items-center gap-0 max-w-sm mx-auto">
            {PIPELINE.map((step, i) => (
              <div key={step} className="w-full flex flex-col items-center">
                <div className="w-full text-center py-2.5 px-4 rounded-lg text-xs font-medium"
                  style={{
                    background: i === PIPELINE.length - 1 ? 'rgba(34,211,238,0.06)' : 'rgba(15,31,56,0.6)',
                    border: `1px solid ${i === PIPELINE.length - 1 ? 'rgba(34,211,238,0.2)' : 'rgba(56,189,248,0.08)'}`,
                    color: i === PIPELINE.length - 1 ? '#22d3ee' : '#94a3b8',
                  }}>
                  {step}
                </div>
                {i < PIPELINE.length - 1 && <ArrowDown className="w-3.5 h-3.5 text-slate-600 my-0.5" />}
              </div>
            ))}
          </div>
        </div>

        {/* Baseline Ladder */}
        <div className="glass-panel">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Baseline Comparison Ladder</h3>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {[
              { label: 'Individual Forecasts', sub: 'IFS / GFS / AIFS', active: false },
              { label: 'Equal-Weight Ensemble', sub: '33% per source', active: false },
              { label: 'Adaptive Blend', sub: 'Context-aware ML', active: true },
            ].map((item, i, arr) => (
              <React.Fragment key={item.label}>
                <div className="flex-1 text-center px-4 py-3 rounded-lg w-full sm:w-auto"
                  style={{
                    background: item.active ? 'rgba(34,211,238,0.06)' : 'rgba(148,163,184,0.04)',
                    border: `1px solid ${item.active ? 'rgba(34,211,238,0.2)' : 'rgba(148,163,184,0.08)'}`,
                  }}>
                  <p className={`text-xs font-bold ${item.active ? 'text-cyan-400' : 'text-slate-400'}`}>{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                </div>
                {i < arr.length - 1 && <span className="text-slate-600 hidden sm:block">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
