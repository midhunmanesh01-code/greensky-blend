// ============================================================
// GreenSky Blend — Core Calculation Utilities
// Centralized, verified math for NWP/ML multi-model consensus
// ============================================================

/**
 * Calculate the blended forecast value using learned weights.
 * weights must be an object { ifs, gfs, [aifs] }
 * forecasts must be an object { ifs, gfs, [aifs] } in mm
 * Returns a number rounded to 1 decimal place.
 */
export function calculateBlendedForecast(forecasts, weights) {
  if (!forecasts || !weights) return 0;
  const ifsW = weights.ifs ?? weights.ecmwf ?? 0;
  const gfsW = weights.gfs ?? 0;
  const aifsW = weights.aifs ?? 0;

  const ifsVal = forecasts.ifs ?? forecasts.ecmwf ?? 0;
  const gfsVal = forecasts.gfs ?? 0;
  const aifsVal = forecasts.aifs ?? 0;

  const blended = ifsVal * ifsW + gfsVal * gfsW + aifsVal * aifsW;
  return Math.round(blended * 10) / 10;
}

/**
 * Calculate the equal-weight (50/50 baseline) blended forecast.
 * Baseline comparison against static arithmetic average of NWP sources.
 */
export function calculateEqualWeightForecast(forecasts) {
  if (!forecasts) return 0;
  const ifsVal = forecasts.ifs ?? forecasts.ecmwf ?? 0;
  const gfsVal = forecasts.gfs ?? 0;
  const blended = (ifsVal + gfsVal) / 2.0;
  return Math.round(blended * 10) / 10;
}

/**
 * Convert raw weights object to percentage numbers for display.
 */
export function weightsToPercent(weights) {
  if (!weights) return { ifs: 50, gfs: 50, aifs: 0 };
  const ifs = weights.ifs ?? weights.ecmwf ?? 0;
  const gfs = weights.gfs ?? 0;
  const aifs = weights.aifs ?? 0;
  const total = ifs + gfs + aifs || 1;

  return {
    ifs: Math.round((ifs / total) * 100),
    gfs: Math.round((gfs / total) * 100),
    aifs: Math.round((aifs / total) * 100),
  };
}

/**
 * Verify weights sum to 1.0 (within floating point tolerance).
 */
export function validateWeights(weights) {
  if (!weights) return false;
  const sum = (weights.ifs ?? 0) + (weights.gfs ?? 0) + (weights.aifs ?? 0);
  return Math.abs(sum - 1.0) < 0.01;
}

/**
 * Calculate source contribution data for Recharts donut/pie.
 */
export function calculateSourceContribution(weights) {
  const pct = weightsToPercent(weights);
  const items = [
    { name: "ECMWF IFS", value: pct.ifs, color: "#38bdf8" },
    { name: "NCEP GFS", value: pct.gfs, color: "#34d399" },
  ];
  if (pct.aifs > 0) {
    items.push({ name: "ECMWF AIFS", value: pct.aifs, color: "#a78bfa" });
  }
  return items;
}

/**
 * Calculate individual source contributions in mm.
 */
export function calculateContributionMm(forecasts, weights) {
  if (!forecasts || !weights) return { ifs: 0, gfs: 0, aifs: 0 };
  const ifsVal = forecasts.ifs ?? forecasts.ecmwf ?? 0;
  const gfsVal = forecasts.gfs ?? 0;
  const aifsVal = forecasts.aifs ?? 0;

  const ifsW = weights.ifs ?? weights.ecmwf ?? 0;
  const gfsW = weights.gfs ?? 0;
  const aifsW = weights.aifs ?? 0;

  return {
    ifs: Math.round(ifsVal * ifsW * 10) / 10,
    gfs: Math.round(gfsVal * gfsW * 10) / 10,
    aifs: Math.round(aifsVal * aifsW * 10) / 10,
  };
}

/**
 * Return a confidence label and styling based on consensus confidence score.
 */
export function getConfidenceLevel(confidence) {
  if (confidence >= 0.85) return { label: "High Confidence", color: "text-emerald-400", bg: "rgba(52,211,153,0.1)", border: "border-emerald-500/20" };
  if (confidence >= 0.75) return { label: "Moderate-High",  color: "text-sky-400",     bg: "rgba(56,189,248,0.1)", border: "border-sky-500/20" };
  if (confidence >= 0.65) return { label: "Moderate",       color: "text-amber-400",   bg: "rgba(251,191,36,0.1)", border: "border-amber-500/20" };
  return                          { label: "High Spread",    color: "text-rose-400",    bg: "rgba(251,113,133,0.1)", border: "border-rose-500/20" };
}

/**
 * Source agreement metric — derived from normalized spread between NWP forecasts.
 * Returns a percentage (0–100) representing inter-model agreement.
 */
export function calculateSourceAgreement(forecasts) {
  if (!forecasts) return 80;
  const ec = forecasts.ifs ?? forecasts.ecmwf ?? 0;
  const gfs = forecasts.gfs ?? 0;
  const diff = Math.abs(ec - gfs);
  const mean = (ec + gfs) / 2;
  const relativeSpread = mean > 0 ? diff / (mean + 5.0) : 0;
  const agreement = Math.max(20, Math.min(100, Math.round((1.0 - relativeSpread * 0.5) * 100)));
  return agreement;
}

/**
 * Get color class for rainfall intensity.
 */
export function getRainfallColorClass(mm) {
  if (mm >= 64.5) return "#60a5fa";
  if (mm >= 35.5) return "#3b82f6";
  if (mm >= 15.6) return "#2563eb";
  if (mm >= 5.0)  return "#1e40af";
  return "#1e3a5c";
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable label.
 */
export function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
