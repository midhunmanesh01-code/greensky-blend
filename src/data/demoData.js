// ============================================================
// GreenSky Blend — Data Integration Layer
// Sourced directly from greensky-benchmark (SIH26081)
// Authoritative Ground Truth: IMD Gridded Rainfall (10.75°N, 76.25°E)
// Models: ECMWF IFS025, NOAA NCEP GFS Seamless, Adaptive Blender
// ============================================================

import {
  BENCHMARK_DAYS,
  BENCHMARK_LOOKUP,
  BENCHMARK_METADATA,
  PILOT_DISTRICTS,
  DISTRICTS as RAW_DISTRICTS,
  REGIME_WEIGHTS,
  REPRESENTATIVE_DATES,
  ALL_BENCHMARK_DATES,
  EXPERIMENT_METRICS,
  HISTORICAL_REPLAY_SEQUENCES,
  CONTINGENCY_15_6,
  HEAVY_RAIN_DAYS,
  EXTREME_RAIN_DAYS,
} from './benchmarkData';

// Re-export all authoritative benchmark constructs
export {
  BENCHMARK_DAYS,
  BENCHMARK_LOOKUP,
  BENCHMARK_METADATA,
  PILOT_DISTRICTS,
  REGIME_WEIGHTS,
  REPRESENTATIVE_DATES,
  ALL_BENCHMARK_DATES,
  EXPERIMENT_METRICS,
  HISTORICAL_REPLAY_SEQUENCES,
  CONTINGENCY_15_6,
  HEAVY_RAIN_DAYS,
  EXTREME_RAIN_DAYS,
};

export const DISTRICTS = RAW_DISTRICTS;
export const DATES = REPRESENTATIVE_DATES;

export const REGIMES = [
  "Dry (< 5 mm)",
  "Light (5-15 mm)",
  "Moderate (15-35 mm)",
  "Heavy (>= 35 mm)",
];

// Helper to compute scientific confidence score based on inter-model agreement
function computeAgreementConfidence(ecmwf, gfs) {
  const diff = Math.abs(ecmwf - gfs);
  const mean = (ecmwf + gfs) / 2;
  if (mean === 0) return 0.92;
  const relativeSpread = diff / (mean + 5.0);
  const conf = Math.max(0.60, Math.min(0.95, 1.0 - relativeSpread * 0.45));
  return Math.round(conf * 100) / 100;
}

// Build district-level forecast structure directly connected to real benchmark observations
export const FORECAST_DATA = {};

DISTRICTS.forEach((district) => {
  FORECAST_DATA[district] = {};

  BENCHMARK_DAYS.forEach((day) => {
    const { date, ecmwf, gfs, regime_code, ecmwf_weight, gfs_weight, adaptive_blend, imd_rain } = day;
    const confidence = computeAgreementConfidence(ecmwf, gfs);

    FORECAST_DATA[district][date] = {
      date,
      district,
      regime: day.regime,
      regime_code,
      imd_rain,
      forecasts: {
        ifs: ecmwf,
        gfs: gfs,
        aifs: adaptive_blend, // Reflects consensus/ML prediction in hybrid 3-slot telemetry
      },
      weights: {
        ifs: ecmwf_weight,
        gfs: gfs_weight,
        aifs: 0.0,
      },
      confidence,
      adaptive_blend,
      equal_blend: day.equal_blend,
      is_heavy: day.is_heavy,
      is_extreme: day.is_extreme,
      status: "Historical Benchmark (Convention B Aligned)",
    };
  });
});

// Replay data series per district sourced from actual benchmark records
export const REPLAY_DATA = {};

DISTRICTS.forEach((district) => {
  // Use the 28-day locked unseen test split (Aug 4–31, 2025) as the primary chronological replay series
  const testDays = BENCHMARK_DAYS.filter((d) => d.is_test_exp1);
  
  REPLAY_DATA[district] = testDays.map((d) => ({
    date: d.date.substring(5), // "08-04" format
    fullDate: d.date,
    ifs: d.ecmwf,
    gfs: d.gfs,
    aifs: d.gradboost_atmos ?? d.adaptive_blend,
    blend: d.adaptive_blend,
    equal: d.equal_blend,
    imd_rain: d.imd_rain,
    regime: d.regime,
    w_ec: d.ecmwf_weight,
  }));
});

// Representative regional demonstration profiles across Kerala 6-District Pilot
// Note: Empirical ML weights were trained at the central Benchmark Grid Cell (10.75°N, 76.25°E)
// and are conditioned on rainfall intensity regimes, not independently trained per district.
export const SPATIAL_WEIGHTS = {
  Pathanamthitta:     { ifs: 0.60, gfs: 0.40, aifs: 0.00, regime: "Moderate/Orographic" },
  Idukki:             { ifs: 0.45, gfs: 0.55, aifs: 0.00, regime: "Heavy/High-Range" },
  Wayanad:            { ifs: 0.45, gfs: 0.55, aifs: 0.00, regime: "Heavy/High-Range" },
  Kottayam:           { ifs: 0.60, gfs: 0.40, aifs: 0.00, regime: "Moderate/Midland" },
  Ernakulam:          { ifs: 1.00, gfs: 0.00, aifs: 0.00, regime: "Light/Coastal" },
  Thiruvananthapuram: { ifs: 1.00, gfs: 0.00, aifs: 0.00, regime: "Light/Coastal" },
};

// Regime color styling (dark theme)
export const REGIME_COLORS = {
  "Dry (< 5 mm)":        { bg: "rgba(148,163,184,0.1)", text: "text-slate-400", border: "border-slate-500/20" },
  "Light (5-15 mm)":     { bg: "rgba(56,189,248,0.1)",  text: "text-sky-400",   border: "border-sky-500/20" },
  "Moderate (15-35 mm)": { bg: "rgba(245,158,11,0.1)",  text: "text-amber-400", border: "border-amber-500/20" },
  "Heavy (>= 35 mm)":    { bg: "rgba(251,113,133,0.1)", text: "text-rose-400",  border: "border-rose-500/20" },
  // Backward compatibility keys
  Monsoon:               { bg: "rgba(56,189,248,0.1)",  text: "text-sky-400",   border: "border-sky-500/20" },
  "Non-Monsoon":         { bg: "rgba(148,163,184,0.1)", text: "text-slate-400", border: "border-slate-500/20" },
  "Heavy Rain":          { bg: "rgba(251,113,133,0.1)", text: "text-rose-400",  border: "border-rose-500/20" },
};

// IMD rainfall intensity classification categories (dark theme)
export const RAINFALL_CATEGORIES = [
  { min: 0.0,  max: 2.4,  label: "Very Light", color: "#0f2b48" },
  { min: 2.5,  max: 15.5, label: "Light",      color: "#1e3a5c" },
  { min: 15.6, max: 64.4, label: "Moderate",   color: "#1e40af" },
  { min: 64.5, max: 115.5,label: "Heavy",      color: "#2563eb" },
  { min: 115.6,max: 204.4,label: "Very Heavy", color: "#3b82f6" },
  { min: 204.5,max: Infinity, label: "Extremely Heavy", color: "#60a5fa" },
];
