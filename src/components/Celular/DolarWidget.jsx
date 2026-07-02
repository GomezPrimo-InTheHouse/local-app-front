// src/components/Celular/DolarWidget.jsx
import { useEffect, useState } from "react";
import { getCotizacionActual, setCotizacionManual } from "../../api/DolarApi.jsx";

const DolarWidget = ({ onCambio }) => {
  const [dolar, setDolar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [valorManual, setValorManual] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCotizacionActual();
      setDolar(res?.data ?? res);
    } catch (err) {
      console.error("Error al obtener cotización:", err);
      setError("No se pudo obtener la cotización del dólar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardarManual = async () => {
    if (!valorManual || isNaN(Number(valorManual)) || Number(valorManual) <= 0) return;
    try {
      setGuardando(true);
      await setCotizacionManual(Number(valorManual));
      await cargar();
      setEditando(false);
      setValorManual("");
      onCambio && onCambio(); // avisa al padre para que recargue el listado (precios recalculados)
    } catch (err) {
      console.error("Error al setear cotización manual:", err);
      setError("No se pudo actualizar la cotización");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-4 px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 text-gray-400 text-sm">
        Cargando cotización del dólar...
      </div>
    );
  }

  if (error && !dolar) {
    return (
      <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-4 px-4 py-3 rounded-lg bg-neutral-800 border border-gray-700 flex flex-wrap items-center gap-3">
      <span className="text-white font-semibold">
        Dólar hoy: <span className="text-emerald-400">${Number(dolar.valor).toLocaleString("es-AR")}</span>
      </span>
      <span className="text-xs text-gray-400">
        ({dolar.fuente === "manual" ? "cargado manualmente" : "automático"})
      </span>

      {!editando ? (
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="ml-auto text-xs px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-neutral-700 transition"
        >
          Corregir valor de hoy
        </button>
      ) : (
        <div className="ml-auto flex items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={valorManual}
            onChange={(e) => setValorManual(e.target.value.replace(",", "."))}
            placeholder="Nuevo valor"
            className="w-28 bg-neutral-900 text-white text-sm p-1.5 rounded border border-gray-600 focus:outline-none focus:border-emerald-500"
            disabled={guardando}
          />
          <button
            type="button"
            onClick={guardarManual}
            disabled={guardando}
            className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => { setEditando(false); setValorManual(""); }}
            disabled={guardando}
            className="text-xs px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-neutral-700"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default DolarWidget;