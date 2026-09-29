import React from 'react';
import { Database, Layers, BookOpen, Award, ExternalLink } from 'lucide-react';

const REFERENCE_GROUPS = [
  {
    category: 'Forecast Data Sources',
    icon: Database,
    accent: '#38bdf8',
    items: [
      {
        name: 'ECMWF IFS (Integrated Forecasting System)',
        detail: 'Global high-resolution numerical weather prediction model (9km resolution).',
        ref: 'European Centre for Medium-Range Weather Forecasts (ECMWF)',
      },
      {
        name: 'NCEP GFS (Global Forecast System)',
        detail: 'Operational global numerical weather prediction model (13km resolution).',
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
        name: 'KSDMA Incident & Rainfall Catalogs',
        detail: 'Disaster management historical event catalogs and localized precipitation assessments.',
        ref: 'Kerala State Disaster Management Authority',
      },
    ],
  },
  {
    category: 'Methodological Foundations',
    icon: BookOpen,
    accent: '#a78bfa',
    items: [
      {
        name: 'Gradient Boosted Decision Trees',
        detail: 'XGBoost & LightGBM implementations for nonlinear context-aware regression of model weights.',
        ref: 'Chen, T., & Guestrin, C. (2016) · KDD \'16, 785-794',
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
    accent: '#fbbf24',
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
              className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                  <div
                    className="p-1 rounded"
                    style={{ background: `${group.accent}15` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: group.accent }} />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{group.category}</h4>
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.name} className="group">
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                          {item.name}
                        </h5>
                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 flex-shrink-0 mt-0.5" />
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
