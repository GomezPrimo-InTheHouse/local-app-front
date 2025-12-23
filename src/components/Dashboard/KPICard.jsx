// src/components/Dashboard/KPICard.jsx
import React from "react";

const safeNum = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

const formatCurrency = (value) =>
  safeNum(value).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const formatNumber = (value) => safeNum(value).toLocaleString("es-AR");

const KPICard = ({
  title,
  value,
  icon,
  subtitle,
  isCurrency = false,
  isLoading = false,
  variant = "default", // "highlight"
}) => {
  const isPercent = typeof value === "string" && value.trim().endsWith("%");

  const displayValue = (() => {
    if (isLoading) return "—";
    if (isPercent) return value;
    if (typeof value === "string") return value;
    if (isCurrency) return formatCurrency(value);
    return formatNumber(value);
  })();

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-3xl border",
        "bg-neutral-950/40 backdrop-blur",
        "p-5 sm:p-6",
        "min-w-0", // CLAVE: evita desborde en grids
        variant === "highlight"
          ? "border-emerald-500/25 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_30px_80px_-40px_rgba(16,185,129,0.55)]"
          : "border-neutral-800 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)]",
      ].join(" ")}
    >
      {/* Glow suave */}
      <div
        className={[
          "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
          variant === "highlight"
            ? "bg-[radial-gradient(700px_circle_at_20%_0%,rgba(16,185,129,0.15),transparent_50%)]"
            : "bg-[radial-gradient(700px_circle_at_20%_0%,rgba(168,85,247,0.12),transparent_50%)]",
        ].join(" ")}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs tracking-[0.18em] text-neutral-400 uppercase">
            {title}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900/70 border border-neutral-800">
            {icon}
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
        </div>
      </div>

      {/* Value */}
      <div className="relative mt-4 min-w-0">
        {isLoading ? (
          <div className="h-10 w-2/3 rounded-xl bg-neutral-800/60 animate-pulse" />
        ) : (
          <div
            className={[
              "font-extrabold tracking-tight text-white",
              "tabular-nums",
              "leading-[1.05]",
              "min-w-0",
              // ✅ CLAMP: se adapta al ancho y evita el desfasaje
              "text-[clamp(28px,3.3vw,44px)] sm:text-[clamp(30px,3vw,46px)]",
              // ✅ si el valor es muy largo, que no se salga
              "truncate",
            ].join(" ")}
            title={String(displayValue)}
          >
            {displayValue}
          </div>
        )}

        {!!subtitle && (
          <p className="mt-2 text-sm text-neutral-400 min-w-0">
            <span className="truncate block">{subtitle}</span>
          </p>
        )}
      </div>

      {/* Footer line */}
      <div className="relative mt-5 h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent opacity-60" />
    </div>
  );
};

export default KPICard;
