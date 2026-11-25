// src/pages/EmpleadosPage.jsx
// Gestión de empleados (solo admin): alta, módulos habilitados, contraseña, TOTP y baja.
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  resetPasswordEmpleado,
  resetTotpEmpleado,
  bajaEmpleado,
  reactivarEmpleado,
} from "../api/EmpleadoApi.jsx";
import { MODULOS, labelModulo } from "../utils/Modulos.jsx";

const ESTADO_ACTIVO = 1;
const MIN_PASSWORD = 8;
const FORM_VACIO = { nombre: "", email: "", password: "", modulos: [] };

const swalDark = { theme: "dark", confirmButtonColor: "#16a34a", cancelButtonColor: "#525252" };

// Selector de módulos con casillas
const SelectorModulos = ({ value, onChange }) => {
  const toggle = (key) =>
    onChange(value.includes(key) ? value.filter((m) => m !== key) : [...value, key]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {MODULOS.map((m) => {
        const activo = value.includes(m.key);
        return (
          <label key={m.key}
            className={`flex items-start gap-2 rounded-lg border p-2.5 cursor-pointer transition-colors ${
              activo ? "border-emerald-600/60 bg-emerald-900/20" : "border-white/10 bg-neutral-800/60 hover:bg-neutral-800"
            }`}>
            <input type="checkbox" checked={activo} onChange={() => toggle(m.key)} className="mt-1 accent-emerald-500" />
            <span>
              <span className="text-sm font-medium">{m.emoji} {m.label}</span>
              <span className="block text-[11px] text-neutral-400">{m.descripcion}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
};

// Modal con el QR para escanear en Google Authenticator
const ModalQR = ({ qr, titulo, onClose }) => {
  if (!qr) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-xl">
        <h3 className="text-lg font-semibold">{titulo}</h3>
        <p className="text-sm text-neutral-300">
          Escaneá este código con <b>Google Authenticator</b> en el celular del empleado.
          Es la única vez que se muestra.
        </p>
        <img src={qr} alt="Código QR TOTP" className="mx-auto bg-white p-2 rounded-lg w-56 h-56" />
        <button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg font-semibold">
          Listo, ya lo escaneó
        </button>
      </div>
    </div>
  );
};

const EmpleadosPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal alta/edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null); // usuario o null
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);

  // QR a mostrar (alta o reset TOTP)
  const [qr, setQr] = useState(null);
  const [qrTitulo, setQrTitulo] = useState("");

  const cargar = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEmpleados();
      setUsuarios(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const empleados = useMemo(() => usuarios.filter((u) => u.rol !== "admin"), [usuarios]);
  const admins = useMemo(() => usuarios.filter((u) => u.rol === "admin"), [usuarios]);

  const abrirCrear = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (u) => {
    setEditando(u);
    setForm({ nombre: u.nombre || "", email: u.email || "", password: "", modulos: u.modulos || [] });
    setModalAbierto(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return Swal.fire({ ...swalDark, icon: "warning", title: "Falta el nombre" });
    if (!form.email.trim()) return Swal.fire({ ...swalDark, icon: "warning", title: "Falta el email" });
    if (!editando && form.password.length < MIN_PASSWORD) {
      return Swal.fire({ ...swalDark, icon: "warning", title: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres` });
    }

    setGuardando(true);
    try {
      if (editando) {
        await updateEmpleado(editando.id, { nombre: form.nombre, email: form.email, modulos: form.modulos });
        Swal.fire({ ...swalDark, icon: "success", title: "Empleado actualizado", timer: 1500, showConfirmButton: false });
      } else {
        const res = await createEmpleado(form);
        setQrTitulo(`Código TOTP de ${form.nombre}`);
        setQr(res?.qrCodeDataURL || null);
      }
      setModalAbierto(false);
      await cargar();
    } catch (err) {
      Swal.fire({ ...swalDark, icon: "error", title: "No se pudo guardar", text: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const restablecerPassword = async (u) => {
    const { value: password } = await Swal.fire({
      ...swalDark,
      title: `Nueva contraseña para ${u.nombre}`,
      input: "password",
      inputPlaceholder: `Mínimo ${MIN_PASSWORD} caracteres`,
      inputAttributes: { autocomplete: "new-password" },
      showCancelButton: true,
      confirmButtonText: "Restablecer",
      cancelButtonText: "Cancelar",
      inputValidator: (v) => (!v || v.length < MIN_PASSWORD ? `Mínimo ${MIN_PASSWORD} caracteres` : undefined),
    });
    if (!password) return;
    try {
      await resetPasswordEmpleado(u.id, password);
      Swal.fire({ ...swalDark, icon: "success", title: "Contraseña restablecida", text: "Se cerraron sus sesiones abiertas." });
    } catch (err) {
      Swal.fire({ ...swalDark, icon: "error", title: "Error", text: err.message });
    }
  };

  const restablecerTotp = async (u) => {
    const r = await Swal.fire({
      ...swalDark,
      icon: "warning",
      title: `¿Restablecer el código TOTP de ${u.nombre}?`,
      text: "El código actual deja de funcionar y vas a tener que escanear uno nuevo en su celular.",
      showCancelButton: true,
      confirmButtonText: "Sí, generar nuevo",
      cancelButtonText: "Cancelar",
    });
    if (!r.isConfirmed) return;
    try {
      const res = await resetTotpEmpleado(u.id);
      setQrTitulo(`Nuevo código TOTP de ${u.nombre}`);
      setQr(res?.qrCodeDataURL || null);
    } catch (err) {
      Swal.fire({ ...swalDark, icon: "error", title: "Error", text: err.message });
    }
  };

  const cambiarEstado = async (u) => {
    const activo = u.estado_id === ESTADO_ACTIVO;
    const r = await Swal.fire({
      ...swalDark,
      icon: "warning",
      title: activo ? `¿Dar de baja a ${u.nombre}?` : `¿Reactivar a ${u.nombre}?`,
      text: activo ? "No va a poder iniciar sesión y se cierran sus sesiones abiertas." : "Va a poder volver a iniciar sesión.",
      showCancelButton: true,
      confirmButtonText: activo ? "Dar de baja" : "Reactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: activo ? "#dc2626" : "#16a34a",
    });
    if (!r.isConfirmed) return;
    try {
      if (activo) await bajaEmpleado(u.id);
      else await reactivarEmpleado(u.id);
      await cargar();
    } catch (err) {
      Swal.fire({ ...swalDark, icon: "error", title: "Error", text: err.message });
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-neutral-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm">
              ⬅️ Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold">🧑‍🔧 Empleados</h1>
              <p className="text-sm text-neutral-400">Elegí a qué módulos accede cada empleado. Estadísticas y montos son siempre solo admin.</p>
            </div>
          </div>
          <button onClick={abrirCrear} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold">
            + Nuevo empleado
          </button>
        </div>

        {error && <div className="rounded-lg border border-red-700/50 bg-red-900/30 p-3 text-sm text-red-200">{error}</div>}

        {/* Empleados */}
        <section className="space-y-3">
          {loading ? (
            <p className="text-neutral-400">Cargando…</p>
          ) : empleados.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-neutral-800/40 p-6 text-center text-neutral-400">
              Todavía no hay empleados. Creá el primero con “+ Nuevo empleado”.
            </div>
          ) : (
            empleados.map((u) => {
              const activo = u.estado_id === ESTADO_ACTIVO;
              return (
                <article key={u.id}
                  className={`rounded-xl border p-4 space-y-3 ${activo ? "border-white/10 bg-neutral-800/50" : "border-red-900/40 bg-neutral-800/20 opacity-70"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-lg">
                        {u.nombre}
                        {!activo && <span className="ml-2 text-xs font-medium text-red-300 bg-red-900/40 px-2 py-0.5 rounded-full">Dado de baja</span>}
                      </p>
                      <p className="text-sm text-neutral-400">{u.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => abrirEditar(u)} className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-sm">Editar módulos</button>
                      <button onClick={() => restablecerPassword(u)} className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-sm">🔑 Contraseña</button>
                      <button onClick={() => restablecerTotp(u)} className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-sm">📱 TOTP</button>
                      <button onClick={() => cambiarEstado(u)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${activo ? "bg-red-700 hover:bg-red-800" : "bg-emerald-700 hover:bg-emerald-800"}`}>
                        {activo ? "Dar de baja" : "Reactivar"}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(u.modulos || []).length === 0 ? (
                      <span className="text-xs text-amber-300">Sin módulos habilitados</span>
                    ) : (
                      u.modulos.map((m) => (
                        <span key={m} className="text-xs bg-emerald-900/40 border border-emerald-700/40 text-emerald-200 px-2 py-0.5 rounded-full">
                          {labelModulo(m)}
                        </span>
                      ))
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* Administradores (solo lectura) */}
        {admins.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-neutral-800/30 p-4">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Administradores · acceso total</p>
            <ul className="text-sm text-neutral-300 space-y-1">
              {admins.map((a) => <li key={a.id}>{a.nombre || "—"} · <span className="text-neutral-400">{a.email}</span></li>)}
            </ul>
          </section>
        )}
      </div>

      {/* Modal alta / edición */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form onSubmit={guardar} className="bg-neutral-800 rounded-xl p-6 w-full max-w-xl shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">{editando ? `Editar ${editando.nombre}` : "Nuevo empleado"}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-neutral-400">Nombre</span>
                <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="bg-neutral-700 rounded p-2" autoFocus />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-neutral-400">Email (usuario de ingreso)</span>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="bg-neutral-700 rounded p-2" autoComplete="off" />
              </label>
              {!editando && (
                <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                  <span className="text-neutral-400">Contraseña inicial</span>
                  <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="bg-neutral-700 rounded p-2" placeholder={`Mínimo ${MIN_PASSWORD} caracteres`} autoComplete="new-password" />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-neutral-400">Módulos habilitados</p>
              <SelectorModulos value={form.modulos} onChange={(modulos) => setForm((f) => ({ ...f, modulos }))} />
              <p className="text-[11px] text-neutral-500">
                Estadísticas, KPIs, Históricas y los resúmenes de montos de Ventas y Equipos nunca son visibles para empleados.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalAbierto(false)} className="px-4 py-2 rounded bg-neutral-600 hover:bg-neutral-700">Cancelar</button>
              <button type="submit" disabled={guardando} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 font-semibold disabled:opacity-60">
                {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Crear empleado"}
              </button>
            </div>
            {!editando && (
              <p className="text-[11px] text-neutral-500">Al crear el empleado se muestra el QR para configurar su código TOTP.</p>
            )}
          </form>
        </div>
      )}

      <ModalQR qr={qr} titulo={qrTitulo} onClose={() => setQr(null)} />
    </div>
  );
};

export default EmpleadosPage;
