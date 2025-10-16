// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import './index.css'; // o './main.css' según como lo llames
// 💡 1. Importa las herramientas necesarias de React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Opcional pero recomendado
// 💡 2. Crea una instancia del cliente
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <AuthProvider>
      <QueryClientProvider client={queryClient}>

      <App />
    

         <ReactQueryDevtools initialIsOpen={false} /> {/* Herramientas de desarrollo */}
      </QueryClientProvider>
   </AuthProvider>
  </React.StrictMode>
);


