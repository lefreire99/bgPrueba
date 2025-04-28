import axios from "axios";
import { instance } from "../common/Interceptor";
import { authHeader } from "./auth.header";

const API_URL = import.meta.env.VITE_API_URL + "/api/ProductoMovimiento/";

const getMovimientosByProductoId = async (id) => {
    try {
        const response = await instance.get(`${API_URL}GetMovimientosByProductoId/${id}`);
        if (response) {
            return response.data;
        }
    } catch (error) { }
};

const registerEntradaSalida = async (data) => {
    try {
        const response = await instance.post(API_URL + "RegisterEntradaSalida", data);
        if (response) {
            return response.data;
        }
    } catch (error) { }
};

const MovimientoService = {
    getMovimientosByProductoId,
    registerEntradaSalida
}

export default MovimientoService;