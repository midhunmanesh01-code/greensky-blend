import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Play, RotateCcw } from 'lucide-react';
import { REPLAY_DATA } from '../data/demoData';

const REPLAY_STEPS = [
  { id: 1, label: 'Ingesting forecast sources', desc: 'Loading ECMWF IFS, NCEP GFS, ECMWF AIFS outputs...' },
  { id: 2, label: 'Data alignment & quality checks', desc: 'Regridding to common resolution, QC filtering...' },
  { id: 3, label: 'Detecting weather regime', desc: 'Context features extracted — Monsoon regime identified...' },
  { id: 4, label: 'Computing adaptive weights', desc: 'Meta-model generating location/regime-specific weights...' },
  { id: 5, label: 'Applying blended forecast', desc: 'Weighted sum computed — GreenSky blend produced...' },
  { id: 6, label: 'Estimating confidence', desc: 'Source agreement and reliability score calculated...' },
  { id: 7, label: 'Rendering visualization', desc: 'Spatial rainfall map and time series updated.' },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-bold text-slate-600 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-600">{p.name}:</span>
            <span className="font-bold text-slate-900">{p.value} mm</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function ForecastReplay({ district }) {
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
      }, (i + 1) * 700);
    });
  };

  const reset = () => {
    setCurrentStep(0);
    setPlaying(false);
    setCompleted(false);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-blue-600" />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">24-Hour Forecast Replay</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-illustrative">Illustrative Data</span>
          {completed && (
            <button onClick={reset} className="btn-secondary py-1 px-3 text-xs">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
          <button
            onClick={runReplay}
            disabled={playing}
            className={`btn-primary py-1 px-3 text-xs ${playing ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Play className="w-3 h-3" />
            {playing ? 'Running...' : 'Run Forecast Replay'}
          </button>
        </div>
      </div>

      {/* Step progress */}
      {(playing || completed) && (
        <div className="mb-5 bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex gap-2 flex-wrap mb-3">
            {REPLAY_STEPS.map((step, i) => (
              <div
                key={step.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-500 ${
                  i < currentStep
                    ? 'bg-blue-600 text-white border-blue-600'
                    : i === currentStep
                    ? 'bg-blue-100 text-blue-700 border-blue-300 animate-pulse'
                    : 'bg-white text-slate-400 border-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/20">
                  {step.id}
                </span>
                {step.label}
              </div>
            ))}
          </div>
          {currentStep > 0 && currentStep <= REPLAY_STEPS.length && (
            <p className="text-xs text-slate-500 italic">
              ↳ {REPLAY_STEPS[currentStep - 1]?.desc}
            </p>
          )}
        </div>
      )}

      {/* Time series chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8', dy: 50 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="ifs"   name="ECMWF IFS"   stroke="#2563eb" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="gfs"   name="NCEP GFS"    stroke="#16a34a" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="aifs"  name="ECMWF AIFS"  stroke="#7c3aed" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="blend" name="GreenSky Blend" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4, fill: '#0ea5e9' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
