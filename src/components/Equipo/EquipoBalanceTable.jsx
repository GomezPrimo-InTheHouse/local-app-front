// src/components/Equipo/EquipoBalanceTable.jsx
const formatPrice = (p) =>
  Number(p || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const IconTrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const EquipoBalanceTable = ({ equiposAgrupadosPorMes, mostrarBalances }) => {
  if (!equiposAgrupadosPorMes.length) return null;

  const totalVenta   = equiposAgrupadosPorMes.reduce((acc, [, d]) => acc + d.totalVenta,   0);
  const totalCosto   = equiposAgrupadosPorMes.reduce((acc, [, d]) => acc + d.totalCosto,   0);
  const totalBalance = equiposAgrupadosPorMes.reduce((acc, [, d]) => acc + d.totalBalance, 0);

  return (
    <section className="pt-2">
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <IconTrendingUp /> Balance por Mes
      </h2>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto shadow-lg">
        <table className="min-w-full divide-y divide-neutral-800 text-sm">
          <thead className="bg-neutral-800/80">
            <tr>
              {["Mes", "Equipos", "Venta", "Costo", "Balance"].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider ${
                    i === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-800/60">
            {equiposAgrupadosPorMes.map(([key, data]) => (
              <tr key={key} className="hover:bg-neutral-800/40 transition-colors duration-100">
                <td className="px-4 py-3 font-medium text-white capitalize whitespace-nowrap">
                  {data.label}
                </td>
                <td className="px-4 py-3 text-right text-neutral-400">
                  {data.equipos.length}
                </td>
                <td className="px-4 py-3 text-right text-green-300 font-medium">
                  {mostrarBalances ? "****" : `$${formatPrice(data.totalVenta)}`}
                </td>
                <td className="px-4 py-3 text-right text-red-300 font-medium">
                  {mostrarBalances ? "****" : `-$${formatPrice(data.totalCosto)}`}
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${
                  data.totalBalance >= 0 ? "text-emerald-400" : "text-red-400"
                }`}>
                  {mostrarBalances ? "****" : `$${formatPrice(data.totalBalance)}`}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Fila de totales */}
          <tfoot className="bg-neutral-800/60 border-t-2 border-neutral-700">
            <tr>
              <td className="px-4 py-3 text-xs font-bold text-neutral-300 uppercase tracking-wide">
                Total general
              </td>
              <td className="px-4 py-3 text-right text-xs text-neutral-400 font-medium">
                {equiposAgrupadosPorMes.reduce((acc, [, d]) => acc + d.equipos.length, 0)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-green-300">
                {mostrarBalances ? "****" : `$${formatPrice(totalVenta)}`}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-red-300">
                {mostrarBalances ? "****" : `-$${formatPrice(totalCosto)}`}
              </td>
              <td className={`px-4 py-3 text-right text-sm font-bold ${
                totalBalance >= 0 ? "text-emerald-400" : "text-red-400"
              }`}>
                {mostrarBalances ? "****" : `$${formatPrice(totalBalance)}`}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

export default EquipoBalanceTable;