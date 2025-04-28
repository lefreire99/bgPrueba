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
                                    <Table list={currentItems} headers={headers} renderers={renderers} hasActions={true} TableDropdown={GeneralTableDropdown} hasNumber={true} currentPage={currentPage} itemsPerPage={itemsPerPage}/>
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
            <ThreeDotsVertical data-bs-toggle="dropdown" aria-expanded="false" />
            <ul className="dropdown-menu">
                <li>
                    <button type="button" className="dropdown-item" onClick={() => { handleModal(elem, "E") }}><PencilSquare /> Editar</button>
                </li>
                <li>
                    <button type="button" className="dropdown-item" onClick={() => { handleMovimientos(elem) }}><BoxArrowRight /> Historial de Movimientos</button>
                </li>
                <li>
                    <button type="button" className="dropdown-item" onClick={() => { handleModal(elem, "D") }}>
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
            let final_est = "";
            if (est == "inactivo") {
                final_est = "i";
            } else if (est == "activo") {
                final_est = "a"
            }

            setFilter(listItems.filter(u =>
                u.nombre.toString().toLowerCase().includes(nom) &&
                u.precio.toString().toLowerCase().includes(pre) &&
                u.categoria.toLowerCase().includes(cat) &&
                u.estado.toLowerCase().includes(final_est)
            ))
        }
    }, [nombre, precio, categoria, estado, listItems, hasChanged])

    return (
        <>
            <div className="row">
                <div className="col-md-2">
                    <div className="d-flex">
                        <h5 className="mt-3"><Funnel /> Filtros</h5>
                        <button type="button" className="btn btn-link mt-2" onClick={() => { setShowFilters(!showFilters) }}>
                            {!showFilters ? (<PlusCircle />) : (<DashCircle />)}
                        </button>
                    </div>
                </div>
                <div className="col-md-10">
                    <div className="d-flex justify-content-end mt-2" role="search">
                        <button className="btn btn-primary ms-3" type="button" onClick={() => { handleModal(undefined, "C") }}><PlusCircle /> Crear Producto</button>
                    </div>
                </div>
            </div>
            <div className="border-top mt-3">
                <div className="d-flex mt-3">
                    <div className="w-50">
                        <label htmlFor="searchInput4">Nombre</label>
                        <input className="form-control w-100" id="searchInput4" type="text" onChange={(e) => setNombre(e.target.value)} value={nombre} placeholder='Nombre' />
                    </div>
                </div>
                {showFilters && (
                    <div className="d-flex mt-3">
                        <div className="w-50">
                            <label htmlFor="searchInput1">Categoria</label>
                            <input className="form-control w-100" id="searchInput1" onChange={(e) => setCategoria(e.target.value)} value={categoria} type="text" placeholder='Categoría' />
                        </div>
                        <div className="w-50 ms-2">
                            <label htmlFor="searchInput">Precio</label>
                            <input className="form-control w-100" id="searchInput" onChange={(e) => setPrecio(e.target.value)} value={precio} type="text" placeholder='Precio' />
                        </div>
                        <div className="w-50 ms-2">
                            <label htmlFor="searchInput2">Estado</label>
                            <input className="form-control w-100" id="searchInput2" onChange={(e) => setEstado(e.target.value)} value={estado} type="text" placeholder='Estado' />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Producto;