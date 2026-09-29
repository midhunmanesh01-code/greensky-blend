import React from 'react';
import { CloudRain, Shield, ArrowUp } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Overview', id: 'overview' },
  { label: 'Forecast', id: 'forecast' },
  { label: 'Blending', id: 'blending' },
  { label: 'Validation', id: 'validation' },
  { label: 'Methodology', id: 'methodology' },
  { label: 'Impact', id: 'impact' },
  { label: 'References', id: 'references' },
];

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 72;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      className="relative pt-16 pb-12 overflow-hidden"
      style={{
        background: '#030712',
        borderTop: '1px solid rgba(56,189,248,0.1)',
      }}
    >
      {/* Top subtle glow line */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)',
        }}
      />

      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Project Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(56,189,248,0.1))',
                  border: '1px solid rgba(34,211,238,0.3)',
                }}
              >
                <CloudRain className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">GreenSky Blend</h3>
                <p className="text-xs text-cyan-400/80 font-mono">Adaptive Multi-Model Weather Forecasting</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              A hybrid AI–NWP framework intelligently synthesizing numerical forecast outputs (ECMWF IFS, NCEP GFS) and AI weather models (ECMWF AIFS) to generate high-resolution, explainable 24-hour rainfall predictions.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                SIH26081
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
                Kerala Pilot · 6-District Demo
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                24-Hour Rainfall Lead
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Architecture & Modules</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Scope & Disclaimers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Pilot Deployment Scope</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              Currently demonstrated across 6 pilot districts in Kerala: <em>Pathanamthitta, Idukki, Wayanad, Kottayam, Ernakulam, and Thiruvananthapuram</em>.
            </p>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] text-slate-500 leading-normal flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>GreenSky Blend is a decision-support prototype and does not replace official meteorological agency bulletins.</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 GreenSky Blend · Team NEXA_CHN · Smart India Hackathon (SIH26081)
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Back to top
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
