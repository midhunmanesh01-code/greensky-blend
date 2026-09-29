import React from 'react';
import { AlertTriangle, MapPin, Users, Shield, Droplets, Eye, ArrowUpRight } from 'lucide-react';

const IMPACT_CARDS = [
  {
    title: 'Heavy-Rain Early Warnings',
    desc: 'Highlights when individual NWP and AI models converge on severe rainfall thresholds, preventing surprise flash floods.',
    icon: AlertTriangle,
    accent: '#fb7185',
    tag: 'Early Warning',
  },
  {
    title: 'District Administration Planning',
    desc: 'Terrain-specific adaptive weights reflect local variations across Kerala, giving district collectors tailored intelligence.',
    icon: MapPin,
    accent: '#f59e0b',
    tag: 'Local Planning',
  },
  {
    title: 'Field Team & NDRF Readiness',
    desc: 'Transparent model weighting helps emergency response teams evaluate forecast consensus before dispatching equipment.',
    icon: Users,
    accent: '#34d399',
    tag: 'Operations',
  },
  {
    title: 'Disaster Risk Reduction',
    desc: 'Threshold-focused verification ensures the ML blending mechanism preserves high-intensity signals for SOP deployment.',
    icon: Shield,
    accent: '#38bdf8',
    tag: 'Preparedness',
  },
  {
    title: 'Slope Instability & Landslide Guidance',
    desc: 'Continuous 24-hour rainfall totals feed geotechnical hazard models in vulnerable Western Ghats zones (Wayanad, Idukki).',
    icon: Droplets,
    accent: '#a78bfa',
    tag: 'Terrain Risk',
  },
  {
    title: 'Transparent Model Comparison',
    desc: 'Side-by-side visualization of ECMWF IFS, NCEP GFS, and ECMWF AIFS enables meteorologists to audit model divergence.',
    icon: Eye,
    accent: '#fbbf24',
    tag: 'Explainability',
  },
];

export default function ImpactView() {
  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Operational Impact & Decision Support Framework
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Intelligently combined precipitation intelligence engineered for disaster managers, local collectors, and field teams across Kerala.
          </p>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800/50 whitespace-nowrap">
          Decision Support Layer
        </span>
      </div>

      {/* 6 Impact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {IMPACT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: `${card.accent}15`, border: `1px solid ${card.accent}30` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.accent }} />
                  </div>
                  <span
                    className="text-[10px] font-bold font-mono px-2 py-0.5 rounded"
                    style={{ color: card.accent, background: `${card.accent}10`, border: `1px solid ${card.accent}20` }}
                  >
                    {card.tag}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mb-1.5">{card.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Multi-Model Synthesis</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
