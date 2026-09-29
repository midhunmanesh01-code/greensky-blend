import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, RotateCcw } from 'lucide-react';
import { REPLAY_DATA } from '../data/demoData';

const REPLAY_STEPS = [
  { id: 1, label: 'Ingesting forecast sources', desc: 'Loading ECMWF IFS, NCEP GFS, ECMWF AIFS outputs...' },
  { id: 2, label: 'Data alignment & quality checks', desc: 'Regridding to common resolution, QC filtering...' },
  { id: 3, label: 'Detecting weather regime', desc: 'Context features extracted — regime identified...' },
  { id: 4, label: 'Computing adaptive weights', desc: 'Meta-model generating location/regime-specific weights...' },
  { id: 5, label: 'Applying blended forecast', desc: 'Weighted sum computed — GreenSky blend produced...' },
  { id: 6, label: 'Estimating confidence', desc: 'Source agreement and reliability score calculated...' },
  { id: 7, label: 'Rendering visualization', desc: 'Spatial rainfall map and time series updated.' },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(12px)' }}>
        <p className="text-xs font-bold text-slate-400 mb-2">{label}</p>
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
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

  const reset = () => { setCurrentStep(0); setPlaying(false); setCompleted(false); };

  return (
    <div className="glass-panel">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">24-Hour Forecast Replay</h2>
        </div>
        <div className="flex items-center gap-2">
          {completed && (
            <button onClick={reset} className="btn-secondary py-1.5 px-3 text-xs">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
          <button onClick={runReplay} disabled={playing}
            className={`btn-primary py-1.5 px-3 text-xs ${playing ? 'opacity-60 cursor-not-allowed' : ''}`}>
            <Play className="w-3 h-3" />
            {playing ? 'Running...' : 'Run Replay'}
          </button>
        </div>
      </div>

      {(playing || completed) && (
        <div className="mb-5 p-4 rounded-xl" style={{ background: 'rgba(15,31,56,0.5)', border: '1px solid rgba(56,189,248,0.08)' }}>
          <div className="flex gap-2 flex-wrap mb-3">
            {REPLAY_STEPS.map((step, i) => (
              <div key={step.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-500"
                style={{
                  background: i < currentStep ? 'rgba(34,211,238,0.15)' : i === currentStep ? 'rgba(34,211,238,0.08)' : 'rgba(148,163,184,0.05)',
                  color: i < currentStep ? '#22d3ee' : i === currentStep ? '#38bdf8' : '#475569',
                  border: `1px solid ${i < currentStep ? 'rgba(34,211,238,0.3)' : i === currentStep ? 'rgba(56,189,248,0.2)' : 'rgba(148,163,184,0.1)'}`,
                  animation: i === currentStep ? 'pulse 1.5s infinite' : 'none',
                }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: i < currentStep ? 'rgba(34,211,238,0.2)' : 'transparent' }}>
                  {step.id}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
          {currentStep > 0 && currentStep <= REPLAY_STEPS.length && (
            <p className="text-xs text-slate-500 italic">↳ {REPLAY_STEPS[currentStep - 1]?.desc}</p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(56,189,248,0.1)' }} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: 'rgba(56,189,248,0.1)' }}
            label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b', dy: 50 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
          <Line type="monotone" dataKey="ifs" name="ECMWF IFS" stroke="#38bdf8" strokeWidth={1.5} dot={{ r: 3, fill: '#38bdf8' }} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="gfs" name="NCEP GFS" stroke="#34d399" strokeWidth={1.5} dot={{ r: 3, fill: '#34d399' }} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="aifs" name="ECMWF AIFS" stroke="#a78bfa" strokeWidth={1.5} dot={{ r: 3, fill: '#a78bfa' }} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="blend" name="GreenSky Blend" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 4, fill: '#22d3ee' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
