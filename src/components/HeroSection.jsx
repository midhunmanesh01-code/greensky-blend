import React from 'react';
import { ArrowRight, ChevronRight, Activity, Map, Clock, ShieldCheck, CloudRain } from 'lucide-react';

const PARTICLES = Array.from({ length: 36 }).map((_, i) => ({
  id: i,
  left: `${((i * 17 + 7) % 100)}%`,
  top: `-${((i * 13) % 20)}%`,
  duration: `${4 + (i % 5) * 0.8}s`,
  delay: `${(i % 7) * 0.7}s`,
  opacity: 0.2 + (i % 4) * 0.15,
}));

export default function HeroSection() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section 
      id="overview" 
      className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-center overflow-hidden pt-10 pb-20"
    >
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle radial gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] opacity-40"></div>
        
        {/* CSS Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 20%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 20%, transparent 100%)'
          }}
        ></div>

        {/* CSS Rain/Particle Effect */}
        <div className="absolute inset-0">
          <style>
            {`
              @keyframes fall {
                0% { transform: translateY(-10px) translateX(0); opacity: 0; }
                10% { opacity: 0.5; }
                90% { opacity: 0.5; }
                100% { transform: translateY(100vh) translateX(20px); opacity: 0; }
              }
              .particle {
                position: absolute;
                width: 2px;
                height: 15px;
                background: linear-gradient(to bottom, rgba(34,211,238,0), rgba(34,211,238,0.4));
                border-radius: 4px;
                animation: fall linear infinite;
              }
            `}
          </style>
          {PARTICLES.map((p) => (
            <div 
              key={p.id} 
              className="particle"
              style={{
                left: p.left,
                top: p.top,
                animationDuration: p.duration,
                animationDelay: p.delay,
                opacity: p.opacity,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center w-full mt-8">
        
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-slate-300 backdrop-blur-sm">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> SIH26081
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-slate-300 backdrop-blur-sm">
            <Map className="w-3.5 h-3.5 text-green-400" /> Kerala Pilot
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-slate-300 backdrop-blur-sm">
            <Activity className="w-3.5 h-3.5 text-blue-400" /> 6-District Demonstration
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-slate-300 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-purple-400" /> 24-Hour Forecast
          </span>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
          <span className="drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">GreenSky Blend</span>
        </h1>
        
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-300 mb-8 max-w-3xl">
          Adaptive Multi-Model Weather Forecasting
        </h2>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-12 leading-relaxed">
          An ML-based framework for intelligently combining multiple weather forecasts to produce a more consistent and explainable rainfall prediction.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button 
            onClick={() => scrollTo('forecast')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
          >
            Explore Forecast
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scrollTo('validation')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-all duration-200"
          >
            View Validation
            <ShieldCheck className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Visual Pipeline Hint */}
        <div className="w-full max-w-4xl opacity-80 mt-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <CloudRain className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">Weather Models</span>
            </div>
            
            <ChevronRight className="hidden sm:block w-5 h-5 text-slate-600" />
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">Data Alignment</span>
            </div>
            
            <ChevronRight className="hidden sm:block w-5 h-5 text-slate-600" />
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">ML Blending</span>
            </div>
            
            <ChevronRight className="hidden sm:block w-5 h-5 text-slate-600" />
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <Map className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">Forecast</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
