
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select';
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { handleChangeCantidad, handleKeyPress, inputStyle, selectStyle } from "../../utils/functions";
import { ErrorMessage } from "../ErrorMessage";
import { notifyError } from "../Notifications";
import MovimientoService from "../../Services/movimiento.service";
import Alert from "../Alert";
import { InfoCircle } from "react-bootstrap-icons";

const movimientos = [
    { value: 1, label: "Registro de entrada", codigo: "E" },
    { value: 2, label: "Registro de salida", codigo: "S" },
    { value: 3, label: "Corrección de entrada", codigo: "I" },
    { value: 4, label: "Corrección de salida", codigo: "O" }
]

const MovimientoModal = (props) => {
    const { show, handleClose, handleChange, modalTitle, id } = props;
    const [loadingGuardar, setLoadingGuardar] = useState(false);
    const [generalError, setGeneralError] = useState();
    const errorsAdd = {
        tipo: "Tipo de movimiento es requerido",
        cantidad: "Cantidad es requerida"
    };

    const { register, handleSubmit, control, reset, getValues, setValue, formState: { errors }, onChange } = useForm({
        defaultValues: {
            tipo: "",
            cantidad: "0",
        }
    });

    const handleCerrar = () => {
        reset();
        handleClose();
    }

    const registerMovimiento = async (data) => {
        try {
            const response = await MovimientoService.registerEntradaSalida(data);
            if (response) {
                return true;
            }
            return false;
        } catch {
            notifyError("No ha sido posible registrar el movimiento de bodega.");
            return false;
        }
    }

    const handleGuardar = async (formValue) => {
        setLoadingGuardar(true);
        const {
            tipo: movimiento,
            cantidad,
        } = formValue;
        const id_producto = id ?? 0;
        const tipo = movimiento.codigo;
        const send_data = {
            id_producto, tipo, cantidad
        }
        if (cantidad != "0") {
            setGeneralError();
            const service = await registerMovimiento(send_data);
            setLoadingGuardar(false)
            if (service) {
                handleChange();
                handleCerrar();
            }
        } else {
            setGeneralError("La cantidad no puede ser 0.")
            setLoadingGuardar(false);
        }
    };

    return (
        <Modal onClose={handleCerrar} size={"lg"} show={show} onHide={handleCerrar} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>

            <form onSubmit={handleSubmit(handleGuardar)} onKeyPress={handleKeyPress}>
                <Modal.Body>
                    <div className="form-group mt-2">
                        <label htmlFor="tipo">Tipo de movimiento</label>
                        <Controller
                            name="tipo"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <Select
                                    {...field}
                                    placeholder="Tipo de movimiento"
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    name="tipo"
                                    id="tipo"
                                    options={movimientos}
                                    styles={selectStyle(errors.tipo)}
                                />
                            }
                        />
                        {errors.tipo && (<ErrorMessage errors={errorsAdd.tipo} />)}
                    </div>

                    <div className="form-group mt-2">
                        <label htmlFor="cantidad_mov">Cantidad</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input id="cantidad_mov" {...register(`cantidad`, { required: true, onChange: (e) => { handleChangeCantidad(e, setValue) } })} name="cantidad" type="text" className="form-control" style={inputStyle(errors.cantidad)} />
                        </div>
                        {errors.cantidad && (<ErrorMessage errors={errorsAdd.cantidad} />)}
                    </div>
                    {generalError && (
                        <div className="mt-3">
                            <Alert tipo={"danger"}><InfoCircle /> {generalError}</Alert>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleCerrar()} disabled={loadingGuardar}>
                        Cerrar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loadingGuardar}>
                        {loadingGuardar && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <span>Aceptar</span>
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default MovimientoModal;
