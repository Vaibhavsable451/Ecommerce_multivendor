import React, { FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

const data: ChartData[] = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const DemoChart: FC = () => {
  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis
            dataKey="name"
            stroke="#FFFFFF"
            tick={{ fill: '#FFFFFF' }}
          />
          <YAxis
            stroke="#FFFFFF"
            tick={{ fill: '#FFFFFF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #404040',
              borderRadius: '4px',
              color: '#FFFFFF'
            }}
          />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ fill: '#6366F1', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#818CF8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DemoChart;
