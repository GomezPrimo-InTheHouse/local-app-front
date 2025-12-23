// // src/components/Dashboard/KPICard.jsx
// import React from "react";

// const safeNum = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

// const formatCurrency = (value) =>
//   safeNum(value).toLocaleString("es-AR", {
//     style: "currency",
//     currency: "ARS",
//     maximumFractionDigits: 0,
//   });

// const formatNumber = (value) => safeNum(value).toLocaleString("es-AR");

// const KPICard = ({
//   title,
//   value,
//   icon,
//   subtitle,
//   isCurrency = false,
//   isLoading = false,
//   variant = "default", // "highlight"
// }) => {
//   const isPercent = typeof value === "string" && value.trim().endsWith("%");

//   const displayValue = (() => {
//     if (isLoading) return "—";
//     if (isPercent) return value;
//     if (typeof value === "string") return value;
//     if (isCurrency) return formatCurrency(value);
//     return formatNumber(value);
//   })();

//   return (
//     <div
//       className={[
//         "group relative overflow-hidden rounded-3xl border",
//         "bg-neutral-950/40 backdrop-blur",
//         "p-5 sm:p-6",
//         "min-w-0", // CLAVE: evita desborde en grids
//         variant === "highlight"
//           ? "border-emerald-500/25 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_30px_80px_-40px_rgba(16,185,129,0.55)]"
//           : "border-neutral-800 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)]",
//       ].join(" ")}
//     >
//       {/* Glow suave */}
//       <div
//         className={[
//           "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
//           variant === "highlight"
//             ? "bg-[radial-gradient(700px_circle_at_20%_0%,rgba(16,185,129,0.15),transparent_50%)]"
//             : "bg-[radial-gradient(700px_circle_at_20%_0%,rgba(168,85,247,0.12),transparent_50%)]",
//         ].join(" ")}
//       />

//       {/* Header */}
//       <div className="relative flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <p className="text-[11px] sm:text-xs tracking-[0.18em] text-neutral-400 uppercase">
//             {title}
//           </p>
//         </div>

//         <div className="shrink-0 flex items-center gap-3">
//           <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900/70 border border-neutral-800">
//             {icon}
//           </span>
//           <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
//         </div>
//       </div>

//       {/* Value */}
//       <div className="relative mt-4 min-w-0">
//         {isLoading ? (
//           <div className="h-10 w-2/3 rounded-xl bg-neutral-800/60 animate-pulse" />
//         ) : (
//           <div
//             className={[
//               "font-extrabold tracking-tight text-white",
//               "tabular-nums",
//               "leading-[1.05]",
//               "min-w-0",
//               // ✅ CLAMP: se adapta al ancho y evita el desfasaje
//               "text-[clamp(28px,3.3vw,44px)] sm:text-[clamp(30px,3vw,46px)]",
//               // ✅ si el valor es muy largo, que no se salga
//               "truncate",
//             ].join(" ")}
//             title={String(displayValue)}
//           >
//             {displayValue}
//           </div>
//         )}

//         {!!subtitle && (
//           <p className="mt-2 text-sm text-neutral-400 min-w-0">
//             <span className="truncate block">{subtitle}</span>
//           </p>
//         )}
//       </div>

//       {/* Footer line */}
//       <div className="relative mt-5 h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent opacity-60" />
//     </div>
//   );
// };

// export default KPICard;

import React, { useMemo } from "react";
import { motion } from "framer-motion"; // Opcional, pero recomendado para el "feel" premium

const KPICard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend, // Nuevo: { value: 12, isUpward: true }
  isCurrency = false,
  isLoading = false,
  variant = "default", // "default" | "highlight" | "error"
}) => {
  
  // Lógica de formateo optimizada con useMemo
  const formattedValue = useMemo(() => {
    if (isLoading) return null;
    
    const num = Number(value);
    const isPercent = typeof value === "string" && value.includes("%");

    if (isPercent) return value;
    if (isNaN(num)) return value;

    if (isCurrency) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(num);
    }

    return new Intl.NumberFormat("es-AR").format(num);
  }, [value, isCurrency, isLoading]);

  // Configuración de estilos según variante
  const variants = {
    default: "border-neutral-800 hover:border-neutral-700 shadow-black/50",
    highlight: "border-emerald-500/30 shadow-emerald-500/10",
    error: "border-rose-500/30 shadow-rose-500/10"
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`
        group relative overflow-hidden rounded-[2rem] border p-6
        bg-neutral-900/50 backdrop-blur-xl
        transition-all duration-300
        ${variants[variant]}
      `}
    >
      {/* Efecto de Iluminación de Fondo (Spotlight) */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/5 blur-[50px] transition-opacity group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Header: Icono y Título */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`
              flex h-10 w-10 items-center justify-center rounded-xl 
              bg-neutral-800/80 border border-neutral-700/50
              text-neutral-400 group-hover:text-white transition-colors
            `}>
              {Icon}
            </div>
            <span className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
              {title}
            </span>
          </div>
          
          {/* Indicador de tendencia o estado sutil */}
          {trend && (
            <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${trend.isUpward ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {trend.isUpward ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>

        {/* Cuerpo: Valor Principal */}
        <div className="space-y-1">
          {isLoading ? (
            <div className="h-10 w-32 animate-pulse rounded-lg bg-neutral-800" />
          ) : (
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums leading-none">
              {formattedValue}
            </h2>
          )}
          
          {subtitle && (
            <p className="text-sm text-neutral-500 font-medium line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Decoración Inferior: Progress Bar Sutil (Opcional) */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-neutral-800">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          className={`h-full ${variant === 'highlight' ? 'bg-emerald-500/40' : 'bg-neutral-700'}`}
        />
      </div>
    </motion.div>
  );
};

export default KPICard;