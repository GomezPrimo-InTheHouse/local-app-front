// src/components/Equipo/AvisoWhatsappModal.jsx
// src/components/Equipo/AvisoWhatsappModal.jsx
// Aviso al cliente por WhatsApp con enlace wa.me: arma el mensaje, abre WhatsApp
// (web o app) con el texto listo y el técnico solo aprieta "Enviar". Sin costo ni API.
//
// Destinatario: INGRESO → celular principal · LISTO → contacto secundario (si no hay, el principal).
import { useEffect, useMemo, useState } from "react";
import {
  normalizarCelularAR,
  formatearCelularWa,
  linkWhatsapp,
  cargarPlantillas,
  guardarPlantilla,
  restaurarPlantilla,
  armarMensaje,
  opcionesDestino,
  destinoSugerido,
} from "../../utils/whatsapp.js";

const AvisoWhatsappModal = ({
  isOpen,
  onClose,
  tipoInicial = "listo",   // ingresado | presupuesto | listo
  cliente,                 // { nombre, apellido, celular, celular_contacto }
  equipoTexto,             // "Notebook Lenovo IdeaPad 3"
  total = 0,               // total del presupuesto aprobado (si hay)
  titulo,                  // texto opcional arriba (ej.: "El equipo pasó a Finalizado")
}) => {
  const [plantillas, setPlantillas] = useState(() => cargarPlantillas());
  const [tipo, setTipo] = useState(tipoInicial);
  const [mensaje, setMensaje] = useState("");
  const [destinoId, setDestinoId] = useState(null);   // principal | contacto | manual
  const [celularManual, setCelularManual] = useState("");
  const [aviso, setAviso] = useState("");

  const datos = useMemo(
    () => ({ nombre: cliente?.nombre, apellido: cliente?.apellido, equipo: equipoTexto, total }),
    [cliente?.nombre, cliente?.apellido, equipoTexto, total]
  );

  const opciones = useMemo(
    () => opcionesDestino({ celular: cliente?.celular, celular_contacto: cliente?.celular_contacto }),
    [cliente?.celular, cliente?.celular_contacto]
  );

  useEffect(() => {
    if (!isOpen) return;
    const p = cargarPlantillas();
    setPlantillas(p);
    setTipo(tipoInicial);
    setMensaje(armarMensaje(p[tipoInicial]?.texto, datos));
    setDestinoId(destinoSugerido(tipoInicial, opciones) ?? "manual");
    setCelularManual("");
    setAviso("");
  }, [isOpen, tipoInicial, datos, opciones]);

  const numeroWa = useMemo(() => {
    if (destinoId === "manual") return normalizarCelularAR(celularManual);
    return opciones.find((o) => o.id === destinoId)?.numeroWa ?? null;
  }, [destinoId, celularManual, opciones]);

  if (!isOpen) return null;

  const cambiarTipo = (t) => {
    setTipo(t);
    setMensaje(armarMensaje(plantillas[t]?.texto, datos));
    if (destinoId !== "manual") setDestinoId(destinoSugerido(t, opciones) ?? "manual");
  };

  const handleAbrir = () => {
    if (!numeroWa || !mensaje.trim()) return;
    window.open(linkWhatsapp(numeroWa, mensaje), "_blank", "noopener,noreferrer");
    onClose?.();
  };

  const handleGuardarPlantilla = () => {
    // Se guarda con variables: los datos de este cliente vuelven a ser {nombre_completo}, {nombre}, {equipo}
    let texto = mensaje;
    const nombre = (cliente?.nombre || "").trim();
    const completo = `${nombre} ${(cliente?.apellido || "").trim()}`.trim();
    if (completo && completo !== nombre) texto = texto.split(completo).join("{nombre_completo}");
    if (nombre) texto = texto.split(nombre).join("{nombre}");
    if (equipoTexto) texto = texto.split(equipoTexto).join("{equipo}");
    const ok = guardarPlantilla(tipo, texto);
    setPlantillas(cargarPlantillas());
    setAviso(ok ? "Plantilla guardada para este navegador ✅" : "No se pudo guardar en este navegador");
  };

  const handleRestaurar = () => {
    restaurarPlantilla(tipo);
    const p = cargarPlantillas();
    setPlantillas(p);
    setMensaje(armarMensaje(p[tipo]?.texto, datos));
    setAviso("Plantilla original restaurada");
  };

  const sinContactoParaListo = tipo === "listo" && !opciones.some((o) => o.id === "contacto");

  const radio = (activo) =>
    `w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors ${
      activo ? "border-emerald-500 bg-emerald-600/15" : "border-white/10 bg-neutral-900/40 hover:bg-neutral-900/70"
    }`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-neutral-800 rounded-xl w-full max-w-md shadow-lg text-neutral-100 max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">📲 Avisar por WhatsApp</h2>
            {titulo && <p className="text-xs text-emerald-300 mt-0.5">{titulo}</p>}
          </div>
          <button onClick={onClose} className="bg-transparent p-0 border-0 text-neutral-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Tipo de aviso */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(plantillas).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => cambiarTipo(k)}
                className={`px-2 py-2 rounded-lg text-xs border ${
                  tipo === k ? "border-emerald-500 bg-emerald-600/15 text-emerald-200" : "border-white/10 bg-neutral-700/40 text-neutral-300"
                }`}
              >
                {v.titulo}
              </button>
            ))}
          </div>

          {/* Destinatario */}
          <div className="space-y-2">
            <p className="text-sm text-gray-300">
              Enviar a <span className="font-medium text-white">{cliente?.nombre} {cliente?.apellido}</span>
            </p>
            {opciones.map((o) => (
              <button key={o.id} type="button" onClick={() => setDestinoId(o.id)} className={radio(destinoId === o.id)}>
                <span className="block text-xs text-neutral-400">{o.label}</span>
                <span className="text-emerald-300">{formatearCelularWa(o.numeroWa)}</span>
              </button>
            ))}
            <div role="button" tabIndex={0} onClick={() => setDestinoId("manual")}
              onKeyDown={(e) => { if (e.key === "Enter") setDestinoId("manual"); }}
              className={`cursor-pointer ${radio(destinoId === "manual")}`}>
              <span className="block text-xs text-neutral-400">Otro número</span>
              {destinoId === "manual" ? (
                <input
                  autoFocus
                  value={celularManual}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setCelularManual(e.target.value)}
                  placeholder="Ej.: 353 412-3456"
                  className="mt-1 w-full bg-neutral-700 text-white p-2 rounded text-sm"
                />
              ) : (
                <span className="text-neutral-400">Escribir uno a mano</span>
              )}
            </div>

            {sinContactoParaListo && opciones.length > 0 && (
              <p className="text-[11px] text-amber-300">
                El cliente no tiene contacto secundario válido: se usa el celular principal.
              </p>
            )}
            {opciones.length === 0 && (
              <p className="text-[11px] text-amber-300">
                No hay celulares válidos cargados ({cliente?.celular || "vacío"}
                {cliente?.celular_contacto ? ` / ${cliente.celular_contacto}` : ""}). Escribilo con característica.
              </p>
            )}
            {destinoId === "manual" && celularManual && !numeroWa && (
              <p className="text-[11px] text-red-300">Número inválido: usá característica + número (10 dígitos).</p>
            )}
          </div>

          {/* Mensaje editable */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Mensaje</label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={9}
              className="w-full bg-neutral-700 text-white p-2 rounded text-sm resize-none"
            />
            <div className="flex flex-wrap gap-3 mt-1 text-[11px]">
              <button type="button" onClick={handleGuardarPlantilla} className="bg-transparent p-0 border-0 text-emerald-400 hover:text-emerald-300">
                Guardar como plantilla
              </button>
              <button type="button" onClick={handleRestaurar} className="bg-transparent p-0 border-0 text-neutral-400 hover:text-neutral-200">
                Restaurar original
              </button>
              {aviso && <span className="text-neutral-400">{aviso}</span>}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Tip: *texto* sale en negrita en WhatsApp. Al guardar, el nombre y el equipo se convierten en variables.
            </p>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">
            Ahora no
          </button>
          <button
            type="button"
            onClick={handleAbrir}
            disabled={!numeroWa || !mensaje.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-semibold disabled:opacity-50"
          >
            Abrir WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvisoWhatsappModal;