import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-control border border-cardBorder shadow-card text-xs font-sans">
        <p className="font-semibold text-mainText">{label} ({data.date})</p>
        <p className="text-primary font-semibold mt-1">
          Completion: {data.percentage}%
        </p>
        <p className="text-secondaryText mt-0.5">
          Tasks: {data.completed} of {data.total} completed
        </p>
      </div>
    );
  }
  return null;
}

export default function ProgressChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 sm:h-64 flex flex-col items-center justify-center text-secondaryText text-xs sm:text-sm p-4 text-center">
        <p className="font-medium text-mainText">No activity recorded yet.</p>
        <p className="text-xs text-gray-400 mt-1">Check off tasks to view your weekly productivity trend!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-56 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE9FE" />
          <XAxis
            dataKey="day"
            tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'Poppins' }}
            tickLine={false}
            axisLine={{ stroke: '#DDD6FE' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'Poppins' }}
            tickLine={false}
            axisLine={{ stroke: '#DDD6FE' }}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="percentage"
            fill="url(#violetGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
