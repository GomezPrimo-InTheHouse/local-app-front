// src/pages/ServiciosPage.jsx
// Catálogo de servicios: precio fijo o calculado sobre el costo del repuesto.
// Solo el admin crea, edita, desactiva servicios y aplica aumentos masivos.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertNotification from "../components/Alerta/AlertNotification.jsx";
import useAuth from "../hooks/UseAuth.jsx";
import {
  getServicios,
  getCategoriasServicio,
  createCategoriaServicio,
  createServicio,
  updateServicio,
  aumentarPreciosServicios,
  getConfiguracionServicios,
  updateConfiguracionServicios,
} from "../api/ServicioApi.jsx";
import { CONFIG_DEFAULT, redondearPrecio, formatPesos } from "../utils/PrecioServicio.jsx";

const FORM_VACIO = {
  id: null,
  nombre: "",
  descripcion: "",
  categoria_id: "",
  tipo_calculo: "fijo",
  precio_base: "",
  multiplicador: "",
};

const soloDigitos = (v) => String(v ?? "").replace(/[^\d]/g, "");
const inputCls =
  "w-full bg-neutral-700 text-white p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60";

const ServiciosPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const esAdmin = user?.rol === "admin";

  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [config, setConfig] = useState(CONFIG_DEFAULT);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [verInactivos, setVerInactivos] = useState(false);

  const [modalServicio, setModalServicio] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [modalAumento, setModalAumento] = useState(false);
  const [aumento, setAumento] = useState({ porcentaje: "", categoria_id: "" });

  const [modalConfig, setModalConfig] = useState(false);
  const [formConfig, setFormConfig] = useState(CONFIG_DEFAULT);

  const [alert, setAlert] = useState({ message: "", type: "success", key: 0 });
  const showAlert = (message, type = "success") => setAlert({ message, type, key: Date.now() });

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [svs, cats, cfg] = await Promise.all([
        getServicios({ incluirInactivos: true }),
        getCategoriasServicio(),
        getConfiguracionServicios().catch(() => CONFIG_DEFAULT),
      ]);
      setServicios(Array.isArray(svs) ? svs : []);
      setCategorias(Array.isArray(cats) ? cats : []);
      setConfig({ ...CONFIG_DEFAULT, ...(cfg || {}) });
    } catch (e) {
      console.error("Error cargando servicios:", e);
      showAlert(e?.error || "No se pudieron cargar los servicios", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // ----- Filtros -----
  const serviciosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return servicios.filter((s) => {
      if (!verInactivos && !s.activo) return false;
      if (categoriaFiltro !== "todas" && String(s.categoria?.id) !== String(categoriaFiltro)) return false;
      if (!q) return true;
      return (
        s.nombre?.toLowerCase().includes(q) ||
        s.descripcion?.toLowerCase().includes(q) ||
        s.categoria?.nombre?.toLowerCase().includes(q)
      );
    });
  }, [servicios, busqueda, categoriaFiltro, verInactivos]);

  const agrupados = useMemo(() => {
    const map = new Map();
    for (const s of serviciosFiltrados) {
      const key = s.categoria?.nombre || "Sin categoría";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    }
    return [...map.entries()];
  }, [serviciosFiltrados]);

  // ----- Alta / edición -----
  const abrirCrear = () => {
    setForm({
      ...FORM_VACIO,
      categoria_id: categoriaFiltro !== "todas" ? String(categoriaFiltro) : "",
      multiplicador: String(config.multiplicador_repuesto_default ?? 3),
    });
    setNuevaCategoria("");
    setModalServicio(true);
  };

  const abrirEditar = (s) => {
    setForm({
      id: s.id,
      nombre: s.nombre ?? "",
      descripcion: s.descripcion ?? "",
      categoria_id: String(s.categoria?.id ?? ""),
      tipo_calculo: s.tipo_calculo,
      precio_base: String(Math.round(Number(s.precio_base) || 0)),
      multiplicador: String(s.multiplicador ?? config.multiplicador_repuesto_default ?? 3),
    });
    setNuevaCategoria("");
    setModalServicio(true);
  };

  const handleAgregarCategoria = async () => {
    const nombre = nuevaCategoria.trim();
    if (!nombre) return;
    try {
      const cat = await createCategoriaServicio(nombre);
      setCategorias((prev) => [...prev, cat]);
      setForm((f) => ({ ...f, categoria_id: String(cat.id) }));
      setNuevaCategoria("");
      showAlert(`Categoría "${cat.nombre}" creada`);
    } catch (e) {
      showAlert(e?.error || "No se pudo crear la categoría", "error");
    }
  };

  const handleGuardarServicio = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return showAlert("El nombre es obligatorio", "error");
    if (!form.categoria_id) return showAlert("Elegí una categoría", "error");
    if (form.tipo_calculo === "fijo" && !(Number(form.precio_base) > 0)) {
      return showAlert("El precio base debe ser mayor a 0", "error");
    }
    if (form.tipo_calculo === "repuesto" && !(Number(form.multiplicador) > 0)) {
      return showAlert("El multiplicador debe ser mayor a 0", "error");
    }

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      categoria_id: Number(form.categoria_id),
      tipo_calculo: form.tipo_calculo,
      precio_base: form.tipo_calculo === "fijo" ? Number(form.precio_base) : 0,
      multiplicador: Number(form.multiplicador) || Number(config.multiplicador_repuesto_default) || 3,
    };

    setGuardando(true);
    try {
      if (form.id) {
        await updateServicio(form.id, payload);
        showAlert("Servicio actualizado ✅");
      } else {
        await createServicio(payload);
        showAlert("Servicio creado ✅");
      }
      setModalServicio(false);
      await cargar();
    } catch (e2) {
      showAlert(e2?.error || "No se pudo guardar el servicio", "error");
    } finally {
      setGuardando(false);
    }
  };

  const toggleActivo = async (s) => {
    try {
      await updateServicio(s.id, { activo: !s.activo });
      showAlert(s.activo ? "Servicio desactivado" : "Servicio activado");
      await cargar();
    } catch (e) {
      showAlert(e?.error || "No se pudo actualizar", "error");
    }
  };

  // ----- Aumento masivo -----
  const previewAumento = useMemo(() => {
    const pct = Number(aumento.porcentaje);
    if (!pct) return [];
    return servicios
      .filter(
        (s) =>
          s.activo &&
          s.tipo_calculo === "fijo" &&
          Number(s.precio_base) > 0 &&
          (!aumento.categoria_id || String(s.categoria?.id) === String(aumento.categoria_id))
      )
      .map((s) => ({
        id: s.id,
        nombre: s.nombre,
        antes: Number(s.precio_base),
        despues: Math.ceil((Number(s.precio_base) * (1 + pct / 100)) / 1000 - 1e-9) * 1000,
      }));
  }, [servicios, aumento]);

  const handleAplicarAumento = async () => {
    const pct = Number(aumento.porcentaje);
    if (!pct) return showAlert("Indicá un porcentaje", "error");
    const alcance = aumento.categoria_id
      ? categorias.find((c) => String(c.id) === String(aumento.categoria_id))?.nombre
      : "todas las categorías";
    if (!window.confirm(`¿Aplicar ${pct > 0 ? "+" : ""}${pct}% a ${previewAumento.length} servicios de ${alcance}?`)) return;

    setGuardando(true);
    try {
      const res = await aumentarPreciosServicios({
        porcentaje: pct,
        categoria_id: aumento.categoria_id ? Number(aumento.categoria_id) : null,
      });
      showAlert(`Aumento aplicado a ${res?.actualizados ?? previewAumento.length} servicios ✅`);
      setModalAumento(false);
      setAumento({ porcentaje: "", categoria_id: "" });
      await cargar();
    } catch (e) {
      showAlert(e?.error || "No se pudo aplicar el aumento", "error");
    } finally {
      setGuardando(false);
    }
  };

  // ----- Configuración -----
  const abrirConfig = () => {
    setFormConfig({ ...config });
    setModalConfig(true);
  };

  const handleGuardarConfig = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const nueva = await updateConfiguracionServicios({
        multiplicador_repuesto_default: Number(formConfig.multiplicador_repuesto_default),
        redondeo_multiplo: Number(formConfig.redondeo_multiplo),
        redondeo_modo: formConfig.redondeo_modo,
      });
      setConfig({ ...CONFIG_DEFAULT, ...(nueva || formConfig) });
      setModalConfig(false);
      showAlert("Configuración guardada ✅");
    } catch (e2) {
      showAlert(e2?.error || "No se pudo guardar la configuración", "error");
    } finally {
      setGuardando(false);
    }
  };

  const ejemploRepuesto = 20000;
  const multEjemplo = Number(form.multiplicador) || 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 xl:w-1/5 bg-neutral-800 p-4 sm:p-6 flex-col justify-start shadow-xl z-10 lg:flex hidden gap-3">
        <button onClick={() => navigate("/")} className="px-4 mb-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition text-sm">
          ⬅️ Volver al Dashboard
        </button>

        {esAdmin && (
          <>
            <button onClick={abrirCrear} className="w-full bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md font-semibold">
              + Nuevo servicio
            </button>
            <button onClick={() => setModalAumento(true)} className="w-full bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-md text-sm">
              📈 Aumento masivo
            </button>
          </>
        )}

        <div className="mt-2 rounded-xl bg-neutral-900/60 border border-white/10 p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-neutral-300">Cálculo de precios</p>
            {esAdmin && (
              <button onClick={abrirConfig} className="bg-transparent p-0 border-0 text-amber-400 hover:text-amber-300">Editar</button>
            )}
          </div>
          <p className="text-neutral-400">
            Redondeo: <span className="text-white">{config.redondeo_modo === "arriba" ? "hacia arriba" : config.redondeo_modo === "abajo" ? "hacia abajo" : "al más cercano"}</span> a{" "}
            <span className="text-white">{formatPesos(config.redondeo_multiplo)}</span>
          </p>
          <p className="text-neutral-400">
            Multiplicador inicial de repuestos: <span className="text-white">×{config.multiplicador_repuesto_default}</span>
          </p>
          <p className="text-neutral-500">
            Ej.: repuesto {formatPesos(20450)} × 3 = {formatPesos(61350)} → <span className="text-amber-300">{formatPesos(redondearPrecio(61350, config))}</span>
          </p>
        </div>

        <div className="mt-auto text-sm text-gray-400">
          <p className="font-medium">Catálogo de servicios</p>
          <p className="text-xs">Mano de obra, sin IVA. {esAdmin ? "" : "Solo el administrador puede editar precios."}</p>
        </div>
      </aside>

      {/* Header mobile */}
      <header className="lg:hidden w-full bg-neutral-800 p-4 flex justify-between items-center shadow gap-2">
        <button onClick={() => navigate("/")} className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition text-sm">
          ⬅️ Volver
        </button>
        {esAdmin && (
          <div className="flex gap-2">
            <button onClick={() => setModalAumento(true)} className="px-3 py-1 bg-neutral-700 rounded-lg text-sm">📈</button>
            <button onClick={abrirConfig} className="px-3 py-1 bg-neutral-700 rounded-lg text-sm">⚙️</button>
            <button onClick={abrirCrear} className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm">+ Servicio</button>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="w-full lg:w-[75%] p-4 sm:p-6 overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-xl font-semibold">🛠️ Servicios</h3>
          <span className="text-xs text-neutral-400">
            {servicios.filter((s) => s.activo).length} activos · {categorias.length} categorías
          </span>
        </div>

        {alert.message && (
          <AlertNotification
            key={alert.key}
            message={alert.message}
            type={alert.type}
            duration={2500}
            onClose={() => setAlert((prev) => ({ ...prev, message: "" }))}
          />
        )}

        {/* Filtros */}
        <div className="space-y-3 mb-5">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar servicio (ej.: formateo, cabezal, pantalla)…"
            className="w-full bg-neutral-800 border border-white/10 text-white p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60"
          />
          <div className="flex flex-wrap gap-2 items-center">
            {[{ id: "todas", nombre: "Todas" }, ...categorias].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoriaFiltro(String(c.id))}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  String(categoriaFiltro) === String(c.id)
                    ? "bg-amber-600 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {c.nombre}
              </button>
            ))}
            {esAdmin && (
              <label className="ml-auto flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                <input type="checkbox" checked={verInactivos} onChange={(e) => setVerInactivos(e.target.checked)} />
                Ver inactivos
              </label>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Cargando servicios…</p>
        ) : agrupados.length === 0 ? (
          <p className="text-gray-400">No hay servicios que coincidan.</p>
        ) : (
          <div className="space-y-6">
            {agrupados.map(([categoria, lista]) => (
              <section key={categoria}>
                <h4 className="text-xs tracking-widest uppercase text-neutral-500 mb-2">
                  {categoria} <span className="text-neutral-600">({lista.length})</span>
                </h4>
                <ul className="divide-y divide-white/5 rounded-xl bg-neutral-800/70 border border-white/10 overflow-hidden">
                  {lista.map((s) => (
                    <li key={s.id} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 ${s.activo ? "" : "opacity-50"}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">
                          {s.nombre}
                          {!s.activo && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300">inactivo</span>}
                        </p>
                        {s.descripcion && <p className="text-xs text-neutral-400 mt-0.5">{s.descripcion}</p>}
                      </div>
                      <div className="flex items-center gap-3 sm:justify-end">
                        {s.tipo_calculo === "repuesto" ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-sky-600/20 text-sky-300 whitespace-nowrap">
                            Repuesto ×{Number(s.multiplicador)}
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-green-300 whitespace-nowrap">{formatPesos(s.precio_base)}</span>
                        )}
                        {esAdmin && (
                          <div className="flex gap-1.5">
                            <button onClick={() => abrirEditar(s)} className="text-xs px-2.5 py-1 rounded bg-amber-600/20 text-amber-300 hover:bg-amber-600/30">
                              Editar
                            </button>
                            <button onClick={() => toggleActivo(s)} className="text-xs px-2.5 py-1 rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600">
                              {s.activo ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Modal servicio */}
      {modalServicio && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleGuardarServicio} className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">{form.id ? "Editar servicio" : "Nuevo servicio"}</h2>

            <div>
              <label className="block mb-1 text-sm text-gray-300">Nombre *</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputCls} placeholder="Ej.: Formateo + instalación de programas" />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-300">Categoría *</label>
              <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })} className={inputCls}>
                <option value="">Seleccioná una categoría</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <div className="flex gap-2 mt-2">
                <input value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} className={inputCls} placeholder="…o crear una categoría nueva" />
                <button type="button" onClick={handleAgregarCategoria} className="px-3 rounded bg-neutral-700 hover:bg-neutral-600 text-sm whitespace-nowrap">Agregar</button>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-300">Cómo se calcula el precio</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: "fijo", t: "Precio fijo", d: "Precio de lista" },
                  { v: "repuesto", t: "Sobre repuesto", d: "Costo × multiplicador" },
                ].map((o) => (
                  <button
                    type="button"
                    key={o.v}
                    onClick={() => setForm({ ...form, tipo_calculo: o.v })}
                    className={`p-2 rounded-lg border text-left ${form.tipo_calculo === o.v ? "border-amber-500 bg-amber-600/10" : "border-white/10 bg-neutral-700/40"}`}
                  >
                    <p className="text-sm font-semibold">{o.t}</p>
                    <p className="text-[11px] text-neutral-400">{o.d}</p>
                  </button>
                ))}
              </div>
            </div>

            {form.tipo_calculo === "fijo" ? (
              <div>
                <label className="block mb-1 text-sm text-gray-300">Precio base *</label>
                <input inputMode="numeric" value={form.precio_base} onChange={(e) => setForm({ ...form, precio_base: soloDigitos(e.target.value) })} className={inputCls} placeholder="Ej.: 56000" />
                {form.precio_base && <p className="text-xs text-neutral-400 mt-1">{formatPesos(form.precio_base)}</p>}
              </div>
            ) : (
              <div>
                <label className="block mb-1 text-sm text-gray-300">Multiplicador del repuesto *</label>
                <input inputMode="decimal" value={form.multiplicador} onChange={(e) => setForm({ ...form, multiplicador: e.target.value.replace(",", ".").replace(/[^\d.]/g, "") })} className={inputCls} placeholder="3" />
                {multEjemplo > 0 && (
                  <p className="text-xs text-neutral-400 mt-1">
                    Ej.: repuesto {formatPesos(ejemploRepuesto)} × {multEjemplo} = {formatPesos(ejemploRepuesto * multEjemplo)} → sugerido{" "}
                    <span className="text-amber-300">{formatPesos(redondearPrecio(ejemploRepuesto * multEjemplo, config))}</span>
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm text-gray-300">Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className={inputCls} rows={3} placeholder="Qué incluye, condiciones, notas…" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalServicio(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">Cancelar</button>
              <button type="submit" disabled={guardando} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded disabled:opacity-50">
                {guardando ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal aumento masivo */}
      {modalAumento && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">📈 Aumento masivo de precios</h2>
            <p className="text-xs text-neutral-400">
              Aplica a servicios activos de precio fijo. Los precios se redondean hacia arriba a $1.000. Los presupuestos ya hechos no cambian.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-sm text-gray-300">Porcentaje</label>
                <input inputMode="decimal" value={aumento.porcentaje} onChange={(e) => setAumento({ ...aumento, porcentaje: e.target.value.replace(",", ".").replace(/[^\d.-]/g, "") })} className={inputCls} placeholder="Ej.: 10" />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-300">Categoría</label>
                <select value={aumento.categoria_id} onChange={(e) => setAumento({ ...aumento, categoria_id: e.target.value })} className={inputCls}>
                  <option value="">Todas</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>

            {previewAumento.length > 0 && (
              <div className="rounded-lg border border-white/10 max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-neutral-900/60 sticky top-0">
                    <tr><th className="text-left p-2">Servicio</th><th className="text-right p-2">Antes</th><th className="text-right p-2">Después</th></tr>
                  </thead>
                  <tbody>
                    {previewAumento.map((p) => (
                      <tr key={p.id} className="border-t border-white/5">
                        <td className="p-2 text-neutral-300">{p.nombre}</td>
                        <td className="p-2 text-right text-neutral-400">{formatPesos(p.antes)}</td>
                        <td className="p-2 text-right text-green-300">{formatPesos(p.despues)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalAumento(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">Cancelar</button>
              <button type="button" onClick={handleAplicarAumento} disabled={guardando || previewAumento.length === 0} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded disabled:opacity-50">
                {guardando ? "Aplicando…" : `Aplicar a ${previewAumento.length} servicios`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal configuración */}
      {modalConfig && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleGuardarConfig} className="bg-neutral-800 p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">⚙️ Cálculo de precios</h2>
            <div>
              <label className="block mb-1 text-sm text-gray-300">Multiplicador inicial para servicios nuevos sobre repuesto</label>
              <input inputMode="decimal" value={formConfig.multiplicador_repuesto_default} onChange={(e) => setFormConfig({ ...formConfig, multiplicador_repuesto_default: e.target.value.replace(",", ".").replace(/[^\d.]/g, "") })} className={inputCls} />
              <p className="text-[11px] text-neutral-500 mt-1">Cada servicio tiene su propio multiplicador; este es solo el valor con el que arranca.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-sm text-gray-300">Redondear a</label>
                <input inputMode="numeric" value={formConfig.redondeo_multiplo} onChange={(e) => setFormConfig({ ...formConfig, redondeo_multiplo: soloDigitos(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-300">Dirección</label>
                <select value={formConfig.redondeo_modo} onChange={(e) => setFormConfig({ ...formConfig, redondeo_modo: e.target.value })} className={inputCls}>
                  <option value="arriba">Hacia arriba</option>
                  <option value="cercano">Al más cercano</option>
                  <option value="abajo">Hacia abajo</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-neutral-400">
              Ej.: {formatPesos(61350)} → <span className="text-amber-300">{formatPesos(redondearPrecio(61350, formConfig))}</span>
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalConfig(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">Cancelar</button>
              <button type="submit" disabled={guardando} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded disabled:opacity-50">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServiciosPage;