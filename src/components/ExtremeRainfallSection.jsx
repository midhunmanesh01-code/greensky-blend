import React from 'react';
import { AlertTriangle, Shield, BarChart2 } from 'lucide-react';

const THRESHOLD_METRICS = [
  { key: 'CSI', label: 'Critical Success Index', desc: 'Fraction of correctly forecast heavy rain events relative to total events' },
  { key: 'ETS', label: 'Equitable Threat Score', desc: 'Skill score adjusted for hits expected by random chance' },
  { key: 'POD', label: 'Probability of Detection', desc: 'Fraction of observed heavy rain events that were correctly forecast' },
  { key: 'FAR', label: 'False Alarm Ratio', desc: 'Fraction of forecast heavy rain events that did not occur' },
];

export default function ExtremeRainfallSection() {
  return (
    <div className="section-container mt-16">
      <div className="glass-panel glow-cyan">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-400">Extreme Rainfall</p>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Extreme Rainfall Performance</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-2xl">
          Forecast accuracy on average conditions does not capture performance during critical heavy rainfall events.
          GreenSky evaluates threshold-based skill scores to ensure the blend maintains alerting capability during high-impact weather.
        </p>

        {/* Threshold Concept */}
        <div className="mb-8 p-5 rounded-xl" style={{ background: 'rgba(251,113,133,0.04)', border: '1px solid rgba(251,113,133,0.12)' }}>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-rose-400" />
            <div>
              <p className="text-sm font-bold text-white">Heavy Rain Threshold</p>
              <p className="text-xs text-slate-500">≥ 64.5 mm / 24 hours (IMD Very Heavy Rain category)</p>
            </div>
          </div>

          {/* Contingency Table */}
          <div className="grid grid-cols-2 gap-2 max-w-sm">
            <div className="text-center py-3 rounded-lg" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <p className="text-xs font-bold text-emerald-400">Hits</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Forecast ✓ Observed ✓</p>
            </div>
            <div className="text-center py-3 rounded-lg" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <p className="text-xs font-bold text-amber-400">False Alarms</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Forecast ✓ Observed ✗</p>
            </div>
            <div className="text-center py-3 rounded-lg" style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.15)' }}>
              <p className="text-xs font-bold text-rose-400">Misses</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Forecast ✗ Observed ✓</p>
            </div>
            <div className="text-center py-3 rounded-lg" style={{ background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.1)' }}>
              <p className="text-xs font-bold text-slate-400">Correct Negatives</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Forecast ✗ Observed ✗</p>
            </div>
          </div>
        </div>

        {/* Threshold Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {THRESHOLD_METRICS.map(m => (
            <div key={m.key} className="glass-panel-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-sm font-bold text-white">{m.key}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">{m.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Threshold-based evaluation ensures GreenSky does not evaluate rainfall only using average error.
          Heavy rainfall events are disproportionately important for disaster preparedness.
        </p>
      </div>
    </div>
  );
}
