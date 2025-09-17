// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import AuthService from "../services/AuthServices.jsx";
import api from "../api/Axios.jsx";
import { parseJwt, isTokenExpired } from "../utils/Jwt";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, rol, userId }
  const [loading, setLoading] = useState(true);

  // Init: leer tokens y tratar de renovar si hace falta
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const email = localStorage.getItem("auth_email");

      if (accessToken) {
        // si no expiró, usarlo
        if (!isTokenExpired(accessToken)) {
          const payload = parseJwt(accessToken);
          setUser({ email: payload.email, rol: payload.rol, userId: payload.userId });
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          setLoading(false);
          return;
        }

        // si expiró y hay refreshToken -> intentar renovar
        if (refreshToken && email) {
          try {
            const resp = await AuthService.refreshAccessToken(email);
            localStorage.setItem("accessToken", resp.accessToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${resp.accessToken}`;
            const payload = parseJwt(resp.accessToken);
            setUser({ email: payload.email, rol: payload.rol, userId: payload.userId });
            setLoading(false);
            return;
          } catch (err) {
            // no se pudo renovar -> limpiar
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("auth_email");
          }
        }
      }

      setUser(null);
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (payload) => {
    // Devuelve la respuesta del backend (por ejemplo QR/secret)
    const data = await AuthService.register(payload);
    return data;
  };

  const login = async ({ email, password, totp }) => {
    const data = await AuthService.login({ email, password, totp });
    const { accessToken, refreshToken } = data;
    // guardo tokens y user
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("auth_email", email);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const payload = parseJwt(accessToken);
    setUser({ email: payload.email, rol: payload.rol, userId: payload.userId });
    return data;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
