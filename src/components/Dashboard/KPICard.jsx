// src/components/Dashboard/KPICard.jsx
import React from 'react';

const KPICard = ({ 
  title, 
  value, 
  icon, 
  subtitle, 
  isLoading, 
  isCurrency = false, 
  variant = 'default' 
}) => {
  
  // Formateador de moneda argentina (puedes cambiarlo a tu moneda local)
  const formatValue = (val) => {
    if (!val && val !== 0) return '$0';
    if (!isCurrency) return val;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Estilos según la variante
  const variants = {
    default: "bg-neutral-900/50 border-neutral-800",
    highlight: "bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 shadow-xl shadow-black/20"
  };

  if (isLoading) {
    return (
      <div className={`p-6 rounded-3xl border animate-pulse ${variants[variant]}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-neutral-800 rounded-xl" />
        </div>
        <div className="h-4 w-24 bg-neutral-800 rounded mb-2" />
        <div className="h-8 w-36 bg-neutral-700 rounded" />
      </div>
    );
  }

  return (
    <div className={`
      p-6 rounded-3xl border transition-all duration-300 
      hover:scale-[1.02] hover:border-neutral-600 group
      ${variants[variant]}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-neutral-800/80 rounded-2xl group-hover:bg-neutral-700 transition-colors">
          {icon}
        </div>
        {/* Badge decorativo opcional */}
        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
          {title}
        </p>
        <h2 className="text-3xl font-bold text-white tabular-nums tracking-tight">
          {formatValue(value)}
        </h2>
        {subtitle && (
          <p className="text-xs text-neutral-500 font-medium flex items-center gap-1 mt-2">
            <span className="w-1 h-1 rounded-full bg-neutral-700" />
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default KPICard;