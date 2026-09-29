// ============================================================
// GreenSky Blend — Core Calculation Utilities
// All forecast math is centralized here.
// ============================================================

/**
 * Calculate the blended forecast value using weighted sum.
 * weights must be an object { ifs, gfs, aifs } summing to 1.0
 * forecasts must be an object { ifs, gfs, aifs } in mm
 * Returns a number rounded to 1 decimal place.
 */
export function calculateBlendedForecast(forecasts, weights) {
  const blended =
    forecasts.ifs * weights.ifs +
    forecasts.gfs * weights.gfs +
    forecasts.aifs * weights.aifs;
  return Math.round(blended * 10) / 10;
}

/**
 * Calculate the equal-weight (fixed) blended forecast.
 * Each source receives 1/3 weight.
 */
export function calculateEqualWeightForecast(forecasts) {
  const w = 1 / 3;
  const blended = (forecasts.ifs + forecasts.gfs + forecasts.aifs) * w;
  return Math.round(blended * 10) / 10;
}

/**
 * Convert raw weights object to percentage strings for display.
 */
export function weightsToPercent(weights) {
  return {
    ifs: Math.round(weights.ifs * 100),
    gfs: Math.round(weights.gfs * 100),
    aifs: Math.round(weights.aifs * 100),
  };
}

/**
 * Verify weights sum to 1.0 (within floating point tolerance).
 */
export function validateWeights(weights) {
  const sum = weights.ifs + weights.gfs + weights.aifs;
  return Math.abs(sum - 1.0) < 0.001;
}

/**
 * Calculate source contribution data for Recharts donut/pie.
 */
export function calculateSourceContribution(weights) {
  const pct = weightsToPercent(weights);
  return [
    { name: "ECMWF IFS", value: pct.ifs,  color: "#38bdf8" },
    { name: "NCEP GFS",  value: pct.gfs,  color: "#34d399" },
    { name: "ECMWF AIFS",value: pct.aifs, color: "#a78bfa" },
  ];
}

/**
 * Calculate individual source contributions in mm.
 */
export function calculateContributionMm(forecasts, weights) {
  return {
    ifs:  Math.round(forecasts.ifs  * weights.ifs  * 10) / 10,
    gfs:  Math.round(forecasts.gfs  * weights.gfs  * 10) / 10,
    aifs: Math.round(forecasts.aifs * weights.aifs * 10) / 10,
  };
}

/**
 * Return a confidence label and color based on raw confidence value.
 */
export function getConfidenceLevel(confidence) {
  if (confidence >= 0.85) return { label: "Very High", color: "text-emerald-400", bg: "rgba(52,211,153,0.1)", border: "border-emerald-500/20" };
  if (confidence >= 0.75) return { label: "High",      color: "text-sky-400",     bg: "rgba(56,189,248,0.1)", border: "border-sky-500/20" };
  if (confidence >= 0.65) return { label: "Moderate",  color: "text-amber-400",   bg: "rgba(251,191,36,0.1)", border: "border-amber-500/20" };
  return                          { label: "Low",       color: "text-rose-400",    bg: "rgba(251,113,133,0.1)", border: "border-rose-500/20" };
}

/**
 * Source agreement metric — derived from normalized spread between sources.
 * Returns a percentage (0–100) representing inter-source agreement.
 */
export function calculateSourceAgreement(forecasts) {
  const values = [forecasts.ifs, forecasts.gfs, forecasts.aifs];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const maxDiff = Math.max(...values) - Math.min(...values);
  // Spread as % of mean; lower spread → higher agreement
  const spread = mean > 0 ? maxDiff / mean : 0;
  const agreement = Math.max(0, Math.min(100, Math.round((1 - spread * 0.6) * 100)));
  return agreement;
}

/**
 * Get color class for rainfall intensity.
 */
export function getRainfallColorClass(mm) {
  if (mm >= 100) return "#60a5fa";
  if (mm >= 50)  return "#3b82f6";
  if (mm >= 25)  return "#2563eb";
  if (mm >= 10)  return "#1e40af";
  return "#1e3a5c";
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable label.
 */
export function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
