import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ForecastSection from './components/ForecastSection';
import BlendingSection from './components/BlendingSection';
import ValidationSection from './components/ValidationSection';
import ExtremeRainfallSection from './components/ExtremeRainfallSection';
import MethodologySection from './components/MethodologySection';
import ImpactSection from './components/ImpactSection';
import ReferencesSection from './components/ReferencesSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Premium Navbar */}
      <Navbar />

      {/* Main Single-Page Content Flow */}
      <main className="relative">
        {/* 1. Hero & Product Identity */}
        <HeroSection />

        {/* Divider Glow */}
        <div className="divider" />

        {/* 2. Forecast Overview & Multi-Source Synthesis (Includes Kerala Map & 24h Replay) */}
        <ForecastSection />

        {/* Divider Glow */}
        <div className="divider" />

        {/* 3. Adaptive Blending - Core ML Pipeline, Dynamic Weights, Donut Chart, Regional Profiles */}
        <BlendingSection />

        {/* Divider Glow */}
        <div className="divider" />

        {/* 4. Forecast Validation & Baseline Evaluation Ladder */}
        <ValidationSection />

        {/* 5. Extreme Rainfall Dedicated Threshold Skill Evaluation */}
        <ExtremeRainfallSection />

        {/* Divider Glow */}
        <div className="divider" />

        {/* 6. Research Methodology & Data Alignment Pipeline */}
        <MethodologySection />

        {/* Divider Glow */}
        <div className="divider" />

        {/* 7. Decision Support & Operational Impact */}
        <ImpactSection />

        {/* Divider Glow */}
        <div className="divider" />

        {/* 8. Data Sources & Scientific Literature References */}
        <ReferencesSection />
      </main>

      {/* 9. Dark Footer */}
      <Footer />
    </div>
  );
}
