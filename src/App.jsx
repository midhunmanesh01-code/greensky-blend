import React, { useState } from 'react';
import AppShell from './components/layout/AppShell';
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
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      district={district}
      date={date}
      onDistrictChange={handleDistrictChange}
      onDateChange={handleDateChange}
      blendedValue={blendedValue}
      confidence={currentData.confidence}
      regime={currentData.regime}
    >
      {activeTab === 'dashboard' && (
        <DashboardView
          district={district}
          data={currentData}
        />
      )}

      {activeTab === 'risk-map' && (
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

      {activeTab === 'historical' && (
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
    </AppShell>
  );
}
