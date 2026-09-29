import csv
import json
from pathlib import Path

def load_csv(path):
    with open(path, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))

base_bench = Path(r"..\greensky-benchmark")
corr = load_csv(base_bench / "results" / "corrected_benchmark_results.csv")
exp1 = {r['time']: r for r in load_csv(base_bench / "results" / "regime_blender_results.csv")}
exp2 = {r['time']: r for r in load_csv(base_bench / "results" / "experiment2_results.csv")}
exp3 = {r['time']: r for r in load_csv(base_bench / "results" / "experiment3_results.csv")}
exp4 = {r['time']: r for r in load_csv(base_bench / "results" / "experiment4_results.csv")}

processed_days = []
for r in corr:
    t = r['time']
    rain = float(r['rain'])
    ecmwf = float(r['ecmwf'])
    gfs = float(r['gfs'])
    equal = float(r['equal_blend'])
    
    mean_fc = (ecmwf + gfs) / 2.0
    if mean_fc < 5.0:
        regime = 'Dry (< 5 mm)'
        regime_code = 'Dry'
        w_ec = 1.00
    elif mean_fc < 15.0:
        regime = 'Light (5-15 mm)'
        regime_code = 'Light'
        w_ec = 1.00
    elif mean_fc < 35.0:
        regime = 'Moderate (15-35 mm)'
        regime_code = 'Moderate'
        w_ec = 0.60
    else:
        regime = 'Heavy (>= 35 mm)'
        regime_code = 'Heavy'
        w_ec = 0.45
        
    w_gfs = round(1.0 - w_ec, 2)
    adaptive = round(w_ec * ecmwf + w_gfs * gfs, 2)
    
    entry = {
        'date': t,
        'imd_rain': round(rain, 2),
        'ecmwf': round(ecmwf, 2),
        'gfs': round(gfs, 2),
        'equal_blend': round(equal, 2),
        'regime': regime,
        'regime_code': regime_code,
        'ecmwf_weight': w_ec,
        'gfs_weight': w_gfs,
        'adaptive_blend': adaptive,
        'is_test_exp1': t >= '2025-08-04',
        'is_test_exp2': '2025-07-01' <= t < '2025-08-04',
        'is_heavy': rain >= 15.6,
        'is_extreme': rain >= 64.5,
    }
    
    if t in exp3:
        entry['adaptive_cal'] = round(float(exp3[t]['adaptive_cal']), 2)
    if t in exp4:
        entry['gradboost_atmos'] = round(float(exp4[t]['gradboost_atmos']), 2)
        entry['randforest_atmos'] = round(float(exp4[t]['randforest_atmos']), 2)
        
    processed_days.append(entry)

out_file = Path(r"src\data\benchmarkData.js")

# Also write a JSON file to public/data/benchmark_results.json for direct accessibility
public_data = Path(r"public\data")
public_data.mkdir(parents=True, exist_ok=True)
with open(public_data / "benchmark_results.json", "w", encoding="utf-8") as f:
    json.dump(processed_days, f, indent=2)

js_content = f"""// ============================================================
// GreenSky Blend — Authoritative Benchmark Dataset
// Sourced directly from greensky-benchmark (SIH26081)
// Ground truth: IMD Daily Gridded Rainfall (0.25° × 0.25°)
// Location: Central Kerala / Palakkad Grid Cell (10.75°N, 76.25°E)
// Period: 2025-06-01 to 2025-08-31 (92 monsoon days)
// Alignment: Convention B (03:00 UTC to 03:00 UTC / 08:30 IST)
// ============================================================

export const BENCHMARK_METADATA = {{
  project: "GreenSky Blend — SIH26081",
  benchmarkRepo: "https://github.com/midhunmanesh01-code/greensky-benchmark",
  groundTruthSource: "India Meteorological Department (IMD) 0.25° Gridded Gauge Network (Pai et al. 2014)",
  gridCell: {{
    lat: 10.75,
    lon: 76.25,
    region: "Central Kerala / Palakkad Basin",
  }},
  models: {{
    ecmwf: "ECMWF IFS025 (9km / 0.25° Resolution)",
    gfs: "NOAA NCEP GFS Seamless (13km / 0.25° Resolution)",
    aifs: "ECMWF AIFS (Deep Learning AI Weather Model — Hybrid Research Track)",
  }},
  accumulationConvention: "Convention B: (D-1) 03:00 UTC → D 03:00 UTC (24-hour accumulation ending 08:30 IST)",
  totalDays: 92,
  dateRange: {{
    start: "2025-06-01",
    end: "2025-08-31",
  }},
}};

// 6 Pilot Districts designated for the Kerala demonstration scope
export const PILOT_DISTRICTS = [
  {{
    name: "Pathanamthitta",
    zone: "Southern Western Ghats",
    terrain: "High-range & riverine basin (Pamba River)",
    hazardProfile: "Flash floods, rapid reservoir inflow, orographic rainfall surges",
    stationDist: "Midland to High Range",
    status: "Pilot Demonstration",
  }},
  {{
    name: "Idukki",
    zone: "Central High Ranges",
    terrain: "High-elevation mountainous plateau (Periyar basin, major dams)",
    hazardProfile: "High slope instability, extreme orographic enhancement, landslides",
    stationDist: "High Range Orographic",
    status: "Pilot Demonstration",
  }},
  {{
    name: "Wayanad",
    zone: "Northern Western Ghats",
    terrain: "High-altitude plateau & steep escarpment (Kabini basin)",
    hazardProfile: "Debris flows, localized cloudburst surges, high landslide vulnerability",
    stationDist: "High Range Orographic",
    status: "Pilot Demonstration",
  }},
  {{
    name: "Kottayam",
    zone: "Central Midland & Lowland",
    terrain: "Midland undulating hills draining into Vembanad Lake basin",
    hazardProfile: "Inundation, backwater drainage congestion, riverine flooding",
    stationDist: "Midland Drainage",
    status: "Pilot Demonstration",
  }},
  {{
    name: "Ernakulam",
    zone: "Central Coastal & Urban",
    terrain: "Coastal plains, urban delta & estuary (Periyar mouth)",
    hazardProfile: "Urban flash flooding, tidal lockage, high economic exposure",
    stationDist: "Coastal Plain",
    status: "Pilot Demonstration",
  }},
  {{
    name: "Thiruvananthapuram",
    zone: "Southern Coastal & Midland",
    terrain: "Coastal plain transitioning into Agasthyamala foothills (Karamana basin)",
    hazardProfile: "Urban drainage overflow, localized severe convection",
    stationDist: "Southern Coastal",
    status: "Pilot Demonstration",
  }},
];

export const DISTRICTS = PILOT_DISTRICTS.map((d) => d.name);

// Learned Regime Weights from Experiment 1 (Training Period Jun 1 - Aug 3, 2025)
// Objective: Minimize training MAE via grid search on training split only
export const REGIME_WEIGHTS = {{
  Dry: {{
    label: "Dry (< 5 mm)",
    ecmwf: 1.00,
    gfs: 0.00,
    note: "ECMWF superior in suppressing false rain over dry spells",
  }},
  Light: {{
    label: "Light (5-15 mm)",
    ecmwf: 1.00,
    gfs: 0.00,
    note: "ECMWF optimal on light stratiform events",
  }},
  Moderate: {{
    label: "Moderate (15-35 mm)",
    ecmwf: 0.60,
    gfs: 0.40,
    note: "Dual-model synthesis reduces single-model systematic bias",
  }},
  Heavy: {{
    label: "Heavy (>= 35 mm)",
    ecmwf: 0.45,
    gfs: 0.55,
    note: "GFS receives higher weight on intense convective surges",
  }},
}};

// Complete 92-day historical monsoon benchmark records
export const BENCHMARK_DAYS = {json.dumps(processed_days, indent=2)};

// Fast date lookup map
export const BENCHMARK_LOOKUP = Object.fromEntries(
  BENCHMARK_DAYS.map((d) => [d.date, d])
);

// All 92 valid dates in chronological order
export const ALL_BENCHMARK_DATES = BENCHMARK_DAYS.map((d) => d.date);

// Curated selection of representative benchmark dates for quick operational inspection
export const REPRESENTATIVE_DATES = [
  "2025-08-28", // Heavy surge event (IMD: 41.2 mm, ECMWF: 34.4, GFS: 62.2, Blend: 49.7)
  "2025-08-15", // Severe monsoon peak (IMD: 51.4 mm, ECMWF: 21.5, GFS: 1.4, Blend: 13.5)
  "2025-08-16", // Severe monsoon peak Day 2 (IMD: 50.1 mm, ECMWF: 17.0, GFS: 4.1, Blend: 11.8)
  "2025-08-31", // Monsoon closing event (IMD: 24.8 mm, ECMWF: 14.5, GFS: 5.6, Blend: 14.5)
  "2025-08-12", // Moderate rain day (IMD: 17.2 mm, ECMWF: 8.2, GFS: 2.7, Blend: 8.2)
  "2025-08-04", // Locked test set start (IMD: 7.9 mm, ECMWF: 15.6, GFS: 12.0, Blend: 15.6)
  "2025-07-25", // Extreme event (IMD: 69.3 mm, ECMWF: 17.0, GFS: 5.4, Blend: 17.0)
  "2025-07-17", // July peak event (IMD: 52.2 mm, ECMWF: 31.3, GFS: 24.5, Blend: 28.6)
  "2025-06-26", // Maximum season event (IMD: 95.6 mm, ECMWF: 13.2, GFS: 21.0, Blend: 16.7)
  "2025-06-16", // Torrential monsoon day (IMD: 69.5 mm, ECMWF: 71.3, GFS: 39.1, Blend: 53.6)
  "2025-06-01", // Monsoon onset baseline (IMD: 1.6 mm, ECMWF: 7.3, GFS: 12.8, Blend: 7.3)
];

export const DATES = REPRESENTATIVE_DATES;

// Authoritative Experiment Metrics directly from benchmark evaluations
export const EXPERIMENT_METRICS = {{
  experiment1_regime: {{
    title: "Experiment 1: Regime-Conditioned Adaptive Blender",
    split: "Train: 2025-06-01 to 2025-08-03 (64 days) | Test: 2025-08-04 to 2025-08-31 (28 days, LOCKED UNSEEN)",
    status: "Historical Benchmark (Locked Test)",
    models: [
      {{
        name: "ECMWF IFS",
        type: "Physics NWP (9km)",
        mae: 9.03,
        rmse: 12.54,
        csi15: 0.286,
        csi64: null,
        hits15: 4,
        misses15: 5,
        fa15: 5,
      }},
      {{
        name: "NCEP GFS",
        type: "Physics NWP (13km)",
        mae: 10.80,
        rmse: 16.27,
        csi15: 0.167,
        csi64: null,
        hits15: 2,
        misses15: 7,
        fa15: 3,
      }},
      {{
        name: "Equal-Weight Ensemble",
        type: "Fixed 50/50 Blend",
        mae: 9.02,
        rmse: 13.62,
        csi15: 0.083,
        csi64: null,
        hits15: 1,
        misses15: 8,
        fa15: 3,
      }},
      {{
        name: "GreenSky Adaptive Blend",
        type: "Regime-Conditioned ML",
        mae: 8.80,
        rmse: 12.30,
        csi15: 0.286,
        csi64: null,
        hits15: 4,
        misses15: 5,
        fa15: 5,
        highlight: true,
      }},
    ],
    verdict: "Adaptive Blend achieves lowest MAE (8.80 mm) and RMSE (12.30 mm), outperforming Equal Blend (9.02 mm / 13.62 mm) and standalone GFS (10.80 mm / 16.27 mm).",
  }},
  experiment2_robustness: {{
    title: "Experiment 2: Temporal Sub-Period Robustness Test",
    split: "Train: 2025-06-01 to 2025-06-30 (30 days) | Test: 2025-07-01 to 2025-08-03 (34 days, non-overlapping)",
    status: "Robustness Evaluation",
    models: [
      {{ name: "ECMWF IFS", mae: 12.16, rmse: 16.70, csi15: 0.333, csi64: 0.000 }},
      {{ name: "NCEP GFS", mae: 13.43, rmse: 18.73, csi15: 0.125, csi64: 0.000 }},
      {{ name: "Equal-Weight Ensemble", mae: 12.19, rmse: 17.23, csi15: 0.250, csi64: 0.000 }},
      {{ name: "GreenSky Adaptive Blend", mae: 11.70, rmse: 16.70, csi15: 0.235, csi64: 0.000, highlight: true }},
    ],
    verdict: "Adaptive blend achieves lowest MAE (11.70 mm) across 34 peak-monsoon test days, reducing error relative to Equal Blend (12.19 mm) and standalone GFS (13.43 mm).",
  }},
  experiment3_calibration: {{
    title: "Experiment 3: Extreme-Rainfall Post-Processing Calibration",
    split: "Bin-based multiplicative calibration factors applied to adaptive forecast",
    status: "Experimental Calibration",
    models: [
      {{ name: "Adaptive Baseline", mae: 8.80, rmse: 12.30, csi15: 0.286, hits15: 4, misses15: 5, fa15: 5 }},
      {{ name: "Adaptive + CalCorr", mae: 9.48, rmse: 12.41, csi15: 0.312, hits15: 5, misses15: 4, fa15: 7, highlight: true }},
    ],
    verdict: "Multiplicative calibration increases CSI@15.6 to 0.312 (5 Hits vs 4 Hits) by correcting proportional underforecasting bias in Moderate/Heavy bins, but reveals structural ceiling for Type B events.",
  }},
  experiment4_atmospheric: {{
    title: "Experiment 4: Multi-Variable Atmospheric Context ML",
    split: "20+ atmospheric features (CAPE, Lifted Index, RH, Wind 10m/80m, Surface Pressure) from NWP reanalysis/forecasts",
    status: "Research Prototype",
    models: [
      {{ name: "Adaptive Baseline (Exp 1)", mae: 8.80, rmse: 12.30, csi15: 0.286, hits15: 4, misses15: 5, fa15: 5 }},
      {{ name: "Gradient Boosting + Atmos", mae: 11.22, rmse: 13.92, csi15: 0.444, hits15: 8, misses15: 1, fa15: 9 }},
      {{ name: "Random Forest + Atmos", mae: 10.39, rmse: 12.62, csi15: 0.471, hits15: 8, misses15: 1, fa15: 8, highlight: true }},
    ],
    verdict: "Atmospheric context dramatically increases extreme detection (8 Hits out of 9 observed events, CSI 0.471 vs 0.286), though small training size necessitates multi-season expansion.",
  }},
}};

// Historical Replay Sequences from the real benchmark
export const HISTORICAL_REPLAY_SEQUENCES = {{
  locked_test: {{
    name: "Locked Test Set (Aug 04 – Aug 31, 2025)",
    desc: "Chronological unseen 28-day evaluation period matching Experiment 1",
    days: BENCHMARK_DAYS.filter((d) => d.is_test_exp1),
  }},
  aug_peak_surge: {{
    name: "August Heavy Rain Surge (Aug 14 – Aug 20, 2025)",
    desc: "Back-to-back torrential days with IMD rain exceeding 50 mm/day",
    days: BENCHMARK_DAYS.filter((d) => d.date >= "2025-08-14" && d.date <= "2025-08-20"),
  }},
  july_monsoon_peak: {{
    name: "July Peak Monsoon Window (Jul 22 – Jul 28, 2025)",
    desc: "Includes the season extreme 69.3 mm/day event on July 25",
    days: BENCHMARK_DAYS.filter((d) => d.date >= "2025-07-22" && d.date <= "2025-07-28"),
  }},
  june_onset_surge: {{
    name: "June Torrential Inception (Jun 14 – Jun 20, 2025)",
    desc: "Monsoon onset surge with consecutive heavy days (58.6 mm, 69.5 mm, 53.9 mm)",
    days: BENCHMARK_DAYS.filter((d) => d.date >= "2025-06-14" && d.date <= "2025-06-20"),
  }},
  full_season: {{
    name: "Complete Monsoon Season (Jun 01 – Aug 31, 2025)",
    desc: "Full 92-day benchmark dataset across 2025 Southwest Monsoon",
    days: BENCHMARK_DAYS,
  }},
}};

// Categorical Contingency Matrix for Threshold >= 15.6 mm (Exp 1 Locked Test, n=28 days, 9 observed events)
export const CONTINGENCY_15_6 = {{
  threshold: 15.6,
  observedEvents: 9,
  nonEvents: 19,
  totalDays: 28,
  models: {{
    adaptive: {{
      name: "GreenSky Adaptive Blend",
      hits: 4,
      misses: 5,
      falseAlarms: 5,
      correctRejections: 14,
      csi: 0.286,
      pod: 0.444,
      far: 0.556,
    }},
    equal: {{
      name: "Equal-Weight Ensemble",
      hits: 1,
      misses: 8,
      falseAlarms: 3,
      correctRejections: 16,
      csi: 0.083,
      pod: 0.111,
      far: 0.750,
    }},
    ecmwf: {{
      name: "ECMWF IFS",
      hits: 4,
      misses: 5,
      falseAlarms: 5,
      correctRejections: 14,
      csi: 0.286,
      pod: 0.444,
      far: 0.556,
    }},
    gfs: {{
      name: "NCEP GFS",
      hits: 2,
      misses: 7,
      falseAlarms: 3,
      correctRejections: 16,
      csi: 0.167,
      pod: 0.222,
      far: 0.600,
    }},
    rf_atmos: {{
      name: "Random Forest + Atmos ML (Exp 4)",
      hits: 8,
      misses: 1,
      falseAlarms: 8,
      correctRejections: 11,
      csi: 0.471,
      pod: 0.889,
      far: 0.500,
    }},
  }},
}};

// All 33 Heavy Rainfall Events (>= 15.6 mm) from the 92-day benchmark
export const HEAVY_RAIN_DAYS = BENCHMARK_DAYS.filter((d) => d.is_heavy);

// Extreme Rainfall Events (>= 64.5 mm)
export const EXTREME_RAIN_DAYS = BENCHMARK_DAYS.filter((d) => d.is_extreme);
"""

with open(out_file, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated {out_file} successfully! ({len(js_content)} bytes)")
