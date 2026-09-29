import React, { useState } from 'react';
import { Play, RotateCcw, Activity, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { HISTORICAL_REPLAY_SEQUENCES, BENCHMARK_METADATA } from '../../data/benchmarkData';
import { formatDateLabel } from '../../utils/calculations';

const REPLAY_STEPS = [
  { id: 1, label: 'Ingesting NWP grids', desc: 'Loading ECMWF IFS025 (9km) and NOAA NCEP GFS (13km) daily forecasts...' },
  { id: 2, label: 'Temporal alignment (03:00 UTC)', desc: 'Synchronizing 24-hour accumulation window to match IMD 08:30 IST gauge read (Convention B)...' },
  { id: 3, label: 'Regime classification', desc: 'Classifying daily mean forecast into Dry, Light, Moderate, or Heavy regime bins...' },
  { id: 4, label: 'Applying learned weights', desc: 'Applying training-optimized convex weights w_ECMWF and (1 - w_ECMWF)...' },
  { id: 5, label: 'Generating adaptive consensus', desc: 'Synthesizing GreenSky consensus rainfall forecast in mm/24h...' },
  { id: 6, label: 'Ground-truth verification', desc: 'Comparing adaptive forecast against ground-truth IMD gauge observations...' },
  { id: 7, label: 'Publishing decision telemetry', desc: 'Consensus rainfall telemetry dispatched to district disaster management dashboards.' },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs shadow-xl font-mono">
        <p className="font-bold text-slate-200 mb-1.5">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 my-0.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-bold text-white">{p.value} mm</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function ReplayView({ district }) {
  const [selectedSequenceKey, setSelectedSequenceKey] = useState('locked_test');
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const activeSequence = HISTORICAL_REPLAY_SEQUENCES[selectedSequenceKey] || HISTORICAL_REPLAY_SEQUENCES.locked_test;

  const chartData = activeSequence.days.map((d) => ({
    date: d.date.substring(5), // "08-04" format
    fullDate: d.date,
    ecmwf: d.ecmwf,
    gfs: d.gfs,
    equal: d.equal_blend,
    blend: d.adaptive_blend,
    imd: d.imd_rain,
    regime: d.regime,
  }));

  const runReplay = () => {
    if (playing) return;
    setPlaying(true);
    setCompleted(false);
    setCurrentStep(0);

    REPLAY_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setCurrentStep(i + 1);
        if (i === REPLAY_STEPS.length - 1) {
          setPlaying(false);
          setCompleted(true);
        }
      }, (i + 1) * 600);
    });
  };

  const reset = () => {
    setCurrentStep(0);
    setPlaying(false);
    setCompleted(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header Strip with Sequence Selector & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            Historical Benchmark Forecast Replay — Benchmark Grid (10.75°N, 76.25°E)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Step through the GreenSky data pipeline and inspect actual historical benchmark periods against IMD ground truth (District Context: {district})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sequence Selector */}
          <select
            value={selectedSequenceKey}
            onChange={(e) => {
              setSelectedSequenceKey(e.target.value);
              reset();
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="locked_test">Locked Test Set (Aug 04–31, 28 Days)</option>
            <option value="aug_peak_surge">August Heavy Surge (Aug 14–20)</option>
            <option value="july_monsoon_peak">July Peak Monsoon (Jul 22–28)</option>
            <option value="june_onset_surge">June Torrential Surge (Jun 14–20)</option>
            <option value="full_season">Full 92-Day Monsoon Season</option>
          </select>

          {completed && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}

          <button
            onClick={runReplay}
            disabled={playing}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              playing
                ? 'bg-amber-950/60 text-amber-400 cursor-not-allowed border border-amber-800'
                : 'bg-amber-600 hover:bg-amber-500 text-slate-950 border border-amber-500'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {playing ? 'Executing Pipeline...' : 'Run Pipeline Step Replay'}
          </button>
        </div>
      </div>

      {/* 7-Step Animated Progress Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
          Multi-Model Execution Pipeline & Data Flow
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-2">
          {REPLAY_STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-lg border text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                    : isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-white animate-pulse'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isDone ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step.id}
                  </span>
                  <span className="font-semibold text-[11px] truncate">{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {currentStep > 0 && currentStep <= REPLAY_STEPS.length && (
          <p className="text-xs text-amber-400 font-mono mt-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>Active Step: {REPLAY_STEPS[currentStep - 1]?.desc}</span>
          </p>
        )}
      </div>

      {/* Real Timeseries Recharts Multi-Line Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              {activeSequence.name} — ECMWF IFS vs NCEP GFS vs GreenSky vs IMD Ground Truth
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 self-start sm:self-auto">
            {activeSequence.days.length} Days • Convention B
          </span>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#334155' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#334155' }} unit=" mm" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="ecmwf" name="ECMWF IFS (NWP)" stroke="#38bdf8" strokeWidth={1.5} dot={{ r: 2.5, fill: '#38bdf8' }} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="gfs" name="NCEP GFS (NWP)" stroke="#34d399" strokeWidth={1.5} dot={{ r: 2.5, fill: '#34d399' }} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="equal" name="Equal Blend (50/50)" stroke="#94a3b8" strokeWidth={1.2} dot={false} strokeDasharray="2 2" />
              <Line type="monotone" dataKey="blend" name="GreenSky Adaptive Blend" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3.5, fill: '#f59e0b' }} />
              <Line type="monotone" dataKey="imd" name="IMD Ground Truth" stroke="#a78bfa" strokeWidth={2.2} dot={{ r: 3.5, fill: '#a78bfa' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Benchmark Station: {BENCHMARK_METADATA.gridCell.region} (10.75°N, 76.25°E)</span>
          </div>
          <span className="text-slate-500">Source: IMD Daily 0.25° Gauge Net (Pai et al. 2014)</span>
        </div>
      </div>

    </div>
  );
}
