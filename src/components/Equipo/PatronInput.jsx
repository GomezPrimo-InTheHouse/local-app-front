import React, { useState, useEffect } from "react";

export default function PatronInput({ value, onChange }) {
  const [seleccionados, setSeleccionados] = useState(
    value ? value.split("-").map(Number) : []
  );

  // 🔹 Sincronizar con value cada vez que cambia
  useEffect(() => {
    setSeleccionados(value ? value.split("-").map(Number) : []);
  }, [value]);

  const handleClick = (num) => {
    let nuevos;
    if (seleccionados.includes(num)) {
      // si ya está seleccionado, lo quitamos
      nuevos = seleccionados.filter((x) => x !== num);
    } else {
      // si no está seleccionado, lo agregamos
      nuevos = [...seleccionados, num];
    }
    setSeleccionados(nuevos);
    onChange(nuevos.join("-"));
  };

  const handleReset = () => {
    setSeleccionados([]);
    onChange("");
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <div
            key={num}
            onClick={() => handleClick(num)}
            className={`w-12 h-12 flex items-center justify-center border rounded-full text-white text-lg cursor-pointer transition
              ${seleccionados.includes(num) ? "bg-orange-500" : "bg-gray-700"}`}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="text-sm text-white mt-2">
        Patrón: {seleccionados.join("-") || "ninguno"}
      </div>
      <button
        type="button"
        onClick={handleReset}
        className="mt-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-500"
      >
        Resetear
      </button>
    </div>
  );
}
