import React, { useState } from 'react';
import AppHeader from './components/AppHeader';
import ContextBar from './components/ContextBar';
import DashboardView from './components/views/DashboardView';
import SpatialMapView from './components/views/SpatialMapView';
import BlendingView from './components/views/BlendingView';
import ReplayView from './components/views/ReplayView';
import ValidationView from './components/views/ValidationView';
import ExtremeRainView from './components/views/ExtremeRainView';
import MethodologyView from './components/views/MethodologyView';
import ImpactView from './components/views/ImpactView';
import ReferencesView from './components/views/ReferencesView';

import { FORECAST_DATA } from './data/demoData';
import { calculateBlendedForecast } from './utils/calculations';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [district, setDistrict] = useState('Pathanamthitta');
  const [date, setDate] = useState('2026-07-01');

  // Active district & date forecast data
  const currentData = FORECAST_DATA[district]?.[date] || FORECAST_DATA['Pathanamthitta']['2026-07-01'];
  const blendedValue = calculateBlendedForecast(currentData.forecasts, currentData.weights);

  const handleDistrictChange = (d) => {
    setDistrict(d);
  };

  const handleDateChange = (dt) => {
    setDate(dt);
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Header with Brand, Badges & View Tabs (like ls-monitor) */}
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 2. Operational Context Bar with Global Selectors */}
      <ContextBar
        district={district}
        date={date}
        onDistrictChange={handleDistrictChange}
        onDateChange={handleDateChange}
        blendedValue={blendedValue}
        confidence={currentData.confidence}
        regime={currentData.regime}
      />

      {/* 3. Main Operational Screen Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-4">
        {activeTab === 'dashboard' && (
          <DashboardView
            district={district}
            data={currentData}
          />
        )}

        {activeTab === 'map' && (
          <SpatialMapView
            district={district}
            date={date}
            onDistrictSelect={handleDistrictChange}
          />
        )}

        {activeTab === 'blending' && (
          <BlendingView
            district={district}
            data={currentData}
            onDistrictSelect={handleDistrictChange}
          />
        )}

        {activeTab === 'replay' && (
          <ReplayView
            district={district}
          />
        )}

        {activeTab === 'validation' && (
          <ValidationView />
        )}

        {activeTab === 'extreme' && (
          <ExtremeRainView />
        )}

        {activeTab === 'methodology' && (
          <MethodologyView />
        )}

        {activeTab === 'impact' && (
          <ImpactView />
        )}

        {activeTab === 'references' && (
          <ReferencesView />
        )}
      </main>

      {/* 4. Sleek Operational Bottom Status Strip */}
      <footer className="bg-[#070e1c] border-t border-slate-800/80 py-2.5 px-4 sm:px-6 text-[11px] text-slate-500">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">GreenSky Blend</span>
            <span className="text-slate-600">·</span>
            <span>Adaptive Multi-Model Weather Forecasting</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-cyan-400">SIH26081</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Kerala Pilot · 6-District Demonstration</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono">Team NEXA_CHN</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
