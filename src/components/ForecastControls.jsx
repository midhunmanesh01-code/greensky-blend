import React from 'react';
import { MapPin, Calendar, Clock, CloudRain } from 'lucide-react';
import { DISTRICTS, DATES, REGIMES, REGIME_COLORS } from '../data/demoData';
import { formatDateLabel } from '../utils/calculations';

export default function ForecastControls({ district, date, regime, onDistrictChange, onDateChange, onRegimeChange }) {
  const regimeStyle = REGIME_COLORS[regime] || REGIME_COLORS['Monsoon'];

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full bg-blue-600" />
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Forecast Control</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* District */}
        <div>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <MapPin className="w-3.5 h-3.5" /> District
          </label>
          <select
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <Calendar className="w-3.5 h-3.5" /> Forecast Date
          </label>
          <select
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            {DATES.map((d) => (
              <option key={d} value={d}>{formatDateLabel(d)}</option>
            ))}
          </select>
        </div>

        {/* Lead Time */}
        <div>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <Clock className="w-3.5 h-3.5" /> Forecast Lead
          </label>
          <div className="w-full text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 select-none">
            24 Hours
          </div>
        </div>

        {/* Weather Regime */}
        <div>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <CloudRain className="w-3.5 h-3.5" /> Weather Regime
          </label>
          <select
            value={regime}
            onChange={(e) => onRegimeChange(e.target.value)}
            className={`w-full text-sm font-bold border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${regimeStyle.bg} ${regimeStyle.text} ${regimeStyle.border}`}
          >
            {REGIMES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Context bar */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>
          Showing adaptive blend for <strong className="text-slate-700">{district}</strong> on{' '}
          <strong className="text-slate-700">{formatDateLabel(date)}</strong> under{' '}
          <span className={`font-bold ${regimeStyle.text}`}>{regime}</span> regime
        </span>
        <span className="ml-auto badge-illustrative">Illustrative Data</span>
      </div>
    </div>
  );
}
