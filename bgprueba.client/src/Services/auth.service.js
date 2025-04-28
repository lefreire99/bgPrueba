import axios from "axios";
import { instance } from "../common/Interceptor";

const API_URL = "http://localhost:5238/api/Auth/";

const login = async (email, password) => {
    try {
        const response = await instance.post(API_URL + "Login", { email, password });
        if (response) {
            sessionStorage.setItem("usuario", JSON.stringify(response.data));
            return response;
        }
    } catch (error) { }
};

const logout = async () => {
    sessionStorage.removeItem("usuario");
    try {
        const response = await instance.post(API_URL + "logout");
        if (response) {
            return response;
        }
    } catch (error) { }
};

const getCurrentUser = () => {
    return JSON.parse(sessionStorage.getItem("usuario"));
};

const AuthService = {
    login,
    logout,
    getCurrentUser
}

export default AuthService;