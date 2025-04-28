import axios from "axios";
import { instance } from "../common/Interceptor";

const API_URL = "http://localhost:5238/api/Categoria/";

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