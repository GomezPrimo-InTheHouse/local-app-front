// src/utils/precioServicio.js
// Cálculo de precios de servicios (misma lógica que la base de datos).

export const CONFIG_DEFAULT = {
  multiplicador_repuesto_default: 3,
  redondeo_multiplo: 5000,
  redondeo_modo: "arriba", // arriba | cercano | abajo
};

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// Redondeo según configuración. Por defecto: hacia ARRIBA al múltiplo de $5.000
// 61.350 → 65.000 · 60.000 → 60.000 · 60.001 → 65.000
export const redondearPrecio = (valor, config = CONFIG_DEFAULT) => {
  const v = num(valor);
  const m = num(config?.redondeo_multiplo);
  if (m <= 0) return Math.round(v);
  const modo = config?.redondeo_modo || "arriba";
  if (modo === "abajo") return Math.floor(v / m) * m;
  if (modo === "cercano") return Math.round(v / m) * m;
  return Math.ceil(v / m - 1e-9) * m;
};

// Precio de lista de una línea (sin recargo)
//  - fijo:     precio base del servicio
//  - repuesto: costo del repuesto × multiplicador (redondeado)
export const precioListaLinea = (linea, config) => {
  if (linea.tipo_calculo === "repuesto") {
    return redondearPrecio(num(linea.costo_repuesto) * num(linea.multiplicador || 1), config);
  }
  if (linea.tipo_calculo === "manual") return num(linea.precio_final);
  return num(linea.precio_base);
};

// Precio sugerido = lista + recargo % (redondeado si hay recargo)
export const precioSugeridoLinea = (linea, config) => {
  const lista = precioListaLinea(linea, config);
  const recargo = num(linea.recargo_pct);
  if (!recargo) return lista;
  return redondearPrecio(lista * (1 + recargo / 100), config);
};

// Diferencia % del precio final contra la lista
export const diferenciaContraLista = (precioFinal, precioLista) => {
  const lista = num(precioLista);
  if (lista <= 0) return null;
  const pct = ((num(precioFinal) - lista) / lista) * 100;
  return Math.abs(pct) < 0.05 ? 0 : pct;
};

export const formatPesos = (n) =>
  num(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });