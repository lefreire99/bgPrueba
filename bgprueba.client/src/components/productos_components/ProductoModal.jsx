
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select';
import * as Yup from "yup";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { capitalize, handleChangeCantidad, handleChangePrecio, handleKeyPress, inputStyle, selectStyle } from "../../utils/functions";
import { ErrorMessage } from "../ErrorMessage";
import ProductoService from "../../Services/producto.service";
import { notifyError } from "../Notifications";

const ProductoModal = (props) => {
    const { show, handleClose, handleChange, modalTitle, data, isEdit, categorias } = props;
    const [loadingGuardar, setLoadingGuardar] = useState(false);
    const errorsAdd = {
        nombre: "Nombre es requerido",
        precio: "Precio es requerido",
        cantidad: "Cantidad es requerida",
        categoria: "Categoria es requerida"
    };
    const [generalError, setGeneralError] = useState();

    const { register, handleSubmit, control, reset, getValues, setValue, formState: { errors }, onChange } = useForm({
        defaultValues: {
            nombre: data ? data.nombre : "",
            descripcion: data ? data.descripcion : "",
            precio: data ? data.precio : "",
            cantidad: data ? data.stock : "0",
            categoria: data ? (data.id_categoria ? { value: data.id_categoria, label: data.categoria } : "") : ""
        },
    });

    const handleCerrar = () => {
        reset();
        handleClose();
    }

    const createProducto = async (data) => {
        try {
            const response = await ProductoService.createProducto(data);
            if (response) {
                return true;
            }
            return false;
        } catch {
            notifyError("No ha sido posible crear el producto.");
            return false;
        }
    }

    const updateProducto = async (data) => {
        try {
            const response = await ProductoService.updateProducto(data);
            if (response) {
                return true;
            }
            return false;
        } catch {
            notifyError("No ha sido posible actualizar el producto.");
            return false;
        }
    }

    const handleUpdateRegister = async (formValue) => {
        setLoadingGuardar(true);
        const {
            nombre: nombre_format,
            descripcion,
            precio,
            cantidad: stock,
            categoria
        } = formValue;
        const nombre = nombre_format.split(" ").map((e) => capitalize(e)).join(" ");
        const id = data ? data.id : 0;
        const id_categoria = categoria.value;
        const send_data = {
            id, nombre, descripcion, precio, stock, id_categoria
        }
        let service = false;
        if (!isEdit) {
            service = await createProducto(send_data);
            setLoadingGuardar(false)
            if (service) {
                handleChange();
                handleCerrar();
            }
        } else {
            service = await updateProducto(send_data);
            setLoadingGuardar(false)
            if (service) {
                handleChange();
            }
        }
    };

    return (
        <Modal onClose={handleCerrar} size={"lg"} show={show} onHide={handleCerrar} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>

            <form onSubmit={handleSubmit(handleUpdateRegister)} onKeyPress={handleKeyPress}>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input id="nombre" {...register(`nombre`, { required: true })} type="text" className="form-control" style={inputStyle(errors.nombre)} maxLength={50} />
                        {errors.nombre && (<ErrorMessage errors={errorsAdd.nombre} />)}
                    </div>

                    <div className="form-group mt-2">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea id="descripcion" {...register(`descripcion`)} type="text" className="form-control" maxLength={50}></textarea>
                    </div>

                    <div className="form-group mt-2">
                        <label htmlFor="precio">Precio</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input {...register(`precio`, { required: true, onChange: (e) => { handleChangePrecio(e, setValue) } })} name="precio" type="text" className="form-control" style={inputStyle(errors.precio)} />
                        </div>
                        {errors.precio && (<ErrorMessage errors={errorsAdd.precio} />)}
                    </div>

                    <div className="form-group mt-2">
                        <label htmlFor="cantidad">Cantidad</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input {...register(`cantidad`, { required: true, onChange: (e) => { handleChangeCantidad(e, setValue) } })} name="cantidad" type="text" className="form-control" style={inputStyle(errors.cantidad)} />
                        </div>
                        {errors.cantidad && (<ErrorMessage errors={errorsAdd.cantidad} />)}
                    </div>

                    <div className="form-group mt-2">
                        <label htmlFor="categoria">Categoría</label>
                        <Controller
                            name="categoria"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                <Select
                                    {...field}
                                    placeholder="Categoría"
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    name="categoria"
                                    id="categoria"
                                    isDisabled={isEdit}
                                    options={categorias}
                                    styles={selectStyle(errors.categoria)}
                                />
                            }
                        />
                        {errors.categoria && (<ErrorMessage errors={errorsAdd.categoria} />)}
                    </div>
                    {generalError && (
                        <div className="mt-3">
                            <Alert tipo={"danger"}><ExclamationCircle /> {generalError}</Alert>
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

export default ProductoModal;
