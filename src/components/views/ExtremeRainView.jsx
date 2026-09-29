import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, ShieldAlert, Target, Activity, FileText } from 'lucide-react';
import { CONTINGENCY_15_6, EXTREME_RAIN_DAYS, HEAVY_RAIN_DAYS } from '../../data/benchmarkData';

const THRESHOLD_METRICS = [
  { key: 'CSI', label: 'Critical Success Index', formula: 'Hits / (Hits + Misses + False Alarms)', desc: 'Measures fraction of observed and forecast heavy events correctly predicted (Threat Score).' },
  { key: 'POD', label: 'Probability of Detection', formula: 'Hits / (Hits + Misses)', desc: 'Hit rate quantifying the fraction of observed heavy rainfall events successfully forecast.' },
  { key: 'FAR', label: 'False Alarm Ratio', formula: 'False Alarms / (Hits + False Alarms)', desc: 'Fraction of severe rainfall warnings where the heavy rain event did not materialize.' },
  { key: 'ETS', label: 'Equitable Threat Score', formula: '(Hits - Hits_ref) / (Hits + Misses + FA - Hits_ref)', desc: 'Skill score adjusted for random chance associations in severe convective events.' },
];

export default function ExtremeRainView() {
  const [selectedModelKey, setSelectedModelKey] = useState('adaptive');
  const activeContingency = CONTINGENCY_15_6.models[selectedModelKey] || CONTINGENCY_15_6.models.adaptive;

  return (
    <div className="space-y-4">
      
      {/* 1. Overview Banner */}
      <div className="bg-slate-900 border border-rose-800/40 rounded-xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 mt-0.5 shrink-0">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            High-Impact Weather & Extreme Rainfall Evaluation
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Standard root-mean-square error can mask performance during critical localized cloudbursts and high-intensity monsoon surges. GreenSky benchmark evaluation specifically tracks threshold-based verification (≥ 15.6 mm/day and ≥ 64.5 mm/day) against IMD ground truth.
          </p>
        </div>
      </div>

      {/* 2. Categorical Contingency Matrix & Model Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              Categorical 2×2 Contingency Matrix (Locked Test Set: Aug 04–31, 2025)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Threshold: ≥ 15.6 mm/day (Moderate/Heavy) • 9 Observed Heavy Events out of 28 Days
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'adaptive', label: 'GreenSky Adaptive' },
              { id: 'equal', label: 'Equal Blend (50/50)' },
              { id: 'ecmwf', label: 'ECMWF IFS' },
              { id: 'gfs', label: 'NCEP GFS' },
              { id: 'rf_atmos', label: 'Random Forest + Atmos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedModelKey(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  selectedModelKey === tab.id
                    ? 'bg-amber-600 text-slate-950 border-amber-500 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* 2x2 Matrix Cards with Real Counts */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Hits */}
            <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-400">Hits (A)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-300 my-1">
                {activeContingency.hits} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Forecast: <strong className="text-emerald-300">≥ 15.6 mm</strong><br />
                Observed: <strong className="text-emerald-300">≥ 15.6 mm</strong>
              </p>
              <span className="text-[10px] font-mono text-emerald-400/80 mt-1.5">Correct Heavy Warning</span>
            </div>

            {/* False Alarms */}
            <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-400">False Alarms (B)</span>
                <XCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-amber-300 my-1">
                {activeContingency.falseAlarms} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Forecast: <strong className="text-amber-300">≥ 15.6 mm</strong><br />
                Observed: <strong className="text-slate-400">&lt; 15.6 mm</strong>
              </p>
              <span className="text-[10px] font-mono text-amber-400/80 mt-1.5">False Alert Dispatched</span>
            </div>

            {/* Misses */}
            <div className="bg-rose-950/30 border border-rose-800/50 rounded-lg p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-rose-400">Misses (C)</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-rose-300 my-1">
                {activeContingency.misses} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Forecast: <strong className="text-slate-400">&lt; 15.6 mm</strong><br />
                Observed: <strong className="text-rose-300">≥ 15.6 mm</strong>
              </p>
              <span className="text-[10px] font-mono text-rose-400/80 mt-1.5">Unpredicted Heavy Rain</span>
            </div>

            {/* Correct Rejections */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-400">Correct Rejections (D)</span>
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-slate-300 my-1">
                {activeContingency.correctRejections} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Forecast: <strong className="text-slate-400">&lt; 15.6 mm</strong><br />
                Observed: <strong className="text-slate-400">&lt; 15.6 mm</strong>
              </p>
              <span className="text-[10px] font-mono text-slate-500 mt-1.5">Correct Non-Event</span>
            </div>

          </div>

          {/* Model Skill Scores Breakdown */}
          <div className="flex flex-col justify-between bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase">{activeContingency.name}</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">
                  CSI: {activeContingency.csi.toFixed(3)}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-400">Probability of Detection (POD):</span>
                  <span className="font-bold text-emerald-400">{(activeContingency.pod * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-400">False Alarm Ratio (FAR):</span>
                  <span className="font-bold text-amber-400">{(activeContingency.far * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded border border-slate-850">
                  <span className="text-slate-400">Critical Success Index (CSI):</span>
                  <span className="font-bold text-sky-400">{activeContingency.csi.toFixed(3)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-normal">
              {selectedModelKey === 'adaptive' && (
                <span>Adaptive Blend achieves 4 Hits out of 9 events (CSI 0.286), matching ECMWF and outperforming Equal Blend (1 Hit, CSI 0.083).</span>
              )}
              {selectedModelKey === 'equal' && (
                <span>Equal Blend dilutes high-precipitation signals, producing 8 Misses out of 9 observed heavy events (CSI 0.083).</span>
              )}
              {selectedModelKey === 'rf_atmos' && (
                <span>Exp 4 Atmospheric ML achieves 8 Hits out of 9 events (CSI 0.471) by integrating CAPE and wind shear predictors.</span>
              )}
              {(selectedModelKey === 'ecmwf' || selectedModelKey === 'gfs') && (
                <span>Standalone NWP model evaluation on the locked 28-day unseen test split.</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Scientific Failure Mode Analysis (Experiment 3 & 4 Findings) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Type A vs Type B Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Extreme Rainfall Failure Modes (Exp 3 Findings)
          </h4>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <span className="font-bold text-emerald-400 font-mono text-xs block mb-1">
                Type A: Proportional Underforecasting Bias (Correctable)
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                NWP models detect the storm regime (Moderate 15–35 mm) but systematically underestimate absolute magnitude. Multiplicative calibration (1.33x in Moderate bin) successfully improves CSI@15.6 from 0.286 to 0.312 (e.g. Aug 15: 21.5 mm → 28.6 mm).
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <span className="font-bold text-rose-400 font-mono text-xs block mb-1">
                Type B: Regime Misclassification (Structural NWP Miss)
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Heavy rainfall occurs on days where both NWP models predict Dry/Light conditions (e.g. Aug 19: obs=20.8 mm, adapt=3.1 mm in Dry bin). Multiplicative scaling cannot fix these; multi-variable atmospheric predictors (Exp 4) are necessary.
              </p>
            </div>
          </div>
        </div>

        {/* Observed Extreme Rain Days in the 92-Day Season */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            Top Monsoon Rain Events (Observed ≥ 50 mm/day)
          </h4>

          <div className="space-y-2 overflow-y-auto max-h-[200px]">
            {[
              { date: '2025-06-26', imd: 95.58, ecmwf: 13.2, gfs: 21.0, blend: 16.7, label: 'Season Peak Cloudburst' },
              { date: '2025-06-16', imd: 69.50, ecmwf: 71.3, gfs: 39.1, blend: 53.6, label: 'Mid-June Torrential Event' },
              { date: '2025-07-25', imd: 69.34, ecmwf: 17.0, gfs: 5.4, blend: 17.0, label: 'July Peak Monsoon Event' },
              { date: '2025-06-15', imd: 58.63, ecmwf: 93.8, gfs: 30.9, blend: 62.4, label: 'June Onset Surge Day 2' },
              { date: '2025-06-17', imd: 53.94, ecmwf: 64.5, gfs: 29.8, blend: 47.2, label: 'June Surge Day 4' },
              { date: '2025-07-26', imd: 53.63, ecmwf: 19.3, gfs: 14.3, blend: 16.8, label: 'July Continuous Monsoon' },
              { date: '2025-07-17', imd: 52.24, ecmwf: 31.3, gfs: 24.5, blend: 28.6, label: 'July Heavy Spell' },
              { date: '2025-08-15', imd: 51.43, ecmwf: 21.5, gfs: 1.4, blend: 13.5, label: 'August Peak Spell Day 1' },
              { date: '2025-08-16', imd: 50.10, ecmwf: 17.0, gfs: 4.1, blend: 11.8, label: 'August Peak Spell Day 2' },
            ].map((ev) => (
              <div key={ev.date} className="p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-white font-bold">{ev.date}</span>
                  <span className="text-[10px] text-slate-500 block">{ev.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-purple-300 font-bold">{ev.imd.toFixed(1)} mm</span>
                  <span className="text-[10px] text-amber-400 block">Blend: {ev.blend.toFixed(1)} mm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
