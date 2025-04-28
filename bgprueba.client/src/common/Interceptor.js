import axios from "axios";
import { toast } from 'react-toastify';
import { notifySuccess, notifyError } from "../components/Notifications";

export const instance = axios.create();

instance.interceptors.response.use(
    request => {
        console.log(request);
        if(request.data.status == "Success"){
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

        if(expectedError){
            notifyError(error.response.data.message)
        }

        if(unexpectedError){
            notifyError(`Un error no esperado sucedió. Código de error:${error.response.status}`)
        }

        if(permission_error){
            notifyError("No existen permisos para realizar la acción.")
        }

        return Promise.reject(error)
    }

    
)
