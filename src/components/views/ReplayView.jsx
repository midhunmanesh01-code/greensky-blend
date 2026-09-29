import React, { useState } from 'react';
import { Play, RotateCcw, Activity, Calendar } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { REPLAY_DATA } from '../../data/demoData';

const REPLAY_STEPS = [
  { id: 1, label: 'Ingesting forecast sources', desc: 'Loading ECMWF IFS, NCEP GFS, and ECMWF AIFS numerical grids...' },
  { id: 2, label: 'Data alignment & QC', desc: 'Regridding to common 0.25° grid and temporal timestamp synchronization...' },
  { id: 3, label: 'Regime detection', desc: 'Context features extracted — Monsoon & orographic regime identified...' },
  { id: 4, label: 'Computing adaptive weights', desc: 'Gradient-boosted meta-model evaluating location and regime biases...' },
  { id: 5, label: 'Applying blended forecast', desc: 'Context-weighted sum computed — GreenSky consensus output generated...' },
  { id: 6, label: 'Estimating confidence', desc: 'Inter-model spread and historical reliability score quantified...' },
  { id: 7, label: 'Rendering telemetry', desc: 'Spatial rainfall grid and time series updated for decision support.' },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1628] border border-cyan-500/30 rounded-lg p-2.5 text-xs shadow-xl">
        <p className="font-bold text-slate-300 mb-1.5">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-mono font-bold text-white">{p.value} mm</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function ReplayView({ district }) {
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const data = REPLAY_DATA[district] || REPLAY_DATA['Pathanamthitta'];

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
      
      {/* Top Header Strip with Controls */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            24-Hour Historical Forecast Replay — {district}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Step through the GreenSky multi-model pipeline and inspect 7-day chronological performance
          </p>
        </div>

        <div className="flex items-center gap-2">
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
                ? 'bg-cyan-900/60 text-cyan-400 cursor-not-allowed border border-cyan-800'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {playing ? 'Executing ML Pipeline...' : 'Run Pipeline Replay'}
          </button>
        </div>
      </div>

      {/* 7-Step Animated Progress Timeline */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
          Multi-Model Execution Pipeline
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-2">
          {REPLAY_STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;

            return (
              <div
                key={step.id}
                className={`p-2 rounded-lg border text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                    : isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 text-white animate-pulse'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isDone ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
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
          <p className="text-xs text-cyan-400 font-mono mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Active Stage: {REPLAY_STEPS[currentStep - 1]?.desc}</span>
          </p>
        )}
      </div>

      {/* 7-Day Timeseries Recharts Multi-Line Comparison */}
      <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              7-Day Precipitation Timeline — ECMWF IFS vs NCEP GFS vs ECMWF AIFS vs GreenSky
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {district}
          </span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#14243b" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} unit=" mm" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="ifs" name="ECMWF IFS (NWP)" stroke="#38bdf8" strokeWidth={1.5} dot={{ r: 3, fill: '#38bdf8' }} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="gfs" name="NCEP GFS (NWP)" stroke="#34d399" strokeWidth={1.5} dot={{ r: 3, fill: '#34d399' }} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="aifs" name="ECMWF AIFS (AI)" stroke="#a78bfa" strokeWidth={1.5} dot={{ r: 3, fill: '#a78bfa' }} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="blend" name="GreenSky Consensus Blend" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 4, fill: '#22d3ee' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
