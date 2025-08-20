import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

const AlertNotification = ({ message, type = "success", duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-800",
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
    },
  };

  const { icon, bg, border, text } = styles[type] || styles.success;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}
      `}
    >
      <div
        className={`${bg} ${border} ${text} border px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 relative`}
      >
        {icon}
        <span className="text-sm font-medium">{message}</span>

        {/* Botón cerrar */}
        {/* <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose?.(), 200);
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-4 h-4" />
        </button> */}
      </div>
    </div>
  );
};

export default AlertNotification;
