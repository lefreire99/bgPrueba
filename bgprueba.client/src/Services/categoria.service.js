import axios from "axios";
import { instance } from "../common/Interceptor";
import { authHeader } from "./auth.header";

const API_URL = import.meta.env.VITE_API_URL + "/api/Categoria/";

const getCategoriasOptions = async () => {
    try {
        const response = await instance.get(API_URL + "GetCategoriasOptions");
        if (response) {
            return response.data;
        }
    } catch (error) { }
};

const CategoriaService = {
    getCategoriasOptions
}

export default CategoriaService;