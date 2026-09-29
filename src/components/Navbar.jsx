import React, { useState, useEffect, useCallback } from 'react';
import { CloudRain, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', id: 'overview' },
  { label: 'Forecast', id: 'forecast' },
  { label: 'Blending', id: 'blending' },
  { label: 'Validation', id: 'validation' },
  { label: 'Methodology', id: 'methodology' },
  { label: 'Impact', id: 'impact' },
  { label: 'References', id: 'references' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 72;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileOpen(false);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,10,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(56,189,248,0.08)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button onClick={() => scrollTo('overview')} className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(56,189,248,0.1))', border: '1px solid rgba(34,211,238,0.2)' }}>
              <CloudRain className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-white leading-none block">GreenSky Blend</span>
              <span className="text-[10px] text-slate-500 leading-none hidden sm:block">Adaptive Weather Intelligence</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeSection === id
                    ? 'text-cyan-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
                {activeSection === id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-cyan-400" />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t" style={{ background: 'rgba(5,10,20,0.95)', backdropFilter: 'blur(20px)', borderColor: 'rgba(56,189,248,0.08)' }}>
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === id ? 'text-cyan-400 bg-cyan-400/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
