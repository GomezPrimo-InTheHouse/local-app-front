// src/components/charts/EquiposPieChart.jsx

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from '../Ui/ChartContainer';

const COLORS = ['#0ea5e9', '#f97316', '#10b981', '#6366f1', '#ec4899', '#f59e0b'];

const EquiposPieChart = ({ data, isLoading }) => {
  return (
    <ChartContainer title="Distribución de Trabajos por Equipo" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="cantidad"
            nameKey="tipo"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#262626', border: '1px solid #404040' }}
          />
          <Legend wrapperStyle={{ color: '#f5f5f5' }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default EquiposPieChart;