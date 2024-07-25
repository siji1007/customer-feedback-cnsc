// BarChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  data: any;
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  return <Bar data={data} options={options} />;
};

export default BarChart;
