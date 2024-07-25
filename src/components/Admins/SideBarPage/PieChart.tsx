// PieChart.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';

interface PieChartProps {
  data: any;
  options?: any;
}

const PieChart: React.FC<PieChartProps> = ({ data, options }) => {
  return <Pie data={data} options={options} />;
};

export default PieChart;
