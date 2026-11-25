// src/utils/Modulos.jsx
// Módulos que el admin puede habilitar a cada empleado.
// Estadísticas, Históricas y Empleados son siempre solo admin.
export const MODULOS = [
  { key: "clientes",  label: "Clientes",  to: "/clientes",  emoji: "👥", descripcion: "Alta y edición de clientes" },
  { key: "equipos",   label: "Equipos",   to: "/equipos",   emoji: "💻", descripcion: "Equipos, órdenes de trabajo y presupuestos" },
  { key: "ventas",    label: "Ventas",    to: "/ventas",    emoji: "🛒", descripcion: "Registro de ventas y pagos" },
  { key: "productos", label: "Productos", to: "/productos", emoji: "📦", descripcion: "Stock y catálogo de productos" },
  { key: "servicios", label: "Servicios", to: "/servicios", emoji: "🛠️", descripcion: "Catálogo de servicios (solo lectura)" },
  { key: "celulares", label: "Celulares", to: "/celulares", emoji: "📱", descripcion: "Compra y venta de celulares" },
];

export const labelModulo = (key) => MODULOS.find((m) => m.key === key)?.label ?? key;
