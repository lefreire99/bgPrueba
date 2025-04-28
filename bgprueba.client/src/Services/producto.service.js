import axios from "axios";
import { instance } from "../common/Interceptor";

const API_URL = "http://localhost:5238/api/Producto/";

const getProductos = async () => {
    try {
        const response = await instance.get(API_URL + "GetProductos");
        if (response) {
            return response.data;
        }
    } catch (error) { }
};

const createProducto = async (data) => {
    try {
        const response = await instance.post(API_URL + "CreateProducto", data);
        if (response) {
            return response.data;
        }
    } catch (error) { }
};

const updateProducto = async (data) => {
    try {
        const response = await instance.put(API_URL + "UpdateProducto", data);
        if (response) {
            return response.data;
        }
    } catch (error) { }
};

const deleteProducto = async (id) => {
    try {
        const response = await instance.delete(`${API_URL}UpdateProducto/${id}`);
        if (response) {
            return response.data;
        }
    } catch (error) { }
};


const ProductoService = {
    getProductos,
    createProducto,
    updateProducto,
    deleteProducto
}

export default ProductoService;
