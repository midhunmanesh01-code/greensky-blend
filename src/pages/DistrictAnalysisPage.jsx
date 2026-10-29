import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Database,
  Layers,
  ArrowRight,
  Sliders,
  Scale,
  FileText,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  PILOT_DISTRICTS,
  DISTRICT_METRICS,
  DISTRICT_LEARNED_WEIGHTS,
  DISTRICT_DAILY_DATA,
} from '../data/benchmarkData';

const COLORS = {
  ecmwf: '#38bdf8',       // Sky blue
  gfs: '#34d399',         // Emerald green
  equal: '#94a3b8',       // Slate gray
  transferred: '#f59e0b', // Amber (Primary Detection Blend)
  district: '#ec4899',   // Pink / Fuchsia
  imd: '#a78bfa',         // Purple (Ground Truth)
};

export default function DistrictAnalysisPage({ district, onDistrictChange }) {
  const selectedDistrictMeta =
    PILOT_DISTRICTS.find((d) => d.name === district) || PILOT_DISTRICTS[0];

  const distName = selectedDistrictMeta.name;
  const distId = selectedDistrictMeta.id;

  // Load district-specific metrics from Phase 3 authoritative outputs
  const metricsMap = DISTRICT_METRICS[distName] || {};
  const weightsList = DISTRICT_LEARNED_WEIGHTS[distName] || [];
  const fullDailyData = DISTRICT_DAILY_DATA[distName] || [];

  // Filter to 28-day locked test set (Aug 4 - Aug 31, 2025)
  const testSetData = fullDailyData.filter((d) => d.is_test).map((d) => ({
    date: d.date.substring(5), // '08-04'
    fullDate: d.date,
    imd_rain: d.imd_rain,
    ecmwf: d.ecmwf,
    gfs: d.gfs,
    equal_blend: d.equal_blend,
    transferred_blend: d.transferred_blend,
    district_blend: d.district_blend,
    regime: d.regime,
  }));

  // Aggregated Pilot Metrics (from comparative_metrics_table.csv)
  const macroMetrics = DISTRICT_METRICS['Aggregate (Macro-Average)'] || {};
  const pooledMetrics = DISTRICT_METRICS['Aggregate (Pooled)'] || {};

  return (
    <div className="space-y-5">
      {/* 1. Header Banner & Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                Phase 3 Multi-District Pilot
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Historical Benchmark (Monsoon 2025)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
                Not Live Forecast
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <MapPin className="text-amber-400 w-5 h-5" />
              {distName} Pilot Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Evaluating the <strong>Comparative Triad</strong> against ground-truth IMD 0.25° gridded observations across the 28-day locked unseen test set (August 4–31, 2025).
            </p>
          </div>

          {/* District Quick-Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-lg p-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium">Select Pilot District:</span>
            <select
              value={distName}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="bg-slate-900 text-amber-400 font-bold text-xs rounded px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {PILOT_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.zone})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District Geographic & Grid Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3.5 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">IMD Grid Coordinates</span>
            <span className="font-mono font-bold text-slate-200">
              {selectedDistrictMeta.lat.toFixed(2)}°N, {selectedDistrictMeta.lon.toFixed(2)}°E
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Grid Elevation (MSL)</span>
            <span className="font-mono font-bold text-slate-200">{selectedDistrictMeta.elevation_m} m</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">District HQ Offset</span>
            <span className="font-mono font-bold text-slate-200">
              {selectedDistrictMeta.hq_name} ({selectedDistrictMeta.hq_distance_km} km)
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Data Provenance</span>
            <span className="font-mono text-amber-400 font-bold truncate block" title={selectedDistrictMeta.sourceFile}>
              {selectedDistrictMeta.id}.csv
            </span>
          </div>
        </div>
      </div>

      {/* 2. Model Accuracy vs Detection Trade-Off Callout Box */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-sky-950/30 border border-amber-500/30 rounded-xl p-4 sm:p-5 text-xs shadow-sm">
        <div className="flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              Model Comparison Trade-Off: Event Detection vs Continuous Accuracy
            </h4>
            <p className="text-slate-300 leading-relaxed">
              In Phase 3 testing across 168 district test days, no single model wins across every metric. The framework provides two defensible operational choices:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-amber-500/40">
                <div className="flex items-center justify-between text-amber-400 font-bold text-xs mb-1">
                  <span>Primary Event Detection Model</span>
                  <span className="font-mono">Pooled CSI: 0.4746</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  <strong>Transferred Benchmark Blend:</strong> Anchors on ECMWF for dry/light conditions and blends with GFS for moderate/heavy rainfall. Captures <strong>28 heavy rain hits</strong> (vs 26 for ECMWF and 10 for GFS) and slashes misses to 15 across Kerala.
                </p>
                <div className="mt-2 text-[10px] font-mono text-slate-400 flex justify-between border-t border-slate-800 pt-1.5">
                  <span>Macro MAE: 6.72 mm</span>
                  <span>Macro RMSE: 10.17 mm</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-sky-500/40">
                <div className="flex items-center justify-between text-sky-400 font-bold text-xs mb-1">
                  <span>Continuous Magnitude Accuracy</span>
                  <span className="font-mono">Macro MAE: 6.21 mm</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  <strong>ECMWF IFS025 Baseline:</strong> Demonstrates superior continuous point precision with lowest statewide Macro MAE (6.21 mm) and RMSE (9.01 mm). However, raw ECMWF experiences 17 heavy rain misses statewide.
                </p>
                <div className="mt-2 text-[10px] font-mono text-slate-400 flex justify-between border-t border-slate-800 pt-1.5">
                  <span>Pooled CSI: 0.4561</span>
                  <span>26 Hits / 17 Misses</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-rose-300 font-mono pt-1">
              * Equal-Weight Hazard: Blindly averaging (0.50 ECMWF + 0.50 GFS) degrades performance (Macro MAE 6.91 mm, Pooled CSI 0.259, 29 misses) because GFS carries high variance.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Authoritative District Comparative Triad Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Comparative Triad Benchmark Matrix — {distName}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Evaluated on 28 unseen test days (August 4–31, 2025). Sourced directly from <code className="text-amber-400">comparative_metrics_table.csv</code>.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            Sample: 28 Days &bull; 0 Missing
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2.5 font-bold uppercase tracking-wider">Model / Blend Pipeline</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">MAE (mm)</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">RMSE (mm)</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">Mean Bias (mm)</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">CSI @ 15.6mm</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">Hits</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">Misses</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">False Alarms</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-right">CSI @ 64.5mm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { key: 'ECMWF IFS025', desc: 'Raw Physics NWP (9km)', color: COLORS.ecmwf },
                { key: 'NOAA GFS Seamless', desc: 'Raw Physics NWP (13km)', color: COLORS.gfs },
                { key: 'Equal-Weight Blend', desc: '0.50 ECMWF + 0.50 GFS', color: COLORS.equal },
                { key: 'Transferred Benchmark Blend', desc: 'Primary Detection (Palakkad weights)', color: COLORS.transferred, highlight: true },
                { key: 'District-Specific Blend', desc: 'Learned on local training data', color: COLORS.district },
              ].map(({ key, desc, color, highlight }) => {
                const m = metricsMap[key] || {};
                const csi15Str = m.csi_15_6 !== null && m.csi_15_6 !== undefined ? m.csi_15_6.toFixed(3) : '0.000';
                const csi64Str = m.csi_64_5 !== null && m.csi_64_5 !== undefined ? m.csi_64_5.toFixed(3) : 'N/A (0 events)';

                return (
                  <tr
                    key={key}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      highlight ? 'bg-amber-950/20 font-bold' : ''
                    }`}
                  >
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <div>
                          <span className={highlight ? 'text-amber-400 font-bold' : 'text-slate-200'}>{key}</span>
                          <span className="block text-[10px] text-slate-500 font-normal">{desc}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">{m.mae !== undefined ? m.mae.toFixed(2) : '--'}</td>
                    <td className="py-2.5 text-right text-slate-300">{m.rmse !== undefined ? m.rmse.toFixed(2) : '--'}</td>
                    <td className={`py-2.5 text-right font-mono ${m.bias > 0 ? 'text-amber-300' : 'text-sky-300'}`}>
                      {m.bias !== undefined ? (m.bias > 0 ? `+${m.bias.toFixed(2)}` : m.bias.toFixed(2)) : '--'}
                    </td>
                    <td className="py-2.5 text-right font-bold text-amber-400">{csi15Str}</td>
                    <td className="py-2.5 text-right text-emerald-400">{m.hits_15_6 !== undefined ? m.hits_15_6 : '--'}</td>
                    <td className="py-2.5 text-right text-rose-400">{m.misses_15_6 !== undefined ? m.misses_15_6 : '--'}</td>
                    <td className="py-2.5 text-right text-amber-300">{m.fa_15_6 !== undefined ? m.fa_15_6 : '--'}</td>
                    <td className="py-2.5 text-right text-slate-400 text-[11px]">{csi64Str}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Interactive Locked Test Set Time-Series Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2.5 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Locked Test Set Trajectory ({distName} &bull; August 4–31, 2025)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Comparing daily ground truth (IMD Gauge) with model forecasts and adaptive blends over 28 consecutive days.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> IMD Gauge
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Transferred Blend
            <span className="w-2 h-2 rounded-full bg-sky-400" /> ECMWF
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> GFS
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={testSetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="mm" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs font-mono">
                        <p className="font-bold text-amber-400 mb-1">Date: 2025-{label}</p>
                        {payload.map((p) => (
                          <div key={p.dataKey} className="flex items-center justify-between gap-3 my-0.5">
                            <span style={{ color: p.color }}>{p.name}:</span>
                            <span className="font-bold text-white">{p.value} mm</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="imd_rain" name="IMD Observed" fill={COLORS.imd} opacity={0.65} />
              <Line type="monotone" dataKey="transferred_blend" name="Transferred Blend" stroke={COLORS.transferred} strokeWidth={2.5} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="ecmwf" name="ECMWF IFS" stroke={COLORS.ecmwf} strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="gfs" name="NOAA GFS" stroke={COLORS.gfs} strokeWidth={1.2} dot={false} strokeDasharray="2 2" />
              <Line type="monotone" dataKey="district_blend" name="District Blend" stroke={COLORS.district} strokeWidth={1.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Two Columns: Learned Weights Audit & Spatial Representativeness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left: Regime Weights (Learned vs Transferred) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Regime Weight Allocation Audit ({distName})
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Weights fitted on 64 training days (Jun 1–Aug 3) vs Transferred Palakkad Baseline.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Min Samples: 5
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                  <th className="pb-2">Regime</th>
                  <th className="pb-2 text-center">N_train</th>
                  <th className="pb-2 text-right">Learned (EC/GFS)</th>
                  <th className="pb-2 text-right">Transferred (EC/GFS)</th>
                  <th className="pb-2 text-right">Optimization Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {weightsList.map((w) => (
                  <tr key={w.regime_id} className="hover:bg-slate-800/30">
                    <td className="py-2 text-slate-200 font-medium">{w.regime_name}</td>
                    <td className="py-2 text-center text-slate-400">{w.n_train}</td>
                    <td className="py-2 text-right font-bold text-amber-400">
                      {Math.round(w.learned_w_ecmwf * 100)}% / {Math.round(w.learned_w_gfs * 100)}%
                    </td>
                    <td className="py-2 text-right text-slate-300">
                      {Math.round(w.transferred_w_ecmwf * 100)}% / {Math.round(w.transferred_w_gfs * 100)}%
                    </td>
                    <td className="py-2 text-right text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded ${w.note.includes('Fallback') ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'}`}>
                        {w.note}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60 leading-relaxed">
            * Safeguard Rule: If a regime has fewer than 5 training days, it falls back to equal weight (0.50/0.50) to prevent erratic overfitting.
          </p>
        </div>

        {/* Right: Spatial Representativeness & Scientific Limitations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Spatial Representativeness & Scope Limits
              </h4>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                0.25° Grid Cell (~756 km²)
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Physiographic Terrain</span>
                <p className="text-slate-200 mt-0.5">{selectedDistrictMeta.terrain}</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Vulnerability Profile</span>
                <p className="text-slate-200 mt-0.5">{selectedDistrictMeta.hazardProfile}</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-amber-500/20">
                <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" /> Representativeness Limitation
                </span>
                <p className="text-slate-300 mt-0.5 text-[11px] leading-relaxed">
                  {selectedDistrictMeta.limitations}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Alignment: Convention B (03:00 UTC)</span>
            <span>Source: IMD Pai et al. (2014)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
