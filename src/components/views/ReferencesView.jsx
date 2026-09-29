import React from 'react';
import { Database, Layers, BookOpen, Award, ExternalLink, GitBranch } from 'lucide-react';

const REFERENCE_GROUPS = [
  {
    category: 'Benchmark & Authoritative Repositories',
    icon: GitBranch,
    accent: '#38bdf8',
    items: [
      {
        name: 'greensky-benchmark (Source of Truth)',
        detail: 'Official quantitative benchmarking and machine-learning blending framework for daily precipitation forecasting in India.',
        ref: 'https://github.com/midhunmanesh01-code/greensky-benchmark',
      },
      {
        name: 'ECMWF IFS (Integrated Forecasting System)',
        detail: 'Global high-resolution numerical weather prediction model (9km native resolution).',
        ref: 'European Centre for Medium-Range Weather Forecasts (ECMWF)',
      },
      {
        name: 'NOAA NCEP GFS (Global Forecast System)',
        detail: 'Operational global numerical weather prediction model (13km native resolution).',
        ref: 'National Centers for Environmental Prediction (NOAA)',
      },
      {
        name: 'ECMWF AIFS (AI Forecast System)',
        detail: 'Data-driven deep learning neural weather model operating on spherical harmonics.',
        ref: 'ECMWF Machine Learning Roadmap (2024)',
      },
    ],
  },
  {
    category: 'Observation & Ground Truth',
    icon: Layers,
    accent: '#34d399',
    items: [
      {
        name: 'IMD High-Resolution Gridded Rainfall',
        detail: 'Daily 0.25° × 0.25° gridded gauge rainfall dataset over Indian mainland.',
        ref: 'Pai, D. S., et al. (2014) · Mausam, 65(1), 1-18',
      },
      {
        name: 'IMD Automated Weather Station Network',
        detail: 'Continuous station gauge observations across Kerala state meteorological observatories.',
        ref: 'India Meteorological Department (IMD), MoES',
      },
      {
        name: 'Convention B Alignment Specification',
        detail: '24-hour accumulation window ((D-1) 03:00 UTC → D 03:00 UTC) matching official 08:30 IST gauge read.',
        ref: 'IMD Standard Observation Protocol',
      },
    ],
  },
  {
    category: 'Methodological Foundations',
    icon: BookOpen,
    accent: '#a78bfa',
    items: [
      {
        name: 'Regime-Conditioned Adaptive Blending',
        detail: 'Convex weight optimization minimizing daily error conditioned on precipitation regimes.',
        ref: 'GreenSky Benchmark Experiment 1 Protocol',
      },
      {
        name: 'Multi-Model Superensemble Forecasting',
        detail: 'Foundation of combining multi-model NWP outputs based on historical bias reduction.',
        ref: 'Krishnamurti, T. N., et al. (1999) · Science, 285(5433), 1548-1550',
      },
      {
        name: 'Non-Homogeneous Ensemble Calibration',
        detail: 'Statistical post-processing principles ensuring sharp, reliable consensus precipitation.',
        ref: 'Gneiting, T., & Raftery, A. E. (2005) · Mon. Wea. Rev., 133(5), 1098-1118',
      },
    ],
  },
  {
    category: 'Project Context & Standards',
    icon: Award,
    accent: '#f59e0b',
    items: [
      {
        name: 'Smart India Hackathon 2026',
        detail: 'Problem Statement SIH26081 · Disaster Management Category · Team NEXA_CHN',
        ref: 'Ministry of Education\'s Innovation Cell & AICTE',
      },
      {
        name: 'Kerala 6-District Demonstration Protocol',
        detail: 'Targeted pilot scope evaluating complex orographic Western Ghats and coastal regimes.',
        ref: 'Pathanamthitta · Idukki · Wayanad · Kottayam · Ernakulam · Thiruvananthapuram',
      },
      {
        name: 'WMO Standard Verification Metrics',
        detail: 'MAE, RMSE, Critical Success Index (CSI), and Equitable Threat Score (ETS) guidelines.',
        ref: 'World Meteorological Organization (WMO-No. 1158)',
      },
    ],
  },
];

export default function ReferencesView() {
  return (
    <div className="space-y-4">
      
      {/* 2x2 Grid of References */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REFERENCE_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.category}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800">
                  <div
                    className="p-1 rounded bg-slate-950 border border-slate-800"
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: group.accent }} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">{group.category}</h4>
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.name} className="group">
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                          {item.name}
                        </h5>
                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-amber-400 flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">{item.ref}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
