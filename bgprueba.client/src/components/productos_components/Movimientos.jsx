import React, { useState, useEffect, useContext } from "react";
import { PlusCircle, InfoCircle } from 'react-bootstrap-icons';
import Alert from "../Alert";
import Pagination from "../Pagination";
import Table from "../Table";
import { notifyError } from "../Notifications";
import { headers, renderers } from "./movimiento-info";
import MovimientoService from "../../Services/movimiento.service";
import MovimientoModal from "./MovimientoModal";
import { useParams } from "react-router";

const Movimientos = (props) => {

    const [listMovimientos, setListMovimientos] = useState();
    const [producto, setProducto] = useState();

    const [hasChanged, setHasChanged] = useState(false);

    const [filterText, setFilterText] = useState('');
    const [filter, setFilter] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filter?.slice(indexOfFirstItem, indexOfLastItem)
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const perPage = (amount) => setItemsPerPage(amount);

    const params = useParams();

    useEffect(() => {
        const getMovimientos = async (data) => {
            try {
                const response = await MovimientoService.getMovimientosByProductoId(data);
                if (response) {
                    setListMovimientos(response.objeto.movimientos);
                    setProducto(response.objeto.producto);
                } else {
                    setListMovimientos([]);
                }
            } catch (error) {
                setListMovimientos([]);
                notifyError("No ha sido posible devolver los movimientos disponibles.");
            }
        }

        const id = params.id;
        if (id) {
            getMovimientos(id);
        }
    }, [hasChanged])

    const shouldInclude = e => (
        e.tipo.toLowerCase().includes(filterText.toLowerCase()) ||
        e.cantidad.toLowerCase().includes(filterText.toLowerCase()) ||
        e.fecha.toLowerCase().includes(filterText.toLowerCase())
    )

    useEffect(() => {
        if (listMovimientos) {
            setFilter(listMovimientos.filter(shouldInclude))
        }
    }, [filterText, listMovimientos, hasChanged])

    const [showModal, setShowModal] = useState(false);

    return (
        <div className="container">
            <h4>Historial de movimientos del producto: {producto}</h4>
            <div className="mt-3">
                <div className="d-flex flex-column flex-md-row" role="search">
                    <input className="form-control me-auto w-50" type="text" placeholder='Filtrar'
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)} aria-label="Search" />
                    <button className="btn btn-primary" type="button" onClick={() => { setShowModal(true) }}><PlusCircle /> Registrar Movimiento</button>
                </div>
            </div>
            <div className="mt-3">
                {(listMovimientos) ? (
                    <>
                        {listMovimientos.length > 0 ? (
                            <>
                                <Table list={currentItems} headers={headers} renderers={renderers} hasActions={false} hasNumber={true} currentPage={currentPage} itemsPerPage={itemsPerPage}/>
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
            {(showModal) && (
                <MovimientoModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    handleChange={() => setHasChanged(!hasChanged)}
                    id={params.id}
                    modalTitle={"Registro de movimientos"}
                />
            )}
        </div>
    );
}

export default Movimientos;