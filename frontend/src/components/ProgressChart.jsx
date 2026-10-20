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
      <div className="bg-white p-3 rounded-lg border border-cardBorder shadow-card text-xs">
        <p className="font-semibold text-mainText">{label} ({data.date})</p>
        <p className="text-primary font-medium mt-1">
          Completion: {data.percentage}%
        </p>
        <p className="text-secondaryText">
          Completed: {data.completed} of {data.total} tasks
        </p>
      </div>
    );
  }
  return null;
}

export default function ProgressChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-secondaryText text-sm">
        <p>No historical progress data yet.</p>
        <p className="text-xs text-gray-400 mt-1">Complete tasks to view weekly trends!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE9FE" />
          <XAxis
            dataKey="day"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#DDD6FE' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#DDD6FE' }}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="percentage"
            fill="url(#violetGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
