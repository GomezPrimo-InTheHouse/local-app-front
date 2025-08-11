import { useEffect, useState } from "react";

const AlertNotification = ({ message, type = "success", duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true); // Mostrar con animación

      const timer = setTimeout(() => {
        setVisible(false); // Comenzar animación de salida
        setTimeout(() => {
          onClose?.(); // Limpiar mensaje después de animación
        }, 300); // tiempo de animación de salida
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-emerald-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-yellow-600";

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 
        rounded-lg text-white shadow-lg max-w-[90%] sm:max-w-md text-center
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
      `}
    >
      <div className={`${bgColor} px-4 py-2 rounded-lg shadow-md`}>
        {message}
      </div>
    </div>
  );
};

export default AlertNotification;
