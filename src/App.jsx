import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ForecastReplay from './components/ForecastReplay';
import ValidationPanel from './components/ValidationPanel';
import WeightMap from './components/WeightMap';

const NAV_CONTENT = {
  'Dashboard': Dashboard,
  'Forecast Replay': () => (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-green-600 p-6 text-white">
        <h1 className="text-2xl font-extrabold">Forecast Replay</h1>
        <p className="text-blue-100 text-sm mt-1">Step through the GreenSky blending pipeline across the forecast window.</p>
      </div>
      <ForecastReplay district="Pathanamthitta" />
      <ForecastReplay district="Idukki" />
    </div>
  ),
  'Model Contribution': () => (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-violet-700 to-blue-600 p-6 text-white">
        <h1 className="text-2xl font-extrabold">Model Contribution</h1>
        <p className="text-violet-100 text-sm mt-1">Adaptive source weight distribution across districts and conditions.</p>
      </div>
      <WeightMap selectedDistrict="Pathanamthitta" onDistrictSelect={() => {}} />
    </div>
  ),
  'Validation': () => (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
        <h1 className="text-2xl font-extrabold">Validation Framework</h1>
        <p className="text-amber-100 text-sm mt-1">GreenSky evaluation methodology and current project status.</p>
      </div>
      <ValidationPanel />
    </div>
  ),
};

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');

  const PageComponent = NAV_CONTENT[activeNav] || Dashboard;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header activeNav={activeNav} onNavChange={setActiveNav} />
      <main>
        <PageComponent />
      </main>
    </div>
  );
}
