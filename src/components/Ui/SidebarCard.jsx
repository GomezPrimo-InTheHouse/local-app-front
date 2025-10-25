// src/components/ui/SidebarCard.jsx (Nuevo componente de UI)
const SidebarCard = ({ children, className = "" }) => (
  <div
    className={`
      rounded-2xl border border-white/10 bg-neutral-800/70 p-4 sm:p-5 shadow-sm
      ${className}
    `}
  >
    {children}
  </div>
);
export default SidebarCard;