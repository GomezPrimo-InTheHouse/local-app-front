// src/components/Celular/CelularModal.jsx
import { useEffect, useState, useRef } from "react";
import { getCotizacionActual } from "../../api/DolarApi.jsx";
import AlertNotification from "../Alerta/AlertNotification.jsx";

const GAMAS = [
  { value: "baja", label: "Gama baja" },
  { value: "media", label: "Gama media" },
  { value: "alta", label: "Gama alta" },
];

const TIPOS_ENTREGA_SIN_STOCK = [
  { value: "A_PEDIDO_24H", label: "A pedido (24-48hs)" },
  { value: "SIN_STOCK_CONSULTAR", label: "Sin stock (consultar)" },
];

const FORM_VACIO = {
  nombre: "",
  marca: "",
  color: "",
  stock: "",
  costo_usd: "",
  margen_porcentaje: "30",
  ram_gb: "",
  almacenamiento_gb: "",
  gama: "media",
  tipo_entrega: "A_PEDIDO_24H",
  precio: "",
  descripcion: "",
  descripcion_web: "",
};

const CelularModal = ({ isOpen, onClose, onSave, celular = null }) => {
  const [form, setForm] = useState(FORM_VACIO);
  const [subirWeb, setSubirWeb] = useState(false);
  const [oferta, setOferta] = useState("");

  const [dolar, setDolar] = useState(null);
  // 'margen'  -> el margen es el dato "fuente" y el precio se calcula solo
  // 'precio'  -> el precio es el dato "fuente" y el margen se calcula solo
  const [modoCalculo, setModoCalculo] = useState("margen");
  const skipCalcPrecioRef = useRef(false); // evita recalcular al inicializar/abrir el modal
  const skipCalcMargenRef = useRef(false);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file2, setFile2] = useState(null);
  const [previewUrl2, setPreviewUrl2] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOver2, setIsDragOver2] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [focused, setFocused] = useState({ stock: false, costo_usd: false, precio: false });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: null, type: "" });

  // --- Cargar dólar del día al abrir ---
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await getCotizacionActual();
        setDolar(res?.data ?? res);
      } catch (e) {
        console.error("Error al cargar dólar:", e);
        setNotification({ message: "No se pudo cargar la cotización del dólar", type: "warning" });
      }
    })();
  }, [isOpen]);

  // --- Inicialización / reset ---
  useEffect(() => {
    if (!isOpen) {
      setForm(FORM_VACIO);
      setSubirWeb(false);
      setOferta("");
      setFile(null);
      setPreviewUrl(null);
      setFile2(null);
      setPreviewUrl2(null);
      setModoCalculo("margen");
      setErrors({});
      setNotification({ message: null, type: "" });
      setIsSaving(false);
      return;
    }

    if (celular) {
      setForm({
        nombre: celular.nombre ?? "",
        marca: celular.marca ?? "",
        color: celular.color ?? "",
        stock: celular.stock != null ? String(celular.stock) : "",
        costo_usd: celular.costo_usd != null ? String(celular.costo_usd).replace(",", ".") : "",
        margen_porcentaje: celular.margen_porcentaje != null ? String(celular.margen_porcentaje).replace(",", ".") : "30",
        ram_gb: celular.ram_gb != null ? String(celular.ram_gb) : "",
        almacenamiento_gb: celular.almacenamiento_gb != null ? String(celular.almacenamiento_gb) : "",
        gama: celular.gama ?? "media",
        tipo_entrega: celular.tipo_entrega ?? "A_PEDIDO_24H",
        precio: celular.precio != null ? String(celular.precio).replace(",", ".") : "",
        descripcion: celular.descripcion ?? "",
        descripcion_web: celular.descripcion_web ?? "",
      });
      setSubirWeb(Boolean(celular.subir_web));
      setOferta(celular.oferta != null ? String(celular.oferta) : "");
      setPreviewUrl(celular.foto_url || null);
      setPreviewUrl2(celular.foto_url_2 || null);
      setModoCalculo("margen"); // por defecto; el usuario elige qué campo editar
      skipCalcPrecioRef.current = true; // no pisar el precio/margen ya guardados al abrir
      skipCalcMargenRef.current = true;
    } else {
      setForm(FORM_VACIO);
      setSubirWeb(false);
      setOferta("");
      setFile(null);
      setPreviewUrl(null);
      setFile2(null);
      setPreviewUrl2(null);
      setModoCalculo("margen");
      skipCalcPrecioRef.current = true;
      skipCalcMargenRef.current = true;
    }
  }, [isOpen, celular]);

  // --- Modo 'margen': costo_usd + margen -> calcula precio ---
  useEffect(() => {
    if (skipCalcPrecioRef.current) { skipCalcPrecioRef.current = false; return; }
    if (modoCalculo !== "margen" || !dolar) return;
    const costoUsdNum = Number(form.costo_usd);
    const margenNum = Number(form.margen_porcentaje);
    if (!costoUsdNum || isNaN(costoUsdNum) || isNaN(margenNum)) return;

    const precioCalculado = costoUsdNum * Number(dolar.valor) * (1 + margenNum / 100);
    setForm((prev) => ({ ...prev, precio: precioCalculado.toFixed(2) }));
  }, [form.costo_usd, form.margen_porcentaje, dolar, modoCalculo]);

  // --- Modo 'precio': costo_usd + precio -> calcula margen ---
  useEffect(() => {
    if (skipCalcMargenRef.current) { skipCalcMargenRef.current = false; return; }
    if (modoCalculo !== "precio" || !dolar) return;
    const costoUsdNum = Number(form.costo_usd);
    const precioNum = Number(form.precio);
    if (!costoUsdNum || isNaN(costoUsdNum) || isNaN(precioNum)) return;

    const costoPesos = costoUsdNum * Number(dolar.valor);
    if (costoPesos <= 0) return;
    const margenCalculado = (precioNum / costoPesos - 1) * 100;
    setForm((prev) => ({ ...prev, margen_porcentaje: margenCalculado.toFixed(2) }));
  }, [form.costo_usd, form.precio, dolar, modoCalculo]);

  // --- Helpers de sanitización / formateo (mismos que ProductoModal) ---
  const sanitizeIntegerInput = (val) => String(val).replace(/\D+/g, "").replace(/^0+(?=\d)/, "");
  const sanitizeDecimalInput = (val) => {
    let v = String(val).replace(/,/g, ".").replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    if (parts.length > 1) v = parts[0] + "." + parts.slice(1).join("");
    return v.replace(/^0+(?=\d)/, "");
  };
  const formatIntegerDisplay = (val) => (val && !isNaN(Number(val))) ? new Intl.NumberFormat("es-AR").format(Number(val)) : "";
  const formatDecimalDisplay = (val) => {
    if (val === "" || val == null || isNaN(Number(val))) return "";
    const decimals = String(val).includes(".") ? String(val).split(".")[1].length : 0;
    return new Intl.NumberFormat("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number(val));
  };
  const formatPesos = (val) => (val == null || isNaN(Number(val))) ? "-" : Number(val).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  // --- Handlers ---
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleNumChange = (field, sanitizer, val) => {
    const s = sanitizer(val);
    setForm((p) => ({ ...p, [field]: s }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const handleMargenChange = (val) => {
    setModoCalculo("margen");
    handleNumChange("margen_porcentaje", sanitizeDecimalInput, val);
  };

  const handlePrecioChange = (val) => {
    setModoCalculo("precio");
    handleNumChange("precio", sanitizeDecimalInput, val);
  };

  const handleFile = (f, slot) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setNotification({ message: "El archivo debe ser una imagen (JPG, PNG)", type: "warning" });
      return;
    }
    const localUrl = URL.createObjectURL(f);
    if (slot === 1) {
      if (previewUrl && !celular?.foto_url) URL.revokeObjectURL(previewUrl);
      setFile(f);
      setPreviewUrl(localUrl);
    } else {
      if (previewUrl2 && !celular?.foto_url_2) URL.revokeObjectURL(previewUrl2);
      setFile2(f);
      setPreviewUrl2(localUrl);
    }
  };

  const handleDrop = (e, slot) => {
    e.preventDefault(); e.stopPropagation();
    if (slot === 1) setIsDragOver(false); else setIsDragOver2(false);
    handleFile(e.dataTransfer.files?.[0], slot);
  };

  const stockNum = Number(form.stock) || 0;
  const estadoPreview = stockNum > 0
    ? { label: "En stock", classes: "bg-emerald-600/20 border-emerald-500 text-emerald-400" }
    : form.tipo_entrega === "SIN_STOCK_CONSULTAR"
      ? { label: "Sin stock (consultar)", classes: "bg-gray-600/20 border-gray-500 text-gray-300" }
      : { label: "A pedido (24-48hs)", classes: "bg-amber-600/20 border-amber-500 text-amber-400" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.marca.trim()) newErrors.marca = "La marca es obligatoria.";
    if (form.costo_usd === "" || isNaN(Number(form.costo_usd))) newErrors.costo_usd = "Costo en USD inválido.";
    if (form.margen_porcentaje === "" || isNaN(Number(form.margen_porcentaje))) newErrors.margen_porcentaje = "Margen inválido.";
    if (!form.ram_gb || isNaN(Number(form.ram_gb))) newErrors.ram_gb = "RAM inválida.";
    if (!form.almacenamiento_gb || isNaN(Number(form.almacenamiento_gb))) newErrors.almacenamiento_gb = "Almacenamiento inválido.";
    if (oferta !== "" && (Number(oferta) < 0 || Number(oferta) > 100)) newErrors.oferta = "Inválido (0-100%).";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({ message: "Revisá los campos en rojo.", type: "error" });
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      marca: form.marca.trim(),
      color: form.color.trim() || null,
      stock: form.stock ? parseInt(form.stock, 10) : 0,
      costo_usd: parseFloat(form.costo_usd),
      margen_porcentaje: parseFloat(form.margen_porcentaje),
      ram_gb: parseInt(form.ram_gb, 10),
      almacenamiento_gb: parseInt(form.almacenamiento_gb, 10),
      gama: form.gama,
      tipo_entrega: stockNum > 0 ? undefined : form.tipo_entrega, // si hay stock, el backend fuerza EN_STOCK_LOCAL
      precio: form.precio ? parseFloat(form.precio) : undefined,
      descripcion: form.descripcion.trim(),
      descripcion_web: form.descripcion_web.trim() || null,
      subir_web: subirWeb,
      oferta: oferta !== "" ? Number(oferta) : null,
      file,
      file2,
    };

    try {
      setIsSaving(true);
      if (onSave) await onSave(payload);
      onClose && onClose();
    } catch (error) {
      console.error("Error al guardar celular:", error);
      setNotification({ message: "Error al guardar. Intentá nuevamente.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = (hasError) => `w-full bg-neutral-800 text-white p-2 rounded border transition-colors focus:outline-none ${hasError ? "border-red-500 focus:border-red-500" : "border-gray-700 focus:border-emerald-500"}`;
  const labelClass = "block text-sm text-gray-300 mb-1";

  const renderImageDrop = (slot, preview, isDrag, setDrag) => (
    <div
      className={`relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed px-4 py-6 cursor-pointer transition overflow-hidden group
        ${isDrag ? "border-emerald-500 bg-emerald-900/10" : "border-gray-700 bg-neutral-800 hover:border-gray-500"}
        ${isSaving ? "opacity-50 cursor-not-allowed" : ""}
      `}
      onDragOver={(e) => { if (!isSaving) { e.preventDefault(); setDrag(true); } }}
      onDragLeave={(e) => { if (!isSaving) { e.preventDefault(); setDrag(false); } }}
      onDrop={(e) => { if (!isSaving) handleDrop(e, slot); }}
    >
      {preview ? (
        <>
          <img src={preview} alt="Preview" className="w-full h-36 object-contain rounded-md" />
          {!isSaving && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (slot === 1) { setFile(null); setPreviewUrl(null); } else { setFile2(null); setPreviewUrl2(null); }
              }}
              className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition hover:scale-110 shadow-lg z-10"
              title="Eliminar foto"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 py-2">
          <span className="text-2xl opacity-50">📷</span>
          <p className="text-xs text-gray-400">Arrastrá o hacé clic</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => !isSaving && handleFile(e.target.files?.[0], slot)}
        disabled={isSaving}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <AlertNotification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: null, type: "" })}
      />

      <div className="w-full max-w-2xl bg-neutral-900 text-white rounded-2xl shadow-2xl border border-gray-800 overflow-auto max-h-[90vh]">
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {celular ? "Editar equipo" : "Nuevo equipo"}
          </h2>
          <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-white transition disabled:opacity-50">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre / Marca / Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className={labelClass}>Nombre *</label>
              <input name="nombre" value={form.nombre} onChange={handleTextChange} className={inputClass(errors.nombre)} placeholder="Ej: Galaxy A54 128GB" disabled={isSaving} />
              {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className={labelClass}>Marca *</label>
              <input name="marca" value={form.marca} onChange={handleTextChange} className={inputClass(errors.marca)} placeholder="Ej: Samsung" disabled={isSaving} />
              {errors.marca && <p className="text-red-400 text-xs mt-1">{errors.marca}</p>}
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input name="color" value={form.color} onChange={handleTextChange} className={inputClass(false)} placeholder="Ej: Negro" disabled={isSaving} />
            </div>
          </div>

          {/* RAM / Almacenamiento / Gama */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>RAM (GB) *</label>
              <input inputMode="numeric" value={form.ram_gb} onChange={(e) => handleNumChange("ram_gb", sanitizeIntegerInput, e.target.value)} className={inputClass(errors.ram_gb)} placeholder="8" disabled={isSaving} />
              {errors.ram_gb && <p className="text-red-400 text-xs mt-1">{errors.ram_gb}</p>}
            </div>
            <div>
              <label className={labelClass}>Almacenamiento (GB) *</label>
              <input inputMode="numeric" value={form.almacenamiento_gb} onChange={(e) => handleNumChange("almacenamiento_gb", sanitizeIntegerInput, e.target.value)} className={inputClass(errors.almacenamiento_gb)} placeholder="128" disabled={isSaving} />
              {errors.almacenamiento_gb && <p className="text-red-400 text-xs mt-1">{errors.almacenamiento_gb}</p>}
            </div>
            <div>
              <label className={labelClass}>Gama *</label>
              <select name="gama" value={form.gama} onChange={handleTextChange} className={inputClass(false)} disabled={isSaving}>
                {GAMAS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
          </div>

          {/* Stock / Disponibilidad reactiva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className={labelClass}>Stock</label>
              <input
                inputMode="numeric"
                value={focused.stock ? form.stock : formatIntegerDisplay(form.stock)}
                onFocus={() => setFocused((p) => ({ ...p, stock: true }))}
                onBlur={() => setFocused((p) => ({ ...p, stock: false }))}
                onChange={(e) => handleNumChange("stock", sanitizeIntegerInput, e.target.value)}
                className={inputClass(false)}
                placeholder="0"
                disabled={isSaving}
              />
              <p className="text-xs text-gray-500 mt-1">Si dejás el stock en 0, se marca automáticamente como "sin stock".</p>
            </div>

            <div>
              <label className={labelClass}>Disponibilidad</label>
              <div className={`px-3 py-2 rounded-full border text-sm text-center ${estadoPreview.classes}`}>
                {estadoPreview.label}
              </div>
              {stockNum === 0 && (
                <select
                  name="tipo_entrega"
                  value={form.tipo_entrega}
                  onChange={handleTextChange}
                  className={`${inputClass(false)} mt-2 text-sm`}
                  disabled={isSaving}
                >
                  {TIPOS_ENTREGA_SIN_STOCK.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              )}
            </div>
          </div>

          {/* Costo USD / Margen / Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Costo (USD) *</label>
              <input
                inputMode="decimal"
                value={focused.costo_usd ? form.costo_usd : formatDecimalDisplay(form.costo_usd)}
                onFocus={() => setFocused((p) => ({ ...p, costo_usd: true }))}
                onBlur={() => setFocused((p) => ({ ...p, costo_usd: false }))}
                onChange={(e) => handleNumChange("costo_usd", sanitizeDecimalInput, e.target.value)}
                className={inputClass(errors.costo_usd)}
                placeholder="0.00"
                disabled={isSaving}
              />
              {errors.costo_usd && <p className="text-red-400 text-xs mt-1">{errors.costo_usd}</p>}
            </div>
            <div>
              <label className={labelClass}>
                Margen (%) *{modoCalculo === "precio" && <span className="text-emerald-500 normal-case font-normal"> (calculado)</span>}
              </label>
              <input
                inputMode="decimal"
                value={form.margen_porcentaje}
                onChange={(e) => handleMargenChange(e.target.value)}
                className={inputClass(errors.margen_porcentaje)}
                placeholder="30"
                disabled={isSaving}
              />
              {errors.margen_porcentaje && <p className="text-red-400 text-xs mt-1">{errors.margen_porcentaje}</p>}
            </div>
            <div>
              <label className={labelClass}>
                Precio final (ARS){modoCalculo === "margen" && <span className="text-emerald-500 normal-case font-normal"> (calculado)</span>}
              </label>
              <input
                inputMode="decimal"
                value={focused.precio ? form.precio : formatDecimalDisplay(form.precio)}
                onFocus={() => setFocused((p) => ({ ...p, precio: true }))}
                onBlur={() => setFocused((p) => ({ ...p, precio: false }))}
                onChange={(e) => handlePrecioChange(e.target.value)}
                className={inputClass(false)}
                placeholder="0.00"
                disabled={isSaving}
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 -mt-2">
            {modoCalculo === "margen"
              ? "Cargá el margen y el precio final se calcula solo. Si preferís, editá el precio final directamente y el margen se recalcula."
              : "El margen se está recalculando en base al precio final que cargaste. Si editás el margen a mano, vuelve a tomar el control."}
          </p>
          {!dolar && (
            <p className="text-xs text-amber-400 -mt-2">No se pudo cargar la cotización del dólar, el cálculo automático está desactivado.</p>
          )}

          {/* Oferta y publicación web */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className={labelClass}>Oferta (%)</label>
              <div className="relative">
                <input
                  inputMode="numeric"
                  value={oferta}
                  onChange={(e) => setOferta(sanitizeIntegerInput(e.target.value))}
                  className={inputClass(errors.oferta)}
                  placeholder="Ej: 10"
                  disabled={isSaving}
                />
                <span className="absolute right-3 top-2 text-gray-500 text-sm">% OFF</span>
              </div>
              {errors.oferta && <p className="text-red-400 text-xs mt-1">{errors.oferta}</p>}
            </div>

            <div className="flex flex-col sm:items-end pt-6">
              <button
                type="button"
                onClick={() => !isSaving && setSubirWeb(!subirWeb)}
                disabled={isSaving}
                className={`flex items-center justify-between w-full sm:w-40 px-3 py-2 rounded-full border text-sm transition ${
                  subirWeb ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" : "bg-neutral-800 border-gray-600 text-gray-400"
                } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span>{subirWeb ? "Publicado en web" : "Oculto"}</span>
                <span className={`h-3 w-3 rounded-full ${subirWeb ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-gray-600"}`} />
              </button>
            </div>
          </div>

          {/* Descripciones */}
          <div>
            <label className={labelClass}>Descripción corta</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleTextChange} rows={2} className={inputClass(false)} placeholder="Detalles..." disabled={isSaving} />
          </div>
          <div>
            <label className={labelClass}>Descripción Web</label>
            <textarea name="descripcion_web" value={form.descripcion_web} onChange={handleTextChange} rows={2} className={inputClass(false)} placeholder="Detalles para la tienda web..." disabled={isSaving} />
          </div>

          {/* Imágenes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Foto principal</label>
              {renderImageDrop(1, previewUrl, isDragOver, setIsDragOver)}
            </div>
            <div>
              <label className={labelClass}>Foto secundaria (opcional)</label>
              {renderImageDrop(2, previewUrl2, isDragOver2, setIsDragOver2)}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-5 py-2.5 rounded-lg text-gray-300 font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-lg shadow-emerald-900/20 transition-all ${isSaving ? "opacity-70 cursor-wait" : "active:scale-95"}`}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : "Guardar equipo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CelularModal;