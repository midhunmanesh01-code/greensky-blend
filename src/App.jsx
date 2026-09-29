import React, { useState } from 'react';
import AppShell from './components/layout/AppShell';
import LoadingScreen from './components/common/LoadingScreen';
import DashboardView from './components/views/DashboardView';
import SpatialMapView from './components/views/SpatialMapView';
import BlendingView from './components/views/BlendingView';
import ReplayView from './components/views/ReplayView';
import ValidationView from './components/views/ValidationView';
import ExtremeRainView from './components/views/ExtremeRainView';
import MethodologyView from './components/views/MethodologyView';
import ImpactView from './components/views/ImpactView';
import ReferencesView from './components/views/ReferencesView';

import { FORECAST_DATA, DATES, DISTRICTS } from './data/demoData';
import { calculateBlendedForecast } from './utils/calculations';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [district, setDistrict] = useState(DISTRICTS[0] || 'Pathanamthitta');
  const [date, setDate] = useState(DATES[0] || '2025-08-28');

  // Active district & date forecast data with resilient fallback
  const districtData = FORECAST_DATA[district] || Object.values(FORECAST_DATA)[0] || {};
  const currentData = districtData[date] || Object.values(districtData)[0] || {
    forecasts: { ifs: 0, gfs: 0, aifs: 0 },
    weights: { ifs: 0.5, gfs: 0.5, aifs: 0 },
    confidence: 0.8,
    regime: 'Moderate (15-35 mm)',
  };
  const blendedValue = calculateBlendedForecast(currentData.forecasts, currentData.weights);

  if (loading) {
    return <LoadingScreen onFinish={() => setLoading(false)} />;
  }

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
