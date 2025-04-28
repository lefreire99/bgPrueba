import React, { useState, useEffect, useContext } from "react";
import { ThreeDotsVertical, PlusCircle, InfoCircle, PencilSquare, CheckCircle, SlashCircle, FileEarmarkArrowDown, Funnel, DashCircle, XCircle, BoxArrowRight } from 'react-bootstrap-icons';
import Alert from "./Alert";
import Pagination from "./Pagination";
import { ProductoContext } from "./ProductoContext";
import Table from "./Table";
import ProductoService from "../Services/producto.service";
import { notifyError } from "./Notifications";
import { headers, renderers } from "./producto-info";
import CategoriaService from "../Services/categoria.service";
import ProductoModal from "./productos_components/ProductoModal";
import DeleteModal from "./productos_components/DeleteModal";
import { useNavigate } from "react-router";
import { formatStates } from "../utils/functions";

const Producto = (props) => {

    const [listProductos, setListProductos] = useState();
    const [listCategorias, setListCategorias] = useState([]);

    const [hasChanged, setHasChanged] = useState(false);

    const [filter, setFilter] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filter?.slice(indexOfFirstItem, indexOfLastItem)
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const perPage = (amount) => setItemsPerPage(amount);

    const navigate = useNavigate();

    useEffect(() => {
        const getProductos = async () => {
            try {
                const response = await ProductoService.getProductos();
                if (response) {
                    setListProductos(response);
                } else {
                    setListProductos([]);
                }
            } catch (error) {
                setListProductos([]);
                notifyError("No ha sido posible devolver los productos disponibles.");
            }
        }

        const getCategoriasOptions = async () => {
            try {
                const response = await CategoriaService.getCategoriasOptions();
                if (response) {
                    setListCategorias(response);
                } else {
                    setListCategorias([]);
                }
            } catch (error) {
                setListCategorias([]);
                notifyError("No ha sido posible devolver las categorias disponibles.");
            }
        }

        const fetchData = async () => {
            await Promise.all([getProductos(), getCategoriasOptions()]);
        };

        fetchData()
    }, [hasChanged])

    const [showModal, setShowModal] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState();
    const [tipoModal, setTipoModal] = useState();

    const handleModal = (data, tipo) => {
        setSelectedProducto(data);
        setTipoModal(tipo);
        setShowModal(true);
    }

    const handleMovimientos = (data) => {
        const id = data.id;
        navigate('/panel/productos/movimientos/' + id, { state: { id: id } })
    }

    return (
        <div className="container">
            <h4>Administrador de Items</h4>

            <ProductoFilter listItems={listProductos} setFilter={setFilter} hasChanged={hasChanged} handleModal={handleModal} />
            <div className="mt-3">
                {(listProductos) ? (
                    <>
                        {listProductos.length > 0 ? (
                            <>
                                <ProductoContext.Provider value={{ handleModal, handleMovimientos }}>
                                    <Table list={currentItems} headers={headers} renderers={renderers} hasActions={true} TableDropdown={GeneralTableDropdown} hasNumber={true} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                                </ProductoContext.Provider>
                                <Pagination onPageChange={paginate} currentPage={currentPage} totalCount={filter.length} pageSize={itemsPerPage} perPage={perPage} />
                            </>
                        ) : (
                            <Alert tipo={"info"}><InfoCircle /> No hay datos para mostrar</Alert>
                        )}
                    </>
                ) : (
                    <div className="d-flex justify-content-center">
                        <Alert tipo={"light"}>
                            <span className="spinner-border spinner-border-lg text-black" aria-hidden="true"></span>
                        </Alert>
                    </div>
                )}
            </div>
            {(showModal && (tipoModal == "C")) && (
                <ProductoModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    handleChange={() => setHasChanged(!hasChanged)}
                    isEdit={false}
                    modalTitle={"Crear producto"}
                    data={selectedProducto}
                    categorias={listCategorias}
                />
            )}
            {(showModal && (tipoModal == "E")) && (
                <ProductoModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    handleChange={() => setHasChanged(!hasChanged)}
                    isEdit={true}
                    modalTitle={`Editar producto: ${selectedProducto.nombre}`}
                    data={selectedProducto}
                    categorias={listCategorias}
                />
            )}
            {(showModal && (tipoModal == "D")) && (
                <DeleteModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    handleChange={() => setHasChanged(!hasChanged)}
                    modalTitle={`Eliminar producto: ${selectedProducto.nombre}`}
                    data={selectedProducto}
                />
            )}
        </div>
    );
}

const GeneralTableDropdown = (props) => {
    const { elem } = props;
    const { handleModal, handleMovimientos } = useContext(ProductoContext);

    return (
        <div className="dropdown">
            <button
                className="btn btn-link p-0 border-0 text-dark"
                type="button"
                id={`dropdownMenuButton-${elem.id}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <ThreeDotsVertical />
            </button>

            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenuButton-${elem.id}`}>
                <li>
                    <button type="button" className="dropdown-item" onClick={() => handleModal(elem, "E")}>
                        <PencilSquare /> Editar
                    </button>
                </li>
                <li>
                    <button type="button" className="dropdown-item" onClick={() => handleMovimientos(elem)}>
                        <BoxArrowRight /> Historial de Movimientos
                    </button>
                </li>
                <li>
                    <button type="button" className="dropdown-item" onClick={() => handleModal(elem, "D")}>
                        <XCircle /> Eliminar
                    </button>
                </li>
            </ul>
        </div>
    );
};

export const ProductoFilter = (props) => {

    const { listItems, setFilter, hasChanged, handleModal } = props;

    const [showFilters, setShowFilters] = useState(false);

    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [estado, setEstado] = useState("");

    useEffect(() => {
        if (listItems) {
            const nom = nombre.toLowerCase().trim();
            const pre = precio.toLowerCase().trim();
            const cat = categoria.toLowerCase().trim();
            const est = estado.toLowerCase().trim();

            setFilter(listItems.filter(u =>
                u.nombre.toLowerCase().includes(nom) &&
                u.precio.toString().toLowerCase().includes(pre) &&
                u.categoria.toLowerCase().includes(cat) &&
                formatStates(u.estado).estado.toLowerCase().includes(est)
            ))
        }
    }, [nombre, precio, categoria, estado, listItems, hasChanged])

    return (
        <>
            <div className="row align-items-center">
                <div className="col-12 col-md-6 col-lg-2 mb-2 mb-lg-0">
                    <div className="d-flex align-items-center">
                        <h5 className="mb-0"><Funnel /> Filtros</h5>
                        <button type="button" className="btn btn-link p-0 ms-2" onClick={() => setShowFilters(!showFilters)}>
                            {!showFilters ? (<PlusCircle />) : (<DashCircle />)}
                        </button>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-10">
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary" type="button" onClick={() => handleModal(undefined, "C")}>
                            <PlusCircle /> Crear Producto
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-top mt-4 pt-3">
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label htmlFor="searchInput4" className="form-label">Nombre</label>
                        <input className="form-control" id="searchInput4" type="text" onChange={(e) => setNombre(e.target.value)} value={nombre} placeholder="Nombre" />
                    </div>
                </div>

                {showFilters && (
                    <div className="row g-3 mt-1">
                        <div className="col-12 col-md-4">
                            <label htmlFor="searchInput1" className="form-label">Categoría</label>
                            <input className="form-control" id="searchInput1" type="text" onChange={(e) => setCategoria(e.target.value)} value={categoria} placeholder="Categoría" />
                        </div>
                        <div className="col-12 col-md-4">
                            <label htmlFor="searchInput" className="form-label">Precio</label>
                            <input className="form-control" id="searchInput" type="text" onChange={(e) => setPrecio(e.target.value)} value={precio} placeholder="Precio" />
                        </div>
                        <div className="col-12 col-md-4">
                            <label htmlFor="searchInput2" className="form-label">Estado</label>
                            <input className="form-control" id="searchInput2" type="text" onChange={(e) => setEstado(e.target.value)} value={estado} placeholder="Estado" />
                        </div>
                    </div>
                )}
            </div>

        </>
    );
}

export default Producto;