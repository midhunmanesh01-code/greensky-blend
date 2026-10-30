# 🌦️ GreenSky Blend

> **An ML-based operational consensus framework and interactive decision support platform for multi-model precipitation forecasting across Kerala.**  
> *Developed for Smart India Hackathon 2026 · Problem Statement SIH26081 (Disaster Management Category) · Team NEXA_CHN*

[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint-orange)](https://oxc.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENCE.md)
[![Benchmark Source](https://img.shields.io/badge/Source_of_Truth-greensky--benchmark-blue)](https://github.com/midhunmanesh01-code/greensky-benchmark)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [The Core Meteorological Challenge](#-the-core-meteorological-challenge)
- [Scientific Innovations](#-scientific-innovations)
  - [1. Convention B Temporal Alignment (03:00 UTC)](#1-convention-b-temporal-alignment-0300-utc)
  - [2. Regime-Conditioned Adaptive ML Blending](#2-regime-conditioned-adaptive-ml-blending)
  - [3. Zero-Lookahead Chronological Validation](#3-zero-lookahead-chronological-validation)
- [Kerala 6-District Pilot Network](#-kerala-6-district-pilot-network)
- [Application Modules & Interactive Views](#-application-modules--interactive-views)
- [Empirical Benchmark Results](#-empirical-benchmark-results)
- [System Architecture & Technology Stack](#-system-architecture--technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Execution](#installation--local-execution)
  - [Data Pipeline Re-generation](#data-pipeline-re-generation)
- [Authoritative References](#-authoritative-references)
- [License](#-license)

---

## 🔭 Overview

**GreenSky Blend** is an operational meteorological consensus intelligence platform designed to address the critical challenge of extreme monsoon rainfall prediction over complex tropical and orographic terrain.

Global Numerical Weather Prediction (NWP) models—such as the **European Centre for Medium-Range Weather Forecasts (ECMWF IFS025)** and the **NOAA NCEP Global Forecast System (GFS Seamless)**—frequently disagree on rainfall timing, spatial centroid location, and precipitation intensity during southwest monsoon events. Such discrepancies induce severe forecast uncertainty, leading either to missed warnings (threatening public safety) or unnecessary false alarms (triggering economic disruption and warning fatigue).

GreenSky Blend bridges the gap between raw global NWP model outputs and district-level disaster management by:
1. **Harmonizing observation and forecast time horizons** to the official India Meteorological Department (IMD) 08:30 IST gauge accumulation window (**Convention B**).
2. **Dynamically learning optimal convex weights** conditioned on forecast rainfall regimes to minimize daily forecast errors.
3. **Surfacing high-conviction decision-support telemetry**, inter-model spread metrics, and actionable threshold alerts across high-risk districts in Kerala.

```
┌───────────────────────────────┐     ┌───────────────────────────────┐
│          ECMWF IFS            │     │           NOAA GFS            │
│   (9km Native Resolution)     │     │   (13km Native Resolution)    │
└──────────────┬────────────────┘     └──────────────┬────────────────┘
               │                                     │
               ▼                                     ▼
        ┌───────────────────────────────────────────────────┐
        │        Convention B Temporal Accumulation         │
        │   Aligns (D-1) 03:00 UTC → D 03:00 UTC (08:30 IST) │
        │     Eliminates 5.5-hour UTC phase discrepancy     │
        └─────────────────────────┬─────────────────────────┘
                                  │
                                  ▼
        ┌───────────────────────────────────────────────────┐
        │       Precipitation Regime Classification         │
        │  Dry (<5mm) | Light (5-15mm) | Moderate | Heavy   │
        └─────────────────────────┬─────────────────────────┘
                                  │
                                  ▼
        ┌───────────────────────────────────────────────────┐
        │       Adaptive Convex Optimization (w_ec, w_gfs)  │
        │             ∑ w_i = 1  |  Zero Lookahead          │
        └─────────────────────────┬─────────────────────────┘
                                  │
                                  ▼
        ┌───────────────────────────────────────────────────┐
        │         GreenSky Blend Consensus Engine           │
        │   MAE: 5.43mm · RMSE: 8.35mm · Outperforms Raw    │
        └─────────────────────────┬─────────────────────────┘
                                  │
               ┌──────────────────┴──────────────────┐
               ▼                                     ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐
│     Kerala Spatial GIS Map    │     │   Disaster Support Staging    │
│  (Leaflet · Real-Time Alerts) │     │ (Early Warnings · KSDMA/NDRF) │
└───────────────────────────────┘     └───────────────────────────────┘
```

---

## ⚡ The Core Meteorological Challenge

Forecasting heavy precipitation along the southwestern coast of India and the Western Ghats mountain barrier is notoriously difficult due to:

- **Orographic Uplift & Microclimates**: Elevation surges from sea level to over 2,600 meters within 60 kilometers, triggering localized convective cells that coarse global grids miss or displace.
- **Model Divergence**: GFS and ECMWF frequently diverge by $\pm 30\text{--}60\text{ mm/day}$ on heavy rain days, leaving district emergency responders uncertain about which forecast to trust.
- **The 5.5-Hour UTC Phase Trap**: Standard commercial weather APIs aggregate rainfall over calendar UTC days ($00:00\text{ UTC} \to 23:00\text{ UTC}$). In India, IMD rain gauges are read at **08:30 IST ($03:00\text{ UTC}$)**. Evaluating calendar UTC forecasts against IMD gauges introduces a **5.5-hour phase discrepancy**, distorting verification metrics and leading to erroneous model evaluation.

---

## 🔬 Scientific Innovations

### 1. Convention B Temporal Alignment (03:00 UTC)

GreenSky Blend enforces **Convention B** across all data ingestion pipelines:

$$\text{Accumulation Window}(D) = \int_{(D-1)\text{ 03:00 UTC}}^{D\text{ 03:00 UTC}} P(t)\,dt$$

This aligns perfectly with IMD ground truth gauges measured at 08:30 IST on date $D$. Resolving this temporal lag improves correlation and eliminates synthetic verification penalties caused by afternoon convective storms falling into the wrong validation day.

### 2. Regime-Conditioned Adaptive ML Blending

Rather than applying a static 50/50 equal-weight average or a single unconstrained regression, GreenSky Blend partitions the forecast space into **four meteorologically distinct precipitation regimes** based on the ensemble mean forecast $\bar{F} = \frac{F_{\text{ECMWF}} + F_{\text{GFS}}}{2}$:

| Regime | Forecast Mean Range ($\bar{F}$) | ECMWF Weight ($w_{\text{EC}}$) | GFS Weight ($w_{\text{GFS}}$) | Empirical Rationale |
| :--- | :--- | :---: | :---: | :--- |
| **Dry** | $< 5.0\text{ mm}$ | **1.00** | **0.00** | ECMWF exhibits superior dry-bias suppression and fewer false drizzle alerts. |
| **Light** | $5.0 \le \bar{F} < 15.0\text{ mm}$ | **1.00** | **0.00** | ECMWF maintains strong skill and low root-mean-square error in low-intensity rain. |
| **Moderate** | $15.0 \le \bar{F} < 35.0\text{ mm}$ | **0.60** | **0.40** | Blended consensus dampens variance while capturing organized convective activity. |
| **Heavy** | $\ge 35.0\text{ mm}$ | **0.45** | **0.55** | GFS better captures deep tropical convective bursts and peak monsoon surges. |

All weights satisfy the convex constraint:
$$w_{\text{EC}} + w_{\text{GFS}} = 1, \quad w_{\text{EC}}, w_{\text{GFS}} \ge 0$$
$$\hat{P}_{\text{Blend}} = w_{\text{EC}} \cdot F_{\text{ECMWF}} + w_{\text{GFS}} \cdot F_{\text{GFS}}$$

### 3. Zero-Lookahead Chronological Validation

All machine learning models and regime weights are trained under strict chronological partitioning without data leakage:
- **Training Period**: June 01, 2025 to August 03, 2025 (64 days)
- **Locked Test Period**: August 04, 2025 to August 31, 2025 (28 days held-out test split)
- **Robustness Inverted Split**: June 01 to June 30 (Train) / July 01 to August 03 (Test, 34 peak monsoon days)

---

## 🗺️ Kerala 6-District Pilot Network

GreenSky Blend evaluates six distinct meteorological districts spanning diverse physiographic zones across Kerala:

| District | Latitude / Longitude | Elevation | Physiographic Zone | Primary Hazard Profile & Cell Description |
| :--- | :---: | :---: | :--- | :--- |
| **Pathanamthitta** | $9.25^\circ\text{N},\, 76.75^\circ\text{E}$ | $15\text{ m}$ | Central Midland | Pamba & Achankovil river valleys; flash floods, riverine overflow, reservoir catchment surges. |
| **Idukki** | $9.75^\circ\text{N},\, 77.00^\circ\text{E}$ | $826\text{ m}$ | Mountain Plateau & Dam Catchment | High-relief Western Ghats plateau centered on the Idukki Dam; high-slope runoff and landslide hazards. |
| **Wayanad** | $11.75^\circ\text{N},\, 76.00^\circ\text{E}$ | $766\text{ m}$ | High-Altitude Interior Plateau | Elevated agricultural plateau (Kabini basin); localized cloudburst runoff and plateau drainage congestion. |
| **Kottayam** | $9.50^\circ\text{N},\, 76.50^\circ\text{E}$ | $0\text{ m}$ | Midland Basin & Wetlands Margin | Low midland undulating hills draining into Vembanad Lake; backwater inundation and urban waterlogging. |
| **Ernakulam** | $10.00^\circ\text{N},\, 76.25^\circ\text{E}$ | $3\text{ m}$ | Coastal Estuary & Urban Hub | Coastal urban delta and shipping channels; urban flash flooding, tidal lockage, high economic exposure. |
| **Thiruvananthapuram** | $8.50^\circ\text{N},\, 77.00^\circ\text{E}$ | $22\text{ m}$ | Southern Coastal & Midland | State capital midlands & Karamana basin near IMD Regional Meteorological Centre; localized severe convection. |

---

## 💻 Application Modules & Interactive Views

The GreenSky Blend application provides a specialized suite of interactive operational modules:

1. **Dashboard & Consensus Hub (`DashboardView`)**
   - High-visibility comparison of raw model predictions (ECMWF IFS, NCEP GFS), Equal 50/50 Blend, GreenSky Blend, and ground-truth IMD observations.
   - Real-time confidence score calculation based on inter-model agreement and relative spread.
   - Regime indicator and delta analysis highlighting consensus accuracy vs ground truth.

2. **Kerala GIS Risk Map (`SpatialMapView`)**
   - Interactive Leaflet-powered GIS map layered with CartoDB dark matter base tiles.
   - Visualizes all 6 pilot district cells with color-coded precipitation severity pins, elevation markers, and IMD alert classifications (Green, Yellow, Orange, Red).
   - District centroid inspection and quick switching.

3. **6-District Pilot Phase 3 Explorer (`DistrictAnalysisPage`)**
   - In-depth spatial-comparative telemetry across all six pilot regions.
   - Comprehensive performance metrics breakdown (MAE, RMSE, Bias, Correlation).
   - Terrain elevation profiles, microclimate descriptions, and localized hazard vulnerability indices.

4. **Adaptive Blending Simulator (`BlendingView`)**
   - Interactive weight simulator enabling users to dynamically tune model contributions ($w_{\text{EC}}$ vs $w_{\text{GFS}}$) and evaluate projected consensus rainfall in real time.
   - Detailed inspection of the 4-regime mathematical transition boundaries.

5. **Historical Forecast Replay (`ReplayView`)**
   - Full 92-day chronological playback across Monsoon 2025 (June 01 – August 31, 2025).
   - Scrub through individual dates to review model divergence, blend response, and observed IMD rainfall during severe storm cycles.

6. **Validation & Skill Evaluation (`ValidationView`)**
   - Quantitative evaluation following World Meteorological Organization (WMO) verification standards.
   - Experiment-by-experiment selector (Exp 1: Locked Test, Exp 2: Robustness, Exp 3: Calibration, Exp 4: Atmospheric Context).
   - Detailed contingency metrics: Hits, Misses, False Alarms, Critical Success Index (CSI@15.6mm & CSI@64.5mm).

7. **Extreme Rainfall Analysis (`ExtremeRainView`)**
   - Focused monitoring of heavy ($\ge 15.6\text{ mm}$) and very heavy / extreme ($\ge 64.5\text{ mm}$) precipitation days.
   - Contingency matrix diagnostics and warning lead-time analysis.

8. **Methodology & Machine Learning Pipeline (`MethodologyView`)**
   - Step-by-step interactive documentation of data ingestion, Convention B accumulation windows, spatial regridding, QC triplet repeat correction, and convex weight optimization.

9. **Decision Support & Emergency Management (`ImpactView`)**
   - Translates quantitative rainfall predictions into actionable disaster management protocols for the Kerala State Disaster Management Authority (KSDMA) and District Collectors.
   - SOP trigger levels based on consensus rainfall thresholds (Dam gate alerts, evacuation staging, NDRF prepositioning).

10. **References & Data Provenance (`ReferencesView`)**
    - Authoritative links to research papers, IMD gridded dataset documentation (Pai et al. 2014), ECMWF / NOAA specifications, and the parent `greensky-benchmark` repository.

---

## 📈 Empirical Benchmark Results

Evaluated on the locked 28-day held-out test split (August 04 – August 31, 2025) and sub-period robustness splits at the benchmark grid cell ($10.75^\circ\text{N},\, 76.25^\circ\text{E}$):

### Experiment 1: Locked Test Split (Aug 4 – Aug 31, 2025)
*Zero lookahead; trained on June 1 – August 3, 2025 (64 days).*

| Model / Methodology | MAE (mm) ↓ | RMSE (mm) ↓ | CSI @ 15.6mm ↑ | Hits | Misses | False Alarms |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 🏆 **GreenSky Adaptive Blend** | **5.43** | **8.35** | **0.286** | 4 | 5 | 5 |
| ECMWF IFS025 | 5.67 | 8.63 | 0.286 | 4 | 5 | 5 |
| Equal-Weight Ensemble (50/50) | 5.86 | 8.92 | 0.083 | 1 | 8 | 3 |
| NOAA NCEP GFS Seamless | 6.94 | 10.59 | 0.167 | 2 | 7 | 3 |

> **Key Finding**: The GreenSky Adaptive Blend achieves the lowest Mean Absolute Error (**5.43 mm**) and lowest Root Mean Square Error (**8.35 mm**), outperforming both single NWP models and the naive equal-weight average while eliminating the severe miss penalty of equal blending on heavy rain days.

### Experiment 2: Peak Monsoon Robustness Split (Jul 1 – Aug 3, 2025)
*Evaluating stability under heavy monsoon surges (34 days).*

| Model / Methodology | MAE (mm) ↓ | RMSE (mm) ↓ | CSI @ 15.6mm ↑ | Hits | Misses | False Alarms |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 🏆 **GreenSky Adaptive Blend** | **8.31** | **12.16** | **0.476** | 10 | 2 | 9 |
| ECMWF IFS | 8.89 | 12.87 | 0.450 | 9 | 3 | 8 |
| Equal-Weight Ensemble | 9.35 | 13.91 | 0.429 | 9 | 3 | 9 |
| NOAA GFS Seamless | 10.82 | 16.42 | 0.353 | 6 | 6 | 5 |

---

## 🛠️ System Architecture & Technology Stack

```
[ Data Layer ]
  ├── IMD Gridded Rainfall (0.25° x 0.25°) ────┐
  ├── ECMWF IFS025 (9km Native NWP) ───────────┼─► generate_web_data.py ─► benchmarkData.js
  └── NOAA GFS Seamless (13km Native NWP) ─────┘                                │
                                                                               ▼
[ Application Layer ]                                                     demoData.js
  ├── React 19.2 (Concurrent Rendering)                                       │
  ├── Vite 8.3 (Next-gen Bundler & Fast HMR)                                   │
  └── Tailwind CSS v4 (Modern Utility Engine)                                  │
                                                                               ▼
[ UI & Visualization Suite ]                                           AppShell (State)
  ├── Leaflet + React-Leaflet + CartoDB Dark Tiles (GIS Mapping)              │
  ├── Recharts 3.10 (Dynamic Consensus & Metric Charts)                        │
  └── Lucide React (Meteorological & Control Iconography)                      ▼
                                                                        Interactive Views
                                                                   (Dashboard, Map, Pilot...)
```

- **Core UI Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling & Layout**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Spatial GIS Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) with CartoDB Dark Matter tile basemaps
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Quality**: [Oxlint](https://oxc.rs/)
- **Data Pipeline**: Python 3 (`generate_web_data.py`, `generate_data.py`) with `pathlib` and `csv` modules

---

## 📂 Project Directory Structure

```
greensky-blend/
├── .github/                         # GitHub repository configuration
├── public/                          # Static public assets & icons
│   ├── favicon.svg                  # Vector application favicon
│   └── kerala-districts.geojson     # High-resolution Kerala district boundaries
├── src/
│   ├── assets/                      # Application imagery and branding assets
│   ├── components/
│   │   ├── common/                  # Reusable UI widgets (Logo, Badge, LoadingScreen)
│   │   ├── layout/                  # Shell architecture (AppShell, Sidebar, ControlBar, MobileHeader)
│   │   └── views/                   # Primary dashboard view modules:
│   │       ├── DashboardView.jsx    # Executive consensus forecast & model comparisons
│   │       ├── SpatialMapView.jsx   # Kerala interactive Leaflet GIS risk map
│   │       ├── BlendingView.jsx     # Regime weights and interactive blending sandbox
│   │       ├── ReplayView.jsx       # 92-day historical monsoon timeline replay
│   │       ├── ValidationView.jsx   # WMO benchmark verification metrics & experiments
│   │       ├── ExtremeRainView.jsx  # Extreme rainfall & contingency matrix analysis
│   │       ├── MethodologyView.jsx  # Mathematical formulation and pipeline documentation
│   │       ├── ImpactView.jsx       # Disaster management decision matrix & alerts
│   │       └── ReferencesView.jsx   # Scientific literature and authoritative citations
│   ├── data/
│   │   ├── benchmarkData.js         # Verified multi-district data, experiments, metrics
│   │   └── demoData.js              # Operational forecast lookups & helper routines
│   ├── pages/
│   │   └── DistrictAnalysisPage.jsx # Granular 6-District Phase 3 comparative pilot view
│   ├── utils/
│   │   └── calculations.js          # Blending math, agreement scores, and confidence logic
│   ├── App.jsx                      # Main application view router and state container
│   ├── index.css                    # Tailwind CSS v4 styling directives
│   └── main.jsx                     # React root initialization
├── generate_data.py                 # Palakkad baseline data compilation script
├── generate_web_data.py             # Phase 3 Multi-district data export script
├── index.html                       # HTML5 entrypoint with web fonts & metadata
├── package.json                     # NPM project manifest and dependencies
├── vite.config.js                   # Vite bundler configuration
├── LICENCE.md                       # MIT Open Source License
└── README.md                        # Master project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm` (v9+) or `pnpm` / `yarn`
- **Python**: `3.10+` (optional, only needed if re-generating benchmark datasets)

### Installation & Local Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/midhunmanesh01-code/greensky-blend.git
   cd greensky-blend
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready artifacts will be compiled into the `dist/` directory.

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

6. **Run code linting**:
   ```bash
   npm run lint
   ```

---

### Data Pipeline Re-generation

If updating benchmark runs from the parent [`greensky-benchmark`](https://github.com/midhunmanesh01-code/greensky-benchmark) repository:

```bash
# Generate the unified web benchmark data layer
python generate_web_data.py
```
This processes the multi-district CSV outputs from `../greensky-benchmark/multi_district/` and updates [`src/data/benchmarkData.js`](src/data/benchmarkData.js).

---

## 📚 Authoritative References

1. **IMD Gridded Observations**:  
   Pai, D. S., et al. (2014). *Development of a new high spatial resolution ($0.25^\circ \times 0.25^\circ$) long period (1901–2010) daily gridded rainfall data set over India and its comparison with existing data sets.* **Mausam**, 65(1), 1-18.
2. **Multi-Model Superensemble**:  
   Krishnamurti, T. N., et al. (1999). *Multimodel ensemble forecasts for weather and seasonal climate.* **Science**, 285(5433), 1548-1550.
3. **Ensemble Calibration & Post-Processing**:  
   Gneiting, T., & Raftery, A. E. (2005). *Weather forecasting with ensemble methods.* **Monthly Weather Review**, 133(5), 1098-1118.
4. **WMO Forecast Verification Standard**:  
   World Meteorological Organization. *Guidelines on the Verification of Public Weather Forecasts.* **WMO-No. 1158**.
5. **Numerical Models**:
   - ECMWF Integrated Forecasting System (IFS): [European Centre for Medium-Range Weather Forecasts](https://www.ecmwf.int)
   - NOAA Global Forecast System (GFS): [National Centers for Environmental Prediction](https://www.ncep.noaa.gov)
   - Open-Meteo Weather API: [Open-Meteo Open Data](https://open-meteo.com)

---

## 📄 License

This project is licensed under the terms of the **MIT License**.  
See the [`LICENCE.md`](LICENCE.md) file for full license terms and copyright information.

---

<div align="center">
  <sub>Built with ❤️ for <strong>Smart India Hackathon 2026</strong> · Team <strong>NEXA_CHN</strong></sub>
</div>
