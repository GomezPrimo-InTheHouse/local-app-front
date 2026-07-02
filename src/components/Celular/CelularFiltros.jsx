// src/components/Celular/CelularFiltros.jsx
import { useEffect, useState } from "react";
import { getOpcionesFiltroCelulares } from "../../api/CelularApi.jsx";

const CelularFiltros = ({ filtros, onCambiarFiltro, onLimpiar }) => {
  const [opciones, setOpciones] = useState({
    marcas: [], rams: [], almacenamientos: [], gamas: [], tipos_entrega: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getOpcionesFiltroCelulares();
        setOpciones(res?.data ?? res);
      } catch (err) {
        console.error("Error al cargar opciones de filtro:", err);
      }
    })();
  }, []);

  const selectClass = "bg-neutral-800 text-white text-sm p-2 rounded border border-gray-700 focus:outline-none focus:border-emerald-500";

  const ETIQUETAS_ENTREGA = {
    EN_STOCK_LOCAL: "En stock",
    A_PEDIDO_24H: "A pedido",
    SIN_STOCK_CONSULTAR: "Sin stock (consultar)",
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <select
        value={filtros.marca}
        onChange={(e) => onCambiarFiltro("marca", e.target.value)}
        className={selectClass}
      >
        <option value="">Todas las marcas</option>
        {opciones.marcas.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      <select
        value={filtros.ram_gb}
        onChange={(e) => onCambiarFiltro("ram_gb", e.target.value)}
        className={selectClass}
      >
        <option value="">Toda la RAM</option>
        {opciones.rams.map((r) => <option key={r} value={r}>{r} GB RAM</option>)}
      </select>

      <select
        value={filtros.almacenamiento_gb}
        onChange={(e) => onCambiarFiltro("almacenamiento_gb", e.target.value)}
        className={selectClass}
      >
        <option value="">Todo el almacenamiento</option>
        {opciones.almacenamientos.map((a) => <option key={a} value={a}>{a} GB</option>)}
      </select>

      <select
        value={filtros.gama}
        onChange={(e) => onCambiarFiltro("gama", e.target.value)}
        className={selectClass}
      >
        <option value="">Todas las gamas</option>
        <option value="baja">Gama baja</option>
        <option value="media">Gama media</option>
        <option value="alta">Gama alta</option>
      </select>

      <select
        value={filtros.tipo_entrega}
        onChange={(e) => onCambiarFiltro("tipo_entrega", e.target.value)}
        className={selectClass}
      >
        <option value="">Stock y a pedido</option>
        {Object.entries(ETIQUETAS_ENTREGA).map(([valor, etiqueta]) => (
          <option key={valor} value={valor}>{etiqueta}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={onLimpiar}
        className="text-sm px-3 py-2 rounded border border-gray-600 text-gray-300 hover:bg-neutral-800 transition"
      >
        Limpiar filtros
      </button>
    </div>
  );
};

export default CelularFiltros;