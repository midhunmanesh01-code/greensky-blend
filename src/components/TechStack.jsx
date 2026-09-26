import React from 'react';

const TECH = [
  { category: 'Data & ML',    items: ['Python', 'Pandas', 'NumPy', 'XGBoost / LightGBM'] },
  { category: 'Frontend',     items: ['React', 'Vite', 'Tailwind CSS', 'Recharts', 'Leaflet'] },
];

export default function TechStack() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full bg-slate-300" />
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Technology Stack</h2>
      </div>
      <div className="flex flex-wrap gap-6">
        {TECH.map(({ category, items }) => (
          <div key={category}>
            <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">{category}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
