import React, { useState } from 'react';
import ForecastControls from '../components/ForecastControls';
import ForecastSourceCard from '../components/ForecastSourceCard';
import AdaptiveBlend from '../components/AdaptiveBlend';
import BlendComparison from '../components/BlendComparison';
import KeralaMap from '../components/KeralaMap';
import WeightMap from '../components/WeightMap';
import SourceContribution from '../components/SourceContribution';
import ConfidenceCard from '../components/ConfidenceCard';
import ForecastReplay from '../components/ForecastReplay';
import ValidationPanel from '../components/ValidationPanel';
import Architecture from '../components/Architecture';
import TechStack from '../components/TechStack';
import { FORECAST_DATA } from '../data/demoData';
import { formatDateLabel } from '../utils/calculations';

export default function Dashboard() {
  const [district, setDistrict] = useState('Pathanamthitta');
  const [date, setDate] = useState('2026-07-01');

  const data = FORECAST_DATA[district]?.[date] || FORECAST_DATA['Pathanamthitta']['2026-07-01'];
  const { forecasts, weights, confidence, regime } = data;

  const [activeRegime, setActiveRegime] = useState(regime);

  // When district or date changes, sync regime from data
  const handleDistrictChange = (d) => {
    setDistrict(d);
    const newData = FORECAST_DATA[d]?.[date];
    if (newData) setActiveRegime(newData.regime);
  };

  const handleDateChange = (d) => {
    setDate(d);
    const newData = FORECAST_DATA[district]?.[d];
    if (newData) setActiveRegime(newData.regime);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero / intro strip */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-green-600 p-6 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">SIH26081 · Disaster Management · Team NEXA_CHN</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">GreenSky Blend</h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Hybrid AI–NWP multi-model forecast blending system generating location-specific 24-hour rainfall forecasts for Kerala using adaptive, context-aware source weighting.
            </p>
          </div>
          <div className="flex gap-4">
            {[
              { label: 'Sources', value: '3' },
              { label: 'Districts', value: '6' },
              { label: 'Lead Time', value: '24h' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-white">{value}</div>
                <div className="text-blue-200 text-[10px] uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Control */}
      <ForecastControls
        district={district}
        date={date}
        regime={activeRegime}
        onDistrictChange={handleDistrictChange}
        onDateChange={handleDateChange}
        onRegimeChange={setActiveRegime}
      />

      {/* Source Cards */}
      <div>
        <p className="section-title">Forecast Sources — {district} · {formatDateLabel(date)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['ifs', 'gfs', 'aifs'].map((key) => (
            <ForecastSourceCard
              key={key}
              modelKey={key}
              value={forecasts[key]}
              weight={weights[key]}
            />
          ))}
        </div>
      </div>

      {/* Adaptive Blend */}
      <AdaptiveBlend forecasts={forecasts} weights={weights} />

      {/* Two-column: Comparison + Confidence + Source Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BlendComparison forecasts={forecasts} weights={weights} />
        </div>
        <div className="flex flex-col gap-4">
          <ConfidenceCard confidence={confidence} forecasts={forecasts} />
        </div>
      </div>

      {/* Source contribution donut + Weight map side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <SourceContribution weights={weights} />
        </div>
        <div className="lg:col-span-2">
          <WeightMap
            selectedDistrict={district}
            onDistrictSelect={handleDistrictChange}
          />
        </div>
      </div>

      {/* Kerala Map */}
      <KeralaMap
        district={district}
        date={date}
        onDistrictSelect={handleDistrictChange}
      />

      {/* Forecast Replay */}
      <ForecastReplay district={district} />

      {/* Validation + Architecture side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ValidationPanel />
        <Architecture />
      </div>

      {/* Tech stack */}
      <TechStack />

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 py-4 border-t border-slate-200">
        <p>
          GreenSky Blend · Hybrid AI–NWP Multi-Model Forecast Blending System ·{' '}
          <strong>SIH26081</strong> · Team NEXA_CHN
        </p>
        <p className="mt-1">
          All forecast values shown are illustrative prototype data. GreenSky Blend is a decision-support layer
          and does not replace IMD, NCMRWF or official forecasts and warnings.
        </p>
      </div>
    </div>
  );
}
