
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ProductoService from "../../Services/producto.service";
import { notifyError } from "../Notifications";

const DeleteModal = (props) => {
    const { show, handleClose, handleChange, modalTitle, data } = props;
    const [loadingGuardar, setLoadingGuardar] = useState(false);

    const handleCerrar = () => {
        handleClose();
    }

    const deleteProducto = async (data) => {
        try {
            const response = await ProductoService.deleteProducto(data);
            if (response) {
                return true;
            }
            return false;
        } catch {
            notifyError("No ha sido posible eliminar el producto.");
            return false;
        }
    }

    const handleDelete = async () => {
        setLoadingGuardar(true);
        const service = await deleteProducto(data.id);
        setLoadingGuardar(false)
        if (service) {
            handleChange();
            handleCerrar();
        }
    };

    return (
        <Modal onClose={handleCerrar} size={"lg"} show={show} onHide={handleCerrar} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center">
                    <p>Al dar click en Aceptar se eliminara el siguiente producto: {data.nombre ?? "No se ha seleccionado producto"}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handleCerrar()} disabled={loadingGuardar}>
                    Cerrar
                </Button>
                <Button variant="primary" type="button" disabled={loadingGuardar} onClick={handleDelete}>
                    {loadingGuardar && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Aceptar</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
