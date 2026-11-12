// src/utils/whatsapp.js
// src/utils/whatsapp.js
// Avisos por WhatsApp con enlace wa.me (gratis, sin API): abre WhatsApp con el
// mensaje armado y el técnico solo aprieta "Enviar".

// Característica por defecto para números locales cargados como "15xxxxxxx"
export const CARACTERISTICA_DEFAULT = "353"; // Villa María

const PLANTILLAS_KEY = "jg_whatsapp_plantillas_v2";

/**
 * Normaliza un celular argentino al formato internacional de WhatsApp: 549 + 10 dígitos.
 * Acepta: 3534123456 · 0353 15 4123456 · 154123456 · +54 9 353 412-3456 · 54 353 4123456
 * Devuelve null si no se puede interpretar con seguridad.
 */
export const normalizarCelularAR = (celular, caracteristica = CARACTERISTICA_DEFAULT) => {
  let d = String(celular ?? "").replace(/\D/g, "");
  if (!d) return null;

  if (d.startsWith("00")) d = d.slice(2);                 // prefijo internacional
  if (d.startsWith("54") && d.length >= 12) {             // ya trae código de país
    d = d.slice(2);
    if (d.startsWith("9")) d = d.slice(1);
  }
  if (d.startsWith("0")) d = d.slice(1);                  // 0 de larga distancia
  if (d.length === 11 && d.startsWith("9")) d = d.slice(1); // 9 de celular sin 54

  // Local sin característica: 15 + 7 dígitos
  if (d.length === 9 && d.startsWith("15")) d = `${caracteristica}${d.slice(2)}`;

  // Característica + 15 + número (ej. 353 15 4123456 · 11 15 12345678)
  if (d.length === 12) {
    for (const largoCaract of [2, 3, 4]) {
      if (d.slice(largoCaract, largoCaract + 2) === "15") {
        d = d.slice(0, largoCaract) + d.slice(largoCaract + 2);
        break;
      }
    }
  }

  return d.length === 10 ? `549${d}` : null;
};

// Formato legible para mostrar: +54 9 353 412-3456
export const formatearCelularWa = (numeroWa) => {
  if (!numeroWa || numeroWa.length !== 13) return numeroWa || "";
  const n = numeroWa.slice(3);
  const caract = n.startsWith("11") ? n.slice(0, 2) : n.slice(0, 3);
  const resto = n.slice(caract.length);
  return `+54 9 ${caract} ${resto.slice(0, resto.length - 4)}-${resto.slice(-4)}`;
};

export const linkWhatsapp = (numeroWa, texto) =>
  `https://wa.me/${numeroWa}?text=${encodeURIComponent(texto ?? "")}`;

const pesos = (n) =>
  Number(n || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

// ---------- Destinatario ----------
// Regla: el aviso de INGRESO va al celular principal del cliente.
// El aviso de LISTO va al celular de contacto (familiar); si no hay uno válido, al principal.
export const opcionesDestino = (cliente) => {
  const out = [];
  const principal = normalizarCelularAR(cliente?.celular);
  const contacto  = normalizarCelularAR(cliente?.celular_contacto);
  if (principal) out.push({ id: "principal", label: "Celular principal", numeroWa: principal, original: cliente?.celular });
  if (contacto && contacto !== principal)
    out.push({ id: "contacto", label: "Contacto secundario", numeroWa: contacto, original: cliente?.celular_contacto });
  return out;
};

export const destinoSugerido = (tipo, opciones) => {
  const preferido = tipo === "listo" ? "contacto" : "principal";
  return (opciones.find((o) => o.id === preferido) ?? opciones[0])?.id ?? null;
};

// ---------- Plantillas ----------
// Variables: {nombre} {nombre_completo} {equipo} {total} {linea_total}
// "listo" está escrito para que sirva también si lo recibe un familiar.
export const PLANTILLAS_DEFAULT = {
  ingresado: {
    titulo: "Equipo ingresado",
    texto:
      "¡Hola {nombre}! 👋 Recibimos tu *{equipo}* en *JG Informática*.\n\n" +
      "Te avisamos por acá cuando tengamos novedades. También podés seguir el estado en " +
      "https://web-jg-informatica.vercel.app/ con marca, modelo y tu DNI.",
  },
  presupuesto: {
    titulo: "Presupuesto listo",
    texto:
      "¡Hola {nombre}! 👋 Te escribimos de *JG Informática*.\n\n" +
      "Ya tenemos el presupuesto de tu *{equipo}*: *{total}*.\n\n" +
      "¿Nos confirmás si avanzamos con la reparación?",
  },
  listo: {
    titulo: "Equipo listo para retirar",
    texto:
      "¡Hola! 👋 Te escribimos de *JG Informática*.\n\n" +
      "El *{equipo}* de *{nombre_completo}* ya está listo para retirar ✅\n" +
      "{linea_total}\n" +
      "📍 Bolívar 1313, Villa María — de lunes a sábado.\n\n" +
      "¡Gracias por confiar en nosotros!",
  },
};

export const cargarPlantillas = () => {
  try {
    const guardadas = JSON.parse(localStorage.getItem(PLANTILLAS_KEY) || "{}");
    const out = {};
    for (const [k, v] of Object.entries(PLANTILLAS_DEFAULT)) {
      out[k] = { ...v, texto: typeof guardadas?.[k] === "string" ? guardadas[k] : v.texto };
    }
    return out;
  } catch {
    return PLANTILLAS_DEFAULT;
  }
};

export const guardarPlantilla = (tipo, texto) => {
  try {
    const guardadas = JSON.parse(localStorage.getItem(PLANTILLAS_KEY) || "{}");
    guardadas[tipo] = texto;
    localStorage.setItem(PLANTILLAS_KEY, JSON.stringify(guardadas));
    return true;
  } catch {
    return false;
  }
};

export const restaurarPlantilla = (tipo) => {
  try {
    const guardadas = JSON.parse(localStorage.getItem(PLANTILLAS_KEY) || "{}");
    delete guardadas[tipo];
    localStorage.setItem(PLANTILLAS_KEY, JSON.stringify(guardadas));
  } catch { /* sin almacenamiento: queda la plantilla por defecto */ }
  return PLANTILLAS_DEFAULT[tipo]?.texto ?? "";
};

export const armarMensaje = (plantilla, { nombre, apellido, equipo, total }) => {
  const t = Number(total || 0);
  const completo = `${(nombre || "").trim()} ${(apellido || "").trim()}`.trim();
  return String(plantilla ?? "")
    .replaceAll("{nombre_completo}", completo || "cliente")
    .replaceAll("{nombre}", (nombre || "").trim() || "cliente")
    .replaceAll("{equipo}", (equipo || "").trim() || "equipo")
    .replaceAll("{total}", t > 0 ? pesos(t) : "a confirmar")
    .replaceAll("{linea_total}", t > 0 ? `💵 Total a abonar: *${pesos(t)}*\n` : "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};