// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "user",
    estado_id: 1,
  });
  const [error, setError] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [secret, setSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setQrData(null);
    setSecret(null);
    setLoading(true);
    try {
      const resp = await register(form);
      // backend puede devolver qr (ej: data:image/png;base64,...) o secret
      if (resp.qr) setQrData(resp.qr);
      if (resp.qrDataUrl) setQrData(resp.qrDataUrl);
      if (resp.secret) setSecret(resp.secret);

      // Mostrar QR y sugerir al usuario escanear con Google Authenticator
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error en el registro.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Registro</h2>
        <p className="text-sm text-slate-500 mb-6">Al registrarte se generará un QR para configurar Google Authenticator.</p>

        {error && <div className="bg-rose-100 text-rose-700 p-3 rounded mb-4">{error}</div>}

        {!qrData && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600">Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full mt-1 p-2 border rounded bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full mt-1 p-2 border rounded bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full mt-1 p-2 border rounded bg-slate-50" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm text-slate-600">Rol</label>
                <select name="rol" value={form.rol} onChange={handleChange} className="mt-1 p-2 border rounded bg-slate-50">
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-600">Estado</label>
                <select name="estado_id" value={form.estado_id} onChange={handleChange} className="mt-1 p-2 border rounded bg-slate-50">
                  <option value={1}>Activo</option>
                  <option value={2}>Inactivo</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-2 rounded bg-emerald-300 hover:bg-emerald-400 text-slate-900 font-semibold" disabled={loading}>
              {loading ? "Registrando..." : "Registrarme"}
            </button>
          </form>
        )}

        {/* Si el backend devolvió QR/secret lo mostramos */}
        {qrData && (
          <div className="mt-6 text-center">
            <h3 className="font-medium text-slate-700 mb-3">Escaneá este QR con Google Authenticator</h3>
            <div className="inline-block bg-slate-50 p-4 rounded">
              <img src={qrData} alt="QR TOTP" className="w-48 h-48 object-contain" />
            </div>
            {secret && <p className="text-sm text-slate-500 mt-3">Clave secreta: <span className="font-mono">{secret}</span></p>}
            <p className="text-sm text-slate-500 mt-4">Una vez configurado, podés usar el código TOTP en la pantalla de login.</p>

            <div className="mt-6 flex justify-between">
              <button className="py-2 px-4 rounded bg-emerald-300 hover:bg-emerald-400 text-slate-900" onClick={() => navigate("/login")}>Ir a Login</button>
              <button className="py-2 px-4 rounded border text-slate-700" onClick={() => { setQrData(null); setSecret(null); }}>Volver</button>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-slate-500">
          ¿Ya tenés cuenta? <Link to="/login" className="text-emerald-600 underline">Ingresá</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
