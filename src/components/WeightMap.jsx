import React from 'react';
import { SPATIAL_WEIGHTS } from '../data/demoData';
import { weightsToPercent } from '../utils/calculations';

const MODEL_COLORS = {
  ifs:  { bar: 'bg-blue-500',   text: 'text-blue-700',   dot: '#2563eb' },
  gfs:  { bar: 'bg-green-500',  text: 'text-green-700',  dot: '#16a34a' },
  aifs: { bar: 'bg-violet-500', text: 'text-violet-700', dot: '#7c3aed' },
};

function DistrictWeightCard({ district, weights, active, onClick }) {
  const pct = weightsToPercent(weights);

  const dominantKey = Object.entries(pct).sort((a, b) => b[1] - a[1])[0][0];
  const dominantColors = MODEL_COLORS[dominantKey];

  return (
    <button
      onClick={() => onClick(district)}
      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
        active
          ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-slate-800">{district}</p>
          <p className={`text-[10px] font-semibold mt-0.5 ${dominantColors.text}`}>
            Dominant: {dominantKey.toUpperCase()}
          </p>
        </div>
        <div
          className="w-3 h-3 rounded-full mt-1"
          style={{ background: dominantColors.dot }}
        />
      </div>

      <div className="space-y-2">
        {[
          { key: 'ifs',  label: 'IFS'  },
          { key: 'gfs',  label: 'GFS'  },
          { key: 'aifs', label: 'AIFS' },
        ].map(({ key, label }) => {
          const c = MODEL_COLORS[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 w-7">{label}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${pct[key]}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold ${c.text} w-7 text-right`}>{pct[key]}%</span>
            </div>
          );
        })}
      </div>
    </button>
  );
}

export default function WeightMap({ selectedDistrict, onDistrictSelect }) {
  const districts = Object.keys(SPATIAL_WEIGHTS);

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full bg-violet-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Spatial Model-Weight Map</h2>
          </div>
          <p className="text-xs text-slate-400 ml-3">
            Different districts receive different adaptive source weights based on location characteristics.
          </p>
        </div>
        <span className="badge-illustrative whitespace-nowrap">Illustrative Weights</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {districts.map((district) => (
          <DistrictWeightCard
            key={district}
            district={district}
            weights={SPATIAL_WEIGHTS[district]}
            active={district === selectedDistrict}
            onClick={onDistrictSelect}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-6 flex-wrap">
        <p className="text-xs text-slate-400 italic">
          Illustrative model-weight visualization. These spatial weights are not experimentally validated.
        </p>
        <div className="flex items-center gap-3 ml-auto">
          {[
            { key: 'ifs',  label: 'ECMWF IFS',   color: '#2563eb' },
            { key: 'gfs',  label: 'NCEP GFS',    color: '#16a34a' },
            { key: 'aifs', label: 'ECMWF AIFS',  color: '#7c3aed' },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-[10px] text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
