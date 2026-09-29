// ============================================================
// GreenSky Blend — Demo Dataset
// All values are ILLUSTRATIVE prototype data.
// These do NOT represent validated experimental results.
// ============================================================

export const DISTRICTS = [
  "Pathanamthitta",
  "Idukki",
  "Wayanad",
  "Kottayam",
  "Ernakulam",
  "Thiruvananthapuram",
];

export const DATES = [
  "2026-06-28",
  "2026-06-29",
  "2026-06-30",
  "2026-07-01",
  "2026-07-02",
  "2026-07-03",
  "2026-07-04",
];

export const REGIMES = ["Monsoon", "Non-Monsoon", "Heavy Rain"];

// -------------------------------------------------------
// Primary forecast dataset — district × date combinations
// All values are illustrative.
// -------------------------------------------------------
export const FORECAST_DATA = {
  Pathanamthitta: {
    "2026-06-28": {
      regime: "Monsoon",
      forecasts: { ifs: 75, gfs: 62, aifs: 84 },
      weights: { ifs: 0.40, gfs: 0.25, aifs: 0.35 },
      confidence: 0.79,
    },
    "2026-06-29": {
      regime: "Monsoon",
      forecasts: { ifs: 88, gfs: 71, aifs: 95 },
      weights: { ifs: 0.38, gfs: 0.22, aifs: 0.40 },
      confidence: 0.84,
    },
    "2026-06-30": {
      regime: "Heavy Rain",
      forecasts: { ifs: 110, gfs: 98, aifs: 125 },
      weights: { ifs: 0.35, gfs: 0.20, aifs: 0.45 },
      confidence: 0.88,
    },
    "2026-07-01": {
      regime: "Monsoon",
      forecasts: { ifs: 82, gfs: 67, aifs: 91 },
      weights: { ifs: 0.42, gfs: 0.23, aifs: 0.35 },
      confidence: 0.82,
    },
    "2026-07-02": {
      regime: "Monsoon",
      forecasts: { ifs: 65, gfs: 58, aifs: 72 },
      weights: { ifs: 0.44, gfs: 0.26, aifs: 0.30 },
      confidence: 0.77,
    },
    "2026-07-03": {
      regime: "Non-Monsoon",
      forecasts: { ifs: 22, gfs: 18, aifs: 25 },
      weights: { ifs: 0.50, gfs: 0.30, aifs: 0.20 },
      confidence: 0.72,
    },
    "2026-07-04": {
      regime: "Monsoon",
      forecasts: { ifs: 55, gfs: 48, aifs: 61 },
      weights: { ifs: 0.41, gfs: 0.27, aifs: 0.32 },
      confidence: 0.76,
    },
  },

  Idukki: {
    "2026-06-28": {
      regime: "Monsoon",
      forecasts: { ifs: 68, gfs: 72, aifs: 80 },
      weights: { ifs: 0.30, gfs: 0.25, aifs: 0.45 },
      confidence: 0.80,
    },
    "2026-06-29": {
      regime: "Monsoon",
      forecasts: { ifs: 92, gfs: 85, aifs: 105 },
      weights: { ifs: 0.28, gfs: 0.22, aifs: 0.50 },
      confidence: 0.86,
    },
    "2026-06-30": {
      regime: "Heavy Rain",
      forecasts: { ifs: 135, gfs: 120, aifs: 150 },
      weights: { ifs: 0.25, gfs: 0.20, aifs: 0.55 },
      confidence: 0.90,
    },
    "2026-07-01": {
      regime: "Monsoon",
      forecasts: { ifs: 78, gfs: 82, aifs: 95 },
      weights: { ifs: 0.30, gfs: 0.25, aifs: 0.45 },
      confidence: 0.81,
    },
    "2026-07-02": {
      regime: "Monsoon",
      forecasts: { ifs: 60, gfs: 65, aifs: 74 },
      weights: { ifs: 0.32, gfs: 0.27, aifs: 0.41 },
      confidence: 0.75,
    },
    "2026-07-03": {
      regime: "Non-Monsoon",
      forecasts: { ifs: 15, gfs: 20, aifs: 18 },
      weights: { ifs: 0.45, gfs: 0.35, aifs: 0.20 },
      confidence: 0.70,
    },
    "2026-07-04": {
      regime: "Monsoon",
      forecasts: { ifs: 50, gfs: 55, aifs: 62 },
      weights: { ifs: 0.31, gfs: 0.26, aifs: 0.43 },
      confidence: 0.78,
    },
  },

  Wayanad: {
    "2026-06-28": {
      regime: "Monsoon",
      forecasts: { ifs: 55, gfs: 60, aifs: 68 },
      weights: { ifs: 0.25, gfs: 0.30, aifs: 0.45 },
      confidence: 0.78,
    },
    "2026-06-29": {
      regime: "Monsoon",
      forecasts: { ifs: 80, gfs: 75, aifs: 90 },
      weights: { ifs: 0.27, gfs: 0.28, aifs: 0.45 },
      confidence: 0.82,
    },
    "2026-06-30": {
      regime: "Heavy Rain",
      forecasts: { ifs: 120, gfs: 110, aifs: 140 },
      weights: { ifs: 0.25, gfs: 0.25, aifs: 0.50 },
      confidence: 0.87,
    },
    "2026-07-01": {
      regime: "Monsoon",
      forecasts: { ifs: 70, gfs: 68, aifs: 82 },
      weights: { ifs: 0.25, gfs: 0.30, aifs: 0.45 },
      confidence: 0.80,
    },
    "2026-07-02": {
      regime: "Monsoon",
      forecasts: { ifs: 52, gfs: 58, aifs: 64 },
      weights: { ifs: 0.28, gfs: 0.32, aifs: 0.40 },
      confidence: 0.74,
    },
    "2026-07-03": {
      regime: "Non-Monsoon",
      forecasts: { ifs: 12, gfs: 16, aifs: 14 },
      weights: { ifs: 0.40, gfs: 0.38, aifs: 0.22 },
      confidence: 0.68,
    },
    "2026-07-04": {
      regime: "Monsoon",
      forecasts: { ifs: 44, gfs: 50, aifs: 58 },
      weights: { ifs: 0.26, gfs: 0.31, aifs: 0.43 },
      confidence: 0.76,
    },
  },

  Kottayam: {
    "2026-06-28": {
      regime: "Monsoon",
      forecasts: { ifs: 60, gfs: 55, aifs: 70 },
      weights: { ifs: 0.40, gfs: 0.28, aifs: 0.32 },
      confidence: 0.76,
    },
    "2026-06-29": {
      regime: "Monsoon",
      forecasts: { ifs: 78, gfs: 68, aifs: 85 },
      weights: { ifs: 0.38, gfs: 0.26, aifs: 0.36 },
      confidence: 0.80,
    },
    "2026-06-30": {
      regime: "Heavy Rain",
      forecasts: { ifs: 100, gfs: 92, aifs: 115 },
      weights: { ifs: 0.35, gfs: 0.22, aifs: 0.43 },
      confidence: 0.85,
    },
    "2026-07-01": {
      regime: "Monsoon",
      forecasts: { ifs: 72, gfs: 62, aifs: 80 },
      weights: { ifs: 0.40, gfs: 0.28, aifs: 0.32 },
      confidence: 0.78,
    },
    "2026-07-02": {
      regime: "Monsoon",
      forecasts: { ifs: 55, gfs: 50, aifs: 63 },
      weights: { ifs: 0.42, gfs: 0.30, aifs: 0.28 },
      confidence: 0.73,
    },
    "2026-07-03": {
      regime: "Non-Monsoon",
      forecasts: { ifs: 18, gfs: 15, aifs: 20 },
      weights: { ifs: 0.50, gfs: 0.32, aifs: 0.18 },
      confidence: 0.70,
    },
    "2026-07-04": {
      regime: "Monsoon",
      forecasts: { ifs: 48, gfs: 44, aifs: 55 },
      weights: { ifs: 0.40, gfs: 0.29, aifs: 0.31 },
      confidence: 0.75,
    },
  },

  Ernakulam: {
    "2026-06-28": {
      regime: "Monsoon",
      forecasts: { ifs: 50, gfs: 48, aifs: 58 },
      weights: { ifs: 0.43, gfs: 0.30, aifs: 0.27 },
      confidence: 0.74,
    },
    "2026-06-29": {
      regime: "Monsoon",
      forecasts: { ifs: 65, gfs: 60, aifs: 72 },
      weights: { ifs: 0.41, gfs: 0.29, aifs: 0.30 },
      confidence: 0.78,
    },
    "2026-06-30": {
      regime: "Heavy Rain",
      forecasts: { ifs: 88, gfs: 80, aifs: 100 },
      weights: { ifs: 0.38, gfs: 0.25, aifs: 0.37 },
      confidence: 0.83,
    },
    "2026-07-01": {
      regime: "Monsoon",
      forecasts: { ifs: 62, gfs: 58, aifs: 70 },
      weights: { ifs: 0.43, gfs: 0.30, aifs: 0.27 },
      confidence: 0.76,
    },
    "2026-07-02": {
      regime: "Monsoon",
      forecasts: { ifs: 45, gfs: 42, aifs: 52 },
      weights: { ifs: 0.45, gfs: 0.32, aifs: 0.23 },
      confidence: 0.71,
    },
    "2026-07-03": {
      regime: "Non-Monsoon",
      forecasts: { ifs: 10, gfs: 12, aifs: 11 },
      weights: { ifs: 0.52, gfs: 0.34, aifs: 0.14 },
      confidence: 0.68,
    },
    "2026-07-04": {
      regime: "Monsoon",
      forecasts: { ifs: 38, gfs: 36, aifs: 45 },
      weights: { ifs: 0.43, gfs: 0.30, aifs: 0.27 },
      confidence: 0.73,
    },
  },

  Thiruvananthapuram: {
    "2026-06-28": {
      regime: "Monsoon",
      forecasts: { ifs: 42, gfs: 40, aifs: 50 },
      weights: { ifs: 0.45, gfs: 0.33, aifs: 0.22 },
      confidence: 0.72,
    },
    "2026-06-29": {
      regime: "Monsoon",
      forecasts: { ifs: 58, gfs: 54, aifs: 64 },
      weights: { ifs: 0.43, gfs: 0.31, aifs: 0.26 },
      confidence: 0.76,
    },
    "2026-06-30": {
      regime: "Heavy Rain",
      forecasts: { ifs: 80, gfs: 74, aifs: 92 },
      weights: { ifs: 0.40, gfs: 0.28, aifs: 0.32 },
      confidence: 0.81,
    },
    "2026-07-01": {
      regime: "Monsoon",
      forecasts: { ifs: 55, gfs: 50, aifs: 62 },
      weights: { ifs: 0.45, gfs: 0.33, aifs: 0.22 },
      confidence: 0.74,
    },
    "2026-07-02": {
      regime: "Monsoon",
      forecasts: { ifs: 38, gfs: 36, aifs: 44 },
      weights: { ifs: 0.47, gfs: 0.34, aifs: 0.19 },
      confidence: 0.70,
    },
    "2026-07-03": {
      regime: "Non-Monsoon",
      forecasts: { ifs: 8, gfs: 10, aifs: 9 },
      weights: { ifs: 0.55, gfs: 0.35, aifs: 0.10 },
      confidence: 0.66,
    },
    "2026-07-04": {
      regime: "Monsoon",
      forecasts: { ifs: 32, gfs: 30, aifs: 38 },
      weights: { ifs: 0.45, gfs: 0.33, aifs: 0.22 },
      confidence: 0.71,
    },
  },
};

// -------------------------------------------------------
// Replay timeline data — illustrative 7-day series
// Fixed per district
// -------------------------------------------------------
export const REPLAY_DATA = {
  Pathanamthitta: [
    { date: "Jun 28", ifs: 75, gfs: 62, aifs: 84, blend: 74.0 },
    { date: "Jun 29", ifs: 88, gfs: 71, aifs: 95, blend: 86.8 },
    { date: "Jun 30", ifs: 110, gfs: 98, aifs: 125, blend: 112.8 },
    { date: "Jul 1",  ifs: 82, gfs: 67, aifs: 91,  blend: 81.0 },
    { date: "Jul 2",  ifs: 65, gfs: 58, aifs: 72,  blend: 65.0 },
    { date: "Jul 3",  ifs: 22, gfs: 18, aifs: 25,  blend: 22.0 },
    { date: "Jul 4",  ifs: 55, gfs: 48, aifs: 61,  blend: 55.3 },
  ],
  Idukki: [
    { date: "Jun 28", ifs: 68, gfs: 72, aifs: 80,  blend: 75.0 },
    { date: "Jun 29", ifs: 92, gfs: 85, aifs: 105, blend: 97.5 },
    { date: "Jun 30", ifs: 135, gfs: 120, aifs: 150, blend: 140.3 },
    { date: "Jul 1",  ifs: 78, gfs: 82, aifs: 95,  blend: 85.3 },
    { date: "Jul 2",  ifs: 60, gfs: 65, aifs: 74,  blend: 66.7 },
    { date: "Jul 3",  ifs: 15, gfs: 20, aifs: 18,  blend: 17.6 },
    { date: "Jul 4",  ifs: 50, gfs: 55, aifs: 62,  blend: 56.4 },
  ],
  Wayanad: [
    { date: "Jun 28", ifs: 55, gfs: 60, aifs: 68,  blend: 61.6 },
    { date: "Jun 29", ifs: 80, gfs: 75, aifs: 90,  blend: 82.1 },
    { date: "Jun 30", ifs: 120, gfs: 110, aifs: 140, blend: 127.5 },
    { date: "Jul 1",  ifs: 70, gfs: 68, aifs: 82,  blend: 74.3 },
    { date: "Jul 2",  ifs: 52, gfs: 58, aifs: 64,  blend: 58.3 },
    { date: "Jul 3",  ifs: 12, gfs: 16, aifs: 14,  blend: 13.9 },
    { date: "Jul 4",  ifs: 44, gfs: 50, aifs: 58,  blend: 51.0 },
  ],
  Kottayam: [
    { date: "Jun 28", ifs: 60, gfs: 55, aifs: 70,  blend: 62.0 },
    { date: "Jun 29", ifs: 78, gfs: 68, aifs: 85,  blend: 78.0 },
    { date: "Jun 30", ifs: 100, gfs: 92, aifs: 115, blend: 102.1 },
    { date: "Jul 1",  ifs: 72, gfs: 62, aifs: 80,  blend: 72.0 },
    { date: "Jul 2",  ifs: 55, gfs: 50, aifs: 63,  blend: 55.6 },
    { date: "Jul 3",  ifs: 18, gfs: 15, aifs: 20,  blend: 17.7 },
    { date: "Jul 4",  ifs: 48, gfs: 44, aifs: 55,  blend: 48.3 },
  ],
  Ernakulam: [
    { date: "Jun 28", ifs: 50, gfs: 48, aifs: 58,  blend: 51.2 },
    { date: "Jun 29", ifs: 65, gfs: 60, aifs: 72,  blend: 65.4 },
    { date: "Jun 30", ifs: 88, gfs: 80, aifs: 100, blend: 89.7 },
    { date: "Jul 1",  ifs: 62, gfs: 58, aifs: 70,  blend: 63.0 },
    { date: "Jul 2",  ifs: 45, gfs: 42, aifs: 52,  blend: 45.5 },
    { date: "Jul 3",  ifs: 10, gfs: 12, aifs: 11,  blend: 10.8 },
    { date: "Jul 4",  ifs: 38, gfs: 36, aifs: 45,  blend: 39.0 },
  ],
  Thiruvananthapuram: [
    { date: "Jun 28", ifs: 42, gfs: 40, aifs: 50,  blend: 43.2 },
    { date: "Jun 29", ifs: 58, gfs: 54, aifs: 64,  blend: 58.5 },
    { date: "Jun 30", ifs: 80, gfs: 74, aifs: 92,  blend: 81.0 },
    { date: "Jul 1",  ifs: 55, gfs: 50, aifs: 62,  blend: 55.4 },
    { date: "Jul 2",  ifs: 38, gfs: 36, aifs: 44,  blend: 38.7 },
    { date: "Jul 3",  ifs: 8,  gfs: 10, aifs: 9,   blend: 8.8 },
    { date: "Jul 4",  ifs: 32, gfs: 30, aifs: 38,  blend: 32.9 },
  ],
};

// -------------------------------------------------------
// Spatial weight map data — per district illustrative
// These are NOT experimentally validated spatial weights.
// -------------------------------------------------------
export const SPATIAL_WEIGHTS = {
  Pathanamthitta: { ifs: 0.42, gfs: 0.23, aifs: 0.35 },
  Idukki:          { ifs: 0.30, gfs: 0.25, aifs: 0.45 },
  Wayanad:         { ifs: 0.25, gfs: 0.30, aifs: 0.45 },
  Kottayam:        { ifs: 0.40, gfs: 0.28, aifs: 0.32 },
  Ernakulam:       { ifs: 0.43, gfs: 0.30, aifs: 0.27 },
  Thiruvananthapuram: { ifs: 0.45, gfs: 0.33, aifs: 0.22 },
};

// Regime color helpers (dark theme)
export const REGIME_COLORS = {
  Monsoon:       { bg: "rgba(56,189,248,0.1)",  text: "text-sky-400",    border: "border-sky-500/20" },
  "Non-Monsoon": { bg: "rgba(148,163,184,0.1)", text: "text-slate-400",  border: "border-slate-500/20" },
  "Heavy Rain":  { bg: "rgba(251,113,133,0.1)", text: "text-rose-400",   border: "border-rose-500/20" },
};

// Rainfall intensity categories (dark theme)
export const RAINFALL_CATEGORIES = [
  { max: 10,  label: "Light",      color: "#1e3a5c" },
  { max: 25,  label: "Moderate",   color: "#1e40af" },
  { max: 50,  label: "Heavy",      color: "#2563eb" },
  { max: 100, label: "Very Heavy", color: "#3b82f6" },
  { max: Infinity, label: "Extreme", color: "#60a5fa" },
];
