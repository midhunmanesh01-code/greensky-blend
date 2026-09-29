import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateSourceContribution } from '../utils/calculations';

const RADIAN = Math.PI / 180;

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }) {
  if (value < 8) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="700">
      {value}%
    </text>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2">
        <p className="text-sm font-bold text-slate-800">{payload[0].name}</p>
        <p className="text-sm text-slate-600">{payload[0].value}% contribution</p>
      </div>
    );
  }
  return null;
}

export default function SourceContribution({ weights }) {
  const data = calculateSourceContribution(weights);

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-5 rounded-full bg-blue-600" />
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Source Contribution</h2>
      </div>
      <p className="text-xs text-slate-400 mb-4 ml-3">Current adaptive contribution</p>

      <div className="flex-1" style={{ minHeight: 200 }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={88}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-xs text-slate-600 flex-1">{item.name}</span>
            <span className="text-xs font-bold text-slate-800">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
