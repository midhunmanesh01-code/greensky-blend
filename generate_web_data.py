import csv
import json
from pathlib import Path

def load_csv(path):
    with open(path, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))

base_bench = Path(r"..\greensky-benchmark")

# 1. Load Original Palakkad Benchmark Files
corr = load_csv(base_bench / "results" / "corrected_benchmark_results.csv")
exp1 = {r['time']: r for r in load_csv(base_bench / "results" / "regime_blender_results.csv")}
exp2 = {r['time']: r for r in load_csv(base_bench / "results" / "experiment2_results.csv")}
exp3 = {r['time']: r for r in load_csv(base_bench / "results" / "experiment3_results.csv")}
exp4 = {r['time']: r for r in load_csv(base_bench / "results" / "experiment4_results.csv")}

original_benchmark_days = []
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
        
    original_benchmark_days.append(entry)

# 2. Load Phase 3 Multi-District Outputs
multi_dir = base_bench / "multi_district"
with open(multi_dir / "data" / "processed" / "districts_metadata.json", "r", encoding="utf-8") as f:
    meta_json = json.load(f)
districts_cfg = meta_json["districts"]

metrics_csv = load_csv(multi_dir / "results" / "comparative_metrics_table.csv")
weights_csv = load_csv(multi_dir / "results" / "district_learned_weights.csv")

# Process District Metrics Table
district_metrics = {}
for row in metrics_csv:
    dist_name = row['district']
    mname = row['method']
    if dist_name not in district_metrics:
        district_metrics[dist_name] = {}
        
    def safe_float(v):
        try:
            return None if v in ('', 'nan', 'NaN', 'N/A') else round(float(v), 3)
        except:
            return None

    def safe_int(v):
        try:
            return None if v in ('', 'nan', 'NaN', 'N/A') else int(float(v))
        except:
            return None

    district_metrics[dist_name][mname] = {
        'method': mname,
        'mae': safe_float(row['mae']),
        'rmse': safe_float(row['rmse']),
        'bias': safe_float(row['bias']),
        'csi_15_6': safe_float(row.get('csi_15_6')),
        'hits_15_6': safe_int(row.get('hits_15_6')),
        'misses_15_6': safe_int(row.get('misses_15_6')),
        'fa_15_6': safe_int(row.get('fa_15_6')),
        'obs_events_15_6': safe_int(row.get('obs_events_15_6')),
        'fct_events_15_6': safe_int(row.get('fct_events_15_6')),
        'csi_64_5': safe_float(row.get('csi_64_5')),
        'test_days': safe_int(row.get('test_days')),
    }

# Process District Learned Weights
district_learned_weights = {}
for row in weights_csv:
    dist_name = row['district']
    if dist_name not in district_learned_weights:
        district_learned_weights[dist_name] = []
    district_learned_weights[dist_name].append({
        'regime_id': int(row['regime_id']),
        'regime_name': row['regime_name'],
        'n_train': int(row['n_train']),
        'learned_w_ecmwf': float(row['learned_w_ecmwf']),
        'learned_w_gfs': float(row['learned_w_gfs']),
        'transferred_w_ecmwf': float(row['transferred_w_ecmwf']),
        'transferred_w_gfs': float(row['transferred_w_gfs']),
        'note': row['note']
    })

# Process Full 92-Day District Series & 28-Day Test Evaluations
district_daily_data = {}
for dist in districts_cfg:
    did = dist['id']
    dname = dist['name']
    
    proc_rows = load_csv(multi_dir / "data" / "processed" / f"{did}.csv")
    eval_rows = {r['date']: r for r in load_csv(multi_dir / "results" / f"{did}_eval.csv")}
    
    # District learned weights map for training days (or transferred for test days)
    w_map = {item['regime_id']: item['learned_w_ecmwf'] for item in district_learned_weights[dname]}
    
    days_list = []
    for r in proc_rows:
        date_str = r['date']
        rain = float(r['rain'])
        ecmwf = float(r['ecmwf'])
        gfs = float(r['gfs'])
        equal = float(r['equal_blend'])
        is_test = r['split'] == 'test'
        
        mean_fc = (ecmwf + gfs) / 2.0
        if mean_fc < 5.0:
            regime = 'Dry (< 5 mm)'
            regime_id = 0
            regime_code = 'Dry'
        elif mean_fc < 15.0:
            regime = 'Light (5-15 mm)'
            regime_id = 1
            regime_code = 'Light'
        elif mean_fc < 35.0:
            regime = 'Moderate (15-35 mm)'
            regime_id = 2
            regime_code = 'Moderate'
        else:
            regime = 'Heavy (>= 35 mm)'
            regime_id = 3
            regime_code = 'Heavy'
            
        transferred_w_ec = 1.00 if regime_id in (0, 1) else (0.60 if regime_id == 2 else 0.45)
        transferred_blend = round(transferred_w_ec * ecmwf + (1.0 - transferred_w_ec) * gfs, 2)
        
        district_w_ec = w_map[regime_id]
        district_blend = round(district_w_ec * ecmwf + (1.0 - district_w_ec) * gfs, 2)
        
        days_list.append({
            'date': date_str,
            'district': dname,
            'district_id': did,
            'lat': float(r['lat']),
            'lon': float(r['lon']),
            'elevation_m': float(r['elevation_m']),
            'imd_rain': round(rain, 2),
            'ecmwf': round(ecmwf, 2),
            'gfs': round(gfs, 2),
            'equal_blend': round(equal, 2),
            'transferred_blend': transferred_blend,
            'district_blend': district_blend,
            'regime': regime,
            'regime_code': regime_code,
            'transferred_w_ec': transferred_w_ec,
            'transferred_w_gfs': round(1.0 - transferred_w_ec, 2),
            'district_w_ec': district_w_ec,
            'district_w_gfs': round(1.0 - district_w_ec, 2),
            'is_test': is_test,
            'is_heavy': rain >= 15.6,
            'is_extreme': rain >= 64.5
        })
        
    district_daily_data[dname] = days_list

# Enhanced Pilot District Configurations
pilot_district_configs = [
    {
        "id": "pathanamthitta",
        "name": "Pathanamthitta",
        "lat": 9.25,
        "lon": 76.75,
        "elevation_m": 15.0,
        "hq_name": "Pathanamthitta Town",
        "hq_distance_km": 4.35,
        "zone": "Central Midland",
        "terrain": "Central midland agricultural corridor along Pamba & Achankovil river valleys",
        "hazardProfile": "Flash floods, riverine overflow, reservoir catchment surges",
        "status": "Verified Pilot Cell",
        "limitations": "Cell represents the populated midland basin; does not cover the eastern Sabarimala/Ranni high-altitude forest reserves (>1000m MSL).",
        "sourceFile": "multi_district/data/processed/pathanamthitta.csv"
    },
    {
        "id": "idukki",
        "name": "Idukki",
        "lat": 9.75,
        "lon": 77.00,
        "elevation_m": 826.0,
        "hq_name": "Painavu (District HQ)",
        "hq_distance_km": 12.60,
        "zone": "Mountain Plateau & Dam Catchment",
        "terrain": "High-relief Western Ghats plateau (826m MSL) centered on the Idukki Dam & Reservoir",
        "hazardProfile": "High-slope runoff, reservoir inflow surges, slope destabilization",
        "status": "Verified Pilot Cell",
        "limitations": "Cell models the central Periyar reservoir catchment; does not capture the extreme orographic precipitation of Munnar/High Ranges (10.00°N, 77.00°E, >1600m MSL).",
        "sourceFile": "multi_district/data/processed/idukki.csv"
    },
    {
        "id": "wayanad",
        "name": "Wayanad",
        "lat": 11.75,
        "lon": 76.00,
        "elevation_m": 766.0,
        "hq_name": "Kalpetta",
        "hq_distance_km": 18.00,
        "zone": "High-Altitude Interior Plateau",
        "terrain": "Elevated agricultural plateau (766m MSL) centered on Mananthavady & Kabini basin",
        "hazardProfile": "Localized cloudburst runoff, plateau drainage congestion",
        "status": "Verified Pilot Cell",
        "limitations": "Cell represents the high interior plateau; excludes the extreme landslide-vulnerable western escarpment (Vythiri-Meppadi, 11.50°N, 76.00°E) to prevent boundary mixing with Kozhikode plains.",
        "sourceFile": "multi_district/data/processed/wayanad.csv"
    },
    {
        "id": "kottayam",
        "name": "Kottayam",
        "lat": 9.50,
        "lon": 76.50,
        "elevation_m": 0.0,
        "hq_name": "Kottayam Town",
        "hq_distance_km": 10.40,
        "zone": "Midland Basin & Wetlands Margin",
        "terrain": "Low midland undulating hills and alluvial plain draining into Vembanad Lake",
        "hazardProfile": "Inundation, backwater drainage lockage, waterlogging",
        "status": "Verified Pilot Cell",
        "limitations": "Cell represents the central midland and Vembanad wetlands margin; does not cover the eastern Western Ghat foothills near Kanjirappally/Poonjar.",
        "sourceFile": "multi_district/data/processed/kottayam.csv"
    },
    {
        "id": "ernakulam",
        "name": "Ernakulam",
        "lat": 10.00,
        "lon": 76.25,
        "elevation_m": 3.0,
        "hq_name": "Kakkanad / Kochi",
        "hq_distance_km": 11.89,
        "zone": "Coastal Estuary & Urban Hub",
        "terrain": "Coastal plains, urban delta, shipping channels & estuarine floodplains (3m MSL)",
        "hazardProfile": "Urban flash flooding, tidal lockage, high economic & infrastructure exposure",
        "status": "Verified Pilot Cell",
        "limitations": "Cell covers Greater Cochin and the coastal marine boundary; does not reflect the eastern forested midlands near Kothamangalam.",
        "sourceFile": "multi_district/data/processed/ernakulam.csv"
    },
    {
        "id": "thiruvananthapuram",
        "name": "Thiruvananthapuram",
        "lat": 8.50,
        "lon": 77.00,
        "elevation_m": 22.0,
        "hq_name": "Statue / Secretariat",
        "hq_distance_km": 7.53,
        "zone": "Southern Coastal & Midland",
        "terrain": "State capital midlands, Karamana basin, and historic IMD Observatory Hill (22m MSL)",
        "hazardProfile": "Urban drainage overflow, localized severe convection",
        "status": "Verified Pilot Cell",
        "limitations": "Cell directly covers the city and IMD Regional Centre; does not cover the southern Western Ghat crest at Agasthyamala/Ponmudi (>1500m MSL).",
        "sourceFile": "multi_district/data/processed/thiruvananthapuram.csv"
    }
]

# Write Public JSON for direct static fetch
public_data = Path(r"public\data")
public_data.mkdir(parents=True, exist_ok=True)

with open(public_data / "benchmark_results.json", "w", encoding="utf-8") as f:
    json.dump(original_benchmark_days, f, indent=2)

with open(public_data / "multi_district_results.json", "w", encoding="utf-8") as f:
    json.dump({
        "metadata": meta_json,
        "configs": pilot_district_configs,
        "metrics": district_metrics,
        "weights": district_learned_weights,
        "daily_data": district_daily_data
    }, f, indent=2)

print("Generated public/data/multi_district_results.json successfully!")

# Format JavaScript Export File
js_content = f"""// ============================================================
// GreenSky Blend — Multi-District Authoritative Dataset
// Sourced directly from greensky-benchmark (SIH26081)
// Phase 3 Multi-District Pilot Evaluation (Monsoon 2025)
// Ground truth: IMD Daily Gridded Rainfall (0.25° × 0.25°)
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

// Verified 6 Pilot District Configurations
export const PILOT_DISTRICTS = {json.dumps(pilot_district_configs, indent=2)};

export const DISTRICTS = PILOT_DISTRICTS.map((d) => d.name);

// Transferred Regime Weights from Palakkad Single-Cell Benchmark (SIH26081 Exp 1)
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

// Phase 3 Comparative Triad Metrics Table (All 6 Districts + Aggregates)
export const DISTRICT_METRICS = {json.dumps(district_metrics, indent=2)};

// Phase 3 District-Specific Learned Weights vs Transferred Baseline
export const DISTRICT_LEARNED_WEIGHTS = {json.dumps(district_learned_weights, indent=2)};

// Full 92-Day Historical Time Series per Pilot District
export const DISTRICT_DAILY_DATA = {json.dumps(district_daily_data, indent=2)};

// Original Single-Cell Benchmark 92-Day Historical Dataset
export const BENCHMARK_DAYS = {json.dumps(original_benchmark_days, indent=2)};

// Fast date lookup map
export const BENCHMARK_LOOKUP = Object.fromEntries(
  BENCHMARK_DAYS.map((d) => [d.date, d])
);

// All 92 valid dates in chronological order
export const ALL_BENCHMARK_DATES = BENCHMARK_DAYS.map((d) => d.date);

// Curated selection of representative dates
export const REPRESENTATIVE_DATES = [
  "2025-08-28", // Heavy surge event
  "2025-08-15", // Severe monsoon peak
  "2025-08-16", // Severe monsoon peak Day 2
  "2025-08-31", // Monsoon closing event
  "2025-08-12", // Moderate rain day
  "2025-08-04", // Locked test set start
  "2025-07-25", // Extreme event
  "2025-07-17", // July peak event
  "2025-06-26", // Maximum season event
  "2025-06-16", // Torrential monsoon day
  "2025-06-01", // Monsoon onset baseline
];

export const DATES = REPRESENTATIVE_DATES;

// Single-cell experiment metrics for reference
export const EXPERIMENT_METRICS = {{
  experiment1_regime: {{
    id: "experiment1_regime",
    title: "Experiment 1: Regime-Conditioned Adaptive Blender",
    split: "Chronological: Train (Jun 1–Aug 3, 64d) / Test (Aug 4–31, 28d)",
    status: "Authoritative Single-Cell Baseline (Convention B)",
    models: [
      {{ name: "Transferred Benchmark Blend", mae: 5.43, rmse: 8.35, csi_15_6: 0.286, hits: 4, misses: 5, falseAlarms: 5 }},
      {{ name: "ECMWF IFS025", mae: 5.67, rmse: 8.63, csi_15_6: 0.286, hits: 4, misses: 5, falseAlarms: 5 }},
      {{ name: "NOAA GFS Seamless", mae: 6.94, rmse: 10.59, csi_15_6: 0.167, hits: 2, misses: 7, falseAlarms: 3 }},
      {{ name: "Equal-Weight Ensemble", mae: 5.86, rmse: 8.92, csi_15_6: 0.083, hits: 1, misses: 8, falseAlarms: 3 }},
    ]
  }},
  experiment2_robustness: {{
    id: "experiment2_robustness",
    title: "Experiment 2: Temporal Sub-Period Robustness",
    split: "Chronological Sub-Period: Train (June 30d) / Test (Jul 1–Aug 3, 34d)",
    status: "Validated Stability on Peak Monsoon Events",
    models: [
      {{ name: "Regime-Conditioned Adaptive Blend", mae: 8.31, rmse: 12.16, csi_15_6: 0.476, hits: 10, misses: 2, falseAlarms: 9 }},
      {{ name: "ECMWF IFS", mae: 8.89, rmse: 12.87, csi_15_6: 0.450, hits: 9, misses: 3, falseAlarms: 8 }},
      {{ name: "Equal-Weight Ensemble", mae: 9.35, rmse: 13.91, csi_15_6: 0.429, hits: 9, misses: 3, falseAlarms: 9 }},
      {{ name: "NCEP GFS", mae: 10.82, rmse: 16.42, csi_15_6: 0.353, hits: 6, misses: 6, falseAlarms: 5 }},
    ]
  }},
  experiment3_calibration: {{
    id: "experiment3_calibration",
    title: "Experiment 3: Extreme Precipitation Post-Calibration",
    split: "Locked Test Split (Aug 4–31, 2025, 28d)",
    status: "Quantile & Threshold Calibration Evaluation",
    models: [
      {{ name: "Calibrated Adaptive Blend", mae: 5.39, rmse: 8.31, csi_15_6: 0.312, hits: 5, misses: 4, falseAlarms: 5 }},
      {{ name: "Uncalibrated Adaptive Blend", mae: 5.43, rmse: 8.35, csi_15_6: 0.286, hits: 4, misses: 5, falseAlarms: 5 }},
      {{ name: "ECMWF Baseline", mae: 5.67, rmse: 8.63, csi_15_6: 0.286, hits: 4, misses: 5, falseAlarms: 5 }},
    ]
  }},
  experiment4_atmospheric: {{
    id: "experiment4_atmospheric",
    title: "Experiment 4: Multi-Variable Atmospheric Context ML",
    split: "Locked Test Split (Aug 4–31, 2025, 28d)",
    status: "Physically-Conditioned ML Regressors",
    models: [
      {{ name: "Random Forest + Atmospheric ML", mae: 5.12, rmse: 7.89, csi_15_6: 0.471, hits: 8, misses: 1, falseAlarms: 8 }},
      {{ name: "Gradient Boosting + Atmos ML", mae: 5.28, rmse: 8.12, csi_15_6: 0.444, hits: 8, misses: 1, falseAlarms: 9 }},
      {{ name: "Adaptive Regime Blend (Exp 1)", mae: 5.43, rmse: 8.35, csi_15_6: 0.286, hits: 4, misses: 5, falseAlarms: 5 }},
    ]
  }}
}};

export const CONTINGENCY_15_6 = {{
  title: "Categorical Heavy Rain Skill (>= 15.6 mm/day) — 28-Day Locked Test",
  threshold_mm: 15.6,
  observedEvents: 9,
  dryEvents: 19,
  models: {{
    adaptive: {{
      name: "Adaptive Regime Blend",
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
  }},
}};

export const HEAVY_RAIN_DAYS = BENCHMARK_DAYS.filter((d) => d.is_heavy);
export const EXTREME_RAIN_DAYS = BENCHMARK_DAYS.filter((d) => d.is_extreme);
"""

out_js_file = Path(r"src\data\benchmarkData.js")
with open(out_js_file, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated {out_js_file} successfully! ({len(js_content)} bytes)")
