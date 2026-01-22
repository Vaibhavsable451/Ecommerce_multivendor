import React, { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppDispatch, useAppSelector } from 'State/Store';
import { fetchRevenueData } from 'State/seller/revenueSlice';

interface SellingChartProps {
  chartType: string;
}

const SellingChart: React.FC<SellingChartProps> = ({ chartType }) => {
  const dispatch = useAppDispatch();
  const { revenue } = useAppSelector((store) => store);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (chartType && jwt) {
      dispatch(fetchRevenueData({ type: chartType, jwt }));
    }
  }, [chartType, dispatch]);

  if (revenue.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading chart data...</div>
      </div>
    );
  }

  if (revenue.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error: {revenue.error}</div>
      </div>
    );
  }

  if (!revenue.data || revenue.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">No revenue data available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={revenue.data}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis 
  dataKey="date" 
  stroke="#FFFFFF"
  angle={-45}          // Move here
  textAnchor="end"     // Move here
  height={60}
  interval={0}
  tick={{ 
    fill: '#FFFFFF', 
    fontSize: 12       // Only styling props in tick
  }}
/>
<YAxis 
  dataKey="revenue" 
  stroke="#FFFFFF" 
  tick={{ fill: '#FFFFFF' }}
  domain={[0, 'dataMax + 1000']}  // Force showing from 0 to max + 1000
  tickFormatter={(value) => {
    console.log('Y value:', value);  // Log each Y value
    const num = Number(value);
    if (num >= 1000000) return `₹${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num.toFixed(2)}`;
  }}
/>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #404040',
              borderRadius: '4px',
              color: '#FFFFFF'
            }}
            formatter={(value: any) => {
              const numValue = Number(value);
              return [`₹${numValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`, 'Revenue'];
            }}
            labelFormatter={(label) => `Period: ${label}`}
          />
         <Area 
  type="monotone" 
  dataKey="revenue" 
  name="Revenue"
  stroke="#6366F1" 
  fill="#6366F1" 
  fillOpacity={0.2}
  strokeWidth={2}
  isAnimationActive={false}  // Disable animation to see raw data
/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SellingChart;