// src/pages/ProductosPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getProductos,
    createProducto,
    updateProducto,
    deleteProducto,
} from "../api/ProductoApi";
import ProductoModal from "../components/Producto/ProductoModal.jsx";
import BuscarProducto from "../components/Producto/BuscarProducto.jsx";
/**
 * Página Productos - layout 30% / 70%
 */
const ProductoPage = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    // simple toast local
    const [toast, setToast] = useState({ message: "", type: "success" });

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const data = await getProductos();
            // si tu API devuelve { data: [...] } o similar, adapta aquí
            setProductos(Array.isArray(data) ? data : data?.data ?? []);
        } catch (error) {
            console.error("Error cargando productos:", error);
            setToast({ message: "Error cargando productos", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const abrirModalCrear = () => {
        setProductoSeleccionado(null);
        setIsModalOpen(true);
    };

    const abrirModalEditar = (p) => {
        setProductoSeleccionado(p);
        setIsModalOpen(true);
    };

    const handleGuardarProducto = async (payload) => {
        try {
            if (productoSeleccionado) {
                await updateProducto(productoSeleccionado.id, payload);
                setToast({ message: "Producto actualizado correctamente", type: "success" });
            } else {
                await createProducto(payload);
                setToast({ message: "Producto creado correctamente", type: "success" });
            }
            await fetchProductos();
        } catch (err) {
            console.error("Error guardando producto:", err);
            setToast({ message: "Error al guardar producto", type: "error" });
        } finally {
            // limpiar selección
            setProductoSeleccionado(null);
            setIsModalOpen(false);
            setTimeout(() => setToast({ message: "", type: "success" }), 2500);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await deleteProducto(id);
            setToast({ message: "Producto eliminado", type: "success" });
            await fetchProductos();
            setTimeout(() => setToast({ message: "", type: "success" }), 2000);
        } catch (err) {
            console.error("Error eliminando producto:", err);
            setToast({ message: "No se pudo eliminar el producto", type: "error" });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-screen bg-neutral-900 text-white overflow-hidden">
            {/* Columna izquierda fija (30%) - en mobile pasa a top header */}
            <aside className="w-full 
                lg:w-1/4            /* 25% para pantallas grandes */
                xl:w-1/5            /* opcional: 20% en pantallas extra grandes */
                bg-neutral-800 
                p-4 sm:p-6           /* padding responsive */
                flex flex-col 
                justify-start 
                shadow-xl 
                z-10
                lg:flex             /* oculto en pantallas < lg */
                hidden">



                <button
                    onClick={() => navigate("/")}
                    className="px-4 mb-6 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition text-sm"
                >
                    ⬅️ Volver al Dashboard
                </button>

                <button
                    onClick={abrirModalCrear}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md font-semibold"
                >
                    + Agregar Producto
                </button>


                <div className="mt-auto text-sm text-gray-400">
                    <p className="font-medium">Información</p>
                    <p className="text-xs">Aquí puedes crear, editar o eliminar productos.</p>
                </div>
            </aside>
            <header className="lg:hidden w-full bg-neutral-800 p-4 flex justify-between items-center shadow">
                <button
                    onClick={() => navigate("/")}
                    className="px-3 py-2  bg-neutral-700 hover:bg-neutral-600 rounded-lg transition text-sm"
                >
                    ⬅️ Volver al Dashboard
                </button>
                <button
                    onClick={abrirModalCrear}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm"
                >
                    + Agregar Producto
                </button>
            </header>


            {/* Contenido principal (70%) */}
            {/* <main className="w-full md:w-[70%] p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Listado de Productos</h3>
                </div>

                {toast.message && (
                    <div
                        className={`mb-4 px-4 py-2 rounded ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
                            } text-white`}
                    >
                        {toast.message}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-400">Cargando productos...</p>
                ) : productos.length === 0 ? (
                    <p className="text-gray-400">Aún no hay productos cargados.</p>
                ) : (
                    <ul className="space-y-4">
                        {productos.map((p) => (
                            <li
                                key={p.id}
                                className="bg-neutral-800 p-4 rounded shadow flex flex-col md:flex-row  md:items-center gap-3 
                                justify-between items-start sm:items-center  transition-all duration-300 hover:bg-gray-600 hover:shadow-2xl"
                            >
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-xl text-white tracking-wide">{p.nombre} <small> - {p.categoria}</small></p>
                                        <span className="text-xs font-semibold uppercase text-indigo-400 bg-gray-700 px-2 py-1 rounded-full">
                                            {p.estado}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 text-gray-400 text-sm">
                                        <p className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10m0 0h16m-4-8h-4m4 0h-4" />
                                            </svg>
                                            <span className="font-mono font-medium text-teal-400">
                                                {p.stock ?? 0}
                                            </span>
                                            Stock
                                        </p>
                                        <p className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8a6 6 0 00-6 6v2a6 6 0 006 6m0-8a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                            <span className="font-mono font-medium text-fuchsia-400">
                                                $
                                                {(p.precio ?? 0).toLocaleString("es-AR", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </span>
                                            Precio
                                        </p>
                                    </div>

                                    {p.descripcion && (
                                        <p className="text-gray-500 text-sm leading-relaxed mt-1">
                                            {p.descripcion}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-row md:flex-col gap-3 self-end sm:self-center">
                                    <button
                                        onClick={() => abrirModalEditar(p)}
                                        className="px-3 py-1.5 rounded-lg font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(p.id)}
                                        className="px-3 py-1.5 rounded-lg font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main> */}

            <main className="w-full md:w-[70%] p-4 sm:p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Listado de Productos</h3>
                </div>

                <BuscarProducto onResultados={(res) => {
                    if (!res) {
                        fetchProductos(); // si null → recargar todos
                    } else {
                        setProductos(res); // si array → setear resultados filtrados
                    }
                }} />


                {toast.message && (
                    <div
                        className={`mb-4 px-4 py-2 rounded ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
                            } text-white shadow-md`}
                    >
                        {toast.message}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-400">Cargando productos...</p>
                ) : productos.length === 0 ? (
                    <p className="text-gray-400">Aún no hay productos cargados.</p>
                ) : (
                    <ul className="space-y-5">
                        {productos.map((p) => (
                            <li
                                key={p.id}
                                className="bg-neutral-800 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center p-5 gap-4 hover:bg-gray-700 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Contenido principal */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 justify-between">
                                        <p className="font-bold text-lg sm:text-xl text-white tracking-wide">
                                            {p.nombre} <small className="text-gray-400">- {p.categoria}</small>
                                        </p>
                                        <span className="text-xs font-semibold uppercase text-indigo-400 bg-gray-700 px-2 py-1 rounded-full mt-2 sm:mt-0">
                                            {p.estado}
                                        </span>
                                    </div>

                                    {/* Stock y precio */}
                                    <div className="flex flex-col sm:flex-row sm:gap-6 mt-2 text-gray-400 text-sm">
                                        <p className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10m0 0h16m-4-8h-4m4 0h-4" />
                                            </svg>
                                            <span className="font-mono font-medium text-teal-400">{p.stock ?? 0}</span> Stock
                                        </p>
                                        <p className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8a6 6 0 00-6 6v2a6 6 0 006 6m0-8a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                            <span className="font-mono font-medium text-fuchsia-400">
                                                ${(p.precio ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span> Precio
                                        </p>
                                    </div>

                                    {/* Descripción */}
                                    {p.descripcion && (
                                        <p className="text-gray-500 text-sm leading-relaxed mt-2 line-clamp-3">
                                            {p.descripcion}
                                        </p>
                                    )}
                                </div>

                                {/* Botones */}
                                <div className="flex flex-row md:flex-col gap-2 md:gap-3 self-end sm:self-center mt-3 md:mt-0">
                                    <button
                                        onClick={() => abrirModalEditar(p)}
                                        className="px-4 py-2 rounded-lg font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow"
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(p.id)}
                                        className="px-4 py-2 rounded-lg font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>


            {/* Modal */}
            <ProductoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                producto={productoSeleccionado} // null para crear
                onSave={async (payload) => {
                    if (productoSeleccionado) {
                        await updateProducto(productoSeleccionado.id, payload);
                    } else {
                        await createProducto(payload);
                    }
                    await fetchProductos(); // recargar lista
                }}
            />

        </div>
    );
};

export default ProductoPage;
