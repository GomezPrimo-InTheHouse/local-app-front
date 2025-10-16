// src/components/ui/ChartContainer.jsx

const ChartContainer = ({ title, children, isLoading, height = 'h-80' }) => {
  return (
    <div className="bg-neutral-800 p-6 rounded-xl shadow-lg w-full">
      <h3 className="font-bold text-xl text-neutral-200 mb-4">{title}</h3>
      <div className={`relative ${height} w-full`}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-neutral-400">Cargando datos...</p>
            {/* Aquí podrías poner un spinner animado */}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartContainer;