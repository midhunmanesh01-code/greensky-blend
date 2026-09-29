import React from 'react';
import { AlertTriangle, MapPin, Users, Shield, Droplets, Eye, ArrowUpRight } from 'lucide-react';

const IMPACT_CARDS = [
  {
    title: 'Heavy-Rain Awareness',
    desc: 'Multi-model consensus highlights when individual forecasts converge on severe rainfall thresholds, reducing surprise events.',
    icon: AlertTriangle,
    accent: '#fb7185',
    tag: 'Early Warning',
  },
  {
    title: 'Local Planning',
    desc: 'Location-specific adaptive weights reflect district terrain variations across Kerala, giving local administrators tailored predictions.',
    icon: MapPin,
    accent: '#38bdf8',
    tag: 'District Level',
  },
  {
    title: 'Field Team Readiness',
    desc: 'Transparent model weighting helps emergency response teams evaluate forecast confidence before deploying resources.',
    icon: Users,
    accent: '#34d399',
    tag: 'Operations',
  },
  {
    title: 'Disaster Preparedness',
    desc: 'Threshold-focused evaluation ensures the ML blending mechanism preserves high-intensity signals for disaster management protocols.',
    icon: Shield,
    accent: '#22d3ee',
    tag: 'Risk Reduction',
  },
  {
    title: 'Flood & Landslide Guidance',
    desc: 'Continuous 24-hour rainfall volume assessments feed hydrological and slope-instability risk models in vulnerable Western Ghats zones.',
    icon: Droplets,
    accent: '#a78bfa',
    tag: 'Terrain Risk',
  },
  {
    title: 'Transparent Forecast Comparison',
    desc: 'Side-by-side visualization of ECMWF IFS, NCEP GFS, and ECMWF AIFS enables meteorologists to audit model disagreement.',
    icon: Eye,
    accent: '#fbbf24',
    tag: 'Explainability',
  },
];

export default function ImpactSection() {
  return (
    <section id="impact" className="section-spacing relative">
      {/* Background glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 80% 50%, rgba(56,189,248,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mb-12">
          <p className="section-label">Weather Decision Support</p>
          <h2 className="section-title">Operational Impact & Application</h2>
          <p className="section-desc">
            By dynamically synthesizing NWP and AI weather models, GreenSky Blend provides high-confidence rainfall intelligence tailored to weather-sensitive decision makers across Kerala.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {IMPACT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.title} 
                className="glass-panel p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px]"
                style={{
                  border: '1px solid rgba(56,189,248,0.1)',
                  background: 'rgba(10,22,40,0.65)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="p-2.5 rounded-xl flex items-center justify-center"
                      style={{ 
                        background: `${card.accent}15`,
                        border: `1px solid ${card.accent}30`
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: card.accent }} />
                    </div>
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ 
                        color: card.accent, 
                        background: `${card.accent}10`,
                        border: `1px solid ${card.accent}20` 
                      }}
                    >
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Decision Support Layer</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Note */}
        <div 
          className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
          style={{
            background: 'linear-gradient(90deg, rgba(34,211,238,0.06), rgba(56,189,248,0.03))',
            border: '1px solid rgba(34,211,238,0.15)',
          }}
        >
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
            <span>
              <strong>Better use of multiple rainfall forecasts:</strong> GreenSky does not replace official meteorological agency forecasts, but provides an intelligent multi-model synthesis for operational readiness.
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-medium whitespace-nowrap bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/50">
            Kerala Pilot · 6 Districts
          </span>
        </div>
      </div>
    </section>
  );
}
