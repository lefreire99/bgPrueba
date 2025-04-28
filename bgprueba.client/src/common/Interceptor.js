import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { notifySuccess, notifyError } from "../components/Notifications";
import AuthService from "../Services/auth.service";

const API_URL = import.meta.env.VITE_API_URL;

export const instance = axios.create();

instance.interceptors.request.use(
    async (config) => {
        if (config.url === `${API_URL}/api/Auth/Login`) {
            return config;
        }

        try {
            const usuario = JSON.parse(sessionStorage.getItem('usuario'));
            const token = usuario.token;
            if (token) {
                const decodedToken = jwtDecode(token);
                const isExpired = dayjs.unix(decodedToken.exp).isBefore(dayjs());

                if (isExpired) {
                    notifyError('Token expirada.');
                    // Option 1: Redirect to login
                    //window.location.href = '/login';
                    AuthService.logout();

                    throw new axios.Cancel('Token expired'); // cancel the request
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

            return config;
        } catch (error) {
            notifyError("No es posible validar la Token");
            return Promise.reject(error)
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    request => {
        if (request.data.status == "Success") {
            notifySuccess(request.data.message);
        }
        return request
    },
    error => {
        const unexpectedError = error.response && error.response.status >= 400 &&
            error.response.status != 403 && error.response.status < 500

        const expectedError =
            error.response &&
            error.response.status == 500;

        const permission_error = error.response && error.response.status == 403

        if (expectedError) {
            notifyError(error.response.data.message)
        }

        if (unexpectedError) {
            notifyError(`Un error no esperado sucedió. Código de error:${error.response.status}`)
        }

        if (permission_error) {
            notifyError("No existen permisos para realizar la acción.")
        }

        return Promise.reject(error)
    }


)
