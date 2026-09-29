import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const THRESHOLD_METRICS = [
  { key: 'CSI', label: 'Critical Success Index', formula: 'Hits / (Hits + Misses + False Alarms)', desc: 'Measures fraction of observed and forecast extreme events correctly predicted.' },
  { key: 'ETS', label: 'Equitable Threat Score', formula: '(Hits - Hits_ref) / (Hits + Misses + FA - Hits_ref)', desc: 'Penalizes random chance associations in severe weather detection.' },
  { key: 'POD', label: 'Probability of Detection', formula: 'Hits / (Hits + Misses)', desc: 'Hit rate quantifying how many observed extreme rain events were forecast.' },
  { key: 'FAR', label: 'False Alarm Ratio', formula: 'False Alarms / (Hits + False Alarms)', desc: 'Fraction of severe rainfall alerts where extreme event did not materialize.' },
];

export default function ExtremeRainView() {
  return (
    <div className="space-y-4">
      
      {/* Overview Banner */}
      <div className="bg-[#0b1528] border border-rose-500/30 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            High-Impact Weather & Extreme Rainfall Evaluation
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Standard root-mean-square error masks performance during critical localized cloudbursts and high-intensity monsoon surges. GreenSky utilizes dedicated threshold-based verification (≥ 64.5 mm/24h) to guarantee actionable disaster alert fidelity.
          </p>
        </div>
      </div>

      {/* 2-Column: Contingency Matrix (Left) + Metric Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 2x2 Contingency Matrix */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Categorical 2×2 Contingency Matrix
            </h4>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/50">
              Threshold: ≥ 64.5 mm
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-auto">
            
            {/* Hit */}
            <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-400">Hits (A)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-300">
                Forecast: <strong className="text-emerald-300">≥ 64.5 mm</strong><br />
                Observed: <strong className="text-emerald-300">≥ 64.5 mm</strong>
              </p>
              <span className="text-[10px] font-mono text-emerald-400/80 mt-2">Correct Severe Warning</span>
            </div>

            {/* False Alarm */}
            <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-400">False Alarms (B)</span>
                <XCircle className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-300">
                Forecast: <strong className="text-amber-300">≥ 64.5 mm</strong><br />
                Observed: <strong className="text-slate-400">{'< 64.5'} mm</strong>
              </p>
              <span className="text-[10px] font-mono text-amber-400/80 mt-2">False Alert Dispatched</span>
            </div>

            {/* Miss */}
            <div className="bg-rose-950/30 border border-rose-800/50 rounded-lg p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-rose-400">Misses (C)</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-[11px] text-slate-300">
                Forecast: <strong className="text-slate-400">{'< 64.5'} mm</strong><br />
                Observed: <strong className="text-rose-300">≥ 64.5 mm</strong>
              </p>
              <span className="text-[10px] font-mono text-rose-400/80 mt-2">Unpredicted Heavy Rain</span>
            </div>

            {/* Correct Negative */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-400">Correct Rejections (D)</span>
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-400">
                Forecast: <strong className="text-slate-400">{'< 64.5'} mm</strong><br />
                Observed: <strong className="text-slate-400">{'< 64.5'} mm</strong>
              </p>
              <span className="text-[10px] font-mono text-slate-500 mt-2">Correct Non-Event</span>
            </div>

          </div>
        </div>

        {/* Skill Score Metric Cards */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Categorical Verification Metrics
            </h4>
            <span className="text-[10px] font-mono text-slate-400">WMO Standard</span>
          </div>

          <div className="space-y-2.5">
            {THRESHOLD_METRICS.map((item) => (
              <div key={item.key} className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="font-bold text-white">{item.key} · {item.label}</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded">{item.formula}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
