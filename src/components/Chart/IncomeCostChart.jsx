// src/components/charts/IncomeCostChart.jsx

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from '../Ui/ChartContainer';

const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const IncomeCostChart = ({ data, isLoading }) => {
  // ✨ CAMBIO CLAVE: Mapeamos los datos de la API a un formato que controlamos.
  // Esto hace que el componente sea más resistente a cambios en la API.
  const chartData = data
    ? [
        {
          name: 'Resumen Mensual', // Etiqueta para el eje X
          "Total Facturado": data.total_facturado,
          "Costo Total": data.costo_total,
          "Balance Final": data.balance_total,
        },
      ]
    : [];

  return (
    <ChartContainer title="Resumen Financiero del Mes" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis dataKey="name" tick={{ fill: '#a3a3a3' }} />
          <YAxis tickFormatter={formatCurrency} tick={{ fill: '#a3a3a3' }} width={120} /> {/* Ajuste de ancho */}
          <Tooltip
            contentStyle={{ backgroundColor: '#262626', border: '1px solid #404040' }}
            labelStyle={{ color: '#f5f5f5' }}
            formatter={(value) => formatCurrency(value)}
          />
          <Legend wrapperStyle={{ color: '#f5f5f5' }} />
          {/* ✨ AHORA USAMOS LAS CLAVES QUE DEFINIMOS ARRIBA */}
          <Bar dataKey="Total Facturado" fill="#3b82f6" />
          <Bar dataKey="Costo Total" fill="#ef4444" />
          <Bar dataKey="Balance Final" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default IncomeCostChart;